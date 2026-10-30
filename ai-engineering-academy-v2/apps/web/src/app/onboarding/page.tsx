"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CAREER_PATHS } from "@academy/learning-engine";
import { Compass, Check, ArrowRight, Sparkles, Cpu, Layers, Rocket } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string>("ai_engineer");

  const handleSelectGoal = async (code: string) => {
    setSelectedGoal(code);
    try {
      await fetch("http://localhost:8000/api/v1/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career_goal: code }),
      });
    } catch {
      // Local fallback
    }
  };

  const currentPath = CAREER_PATHS.find((p) => p.code === selectedGoal) || CAREER_PATHS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#D0D7DE] text-xs font-mono font-semibold text-[#0D2238]">
          <Compass size={14} className="text-[#EC612F]" />
          <span>Крок 1: Оберіть Вашу Ціль в AI</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0D2238]">
          Кар'єрний Маршрут
        </h1>
        <p className="text-sm text-gray-600">
          Платформа адаптує рекомендовану послідовність навчальних завдань відповідно до вашого вибору.
          Ви завжди збережете вільний доступ до всіх 20 напрямів.
        </p>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CAREER_PATHS.map((path) => {
          const isSelected = selectedGoal === path.code;
          return (
            <div
              key={path.id}
              onClick={() => handleSelectGoal(path.code)}
              className={`p-6 rounded-2xl border cursor-pointer transition flex flex-col justify-between bg-white ${
                isSelected
                  ? "border-[#EC612F] ring-2 ring-[#EC612F]/20 shadow-md"
                  : "border-[#D0D7DE] hover:border-[#6DA2E4] hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected ? "bg-[#FEF2ED] text-[#EC612F]" : "bg-[#EDF5FE] text-[#0D2238]"
                    }`}
                  >
                    <Sparkles size={18} />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#EC612F] text-white flex items-center justify-center">
                      <Check size={14} />
                    </div>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-[#0D2238] mb-1">
                  {path.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {path.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 text-xs font-mono text-gray-500">
                {path.track_ids.length > 0 ? `${path.track_ids.length} пріоритетних треків` : "Вільний каталог"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Path Details & Confirm */}
      <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-[#6DA2E4] font-bold">ОБРАНИЙ МАРШРУТ</span>
          <h3 className="font-display font-bold text-xl text-[#0D2238] mt-0.5">
            {currentPath.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Рекомендований стартовий трек:{" "}
            <strong>{currentPath.recommended_order[0] || "engineering-fundamentals"}</strong>
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#0D2238] text-white hover:bg-[#1B3356] transition text-sm shadow-md"
        >
          <span>Перейти до кабінету</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
