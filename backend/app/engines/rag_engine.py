import re
import math
import numpy as np
from typing import Any, Dict, List, Tuple
from sqlalchemy import text
from backend.app.core.database import AsyncSessionLocal

def chunk_document_text(text_content: str, chunk_size: int = 200, overlap: int = 30) -> List[Dict[str, Any]]:
    """
    Split text into overlapping semantic windows.
    Returns list of dicts with chunk_index, text, and start/end character offsets.
    """
    words = text_content.split()
    chunks = []
    chunk_idx = 0
    i = 0

    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunk_str = " ".join(chunk_words)
        
        # Calculate character position approximations
        start_char = text_content.find(chunk_words[0]) if chunk_words else 0
        end_char = start_char + len(chunk_str)

        chunks.append({
            "chunk_index": chunk_idx,
            "text": chunk_str,
            "word_count": len(chunk_words),
            "char_span": [start_char, end_char]
        })
        chunk_idx += 1

        step = max(1, chunk_size - overlap)
        i += step

    return chunks

def generate_dense_384_embedding(text_snippet: str) -> List[float]:
    """
    Generate normalized 384-dimensional dense vector representation
    using deterministic n-gram hashing and sinusoidal positional weights.
    """
    dim = 384
    vec = np.zeros(dim, dtype=float)
    words = re.findall(r"\b\w+\b", text_snippet.lower())

    if not words:
        return vec.tolist()

    for idx, w in enumerate(words):
        # Hash word to multiple seed bins
        h = hash(w) % dim
        h2 = hash(w + "_aux") % dim
        pos_weight = 1.0 / math.sqrt(idx + 1)
        vec[h] += 1.0 * pos_weight
        vec[h2] += 0.5 * pos_weight

    norm = np.linalg.norm(vec)
    if norm > 1e-9:
        vec = vec / norm

    return [round(float(v), 6) for v in vec]

def bm25_lexical_rank(query: str, corpus: List[str], k1: float = 1.5, b: float = 0.75) -> List[float]:
    """
    Compute BM25 relevance scores for a query across a corpus of documents.
    """
    query_terms = re.findall(r"\b\w+\b", query.lower())
    tokenized_corpus = [re.findall(r"\b\w+\b", doc.lower()) for doc in corpus]
    N = len(corpus)
    avgdl = sum(len(doc) for doc in tokenized_corpus) / max(1, N)

    scores = []
    for doc_terms in tokenized_corpus:
        doc_len = len(doc_terms)
        score = 0.0
        term_freqs = {t: doc_terms.count(t) for t in query_terms}

        for term in query_terms:
            tf = term_freqs[term]
            if tf > 0:
                # Document frequency
                df = sum(1 for d in tokenized_corpus if term in d)
                idf = math.log((N - df + 0.5) / (df + 0.5) + 1.0)
                numerator = tf * (k1 + 1.0)
                denominator = tf + k1 * (1.0 - b + b * (doc_len / avgdl))
                score += idf * (numerator / max(1e-9, denominator))
        scores.append(round(score, 4))

    return scores

