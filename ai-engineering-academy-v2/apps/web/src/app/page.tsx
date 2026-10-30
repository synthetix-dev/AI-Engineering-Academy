import React from "react";
import Link from "next/link";
import { OrangeFlower } from "../components/brand/OrangeFlower";
import {
  Compass,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  Award,
  CheckCircle2,
} from "lucide-react";
import { CURRICULUM_DATA } from "@academy/learning-engine";
import { CAREER_PATHS } from "@academy/learning-engine";

export default function HomePage() {
  return (
    <div className="space-y-24 py-8">
      {/* 1. HERO SECTION (Bold Minimalist Editorial) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D0D7DE] shadow-xs text-xs font-mono font-medium text-[#0D2238]">
            <OrangeFlower size={16} />
            <span>AI Engineering Academy 2.0 · Open Source EdTech</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-[#0D2238] tracking-tight leading-[1.08]">
            ПОБУДУЙ СВОЄ <br />
            <span className="text-[#EC612F]">AI МАЙБУТНЄ</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl font-body leading-relaxed">
            Безкоштовна інтерактивна академія для підготовки професійних AI Engineers.
            Справжні обчислення, навчання нейромереж, RAG, Fine-tuning та AI-агенти.
            <span className="block mt-2 font-medium text-[#0D2238]">
              Жодних обов'язкових платних API чи імітацій.
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/tracks"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-[#0D2238] text-white hover:bg-[#1B3356] transition shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Почати Навчання</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-white text-[#0D2238] border border-[#D0D7DE] hover:bg-[#EDF5FE] transition shadow-xs"
            >
              <Compass size={18} className="text-[#EC612F]" />
              <span>Обрати Кар'єрний Маршрут</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 w-full max-w-3xl border-t border-[#D0D7DE]/60 text-left">
            <div>
              <p className="font-display font-extrabold text-2xl text-[#0D2238]">20</p>
              <p className="text-xs text-gray-500 font-medium">Інженерних напрямів</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl text-[#EC612F]">100%</p>
              <p className="text-xs text-gray-500 font-medium">Реальні ML-обчислення</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl text-[#6DA2E4]">0 ₴</p>
              <p className="text-xs text-gray-500 font-medium">Без платних SaaS чи API</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-2xl text-[#0D2238]">Open</p>
              <p className="text-xs text-gray-500 font-medium">Apache 2.0 ліцензія</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE CORE LOOPS: DISCOVER, CREATE, MASTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-3xl text-[#0D2238]">
            Триєдина Модель Освіти
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Єдина наскрізна система навчання без нудних лекцій та відірваної теорії.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Discover */}
          <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm flex flex-col justify-between hover:border-[#6DA2E4] transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EDF5FE] text-[#6DA2E4] flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="font-display font-bold text-xl text-[#0D2238] mb-2">
                Discover · Зрозумій
              </h3>
              <p className="text-xs text-[#6DA2E4] font-mono font-semibold uppercase tracking-wider mb-3">
                Орієнтир: Brilliant
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Інтерактивні концептуальні моделі. Рухайте точки даних і спостерігайте межу
                класифікації. Змінюйте learning rate і бачте сходження градієнта. Досліджуйте
                токенізацію та ваги уваги.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Дія → Результат → Перевірка</span>
              <span className="font-semibold text-[#0D2238]">Без симуляцій</span>
            </div>
          </div>

          {/* Create */}
          <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm flex flex-col justify-between hover:border-[#EC612F] transition ring-2 ring-[#EC612F]/10">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FEF2ED] text-[#EC612F] flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="font-display font-bold text-xl text-[#0D2238] mb-2">
                Create · Створи
              </h3>
              <p className="text-xs text-[#EC612F] font-mono font-semibold uppercase tracking-wider mb-3">
                Орієнтир: Teachable Machine
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Природний покроковий конструктор власних AI-систем. Виберіть задачу, налаштуйте
                дані, запустіть справжнє тренування моделі, оцініть матрицю помилок і збережіть
                артефакт у власний AI-проєкт.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>7-Step Natural Builder</span>
              <span className="font-semibold text-[#EC612F]">Збереження ваг</span>
            </div>
          </div>

          {/* Master */}
          <div className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm flex flex-col justify-between hover:border-[#0D2238] transition">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#0D2238] flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="font-display font-bold text-xl text-[#0D2238] mb-2">
                Master · Опануй
              </h3>
              <p className="text-xs text-[#0D2238] font-mono font-semibold uppercase tracking-wider mb-3">
                Орієнтир: CodeCrafters / HTB
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Реальні інженерні виклики: несправна модель, data leakage у пайплайні, зламаний RAG,
                перенавчання LoRA, prompt injection в агента. Дослідіть баг, виправте конфігурацію та
                доведіть результат тестами.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Детерміновані тести</span>
              <span className="font-semibold text-[#0D2238]">XP & Сертифікація</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI EVOLUTION: DEVELOP YOUR OWN AI COMPANION / MODEL / PRODUCT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#D0D7DE] p-8 sm:p-12 shadow-sm overflow-hidden relative">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF5FE] text-xs font-mono font-semibold text-[#6DA2E4]">
              <Sparkles size={14} className="text-[#EC612F]" />
              <span>Механіка AI Evolution</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0D2238]">
              Розвиток Власної AI-Системи
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Ви не просто проходите тести — ви з першого дня створюєте цифрову AI-систему, яка
              еволюціонує разом із вами. Додавайте знання (RAG), інструкції (Prompting),
              спеціалізацію (LoRA Fine-tuning), інструменти агентів та розгортайте у portfolio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-sm text-[#0D2238] mb-1">AI Companion</h4>
                <p className="text-xs text-gray-500">
                  Помічник із пам'яттю, RAG базою та дозволеними інструментами.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-sm text-[#0D2238] mb-1">AI Model</h4>
                <p className="text-xs text-gray-500">
                  Спеціалізована модель класифікації, NLP, зору чи LoRA адаптер.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-sm text-[#0D2238] mb-1">AI Product</h4>
                <p className="text-xs text-gray-500">
                  Повноцінний промисловий сервіс з API, guardrails та SLA.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-[#EC612F] text-white hover:bg-[#C94516] transition text-sm shadow-sm"
              >
                <span>Відкрити AI Studio</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 20 EDUCATIONAL TRACKS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-extrabold text-3xl text-[#0D2238]">
              Повний Каталог: 20 Напрямів AI
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Кожен напрям містить структурований Discover урок, Create конструктор та Master виклик.
            </p>
          </div>
          <Link
            href="/tracks"
            className="text-xs font-semibold text-[#EC612F] hover:underline mt-2 sm:mt-0 flex items-center gap-1"
          >
            <span>Дивитися всі 20 напрямів</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURRICULUM_DATA.slice(0, 8).map((item) => (
            <Link
              key={item.track.id}
              href={`/tracks/${item.track.slug}`}
              className="bg-white rounded-xl border border-[#D0D7DE] p-5 shadow-2xs hover:border-[#6DA2E4] hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-gray-400 font-medium">
                    #{item.track.number.toString().padStart(2, "0")}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EDF5FE] text-[#6DA2E4] font-semibold text-[10px]">
                    {item.track.category}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-[#0D2238] group-hover:text-[#EC612F] transition-colors mb-1">
                  {item.track.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {item.track.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>{item.track.estimated_hours} годин</span>
                <span className="text-[#0D2238] font-semibold group-hover:translate-x-1 transition-transform">
                  Відкрити →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. CAREER PATHS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display font-extrabold text-3xl text-[#0D2238]">
            Персональні Кар'єрні Маршрути
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Оберіть цільову професію та отримайте послідовний інженерний трек із верифікованими навичками.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_PATHS.slice(0, 3).map((path) => (
            <div
              key={path.id}
              className="bg-white rounded-2xl border border-[#D0D7DE] p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-[#EDF5FE] text-[#0D2238] w-fit rounded-xl mb-4">
                  <Compass size={22} className="text-[#EC612F]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#0D2238] mb-2">{path.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{path.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">
                  {path.track_ids.length} напрямів
                </span>
                <Link
                  href="/onboarding"
                  className="text-xs font-semibold text-[#0D2238] hover:text-[#EC612F] transition flex items-center gap-1"
                >
                  <span>Обрати трек</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
