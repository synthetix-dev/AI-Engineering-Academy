"use client";

import React, { useState } from "react";
import { Play, Award, CheckCircle2, Shield, Download, FileText } from "lucide-react";

interface CapstoneProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function CapstoneProjectWorkspace({ onRun, running, result }: CapstoneProps) {
  const [projectTitle, setProjectTitle] = useState<string>("Production Financial Fraud Detection Pipeline");
  const [problemStatement, setProblemStatement] = useState<string>(
    "Виявлення шахрайських транзакцій у режимі реального часу з латентністю p95 < 50ms та точністю ROC-AUC > 0.95 на незбалансованому датасеті."
  );

  const metrics = result?.metrics || {
    total_score: 94.0,
    is_approved: true,
  };

  const rubric = result?.artifacts?.rubric_breakdown || [
    { category: "Постановка задачі та валідація датасету", score: 20, max: 20, passed: true },
    { category: "Пайплайн навчання та порівняння з baseline", score: 25, max: 25, passed: true },
    { category: "Інтерпретованість (SHAP) та аналіз помилок", score: 18, max: 20, passed: true },
    { category: "Serving SLO та обмеження латентності (<50ms)", score: 16, max: 15, passed: true },
    { category: "Етичні міркування та захист від упередженості", score: 15, max: 20, passed: true },
  ];

  const handleExecute = () => {
    onRun({
      project_title: projectTitle,
      problem_statement: problemStatement,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-tangerine" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Дипломний інженерний проект (Capstone Project Defense & Automated Rubric)
            </h3>
          </div>
          <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
            Загальний бал: {metrics.total_score} / 100
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-dark-muted block mb-1">
              Назва дипломного інженерного проекту:
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-bold text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-dark-muted block mb-1">
              Опис проблеми та технічні обмеження:
            </label>
            <textarea
              rows={2}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text font-medium"
            />
          </div>

          <div className="flex justify-end border-t border-borderline/60 pt-3">
            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-tangerine px-6 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Оцінювання дипломного проекту..." : "Захистити Capstone проект"}
            </button>
          </div>
        </div>
      </div>

      {/* Rubric Breakdown */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-3">
          Критерії оцінювання випускної роботи (Automated Rubric Defense):
        </h4>

        <div className="space-y-2.5">
          {rubric.map((r: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-borderline bg-gray-50/50 p-3 text-xs dark:bg-dark-surface dark:border-dark-border"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-graphite dark:text-dark-text">{r.category}</span>
              </div>
              <span className="font-mono font-bold text-denim">
                {r.score} / {r.max} балів
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
