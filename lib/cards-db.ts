import { supabaseAdmin } from "@/lib/supabase/admin";
import { CardRecord, CardData, EventType } from "@/types/card";
import { updateCardRequest } from "@/lib/requests-db";

/**
 * Extracts storage paths from card data so we can delete them when card is deleted
 */
function extractPhotoStoragePaths(data: CardData): string[] {
  const urls: string[] = [];
  if (data.heroPhoto) urls.push(data.heroPhoto);
  if (data.groomPhoto) urls.push(data.groomPhoto);
  if (data.bridePhoto) urls.push(data.bridePhoto);
  if (data.photo1) urls.push(data.photo1);
  if (data.photo2) urls.push(data.photo2);
  if (Array.isArray(data.gallery)) urls.push(...data.gallery);
  if (Array.isArray(data.events)) {
    data.events.forEach((ev) => {
      if (ev.photo) urls.push(ev.photo);
    });
  }

  const paths: string[] = [];
  urls.forEach((url) => {
    // URL format: .../storage/v1/object/public/card-photos/<folder>/<filename>
    const match = url.match(/card-photos\/(.+)$/);
    if (match && match[1]) {
      paths.push(match[1]);
    }
  });

  return Array.from(new Set(paths));
}

export async function createCardRecord(input: {
  slug: string;
  type: EventType;
  data: CardData;
  customer_name?: string | null;
  request_id?: string | null;
  is_published?: boolean;
}): Promise<CardRecord> {
  const supabase = supabaseAdmin;
  const customerName = input.customer_name || input.data.customerName || null;
  const requestId = input.request_id || null;
  const isPublished = input.is_published !== undefined ? input.is_published : true;

  // Enrich data with metadata copies as fallback
  const enrichedData = {
    ...input.data,
    customerName: customerName || undefined,
    is_published: isPublished,
  } as unknown as CardData;

  const insertPayload: Record<string, unknown> = {
    slug: input.slug,
    type: input.type,
    data: enrichedData,
  };

  // Attempt insert with new columns
  insertPayload.customer_name = customerName;
  insertPayload.request_id = requestId;
  insertPayload.is_published = isPublished;

  let resultCard: CardRecord | null = null;

  const { data, error } = await supabase
    .from("cards")
    .insert([insertPayload])
    .select("*")
    .single();

  if (!error && data) {
    resultCard = data as CardRecord;
  } else if (
    error &&
    (error.code === "42703" ||
      error.code === "PGRST204" ||
      error.message?.includes("column"))
  ) {
    // Column does not exist on remote DB yet -> fallback to basic insert
    console.warn(
      "Remote cards table missing new columns, storing in JSON data fallback:",
      error.message
    );
    const fallbackPayload = {
      slug: input.slug,
      type: input.type,
      data: enrichedData,
      edit_token: "admin-managed",
    };
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("cards")
      .insert([fallbackPayload])
      .select("*")
      .single();

    if (fallbackError) {
      throw fallbackError;
    }
    resultCard = {
      ...(fallbackData as CardRecord),
      customer_name: customerName,
      request_id: requestId,
      is_published: isPublished,
    };
  } else if (error) {
    throw error;
  }

  if (!resultCard) {
    throw new Error("Failed to insert card record.");
  }

  // If created from request, link card and mark request done
  if (requestId) {
    try {
      await updateCardRequest(requestId, {
        card_id: resultCard.id,
        status: "done",
      });
    } catch (err) {
      console.warn("Failed to update originating request status:", err);
    }
  }

  return resultCard;
}

export async function getAllCards(filters?: {
  type?: string;
  search?: string;
}): Promise<CardRecord[]> {
  const supabase = supabaseAdmin;
  let query = supabase
    .from("cards")
    .select("*")
    .neq("type", "request")
    .order("created_at", { ascending: false });

  if (filters?.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  let cards = (data || []) as CardRecord[];

  // Normalize fallback columns if needed
  cards = cards.map((c) => {
    const rawData = (c.data as unknown as Record<string, unknown>) || {};
    const isPubFromData = rawData.is_published as boolean | undefined;
    return {
      ...c,
      customer_name: c.customer_name || (rawData.customerName as string) || null,
      is_published:
        c.is_published !== undefined && c.is_published !== null
          ? c.is_published
          : isPubFromData !== undefined
          ? isPubFromData
          : true,
    };
  });

  if (filters?.search && filters.search.trim()) {
    const s = filters.search.toLowerCase().trim();
    cards = cards.filter((c) => {
      const cust = (c.customer_name || "").toLowerCase();
      const slug = (c.slug || "").toLowerCase();
      const title = (
        c.data?.groomName ||
        c.data?.personName ||
        c.data?.familyName ||
        ""
      ).toLowerCase();
      return cust.includes(s) || slug.includes(s) || title.includes(s);
    });
  }

  return cards;
}

export async function getLatestCardByType(type: EventType): Promise<CardRecord | null> {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return null;
  }

  const cards = data as CardRecord[];
  const publishedCard = cards.find((c) => {
    const rawData = (c.data as unknown as Record<string, unknown>) || {};
    const isPub =
      c.is_published !== undefined && c.is_published !== null
        ? c.is_published
        : rawData.is_published !== undefined
        ? (rawData.is_published as boolean)
        : true;
    return isPub;
  });

  const card = publishedCard || cards[0];
  if (!card) return null;

  const rawData = (card.data as unknown as Record<string, unknown>) || {};
  return {
    ...card,
    customer_name: card.customer_name || (rawData.customerName as string) || null,
    is_published: true,
  };
}

