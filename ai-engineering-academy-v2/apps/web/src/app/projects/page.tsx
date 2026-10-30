"use client";

import React, { useState } from "react";
import { Sparkles, Layers, Cpu, ShieldCheck, ArrowRight, Plus, Terminal } from "lucide-react";

export default function ProjectsStudioPage() {
  const [projects, setProjects] = useState<any[]>([
    {
      id: "proj-companion-1",
      name: "Персональний AI Companion",
      project_type: "companion",
      evolution_level: 2,
      version: "v1.2.0",
      attached_skills: ["FOUNDATIONS_PYTHON", "PROMPT_ENGINEERING", "RAG_ENGINEERING"],
      status: "active",
      description: "Розумний асистент з підключеною локальною базою знань та ReAct інструментами.",
    },
    {
      id: "proj-model-1",
      name: "Кредитний Скоринг (Random Forest + LoRA)",
      project_type: "model",
      evolution_level: 3,
      version: "v2.0.0",
      attached_skills: ["CLASSICAL_ML", "DATA_ENGINEERING", "FINETUNING"],
      status: "trained",
      description: "Модель оцінки кредитоспроможності з точністю 84% та донавченим LoRA адаптером.",
    },
    {
      id: "proj-product-1",
      name: "Enterprise Customer Support Bot",
      project_type: "product",
      evolution_level: 1,
      version: "v1.0.0",
      attached_skills: ["AI_AGENTS", "AUTOMATION_INTEGRATIONS", "AI_SAFETY"],
      status: "deployed",
      description: "Повний пайплайн: Webhook шлюз, перевірка PII, виклики CRM та моніторинг дрифту.",
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "all") return true;
    return p.project_type === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D0D7DE] text-xs font-mono font-semibold text-[#0D2238] mb-2">
            <Sparkles size={14} className="text-[#EC612F]" />
            <span>AI EVOLUTION STUDIO</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-[#0D2238]">
            Мої AI-Проєкти та Еволюція Систем
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Кожен проєкт має справжній життєвий цикл версій, збережені ваги та підтверджені навички.
          </p>
        </div>

        <button
          onClick={() => {
            const name = prompt("Введіть назву нового AI проєкту:");
            if (name) {
              setProjects([
                ...projects,
                {
                  id: `proj-${Date.now()}`,
                  name,
                  project_type: "companion",
                  evolution_level: 1,
                  version: "v1.0.0",
                  attached_skills: ["FOUNDATIONS_PYTHON"],
                  status: "draft",
                  description: "Новий цифровий AI проєкт.",
                },
              ]);
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-[#EC612F] text-white hover:bg-[#C94516] transition text-xs shadow-sm"
        >
          <Plus size={16} />
          <span>Створити AI Проєкт</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#D0D7DE] pb-3 text-xs font-semibold">
        {[
          { id: "all", label: "Всі Проєкти" },
          { id: "companion", label: "AI Companions" },
          { id: "model", label: "AI Models" },
          { id: "product", label: "AI Products" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === tab.id
                ? "bg-[#0D2238] text-white"
                : "bg-white text-gray-600 border border-[#D0D7DE] hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm flex flex-col justify-between hover:border-[#6DA2E4] transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EC612F] bg-[#FEF2ED] px-2 py-0.5 rounded-full">
                  {p.project_type}
                </span>
                <span className="text-xs font-mono font-bold text-gray-500">{p.version}</span>
              </div>

              <h3 className="font-display font-bold text-lg text-[#0D2238] mb-1">{p.name}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{p.description}</p>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-gray-400 block uppercase">
                  Підключені AI Навички (Skills):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.attached_skills.map((sk: string) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded bg-[#EDF5FE] text-[10px] font-mono text-[#0D2238]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-6 flex items-center justify-between">
              <span className="text-xs text-emerald-600 font-semibold">● {p.status}</span>
              <button
                onClick={() => alert(`Проєкт ${p.name} оновлено до наступної версії!`)}
                className="text-xs font-bold text-[#0D2238] hover:text-[#EC612F] transition flex items-center gap-1"
              >
                <span>Підвищити рівень</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
