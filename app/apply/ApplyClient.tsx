"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EventType } from "@/types/card";

interface ApplyClientProps {
  initialType: EventType;
}

type Lang = "en" | "hi";

const WEDDING_EVENTS_OPTIONS = [
  "Mehndi",
  "Haldi",
  "Sangeet",
  "Baraat & Pheras",
  "Reception",
  "Cocktail / Engagement",
  "Other",
];

const GHAR_FUNCTION_OPTIONS = [
  "Griha Pravesh & Vastu Shanti",
  "Satyanarayan Bhagwan Katha",
  "Mundan Sanskar",
  "Kuan Pujan / Baby Shower",
  "Navgrah Puja & Hawan",
  "Other",
];

export default function ApplyClient({ initialType }: ApplyClientProps) {
  const [lang, setLang] = useState<Lang>("en");
  const [eventType, setEventType] = useState<EventType>(initialType);

  // Common Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
  const [notes, setNotes] = useState("");

  // Honeypot
  const [honeypot, setHoneypot] = useState("");

  // Wedding Extras
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [groomParents, setGroomParents] = useState("");
  const [brideParents, setBrideParents] = useState("");
  const [eventsWanted, setEventsWanted] = useState<string[]>([
    "Mehndi",
    "Haldi",
    "Sangeet",
    "Baraat & Pheras",
    "Reception",
  ]);

  // Birthday Extras
  const [personName, setPersonName] = useState("");
  const [age, setAge] = useState("");
  const [birthdayTheme, setBirthdayTheme] = useState<"kids" | "adult" | "first">("kids");

  // Ghar Extras
  const [functionName, setFunctionName] = useState("Griha Pravesh & Vastu Shanti");
  const [familyName, setFamilyName] = useState("");
  const [muhurat, setMuhurat] = useState("");

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    shortId: string;
    phone: string;
    name: string;
  } | null>(null);

  const isHi = lang === "hi";

  const handleToggleEvent = (ev: string) => {
    setEventsWanted((prev) =>
      prev.includes(ev) ? prev.filter((x) => x !== ev) : [...prev, ev]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate phone
      const cleanPhone = phone.replace(/[\s\-\+]/g, "");
      const normalizedPhone =
        cleanPhone.startsWith("91") && cleanPhone.length === 12
          ? cleanPhone.slice(2)
          : cleanPhone;

      if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
        throw new Error(
          isHi
            ? "कृपया एक वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।"
            : "Please enter a valid 10-digit Indian WhatsApp number."
        );
      }

      // Collect type-specific details
      const details: Record<string, unknown> = {};
      if (eventType === "wedding") {
        details.groomName = groomName.trim();
        details.brideName = brideName.trim();
        details.groomParents = groomParents.trim();
        details.brideParents = brideParents.trim();
        details.eventsWanted = eventsWanted;
      } else if (eventType === "birthday") {
        details.personName = personName.trim();
        details.age = age ? Number(age) : undefined;
        details.theme = birthdayTheme;
      } else if (eventType === "ghar") {
        details.functionName = functionName;
        details.familyName = familyName.trim();
        details.muhurat = muhurat.trim();
      }

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: eventType,
          name: name.trim(),
          phone: normalizedPhone,
          email: email.trim() || undefined,
          event_date: eventDate || undefined,
          city: city.trim() || undefined,
          venue: venue.trim() || undefined,
          details,
          notes: notes.trim() || undefined,
          website: honeypot, // Honeypot
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit request.");
      }

      setSubmittedData({
        id: json.id,
        shortId: json.shortId || json.id.slice(0, 8),
        phone: normalizedPhone,
        name: name.trim(),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const adminWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP || "917521038818";

  // If submitted, show Thank You screen with WhatsApp button
  if (submittedData) {
    const typeLabel =
      eventType === "wedding"
        ? isHi ? "विवाह निमंत्रण" : "Wedding Invitation"
        : eventType === "birthday"
        ? isHi ? "जन्मदिन निमंत्रण" : "Birthday Invitation"
        : isHi ? "गृह प्रवेश निमंत्रण" : "Griha Pravesh Invitation";

    const waText = encodeURIComponent(
      `Namaste! I have submitted request #${submittedData.shortId} for ${typeLabel} (${submittedData.name}, Ph: ${submittedData.phone}). Here are my event photos and details.`
    );
    const waUrl = `https://wa.me/${adminWhatsApp}?text=${waText}`;

    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center festive-pattern-bg">
        <div className="max-w-lg w-full bg-festive-maroon/95 border-2 border-festive-gold/60 rounded-3xl p-8 sm:p-12 shadow-2xl text-center backdrop-blur-md relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-festive-gold/15 blur-3xl pointer-events-none rounded-full" />

          {/* Diya / Kalash Icon */}
          <div className="w-20 h-20 rounded-full bg-festive-wine border-2 border-festive-gold mx-auto flex items-center justify-center text-4xl shadow-gold-glow mb-6">
            🪔
          </div>

          <span className="text-xs uppercase tracking-widest text-festive-gold font-bold">
            {isHi ? "आवेदन सफलतापूर्वक प्राप्त हुआ" : "Application Received"}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-festive-goldLight mt-2 mb-3">
            {isHi ? "धन्यवाद!" : "Thank You!"}
          </h2>

          <div className="inline-block px-4 py-1.5 rounded-full bg-festive-wine/90 border border-festive-gold/40 text-festive-cream text-xs font-mono mb-6">
            Request ID: <span className="text-festive-gold font-bold">#{submittedData.shortId}</span>
          </div>

          <p className="text-sm text-festive-cream/85 leading-relaxed mb-8">
            {isHi
              ? "आपके निमंत्रण पत्र का विवरण प्राप्त हो गया है। अपना कार्ड तैयार कराने के लिए कृपया नीचे दिए गए बटन से अपनी फोटो सीधे WhatsApp पर भेजें।"
              : "Your invitation request has been received by our design team! To complete your custom digital card, please tap below to send your photos directly on WhatsApp."}
          </p>

          <div className="space-y-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-base shadow-lg hover:brightness-110 hover:shadow-xl transition-all duration-300"
            >
              <span className="text-2xl">💬</span>
              <span>
                {isHi ? "WhatsApp पर फोटो भेजें" : "Send Photos on WhatsApp"}
              </span>
            </a>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl border border-festive-gold/40 text-festive-goldLight text-xs sm:text-sm hover:bg-festive-wine transition-colors"
            >
              {isHi ? "← मुख्य पृष्ठ पर जाएं" : "← Return to Homepage"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 festive-pattern-bg">
      <div className="max-w-2xl mx-auto">
        {/* Top Header & Language Toggle */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-xs sm:text-sm text-festive-cream/70 hover:text-festive-gold transition-colors flex items-center gap-1.5"
          >
            <span>←</span>
            <span>{isHi ? "मुख्य पृष्ठ" : "Back to Home"}</span>
          </Link>

          {/* Hindi / English Toggle */}
          <div className="flex items-center rounded-full bg-festive-maroon border border-festive-gold/40 p-1">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                lang === "en"
                  ? "bg-festive-gold text-festive-wine shadow-sm"
                  : "text-festive-cream/70 hover:text-festive-gold"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                lang === "hi"
                  ? "bg-festive-gold text-festive-wine shadow-sm"
                  : "text-festive-cream/70 hover:text-festive-gold"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-festive-maroon/90 border border-festive-gold/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-festive-gold font-semibold">
              {isHi ? "डिजिटल निमंत्रण पत्र आवेदन" : "Card Application"}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-festive-cream mt-1">
              {isHi ? "अपना इनविटेशन कार्ड बनवाएं" : "Apply for Your Digital Card"}
            </h1>
            <p className="text-xs sm:text-sm text-festive-cream/75 mt-2">
              {isHi
                ? "विवरण भरें। हमारा डिज़ाइनर आपके लिए सुंदर एनिमेटेड कार्ड तैयार करेगा।"
                : "Fill in your celebration details. Our design team will craft your luxury animated card."}
            </p>
          </div>

          {/* Occasion Switcher */}
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-festive-wine/80 border border-festive-gold/30 mb-8">
            <button
              type="button"
              onClick={() => setEventType("wedding")}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                eventType === "wedding"
                  ? "bg-festive-gold text-festive-wine shadow-md"
                  : "text-festive-cream/70 hover:text-festive-gold"
              }`}
            >
              <span>💍</span>
              <span>{isHi ? "विवाह" : "Wedding"}</span>
            </button>

            <button
              type="button"
              onClick={() => setEventType("birthday")}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                eventType === "birthday"
                  ? "bg-festive-gold text-festive-wine shadow-md"
                  : "text-festive-cream/70 hover:text-festive-gold"
              }`}
            >
              <span>🎂</span>
              <span>{isHi ? "जन्मदिन" : "Birthday"}</span>
            </button>

            <button
              type="button"
              onClick={() => setEventType("ghar")}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                eventType === "ghar"
                  ? "bg-festive-gold text-festive-wine shadow-md"
                  : "text-festive-cream/70 hover:text-festive-gold"
              }`}
            >
              <span>🪔</span>
              <span>{isHi ? "गृह प्रवेश" : "Griha Pravesh"}</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-2.5">
              <span className="text-red-400 text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot hidden input */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {/* SECTION 1: APPLICANT INFO */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-festive-goldLight border-b border-festive-gold/20 pb-2">
                1. {isHi ? "आपका संपर्क विवरण" : "Your Contact Details"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                    {isHi ? "आपका नाम *" : "Your Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHi ? "उदा. राजेश शर्मा" : "e.g. Rajesh Sharma"}
                    className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                    {isHi ? "WhatsApp नंबर (10 अंक) *" : "WhatsApp Number (10 digits) *"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-festive-cream/50 text-xs sm:text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                  {isHi ? "ईमेल (वैकल्पिक)" : "Email Address (Optional)"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                />
              </div>
            </div>

            {/* SECTION 2: EVENT-SPECIFIC DETAILS */}
            {eventType === "wedding" && (
              <div className="space-y-4 pt-4">
                <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-festive-goldLight border-b border-festive-gold/20 pb-2">
                  2. {isHi ? "वर एवं वधू का विवरण" : "Wedding & Couple Details"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                      {isHi ? "वर का नाम (Groom) *" : "Groom's Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder={isHi ? "उदा. आरव" : "e.g. Aarav"}
                      className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                      {isHi ? "वधू का नाम (Bride) *" : "Bride's Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder={isHi ? "उदा. दिया" : "e.g. Diya"}
                      className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                      {isHi ? "वर के माता-पिता" : "Groom's Parents"}
                    </label>
                    <input
                      type="text"
                      value={groomParents}
                      onChange={(e) => setGroomParents(e.target.value)}
                      placeholder={isHi ? "श्री राजेश एवं सुनीता मल्होत्रा" : "Mr. Rajesh & Mrs. Sunita Malhotra"}
                      className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                      {isHi ? "वधू के माता-पिता" : "Bride's Parents"}
                    </label>
                    <input
                      type="text"
                      value={brideParents}
                      onChange={(e) => setBrideParents(e.target.value)}
                      placeholder={isHi ? "श्री विक्रम एवं अंजली शर्मा" : "Mr. Vikram & Mrs. Anjali Sharma"}
                      className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-festive-cream/80 mb-2 font-medium">
                    {isHi
                      ? "कार्ड में कौन-से कार्यक्रम शामिल करने हैं?"
                      : "Which ceremonies would you like to include?"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {WEDDING_EVENTS_OPTIONS.map((ev) => (
                      <label
                        key={ev}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          eventsWanted.includes(ev)
                            ? "bg-festive-gold/20 border-festive-gold text-festive-goldLight"
                            : "bg-festive-wine/60 border-festive-gold/20 text-festive-cream/70 hover:border-festive-gold/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={eventsWanted.includes(ev)}
                          onChange={() => handleToggleEvent(ev)}
                          className="accent-festive-gold rounded"
                        />
                        <span>{ev}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {eventType === "birthday" && (
              <div className="space-y-4 pt-4">
                <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-festive-goldLight border-b border-festive-gold/20 pb-2">
                  2. {isHi ? "जन्मदिन विवरण" : "Birthday Person & Theme"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                      {isHi ? "जन्मदिन व्यक्ति का नाम *" : "Celebrant's Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder={isHi ? "उदा. विहान शर्मा" : "e.g. Vihaan Sharma"}
                      className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                      {isHi ? "उम्र (Age) *" : "Age Turning *"}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 7"
                      className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-festive-cream/80 mb-2 font-medium">
                    {isHi ? "पार्टी थीम स्टाइल" : "Party Theme Style"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBirthdayTheme("kids")}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        birthdayTheme === "kids"
                          ? "bg-festive-gold/20 border-festive-gold text-festive-goldLight"
                          : "bg-festive-wine/60 border-festive-gold/20 text-festive-cream/70"
                      }`}
                    >
                      🎈 {isHi ? "बच्चों की पार्टी" : "Kids Playful"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBirthdayTheme("first")}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        birthdayTheme === "first"
                          ? "bg-festive-gold/20 border-festive-gold text-festive-goldLight"
                          : "bg-festive-wine/60 border-festive-gold/20 text-festive-cream/70"
                      }`}
                    >
                      🍼 {isHi ? "पहला जन्मदिन" : "1st Birthday"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBirthdayTheme("adult")}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        birthdayTheme === "adult"
                          ? "bg-festive-gold/20 border-festive-gold text-festive-goldLight"
                          : "bg-festive-wine/60 border-festive-gold/20 text-festive-cream/70"
                      }`}
                    >
                      🥂 {isHi ? "युवा / वयस्क" : "Adult Elegant"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {eventType === "ghar" && (
              <div className="space-y-4 pt-4">
                <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-festive-goldLight border-b border-festive-gold/20 pb-2">
                  2. {isHi ? "अनुष्ठान एवं परिवार विवरण" : "Ceremony & Family Details"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                      {isHi ? "मांगलिक उत्सव का प्रकार *" : "Function Type *"}
                    </label>
                    <select
                      value={functionName}
                      onChange={(e) => setFunctionName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/90 border border-festive-gold/30 text-festive-cream text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                    >
                      {GHAR_FUNCTION_OPTIONS.map((fn) => (
                        <option key={fn} value={fn} className="bg-festive-wine text-festive-cream">
                          {fn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                      {isHi ? "परिवार का नाम *" : "Family Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      placeholder={isHi ? "उदा. शर्मा परिवार" : "e.g. The Sharma Family"}
                      className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                    {isHi ? "शुभ मुहूर्त (यदि ज्ञात हो)" : "Auspicious Muhurat / Time (if known)"}
                  </label>
                  <input
                    type="text"
                    value={muhurat}
                    onChange={(e) => setMuhurat(e.target.value)}
                    placeholder={isHi ? "उदा. प्रातः 09:15 से 11:30 बजे (अभिजीत मुहूर्त)" : "e.g. 09:15 AM to 11:30 AM (Abhijit Muhurat)"}
                    className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>
            )}

            {/* SECTION 3: DATE, VENUE & NOTES */}
            <div className="space-y-4 pt-4">
              <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-festive-goldLight border-b border-festive-gold/20 pb-2">
                3. {isHi ? "तारीख, स्थान एवं विशेष निर्देश" : "Date, Venue & Instructions"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                    {isHi ? "मुख्य आयोजन की तारीख *" : "Main Event Date *"}
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream text-xs sm:text-sm focus:outline-none focus:border-festive-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                    {isHi ? "शहर / राज्य *" : "City / Location *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isHi ? "उदा. दिल्ली / नोएडा / कानपुर" : "e.g. New Delhi, Mumbai"}
                    className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                  {isHi ? "वेन्यू / स्थल का नाम (वैकल्पिक)" : "Venue Name & Address (Optional)"}
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder={isHi ? "उदा. मनकामेश्वर पैलेस, हॉल #2" : "e.g. The Grand Palace, Ballroom #2"}
                  className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-festive-cream/80 mb-1 font-medium">
                  {isHi ? "अतिरिक्त निर्देश / श्लोक या संदेश" : "Extra Notes / Specific Requests"}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isHi
                      ? "कार्ड में कोई विशेष श्लोक, गीत या निर्देश जोड़ना हो तो यहाँ लिखें..."
                      : "Any custom shloka, hashtag, music preference, or special notes..."
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/35 text-xs sm:text-sm focus:outline-none focus:border-festive-gold"
                />
              </div>
            </div>

            {/* Note about photos */}
            <div className="p-4 rounded-xl bg-festive-gold/10 border border-festive-gold/30 flex items-start gap-3 text-xs text-festive-cream/85">
              <span className="text-festive-gold text-base">📸</span>
              <div>
                <span className="font-semibold text-festive-goldLight block mb-0.5">
                  {isHi ? "फोटो कैसे भेजें?" : "How to send your photos?"}
                </span>
                <span>
                  {isHi
                    ? "सुरक्षा एवं उच्च रिज़ॉल्यूशन के लिए, फॉर्म सबमिट करने के तुरंत बाद आप अपनी फोटो सीधे हमारे आधिकारिक WhatsApp पर भेज सकेंगे।"
                    : "For maximum photo quality & ease, you can send your high-resolution photos directly on WhatsApp right after submitting this form."}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-festive-gold via-amber-400 to-festive-goldDark text-festive-wine font-bold text-sm sm:text-base shadow-gold-glow hover:brightness-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-lg">🪔</span>
                  <span>{isHi ? "आवेदन भेजा जा रहा है..." : "Submitting Application..."}</span>
                </>
              ) : (
                <>
                  <span>{isHi ? "आवेदन सबमिट करें" : "Submit Card Request"}</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
