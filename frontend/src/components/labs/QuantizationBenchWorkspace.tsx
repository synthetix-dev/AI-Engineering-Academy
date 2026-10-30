"use client";

import React, { useState } from "react";
import { Play, Cpu, HardDrive, Zap, BarChart } from "lucide-react";

interface QuantizationProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function QuantizationBenchWorkspace({ onRun, running, result }: QuantizationProps) {
  const [tensorSize, setTensorSize] = useState<number>(2000);
  const [symmetric, setSymmetric] = useState<boolean>(true);

  const metrics = result?.metrics || {
    compression_ratio: "4.0x",
    mean_squared_error: 0.00014,
    snr_db: 41.2,
  };

  const handleExecute = () => {
    onRun({ tensor_size: tensorSize, symmetric: symmetric });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Оптимізація та квантизація: Тензорне стиснення FP32 → INT8
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim">
            Стиснення: {metrics.compression_ratio} (75% економії VRAM)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Розмір тестового тензора:</span>
              <span className="font-mono font-bold text-denim">{tensorSize} значень</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={tensorSize}
              onChange={(e) => setTensorSize(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-dark-text cursor-pointer p-2 rounded border border-borderline dark:border-dark-border w-full">
              <input
                type="checkbox"
                checked={symmetric}
                onChange={(e) => setSymmetric(e.target.checked)}
                className="accent-denim"
              />
              <span>Симетрична квантизація (Symmetric INT8)</span>
            </label>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-2 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50 w-full justify-center"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Квантизація..." : "Виконати квантизацію"}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-borderline bg-white p-4 text-center shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Коефіцієнт стиснення</span>
          <span className="text-xl font-black text-denim">{metrics.compression_ratio}</span>
          <span className="text-[10px] text-gray-400 block mt-1">4 байти FP32 → 1 байт INT8</span>
        </div>

        <div className="rounded-xl border border-borderline bg-white p-4 text-center shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Помилка реконструкції (MSE)</span>
          <span className="text-xl font-black text-graphite dark:text-dark-text">{metrics.mean_squared_error}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Мінімальне спотворення</span>
        </div>

        <div className="rounded-xl border border-borderline bg-white p-4 text-center shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Signal-to-Noise Ratio (SNR)</span>
          <span className="text-xl font-black text-green-600">{metrics.snr_db} dB</span>
          <span className="text-[10px] text-gray-400 block mt-1">Висока якість відтворення</span>
        </div>
      </div>
    </div>
  );
}