export async function getPublishedCards(limit: number = 6): Promise<CardRecord[]> {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .neq("type", "request")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const cards = (data as CardRecord[])
    .map((c) => {
      const rawData = (c.data as unknown as Record<string, unknown>) || {};
      const isPubFromData = rawData.is_published as boolean | undefined;
      return {
        ...c,
        customer_name: c.customer_name || (rawData.customerName as string) || null,
        is_published:
          c.is_published !== undefined && c.is_published !== null
            ? c.is_published
            : isPubFromData !== undefined
            ? isPubFromData
            : true,
      };
    })
    .filter((c) => c.is_published !== false);

  return cards.slice(0, limit);
}

export async function getCardBySlug(slug: string): Promise<CardRecord | null> {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const card = data as CardRecord;
  const rawData = (card.data as unknown as Record<string, unknown>) || {};
  const isPubFromData = rawData.is_published as boolean | undefined;
  return {
    ...card,
    customer_name: card.customer_name || (rawData.customerName as string) || null,
    is_published:
      card.is_published !== undefined && card.is_published !== null
        ? card.is_published
        : isPubFromData !== undefined
        ? isPubFromData
        : true,
  };
}

export async function updateCardBySlug(
  slug: string,
  updates: {
    data?: CardData;
    customer_name?: string | null;
    is_published?: boolean;
  }
): Promise<CardRecord> {
  const supabase = supabaseAdmin;

  // Fetch existing card first to merge with existing data safely
  const existing = await getCardBySlug(slug);
  const existingData =
    (existing?.data as unknown as Record<string, unknown>) || {};
  const baseData =
    (updates.data as unknown as Record<string, unknown>) || existingData;

  const mergedData = {
    ...baseData,
    ...(updates.customer_name !== undefined
      ? { customerName: updates.customer_name }
      : {}),
    ...(updates.is_published !== undefined
      ? { is_published: updates.is_published }
      : {}),
  };

  const updatePayload: Record<string, unknown> = {
    data: mergedData,
  };
  if (updates.customer_name !== undefined) {
    updatePayload.customer_name = updates.customer_name;
  }
  if (updates.is_published !== undefined) {
    updatePayload.is_published = updates.is_published;
  }

  let { data, error } = await supabase
    .from("cards")
    .update(updatePayload)
    .eq("slug", slug)
    .select("*")
    .single();

  if (
    error &&
    (error.code === "42703" ||
      error.code === "PGRST204" ||
      error.message?.includes("column"))
  ) {
    // If remote DB missing column, omit it but keep data: mergedData
    delete updatePayload.customer_name;
    delete updatePayload.is_published;
    const retry = await supabase
      .from("cards")
      .update(updatePayload)
      .eq("slug", slug)
      .select("*")
      .single();

    data = retry.data;
    error = retry.error;
  }

  if (error || !data) {
    throw error || new Error("Failed to update card.");
  }

  const updatedRecord = data as CardRecord;
  return {
    ...updatedRecord,
    customer_name:
      updates.customer_name !== undefined
        ? updates.customer_name
        : updatedRecord.customer_name ||
          (mergedData.customerName as string) ||
          null,
    is_published:
      updates.is_published !== undefined
        ? updates.is_published
        : updatedRecord.is_published !== undefined &&
          updatedRecord.is_published !== null
        ? updatedRecord.is_published
        : (mergedData.is_published as boolean | undefined) ?? true,
  };
}

export async function deleteCardBySlug(slug: string): Promise<boolean> {
  const supabase = supabaseAdmin;

  // 1. Fetch card first to get photo URLs
  const { data: card } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (card && card.data) {
    // 2. Remove photos from Supabase Storage
    const photoPaths = extractPhotoStoragePaths(card.data as CardData);
    if (photoPaths.length > 0) {
      try {
        await supabase.storage.from("card-photos").remove(photoPaths);
      } catch (storageErr) {
        console.warn("Error deleting photos from storage bucket:", storageErr);
      }
    }
  }

  // 3. Delete card from database
  const { error } = await supabase.from("cards").delete().eq("slug", slug);
  if (error) {
    throw error;
  }

  return true;
}

export async function duplicateCardBySlug(slug: string): Promise<CardRecord> {
  const original = await getCardBySlug(slug);
  if (!original) {
    throw new Error("Card not found to duplicate.");
  }

  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const newSlug = `${original.slug}-copy-${randomSuffix}`;
  const newCustomerName = `${original.customer_name || "Customer"} (Copy)`;

  return await createCardRecord({
    slug: newSlug,
    type: original.type,
    data: {
      ...original.data,
      customerName: newCustomerName,
    },
    customer_name: newCustomerName,
    is_published: original.is_published,
  });
}
