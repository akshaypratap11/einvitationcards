/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { CardData } from "@/types/card";
import { getI18n } from "@/lib/i18n";
import {
  formatDisplayDate,
  formatDisplayTime,
} from "@/lib/utils";
import {
  dateLong,
  googleCalendarUrl,
  googleMapsDirectionsUrl,
  whatsappUrl,
} from "@/lib/format";
import { BIRTHDAY_PARTY_CSS } from "./birthday-party.styles";
import MusicPlayer from "./MusicPlayer";
import GuestLanguageToggle from "./GuestLanguageToggle";
import { Lang } from "@/types/card";

export interface BirthdayPartyProps {
  data: CardData;
  previewMode?: boolean;
  slug?: string;
}

export default function BirthdayParty({
  data,
  previewMode = false,
  slug,
}: BirthdayPartyProps) {
  const [lang, setLang] = useState<Lang>(data.lang || "en");
  const t = getI18n(lang);
  const theme = data.themeVariant || "kids";

  useEffect(() => {
    if (data.lang) setLang(data.lang);
  }, [data.lang]);

  // Intro states
  const [isPopped, setIsPopped] = useState(previewMode);
  const [isOpened, setIsOpened] = useState(previewMode);
  const [isGone, setIsGone] = useState(previewMode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Floating balloons background
  const [balloons, setBalloons] = useState<
    Array<{ id: number; left: number; color: string; duration: number; delay: number }>
  >([]);

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isPassed: false,
  });

  // Derived values
  const personName = data.personName || "Birthday Star";
  const age = data.age;
  const heroPhoto = data.heroPhoto;
  const hostName = data.hostName;
  const message = data.message;
  const gallery = data.gallery || [];
  const events = data.events || [];
  const venueName = data.venueName || "Celebration Venue";
  const venueAddress = data.venueAddress || "";
  const formattedDate = dateLong(data.mainDate, lang) || formatDisplayDate(data.mainDate, lang);
  const celebrationTime = data.timeText || (data.mainDate ? `${formatDisplayTime(data.mainDate)} onwards` : "7:00 PM onwards");

  const cleanPhone = (data.contactPhone || "")
    .replace(/[^\d+]/g, "")
    .replace(/^\+/, "");

  const calendarUrl = googleCalendarUrl(data);
  const directionsUrl = googleMapsDirectionsUrl(data);

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.mapQuery || `${venueName}, ${venueAddress}`
  )}&output=embed`;

  // Generate background decorative balloons on mount
  useEffect(() => {
    const palette =
      theme === "kids"
        ? ["#f59e0b", "#06b6d4", "#ec4899", "#10b981", "#8b5cf6"]
        : theme === "adult"
        ? ["#d4af37", "#fef08a", "#fb7185", "#cbd5e1"]
        : ["#f472b6", "#38bdf8", "#facc15", "#a78bfa", "#6ee7b7"];

    const generated = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: Math.random() * 95,
      color: palette[i % palette.length],
      duration: 12 + Math.random() * 12,
      delay: Math.random() * 8,
    }));
    setBalloons(generated);
  }, [theme]);

  // Real-time Countdown calculation
  useEffect(() => {
    const calculateCountdown = () => {
      if (!data.mainDate) return;
      const targetTime = new Date(data.mainDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          isPassed: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        isPassed: false,
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data.mainDate]);

  // Confetti explosion logic for intro
  const fireConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors =
      theme === "kids"
        ? ["#f59e0b", "#06b6d4", "#ec4899", "#10b981", "#8b5cf6", "#ef4444"]
        : theme === "adult"
        ? ["#d4af37", "#fef08a", "#ffffff", "#fb7185", "#e2e8f0"]
        : ["#f472b6", "#38bdf8", "#facc15", "#a78bfa", "#6ee7b7", "#fed7aa"];

    interface Particle {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      vx: number;
      vy: number;
      rot: number;
      vRot: number;
      shape: "rect" | "circle";
    }

    const particles: Particle[] = [];
    const count = 120;
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 14;
      particles.push({
        x: originX,
        y: originY,
        w: 8 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      });
    }

    let frameId: number;
    let alpha = 1;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      alpha -= 0.009;
      if (alpha <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.985; // friction
        p.rot += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      ctx.restore();
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(frameId);
  }, [theme]);

  // Handle gift pop action
  const handleOpenGift = () => {
    if (isPopped) return;
    setIsPopped(true);
    fireConfetti();

    setTimeout(() => {
      setIsOpened(true);
    }, 1100);

    setTimeout(() => {
      setIsGone(true);
    }, 1900);
  };

  // Share functionality with Web Share API or Clipboard fallback
  const handleShare = async () => {
    const url =
      typeof window !== "undefined" && window.location.href
        ? window.location.href
        : slug
        ? `/c/${slug}`
        : "";
    const shareTitle = `${personName}'s Birthday Celebration 🎉`;
    const shareText = `You're invited to celebrate ${personName}'s special birthday! Tap to see the invitation details:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast(t.linkCopied);
      setTimeout(() => setToast(null), 2500);
    });
  };

  return (
    <div className={`bday-card theme-${theme}`}>
      {/* Scoped CSS Injector */}
      <style dangerouslySetInnerHTML={{ __html: BIRTHDAY_PARTY_CSS }} />

      {/* Background Floating Balloons */}
      <div className="bday-bg-decor">
        {balloons.map((b) => (
          <div
            key={b.id}
            className="floating-balloon"
            style={{
              left: `${b.left}%`,
              background: b.color,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Canvas for Confetti */}
      <canvas ref={canvasRef} className="confetti-canvas" />

      {/* Floating Guest Language Toggle */}
      <GuestLanguageToggle currentLang={lang} onToggle={setLang} theme="birthday" />

      {/* Floating Background Music Player */}
      <MusicPlayer musicUrl={data.musicUrl} theme="birthday" />

      {/* 1. ANIMATED INTRO SCREEN (GIFT BOX POP) */}
      {!previewMode && !isGone && (
        <div
          className={`bday-intro-overlay theme-${theme} ${
            isOpened ? "fade-out" : ""
          }`}
          onClick={handleOpenGift}
        >
          <div className={`gift-box-wrap ${isPopped ? "popped" : ""}`}>
            {/* Box Body */}
            <div className="gift-box-body">
              <div className="gift-ribbon-v" />
              <div className="gift-ribbon-h" />
            </div>
            {/* Box Lid with Bow */}
            <div className="gift-box-lid">
              <span className="gift-box-bow">🎀</span>
              <div className="gift-ribbon-v" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold font-title tracking-wide text-white drop-shadow-md">
            {isPopped ? t.surpriseUnfolded : t.tapToOpenGift}
          </p>
          <p className="text-xs sm:text-sm text-white/80 mt-2 font-medium">
            {personName}&apos;s Special Invitation
          </p>
        </div>
      )}

      {/* MAIN INVITATION CONTENT CONTAINER */}
      <div className="bday-container">
        {/* HERO SECTION */}
        <div className="bday-section text-center">
          <div className="hero-badge-capsule">
            <span>🎉</span>
            <span>{data.role ? `The Birthday ${data.role}` : t.birthdayCelebration}</span>
            <span>✨</span>
          </div>

          {/* Celebrant Name */}
          <h1 className="bday-hero-title">{personName}</h1>

          {/* Age Badge (If provided) */}
          {age !== undefined && age !== null && age > 0 && (
            <div className="age-badge-container">
              <div className="age-badge-circle">
                <span className="age-badge-label">{t.isTurning}</span>
                <span className="age-badge-number">{age}</span>
              </div>
            </div>
          )}

          {/* Photo with Decorative Frame */}
          <div className="photo-frame-wrap">
            <div className="photo-frame-ring" />
            <div className="photo-frame-inner">
              {heroPhoto ? (
                <img
                  src={heroPhoto}
                  alt={personName}
                  className="photo-img"
                  loading="lazy"
                />
              ) : (
                <div className="photo-placeholder">
                  <span className="photo-placeholder-initial">
                    {personName.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-2xl mt-1">🎂</span>
                </div>
              )}
            </div>
          </div>

          {/* Host Credit */}
          {hostName && (
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-white/80 uppercase mt-2">
              {t.hostedBy} <span className="text-amber-300">{hostName}</span>
            </p>
          )}

          {/* Message / Card Quote */}
          {message && (
            <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm sm:text-base italic text-white/90 leading-relaxed max-w-lg mx-auto">
              &ldquo;{message}&rdquo;
            </div>
          )}
        </div>

        {/* THEN & NOW PHOTO PAIR (IF PROVIDED) */}
        {(data.photo1 || data.photo2) && (
          <div className="bday-section">
            <div className="section-header">
              <span className="section-tag">✦ Throwback Memories ✦</span>
              <h2 className="section-title">
                {lang === "hi" ? "तब और अब (Then & Now)" : "Then & Now"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              {data.photo1 && (
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/15 text-center space-y-2 backdrop-blur-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                    👶 {lang === "hi" ? "तब (बचपन)" : "Then (Childhood)"}
                  </span>
                  <div className="w-full h-52 sm:h-56 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={data.photo1}
                      alt="Then (Childhood)"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {data.photo2 && (
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/15 text-center space-y-2 backdrop-blur-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                    ✨ {lang === "hi" ? "अब (आज)" : `Now (${personName})`}
                  </span>
                  <div className="w-full h-52 sm:h-56 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={data.photo2}
                      alt="Now"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PARTY DETAILS & DATE */}
        <div className="bday-section">
          <div className="section-header">
            <span className="section-tag">✦ When & Where ✦</span>
            <h2 className="section-title">{t.partyDetails}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="p-4 rounded-2xl bg-black/20 border border-white/10 flex items-center gap-3.5">
              <span className="text-3xl">📅</span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                  Date
                </span>
                <span className="text-sm sm:text-base font-semibold text-white">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/20 border border-white/10 flex items-center gap-3.5">
              <span className="text-3xl">⏰</span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                  Time
                </span>
                <span className="text-sm sm:text-base font-semibold text-white">
                  {celebrationTime}
                </span>
              </div>
            </div>
          </div>

          {/* Dress Code & RSVP Date Badges */}
          {(data.dressCode || data.rsvpBy) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {data.dressCode && (
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 flex items-center gap-3">
                  <span className="text-2xl">👗</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      {lang === "hi" ? "वस्त्र संहिता (Dress Code)" : "Dress Code"}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {data.dressCode}
                    </span>
                  </div>
                </div>
              )}

              {data.rsvpBy && (
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      {lang === "hi" ? "आरएसवीपी अंतिम तिथि" : "RSVP By"}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {data.rsvpBy}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-4 rounded-2xl bg-black/20 border border-white/10 flex items-start gap-3.5">
            <span className="text-3xl">📍</span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                Venue
              </span>
              <span className="text-base font-bold text-white block">
                {venueName}
              </span>
              {venueAddress && (
                <span className="text-xs text-white/70 mt-0.5 block leading-relaxed">
                  {venueAddress}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PARTY ITINERARY / ORDER OF CELEBRATION */}
        {((data.schedule && data.schedule.length > 0) || (events && events.length > 0)) && (
          <div className="bday-section">
            <div className="section-header">
              <span className="section-tag">✦ {lang === "hi" ? "कार्यक्रम" : "Timeline"} ✦</span>
              <h2 className="section-title">{lang === "hi" ? "उत्सव का क्रम" : "Order of Celebration"}</h2>
            </div>

            <div className="events-list">
              {data.schedule && data.schedule.length > 0
                ? data.schedule.map((item, idx) => (
                    <div key={item.id || idx} className="event-card">
                      <div className="event-badge-time">
                        {item.time || "Fun Time"}
                      </div>
                      <div className="event-info">
                        <h3 className="event-title">{item.title}</h3>
                        {item.desc && (
                          <p className="event-tagline">{item.desc}</p>
                        )}
                      </div>
                    </div>
                  ))
                : events.map((ev, idx) => (
                    <div key={ev.id || idx} className="event-card">
                      <div className="event-badge-time">
                        {ev.time || "Fun Time"}
                      </div>
                      <div className="event-info">
                        <h3 className="event-title">{ev.title}</h3>
                        {ev.tagline && (
                          <p className="event-tagline">{ev.tagline}</p>
                        )}
                        <p className="event-venue">
                          <span>📍</span> {ev.venue || venueName}
                        </p>
                      </div>
                      {ev.photo && (
                        <img
                          src={ev.photo}
                          alt={ev.title}
                          className="w-14 h-14 rounded-xl object-cover border border-white/20 shrink-0"
                        />
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* COUNTDOWN TIMER */}
        <div className="bday-section text-center">
          <div className="section-header">
            <span className="section-tag">✦ Excitement Building ✦</span>
            <h2 className="section-title">{t.countingDown}</h2>
          </div>

          {countdown.isPassed ? (
            <div className="p-5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-base sm:text-lg">
              {t.celebrationsBegun}
            </div>
          ) : (
            <div className="countdown-grid">
              <div className="countdown-box">
                <div className="countdown-number">{countdown.days}</div>
                <div className="countdown-label">{t.days}</div>
              </div>
              <div className="countdown-box">
                <div className="countdown-number">{countdown.hours}</div>
                <div className="countdown-label">{t.hours}</div>
              </div>
              <div className="countdown-box">
                <div className="countdown-number">{countdown.minutes}</div>
                <div className="countdown-label">{t.minutes}</div>
              </div>
              <div className="countdown-box">
                <div className="countdown-number">{countdown.seconds}</div>
                <div className="countdown-label">{t.seconds}</div>
              </div>
            </div>
          )}
        </div>

        {/* GALLERY SECTION (Only if photos available) */}
        {gallery && gallery.length > 0 && (
          <div className="bday-section">
            <div className="section-header">
              <span className="section-tag">✦ Memories ✦</span>
              <h2 className="section-title">{t.ourGallery}</h2>
            </div>

            <div className="gallery-grid">
              {gallery.map((photoUrl, index) => (
                <div key={index} className="gallery-item">
                  <img
                    src={photoUrl}
                    alt={`Birthday gallery moment ${index + 1}`}
                    className="gallery-img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VENUE MAP & DIRECTIONS & CALENDAR */}
        <div className="bday-section">
          <div className="section-header">
            <span className="section-tag">✦ Location Map ✦</span>
            <h2 className="section-title">{t.theVenue}</h2>
          </div>

          <div className="map-embed-wrapper">
            <iframe
              title="Party Location Map"
              src={mapEmbedUrl}
              className="map-embed-iframe"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div className="action-buttons-row">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <span>🧭</span>
              <span>{t.getDirections}</span>
            </a>

            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <span>📅</span>
              <span>{t.addToCalendar}</span>
            </a>
          </div>
        </div>

        {/* RSVP SECTION (WhatsApp Direct) */}
        {data.rsvpEnabled && (
          <div className="bday-section text-center">
            <div className="section-header">
              <span className="section-tag">✦ RSVP ✦</span>
              <h2 className="section-title">{lang === "hi" ? "उपस्थिति की पुष्टि" : "Will You Join Us?"}</h2>
            </div>

            <div className="p-6 rounded-3xl bg-black/30 border border-white/15 backdrop-blur-md max-w-lg mx-auto shadow-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-3xl shadow-lg">
                💌
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {lang === "hi" ? "कृपया अपनी उपस्थिति दर्ज करें" : "Kindly Confirm Your Presence"}
              </h3>
              <p className="text-sm text-white/80 mb-4 max-w-sm mx-auto">
                {data.rsvpBy
                  ? (lang === "hi" ? `कृपया ${data.rsvpBy} तक हमें बताएं ताकि हम आपके स्वागत की तैयारी कर सकें!` : `Please let us know by ${data.rsvpBy} so we can prepare for your warm celebration!`)
                  : (lang === "hi" ? "कृपया व्हाट्सएप पर एक टैप से अपनी उपस्थिति की पुष्टि करें।" : "Tap below to quickly confirm your attendance with us directly on WhatsApp.")}
              </p>

              {data.hostName && (
                <div className="text-xs text-amber-300 font-semibold mb-5 uppercase tracking-wider">
                  {lang === "hi" ? `मेजबान: ${data.hostName}` : `Hosted by: ${data.hostName}`}
                </div>
              )}

              {data.contactPhone ? (
                <a
                  href={whatsappUrl(
                    data.contactPhone,
                    lang === "hi"
                      ? `नमस्ते! मैं ${personName} के जन्मदिन समारोह (${formattedDate}) में शामिल होने के लिए पुष्टि करता/करती हूँ।`
                      : `Hi! I would love to RSVP for ${personName}'s birthday celebration on ${formattedDate}. Count me in!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span className="text-xl">💬</span>
                  <span>{lang === "hi" ? "व्हाट्सएप पर RSVP भेजें" : "RSVP on WhatsApp"}</span>
                </a>
              ) : (
                <div className="text-xs text-white/50">
                  {lang === "hi" ? "संपर्क नंबर उपलब्ध नहीं है" : "Contact phone not provided"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTACT SECTION */}
        <div className="bday-section text-center">
          <div className="section-header">
            <span className="section-tag">✦ Contact ✦</span>
            <h2 className="section-title">{t.getInTouch}</h2>
          </div>

          {/* Contact Family/Host */}
          <div className="contact-grid">
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn"
              >
                <span className="contact-icon">💬</span>
                <span className="contact-label">{t.whatsApp}</span>
                <span className="text-[11px] text-white/70">
                  {data.contactPhone}
                </span>
              </a>
            )}

            {cleanPhone && (
              <a href={`tel:${cleanPhone}`} className="contact-btn">
                <span className="contact-icon">📞</span>
                <span className="contact-label">{t.call}</span>
                <span className="text-[11px] text-white/70">
                  {data.contactName || "Call"}
                </span>
              </a>
            )}

            {data.contactEmail && (
              <a
                href={`mailto:${data.contactEmail}`}
                className="contact-btn"
              >
                <span className="contact-icon">✉️</span>
                <span className="contact-label">{t.email}</span>
                <span className="text-[11px] text-white/70 truncate max-w-[120px]">
                  {data.contactEmail}
                </span>
              </a>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bday-footer">
          <p className="mb-1">
            {t.craftedWithLove} for {personName}
          </p>
          <p>
            <Link href="/" className="hover:underline">
              {t.madeWith}
            </Link>
          </p>
        </footer>
      </div>

      {/* FLOATING SHARE BUTTON */}
      <button
        type="button"
        onClick={handleShare}
        className="floating-share-btn"
        aria-label="Share Invitation"
      >
        <span>📤</span>
        <span>{t.share}</span>
      </button>

      {/* TOAST MESSAGE */}
      {toast && <div className="bday-toast">{toast}</div>}
    </div>
  );
}
