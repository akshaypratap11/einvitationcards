import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createCardRequest, getAllCardRequests } from "@/lib/requests-db";
import { requireAdmin } from "@/lib/require-admin";

// Public request submission schema
const CreateRequestSchema = z.object({
  type: z.enum(["wedding", "birthday", "ghar"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s\-\+]/g, ""))
    .refine((val) => {
      // Allow 10 digits or 12 digits starting with 91
      const clean = val.startsWith("91") && val.length === 12 ? val.slice(2) : val;
      return /^[6-9]\d{9}$/.test(clean);
    }, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  event_date: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  venue: z.string().optional().or(z.literal("")),
  details: z.record(z.string(), z.unknown()).default({}),
  notes: z.string().optional().or(z.literal("")),
  // Honeypot field - must be empty
  website: z.string().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit: 3 requests per hour per IP
    const rateLimit = checkRateLimit(`request_${ip}`, 3, 60 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Too many requests from your IP. You can submit up to 3 requests per hour. Please try again later or contact us directly on WhatsApp.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));

    // Honeypot check: bot prevention
    if (body.website && String(body.website).trim().length > 0) {
      // Silently reject bots
      return NextResponse.json(
        { success: true, id: "req-spam-filtered", shortId: "spam" },
        { status: 200 }
      );
    }

    const parseResult = CreateRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues?.[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = parseResult.data;

    // Normalize phone number
    let cleanPhone = data.phone.replace(/[\s\-\+]/g, "");
    if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.slice(2);
    }

    const saved = await createCardRequest({
      type: data.type,
      name: data.name.trim(),
      phone: cleanPhone,
      email: data.email?.trim() || null,
      event_date: data.event_date || null,
      city: data.city?.trim() || null,
      venue: data.venue?.trim() || null,
      details: data.details,
      notes: data.notes?.trim() || null,
    });

    return NextResponse.json(
      {
        success: true,
        id: saved.id,
        shortId: saved.id.slice(0, 8),
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Admin only
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";
    const search = searchParams.get("search") || "";

    const requests = await getAllCardRequests({ status, type, search });
    return NextResponse.json({ success: true, requests });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
