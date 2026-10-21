import React from "react";

export interface TimelineItem {
  id?: string;
  time?: string;
  title: string;
  desc?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  fallbackTimeLabel?: string;
}

export function Timeline({
  items,
  className = "tl rv d2",
  fallbackTimeLabel = "",
}: TimelineProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={className}>
      {items.map((item, idx) => (
        <div key={item.id || idx}>
          <b>{item.time || fallbackTimeLabel}</b>
          <h4>{item.title}</h4>
          {item.desc && <p>{item.desc}</p>}
        </div>
      ))}
    </div>
  );
}
