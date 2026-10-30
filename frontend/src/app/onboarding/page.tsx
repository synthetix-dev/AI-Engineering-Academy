"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Cpu,
  Layers,
  Activity,
  Zap,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Award,
  BookOpen,
  Code2,
  Play,
} from "lucide-react";
import { getCareerPaths, submitOnboarding, CareerPath } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("ai-engineer");
  const [level, setLevel] = useState<string>("intermediate");
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCareerPaths()
      .then((data) => {
        setPaths(data);
        if (data.length > 0) setSelectedPath(data[0].slug);
      })
      .catch((err) => setError(err.message));
  }, []);

  const diagnosticQuestions = [
    {
      id: "q1",
      question: "Що відбувається під час Backpropagation у глибокій нейромережі?",
      options: [
        "Обчислення градієнта функції втрат відносно вагів за ланцюговим правилом",
        "Збільшення швидкості навчання (Learning Rate) на кожному кроці",
        "Фільтрація викидів у датасеті через аналіз Z-score",
        "Стиснення розміру моделі в формат int8",
      ],
      correct: 0,
    },
    {
      id: "q2",
      question: "У чому головна відмінність між LoRA та повним Fine-Tuning мовної моделі?",
      options: [
        "LoRA змінює лише токенізатор моделі",
        "LoRA заморожує основні ваги і навчає низькорангові матриці розкладу (A × B)",
        "LoRA вимагає в 10 разів більше відеопам'яті, ніж повне навчання",
        "LoRA працює виключно з моделями комп'ютерного зору",
      ],
      correct: 1,
    },
    {
      id: "q3",
      question: "Для чого використовується гібридний пошук у RAG (Dense + BM25)?",
      options: [
        "Для зменшення вартості генерації токенів у 2 рази",
        "Для поєднання семантичного векторного пошуку з точним пошуком за ключовими словами",
        "Для видалення галюцинацій без використання контексту",
        "Для шифрування бази даних у PostgreSQL",
      ],
      correct: 1,
    },
  ];

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitOnboarding({
        career_path: selectedPath,
        level: level,
        answers: answers,
      });
      setResult(res);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-borderline bg-cloud px-3.5 py-1 text-xs font-semibold text-graphite mb-3 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text">
          <Sparkles className="h-3.5 w-3.5 text-tangerine" />
          Персональний навчальний онбординг
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-graphite dark:text-dark-text sm:text-4xl">
          Сформуй свій шлях в AI Engineering
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-dark-muted max-w-2xl mx-auto">
          Вибери кар'єрну спеціалізацію, пройди експрес-діагностику знань та отримай персоналізовану карту розвитку зі 100% практикою на відритому стеку.
        </p>

        {/* Stepper indicator */}
        <div className="mt-6 flex justify-center items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step >= 1 ? "text-denim font-bold" : "text-gray-400"}`}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-denim/10 border border-denim/30">1</span>
            Спеціалізація
          </div>
          <div className="h-0.5 w-8 bg-gray-200 dark:bg-dark-border" />
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step >= 2 ? "text-denim font-bold" : "text-gray-400"}`}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-denim/10 border border-denim/30">2</span>
            Діагностика
          </div>
          <div className="h-0.5 w-8 bg-gray-200 dark:bg-dark-border" />
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step >= 3 ? "text-denim font-bold" : "text-gray-400"}`}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-denim/10 border border-denim/30">3</span>
            План розвитку
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* STEP 1: Select Career Goal */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paths.map((p) => {
              const isSelected = selectedPath === p.slug;
              return (
                <div
                  key={p.slug}
                  onClick={() => setSelectedPath(p.slug)}
                  className={`cursor-pointer rounded-xl border p-5 transition-all shadow-sm ${
                    isSelected
                      ? "border-denim bg-cloud/50 ring-2 ring-denim/20 dark:border-denim dark:bg-denim/10"
                      : "border-borderline bg-white hover:border-gray-400 dark:border-dark-border dark:bg-dark-surface"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border border-borderline shadow-xs dark:bg-dark-surface dark:border-dark-border">
                        {getPathIcon(p.icon)}
                      </div>
                      <div>
                        <h3 className="font-bold text-graphite dark:text-dark-text text-base">{p.title}</h3>
                        <span className="text-xs font-medium text-denim dark:text-dark-accent">{p.role_focus}</span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-denim" />}
                  </div>

                  <p className="mt-3 text-xs text-gray-600 dark:text-dark-muted line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500 font-mono border-t border-borderline/60 pt-3 dark:border-dark-border/60">
                    <span>{p.track_slugs.length} треків програми</span>
                    <span>~{p.estimated_hours} годин практики</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Level selection */}
          <div className="rounded-xl border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface">
            <h4 className="text-sm font-bold text-graphite dark:text-dark-text mb-3">Оцініть свій поточний рівень підготовки:</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "beginner", title: "Beginner", desc: "Знаю базовий Python, хочу увійти в ML" },
                { id: "intermediate", title: "Intermediate", desc: "Працював з scikit-learn або API, хочу глибини" },
                { id: "advanced", title: "Advanced", desc: "Пишу моделі на PyTorch, прагну Fine-Tuning & MLOps" },
              ].map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id)}
                  className={`cursor-pointer rounded-lg border p-3.5 text-center transition ${
                    level === lvl.id
                      ? "border-denim bg-cloud dark:bg-denim/10 text-denim font-bold"
                      : "border-borderline hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-surface"
                  }`}
                >
                  <div className="text-sm">{lvl.title}</div>
                  <div className="text-[11px] text-gray-500 font-normal mt-1">{lvl.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-lg bg-denim px-6 py-2.5 text-sm font-medium text-white shadow hover:bg-denim-dark transition"
            >
              Перейти до експрес-діагностики
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Diagnostic Assessment */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-borderline bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
            <h3 className="text-base font-bold text-graphite dark:text-dark-text mb-1">
              Діагностика технічного рівня
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Відповідайте на питання, щоб система адаптувала початковий набір практичних завдань.
            </p>

            <div className="space-y-6">
              {diagnosticQuestions.map((q, idx) => (
                <div key={q.id} className="border-b border-borderline/60 pb-5 last:border-0">
                  <div className="text-xs font-semibold text-denim mb-1">Питання {idx + 1} з 3</div>
                  <p className="text-sm font-semibold text-graphite dark:text-dark-text mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        onClick={() => setAnswers({ ...answers, [q.id]: optIdx })}
                        className={`cursor-pointer flex items-center gap-3 rounded-lg border px-4 py-2.5 text-xs transition ${
                          answers[q.id] === optIdx
                            ? "border-denim bg-cloud dark:bg-denim/15 text-denim font-medium"
                            : "border-borderline hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-surface"
                        }`}
                      >
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                          answers[q.id] === optIdx ? "border-denim bg-denim text-white" : "border-gray-300"
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Змінити спеціалізацію
            </button>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-tangerine px-6 py-2.5 text-sm font-medium text-white shadow hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Формування плану..." : "Зберегти план та розпочати"}
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Personalized Learning Roadmap */}
      {step === 3 && result && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6 text-center dark:border-green-900/50 dark:bg-green-950/20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="mt-3 text-xl font-extrabold text-graphite dark:text-dark-text">
              Онбординг успішно пройдено!
            </h2>
            <p className="mt-1 text-xs text-gray-600 dark:text-dark-muted">
              {result.message}
            </p>
          </div>

          {/* Recommendations Card */}
          <div className="rounded-xl border border-borderline bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
            <h3 className="text-base font-bold text-graphite dark:text-dark-text mb-4">
              Ваш персональний стартовий план
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border border-denim/40 bg-cloud/50 p-4 dark:border-denim/30 dark:bg-denim/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-denim text-white font-bold text-sm">
                    01
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-denim uppercase tracking-wider">Рекомендований стартовий трек</span>
                    <h4 className="text-sm font-bold text-graphite dark:text-dark-text">
                      {result.starting_track}
                    </h4>
                  </div>
                </div>

                <Link
                  href={`/tracks/${result.starting_track}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-denim px-4 py-2 text-xs font-semibold text-white shadow hover:bg-denim-dark transition"
                >
                  Розпочати навчання
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-2">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Повна послідовність треків у вибраній програмі:
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {result.recommended_tracks.map((trk: string, idx: number) => (
                    <Link
                      key={trk}
                      href={`/tracks/${trk}`}
                      className="flex items-center gap-2 rounded-md border border-borderline p-2.5 text-xs text-graphite hover:border-denim dark:border-dark-border dark:text-dark-text transition"
                    >
                      <span className="text-[10px] font-mono text-gray-400">#{idx + 1}</span>
                      <span className="truncate font-medium">{trk}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
            <Link
              href="/career-paths"
              className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Переглянути всі кар'єрні шляхи
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/tracks"
                className="inline-flex items-center gap-1.5 rounded-lg border border-borderline bg-white px-4 py-2 text-xs font-semibold text-graphite hover:bg-gray-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text transition"
              >
                Навчальні треки (Learn)
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-lg bg-tangerine px-5 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Розпочати першу практику
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
