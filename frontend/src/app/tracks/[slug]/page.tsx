"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Layers,
  Terminal,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  Play,
  ArrowLeft,
} from "lucide-react";
import { getTrack, Track } from "@/lib/api";

export default function TrackDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    getTrack(slug)
      .then((data) => {
        setTrack(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-mono text-gray-500">
        Завантаження структури навчального напряму...
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-xs text-red-700">
        Помилка завантаження: {error || "Напрям не знайдено"}
      </div>
    );
  }

  const lab = track.labs && track.labs.length > 0 ? track.labs[0] : null;

  return (
    <div className="space-y-6">
      <Link
        href="/tracks"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
      >
        <ArrowLeft className="h-3 w-3" /> До всіх навчальних напрямів
      </Link>

      {/* Header Card */}
      <div className="rounded-lg border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-denim/15 px-2 py-0.5 text-xs font-bold text-denim-700 dark:bg-denim/20 dark:text-denim">
                Напрям #{track.order}
              </span>
              <span className="text-xs font-mono text-gray-400 dark:text-dark-muted">
                Версія {track.version}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-graphite dark:text-dark-text">
              {track.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-dark-muted max-w-3xl leading-relaxed">
              {track.description}
            </p>
          </div>

          {lab && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/labs/${lab.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-tangerine px-4 py-2 text-xs font-bold text-white hover:bg-tangerine-600 transition-colors shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Відкрити лабораторію
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Syllabus / Courses & Lessons */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-graphite dark:text-dark-text flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-denim" />
          Навчальний план та практичні уроки
        </h2>

        <div className="space-y-4">
          {track.courses && track.courses.length > 0 ? (
            track.courses.map((course) => (
              <div
                key={course.id}
                className="rounded-lg border border-borderline bg-white dark:border-dark-border dark:bg-dark-surface overflow-hidden shadow-xs"
              >
                <div className="border-b border-borderline bg-gray-50 px-5 py-3 dark:border-dark-border dark:bg-dark-bg flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-graphite dark:text-dark-text">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
                      {course.description}
                    </p>
                  </div>
                  <span className="rounded border border-borderline px-2 py-0.5 text-[10px] font-mono uppercase text-gray-600 dark:border-dark-border dark:text-dark-muted">
                    Рівень: {course.level}
                  </span>
                </div>

                <div className="divide-y divide-borderline dark:divide-dark-border">
                  {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50/70 dark:hover:bg-dark-bg/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cloud text-xs font-bold font-mono text-denim-700 dark:bg-dark-bg dark:text-denim">
                            {lesson.order}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-graphite dark:text-dark-text">
                              <Link href={`/lessons/${lesson.id}`} className="hover:text-denim hover:underline">
                                {lesson.title}
                              </Link>
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-dark-muted mt-0.5 line-clamp-1">
                              {lesson.theory_summary || "Теорія, контрольні запитання та підключена лабораторія."}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="inline-flex items-center gap-1 rounded border border-borderline bg-white px-2.5 py-1 text-xs font-medium text-graphite hover:bg-gray-100 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text transition-colors"
                          >
                            Пройти урок <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-gray-500">Уроки формуються.</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-borderline bg-white p-6 text-center text-xs text-gray-500">
              Курси для цього напряму синхронізуються з базою даних.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
