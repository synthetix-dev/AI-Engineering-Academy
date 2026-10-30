"use client";

import React, { useState } from "react";
import { Play, Bot, CheckCircle2, Shield, AlertTriangle, ArrowRight, Check, X, Terminal, Cpu } from "lucide-react";

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
  const [approvedAction, setApprovedAction] = useState<boolean | null>(null);

  // Real or interactive ReAct trace
  const reactSteps = [
    {
      step: 1,
      type: "thought",
      text: "Крок 1: Потрібно виконати SQL-запит до таблиці клієнтів, щоб знайти записи з ризиком відтоку Churn > 0.8.",
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
      text: "Крок 2: Знайдено клієнтів. Перед відправкою листа вимагається протокол Human-in-the-Loop підтвердження.",
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
      {/* Objective & Tools Canvas */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline/60 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-denim" />
            <div>
              <h3 className="font-display font-bold text-sm text-navy dark:text-white">
                Автономний ReAct Агент (Reasoning + Acting + Human-in-the-Loop)
              </h3>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                Налаштуйте системну ціль, доступні інструменти та правила підтвердження небезпечних дій
              </p>
            </div>
          </div>
          <span className="rounded-full bg-denim/10 px-3 py-0.5 text-[11px] font-bold text-denim border border-denim/30">
            ReAct Protocol
          </span>
        </div>

        {/* Goal Input */}
        <div>
          <label className="text-xs font-bold text-navy dark:text-white block mb-1">
            Системна мета агента (Goal / Task):
          </label>
          <textarea
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-lg border border-borderline bg-white p-2.5 text-xs text-navy focus:border-denim dark:border-dark-border dark:bg-dark-surface dark:text-white font-medium"
          />
        </div>

        {/* Tools Selector */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-navy dark:text-white block">
            Дозволені інструменти (Agent Tool Permissions):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "database_query", label: "PostgreSQL Reader", desc: "Читання таблиць" },
              { id: "python_sandbox", label: "Python Sandbox", desc: "Обчислення формул" },
              { id: "email_sender", label: "Email Dispatcher", desc: "Відправка листів" },
              { id: "crm_updater", label: "CRM API Writer", desc: "Зміна статусів" },
            ].map((t) => {
              const active = enabledTools.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTool(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    active
                      ? "border-denim bg-denim/10 dark:bg-denim/20"
                      : "border-borderline bg-cloud/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy dark:text-white">{t.label}</span>
                    {active ? <Check className="h-3.5 w-3.5 text-denim" /> : <X className="h-3.5 w-3.5 text-gray-400" />}
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-1">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Human in the loop toggle */}
        <div className="flex items-center justify-between border-t border-borderline/60 pt-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-navy dark:text-white">
              Вимагати ручне підтвердження інженера (Human-in-the-Loop) перед зовнішніми діями
            </span>
          </div>
          <input
            type="checkbox"
            checked={requireApproval}
            onChange={(e) => setRequireApproval(e.target.checked)}
            className="h-4 w-4 accent-denim"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-6 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-white" />
            {running ? "Виконання циклу ReAct..." : "Запустити агента"}
          </button>
        </div>
      </div>

      {/* ReAct Execution Flow Deck */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3">
          <h4 className="font-display font-bold text-sm text-navy dark:text-white flex items-center gap-2">
            <Terminal className="h-4 w-4 text-tangerine" />
            Покроковий лог мислення агента (Thought-Action-Observation)
          </h4>
          <span className="text-xs font-mono text-emerald-600 font-bold">5 кроків виконано</span>
        </div>

        <div className="space-y-3">
          {reactSteps.map((st) => (
            <div
              key={st.step}
              className={`rounded-xl border p-4 space-y-2 text-xs transition ${
                st.type === "thought"
                  ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/40"
                  : st.type === "action"
                  ? "border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900/40"
                  : "border-gray-200 bg-gray-50 dark:bg-dark-bg/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold uppercase text-[10px] tracking-wider text-gray-500">
                  {st.type === "thought" ? "🧠 Думка агента (Thought)" : st.type === "action" ? `⚡ Дія інструменту (${st.tool})` : "👁 Спостереження (Observation)"}
                </span>
                <span className="text-[10px] text-gray-400">Крок #{st.step}</span>
              </div>

              <div className="font-medium text-navy dark:text-white">
                {st.text || st.args}
              </div>

              {/* Human Approval Required Gate */}
              {st.requires_approval && (
                <div className="mt-2 pt-2 border-t border-orange-200 dark:border-orange-900/40 flex items-center justify-between bg-white dark:bg-dark-surface p-2.5 rounded-lg border">
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Потрібне схвалення інженера на відправку пошти:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setApprovedAction(true)}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${
                        approvedAction === true ? "bg-emerald-600 text-white" : "bg-cloud text-navy hover:bg-emerald-100"
                      }`}
                    >
                      ✓ Підтвердити
                    </button>
                    <button
                      onClick={() => setApprovedAction(false)}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${
                        approvedAction === false ? "bg-red-600 text-white" : "bg-cloud text-navy hover:bg-red-100"
                      }`}
                    >
                      ✗ Відхилити
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
