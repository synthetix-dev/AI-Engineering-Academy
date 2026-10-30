"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Cpu, BarChart2, CheckCircle2, Sliders, AlertTriangle, Info, TrendingUp } from "lucide-react";

interface MLLabProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function MLLabWorkspace({ onRun, running, result }: MLLabProps) {
  const [datasetName, setDatasetName] = useState<string>("synthetic");
  const [scenario, setScenario] = useState<string>("fraud");
  const [algorithm, setAlgorithm] = useState<string>("random_forest");
  const [nEstimators, setNEstimators] = useState<number>(50);
  const [maxDepth, setMaxDepth] = useState<number>(6);
  const [threshold, setThreshold] = useState<number>(0.5);
  const [testSize, setTestSize] = useState<number>(0.25);

  // Dynamic metrics from actual run or initial baseline
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

  const tn = cm[0]?.[0] || 0;
  const fp = cm[0]?.[1] || 0;
  const fn = cm[1]?.[0] || 0;
  const tp = cm[1]?.[1] || 0;

  // Real cost calculation based on business scenario
  // In fraud detection: FN cost = $500 (undetected fraud), FP cost = $10 (temporary card block)
  const estimatedCost = scenario === "fraud"
    ? fn * 500 + fp * 10
    : fn * 100 + fp * 20;

