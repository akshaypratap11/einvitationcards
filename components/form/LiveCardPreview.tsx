"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CardData, EventType } from "@/types/card";
import WeddingRoyal from "@/components/templates/WeddingRoyal";
import BirthdayCelebration from "@/components/templates/BirthdayCelebration";
import GrihaPravesh from "@/components/templates/GrihaPravesh";

interface LiveCardPreviewProps {
  data: CardData;
  type: EventType;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export default function LiveCardPreview({
  data,
  type,
  isModal = false,
  onCloseModal,
}: LiveCardPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [deviceScale, setDeviceScale] = useState<"mobile" | "fit">("mobile");

  // Initialize iframe document for isolated template rendering
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupDoc = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const bgColor =
            type === "wedding"
              ? "#2b0d16"
              : type === "birthday"
              ? "#0d1230"
              : "#0c2016";
          const textColor = type === "wedding" ? "#5a1731" : "#ffffff";

          doc.open();
          doc.write(`
            <!DOCTYPE html>
            <html lang="${data.lang || "en"}">
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <title>Invitation Preview</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Fredoka:wght@400;600;700&family=Great+Vibes&family=Outfit:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Rozha+One&display=swap" rel="stylesheet" />
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    min-height: 100%;
                    background: ${bgColor};
                    color: ${textColor};
                    overflow-x: hidden;
                    -webkit-font-smoothing: antialiased;
                  }
                  /* Custom scrollbar matching festive theme */
                  ::-webkit-scrollbar {
                    width: 6px;
                  }
                  ::-webkit-scrollbar-track {
                    background: #1e080f;
                  }
                  ::-webkit-scrollbar-thumb {
                    background: #c9a24b;
                    border-radius: 3px;
                  }
                </style>
              </head>
              <body>
                <div id="preview-root"></div>
              </body>
            </html>
          `);
          doc.close();

          const root = doc.getElementById("preview-root");
          if (root) {
            setMountNode(root);
          }
        }
      } catch (err) {
        console.error("Failed to initialize preview iframe document", err);
      }
    };

    setupDoc();
  }, [type, data.lang, data.themeVariant]);

  return (
    <div
      className={`flex flex-col h-full bg-festive-wine/90 backdrop-blur-md ${
        isModal ? "fixed inset-0 z-50 p-4 sm:p-6" : "w-full h-full"
      }`}
    >
      {/* Top Preview Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-festive-gold/25 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-serif font-bold text-sm text-festive-goldLight tracking-wide">
            Live Preview
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-festive-gold/15 border border-festive-gold/30 text-festive-gold">
            {type === "wedding" ? "Wedding Royal" : type === "birthday" ? "Birthday" : "Ghar Function"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick toggle scale */}
          <div className="hidden sm:flex items-center bg-festive-maroon/60 rounded-lg p-0.5 border border-festive-gold/30 text-xs">
            <button
              type="button"
              onClick={() => setDeviceScale("mobile")}
              className={`px-2 py-1 rounded ${
                deviceScale === "mobile"
                  ? "bg-festive-gold text-festive-wine font-semibold shadow-sm"
                  : "text-festive-cream/70 hover:text-festive-cream"
              }`}
            >
              Phone (390px)
            </button>
            <button
              type="button"
              onClick={() => setDeviceScale("fit")}
              className={`px-2 py-1 rounded ${
                deviceScale === "fit"
                  ? "bg-festive-gold text-festive-wine font-semibold shadow-sm"
                  : "text-festive-cream/70 hover:text-festive-cream"
              }`}
            >
              Fit Width
            </button>
          </div>

          {/* Close button for modal */}
          {isModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="p-1.5 rounded-lg bg-festive-maroon border border-festive-gold/40 text-festive-goldLight hover:bg-festive-gold hover:text-festive-wine transition-colors text-xs font-bold px-3 flex items-center gap-1"
            >
              <span>✕</span>
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        <div
          className={`transition-all duration-300 h-full flex items-center justify-center ${
            deviceScale === "mobile"
              ? "w-full max-w-[400px] h-[780px] max-h-[92vh]"
              : "w-full h-full max-h-[92vh]"
          }`}
        >
          <div className="w-full h-full bg-festive-maroon rounded-[2.5rem] p-3 border-4 border-festive-gold/40 shadow-2xl relative flex flex-col overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-festive-wine rounded-full mx-auto mb-2 flex items-center justify-center border border-festive-gold/20 shrink-0">
              <div className="w-10 h-1 bg-festive-gold/30 rounded-full" />
            </div>

            {/* Iframe Screen */}
            <div className="flex-1 w-full h-full rounded-[2rem] overflow-hidden bg-festive-wine relative">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0 select-none"
                title="Invitation Live Preview"
              />
              {mountNode &&
                createPortal(
                  type === "wedding" ? (
                    <WeddingRoyal data={data} previewMode={true} />
                  ) : type === "birthday" ? (
                    <BirthdayCelebration data={data} previewMode={true} showPlaceholders={true} />
                  ) : (
                    <GrihaPravesh data={data} previewMode={true} showPlaceholders={true} />
                  ),
                  mountNode
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
