"use client";

import React, { useState } from "react";
import { Play, Activity, AlertTriangle, CheckCircle2, Shield, Sliders } from "lucide-react";

interface MLOpsProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function MLOpsDriftWorkspace({ onRun, running, result }: MLOpsProps) {
  const [pThreshold, setPThreshold] = useState<number>(0.05);
  const [sampleWindow, setSampleWindow] = useState<number>(1000);

  const driftFeatures = [
    { name: "salary_distribution", ks_stat: 0.024, p_value: 0.482, drifted: false },
    { name: "user_session_duration", ks_stat: 0.185, p_value: 0.002, drifted: true },
    { name: "query_tokens_count", ks_stat: 0.031, p_value: 0.315, drifted: false },
    { name: "device_type_frequency", ks_stat: 0.142, p_value: 0.012, drifted: true },
  ];

  const handleExecute = () => {
    onRun({
      test_method: "kolmogorov_smirnov",
      p_value_threshold: pThreshold,
      sample_window: sampleWindow,
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-tangerine" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Моніторинг дрейфу даних (Data & Concept Drift — Kolmogorov-Smirnov Test)
            </h3>
          </div>
          <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
            Automated Drift Auditor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Поріг достовірності p-value:</span>
              <span className="font-mono font-bold text-denim">{pThreshold}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.10"
              step="0.01"
              value={pThreshold}
              onChange={(e) => setPThreshold(parseFloat(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Вікно вибірки (Sample Window):</span>
              <span className="font-mono font-bold text-denim">{sampleWindow} рядків</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={sampleWindow}
              onChange={(e) => setSampleWindow(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div className="flex justify-end items-end">
            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-tangerine px-5 py-2 text-xs font-semibold text-white shadow hover:opacity-90 transition disabled:opacity-50 w-full justify-center"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Виконання тесту KS..." : "Запустити аудит дрейфу"}
            </button>
          </div>
        </div>
      </div>

      {/* Drift Features Table */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-3">
          Результати статистичного тесту Колмогорова-Смірнова за ознаками:
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase dark:bg-dark-border/40">
              <tr>
                <th className="p-2.5">Ознака (Feature)</th>
                <th className="p-2.5">Статистика KS</th>
                <th className="p-2.5">p-value</th>
                <th className="p-2.5">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline/60 dark:divide-dark-border/60">
              {driftFeatures.map((f) => (
                <tr key={f.name} className="hover:bg-gray-50/50 dark:hover:bg-dark-surface">
                  <td className="p-2.5 font-semibold text-graphite dark:text-dark-text">{f.name}</td>
                  <td className="p-2.5">{f.ks_stat}</td>
                  <td className="p-2.5 font-bold">{f.p_value}</td>
                  <td className="p-2.5">
                    {f.drifted ? (
                      <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                        <AlertTriangle className="h-3 w-3" /> DRIFT DETECTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        <CheckCircle2 className="h-3 w-3" /> IN DISTRIBUTION
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
