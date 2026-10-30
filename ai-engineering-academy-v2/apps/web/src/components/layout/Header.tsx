"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrangeFlower } from "../brand/OrangeFlower";
import { Compass, Sparkles, BookOpen, Layers, Award, Shield, User } from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/tracks", label: "20 Напрямів", icon: BookOpen },
    { href: "/dashboard", label: "Особистий кабінет", icon: User },
    { href: "/projects", label: "AI Студія", icon: Sparkles },
    { href: "/portfolio", label: "Портфоліо", icon: Award },
    { href: "/admin", label: "Адмін", icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D0D7DE] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <OrangeFlower size={26} />
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-[#0D2238] text-lg tracking-tight leading-none group-hover:text-[#EC612F] transition-colors">
              AI Engineering Academy
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#6DA2E4] font-semibold">
              Версія 2.0 · Open Source
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#EDF5FE] text-[#0D2238] font-semibold"
                    : "text-gray-600 hover:text-[#0D2238] hover:bg-gray-50"
                }`}
              >
                <Icon size={16} className={isActive ? "text-[#EC612F]" : "text-gray-400"} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: User Level & Target Path */}
        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EDF5FE] text-[#0D2238] border border-[#6DA2E4]/40 hover:bg-[#6DA2E4]/20 transition"
          >
            <Compass size={14} className="text-[#EC612F]" />
            <span>Обрати ціль</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#0D2238] text-white hover:bg-[#1B3356] transition"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>LVL 1 · 150 XP</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
