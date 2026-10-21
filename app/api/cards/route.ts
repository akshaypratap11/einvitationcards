import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { createCardRecord, getAllCards } from "@/lib/cards-db";

export async function GET(req: NextRequest) {
  try {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { searchParams } = req.nextUrl;
    const type = searchParams.get("type") || "all";
    const search = searchParams.get("search") || "";

    const cards = await getAllCards({ type, search });
    return NextResponse.json({ success: true, cards });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required to create cards." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { slug, type, data, customer_name, request_id } = body;

    if (!slug || !type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: slug, type, and data are required." },
        { status: 400 }
      );
    }

    const newCard = await createCardRecord({
      slug,
      type,
      data,
      customer_name: customer_name || data.customerName,
      request_id,
      is_published: true,
    });

    return NextResponse.json(
      {
        success: true,
        card: newCard,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create card.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
