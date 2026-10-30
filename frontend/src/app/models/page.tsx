"use client";

import React, { useEffect, useState } from "react";
import { Cpu, ShieldCheck, CheckCircle2, Layers, HardDrive } from "lucide-react";
import { getModels, ModelItem } from "@/lib/api";

export default function ModelsRegistryPage() {
  const [models, setModels] = useState<ModelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModels().then((data) => {
      setModels(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-borderline pb-4 dark:border-dark-border">
        <h1 className="text-xl sm:text-2xl font-bold text-graphite dark:text-dark-text flex items-center gap-2">
          <Cpu className="h-6 w-6 text-denim" />
          Реєстр схвалених відкритих моделей (Open Source Model Registry)
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted mt-1">
          Лише перевірені відкриті ваги та архітектури з пермісивними ліцензіями (Apache-2.0, MIT, BSD-3-Clause)
          без пропрієтарних залежностей за ТЗ v1.1.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-gray-500">
          Завантаження реєстру моделей...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-borderline bg-white p-5 dark:border-dark-border dark:bg-dark-surface shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-denim/15 px-2 py-0.5 text-xs font-bold font-mono text-denim-700 dark:bg-denim/20 dark:text-denim">
                  {m.model_id}
                </span>
                <span className="rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Ліцензія: {m.license}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-graphite dark:text-dark-text">{m.name}</h2>
                <div className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">Походження: {m.origin}</div>
              </div>

              {/* Capabilities */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-gray-500 dark:text-dark-muted mb-1.5">
                  Можливості та сценарії:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-borderline bg-gray-50 px-2 py-0.5 text-[10px] font-mono text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hardware Requirements */}
              <div className="rounded border border-borderline/80 bg-gray-50 p-3 dark:border-dark-border dark:bg-dark-bg text-xs font-mono space-y-1">
                <div className="text-[10px] font-bold uppercase text-gray-500">Вимоги до ресурсів:</div>
                <div className="text-gray-700 dark:text-dark-muted">
                  • Мінімум RAM: {m.hardware_reqs.min_ram_mb || 512} MB<br />
                  • Ядер CPU: {m.hardware_reqs.recommended_cpu_cores || 2}<br />
                  • Підтримка CPU-real: {m.hardware_reqs.supports_cpu_real ? "Так (100% сумісно)" : "Ні"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
