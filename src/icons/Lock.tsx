import React from "react";
import { IconProps } from "../utils/types";

const Lock: React.FC<IconProps & { containerClassName?: string }> = ({
  size = 24,
  className = "",
  containerClassName = "",
}) => {
  const svgSize = `${size}px`;
  return (
    <div className={containerClassName}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgSize}
        height={svgSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={className}
      >
        <circle cx="12" cy="16" r="1" />
        <rect x="3" y="10" width="18" height="12" rx="2" />
        <path d="M7 10V7a5 5 0 0 1 10 0v3" />
      </svg>
    </div>
  );
};

export default Lock;
