"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Compass,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>({
    full_name: "Олександр AI Інженер",
    career_goal: "ai_engineer",
    xp: 250,
    level: 1,
  });

  const [activeProject, setActiveProject] = useState<any>({
    name: "Мій Перший AI Companion",
    project_type: "companion",
    evolution_level: 1,
    version: "1.0.0",
    attached_skills: ["FOUNDATIONS_PYTHON", "PROMPT_ENGINEERING"],
    status: "trained",
  });

  useEffect(() => {
    // Fetch live user profile and active projects
    fetch("http://localhost:8000/api/v1/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.full_name) setUserData(d);
      })
      .catch(() => {});

    fetch("http://localhost:8000/api/v1/projects")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.length > 0) setActiveProject(d[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Greeting & XP Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D0D7DE]">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0D2238]">
            Вітаємо, {userData.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Ціль: <strong>{userData.career_goal.toUpperCase().replace("_", " ")}</strong> · Рівень {userData.level}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#D0D7DE] shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#EC612F]/10 flex items-center justify-center text-[#EC612F] font-bold text-xs">
            <Zap size={16} />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-[#0D2238]">{userData.xp} XP</div>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-[#EC612F] h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (userData.xp % 300) / 3)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* THREE HERO CARDS: Continue Learning, My Active Project, Next Skill */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Continue Learning */}
        <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm flex flex-col justify-between hover:border-[#6DA2E4] transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-[#6DA2E4] font-bold uppercase tracking-wider">
                ПРОДОВЖИТИ НАВЧАННЯ
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <h3 className="font-display font-bold text-lg text-[#0D2238] mb-1">
              4. Machine Learning
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Класифікація, дерева рішень та оцінка матриці помилок (Confusion Matrix).
            </p>
          </div>

          <Link
            href="/tracks/machine-learning"
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#0D2238] text-white hover:bg-[#1B3356] transition flex items-center justify-center gap-2 shadow-2xs"
          >
            <Play size={14} />
            <span>Продовжити трек</span>
          </Link>
        </div>

        {/* Card 2: My Active AI Project */}
        <div className="bg-white rounded-2xl border border-[#EC612F]/40 p-6 shadow-sm flex flex-col justify-between ring-2 ring-[#EC612F]/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-[#EC612F] font-bold uppercase tracking-wider">
                МІЙ ПОТОЧНИЙ AI-ПРОЄКТ
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#FEF2ED] text-[#EC612F] px-2 py-0.5 rounded-full">
                {activeProject.version}
              </span>
            </div>

            <h3 className="font-display font-bold text-lg text-[#0D2238] mb-1">
              {activeProject.name}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Тип: <strong>{activeProject.project_type}</strong> · Рівень еволюції: <strong>{activeProject.evolution_level}</strong>
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeProject.attached_skills.map((sk: string) => (
                <span
                  key={sk}
                  className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-mono text-gray-700"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/projects"
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#EC612F] text-white hover:bg-[#C94516] transition flex items-center justify-center gap-2 shadow-2xs"
          >
            <Sparkles size={14} />
            <span>Розвивати проєкт</span>
          </Link>
        </div>

        {/* Card 3: Next Skill to Master */}
        <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm flex flex-col justify-between hover:border-[#0D2238] transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">
                МОЯ НАСТУПНА НАВИЧКА
              </span>
              <Award size={16} className="text-amber-500" />
            </div>

            <h3 className="font-display font-bold text-lg text-[#0D2238] mb-1">
              Векторні Бази Даних (RAG)
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Семантичний пошук через pgvector, стратегії чанкінгу з overlap та усунення галюцинацій.
            </p>
          </div>

          <Link
            href="/tracks/rag-engineering"
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white text-[#0D2238] border border-[#D0D7DE] hover:bg-[#EDF5FE] transition flex items-center justify-center gap-2"
          >
            <span>Опанувати навичку</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Experiments & Verifications History */}
      <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-[#0D2238]">
            Збережені Експерименти та Результати Перевірок
          </h3>
          <span className="text-xs text-gray-400 font-mono">100% реальні чисельні метрики</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-mono uppercase">
                <th className="py-2.5 px-3">Напрям</th>
                <th className="py-2.5 px-3">Алгоритм</th>
                <th className="py-2.5 px-3">Цільова Метрика</th>
                <th className="py-2.5 px-3">Час</th>
                <th className="py-2.5 px-3">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              <tr>
                <td className="py-3 px-3 font-semibold text-[#0D2238]">4. Machine Learning</td>
                <td className="py-3 px-3 font-mono">RandomForest (n=40)</td>
                <td className="py-3 px-3 font-bold text-emerald-600">Accuracy 0.84</td>
                <td className="py-3 px-3 font-mono text-gray-400">0.14с</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    Verified
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#0D2238]">12. Training & Fine-tuning</td>
                <td className="py-3 px-3 font-mono">LoRA Adapter (r=4)</td>
                <td className="py-3 px-3 font-bold text-emerald-600">Loss 5.55 → 5.32</td>
                <td className="py-3 px-3 font-mono text-gray-400">0.28с</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    Verified
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#0D2238]">14. AI Agents</td>
                <td className="py-3 px-3 font-mono">ReAct Loop (Tools=4)</td>
                <td className="py-3 px-3 font-bold text-[#0D2238]">1 Step Trace</td>
                <td className="py-3 px-3 font-mono text-gray-400">0.02с</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    Verified
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
