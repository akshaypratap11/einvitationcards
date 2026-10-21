"use client";

import React, { useState } from "react";
import GrihaPravesh from "@/components/templates/GrihaPravesh";
import { CardData, Lang } from "@/types/card";

export default function GharPreviewPage() {
  const [lang, setLang] = useState<Lang>("hi");
  const [replayKey, setReplayKey] = useState(0);

  // Rich sample data for Griha Pravesh & Puja
  const sampleData: CardData = {
    type: "ghar",
    lang,
    functionName:
      lang === "hi"
        ? "गृह प्रवेश एवं वास्तु शांति पूजा"
        : "Griha Pravesh & Vastu Shanti Puja",
    familyName:
      lang === "hi" ? "शर्मा परिवार" : "The Sharma Family",
    muhurat:
      lang === "hi"
        ? "प्रातः 09:15 से 11:45 बजे (शुभ अभिजीत मुहूर्त)"
        : "09:15 AM to 11:45 AM (Auspicious Abhijit Muhurat)",
    message:
      lang === "hi"
        ? "ईश्वर की असीम अनुकंपा एवं पूज्य बुजुर्गों के स्नेहिल आशीर्वाद से, हम अपने नवनिर्मित गृह में प्रवेश करने जा रहे हैं। इस मांगलिक अवसर पर आपकी गरिमामयी उपस्थिति एवं पावन आशीर्वाद हमारे लिए परम सौभाग्य होगा।"
        : "With the divine blessings of Lord Ganesha and our beloved elders, we are stepping into our new home. We warmly request the honour of your presence to bless our new abode and celebrate with us.",
    heroPhoto:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    mainDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    venueName: "‘आशीर्वाद निवास’ • Aashirwad Niwas, Villa #42",
    venueAddress: "Shree Ram Enclave, Near Iskcon Temple, Sector 62, Noida, Uttar Pradesh",
    mapQuery: "Shree Ram Enclave, Sector 62, Noida",
    events: [
      {
        id: "ev-1",
        title: lang === "hi" ? "वास्तु शांति एवं गणेश हवन" : "Vastu Shanti & Ganapati Havan",
        tagline: lang === "hi" ? "पावन वेदमंत्रोच्चार एवं नवग्रह पूजन" : "Vedic chants and sacred purification fire",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "08:30",
        venue: "Pooja Hall & Courtyard",
      },
      {
        id: "ev-2",
        title: lang === "hi" ? "द्वार प्रवेश एवं कलश स्थापना" : "Dwar Pravesh & Kalash Sthapana",
        tagline: lang === "hi" ? "शुभ मुहूर्त में गृह प्रवेश" : "Auspicious home entry with Kalash",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "10:15",
        venue: "Main Entrance (Dwar)",
      },
      {
        id: "ev-3",
        title: lang === "hi" ? "महाआरती एवं महाप्रसाद भोज" : "Maha Aarti & Mahaprasad Bhoj",
        tagline: lang === "hi" ? "सपरिवार प्रीतिभोज एवं सत्संग" : "Traditional feast and devotional celebrations",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "12:30",
        venue: "Garden Pavilion",
      },
    ],
    hostName: lang === "hi" ? "श्री रमेश एवं सुनीता शर्मा" : "Mr. Ramesh & Mrs. Sunita Sharma",
    dressCode: lang === "hi" ? "पारंपरिक भारतीय परिधान (Traditional / Ethnic)" : "Traditional Ethnic / Festive Attire",
    rsvpBy: "20th November",
    timeText: lang === "hi" ? "प्रातः 8:30 बजे से" : "8:30 AM onwards",
    photo1: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80",
    photo2: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    schedule: [
      {
        id: "sch-1",
        time: "8:30 AM",
        title: lang === "hi" ? "गणेश पूजन एवं कलश स्थापना" : "Ganesh Pooja & Kalash Sthapana",
        desc: lang === "hi" ? "विघ्नहर्ता श्री गणेश जी का आह्वान एवं पवित्र घट स्थापना" : "Invoking Lord Ganesha and sacred pot installation",
      },
      {
        id: "sch-2",
        time: "10:00 AM",
        title: lang === "hi" ? "वास्तु शांति हवन" : "Vastu Shanti Havan",
        desc: lang === "hi" ? "गृह शुद्धि एवं सकारात्मक ऊर्जा हेतु वैदिक आहुति" : "Purification fire ritual for positive energy",
      },
      {
        id: "sch-3",
        time: "11:30 AM",
        title: lang === "hi" ? "गृह प्रवेश एवं देहरी पूजन" : "Griha Pravesh & Dwar Pooja",
        desc: lang === "hi" ? "मंगल कलश के साथ नूतन गृह में पदार्पण" : "Entering the new home with holy kalash",
      },
      {
        id: "sch-4",
        time: "12:15 PM",
        title: lang === "hi" ? "आरती एवं आशीर्वाद" : "Aarti & Blessings",
        desc: lang === "hi" ? "प्रभु वंदना एवं पूज्य बुजुर्गों का आशीष" : "Sacred lamps and blessings from elders",
      },
      {
        id: "sch-5",
        time: "1:00 PM",
        title: lang === "hi" ? "महाप्रसाद एवं सुरुचि भोजन" : "Prasad & Mahabhoj",
        desc: lang === "hi" ? "सपरिवार स्नेहिल भोज" : "Traditional auspicious vegetarian feast",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80",
    ],
    contactName: "रमेश एवं सुनीता शर्मा • Ramesh Sharma",
    contactPhone: "+91 75210 38818",
    contactEmail: "sharma.home@family.com",
    rsvpEnabled: true,
  };

  return (
    <div className="relative min-h-screen">
      {/* Top Floating Control Bar for Demo / Testing */}
      <aside 
        aria-label="Ghar Preview Controls"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100000] bg-black/85 backdrop-blur-md border border-amber-400/40 px-3 sm:px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-4 text-xs font-semibold text-white max-w-[95vw] overflow-x-auto"
      >
        <span className="text-amber-300 font-bold whitespace-nowrap flex items-center gap-1.5">
          <span>🪔</span>
          <span>Ghar Preview Controls:</span>
        </span>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setLang("hi")}
            className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
              lang === "hi"
                ? "bg-amber-400 text-stone-900 font-bold shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            हिन्दी (Hindi)
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
              lang === "en"
                ? "bg-amber-400 text-stone-900 font-bold shadow-sm"
                : "text-white/75 hover:text-white"
            }`}
          >
            English
          </button>
        </div>

        {/* Replay Intro Button */}
        <button
          type="button"
          onClick={() => setReplayKey((k) => k + 1)}
          className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-full transition-colors shrink-0 flex items-center gap-1"
          title="Replay Kalash & Diya lighting animation"
        >
          <span>🏺</span>
          <span>Replay Diya Intro</span>
        </button>
      </aside>

      {/* Render GrihaPravesh Template */}
      <GrihaPravesh
        key={`${lang}-${replayKey}`}
        data={sampleData}
        previewMode={false}
      />
    </div>
  );
}
