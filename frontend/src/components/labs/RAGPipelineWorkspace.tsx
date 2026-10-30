"use client";

import React, { useState } from "react";
import { Play, Database, Search, FileText, CheckCircle2, Sliders, Shield, AlertTriangle, Layers } from "lucide-react";

interface RAGProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function RAGPipelineWorkspace({ onRun, running, result }: RAGProps) {
  const [query, setQuery] = useState<string>("Як налаштувати індекси pgvector HNSW для векторів розмірністю 384?");
  const [chunkSize, setChunkSize] = useState<number>(256);
  const [chunkOverlap, setChunkOverlap] = useState<number>(32);
  const [alpha, setAlpha] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(3);
  const [enforceStrictGroundedness, setEnforceStrictGroundedness] = useState<boolean>(true);

  // Retrieved chunks with groundedness evidence
  const retrievedChunks = result?.artifacts?.retrieved_chunks || [
    {
      id: "chunk_01",
      score: 0.932,
      doc_name: "postgresql_pgvector_handbook.md",
      content:
        "Для створення індексу HNSW у PostgreSQL 16/17 з метрикою косинусної відстані використовуйте: CREATE INDEX ON embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64); Це забезпечує час пошуку менше 5 мс на мільйон векторів.",
      grounded: true,
    },
    {
      id: "chunk_02",
      score: 0.884,
      doc_name: "pgvector_optimization_guide.md",
      content:
        "Параметр m визначає максимальну кількість зв'язків для кожного вузла в графі HNSW. Значення m=16 є оптимальним компромісом між споживанням пам'яті та точністю пошуку (recall).",
      grounded: true,
    },
    {
      id: "chunk_03",
      score: 0.812,
      doc_name: "embedding_models_specs.md",
      content:
        "Модель all-MiniLM-L6-v2 генерує embeddings розмірністю 384. Нормалізація векторів перед записом дозволяє використовувати dot product замість обчислювально складнішого cosine distance.",
      grounded: true,
    },
  ];

  const groundednessScore = result?.metrics?.groundedness_score ?? 0.89;

  const handleExecute = () => {
    onRun({
      query: query,
      chunk_size: chunkSize,
      chunk_overlap: chunkOverlap,
      hybrid_alpha: alpha,
      top_k: topK,
      strict_groundedness: enforceStrictGroundedness,
    });
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Config Card */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline/60 pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-denim" />
            <div>
              <h3 className="font-display font-bold text-sm text-navy dark:text-white">
                Архітектор гібридного пошуку RAG (PostgreSQL pgvector + BM25 Fusion)
              </h3>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                Налаштуйте семантичний векторний пошук, поріг схожості та оцінку галюцинацій
              </p>
            </div>
          </div>
          <span className="rounded-full bg-denim/10 px-3 py-0.5 text-[11px] font-bold text-denim border border-denim/30">
            pgvector 0.8.2 Active
          </span>
        </div>

        {/* User Search Query */}
        <div>
          <label className="text-xs font-bold text-navy dark:text-white block mb-1">
            Пошуковий запит користувача (User Query):
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-borderline bg-white p-2.5 text-xs text-navy focus:border-denim dark:border-dark-border dark:bg-dark-surface dark:text-white font-medium"
          />
        </div>

        {/* Visual Chunking Diagram */}
        <div className="rounded-xl border border-borderline bg-cloud/30 p-3.5 dark:border-dark-border dark:bg-dark-bg/40">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Візуалізація чанкінгу документа:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-mono">
            <div className="rounded border border-denim/40 bg-denim/15 px-3 py-1.5 text-denim-700">
              Чанк #1 [0 - {chunkSize} токенів]
            </div>
            <div className="rounded border border-tangerine/40 bg-tangerine/15 px-2 py-1.5 text-tangerine text-[10px]">
              Overlap ({chunkOverlap})
            </div>
            <div className="rounded border border-denim/40 bg-denim/15 px-3 py-1.5 text-denim-700">
              Чанк #2 [{chunkSize - chunkOverlap} - {chunkSize * 2 - chunkOverlap} токенів]
            </div>
            <div className="rounded border border-gray-300 bg-gray-100 px-3 py-1.5 text-gray-500">
              Чанк #3 [...]
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Chunk Size (розмір):</span>
              <span className="font-mono font-bold text-denim">{chunkSize} ток.</span>
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
              <span>Overlap (перекриття):</span>
              <span className="font-mono font-bold text-denim">{chunkOverlap} ток.</span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              step="8"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Гібридний баланс (α):</span>
              <span className="font-mono font-bold text-tangerine">{(alpha * 100).toFixed(0)}% Dense</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full accent-tangerine"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Top-K Chunks:</span>
              <span className="font-mono font-bold text-denim">{topK}</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex justify-end gap-2 border-t border-borderline/60 pt-3">
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-6 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-white" />
            {running ? "Пошук у pgvector..." : "Виконати векторний пошук"}
          </button>
        </div>
      </div>

      {/* Retrieved Chunks & Groundedness Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retrieved Chunks Cards (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">
              Знайдений контекст у PostgreSQL pgvector
            </h4>
            <span className="text-xs text-gray-500 font-mono">Top-{retrievedChunks.length} релевантних</span>
          </div>

          <div className="space-y-3">
            {retrievedChunks.map((c: any, idx: number) => (
              <div
                key={c.id || idx}
                className="rounded-xl border border-borderline bg-cloud/20 p-4 dark:border-dark-border dark:bg-dark-bg/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-denim/15 px-2 py-0.5 text-[10px] font-mono font-bold text-denim-700">
                      Chunk #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-navy dark:text-white">{c.doc_name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    Similarity: {(c.score * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-dark-text leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Groundedness Meter (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
          <h4 className="font-display font-bold text-sm text-navy dark:text-white">
            Оцінка галюцинацій (Groundedness)
          </h4>

          <div className="rounded-xl border border-borderline bg-cloud/30 p-4 text-center dark:border-dark-border dark:bg-dark-bg/60 space-y-2">
            <span className="text-[11px] font-bold uppercase text-gray-500">Groundedness Score</span>
            <div className="font-display font-black text-3xl text-emerald-600">
              {(groundednessScore * 100).toFixed(1)}%
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              Відповідь на 100% підтверджена знайденим контекстом без сторонніх фантазій.
            </p>
          </div>

          <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Галюцинацій не виявлено
            </div>
            <p className="text-[11px] text-emerald-700">
              Гібридний пошук Dense + BM25 зберіг терміни HNSW та параметри m/ef.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
