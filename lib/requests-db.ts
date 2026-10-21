import { supabaseAdmin } from "@/lib/supabase/admin";
import { CardRequestRecord, EventType } from "@/types/card";

/**
 * Normalizes request data from either public.requests table or Supabase cards table fallback.
 */
function normalizeRequest(raw: Record<string, unknown>): CardRequestRecord {
  // If stored in cards table fallback, the full record is in raw.data
  if (raw.type === "request" && raw.data && typeof raw.data === "object") {
    const d = raw.data as Record<string, unknown>;
    return {
      id: (d.id as string) || (raw.id as string),
      type: (d.type as EventType) || "wedding",
      name: (d.name as string) || "",
      phone: (d.phone as string) || "",
      email: (d.email as string) || null,
      event_date: (d.event_date as string) || null,
      city: (d.city as string) || null,
      venue: (d.venue as string) || null,
      details: (d.details as Record<string, unknown>) || {},
      notes: (d.notes as string) || null,
      status: (d.status as "new" | "in_progress" | "done" | "rejected") || "new",
      card_id: (d.card_id as string) || null,
      admin_note: (d.admin_note as string) || null,
      created_at:
        (d.created_at as string) ||
        (raw.created_at as string) ||
        new Date().toISOString(),
    };
  }

  // From public.requests table
  return {
    id: raw.id as string,
    type: raw.type as EventType,
    name: raw.name as string,
    phone: raw.phone as string,
    email: (raw.email as string) || null,
    event_date: (raw.event_date as string) || null,
    city: (raw.city as string) || null,
    venue: (raw.venue as string) || null,
    details: (raw.details as Record<string, unknown>) || {},
    notes: (raw.notes as string) || null,
    status: (raw.status as "new" | "in_progress" | "done" | "rejected") || "new",
    card_id: (raw.card_id as string) || null,
    admin_note: (raw.admin_note as string) || null,
    created_at: (raw.created_at as string) || new Date().toISOString(),
  };
}

export async function createCardRequest(input: {
  type: EventType;
  name: string;
  phone: string;
  email?: string | null;
  event_date?: string | null;
  city?: string | null;
  venue?: string | null;
  details: Record<string, unknown>;
  notes?: string | null;
}): Promise<CardRequestRecord> {
  const newRecord: CardRequestRecord = {
    id: crypto.randomUUID(),
    type: input.type,
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    event_date: input.event_date || null,
    city: input.city || null,
    venue: input.venue || null,
    details: input.details || {},
    notes: input.notes || null,
    status: "new",
    card_id: null,
    admin_note: null,
    created_at: new Date().toISOString(),
  };

  const supabase = supabaseAdmin;

  // 1. Try public.requests table
  const { data, error } = await supabase
    .from("requests")
    .insert([newRecord])
    .select("*")
    .single();

  if (!error && data) {
    return normalizeRequest(data as Record<string, unknown>);
  }

  // 2. Fallback: store directly in Supabase cards table with type = 'request'
  const { data: fallbackData, error: fallbackError } = await supabase
    .from("cards")
    .insert([
      {
        id: newRecord.id,
        slug: `req-${newRecord.id}`,
        type: "request",
        edit_token: "request",
        data: newRecord,
        created_at: newRecord.created_at,
      },
    ])
    .select("*")
    .single();

  if (fallbackError) {
    console.error("Failed to store request in Supabase:", fallbackError.message);
    throw fallbackError;
  }

  return normalizeRequest(fallbackData as Record<string, unknown>);
}

export async function getAllCardRequests(filters?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<CardRequestRecord[]> {
  const supabase = supabaseAdmin;
  let list: CardRequestRecord[] = [];

  // 1. Try public.requests table
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error && data) {
    list = (data as Record<string, unknown>[]).map(normalizeRequest);
  } else {
    // 2. Fallback: query requests from Supabase cards table
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("cards")
      .select("*")
      .eq("type", "request")
      .order("created_at", { ascending: false });

    if (!fallbackError && fallbackData) {
      list = (fallbackData as Record<string, unknown>[]).map(normalizeRequest);
    }
  }

  // Apply filters in memory
  if (filters?.status && filters.status !== "all") {
    list = list.filter((r) => r.status === filters.status);
  }
  if (filters?.type && filters.type !== "all") {
    list = list.filter((r) => r.type === filters.type);
  }
  if (filters?.search && filters.search.trim()) {
    const s = filters.search.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.phone.toLowerCase().includes(s) ||
        (r.city && r.city.toLowerCase().includes(s))
    );
  }

  return list;
}

export async function getCardRequestById(
  id: string
): Promise<CardRequestRecord | null> {
  const supabase = supabaseAdmin;

  // 1. Try public.requests table
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!error && data) {
    return normalizeRequest(data as Record<string, unknown>);
  }

  // 2. Fallback: try cards table
  const { data: fallbackData, error: fallbackError } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", `req-${id}`)
    .maybeSingle();

  if (!fallbackError && fallbackData) {
    return normalizeRequest(fallbackData as Record<string, unknown>);
  }

  return null;
}

export async function updateCardRequest(
  id: string,
  updates: Partial<CardRequestRecord>
): Promise<CardRequestRecord | null> {
  const supabase = supabaseAdmin;

  // 1. Try public.requests table
  const { data, error } = await supabase
    .from("requests")
    .update(updates)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (!error && data) {
    return normalizeRequest(data as Record<string, unknown>);
  }

  // 2. Fallback: update in Supabase cards table
  const existing = await getCardRequestById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  const { data: fallbackData, error: fallbackError } = await supabase
    .from("cards")
    .update({ data: merged })
    .eq("slug", `req-${id}`)
    .select("*")
    .maybeSingle();

  if (!fallbackError && fallbackData) {
    return normalizeRequest(fallbackData as Record<string, unknown>);
  }

  return null;
}

export async function deleteCardRequest(id: string): Promise<boolean> {
  const supabase = supabaseAdmin;

  // 1. Try public.requests table
  const { error } = await supabase.from("requests").delete().eq("id", id);
  if (!error) {
    // Also delete any fallback card record if present
    try {
      await supabase.from("cards").delete().eq("slug", `req-${id}`);
    } catch {
      // Ignore
    }
    return true;
  }

  // 2. Fallback: delete from cards table
  const { error: fallbackError } = await supabase
    .from("cards")
    .delete()
    .eq("slug", `req-${id}`);

  return !fallbackError;
}
