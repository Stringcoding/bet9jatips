import React from "react";

interface VerifiedIconProps {
  className?: string;
  size?: number;
}

export const VerifiedIcon: React.FC<VerifiedIconProps> = ({ 
  className = "text-brand-green", 
  size = 16 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Zig-Zag Circle Background */}
      <path
        d="M12 1.5l2.828 2.828 3.89-.252.252 3.89 2.828 2.828-2.828 2.828.252 3.89-3.89.252-2.828 2.828-2.828-2.828-3.89.252-.252-3.89-2.828-2.828 2.828-2.828-.252-3.89 3.89-.252L12 1.5z"
        fill="currentColor"
      />
      {/* Inner Checkmark */}
      <path
        d="M8.5 12.5l2.5 2.5 4.5-4.5"
        stroke="#1E2124" // Dark background color to create the cut-out effect
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
