"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Cpu,
  Layers,
  Database,
  Briefcase,
  Award,
  Shield,
  Sun,
  Moon,
  Activity,
  User as UserIcon,
} from "lucide-react";
import { getQuotas, QuotaData } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [quotas, setQuotas] = useState<QuotaData | null>(null);

  useEffect(() => {
    // Check dark mode preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }

    // Load active quotas
    getQuotas()
      .then(setQuotas)
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDarkMode(true);
    }
  };

  const navItems = [
    { label: "Кар'єра", href: "/career-paths", icon: Briefcase },
    { label: "Треки", href: "/tracks", icon: Layers },
    { label: "Лабораторії (20)", href: "/labs", icon: Terminal },
    { label: "Моделі", href: "/models", icon: Cpu },
    { label: "Датасети", href: "/datasets", icon: Database },
    { label: "Портфоліо", href: "/portfolio", icon: Shield },
    { label: "Прогрес", href: "/progress", icon: Award },
    { label: "Ops & Статус", href: "/admin", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-borderline bg-white/95 backdrop-blur dark:border-dark-border dark:bg-dark-surface/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-graphite dark:text-dark-text">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-denim text-white font-bold text-sm shadow-sm">
            AI
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">AI ENGINEERING ACADEMY</span>
            <span className="text-[10px] text-gray-500 font-mono -mt-1 dark:text-dark-muted">
              OPEN PLATFORM v1.1
            </span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-cloud text-denim-700 font-semibold dark:bg-dark-bg dark:text-denim"
                    : "text-gray-600 hover:text-graphite hover:bg-gray-100 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-bg"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Live CPU quota status */}
          {quotas && (
            <div className="hidden lg:flex items-center gap-2 rounded border border-borderline px-2.5 py-1 text-[11px] font-mono text-gray-700 dark:border-dark-border dark:text-dark-muted bg-gray-50 dark:bg-dark-bg">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CPU: {quotas.cpu_seconds_used.toFixed(1)}s / {quotas.cpu_seconds_budget.toFixed(0)}s</span>
            </div>
          )}

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Змінити тему"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-borderline text-gray-600 hover:bg-gray-100 dark:border-dark-border dark:text-dark-muted dark:hover:bg-dark-bg transition-colors"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Profile Badge */}
          <Link
            href="/progress"
            className="flex items-center gap-1.5 rounded-md border border-borderline bg-gray-50 px-2.5 py-1 text-xs font-medium text-graphite hover:bg-gray-100 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text transition-colors"
          >
            <UserIcon className="h-3.5 w-3.5 text-denim" />
            <span className="hidden sm:inline">Learner</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
