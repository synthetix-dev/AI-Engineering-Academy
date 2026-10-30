"use client";

import React, { useState } from "react";
import { Play, RotateCcw, GitBranch, ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react";

interface AutoProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function AutomationDAGWorkspace({ onRun, running, result }: AutoProps) {
  const [pipelineName, setPipelineName] = useState<string>("daily_customer_churn_sync");
  const [nodes, setNodes] = useState([
    { id: "node_1", type: "trigger", title: "Cron Trigger (09:00 UTC)", status: "succeeded", duration: "12ms" },
    { id: "node_2", type: "action", title: "Fetch High-Risk Churn DB", status: "succeeded", duration: "184ms" },
    { id: "node_3", type: "condition", title: "Filter (Risk Score > 0.75)", status: "succeeded", duration: "4ms" },
    { id: "node_4", type: "action", title: "Generate Retention Offer (LLM)", status: "succeeded", duration: "410ms" },
    { id: "node_5", type: "action", title: "Send Telegram / Slack Alert", status: "succeeded", duration: "92ms" },
  ]);

  const handleExecute = () => {
    onRun({
      pipeline_name: pipelineName,
      nodes_count: nodes.length,
      enable_retries: true,
      max_retries: 3,
    });
  };

  return (
    <div className="space-y-6">
      {/* Workflow Canvas Header */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Інтерактивний DAG конвеєр автоматизації процесів
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            DAG Engine (Directed Acyclic Graph)
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-graphite dark:text-dark-text block mb-1">
              Назва конвеєра:
            </label>
            <input
              type="text"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-mono text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text font-medium"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-2 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Виконання пайплайну..." : "Запустити DAG пайплайн"}
            </button>
          </div>
        </div>
      </div>

      {/* Visual DAG Nodes Canvas */}
      <div className="rounded-xl border border-borderline bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-4">
          Топологія графу вузлів та статус виконання:
        </h4>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 overflow-x-auto py-4">
          {nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div className="flex-1 min-w-[150px] rounded-xl border border-borderline bg-gray-50/60 p-3.5 shadow-xs dark:border-dark-border dark:bg-dark-surface">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-gray-500">
                    Вузол 0{idx + 1}
                  </span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                </div>
                <h5 className="text-xs font-bold text-graphite dark:text-dark-text leading-snug">
                  {node.title}
                </h5>
                <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>{node.type}</span>
                  <span className="text-denim font-semibold">{node.duration}</span>
                </div>
              </div>

              {idx < nodes.length - 1 && (
                <div className="hidden md:flex text-gray-400">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
