"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CardFormValues } from "./schema";

interface StepContactReviewProps {
  form: UseFormReturn<CardFormValues>;
}

export default function StepContactReview({ form }: StepContactReviewProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentLang = watch("lang");
  const rsvpEnabled = watch("rsvpEnabled");

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-festive-gold/20 pb-3">
        <h3 className="font-serif text-xl font-bold text-festive-goldLight">
          Step 4: Contact, Language & Options
        </h3>
        <p className="text-xs text-festive-cream/70 mt-1">
          Provide RSVP contact details and select the preferred display language.
        </p>
      </div>

      {/* LANGUAGE SELECTOR */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-festive-gold mb-2 font-semibold">
          Invitation Language (भाषा) *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue("lang", "en")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              currentLang === "en"
                ? "bg-festive-gold/25 border-festive-gold text-festive-goldLight shadow-md"
                : "bg-festive-maroon/50 border-festive-gold/25 text-festive-cream/80 hover:border-festive-gold/50"
            }`}
          >
            <div>
              <span className="block font-semibold text-sm">English</span>
              <span className="text-[11px] opacity-75">Standard Wedding & Celebration</span>
            </div>
            {currentLang === "en" && <span className="text-festive-gold text-base">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => setValue("lang", "hi")}
            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
              currentLang === "hi"
                ? "bg-festive-gold/25 border-festive-gold text-festive-goldLight shadow-md"
                : "bg-festive-maroon/50 border-festive-gold/25 text-festive-cream/80 hover:border-festive-gold/50"
            }`}
          >
            <div>
              <span className="block font-semibold text-sm">हिन्दी (Hindi)</span>
              <span className="text-[11px] opacity-75">पारम्परिक मांगलिक निमंत्रण</span>
            </div>
            {currentLang === "hi" && <span className="text-festive-gold text-base">✓</span>}
          </button>
        </div>
      </div>

      {/* CONTACT PERSON & PHONE */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
              Host / RSVP Contact Person *
            </label>
            <input
              type="text"
              placeholder="e.g. Mr. Mohit Malhotra"
              {...register("contactName")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
            />
            {errors.contactName && (
              <p className="text-rose-400 text-xs mt-1">
                {errors.contactName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-festive-gold mb-1 font-semibold">
              WhatsApp / Phone Number *
            </label>
            <input
              type="tel"
              placeholder="e.g. 9876543210 or +91 98765 43210"
              {...register("contactPhone")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
            />
            {errors.contactPhone && (
              <p className="text-rose-400 text-xs mt-1">
                {errors.contactPhone.message}
              </p>
            )}
            <p className="text-[11px] text-festive-cream/50 mt-1">
              Guests can tap &quot;WhatsApp Host&quot; on your card to send congratulations.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-festive-cream/80 mb-1">
            Contact Email (optional)
          </label>
          <input
            type="email"
            placeholder="e.g. celebrations@example.com"
            {...register("contactEmail")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-festive-maroon/70 border border-festive-gold/30 text-festive-cream text-sm focus:outline-none focus:border-festive-gold transition-colors placeholder:text-festive-cream/40"
          />
          {errors.contactEmail && (
            <p className="text-rose-400 text-xs mt-1">
              {errors.contactEmail.message}
            </p>
          )}
        </div>
      </div>

      {/* RSVP TOGGLE & BACKGROUND MUSIC */}
      <div className="space-y-4 pt-4 border-t border-festive-gold/20">
        <div className="flex items-center justify-between p-4 rounded-xl bg-festive-maroon/50 border border-festive-gold/20">
          <div>
            <span className="block text-sm font-semibold text-festive-cream flex items-center gap-1.5">
              <span>💬</span>
              <span>Enable WhatsApp RSVP Button</span>
            </span>
            <span className="text-xs text-festive-cream/70">
              Guests tap the RSVP button on your card to send their confirmation and headcount directly to your WhatsApp.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer ml-3">
            <input
              type="checkbox"
              checked={rsvpEnabled}
              onChange={(e) => setValue("rsvpEnabled", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-festive-wine peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-festive-gold"></div>
          </label>
        </div>

        {/* BACKGROUND MUSIC SELECTOR */}
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider text-festive-gold font-semibold">
            Background Music (पृष्ठभूमि संगीत)
          </label>
          <p className="text-xs text-festive-cream/70">
            Choose an auspicious background melody that plays smoothly after the guest opens the invitation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: "",
                title: "None (Muted)",
                desc: "No background music",
                icon: "🔇",
              },
              {
                id: "/music/shehnai-festive.mp3",
                title: "Royal Sitar & Shehnai",
                desc: "Traditional wedding & royal festivities",
                icon: "🎺",
              },
              {
                id: "/music/celebration-cheer.mp3",
                title: "Joyful Celebration Beats",
                desc: "Upbeat acoustic for birthdays & parties",
                icon: "🎈",
              },
              {
                id: "/music/temple-flute.mp3",
                title: "Devotional Temple Flute",
                desc: "Serene bansuri for Griha Pravesh & Puja",
                icon: "🪈",
              },
            ].map((track) => {
              const currentMusic = watch("musicUrl") || "";
              const isSelected = currentMusic === track.id;

              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setValue("musicUrl", track.id, { shouldDirty: true })}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-festive-gold/25 border-festive-gold text-festive-goldLight shadow-md"
                      : "bg-festive-maroon/50 border-festive-gold/20 text-festive-cream/80 hover:border-festive-gold/45"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{track.icon}</span>
                    <div>
                      <span className="block font-semibold text-xs text-festive-cream">
                        {track.title}
                      </span>
                      <span className="text-[11px] opacity-70 block">
                        {track.desc}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-festive-gold text-sm font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Audio Preview in Form if track chosen */}
          {watch("musicUrl") && watch("musicUrl") !== "" && (
            <div className="p-3 rounded-xl bg-festive-wine/80 border border-festive-gold/30 flex items-center justify-between gap-3 text-xs">
              <span className="text-festive-gold font-medium flex items-center gap-1.5">
                <span>🎵</span>
                <span>Preview selected track:</span>
              </span>
              <audio
                controls
                src={watch("musicUrl")}
                className="h-8 max-w-[200px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