  const handleExecute = () => {
    onRun({
      algorithm: algorithm,
      dataset_name: datasetName,
      n_estimators: nEstimators,
      max_depth: maxDepth,
      test_size: testSize,
      decision_threshold: threshold,
      seed: 42,
    });
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-denim" />
            <div>
              <h3 className="font-display font-bold text-sm text-navy dark:text-white">
                Класифікація на Scikit-Learn: Датасет, Модель та Поріг Рішення
              </h3>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                Досліджуйте баланс між точністю (Precision) та повнотою (Recall)
              </p>
            </div>
          </div>
          <span className="rounded-full bg-denim/10 px-3 py-0.5 text-[11px] font-bold text-denim border border-denim/30">
            Scikit-Learn CPU
          </span>
        </div>

        {/* Dataset & Business Scenario Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-borderline/60">
          <div>
            <label className="text-xs font-bold text-navy dark:text-white block mb-1">
              Навчальний датасет:
            </label>
            <select
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              className="w-full rounded-lg border border-borderline bg-white p-2 text-xs font-semibold text-navy dark:border-dark-border dark:bg-dark-surface dark:text-white"
            >
              <option value="synthetic">Синтетичний нелінійний датасет (500 семплів, 6 ознак)</option>
              <option value="iris">Iris Classification (Класичний біологічний датасет)</option>
              <option value="wine">Wine Quality Classification (Хімічний аналіз вин)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-navy dark:text-white block mb-1">
              Бізнес-контекст та ціна помилок:
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full rounded-lg border border-borderline bg-white p-2 text-xs font-semibold text-navy dark:border-dark-border dark:bg-dark-surface dark:text-white"
            >
              <option value="fraud">Fraud Detection (Пропуск шахрая = $500, блокування = $10)</option>
              <option value="balanced">Збалансований класифікатор (Рівна ціна помилок)</option>
            </select>
          </div>
        </div>

        {/* Hyperparameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
              Алгоритм моделі:
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-semibold text-navy dark:border-dark-border dark:bg-dark-surface dark:text-white"
            >
              <option value="random_forest">Random Forest Classifier</option>
              <option value="gradient_boosting">Gradient Boosting (GBDT)</option>
              <option value="decision_tree">Decision Tree (Одне дерево)</option>
              <option value="logistic_regression">Logistic Regression</option>
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
              <span>Макс. глибина (max_depth):</span>
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
              <span className="font-mono font-bold text-tangerine">{threshold}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-tangerine"
            />
          </div>
        </div>

        {/* Practical Hint Bar */}
        <div className="mt-4 rounded-lg bg-cloud/50 p-3 text-xs text-navy dark:bg-dark-bg dark:text-dark-text flex items-center gap-2 border border-borderline dark:border-dark-border">
          <Info className="h-4 w-4 text-denim shrink-0" />
          <span>
            {threshold > 0.6
              ? "Високий поріг (>0.60): модель дуже обережна, високий Precision, але ризик пропустити цільові події (низький Recall)."
              : threshold < 0.4
              ? "Низький поріг (<0.40): модель ловить майже всі підозрілі події (високий Recall), але збільшує кількість False Positives."
              : "Збалансований дефолтний поріг (0.40 - 0.60)."}
          </span>
        </div>

        {/* Submit Train Button */}
        <div className="mt-4 flex justify-end gap-2 border-t border-borderline/60 pt-3">
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-6 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-white" />
            {running ? "Навчання моделі..." : "Навчити та оцінити модель"}
          </button>
        </div>
      </div>

      {/* Visual Confusion Matrix & Performance Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Confusion Matrix (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">
              Матриця помилок (Confusion Matrix)
            </h4>
            <span className="text-xs text-gray-400 font-mono">Валідаційний спліт</span>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {/* True Negative */}
            <div className="rounded-xl bg-denim/10 border border-denim/30 p-4 text-center">
              <span className="text-[10px] font-bold uppercase text-denim-700 block mb-1">True Negative (TN)</span>
              <span className="text-3xl font-display font-black text-navy dark:text-white">{tn}</span>
              <span className="text-[11px] text-gray-500 block mt-1">Правильно негативні</span>
            </div>

            {/* False Positive */}
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center dark:bg-red-950/20 dark:border-red-900/40">
              <span className="text-[10px] font-bold uppercase text-red-600 block mb-1">False Positive (FP)</span>
              <span className="text-3xl font-display font-black text-red-700 dark:text-red-400">{fp}</span>
              <span className="text-[11px] text-gray-500 block mt-1">Хибна тривога (I рід)</span>
            </div>

            {/* False Negative */}
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center dark:bg-amber-950/20 dark:border-amber-900/40">
              <span className="text-[10px] font-bold uppercase text-amber-700 block mb-1">False Negative (FN)</span>
              <span className="text-3xl font-display font-black text-amber-800 dark:text-amber-400">{fn}</span>
              <span className="text-[11px] text-gray-500 block mt-1">Пропуск події (II рід)</span>
            </div>

            {/* True Positive */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center dark:bg-emerald-950/20 dark:border-emerald-900/40">
              <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">True Positive (TP)</span>
              <span className="text-3xl font-display font-black text-emerald-800 dark:text-emerald-400">{tp}</span>
              <span className="text-[11px] text-gray-500 block mt-1">Правильно виявлені</span>
            </div>
          </div>

          {/* Business Cost Impact */}
          <div className="rounded-lg bg-orange-50/60 p-3.5 border border-tangerine/30 text-xs flex items-center justify-between dark:bg-orange-950/20">
            <div>
              <span className="font-bold text-navy dark:text-white block">Оцінка фінансових втрат від помилок:</span>
              <span className="text-gray-500 text-[11px]">FN × $500 + FP × $10</span>
            </div>
            <div className="font-display font-black text-lg text-tangerine">
              ${estimatedCost.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Quality Metrics Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">
              Метрики класифікації
            </h4>
            <span className="text-xs font-mono text-denim font-bold">ROC-AUC: {(metrics.roc_auc * 100).toFixed(1)}%</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Accuracy (Загальна точність)", val: metrics.accuracy, color: "bg-denim" },
              { label: "Precision (Точність позитивних)", val: metrics.precision, color: "bg-indigo-600" },
              { label: "Recall (Повнота виявлення)", val: metrics.recall, color: "bg-tangerine" },
              { label: "F1-Score (Гармонійне середнє)", val: metrics.f1_score, color: "bg-emerald-600" },
            ].map((m) => {
              const pct = ((m.val || 0) * 100).toFixed(1);
              return (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-navy dark:text-white">{m.label}</span>
                    <span className="font-mono font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-cloud overflow-hidden dark:bg-dark-border">
                    <div className={`h-full rounded-full ${m.color}`} style={{ width: `${pct}%` }} />
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
