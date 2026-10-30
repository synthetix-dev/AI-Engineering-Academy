"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  FileCode,
  Activity,
  History,
  Shield,
  Award,
  ArrowLeft,
  Copy,
  Download,
} from "lucide-react";
import { getLabBySlug, executeRun, getRun, Lab, RunResult } from "@/lib/api";

type TabKey =
  | "theory"
  | "configuration"
  | "workspace"
  | "execution"
  | "metrics"
  | "logs"
  | "results"
  | "code"
  | "evaluation"
  | "history";

export default function LabStudioPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [lab, setLab] = useState<Lab | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("configuration");
  const [executionMode, setExecutionMode] = useState<"cpu-real" | "gpu-real" | "demo">("cpu-real");
  const [configParams, setConfigParams] = useState<string>("{}");
  const [running, setRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<RunResult | null>(null);
  const [runHistory, setRunHistory] = useState<RunResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    getLabBySlug(slug)
      .then((data) => {
        setLab(data);
        setConfigParams(JSON.stringify(data.default_config || {}, null, 2));
      })
      .catch((err) => setError(err.message));
  }, [slug]);

  const handleStartExecution = async () => {
    if (!lab) return;
    setRunning(true);
    setError(null);
    setActiveTab("execution");
    setLogs([
      `[${new Date().toLocaleTimeString()}] Ініціалізація запуску лабораторії: ${lab.title}`,
      `[${new Date().toLocaleTimeString()}] Режим: ${executionMode}. Виділення квоти CPU...`,
      `[${new Date().toLocaleTimeString()}] Відправка завдання на обчислювальний worker...`,
    ]);

    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(configParams);
      } catch (e: any) {
        throw new Error("Невалідний JSON у конфігурації: " + e.message);
      }

      const res = await executeRun(lab.id, executionMode, parsedParams);
      setCurrentRun(res);
      setRunHistory((prev) => [res, ...prev]);

      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Worker завершив обчислення зі статусом: ${res.status.toUpperCase()}`,
        `[${new Date().toLocaleTimeString()}] Час виконання: ${res.resource_usage.cpu_seconds?.toFixed(3) || "0.000"}s`,
        `[${new Date().toLocaleTimeString()}] Trace ID: ${res.trace_id}`,
      ]);

      if (res.status === "succeeded") {
        setActiveTab("results");
      }
    } catch (err: any) {
      setError(err.message);
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ПОМИЛКА: ${err.message}`,
      ]);
    } finally {
      setRunning(false);
    }
  };

  if (error && !lab) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Помилка завантаження лабораторії: {error}
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="py-12 text-center text-xs font-mono text-gray-500">
        Завантаження робочого середовища лабораторії...
      </div>
    );
  }

  const tabs: Array<{ key: TabKey; label: string; icon: any }> = [
    { key: "theory", label: "1. Theory", icon: Layers },
    { key: "configuration", label: "2. Configuration", icon: FileCode },
    { key: "workspace", label: "3. Workspace", icon: Terminal },
    { key: "execution", label: "4. Execution", icon: Play },
    { key: "metrics", label: "5. Live Metrics", icon: Activity },
    { key: "logs", label: "6. Logs", icon: Clock },
    { key: "results", label: "7. Results", icon: CheckCircle2 },
    { key: "code", label: "8. Code", icon: FileCode },
    { key: "evaluation", label: "9. Evaluation", icon: Award },
    { key: "history", label: "10. History", icon: History },
  ];

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline pb-3 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Link
            href="/labs"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
          >
            <ArrowLeft className="h-3 w-3" /> Всі лабораторії
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-xs font-bold font-mono text-denim">{lab.slug}</span>
        </div>

        {/* Execution Mode selector badge */}
        <div className="flex items-center gap-2">
          <div className="flex rounded border border-borderline bg-white p-0.5 text-xs dark:border-dark-border dark:bg-dark-surface">
            <button
              onClick={() => setExecutionMode("cpu-real")}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                executionMode === "cpu-real"
                  ? "bg-denim text-white"
                  : "text-gray-600 dark:text-dark-muted hover:text-graphite"
              }`}
            >
              CPU-real (Реальний)
            </button>
            <button
              onClick={() => setExecutionMode("gpu-real")}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                executionMode === "gpu-real"
                  ? "bg-tangerine text-white"
                  : "text-gray-600 dark:text-dark-muted hover:text-graphite"
              }`}
            >
              GPU-real (Metal/MPS)
            </button>
            <button
              onClick={() => setExecutionMode("demo")}
              className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
                executionMode === "demo"
                  ? "bg-gray-700 text-white"
                  : "text-gray-600 dark:text-dark-muted hover:text-graphite"
              }`}
            >
              Demo
            </button>
          </div>
        </div>
      </div>

      {/* Lab Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-graphite dark:text-dark-text">{lab.title}</h1>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-600 dark:bg-dark-bg dark:text-dark-muted">
              v{lab.semantic_version}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-600 dark:text-dark-muted">{lab.description}</p>
        </div>

        <button
          onClick={handleStartExecution}
          disabled={running}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-tangerine px-5 py-2.5 text-xs font-bold text-white hover:bg-tangerine-600 transition-colors shadow-sm disabled:opacity-50 shrink-0"
        >
          <Play className="h-4 w-4 fill-current" />
          {running ? "Виконується на воркері..." : "Запустити обчислення"}
        </button>
      </div>

      {/* Error notification if any */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 10 Unified Tabs (Section 26 Requirements) */}
      <div className="border-b border-borderline dark:border-dark-border overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition-colors border-b-2 ${
                  isCurrent
                    ? "border-tangerine text-graphite dark:text-white font-bold"
                    : "border-transparent text-gray-500 hover:text-graphite hover:border-gray-300 dark:text-dark-muted dark:hover:text-dark-text"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isCurrent ? "text-tangerine" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="rounded-lg border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface min-h-[380px]">
        {/* 1. Theory */}
        {activeTab === "theory" && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Теоретичний контракт</h3>
            <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
              Ця лабораторія реалізує алгоритми напряму <strong>{lab.title}</strong> на ізольованому обчислювальному воркері.
              Будь-які отримані показники розраховуються у реальному часі на сервері без підміни кешованими або симульованими даними.
            </p>

            <div className="rounded border border-borderline bg-gray-50 p-4 dark:border-dark-border dark:bg-dark-bg space-y-2">
              <div className="text-xs font-semibold text-graphite dark:text-dark-text">Очікувані результати:</div>
              <ul className="list-disc list-inside text-xs text-gray-600 dark:text-dark-muted space-y-1">
                {lab.outcomes.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 2. Configuration */}
        {activeTab === "configuration" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Конфігурація гіперпараметрів</h3>
                <p className="text-xs text-gray-500 dark:text-dark-muted">
                  JSON Schema валідовані параметри, які передаються безпосередньо у функцію виконання.
                </p>
              </div>
              <button
                onClick={() => setConfigParams(JSON.stringify(lab.default_config || {}, null, 2))}
                className="text-xs text-denim hover:underline flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Скинути до дефолтних
              </button>
            </div>

            <textarea
              rows={12}
              value={configParams}
              onChange={(e) => setConfigParams(e.target.value)}
              className="w-full rounded-md border border-borderline bg-gray-50 p-3 font-mono text-xs text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text focus:border-denim focus:outline-none"
            />
          </div>
        )}

        {/* 3. Workspace */}
        {activeTab === "workspace" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Робочий простір експерименту</h3>
            <p className="text-xs text-gray-500 dark:text-dark-muted">
              Статус воркера: <strong>Готовий до виконання</strong>. Клас середовища: <code>{lab.runtime_class}</code>.
            </p>
            <div className="rounded border border-borderline bg-cloud/40 p-4 dark:border-dark-border dark:bg-dark-bg text-xs font-mono space-y-1">
              <div>// Ізоляція пам&apos;яті: 2048 MB limit</div>
              <div>// Максимальний таймаут: {lab.max_duration_sec} секунд</div>
              <div>// Мережевий egress: Заблоковано (тільки освітні allowlisted сервіси)</div>
            </div>
          </div>
        )}

        {/* 4. Execution */}
        {activeTab === "execution" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Консоль виконання</h3>
            {running && (
              <div className="rounded border border-denim/40 bg-cloud/50 p-4 text-xs font-mono text-denim-700 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-denim animate-ping" />
                Виконується обчислювальний скрипт на Python воркері... Зачекайте.
              </div>
            )}

            {currentRun && (
              <div className="rounded border border-borderline p-4 dark:border-dark-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-graphite dark:text-dark-text">
                    Статус:{" "}
                    <span
                      className={
                        currentRun.status === "succeeded"
                          ? "text-emerald-600"
                          : currentRun.status === "failed"
                          ? "text-red-600"
                          : "text-amber-600"
                      }
                    >
                      {currentRun.status.toUpperCase()}
                    </span>
                  </span>
                  <span className="text-xs font-mono text-gray-400">Trace: {currentRun.trace_id}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-dark-muted font-mono">
                  Тривалість: {currentRun.resource_usage.cpu_seconds?.toFixed(3)}s | Режим: {currentRun.execution_mode}
                </div>
              </div>
            )}

            <div className="rounded border border-borderline bg-gray-950 p-4 font-mono text-xs text-emerald-400 space-y-1 max-h-60 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Live Metrics */}
        {activeTab === "metrics" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Реальні метрики виконання</h3>
            {currentRun && currentRun.metrics && Object.keys(currentRun.metrics).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(currentRun.metrics).map(([key, val]) => (
                  <div key={key} className="rounded border border-borderline p-3 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    <div className="text-[11px] font-mono text-gray-500 dark:text-dark-muted truncate">{key}</div>
                    <div className="text-lg font-bold font-mono text-graphite dark:text-dark-text mt-1">
                      {typeof val === "number" ? val.toFixed(4) : String(val)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-500 font-mono">
                Запустіть лабораторію для отримання реальних числових метрик.
              </div>
            )}
          </div>
        )}

        {/* 6. Logs */}
        {activeTab === "logs" && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Журнал виконання (Logs)</h3>
            <div className="rounded border border-borderline bg-gray-900 p-4 font-mono text-xs text-gray-200 space-y-1">
              {logs.length > 0 ? (
                logs.map((l, i) => <div key={i}>{l}</div>)
              ) : (
                <div className="text-gray-500">// Журнал порожній. Запустіть завдання для появи записів.</div>
              )}
            </div>
          </div>
        )}

        {/* 7. Results */}
        {activeTab === "results" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Артефакти та структуровані результати</h3>
            {currentRun && currentRun.artifacts ? (
              <div className="space-y-4">
                <pre className="rounded border border-borderline bg-gray-50 p-4 font-mono text-xs text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text overflow-x-auto max-h-96">
                  {JSON.stringify(currentRun.artifacts, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-500 font-mono">
                Результати з&apos;являться після першого успішного запуску.
              </div>
            )}
          </div>
        )}

        {/* 8. Code */}
        {activeTab === "code" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Відтворюваний Python код</h3>
              <button
                onClick={() => navigator.clipboard.writeText(`// AI Engineering Academy reproduction code for ${lab.slug}`)}
                className="text-xs text-denim hover:underline flex items-center gap-1"
              >
                <Copy className="h-3 w-3" /> Скопіювати код
              </button>
            </div>
            <pre className="rounded border border-borderline bg-gray-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
{`# AI Engineering Academy — Reproducible Execution Script
# Module: ${lab.title} (slug: ${lab.slug})
# Mode: ${executionMode}

from backend.app.engines import dispatcher
import asyncio

async def main():
    params = ${configParams}
    result = await dispatcher.dispatch_lab_execution("${lab.slug}", params)
    print("Execution Metrics:", result["metrics"])

if __name__ == "__main__":
    asyncio.run(main())`}
            </pre>
          </div>
        )}

        {/* 9. Evaluation */}
        {activeTab === "evaluation" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Автоматична оцінка та верифікація</h3>
            <div className="rounded border border-borderline bg-gray-50 p-4 dark:border-dark-border dark:bg-dark-bg space-y-2">
              <div className="text-xs font-semibold text-graphite dark:text-dark-text">Критерії оцінювання рубрики:</div>
              <div className="text-xs text-gray-600 dark:text-dark-muted">
                • Точність обчислень: Порівнюється з детермінованим математичним baseline.<br />
                • Відсутність збоїв: Усі кроки виконано у межах таймауту ({lab.max_duration_sec}с).<br />
                • Підтвердження артефакту: Результат зберігається у PostgreSQL з валідним SHA-256 hash.
              </div>
            </div>

            {currentRun && currentRun.status === "succeeded" && (
              <div className="inline-flex items-center gap-2 rounded bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Усі критерії рубрики успішно виконано! Зараховано до прогресу.
              </div>
            )}
          </div>
        )}

        {/* 10. History */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-graphite dark:text-dark-text">Історія сесійних запусків</h3>
            {runHistory.length > 0 ? (
              <div className="divide-y divide-borderline dark:divide-dark-border">
                {runHistory.map((r, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className={r.status === "succeeded" ? "text-emerald-600" : "text-red-600"}>
                        [{r.status.toUpperCase()}]
                      </span>
                      <span>Trace: {r.trace_id}</span>
                    </div>
                    <span className="text-gray-500">{r.resource_usage.cpu_seconds?.toFixed(3)}s</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-500 font-mono">
                Історія запусків у цій сесії порожня.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
