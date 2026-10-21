import Link from "next/link";
import { getPublishedCards } from "@/lib/cards-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EventCardItem {
  id: string;
  type: "wedding" | "birthday" | "ghar";
  title: string;
  hindiTitle: string;
  badge: string;
  tagline: string;
  description: string;
  highlights: string[];
  gradient: string;
  accentColor: string;
  demoUrl: string;
  applyUrl: string;
  iconSvg: React.ReactNode;
}

const eventCards: EventCardItem[] = [
  {
    id: "wedding",
    type: "wedding",
    title: "Wedding Invitation",
    hindiTitle: "विवाह उत्सव",
    badge: "Royal Grandeur",
    tagline: "Grand Royal Indian Wedding Cards",
    demoUrl: "/demo/wedding",
    applyUrl: "/apply?type=wedding",
    description:
      "Regal maroon & gold door-opening animations with background Shehnai music, couple photo portraits, ceremony itinerary, and instant RSVP.",
    highlights: [
      "Royal carved palace door opening animation",
      "Multi-day functions (Mehendi, Sangeet, Shaadi)",
      "Interactive venue Google Map & RSVP tracker",
    ],
    gradient: "from-[#3b0d1e] via-[#5a1731] to-[#240612]",
    accentColor: "text-festive-goldLight",
    iconSvg: (
      <svg
        className="w-8 h-8 text-festive-gold"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 9l-6 6m0-6l6 6"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v2m0 8v2M6 12h2m8 0h2"
        />
      </svg>
    ),
  },
  {
    id: "birthday",
    type: "birthday",
    title: "Birthday Celebration",
    hindiTitle: "जन्मदिन उत्सव",
    badge: "Vibrant & Joyous",
    tagline: "Exciting Animated Birthday Invites",
    demoUrl: "/demo/birthday",
    applyUrl: "/apply?type=birthday",
    description:
      "Vibrant festive confetti, childhood-to-now photo gallery, interactive countdown clock, party theme dress codes, and warm guest wishes.",
    highlights: [
      "Animated confetti & gift box reveal",
      "Childhood to present photo memory reel",
      "Live countdown timer & dress code guide",
    ],
    gradient: "from-[#4a1226] via-[#631837] to-[#290815]",
    accentColor: "text-amber-200",
    iconSvg: (
      <svg
        className="w-8 h-8 text-festive-gold"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v13m0-13V6a2 2 0 114 0v2m-4 0V6a2 2 0 10-4 0v2m-5 4h18M5 12a2 2 0 00-2 2v5a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-2-2H5z"
        />
      </svg>
    ),
  },
  {
    id: "ghar",
    type: "ghar",
    title: "Griha Pravesh / Ghar Function",
    hindiTitle: "गृह प्रवेश एवं वास्तु पूजा",
    badge: "Sacred & Auspicious",
    tagline: "Traditional Housewarming & Hawan",
    demoUrl: "/demo/ghar",
    applyUrl: "/apply?type=ghar",
    description:
      "Sacred Kalash and Toran motifs with Vedic Shloka chants, Hawan muhurat, sweet blessings, and clear Google Maps directions to your new home.",
    highlights: [
      "Sacred Kalash & traditional Diya light-up",
      "Vedic Shloka invocation & Hawan muhurat",
      "One-tap navigation for visiting relatives",
    ],
    gradient: "from-[#350d1b] via-[#52152d] to-[#1e050f]",
    accentColor: "text-amber-100",
    iconSvg: (
      <svg
        className="w-8 h-8 text-festive-gold"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "How do I apply for an Indian digital wedding invitation card for WhatsApp?",
    a: "Applying takes less than 2 minutes on निमंत्रण Utsav. Tap 'Apply for this card', fill in the bride and groom's names, ceremony dates, city, and venue. After submitting, tap the prefilled WhatsApp button to send your photos directly to our design team with your Request ID.",
  },
  {
    q: "Can I create Griha Pravesh and Hawan Puja invitations in Hindi (हिन्दी)?",
    a: "Yes! Our Griha Pravesh template is crafted specifically for auspicious Hindu ceremonies. It features sacred Kalash and Diya lighting animations, Vedic Shloka invocations (॥ श्री गणेशाय नमः ॥), auspicious Muhurat timings, and full Hindi language support.",
  },
  {
    q: "How does the online guest RSVP tracking work?",
    a: "When guests open your invitation card, they can confirm attendance (Attending or Regretfully Decline) and specify the number of guests. As the host, you receive organized attendance lists and counts.",
  },
  {
    q: "Can I add background Shehnai or celebration music to my e-card?",
    a: "Yes! You can choose from bundled royalty-free Shehnai flute, traditional Indian wedding melodies, or upbeat birthday celebration tunes. To respect modern mobile browsers, music smoothly begins upon the guest's first tap with a floating mute/unmute control.",
  },
  {
    q: "How do guests find directions to the venue on Google Maps?",
    a: "Every digital card includes an embedded Google Map, a 1-tap 'Get Directions' button that launches directly in Google Maps or Apple Maps with GPS navigation, and an 'Add to Calendar' button that saves the date to Google Calendar or Outlook.",
  },
  {
    q: "Are the digital invitations mobile friendly on iPhone and Android?",
    a: "Yes, 100%. Every invitation is crafted with a mobile-first responsive layout, lightweight animations, and client-side photo optimization (WebP) so it opens in milliseconds on 4G and 5G smartphones.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default async function Home() {
  const recentCards = await getPublishedCards(6);

  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream font-sans relative overflow-x-hidden">
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Decorative Golden Ambient Glows */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-festive-gold/10 blur-[140px] pointer-events-none rounded-full"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-festive-maroon/25 blur-[160px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-festive-wine/85 border-b border-festive-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Traditional Diya / Kalash Icon */}
            <div className="w-11 h-11 rounded-full bg-festive-maroon border border-festive-gold/60 flex items-center justify-center shadow-gold-glow group-hover:border-festive-gold transition-colors">
              <span className="text-xl">🪔</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-wide text-festive-goldLight">
                  निमंत्रण
                </span>
                <span className="text-xs uppercase tracking-widest text-festive-gold/80 px-2 py-0.5 rounded bg-festive-maroon/70 border border-festive-gold/30">
                  Utsav
                </span>
              </div>
              <p className="text-[11px] text-festive-cream/70 tracking-wider uppercase">
                Royal E-Invitation Studio
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="#event-cards"
              className="text-xs sm:text-sm text-festive-cream/80 hover:text-festive-goldLight transition-colors tracking-wide hidden sm:inline-block"
            >
              Live Demos
            </a>
            <a
              href="#faq"
              className="text-xs sm:text-sm text-festive-cream/80 hover:text-festive-goldLight transition-colors tracking-wide hidden md:inline-block"
            >
              FAQs
            </a>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm bg-gradient-to-r from-festive-gold via-amber-400 to-festive-goldDark text-festive-wine font-bold shadow-gold-glow hover:brightness-105 transition-all duration-300"
            >
              Apply for a Card
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 text-center festive-pattern-bg">
          <div className="max-w-4xl mx-auto relative z-10">
            {/* Auspicious Shloka Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festive-maroon/90 border border-festive-gold/40 text-festive-goldLight text-xs sm:text-sm tracking-widest uppercase mb-6 shadow-md">
              <span className="text-festive-gold">✦</span>
              <span>॥ शुभम् भवतु कल्याणम् ॥</span>
              <span className="text-festive-gold">✦</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.15] mb-6 text-festive-cream">
              Royal Indian Digital Invitations for{" "}
              <span className="gold-gradient-text drop-shadow-sm block sm:inline">
                WhatsApp
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-base sm:text-xl text-festive-cream/85 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
              Experience grand palace door opening animations, background Shehnai music, couple portraits, ceremony itineraries, and interactive venue directions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14">
              <a
                href="#event-cards"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-festive-gold via-[#e5c365] to-festive-goldDark text-festive-wine font-bold text-base shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Experience Live Demos Below ↓
              </a>
              <Link
                href="/apply"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-festive-gold/40 text-festive-goldLight hover:bg-festive-maroon/40 transition-colors text-base font-semibold"
              >
                Apply for Your Card →
              </Link>
            </div>

            {/* Trust / Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 border-t border-festive-gold/20">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-festive-cream/80">
                <span className="text-festive-gold text-base">✨</span>
                <span>Royal Door Reveal</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-festive-cream/80">
                <span className="text-festive-gold text-base">🎵</span>
                <span>Background Music</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-festive-cream/80">
                <span className="text-festive-gold text-base">📍</span>
                <span>Live Map & RSVP</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-festive-cream/80">
                <span className="text-festive-gold text-base">📲</span>
                <span>Instant WhatsApp Link</span>
              </div>
            </div>
          </div>
        </section>

        {/* ORNAMENTAL DIVIDER */}
        <div className="flex items-center justify-center gap-4 py-6 px-4">
          <div className="h-[1px] w-24 sm:w-40 bg-gradient-to-r from-transparent to-festive-gold/60" />
          <div className="text-festive-gold flex items-center gap-2 text-sm">
            <span>❖</span>
            <span className="text-xs uppercase tracking-widest text-festive-goldLight font-bold">
              Live Interactive Demos
            </span>
            <span>❖</span>
          </div>
          <div className="h-[1px] w-24 sm:w-40 bg-gradient-to-l from-transparent to-festive-gold/60" />
        </div>

        {/* 3 BIG CARDS WITH EMBEDDED PHONE FRAMES */}
        <section
          id="event-cards"
          className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-festive-cream mb-4">
              Handcrafted for Indian Celebrations
            </h2>
            <p className="text-festive-cream/75 text-sm sm:text-base">
              Try the real live demos directly in the phone frames below, or open full screen.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {eventCards.map((card) => (
              <div
                key={card.id}
                className="group relative rounded-3xl bg-gradient-to-b from-festive-maroon/95 to-festive-wine border border-festive-gold/40 hover:border-festive-gold/80 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-maroon-deep hover:shadow-gold-glow p-6 sm:p-7"
              >
                <div>
                  {/* Card Header with Icon & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-festive-wine/80 border border-festive-gold/40 flex items-center justify-center shadow-inner">
                      {card.iconSvg}
                    </div>
                    <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-festive-goldLight rounded-full bg-festive-maroon border border-festive-gold/40">
                      {card.badge}
                    </span>
                  </div>

                  {/* Hindi & English Titles */}
                  <div className="mb-3">
                    <span className="text-festive-gold font-serif text-xs tracking-wide block mb-0.5">
                      {card.hindiTitle}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-festive-cream">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-xs text-festive-cream/75 leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* EMBEDDED PHONE-FRAME PREVIEW */}
                  <div className="mb-6">
                    <div className="relative mx-auto w-full max-w-[270px] h-[480px] rounded-[36px] p-2 bg-gradient-to-b from-[#4a1226] via-[#1a040d] to-[#360a1c] border-4 border-festive-gold/50 shadow-2xl overflow-hidden">
                      {/* Notch */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-festive-maroon border border-festive-gold/30 rounded-full z-20 pointer-events-none" />
                      
                      {/* Iframe */}
                      <iframe
                        src={card.demoUrl}
                        title={`${card.title} Live Demo`}
                        loading="lazy"
                        className="w-full h-full rounded-[28px] border-0 bg-festive-wine"
                      />
                    </div>
                    <p className="text-[11px] text-center text-festive-gold/70 mt-2 italic">
                      👆 Tap inside phone to experience animations & music
                    </p>
                  </div>
                </div>

                {/* TWO ACTION BUTTONS: LIVE DEMO & APPLY FOR THIS CARD */}
                <div className="space-y-2.5 pt-4 border-t border-festive-gold/20">
                  <Link
                    href={card.applyUrl}
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-festive-gold to-festive-goldDark text-festive-wine hover:brightness-105 transition-all shadow-md"
                  >
                    <span>Apply for this card</span>
                    <span>→</span>
                  </Link>

                  <Link
                    href={card.demoUrl}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs bg-festive-wine/80 border border-festive-gold/40 text-festive-goldLight hover:bg-festive-maroon transition-all"
                  >
                    <span>👁️</span>
                    <span>Open Full Screen Demo</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE DATABASE SHOWCASE: RECENTLY CREATED INVITATIONS */}
        {recentCards.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest text-festive-gold font-semibold">
                Live From Our Database
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-festive-cream mt-2 mb-3">
                Recently Published Celebrations
              </h2>
              <p className="text-festive-cream/75 text-xs sm:text-sm">
                Explore real digital invitation cards created and stored live in our database.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCards.map((rc) => {
                const title =
                  rc.type === "wedding"
                    ? `${rc.data.groomName || "Groom"} & ${rc.data.brideName || "Bride"}`
                    : rc.type === "birthday"
                    ? `${rc.data.personName || "Birthday"}'s Celebration`
                    : `${rc.data.functionName || "Griha Pravesh"} – ${rc.data.familyName || "Family"}`;

                const badge =
                  rc.type === "wedding"
                    ? "Wedding"
                    : rc.type === "birthday"
                    ? "Birthday"
                    : "Ghar Function";

                return (
                  <Link
                    key={rc.id}
                    href={`/c/${rc.slug}`}
                    target="_blank"
                    className="group block rounded-2xl bg-festive-maroon/80 border border-festive-gold/30 hover:border-festive-gold p-5 transition-all duration-300 hover:shadow-gold-glow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-festive-wine text-festive-gold border border-festive-gold/30">
                        {badge}
                      </span>
                      <span className="text-xs text-festive-goldLight group-hover:translate-x-1 transition-transform">
                        Open Card →
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-festive-cream group-hover:text-festive-goldLight transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-festive-cream/60 mt-1 truncate">
                      📍 {rc.data.venueName || rc.data.venueAddress || "Celebration Venue"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* HOW IT WORKS SECTION */}
        <section
          id="features"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        >
          <div className="rounded-3xl bg-gradient-to-r from-festive-maroon/60 via-festive-wine to-festive-maroon/60 border border-festive-gold/30 p-8 sm:p-14 relative overflow-hidden shadow-maroon-deep">
            {/* Background Ornament */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-festive-gold/5 blur-2xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest text-festive-gold font-semibold">
                Simple & Seamless
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-festive-cream mt-2 mb-4">
                How It Works in 3 Quick Steps
              </h2>
              <p className="text-festive-cream/80 text-sm">
                From inquiry to shareable magic link in hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-full bg-festive-gold/20 border border-festive-gold flex items-center justify-center text-festive-goldLight font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-serif text-lg font-semibold text-festive-goldLight mb-2">
                  1. Explore & Apply
                </h3>
                <p className="text-xs sm:text-sm text-festive-cream/75 leading-relaxed">
                  Browse live demos and submit your names, ceremony dates, city, and venue in our friendly 2-minute form.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-full bg-festive-gold/20 border border-festive-gold flex items-center justify-center text-festive-goldLight font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-serif text-lg font-semibold text-festive-goldLight mb-2">
                  2. Send Photos on WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-festive-cream/75 leading-relaxed">
                  Tap the instant WhatsApp button with your Request ID to share high-resolution couple or family photos directly with us.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-full bg-festive-gold/20 border border-festive-gold flex items-center justify-center text-festive-goldLight font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="font-serif text-lg font-semibold text-festive-goldLight mb-2">
                  3. Receive Your Magic Link
                </h3>
                <p className="text-xs sm:text-sm text-festive-cream/75 leading-relaxed">
                  Our designer crafts your custom animated card with Shehnai music, venue Google Maps navigation, and RSVP tracker.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (SEO FAQ SECTION) */}
        <section
          id="faq"
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-festive-gold font-semibold">
              Got Questions?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-festive-cream mt-2 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-festive-cream/75 text-sm sm:text-base">
              Everything you need to know about getting your custom Indian digital invitation card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-festive-maroon/40 border border-festive-gold/25 p-6 hover:border-festive-gold/60 transition-all shadow-md flex flex-col justify-start"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-festive-gold text-lg font-serif font-bold">
                    Q{index + 1}.
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-festive-goldLight leading-snug">
                    {faq.q}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-festive-cream/80 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-festive-gold to-festive-goldDark text-festive-wine font-bold text-sm shadow-gold-glow hover:brightness-105 transition-all"
            >
              Apply for Your Invitation Card Now →
            </Link>
          </div>
        </section>
      </main>

      {/* CLEAN FESTIVE FOOTER */}
      <footer className="border-t border-festive-gold/25 bg-festive-maroonDark/95 text-festive-cream/75 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-festive-wine border border-festive-gold/50 flex items-center justify-center text-sm">
              🪔
            </div>
            <div>
              <p className="font-serif font-bold text-lg text-festive-goldLight">
                निमंत्रण Utsav
              </p>
              <p className="text-xs text-festive-cream/60">
                Royal Indian Digital Invitation Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-festive-cream/70">
            <Link
              href="/demo/wedding"
              className="hover:text-festive-gold transition-colors"
            >
              Wedding Demo
            </Link>
            <Link
              href="/demo/birthday"
              className="hover:text-festive-gold transition-colors"
            >
              Birthday Demo
            </Link>
            <Link
              href="/demo/ghar"
              className="hover:text-festive-gold transition-colors"
            >
              Griha Pravesh Demo
            </Link>
            <Link
              href="/apply"
              className="hover:text-festive-gold transition-colors"
            >
              Apply for a Card
            </Link>
            <a
              href="https://wa.me/917521038818?text=Namaste!%20I%20want%20to%20send%20photos%20for%20my%20invitation%20card."
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-festive-gold text-emerald-400 font-semibold transition-colors flex items-center gap-1"
            >
              <span>💬</span>
              <span>WhatsApp: +91 75210 38818</span>
            </a>
            <Link
              href="/admin/login"
              className="text-festive-cream/40 hover:text-festive-gold transition-colors"
            >
              Admin Login 🔒
            </Link>
          </div>

          <p className="text-xs text-festive-cream/50">
            © {new Date().getFullYear()} निमंत्रण Utsav. Made with devotion &
            celebration.
          </p>
        </div>
      </footer>
    </div>
  );
}
