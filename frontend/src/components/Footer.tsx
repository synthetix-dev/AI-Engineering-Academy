import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Github, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-borderline bg-white py-8 text-xs text-gray-500 dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="font-semibold text-graphite dark:text-dark-text">AI Engineering Academy</span>
          <span className="hidden sm:inline">•</span>
          <span>Відкрита браузерна платформа практичного навчання (ТЗ v1.1)</span>
          <span className="hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Без платних API
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/models" className="hover:text-graphite dark:hover:text-dark-text transition-colors flex items-center gap-1">
            <Cpu className="h-3.5 w-3.5" /> Ліцензії моделей
          </Link>
          <Link href="/admin" className="hover:text-graphite dark:hover:text-dark-text transition-colors flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> SLA & Аудит
          </Link>
        </div>
      </div>
    </footer>
  );
}
