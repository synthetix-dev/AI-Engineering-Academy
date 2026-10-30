import React from "react";

interface OrangeFlowerProps {
  className?: string;
  size?: number | string;
  centerColor?: string;
  petalColor?: string;
  withRetroTexture?: boolean;
}

export default function OrangeFlower({
  className = "",
  size = 180,
  centerColor = "#0D2238",
  petalColor = "#EC612F",
  withRetroTexture = false,
}: OrangeFlowerProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {withRetroTexture && (
        <defs>
          <filter id="retro-stipple" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0"
            />
            <feComposite in2="SourceGraphic" in="gl" operator="in" />
          </filter>
        </defs>
      )}

      <g filter={withRetroTexture ? "url(#retro-stipple)" : undefined}>
        {/* 6 Large rounded flat petals with retro-editorial geometry */}
        {/* Top Petal */}
        <circle cx="100" cy="50" r="38" fill={petalColor} />
        {/* Top-Right Petal */}
        <circle cx="143.3" cy="75" r="38" fill={petalColor} />
        {/* Bottom-Right Petal */}
        <circle cx="143.3" cy="125" r="38" fill={petalColor} />
        {/* Bottom Petal */}
        <circle cx="100" cy="150" r="38" fill={petalColor} />
        {/* Bottom-Left Petal */}
        <circle cx="56.7" cy="125" r="38" fill={petalColor} />
        {/* Top-Left Petal */}
        <circle cx="56.7" cy="75" r="38" fill={petalColor} />

        {/* Central Core Circle */}
        <circle cx="100" cy="100" r="32" fill={petalColor} />
        <circle cx="100" cy="100" r="22" fill={centerColor} />
      </g>
    </svg>
  );
}
