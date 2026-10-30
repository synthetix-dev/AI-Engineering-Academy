"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Plus, Download, FileText, CheckCircle2, Copy } from "lucide-react";
import { getProjects, createProject, ProjectItem } from "@/lib/api";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [metricsJson, setMetricsJson] = useState('{"accuracy": 0.92, "roc_auc": 0.95}');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      let metrics = {};
      try {
        metrics = JSON.parse(metricsJson);
      } catch (_) {}

      const newProj = await createProject({
        title,
        description,
        visibility: "public",
        architecture_md: architecture || "Модульний конвеєр обробки ознак та класифікації.",
        metrics,
        configs: { created_via: "web_studio" },
      });
      setProjects((prev) => [newProj, ...prev]);
      setShowModal(false);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      alert("Помилка створення: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderline pb-4 dark:border-dark-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-graphite dark:text-dark-text flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-denim" />
            Інженерне портфоліо та відтворювані проєкти
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted mt-1">
            Збережені практичні артефакти, код, параметри та верифіковані метрики для демонстрації роботодавцям.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-denim px-3 py-1.5 text-xs font-bold text-white hover:bg-denim-600 transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" /> Додати проєкт до портфоліо
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-borderline bg-white p-8 text-center text-xs text-gray-500 font-mono dark:border-dark-border dark:bg-dark-surface">
          У портфоліо поки немає проєктів. Виконайте лабораторну роботу або створіть новий проєкт вручну.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-400">Commit: {p.commit_hash}</span>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  {p.visibility.toUpperCase()}
                </span>
              </div>

              <h2 className="text-base font-bold text-graphite dark:text-dark-text">{p.title}</h2>
              <p className="text-xs text-gray-600 dark:text-dark-muted line-clamp-2 leading-relaxed">
                {p.description || "Без додаткового опису."}
              </p>

              {/* Metrics Box */}
              {p.metrics && Object.keys(p.metrics).length > 0 && (
                <div className="rounded border border-borderline/80 bg-gray-50 p-2.5 dark:border-dark-border dark:bg-dark-bg font-mono text-xs">
                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Метрики якості:</div>
                  <div className="flex flex-wrap gap-3 text-graphite dark:text-dark-text font-bold">
                    {Object.entries(p.metrics).map(([k, v]) => (
                      <span key={k}>
                        {k}: {typeof v === "number" ? v.toFixed(3) : String(v)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-borderline/60 dark:border-dark-border/60">
                <span className="text-[11px] text-gray-400">
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
                <a
                  href={`http://127.0.0.1:8000/api/v1/projects/${p.id}/export/markdown`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-denim hover:underline"
                >
                  <Download className="h-3.5 w-3.5" /> Завантажити Markdown звіт
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-dark-surface border border-borderline dark:border-dark-border space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-graphite dark:text-dark-text">Новий проєкт портфоліо</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-dark-muted">Назва проєкту</label>
                <input
                  type="text"
                  required
                  placeholder="напр., RAG Assistant з гібридним пошуком pgvector"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded border border-borderline p-2 text-xs text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-dark-muted">Опис та постановка задачі</label>
                <textarea
                  rows={2}
                  placeholder="Короткий зміст задачі та вирішених проблем..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded border border-borderline p-2 text-xs text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-dark-muted">Метрики (JSON)</label>
                <input
                  type="text"
                  value={metricsJson}
                  onChange={(e) => setMetricsJson(e.target.value)}
                  className="mt-1 w-full rounded border border-borderline p-2 font-mono text-xs text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded border border-borderline px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-dark-border dark:text-dark-muted hover:bg-gray-100"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded bg-denim px-4 py-1.5 text-xs font-bold text-white hover:bg-denim-600 disabled:opacity-50"
                >
                  {creating ? "Збереження..." : "Зберегти проєкт"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
