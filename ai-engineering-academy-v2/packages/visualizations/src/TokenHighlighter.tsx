import React from "react";

export interface TokenHighlighterProps {
  tokens?: { text: string; id: number; color?: string }[];
}

const DEFAULT_TOKENS = [
  { text: "Штуч", id: 1842, color: "#CFE3FA" },
  { text: "ний", id: 491, color: "#FCD8CB" },
  { text: " інтел", id: 8912, color: "#D1FAE5" },
  { text: "ект", id: 320, color: "#FEF3C7" },
  { text: " транс", id: 4402, color: "#E0E7FF" },
  { text: "формує", id: 9112, color: "#FCE7F3" },
  { text: " світ", id: 104, color: "#CFE3FA" },
];

export const TokenHighlighter: React.FC<TokenHighlighterProps> = ({
  tokens = DEFAULT_TOKENS,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#D0D7DE] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[#0D2238] text-sm">BPE Токенізація Тексту</h4>
          <p className="text-xs text-gray-500">Розбиття слів на субтокени з чисельними ідентифікаторами ID</p>
        </div>
        <div className="text-xs text-gray-600">
          Токенів: <strong>{tokens.length}</strong>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
        {tokens.map((tok, idx) => (
          <span
            key={idx}
            style={{ backgroundColor: tok.color || "#CFE3FA" }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[#0D2238] border border-black/10 shadow-2xs hover:brightness-95 transition"
          >
            <span>{tok.text}</span>
            <span className="text-[10px] opacity-60 font-sans">#{tok.id}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
