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
  HelpCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  CheckCheck
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
import { getCurriculumForLab, LabPedagogicalData } from "@/lib/labCurriculum";

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
  const [curriculum, setCurriculum] = useState<LabPedagogicalData | null>(null);
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

  // Active step in pedagogical workflow (1-7)
  const [activeStep, setActiveStep] = useState<number>(3); // Default on practice, but user sees all steps

  // In-lab Knowledge Check / Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean>(false);
  const [quizXpAwarded, setQuizXpAwarded] = useState<number>(0);

  // AI Mentor State
  const [mentorGoal, setMentorGoal] = useState("");
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorData, setMentorData] = useState<MentorAssistResult | null>(null);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);

  useEffect(() => {
    if (!slug) return;
    const curr = getCurriculumForLab(slug);
    setCurriculum(curr);

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
      setActiveStep(4); // Advance to Results step

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

  const handleQuizSubmit = () => {
    if (!curriculum || selectedQuizOption === null) return;
    const isCorrect = selectedQuizOption === curriculum.quiz.correctIndex;
    setQuizCorrect(isCorrect);
    setQuizSubmitted(true);
    if (isCorrect) {
      setQuizXpAwarded(25);
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

    return (
      <div className="rounded-xl border border-borderline bg-gray-50/50 p-6 dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-sm font-bold text-navy dark:text-white mb-2">
          Інтерактивний експеримент: {lab.title}
        </h4>
        <p className="text-xs text-gray-600 dark:text-dark-muted mb-4">
          Налаштуйте параметри нижче та запустіть реальний обчислювальний процес на CPU воркері.
        </p>
        <button
          onClick={() => handleStartExecution()}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition disabled:opacity-50"
        >
          <Play className="h-4 w-4 fill-white" />
          {running ? "Виконується обчислення..." : "Запустити обчислення"}
        </button>
      </div>
    );
  };

  if (error && !lab) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Помилка завантаження робочого середовища: {error}
        </div>
      </div>
    );
  }

  if (!lab || !curriculum) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs font-mono text-gray-500">
        Ініціалізація AI Engineering Studio & Педагогічного плану...
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: "Мета" },
    { num: 2, label: "Інтуїція" },
    { num: 3, label: "Практика" },
    { num: 4, label: "Результат" },
    { num: 5, label: "Аналіз помилок" },
    { num: 6, label: "Перевірка (+XP)" },
    { num: 7, label: "Наступний крок" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
      {/* =========================================================================
          TOP NAVIGATION & STEPPER BAR (Pedagogical sequence)
         ========================================================================= */}
      <div className="space-y-4 border-b border-borderline pb-6 dark:border-dark-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/tracks"
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-navy dark:text-dark-muted dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Всі напрями
              </Link>
              <span className="text-gray-300 dark:text-dark-border">•</span>
              <span className="text-xs font-bold text-denim-700 dark:text-denim">
                {curriculum.trackTitle}
              </span>
              <span className="rounded bg-cloud text-navy text-[10px] font-mono font-bold px-2 py-0.5 border border-borderline">
                Модуль #{curriculum.trackOrder}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy dark:text-white">
              {lab.title}
            </h1>
          </div>

          {/* Tri-Mode Switcher */}
          <div className="inline-flex rounded-xl border border-borderline bg-cloud p-1 text-xs dark:border-dark-border dark:bg-dark-surface shadow-xs">
            <button
              onClick={() => setStudioMode("visual")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                studioMode === "visual"
                  ? "bg-white text-navy shadow-xs dark:bg-dark-bg dark:text-white"
                  : "text-gray-500 hover:text-navy dark:text-dark-muted dark:hover:text-white"
              }`}
              title="Візуальний режим: форми, графіки, слайдери без коду"
            >
              <Eye className="h-3.5 w-3.5 text-denim" />
              <span>Visual</span>
            </button>

            <button
              onClick={() => setStudioMode("mentor")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                studioMode === "mentor"
                  ? "bg-white text-navy shadow-xs dark:bg-dark-bg dark:text-white"
                  : "text-gray-500 hover:text-navy dark:text-dark-muted dark:hover:text-white"
              }`}
              title="AI-наставник українською мовою"
            >
              <Bot className="h-3.5 w-3.5 text-tangerine" />
              <span>AI Mentor</span>
            </button>

            <button
              onClick={() => setStudioMode("engineering")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                studioMode === "engineering"
                  ? "bg-white text-navy shadow-xs dark:bg-dark-bg dark:text-white"
                  : "text-gray-500 hover:text-navy dark:text-dark-muted dark:hover:text-white"
              }`}
              title="Професійний інженерний режим: PyTorch код, cURL, API"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-600" />
              <span>Engineering</span>
            </button>
          </div>
        </div>

        {/* 7-Step Horizontal Stepper */}
        <div className="pt-2 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {stepsList.map((st) => {
              const isCurrent = activeStep === st.num;
              const isDone = activeStep > st.num || (st.num === 4 && currentRun !== null);
              return (
                <button
                  key={st.num}
                  onClick={() => setActiveStep(st.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isCurrent
                      ? "bg-navy text-white shadow-xs dark:bg-white dark:text-navy"
                      : isDone
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-cloud text-gray-500 border border-borderline hover:text-navy dark:bg-dark-bg dark:text-dark-muted"
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-mono">
                    {isDone ? "✓" : st.num}
                  </span>
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {projectSaved && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Результат та конфігурацію успішно збережено до ваших живих AI-проєктів!</span>
        </div>
      )}

      {/* =========================================================================
          STEP 1: МЕТА & ПРОФЕСІЙНИЙ КОНТЕКСТ (Goal & Target Benchmark)
         ========================================================================= */}
      <div className="rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-borderline/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-denim/20 text-denim-700 text-xs font-bold">
              01
            </span>
            <h2 className="font-display font-bold text-base text-navy dark:text-white">
              Мета навчання та Професійний контекст
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-tangerine">
            Ціль: {curriculum.targetCriteria.metricName} {curriculum.targetCriteria.targetValue}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <p className="text-sm font-medium text-navy dark:text-white leading-relaxed">
              {curriculum.goal}
            </p>
            <p className="text-xs text-gray-500 dark:text-dark-muted">
              {curriculum.targetCriteria.description}
            </p>
          </div>

          <div className="md:col-span-4 rounded-xl border border-borderline bg-cloud/40 p-4 text-center dark:border-dark-border dark:bg-dark-bg">
            <span className="text-[10px] font-bold uppercase text-gray-400">Цільовий критерій успіху</span>
            <div className="font-display font-black text-xl text-denim-700 dark:text-denim mt-1">
              {curriculum.targetCriteria.targetValue}
            </div>
            <span className="text-[10px] text-gray-500">{curriculum.targetCriteria.metricName}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STEP 2: ІНТУЇЦІЯ ТА КОРОТКЕ ПОЯСНЕННЯ (Concept & Intuition)
         ========================================================================= */}
      <div className="rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-borderline/60 pb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tangerine/20 text-tangerine text-xs font-bold">
            02
          </span>
          <h2 className="font-display font-bold text-base text-navy dark:text-white">
            Інтуїція та Концептуальне пояснення
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-gray-700 dark:text-dark-muted leading-relaxed">
          {curriculum.conceptSummary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {curriculum.intuitionBullets.map((bullet, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-borderline bg-cloud/30 p-3.5 text-xs text-navy dark:border-dark-border dark:bg-dark-bg/40 dark:text-dark-text flex items-start gap-2"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          STEP 3: ІНТЕРАКТИВНА ПРАКТИКА (Tri-Mode Workspace)
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              03
            </span>
            <h2 className="font-display font-bold text-base text-navy dark:text-white">
              Інтерактивна практика ({studioMode.toUpperCase()} MODE)
            </h2>
          </div>
          <span className="text-xs text-gray-400">100% реальний PyTorch/scikit-learn бекенд</span>
        </div>

        {/* AI MENTOR VIEW OVERLAY */}
        {studioMode === "mentor" && (
          <div className="rounded-2xl border border-tangerine/40 bg-gradient-to-br from-orange-50/40 via-white to-orange-50/20 p-6 shadow-sm dark:border-tangerine/30 dark:bg-dark-surface space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tangerine text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy dark:text-white">
                  AI-наставник: Допомога у підборі параметрів та виправленні помилок
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-dark-muted">
                  Запитайте пораду або скористайтеся швидкими підказками нижче:
                </p>
              </div>
            </div>

            {quickPrompts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMentorGoal(qp);
                      handleAskMentor(qp);
                    }}
                    className="rounded-full border border-borderline bg-white px-3 py-1 text-xs text-navy hover:border-tangerine hover:text-tangerine dark:border-dark-border dark:bg-dark-bg dark:text-dark-text transition"
                  >
                    💡 {qp}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={mentorGoal}
                onChange={(e) => setMentorGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskMentor()}
                placeholder="Наприклад: Як збалансувати Precision і Recall або зменшити перенавчання?"
                className="flex-1 rounded-xl border border-borderline bg-white px-4 py-2.5 text-xs text-navy focus:border-tangerine focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white font-medium"
              />
              <button
                onClick={() => handleAskMentor()}
                disabled={mentorLoading || !mentorGoal.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-tangerine px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {mentorLoading ? "Аналіз..." : "Запитати"}
              </button>
            </div>

            {mentorData && (
              <div className="rounded-xl border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-bg space-y-3">
                <p className="text-xs text-navy dark:text-white leading-relaxed">
                  {mentorData.explanation}
                </p>
                {mentorData.diagnostic_tips?.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-600 dark:text-dark-muted space-y-1">
                    {mentorData.diagnostic_tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                )}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={applyMentorParams}
                    className="inline-flex items-center gap-2 rounded-xl bg-denim px-5 py-2 text-xs font-bold text-white shadow hover:bg-denim-600 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-tangerine" />
                    Застосувати параметри та запустити
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ENGINEERING VIEW OVERLAY */}
        {studioMode === "engineering" && (
          <div className="rounded-2xl border border-borderline bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-purple-600" />
                <h3 className="font-display font-bold text-sm text-navy dark:text-white">
                  Виробничий код (Python / PyTorch & cURL)
                </h3>
              </div>

              <button
                onClick={() => {
                  const codeSnippet = `# AI Engineering Academy Reproduction Script\nfrom backend.app.engines import dispatcher\nimport asyncio\n\nasync def run():\n    res = await dispatcher.dispatch_lab_execution("${lab.slug}", ${JSON.stringify(activeParams, null, 2)})\n    print(res["metrics"])\n\nasyncio.run(run())`;
                  navigator.clipboard.writeText(codeSnippet);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-borderline px-3 py-1.5 text-xs text-navy hover:border-purple-600 dark:border-dark-border dark:text-white transition"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode ? "Скопійовано" : "Скопіювати Python"}</span>
              </button>
            </div>

            <pre className="rounded-xl border border-borderline bg-gray-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
{`# Відтворюваний інженерний запуск: ${lab.title}
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
          </div>
        )}

        {/* Specialized Domain Workspace */}
        <div className="rounded-2xl border border-borderline bg-white p-6 shadow-xs dark:border-dark-border dark:bg-dark-surface">
          {renderSpecializedWorkspace()}
        </div>
      </div>

      {/* =========================================================================
          STEP 4: СПРАВЖНІЙ РЕЗУЛЬТАТ & МЕТРИКИ (Results & Performance Deck)
         ========================================================================= */}
      {currentRun && (
        <div className="rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                04
              </span>
              <h2 className="font-display font-bold text-base text-navy dark:text-white">
                Результати виконання на обчислювальному ядрі
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-500">
              Виконано за {currentRun.resource_usage?.cpu_seconds?.toFixed(3) || "0.024"}s на CPU
            </span>
          </div>

          {currentRun.metrics && Object.keys(currentRun.metrics).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(currentRun.metrics).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-xl border border-borderline bg-cloud/30 p-3.5 dark:border-dark-border dark:bg-dark-bg"
                >
                  <div className="text-[11px] font-mono text-gray-500 truncate">
                    {k.replace(/_/g, " ")}
                  </div>
                  <div className="mt-1 text-base sm:text-lg font-bold font-mono text-navy dark:text-white">
                    {typeof v === "number" ? v.toFixed(4) : String(v)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STEP 5: АНАЛІЗ ПОМИЛОК ТА ДІАГНОСТИКА (Error Analysis & Guidance)
         ========================================================================= */}
      {currentRun && (
        <div className="rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-borderline/60 pb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
              05
            </span>
            <h2 className="font-display font-bold text-base text-navy dark:text-white">
              Аналіз помилок та Інженерна діагностика
            </h2>
          </div>

          <div className="space-y-3">
            {curriculum.diagnosticTips.map((tip, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-borderline bg-cloud/20 p-4 dark:border-dark-border dark:bg-dark-bg/40 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-tangerine">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Умова діагностики: {tip.condition}</span>
                </div>
                <p className="text-xs text-navy dark:text-white font-medium">
                  <strong>Суть дефекту:</strong> {tip.diagnosis}
                </p>
                <p className="text-xs text-gray-600 dark:text-dark-muted">
                  <strong>Інженерна рекомендація:</strong> {tip.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 6: ПЕРЕВІРКА ЗНАНЬ (Knowledge Check Mini-Quiz +25 XP)
         ========================================================================= */}
      <div className="rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              06
            </span>
            <h2 className="font-display font-bold text-base text-navy dark:text-white">
              Перевірка знань за результатами практики
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600">+25 XP за правильну відповідь</span>
        </div>

        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-navy dark:text-white">
            {curriculum.quiz.question}
          </p>

          <div className="space-y-2">
            {curriculum.quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => !quizSubmitted && setSelectedQuizOption(idx)}
                  disabled={quizSubmitted}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                    isSelected
                      ? "border-denim bg-denim/10 text-navy font-bold dark:bg-denim/20 dark:text-white"
                      : "border-borderline bg-cloud/20 text-gray-700 hover:border-denim/60 dark:border-dark-border dark:bg-dark-bg/40 dark:text-dark-text"
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-denim" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleQuizSubmit}
              disabled={selectedQuizOption === null || quizSubmitted}
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy-800 transition disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Підтвердити відповідь</span>
            </button>

            {quizSubmitted && (
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                  quizCorrect ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {quizCorrect ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Правильно! +{quizXpAwarded} XP нараховано до вашого профілю.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Не зовсім. {curriculum.quiz.explanation}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          STEP 7: НАСТУПНИЙ КРОК (Next Step, Living Project & Career)
         ========================================================================= */}
      <div className="rounded-2xl border-2 border-denim/40 bg-gradient-to-r from-denim/15 via-white to-white p-6 sm:p-8 dark:from-denim/10 dark:via-dark-surface dark:to-dark-surface dark:border-denim/30 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-borderline/60 pb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tangerine text-white text-xs font-bold">
            07
          </span>
          <h2 className="font-display font-bold text-base text-navy dark:text-white">
            Наступний крок вашого професійного розвитку
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h3 className="font-display font-bold text-lg text-navy dark:text-white">
              {curriculum.nextStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted">
              {curriculum.nextStep.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {currentRun && (
              <button
                onClick={handleSaveToProject}
                className="inline-flex items-center gap-1.5 rounded-xl border border-borderline bg-white px-4 py-2.5 text-xs font-bold text-navy hover:border-denim dark:border-dark-border dark:bg-dark-bg dark:text-white transition shadow-xs"
              >
                <FolderPlus className="h-4 w-4 text-denim" />
                <span>Зберегти в Living Project</span>
              </button>
            )}

            <Link
              href="/solve"
              className="inline-flex items-center gap-1.5 rounded-xl border border-borderline bg-white px-4 py-2.5 text-xs font-bold text-navy hover:border-tangerine dark:border-dark-border dark:bg-dark-bg dark:text-white transition shadow-xs"
            >
              <Zap className="h-4 w-4 text-tangerine" />
              <span>Вирішити аварію у Solve</span>
            </Link>

            <Link
              href={curriculum.nextStep.href}
              className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-5 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition"
            >
              <span>{curriculum.nextStep.actionLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Advanced Logs Drawer */}
      <div className="rounded-xl border border-borderline bg-white dark:border-dark-border dark:bg-dark-surface overflow-hidden">
        <button
          onClick={() => setShowAdvancedLogs(!showAdvancedLogs)}
          className="flex w-full items-center justify-between p-4 text-xs font-semibold text-gray-500 hover:text-navy dark:text-dark-muted dark:hover:text-white transition"
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-400" />
            <span>Інженерний журнал виконання та історія запусків ({runHistory.length})</span>
          </div>
          {showAdvancedLogs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showAdvancedLogs && (
          <div className="border-t border-borderline p-4 dark:border-dark-border space-y-4 bg-cloud/20 dark:bg-dark-bg">
            <div className="rounded-xl border border-borderline bg-gray-950 p-3 font-mono text-xs text-emerald-400 space-y-1 max-h-48 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, idx) => <div key={idx}>{log}</div>)
              ) : (
                <div className="text-gray-500">// Логи відсутні. Запустіть завдання для створення записів.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
