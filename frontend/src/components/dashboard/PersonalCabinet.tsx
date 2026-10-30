"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Hammer,
  Compass,
  Target,
  Briefcase,
  Play,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  FolderGit2,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight
} from "lucide-react";
import { getProgress, getProjects, getQuotas, ProgressData, ProjectItem, QuotaData } from "@/lib/api";

export default function PersonalCabinet() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [quotas, setQuotas] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProgress().catch(() => null),
      getProjects().catch(() => []),
      getQuotas().catch(() => null),
    ]).then(([prog, proj, quot]) => {
      setProgress(prog);
      setProjects(proj);
      setQuotas(quot);
      setLoading(false);
    });
  }, []);

  const pillars = [
    {
      title: "Learn",
      subtitle: "20 напрямів та теорія",
      href: "/tracks",
      icon: BookOpen,
      badge: "20 модулів",
      accent: "text-denim bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40",
    },
    {
      title: "Build",
      subtitle: "Конструктор нейромереж і RAG",
      href: "/build",
      icon: Hammer,
      badge: "4 студії",
      accent: "text-tangerine bg-orange-50 border-orange-100 dark:bg-orange-950/30 dark:border-orange-900/40",
    },
    {
      title: "Explore",
      subtitle: "Пісочниці ваг та ембедингів",
      href: "/explore",
      icon: Compass,
      badge: "6 пісочниць",
      accent: "text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/40",
    },
    {
      title: "Solve",
      subtitle: "Інженерні виклики та баги",
      href: "/solve",
      icon: Target,
      badge: "5 місій",
      accent: "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40",
    },
    {
      title: "Career",
      subtitle: "Кар'єрні треки та резюме",
      href: "/career-paths",
      icon: Briefcase,
      badge: "4 ролі",
      accent: "text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/40",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header greeting & status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-borderline pb-6 dark:border-dark-border">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-tangerine mb-1">
            <span className="h-2 w-2 rounded-full bg-tangerine animate-ping" />
            Особистий кабінет інженера
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy dark:text-white">
            Робочий простір інженера
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-muted mt-1">
            Ваш активний трек: <strong className="text-navy dark:text-dark-text">Full-Stack AI Systems Engineer</strong>. Усі обчислення верифіковані бекендом.
          </p>
        </div>

        {/* Live Engine & Quota Pill */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-borderline bg-white p-3 dark:border-dark-border dark:bg-dark-surface shadow-xs">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Баланс обчислень</div>
            <div className="text-xs font-mono font-bold text-navy dark:text-white mt-0.5">
              {quotas ? `${quotas.cpu_seconds_used.toFixed(1)}s / ${quotas.cpu_seconds_budget.toFixed(0)}s CPU` : "CPU Active"}
            </div>
          </div>
          <div className="rounded-xl border border-borderline bg-white p-3 dark:border-dark-border dark:bg-dark-surface shadow-xs">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">XP Досягнень</div>
            <div className="text-xs font-mono font-bold text-emerald-600 mt-0.5">
              {progress?.total_xp ?? 0} XP
            </div>
          </div>
        </div>
      </div>

      {/* 2. Priority Next Action Banner (1-Click Start) */}
      <div className="rounded-2xl border border-denim/40 bg-gradient-to-r from-denim/15 via-white to-white p-6 sm:p-8 dark:from-denim/10 dark:via-dark-surface dark:to-dark-surface dark:border-denim/30 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-denim/20 px-3 py-0.5 text-xs font-bold text-denim-700 dark:text-denim">
              <Sparkles className="h-3.5 w-3.5 text-tangerine" />
              Рекомендована наступна дія
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy dark:text-white">
              Лабораторія #01: Навчання MLP та зворотне поширення помилки
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
              Відрегулюйте темп навчання (\(\eta\)) та кількість епох для класифікації нелінійних даних. Справжні градієнти обчислюються бібліотекою PyTorch на backend.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/labs/math-foundations-lab"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-tangerine px-6 py-3 text-sm font-bold text-white shadow hover:opacity-95 transition-all transform active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Запустити лабораторію</span>
            </Link>
            <Link
              href="/tracks"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-borderline bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-cloud dark:border-dark-border dark:bg-dark-bg dark:text-white transition-colors"
            >
              <span>Всі 20 треків</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Five Core Pillars Grid */}
      <div>
        <h3 className="text-sm font-display font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted mb-3">
          Основні робочі секції платформи
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.title}
                href={p.href}
                className="group rounded-xl border border-borderline bg-white p-5 hover:border-denim/80 hover:shadow-md dark:border-dark-border dark:bg-dark-surface transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg border ${p.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500 border border-borderline rounded-full px-2 py-0.5 dark:border-dark-border">
                      {p.badge}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-base text-navy dark:text-white group-hover:text-denim-600 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-dark-muted mt-1 leading-snug">
                    {p.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-borderline/50 dark:border-dark-border/50 flex items-center text-xs font-semibold text-navy group-hover:text-tangerine transition-colors">
                  <span>Перейти</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Living Projects & Verified Artifacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Projects (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted flex items-center gap-1.5">
              <FolderGit2 className="h-4 w-4 text-denim" />
              Ваші наскрізні проєкти (Living Systems)
            </h3>
            <Link href="/projects" className="text-xs font-semibold text-tangerine hover:underline">
              Усі проєкти ({projects.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-borderline bg-white p-6 text-center text-xs text-gray-500 dark:border-dark-border dark:bg-dark-surface">
                Немає активних проєктів. Почніть з вибору шаблону в розділі «Проєкти».
              </div>
            ) : (
              projects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl border border-borderline bg-white p-4 hover:border-denim/60 transition-colors dark:border-dark-border dark:bg-dark-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-navy dark:text-white">
                        {proj.title}
                      </span>
                      <span className="rounded bg-denim/10 text-denim-700 text-[10px] font-semibold px-2 py-0.5 font-mono">
                        {proj.commit_hash ? proj.commit_hash.slice(0, 7) : "v1.0"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-dark-muted line-clamp-1">
                      {proj.description || "Інженерний наскрізний артефакт"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-gray-400 font-mono">
                      {proj.visibility}
                    </span>
                    <Link
                      href={`/projects`}
                      className="rounded-lg border border-borderline bg-cloud px-3 py-1.5 text-xs font-semibold text-navy hover:bg-gray-100 dark:border-dark-border dark:bg-dark-bg dark:text-white"
                    >
                      Відкрити
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Verified Proofs & Certification status */}
        <div className="space-y-4">
          <h3 className="text-sm font-display font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Підтверджені навички (Proof of Skill)
          </h3>

          <div className="rounded-xl border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-navy dark:text-white">Криптографічний захист</div>
                <div className="text-[11px] text-gray-500">Кожен успішний запуск фіксується у PostgreSQL</div>
              </div>
            </div>

            <div className="pt-2 border-t border-borderline/60 dark:border-dark-border/60 text-xs text-gray-600 dark:text-dark-muted space-y-2">
              <div className="flex justify-between">
                <span>Завершених місій:</span>
                <span className="font-mono font-bold text-navy dark:text-white">{progress?.passed_missions_count ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Опановано навичок:</span>
                <span className="font-mono font-bold text-navy dark:text-white">{progress?.mastered_skills_count ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Стрік активності:</span>
                <span className="font-mono font-bold text-tangerine">{progress?.streak_days ?? 1} дні</span>
              </div>
            </div>

            <Link
              href="/portfolio"
              className="block w-full text-center rounded-lg border border-borderline bg-gray-50 py-2 text-xs font-semibold text-navy hover:bg-gray-100 dark:border-dark-border dark:bg-dark-bg dark:text-white transition-colors"
            >
              Переглянути публічне резюме →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
