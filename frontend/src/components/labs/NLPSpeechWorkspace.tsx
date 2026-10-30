"use client";

import React, { useState } from "react";
import { Play, FileText, Layers, Hash, Sparkles } from "lucide-react";

interface NLPSpeechProps {
  onRun: (params: any) => void;
  running: boolean;
  result?: any;
}

export default function NLPSpeechWorkspace({ onRun, running, result }: NLPSpeechProps) {
  const [text, setText] = useState<string>(
    "Transformers та моделі уваги (Multi-Head Attention) стали стандартом для NLP, замінивши рекурентні мережі LSTM у 2017 році."
  );
  const [method, setMethod] = useState<string>("tfidf");

  const tokens = result?.artifacts?.tokens || [
    { text: "Transformers", id: 1042, type: "subword" },
    { text: "та", id: 284, type: "word" },
    { text: "моделі", id: 512, type: "word" },
    { text: "уваги", id: 894, type: "word" },
    { text: "(", id: 12, type: "punctuation" },
    { text: "Multi", id: 742, type: "subword" },
    { text: "-Head", id: 911, type: "subword" },
    { text: "Attention", id: 620, type: "subword" },
    { text: ")", id: 13, type: "punctuation" },
    { text: "стали", id: 318, type: "word" },
    { text: "стандартом", id: 410, type: "word" },
  ];

  const handleExecute = () => {
    onRun({ text: text, method: method });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center justify-between border-b border-borderline/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-denim" />
            <h3 className="font-bold text-sm text-graphite dark:text-dark-text">
              NLP Workbench: Токенізація, Subword Vocab та TF-IDF
            </h3>
          </div>
          <span className="rounded bg-denim/10 px-2 py-0.5 text-[11px] font-semibold text-denim font-mono">
            Token Count: {result?.metrics?.token_count || tokens.length}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-dark-muted block mb-1">
              Вхідний текстовий фрагмент для обробки:
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-md border border-borderline bg-white p-2.5 text-xs text-graphite dark:border-dark-border dark:bg-dark-bg dark:text-dark-text font-medium"
            />
          </div>

          <div className="flex items-center justify-between border-t border-borderline/60 pt-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-600 dark:text-dark-muted">
                Алгоритм обробки:
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="rounded-md border border-borderline bg-white p-1.5 text-xs text-graphite dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
              >
                <option value="tfidf">TF-IDF Vectorizer</option>
                <option value="subword">Subword BPE Tokenizer</option>
                <option value="ner">Named Entity Recognition (NER)</option>
              </select>
            </div>

            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-denim px-5 py-1.5 text-xs font-semibold text-white shadow hover:bg-denim-dark transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              {running ? "Токенізація..." : "Запустити обробку тексту"}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Token Stream */}
      <div className="rounded-xl border border-borderline bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <h4 className="text-xs font-bold text-graphite dark:text-dark-text mb-3">
          Візуальний потік згенерованих токенів та словникових індексів:
        </h4>
        <div className="flex flex-wrap gap-2">
          {tokens.map((t: any, idx: number) => (
            <div
              key={idx}
              className="rounded-lg border border-denim/30 bg-cloud/60 px-3 py-1.5 text-xs shadow-xs dark:bg-denim/10 dark:border-denim/20"
            >
              <span className="font-bold text-graphite dark:text-dark-text">{t.text}</span>
              <span className="block text-[10px] text-gray-500 font-mono">ID: {t.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
