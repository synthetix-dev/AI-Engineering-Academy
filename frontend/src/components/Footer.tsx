import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Github, Cpu, BookOpen, Layers, Terminal, Sparkles } from "lucide-react";
import OrangeFlower from "@/components/brand/OrangeFlower";

export default function Footer() {
  return (
    <footer className="border-t border-borderline bg-white text-xs text-gray-600 dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-borderline/70 dark:border-dark-border/70">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 font-display font-extrabold text-navy dark:text-dark-text tracking-tight text-base">
              <OrangeFlower size={24} />
              <span>AI ENGINEERING ACADEMY</span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-dark-muted leading-relaxed">
              Відкрита платформа підготовки інженерів нового покоління. 100% практичні обчислення без симуляцій та платних API.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>100% Open Source & Zero-Mock</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy dark:text-dark-text mb-3">
              Студія навчання
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tracks" className="hover:text-tangerine transition-colors">
                  Learn — 20 навчальних напрямів
                </Link>
              </li>
              <li>
                <Link href="/build" className="hover:text-tangerine transition-colors">
                  Build — Студія архітектур
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-tangerine transition-colors">
                  Explore — Дослідження моделей
                </Link>
              </li>
              <li>
                <Link href="/solve" className="hover:text-tangerine transition-colors">
                  Solve — Інженерні виклики
                </Link>
              </li>
              <li>
                <Link href="/career-paths" className="hover:text-tangerine transition-colors">
                  Career — Професійні треки
                </Link>
              </li>
            </ul>
          </div>

          {/* Real Technologies */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy dark:text-dark-text mb-3">
              Обчислювальний стек
            </h4>
            <ul className="space-y-2 text-gray-500 dark:text-dark-muted">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-denim" />
                <span>PyTorch CPU / MPS / NumPy</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-denim" />
                <span>PostgreSQL 16 + pgvector</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-denim" />
                <span>Scikit-Learn & HuggingFace</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-denim" />
                <span>FastAPI + Async Worker Daemon</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-denim" />
                <span>Redis Telemetry & Token Quotas</span>
              </li>
            </ul>
          </div>

          {/* Resources & Open Standards */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-navy dark:text-dark-text mb-3">
              Ресурси та прозорість
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/synthetix-dev/AI-Engineering-Academy"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-navy dark:hover:text-dark-text transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub Репозиторій</span>
                </a>
              </li>
              <li>
                <Link href="/models" className="flex items-center gap-1.5 hover:text-navy dark:hover:text-dark-text transition-colors">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Відкриті моделі та ліцензії</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="flex items-center gap-1.5 hover:text-navy dark:hover:text-dark-text transition-colors">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Криптографічні сертифікати</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center gap-1.5 hover:text-navy dark:hover:text-dark-text transition-colors">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>SLA, черги та телеметрія</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 dark:text-dark-muted">
          <div className="flex items-center gap-2">
            <span>© 2026 AI Engineering Academy. Відкрита освітня платформа.</span>
            <span>•</span>
            <span className="text-navy dark:text-white font-medium">Київ, Україна</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Безкоштовно назавжди для інженерів</span>
            <span>•</span>
            <span>Apache 2.0 / MIT Components</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
