-- ============================================================
-- 🚀 UNISWAP CAMPUS MARKETPLACE — PRODUCTION REALTIME CHAT SCHEMA
-- Instagram Direct / WhatsApp Style 100% UUID-Based Architecture
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  full_name   TEXT NOT NULL,
  email       TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  department  TEXT,
  hostel      TEXT,
  role        TEXT DEFAULT 'student',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. CHAT THREADS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_threads (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id         UUID NULL,
  last_message       TEXT,
  last_sender_id     UUID REFERENCES public.profiles(id),
  last_message_time  TIMESTAMPTZ DEFAULT NOW(),
  buyer_unread_count INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_buyer_seller_product UNIQUE (buyer_id, seller_id, product_id)
);

-- ------------------------------------------------------------
-- 3. CHAT MESSAGES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id    UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message      TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text' | 'image' | 'product_card' | 'offer_card' | 'system'
  image_url    TEXT,
  metadata     JSONB DEFAULT '{}'::jsonb, -- product or offer payload
  is_seen      BOOLEAN DEFAULT FALSE,
  is_delivered BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. USER PRESENCE TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_presence (
  user_id    UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_online  BOOLEAN DEFAULT FALSE,
  last_seen  TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 5. TYPING STATUS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.typing_status (
  thread_id  UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  typing     BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (thread_id, user_id)
);

-- ============================================================
-- 🔐 ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_status ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. CHAT THREADS POLICIES
CREATE POLICY "Users can view threads they belong to" 
  ON public.chat_threads FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can insert threads where they are buyer or seller" 
  ON public.chat_threads FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can update threads they belong to" 
  ON public.chat_threads FOR UPDATE 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 3. CHAT MESSAGES POLICIES
CREATE POLICY "Users can view messages in their conversations" 
  ON public.chat_messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages into their conversations" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update message seen status" 
  ON public.chat_messages FOR UPDATE 
  USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- 4. USER PRESENCE POLICIES
CREATE POLICY "Presence is viewable by everyone" 
  ON public.user_presence FOR SELECT USING (true);

CREATE POLICY "Users can manage own presence" 
  ON public.user_presence FOR ALL 
  USING (auth.uid() = user_id);

-- 5. TYPING STATUS POLICIES
CREATE POLICY "Typing status viewable by conversation participants" 
  ON public.typing_status FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage own typing status" 
  ON public.typing_status FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================================
-- ⚡ ENABLE REALTIME ON SUPABASE TABLES
-- ============================================================

-- Add tables to the publication for instant real-time streaming
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_threads') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_threads;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'typing_status') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_status;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_presence') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
  END IF;
END $$;

-- Indexes for maximum query performance
CREATE INDEX IF NOT EXISTS idx_chat_threads_buyer ON public.chat_threads(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chat_threads_seller ON public.chat_threads(seller_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON public.chat_messages(thread_id, created_at DESC);
