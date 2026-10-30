"use client";

import React, { useState } from "react";
import { Code, BookOpen, Settings, Play, Copy, Check, Terminal, ExternalLink, X } from "lucide-react";
import { CodeExplanation } from "@academy/shared-types";

export interface SeeHowItWorksProps {
  data: CodeExplanation;
  isOpen: boolean;
  onClose: () => void;
}

export const SeeHowItWorksDrawer: React.FC<SeeHowItWorksProps> = ({ data, isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<"algorithm" | "code" | "config" | "api">("code");

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: "code" | "curl") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#D0D7DE] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#D0D7DE] flex items-center justify-between bg-[#EDF5FE]/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#6DA2E4]/20 rounded-lg text-[#0D2238]">
              <Code size={18} className="text-[#EC612F]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#0D2238]">
                Подивитися, як це працює (Engineering Blueprint)
              </h3>
              <p className="text-xs text-gray-500">
                {data.algorithm_name} · {data.library_used} v{data.library_version}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#D0D7DE] bg-gray-50/80 px-4 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("code")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "code"
                ? "border-[#EC612F] text-[#0D2238] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Code size={14} /> Фактичний Код
          </button>
          <button
            onClick={() => setActiveTab("algorithm")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "algorithm"
                ? "border-[#EC612F] text-[#0D2238] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <BookOpen size={14} /> Алгоритм & Математика
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "config"
                ? "border-[#EC612F] text-[#0D2238] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Settings size={14} /> Конфігурація & I/O
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === "api"
                ? "border-[#EC612F] text-[#0D2238] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Terminal size={14} /> REST API cURL
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "code" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">Python 3.11 · Scikit-Learn / PyTorch</span>
                <button
                  onClick={() => copyToClipboard(data.python_code, "code")}
                  className="flex items-center gap-1 text-xs font-medium text-[#EC612F] hover:underline"
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCode ? "Скопійовано" : "Копіювати код"}
                </button>
              </div>
              <pre className="p-4 bg-[#0D2238] text-white rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-[#263B53]">
                <code>{data.python_code}</code>
              </pre>

              <div>
                <h4 className="text-xs font-bold text-[#0D2238] uppercase tracking-wider mb-2">
                  Відтворюваний локальний запуск (Terminal Script)
                </h4>
                <pre className="p-3 bg-gray-100 text-gray-800 rounded-lg text-xs font-mono overflow-x-auto">
                  <code>{data.reproducible_script}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === "algorithm" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#0D2238] uppercase tracking-wider mb-1">
                  Математична інтуїція
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed font-mono bg-[#EDF5FE]/60 p-3 rounded-lg border border-[#6DA2E4]/30">
                  {data.mathematical_intuition}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#0D2238] uppercase tracking-wider mb-1">
                  Бібліотека та версія
                </h4>
                <p className="text-sm text-gray-700">
                  Використано офіційну open-source реалізацію:{" "}
                  <strong>
                    {data.library_used} {data.library_version}
                  </strong>
                  . Жодних закритих SaaS API або симуляцій.
                </p>
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#0D2238] uppercase tracking-wider mb-1">
                  Фактична конфігурація запуску
                </h4>
                <pre className="p-3 bg-gray-50 border border-gray-200 text-[#0D2238] rounded-lg text-xs font-mono overflow-x-auto">
                  {JSON.stringify(data.actual_config, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#0D2238] uppercase tracking-wider mb-1">
                    Вхідні дані (Sample Inputs)
                  </h4>
                  <pre className="p-3 bg-gray-50 border border-gray-200 text-[#0D2238] rounded-lg text-xs font-mono overflow-x-auto">
                    {JSON.stringify(data.sample_inputs, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0D2238] uppercase tracking-wider mb-1">
                    Вихідні дані (Outputs)
                  </h4>
                  <pre className="p-3 bg-gray-50 border border-gray-200 text-[#0D2238] rounded-lg text-xs font-mono overflow-x-auto">
                    {JSON.stringify(data.sample_outputs, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">cURL REST API Endpoint</span>
                <button
                  onClick={() => copyToClipboard(data.curl_request, "curl")}
                  className="flex items-center gap-1 text-xs font-medium text-[#EC612F] hover:underline"
                >
                  {copiedCurl ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCurl ? "Скопійовано" : "Копіювати cURL"}
                </button>
              </div>
              <pre className="p-4 bg-[#0D2238] text-white rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-[#263B53]">
                <code>{data.curl_request}</code>
              </pre>
              <p className="text-xs text-gray-500">
                Запит можна виконати в терміналі для прямої взаємодії з відкритим REST API платформи.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
