"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  Activity,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import { getQuotas, QuotaData } from "@/lib/api";
import OrangeFlower from "@/components/brand/OrangeFlower";

export default function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [quotas, setQuotas] = useState<QuotaData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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
    { label: "Learn", href: "/tracks" },
    { label: "Build", href: "/build" },
    { label: "Explore", href: "/explore" },
    { label: "Solve", href: "/solve" },
    { label: "Career", href: "/career-paths" },
    { label: "Проєкти", href: "/projects" },
    { label: "Портфоліо", href: "/portfolio" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-borderline bg-white/95 backdrop-blur-md dark:border-dark-border dark:bg-dark-surface/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Orange Flower */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <OrangeFlower size={28} className="transform transition-transform group-hover:rotate-12 duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-sm sm:text-base tracking-tight text-navy dark:text-white leading-none">
              AI ENGINEERING ACADEMY
            </span>
            <span className="text-[10px] text-gray-500 font-sans tracking-wider uppercase font-semibold mt-0.5 dark:text-dark-muted">
              Learn · Build · Explore · Solve
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-sans">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isActive
                    ? "bg-cloud text-navy border-b-2 border-tangerine dark:bg-dark-bg dark:text-white"
                    : "text-gray-600 hover:text-navy hover:bg-gray-100 dark:text-dark-muted dark:hover:text-white dark:hover:bg-dark-bg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live Compute Engine Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-borderline bg-cloud/70 px-2.5 py-1 text-[11px] font-mono text-navy dark:border-dark-border dark:bg-dark-bg dark:text-dark-text">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline font-semibold">CPU Engine:</span>
            <span>{quotas ? `${quotas.cpu_seconds_used.toFixed(1)}s` : "Online"}</span>
          </div>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Змінити тему"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderline text-navy hover:bg-cloud dark:border-dark-border dark:text-dark-muted dark:hover:bg-dark-bg transition-colors"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-navy" />}
          </button>

          {/* Action Button: Start Learning / Cabinet */}
          <Link
            href="/onboarding"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-tangerine px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all transform active:scale-95"
          >
            <span>Почати навчання</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* User / Dashboard profile button */}
          <Link
            href="/progress"
            aria-label="Прогрес"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderline bg-white hover:bg-cloud text-navy dark:border-dark-border dark:bg-dark-bg dark:text-dark-text transition-colors"
          >
            <UserIcon className="h-4 w-4" />
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню"
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-borderline text-navy dark:border-dark-border dark:text-dark-text"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-borderline bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-surface space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-xs font-semibold text-navy dark:text-dark-text border-b border-borderline/40 dark:border-dark-border/40"
            >
              <span>{item.label}</span>
              <ArrowRight className="h-3 w-3 text-gray-400" />
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-tangerine py-2 text-xs font-bold text-white"
            >
              Почати навчання
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
