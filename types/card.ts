export type EventType = "wedding" | "birthday" | "ghar";
export type Lang = "en" | "hi";

export interface EventItem {
  id: string;
  title: string; // e.g. "Mehndi Ki Raat"
  tagline?: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // "18:00"
  venue: string;
  photo?: string; // public URL
}

export interface ScheduleItem {
  id: string;
  time: string; // e.g. "8:00 PM"
  title: string;
  desc?: string;
}

export interface CardData {
  type: EventType;
  lang: Lang;
  // wedding
  groomName?: string;
  brideName?: string;
  groomParents?: string;
  brideParents?: string;
  groomInsta?: string;
  brideInsta?: string;
  groomPhoto?: string;
  bridePhoto?: string;
  // birthday
  personName?: string;
  role?: "Girl" | "Boy" | "Man" | "Woman"; // shown as "The Birthday Girl"
  age?: number;
  themeVariant?: string;
  // ghar
  functionName?: string;
  familyName?: string;
  muhurat?: string;
  // shared celebration details
  hostName?: string; // e.g. "Mr. & Mrs. Sharma"
  dressCode?: string; // e.g. "Traditional / Ethnic" or "Party Chic"
  rsvpBy?: string; // e.g. "14th November"
  timeText?: string; // e.g. "7:00 PM onwards"
  photo1?: string; // pair photos: Then (childhood) or Old Home
  photo2?: string; // pair photos: Now or New Home
  thenCaption?: string; // e.g. "Where the story began"
  nowCaption?: string; // e.g. "Still the heart of every party"
  schedule?: ScheduleItem[]; // timeline for birthday and ghar
  // common
  heroPhoto?: string;
  message?: string;
  hashtag?: string;
  mainDate: string; // ISO datetime with timezone
  venueName: string;
  venueAddress: string;
  mapQuery?: string;
  events?: EventItem[]; // kept for Wedding itinerary only
  gallery: string[]; // public URLs, max 12
  contactName: string;
  contactPhone: string; // wa.me number without + for direct WhatsApp RSVP
  contactEmail?: string;
  rsvpEnabled?: boolean;
  musicUrl?: string;
  customerName?: string; // admin reference
}

export interface CardRecord {
  id: string;
  slug: string;
  type: EventType;
  data: CardData;
  customer_name?: string | null;
  request_id?: string | null;
  is_published?: boolean;
  edit_token?: string | null;
  created_at: string;
}

export type RequestStatus = "new" | "in_progress" | "done" | "rejected";

export interface CardRequestDetails {
  // wedding extras
  groomName?: string;
  brideName?: string;
  groomParents?: string;
  brideParents?: string;
  eventsWanted?: string[];
  // birthday extras
  personName?: string;
  age?: number;
  theme?: string;
  // ghar extras
  functionName?: string;
  familyName?: string;
  muhurat?: string;
  [key: string]: unknown;
}

export interface CardRequestRecord {
  id: string;
  type: EventType;
  name: string;
  phone: string;
  email?: string | null;
  event_date?: string | null;
  city?: string | null;
  venue?: string | null;
  details: CardRequestDetails;
  notes?: string | null;
  status: RequestStatus;
  card_id?: string | null;
  admin_note?: string | null;
  created_at: string;
}

export interface RsvpRecord {
  id: string;
  card_id: string;
  guest_name: string;
  attending: boolean;
  guests_count: number;
  created_at: string;
}
