import React from "react";

export interface NeuralNetProps {
  layers?: number[]; // e.g. [4, 6, 3]
  activeActivation?: "relu" | "sigmoid" | "gelu";
  gradientNorm?: number;
}

export const NeuralNetVisualizer: React.FC<NeuralNetProps> = ({
  layers = [3, 5, 4, 2],
  activeActivation = "relu",
  gradientNorm = 0.85,
}) => {
  const width = 400;
  const height = 180;

  // Calculate neuron coordinates
  const layerSpacing = width / (layers.length + 1);
  const layerCoordinates = layers.map((count, layerIdx) => {
    const x = layerSpacing * (layerIdx + 1);
    const neuronSpacing = height / (count + 1);
    const neurons = Array.from({ length: count }, (_, neuronIdx) => ({
      x,
      y: neuronSpacing * (neuronIdx + 1),
    }));
    return neurons;
  });

  return (
    <div className="bg-white rounded-xl border border-[#D0D7DE] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[#0D2238] text-sm">Архітектура Нейромережі та Сигнали Активацій</h4>
          <p className="text-xs text-gray-500">Пошаровий прямий прохід та зв'язки між нейронами</p>
        </div>
        <div className="text-xs">
          <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
            Активація: {activeActivation.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[2.2/1] bg-[#EDF5FE]/40 rounded-lg overflow-hidden border border-[#D0D7DE]/60">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Synaptic connections */}
          {layerCoordinates.map((currLayer, lIdx) => {
            if (lIdx === layerCoordinates.length - 1) return null;
            const nextLayer = layerCoordinates[lIdx + 1];
            return currLayer.map((n1, i1) =>
              nextLayer.map((n2, i2) => {
                const opacity = 0.15 + ((i1 + i2) % 3) * 0.12;
                return (
                  <line
                    key={`syn-${lIdx}-${i1}-${i2}`}
                    x1={n1.x}
                    y1={n1.y}
                    x2={n2.x}
                    y2={n2.y}
                    stroke="#6DA2E4"
                    strokeWidth="0.8"
                    strokeOpacity={opacity}
                  />
                );
              })
            );
          })}

          {/* Neurons */}
          {layerCoordinates.map((layer, lIdx) =>
            layer.map((neuron, nIdx) => {
              const isInput = lIdx === 0;
              const isOutput = lIdx === layerCoordinates.length - 1;
              return (
                <circle
                  key={`n-${lIdx}-${nIdx}`}
                  cx={neuron.x}
                  cy={neuron.y}
                  r="6"
                  fill={isInput ? "#6DA2E4" : isOutput ? "#EC612F" : "#FFFFFF"}
                  stroke={isOutput ? "#EC612F" : "#0D2238"}
                  strokeWidth="1.5"
                />
              );
            })
          )}
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-xs text-gray-600">
        <span>Вхідні ознаки: <strong>{layers[0]}</strong></span>
        <span>Приховані шари: <strong>{layers.slice(1, -1).join(" -> ")}</strong></span>
        <span>Норма градієнта в шарі 1: <strong>{gradientNorm.toFixed(2)}</strong></span>
      </div>
    </div>
  );
};
