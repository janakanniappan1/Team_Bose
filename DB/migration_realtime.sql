-- ============================================================
-- UniSwap Campus Marketplace — Complete Chat Setup + Realtime
-- Run this in Supabase Dashboard → SQL Editor
-- Project (DB2): drqieumjptfmzhizjzge
-- ============================================================
-- This script is safe to run multiple times (IF NOT EXISTS).
-- It creates any missing tables, then enables Realtime.
-- ============================================================

-- ── Step 1: Create chat_threads (if not already created) ──
CREATE TABLE IF NOT EXISTS public.chat_threads (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id            TEXT NOT NULL,
  seller_id           TEXT NOT NULL,
  product_id          TEXT NULL,
  item_title          TEXT NOT NULL DEFAULT 'Campus Item',
  item_price          INTEGER NOT NULL DEFAULT 0,
  item_image          TEXT,
  last_message        TEXT,
  last_sender_id      TEXT,
  last_message_time   TIMESTAMPTZ DEFAULT NOW(),
  buyer_unread_count  INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_buyer_seller_item UNIQUE (buyer_id, seller_id, item_title)
);

-- ── Step 2: Create chat_messages (if not already created) ──
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id    UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE,
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

-- ── Step 3: Create user_presence (if not already created) ──
CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id   TEXT PRIMARY KEY,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- ── Step 4: Create typing_status (if not already created) ──
CREATE TABLE IF NOT EXISTS public.typing_status (
  thread_id  UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL,
  typing     BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (thread_id, user_id)
);

-- ── Step 5: RLS Policies ──────────────────────────────────
ALTER TABLE public.chat_threads   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_status  ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (safe)
DROP POLICY IF EXISTS "Allow public select chat_threads"   ON public.chat_threads;
DROP POLICY IF EXISTS "Allow public insert chat_threads"   ON public.chat_threads;
DROP POLICY IF EXISTS "Allow public update chat_threads"   ON public.chat_threads;
DROP POLICY IF EXISTS "Allow public select chat_messages"  ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public insert chat_messages"  ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public update chat_messages"  ON public.chat_messages;
DROP POLICY IF EXISTS "Allow public select user_presence"  ON public.user_presence;
DROP POLICY IF EXISTS "Allow public all user_presence"     ON public.user_presence;
DROP POLICY IF EXISTS "Allow public select typing_status"  ON public.typing_status;
DROP POLICY IF EXISTS "Allow public all typing_status"     ON public.typing_status;

CREATE POLICY "Allow public select chat_threads"  ON public.chat_threads  FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_threads"  ON public.chat_threads  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update chat_threads"  ON public.chat_threads  FOR UPDATE USING (true);

CREATE POLICY "Allow public select chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update chat_messages" ON public.chat_messages FOR UPDATE USING (true);

CREATE POLICY "Allow public select user_presence" ON public.user_presence FOR SELECT USING (true);
CREATE POLICY "Allow public all user_presence"    ON public.user_presence FOR ALL    USING (true);

CREATE POLICY "Allow public select typing_status" ON public.typing_status FOR SELECT USING (true);
CREATE POLICY "Allow public all typing_status"    ON public.typing_status FOR ALL    USING (true);

-- ── Step 6: Enable REPLICA IDENTITY FULL for Realtime ────
ALTER TABLE public.chat_threads   REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages  REPLICA IDENTITY FULL;
ALTER TABLE public.user_presence  REPLICA IDENTITY FULL;
ALTER TABLE public.typing_status  REPLICA IDENTITY FULL;

-- ── Step 7: Add tables to supabase_realtime publication ──
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_threads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_threads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_presence'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'typing_status'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_status;
  END IF;
END $$;

-- ── Step 8: Performance Indexes ──────────────────────────
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread_time
  ON public.chat_messages(thread_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_seen
  ON public.chat_messages(receiver_id, is_seen)
  WHERE is_seen = FALSE;

CREATE INDEX IF NOT EXISTS idx_chat_threads_buyer
  ON public.chat_threads(buyer_id);

CREATE INDEX IF NOT EXISTS idx_chat_threads_seller
  ON public.chat_threads(seller_id);

CREATE INDEX IF NOT EXISTS idx_chat_threads_last_msg_time
  ON public.chat_threads(last_message_time DESC);

CREATE INDEX IF NOT EXISTS idx_user_presence_user
  ON public.user_presence(user_id);

CREATE INDEX IF NOT EXISTS idx_typing_status_thread
  ON public.typing_status(thread_id, user_id);

-- ============================================================
-- DONE — All tables created, RLS set, Realtime enabled
-- ============================================================
