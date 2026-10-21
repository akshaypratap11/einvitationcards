import React from "react";

export interface ScrollBarProps {
  progress: number;
  className?: string;
  id?: string;
}

export function ScrollBar({
  progress,
  className = "scroll-bar",
  id,
}: ScrollBarProps) {
  return (
    <div
      id={id}
      className={className}
      style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
    />
  );
}
