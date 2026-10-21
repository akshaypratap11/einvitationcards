"use client";

import React, { useState } from "react";
import BirthdayCelebration from "@/components/templates/BirthdayCelebration";
import { CardData, Lang } from "@/types/card";

export default function BirthdayPreviewPage() {
  const [themeVariant, setThemeVariant] = useState<"kids" | "adult" | "first">("kids");
  const [lang, setLang] = useState<Lang>("en");
  const [replayKey, setReplayKey] = useState(0);

  // Sample data tailored to demonstrate all features
  const sampleData: CardData = {
    type: "birthday",
    lang,
    themeVariant,
    personName:
      themeVariant === "kids"
        ? "Aarav Sharma"
        : themeVariant === "adult"
        ? "Kabir Singhania"
        : "Baby Ananya",
    age: themeVariant === "kids" ? 7 : themeVariant === "adult" ? 30 : 1,
    hostName:
      themeVariant === "kids"
        ? "Sunita & Rajesh Sharma"
        : themeVariant === "adult"
        ? "The Singhania Family & Friends"
        : "Priya & Vikram Malhotra",
    message:
      lang === "hi"
        ? "हमारे प्रिय के जन्मदिन के पावन अवसर पर आपकी स्नेहमयी उपस्थिति सादर प्रार्थनीय है। आइए साथ मिलकर खुशियों का उत्सव मनाएं!"
        : themeVariant === "adult"
        ? "Cheers to three decades of laughter, dreams, and cherished memories! Join us for an unforgettable evening of drinks, gourmet dining, and celebrations."
        : "A full year of tiny giggles, sweet milestones, and boundless love! Join us as we celebrate this magical birthday with cake, fun, and laughter.",
    heroPhoto:
      themeVariant === "kids"
        ? "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80"
        : themeVariant === "adult"
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80",
    mainDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    venueName: "The Grand Pavilion & Sky Lounge",
    venueAddress: "MG Road, Sector 28, Gurugram, Haryana 122002",
    mapQuery: "The Grand Pavilion, Gurugram",
    events: [
      {
        id: "ev-1",
        title: themeVariant === "adult" ? "Cocktails & Networking" : "Magic & Game Zone",
        tagline: themeVariant === "adult" ? "Welcome drinks & live acoustics" : "Games, tattoos & balloon crafts",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "17:30",
        venue: "Sunset Lawn",
      },
      {
        id: "ev-2",
        title: "Cake Cutting & Confetti Shower",
        tagline: "The grand birthday wish and surprise celebration",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "19:00",
        venue: "Grand Ballroom",
      },
      {
        id: "ev-3",
        title: themeVariant === "adult" ? "Dinner & DJ Night" : "Feast & Dance Party",
        tagline: "Gourmet buffet dinner followed by high-energy dance floor",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "20:00",
        venue: "Crystal Dining Suite",
      },
    ],
    role: themeVariant === "kids" ? "Boy" : themeVariant === "adult" ? "Man" : "Girl",
    dressCode: themeVariant === "kids" ? "Bright & Colorful / Superhero" : themeVariant === "adult" ? "Black Tie / Elegant Chic" : "Soft Pastels",
    rsvpBy: "14th November",
    timeText: "5:30 PM onwards",
    photo1: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
    photo2: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80",
    schedule: [
      {
        id: "sch-1",
        time: "5:30 PM",
        title: "Arrival & Welcome Drinks",
        desc: "Grab a drink and get ready to celebrate!",
      },
      {
        id: "sch-2",
        time: "7:00 PM",
        title: "Cake Cutting & Fireworks",
        desc: "Make a wish and blow the candles together.",
      },
      {
        id: "sch-3",
        time: "8:00 PM",
        title: "Dinner & Refreshments",
        desc: "A delectable culinary feast.",
      },
      {
        id: "sch-4",
        time: "9:00 PM",
        title: "Music & Dance Floor",
        desc: "Groove to the beats all night long.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    ],
    contactName: "Rajesh Sharma",
    contactPhone: "+91 75210 38818",
    contactEmail: "celebrations@sharmafamily.com",
    rsvpEnabled: true,
  };

  return (
    <div className="relative min-h-screen">
      {/* Top Floating Control Bar for Demo / Testing */}
      <aside 
        aria-label="Preview Controls"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-black/85 backdrop-blur-md border border-white/20 px-3 sm:px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-4 text-xs font-semibold text-white max-w-[95vw] overflow-x-auto"
      >
        <span className="text-amber-400 font-bold whitespace-nowrap hidden sm:inline">
          🎂 Preview Controls:
        </span>

        {/* Theme Variant Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setThemeVariant("kids")}
            className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
              themeVariant === "kids"
                ? "bg-amber-400 text-stone-900 font-bold shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            🎈 Kids
          </button>
          <button
            type="button"
            onClick={() => setThemeVariant("adult")}
            className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
              themeVariant === "adult"
                ? "bg-amber-400 text-stone-900 font-bold shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            🥂 Adult
          </button>
          <button
            type="button"
            onClick={() => setThemeVariant("first")}
            className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
              themeVariant === "first"
                ? "bg-pink-400 text-stone-900 font-bold shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            🧸 1st
          </button>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              lang === "en"
                ? "bg-emerald-400 text-stone-900 font-bold"
                : "text-white/75 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("hi")}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              lang === "hi"
                ? "bg-emerald-400 text-stone-900 font-bold"
                : "text-white/75 hover:text-white"
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Replay Intro Button */}
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-full transition-colors shrink-0"
          title="Replay gift box opening animation"
        >
          🎁 Replay Intro
        </button>
      </aside>

      {/* Render the BirthdayCelebration Template */}
      <BirthdayCelebration key={`${themeVariant}-${lang}-${replayKey}`} data={sampleData} previewMode={false} showPlaceholders={true} />
    </div>
  );
}
