/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
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
import { GHAR_FUNCTION_CSS } from "./ghar-function.styles";
import MusicPlayer from "./MusicPlayer";
import GuestLanguageToggle from "./GuestLanguageToggle";
import { Lang } from "@/types/card";

export interface GharFunctionProps {
  data: CardData;
  previewMode?: boolean;
  slug?: string;
}

export default function GharFunction({
  data,
  previewMode = false,
  slug,
}: GharFunctionProps) {
  const [lang, setLang] = useState<Lang>(data.lang || "hi");
  const t = getI18n(lang);

  useEffect(() => {
    if (data.lang) setLang(data.lang);
  }, [data.lang]);

  // Intro states
  const [isLit, setIsLit] = useState(previewMode);
  const [isOpened, setIsOpened] = useState(previewMode);
  const [isGone, setIsGone] = useState(previewMode);

  // Toast state for share link
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
  const functionName = data.functionName || "Griha Pravesh";
  const familyName = data.familyName || "Sharma Parivar";
  const hostName = data.hostName;
  const muhurat = data.muhurat;
  const heroPhoto = data.heroPhoto;
  const message = data.message || t.defaultInviteMessage;
  const gallery = data.gallery || [];
  const events = data.events || [];
  const schedule = data.schedule || [];
  const venueName = data.venueName || "Home / Venue";
  const venueAddress = data.venueAddress || "";
  const formattedDate = dateLong(data.mainDate, lang) || formatDisplayDate(data.mainDate, lang);
  const celebrationTime = data.timeText || (data.mainDate ? `${formatDisplayTime(data.mainDate)} ${t.onwards}` : "Auspicious Time");

  const cleanPhone = (data.contactPhone || "")
    .replace(/[^\d+]/g, "")
    .replace(/^\+/, "");

  const calendarUrl = googleCalendarUrl(data);
  const directionsUrl = googleMapsDirectionsUrl(data);

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.mapQuery || `${venueName}, ${venueAddress}`
  )}&output=embed`;

  // Countdown calculation
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
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
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

  // Handle intro tap
  const handleLightKalash = () => {
    if (isLit) return;
    setIsLit(true);

    setTimeout(() => {
      setIsOpened(true);
    }, 1100);

    setTimeout(() => {
      setIsGone(true);
    }, 1900);
  };

  // Share handler
  const handleShare = async () => {
    const url =
      typeof window !== "undefined" && window.location.href
        ? window.location.href
        : slug
        ? `/c/${slug}`
        : "";
    const shareTitle = `${functionName} – ${familyName} Invitation`;
    const shareText = `You are cordially invited with family for ${functionName} on ${formattedDate}. Tap to view the invitation:`;

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
    <div className="ghar-card">
      {/* Scoped CSS Injector */}
      <style dangerouslySetInnerHTML={{ __html: GHAR_FUNCTION_CSS }} />

      {/* Background Decorative Mandala Rings */}
      <div className="ghar-bg-decor">
        <div
          className="mandala-circle"
          style={{ width: "600px", height: "600px", top: "25%", left: "50%" }}
        />
        <div
          className="mandala-circle"
          style={{ width: "900px", height: "900px", top: "75%", left: "50%" }}
        />
      </div>

      {/* 1. INTRO SCREEN: KALASH & DIYA LIGHTING */}
      {!previewMode && !isGone && (
        <div
          className={`ghar-intro-overlay ${isOpened ? "fade-out" : ""}`}
          onClick={handleLightKalash}
        >
          {/* Kalash with Diya */}
          <div className={`kalash-diya-wrap ${isLit ? "lit" : ""}`}>
            <div className="kalash-halo" />

            {/* Sacred Kalash Vector */}
            <svg
              className="kalash-svg-container"
              viewBox="0 0 100 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Coconut */}
              <ellipse cx="50" cy="32" rx="16" ry="19" fill="#78350f" />
              <ellipse cx="50" cy="32" rx="14" ry="17" fill="#92400e" />
              {/* Mango Leaves */}
              <path d="M50 35 C38 20 22 28 20 38 C28 42 42 42 50 35Z" fill="#15803d" />
              <path d="M50 35 C62 20 78 28 80 38 C72 42 58 42 50 35Z" fill="#16a34a" />
              <path d="M50 32 C46 15 54 8 50 2 C46 8 54 15 50 32Z" fill="#22c55e" />
              {/* Kalash Neck & Body */}
              <path d="M35 44 H65 L68 52 H32 Z" fill="#ca8a04" />
              <path
                d="M32 52 C22 58 18 78 26 92 C32 102 68 102 74 92 C82 78 78 58 68 52 Z"
                fill="url(#kalashGradient)"
              />
              {/* Swastik on Kalash */}
              <path
                d="M48 68 V78 M42 70 H48 M48 78 H54 M44 74 H56 M44 70 V74 M56 74 V78"
                stroke="#b91c1c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="kalashGradient" x1="20" y1="52" x2="80" y2="100">
                  <stop stopColor="#fef08a" />
                  <stop offset="0.3" stopColor="#eab308" />
                  <stop offset="0.7" stopColor="#ca8a04" />
                  <stop offset="1" stopColor="#854d0e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Auspicious Diya Lamp */}
            <div className="diya-base">
              <div className="diya-wick" />
              <div className="diya-flame" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold font-serif tracking-wider text-amber-200 drop-shadow-md">
            {isLit ? t.shubhAarambh : t.tapToLightKalash}
          </p>
          <p className="text-xs sm:text-sm text-amber-100/80 mt-2 font-medium">
            {familyName}&apos;s {functionName}
          </p>
        </div>
      )}

      {/* Floating Guest Language Toggle */}
      <GuestLanguageToggle currentLang={lang} onToggle={setLang} theme="ghar" />

      {/* Floating Background Music Player */}
      <MusicPlayer musicUrl={data.musicUrl} theme="ghar" />

      {/* MAIN CONTENT WRAPPER */}
      <div className="ghar-container">
        {/* TOP AUSPICIOUS SHLOKA BANNER */}
        <div className="top-shloka-banner">
          <span className="shloka-text">
            <span>🪔</span>
            <span>{t.auspiciousShloka}</span>
            <span>🪔</span>
          </span>
        </div>

        {/* HERO SECTION */}
        <div className="ghar-section text-center">
          <p className="hero-tagline">{t.divineBlessingsAwaited}</p>

          <h1 className="hero-function-title">{functionName}</h1>

          <h2 className="hero-family-name">{familyName}</h2>

          {hostName && (
            <p className="text-xs sm:text-sm font-semibold text-amber-300/90 tracking-wide mt-1">
              {lang === "hi" ? `मेजबान: ${hostName}` : `Hosted with love by ${hostName}`}
            </p>
          )}

          <div className="ornamental-divider">
            <span>✦</span>
            <span>ॐ</span>
            <span>✦</span>
          </div>

          {/* Personal Invitation Message */}
          <div className="p-5 rounded-2xl bg-black/25 border border-white/10 text-sm sm:text-base italic text-amber-100 leading-relaxed max-w-lg mx-auto">
            &ldquo;{message}&rdquo;
          </div>

          {/* Optional Hero Photo (House/Mandir Photo) */}
          {heroPhoto && (
            <div className="ghar-photo-frame">
              <img
                src={heroPhoto}
                alt={`${functionName} Celebration`}
                className="ghar-photo-img"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* OLD HOME & NEW HOME PHOTO PAIR (IF PROVIDED) */}
        {(data.photo1 || data.photo2) && (
          <div className="ghar-section">
            <div className="text-center mb-5">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block mb-1">
                ✦ {lang === "hi" ? "आशियाने का सफ़र" : "Journey to New Abode"} ✦
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                {lang === "hi" ? "स्मृतियों से नव निर्माण तक" : "Old Home & New Home"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              {data.photo1 && (
                <div className="p-3.5 rounded-2xl bg-black/35 border border-amber-500/20 text-center space-y-2 backdrop-blur-sm shadow-md">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                    🏡 {lang === "hi" ? "पुराना आवास (Old Home)" : "Old Home"}
                  </span>
                  <div className="w-full h-52 sm:h-56 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={data.photo1}
                      alt="Old Home"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {data.photo2 && (
                <div className="p-3.5 rounded-2xl bg-black/35 border border-amber-500/20 text-center space-y-2 backdrop-blur-sm shadow-md">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                    ✨ {lang === "hi" ? "नया आशियाना (New Home)" : "New Home"}
                  </span>
                  <div className="w-full h-52 sm:h-56 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={data.photo2}
                      alt="New Home"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SHUBH MUHURAT / DATE & VENUE BOX */}
        <div className="ghar-section">
          {/* Muhurat Highlight if present */}
          {muhurat && (
            <div className="muhurat-badge-box">
              <div className="muhurat-label">
                <span>🏺</span>
                <span>{t.shubhMuhurat}</span>
                <span>🐚</span>
              </div>
              <p className="muhurat-time-text">{muhurat}</p>
            </div>
          )}

          <div className="details-grid">
            <div className="detail-card-item">
              <div className="detail-icon-circle">📅</div>
              <div>
                <span className="detail-card-title">{lang === "hi" ? "शुभ तिथि" : "Auspicious Date"}</span>
                <span className="detail-card-val">{formattedDate}</span>
              </div>
            </div>

            <div className="detail-card-item">
              <div className="detail-icon-circle">⏰</div>
              <div>
                <span className="detail-card-title">{lang === "hi" ? "शुभ समय" : "Timings"}</span>
                <span className="detail-card-val">{celebrationTime}</span>
              </div>
            </div>
          </div>

          {(data.dressCode || data.rsvpBy) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {data.dressCode && (
                <div className="detail-card-item">
                  <div className="detail-icon-circle">👔</div>
                  <div>
                    <span className="detail-card-title">{lang === "hi" ? "वेशभूषा" : "Dress Code"}</span>
                    <span className="detail-card-val">{data.dressCode}</span>
                  </div>
                </div>
              )}
              {data.rsvpBy && (
                <div className="detail-card-item">
                  <div className="detail-icon-circle">✉️</div>
                  <div>
                    <span className="detail-card-title">{lang === "hi" ? "आरएसवीपी तिथि" : "RSVP By"}</span>
                    <span className="detail-card-val">{data.rsvpBy}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="detail-card-item mt-3">
            <div className="detail-icon-circle">📍</div>
            <div className="flex-1">
              <span className="detail-card-title">{t.theVenue}</span>
              <span className="detail-card-val block font-bold text-base">
                {venueName}
              </span>
              {venueAddress && (
                <span className="text-xs text-amber-100/75 mt-0.5 block">
                  {venueAddress}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SACRED RITUALS / POOJA SCHEDULE */}
        {((schedule && schedule.length > 0) || (events && events.length > 0)) && (
          <div className="ghar-section">
            <div className="text-center mb-5">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block mb-1">
                ✦ {t.theCelebrations || "Puja & Anushthan"} ✦
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                {lang === "hi" ? "पूजा एवं अनुष्ठान क्रम" : "Pooja & Rituals Schedule"}
              </h3>
            </div>

            <div className="rituals-list">
              {schedule && schedule.length > 0
                ? schedule.map((item, idx) => (
                    <div key={item.id || idx} className="ritual-item-card">
                      <div className="ritual-time-badge">
                        {item.time || "Shubh Samay"}
                      </div>
                      <div className="ritual-info">
                        <h4 className="ritual-title">{item.title}</h4>
                        {item.desc && (
                          <p className="ritual-tagline">{item.desc}</p>
                        )}
                      </div>
                    </div>
                  ))
                : events.map((ev, idx) => (
                    <div key={ev.id || idx} className="ritual-item-card">
                      <div className="ritual-time-badge">
                        {ev.time || "Shubh Samay"}
                      </div>
                      <div className="ritual-info">
                        <h4 className="ritual-title">{ev.title}</h4>
                        {ev.tagline && (
                          <p className="ritual-tagline">{ev.tagline}</p>
                        )}
                        <p className="ritual-venue">
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
        <div className="ghar-section text-center">
          <div className="text-center mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block mb-1">
              ✦ शुभ लग्न प्रतीक्षा ✦
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              {t.countingDown}
            </h3>
          </div>

          {countdown.isPassed ? (
            <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-base sm:text-lg">
              {t.celebrationsBegun}
            </div>
          ) : (
            <div className="ghar-countdown-grid">
              <div className="ghar-countdown-box">
                <div className="ghar-countdown-val">{countdown.days}</div>
                <div className="ghar-countdown-label">{t.days}</div>
              </div>
              <div className="ghar-countdown-box">
                <div className="ghar-countdown-val">{countdown.hours}</div>
                <div className="ghar-countdown-label">{t.hours}</div>
              </div>
              <div className="ghar-countdown-box">
                <div className="ghar-countdown-val">{countdown.minutes}</div>
                <div className="ghar-countdown-label">{t.minutes}</div>
              </div>
              <div className="ghar-countdown-box">
                <div className="ghar-countdown-val">{countdown.seconds}</div>
                <div className="ghar-countdown-label">{t.seconds}</div>
              </div>
            </div>
          )}
        </div>

        {/* OPTIONAL GALLERY (House / Family Photos) */}
        {gallery && gallery.length > 0 && (
          <div className="ghar-section">
            <div className="text-center mb-5">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block mb-1">
                ✦ सुखद स्मृतियाँ ✦
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                {t.ourGallery}
              </h3>
            </div>

            <div className="ghar-gallery-grid">
              {gallery.map((photoUrl, index) => (
                <div key={index} className="ghar-gallery-item">
                  <img
                    src={photoUrl}
                    alt={`Ghar moment ${index + 1}`}
                    className="ghar-gallery-img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VENUE MAP & NAVIGATION */}
        <div className="ghar-section">
          <div className="text-center mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block mb-1">
              ✦ निवास स्थान मार्ग ✦
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              {t.theVenue}
            </h3>
          </div>

          <div className="w-full h-60 rounded-2xl overflow-hidden border border-white/20 mb-3 bg-black">
            <iframe
              title="Venue Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div className="action-grid">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghar-primary"
            >
              <span>🧭</span>
              <span>{t.getDirections}</span>
            </a>

            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghar-secondary"
            >
              <span>📅</span>
              <span>{t.addToCalendar}</span>
            </a>
          </div>
        </div>

        {/* RSVP SECTION (WhatsApp Direct) */}
        {data.rsvpEnabled && (
          <div className="ghar-section text-center">
            <div className="text-center mb-4">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block mb-1">
                ✦ {lang === "hi" ? "उपस्थिति की सूचना" : "RSVP"} ✦
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                {lang === "hi" ? "अपनी उपस्थिति दर्ज करें" : "Will You Bless Us with Your Presence?"}
              </h3>
            </div>

            <div className="p-6 rounded-3xl bg-black/35 border border-amber-500/25 backdrop-blur-md max-w-lg mx-auto shadow-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-3xl shadow-lg text-amber-100">
                🪔
              </div>
              <h4 className="text-xl font-serif font-bold text-amber-200 mb-2">
                {lang === "hi" ? "सपरिवार पधारकर अनुग्रहीत करें" : "Kindly Confirm Your Presence"}
              </h4>
              <p className="text-sm text-amber-100/80 mb-4 max-w-sm mx-auto">
                {data.rsvpBy
                  ? (lang === "hi" ? `कृपया ${data.rsvpBy} तक हमें सूचित करें ताकि स्वागत की समुचित व्यवस्था हो सके!` : `Please let us know by ${data.rsvpBy} so we may prepare for your gracious arrival!`)
                  : (lang === "hi" ? "कृपया व्हाट्सएप पर एक टैप से अपनी उपस्थिति की पुष्टि करें।" : "Tap below to quickly confirm your presence with the family on WhatsApp.")}
              </p>

              {hostName && (
                <div className="text-xs text-amber-300 font-semibold mb-5 uppercase tracking-wider">
                  {lang === "hi" ? `मेजबान: ${hostName}` : `Host: ${hostName}`}
                </div>
              )}

              {data.contactPhone ? (
                <a
                  href={whatsappUrl(
                    data.contactPhone,
                    lang === "hi"
                      ? `नमस्ते! हम ${familyName} के ${functionName} (${formattedDate}) में सपरिवार शामिल होने की पुष्टि करते हैं।`
                      : `Namaste! We are delighted to confirm our presence for the ${functionName} of ${familyName} on ${formattedDate}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-base text-white bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-orange-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span className="text-xl">💬</span>
                  <span>{lang === "hi" ? "व्हाट्सएप पर RSVP भेजें" : "RSVP on WhatsApp"}</span>
                </a>
              ) : (
                <div className="text-xs text-amber-200/50">
                  {lang === "hi" ? "संपर्क नंबर उपलब्ध नहीं है" : "Contact phone not provided"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTACT SECTION */}
        <div className="ghar-section text-center">
          <div className="text-center mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block mb-1">
              ✦ {t.getInTouch} ✦
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              {t.contactTheFamily}
            </h3>
          </div>

          {/* Contact Direct Links */}
          <div className="contact-row">
            {cleanPhone && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-btn"
              >
                <span className="text-2xl">💬</span>
                <span className="text-xs font-semibold text-amber-300">
                  {t.whatsApp}
                </span>
                <span className="text-[11px] text-amber-100/70">
                  {data.contactPhone}
                </span>
              </a>
            )}

            {cleanPhone && (
              <a href={`tel:${cleanPhone}`} className="contact-card-btn">
                <span className="text-2xl">📞</span>
                <span className="text-xs font-semibold text-amber-300">
                  {t.call}
                </span>
                <span className="text-[11px] text-amber-100/70">
                  {data.contactName || "Contact"}
                </span>
              </a>
            )}

            {data.contactEmail && (
              <a
                href={`mailto:${data.contactEmail}`}
                className="contact-card-btn"
              >
                <span className="text-2xl">✉️</span>
                <span className="text-xs font-semibold text-amber-300">
                  {t.email}
                </span>
                <span className="text-[11px] text-amber-100/70 truncate max-w-[120px]">
                  {data.contactEmail}
                </span>
              </a>
            )}
          </div>
        </div>

        {/* HUM AAPKA INTEZAAR KARENGE FOOTER */}
        <footer className="ghar-devotional-footer">
          <div className="ornamental-divider mb-4">
            <span>🪔</span>
            <span>॥ शुभम् भवतु ॥</span>
            <span>🪔</span>
          </div>

          <h3 className="intezaar-title">{t.humAapkaIntezaarKarenge}</h3>
          <p className="intezaar-desc">{t.awaitingPresenceWarmly}</p>

          <p className="darshan-host">
            {t.awaitingYourPresence}: {data.contactName || familyName} एवं समस्त परिवार
          </p>

          <div className="mt-6 text-xs text-amber-100/60">
            <Link href="/" className="hover:underline text-amber-300">
              {t.madeWith}
            </Link>
          </div>
        </footer>
      </div>

      {/* FLOATING SHARE BUTTON */}
      <button
        type="button"
        onClick={handleShare}
        className="ghar-share-btn"
        aria-label="Share Invitation"
      >
        <span>📤</span>
        <span>{t.share}</span>
      </button>

      {/* TOAST MESSAGE */}
      {toast && <div className="ghar-toast">{toast}</div>}
    </div>
  );
}
