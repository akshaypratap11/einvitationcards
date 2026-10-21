import React from "react";

export default function CardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream flex flex-col items-center justify-center p-6 text-center festive-pattern-bg">
      <div className="max-w-md w-full p-8 rounded-3xl bg-festive-maroon/90 border-2 border-festive-gold/40 shadow-2xl space-y-6 backdrop-blur-md animate-pulse">
        {/* Shimmer Icon */}
        <div className="w-16 h-16 rounded-full bg-festive-gold/20 mx-auto flex items-center justify-center text-3xl border border-festive-gold/30">
          ✨
        </div>

        {/* Shimmer Title */}
        <div className="space-y-2">
          <div className="h-4 w-28 bg-festive-gold/20 rounded-full mx-auto" />
          <div className="h-8 w-64 bg-festive-gold/30 rounded-xl mx-auto" />
          <div className="h-4 w-40 bg-festive-gold/15 rounded-full mx-auto" />
        </div>

        {/* Shimmer Card Body */}
        <div className="p-4 rounded-2xl bg-festive-wine/60 border border-festive-gold/20 space-y-3">
          <div className="h-3 w-full bg-festive-cream/15 rounded-full" />
          <div className="h-3 w-5/6 bg-festive-cream/15 rounded-full mx-auto" />
          <div className="h-3 w-2/3 bg-festive-cream/15 rounded-full mx-auto" />
        </div>

        {/* Shimmer Details */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-12 bg-festive-wine/50 rounded-xl border border-festive-gold/15" />
          <div className="h-12 bg-festive-wine/50 rounded-xl border border-festive-gold/15" />
        </div>

        <p className="text-xs text-festive-gold/70 font-serif italic">
          Unfolding invitation card...
        </p>
      </div>
    </div>
  );
}
