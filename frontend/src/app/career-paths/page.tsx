"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Cpu,
  Layers,
  Sparkles,
  Activity,
  Terminal,
  Zap,
  ArrowRight,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { getCareerPaths, CareerPath } from "@/lib/api";

export default function CareerPathsPage() {
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    getCareerPaths()
      .then((data) => {
        setPaths(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getPathIcon = (iconName: string) => {
    switch (iconName) {
      case "cpu":
        return <Cpu className="h-6 w-6 text-denim" />;
      case "activity":
        return <Activity className="h-6 w-6 text-tangerine" />;
      case "sparkles":
        return <Sparkles className="h-6 w-6 text-purple-600" />;
      case "terminal":
        return <Terminal className="h-6 w-6 text-blue-600" />;
      case "zap":
        return <Zap className="h-6 w-6 text-amber-500" />;
      default:
        return <Layers className="h-6 w-6 text-denim" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-borderline pb-8 dark:border-dark-border">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-borderline bg-cloud px-3 py-0.5 text-xs font-semibold text-graphite mb-2 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text">
            <Briefcase className="h-3.5 w-3.5 text-denim" />
            Професійні освітні напрями
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-graphite dark:text-dark-text sm:text-4xl">
            Кар'єрні треки AI Engineering
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-muted max-w-2xl">
            Оберіть свій вектор розвитку. Кожен кар'єрний трек об'єднує фундаментальні знання, інтерактивні лабораторії, верифіковані проекти та портфоліо.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-lg bg-denim px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-denim-dark transition"
        >
          Пройти діагностику
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading && (
        <div className="py-20 text-center text-sm text-gray-500">
          Завантаження кар'єрних треків...
        </div>
      )}

      {error && (
        <div className="my-6 rounded-md border border-red-200 bg-red-50 p-4 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Pathways Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map((path) => (
          <div
            key={path.slug}
            className="flex flex-col justify-between rounded-xl border border-borderline bg-white p-6 shadow-sm hover:border-gray-400 transition dark:border-dark-border dark:bg-dark-surface"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-lg bg-cloud border border-borderline dark:bg-dark-surface dark:border-dark-border">
                  {getPathIcon(path.icon)}
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-gray-700 dark:bg-dark-border dark:text-dark-text">
                  {path.level}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-bold text-graphite dark:text-dark-text">
                {path.title}
              </h2>
              <div className="text-xs font-medium text-denim dark:text-dark-accent mt-0.5">
                {path.role_focus}
              </div>

              <p className="mt-2.5 text-xs text-gray-600 dark:text-dark-muted leading-relaxed">
                {path.description}
              </p>

              {/* Milestones */}
              <div className="mt-5 border-t border-borderline/60 pt-4 dark:border-dark-border/60">
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Ключові досягнення (Milestones):
                </h4>
                <div className="space-y-2">
                  {path.milestones.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-graphite dark:text-dark-text">{m.title}</span>
                        <p className="text-[11px] text-gray-500 dark:text-dark-muted">{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-borderline pt-4 dark:border-dark-border">
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~{path.estimated_hours} год.
                </span>
                <span>{path.track_slugs.length} треків курсу</span>
              </div>

              <Link
                href={`/tracks/${path.track_slugs[0]}`}
                className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-graphite px-4 py-2 text-xs font-semibold text-white hover:bg-black transition dark:bg-white dark:text-black"
              >
                Розпочати трек
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
