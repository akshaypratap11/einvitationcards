/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CardData, Lang } from "@/types/card";
import { getI18n } from "@/lib/i18n";
import {
  formatDisplayDate,
  formatDisplayTime,
  formatIntroDate,
  buildGoogleCalendarUrl,
} from "@/lib/utils";
import { WEDDING_ROYAL_CSS } from "./wedding-royal.styles";
import RsvpSection from "./RsvpSection";
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
  PhotoPair,
  SectionHeading,
} from "./shared";

interface WeddingRoyalProps {
  data: CardData;
  previewMode?: boolean;
  slug?: string;
}

const PETAL_COLORS = ["#e8668f", "#f4a6bd", "#e0b878", "#f1d6a0", "#d0527f"];

const EVENT_GRADIENTS = [
  "linear-gradient(135deg, #d9a7c0, #7a2140)",
  "linear-gradient(135deg, #f7d046, #e8a317)",
  "linear-gradient(135deg, #6a2a7a, #2b0d3a)",
  "linear-gradient(135deg, #3a1a2a, #8a3a5a)",
  "linear-gradient(135deg, #5a6a4a, #2a3a2a)",
  "linear-gradient(135deg, #99324b, #541122)",
];

export default function WeddingRoyal({
  data,
  previewMode = false,
  slug,
}: WeddingRoyalProps) {
  const [lang, setLang] = useState<Lang>(data.lang || "en");
  const t = getI18n(lang);
  const rootRef = useRef<HTMLDivElement>(null);

  // Sync lang if data changes
  useEffect(() => {
    if (data.lang) setLang(data.lang);
  }, [data.lang]);

  // Derived values
  const groomName = data.groomName || "Groom";
  const brideName = data.brideName || "Bride";
  const mainTitle = `${groomName} & ${brideName}`;
  const weddingHashtag =
    data.hashtag ||
    `#${groomName.replace(/\s+/g, "")}Weds${brideName.replace(/\s+/g, "")}`;
  const formattedMainDate = formatDisplayDate(data.mainDate, data.lang);
  const introFormattedDate = formatIntroDate(data.mainDate);
  const calendarUrl = buildGoogleCalendarUrl(
    `${groomName} Weds ${brideName}`,
    data.mainDate,
    `${data.venueName}, ${data.venueAddress}`
  );
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    data.mapQuery || `${data.venueName} ${data.venueAddress}`
  )}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    data.mapQuery || `${data.venueName}, ${data.venueAddress}`
  )}&output=embed`;

  // Clean phone for whatsapp
  const cleanPhone = (data.contactPhone || "")
    .replace(/[^\d+]/g, "")
    .replace(/^\+/, "");

  // Shared Hooks
  const scrollProgress = useScrollProgress();
  const countdown = useCountdown(data.mainDate);

  const { particles, trigger: triggerPetals } = useParticles({
    count: 26,
    colors: PETAL_COLORS,
    type: "petal",
  });

  const {
    isLit,
    isOpen,
    isGone,
    isReady,
    tapText,
    handleOpenCard,
  } = useIntroDoor({
    previewMode,
    initialTapText: t.tapToLightDiya,
    litTapText: t.shubhAarambh,
    onReady: () => triggerPetals(26),
  });

  useEffect(() => {
    if (previewMode) {
      triggerPetals(20);
    }
  }, [previewMode, triggerPetals]);

  useReveal({ containerRef: rootRef, isReady, previewMode });



  return (
    <div ref={rootRef} className="wedding-royal-wrapper">
      {/* SCOPED COMPONENT STYLES LOADED DIRECTLY INTO DOM */}
      <style dangerouslySetInnerHTML={{ __html: WEDDING_ROYAL_CSS }} />

      {/* Scroll Progress Bar */}
      <ScrollBar id="bar" progress={scrollProgress} />

      {/* ROYAL DOORS INTRO OVERLAY */}
      <IntroDoor
        isLit={isLit}
        isOpen={isOpen}
        isGone={isGone}
        previewMode={previewMode}
        onOpenCard={handleOpenCard}
        ariaLabel="Open wedding invitation"
      >
        <div className="sl a1">{t.auspiciousShloka}</div>

        {/* Traditional Golden Diya with Glowing Animated Flame */}
        <div className="diya a2">
          <svg viewBox="0 0 140 110" width="170" aria-hidden="true">
            <defs>
              <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f3e2a9" />
                <stop offset="1" stopColor="#a8782a" />
              </linearGradient>
              <radialGradient id="gf" cx="50%" cy="75%" r="65%">
                <stop offset="0" stopColor="#fff6c8" />
                <stop offset=".5" stopColor="#ffb347" />
                <stop offset="1" stopColor="#e8591a" />
              </radialGradient>
            </defs>
            <path
              className="flame"
              d="M70 62 C52 44 62 24 70 6 C78 24 88 44 70 62Z"
              fill="url(#gf)"
            />
            <path
              d="M18 62 H122 C122 92 98 104 70 104 C42 104 18 92 18 62Z"
              fill="url(#gd)"
            />
            <ellipse cx="70" cy="62" rx="52" ry="7" fill="#7a5418" />
            <rect x="68" y="55" width="4" height="9" rx="2" fill="#3a1a10" />
            <path
              d="M42 80 Q70 93 98 80"
              stroke="#7a5418"
              strokeWidth="1.5"
              fill="none"
              opacity=".6"
            />
          </svg>
        </div>

        <div className="inv a3">{t.theWeddingOf}</div>
        <div className="nm a4">{mainTitle}</div>
        <div className="dt a5">{introFormattedDate}</div>
        <div className="tp a6" id="tp">
          {tapText}
          <i />
        </div>
      </IntroDoor>

      {/* Falling Flower Petals Animation */}
      <Particles items={particles} className="petal" />

      {/* Floating Guest Language Toggle */}
      <GuestLanguageToggle currentLang={lang} onToggle={setLang} theme="wedding" />

      {/* Floating Background Music Player */}
      <MusicPlayer musicUrl={data.musicUrl} theme="wedding" />

      {/* Floating Share Button */}
      <ShareButton
        title={`${groomName} Weds ${brideName}`}
        text={`You are cordially invited to celebrate the wedding of ${groomName} & ${brideName}!`}
        slug={slug}
        copiedText={t.linkCopied || "Invitation link copied to clipboard!"}
        showToast={false}
      />

      {/* MAIN INVITATION CONTENT */}
      <main>
        {/* 1. HERO SECTION */}
        <section id="hero" className="dark">
          <div className="wrap">
            <div
              style={{
                color: "var(--gold2)",
                letterSpacing: ".2em",
                marginBottom: "60px",
              }}
              className="rv"
            >
              {t.auspiciousShloka}
            </div>

            <div className="eyebrow rv d1" style={{ color: "var(--gold2)" }}>
              {t.theWeddingOf}
            </div>

            <div className="names script rv d2">
              {groomName} <small>{t.weds}</small> {brideName}
            </div>

            <div className="orn rv d2" style={{ marginTop: "20px" }}>
              <i />✦<i />
            </div>

            {formattedMainDate && (
              <div className="hero-date serif rv d3">{formattedMainDate}</div>
            )}

            {(data.venueName || data.venueAddress) && (
              <div className="hero-loc rv d3">
                📍 {data.venueName}
                {data.venueAddress ? `, ${data.venueAddress}` : ""}
              </div>
            )}

            <div className="hero-tag rv d3">
              {countdown.isPassed
                ? t.celebrationsBegun
                : data.message || "The celebrations have begun!"}
            </div>

            {weddingHashtag && (
              <div className="hash script rv d3">{weddingHashtag}</div>
            )}
          </div>
          <div className="scroll">{t.scrollToUnfold}</div>
        </section>

        {/* 2. INVITATION SECTION */}
        <section className="cream invite">
          <div className="wrap">
            <div style={{ color: "#a47a2a", letterSpacing: ".2em" }} className="rv">
              {t.auspiciousShloka}
            </div>
            <div className="orn rv">
              <i />✦<i />
            </div>
            <div className="eyebrow rv">{t.theInvitation}</div>

            <p className="big rv d1">
              {data.message || t.defaultInviteMessage}
            </p>

            <div className="together rv d2">{t.togetherWithFamilies}</div>

            <div className="pair script rv z d2">
              {groomName} <b>&amp;</b> {brideName}
            </div>

            <p className="rv d3" style={{ letterSpacing: ".25em", opacity: 0.75 }}>
              {t.requestHonour}
            </p>
          </div>
        </section>

        {/* 3. THE COUPLE SECTION */}
        <section className="blush">
          <div className="wrap">
            <SectionHeading
              eyebrow={t.theCouple}
              ornament={true}
              titlePrefix="Meet the"
              highlight="Happy Couple"
            />

            <PhotoPair previewMode={previewMode} delayMs={1500} threshold={0.4}>
              {/* Groom Card */}
              <div className="person rv l">
                {data.groomPhoto ? (
                  <img
                    className="photo"
                    src={data.groomPhoto}
                    alt={`${groomName}, the groom`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="photo photo-placeholder groom-bg">
                    <span className="script initial-letter">
                      {groomName.charAt(0) || "G"}
                    </span>
                  </div>
                )}

                <span className="pill">{t.theGroom}</span>
                <div className="script">{groomName}</div>
                <h3>{groomName.toUpperCase()}</h3>

                {data.groomParents && (
                  <em>
                    {t.sonOf} {data.groomParents}
                  </em>
                )}

                {data.groomInsta && (
                  <a
                    href={`https://instagram.com/${data.groomInsta.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{data.groomInsta.replace("@", "")}
                  </a>
                )}
              </div>

              {/* Beating Heart Collision Center */}
              <div className="heart rv z d2">♥</div>

              {/* Bride Card */}
              <div className="person rv r">
                {data.bridePhoto ? (
                  <img
                    className="photo"
                    src={data.bridePhoto}
                    alt={`${brideName}, the bride`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="photo photo-placeholder bride-bg">
                    <span className="script initial-letter">
                      {brideName.charAt(0) || "B"}
                    </span>
                  </div>
                )}

                <span className="pill">{t.theBride}</span>
                <div className="script">{brideName}</div>
                <h3>{brideName.toUpperCase()}</h3>

                {data.brideParents && (
                  <em>
                    {t.daughterOf} {data.brideParents}
                  </em>
                )}

                {data.brideInsta && (
                  <a
                    href={`https://instagram.com/${data.brideInsta.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{data.brideInsta.replace("@", "")}
                  </a>
                )}
              </div>
            </PhotoPair>
          </div>
        </section>

        {/* 4. ITINERARY SECTION (Only rendered if events exist) */}
        {data.events && data.events.length > 0 && (
          <section className="cream">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.theCelebrations}
                ornament={false}
                titlePrefix="Wedding"
                highlight="Itinerary"
                subtitle={t.itinerarySubtitle(data.events.length)}
              />

              <div className="events">
                {data.events.map((ev, index) => {
                  const numStr = String(index + 1).padStart(2, "0");
                  const isLeft = index % 2 === 0;
                  const bgGradient =
                    EVENT_GRADIENTS[index % EVENT_GRADIENTS.length];
                  const formattedEvDate = formatDisplayDate(ev.date, data.lang);
                  const formattedEvTime = formatDisplayTime(ev.time);

                  return (
                    <div
                      key={ev.id || index}
                      className={`ev rv ${isLeft ? "l" : "r"}`}
                    >
                      <div className="img" style={{ background: bgGradient }}>
                        {ev.photo ? (
                          <img src={ev.photo} alt={ev.title} />
                        ) : (
                          <div className="event-placeholder-icon">🪔</div>
                        )}
                        <span className="no">{numStr}</span>
                      </div>

                      <div className="txt">
                        <h3>{ev.title}</h3>
                        {ev.tagline && <div className="tl">{ev.tagline}</div>}
                        <ul>
                          {formattedEvDate && (
                            <li>
                              <span>📅</span>
                              {formattedEvDate}
                            </li>
                          )}
                          {formattedEvTime && (
                            <li>
                              <span>🕚</span>
                              {formattedEvTime} {t.onwards}
                            </li>
                          )}
                          {ev.venue && (
                            <li>
                              <span>📍</span>
                              {ev.venue}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 5. COUNTDOWN SECTION */}
        <section className="blush">
          <div className="wrap">
            <SectionHeading
              eyebrow={t.saveTheDate}
              ornament={true}
              titlePrefix="Counting"
              highlight="Down"
              subtitle={t.countdownSubtitle}
            />

            <Countdown
              countdown={countdown}
              labels={{
                days: t.days,
                hours: t.hours,
                minutes: t.minutes,
                seconds: t.seconds,
              }}
              ids={{
                days: "cd",
                hours: "ch",
                minutes: "cm",
                seconds: "cs",
              }}
              whenText={
                countdown.isPassed
                  ? t.celebrationsBegun
                  : `${formattedMainDate} · ${t.onwards}`
              }
              whenClassName="when rv d3"
              whenId="cdmsg"
            />
          </div>
        </section>

        {/* 6. GALLERY SECTION (Only rendered if gallery has images) */}
        {data.gallery && data.gallery.length > 0 && (
          <section className="dark">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.cherishedMoments}
                eyebrowStyle={{ color: "var(--gold2)" }}
                ornament={true}
                titlePrefix="Our"
                highlight="Gallery"
                subtitle={t.gallerySubtitle}
              />

              <Gallery
                images={data.gallery}
                renderMode="img"
                gradients={EVENT_GRADIENTS}
                altPrefix="Gallery moment"
              />
            </div>
          </section>
        )}

        {/* 7. VENUE SECTION */}
        {(data.venueName || data.venueAddress) && (
          <section className="cream">
            <div className="wrap">
              <SectionHeading
                eyebrow={t.theVenue}
                ornament={true}
                titlePrefix="Find Your"
                highlight="Way"
              />

              <VenueSection
                venueTitle={data.venueName}
                venueAddress={data.venueAddress}
                badgeTagline={t.saveTheDate.toUpperCase()}
                dateText={formattedMainDate}
                timeText={t.onwards}
                directionsUrl={directionsUrl}
                calendarUrl={calendarUrl}
                directionsLabel={t.getDirections}
                calendarLabel={t.addToCalendar}
                mapEmbedUrl={mapEmbedUrl}
                dateClassName="serif"
              />
            </div>
          </section>
        )}

        {/* RSVP SECTION (if rsvpEnabled) */}
        {data.rsvpEnabled && (
          <section className="rsvp-section-wrap" style={{ padding: "0 20px" }}>
            <div className="wrap">
              <RsvpSection
                slug={slug}
                lang={lang}
                theme="wedding"
                contactPhone={data.contactPhone}
                contactName={data.contactName}
              />
            </div>
          </section>
        )}

        {/* 8. CONTACT SECTION (Only rendered if contact details exist) */}
        {(data.contactPhone || data.contactEmail) && (
          <section className="contact">
            <div className="wrap">
              <div className="eyebrow rv" style={{ color: "var(--gold2)" }}>
                {t.getInTouch}
              </div>
              <h2 className="rv d1" style={{ color: "var(--cream)" }}>
                {t.contactTheFamily}
              </h2>

              <div className="rv d2" style={{ marginTop: "26px" }}>
                {data.contactPhone && (
                  <>
                    <a
                      className="btn"
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.whatsApp}{" "}
                      {data.contactName ? data.contactName.split(" ")[0] : ""}
                    </a>
                    <a className="btn" href={`tel:${data.contactPhone}`}>
                      {data.contactPhone}
                    </a>
                  </>
                )}
                {data.contactEmail && (
                  <a className="btn" href={`mailto:${data.contactEmail}`}>
                    {t.email}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 9. FOOTER SECTION */}
        <section
          className="dark"
          style={{
            background:
              "radial-gradient(circle at 50% 100%, #4a2a22, var(--wine) 60%)",
          }}
        >
          <footer className="wrap">
            <div className="script rv">{t.awaitingYourPresence}</div>
            <div className="orn rv d1" style={{ marginTop: "20px" }}>
              <i />✦<i />
            </div>

            {weddingHashtag && (
              <div className="hash2 gold-text rv d1">{weddingHashtag}</div>
            )}

            {(data.contactName || data.contactPhone) && (
              <p className="rv d2" style={{ opacity: 0.8 }}>
                {t.contactTheFamily}:<br />
                {data.contactName && (
                  <span style={{ color: "#fff", fontWeight: 600 }}>
                    {data.contactName}
                  </span>
                )}
                {data.contactName && data.contactPhone && " · "}
                {data.contactPhone && <span>{data.contactPhone}</span>}
              </p>
            )}

            <div
              className="rv d3"
              style={{ marginTop: "30px", color: "var(--rose)" }}
            >
              ♥{" "}
              <span style={{ color: "var(--gold)", opacity: 0.8 }}>
                {t.craftedWithLove}
              </span>
            </div>

            {/* Platform branding attribution link */}
            <div className="rv d3" style={{ marginTop: "20px" }}>
              <Link
                href="/"
                className="inline-block text-xs uppercase tracking-widest text-festive-gold/70 hover:text-festive-goldLight transition-colors"
              >
                ✦ {t.madeWith}
              </Link>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
