import { EventType } from "@/types/card";

export interface StoredCardItem {
  slug: string;
  edit_token: string;
  type: EventType;
  title: string;
  date: string;
  venue: string;
  photo?: string;
  created_at: string;
}

const STORAGE_KEY = "my-cards";

export function getMyCards(): StoredCardItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to read my-cards from localStorage", err);
    return [];
  }
}

export function saveCardToMyCards(card: StoredCardItem): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getMyCards();
    const filtered = existing.filter((c) => c.slug !== card.slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([card, ...filtered]));
  } catch (err) {
    console.warn("Failed to save card to my-cards", err);
  }
}

export function removeCardFromMyCards(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getMyCards();
    const filtered = existing.filter((c) => c.slug !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn("Failed to remove card from my-cards", err);
  }
}

export function findCardInMyCards(slug: string): StoredCardItem | undefined {
  const cards = getMyCards();
  return cards.find((c) => c.slug === slug);
}
