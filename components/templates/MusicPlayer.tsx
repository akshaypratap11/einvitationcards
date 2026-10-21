"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface MusicPlayerProps {
  musicUrl?: string;
  theme?: "wedding" | "birthday" | "ghar";
}

export default function MusicPlayer({
  musicUrl,
  theme = "wedding",
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Play audio safely
  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !musicUrl) return;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      })
      .catch((err) => {
        // Autoplay policy prevented playback, wait for interaction
        console.debug("Autoplay waiting for user gesture:", err);
      });
  }, [musicUrl]);

  // Listen for user's first tap/click anywhere to start playback
  useEffect(() => {
    if (!musicUrl || hasInteracted) return;

    const handleFirstUserGesture = () => {
      attemptPlay();
      window.removeEventListener("pointerdown", handleFirstUserGesture);
      window.removeEventListener("touchstart", handleFirstUserGesture);
      window.removeEventListener("click", handleFirstUserGesture);
    };

    window.addEventListener("pointerdown", handleFirstUserGesture, { once: true });
    window.addEventListener("touchstart", handleFirstUserGesture, { once: true });
    window.addEventListener("click", handleFirstUserGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstUserGesture);
      window.removeEventListener("touchstart", handleFirstUserGesture);
      window.removeEventListener("click", handleFirstUserGesture);
    };
  }, [musicUrl, hasInteracted, attemptPlay]);

  // Toggle play/pause on button click
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  if (!musicUrl) return null;

  const btnColors =
    theme === "birthday"
      ? "bg-stone-900/85 text-amber-300 border-amber-300/40 hover:bg-stone-800"
      : theme === "ghar"
      ? "bg-red-950/85 text-amber-300 border-amber-400/40 hover:bg-red-900"
      : "bg-[#2b0d16]/85 text-[#f3e2a9] border-[#c9a24b]/40 hover:bg-[#3d1220]";

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload="auto"
      />

      {/* Floating Music Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`fixed top-4 right-4 z-[999] flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 text-xs font-semibold ${btnColors} ${
          isPlaying ? "scale-100" : "opacity-80 scale-95"
        }`}
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
        title={isPlaying ? "Mute music" : "Play music"}
      >
        <span
          className={`text-sm inline-block transition-transform duration-700 ${
            isPlaying ? "animate-spin" : ""
          }`}
          style={{ animationDuration: "4s" }}
        >
          {isPlaying ? "🎵" : "🔇"}
        </span>
        <span className="hidden sm:inline text-[11px] uppercase tracking-wider">
          {isPlaying ? "Music On" : "Music Off"}
        </span>
      </button>
    </>
  );
}
