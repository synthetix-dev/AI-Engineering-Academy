"use client";

import React, { useState } from "react";
import { Database, Filter, AlertTriangle, CheckCircle2, Play, RefreshCw } from "lucide-react";

interface DataLabProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function DataLabWorkspace({ onRun, running, result }: DataLabProps) {
  const [imputationStrategy, setImputationStrategy] = useState<string>("mean");
  const [outlierMethod, setOutlierMethod] = useState<string>("iqr");
  const [outlierThreshold, setOutlierThreshold] = useState<number>(1.5);
  const [checkLeakage, setCheckLeakage] = useState<boolean>(true);
  const [testSplit, setTestSplit] = useState<number>(0.2);

  // Sample data before and after cleaning
  const sampleData = [
    { id: 1, age: 24, salary: 45000, credit_score: 710, churn: 0, status: "OK" },
    { id: 2, age: null, salary: 52000, credit_score: 680, churn: 0, status: "Missing Age" },
    { id: 3, age: 38, salary: 280000, credit_score: 790, churn: 1, status: "Outlier Salary" },
    { id: 4, age: 45, salary: 61000, credit_score: null, churn: 0, status: "Missing Score" },
    { id: 5, age: 29, salary: 48000, credit_score: 640, churn: 0, status: "OK" },
    { id: 6, age: 52, salary: 73000, credit_score: 720, churn: 1, status: "OK" },
  ];

  const handleExecute = () => {
    onRun({
      imputation_strategy: imputationStrategy,
      outlier_method: outlierMethod,
      outlier_threshold: outlierThreshold,
      check_leakage: checkLeakage,
      test_split: testSplit,
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Пайплайн очищення даних та аудит витоку (Data Leakage)
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-500">Automated Data Scrubber</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
              Стратегія заповнення пропусків:
            </label>
            <select
              value={imputationStrategy}
              onChange={(e) => setImputationStrategy(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-medium text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="mean">Mean (Середнє арифметичне)</option>
              <option value="median">Median (Медіана для асиметричних даних)</option>
              <option value="mode">Mode (Мода)</option>
              <option value="drop">Drop Rows (Видалення рядків з NaN)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
              Метод виявлення викидів:
            </label>
            <select
              value={outlierMethod}
              onChange={(e) => setOutlierMethod(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-medium text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="iqr">IQR (Interquartile Range Rule)</option>
              <option value="zscore">Z-Score (По відхиленню від σ)</option>
              <option value="isolation_forest">Isolation Forest</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Test Split Ratio:</span>
              <span className="font-mono font-bold text-denim">{(testSplit * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.4"
              step="0.05"
              value={testSplit}
              onChange={(e) => setTestSplit(parseFloat(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-dark-text cursor-pointer p-2 rounded border border-borderline dark:border-dark-border">
              <input
                type="checkbox"
                checked={checkLeakage}
                onChange={(e) => setCheckLeakage(e.target.checked)}
                className="accent-denim"
              />
              <span>Аудит витоку (Leakage Guard)</span>
            </label>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-borderline/60 pt-3">
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-1.5 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            {running ? "Аналіз датасету..." : "Запустити обробку датасету"}
          </button>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-graphite dark:text-dark-text">
            Попередній перегляд сирого датасету (Виявлення дефектів)
          </h4>
          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
            Знайдено 2 пропуски NaN та 1 викид
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase dark:bg-dark-border/40">
              <tr>
                <th className="p-2.5">ID</th>
                <th className="p-2.5">Age</th>
                <th className="p-2.5">Salary ($)</th>
                <th className="p-2.5">Credit Score</th>
                <th className="p-2.5">Churn (Target)</th>
                <th className="p-2.5">Аудит</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline/60 dark:divide-dark-border/60">
              {sampleData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-surface">
                  <td className="p-2.5 text-gray-400">#{row.id}</td>
                  <td className="p-2.5">
                    {row.age === null ? (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700 font-bold">NaN</span>
                    ) : (
                      row.age
                    )}
                  </td>
                  <td className="p-2.5">
                    {row.salary > 200000 ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800 font-bold">
                        ${row.salary.toLocaleString()} (Outlier)
                      </span>
                    ) : (
                      `$${row.salary.toLocaleString()}`
                    )}
                  </td>
                  <td className="p-2.5">
                    {row.credit_score === null ? (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700 font-bold">NaN</span>
                    ) : (
                      row.credit_score
                    )}
                  </td>
                  <td className="p-2.5 font-bold">{row.churn}</td>
                  <td className="p-2.5">
                    {row.status === "OK" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-green-600">
                        <CheckCircle2 className="h-3 w-3" /> Валідно
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                        <AlertTriangle className="h-3 w-3" /> {row.status}
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
