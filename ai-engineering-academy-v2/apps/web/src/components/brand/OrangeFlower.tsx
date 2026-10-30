import React from "react";

export interface OrangeFlowerProps {
  className?: string;
  size?: number;
}

export const OrangeFlower: React.FC<OrangeFlowerProps> = ({ className = "", size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-300 hover:rotate-45 ${className}`}
    >
      {/* 4 Elliptical Petals in Accent Orange */}
      <ellipse cx="16" cy="7" rx="4.5" ry="6.5" fill="#EC612F" />
      <ellipse cx="16" cy="25" rx="4.5" ry="6.5" fill="#EC612F" />
      <ellipse cx="7" cy="16" rx="6.5" ry="4.5" fill="#EC612F" />
      <ellipse cx="25" cy="16" rx="6.5" ry="4.5" fill="#EC612F" />
      {/* Center Circle in Deep Navy */}
      <circle cx="16" cy="16" r="3.5" fill="#0D2238" />
    </svg>
  );
};