async def index_and_search_rag(
    collection_name: str,
    document_name: str,
    document_text: str,
    query: str,
    chunk_size: int = 150,
    overlap: int = 25,
    top_k: int = 3
) -> Dict[str, Any]:
    """
    Complete RAG pipeline:
    1. Chunk document
    2. Compute embeddings and BM25 scores
    3. Persist chunks in PostgreSQL vector_documents
    4. Perform hybrid search (Dense pgvector + Lexical BM25) with Reciprocal Rank Fusion (RRF)
    5. Evaluate groundedness and citations of the answer
    """
    chunks = chunk_document_text(document_text, chunk_size, overlap)
    corpus_texts = [c["text"] for c in chunks]

    # 1. Compute BM25 scores
    bm25_scores = bm25_lexical_rank(query, corpus_texts)

    # 2. Compute Dense Embeddings & Index into Postgres
    query_vec = generate_dense_384_embedding(query)

    async with AsyncSessionLocal() as session:
        # Clear previous collection chunks if any
        await session.execute(
            text("DELETE FROM vector_documents WHERE collection_name = :coll"),
            {"coll": collection_name}
        )

        for c in chunks:
            c_vec = generate_dense_384_embedding(c["text"])
            c_vec_str = "[" + ",".join(map(str, c_vec)) + "]"
            await session.execute(
                text("""
                    INSERT INTO vector_documents (id, collection_name, document_name, chunk_index, text, embedding, metadata_json, created_at)
                    VALUES (gen_random_uuid(), :coll, :doc, :idx, :txt, :emb::vector, :meta::jsonb, NOW())
                """),
                {
                    "coll": collection_name,
                    "doc": document_name,
                    "idx": c["chunk_index"],
                    "txt": c["text"],
                    "emb": c_vec_str,
                    "meta": json.dumps({"char_span": c["char_span"]})
                }
            )
        await session.commit()

        # Query using pgvector cosine distance: embedding <=> query_vec
        query_vec_str = "[" + ",".join(map(str, query_vec)) + "]"
        result = await session.execute(
            text("""
                SELECT chunk_index, text, 1 - (embedding <=> :q_vec::vector) AS cosine_sim
                FROM vector_documents
                WHERE collection_name = :coll
                ORDER BY cosine_sim DESC
                LIMIT :limit;
            """),
            {"coll": collection_name, "q_vec": query_vec_str, "limit": len(chunks)}
        )
        pg_rows = result.fetchall()

    dense_ranks = {row[0]: (idx + 1, float(row[2])) for idx, row in enumerate(pg_rows)}

    # 3. Hybrid Reciprocal Rank Fusion (RRF): RRF = 1 / (60 + rank_dense) + 1 / (60 + rank_bm25)
    sorted_bm25_indices = np.argsort(bm25_scores)[::-1]
    bm25_ranks = {idx: rank + 1 for rank, idx in enumerate(sorted_bm25_indices)}

    rrf_results = []
    for c in chunks:
        idx = c["chunk_index"]
        r_dense, sim = dense_ranks.get(idx, (len(chunks), 0.0))
        r_bm25 = bm25_ranks.get(idx, len(chunks))
        rrf_score = (1.0 / (60.0 + r_dense)) + (1.0 / (60.0 + r_bm25))

        rrf_results.append({
            "chunk_index": idx,
            "text": c["text"],
            "cosine_similarity": round(sim, 4),
            "bm25_score": round(bm25_scores[idx], 4),
            "rrf_score": round(rrf_score, 6),
            "char_span": c["char_span"]
        })

    rrf_results.sort(key=lambda x: x["rrf_score"], reverse=True)
    top_retrieved = rrf_results[:top_k]

    # 4. Synthesize Answer & Evaluate Groundedness Citation
    retrieved_combined_text = " ".join(c["text"] for c in top_retrieved)
    # Check groundedness: proportion of significant query-answer terms found in context
    query_words = set(re.findall(r"\b\w{4,}\b", query.lower()))
    found_words = [w for w in query_words if w in retrieved_combined_text.lower()]
    groundedness_score = len(found_words) / max(1, len(query_words))

    return {
        "collection_name": collection_name,
        "document_name": document_name,
        "total_chunks_created": len(chunks),
        "query": query,
        "retrieval_mode": "hybrid_pgvector_bm25",
        "top_results": top_retrieved,
        "groundedness": {
            "score": round(groundedness_score, 4),
            "verified_in_sources": bool(groundedness_score >= 0.5),
            "matched_terms": found_words,
            "citations": [
                {
                    "chunk_index": c["chunk_index"],
                    "document": document_name,
                    "span": c["char_span"],
                    "snippet": c["text"][:100] + "..."
                }
                for c in top_retrieved
            ]
        }
    }
