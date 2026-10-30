"use client";

import React, { useState } from "react";
import { Play, Cpu, Activity, Zap, HardDrive } from "lucide-react";

interface LLMBenchProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function LLMBenchWorkspace({ onRun, running, result }: LLMBenchProps) {
  const [promptTokens, setPromptTokens] = useState<number>(1024);
  const [genTokens, setGenTokens] = useState<number>(256);
  const [quantization, setQuantization] = useState<string>("int8");

  // Calculations
  const metrics = result?.metrics || {
    total_minimum_vram_gb: 14.8,
    model_weights_gb: 7.2,
    kv_cache_gb: 4.1,
    estimated_tps: 42.5,
  };

  const handleExecute = () => {
    onRun({
      prompt_tokens: promptTokens,
      gen_tokens: genTokens,
      quantization: quantization,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              LLM Інжиніринг: Калькулятор KV-Cache, VRAM та профайлінг латентності
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            {metrics.estimated_tps} Tokens/sec (Профілювання)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Prompt Context Tokens:</span>
              <span className="font-mono font-bold text-denim">{promptTokens}</span>
            </div>
            <input
              type="range"
              min="128"
              max="8192"
              step="128"
              value={promptTokens}
              onChange={(e) => setPromptTokens(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Max Generation Tokens:</span>
              <span className="font-mono font-bold text-denim">{genTokens}</span>
            </div>
            <input
              type="range"
              min="64"
              max="2048"
              step="64"
              value={genTokens}
              onChange={(e) => setGenTokens(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-2 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50 w-full justify-center"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Профайлінг пам'яті..." : "Профілювати інференс"}
            </button>
          </div>
        </div>
      </div>

      {/* Memory Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-borderline bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-surface text-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Вага моделі (Weights)</span>
          <span className="text-xl font-black text-graphite dark:text-dark-text">{metrics.model_weights_gb} GB</span>
          <span className="text-[10px] text-gray-400 block mt-1">Квантизовані параметри</span>
        </div>

        <div className="rounded-xl border border-borderline bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-surface text-center">
          <span className="text-[10px] font-bold text-denim uppercase block mb-1">Розмір KV-Cache</span>
          <span className="text-xl font-black text-denim">{metrics.kv_cache_gb} GB</span>
          <span className="text-[10px] text-gray-400 block mt-1">Для контексту {promptTokens} токенів</span>
        </div>

        <div className="rounded-xl border border-borderline bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-surface text-center">
          <span className="text-[10px] font-bold text-tangerine uppercase block mb-1">Мінімальний VRAM</span>
          <span className="text-xl font-black text-tangerine">{metrics.total_minimum_vram_gb} GB</span>
          <span className="text-[10px] text-gray-400 block mt-1">Рекомендована конфігурація</span>
        </div>
      </div>
    </div>
  );
}
