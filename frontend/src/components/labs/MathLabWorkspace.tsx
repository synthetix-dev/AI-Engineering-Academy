"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Activity, ArrowRight, Layers } from "lucide-react";

interface MathLabProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function MathLabWorkspace({ onRun, running, result }: MathLabProps) {
  const [learningRate, setLearningRate] = useState<number>(0.1);
  const [iterations, setIterations] = useState<number>(25);
  const [initialX, setInitialX] = useState<number>(4.0);
  const [lossFunction, setLossFunction] = useState<string>("quadratic"); // quadratic: f(x) = x^2, non_convex: f(x) = x^2 + 3*sin(2x)

  // Simulation steps for interactive visualization
  const simulateDescent = () => {
    let x = initialX;
    const history = [];
    for (let i = 0; i <= iterations; i++) {
      let loss = 0;
      let grad = 0;
      if (lossFunction === "quadratic") {
        loss = x * x;
        grad = 2 * x;
      } else {
        loss = x * x + 3 * Math.sin(2 * x);
        grad = 2 * x + 6 * Math.cos(2 * x);
      }
      history.push({ step: i, x: Number(x.toFixed(4)), loss: Number(loss.toFixed(4)), grad: Number(grad.toFixed(4)) });
      x = x - learningRate * grad;
      // Clamp to prevent overflow
      if (Math.abs(x) > 20) break;
    }
    return history;
  };

  const trajectory = simulateDescent();
  const finalPoint = trajectory[trajectory.length - 1];

  const handleExecute = () => {
    onRun({
      learning_rate: learningRate,
      iterations: iterations,
      initial_x: initialX,
      loss_function: lossFunction,
    });
  };

  return (
    <div className="space-y-6">
      {/* Parameter Controls */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Симулятор градієнтного спуску та оптимізації
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-500">2D Gradient Vector Field</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
              Цільова функція втрат:
            </label>
            <select
              value={lossFunction}
              onChange={(e) => setLossFunction(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-medium text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="quadratic">Опукла: f(x) = x²</option>
              <option value="non_convex">Неопукла: f(x) = x² + 3·sin(2x)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Learning Rate (α):</span>
              <span className="font-mono font-bold text-denim">{learningRate}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="1.2"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Кількість ітерацій:</span>
              <span className="font-mono font-bold text-denim">{iterations}</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Початкова точка x₀:</span>
              <span className="font-mono font-bold text-denim">{initialX}</span>
            </div>
            <input
              type="range"
              min="-8.0"
              max="8.0"
              step="0.5"
              value={initialX}
              onChange={(e) => setInitialX(parseFloat(e.target.value))}
              className="w-full accent-denim"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-borderline/60 pt-3">
          <button
            onClick={() => {
              setLearningRate(0.1);
              setInitialX(4.0);
              setIterations(25);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-borderline px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text"
          >
            <RotateCcw className="h-3 w-3" />
            Скинути
          </button>
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-1.5 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            {running ? "Обчислення на CPU..." : "Запустити оптимізацію"}
          </button>
        </div>
      </div>

      {/* Interactive Visualizer Canvas / Vector Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visual Graph Preview */}
        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-2">
            Траєкторія руху градієнта по кривій втрат
          </h4>
          <div className="relative h-56 w-full rounded-lg bg-gray-50 dark:bg-black/30 border border-borderline/60 p-4 flex flex-col justify-between">
            {/* Simple SVG Curve & Trajectory */}
            <svg className="w-full h-full overflow-visible" viewBox="-10 -2 20 20">
              {/* Axes */}
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#cbd5e1" strokeWidth="0.1" />
              <line x1="0" y1="-2" x2="0" y2="18" stroke="#cbd5e1" strokeWidth="0.1" />

              {/* Function curve dots */}
              {Array.from({ length: 41 }).map((_, i) => {
                const px = -8 + i * 0.4;
                const py = lossFunction === "quadratic" ? px * px : px * px + 3 * Math.sin(2 * px);
                return (
                  <circle
                    key={i}
                    cx={px}
                    cy={Math.min(18, Math.max(-1, py))}
                    r="0.12"
                    fill="#94a3b8"
                  />
                );
              })}

              {/* Trajectory Steps */}
              {trajectory.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={Math.min(18, Math.max(-1, pt.loss))}
                    r={idx === trajectory.length - 1 ? "0.45" : "0.22"}
                    fill={idx === trajectory.length - 1 ? "#EC612F" : "#6DA2E4"}
                  />
                  {idx > 0 && (
                    <line
                      x1={trajectory[idx - 1].x}
                      y1={Math.min(18, Math.max(-1, trajectory[idx - 1].loss))}
                      x2={pt.x}
                      y2={Math.min(18, Math.max(-1, pt.loss))}
                      stroke="#6DA2E4"
                      strokeWidth="0.1"
                      strokeDasharray="0.3 0.2"
                    />
                  )}
                </g>
              ))}
            </svg>

            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mt-1">
              <span>x₀ = {initialX}</span>
              <span className="text-tangerine font-bold">Оптимум: x* = {finalPoint?.x}</span>
              <span>Loss: {finalPoint?.loss}</span>
            </div>
          </div>
        </div>

        {/* Step Table */}
        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-2">
            Журнал кроків градієнтного спуску (Перші 8 ітерацій)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase dark:bg-dark-border/40">
                <tr>
                  <th className="p-2">Крок</th>
                  <th className="p-2">Позиція x</th>
                  <th className="p-2">Loss f(x)</th>
                  <th className="p-2">Градієнт ∇f(x)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderline/60 dark:divide-dark-border/60">
                {trajectory.slice(0, 8).map((t) => (
                  <tr key={t.step} className="hover:bg-gray-50/50 dark:hover:bg-dark-surface">
                    <td className="p-2 text-gray-400">#{t.step}</td>
                    <td className="p-2 font-semibold text-graphite dark:text-dark-text">{t.x}</td>
                    <td className="p-2 text-denim">{t.loss}</td>
                    <td className="p-2 text-gray-600 dark:text-dark-muted">{t.grad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
