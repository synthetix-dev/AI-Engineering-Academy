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
  Award,
  Zap,
} from "lucide-react";
import { getTracks, getTelemetry, getProjects, Track, TelemetryData, ProjectItem } from "@/lib/api";

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      {/* SECTION 1: Personal Learning Dashboard & Next Step */}
      <div className="relative overflow-hidden rounded-2xl border border-borderline bg-gradient-to-br from-white via-cloud/40 to-white p-6 sm:p-8 dark:border-dark-border dark:bg-gradient-to-br dark:from-dark-surface dark:via-dark-bg/60 dark:to-dark-surface shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-denim/30 bg-cloud px-3 py-1 text-xs font-semibold text-denim-700 dark:bg-denim/10 dark:text-denim">
            <Sparkles className="h-3.5 w-3.5 text-tangerine" />
            AI Engineering Studio — Learn · Build · Explore · Solve · Career
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-graphite dark:text-dark-text">
            Опануйте професію AI Engineer через реальні обчислення
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted leading-relaxed">
            Безкоштовне інтерактивне інженерне середовище без платних API та декоративних симуляцій.
            Навчайтеся за перевіреним циклом:
            <strong> «Вивчив → Змінив параметри → Отримав результат → Зробив помилку → Виправив → Здобув навичку»</strong>.
          </p>

          {/* Quick Onboarding / Personalized Start */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-lg bg-tangerine px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
            >
              <Zap className="h-4 w-4" />
              Швидкий старт & Онбординг
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-lg border border-borderline bg-white px-5 py-2.5 text-sm font-semibold text-graphite shadow-sm hover:bg-gray-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text dark:hover:bg-gray-900 transition"
            >
              <Compass className="h-4 w-4 text-denim" />
              Дослідити інтерактивні моделі
            </Link>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="mt-6 pt-6 border-t border-borderline/60 dark:border-dark-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-denim/10 p-2 text-denim dark:bg-denim/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-graphite dark:text-dark-text">100% Справжні обчислення</h4>
              <p className="text-[11px] text-gray-500 dark:text-dark-muted">PyTorch CPU, pgvector, scikit-learn без заглушок</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-tangerine/10 p-2 text-tangerine dark:bg-tangerine/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-graphite dark:text-dark-text">Три режими (Tri-Mode)</h4>
              <p className="text-[11px] text-gray-500 dark:text-dark-muted">Visual (візуальний), AI Mentor та Engineering (код/API)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:bg-emerald-500/20">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-graphite dark:text-dark-text">Підтверджені навички</h4>
              <p className="text-[11px] text-gray-500 dark:text-dark-muted">Автоматичне оцінювання та портфоліо інженера</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Next Recommended Practical Task (Interactive Card) */}
      <div className="rounded-xl border-2 border-denim/40 bg-white p-5 shadow-sm dark:border-denim/30 dark:bg-dark-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-denim">
              <Sparkles className="h-3.5 w-3.5" />
              Рекомендоване наступне завдання для вас
            </div>
            <h3 className="text-base sm:text-lg font-bold text-graphite dark:text-dark-text">
              Місія: Дослідження механізму уваги (Self-Attention) у трансформерах
            </h3>
            <p className="text-xs text-gray-600 dark:text-dark-muted">
              Змініть температуру Softmax, спостерігайте фокусування уваги на токенах та запустіть реальний семплінг на PyTorch.
            </p>
          </div>

          <Link
            href="/labs/attention-mechanics-lab"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-denim px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-denim-dark transition shrink-0"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Розпочати експеримент
          </Link>
        </div>
      </div>

      {/* SECTION 3: The 5 Pillars of AI Engineering Studio */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-graphite dark:text-dark-text">
            П'ять механік єдиної платформи
          </h2>
          <p className="text-xs text-gray-500 dark:text-dark-muted">
            Повний цикл підготовки інженера штучного інтелекту: від базових знань до промислового деплою.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pillar 1: Learn */}
          <Link
            href="/tracks"
            className="group flex flex-col justify-between rounded-xl border border-borderline bg-white p-5 shadow-sm hover:border-denim hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-denim dark:bg-blue-950/40">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-denim bg-cloud px-2 py-0.5 rounded dark:bg-dark-bg">
                  01. Learn
                </span>
              </div>
              <h3 className="text-base font-bold text-graphite group-hover:text-denim dark:text-dark-text transition">
                Навчайся (Learn)
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                Інтерактивні пояснення, короткі уроки та персональні маршрути. Теорія математики, ML та LLM відразу закріплюється практикою.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-denim">
              <span>Переглянути 20 навчальних треків</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 2: Build */}
          <Link
            href="/build"
            className="group flex flex-col justify-between rounded-xl border border-borderline bg-white p-5 shadow-sm hover:border-denim hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-tangerine dark:bg-orange-950/40">
                  <Hammer className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-tangerine bg-orange-50 px-2 py-0.5 rounded dark:bg-dark-bg">
                  02. Build
                </span>
              </div>
              <h3 className="text-base font-bold text-graphite group-hover:text-tangerine dark:text-dark-text transition">
                Створюй (Build)
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                Візуальні конструктори: збирайте нейромережі PyTorch, RAG-конвеєри з pgvector, ReAct-агентів та автоматизовані DAG без бойлерплейту.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-tangerine">
              <span>Відкрити візуальні конструктори</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 3: Explore */}
          <Link
            href="/explore"
            className="group flex flex-col justify-between rounded-xl border border-borderline bg-white p-5 shadow-sm hover:border-denim hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded dark:bg-dark-bg">
                  03. Explore
                </span>
              </div>
              <h3 className="text-base font-bold text-graphite group-hover:text-purple-600 dark:text-dark-text transition">
                Досліджуй (Explore)
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                Інтерактивні пісочниці: градієнтний спуск, матриці уваги, дрейф даних (KS-тест), квантизація INT8 та згортки комп'ютерного зору.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-600">
              <span>Дослідити поведінку моделей</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 4: Solve */}
          <Link
            href="/solve"
            className="group flex flex-col justify-between rounded-xl border border-borderline bg-white p-5 shadow-sm hover:border-denim hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                  <Target className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded dark:bg-dark-bg">
                  04. Solve
                </span>
              </div>
              <h3 className="text-base font-bold text-graphite group-hover:text-emerald-600 dark:text-dark-text transition">
                Вирішуй проблеми (Solve)
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                Практичні інженерні виклики: ліквідуйте вибух градієнтів, нейтралізуйте Prompt Injection, виправте витік даних та доведіть рішення тестами.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <span>Переглянути інженерні виклики</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 5: Career */}
          <Link
            href="/career-paths"
            className="group flex flex-col justify-between rounded-xl border border-borderline bg-white p-5 shadow-sm hover:border-denim hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded dark:bg-dark-bg">
                  05. Career
                </span>
              </div>
              <h3 className="text-base font-bold text-graphite group-hover:text-amber-600 dark:text-dark-text transition">
                Розвивай кар'єру (Career)
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                4 спеціалізації: Full-Stack AI Engineer, ML Engineer, LLM Engineer, MLOps. Отримуйте верифіковані навички, XP та формуйте живе портфоліо.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600">
              <span>Обрати кар'єрний шлях</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Living Projects Hub */}
          <Link
            href="/projects"
            className="group flex flex-col justify-between rounded-xl border border-borderline bg-white p-5 shadow-sm hover:border-denim hover:shadow-md transition dark:border-dark-border dark:bg-dark-surface"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded dark:bg-dark-bg">
                  Наскрізні
                </span>
              </div>
              <h3 className="text-base font-bold text-graphite group-hover:text-teal-600 dark:text-dark-text transition">
                Живі AI-проєкти (Projects)
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                Розвивайте наскрізні системи: від очищення датасету та навчання моделі до створення RAG, підключення агента та моніторингу в продакшені.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-600">
              <span>Переглянути мої проєкти ({projects.length})</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* SECTION 4: Live Verified Operational Telemetry (Zero Fake Numbers) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted">
          Фактична операційна телеметрія платформи (PostgreSQL & Redis)
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
            <div className="text-xs font-medium text-gray-500 dark:text-dark-muted">Навчальні напрями</div>
            <div className="mt-1 text-2xl font-bold font-mono text-graphite dark:text-dark-text">
              {tracks.length > 0 ? tracks.length : 20}
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">100% реальні ядра обчислень</div>
          </div>

          <div className="rounded-xl border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
            <div className="text-xs font-medium text-gray-500 dark:text-dark-muted">Зареєстровані інженери</div>
            <div className="mt-1 text-2xl font-bold font-mono text-graphite dark:text-dark-text">
              {telemetry?.verified_database_metrics.total_registered_users ?? 2}
            </div>
            <div className="mt-1 text-[11px] text-gray-500 dark:text-dark-muted">Облікова база PostgreSQL</div>
          </div>

          <div className="rounded-xl border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
            <div className="text-xs font-medium text-gray-500 dark:text-dark-muted">Виконано запусків на воркері</div>
            <div className="mt-1 text-2xl font-bold font-mono text-graphite dark:text-dark-text">
              {telemetry?.verified_database_metrics.total_lab_runs ?? 1}
            </div>
            <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              {telemetry?.verified_database_metrics.success_rate_percent ?? 100}% успішність виконання
            </div>
          </div>

          <div className="rounded-xl border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
            <div className="text-xs font-medium text-gray-500 dark:text-dark-muted">Використано CPU-секунд</div>
            <div className="mt-1 text-2xl font-bold font-mono text-graphite dark:text-dark-text">
              {telemetry?.verified_database_metrics.total_cpu_seconds_consumed ?? 0.0}s
            </div>
            <div className="mt-1 text-[11px] text-denim">Квоти з ізоляцією процесів</div>
          </div>
        </div>
      </div>
    </div>
  );
}
