"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Terminal, BookOpen, ArrowRight, CheckCircle, Search } from "lucide-react";
import { getTracks, Track } from "@/lib/api";

export default function TracksCatalogPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTracks().then((data) => {
      setTracks(data);
      setLoading(false);
    });
  }, []);

  const filtered = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderline pb-5 dark:border-dark-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-graphite dark:text-dark-text">
            Каталог навчальних напрямів AI/ML Engineering
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted mt-1">
            20 модульних дисциплін за ТЗ v1.1 з наскрізною практикою від математичних засад до MLOps та Capstone.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук напряму чи навички..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-borderline bg-white pl-8 pr-3 py-1.5 text-xs text-graphite placeholder-gray-400 focus:border-denim focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500 font-mono">
          Завантаження сертифікованого каталогу курсів...
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((track) => {
            const lab = track.labs && track.labs.length > 0 ? track.labs[0] : null;
            const coursesCount = track.courses ? track.courses.length : 1;

            return (
              <div
                key={track.id}
                className="rounded-lg border border-borderline bg-white p-5 hover:border-gray-400 dark:border-dark-border dark:bg-dark-surface dark:hover:border-gray-600 transition-all shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-denim/15 px-2 py-0.5 text-[11px] font-bold text-denim-700 dark:bg-denim/20 dark:text-denim">
                        Модуль #{track.order}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ Теорія + Реальна практика
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-graphite dark:text-dark-text">
                      <Link href={`/tracks/${track.slug}`} className="hover:text-denim transition-colors">
                        {track.title}
                      </Link>
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-dark-muted leading-relaxed max-w-4xl">
                      {track.description}
                    </p>

                    {/* Outcomes */}
                    {track.outcomes && track.outcomes.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[11px] font-semibold text-gray-500 dark:text-dark-muted mb-1.5">
                          Результати навчання (Outcomes):
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {track.outcomes.map((outcome, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded border border-borderline/80 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted"
                            >
                              <CheckCircle className="h-2.5 w-2.5 text-emerald-500" />
                              {outcome}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Linked Lab */}
                  <div className="lg:w-72 flex flex-col justify-between rounded-md border border-borderline/70 bg-gray-50 p-3.5 dark:border-dark-border dark:bg-dark-bg">
                    <div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 dark:text-dark-muted mb-1 flex items-center gap-1">
                        <Terminal className="h-3 w-3 text-tangerine" />
                        Практична лабораторія
                      </div>
                      <div className="text-xs font-bold text-graphite dark:text-dark-text">
                        {lab ? lab.title : "Інтегрований воркер"}
                      </div>
                      <div className="mt-1 text-[11px] text-gray-500 dark:text-dark-muted">
                        Практичне середовище з живими обчисленнями
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-borderline/50 dark:border-dark-border/50 flex items-center justify-between gap-2">
                      <Link
                        href={`/tracks/${track.slug}`}
                        className="text-xs font-medium text-gray-700 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
                      >
                        Деталі курсу
                      </Link>
                      {lab && (
                        <Link
                          href={`/labs/${lab.slug}`}
                          className="inline-flex items-center gap-1.5 rounded bg-denim px-2.5 py-1 text-xs font-semibold text-white hover:bg-denim-600 transition-colors shadow-xs"
                        >
                          Запустити лаб <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
