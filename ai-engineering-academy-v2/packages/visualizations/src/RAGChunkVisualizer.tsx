import React from "react";

export interface RAGChunkVisualizerProps {
  chunkSize: number;
  chunkOverlap: number;
  textSample?: string;
}

const DEFAULT_SAMPLE =
  "Штучний інтелект у сучасному світі застосовується для автоматизації рутинних задач, аналізу великих масивів даних та побудови автономних агентів. Надійний RAG гарантує, що відповіді моделі підтверджуються документами компанії.";

export const RAGChunkVisualizer: React.FC<RAGChunkVisualizerProps> = ({
  chunkSize = 100,
  chunkOverlap = 20,
  textSample = DEFAULT_SAMPLE,
}) => {
  // Generate chunks
  const chunks: { id: number; text: string; overlapText: string }[] = [];
  let start = 0;
  let idx = 1;

  while (start < textSample.length) {
    const end = Math.min(start + chunkSize, textSample.length);
    const chunkContent = textSample.slice(start, end);
    const overlapContent = start > 0 ? textSample.slice(start, start + chunkOverlap) : "";
    chunks.push({ id: idx++, text: chunkContent, overlapText: overlapContent });

    if (end >= textSample.length) break;
    start += chunkSize - chunkOverlap;
  }

  return (
    <div className="bg-white rounded-xl border border-[#D0D7DE] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[#0D2238] text-sm">Візуалізація Чанкінгу Документа з Overlap</h4>
          <p className="text-xs text-gray-500">Поділ тексту на векторні сегменти для індексації у pgvector</p>
        </div>
        <div className="flex gap-3 text-xs text-gray-600">
          <span>Розмір: <strong>{chunkSize} симв.</strong></span>
          <span>Перекриття: <strong>{chunkOverlap} симв.</strong></span>
        </div>
      </div>

      <div className="space-y-2">
        {chunks.map((ch) => (
          <div
            key={ch.id}
            className="p-3 bg-[#EDF5FE]/60 border border-[#6DA2E4]/40 rounded-lg text-xs leading-relaxed"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-[#0D2238]">Чанк #{ch.id}</span>
              <span className="text-gray-400 font-mono text-[10px]">{ch.text.length} символів</span>
            </div>
            <p className="text-gray-700">
              {ch.overlapText && (
                <span className="bg-orange-100 text-[#EC612F] px-1 py-0.5 rounded font-medium mr-1">
                  [Overlap: {ch.overlapText}]
                </span>
              )}
              {ch.text.slice(ch.overlapText.length)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
