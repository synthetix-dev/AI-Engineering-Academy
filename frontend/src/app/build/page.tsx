"use client";

import React from "react";
import Link from "next/link";
import {
  Hammer,
  Cpu,
  Layers,
  Bot,
  GitBranch,
  Sparkles,
  ArrowRight,
  Database,
  Sliders,
  Play,
  CheckCircle2,
} from "lucide-react";

export default function BuildHubPage() {
  const builders = [
    {
      slug: "neural-builder-lab",
      title: "Конструктор нейромереж (Neural Architecture Builder)",
      tagline: "Створюйте та навчайте багатошарові перцептрони (MLP) на PyTorch без бойлерплейту",
      category: "Deep Learning",
      icon: Cpu,
      color: "text-denim bg-blue-50 dark:bg-blue-950/40",
      features: [
        "Візуальне конструювання шарів: Linear(16) → ReLU → Linear(8)",
        "Підбір темпу навчання (Learning Rate) та розміру батчу",
        "Жива крива функції втрат (Training vs Validation Loss)"
      ],
      estimated_time: "10 хв",
      level: "Intermediate",
    },
    {
      slug: "rag-builder-inspection",
      title: "Асемблер RAG-конвеєрів (RAG Pipeline Studio)",
      tagline: "Збирайте гібридний пошук із PostgreSQL pgvector, оцінюйте Groundedness та чанкінг",
      category: "Generative AI",
      icon: Database,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40",
      features: [
        "Семантичний векторний пошук у базі pgvector",
        "Регулювання top_k та порогу косинусної схожості",
        "Автоматична перевірка обґрунтованості відповіді без галюцинацій"
      ],
      estimated_time: "15 хв",
      level: "Intermediate",
    },
    {
      slug: "agent-sandbox-lab",
      title: "Студія автономних агентів (AI Agent ReAct Builder)",
      tagline: "Підключайте інструменти та створюйте агентів із міркуванням Thought-Action-Observation",
      category: "Autonomous Agents",
      icon: Bot,
      color: "text-tangerine bg-orange-50 dark:bg-orange-950/40",
      features: [
        "Підключення інструментів: Web Search, Калькулятор, Python Sandbox",
        "Покроковий лог мислення агента (ReAct loop)",
        "Перевірка досягнення цілей без зациклень"
      ],
      estimated_time: "12 хв",
      level: "Advanced",
    },
    {
      slug: "workflow-dag-lab",
      title: "Композитор автоматизованих DAG (Pipeline Workflow)",
      tagline: "Оркеструйте конвеєри обробки даних та перевірки якості моделей",
      category: "Automation & MLOps",
      icon: GitBranch,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
      features: [
        "Топологічне виконання без циклічних блокувань",
        "Послідовність: Ingest → Validate → Train → Evaluate → Export",
        "Моніторинг статусів кожного вузла в реальному часі"
      ],
      estimated_time: "10 хв",
      level: "Intermediate",
    },
    {
      slug: "cpu-lora-finetuning-lab",
      title: "Студія донавчання LoRA (PEFT Fine-Tuning Studio)",
      tagline: "Оптимізуйте та донавчайте моделі з низькоранговою матричною адаптацією W + B*A",
      category: "Fine-Tuning",
      icon: Sliders,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
      features: [
        "Налаштування рангу розкладу r (4, 8, 16) та коефіцієнта alpha",
        "Розрахунок зменшення кількості параметрів (до 99.6% економії)",
        "Оцінка зниження похибки без втрати вихідних знань"
      ],
      estimated_time: "20 хв",
      level: "Advanced",
    },
    {
      slug: "prompt-lab-evaluator",
      title: "Конструктор промптів та оцінювання (Prompt Studio)",
      tagline: "Розробляйте системні промпти, додавайте змінні та запускайте пакетні тести",
      category: "Prompt Engineering",
      icon: Sparkles,
      color: "text-pink-600 bg-pink-50 dark:bg-pink-950/40",
      features: [
        "Шаблонізація системних інструкцій та Few-Shot прикладів",
        "Пакетне тестування на 8+ граничних тест-кейсах",
        "Оцінка за рубриками: Instruction Adherence та відсутність токсичності"
      ],
      estimated_time: "8 хв",
      level: "Starter",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Pillar Header */}
      <div className="rounded-2xl border border-borderline bg-gradient-to-br from-white via-orange-50/20 to-white p-6 sm:p-8 dark:border-dark-border dark:bg-gradient-to-br dark:from-dark-surface dark:via-dark-bg/60 dark:to-dark-surface shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-tangerine/30 bg-orange-50 px-3 py-1 text-xs font-semibold text-tangerine dark:bg-orange-950/40">
            <Hammer className="h-3.5 w-3.5" />
            02. Build — Створюй реальні AI-системи
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-graphite dark:text-dark-text">
            Візуальні конструктори та інженерні студії
          </h1>

          <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
            Створюйте працюючі нейромережі, RAG-конвеєри з pgvector, ReAct-агентів та автоматизовані пайплайни.
            Працюйте через інтуїтивні візуальні інструменти з можливістю будь-якої миті переключитися в код (Engineering Mode) або викликати AI-наставника.
          </p>
        </div>
      </div>

      {/* Grid of Builders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {builders.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.slug}
              className="flex flex-col justify-between rounded-xl border border-borderline bg-white p-6 shadow-sm hover:border-tangerine hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${b.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded dark:bg-dark-bg dark:text-dark-muted">
                      {b.level}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      ⏱ {b.estimated_time}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-tangerine uppercase tracking-wider">
                    {b.category}
                  </span>
                  <h3 className="text-base font-bold text-graphite dark:text-dark-text mt-0.5">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-dark-muted mt-1 leading-relaxed">
                    {b.tagline}
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-1.5 pt-2 border-t border-borderline/60 dark:border-dark-border/60">
                  {b.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-dark-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-borderline/80 dark:border-dark-border/80 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-dark-muted font-mono">
                  Обчислення: CPU-real
                </span>
                <Link
                  href={`/labs/${b.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-tangerine px-4 py-2 text-xs font-semibold text-white shadow hover:opacity-90 transition"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Відкрити конструктор
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
