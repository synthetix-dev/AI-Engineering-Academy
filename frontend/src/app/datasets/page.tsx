"use client";

import React, { useEffect, useState } from "react";
import { Database, Upload, AlertTriangle, ShieldCheck, CheckCircle2, FileText, Lock } from "lucide-react";
import { getDatasets, uploadDataset, DatasetItem } from "@/lib/api";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDatasets()
      .then((data) => {
        setDatasets(data);
        if (data.length > 0) setSelectedDataset(data[0]);
      })
      .catch(() => {});
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;
    setUploading(true);
    setError(null);

    try {
      const res = await uploadDataset(file, name, isPublic);
      setDatasets((prev) => [res, ...prev]);
      setSelectedDataset(res);
      setName("");
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-borderline pb-4 dark:border-dark-border">
        <h1 className="text-xl sm:text-2xl font-bold text-graphite dark:text-dark-text flex items-center gap-2">
          <Database className="h-6 w-6 text-denim" />
          Менеджер навчальних наборів даних (Datasets)
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted mt-1">
          Завантаження CSV, автоматичний розрахунок SHA-256 хешу, статистичне профілювання колонок та аудит на PII.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="rounded-lg border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-graphite dark:text-dark-text flex items-center gap-2">
            <Upload className="h-4 w-4 text-tangerine" /> Завантажити новий датасет
          </h2>

          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-dark-muted">Назва набору даних</label>
              <input
                type="text"
                required
                placeholder="напр., customer_churn_v1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded border border-borderline bg-white p-2 text-xs text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text focus:border-denim focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-dark-muted">CSV файл</label>
              <input
                type="file"
                required
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 w-full text-xs text-gray-600 file:mr-2 file:rounded file:border-0 file:bg-denim file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-denim-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-borderline text-denim focus:ring-denim"
              />
              <label htmlFor="isPublic" className="text-xs text-gray-600 dark:text-dark-muted cursor-pointer">
                Зробити набір публічним у каталозі
              </label>
            </div>

            {error && (
              <div className="rounded border border-red-200 bg-red-50 p-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full rounded bg-denim py-2 text-xs font-bold text-white hover:bg-denim-600 transition-colors disabled:opacity-50"
            >
              {uploading ? "Сканування та валідація..." : "Завантажити та перевірити"}
            </button>
          </form>
        </div>

        {/* Datasets List & Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-graphite dark:text-dark-text">Зареєстровані датасети</h2>

            {datasets.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500 font-mono">
                Немає завантажених датасетів. Завантажте CSV або скористайтеся вбудованими даними лабораторій.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {datasets.map((ds) => (
                    <button
                      key={ds.id}
                      onClick={() => setSelectedDataset(ds)}
                      className={`text-left rounded border p-3 transition-all ${
                        selectedDataset?.id === ds.id
                          ? "border-denim bg-cloud dark:border-denim dark:bg-dark-bg"
                          : "border-borderline bg-white dark:border-dark-border dark:bg-dark-surface hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-graphite dark:text-dark-text truncate">{ds.name}</span>
                        {ds.is_public ? (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 font-semibold">Public</span>
                        ) : (
                          <span className="rounded bg-gray-100 px-1.5 py-0.2 text-[10px] text-gray-600 font-semibold">Private</span>
                        )}
                      </div>
                      <div className="mt-1 text-[11px] text-gray-500 dark:text-dark-muted font-mono">
                        Рядків: {ds.row_count} | {(ds.size_bytes / 1024).toFixed(1)} KB
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Dataset Details */}
                {selectedDataset && (
                  <div className="mt-4 pt-4 border-t border-borderline dark:border-dark-border space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
                        Деталі: {selectedDataset.name}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-400">
                        SHA-256: {selectedDataset.hash.slice(0, 16)}...
                      </span>
                    </div>

                    {/* PII Scan Alert */}
                    {selectedDataset.pii_warnings && selectedDataset.pii_warnings.length > 0 ? (
                      <div className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          Виявлено потенційні персональні дані (PII Warning):
                        </div>
                        {selectedDataset.pii_warnings.map((w, idx) => (
                          <div key={idx} className="text-[11px]">
                            • Колонка <code>{w.column}</code>: знайдено тип <strong>{w.pii_type}</strong>.
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> PII аудит пройдено успішно — витоків не виявлено.
                      </div>
                    )}

                    {/* Columns statistical profile */}
                    {selectedDataset.columns_info && (
                      <div className="rounded border border-borderline bg-gray-50 p-3 dark:border-dark-border dark:bg-dark-bg font-mono text-xs overflow-x-auto">
                        <pre className="text-graphite dark:text-dark-text">
                          {JSON.stringify(selectedDataset.columns_info, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
