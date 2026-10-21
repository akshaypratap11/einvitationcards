"use client";

import React from "react";
import Link from "next/link";
import { EventType } from "@/types/card";

interface OccasionOption {
  type: EventType;
  title: string;
  hindiTitle: string;
  badge: string;
  icon: string;
  description: string;
  highlights: string[];
  gradient: string;
}

const occasionOptions: OccasionOption[] = [
  {
    type: "wedding",
    title: "Royal Wedding",
    hindiTitle: "विवाह उत्सव",
    badge: "3D Royal Doors • Most Popular",
    icon: "💍",
    description:
      "Grand animated invitation featuring 3D royal doors opening, couple collision physics, multi-day itinerary & Google Maps navigation.",
    highlights: [
      "Royal Palace Doors opening animation",
      "Dynamic itinerary (Mehndi, Sangeet, Baraat)",
      "Interactive Google Maps & RSVP",
      "Instant WhatsApp & Social sharing",
    ],
    gradient: "from-amber-500/20 via-festive-maroon/80 to-festive-wine",
  },
  {
    type: "birthday",
    title: "Birthday Celebration",
    hindiTitle: "जन्मदिन समारोह",
    badge: "Vibrant & Joyful",
    icon: "🎂",
    description:
      "Celebrate milestone birthdays with animated live countdowns, party itinerary, photo memories, and interactive RSVP.",
    highlights: [
      "Live countdown timer to celebration",
      "Cake cutting & party itinerary",
      "Memorable photo gallery showcase",
      "Guest RSVP with contact integration",
    ],
    gradient: "from-rose-500/20 via-festive-maroon/80 to-festive-wine",
  },
  {
    type: "ghar",
    title: "Griha Pravesh & Puja",
    hindiTitle: "गृह प्रवेश / मांगलिक कार्य",
    badge: "Auspicious & Vedic",
    icon: "🪔",
    description:
      "Auspicious invitations for Griha Pravesh, Vastu Puja, Satyanarayan Katha, Mundan Sanskar and family ceremonies.",
    highlights: [
      "Shubh Muhurat & Hawan timings",
      "Traditional Vedic shlokas & blessings",
      "Bilingual English & हिन्दी support",
      "Venue directions & Google Calendar sync",
    ],
    gradient: "from-orange-500/20 via-festive-maroon/80 to-festive-wine",
  },
];

export default function OccasionPicker() {
  return (
    <div className="min-h-screen bg-festive-wine text-festive-cream festive-pattern-bg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-between">
      {/* Background ambient gold glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-festive-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-festive-rose/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-festive-gold/20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-festive-goldLight hover:text-festive-gold transition-colors font-medium"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>

          <span className="text-xs uppercase tracking-widest text-festive-gold font-mono">
            E-Invitation Studio
          </span>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 rounded-full text-xs uppercase tracking-widest bg-festive-gold/15 border border-festive-gold/40 text-festive-goldLight mb-3">
            Step 1 of 2: Select Occasion
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-festive-goldLight leading-tight">
            Choose Your Celebration Type
          </h1>
          <p className="text-festive-gold/90 font-serif italic text-lg mt-1">
            शुभ आरंभ — अपनी मंगलमय बेला का चयन करें
          </p>
          <p className="text-festive-cream/80 text-sm mt-3 max-w-lg mx-auto">
            Pick an event category below to configure dates, ceremonies, and launch your personalized animated invitation card.
          </p>
        </div>

        {/* 3 Occasion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {occasionOptions.map((item) => (
            <div
              key={item.type}
              className={`rounded-3xl border border-festive-gold/30 bg-gradient-to-b ${item.gradient} p-6 sm:p-7 flex flex-col justify-between hover:border-festive-gold hover:shadow-maroon-deep transition-all duration-300 relative group`}
            >
              {/* Badge */}
              <div className="mb-4">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-festive-wine/80 border border-festive-gold/40 text-festive-goldLight">
                  {item.badge}
                </span>
              </div>

              {/* Icon & Titles */}
              <div className="space-y-3 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-festive-gold/15 border border-festive-gold/50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-festive-goldLight group-hover:text-festive-gold transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs font-serif text-festive-gold/80 italic">
                    {item.hindiTitle}
                  </p>
                </div>

                <p className="text-festive-cream/80 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="pt-4 border-t border-festive-gold/15 mb-6 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-festive-gold">
                  Highlights Included:
                </p>
                {item.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-festive-cream/85">
                    <span className="text-festive-gold text-xs leading-none mt-0.5">✦</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Link
                href={`/create?type=${item.type}`}
                className="w-full py-3 px-4 rounded-xl font-medium text-sm text-center bg-festive-gold text-festive-wine hover:bg-festive-goldLight transition-all duration-200 shadow-md font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <span>Select {item.title}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <footer className="text-center text-xs text-festive-cream/50 mt-12 relative z-10 border-t border-festive-gold/15 pt-6">
        <p>No design skills required • Fast 2-minute creation • Mobile & Desktop responsive</p>
      </footer>
    </div>
  );
}
