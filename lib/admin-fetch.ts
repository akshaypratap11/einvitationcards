/**
 * Browser-side fetch wrapper for admin requests.
 * If an admin API call returns a 401 Unauthorized, shows a friendly
 * "Session expired, please log in again" notification and redirects to /admin/login.
 */
export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  onSessionExpired?: (msg: string) => void
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401 && typeof window !== "undefined") {
    const isLoginPage = window.location.pathname === "/admin/login";
    if (!isLoginPage) {
      const msg = "Session expired, please log in again";
      if (onSessionExpired) {
        onSessionExpired(msg);
      }
      const destination = window.location.pathname + window.location.search;
      setTimeout(() => {
        window.location.href = `/admin/login?from=${encodeURIComponent(destination)}`;
      }, 800);
    }
  }

  return res;
}
