"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error captured by ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream flex flex-col items-center justify-center p-6 text-center festive-pattern-bg">
      <div className="max-w-md w-full p-8 rounded-3xl bg-festive-maroon/90 border-2 border-festive-gold/40 shadow-2xl space-y-4 backdrop-blur-md">
        <span className="text-4xl block">🪔</span>

        <h2 className="font-serif text-2xl font-bold text-festive-goldLight">
          Something went wrong
        </h2>

        <p className="text-xs text-festive-cream/80 leading-relaxed">
          We encountered an unexpected issue while rendering this page. You can try refreshing or returning to the home page.
        </p>

        {error?.message && (
          <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2.5 rounded-xl bg-festive-gold text-festive-wine font-bold text-xs shadow-md hover:bg-festive-goldLight transition-all"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-festive-wine border border-festive-gold/40 text-festive-goldLight text-xs font-semibold hover:border-festive-gold transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
