import React, { useMemo } from "react";

export interface LossLandscapeProps {
  learningRate: number;
  momentum?: number;
  iterations?: number;
  initialWeight?: number;
}

export const LossLandscapeCanvas: React.FC<LossLandscapeProps> = ({
  learningRate = 0.1,
  momentum = 0.0,
  iterations = 20,
  initialWeight = 4.0,
}) => {
  // Compute trajectory w_t and loss J(w_t) = w_t^2
  const trajectory = useMemo(() => {
    let w = initialWeight;
    let v = 0;
    const points: { w: number; loss: number }[] = [{ w, loss: w * w }];

    for (let i = 0; i < iterations; i++) {
      const grad = 2 * w;
      v = momentum * v + (1 - momentum) * grad;
      w = w - learningRate * v;
      points.push({ w, loss: Math.min(w * w, 50) });
      if (Math.abs(w) > 10) break; // Divergence stop
    }
    return points;
  }, [learningRate, momentum, iterations, initialWeight]);

  const diverged = Math.abs(trajectory[trajectory.length - 1].w) > 5;
  const finalLoss = trajectory[trajectory.length - 1].loss;

  return (
    <div className="bg-white rounded-xl border border-[#D0D7DE] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[#0D2238] text-sm">Ландшафт Втрат та Траєкторія Градієнта</h4>
          <p className="text-xs text-gray-500">Функція втрат J(w) = w^2, мінімум у w = 0</p>
        </div>
        <div className="text-xs font-mono font-medium">
          {diverged ? (
            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded">DIVERGED (Loss вибухнув)</span>
          ) : (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Збігся: Final Loss = {finalLoss.toFixed(4)}
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full aspect-[2/1] bg-[#EDF5FE]/60 rounded-lg overflow-hidden border border-[#D0D7DE]/60">
        <svg viewBox="-5 0 10 25" className="w-full h-full" preserveAspectRatio="none">
          {/* Parabolic Loss Curve J(w) = w^2 */}
          <path
            d="M -5 25 Q 0 0 5 25"
            fill="none"
            stroke="#6DA2E4"
            strokeWidth="0.4"
          />

          {/* Connect trajectory with path */}
          {trajectory.map((pt, i) => {
            if (i === 0) return null;
            const prev = trajectory[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={prev.w}
                y1={prev.loss}
                x2={pt.w}
                y2={pt.loss}
                stroke="#EC612F"
                strokeWidth="0.25"
                strokeDasharray="0.3,0.3"
              />
            );
          })}

          {/* Render points */}
          {trajectory.map((pt, i) => (
            <circle
              key={`circle-${i}`}
              cx={pt.w}
              cy={pt.loss}
              r={i === 0 ? "0.35" : i === trajectory.length - 1 ? "0.4" : "0.2"}
              fill={i === trajectory.length - 1 ? "#EC612F" : "#0D2238"}
              stroke="#FFFFFF"
              strokeWidth="0.08"
            />
          ))}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 text-xs text-gray-600 border-t border-gray-100 pt-2">
        <div>Learning Rate: <strong>{learningRate}</strong></div>
        <div>Імпульс (Momentum): <strong>{momentum}</strong></div>
        <div>Кроків: <strong>{trajectory.length - 1}</strong></div>
      </div>
    </div>
  );
};
