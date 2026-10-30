"use client";

import React, { useEffect, useState } from "react";
import { Award, Flame, CheckCircle2, History, Zap, ShieldCheck } from "lucide-react";
import { getProgress, ProgressData } from "@/lib/api";

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgress()
      .then((data) => {
        setProgress(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-xs font-mono text-gray-500">Завантаження прогресу...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="border-b border-borderline pb-4 dark:border-dark-border">
        <h1 className="text-xl sm:text-2xl font-bold text-graphite dark:text-dark-text flex items-center gap-2">
          <Award className="h-6 w-6 text-denim" />
          Професійний прогрес та доказові компетенції
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted mt-1">
          XP нараховується виключно за фактично виконані та верифіковані завдання без клікового фармінгу за ТЗ v1.1.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-surface shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Загальний XP</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-graphite dark:text-dark-text">
            {progress?.total_xp ?? 0}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Перевірені місії</div>
        </div>

        <div className="rounded-lg border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-surface shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Streak (днів поспіль)</span>
            <Flame className="h-4 w-4 text-tangerine" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-graphite dark:text-dark-text">
            {progress?.streak_days ?? 1}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Активний статус</div>
        </div>

        <div className="rounded-lg border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-surface shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Пройдені уроки</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-graphite dark:text-dark-text">
            {progress?.completed_lessons_count ?? 0}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Успішні спроби</div>
        </div>

        <div className="rounded-lg border border-borderline bg-white p-4 dark:border-dark-border dark:bg-dark-surface shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Опановані навички</span>
            <ShieldCheck className="h-4 w-4 text-denim" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-graphite dark:text-dark-text">
            {progress?.mastered_skills_count ?? 0}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">З підтвердженими Runs</div>
        </div>
      </div>

      {/* Verified Skills Tree */}
      <div className="rounded-lg border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-graphite dark:text-dark-text flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-denim" />
          Підтверджені навички (Skill Evidence Graph)
        </h2>

        {progress?.masteries && progress.masteries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {progress.masteries.map((m, idx) => (
              <div key={idx} className="rounded border border-borderline p-3 dark:border-dark-border bg-gray-50 dark:bg-dark-bg space-y-1">
                <div className="text-xs font-bold text-graphite dark:text-dark-text">{m.skill_title}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-denim uppercase">{m.mastery_level}</span>
                  <span className="text-gray-400">{new Date(m.issued_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded border border-borderline/60 bg-gray-50 p-4 text-xs text-gray-500 dark:border-dark-border dark:bg-dark-bg">
            Щоб підтвердити першу навичку в графі компетентностей, завершіть лабораторне завдання в обраному напрямку.
          </div>
        )}
      </div>

      {/* Recent Runs Audit Trail */}
      <div className="rounded-lg border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-graphite dark:text-dark-text flex items-center gap-2">
          <History className="h-4 w-4 text-gray-500" />
          Останні обчислювальні запуски (Audit Trail)
        </h2>

        {progress?.recent_runs && progress.recent_runs.length > 0 ? (
          <div className="divide-y divide-borderline dark:divide-dark-border">
            {progress.recent_runs.map((r, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      r.status === "succeeded"
                        ? "text-emerald-600 font-bold"
                        : r.status === "failed"
                        ? "text-red-600 font-bold"
                        : "text-amber-600 font-bold"
                    }
                  >
                    [{r.status.toUpperCase()}]
                  </span>
                  <span>ID: {r.run_id.slice(0, 8)}...</span>
                  <span className="text-gray-400">({r.mode})</span>
                </div>
                <span className="text-gray-500">{new Date(r.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-gray-400 font-mono">
            Записів про нещодавні запуски немає.
          </div>
        )}
      </div>
    </div>
  );
}
