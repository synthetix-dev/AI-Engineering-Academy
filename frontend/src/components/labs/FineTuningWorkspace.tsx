"use client";

import React, { useState } from "react";
import { Play, Cpu, Sparkles, CheckCircle2, ArrowRight, Sliders, Layers } from "lucide-react";

interface FineTuningProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function FineTuningWorkspace({ onRun, running, result }: FineTuningProps) {
  const [loraRank, setLoraRank] = useState<number>(8);
  const [loraAlpha, setLoraAlpha] = useState<number>(16);
  const [learningRate, setLearningRate] = useState<number>(0.0003);
  const [steps, setSteps] = useState<number>(50);
  const [targetModules, setTargetModules] = useState<string>("q_proj,v_proj");

  // Trainable parameters calculation
  const totalParams = 15000000; // TinyStories 15M
  const trainableParams = loraRank * 768 * 2 * 4; // approximate LoRA adapters
  const trainablePercent = ((trainableParams / totalParams) * 100).toFixed(2);

  const handleExecute = () => {
    onRun({
      model_name: "tinystories-cpu-15m",
      lora_rank: loraRank,
      lora_alpha: loraAlpha,
      learning_rate: learningRate,
      max_steps: steps,
      target_modules: targetModules.split(",").map((s) => s.trim()),
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
              Fine-Tuning LoRA (Low-Rank Adaptation) на CPU/MPS
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            {trainablePercent}% активних вагів ({trainableParams.toLocaleString()} params)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>LoRA Rank (r):</span>
              <span className="font-mono font-bold text-denim">{loraRank}</span>
            </div>
            <select
              value={loraRank}
              onChange={(e) => setLoraRank(parseInt(e.target.value))}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-medium text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="4">r = 4 (Економний)</option>
              <option value="8">r = 8 (Рекомендований)</option>
              <option value="16">r = 16 (Висока ємність)</option>
              <option value="32">r = 32 (Максимальна точність)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>LoRA Alpha (α):</span>
              <span className="font-mono font-bold text-denim">{loraAlpha}</span>
            </div>
            <select
              value={loraAlpha}
              onChange={(e) => setLoraAlpha(parseInt(e.target.value))}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-medium text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="8">α = 8</option>
              <option value="16">α = 16 (Масштаб 2x)</option>
              <option value="32">α = 32 (Масштаб 4x)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Кроки оптимізації:</span>
              <span className="font-mono font-bold text-denim">{steps}</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              step="10"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
              Цільові модулі уваги:
            </label>
            <input
              type="text"
              value={targetModules}
              onChange={(e) => setTargetModules(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-mono text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
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
            {running ? "Навчання адаптерів..." : "Розпочати LoRA Fine-Tuning"}
          </button>
        </div>
      </div>

      {/* Before / After Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 uppercase">
            Базова модель (До адаптації)
          </span>
          <p className="mt-3 text-xs text-gray-600 font-mono leading-relaxed dark:text-dark-muted">
            "Once upon a time, there was a little robot. It walked in the garden and saw a bird. The bird said hello and flew away. The end."
          </p>
          <div className="mt-4 text-[11px] text-gray-400 font-mono">Perplexity: 18.42</div>
        </div>

        <div className="rounded-xl border border-denim/40 bg-cloud/50 p-5 shadow-sm dark:border-denim/30 dark:bg-denim/10">
          <span className="rounded bg-denim px-2 py-0.5 text-[10px] font-bold text-white uppercase">
            LoRA Адаптована модель (Після 50 кроків)
          </span>
          <p className="mt-3 text-xs text-graphite font-mono leading-relaxed dark:text-dark-text font-medium">
            "Once upon a time, an intelligent autonomous agent configured its neural policy. Connecting to the Redis cluster, it observed optimal convergence and successfully executed the workflow."
          </p>
          <div className="mt-4 text-[11px] text-denim font-bold font-mono">Perplexity: 7.15 (-61%)</div>
        </div>
      </div>
    </div>
  );
}
