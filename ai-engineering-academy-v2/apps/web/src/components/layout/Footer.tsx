import React from "react";
import Link from "next/link";
import { OrangeFlower } from "../brand/OrangeFlower";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#D0D7DE] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <OrangeFlower size={22} />
          <div>
            <p className="font-display font-bold text-sm text-[#0D2238]">
              AI Engineering Academy 2.0
            </p>
            <p className="text-xs text-gray-500">
              Повноцінна відкрита платформа підготовки AI Engineers українською мовою.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
          <Link href="/tracks" className="hover:text-[#EC612F] transition-colors">
            20 Напрямів
          </Link>
          <Link href="/onboarding" className="hover:text-[#EC612F] transition-colors">
            Кар'єрні маршрути
          </Link>
          <Link href="/dashboard" className="hover:text-[#EC612F] transition-colors">
            Кабінет
          </Link>
          <Link href="/portfolio" className="hover:text-[#EC612F] transition-colors">
            Портфоліо
          </Link>
          <Link href="/admin" className="hover:text-[#EC612F] transition-colors">
            Адміністративна зона
          </Link>
        </div>

        <div className="text-xs font-mono text-gray-400">
          Zero-Mock · Open-Source Apache-2.0
        </div>
      </div>
    </footer>
  );
};
