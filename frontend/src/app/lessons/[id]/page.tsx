"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  ArrowRight,
  ArrowLeft,
  Award,
} from "lucide-react";
import { getLesson, submitLessonAttempt, Lesson } from "@/lib/api";

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params?.id as string;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    getLesson(lessonId)
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = async () => {
    if (!lesson) return;
    setSubmitting(true);
    const answersArray = lesson.quiz_questions.map((_, idx) => selectedAnswers[idx] ?? -1);
    try {
      const res = await submitLessonAttempt(lesson.id, answersArray);
      setQuizResult(res);
    } catch (err: any) {
      alert("Помилка відправки: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs font-mono text-gray-500">Завантаження уроку...</div>;
  }

  if (!lesson) {
    return <div className="p-4 text-xs text-red-600">Урок не знайдено.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/tracks"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-graphite dark:text-dark-muted dark:hover:text-dark-text"
      >
        <ArrowLeft className="h-3 w-3" /> До переліку напрямів
      </Link>

      {/* Lesson Header */}
      <div className="rounded-lg border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-denim/15 px-2 py-0.5 text-[11px] font-bold text-denim-700 dark:bg-denim/20 dark:text-denim">
            Урок #{lesson.order}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Інтерактивний урок
          </span>
        </div>
        <h1 className="text-2xl font-bold text-graphite dark:text-dark-text">{lesson.title}</h1>
        <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">{lesson.theory_summary}</p>
      </div>

      {/* Theory & Visual Algorithm */}
      <div className="rounded-lg border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
        <h2 className="text-base font-bold text-graphite dark:text-dark-text flex items-center gap-2 border-b border-borderline pb-3 dark:border-dark-border">
          <BookOpen className="h-4 w-4 text-denim" />
          Теоретичний огляд та контракт навчання
        </h2>

        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-700 dark:text-dark-muted space-y-3 leading-relaxed">
          <div className="whitespace-pre-line">{lesson.content_md}</div>

          {lesson.visual_algorithm_md && (
            <div className="mt-4 rounded-md border border-borderline bg-gray-50 p-4 dark:border-dark-border dark:bg-dark-bg font-mono text-xs">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                Схема алгоритму:
              </div>
              <pre className="text-graphite dark:text-dark-text overflow-x-auto">
                {lesson.visual_algorithm_md}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Quiz / Verification Question */}
      {lesson.quiz_questions && lesson.quiz_questions.length > 0 && (
        <div className="rounded-lg border border-borderline bg-white p-6 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-4">
          <h2 className="text-base font-bold text-graphite dark:text-dark-text flex items-center gap-2 border-b border-borderline pb-3 dark:border-dark-border">
            <HelpCircle className="h-4 w-4 text-tangerine" />
            Контрольна перевірка знань
          </h2>

          <div className="space-y-6">
            {lesson.quiz_questions.map((q, qIdx) => (
              <div key={qIdx} className="space-y-3">
                <div className="text-xs sm:text-sm font-semibold text-graphite dark:text-dark-text">
                  {qIdx + 1}. {q.question}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left rounded-md border p-3 text-xs sm:text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-denim bg-cloud font-medium text-graphite dark:border-denim dark:bg-dark-bg dark:text-white"
                            : "border-borderline bg-white text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted dark:hover:bg-dark-bg"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <span className="h-2 w-2 rounded-full bg-denim" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={handleQuizSubmit}
                disabled={submitting}
                className="rounded-md bg-denim-600 px-4 py-2 text-xs font-bold text-white hover:bg-denim-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "Перевірка..." : "Підтвердити відповіді та отримати XP"}
              </button>

              {quizResult && (
                <div
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    quizResult.status === "passed" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {quizResult.status === "passed" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Тест пройдено! Нараховано +{quizResult.xp_awarded} XP.
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Спробуйте ще раз. {quizResult.feedback}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Practical Lab Action Card */}
      {lesson.lab && (
        <div className="rounded-lg border border-denim/40 bg-cloud/50 p-6 dark:border-dark-border dark:bg-dark-surface flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-denim-700 dark:text-denim flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-tangerine" />
              Підключена практична лабораторія
            </div>
            <h3 className="text-base font-bold text-graphite dark:text-dark-text mt-1">{lesson.lab.title}</h3>
            <p className="text-xs text-gray-600 dark:text-dark-muted mt-0.5">
              Запустіть реальні обчислення, змініть гіперпараметри та збережіть результат у свій портфоліо.
            </p>
          </div>

          <Link
            href={`/labs/${lesson.lab.slug}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-tangerine px-5 py-2.5 text-xs font-bold text-white hover:bg-tangerine-600 transition-colors shadow-sm shrink-0"
          >
            Відкрити Лабораторну студію <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
