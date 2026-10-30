"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Layers, Plus, Trash2, Activity, ArrowRight, CheckCircle2, AlertTriangle, Cpu } from "lucide-react";

interface DLProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function DeepLearningWorkspace({ onRun, running, result }: DLProps) {
  const [layers, setLayers] = useState<Array<{ id: string; units: number; activation: string }>>([
    { id: "1", units: 16, activation: "ReLU" },
    { id: "2", units: 8, activation: "ReLU" },
  ]);
  const [epochs, setEpochs] = useState<number>(15);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [lr, setLr] = useState<number>(0.02);
  const [optimizer, setOptimizer] = useState<string>("adam");

  // Loss history from actual result or realistic baseline
  const history = result?.artifacts?.history || [
    { epoch: 1, train_loss: 0.692, val_loss: 0.681, val_accuracy: 0.64, grad_norm: 0.85 },
    { epoch: 5, train_loss: 0.421, val_loss: 0.405, val_accuracy: 0.82, grad_norm: 0.42 },
    { epoch: 10, train_loss: 0.284, val_loss: 0.312, val_accuracy: 0.88, grad_norm: 0.21 },
    { epoch: 15, train_loss: 0.194, val_loss: 0.245, val_accuracy: 0.92, grad_norm: 0.14 },
  ];

  const finalMetrics = result?.metrics || {
    final_val_loss: history[history.length - 1]?.val_loss || 0.245,
    final_val_accuracy: history[history.length - 1]?.val_accuracy || 0.92,
  };

  // Calculate total trainable parameters dynamically
  let totalParams = 0;
  let prevDim = 2; // Input dimension (x1, x2)
  layers.forEach((l) => {
    totalParams += prevDim * l.units + l.units; // W + b
    prevDim = l.units;
  });
  totalParams += prevDim * 2 + 2; // Final output layer to 2 classes

  const handleAddLayer = () => {
    if (layers.length >= 5) return;
    setLayers((prev) => [
      ...prev,
      { id: String(Date.now()), units: 16, activation: "ReLU" },
    ]);
  };

