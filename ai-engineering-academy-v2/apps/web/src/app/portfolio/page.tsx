"use client";

import React, { useState } from "react";
import { Award, CheckCircle2, ExternalLink, Share2, ShieldCheck, Sparkles } from "lucide-react";

export default function PortfolioPage() {
  const [portfolioItems] = useState([
    {
      id: "port-1",
      title: "Високопродуктивний Кредитний Скоринг (Random Forest + Scikit)",
      summary: "Побудовано стійку модель кредитного скорингу з нормалізацією ознак та усуненням Data Leakage.",
      skills: ["CLASSICAL_ML", "DATA_ENGINEERING", "MLOPS"],
      metrics: { accuracy: "84.0%", f1_score: "0.82", latency: "14ms" },
      public_slug: "verified-credit-scoring-model",
      verified: true,
    },
    {
      id: "port-2",
      title: "LoRA Адаптер для Технічної Підтримки AI",
      summary: "Справжнє донавчання параметрів уваги (r=4, alpha=8) на україномовному датасеті інструкцій.",
      skills: ["FINETUNING", "LLM_ENGINEERING", "GENERATIVE_AI"],
      metrics: { loss_reduction: "4.1%", adapter_size: "480 KB", perplexity_gain: "+0.04" },
      public_slug: "lora-technical-support-adapter",
      verified: true,
    },
    {
      id: "port-3",
      title: "Enterprise RAG База Знань з pgvector",
      summary: "Гібридний пошук із чанкінгом, реранкінгом та захистом від галюцинацій (Faithfulness 94%).",
      skills: ["RAG_ENGINEERING", "AI_AGENTS", "AI_SAFETY"],
      metrics: { mrr_retrieval: "0.89", faithfulness: "94.2%", pii_blocked: "100%" },
      public_slug: "enterprise-rag-pgvector-gateway",
      verified: true,
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D0D7DE] text-xs font-mono font-semibold text-[#0D2238] mb-2">
            <Award size={14} className="text-[#EC612F]" />
            <span>VERIFIED AI ENGINEER PORTFOLIO</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-[#0D2238]">
            Публічне Професійне Портфоліо
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Усі проєкти та досягнення підтверджені детермінованими тестами платформи та готові для демонстрації роботодавцям.
          </p>
        </div>

        <button
          onClick={() => alert("Посилання на портфоліо скопійовано в буфер обміну!")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0D2238] text-white hover:bg-[#1B3356] transition shadow-xs"
        >
          <Share2 size={14} />
          <span>Поділитися портфоліо</span>
        </button>
      </div>

      {/* Portfolio Items List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm flex flex-col justify-between hover:border-[#6DA2E4] transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold">
                  <CheckCircle2 size={12} />
                  <span>VERIFIED BY ACADEMY 2.0</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400">ID #{item.id}</span>
              </div>

              <h3 className="font-display font-bold text-lg text-[#0D2238] mb-2">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">{item.summary}</p>

              {/* Verified Metrics */}
              <div className="p-3 bg-[#EDF5FE]/60 rounded-xl border border-[#6DA2E4]/30 space-y-1 mb-4 text-xs font-mono">
                {Object.entries(item.metrics).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500">{k}:</span>
                    <span className="font-bold text-[#0D2238]">{v}</span>
                  </div>
                ))}
              </div>

              {/* Skills Demonstrated */}
              <div className="flex flex-wrap gap-1.5">
                {item.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-mono text-gray-700"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-6 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono">Open-Source Code</span>
              <button
                onClick={() => alert(`Відкриття інтерактивного демо для ${item.title}`)}
                className="font-bold text-[#EC612F] hover:underline flex items-center gap-1"
              >
                <span>Інтерактивне Демо</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
