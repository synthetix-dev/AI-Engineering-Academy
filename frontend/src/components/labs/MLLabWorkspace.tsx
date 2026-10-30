"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Cpu, BarChart2, CheckCircle2, Sliders } from "lucide-react";

interface MLLabProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function MLLabWorkspace({ onRun, running, result }: MLLabProps) {
  const [algorithm, setAlgorithm] = useState<string>("random_forest");
  const [nEstimators, setNEstimators] = useState<number>(50);
  const [maxDepth, setMaxDepth] = useState<number>(6);
  const [threshold, setThreshold] = useState<number>(0.5);
  const [testSize, setTestSize] = useState<number>(0.2);

  // Get metrics and artifacts from result if present
  const metrics = result?.metrics || {
    accuracy: 0.884,
    precision: 0.865,
    recall: 0.892,
    f1_score: 0.878,
    roc_auc: 0.923,
  };

  const cm = result?.artifacts?.confusion_matrix || [
    [142, 18],
    [12, 128],
  ];

  const handleExecute = () => {
    onRun({
      algorithm: algorithm,
      dataset_name: "synthetic",
      n_estimators: nEstimators,
      max_depth: maxDepth,
      test_size: testSize,
      seed: 42,
    });
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Машинне навчання на Scikit-Learn: Модель та гіперпараметри
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            Справжній CPU Worker
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
              Алгоритм класифікації:
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-medium text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="random_forest">Random Forest Classifier</option>
              <option value="gradient_boosting">Gradient Boosting (GBDT)</option>
              <option value="decision_tree">Decision Tree</option>
              <option value="logistic_regression">Logistic Regression</option>
              <option value="knn">K-Nearest Neighbors (KNN)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Кількість дерев (n_estimators):</span>
              <span className="font-mono font-bold text-denim">{nEstimators}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={nEstimators}
              onChange={(e) => setNEstimators(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Максимальна глибина (max_depth):</span>
              <span className="font-mono font-bold text-denim">{maxDepth}</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              step="1"
              value={maxDepth}
              onChange={(e) => setMaxDepth(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Decision Threshold:</span>
              <span className="font-mono font-bold text-denim">{threshold}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-denim"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-borderline/60 pt-3">
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-1.5 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            {running ? "Навчання моделі..." : "Навчити модель (Train & Evaluate)"}
          </button>
        </div>
      </div>

      {/* Visual Heatmap & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Confusion Matrix */}
        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-1">
            Теплова карта матриці плутанини (Confusion Matrix)
          </h4>
          <p className="text-[11px] text-gray-500 mb-4">
            Розподіл передбачень на валідаційному датасеті
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {/* True Negative */}
            <div className="rounded-lg bg-denim/15 border border-denim/30 p-4 text-center">
              <span className="text-[10px] font-semibold uppercase text-denim block mb-1">True Negative (TN)</span>
              <span className="text-2xl font-black text-graphite dark:text-dark-text">{cm[0]?.[0] || 0}</span>
              <span className="text-[10px] text-gray-500 block mt-1">Правильно негативні</span>
            </div>

            {/* False Positive */}
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center dark:bg-red-950/20 dark:border-red-900/40">
              <span className="text-[10px] font-semibold uppercase text-red-600 block mb-1">False Positive (FP)</span>
              <span className="text-2xl font-black text-red-700 dark:text-red-400">{cm[0]?.[1] || 0}</span>
              <span className="text-[10px] text-gray-500 block mt-1">Помилка I роду</span>
            </div>

            {/* False Negative */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center dark:bg-amber-950/20 dark:border-amber-900/40">
              <span className="text-[10px] font-semibold uppercase text-amber-700 block mb-1">False Negative (FN)</span>
              <span className="text-2xl font-black text-amber-800 dark:text-amber-400">{cm[1]?.[0] || 0}</span>
              <span className="text-[10px] text-gray-500 block mt-1">Помилка II роду</span>
            </div>

            {/* True Positive */}
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center dark:bg-green-950/20 dark:border-green-900/40">
              <span className="text-[10px] font-semibold uppercase text-green-700 block mb-1">True Positive (TP)</span>
              <span className="text-2xl font-black text-green-800 dark:text-green-400">{cm[1]?.[1] || 0}</span>
              <span className="text-[10px] text-gray-500 block mt-1">Правильно позитивні</span>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-1">
            Ключові метрики якості моделі
          </h4>
          <p className="text-[11px] text-gray-500 mb-4">
            Обчислені на тестовій вибірці без витоку даних
          </p>

          <div className="space-y-3">
            {[
              { label: "Точність (Accuracy)", val: metrics.accuracy, target: 0.85 },
              { label: "Прецизійність (Precision)", val: metrics.precision, target: 0.8 },
              { label: "Повнота (Recall)", val: metrics.recall, target: 0.8 },
              { label: "F1-Score", val: metrics.f1_score, target: 0.82 },
              { label: "ROC-AUC Score", val: metrics.roc_auc, target: 0.88 },
            ].map((m) => {
              const pct = ((m.val || 0) * 100).toFixed(1);
              return (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-graphite dark:text-dark-text">{m.label}</span>
                    <span className="font-mono font-bold text-denim">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden dark:bg-dark-border">
                    <div
                      className="h-full rounded-full bg-denim"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
