import React from "react";

export interface AttentionHeatmapProps {
  tokens?: string[];
  weights?: number[][];
}

const DEFAULT_TOKENS = ["Штучний", "інтелект", "змінює", "сучасний", "світ"];
const DEFAULT_WEIGHTS = [
  [0.85, 0.10, 0.02, 0.01, 0.02],
  [0.15, 0.72, 0.05, 0.03, 0.05],
  [0.02, 0.08, 0.65, 0.15, 0.10],
  [0.01, 0.03, 0.12, 0.74, 0.10],
  [0.02, 0.05, 0.10, 0.15, 0.68],
];

export const AttentionHeatmap: React.FC<AttentionHeatmapProps> = ({
  tokens = DEFAULT_TOKENS,
  weights = DEFAULT_WEIGHTS,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#D0D7DE] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[#0D2238] text-sm">Self-Attention Матриця Уваги</h4>
          <p className="text-xs text-gray-500">Scaled Dot-Product зв'язки між токенами (Query x Key)</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>0.0</span>
          <div className="w-16 h-2 rounded bg-gradient-to-r from-blue-50 to-[#EC612F]" />
          <span>1.0</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-1 text-xs text-gray-400 font-normal">Q \ K</th>
              {tokens.map((tok, i) => (
                <th key={i} className="p-1 text-xs font-mono font-medium text-gray-700">
                  {tok}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weights.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="p-1 text-xs font-mono font-medium text-gray-700 text-right pr-2">
                  {tokens[rIdx]}
                </td>
                {row.map((val, cIdx) => {
                  const intensity = Math.min(Math.max(val, 0), 1);
                  return (
                    <td
                      key={cIdx}
                      style={{
                        backgroundColor: `rgba(236, 97, 47, ${intensity * 0.85 + 0.05})`,
                        color: intensity > 0.4 ? "#FFFFFF" : "#0D2238",
                      }}
                      className="p-2 text-xs font-mono rounded transition-colors"
                      title={`Query '${tokens[rIdx]}' -> Key '${tokens[cIdx]}': ${(val * 100).toFixed(1)}%`}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
