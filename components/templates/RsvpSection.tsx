"use client";

import React, { useState } from "react";
import { Lang } from "@/types/card";

export interface RsvpSectionProps {
  slug?: string;
  cardId?: string;
  lang: Lang;
  theme?: "wedding" | "birthday" | "ghar";
  contactPhone?: string;
  contactName?: string;
}

export default function RsvpSection({
  slug,
  cardId,
  lang,
  theme = "wedding",
  contactPhone,
  contactName,
}: RsvpSectionProps) {
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState<boolean>(true);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = guestName.trim();
    if (!trimmed || trimmed.length < 2) {
      setErrorMessage(
        lang === "hi"
          ? "कृपया अपना नाम लिखें (कम से कम 2 अक्षर)।"
          : "Please enter your name (at least 2 characters)."
      );
      return;
    }

    if (!slug && !cardId) {
      // In preview mode or mock
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          card_id: cardId,
          guest_name: trimmed,
          attending,
          guests_count: attending ? guestsCount : 0,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit RSVP");
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Border and accent styling based on theme
  const getThemeClasses = () => {
    if (theme === "birthday") {
      return {
        cardBg: "bg-white/10 border-white/20 text-white",
        activeBtn: "bg-amber-400 text-stone-900 border-amber-300 font-bold",
        inactiveBtn: "bg-white/5 border-white/20 text-white/80 hover:bg-white/10",
        submitBtn: "bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold",
        accentText: "text-amber-300",
      };
    }
    if (theme === "ghar") {
      return {
        cardBg: "bg-black/30 border-amber-400/35 text-amber-100",
        activeBtn: "bg-gradient-to-r from-amber-500 to-red-700 text-white border-amber-300 font-bold",
        inactiveBtn: "bg-black/40 border-amber-400/20 text-amber-200/70 hover:bg-black/60",
        submitBtn: "bg-gradient-to-r from-amber-500 via-orange-600 to-red-700 text-white font-bold",
        accentText: "text-amber-300",
      };
    }
    // Default wedding
    return {
      cardBg: "bg-[#3e1422]/90 border-[#c9a24b]/40 text-[#fbf3e4]",
      activeBtn: "bg-gradient-to-r from-[#c9a24b] to-[#a07c30] text-[#2b0d16] border-[#f3e2a9] font-bold shadow-md",
      inactiveBtn: "bg-[#2b0d16]/70 border-[#c9a24b]/25 text-[#fbf3e4]/80 hover:border-[#c9a24b]/50",
      submitBtn: "bg-gradient-to-r from-[#c9a24b] via-[#e2c174] to-[#a07c30] text-[#2b0d16] font-bold shadow-lg hover:brightness-105",
      accentText: "text-[#c9a24b]",
    };
  };

  const style = getThemeClasses();

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border shadow-2xl backdrop-blur-md my-6 text-left ${style.cardBg}`}>
      <div className="text-center mb-5">
        <span className={`text-xs font-bold uppercase tracking-widest block mb-1 ${style.accentText}`}>
          ✦ RSVP ✦
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide">
          {lang === "hi" ? "उपस्थिति पुष्टि करें" : "Confirm Your Presence"}
        </h3>
        <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-md mx-auto">
          {lang === "hi"
            ? "कृपया हमें बताएं कि क्या आप इस पावन उत्सव में पधारेंगे।"
            : "Please let the hosts know if you will be joining the celebrations."}
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-6 space-y-3 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-3xl mx-auto">
            {attending ? "🎉" : "💌"}
          </div>

          <h4 className="font-serif text-xl sm:text-2xl font-bold text-emerald-300">
            {lang === "hi"
              ? attending
                ? `धन्यवाद, ${guestName}! 🙏`
                : `धन्यवाद, ${guestName}।`
              : attending
              ? `Thank you, ${guestName}! 🎉`
              : `Thank you, ${guestName}.`}
          </h4>

          <p className="text-sm opacity-90 max-w-sm mx-auto leading-relaxed">
            {lang === "hi"
              ? attending
                ? `आपकी उपस्थिति (${guestsCount} सदस्य) दर्ज कर ली गई है। सपरिवार आपका हार्दिक स्वागत है!`
                : "आपकी शुभकामनाओं के लिए धन्यवाद।"
              : attending
              ? `Your RSVP for ${guestsCount} guest(s) has been confirmed! We eagerly look forward to celebrating together.`
              : "We appreciate you letting us know. You will be dearly missed!"}
          </p>

          {contactPhone && attending && (
            <div className="pt-2">
              <a
                href={`https://wa.me/${contactPhone.replace(/[^\d+]/g, "").replace(/^\+/, "")}?text=${encodeURIComponent(
                  `Hi ${contactName || "there"}, I have RSVP'd (${guestsCount} guests) for the celebrations! Looking forward to it.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-transform hover:scale-105"
              >
                <span>💬</span>
                <span>
                  {lang === "hi" ? "व्हाट्सएप पर भी संदेश भेजें" : "Message Host on WhatsApp"}
                </span>
              </a>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          {/* Guest Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-1 opacity-90">
              {lang === "hi" ? "आपका शुभ नाम *" : "Your Full Name *"}
            </label>
            <input
              type="text"
              required
              placeholder={lang === "hi" ? "उदा. रमेश गुप्ता" : "e.g. Ramesh Gupta & Family"}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/25 border border-white/20 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Attending Toggle */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-1.5 opacity-90">
              {lang === "hi" ? "क्या आप उपस्थित होंगे? *" : "Will you be attending? *"}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                  attending ? style.activeBtn : style.inactiveBtn
                }`}
              >
                <span>🎉</span>
                <span>{lang === "hi" ? "हाँ, अवश्य पधारेंगे" : "Yes, Attending"}</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                  !attending ? style.activeBtn : style.inactiveBtn
                }`}
              >
                <span>✉️</span>
                <span>{lang === "hi" ? "असमर्थ हैं" : "Cannot Attend"}</span>
              </button>
            </div>
          </div>

          {/* Guest Count (if attending) */}
          {attending && (
            <div className="animate-fadeIn">
              <label className="block text-xs uppercase tracking-wider font-semibold mb-1 opacity-90">
                {lang === "hi" ? "कुल सदस्यों की संख्या" : "Total Guests Attending"}
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-black/35 border border-white/20 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num} className="bg-stone-900 text-white">
                    {num} {num === 1 ? (lang === "hi" ? "सदस्य" : "Guest") : (lang === "hi" ? "सदस्य" : "Guests")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-rose-300 bg-rose-950/50 p-2.5 rounded-lg border border-rose-500/30">
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-xl transition-transform active:scale-[0.98] text-sm tracking-wide ${style.submitBtn} ${
              submitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {submitting
              ? lang === "hi"
                ? "दर्ज हो रहा है..."
                : "Submitting..."
              : lang === "hi"
              ? "आरएसवीपी पुष्टि करें 🙏"
              : "Confirm RSVP 🙏"}
          </button>
        </form>
      )}
    </div>
  );
}
