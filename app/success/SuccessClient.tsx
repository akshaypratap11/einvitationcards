"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const cardUrl = slug ? `${origin || ""}/c/${slug}` : "";
  const editUrl = slug ? `/edit/${slug}` : null;

  const handleCopyLink = async () => {
    if (!cardUrl) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(cardUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = cardUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      // Fallback
    }
  };

  const whatsappShareText = encodeURIComponent(
    `✨ You are cordially invited! ✨\n\nPlease tap the link below to open our animated digital invitation card:\n${cardUrl}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappShareText}`;

  if (!slug) {
    return (
      <div className="min-h-screen bg-festive-wine text-festive-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-festive-maroon/90 border border-festive-gold/40 shadow-xl space-y-4">
          <p className="font-serif text-xl font-bold text-festive-goldLight">
            No Card Selected
          </p>
          <p className="text-xs text-festive-cream/70">
            Please create an invitation card from the admin console first.
          </p>
          <Link
            href="/admin"
            className="inline-block px-5 py-2.5 rounded-xl bg-festive-gold text-festive-wine font-bold text-xs"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center festive-pattern-bg">
      <div className="max-w-xl w-full bg-festive-maroon/95 border-2 border-festive-gold/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-8 backdrop-blur-md relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-festive-gold/15 blur-3xl pointer-events-none rounded-full" />

        {/* Diya */}
        <div className="w-20 h-20 rounded-full bg-festive-wine border-2 border-festive-gold/70 mx-auto flex items-center justify-center text-4xl shadow-gold-glow animate-pulse">
          🪔
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-festive-gold font-bold">
            Creation Complete
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-festive-goldLight mt-1">
            Card is Ready!
          </h1>
          <p className="text-xs sm:text-sm text-festive-cream/80 max-w-md mx-auto mt-2">
            Your animated invitation is published and ready to be shared with guests on WhatsApp, SMS, or Instagram.
          </p>
        </div>

        {/* Shareable Link Box */}
        <div className="p-4 rounded-2xl bg-festive-wine/90 border border-festive-gold/40 text-left space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-festive-goldLight font-semibold block">
            Public Invitation URL
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={cardUrl}
              className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/80 border border-festive-gold/30 text-festive-cream text-xs sm:text-sm font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-festive-gold hover:bg-festive-goldLight text-festive-wine font-bold text-xs shrink-0 transition-colors shadow-sm"
            >
              {copied ? "Copied! ✓" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-sm sm:text-base shadow-lg transition-all"
          >
            <span className="text-xl">💬</span>
            <span>Share via WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/c/${slug}`}
              target="_blank"
              className="py-3 px-4 rounded-xl bg-festive-wine border border-festive-gold/40 text-festive-goldLight font-semibold text-xs sm:text-sm hover:bg-festive-maroon transition-colors"
            >
              Open Live Card 👁️
            </Link>

            {editUrl && (
              <Link
                href={editUrl}
                className="py-3 px-4 rounded-xl bg-festive-wine border border-festive-gold/40 text-festive-cream font-semibold text-xs sm:text-sm hover:bg-festive-maroon transition-colors"
              >
                Edit Details ✏️
              </Link>
            )}
          </div>

          <Link
            href="/admin?tab=cards"
            className="block text-xs text-festive-cream/70 hover:text-festive-gold transition-colors pt-4"
          >
            ← Return to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
