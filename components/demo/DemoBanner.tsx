"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { EventType } from "@/types/card";

interface DemoBannerProps {
  type: EventType;
}

export default function DemoBanner({ type }: DemoBannerProps) {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Check if running inside iframe
    try {
      if (window.self !== window.top) {
        setIsEmbedded(true);
      }
    } catch {
      setIsEmbedded(true);
    }
  }, []);

  if (isEmbedded) {
    return null;
  }

  const applyUrl = `/apply?type=${type}`;
  const label =
    type === "wedding"
      ? "Apply for Wedding Card"
      : type === "birthday"
      ? "Apply for Birthday Card"
      : "Apply for Griha Pravesh Card";

  return (
    <aside
      aria-label="Demo Notification"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-lg bg-festive-wine/95 backdrop-blur-md border-2 border-festive-gold/60 rounded-full px-4 sm:px-6 py-2.5 shadow-gold-glow flex items-center justify-between gap-3 text-festive-cream"
    >
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
        <span className="text-base sm:text-lg animate-pulse">✨</span>
        <span className="text-festive-goldLight font-serif">This is a live demo</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={applyUrl}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-festive-gold via-amber-400 to-festive-goldDark text-festive-wine font-bold text-xs sm:text-sm shadow-md hover:brightness-105 transition-all"
        >
          {label} →
        </Link>
      </div>
    </aside>
  );
}
