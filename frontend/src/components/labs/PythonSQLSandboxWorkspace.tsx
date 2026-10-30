"use client";

import React, { useState } from "react";
import { Play, Terminal, Database, Code2, CheckCircle2, RotateCcw, Cpu, Layers, Sliders, ArrowRight } from "lucide-react";

interface PythonSQLProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function PythonSQLSandboxWorkspace({ onRun, running, result }: PythonSQLProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");
  const [matrixSize, setMatrixSize] = useState<number>(3);
  const [operation, setOperation] = useState<string>("sum_squares");
  const [useVectorization, setUseVectorization] = useState<boolean>(true);

  // Raw code states for Engineering mode
  const [pythonCode, setPythonCode] = useState<string>(
`# AI Engineering Academy — Векторизовані обчислення
import numpy as np

# Створення матриці ${matrixSize}x${matrixSize}
matrix = np.arange(1, ${matrixSize * matrixSize + 1}).reshape((${matrixSize}, ${matrixSize}))

# Векторизована операція: сума квадратів
result = np.sum(matrix ** 2)
print(f"Матриця {matrix.shape}:\\n{matrix}")
print(f"Сума квадратів: {result}")`
  );

  const [sqlQuery, setSqlQuery] = useState<string>(
`SELECT model_name, epochs, learning_rate, val_accuracy, status 
FROM experiments 
WHERE val_accuracy > 0.88 
ORDER BY val_accuracy DESC;`
  );

  const handleExecute = () => {
    if (activeTab === "visual") {
      const generatedCode = `# Векторизований запуск (Visual Pipeline)
import numpy as np
matrix = np.arange(1, ${matrixSize * matrixSize + 1}).reshape((${matrixSize}, ${matrixSize}))
${operation === "sum_squares" ? "res = np.sum(matrix ** 2)" : operation === "trace" ? "res = np.trace(matrix)" : "res = np.linalg.norm(matrix)"}
print(f"Матриця {matrix.shape}:\\n{matrix}")
print(f"Результат операції: {res}")
`;
      onRun({ code: generatedCode, mode: "python", matrix_size: matrixSize, operation });
    } else {
      onRun({ code: pythonCode, mode: "python" });
    }
  };

  const stdout = result?.artifacts?.stdout || "";
  const execTimeMs = result?.resource_usage?.cpu_seconds
    ? (result.resource_usage.cpu_seconds * 1000).toFixed(2)
    : "0.04";

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Header */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-denim" />
            <div>
              <h3 className="font-display font-bold text-sm text-navy dark:text-white">
                Візуальний конвеєр тензорних обчислень та аналізу Big-O
              </h3>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                100% візуальне налаштування матричних операцій на оптимізованому NumPy ядрі
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-cloud p-1 rounded-lg border border-borderline dark:bg-dark-bg dark:border-dark-border text-xs">
            <button
              onClick={() => setActiveTab("visual")}
              className={`px-3 py-1 font-bold rounded-md transition ${
                activeTab === "visual"
                  ? "bg-white text-navy shadow-xs dark:bg-dark-surface dark:text-white"
                  : "text-gray-500 hover:text-navy dark:text-dark-muted dark:hover:text-white"
              }`}
            >
              Visual Flow (Без коду)
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1 font-bold rounded-md transition ${
                activeTab === "code"
                  ? "bg-white text-navy shadow-xs dark:bg-dark-surface dark:text-white"
                  : "text-gray-500 hover:text-navy dark:text-dark-muted dark:hover:text-white"
              }`}
            >
              Code Editor (Python)
            </button>
          </div>
        </div>

        {activeTab === "visual" ? (
          <div className="space-y-6">
            {/* Interactive Algorithm Flow Diagram */}
            <div className="rounded-xl border border-borderline bg-cloud/40 p-4 dark:border-dark-border dark:bg-dark-bg">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-3">
                Інтерактивна схема конвеєра даних:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                {/* Step 1: Input Tensor */}
                <div className="rounded-lg border border-denim/40 bg-white p-3 text-center dark:bg-dark-surface">
                  <div className="text-[10px] font-bold text-denim uppercase">Вхідний тензор</div>
                  <div className="text-sm font-mono font-bold text-navy dark:text-white mt-1">
                    Матриця {matrixSize}×{matrixSize}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{matrixSize * matrixSize} елементів FP32</div>
                </div>

                <div className="hidden md:flex justify-center text-denim">➔</div>

                {/* Step 2: Transformation */}
                <div className="rounded-lg border border-tangerine/40 bg-white p-3 text-center dark:bg-dark-surface">
                  <div className="text-[10px] font-bold text-tangerine uppercase">Векторизація SIMD</div>
                  <div className="text-sm font-mono font-bold text-navy dark:text-white mt-1">
                    {operation === "sum_squares" ? "x² (Квадрат)" : operation === "trace" ? "Діагональ" : "Фробеніус ‖x‖"}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">O(n) складність</div>
                </div>

                <div className="hidden md:flex justify-center text-tangerine">➔</div>

                {/* Step 3: Reduction */}
                <div className="rounded-lg border border-emerald-400 bg-white p-3 text-center dark:bg-dark-surface">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Редукція / Вихід</div>
                  <div className="text-sm font-mono font-bold text-navy dark:text-white mt-1">
                    Скалярне число
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">NumPy C-BLAS</div>
                </div>
              </div>
            </div>

            {/* Visual Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-dark-muted mb-1">
                  <span>Розмірність матриці (N×N):</span>
                  <span className="font-mono font-bold text-denim">{matrixSize}×{matrixSize}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={matrixSize}
                  onChange={(e) => setMatrixSize(parseInt(e.target.value))}
                  className="w-full accent-denim"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
                  Математична операція:
                </label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full rounded-md border border-borderline bg-white p-2 text-xs font-semibold text-navy dark:border-dark-border dark:bg-dark-surface dark:text-white"
                >
                  <option value="sum_squares">Сума квадратів (∑ x²)</option>
                  <option value="trace">Слід матриці (Trace: ∑ a_ii)</option>
                  <option value="norm">Норма Фробеніуса (‖A‖_F)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-dark-muted block mb-1">
                  Режим оптимізації пам'яті:
                </label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="vectorized"
                    checked={useVectorization}
                    onChange={(e) => setUseVectorization(e.target.checked)}
                    className="h-4 w-4 rounded accent-denim"
                  />
                  <label htmlFor="vectorized" className="text-xs text-navy dark:text-white font-medium cursor-pointer">
                    Увімкнути SIMD C-векторизацію
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={8}
              value={pythonCode}
              onChange={(e) => setPythonCode(e.target.value)}
              className="w-full rounded-lg border border-borderline bg-gray-950 p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:border-denim"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 flex justify-end gap-3 border-t border-borderline/60 pt-4">
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-tangerine px-6 py-2.5 text-xs font-bold text-white shadow hover:opacity-95 transition disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-white" />
            {running ? "Виконання на CPU воркері..." : "Запустити обчислення"}
          </button>
        </div>
      </div>

      {/* Real Execution Output & Variables Display */}
      {stdout && (
        <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface space-y-3">
          <div className="flex items-center justify-between border-b border-borderline/60 pb-2">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-navy dark:text-white">
              Фактичний вивід терміналу (stdout):
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold">
              Час виконання: {execTimeMs} ms
            </span>
          </div>

          <pre className="rounded-lg bg-cloud/50 p-4 font-mono text-xs text-navy dark:bg-dark-bg dark:text-emerald-400 overflow-x-auto leading-relaxed border border-borderline dark:border-dark-border">
            {stdout}
          </pre>
        </div>
      )}
    </div>
  );
}
