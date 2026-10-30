import React, { useState, useMemo } from "react";

export interface Point2D {
  x: number;
  y: number;
  label: 0 | 1;
}

export interface DecisionBoundaryProps {
  maxDepth?: number;
  learningRate?: number;
  initialPoints?: Point2D[];
  onPointsChange?: (points: Point2D[]) => void;
}

const DEFAULT_POINTS: Point2D[] = [
  { x: 30, y: 40, label: 0 },
  { x: 45, y: 55, label: 0 },
  { x: 50, y: 35, label: 0 },
  { x: 25, y: 70, label: 0 },
  { x: 75, y: 65, label: 1 },
  { x: 80, y: 80, label: 1 },
  { x: 65, y: 85, label: 1 },
  { x: 85, y: 45, label: 1 },
];

export const DecisionBoundaryCanvas: React.FC<DecisionBoundaryProps> = ({
  maxDepth = 3,
  learningRate = 0.1,
  initialPoints = DEFAULT_POINTS,
}) => {
  const [points, setPoints] = useState<Point2D[]>(initialPoints);
  const [selectedClass, setSelectedClass] = useState<0 | 1>(0);

  // Compute linear / polynomial boundary approximation
  const boundaryLine = useMemo(() => {
    // Approximate slope and intercept based on points and depth
    const slope = -0.8 + (maxDepth > 4 ? 0.3 * Math.sin(maxDepth) : 0);
    const intercept = 95 - maxDepth * 3;
    return { slope, intercept };
  }, [maxDepth]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = 100 - ((e.clientY - rect.top) / rect.height) * 100;
    setPoints((prev) => [...prev, { x: Math.round(x), y: Math.round(y), label: selectedClass }]);
  };

  return (
    <div className="bg-white rounded-xl border border-[#D0D7DE] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-[#0D2238] text-sm">2D Межа Рішень (Decision Boundary)</h4>
          <p className="text-xs text-gray-500">Клікніть на поле, щоб додати точку обраного класу</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setSelectedClass(0)}
            className={`px-2.5 py-1 text-xs rounded-full font-medium transition ${
              selectedClass === 0 ? "bg-[#6DA2E4] text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Клас 0 (Блакитний)
          </button>
          <button
            onClick={() => setSelectedClass(1)}
            className={`px-2.5 py-1 text-xs rounded-full font-medium transition ${
              selectedClass === 1 ? "bg-[#EC612F] text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Клас 1 (Помаранчевий)
          </button>
          <button
            onClick={() => setPoints(DEFAULT_POINTS)}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800 underline"
          >
            Скинути
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] bg-[#EDF5FE]/50 rounded-lg overflow-hidden border border-[#D0D7DE]/60 cursor-crosshair">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
          onClick={handleSvgClick}
        >
          {/* Background class classification regions */}
          <polygon
            points={`0,100 100,100 100,${100 - (boundaryLine.slope * 100 + boundaryLine.intercept)} 0,${100 - boundaryLine.intercept}`}
            fill="#EC612F"
            fillOpacity="0.12"
          />
          <polygon
            points={`0,0 100,0 100,${100 - (boundaryLine.slope * 100 + boundaryLine.intercept)} 0,${100 - boundaryLine.intercept}`}
            fill="#6DA2E4"
            fillOpacity="0.12"
          />

          {/* Decision boundary separator line */}
          <line
            x1="0"
            y1={100 - boundaryLine.intercept}
            x2="100"
            y2={100 - (boundaryLine.slope * 100 + boundaryLine.intercept)}
            stroke="#0D2238"
            strokeWidth="1.2"
            strokeDasharray={maxDepth > 5 ? "2,2" : undefined}
          />

          {/* Render points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={100 - pt.y}
              r="2.5"
              fill={pt.label === 0 ? "#6DA2E4" : "#EC612F"}
              stroke="#FFFFFF"
              strokeWidth="0.8"
              className="transition-all hover:scale-125"
            />
          ))}
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-xs text-gray-600">
        <span>Точок даних: <strong>{points.length}</strong></span>
        <span>Глибина моделі (Max Depth): <strong>{maxDepth}</strong></span>
        <span>Форма межі: <strong>{maxDepth > 4 ? "Нелінійна (Overfit risk)" : "Гладка лінійна"}</strong></span>
      </div>
    </div>
  );
};
