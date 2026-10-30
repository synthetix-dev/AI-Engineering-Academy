"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Activity,
  AlertTriangle,
  Award,
  Sparkles,
  Layers,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  Terminal,
  Code2,
  Eye,
  Bot,
  Copy,
  Check,
  Send,
  Zap,
} from "lucide-react";
import {
  getLabBySlug,
  executeRun,
  getMentorAssistance,
  getMentorPrompts,
  createProject,
  Lab,
  RunResult,
  MentorAssistResult,
} from "@/lib/api";

// Specialized Domain Workspaces
import MathLabWorkspace from "@/components/labs/MathLabWorkspace";
import DataLabWorkspace from "@/components/labs/DataLabWorkspace";
import MLLabWorkspace from "@/components/labs/MLLabWorkspace";
import DeepLearningWorkspace from "@/components/labs/DeepLearningWorkspace";
import RAGPipelineWorkspace from "@/components/labs/RAGPipelineWorkspace";
import FineTuningWorkspace from "@/components/labs/FineTuningWorkspace";
import AgentWorkspace from "@/components/labs/AgentWorkspace";
import AutomationDAGWorkspace from "@/components/labs/AutomationDAGWorkspace";
import MLOpsDriftWorkspace from "@/components/labs/MLOpsDriftWorkspace";
import PythonSQLSandboxWorkspace from "@/components/labs/PythonSQLSandboxWorkspace";
import NLPSpeechWorkspace from "@/components/labs/NLPSpeechWorkspace";
import CVLabWorkspace from "@/components/labs/CVLabWorkspace";
import GenerativeAttentionWorkspace from "@/components/labs/GenerativeAttentionWorkspace";
import LLMBenchWorkspace from "@/components/labs/LLMBenchWorkspace";
import BanditDPOWorkspace from "@/components/labs/BanditDPOWorkspace";
import SafetyDefenseWorkspace from "@/components/labs/SafetyDefenseWorkspace";
import QuantizationBenchWorkspace from "@/components/labs/QuantizationBenchWorkspace";
import ResearchAblationWorkspace from "@/components/labs/ResearchAblationWorkspace";
import CapstoneProjectWorkspace from "@/components/labs/CapstoneProjectWorkspace";
import PromptStudioWorkspace from "@/components/labs/PromptStudioWorkspace";

type StudioMode = "visual" | "mentor" | "engineering";

