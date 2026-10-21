/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { Great_Vibes, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { CardData, Lang } from "@/types/card";
import { getI18n } from "@/lib/i18n";
import {
  dateShort as formatDateShort,
  dateLong as formatDateLong,
  googleCalendarUrl,
  googleMapsDirectionsUrl,
  formatTime12h,
} from "@/lib/format";
import { BIRTHDAY_CELEBRATION_CSS } from "./birthday-celebration.styles";
import MusicPlayer from "./MusicPlayer";
import GuestLanguageToggle from "./GuestLanguageToggle";
import {
  useReveal,
  useCountdown,
  useScrollProgress,
  ScrollBar,
  ShareButton,
  useParticles,
  Particles,
  useIntroDoor,
  IntroDoor,
  Countdown,
  Gallery,
  VenueSection,
  RsvpButtons,
  Timeline,
  PhotoPair,
  SectionHeading,
} from "./shared";

// Load fonts via next/font
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export interface BirthdayCelebrationProps {
  data: CardData;
  previewMode?: boolean;
  showPlaceholders?: boolean;
  slug?: string;
}

const CONFETTI_COLORS = [
  "#e8576f",
  "#f3e2a9",
  "#c9a24b",
  "#7a86d9",
  "#ffffff",
  "#f4a6bd",
];

const PLACEHOLDER_TILES = [
  { emoji: "🎈", bg: "#3b46a0" },
  { emoji: "🎁", bg: "#7a2a5a" },
  { emoji: "🥳", bg: "#a8325a" },
  { emoji: "🍰", bg: "#2a5a7a" },
  { emoji: "🎶", bg: "#5a3a8a" },
  { emoji: "📸", bg: "#8a5a2a" },
  { emoji: "✨", bg: "#2a7a6a" },
  { emoji: "🎉", bg: "#7a3a3a" },
];

export default function BirthdayCelebration({
  data,
  previewMode = false,
  showPlaceholders = false,
  slug,
}: BirthdayCelebrationProps) {
  const [lang, setLang] = useState<Lang>(data.lang || "en");
  const t = getI18n(lang);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data.lang) setLang(data.lang);
  }, [data.lang]);

  // Derived properties from CardData
  const personName = data.personName || "";
  const age = data.age !== undefined && data.age !== null ? String(data.age) : "";
  const role = data.role || "";
  const hostName = data.hostName || "";
  const timeText = data.timeText || "";
  const venueName = data.venueName || "";
  const dressCode = data.dressCode || "";
  const rsvpBy = data.rsvpBy || "";

  const dateShortStr = formatDateShort(data.mainDate);
  const dateLongStr = formatDateLong(data.mainDate, lang);

  const cleanPhone = (data.contactPhone || "").replace(/[^\d]/g, "");
  const waPhone =
    cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const directionsUrl =
    googleMapsDirectionsUrl(data) ||
    (venueName ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName)}` : "");
  const calendarUrl =
    googleCalendarUrl(data) ||
    (venueName ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${personName || "Birthday"}’s Celebration`
    )}&location=${encodeURIComponent(venueName)}` : "");

  const yesWaUrl = waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
    lang === "hi"
      ? `नमस्ते! मैं ${personName || "जन्मदिन"} समारोह में अवश्य शामिल हूँगा/हूँगी 🎉`
      : `Hi! I’ll be attending ${personName || "the"} birthday celebration 🎉`
  )}` : "#";

  const noWaUrl = waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
    lang === "hi"
      ? `नमस्ते! क्षमा करें, मैं ${personName || "जन्मदिन"} पर नहीं आ पाऊँगा/पाऊँगी, पर ढेर सारा प्यार और शुभकामनाएँ 💛`
      : `Hi! Sorry, I won’t be able to make it to ${personName || "the"} birthday, but sending lots of love 💛`
  )}` : "#";

  const invitationMessage =
    data.message ||
    (lang === "hi"
      ? "जीवन में एक और वर्ष हँसी, स्नेह और नए सपनों का। आइए, हमारे साथ खुशियों का जाम उठाइए — आपकी स्नेहमयी उपस्थिति ही हमारे लिए सबसे अनमोल उपहार है।"
      : "Another year of laughter, love and little adventures. Come raise a glass and celebrate with us — your presence is the best gift of all.");

  const thenCaption =
    data.thenCaption || (lang === "hi" ? t.whereStoryBegan : "Where the story began");
  const nowCaption =
    data.nowCaption ||
    (lang === "hi" ? t.stillTheHeart : "Still the heart of every party");

  // Shared Hooks
  const scrollProgress = useScrollProgress();
  const countdown = useCountdown(data.mainDate);

  const { particles, trigger: triggerConfetti } = useParticles({
    count: 60,
    colors: CONFETTI_COLORS,
    type: "confetti",
  });

  const {
    isLit,
    isOpen,
    isGone,
    isReady,
    tapText: candleText,
    handleOpenCard,
  } = useIntroDoor({
    previewMode,
    initialTapText: t.tapToLightCandle,
    litTapText: t.letsCelebrate,
    onReady: () => triggerConfetti(60),
  });

  // If in previewMode, fire initial confetti
  useEffect(() => {
    if (previewMode) {
      triggerConfetti(30);
    }
  }, [previewMode, triggerConfetti]);

  useReveal({ containerRef, isReady, previewMode });

  // Schedule timeline from CardData (clean empty if not present)
  const scheduleItems = useMemo(() => {
    if (data.schedule && data.schedule.length > 0) {
      return data.schedule.map((item) => ({
        ...item,
        time: item.time ? formatTime12h(item.time) : "Fun Time",
      }));
    }
    return [];
  }, [data.schedule]);

  const hasSchedule = scheduleItems.length > 0;
  const platformName = process.env.NEXT_PUBLIC_PLATFORM_NAME || "निमंत्रण Utsav";

  return (
    <div
      ref={containerRef}
      className={`bday-cel ${greatVibes.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${
        isReady ? "ready" : ""
      }`}
    >
      {/* Scoped CSS Injection */}
      <style dangerouslySetInnerHTML={{ __html: BIRTHDAY_CELEBRATION_CSS }} />

      {/* Top Fixed Scroll Progress Bar */}
      <ScrollBar progress={scrollProgress} />

      {/* Ambient Music & Guest Language Toggle */}
      <MusicPlayer musicUrl={data.musicUrl} theme="birthday" />
      <GuestLanguageToggle currentLang={lang} onToggle={setLang} theme="birthday" />

      {/* Confetti Falling Pieces */}
      <Particles items={particles} className="bit" />

      {/* INTRO SCREEN: DOORS + CANDLE */}
      <IntroDoor
        isLit={isLit}
        isOpen={isOpen}
        isGone={isGone}
        previewMode={previewMode}
        onOpenCard={handleOpenCard}
        overlayClassName="intro-overlay"
      >
        <div className="sl a1">{t.youreInvited}</div>

        <div className="candle a2">
          <svg viewBox="0 0 60 120" width="90" aria-hidden="true">
            <defs>
              <linearGradient id="cb" x1="0" x2="1">
                <stop offset="0" stopColor="#e9dfc2" />
                <stop offset="0.5" stopColor="#fffaf0" />
                <stop offset="1" stopColor="#d9c9a0" />
              </linearGradient>
              <radialGradient id="gf" cx="50%" cy="75%" r="65%">
                <stop offset="0" stopColor="#fff6c8" />
                <stop offset="0.5" stopColor="#ffb347" />
                <stop offset="1" stopColor="#e8591a" />
              </radialGradient>
            </defs>
            <path
              className="flame"
              d="M30 40 C16 26 24 12 30 0 C36 12 44 26 30 40Z"
              fill="url(#gf)"
            />
            <rect x="28" y="36" width="4" height="10" rx="2" fill="#3a1a10" />
            <rect x="16" y="44" width="28" height="66" rx="4" fill="url(#cb)" />
            <path
              d="M16 56 q4 12 8 0 q4 10 8 0 q4 14 8 0 q3 8 4 0"
              fill="#e8576f"
              opacity=".85"
            />
            <ellipse cx="30" cy="112" rx="26" ry="5" fill="#c9a24b" />
          </svg>
        </div>

        <div className="inv a3">{t.birthdayCelebrationOf}</div>
        <div className="nm a4">{personName}</div>
        <div className="dt a5">{dateShortStr}</div>
        <div className="tp a6" id="tp">
          {candleText}
          <i />
        </div>
      </IntroDoor>

      {/* MAIN CELEBRATION CONTENT */}
      <main>
        {/* 1. HERO SECTION */}
        <section id="hero" className="dark hero-section">
          <div className="wrap">
            <div className="eyebrow rv" style={{ color: "var(--gold2)" }}>
              {t.letsCelebrate}
            </div>
            <div className="big script rv d1">{personName}</div>
            <div className="turns rv d2">
              {t.turns} <b>{age}</b>
            </div>
            <div className="orn rv d2" style={{ marginTop: "22px" }}>
              <i />✦<i />
            </div>
            <div className="hero-date rv d3">{dateLongStr}</div>
            <div className="hero-loc rv d3">📍 {venueName}</div>
          </div>
          <div className="scroll">{t.scrollToUnfold}</div>
        </section>

        {/* 2. THE INVITATION */}
        <section className="ivory">
          <div className="wrap">
            <SectionHeading
              eyebrow={t.theInvitation}
              ornament={true}
            />
            <p className="lead rv d1">&ldquo;{invitationMessage}&rdquo;</p>
            {hostName && (
              <p
                className="rv d2"
                style={{
                  letterSpacing: ".3em",
                  opacity: 0.7,
                  textTransform: "uppercase",
                  fontSize: "14px",
                }}
              >
                {t.hostedBy} <span>{hostName}</span>
              </p>
            )}
          </div>
        </section>

        {/* 3. THEN & NOW SECTION */}
        <section className="mist">
          <div className="wrap">
            <SectionHeading
              eyebrow={t.thenAndNow}
              ornament={false}
              titlePrefix={t.theBirthdayRole}
              highlight={role}
            />

            <PhotoPair previewMode={previewMode}>
              {/* Then (Childhood) */}
              <div className="person rv l">
                <div
                  className="photo"
                  id="p1"
                  style={
                    data.photo1
                      ? { backgroundImage: `url(${data.photo1})` }
                      : undefined
                  }
                >
                  {!data.photo1 && <span>🧒</span>}
                </div>
                <span className="pill">{t.then}</span>
                <span className="script">
                  {t.little} {personName}
                </span>
                <em>{thenCaption}</em>
              </div>

              {/* Colliding Birthday Cake Icon */}
              <div className="mid rv z d2">🎂</div>

              {/* Now (Today) */}
              <div className="person rv r">
                <div
                  className="photo"
                  id="p2"
                  style={
                    data.photo2
                      ? { backgroundImage: `url(${data.photo2})` }
                      : { backgroundColor: "#a8325a" }
                  }
                >
                  {!data.photo2 && <span>🥳</span>}
                </div>
                <span className="pill">{t.now}</span>
                <span className="script">
                  {personName} {t.atAge} {age}
                </span>
                <em>{nowCaption}</em>
              </div>
            </PhotoPair>
          </div>
        </section>

        {/* 4. PARTY ESSENTIALS (DETAILS) */}
        <section className="ivory">
          <div className="wrap">
            <SectionHeading
              eyebrow={t.theDetails}
              ornament={false}
              titlePrefix="Party"
              highlight="Essentials"
              subtitle={t.partyEssentialsSub}
            />

            <div className="cards">
              {dateLongStr && (
                <div className="card rv z">
                  <div className="ic">📅</div>
                  <h3>{t.date}</h3>
                  <p>{dateLongStr}</p>
                </div>
              )}

              {timeText && (
                <div className="card rv z d1">
                  <div className="ic">🕖</div>
                  <h3>{t.time}</h3>
                  <p>{timeText}</p>
                </div>
              )}

              {dressCode && (
                <div className="card rv z d2">
                  <div className="ic">🥂</div>
                  <h3>{t.dressCode}</h3>
                  <p>{dressCode}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. COUNTDOWN TIMER */}
        <section className="dark">
          <div className="wrap">
            <SectionHeading
              eyebrow={t.saveTheDate}
              ornament={false}
              titlePrefix="Counting"
              highlight="Down"
              subtitle={
                countdown.isPassed
                  ? t.celebrationsBegun
                  : "Every second brings us closer to the celebration."
              }
            />

            <Countdown
              countdown={countdown}
              labels={{
                days: t.days,
                hours: t.hours,
                minutes: t.minutes,
                seconds: t.seconds,
              }}
              whenText={
                countdown.isPassed
                  ? t.celebrationsBegun
                  : `${dateLongStr} · ${timeText}`
              }
              whenStyle={{
                letterSpacing: ".25em",
                fontSize: "15px",
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            />
          </div>
        </section>

        {/* 6. ORDER OF CELEBRATION (TIMELINE) */}
        {hasSchedule && (
          <section className="ivory">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.theEvening}
                ornament={false}
                titlePrefix="Order of"
                highlight="Celebration"
                subtitle={t.orderOfCelebrationSub}
              />

              <Timeline items={scheduleItems} />
            </div>
          </section>
        )}

        {/* 7. GALLERY SECTION */}
        {(data.gallery?.length || showPlaceholders) && (
          <section className="dark">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.cherishedMoments}
                ornament={false}
                titlePrefix="Our"
                highlight="Gallery"
                subtitle="A few frames from the journey so far."
              />

              <Gallery
                images={data.gallery}
                placeholders={PLACEHOLDER_TILES}
                showPlaceholders={showPlaceholders}
                renderMode="bg"
              />
            </div>
          </section>
        )}

        {/* 8. THE VENUE */}
        {(venueName || data.venueAddress) && (
          <section className="mist">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.theVenue}
                ornament={false}
                titlePrefix="Find Your"
                highlight="Way"
              />

              <VenueSection
                venueTitle={venueName}
                venueAddress={
                  data.venueAddress ? (
                    <p className="text-sm opacity-75 mt-1 mb-2">
                      {data.venueAddress}
                    </p>
                  ) : undefined
                }
                badgeTagline="BIRTHDAY PARTY"
                dateText={dateLongStr}
                timeText={timeText}
                directionsUrl={directionsUrl}
                calendarUrl={calendarUrl}
                directionsLabel={t.getDirections}
                calendarLabel={t.addToCalendar}
              />
            </div>
          </section>
        )}

        {/* 9. RSVP SECTION (WHATSAPP BASED) */}
        {data.rsvpEnabled !== false && (
          <section className="ivory">
            <div className="wrap rsvp">
              <SectionHeading
                eyebrow="RSVP"
                ornament={true}
                titlePrefix="Will You"
                highlight="Join Us?"
              />
              <p className="rv d2">
                {rsvpBy ? (
                  <>
                    {t.rsvpPleaseLetUsKnow} <b>{rsvpBy}</b> {t.soWeCanPlan}
                  </>
                ) : (
                  t.rsvpPrompt
                )}
              </p>

              <RsvpButtons
                yesUrl={yesWaUrl}
                noUrl={noWaUrl}
                yesLabel={t.yesIllBeThere}
                noLabel={t.cantMakeIt}
              />
            </div>
          </section>
        )}

        {/* 10. FOOTER */}
        <section
          className="dark"
          style={{
            background:
              "radial-gradient(circle at 50% 100%, #232a63, var(--navy) 60%)",
          }}
        >
          <footer className="wrap">
            <div className="script rv">{t.seeYouAtParty}</div>
            <div className="orn rv d1" style={{ marginTop: "20px" }}>
              <i />✦<i />
            </div>
            <p className="rv d2" style={{ opacity: 0.8 }}>
              {t.questionsReachOut}{" "}
              <span style={{ color: "#fff" }}>{hostName}</span> ·{" "}
              <span>{data.contactPhone || "+91 75210 38818"}</span>
            </p>

            <div
              className="rv d3"
              style={{
                marginTop: "28px",
                color: "var(--gold)",
                letterSpacing: ".25em",
                fontSize: "14px",
                textTransform: "uppercase",
              }}
            >
              ✦{" "}
              {process.env.NEXT_PUBLIC_PLATFORM_NAME ? (
                <Link href="/" className="hover:underline">
                  Made with {platformName}
                </Link>
              ) : (
                <span>Made with love</span>
              )}
            </div>
          </footer>
        </section>
      </main>

      {/* Floating Share Button */}
      <ShareButton
        title={`${personName}'s Birthday Celebration 🎉`}
        slug={slug}
        copiedText={t.linkCopied || "Link copied!"}
      />
    </div>
  );
}
