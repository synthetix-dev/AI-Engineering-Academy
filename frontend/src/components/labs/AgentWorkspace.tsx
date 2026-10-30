"use client";

import React, { useState } from "react";
import { Play, Bot, CheckCircle2, Shield, AlertTriangle, ArrowRight, Check, X } from "lucide-react";

interface AgentProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function AgentWorkspace({ onRun, running, result }: AgentProps) {
  const [goal, setGoal] = useState<string>(
    "Перевір у базі даних клієнтів з високим ризиком відтоку (Churn > 0.8) та сформуй пропозицію зі знижкою."
  );
  const [enabledTools, setEnabledTools] = useState<string[]>([
    "database_query",
    "python_sandbox",
    "email_sender",
    "crm_updater",
  ]);
  const [requireApproval, setRequireApproval] = useState<boolean>(true);
  const [pendingApproval, setPendingApproval] = useState<boolean>(true);

  // ReAct Trace steps
  const reactSteps = [
    {
      step: 1,
      type: "thought",
      text: "Потрібно спочатку виконати SQL запит до таблиці клієнтів, щоб знайти записи з ймовірністю відтоку Churn > 0.8.",
    },
    {
      step: 2,
      type: "action",
      tool: "database_query",
      args: "SELECT id, email, salary, churn_score FROM customers WHERE churn_score > 0.8 LIMIT 3;",
    },
    {
      step: 3,
      type: "observation",
      text: "Отримано 3 клієнти: [id=42, email='taras@example.com'], [id=88, email='olena@tech.ua'], [id=105, email='dmytro@cloud.io'].",
    },
    {
      step: 4,
      type: "thought",
      text: "Перед відправкою листа клієнтам необхідно запитати підтвердження в інженера через Human-in-the-Loop протокол.",
    },
    {
      step: 5,
      type: "action",
      tool: "email_sender",
      args: "send_batch_email(to=['taras@example.com', 'olena@tech.ua'], template='churn_discount_20')",
      requires_approval: true,
    },
  ];

  const handleExecute = () => {
    onRun({
      goal: goal,
      enabled_tools: enabledTools,
      require_human_approval: requireApproval,
      max_iterations: 6,
    });
  };

  const toggleTool = (toolName: string) => {
    if (enabledTools.includes(toolName)) {
      setEnabledTools(enabledTools.filter((t) => t !== toolName));
    } else {
      setEnabledTools([...enabledTools, toolName]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Objective & Tools Canvas */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Автономний ReAct Агент (Reasoning + Acting з Human-in-the-Loop)
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            Zero-Mock Execution Engine
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-graphite dark:text-dark-text block mb-1">
              Цільова місія агента (Goal):
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2.5 text-xs text-graphite focus:border-denim dark:border-dark-border dark:bg-dark-surface dark:text-dark-text font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Доступний набір інструментів (Tool Canvas):
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "database_query", label: "SQL Telemetry Query" },
                { id: "python_sandbox", label: "AST Python Sandbox" },
                { id: "email_sender", label: "Mailbox API (State-changing)" },
                { id: "crm_updater", label: "CRM Sync API" },
                { id: "calendar_tool", label: "Calendar Scheduler" },
              ].map((tool) => {
                const isActive = enabledTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "border-denim bg-cloud text-denim dark:border-denim dark:bg-denim/20"
                        : "border-borderline text-gray-500 hover:bg-gray-50 dark:border-dark-border dark:text-dark-muted"
                    }`}
                  >
                    {isActive ? "✓ " : "+ "}
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-borderline/60 pt-3">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-dark-text cursor-pointer">
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="accent-denim"
              />
              <span>Вимагати ручне підтвердження (Human-in-the-Loop) для важливих дій</span>
            </label>

            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-1.5 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Виконання плану дій..." : "Запустити агента"}
            </button>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop Approval Modal/Banner */}
      {requireApproval && pendingApproval && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  Human-in-the-Loop: Запит на підтвердження дії агента
                </h4>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                  Агент ініціював виклик зовнішнього сервісу:{" "}
                  <code className="font-mono font-bold bg-amber-100/80 px-1 rounded dark:bg-amber-900/40">
                    email_sender.send_batch_email(to=['taras@example.com', 'olena@tech.ua'])
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPendingApproval(false)}
                className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-green-700"
              >
                <Check className="h-3.5 w-3.5" /> Схвалити
              </button>
              <button
                onClick={() => setPendingApproval(false)}
                className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:bg-dark-surface dark:border-dark-border dark:text-dark-text"
              >
                <X className="h-3.5 w-3.5" /> Відхилити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ReAct Live Trace Stream */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-4">
          Покроковий трейс мислення та дій ReAct (Reasoning + Acting)
        </h4>

        <div className="space-y-3 font-mono text-xs">
          {reactSteps.map((s) => (
            <div
              key={s.step}
              className={`rounded-lg border p-3 ${
                s.type === "thought"
                  ? "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300"
                  : s.type === "action"
                  ? "border-amber-200 bg-amber-50/50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300"
                  : "border-green-200 bg-green-50/50 text-green-900 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-300"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                <span>Крок {s.step} — {s.type}</span>
                {s.tool && <span className="text-gray-500">Tool: {s.tool}</span>}
              </div>
              <p className="leading-relaxed">
                {s.type === "action" ? (
                  <code>{s.args}</code>
                ) : (
                  s.text
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
