import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`rsvp_${ip}`, 20, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many RSVP attempts. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { slug, card_id, guest_name, attending, guests_count } = body;

    const trimmedName = (guest_name || "").trim();
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!card_id && !slug) {
      return NextResponse.json(
        { error: "Card identifier (slug or card_id) is required." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;
    let resolvedCardId = card_id;

    // Resolve card_id from slug if not provided directly
    if (!resolvedCardId && slug) {
      const { data: card, error: cardError } = await supabase
        .from("cards")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (cardError || !card) {
        return NextResponse.json(
          { error: "Invitation card not found." },
          { status: 404 }
        );
      }
      resolvedCardId = card.id;
    }

    const parsedCount = Math.max(1, Math.min(20, Number(guests_count) || 1));
    const isAttending = attending === true || attending === "true" || attending === "yes";

    const { data: newRsvp, error: insertError } = await supabase
      .from("rsvps")
      .insert([
        {
          card_id: resolvedCardId,
          guest_name: trimmedName,
          attending: isAttending,
          guests_count: isAttending ? parsedCount : 0,
        },
      ])
      .select("id, card_id, guest_name, attending, guests_count, created_at")
      .single();

    if (insertError) {
      console.error("Database error inserting RSVP:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Failed to submit RSVP." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        rsvp: newRsvp,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("POST /api/rsvp error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required to view RSVPs." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // Verify card exists
    const { data: card, error: cardError } = await supabase
      .from("cards")
      .select("id, slug, type, data, created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (cardError || !card) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    // Fetch RSVPs
    const { data: rsvps, error: rsvpsError } = await supabase
      .from("rsvps")
      .select("*")
      .eq("card_id", card.id)
      .order("created_at", { ascending: false });

    if (rsvpsError) {
      return NextResponse.json({ error: rsvpsError.message }, { status: 500 });
    }

    const list = rsvps || [];
    let totalConfirmedGuests = 0;
    let totalAttending = 0;
    let totalDeclined = 0;

    for (const r of list) {
      if (r.attending) {
        totalAttending += 1;
        totalConfirmedGuests += r.guests_count || 1;
      } else {
        totalDeclined += 1;
      }
    }

    return NextResponse.json({
      success: true,
      card: {
        id: card.id,
        slug: card.slug,
        type: card.type,
        data: card.data,
      },
      rsvps: list,
      stats: {
        totalResponses: list.length,
        totalConfirmedGuests,
        totalAttending,
        totalDeclined,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
