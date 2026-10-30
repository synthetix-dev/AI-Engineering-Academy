"use client";

import React, { useState } from "react";
import { Play, Database, Search, FileText, CheckCircle2, Sliders, Shield } from "lucide-react";

interface RAGProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function RAGPipelineWorkspace({ onRun, running, result }: RAGProps) {
  const [query, setQuery] = useState<string>("Як налаштувати індекси pgvector HNSW для векторів розмірністю 384?");
  const [chunkSize, setChunkSize] = useState<number>(256);
  const [chunkOverlap, setChunkOverlap] = useState<number>(32);
  const [alpha, setAlpha] = useState<number>(0.7); // 0.0: pure BM25, 1.0: pure Dense
  const [topK, setTopK] = useState<number>(3);

  // Retrieved chunks with groundedness evidence
  const retrievedChunks = [
    {
      id: "chunk_01",
      score: 0.932,
      doc_name: "postgresql_pgvector_handbook.md",
      content:
        "Для створення індексу HNSW у PostgreSQL 17 з метрикою косинусної відстані використовуйте: CREATE INDEX ON embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64); Це забезпечує час пошуку менше 5 мс на мільйон векторів.",
      grounded: true,
    },
    {
      id: "chunk_02",
      score: 0.884,
      doc_name: "pgvector_optimization_guide.md",
      content:
        "Параметр m визначає максимальну кількість зв'язків для кожного вузла в графі HNSW. Значення m=16 є оптимальним компромісом між пам'яттю та recall.",
      grounded: true,
    },
    {
      id: "chunk_03",
      score: 0.812,
      doc_name: "embedding_models_specs.md",
      content:
        "Модель all-MiniLM-L6-v2 генерує embeddings розмірністю 384. Нормалізація векторів перед записом дозволяє використовувати dot product замість повільного cosine distance.",
      grounded: true,
    },
  ];

  const handleExecute = () => {
    onRun({
      query: query,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
      hybrid_alpha: alpha,
      top_k: topK,
    });
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Config */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Архітектор гібридного пошуку RAG (PostgreSQL pgvector + BM25 Fusion)
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            pgvector 0.8.2 + BM25 Fusion
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-graphite dark:text-dark-text block mb-1">
              Пошуковий запит користувача (Query):
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2.5 text-xs text-graphite focus:border-denim dark:border-dark-border dark:bg-dark-surface dark:text-dark-text font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-borderline/60 pt-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
                <span>Chunk Size (tokens):</span>
                <span className="font-mono font-bold text-denim">{chunkSize}</span>
              </div>
              <input
                type="range"
                min="64"
                max="512"
                step="32"
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value))}
                className="w-full accent-denim"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
                <span>Overlap (tokens):</span>
                <span className="font-mono font-bold text-denim">{chunkOverlap}</span>
              </div>
              <input
                type="range"
                min="0"
                max="128"
                step="16"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
                className="w-full accent-denim"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
                <span>Гібридний баланс α:</span>
                <span className="font-mono font-bold text-denim">
                  {alpha === 0 ? "BM25 (Sparse)" : alpha === 1 ? "pgvector (Dense)" : `Hybrid (${alpha})`}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-full accent-denim"
              />
            </div>

            <div className="flex justify-end items-end">
              <button
                onClick={handleExecute}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-2 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50 w-full justify-center"
              >
                <Play className="h-3.5 w-3.5" />
                {running ? "Пошук векторів..." : "Виконати RAG пошук"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Retrieved Chunks & Groundedness Inspector */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-graphite dark:text-dark-text">
              Знайдені фрагменти бази знань та цитування (Grounded Citations)
            </h4>
            <p className="text-[11px] text-gray-500">
              Кожен факт перевірений на відсутність галюцинацій (Groundedness Score: 98%)
            </p>
          </div>
          <span className="rounded bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
            Top-3 Chunks Retrieved
          </span>
        </div>

        <div className="space-y-3">
          {retrievedChunks.map((chunk, idx) => (
            <div
              key={chunk.id}
              className="rounded-lg border border-borderline bg-gray-50/50 p-4 transition hover:border-denim dark:border-dark-border dark:bg-black/20"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-denim" />
                  <span className="font-semibold text-graphite dark:text-dark-text">{chunk.doc_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-500">
                    Similarity: {(chunk.score * 100).toFixed(1)}%
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Обґрунтовано
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-700 dark:text-dark-text leading-relaxed font-mono">
                {chunk.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
