/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { CardData, Lang } from "@/types/card";
import { getI18n } from "@/lib/i18n";
import {
  dateShort as formatDateShort,
  dateLong as formatDateLong,
  googleCalendarUrl,
  googleMapsDirectionsUrl,
  formatTime12h,
} from "@/lib/format";
import { GRIHA_PRAVESH_CSS } from "./griha-pravesh.styles";
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

export interface GrihaPraveshProps {
  data: CardData;
  previewMode?: boolean;
  showPlaceholders?: boolean;
  slug?: string;
}

const PETAL_COLORS = ["#f59f1b", "#ffc933", "#e8590c", "#f3e2a9", "#ffe08a"];

const PLACEHOLDER_TILES = [
  { emoji: "🏡", bg: "#2f7a52" },
  { emoji: "🪔", bg: "#8a5a2a" },
  { emoji: "🌼", bg: "#b8741a" },
  { emoji: "🛋️", bg: "#3a5a7a" },
  { emoji: "🕉️", bg: "#5a3a2a" },
  { emoji: "🪴", bg: "#2a6a5a" },
  { emoji: "🔑", bg: "#7a3a3a" },
  { emoji: "🍃", bg: "#4a6a2a" },
];

export default function GrihaPravesh({
  data,
  previewMode = false,
  showPlaceholders = false,
  slug,
}: GrihaPraveshProps) {
  const [lang, setLang] = useState<Lang>(data.lang || "en");
  const t = getI18n(lang);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data.lang) setLang(data.lang);
  }, [data.lang]);

  // Dynamic function name
  const functionName = data.functionName?.trim() || "Griha Pravesh";
  const functionNameHi =
    data.functionName === "Griha Pravesh" || !data.functionName
      ? "गृह प्रवेश"
      : data.functionName === "Satyanarayan Katha"
      ? "सत्यनारायण कथा"
      : data.functionName === "Mundan"
      ? "मुंडन संस्कार"
      : data.functionName === "Housewarming"
      ? "गृह प्रवेश"
      : data.functionName;

  // Derived properties from CardData
  const family = data.familyName || data.hostName || "";
  const host = data.hostName || data.contactName || "";
  const cleanPhone = (data.contactPhone || "").replace(/[^\d]/g, "");
  const waPhone =
    cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const dateShortStr = formatDateShort(data.mainDate) || "";
  const dateLongStr = formatDateLong(data.mainDate, lang) || "";
  const muhurat = data.muhurat || data.timeText || "";

  const venueDisplayName = data.venueAddress
    ? `${data.venueName ? data.venueName + ", " : ""}${data.venueAddress}`
    : data.venueName || "";
  const dress = data.dressCode || "";
  const rsvpBy = data.rsvpBy || "";

  const directionsUrl =
    googleMapsDirectionsUrl(data) ||
    (venueDisplayName ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueDisplayName)}` : "");
  const calendarUrl =
    googleCalendarUrl(data) ||
    (venueDisplayName ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${functionName} – ${family || "Ceremony"}`
    )}&location=${encodeURIComponent(venueDisplayName)}` : "");

  const yesWaUrl = waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
    lang === "hi"
      ? `नमस्ते! हम ${family ? family + " के " : ""}${functionNameHi} में सपरिवार अवश्य शामिल होंगे 🙏`
      : `Namaste! We will be attending the ${functionName}${family ? " of " + family : ""} 🙏`
  )}` : "#";

  const noWaUrl = waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
    lang === "hi"
      ? `नमस्ते! क्षमा करें, हम ${family ? family + " के " : ""}${functionNameHi} में शामिल नहीं हो पाएंगे, लेकिन हमारी हार्दिक शुभकामनाएं और आशीर्वाद आपके साथ हैं 🙏`
      : `Namaste! Sorry, we will not be able to attend the ${functionName}, but our blessings are with you 🙏`
  )}` : "#";

  const invitationMessage =
    data.message ||
    (lang === "hi"
      ? `भगवान श्री गणेश की असीम अनुकंपा और पूज्य बुजुर्गों के आशीर्वाद से, हम अपने नए घर के ${functionNameHi} के पावन अवसर पर आपको सपरिवार सादर आमंत्रित करते हैं — आपकी गरिमामयी उपस्थिति हमारे इस नए आशियाने को और भी मंगलमय बनाएगी।`
      : `With the grace of Lord Ganesha and the blessings of our elders, we joyfully invite you and your family to the ${functionName} of our new home — to bless it with your presence.`);

  const thenCaption =
    data.thenCaption ||
    (lang === "hi" ? t.whereMemoriesBegan : "Where our memories began");
  const nowCaption =
    data.nowCaption ||
    (lang === "hi" ? t.whereNewOnesMade : "Where new ones will be made");

  // Shared Hooks
  const scrollProgress = useScrollProgress();
  const countdown = useCountdown(data.mainDate);

  const { particles, trigger: triggerPetals } = useParticles({
    count: 30,
    colors: PETAL_COLORS,
    type: "petal",
  });

  const {
    isLit,
    isOpen,
    isGone,
    isReady,
    tapText: poojaText,
    handleOpenCard,
  } = useIntroDoor({
    previewMode,
    initialTapText: t.tapToBeginPooja,
    litTapText: lang === "hi" ? "शुभ आरम्भ" : "Shubh Aarambh",
    onReady: () => triggerPetals(30),
  });

  useEffect(() => {
    if (previewMode) {
      triggerPetals(25);
    }
  }, [previewMode, triggerPetals]);

  useReveal({ containerRef, isReady, previewMode });

  // Pooja schedule from CardData (clean empty if not present)
  const scheduleItems = useMemo(() => {
    if (data.schedule && data.schedule.length > 0) {
      return data.schedule.map((item) => ({
        ...item,
        time: item.time ? formatTime12h(item.time) : "Shubh Muhurat",
      }));
    }
    return [];
  }, [data.schedule]);

  const hasSchedule = scheduleItems.length > 0;
  const platformName = process.env.NEXT_PUBLIC_PLATFORM_NAME || "निमंत्रण Utsav";

  return (
    <div
      ref={containerRef}
      className={`griha-pravesh ${isReady ? "ready" : ""}`}
    >
      {/* Scoped CSS Injection */}
      <style dangerouslySetInnerHTML={{ __html: GRIHA_PRAVESH_CSS }} />

      {/* Top Fixed Scroll Progress Bar */}
      <ScrollBar progress={scrollProgress} />

      {/* Ambient Music & Guest Language Toggle */}
      <MusicPlayer musicUrl={data.musicUrl} theme="ghar" />
      <GuestLanguageToggle currentLang={lang} onToggle={setLang} theme="ghar" />

      {/* Falling Flower Petal Pieces */}
      <Particles items={particles} className="bit" />

      {/* INTRO SCREEN: DOORS + KALASH */}
      <IntroDoor
        isLit={isLit}
        isOpen={isOpen}
        isGone={isGone}
        previewMode={previewMode}
        onOpenCard={handleOpenCard}
        overlayClassName="intro-overlay"
      >
        <div className="sl dev a1">॥ श्री गणेशाय नमः ॥</div>

        <div className="kal a2">
          <svg viewBox="0 0 80 120" width="130" aria-hidden="true">
            <defs>
              <linearGradient id="kg" x1="0" x2="1">
                <stop offset="0" stopColor="#a8782a" />
                <stop offset="0.45" stopColor="#f3e2a9" />
                <stop offset="1" stopColor="#a8782a" />
              </linearGradient>
            </defs>
            <g className="lv">
              <path
                d="M40 38 C20 32 8 16 14 6 C28 12 38 24 40 38Z"
                fill="#2f8f4e"
              />
              <path
                d="M40 38 C60 32 72 16 66 6 C52 12 42 24 40 38Z"
                fill="#2f8f4e"
              />
              <path
                d="M40 38 C32 22 37 10 40 0 C43 10 48 22 40 38Z"
                fill="#3fae63"
              />
            </g>
            <ellipse cx="40" cy="38" rx="12" ry="14" fill="#8a5a2a" />
            <path
              d="M33 30 q7 -5 14 0 M31 38 q9 -5 18 0"
              stroke="#5a3a18"
              strokeWidth="1.2"
              fill="none"
            />
            <rect x="28" y="50" width="24" height="7" rx="2" fill="url(#kg)" />
            <path
              d="M24 57 H56 C72 70 72 98 53 110 H27 C8 98 8 70 24 57Z"
              fill="url(#kg)"
            />
            <path
              d="M13 76 Q40 84 67 76"
              stroke="#c0392b"
              strokeWidth="6"
              fill="none"
            />
            <text
              x="40"
              y="100"
              textAnchor="middle"
              fontSize="18"
              fill="#7a2a10"
              fontFamily="serif"
            >
              ॐ
            </text>
          </svg>
        </div>

        <div className="inv a3">
          {lang === "hi" ? `${functionNameHi} –` : `${functionName} of`}
        </div>
        <div className="nm a4">{family}</div>
        <div className="dt a5">{dateShortStr}</div>
        <div className="tp a6" id="tp">
          {poojaText}
          <i />
        </div>
      </IntroDoor>

      {/* MAIN CONTENT */}
      <main>
        {/* 1. HERO SECTION */}
        <section id="hero" className="dark hero-section">
          <div className="wrap">
            <div
              className="dev rv"
              style={{
                color: "var(--gold2)",
                letterSpacing: ".2em",
                marginBottom: "40px",
              }}
            >
              ॥ श्री गणेशाय नमः ॥
            </div>
            <div className="eyebrow rv d1">
              {lang === "hi"
                ? "ईश्वर की असीम अनुकंपा से"
                : "With the blessings of the Almighty"}
            </div>
            <div className="big script rv d1">{functionName}</div>
            <div className="hi dev rv d2">{functionNameHi}</div>
            <div className="orn rv d2" style={{ marginTop: "22px" }}>
              <i />✦<i />
            </div>
            {dateLongStr && <div className="hero-date rv d3">{dateLongStr}</div>}
            {venueDisplayName && <div className="hero-loc rv d3">📍 {venueDisplayName}</div>}
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
            {family && (
              <p
                className="rv d2"
                style={{
                  letterSpacing: ".3em",
                  opacity: 0.7,
                  textTransform: "uppercase",
                  fontSize: "14px",
                }}
              >
                {t.withLove} <span>{family}</span>
              </p>
            )}
          </div>
        </section>

        {/* 3. A NEW BEGINNING (OLD HOME -> NEW HOME) */}
        <section className="saf">
          <div className="wrap">
            <SectionHeading
              eyebrow={t.aNewBeginning}
              ornament={false}
              titlePrefix={t.fromOldHomeToNew}
              highlight={t.ourNewHomeTitle}
            />

            <PhotoPair previewMode={previewMode}>
              {/* Old Home (Purana Ghar) */}
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
                  {!data.photo1 && <span>🏠</span>}
                </div>
                <span className="pill">{t.puranaGhar}</span>
                <span className="script">{t.oldHome}</span>
                <em>{thenCaption}</em>
              </div>

              {/* Colliding Golden Key Icon */}
              <div className="mid rv z d2">🔑</div>

              {/* New Home (Naya Ghar) */}
              <div className="person rv r">
                <div
                  className="photo"
                  id="p2"
                  style={
                    data.photo2
                      ? { backgroundImage: `url(${data.photo2})` }
                      : { backgroundColor: "#2f7a52" }
                  }
                >
                  {!data.photo2 && <span>🏡</span>}
                </div>
                <span className="pill">{t.nayaGhar}</span>
                <span className="script">{t.newHome}</span>
                <em>{nowCaption}</em>
              </div>
            </PhotoPair>
          </div>
        </section>

        {/* 4. CEREMONY ESSENTIALS */}
        <section className="ivory">
          <div className="wrap">
            <SectionHeading
              eyebrow={t.theDetails}
              ornament={false}
              titlePrefix="Ceremony"
              highlight="Essentials"
              subtitle="Everything you need to know, at a glance."
            />

            <div className="cards">
              {dateLongStr && (
                <div className="card rv z">
                  <div className="ic">📅</div>
                  <h3>{t.date}</h3>
                  <p>{dateLongStr}</p>
                </div>
              )}

              {muhurat && (
                <div className="card rv z d1">
                  <div className="ic">🪔</div>
                  <h3>{t.shubhMuhurat}</h3>
                  <p>{muhurat}</p>
                </div>
              )}

              {dress && (
                <div className="card rv z d2">
                  <div className="ic">👘</div>
                  <h3>{t.attire}</h3>
                  <p>{dress}</p>
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
                  ? "The ceremony has begun 🙏"
                  : "Every moment brings us closer to the auspicious day."
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
                  ? "The ceremony has begun 🙏"
                  : `${dateLongStr} · ${muhurat}`
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

        {/* 6. POOJA SCHEDULE */}
        {hasSchedule && (
          <section className="ivory">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.theCeremony}
                ornament={false}
                titlePrefix="Pooja"
                highlight="Schedule"
                subtitle={t.sacredRitualsSub}
              />

              <Timeline items={scheduleItems} />
            </div>
          </section>
        )}

        {/* 7. GALLERY SECTION (OUR NEW HOME) */}
        {(data.gallery?.length || showPlaceholders) && (
          <section className="dark">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.glimpses}
                ornament={false}
                titlePrefix="Our New"
                highlight="Home"
                subtitle={t.peekAtPlace}
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
        {venueDisplayName && (
          <section className="saf">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.theVenue}
                ornament={false}
                titlePrefix="Find Your"
                highlight="Way"
              />

              <VenueSection
                venueTitle="Our New Home"
                venueAddress={venueDisplayName}
                badgeTagline={functionName.toUpperCase()}
                dateText={dateLongStr}
                timeText={muhurat}
                directionsUrl={directionsUrl}
                calendarUrl={calendarUrl}
                directionsLabel={t.getDirections}
                calendarLabel={t.addToCalendar}
                mapPlaceholderText={venueDisplayName}
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
                    {t.kindlyConfirmBy} <b>{rsvpBy}</b> {t.soWeCanArrangeCare}
                  </>
                ) : (
                  t.rsvpPrompt
                )}
              </p>

              <RsvpButtons
                yesUrl={yesWaUrl}
                noUrl={noWaUrl}
                yesLabel={t.wellBeThere}
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
              "radial-gradient(circle at 50% 100%, #1f4d36, var(--dg) 60%)",
          }}
        >
          <footer className="wrap">
            <div className="script rv">{t.awaitingBlessings}</div>
            <div className="orn rv d1" style={{ marginTop: "20px" }}>
              <i />✦<i />
            </div>
            <p className="rv d2" style={{ opacity: 0.8 }}>
              {t.forQueriesContact}{" "}
              <span style={{ color: "#fff" }}>{host}</span> ·{" "}
              <span>{data.contactPhone || "+91 75210 38818"}</span>
            </p>

            <div
              className="dev rv d3"
              style={{
                marginTop: "28px",
                color: "var(--gold)",
                letterSpacing: ".2em",
                fontSize: "18px",
              }}
            >
              ॥ शुभम् भवतु ॥
            </div>

            <div
              className="rv d3"
              style={{
                marginTop: "24px",
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
        title={`${functionName} – ${family}`}
        slug={slug}
        copiedText={t.linkCopied || "Link copied!"}
      />
    </div>
  );
}
