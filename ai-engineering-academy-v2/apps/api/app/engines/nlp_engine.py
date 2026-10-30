import re
import math
from typing import Any, Dict, List
import numpy as np

def simulate_bpe_tokenize(text: str, num_merges: int = 5) -> Dict[str, Any]:
    """Demonstrate Byte-Pair Encoding (BPE) subword merging algorithm."""
    words = text.strip().split()
    # Initial split into characters with end-of-word marker </w>
    vocab = [" ".join(list(w)) + " </w>" for w in words]

    merge_history = []

    for _ in range(num_merges):
        # Count frequency of adjacent pairs
        pairs: Dict[str, int] = {}
        for item in vocab:
            symbols = item.split()
            for i in range(len(symbols) - 1):
                pair = f"{symbols[i]} {symbols[i+1]}"
                pairs[pair] = pairs.get(pair, 0) + 1

        if not pairs:
            break

        best_pair = max(pairs, key=pairs.get)
        count = pairs[best_pair]
        if count <= 1:
            break

        merge_history.append({"pair": best_pair, "occurrences": count})

        # Apply merge
        replacement = best_pair.replace(" ", "")
        pattern = re.escape(best_pair)
        vocab = [re.sub(r"(?<!\S)" + pattern + r"(?!\S)", replacement, item) for item in vocab]

    tokens = [tok for item in vocab for tok in item.split()]

    return {
        "original_text": text,
        "token_count": len(tokens),
        "tokens": tokens,
        "compression_ratio": round(len(text) / max(1, len(tokens)), 2),
        "bpe_merges": merge_history
    }

def compute_sentence_embeddings_and_similarity(sentences: List[str]) -> Dict[str, Any]:
    """Compute dense word-frequency embeddings and semantic cosine similarity matrix."""
    # Build vocabulary
    words_per_sent = [re.findall(r"\b\w+\b", s.lower()) for s in sentences]
    vocab = sorted(list(set(w for words in words_per_sent for w in words)))
    vocab_index = {w: i for i, w in enumerate(vocab)}

    # Vectorize with TF-IDF weighting
    N = len(sentences)
    df_counts = {w: sum(1 for words in words_per_sent if w in words) for w in vocab}
    idf = {w: math.log((N + 1) / (df_counts[w] + 1)) + 1 for w in vocab}

    vectors = []
    for words in words_per_sent:
        vec = np.zeros(len(vocab))
        for w in words:
            vec[vocab_index[w]] += 1
        # Multiply by IDF
        for w in set(words):
            vec[vocab_index[w]] *= idf[w]
        # L2 normalize
        norm = np.linalg.norm(vec)
        if norm > 1e-9:
            vec = vec / norm
        vectors.append(vec)

    # Cosine similarity matrix
    sim_matrix = []
    for i in range(N):
        row = []
        for j in range(N):
            sim = float(np.dot(vectors[i], vectors[j]))
            row.append(round(sim, 4))
        sim_matrix.append(row)

    return {
        "vocabulary_size": len(vocab),
        "sentences": sentences,
        "similarity_matrix": sim_matrix
    }

def extract_named_entities(text: str) -> List[Dict[str, Any]]:
    """Rule-based named entity recognition (NER) for email, dates, organizations, and monetary amounts."""
    entities = []

    # Emails
    for match in re.finditer(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text):
        entities.append({"text": match.group(0), "label": "EMAIL", "start": match.start(), "end": match.end()})

    # Dates (YYYY-MM-DD or DD.MM.YYYY)
    for match in re.finditer(r"\b\d{4}-\d{2}-\d{2}\b|\b\d{2}\.\d{2}\.\d{4}\b", text):
        entities.append({"text": match.group(0), "label": "DATE", "start": match.start(), "end": match.end()})

    # Currency
    for match in re.finditer(r"\$\d+(?:\.\d+)?|\b\d+\s?(?:EUR|USD|UAH|грн)\b", text):
        entities.append({"text": match.group(0), "label": "MONEY", "start": match.start(), "end": match.end()})

    # Capitalized Organization/Person candidates (2+ capitalized words)
    for match in re.finditer(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b", text):
        entities.append({"text": match.group(0), "label": "PROPER_NOUN", "start": match.start(), "end": match.end()})

    return entities
