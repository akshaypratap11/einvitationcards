-- ==============================================================================
-- E-Invitation Card Platform - Admin-Only Architecture Database & Storage Schema
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: requests (NEW)
-- Stores public card application / customization inquiries
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('wedding', 'birthday', 'ghar')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  event_date DATE,
  city TEXT,
  venue TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done', 'rejected')),
  card_id UUID,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for requests query performance
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests (status);
CREATE INDEX IF NOT EXISTS idx_requests_type ON public.requests (type);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests (created_at DESC);

-- 2. Table: cards
-- Stores finished celebration invitation cards created by Admin
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wedding', 'birthday', 'ghar')),
  data JSONB NOT NULL,
  customer_name TEXT,
  request_id UUID REFERENCES public.requests(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Migration support for existing cards table:
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS request_id UUID REFERENCES public.requests(id) ON DELETE SET NULL;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.cards ALTER COLUMN edit_token DROP NOT NULL;

-- Link requests.card_id foreign key back to cards
ALTER TABLE public.requests
  DROP CONSTRAINT IF EXISTS fk_requests_card,
  ADD CONSTRAINT fk_requests_card FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE SET NULL;

-- Index for lookup by card slug and published status
CREATE INDEX IF NOT EXISTS idx_cards_slug ON public.cards (slug);
CREATE INDEX IF NOT EXISTS idx_cards_is_published ON public.cards (is_published);
CREATE INDEX IF NOT EXISTS idx_cards_request_id ON public.cards (request_id);

-- 3. Table: rsvps
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL DEFAULT true,
  guests_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_card_id ON public.rsvps (card_id);

-- 4. Storage Bucket: card-photos (Public Read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-photos', 'card-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Drop obsolete public insert/update/delete policies
DROP POLICY IF EXISTS "Allow public read access on cards" ON public.cards;
DROP POLICY IF EXISTS "Allow public insert on cards" ON public.cards;
DROP POLICY IF EXISTS "Allow public update on cards" ON public.cards;
DROP POLICY IF EXISTS "Allow public delete on cards" ON public.cards;

DROP POLICY IF EXISTS "Allow public read on rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Allow public read on requests" ON public.requests;
DROP POLICY IF EXISTS "Allow public insert on requests" ON public.requests;
DROP POLICY IF EXISTS "Allow public update on requests" ON public.requests;
DROP POLICY IF EXISTS "Allow public delete on requests" ON public.requests;

DROP POLICY IF EXISTS "Allow public upload to card-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on card-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on card-photos" ON storage.objects;

-- RLS: Cards
-- Public may ONLY SELECT published cards
CREATE POLICY "Allow public select published cards"
ON public.cards
FOR SELECT
TO public
USING (is_published = true);

-- RLS: Requests
-- No public SELECT, INSERT, UPDATE, or DELETE directly via anon key.
-- All writes and reads happen exclusively via Next.js server routes with SUPABASE_SERVICE_ROLE_KEY.

-- RLS: RSVPs
-- Guests can submit RSVP responses for published cards
CREATE POLICY "Allow public insert on rsvps"
ON public.rsvps
FOR INSERT
TO public
WITH CHECK (true);
-- No public SELECT on rsvps. Admin/Host accesses RSVPs through authenticated server routes.

-- RLS: Storage (card-photos)
-- Public can read images, but CANNOT upload/delete directly.
-- Uploads happen via admin /api/upload route with service role key.
CREATE POLICY "Allow public read on card-photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'card-photos');
