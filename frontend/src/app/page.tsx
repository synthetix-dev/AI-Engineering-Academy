"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Hammer,
  Compass,
  Target,
  Briefcase,
  ArrowRight,
  Play,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  Layers,
  Cpu,
  Activity,
  Zap,
  Code2,
  Bot,
  HelpCircle,
  ChevronDown,
  Terminal,
  Database,
  ExternalLink,
  Lock,
  Flame,
  LayoutGrid
} from "lucide-react";
import OrangeFlower from "@/components/brand/OrangeFlower";
import PersonalCabinet from "@/components/dashboard/PersonalCabinet";
import { getTracks, getTelemetry, getProjects, Track, TelemetryData, ProjectItem } from "@/lib/api";

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // View Mode: 'landing' (presentation) or 'cabinet' (workspace)
  const [viewMode, setViewMode] = useState<"landing" | "cabinet">("landing");

  // Interactive Learning Cycle Demo Active Step
  const [activeCycleStep, setActiveCycleStep] = useState(0);

  // Interactive Tri-Mode Demo Tab
  const [activeTriMode, setActiveTriMode] = useState<"visual" | "mentor" | "code">("visual");

  // FAQ Accordion Active Index
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Filter for 20 modules
  const [moduleFilter, setModuleFilter] = useState<string>("All");

  useEffect(() => {
    Promise.all([
      getTracks().catch(() => []),
      getTelemetry().catch(() => null),
      getProjects().catch(() => []),
    ]).then(([tracksData, telemData, projectsData]) => {
      setTracks(tracksData);
      setTelemetry(telemData);
      setProjects(projectsData);
      setLoading(false);
    });
  }, []);

  const cycleSteps = [
    {
      num: "01",
      title: "Теорія та контекст",
      desc: "Короткий математичний і системний контекст: як працює алгоритм під капотом без зайвої води.",
      pill: "Математичні засади",
      color: "border-denim/40 bg-denim/10 text-denim-700",
    },
    {
      num: "02",
      title: "Налаштування параметрів",
      desc: "Змінюйте темп навчання, оптимізатор, кількість шарів або поріг косинусної схожості.",
      pill: "Гіперпараметри",
      color: "border-tangerine/40 bg-tangerine/10 text-tangerine-700",
    },
    {
      num: "03",
      title: "Справжній розрахунок",
      desc: "Натискання «Запустити» викликає реальний PyTorch/scikit-learn бекенд на CPU/MPS воркері.",
      pill: "PyTorch Backend",
      color: "border-indigo-400 bg-indigo-50 text-indigo-700",
    },
    {
      num: "04",
      title: "Аналіз помилки",
      desc: "Вибух градієнта чи перенавчання? Графік і метрики наочно показують реальну проблему.",
      pill: "Loss & Metrics",
      color: "border-rose-400 bg-rose-50 text-rose-700",
    },
    {
      num: "05",
      title: "Виправлення інженерного дефекту",
      desc: "Застосовуйте Gradient Clipping, Dropout, зміну чанкінгу або виправлення промпту.",
      pill: "Інженерія рішень",
      color: "border-amber-400 bg-amber-50 text-amber-700",
    },
    {
      num: "06",
      title: "Криптографічний доказ",
      desc: "Успішний результат хешується з trace_id і записується до бази даних PostgreSQL.",
      pill: "Proof of Skill",
      color: "border-emerald-400 bg-emerald-50 text-emerald-700",
    },
    {
      num: "07",
      title: "Артефакт у резюме",
      desc: "Згенерований код і верифіковані метрики автоматично додаються до вашого портфоліо.",
      pill: "GitHub Export",
      color: "border-teal-400 bg-teal-50 text-teal-700",
    },
  ];

  const faqItems = [
    {
      q: "Чи дійсно платформа на 100% безкоштовна і без платних API?",
      a: "Так. Ми принципово не використовуємо платного API (OpenAI, Anthropic тощо) чи платних підписок. Усі обчислення виконуються на відкритому стеку: PyTorch CPU/MPS, PostgreSQL pgvector, scikit-learn, ONNX Runtime. Ви можете навчатися повністю безкоштовно або запускати платформу локально через Docker.",
    },
    {
      q: "Які мінімальні технічні вимоги до комп'ютера?",
      a: "Будь-який сучасний ноутбук або ПК з 4 ГБ оперативної пам'яті. Оскільки важкі математичні обчислення оптимізовані або виконуються на бекенд-сервері платформи, вам потрібен лише звичайний сучасний веббраузер.",
    },
    {
      q: "Чим AI Engineering Academy відрізняється від звичайних курсів з відео?",
      a: "Ми не показуємо пасивні 50-годинні відеолекції. Навчання відбувається за циклом «Вивчив → Змінив параметри → Отримав результат → Зробив помилку → Виправив». Ви взаємодієте з живими моделями, ловите реальні помилки перенавчання та дивергенції, будуєте робочі RAG-системи.",
    },
    {
      q: "Як підтверджуються мої результати перед роботодавцями?",
      a: "Кожен успішний розрахунок і вирішена місія отримують унікальний криптографічний хеш і trace_id у PostgreSQL. Ви отримуєте публічну сторінку портфоліо з верифікованими метриками, кодом та можливістю експортувати проєкт у GitHub.",
    },
    {
      q: "Чи підходить платформа для початківців?",
      a: "Так. Навчання починається з фундаментальних математичних понять (вектори, матриці, градієнтний спуск), де кожен крок візуалізований. Завдяки трьом режимам (Visual, AI Mentor, Engineering) ви можете починати з візуальних слайдерів і поступово переходити до чистого коду.",
    },
    {
      q: "Які спеціалізації охоплює академія?",
      a: "Платформа готує фахівців за чотирма основними траєкторіями: AI Systems Engineer, Machine Learning Engineer, LLM & RAG Application Engineer, MLOps & Production AI Engineer.",
    },
  ];

  // If user chooses personal cabinet workspace view:
  if (viewMode === "cabinet") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Switcher Top Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-borderline dark:border-dark-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Режим перегляду:</span>
            <div className="inline-flex rounded-lg border border-borderline bg-white p-1 dark:border-dark-border dark:bg-dark-surface">
              <button
                onClick={() => setViewMode("landing")}
                className="px-3 py-1 text-xs font-semibold rounded text-gray-600 hover:text-navy dark:text-dark-muted dark:hover:text-white"
              >
                Презентація платформи
              </button>
              <button
                onClick={() => setViewMode("cabinet")}
                className="px-3 py-1 text-xs font-bold rounded bg-denim text-white shadow-xs"
              >
                Особистий кабінет
              </button>
            </div>
          </div>

          <Link
            href="/tracks"
            className="text-xs font-semibold text-tangerine hover:underline flex items-center gap-1"
          >
            <span>До каталогу курсів</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <PersonalCabinet />
      </div>
    );
  }

  // Filtered tracks for the 20-module showcase
  const filteredTracks =
    moduleFilter === "All"
      ? tracks
      : tracks.filter((t) => {
          if (moduleFilter === "Foundations") return t.order <= 5;
          if (moduleFilter === "CoreML") return t.order > 5 && t.order <= 10;
          if (moduleFilter === "GenAI") return t.order > 10 && t.order <= 15;
          if (moduleFilter === "Production") return t.order > 15;
          return true;
        });

  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 1: HERO SECTION (Bold Editorial, #6DA2E4 Banner, Orange Flower)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-denim text-white pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-navy/20">
        {/* Subtle retro grain texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0D2238_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top mode switch pill */}
          <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-xs font-bold backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-tangerine animate-pulse" />
              <span>100% ВІДКРИТА ПЛАТФОРМА · БЕЗ ПЛАТНИХ API</span>
            </div>

            <div className="hidden sm:inline-flex items-center rounded-lg border border-white/30 bg-white/10 p-1 backdrop-blur-sm text-xs">
              <button
                onClick={() => setViewMode("landing")}
                className="px-3 py-1 font-bold rounded bg-white text-navy shadow-sm transition"
              >
                Лендинг
              </button>
              <button
                onClick={() => setViewMode("cabinet")}
                className="px-3 py-1 font-semibold rounded text-white/90 hover:text-white transition"
              >
                Особистий кабінет
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left text column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white drop-shadow-xs">
                BUILD YOUR <br />
                <span className="text-navy">AI FUTURE</span>
              </h1>

              <p className="text-base sm:text-xl font-medium text-white/95 max-w-2xl leading-relaxed">
                Перша відкрита інтерактивна платформа підготовки AI Engineer, ML Engineer та MLOps.
                Справжні обчислення на відкритих технологіях без платних API та декоративних симуляцій.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-7 py-3.5 text-sm sm:text-base font-extrabold text-white shadow-lg hover:bg-tangerine-600 transition-all transform active:scale-95"
                >
                  <Zap className="h-5 w-5" />
                  <span>Почати безкоштовно</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-navy/40 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm sm:text-base font-bold text-navy backdrop-blur-xs transition-colors"
                >
                  <span>Як це працює</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <button
                  onClick={() => setViewMode("cabinet")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-white underline underline-offset-4 transition-colors"
                >
                  Увійти в кабінет →
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-white/20 text-xs">
                <div>
                  <div className="font-display font-black text-lg text-white">20</div>
                  <div className="text-white/80 text-[11px]">Навчальних дисциплін</div>
                </div>
                <div>
                  <div className="font-display font-black text-lg text-white">0 ₴</div>
                  <div className="text-white/80 text-[11px]">Жодних платних API</div>
                </div>
                <div>
                  <div className="font-display font-black text-lg text-white">100%</div>
                  <div className="text-white/80 text-[11px]">Реальний PyTorch/CPU</div>
                </div>
              </div>
            </div>

            {/* Right graphic column (5 cols): The Signature Orange Flower Anchor */}
            <div className="lg:col-span-5 flex items-center justify-center relative py-6">
              <div className="relative p-6 sm:p-10 flex items-center justify-center">
                {/* Visual back circle glow */}
                <div className="absolute h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-white/20 blur-2xl" />

                {/* The Flat Geometric Orange Flower SVG */}
                <div className="relative transform hover:rotate-6 transition-transform duration-500">
                  <OrangeFlower size={260} withRetroTexture className="filter drop-shadow-2xl" />
                </div>

                {/* Editorial floating note */}
                <div className="absolute -bottom-2 -left-2 sm:bottom-2 sm:left-2 rounded-xl bg-white p-3.5 text-navy shadow-xl border border-navy/10 text-xs font-semibold max-w-[200px] hidden sm:block">
                  <div className="flex items-center gap-1.5 text-tangerine text-[11px] font-bold uppercase">
                    <Sparkles className="h-3 w-3" /> Живі системи
                  </div>
                  Символ росту, інтелекту та відкритого коду
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ЯК ПРАЦЮЄ НАВЧАННЯ (The 7-Step Closed Learning Cycle)
         ========================================================================= */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white dark:bg-dark-surface border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-denim/30 bg-cloud px-3 py-1 text-xs font-bold text-denim-700 dark:bg-denim/10 dark:text-denim">
              <Activity className="h-3.5 w-3.5" />
              Методологія глибокої інженерії
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
              Як працює практичне навчання
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted leading-relaxed">
              Жодних пасивних лекцій чи імітацій. Ви вчитеся так, як працюють інженери в провідних лабораторіях: через реальні обчислення, помилки градієнта та виправлення архітектур.
            </p>
          </div>

          {/* Interactive Cycle Flow */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {cycleSteps.map((step, idx) => {
              const isSelected = activeCycleStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveCycleStep(idx)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-tangerine bg-orange-50/40 shadow-md ring-2 ring-tangerine/30 dark:bg-dark-bg dark:border-tangerine"
                      : "border-borderline bg-cloud/40 hover:bg-white dark:border-dark-border dark:bg-dark-bg/40"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-xs text-gray-400">
                        {step.num}
                      </span>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-tangerine" />
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xs text-navy dark:text-white leading-tight">
                      {step.title}
                    </h3>
                  </div>

                  <div className="mt-3">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold border ${step.color}`}>
                      {step.pill}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Step Highlighted Detail Card */}
          <div className="rounded-2xl border border-borderline bg-cloud/60 p-6 sm:p-8 dark:border-dark-border dark:bg-dark-bg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-tangerine uppercase tracking-wider">
                <span>Крок {cycleSteps[activeCycleStep].num} детально:</span>
                <span className="font-normal text-gray-500">•</span>
                <span>{cycleSteps[activeCycleStep].pill}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-navy dark:text-white">
                {cycleSteps[activeCycleStep].title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
                {cycleSteps[activeCycleStep].desc}
              </p>
            </div>

            <Link
              href="/tracks"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-navy-800 transition shrink-0"
            >
              <span>Спробувати в дії</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 5 ПІЛАРІВ (Learn · Build · Explore · Solve · Career)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cloud dark:bg-dark-bg border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-tangerine/30 bg-orange-50 px-3 py-1 text-xs font-bold text-tangerine dark:bg-orange-950/40">
              <LayoutGrid className="h-3.5 w-3.5" />
              Архітектура AI Engineering Studio
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
              П&apos;ять вимірів вашого інженерного зростання
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted leading-relaxed">
              Платформа організована навколо п&apos;яти ключових взаємопов&apos;язаних режимів для всебічної підготовки:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Learn */}
            <div className="group rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs hover:border-denim hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-denim-700 dark:bg-blue-950/40 dark:border-blue-900/40">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">01. Track</span>
                  <h3 className="text-xl font-display font-bold text-navy dark:text-white mt-1">Learn</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                  20 послідовних навчальних дисциплін від вищої математики й PyTorch до LLM-агентів та MLOps.
                </p>
              </div>
              <Link href="/tracks" className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-denim hover:text-denim-700">
                <span>Каталог курсів</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Build */}
            <div className="group rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs hover:border-tangerine hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-tangerine dark:bg-orange-950/40 dark:border-orange-900/40">
                  <Hammer className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">02. Construct</span>
                  <h3 className="text-xl font-display font-bold text-navy dark:text-white mt-1">Build</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                  Візуальні конструктори архітектур: MLP, гібридний RAG з pgvector, ReAct-агенти та пайплайни.
                </p>
              </div>
              <Link href="/build" className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-tangerine hover:opacity-80">
                <span>Студія систем</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Explore */}
            <div className="group rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 dark:bg-purple-950/40 dark:border-purple-900/40">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">03. Sandbox</span>
                  <h3 className="text-xl font-display font-bold text-navy dark:text-white mt-1">Explore</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                  Інтерактивні пісочниці для дослідження функцій активацій, латентних просторів та ваг моделей.
                </p>
              </div>
              <Link href="/explore" className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:opacity-80">
                <span>Пісочниці ваг</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Solve */}
            <div className="group rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900/40">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">04. Challenge</span>
                  <h3 className="text-xl font-display font-bold text-navy dark:text-white mt-1">Solve</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                  Інженерні виклики та ліквідація продакшен-інцидентів: data drift, дивергенція, галюцинації RAG.
                </p>
              </div>
              <Link href="/solve" className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:opacity-80">
                <span>Вирішувати баги</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Career */}
            <div className="group rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/40">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">05. Career</span>
                  <h3 className="text-xl font-display font-bold text-navy dark:text-white mt-1">Career</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                  Чотири готові кар&apos;єрні траєкторії, симуляція технічних інтерв&apos;ю та верифіковане резюме інженера.
                </p>
              </div>
              <Link href="/career-paths" className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:opacity-80">
                <span>Кар&apos;єрні треки</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ОСНОВНІ НАПРЯМИ AI ENGINEERING (20 Modules Showcase)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white dark:bg-dark-surface border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-denim/30 bg-cloud px-3 py-1 text-xs font-bold text-denim-700 dark:bg-denim/10 dark:text-denim">
                <BookOpen className="h-3.5 w-3.5" />
                Повний навчальний цикл
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
                20 модульних дисциплін AI Engineering
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted">
                Кожен модуль містить інтерактивну лабораторію з реальною базою даних та математичним ядром.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { label: "Всі (20)", val: "All" },
                { label: "Фундамент (1-5)", val: "Foundations" },
                { label: "ML & Deep Learning (6-10)", val: "CoreML" },
                { label: "LLM, RAG & Agents (11-15)", val: "GenAI" },
                { label: "MLOps & Capstone (16-20)", val: "Production" },
              ].map((f) => (
                <button
                  key={f.val}
                  onClick={() => setModuleFilter(f.val)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    moduleFilter === f.val
                      ? "bg-navy text-white border-navy dark:bg-white dark:text-navy"
                      : "border-borderline bg-cloud hover:bg-white text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTracks.slice(0, 12).map((t) => (
              <Link
                key={t.id}
                href={`/tracks/${t.slug}`}
                className="group rounded-xl border border-borderline bg-cloud/30 p-5 hover:bg-white hover:border-denim hover:shadow-md dark:border-dark-border dark:bg-dark-bg/50 dark:hover:bg-dark-surface transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-denim-700 dark:text-denim">
                      #{String(t.order).padStart(2, "0")}
                    </span>
                    <span className="rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-500 border border-borderline dark:bg-dark-surface dark:border-dark-border">
                      {t.courses?.[0]?.level || (t.order <= 5 ? "Starter" : t.order <= 15 ? "Intermediate" : "Advanced")}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-navy dark:text-white group-hover:text-denim-600 transition-colors line-clamp-2">
                    {t.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-dark-muted line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-borderline/60 dark:border-dark-border/60 flex items-center justify-between text-[11px] text-gray-500">
                  <span className="font-mono">v{t.version}</span>
                  <span className="font-semibold text-navy group-hover:text-tangerine transition-colors">
                    Відкрити →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/tracks"
              className="inline-flex items-center gap-2 rounded-xl border border-borderline bg-cloud px-6 py-3 text-xs font-bold text-navy hover:bg-white dark:border-dark-border dark:bg-dark-bg dark:text-white transition shadow-xs"
            >
              <span>Переглянути повну програму всіх 20 напрямів</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: ТРИ РЕЖИМИ НАВЧАННЯ (Tri-Mode Interactive Showcase)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cloud dark:bg-dark-bg border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              Гнучкість інструментів (Tri-Mode)
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
              Один процес — три інженерні перспективи
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted leading-relaxed">
              Кожна лабораторія платформи підтримує три режими. Перемикайтеся між ними на льоту відповідно до ваших поточних завдань:
            </p>
          </div>

          {/* Tri-Mode Selector Tabs */}
          <div className="flex border-b border-borderline dark:border-dark-border gap-4">
            <button
              onClick={() => setActiveTriMode("visual")}
              className={`pb-3 text-sm font-display font-bold border-b-2 transition ${
                activeTriMode === "visual"
                  ? "border-tangerine text-navy dark:text-white"
                  : "border-transparent text-gray-400 hover:text-navy"
              }`}
            >
              1. Visual Mode (Конструктор та Графіки)
            </button>
            <button
              onClick={() => setActiveTriMode("mentor")}
              className={`pb-3 text-sm font-display font-bold border-b-2 transition ${
                activeTriMode === "mentor"
                  ? "border-tangerine text-navy dark:text-white"
                  : "border-transparent text-gray-400 hover:text-navy"
              }`}
            >
              2. AI Mentor Mode (Сократівський наставник)
            </button>
            <button
              onClick={() => setActiveTriMode("code")}
              className={`pb-3 text-sm font-display font-bold border-b-2 transition ${
                activeTriMode === "code"
                  ? "border-tangerine text-navy dark:text-white"
                  : "border-transparent text-gray-400 hover:text-navy"
              }`}
            >
              3. Engineering Mode (PyTorch & cURL)
            </button>
          </div>

          {/* Tri-Mode Showcase Content Container */}
          <div className="rounded-2xl border border-borderline bg-white p-6 sm:p-8 dark:border-dark-border dark:bg-dark-surface shadow-xs">
            {activeTriMode === "visual" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="rounded bg-denim/10 text-denim-700 text-xs font-bold px-2.5 py-1">
                    Інтуїтивна наочність
                  </span>
                  <h3 className="text-2xl font-display font-bold text-navy dark:text-white">
                    Керуйте гіперпараметрами та бачте живу реакцію мережі
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
                    Слайдери темпу навчання (Learning Rate), вибір оптимізатора (Adam, SGD), зміна кількості шарів MLP та інтерактивні графіки функції втрат (Loss curve). Ніяких чорних ящиків.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-700 dark:text-dark-muted">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Графік Training Loss vs Validation Loss у реальному часі</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Візуалізація латентного простору 2D/3D через PCA</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-7 rounded-xl border border-borderline bg-cloud/50 p-5 dark:border-dark-border dark:bg-dark-bg font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-borderline pb-2 dark:border-dark-border text-gray-500">
                    <span>Панель керування PyTorch Engine</span>
                    <span className="text-emerald-600 font-bold">● Active</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span>Learning Rate (η):</span>
                      <span className="font-bold text-navy dark:text-white">0.0100 (Optimal)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Optimizer:</span>
                      <span className="font-bold text-navy dark:text-white">Adam (β1=0.9, β2=0.999)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Batch Size:</span>
                      <span className="font-bold text-navy dark:text-white">32 samples</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-3 dark:bg-gray-700">
                      <div className="h-full bg-tangerine w-4/5 rounded-full" />
                    </div>
                    <div className="text-right text-[10px] text-gray-500">Epoch 45 / 50 (Loss: 0.0841)</div>
                  </div>
                </div>
              </div>
            )}

            {activeTriMode === "mentor" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="rounded bg-orange-50 text-tangerine text-xs font-bold px-2.5 py-1">
                    AI-асистент на базі відкритих моделей
                  </span>
                  <h3 className="text-2xl font-display font-bold text-navy dark:text-white">
                    Сократівський діалог без списування
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
                    AI Ментор не видає готовий код для сліпого копіювання. Він аналізує ваш конкретний запуск, виявляє причину помилки (наприклад, зникаючий градієнт через Sigmoid на глибоких шарах) і ставить навідні запитання.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-700 dark:text-dark-muted">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Пояснення фізичного та математичного сенсу операцій</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Підказки щодо виправлення інженерних багів</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-7 rounded-xl border border-borderline bg-cloud/50 p-5 dark:border-dark-border dark:bg-dark-bg space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-tangerine font-bold text-xs">
                    <Bot className="h-4 w-4" /> AI Mentor (Context-Aware)
                  </div>
                  <div className="rounded-lg bg-white p-3.5 border border-borderline dark:bg-dark-surface dark:border-dark-border text-gray-700 dark:text-dark-text leading-relaxed">
                    «Зверніть увагу на шар 4 вашої нейромережі: градієнт впав до \(10^{-7}\). Яка функція активації там використовується? Якщо це Sigmoid, її похідна не перевищує 0.25. Що станеться, якщо замінити її на ReLU?»
                  </div>
                </div>
              </div>
            )}

            {activeTriMode === "code" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="rounded bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1">
                    Для продакшен-розробників
                  </span>
                  <h3 className="text-2xl font-display font-bold text-navy dark:text-white">
                    Чистий PyTorch, FastAPI та cURL-експорт
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
                    Кожна дія у візуальному інтерфейсі дублюється чистим кодом на Python. Ви можете скопіювати скрипт для локального запуску або відправити cURL-запит прямо у терміналі.
                  </p>
                  <ul className="space-y-2 text-xs text-gray-700 dark:text-dark-muted">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Повна сумісність із локальним середовищем VS Code / PyCharm</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Експорт артефактів та конфігурацій моделі у JSON/TorchScript</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-7 rounded-xl border border-borderline bg-navy p-5 text-cloud font-mono text-[11px] space-y-2 overflow-x-auto shadow-inner">
                  <div className="text-gray-400"># PyTorch Native Execution Script</div>
                  <div className="text-denim">import torch</div>
                  <div className="text-denim">import torch.nn as nn</div>
                  <div className="text-gray-300">model = nn.Sequential(</div>
                  <div className="text-gray-300 pl-4">nn.Linear(16, 64),</div>
                  <div className="text-gray-300 pl-4">nn.ReLU(),</div>
                  <div className="text-gray-300 pl-4">nn.Linear(64, 2)</div>
                  <div className="text-gray-300">)</div>
                  <div className="text-emerald-400">optimizer = torch.optim.Adam(model.parameters(), lr=0.01)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: ШЛЯХ КОРИСТУВАЧА ВІД НОВАЧКА ДО ІНЖЕНЕРА (Roadmap)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white dark:bg-dark-surface border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-denim/30 bg-cloud px-3 py-1 text-xs font-bold text-denim-700 dark:bg-denim/10 dark:text-denim">
              <Zap className="h-3.5 w-3.5" />
              Траєкторія розвитку
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
              Шлях користувача від новачка до інженера
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted leading-relaxed">
              Чітка структурована сходинка розвитку без розривів між теорією та продакшеном:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              {
                step: "01",
                title: "Онбординг та оцінка",
                desc: "Тестування базових знань, вибір кар'єрного треку та налаштування локального оточення.",
              },
              {
                step: "02",
                title: "Перша навчена модель",
                desc: "Розрахунок прямого та зворотного поширення, спостереження за сходженням градієнта.",
              },
              {
                step: "03",
                title: "Перший інцидент",
                desc: "Виявлення перенавчання (overfitting) та data drift у режимі ліквідації аварій.",
              },
              {
                step: "04",
                title: "Наскрізний живий проєкт",
                desc: "Побудова повноцінної системи: гібридний RAG або багатоагентна мережа з pgvector.",
              },
              {
                step: "05",
                title: "Сертифікація та резюме",
                desc: "Криптографічно підтверджене портфоліо та симуляція технічних інтерв'ю.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-borderline bg-cloud/30 p-6 dark:border-dark-border dark:bg-dark-bg/60 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="font-display font-black text-2xl text-tangerine">
                    {s.step}
                  </div>
                  <h3 className="font-display font-bold text-base text-navy dark:text-white mt-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-dark-muted mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="h-1 w-full bg-borderline/80 rounded-full mt-4 dark:bg-dark-border" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: ПРИКЛАДИ РЕАЛЬНИХ ЖИВИХ ПРОЄКТІВ (Living Systems)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cloud dark:bg-dark-bg border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                <FolderGit2 className="h-3.5 w-3.5" />
                Living Production Projects
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
                Реальні наскрізні AI-проєкти
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted">
                Не іграшкові датасети з 10 рядків. Ви будуєте системи промислового зразка:
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-tangerine hover:underline"
            >
              <span>Всі наскрізні проєкти ({projects.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div className="rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-0.5 border border-rose-200">
                  Streaming Classification
                </span>
                <span className="text-xs font-mono text-gray-400">Production</span>
              </div>
              <h3 className="text-lg font-display font-bold text-navy dark:text-white">
                Fraud Detection & Drift Alert System
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                Потокова класифікація транзакцій із визначенням зміщення розподілу даних (Data Drift) через тест Колмогорова-Смірнова.
              </p>
              <div className="pt-2 border-t border-borderline/60 dark:border-dark-border/60 flex items-center justify-between text-xs font-semibold text-denim">
                <span>Стек: Scikit-Learn + KS Test</span>
                <Link href="/projects" className="text-navy dark:text-white hover:text-tangerine">Докладно →</Link>
              </div>
            </div>

            {/* Project 2 */}
            <div className="rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 border border-purple-200">
                  Vector Database RAG
                </span>
                <span className="text-xs font-mono text-gray-400">PostgreSQL</span>
              </div>
              <h3 className="text-lg font-display font-bold text-navy dark:text-white">
                Local Enterprise RAG Pipeline
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                Гібридний семантичний пошук у базі PostgreSQL з розширенням pgvector, чанкінг документів та оцінка галюцинацій (Groundedness).
              </p>
              <div className="pt-2 border-t border-borderline/60 dark:border-dark-border/60 flex items-center justify-between text-xs font-semibold text-denim">
                <span>Стек: pgvector + BGE Small</span>
                <Link href="/projects" className="text-navy dark:text-white hover:text-tangerine">Докладно →</Link>
              </div>
            </div>

            {/* Project 3 */}
            <div className="rounded-2xl border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded bg-orange-50 text-tangerine text-[10px] font-bold px-2.5 py-0.5 border border-orange-200">
                  Autonomous ReAct
                </span>
                <span className="text-xs font-mono text-gray-400">Multi-Agent</span>
              </div>
              <h3 className="text-lg font-display font-bold text-navy dark:text-white">
                Customer Support AI Agent Network
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                Автономна мережа агентів із викликом зовнішніх інструментів, валідацією запитів та захистом від ін&apos;єкцій промптів.
              </p>
              <div className="pt-2 border-t border-borderline/60 dark:border-dark-border/60 flex items-center justify-between text-xs font-semibold text-denim">
                <span>Стек: ReAct + Python Sandbox</span>
                <Link href="/projects" className="text-navy dark:text-white hover:text-tangerine">Докладно →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: ЯК ФОРМУЮТЬСЯ НАВИЧКИ Й ПОРТФОЛІО (Cryptographic Proofs)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white dark:bg-dark-surface border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Proof of Engineering Skill
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
                Доказове портфоліо з криптографічною верифікацією
              </h2>
              <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
                Забудьте про самонаписані сертифікати, які нічого не значать. У нашій академії кожне досягнення підтверджується фактичним виконанням коду.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy dark:text-white">SHA-256 Хешування кожного запуску</h4>
                    <p className="text-[11px] text-gray-500">Вхідні параметри, вихідні метрики та стан моделі записуються до PostgreSQL.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy dark:text-white">Прямий експорт у GitHub-репозиторій</h4>
                    <p className="text-[11px] text-gray-500">Один клік для створення чистого комміту з документацією та кодом вашого проєкту.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy dark:text-white">Публічне резюме інженера</h4>
                    <p className="text-[11px] text-gray-500">Персональне посилання для роботодавців із перевіркою реальних навичок.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-xs font-bold text-white hover:bg-navy-800 transition"
                >
                  <span>Переглянути приклад портфоліо</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual representation of cryptographic certificate card */}
            <div className="lg:col-span-6 rounded-2xl border border-borderline bg-cloud/40 p-6 sm:p-8 dark:border-dark-border dark:bg-dark-bg space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-borderline pb-4 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <OrangeFlower size={22} />
                  <span className="font-display font-bold text-xs text-navy dark:text-white uppercase tracking-wider">
                    Verified Skill Proof
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-500">
                  <span>Candidate:</span>
                  <span className="text-navy dark:text-white font-bold">Dmitro (AI Engineer)</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Track:</span>
                  <span className="text-navy dark:text-white font-bold">Deep Learning Architect</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Trace ID:</span>
                  <span className="text-navy dark:text-white">trace_mission_7b81f9a2e</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Validation Accuracy:</span>
                  <span className="text-emerald-600 font-bold">96.42% (Passed Threshold)</span>
                </div>
              </div>

              <div className="rounded-lg bg-white p-3 border border-borderline dark:bg-dark-surface dark:border-dark-border text-[10px] font-mono text-gray-400 break-all">
                SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: ВІДКРИТІСТЬ І БЕЗКОШТОВНИЙ ДОСТУП (Open Source & Zero API)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-cloud dark:bg-dark-bg border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Lock className="h-3.5 w-3.5" />
              Принцип повної відкритості
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
              100% Open Source · Без підписок і прихованих платежів
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted leading-relaxed">
              Ми створили платформу, яку можна запустити локально на власному комп&apos;ютері навіть без підключення до зовнішнього інтернету:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface space-y-2">
              <div className="font-display font-bold text-sm text-navy dark:text-white">Без платних ключів</div>
              <p className="text-xs text-gray-600 dark:text-dark-muted">
                Не потрібно вводити кредитні картки чи купувати токени сторонніх провайдерів.
              </p>
            </div>
            <div className="rounded-xl border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface space-y-2">
              <div className="font-display font-bold text-sm text-navy dark:text-white">Локальний запуск</div>
              <p className="text-xs text-gray-600 dark:text-dark-muted">
                Один `docker compose up` розгортає повне навчальне середовище на вашому ноутбуці.
              </p>
            </div>
            <div className="rounded-xl border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface space-y-2">
              <div className="font-display font-bold text-sm text-navy dark:text-white">Відкриті ваги</div>
              <p className="text-xs text-gray-600 dark:text-dark-muted">
                Використовуються лише відкриті моделі з ліцензіями Apache 2.0, MIT та OpenRAIL.
              </p>
            </div>
            <div className="rounded-xl border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface space-y-2">
              <div className="font-display font-bold text-sm text-navy dark:text-white">Прозорий код</div>
              <p className="text-xs text-gray-600 dark:text-dark-muted">
                Репозиторій повністю публічний на GitHub. Перевіряйте кожен рядок алгоритмів.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: ПОШИРЕНІ ЗАПИТАННЯ (FAQ Accordion)
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white dark:bg-dark-surface border-b border-borderline dark:border-dark-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-denim/30 bg-cloud px-3 py-1 text-xs font-bold text-denim-700 dark:bg-denim/10 dark:text-denim">
              <HelpCircle className="h-3.5 w-3.5" />
              Відповіді на запитання
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
              Поширені запитання
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-borderline bg-cloud/30 dark:border-dark-border dark:bg-dark-bg/40 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-display font-bold text-navy dark:text-white hover:text-denim transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 shrink-0 transform transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-tangerine" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-600 dark:text-dark-muted leading-relaxed border-t border-borderline/40 dark:border-dark-border/40 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: ФІНАЛЬНИЙ ЗАКЛИК ДО ДІЇ (High-Impact CTA Banner)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-denim text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0D2238_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="flex justify-center">
            <OrangeFlower size={80} className="filter drop-shadow-md" />
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-tight text-white">
            Готові будувати своє <br />
            <span className="text-navy">майбутнє в AI Engineering?</span>
          </h2>

          <p className="text-base sm:text-lg font-medium text-white/95 max-w-2xl mx-auto leading-relaxed">
            Приєднуйтесь до відкритої української спільноти AI-інженерів. Запустіть свою першу модель просто зараз без реєстрації та оплати.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-8 py-4 text-base font-extrabold text-white shadow-xl hover:bg-tangerine-600 transition-all transform active:scale-95"
            >
              <Zap className="h-5 w-5" />
              <span>Почати навчання безкоштовно</span>
            </Link>

            <Link
              href="/tracks"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-navy/30 bg-white/10 hover:bg-white/20 px-6 py-4 text-base font-bold text-navy backdrop-blur-xs transition"
            >
              <span>Переглянути всі модулі</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
