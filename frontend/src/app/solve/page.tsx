"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Zap,
} from "lucide-react";
import { getMissions, verifyMission, MissionItem, MissionVerifyResult } from "@/lib/api";

export default function SolveHubPage() {
  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [activeMission, setActiveMission] = useState<MissionItem | null>(null);
  const [fixParams, setFixParams] = useState<Record<string, any>>({});
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<MissionVerifyResult | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMissions()
      .then((data) => {
        setMissions(data);
        if (data.length > 0) {
          selectMission(data[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectMission = (m: MissionItem) => {
    setActiveMission(m);
    setFixParams(m.initial_broken_params);
    setVerifyResult(null);
  };

  const handleVerify = async () => {
    if (!activeMission) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await verifyMission(activeMission.slug, fixParams);
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyResult({
        passed: false,
        score: 0.0,
        xp_earned: 0,
        feedback: "Помилка верифікації: " + err.message,
        verified_metrics: {},
      });
    } finally {
      setVerifying(false);
    }
  };

  const domains = ["All", ...Array.from(new Set(missions.map((m) => m.domain)))];
  const filteredMissions =
    filterDomain === "All" ? missions : missions.filter((m) => m.domain === filterDomain);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Pillar Header */}
      <div className="rounded-2xl border border-borderline bg-gradient-to-br from-white via-emerald-50/20 to-white p-6 sm:p-8 dark:border-dark-border dark:bg-gradient-to-br dark:from-dark-surface dark:via-dark-bg/60 dark:to-dark-surface shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Target className="h-3.5 w-3.5" />
            04. Solve — Вирішуй реальні інженерні виклики
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-graphite dark:text-dark-text">
            Інженерні випробування та пошук багів
          </h1>

          <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
            Отримайте зламану виробничу систему, знайдіть причину дефекту (вибух градієнтів, джейлбрейк, витік даних чи збій DAG),
            висуньте гіпотезу, виправте параметри та доведіть правильність автоматизованим тестом.
          </p>
        </div>
      </div>

      {/* Main Solve Stage: Split view with Mission List & Interactive Solver */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-muted">
              Список викликів ({filteredMissions.length})
            </h3>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex flex-wrap gap-1 pb-2">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setFilterDomain(d)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                  filterDomain === d
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-surface dark:text-dark-muted"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredMissions.map((m) => {
              const isSelected = activeMission?.slug === m.slug;
              return (
                <button
                  key={m.slug}
                  onClick={() => selectMission(m)}
                  className={`w-full text-left rounded-xl border p-4 transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs"
                      : "border-borderline bg-white hover:border-gray-300 dark:border-dark-border dark:bg-dark-surface"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      {m.difficulty}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded dark:bg-dark-bg">
                      +{m.xp_reward} XP
                    </span>
                  </div>

                  <h4 className="mt-1 text-xs font-bold text-graphite dark:text-dark-text line-clamp-1">
                    {m.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-gray-500 dark:text-dark-muted line-clamp-2">
                    {m.bug_description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mission Testing Console */}
        <div className="lg:col-span-8 space-y-4">
          {activeMission ? (
            <div className="rounded-xl border border-borderline bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-5">
              {/* Mission Header */}
              <div className="space-y-2 border-b border-borderline pb-4 dark:border-dark-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    {activeMission.domain}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-600">
                      Нагорода: +{activeMission.xp_reward} XP
                    </span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-graphite dark:text-dark-text">
                  {activeMission.title}
                </h2>
                <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                  {activeMission.context}
                </p>
              </div>

              {/* Problem Brief Card */}
              <div className="rounded-lg border border-red-200 bg-red-50/60 p-4 dark:border-red-900/40 dark:bg-red-950/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  Опис дефекту у системі:
                </div>
                <p className="text-xs text-red-900 dark:text-red-300">
                  {activeMission.bug_description}
                </p>
              </div>

              {/* Target Criteria */}
              <div className="rounded-lg border border-denim/30 bg-cloud/40 p-4 dark:border-denim/20 dark:bg-denim/10 space-y-1">
                <span className="text-[11px] font-bold text-denim uppercase tracking-wider">
                  Критерій проходження тесту:
                </span>
                <p className="text-xs text-gray-700 dark:text-dark-text font-medium">
                  {activeMission.target_criteria}
                </p>
              </div>

              {/* Interactive Hypothesis Fix Panel */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-graphite dark:text-dark-text">
                    Ваша гіпотеза виправлення (Параметри надішлються на CPU воркер):
                  </h4>
                  <button
                    onClick={() => setFixParams(activeMission.initial_broken_params)}
                    className="text-[11px] text-gray-500 hover:text-graphite flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Скинути до зламаних
                  </button>
                </div>

                {/* Dynamic Parameter Sliders / Inputs based on mission */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-borderline bg-gray-50 p-4 dark:border-dark-border dark:bg-dark-bg">
                  {Object.entries(fixParams).map(([paramKey, paramVal]) => (
                    <div key={paramKey} className="space-y-1.5">
                      <label className="text-xs font-bold text-graphite dark:text-dark-text font-mono">
                        {paramKey}
                      </label>
                      {typeof paramVal === "number" ? (
                        <div className="space-y-1">
                          <input
                            type="number"
                            step="any"
                            value={paramVal}
                            onChange={(e) =>
                              setFixParams({ ...fixParams, [paramKey]: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full rounded border border-borderline bg-white px-3 py-1.5 text-xs font-mono text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      ) : typeof paramVal === "boolean" ? (
                        <select
                          value={paramVal ? "true" : "false"}
                          onChange={(e) =>
                            setFixParams({ ...fixParams, [paramKey]: e.target.value === "true" })
                          }
                          className="w-full rounded border border-borderline bg-white px-3 py-1.5 text-xs font-mono text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={String(paramVal)}
                          onChange={(e) =>
                            setFixParams({ ...fixParams, [paramKey]: e.target.value })
                          }
                          className="w-full rounded border border-borderline bg-white px-3 py-1.5 text-xs text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Hints Accordion */}
                {activeMission.hints?.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Підказка інженера:
                    </span>
                    <ul className="list-disc list-inside text-xs text-gray-500 dark:text-dark-muted space-y-0.5">
                      {activeMission.hints.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-3 border-t border-borderline dark:border-dark-border">
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {verifying ? "Запуск перевірки на бекенді..." : "Перевірити рішення"}
                </button>
              </div>

              {/* Verification Outcome Deck */}
              {verifyResult && (
                <div
                  className={`rounded-xl border p-5 space-y-3 ${
                    verifyResult.passed
                      ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                      : "border-red-300 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {verifyResult.passed ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white font-bold">
                          ✕
                        </div>
                      )}
                      <h4
                        className={`text-sm font-bold ${
                          verifyResult.passed ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"
                        }`}
                      >
                        {verifyResult.passed ? "ВИКЛИК УСПІШНО ПРОЙДЕНО!" : "ТЕСТ НЕ ПРОЙДЕНО"}
                      </h4>
                    </div>

                    {verifyResult.passed && (
                      <span className="rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-bold shadow-xs">
                        +{verifyResult.xp_earned} XP Зараховано
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      verifyResult.passed ? "text-emerald-900 dark:text-emerald-200" : "text-red-900 dark:text-red-200"
                    }`}
                  >
                    {verifyResult.feedback}
                  </p>

                  {/* Verified Metrics */}
                  {verifyResult.verified_metrics && Object.keys(verifyResult.verified_metrics).length > 0 && (
                    <div className="pt-2 border-t border-borderline/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Фактичні метрики обчислення:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(verifyResult.verified_metrics).map(([k, v]) => (
                          <span
                            key={k}
                            className="rounded bg-white/80 px-2 py-0.5 text-[11px] font-mono text-graphite border border-borderline dark:bg-dark-bg dark:text-dark-text"
                          >
                            {k}: {typeof v === "number" ? v.toFixed(4) : String(v)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Step CTA */}
                  {verifyResult.passed && verifyResult.next_recommended_mission && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          const nextM = missions.find((m) => m.slug === verifyResult.next_recommended_mission);
                          if (nextM) selectMission(nextM);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 transition"
                      >
                        <span>Наступний інженерний виклик</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-borderline bg-white p-12 text-center text-xs text-gray-500 dark:border-dark-border dark:bg-dark-surface">
              Оберіть виклик зі списку ліворуч для початку пошуку та виправлення дефекту.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
