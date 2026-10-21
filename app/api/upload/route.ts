import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireAdmin } from "@/lib/require-admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin session (throws 401 if unauthenticated)
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required to upload photos." },
        { status: 401 }
      );
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || (formData.get("tempId") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // 3. Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 5 MB limit. Please choose a smaller photo." },
        { status: 400 }
      );
    }

    // 4. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file format. Only JPG, PNG, and WebP images are supported.",
        },
        { status: 400 }
      );
    }

    // Determine extension
    let ext = "webp";
    if (file.type === "image/jpeg") ext = "jpg";
    else if (file.type === "image/png") ext = "png";
    else if (file.type === "image/webp") ext = "webp";

    const cleanFolder = folder.replace(/[^a-zA-Z0-9_\-]/g, "");
    const fileName = `${nanoid(12)}.${ext}`;
    const storagePath = `${cleanFolder}/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Use service-role admin client after authorization passes
    const { error: uploadError } = await supabaseAdmin.storage
      .from("card-photos")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Failed to upload photo to storage." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("card-photos")
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: storagePath,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
