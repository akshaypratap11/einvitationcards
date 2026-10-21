import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import {
  getCardBySlug,
  updateCardBySlug,
  deleteCardBySlug,
  duplicateCardBySlug,
} from "@/lib/cards-db";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const card = await getCardBySlug(slug);
    if (!card) {
      return NextResponse.json({ error: "Card not found." }, { status: 404 });
    }

    // If card is unpublished and user is not admin, treat as unavailable
    if (card.is_published === false) {
      try {
        await requireAdmin();
      } catch {
        return NextResponse.json(
          { error: "This invitation is not available." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ success: true, card });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required to edit cards." },
        { status: 401 }
      );
    }

    const { slug } = params;
    const body = await req.json().catch(() => ({}));
    const { data, customer_name, is_published } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Card data payload is required." },
        { status: 400 }
      );
    }

    const updated = await updateCardBySlug(slug, {
      data,
      customer_name,
      is_published,
    });

    return NextResponse.json({ success: true, card: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update card.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { slug } = params;
    const body = await req.json().catch(() => ({}));
    const { is_published, customer_name } = body;

    const updated = await updateCardBySlug(slug, {
      customer_name,
      is_published,
    });

    return NextResponse.json({ success: true, card: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to patch card.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required to delete cards." },
        { status: 401 }
      );
    }

    const { slug } = params;
    await deleteCardBySlug(slug);

    return NextResponse.json({ success: true, message: "Card deleted." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete card.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
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
    const action = searchParams.get("action");

    if (action === "duplicate") {
      const duplicated = await duplicateCardBySlug(params.slug);
      return NextResponse.json({ success: true, card: duplicated }, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Action failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
