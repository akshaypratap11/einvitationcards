/**
 * Automated end-to-end verification script for the Admin-Only Invitation Platform
 * with Supabase Auth (Email + Password)
 */

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nimantranutsav.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminUtsav2026!#Secure";

let adminCookie = "";

async function runTests() {
  console.log("=================================================");
  console.log("STARTING TEST SUITE: Admin-Only Platform (Supabase Auth)");
  console.log(`Base URL: ${BASE_URL}`);
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // -----------------------------------------------------------------
  // 1. Logged out security tests
  // -----------------------------------------------------------------
  console.log("--- 1. Testing Unauthenticated Access Restrictions ---");

  // /admin page redirect
  const rAdmin = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  assert(
    rAdmin.status === 307 || rAdmin.status === 302,
    `GET /admin redirects to login (Status: ${rAdmin.status})`
  );
  assert(
    (rAdmin.headers.get("location") || "").includes("/admin/login"),
    `GET /admin location header points to /admin/login (${rAdmin.headers.get("location")})`
  );

  // /create page redirect
  const rCreate = await fetch(`${BASE_URL}/create`, { redirect: "manual" });
  assert(
    rCreate.status === 307 || rCreate.status === 302,
    `GET /create redirects to login (Status: ${rCreate.status})`
  );

  // /edit/sample-slug page redirect
  const rEdit = await fetch(`${BASE_URL}/edit/sample-slug`, { redirect: "manual" });
  assert(
    rEdit.status === 307 || rEdit.status === 302,
    `GET /edit/sample-slug redirects to login (Status: ${rEdit.status})`
  );

  // POST /api/cards without auth -> 401
  const rApiCards = await fetch(`${BASE_URL}/api/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: "test", type: "wedding", data: {} }),
  });
  assert(
    rApiCards.status === 401,
    `POST /api/cards without auth returns 401 Unauthorized (Status: ${rApiCards.status})`
  );

  // POST /api/upload without auth -> 401
  const rApiUpload = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
  });
  assert(
    rApiUpload.status === 401,
    `POST /api/upload without auth returns 401 Unauthorized (Status: ${rApiUpload.status})`
  );

  // PATCH /api/requests/[id] without auth -> 401
  const rApiPatchReq = await fetch(`${BASE_URL}/api/requests/sample-id`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "done" }),
  });
  assert(
    rApiPatchReq.status === 401,
    `PATCH /api/requests without auth returns 401 Unauthorized (Status: ${rApiPatchReq.status})`
  );

  // Reset password page accessible
  const rResetPage = await fetch(`${BASE_URL}/admin/reset-password`);
  assert(
    rResetPage.status === 200,
    `GET /admin/reset-password loads public recovery page (Status: ${rResetPage.status})`
  );

  // -----------------------------------------------------------------
  // 2. Login & Rate Limiting Test
  // -----------------------------------------------------------------
  console.log("\n--- 2. Testing Login Rate Limiting (5 attempts/min/IP) ---");

  let got429 = false;
  const loginTestIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": loginTestIp },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: "wrong-password-attempt" }),
    });
    if (res.status === 429) {
      got429 = true;
      assert(true, `Attempt #${i} returned 429 Too Many Requests as expected`);
      break;
    } else {
      const json = await res.json().catch(() => ({}));
      assert(
        res.status === 401 && json.error === "Invalid email or password",
        `Attempt #${i} rejected with generic error "Invalid email or password"`
      );
    }
  }
  assert(got429, "Rate limiter correctly blocked 6th login attempt with 429");

  // -----------------------------------------------------------------
  // 3. Valid Supabase Auth Login
  // -----------------------------------------------------------------
  console.log("\n--- 3. Testing Valid Admin Authentication (Supabase Auth) ---");
  const rLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  assert(rLogin.status === 200, `Login with correct email/password returns 200 (Status: ${rLogin.status})`);
  
  const setCookie = rLogin.headers.get("set-cookie") || "";
  assert(setCookie.includes("auth-token"), "Set-Cookie header sets Supabase auth token");

  const cookiesList = rLogin.headers.getSetCookie ? rLogin.headers.getSetCookie() : [setCookie];
  adminCookie = cookiesList.map((c) => c.split(";")[0]).join("; ");

  // Verify /admin with cookie now returns 200
  const rAdminAuth = await fetch(`${BASE_URL}/admin`, {
    headers: { Cookie: adminCookie },
  });
  assert(rAdminAuth.status === 200, `GET /admin with session cookie returns 200 OK (Status: ${rAdminAuth.status})`);

  // Verify /create with cookie now returns 200
  const rCreateAuth = await fetch(`${BASE_URL}/create`, {
    headers: { Cookie: adminCookie },
  });
  assert(rCreateAuth.status === 200, `GET /create with session cookie returns 200 OK (Status: ${rCreateAuth.status})`);

  // Verify /admin/login while logged in redirects to /admin
  const rLoginRedirect = await fetch(`${BASE_URL}/admin/login`, {
    headers: { Cookie: adminCookie },
    redirect: "manual",
  });
  assert(
    rLoginRedirect.status === 307 || rLoginRedirect.status === 302,
    `GET /admin/login while logged in redirects to /admin (Status: ${rLoginRedirect.status})`
  );

  // -----------------------------------------------------------------
  // 4. Public Requests Submission Flow
  // -----------------------------------------------------------------
  console.log("\n--- 4. Testing Public Card Application Flow (/api/requests) ---");

  // Request 1: Wedding
  const testIp = `203.0.113.${Math.floor(Math.random() * 200) + 10}`;
  const rWeddingReq = await fetch(`${BASE_URL}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": testIp },
    body: JSON.stringify({
      type: "wedding",
      name: "Rohit & Meera",
      phone: "9876543210",
      email: "rohit.meera@example.com",
      event_date: "2026-12-14",
      city: "Udaipur",
      venue: "The Oberoi Udaivilas",
      details: {
        groom_name: "Rohit",
        bride_name: "Meera",
        events: ["Sangeet", "Baraat", "Reception"],
      },
    }),
  });
  assert(rWeddingReq.status === 201, `Wedding application submitted successfully (Status: ${rWeddingReq.status})`);
  const weddingReqJson = await rWeddingReq.json();
  assert(Boolean(weddingReqJson.id), `Received Request ID: ${weddingReqJson.id} (Short: ${weddingReqJson.shortId})`);
  const createdRequestId = weddingReqJson.id;

  // Request 2: Birthday
  const rBdayReq = await fetch(`${BASE_URL}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": testIp },
    body: JSON.stringify({
      type: "birthday",
      name: "Ananya Sharma",
      phone: "9123456789",
      event_date: "2026-11-20",
      city: "Bengaluru",
      details: {
        person_name: "Ananya",
        age: "25",
        theme: "adult",
      },
    }),
  });
  assert(rBdayReq.status === 201, `Birthday application submitted successfully (Status: ${rBdayReq.status})`);

  // Request 3: Griha Pravesh
  const rGharReq = await fetch(`${BASE_URL}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": testIp },
    body: JSON.stringify({
      type: "ghar",
      name: "Rajesh Verma",
      phone: "9988776655",
      event_date: "2026-11-15",
      city: "Varanasi",
      venue: "Verma Niwas, Lanka",
      details: {
        function_name: "Griha Pravesh",
        family_name: "Verma Family",
        muhurat: "8:30 AM to 10:15 AM",
      },
    }),
  });
  assert(rGharReq.status === 201, `Griha Pravesh application submitted successfully (Status: ${rGharReq.status})`);

  // -----------------------------------------------------------------
  // 5. Rate limiting on requests (3 per hour per IP)
  // -----------------------------------------------------------------
  console.log("\n--- 5. Testing Application Rate Limiting (3/hour/IP) ---");
  const rRateLimitExceeded = await fetch(`${BASE_URL}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": testIp },
    body: JSON.stringify({
      type: "wedding",
      name: "Spammy User",
      phone: "9876543210",
    }),
  });
  assert(
    rRateLimitExceeded.status === 429,
    `4th request from same IP within 1 hour blocked with 429 (Status: ${rRateLimitExceeded.status})`
  );

  // Honeypot test
  const freshIp = `203.0.113.${Math.floor(Math.random() * 200) + 10}`;
  const rHoneypot = await fetch(`${BASE_URL}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": freshIp },
    body: JSON.stringify({
      type: "wedding",
      name: "Bot User",
      phone: "9876543210",
      website: "http://spam-link.com",
    }),
  });
  const honeypotJson = await rHoneypot.json();
  assert(
    rHoneypot.status === 200 && honeypotJson.shortId === "spam",
    "Honeypot field caught bot and avoided database creation"
  );

  // Verify Admin can see requests
  const rGetRequests = await fetch(`${BASE_URL}/api/requests`, {
    headers: { Cookie: adminCookie },
  });
  assert(rGetRequests.status === 200, "Admin fetched all requests successfully");
  const requestsJson = await rGetRequests.json();
  const foundRequest = requestsJson.requests?.find((r) => r.id === createdRequestId);
  assert(Boolean(foundRequest), `Submitted wedding request found in admin requests list with status '${foundRequest?.status}'`);

  // -----------------------------------------------------------------
  // 6. Card Creation from Request
  // -----------------------------------------------------------------
  console.log("\n--- 6. Testing Card Creation From Request ---");
  const testSlug = `test-wedding-${Math.random().toString(36).slice(2, 10)}`;
  const rCreateCard = await fetch(`${BASE_URL}/api/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      slug: testSlug,
      type: "wedding",
      customer_name: "Rohit & Meera",
      request_id: createdRequestId,
      data: {
        type: "wedding",
        customerName: "Rohit & Meera",
        groomName: "Rohit",
        brideName: "Meera",
        mainDate: "2026-12-14",
        venueName: "The Oberoi Udaivilas",
        venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
        rsvpEnabled: true,
        contactPhone: "9876543210",
        events: [
          {
            id: "1",
            title: "Sangeet Night",
            date: "2026-12-13",
            time: "19:00",
            venue: "Palace Lawn",
          },
        ],
      },
    }),
  });
  assert(rCreateCard.status === 201, `Card created successfully via POST /api/cards (Status: ${rCreateCard.status})`);
  const cardJson = await rCreateCard.json();
  assert(cardJson.card?.slug === testSlug, `Card returned slug: ${cardJson.card?.slug}`);

  // Verify request status automatically changed to 'done'
  const rGetUpdatedReq = await fetch(`${BASE_URL}/api/requests/${createdRequestId}`, {
    headers: { Cookie: adminCookie },
  });
  const updatedReqJson = await rGetUpdatedReq.json();
  assert(
    updatedReqJson.request?.status === "done",
    `Request status automatically updated to 'done' (Current: '${updatedReqJson.request?.status}')`
  );
  assert(
    Boolean(updatedReqJson.request?.card_id),
    "Request card_id successfully linked to created card ID"
  );

  // -----------------------------------------------------------------
  // 7. Public Card Viewing
  // -----------------------------------------------------------------
  console.log("\n--- 7. Testing Public Card Viewing (/c/[slug]) ---");
  const rPublicCard = await fetch(`${BASE_URL}/c/${testSlug}`);
  assert(rPublicCard.status === 200, `Public card opens without login (Status: ${rPublicCard.status})`);
  const cardHtml = await rPublicCard.text();
  assert(cardHtml.includes("Rohit") && cardHtml.includes("Meera"), "Public card HTML contains couple names");
  assert(cardHtml.includes("noindex"), "Public card has noindex robots tag for privacy");

  // -----------------------------------------------------------------
  // 8. Card Lifecycle: Edit, Unpublish, Duplicate, Delete
  // -----------------------------------------------------------------
  console.log("\n--- 8. Testing Card Lifecycle (Edit, Unpublish, Duplicate, Delete) ---");

  // Edit card
  const rEditCard = await fetch(`${BASE_URL}/api/cards/${testSlug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      customer_name: "Rohit & Meera (Updated)",
      data: {
        type: "wedding",
        customerName: "Rohit & Meera (Updated)",
        groomName: "Rohit",
        brideName: "Meera",
        mainDate: "2026-12-14",
        venueName: "The Oberoi Udaivilas Palace",
      },
    }),
  });
  assert(rEditCard.status === 200, `PUT /api/cards/${testSlug} succeeded (Status: ${rEditCard.status})`);

  // Unpublish card
  const rUnpublish = await fetch(`${BASE_URL}/api/cards/${testSlug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({ is_published: false }),
  });
  assert(rUnpublish.status === 200, `PATCH /api/cards/${testSlug} unpublished card (Status: ${rUnpublish.status})`);

  // Verify public view now returns 404
  const rPublicUnpublished = await fetch(`${BASE_URL}/c/${testSlug}`);
  const unpubText = await rPublicUnpublished.text();
  assert(
    rPublicUnpublished.status === 404 || unpubText.includes("not available"),
    "Unpublished card displays 'This invitation is not available' to public guests"
  );

  // Duplicate card
  const rDuplicate = await fetch(`${BASE_URL}/api/cards/${testSlug}?action=duplicate`, {
    method: "POST",
    headers: { Cookie: adminCookie },
  });
  assert(rDuplicate.status === 201, `Duplicate card succeeded`);
  const dupJson = await rDuplicate.json();
  const dupSlug = dupJson.card?.slug;

  // Delete cards
  const rDelete = await fetch(`${BASE_URL}/api/cards/${testSlug}`, {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  assert(rDelete.status === 200, `DELETE /api/cards/${testSlug} succeeded`);

  if (dupSlug) {
    await fetch(`${BASE_URL}/api/cards/${dupSlug}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
  }

  // -----------------------------------------------------------------
  // 9. Demos and Public Landing
  // -----------------------------------------------------------------
  console.log("\n--- 9. Testing Live Trial Demos & Embeds ---");
  const rDemoWed = await fetch(`${BASE_URL}/demo/wedding`);
  assert(rDemoWed.status === 200, "GET /demo/wedding opens publicly (Status: 200)");

  const rDemoBday = await fetch(`${BASE_URL}/demo/birthday`);
  assert(rDemoBday.status === 200, "GET /demo/birthday opens publicly (Status: 200)");

  const rDemoGhar = await fetch(`${BASE_URL}/demo/ghar`);
  assert(rDemoGhar.status === 200, "GET /demo/ghar opens publicly (Status: 200)");

  const rLanding = await fetch(`${BASE_URL}/`);
  assert(rLanding.status === 200, "Landing page / returns 200 (Status: 200)");

  // -----------------------------------------------------------------
  // 10. Logout Test
  // -----------------------------------------------------------------
  console.log("\n--- 10. Testing Admin Logout ---");
  const rLogout = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: adminCookie },
  });
  assert(rLogout.status === 200, "POST /api/auth/logout returns 200 OK (Status: 200)");

  // =================================================================
  console.log("\n=================================================");
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed with unhandled error:", err);
  process.exit(1);
});
