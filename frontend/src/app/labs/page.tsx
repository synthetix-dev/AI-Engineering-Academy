"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, ArrowRight, Cpu, Play, Search, ShieldCheck } from "lucide-react";
import { getLabs, Lab } from "@/lib/api";

export default function LabsCatalogPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLabs().then((data) => {
      setLabs(data);
      setLoading(false);
    });
  }, []);

  const filtered = labs.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.slug.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderline pb-5 dark:border-dark-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-graphite dark:text-dark-text">
            Спеціалізовані AI/ML Лабораторії (20)
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted mt-1">
            Кожна лабораторія підключена до реальних серверних обчислювальних воркерів без заглушок чи симуляцій.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук лабораторії за назвою..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-borderline bg-white pl-8 pr-3 py-1.5 text-xs text-graphite placeholder-gray-400 focus:border-denim focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-gray-500">
          Завантаження списку лабораторій...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lab) => (
            <div
              key={lab.id}
              className="flex flex-col justify-between rounded-lg border border-borderline bg-white p-5 hover:border-denim hover:shadow-xs dark:border-dark-border dark:bg-dark-surface dark:hover:border-denim transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-cloud px-2 py-0.5 text-[10px] font-mono font-bold text-denim-700 dark:bg-dark-bg dark:text-denim">
                    {lab.runtime_class}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-dark-muted font-mono">
                    Таймаут: {lab.max_duration_sec}с
                  </span>
                </div>

                <h3 className="text-base font-bold text-graphite dark:text-dark-text line-clamp-1">
                  {lab.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-dark-muted line-clamp-2 leading-relaxed">
                  {lab.description}
                </p>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {lab.outcomes && lab.outcomes.slice(0, 2).map((o, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-borderline/60 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-600 dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted truncate max-w-full"
                    >
                      • {o}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-borderline/60 dark:border-dark-border/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400 dark:text-dark-muted">
                  slug: {lab.slug}
                </span>
                <Link
                  href={`/labs/${lab.slug}`}
                  className="inline-flex items-center gap-1.5 rounded bg-denim px-3 py-1 text-xs font-semibold text-white hover:bg-denim-600 transition-colors shadow-xs"
                >
                  <Play className="h-3 w-3 fill-current" /> Запустити студію
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
