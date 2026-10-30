"use client";

import React, { useState } from "react";
import { Play, Terminal, Database, Code2, CheckCircle2, RotateCcw } from "lucide-react";

interface PythonSQLProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function PythonSQLSandboxWorkspace({ onRun, running, result }: PythonSQLProps) {
  const [mode, setMode] = useState<"python" | "sql">("python");
  const [pythonCode, setPythonCode] = useState<string>(
`# Завдання: обчислення суми квадратів елементів матриці
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

squared_sum = sum(val ** 2 for row in matrix for val in row)
print(f"Результат обчислення: {squared_sum}")`
  );
  const [sqlQuery, setSqlQuery] = useState<string>(
`SELECT model_name, epochs, learning_rate, val_accuracy, status 
FROM experiments 
WHERE val_accuracy > 0.88 
ORDER BY val_accuracy DESC;`
  );

  const handleExecute = () => {
    if (mode === "python") {
      onRun({ code: pythonCode, mode: "python" });
    } else {
      onRun({ query: sqlQuery, mode: "sql" });
    }
  };

  const stdout = result?.artifacts?.stdout || "";
  const variables = result?.artifacts?.variables || {};
  const sqlRows = result?.artifacts?.rows || [];
  const sqlColumns = result?.artifacts?.columns || [];

  return (
    <div className="space-y-6">
      {/* Editor & Mode Controls */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              Ізольований інтерактивний термінал Python AST та SQL
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-cloud p-1 rounded-lg border border-borderline dark:bg-dark-border dark:border-dark-border">
            <button
              onClick={() => setMode("python")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                mode === "python"
                  ? "bg-white text-denim shadow-xs dark:bg-dark-surface dark:text-dark-accent"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" /> Python Sandbox
            </button>
            <button
              onClick={() => setMode("sql")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                mode === "sql"
                  ? "bg-white text-denim shadow-xs dark:bg-dark-surface dark:text-dark-accent"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Database className="h-3.5 w-3.5" /> SQL Telemetry
            </button>
          </div>
        </div>

        {mode === "python" ? (
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-dark-muted block mb-1.5">
              Вхідний код Python (Виконується у пісочниці з AST валідацією безпеки):
            </label>
            <textarea
              rows={8}
              value={pythonCode}
              onChange={(e) => setPythonCode(e.target.value)}
              className="w-full rounded-md border border-borderline bg-gray-50/70 p-3 font-mono text-xs text-graphite dark:border-dark-border dark:bg-black/30 dark:text-dark-text focus:border-denim"
            />
          </div>
        ) : (
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-dark-muted block mb-1.5">
              SQL Запит до аналітичної таблиці експериментів `experiments`:
            </label>
            <textarea
              rows={5}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full rounded-md border border-borderline bg-gray-50/70 p-3 font-mono text-xs text-graphite dark:border-dark-border dark:bg-black/30 dark:text-dark-text focus:border-denim"
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-borderline/60 pt-3">
          <span className="text-[11px] text-gray-500 font-mono">
            {mode === "python" ? "Безпека: AST NodeVisitor (Заборонені імпорти/eval)" : "СУБД: In-Memory SQLite"}
          </span>
          <button
            onClick={handleExecute}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-2 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            {running ? "Виконання у пісочниці..." : "Запустити код (Run Sandbox)"}
          </button>
        </div>
      </div>

      {/* Output Terminal & Variable Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-borderline bg-black p-4 text-green-400 font-mono text-xs shadow-sm min-h-[160px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2 text-gray-400 text-[10px] uppercase">
              <span>Standard Output (stdout)</span>
              <span>exit_code: 0</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">
              {stdout || (running ? "Обчислення на CPU воркері..." : "// Натисніть 'Запустити код', щоб отримати вивід")}
            </pre>
          </div>
          <div className="text-[10px] text-gray-500 border-t border-gray-800 pt-1 mt-2">
            Час виконання: {result?.resource_usage?.cpu_seconds ? `${(result.resource_usage.cpu_seconds * 1000).toFixed(1)} ms` : "0.0 ms"}
          </div>
        </div>

        <div className="rounded-xl border border-borderline bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-surface min-h-[160px]">
          <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-2 border-b border-borderline/60 pb-2">
            Інспектор локальних змінних середовища:
          </h4>
          {Object.keys(variables).length > 0 ? (
            <div className="space-y-1.5 font-mono text-xs">
              {Object.entries(variables).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-borderline/60 dark:bg-black/20 dark:border-dark-border">
                  <span className="font-bold text-denim">{k}</span>
                  <span className="text-gray-700 dark:text-dark-text truncate max-w-[200px]">{String(v)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 font-mono py-6 text-center">
              Змінні з'являться після виконання скрипту
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
