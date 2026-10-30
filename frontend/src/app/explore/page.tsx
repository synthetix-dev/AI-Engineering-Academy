"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  Activity,
  Layers,
  Eye,
  Sliders,
  Play,
  ArrowRight,
  TrendingDown,
  Cpu,
  BarChart2,
  Terminal,
} from "lucide-react";

export default function ExploreHubPage() {
  const sandboxes = [
    {
      slug: "attention-mechanics-lab",
      title: "Механізм уваги (Self-Attention & Softmax)",
      tagline: "Досліджуйте матриці Q, K, V, регулюйте температуру Softmax та спостерігайте фокусування на токенах",
      category: "Generative AI & LLMs",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40",
      explore_knobs: ["Температура Softmax", "Довжина послідовності", "Розмірність d_model"],
      key_insight: "Зниження температури перетворює м'який розподіл Softmax на детермінований argmax.",
    },
    {
      slug: "visual-matrix-gradient-lab",
      title: "Градієнтний спуск та поверхні втрат (Optimization Lab)",
      tagline: "Спостерігайте траєкторію спуску до мінімуму, досліджуйте розбіжність при завищеному Learning Rate",
      category: "Mathematics & AI Core",
      icon: TrendingDown,
      color: "text-denim bg-blue-50 dark:bg-blue-950/40",
      explore_knobs: ["Learning Rate (0.01 - 1.5)", "Кількість ітерацій", "Квадратична / сідлова функція"],
      key_insight: "Аналітичний градієнт точно відповідає границі чисельного приросту з похибкою < 1e-6.",
    },
    {
      slug: "deployment-drift-lab",
      title: "Дрейф даних та KS-тест (Data Drift & Monitoring)",
      tagline: "Зміщуйте розподіл ознак у реальному часі та обчислюйте статистичний p-value Колмогорова-Смірнова",
      category: "MLOps & Monitoring",
      icon: Activity,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
      explore_knobs: ["Рівень значущості alpha", "Зсув розподілу", "Обсяг вибірки інференсу"],
      key_insight: "При p-value < 0.05 нульова гіпотеза про незмінність розподілу відхиляється: модель деградує.",
    },
    {
      slug: "quantization-bench-lab",
      title: "Квантизація та оптимізація пам'яті (INT8 vs FP32)",
      tagline: "Стискайте ваги моделі до INT8, вимірюйте SNR (Signal-to-Noise Ratio) та есціматизуйте RAM",
      category: "Hardware & Efficiency",
      icon: Cpu,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
      explore_knobs: ["Розмір тензора", "Формат вагів (INT8, FP16, FP32)", "Симетричне масштабування"],
      key_insight: "INT8 квантизація забезпечує до 75% економії пам'яті при збереженні високої якості (SNR > 40 dB).",
    },
    {
      slug: "cv-lab",
      title: "Ядра згортки комп'ютерного зору (CV Convolutions)",
      tagline: "Застосовуйте матричні фільтри Sobel, Gaussian blur та Sharpen до 2D-тензорів зображень",
      category: "Computer Vision",
      icon: Eye,
      color: "text-pink-600 bg-pink-50 dark:bg-pink-950/40",
      explore_knobs: ["Тип фільтра", "Розмір ядра (3x3, 5x5)", "Порогова бінаризація країв"],
      key_insight: "Оператор Собеля апроксимує просторовий градієнт яскравості зображення для пошуку контурів.",
    },
    {
      slug: "bandit-dpo-lab",
      title: "Багаторукі бандити та RL (Multi-Armed Bandits)",
      tagline: "Досліджуйте баланс Exploration vs Exploitation за алгоритмами UCB1 та Epsilon-Greedy",
      category: "Reinforcement Learning",
      icon: BarChart2,
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
      explore_knobs: ["Стратегія (UCB1, Epsilon-greedy)", "Кількість кроків", "Параметр Exploration"],
      key_insight: "UCB1 досягає сублінійного зростання сумарного regret за рахунок врахування невизначеності.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Pillar Header */}
      <div className="rounded-2xl border border-borderline bg-gradient-to-br from-white via-purple-50/20 to-white p-6 sm:p-8 dark:border-dark-border dark:bg-gradient-to-br dark:from-dark-surface dark:via-dark-bg/60 dark:to-dark-surface shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
            <Compass className="h-3.5 w-3.5" />
            03. Explore — Досліджуй механізми та поведінку моделей
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-graphite dark:text-dark-text">
            Інтерактивні пісочниці та лабораторії
          </h1>

          <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
            Змінюйте параметри в реальному часі, досліджуйте внутрішню механіку нейромереж, вектори уваги,
            розподіли ймовірностей та спостерігайте реальні обчислювальні результати безпосередньо у браузері.
          </p>
        </div>
      </div>

      {/* Grid of Exploratory Sandboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sandboxes.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.slug}
              className="flex flex-col justify-between rounded-xl border border-borderline bg-white p-5 shadow-sm hover:border-purple-500 hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded dark:bg-dark-bg">
                    {s.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-graphite dark:text-dark-text">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                  {s.tagline}
                </p>

                {/* Knobs */}
                <div className="space-y-1 pt-2 border-t border-borderline/60 dark:border-dark-border/60">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Параметри дослідження:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {s.explore_knobs.map((knob, i) => (
                      <span
                        key={i}
                        className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700 dark:bg-dark-bg dark:text-dark-muted"
                      >
                        {knob}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Insight */}
                <div className="rounded bg-purple-50/50 p-2.5 text-[11px] text-purple-900 dark:bg-purple-950/20 dark:text-purple-300">
                  <strong>💡 Інсайт:</strong> {s.key_insight}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-borderline/80 dark:border-dark-border/80 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-mono">CPU воркер</span>
                <Link
                  href={`/labs/${s.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-purple-700 transition"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Дослідити
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
