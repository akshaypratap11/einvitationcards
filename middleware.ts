import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/assets (*.svg, *.png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method.toUpperCase();

  // 1. Refresh Supabase session on every request
  const { supabaseResponse, user } = await updateSession(req);

  // 2. Allow login page without auth (if already logged in, redirect to /admin)
  if (pathname === "/admin/login") {
    if (user) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return supabaseResponse;
  }

  // 3. Allow password reset page without requiring pre-existing session
  if (pathname === "/admin/reset-password") {
    return supabaseResponse;
  }

  // 4. Public auth API endpoints (/api/auth/login, etc.)
  if (pathname.startsWith("/api/auth/")) {
    return supabaseResponse;
  }

  // 5. Allow public application submission POST /api/requests
  if (pathname === "/api/requests" && method === "POST") {
    return supabaseResponse;
  }

  // 6. Protect Admin & Studio Pages: /admin/*, /create, /create/*, /edit/*
  const isProtectedPage =
    pathname.startsWith("/admin") ||
    pathname === "/create" ||
    pathname.startsWith("/create/") ||
    pathname.startsWith("/edit");

  if (isProtectedPage && !user) {
    const loginUrl = new URL("/admin/login", req.url);
    const destination = pathname + (req.nextUrl.search || "");
    loginUrl.searchParams.set("from", destination);
    return NextResponse.redirect(loginUrl);
  }

  // 7. Protect Write/Admin API Routes
  const isProtectedApi =
    (pathname.startsWith("/api/cards") && method !== "GET") ||
    pathname.startsWith("/api/upload") ||
    (pathname.startsWith("/api/requests") && (method === "GET" || method === "PATCH" || method === "DELETE"));

  if (isProtectedApi && !user) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }

  return supabaseResponse;
}
