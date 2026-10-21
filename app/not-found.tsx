import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream flex flex-col items-center justify-center p-6 text-center festive-pattern-bg">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-festive-maroon/90 border-2 border-festive-gold/40 shadow-2xl space-y-5 backdrop-blur-md">
        <div className="w-20 h-20 mx-auto rounded-full bg-festive-gold/15 border border-festive-gold/50 flex items-center justify-center text-4xl shadow-inner">
          🪔
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-festive-gold font-bold">
            404 • Not Found
          </span>
          <h1 className="font-serif text-3xl font-bold text-festive-goldLight mt-1">
            Invitation Not Found
          </h1>
          <p className="text-xs text-festive-gold/80 font-serif italic mt-0.5">
            पृष्ठ नहीं मिला
          </p>
        </div>

        <p className="text-xs sm:text-sm text-festive-cream/80 leading-relaxed max-w-sm mx-auto">
          The digital invitation or page you are looking for could not be found. It may have expired or the link might have a typo.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/create"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-festive-gold hover:bg-festive-goldLight text-festive-wine font-bold text-xs shadow-md transition-transform hover:scale-105"
          >
            Create New Invitation
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-festive-wine hover:bg-festive-wine/80 border border-festive-gold/40 text-festive-goldLight font-semibold text-xs transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <div className="pt-4 border-t border-festive-gold/15">
          <Link
            href="/my-cards"
            className="text-xs text-festive-cream/70 hover:text-festive-goldLight transition-colors underline decoration-dotted"
          >
            Looking for cards created on this device?
          </Link>
        </div>
      </div>
    </div>
  );
}
