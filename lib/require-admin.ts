import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export class AdminAuthError extends Error {
  status: number;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AdminAuthError";
    this.status = 401;
  }
}

/**
 * Server-side authorization helper that validates the user session using supabase.auth.getUser().
 * Throws an AdminAuthError with status 401 if no valid user is found.
 * Any authenticated Supabase user is treated as the admin.
 *
 * @returns {Promise<User>} The authenticated Supabase user.
 */
export async function requireAdmin(): Promise<User> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AdminAuthError("Unauthorized. Admin access required.");
  }

  return user;
}

/**
 * Helper for Server Components and Pages to enforce admin authentication.
 * Redirects unauthenticated users to /admin/login.
 */
export async function requireAdminPage(): Promise<User> {
  try {
    return await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
}
