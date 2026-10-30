"use client";

import React, { useState } from "react";
import { Play, Eye, Layers, Image as ImageIcon } from "lucide-react";

interface CVLabProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function CVLabWorkspace({ onRun, running, result }: CVLabProps) {
  const [filterType, setFilterType] = useState<string>("gaussian");
  const [kernelSize, setKernelSize] = useState<number>(3);

  const filteredMatrix = result?.artifacts?.filtered_matrix || [
    [30, 0, 210, 210, -240],
    [40, 0, 280, 280, -320],
    [40, 0, 280, 280, -320],
    [30, 0, 210, 210, -240],
    [10, 0, 70, 70, -80],
  ];

  const handleExecute = () => {
    onRun({ filter_type: filterType, kernel_size: kernelSize });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Комп'ютерний зір: 2D Згортка (Convolution) та виділення контурів
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            F1-Score: {result?.metrics?.f1_score ? `${(result.metrics.f1_score * 100).toFixed(1)}%` : "100.0%"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-dark-muted block mb-1">
              Тип фільтра згортки:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="gaussian">Gaussian Blur (Розмиття / Зменшення шуму)</option>
              <option value="sobel_x">Sobel-X (Вертикальні границі)</option>
              <option value="sobel_y">Sobel-Y (Горизонтальні границі)</option>
              <option value="laplacian">Laplacian (Двовимірний градієнт контуру)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-dark-muted block mb-1">
              Розмір ядра (Kernel):
            </label>
            <select
              value={kernelSize}
              onChange={(e) => setKernelSize(parseInt(e.target.value))}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            >
              <option value="3">3 × 3 Kernel</option>
              <option value="5">5 × 5 Kernel</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-2 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50 w-full justify-center"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Згортка матриці..." : "Застосувати згортку"}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Map Matrix Heatmap */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-3">
          Карта активації пікселів після згортки (Feature Map 5×5):
        </h4>

        <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
          {filteredMatrix.flat().map((val: number, idx: number) => {
            const intensity = Math.min(100, Math.max(10, Math.abs(val) / 4));
            return (
              <div
                key={idx}
                className="aspect-square rounded border border-borderline flex flex-col items-center justify-center text-[10px] font-mono transition"
                style={{
                  backgroundColor: val >= 0 ? `rgba(109, 162, 228, ${intensity / 100})` : `rgba(236, 97, 47, ${intensity / 100})`,
                  color: intensity > 60 ? "#ffffff" : "#24292f",
                }}
              >
                {Math.round(val)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
