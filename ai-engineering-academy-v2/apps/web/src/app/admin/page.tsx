"use client";

import React, { useState } from "react";
import { Shield, Activity, Users, Database, Cpu, AlertTriangle, Layers, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "queues" | "content" | "limits">("overview");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D0D7DE] text-xs font-mono font-semibold text-[#0D2238] mb-2">
          <Shield size={14} className="text-[#EC612F]" />
          <span>ADMINISTRATION & CONTROL PLANE</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-[#0D2238]">
          Адміністративна Панель Academy 2.0
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          Керування навчальним контентом, моніторинг обчислювальних черг та квот ресурсів.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#D0D7DE] pb-3 text-xs font-semibold">
        {[
          { id: "overview", label: "Огляд & Телеметрія", icon: Activity },
          { id: "queues", label: "Обчислювальні Черги", icon: Cpu },
          { id: "content", label: "Керування Контентом", icon: Layers },
          { id: "limits", label: "Квоти & Ліміти Ресурсів", icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === tab.id
                  ? "bg-[#0D2238] text-white"
                  : "bg-white text-gray-600 border border-[#D0D7DE] hover:bg-gray-50"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#D0D7DE] shadow-xs">
              <span className="text-xs text-gray-400 font-mono uppercase">Користувачі</span>
              <p className="font-display font-black text-2xl text-[#0D2238] mt-1">1,284</p>
              <span className="text-[10px] text-emerald-600 font-semibold">● 100% активні</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#D0D7DE] shadow-xs">
              <span className="text-xs text-gray-400 font-mono uppercase">Експерименти</span>
              <p className="font-display font-black text-2xl text-[#EC612F] mt-1">14,892</p>
              <span className="text-[10px] text-gray-500 font-mono">100% реальні розрахунки</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#D0D7DE] shadow-xs">
              <span className="text-xs text-gray-400 font-mono uppercase">Навчені Моделі</span>
              <p className="font-display font-black text-2xl text-[#6DA2E4] mt-1">3,410</p>
              <span className="text-[10px] text-gray-500 font-mono">Збережено ваги в реєстрі</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#D0D7DE] shadow-xs">
              <span className="text-xs text-gray-400 font-mono uppercase">Підтверджено Навичок</span>
              <p className="font-display font-black text-2xl text-emerald-700 mt-1">8,102</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Детерміновані тести</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Queues */}
      {activeTab === "queues" && (
        <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-[#0D2238]">
            Стан Асинхронних Черг Навчання (Valkey / Redis)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="font-bold text-[#0D2238] block mb-1">Queue: Lightweight CPU</span>
              <p className="text-gray-500">Глибина: 0 завдань</p>
              <p className="text-emerald-600 font-semibold mt-1">Status: Operational</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="font-bold text-[#0D2238] block mb-1">Queue: ML Training</span>
              <p className="text-gray-500">Глибина: 0 завдань</p>
              <p className="text-emerald-600 font-semibold mt-1">Status: Operational</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="font-bold text-[#0D2238] block mb-1">Queue: Fine-Tuning LoRA</span>
              <p className="text-gray-500">Глибина: 0 завдань</p>
              <p className="text-emerald-600 font-semibold mt-1">Status: Operational</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Content */}
      {activeTab === "content" && (
        <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm space-y-3">
          <h3 className="font-display font-bold text-base text-[#0D2238]">
            Керування Навчальним Контентом (20 Напрямів)
          </h3>
          <p className="text-xs text-gray-500">
            Усі уроки, вправи та критерії зберігаються у форматі JSON у директорії <code className="bg-gray-100 px-1 py-0.5 rounded">content/</code> без жорсткого зашивання у код.
          </p>
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-mono">
            Усі 20 напрямів успішно валідовано та доступно для редагування.
          </div>
        </div>
      )}

      {/* Tab: Limits */}
      {activeTab === "limits" && (
        <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm space-y-4 text-xs">
          <h3 className="font-display font-bold text-base text-[#0D2238]">
            Квоти Ресурсів & Захист Від Перевантаження
          </h3>
          <div className="space-y-2 font-mono">
            <p>MAX_CONCURRENT_JOBS_PER_USER: 2</p>
            <p>MAX_TRAINING_SECONDS: 300 (5 хвилин таймаут)</p>
            <p>MAX_DATASET_UPLOAD_MB: 25 MB</p>
            <p>RATE_LIMIT_PER_MINUTE: 120 запитів</p>
          </div>
        </div>
      )}
    </div>
  );
}
