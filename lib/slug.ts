import { customAlphabet } from "nanoid";

// 4 random lowercase alphanumeric characters
const generateNanoSuffix = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  4
);

/**
 * Sanitizes an input string into URL-friendly lowercase slug component.
 */
function sanitizeSegment(str: string): string {
  return str
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars
    .replace(/[\s_-]+/g, "-")  // collapse spaces & underscores to hyphens
    .replace(/^-+|-+$/g, "");  // trim leading/trailing hyphens
}

/**
 * Generates a URL-friendly slug from one or two names followed by 4 random chars.
 * e.g. makeSlug("Aarav", "Diya") -> "aarav-diya-x7k2"
 */
export function makeSlug(name1: string, name2?: string): string {
  const segment1 = sanitizeSegment(name1 || "");
  const segment2 = name2 ? sanitizeSegment(name2) : "";

  const base = [segment1, segment2].filter(Boolean).join("-") || "invite";
  const suffix = generateNanoSuffix();

  return `${base}-${suffix}`;
}

export default makeSlug;