export default function LabStudioPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [lab, setLab] = useState<Lab | null>(null);
  const [studioMode, setStudioMode] = useState<StudioMode>("visual");
  const [running, setRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<RunResult | null>(null);
  const [activeParams, setActiveParams] = useState<any>({});
  const [runHistory, setRunHistory] = useState<RunResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedLogs, setShowAdvancedLogs] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [projectSaved, setProjectSaved] = useState(false);

  // AI Mentor State
  const [mentorGoal, setMentorGoal] = useState("");
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorData, setMentorData] = useState<MentorAssistResult | null>(null);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);

  useEffect(() => {
    if (!slug) return;
    getLabBySlug(slug)
      .then((data) => {
        setLab(data);
        setActiveParams(data.default_config || {});
      })
      .catch((err) => setError(err.message));

    getMentorPrompts(slug)
      .then((res) => {
        if (res?.quick_prompts) setQuickPrompts(res.quick_prompts);
      })
      .catch(() => {});
  }, [slug]);

  const handleStartExecution = async (overrideParams?: any) => {
    if (!lab) return;
    setRunning(true);
    setError(null);
    setProjectSaved(false);

    const execParams = overrideParams || activeParams;
    setActiveParams(execParams);

    setLogs([
      `[${new Date().toLocaleTimeString()}] Ініціалізація експерименту: ${lab.title}`,
      `[${new Date().toLocaleTimeString()}] Відправка параметрів на обчислювальний worker...`,
    ]);

    try {
      const res = await executeRun(lab.id, "cpu-real", execParams);
      setCurrentRun(res);
      setRunHistory((prev) => [res, ...prev]);

      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Завершено зі статусом: ${res.status.toUpperCase()}`,
        `[${new Date().toLocaleTimeString()}] Час виконання: ${res.resource_usage.cpu_seconds?.toFixed(3) || "0.000"}s`,
        `[${new Date().toLocaleTimeString()}] Trace ID: ${res.trace_id}`,
      ]);
    } catch (err: any) {
      setError(err.message || "Помилка виконання на сервері");
      setLogs((prev) => [...prev, `[ПОМИЛКА] ${err.message}`]);
    } finally {
      setRunning(false);
    }
  };

  const handleAskMentor = async (queryText?: string) => {
    const goalText = queryText || mentorGoal;
    if (!goalText || !lab) return;
    setMentorLoading(true);
    try {
      const result = await getMentorAssistance(lab.slug, goalText, activeParams);
      setMentorData(result);
    } catch (err: any) {
      setError("AI Mentor недоступний: " + err.message);
    } finally {
      setMentorLoading(false);
    }
  };

  const applyMentorParams = () => {
    if (!mentorData?.suggested_params) return;
    setActiveParams(mentorData.suggested_params);
    handleStartExecution(mentorData.suggested_params);
    setStudioMode("visual");
  };

  const handleSaveToProject = async () => {
    if (!lab || !currentRun) return;
    try {
      await createProject({
        title: `${lab.title} — Експеримент`,
        description: `Збережено результат обчислення лабораторії ${lab.slug} з підтвердженими метриками.`,
        visibility: "public",
        metrics: currentRun.metrics,
        configs: activeParams,
        artifacts: currentRun.artifacts,
      });
      setProjectSaved(true);
      setTimeout(() => setProjectSaved(false), 4000);
    } catch (err: any) {
      setError("Не вдалося зберегти в проєкт: " + err.message);
    }
  };

  // Render Specialized Workspace Component
  const renderSpecializedWorkspace = () => {
    if (!lab) return null;
    const currentSlug = lab.slug.toLowerCase();

    if (currentSlug.includes("python") || currentSlug.includes("sandbox") || currentSlug.includes("foundations")) {
      return <PythonSQLSandboxWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("matrix") || currentSlug.includes("gradient") || currentSlug.includes("math")) {
      return <MathLabWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("cleaning") || currentSlug.includes("data")) {
      return <DataLabWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("ml-playground") || currentSlug.includes("classical")) {
      return <MLLabWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("neural-builder") || currentSlug.includes("deep-learning")) {
      return <DeepLearningWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("nlp-bench") || currentSlug.includes("speech") || currentSlug.includes("nlp")) {
      return <NLPSpeechWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("cv-lab") || currentSlug.includes("vision")) {
      return <CVLabWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("attention-mechanics") || currentSlug.includes("generative")) {
      return <GenerativeAttentionWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("llm-inference") || currentSlug.includes("llm-bench")) {
      return <LLMBenchWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("prompt-lab") || currentSlug.includes("prompt")) {
      return <PromptStudioWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("rag-builder") || currentSlug.includes("rag")) {
      return <RAGPipelineWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("lora") || currentSlug.includes("fine-tuning") || currentSlug.includes("finetuning")) {
      return <FineTuningWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("bandit") || currentSlug.includes("dpo") || currentSlug.includes("rl")) {
      return <BanditDPOWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("agent-sandbox") || currentSlug.includes("agent")) {
      return <AgentWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("workflow") || currentSlug.includes("automation") || currentSlug.includes("dag")) {
      return <AutomationDAGWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("deployment-drift") || currentSlug.includes("mlops") || currentSlug.includes("drift")) {
      return <MLOpsDriftWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("safety") || currentSlug.includes("defense")) {
      return <SafetyDefenseWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("quantization") || currentSlug.includes("optimization") || currentSlug.includes("hardware")) {
      return <QuantizationBenchWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("ablation") || currentSlug.includes("research") || currentSlug.includes("reproduction")) {
      return <ResearchAblationWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }
    if (currentSlug.includes("capstone") || currentSlug.includes("project")) {
      return <CapstoneProjectWorkspace onRun={handleStartExecution} running={running} result={currentRun} />;
    }

    // Default clean interactive container
    return (
      <div className="rounded-xl border border-borderline bg-gray-50/50 p-6 dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-sm font-bold text-graphite dark:text-dark-text mb-2">
          Інтерактивний експеримент: {lab.title}
        </h4>
        <p className="text-xs text-gray-600 dark:text-dark-muted mb-4">
          Налаштуйте параметри нижче та запустіть реальний обчислювальний процес на CPU воркері.
        </p>
        <button
          onClick={() => handleStartExecution()}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-lg bg-denim px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {running ? "Виконується обчислення..." : "Запустити обчислення"}
        </button>
      </div>
    );
  };

  if (error && !lab) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Помилка завантаження робочого середовища: {error}
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="py-16 text-center text-xs font-mono text-gray-500">
        Завантаження AI Engineering Studio...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Tri-Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderline pb-4 dark:border-dark-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Назад до дослідження
            </Link>
            <span className="text-gray-300 dark:text-dark-border">•</span>
            <span className="text-xs font-semibold text-denim">Інтерактивна практика</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-graphite dark:text-dark-text">
            {lab.title}
          </h1>
          <p className="text-xs text-gray-600 dark:text-dark-muted max-w-2xl">
            {lab.description}
          </p>
        </div>

        {/* Tri-Mode Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="inline-flex rounded-lg border border-borderline bg-gray-100 p-1 text-xs dark:border-dark-border dark:bg-dark-surface shadow-xs">
            <button
              onClick={() => setStudioMode("visual")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
                studioMode === "visual"
                  ? "bg-white text-graphite shadow-xs font-bold dark:bg-dark-bg dark:text-dark-text"
                  : "text-gray-600 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
              }`}
              title="Візуальний режим: форми, слайдери, графіки"
            >
              <Eye className="h-3.5 w-3.5 text-denim" />
              <span>Visual</span>
            </button>

            <button
              onClick={() => setStudioMode("mentor")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
                studioMode === "mentor"
                  ? "bg-white text-graphite shadow-xs font-bold dark:bg-dark-bg dark:text-dark-text"
                  : "text-gray-600 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
              }`}
              title="Допомога AI-наставника українською мовою"
            >
              <Bot className="h-3.5 w-3.5 text-tangerine" />
              <span>AI Mentor</span>
            </button>

            <button
              onClick={() => setStudioMode("engineering")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
                studioMode === "engineering"
                  ? "bg-white text-graphite shadow-xs font-bold dark:bg-dark-bg dark:text-dark-text"
                  : "text-gray-600 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
              }`}
              title="Професійний інженерний режим: код, cURL, API"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-600" />
              <span>Engineering</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3.5 text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {projectSaved && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-3.5 text-xs text-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
          <span>Результат та конфігурацію успішно збережено до ваших живих AI-проєктів!</span>
        </div>
      )}

      {/* MODE 1: AI MENTOR VIEW */}
      {studioMode === "mentor" && (
        <div className="rounded-xl border border-tangerine/40 bg-gradient-to-br from-orange-50/40 via-white to-orange-50/20 p-5 shadow-sm dark:border-tangerine/30 dark:bg-dark-surface space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tangerine text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-graphite dark:text-dark-text">
                Інженерний наставник AI (Відкрита система знань)
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-dark-muted">
                Опишіть вашу мету або виберіть типове питання для оптимізації параметрів
              </p>
            </div>
          </div>

          {/* Quick Prompts */}
          {quickPrompts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMentorGoal(qp);
                    handleAskMentor(qp);
                  }}
                  className="rounded-full border border-borderline bg-white px-3 py-1 text-xs text-gray-700 hover:border-tangerine hover:text-tangerine dark:border-dark-border dark:bg-dark-bg dark:text-dark-text transition"
                >
                  💡 {qp}
                </button>
              ))}
            </div>
          )}

          {/* Prompt Input Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={mentorGoal}
              onChange={(e) => setMentorGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAskMentor()}
              placeholder="Наприклад: Як усунути перенавчання чи налаштувати LoRA ранг?"
              className="flex-1 rounded-lg border border-borderline bg-white px-3.5 py-2 text-xs text-graphite placeholder:text-gray-400 focus:border-tangerine focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
            />
            <button
              onClick={() => handleAskMentor()}
              disabled={mentorLoading || !mentorGoal.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-tangerine px-4 py-2 text-xs font-semibold text-white shadow hover:opacity-90 transition disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {mentorLoading ? "Аналіз..." : "Запитати"}
            </button>
          </div>

          {/* Mentor Advice Output */}
          {mentorData && (
            <div className="rounded-lg border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-bg space-y-3">
              <div className="text-xs text-gray-700 dark:text-dark-text leading-relaxed">
                {mentorData.explanation}
              </div>

              {/* Diagnostic Tips */}
              {mentorData.diagnostic_tips?.length > 0 && (
                <div className="rounded-md bg-cloud/50 p-3 dark:bg-denim/10 space-y-1">
                  <span className="text-[11px] font-bold text-denim uppercase tracking-wider">
                    Інженерні поради:
                  </span>
                  <ul className="list-disc list-inside text-xs text-gray-600 dark:text-dark-muted space-y-0.5">
                    {mentorData.diagnostic_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Button to Apply Parameters */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={applyMentorParams}
                  className="inline-flex items-center gap-2 rounded-lg bg-denim px-4 py-2 text-xs font-semibold text-white shadow hover:bg-denim-dark transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-tangerine" />
                  Застосувати ці параметри та запустити
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: ENGINEERING VIEW */}
      {studioMode === "engineering" && (
        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="text-sm font-bold text-graphite dark:text-dark-text">
                  Виробничий код (Python & PyTorch)
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-dark-muted">
                  Повністю відтворюваний код для запуску у локальному середовищі або CI/CD
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const codeSnippet = `# AI Engineering Academy Reproduction Script\nfrom backend.app.engines import dispatcher\nimport asyncio\n\nasync def run():\n    res = await dispatcher.dispatch_lab_execution("${lab.slug}", ${JSON.stringify(activeParams, null, 2)})\n    print(res["metrics"])\n\nasyncio.run(run())`;
                navigator.clipboard.writeText(codeSnippet);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-borderline px-3 py-1.5 text-xs text-gray-700 hover:border-purple-600 dark:border-dark-border dark:text-dark-muted transition"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? "Скопійовано" : "Скопіювати Python"}</span>
            </button>
          </div>

          <pre className="rounded-lg border border-borderline bg-gray-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`# Відтворюваний інженерний запуск
# Модуль: ${lab.title} (ID: ${lab.slug})
# Ядро обчислень: PyTorch CPU Worker

from backend.app.engines import dispatcher
import asyncio

params = ${JSON.stringify(activeParams, null, 2)}

async def main():
    result = await dispatcher.dispatch_lab_execution("${lab.slug}", params)
    print("Статус:", result["success"])
    print("Метрики:", result["metrics"])

if __name__ == "__main__":
    asyncio.run(main())`}
          </pre>

          {/* Direct cURL Endpoint */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Виклик через REST API (cURL):
            </span>
            <div className="rounded border border-borderline bg-gray-50 p-2.5 font-mono text-[11px] text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text overflow-x-auto">
              curl -X POST http://127.0.0.1:8000/api/v1/runs?wait=true -H &quot;Content-Type: application/json&quot; -d &apos;{`{"lab_id": "${lab.id}", "execution_mode": "cpu-real", "params": ${JSON.stringify(activeParams)}}`}&apos;
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: MAIN VISUAL WORKSPACE (Always available) */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
        {renderSpecializedWorkspace()}
      </div>

      {/* RESULTS & EXPLANATION DECK (When a run has finished) */}
      {currentRun && (
        <div className="rounded-xl border border-borderline bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline/80 pb-4 dark:border-dark-border/80">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-white font-bold text-xs ${
                  currentRun.status === "succeeded" ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {currentRun.status === "succeeded" ? "✓" : "!"}
              </div>
              <div>
                <h3 className="text-base font-bold text-graphite dark:text-dark-text">
                  Результати обчислення
                </h3>
                <span className="text-xs text-gray-500 dark:text-dark-muted font-mono">
                  Виконано за {currentRun.resource_usage?.cpu_seconds?.toFixed(3) || "0.025"}s на CPU воркері
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToProject}
                className="inline-flex items-center gap-1.5 rounded-lg border border-borderline bg-white px-3.5 py-1.5 text-xs font-semibold text-graphite hover:border-denim dark:border-dark-border dark:bg-dark-bg dark:text-dark-text transition"
              >
                <FolderPlus className="h-3.5 w-3.5 text-denim" />
                Зберегти до живих проєктів
              </button>
            </div>
          </div>

          {/* Key Metrics Cards (Human readable, zero raw json) */}
          {currentRun.metrics && Object.keys(currentRun.metrics).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted">
                Отримані показники моделі:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(currentRun.metrics).map(([key, val]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-borderline bg-gray-50/70 p-3 dark:border-dark-border dark:bg-dark-bg"
                  >
                    <div className="text-[11px] font-mono text-gray-500 dark:text-dark-muted truncate">
                      {key.replace(/_/g, " ")}
                    </div>
                    <div className="mt-1 text-base sm:text-lg font-bold font-mono text-graphite dark:text-dark-text">
                      {typeof val === "number" ? val.toFixed(4) : String(val)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reflection / What this means */}
          <div className="rounded-lg border border-denim/30 bg-cloud/40 p-4 dark:border-denim/20 dark:bg-denim/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-denim uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Пояснення результату:
            </div>
            <p className="text-xs text-gray-700 dark:text-dark-text leading-relaxed">
              Обчислення завершилося з дійсними показниками. Дані оброблено у векторному середовищі,
              всі метрики зафіксовано в базі PostgreSQL та зараховано до вашого персонального портфоліо інженера.
            </p>
          </div>
        </div>
      )}

      {/* ADVANCED COLLAPSIBLE DRAWER (Logs & History) */}
      <div className="rounded-xl border border-borderline bg-white dark:border-dark-border dark:bg-dark-surface overflow-hidden">
        <button
          onClick={() => setShowAdvancedLogs(!showAdvancedLogs)}
          className="flex w-full items-center justify-between p-4 text-xs font-semibold text-gray-600 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text transition"
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-400" />
            <span>Інженерний журнал виконання та історія запусків ({runHistory.length})</span>
          </div>
          {showAdvancedLogs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showAdvancedLogs && (
          <div className="border-t border-borderline p-4 dark:border-dark-border space-y-4 bg-gray-50/50 dark:bg-dark-bg">
            <div className="rounded-lg border border-borderline bg-gray-950 p-3 font-mono text-xs text-emerald-400 space-y-1 max-h-48 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, idx) => <div key={idx}>{log}</div>)
              ) : (
                <div className="text-gray-500">// Логи відсутні. Запустіть завдання для створення записів.</div>
              )}
            </div>

            {runHistory.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Попередні запуски цієї сесії:
                </span>
                <div className="divide-y divide-borderline dark:divide-dark-border">
                  {runHistory.map((r, i) => (
                    <div key={i} className="py-2 flex items-center justify-between text-xs font-mono">
                      <span className={r.status === "succeeded" ? "text-emerald-600 font-bold" : "text-red-600"}>
                        [{r.status.toUpperCase()}]
                      </span>
                      <span className="text-gray-500">Trace: {r.trace_id}</span>
                      <span className="text-gray-500">{r.resource_usage?.cpu_seconds?.toFixed(3)}s</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