  const handleRemoveLayer = (idx: number) => {
    if (layers.length <= 1) return;
    setLayers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLayerUnitsChange = (idx: number, units: number) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, units } : l))
    );
  };

  const handleLayerActivationChange = (idx: number, activation: string) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, activation } : l))
    );
  };

  const handleExecute = () => {
    onRun({
      model_type: "mlp",
      hidden_layers: layers.map((l) => l.units),
      activation: layers[0]?.activation.toLowerCase() || "relu",
      epochs: epochs,
      batch_size: batchSize,
      learning_rate: lr,
      optimizer: optimizer,
      dataset_name: "moons",
    });
  };

  const lastGradNorm = history[history.length - 1]?.grad_norm || 0.14;
  const isVanishing = lastGradNorm < 0.001;
  const isExploding = lastGradNorm > 10.0;

  return (
    <div className="space-y-6">
      {/* Visual Architecture Designer */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline/60 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-denim" />
            <div>
              <h3 className="font-display font-bold text-sm text-navy dark:text-white">
                Візуальний конструктор шарів нейромережі (PyTorch Native Engine)
              </h3>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                Побудуйте багатошаровий перцептрон, налаштуйте нелінійності та спостерігайте за потоком градієнтів
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-cloud px-3 py-1 text-xs font-mono font-bold text-navy border border-borderline dark:bg-dark-bg dark:text-white dark:border-dark-border">
              {totalParams} параметрів
            </span>
            <button
              onClick={handleAddLayer}
              disabled={layers.length >= 5}
              className="inline-flex items-center gap-1 rounded-lg bg-cloud px-3 py-1.5 text-xs font-bold text-denim hover:bg-denim/15 dark:bg-dark-bg dark:border-dark-border transition disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" /> Додати шар
            </button>
          </div>
        </div>

        {/* Interactive Layer Pipeline Diagram */}
        <div className="rounded-xl border border-borderline bg-cloud/30 p-4 dark:border-dark-border dark:bg-dark-bg/40 overflow-x-auto">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-3">
            Топологія нейромережі та розмірність тензорів:
          </span>

          <div className="flex items-center gap-2 min-w-max py-2">
            {/* Input Node */}
            <div className="rounded-xl border border-gray-300 bg-white p-3 text-center dark:bg-dark-surface shadow-xs">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Вхідні дані</span>
              <div className="font-mono font-bold text-xs text-navy dark:text-white mt-1">Input (x₁, x₂)</div>
              <span className="text-[10px] font-mono text-gray-500">[Batch, 2]</span>
            </div>

            <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />

            {/* Hidden Layers */}
            {layers.map((l, idx) => (
              <React.Fragment key={l.id}>
                <div className="rounded-xl border-2 border-denim/60 bg-white p-3 text-center dark:bg-dark-surface shadow-xs space-y-2 min-w-[130px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-denim uppercase">Шар #{idx + 1}</span>
                    {layers.length > 1 && (
                      <button
                        onClick={() => handleRemoveLayer(idx)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Units selector */}
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">Нейрони:</label>
                    <select
                      value={l.units}
                      onChange={(e) => handleLayerUnitsChange(idx, parseInt(e.target.value))}
                      className="rounded border border-borderline p-1 text-xs font-mono font-bold w-full bg-cloud dark:bg-dark-bg text-navy dark:text-white"
                    >
                      <option value="8">8 units</option>
                      <option value="16">16 units</option>
                      <option value="32">32 units</option>
                      <option value="64">64 units</option>
                    </select>
                  </div>

                  {/* Activation selector */}
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">Активація:</label>
                    <select
                      value={l.activation}
                      onChange={(e) => handleLayerActivationChange(idx, e.target.value)}
                      className="rounded border border-borderline p-1 text-xs font-semibold w-full bg-cloud dark:bg-dark-bg text-navy dark:text-white"
                    >
                      <option value="ReLU">ReLU</option>
                      <option value="Tanh">Tanh</option>
                      <option value="GELU">GELU</option>
                    </select>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />
              </React.Fragment>
            ))}

            {/* Output Node */}
            <div className="rounded-xl border border-emerald-400 bg-white p-3 text-center dark:bg-dark-surface shadow-xs">
              <span className="text-[10px] font-bold uppercase text-emerald-600 block">Класифікація</span>
              <div className="font-mono font-bold text-xs text-navy dark:text-white mt-1">Output (y₁, y₂)</div>
              <span className="text-[10px] font-mono text-gray-500">[Batch, 2]</span>
            </div>
          </div>
        </div>

        {/* Hyperparameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Learning Rate (η):</span>
              <span className="font-mono font-bold text-denim">{lr}</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.2"
              step="0.005"
              value={lr}
              onChange={(e) => setLr(parseFloat(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
              <span>Епохи навчання:</span>
              <span className="font-mono font-bold text-denim">{epochs}</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value))}
              className="w-full accent-denim"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
              Оптимізатор:
            </label>
            <select
              value={optimizer}
              onChange={(e) => setOptimizer(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-semibold text-navy dark:border-dark-border dark:bg-dark-surface dark:text-white"
            >
              <option value="adam">Adam (Адаптивний градієнт)</option>
              <option value="sgd">SGD (Stochastic Gradient Descent)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
              Batch Size:
            </label>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-semibold text-navy dark:border-dark-border dark:bg-dark-surface dark:text-white"
            >
              <option value="16">16 семплів</option>
              <option value="32">32 семпли (Стандарт)</option>
              <option value="64">64 семпли</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-2 border-t border-borderline/60 pt-3">
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-6 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-white" />
            {running ? "Навчання на PyTorch CPU..." : "Навчити нейромережу"}
          </button>
        </div>
      </div>

      {/* Visual Loss & Gradient Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Loss & Accuracy Curve (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-navy dark:text-white">
              Крива навчання (Loss vs Epochs)
            </h4>
            <span className="text-xs font-mono text-emerald-600 font-bold">
              Val Accuracy: {((finalMetrics.final_val_accuracy || 0.92) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="space-y-2">
            {history.map((h: any) => (
              <div key={h.epoch} className="space-y-1 text-xs">
                <div className="flex justify-between font-mono text-[11px] text-gray-600 dark:text-dark-muted">
                  <span>Епоха {h.epoch}</span>
                  <span>Train Loss: {h.train_loss} | Val Loss: {h.val_loss}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-cloud overflow-hidden flex dark:bg-dark-border">
                  <div
                    className="h-full bg-denim"
                    style={{ width: `${Math.min(100, Math.max(10, (1 - h.val_loss) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Flow & Health Gauge (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-4">
          <h4 className="font-display font-bold text-sm text-navy dark:text-white">
            Стан градієнтного потоку
          </h4>

          <div className="rounded-xl border border-borderline bg-cloud/40 p-4 dark:border-dark-border dark:bg-dark-bg space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Норма градієнта (‖g‖):</span>
              <span className="font-mono font-bold text-navy dark:text-white">{lastGradNorm.toFixed(4)}</span>
            </div>

            {isVanishing ? (
              <div className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700 flex items-center gap-1.5 border border-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Зникаючий градієнт! Замініть функцію активації на ReLU.</span>
              </div>
            ) : isExploding ? (
              <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 flex items-center gap-1.5 border border-red-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Вибух градієнта! Зменшіть Learning Rate.</span>
              </div>
            ) : (
              <div className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800 flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Потік градієнтів стабільний. Бекпропагейшн ефективний.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
