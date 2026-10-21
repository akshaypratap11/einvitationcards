# 🪔 निमंत्रण Utsav (Digital Invitation Card Platform)

A digital invitation card builder and celebration platform crafted with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase Auth**.

The platform is designed with an **Admin-Only Management Architecture**:
- **Public Visitors**: Can test-drive live animated trial demos, submit custom card requests/applications in English or Hindi, and view published invitation cards via private links (`/c/[slug]`).
- **Admin**: Authenticated via **Supabase Auth** (Email + Password). Centrally creates, customizes, edits, duplicates, publishes/unpublishes, and deletes invitation cards via a protected dashboard (`/admin`), with an integrated workflow to convert client inquiries into completed cards.

---

## 📚 Contents

- [Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Supabase Setup](#-supabase-setup-guide)
- [Environment Variables](#-environment-variables)
- [Admin Password Management](#-admin-password-management)
- [Routes](#-page--route-directory)
- [API Reference](#️-api-reference)
- [Testing](#-testing)

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) with the App Router
- [React 18](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) and Framer Motion
- [Supabase](https://supabase.com/) for authentication, PostgreSQL, and image storage
- Zod and React Hook Form for form validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later and npm
- A Supabase project

### Install and run locally

1. Clone this repository and open its directory:

  ```bash
  git clone <your-repository-url>
  cd einvitationcard
  ```

2. Install dependencies:

  ```bash
  npm install
  ```

3. Create a `.env.local` file in the project root and add the four values listed in [Environment Variables](#-environment-variables). Use values from your Supabase project and your WhatsApp support number.

4. Follow the [Supabase Setup](#-supabase-setup-guide) steps, including running `supabase/schema.sql` in the SQL Editor.

5. Start the development server:

  ```bash
  npm run dev
  ```

  Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build locally. Run `npm run build` first. |
| `npm run lint` | Run the configured Next.js lint command. |
| `node scripts/test-admin-platform.js` | Run the admin platform test script. |

## ✨ Key Features

### 1. Interactive Celebration Templates
- **Royal Wedding (`WeddingRoyal`)**: Palace arch doors intro with tap-to-light diya, couple photo collision animations, dynamic multi-event itinerary (Mehndi, Haldi, Sangeet, Baraat, Reception), countdown timer, photo gallery, Google Maps venue embed, and "Add to Calendar".
- **Birthday Celebration (`BirthdayCelebration`)**: Tap-to-light celebration candle intro, Then & Now collision photo frame, Party Essentials cards, countdown timer, Order of Celebration timeline, and WhatsApp RSVP.
- **Griha Pravesh (`GrihaPravesh`)**: Auspicious `॥ श्री गणेशाय नमः ॥` header, tap-to-light sacred Diya flame, Purana vs Naya Ghar collision animation, Shubh Muhurat box, Pooja Schedule timeline, and WhatsApp RSVP.

### 2. Admin-Only Control & Supabase Auth Security
- **Single Administrator Architecture**:
  - Exactly ONE admin user created directly in the Supabase Dashboard.
  - Public sign-ups are disabled in Supabase Auth. Any authenticated user is granted administrative privileges.
  - No `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, or `ADMIN_EMAILS` env variables needed.
- **Defense-in-Depth Protection**:
  - **Edge Middleware (`middleware.ts`)**: Refreshes Supabase session cookies on every request via `@supabase/ssr`. Redirects unauthenticated visits to `/admin/*`, `/create`, `/edit/*` to `/admin/login`.
  - **Server Component Guards (`lib/require-admin.ts`)**: Protected server pages (`/admin`, `/create`, `/edit/[slug]`) call `requireAdmin()` directly using `supabase.auth.getUser()` (never trusting unverified JWT claims).
  - **Write API Restrictions**: All mutation endpoints (`/api/cards` POST/PUT/DELETE, `/api/upload`, `/api/requests` PATCH/DELETE) strictly verify `requireAdmin()` before executing operations with the service-role client.
- **Brute-Force Rate Limiting**:
  - Login attempts are rate-limited to 5 attempts/minute/IP with generic error messages ("Invalid email or password").
- **Privacy & Robots Tag**:
  - Public cards (`/c/[slug]`) and admin routes include `noindex, nofollow` metadata to prevent web search indexing while keeping Open Graph tags intact for rich WhatsApp link previews.

### 3. Public Application Flow (`/apply`)
- Clean, mobile-first card application form with real-time **English / हिन्दी (Hindi)** language switcher.
- Type-specific form fields:
  - **Wedding**: Couple names, parents' names, event selection checkboxes.
  - **Birthday**: Person's name, age, theme choice.
  - **Ghar Function**: Function name (Griha Pravesh, Satyanarayan Katha, Mundan, etc.), family name, Muhurat.
- **Anti-Spam & Abuse Protection**:
  - Rate-limited to 3 requests/hour/IP.
  - Hidden honeypot field to automatically filter bot submissions.
  - Photo uploads are disabled on the public form to protect storage.
- **WhatsApp Photo Submission**:
  - Post-submit screen presents a direct WhatsApp link prefilled with the applicant's unique Request ID (`wa.me/<number>?text=...`) so customers can send high-res photos directly.

### 4. Admin Dashboard (`/admin`)
- **Requests Tab**:
  - Real-time inquiry feed with a red badge displaying count of `new` requests.
  - Filter by status (`new`, `in_progress`, `done`, `rejected`) and category (`wedding`, `birthday`, `ghar`).
  - Search by applicant name or WhatsApp number.
  - **Detail Drawer**: Displays all client answers, internal admin notes, 1-click WhatsApp chat link, status updater, and **"Create card from this request"** button.
  - Seamlessly pre-fills the 4-step wizard with the client's information and automatically marks the inquiry as `done` upon saving.
- **Cards Tab**:
  - Table of all created cards showing customer reference name, type, title, creation date, and publish status.
  - Actions: **View Live**, **Copy Link**, **Share on WhatsApp**, **Edit**, **Duplicate**, **Publish / Unpublish**, and **Delete** (with automatic Supabase Storage photo cleanup).
- **Stats Tab**:
  - Metrics for Total Requests, New Inquiries, Created Cards, and Estimated Storage Used.

---

## 🚀 Supabase Setup Guide

### 1. Database & Storage Setup
1. Create a project at [database.new](https://database.new).
2. In the **SQL Editor**, execute [`supabase/schema.sql`](./supabase/schema.sql) to create `cards`, `requests`, and `rsvps` tables and the `card-photos` bucket.

### 2. Create the Admin User
1. In your Supabase Dashboard, navigate to **Authentication > Users**.
2. Click **Add user** > **Create user**.
3. Enter your admin email (e.g. `admin@nimantranutsav.com`) and a secure password.
4. Make sure the **Auto Confirm User?** toggle is switched **ON** so you can log in immediately without waiting for an email confirmation.
5. Click **Create user**.

### 3. Disable Public Sign-ups
1. Navigate to **Authentication > Providers > Email**.
2. Toggle **OFF** **"Allow new users to sign up"**.
3. Click **Save**.
   > This guarantees no public user can register an account. Only the admin user you created can authenticate.

### 4. Configure Site URL and Redirect URLs
1. Navigate to **Authentication > URL Configuration**.
2. Set **Site URL**:
   - Local development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/admin/reset-password`
   - `http://localhost:3000/admin`
   - `https://your-domain.com/admin/reset-password`
   - `https://your-domain.com/admin`
4. Click **Save**.

### 5. Environment Variables Configuration

The platform requires **strictly 4 environment variables**:

```bash
# Supabase Project Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-server-only

# WhatsApp Support Number (without + or spaces, e.g. 919876543210)
NEXT_PUBLIC_WHATSAPP=919876543210
```

> [!CAUTION]
> `SUPABASE_SERVICE_ROLE_KEY` is strictly server-only (protected via `import 'server-only'`) and must NEVER be exposed to the browser or client components.
> Do NOT configure `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, or `ADMIN_EMAILS`. All authentication is managed securely through Supabase Auth.

---

## 🔐 Admin Password Management

### How to Reset Your Password via Web Interface
1. Navigate to `/admin/login`.
2. Click **"Forgot password?"**.
3. Enter your registered admin email address and click **"Forgot password?"**.
4. Check your email for the password recovery link.
5. Clicking the link opens `/admin/reset-password`.
6. Enter your new password (minimum 10 characters) and confirm it.
7. Upon saving, you are automatically redirected to `/admin`.

### How to Change Admin Email / Password via Supabase Dashboard
1. Navigate to **Authentication > Users** in the Supabase Dashboard.
2. Click on the admin user row.
3. In the user detail drawer:
   - To change password: Click **Change Password**, enter the new password, and click **Save**.
   - To change email: Click **Edit Email**, enter the new email, and click **Save**.
   - Alternatively, click the **...** (three dots) action menu next to the user row and select **Send Password Reset**.

---

## 📱 Page & Route Directory

### Public Routes
| Route | Description |
|---|---|
| `/` | Landing page showcasing live interactive demos. |
| `/apply?type=wedding\|birthday\|ghar` | Public application form with English/Hindi toggle & WhatsApp photo link. |
| `/demo/wedding` | Full-screen interactive demo of the Royal Wedding invitation. |
| `/demo/birthday` | Full-screen interactive demo of the Birthday Celebration invitation. |
| `/demo/ghar` | Full-screen interactive demo of the Griha Pravesh invitation. |
| `/c/[slug]` | Public invitation card (noindex metadata, active only if published). |

### Protected Admin Routes (Requires Supabase Auth Session)
| Route | Description |
|---|---|
| `/admin/login` | Email + password login with 5/min IP rate limit and "Forgot password?". |
| `/admin/reset-password` | Set new password (min 10 characters) via Supabase Auth recovery token. |
| `/admin` | Main Admin Dashboard with Requests, Cards, and Stats tabs. |
| `/create?requestId=...` | 4-step card creation wizard (supports pre-fill from an inquiry). |
| `/edit/[slug]` | Card editing wizard. |

---

## 🛠️ API Reference

### Public Endpoints
- `POST /api/requests`: Submit a card inquiry (rate limit: 3/hr/IP, honeypot protected).
- `GET /api/cards/[slug]`: Retrieve public card data by slug (only if published).
- `POST /api/rsvp`: Submit a guest RSVP response.
- `POST /api/auth/login`: Rate-limited (5/min/IP) Supabase Auth email+password sign-in.
- `POST /api/auth/logout`: Calls `supabase.auth.signOut()` and clears session cookies.

### Admin-Only Endpoints (Verified via `requireAdmin()`)
- `GET /api/requests`: Retrieve all submitted requests.
- `GET /api/requests/[id]`: Retrieve single request details.
- `PATCH /api/requests/[id]`: Update request status or admin notes.
- `DELETE /api/requests/[id]`: Remove a request.
- `GET /api/cards`: Retrieve all cards.
- `POST /api/cards`: Create a new card.
- `PUT /api/cards/[slug]`: Update card data and customer reference name.
- `PATCH /api/cards/[slug]`: Toggle `is_published` status.
- `POST /api/cards/[slug]?action=duplicate`: Duplicate an existing card.
- `DELETE /api/cards/[slug]`: Delete a card and remove its photos from storage bucket.
- `POST /api/upload`: Upload compressed WebP images to Supabase Storage.

---

## 🧪 Testing

Run the automated test suite to verify security, rate limiting, and Supabase Auth flow:

```bash
node scripts/test-admin-platform.js
```
