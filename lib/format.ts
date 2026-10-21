import { CardData, Lang } from "@/types/card";

/**
 * Format a date string into a clean numeric dotted format: "21 · 11 · 2026"
 */
export function dateShort(dateStr?: string): string {
  if (!dateStr) return "21 · 11 · 2026";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day} · ${month} · ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Hindi day names
 */
const HINDI_DAYS = [
  "रविवार",
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
];

/**
 * Hindi month names
 */
const HINDI_MONTHS = [
  "जनवरी",
  "फ़रवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

/**
 * Format a date string into an elegant long date format:
 * - English: "Saturday, 21st November 2026"
 * - Hindi: "शनिवार, 21 नवंबर 2026"
 */
export function dateLong(dateStr?: string, lang: Lang = "en"): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    if (lang === "hi") {
      const dayName = HINDI_DAYS[d.getDay()];
      const day = d.getDate();
      const monthName = HINDI_MONTHS[d.getMonth()];
      const year = d.getFullYear();
      return `${dayName}, ${day} ${monthName} ${year}`;
    }

    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
    const day = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "long" });
    const year = d.getFullYear();

    // English ordinal suffix: 1st, 2nd, 3rd, 4th, 21st...
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${weekday}, ${day}${suffix} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Format time string ("18:00") into 12-hour format ("6:00 PM")
 */
export function formatTime12h(timeStr?: string): string {
  if (!timeStr) return "";
  try {
    // If already in 12-hour format with AM/PM
    if (/am|pm/i.test(timeStr)) {
      return timeStr.trim();
    }
    const [hh, mm] = timeStr.split(":");
    if (hh === undefined) return timeStr;
    let hour = parseInt(hh, 10);
    const minute = mm ? mm.padStart(2, "0") : "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  } catch {
    return timeStr;
  }
}

/**
 * Build dynamic Google Calendar URL for Add to Calendar button from CardData
 */
export function googleCalendarUrl(data: CardData): string {
  try {
    let title = "Celebration Invitation";
    if (data.type === "wedding") {
      title = `${data.groomName || "Groom"} & ${data.brideName || "Bride"}’s Wedding`;
    } else if (data.type === "birthday") {
      const star = data.personName || "Birthday Star";
      const ageStr = data.age ? `${data.age}th ` : "";
      title = `${star}’s ${ageStr}Birthday Celebration`;
    } else if (data.type === "ghar") {
      title = `${data.functionName || "Griha Pravesh"} – ${data.familyName || "Family"}`;
    }

    const start = new Date(data.mainDate || Date.now());
    if (isNaN(start.getTime())) return "https://calendar.google.com";

    // 4 hours default celebration duration
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
    const formatUtc = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

    const dates = `${formatUtc(start)}/${formatUtc(end)}`;
    const location = [data.venueName, data.venueAddress]
      .filter(Boolean)
      .join(", ");
    const details =
      data.message ||
      (data.hostName
        ? `Hosted by ${data.hostName}. You are cordially invited to celebrate with us.`
        : "You are cordially invited to celebrate with us.");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${dates}&location=${encodeURIComponent(
      location
    )}&details=${encodeURIComponent(details)}`;
  } catch {
    return "https://calendar.google.com";
  }
}

/**
 * Build dynamic Google Maps directions URL from CardData
 */
export function googleMapsDirectionsUrl(data: CardData): string {
  const destination =
    data.mapQuery ||
    [data.venueName, data.venueAddress].filter(Boolean).join(", ") ||
    data.venueName ||
    "Celebration Venue";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination
  )}`;
}

/**
 * Build direct WhatsApp click-to-chat URL using contactPhone
 * Cleans the phone number to digits only (wa.me number without +)
 */
export function whatsappUrl(phone?: string, text?: string): string {
  if (!phone) return "#";
  let clean = phone.replace(/[^\d]/g, "");
  // If Indian 10-digit number without country code, prefix 91
  if (clean.length === 10) {
    clean = `91${clean}`;
  }
  if (!clean) return "#";
  const url = `https://wa.me/${clean}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}
