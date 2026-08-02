-- ============================================================
-- UniSwap Campus Marketplace — Chat Tables (uc_ prefix)
-- Run this in Supabase Dashboard → SQL Editor (DB2)
-- Project: drqieumjptfmzhizjzge
-- Uses fresh uc_ prefix — zero conflict with any existing tables
-- ============================================================

-- ── Table 1: uc_threads ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.uc_threads (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id            TEXT NOT NULL,
  seller_id           TEXT NOT NULL,
  product_id          TEXT,
  item_title          TEXT DEFAULT 'Campus Item',
  item_price          INTEGER DEFAULT 0,
  item_image          TEXT,
  last_message        TEXT,
  last_sender_id      TEXT,
  last_message_time   TIMESTAMPTZ DEFAULT NOW(),
  buyer_unread_count  INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uc_unique_thread UNIQUE (buyer_id, seller_id, item_title)
);

-- ── Table 2: uc_messages ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.uc_messages (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id    UUID NOT NULL REFERENCES public.uc_threads(id) ON DELETE CASCADE,
  sender_id    TEXT NOT NULL,
  receiver_id  TEXT NOT NULL,
  message      TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  image_url    TEXT,
  metadata     JSONB DEFAULT '{}'::jsonb,
  is_seen      BOOLEAN DEFAULT FALSE,
  is_delivered BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Table 3: uc_presence ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.uc_presence (
  user_id   TEXT PRIMARY KEY,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- ── Table 4: uc_typing ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.uc_typing (
  thread_id  UUID NOT NULL REFERENCES public.uc_threads(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL,
  typing     BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (thread_id, user_id)
);

-- ── Table 5: user_notifications ─────────────────────────
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    TEXT,
  username   TEXT DEFAULT 'User',
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT DEFAULT 'message',
  unread     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS: Disable for simplicity (demo / hackathon) ───────
ALTER TABLE public.uc_threads         DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_messages        DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_presence        DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_typing          DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_presence DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_typing   DISABLE ROW LEVEL SECURITY;

-- ── Enable Realtime ───────────────────────────────────────
ALTER TABLE public.uc_threads  REPLICA IDENTITY FULL;
ALTER TABLE public.uc_messages REPLICA IDENTITY FULL;
ALTER TABLE public.uc_presence REPLICA IDENTITY FULL;
ALTER TABLE public.uc_typing   REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'uc_threads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.uc_threads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'uc_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.uc_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'uc_presence'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.uc_presence;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'uc_typing'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.uc_typing;
  END IF;
END $$;

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_uc_messages_thread_time
  ON public.uc_messages(thread_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_uc_messages_receiver_seen
  ON public.uc_messages(receiver_id, is_seen)
  WHERE is_seen = FALSE;

CREATE INDEX IF NOT EXISTS idx_uc_threads_buyer
  ON public.uc_threads(buyer_id);

CREATE INDEX IF NOT EXISTS idx_uc_threads_seller
  ON public.uc_threads(seller_id);

CREATE INDEX IF NOT EXISTS idx_uc_threads_time
  ON public.uc_threads(last_message_time DESC);

-- ============================================================
-- DONE — Tables: uc_threads, uc_messages, uc_presence, uc_typing
-- ============================================================
