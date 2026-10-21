import { Lang } from "@/types/card";

/**
 * Format a date string into an elegant display string like "Saturday, 14th February 2026"
 */
export function formatDisplayDate(dateStr?: string, lang: Lang = "en"): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    if (lang === "hi") {
      return d.toLocaleDateString("hi-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
    const day = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "long" });
    const year = d.getFullYear();

    // Suffix (1st, 2nd, 3rd, 4th...)
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
 * Format date into "DD · MM · YYYY" for intro crest
 */
export function formatIntroDate(dateStr?: string): string {
  if (!dateStr) return "14 · 02 · 2026";
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
 * Format time string ("18:00") into 12-hour format ("6:00 PM")
 */
export function formatDisplayTime(timeStr?: string): string {
  if (!timeStr) return "";
  try {
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
 * Build dynamic Google Calendar URL for Add to Calendar button
 */
export function buildGoogleCalendarUrl(
  title: string,
  startDateStr: string,
  venue: string
): string {
  try {
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return "https://calendar.google.com";

    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4 hours later default
    const formatUtc = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

    const dates = `${formatUtc(start)}/${formatUtc(end)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${dates}&location=${encodeURIComponent(venue)}`;
  } catch {
    return "https://calendar.google.com";
  }
}
