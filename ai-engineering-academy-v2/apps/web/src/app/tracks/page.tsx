"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CURRICULUM_DATA } from "@academy/learning-engine";
import { BookOpen, Clock, Award, Filter, ArrowRight } from "lucide-react";

export default function TracksPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Всі 20 Напрямів" },
    { id: "foundations", label: "Фундамент (Foundations)" },
    { id: "core_ml", label: "Класичний ML" },
    { id: "deep_learning", label: "Deep Learning & Vision" },
    { id: "llm_genai", label: "LLM, RAG & Промптинг" },
    { id: "engineering_ops", label: "Агенти, Безпека & MLOps" },
  ];

  const filteredTracks = CURRICULUM_DATA.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.track.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0D2238]">
          20 Напрямів AI Engineering
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
          Кожен напрям побудований за триєдиною моделлю: дослідіть принцип у <strong>Discover</strong>,
          створіть власну модель у <strong>Create</strong>, та розв'яжіть інженерну проблему в <strong>Master</strong>.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-[#D0D7DE] pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? "bg-[#0D2238] text-white shadow-xs"
                : "bg-white text-gray-700 border border-[#D0D7DE] hover:bg-gray-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map((item) => (
          <div
            key={item.track.id}
            className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-xs hover:border-[#6DA2E4] hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-gray-400 font-bold">
                  НАПРЯМ #{item.track.number.toString().padStart(2, "0")}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EDF5FE] text-[#6DA2E4] font-semibold text-[10px]">
                  {item.track.category}
                </span>
              </div>

              <h2 className="font-display font-bold text-lg text-[#0D2238] group-hover:text-[#EC612F] transition-colors mb-2">
                {item.track.title}
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {item.track.description}
              </p>

              <div className="space-y-1.5 text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6DA2E4] font-bold">Discover:</span>
                  <span className="truncate">{item.discoverLesson.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#EC612F] font-bold">Create:</span>
                  <span className="truncate">{item.createBuilder.task_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#0D2238] font-bold">Master:</span>
                  <span className="truncate">{item.masterChallenge.title}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={13} /> {item.track.estimated_hours} годин
              </span>
              <Link
                href={`/tracks/${item.track.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0D2238] group-hover:text-[#EC612F] transition"
              >
                <span>Відкрити студію</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
