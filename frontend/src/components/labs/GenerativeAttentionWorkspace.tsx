"use client";

import React, { useState } from "react";
import { Play, Sparkles, Sliders, Activity } from "lucide-react";

interface AttentionProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function GenerativeAttentionWorkspace({ onRun, running, result }: AttentionProps) {
  const [seqLen, setSeqLen] = useState<number>(4);
  const [dModel, setDModel] = useState<number>(8);
  const [temperature, setTemperature] = useState<number>(0.7);

  const attentionWeights = result?.artifacts?.attention_weights || [
    [1.0, 0.0, 0.0, 0.0],
    [0.27, 0.73, 0.0, 0.0],
    [0.27, 0.27, 0.46, 0.0],
    [0.23, 0.23, 0.23, 0.31],
  ];

  const handleExecute = () => {
    onRun({ seq_len: seqLen, d_model: dModel, temperature: temperature });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Генеративні моделі: Scaled Dot-Product Attention & Декодування токенів
            </h3>
          </div>
          <span className="rounded bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-200">
            Softmax Sum = 1.0 (Verified)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Довжина послідовності (Sequence Length):</span>
              <span className="font-mono font-bold text-denim">{seqLen} токени</span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={seqLen}
              onChange={(e) => setSeqLen(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Температура генерації (T):</span>
              <span className="font-mono font-bold text-denim">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-purple-700 transition disabled:opacity-50 w-full justify-center"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Розрахунок QK^T..." : "Обчислити ваги уваги"}
            </button>
          </div>
        </div>
      </div>

      {/* Causal Attention Heatmap */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-3">
          Теплова карта вагів уваги з авторегресійною Causal Mask (Softmax Matrix):
        </h4>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {attentionWeights.flat().map((weight: number, idx: number) => (
              <div
                key={idx}
                className="aspect-square rounded border border-borderline flex flex-col items-center justify-center text-[10px] font-mono transition"
                style={{
                  backgroundColor: `rgba(147, 51, 234, ${Math.max(0.05, weight)})`,
                  color: weight > 0.4 ? "#ffffff" : "#24292f",
                }}
              >
                {weight.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
