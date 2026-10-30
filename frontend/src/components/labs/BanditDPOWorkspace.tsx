"use client";

import React, { useState } from "react";
import { Play, Activity, Award, ArrowRight } from "lucide-react";

interface BanditDPOProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function BanditDPOWorkspace({ onRun, running, result }: BanditDPOProps) {
  const [strategy, setStrategy] = useState<string>("ucb1");
  const [steps, setSteps] = useState<number>(100);
  const [dpoBeta, setDpoBeta] = useState<number>(0.1);

  const metrics = result?.metrics || {
    total_reward: 82.0,
    total_regret: 18.0,
    mean_dpo_loss: 0.651,
    reward_margin: 0.085,
  };

  const handleExecute = () => {
    onRun({
      strategy: strategy,
      steps: steps,
      dpo_beta: dpoBeta,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Навчання з підкріпленням: Multi-Armed Bandits & DPO Loss
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            Reward: {metrics.total_reward} | Regret: {metrics.total_regret}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-dark-muted block mb-1">
              Стратегія дослідження (Exploration Policy):
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="ucb1">UCB1 (Upper Confidence Bound)</option>
              <option value="epsilon_greedy">ε-Greedy (Epsilon: 0.1)</option>
              <option value="thompson">Thompson Sampling (Bayesian)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Параметр DPO Beta (β):</span>
              <span className="font-mono font-bold text-denim">{dpoBeta}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={dpoBeta}
              onChange={(e) => setDpoBeta(parseFloat(e.target.value))}
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
              {running ? "Симуляція дій..." : "Запустити Bandit & DPO"}
            </button>
          </div>
        </div>
      </div>

      {/* DPO Loss & Bandit Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-2">
            Функція втрат DPO (Direct Preference Optimization)
          </h4>
          <p className="text-xs text-gray-600 dark:text-dark-muted mb-4 font-mono">
            Середній DPO Loss: <strong className="text-denim">{metrics.mean_dpo_loss}</strong> | Margin: <strong className="text-green-600">{metrics.reward_margin}</strong>
          </p>
          <div className="rounded bg-gray-50 p-3 border border-borderline/60 font-mono text-[11px] text-gray-700 dark:bg-black/20 dark:text-dark-text">
            // Оптимізація ймовірності відповіді переможця y_w над y_l
          </div>
        </div>

        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-2">
            Баланс Exploration vs Exploitation
          </h4>
          <p className="text-xs text-gray-600 dark:text-dark-muted mb-4">
            Алгоритм {strategy.toUpperCase()} мінімізує жаль (Cumulative Regret) при виборі субоптимальних дій.
          </p>
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-green-600">Накопичена винагорода: +{metrics.total_reward}</span>
            <span className="text-amber-600">Штраф (Regret): -{metrics.total_regret}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
