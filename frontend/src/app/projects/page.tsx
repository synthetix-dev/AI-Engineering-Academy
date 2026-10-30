"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Play,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Bot,
  Activity,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  GitBranch,
} from "lucide-react";
import { getProjects, createProject, ProjectItem } from "@/lib/api";

export default function LivingProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("Fraud Detection");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default living projects templates if user hasn't created one yet
  const defaultLivingProjects = [
    {
      id: "proj-1",
      title: "Система виявлення шахрайських транзакцій (End-to-End Fraud Pipeline)",
      description: "Наскрізний проєкт: очищення датасету → навчання Random Forest → покращення MLP → моніторинг деградації KS-тестом.",
      domain: "FinTech / Classification",
      commit_hash: "a9f4c12",
      stages: [
        { name: "1. Data Cleaning", done: true, lab: "data-cleaning-explorer" },
        { name: "2. Classical ML", done: true, lab: "ml-playground" },
        { name: "3. Deep MLP", done: true, lab: "neural-builder-lab" },
        { name: "4. LoRA Tuning", done: false, lab: "cpu-lora-finetuning-lab" },
        { name: "5. MLOps Drift", done: true, lab: "deployment-drift-lab" },
      ],
      metrics: { accuracy: 0.9412, recall: 0.892, ks_p_value: 0.0012 },
      current_next_lab: "cpu-lora-finetuning-lab",
      current_next_label: "Етап 4: LoRA адаптація вагів",
    },
    {
      id: "proj-2",
      title: "Корпоративний асистент бази знань (Enterprise RAG Agent)",
      description: "Гібридний пошук із pgvector, фільтрація галюцинацій та підключення ReAct-агента для обробки запитів.",
      domain: "Knowledge Retrieval",
      commit_hash: "3b8e7d1",
      stages: [
        { name: "1. Text Ingestion", done: true, lab: "nlp-bench" },
        { name: "2. Vector Store", done: true, lab: "rag-builder-inspection" },
        { name: "3. ReAct Agent", done: true, lab: "agent-sandbox-lab" },
        { name: "4. Safety Guard", done: false, lab: "ai-safety-defense-lab" },
        { name: "5. Orchestration", done: false, lab: "workflow-dag-lab" },
      ],
      metrics: { groundedness: 0.82, vector_latency_ms: 18.4, safety_score: 0.96 },
      current_next_lab: "ai-safety-defense-lab",
      current_next_label: "Етап 4: Налаштування захисту від Prompt Injection",
    },
  ];

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setCreating(true);
    try {
      const newP = await createProject({
        title,
        description,
        visibility: "public",
        metrics: { progress_percent: 10, current_stage: "Data Preprocessing" },
        configs: { domain, pipeline_version: "2.0.0" },
        architecture_md: `Наскрізний проєкт у домені ${domain}. Початок із конвеєра даних.`,
      });
      setProjects([newP, ...projects]);
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
      {/* Header */}
      <div className="rounded-2xl border border-borderline bg-gradient-to-br from-white via-teal-50/20 to-white p-6 sm:p-8 dark:border-dark-border dark:bg-gradient-to-br dark:from-dark-surface dark:via-dark-bg/60 dark:to-dark-surface shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              <FolderGit2 className="h-3.5 w-3.5" />
              Єдині наскрізні AI-проєкти (Living Systems)
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-graphite dark:text-dark-text">
              Розвивайте живі інженерні системи крізь усі дисципліни
            </h1>

            <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
              Не одноразові лабораторні скрипти, а цілісні виробничі проєкти.
              Починайте з очищення сирих даних, навчайте модель, додавайте векторний RAG,
              підключайте AI-агента та виводьте в моніторинг MLOps.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 transition shrink-0 self-start sm:self-center"
          >
            <Plus className="h-4 w-4" />
            + Створити наскрізний проєкт
          </button>
        </div>
      </div>

      {/* Lifecycle Stage Roadmap Banner */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Життєвий цикл наскрізного AI-проєкту:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="rounded-lg border border-denim/40 bg-cloud/50 p-2.5 font-semibold text-denim">
            1. Дані & PII
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-2.5 font-semibold text-tangerine">
            2. ML Базлайн
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-2.5 font-semibold text-purple-600">
            3. Deep Learning
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-2.5 font-semibold text-emerald-600">
            4. RAG & Пошук
          </div>
          <div className="rounded-lg border border-pink-200 bg-pink-50/50 p-2.5 font-semibold text-pink-600">
            5. ReAct Агент
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 font-semibold text-amber-600">
            6. MLOps Деплой
          </div>
        </div>
      </div>

      {/* Living Project Cards List */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-graphite dark:text-dark-text">
          Активні наскрізні системи
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {defaultLivingProjects.map((lp) => (
            <div
              key={lp.id}
              className="rounded-xl border border-borderline bg-white p-6 shadow-sm hover:border-teal-500 hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline pb-4 dark:border-dark-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded dark:bg-dark-bg">
                      {lp.domain}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      Commit: #{lp.commit_hash}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-graphite dark:text-dark-text">
                    {lp.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-dark-muted">
                    {lp.description}
                  </p>
                </div>

                <Link
                  href={`/labs/${lp.current_next_lab}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-teal-700 transition shrink-0"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Продовжити: {lp.current_next_label}
                </Link>
              </div>

              {/* Stage Progress Pills */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Прогрес етапів проєкту:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {lp.stages.map((st, i) => (
                    <Link
                      key={i}
                      href={`/labs/${st.lab}`}
                      className={`flex items-center justify-between rounded-lg border p-2.5 text-xs transition ${
                        st.done
                          ? "border-emerald-300 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 font-semibold"
                          : "border-borderline bg-gray-50 text-gray-500 hover:border-teal-400 dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted"
                      }`}
                    >
                      <span className="truncate">{st.name}</span>
                      {st.done ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Verified Metrics Snapshot */}
              <div className="pt-2 border-t border-borderline/60 dark:border-dark-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-gray-500">Метрики конвеєра:</span>
                  {Object.entries(lp.metrics).map(([k, v]) => (
                    <span key={k} className="font-bold text-graphite dark:text-dark-text">
                      {k}: <span className="text-teal-600">{typeof v === "number" ? v.toFixed(4) : String(v)}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const spec = JSON.stringify(lp, null, 2);
                      const blob = new Blob([spec], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `project-${lp.id}-spec.json`;
                      a.click();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-gray-600 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
                  >
                    <Download className="h-3 w-3" /> Експорт спеки JSON
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Living Project */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-borderline bg-white p-6 shadow-xl dark:border-dark-border dark:bg-dark-surface space-y-4">
            <div className="flex items-center justify-between border-b border-borderline pb-3 dark:border-dark-border">
              <h3 className="text-base font-bold text-graphite dark:text-dark-text">
                Створити новий наскрізний AI-проєкт
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-graphite dark:text-dark-text">
                  Назва проєкту
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Наприклад: Мультимодальний медичний аналізатор"
                  className="w-full rounded border border-borderline p-2 text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-graphite dark:text-dark-text">
                  Галузь застосування (Domain)
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full rounded border border-borderline p-2 text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                >
                  <option value="FinTech">FinTech / Fraud Detection</option>
                  <option value="Healthcare">Healthcare & Diagnostics</option>
                  <option value="E-Commerce">E-Commerce & Recommendations</option>
                  <option value="Enterprise RAG">Enterprise Search & Knowledge</option>
                  <option value="Autonomous Robotics">Autonomous Robotics & Agents</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-graphite dark:text-dark-text">
                  Опис інженерної мети
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Опишіть завдання, які вирішує система..."
                  className="w-full rounded border border-borderline p-2 text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-borderline dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded px-3 py-1.5 text-gray-600 hover:bg-gray-100 dark:text-dark-muted"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded bg-teal-600 px-4 py-1.5 font-bold text-white hover:bg-teal-700 transition"
                >
                  {creating ? "Створення..." : "Створити проєкт"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
