-- ============================================================
-- UniSwap Campus Marketplace — Realtime Migration
-- Run this in Supabase Dashboard → SQL Editor (DB2)
-- Project: drqieumjptfmzhizjzge
-- ============================================================

-- 1. Enable REPLICA IDENTITY FULL so Realtime sends full row data
ALTER TABLE public.chat_threads   REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages  REPLICA IDENTITY FULL;
ALTER TABLE public.user_presence  REPLICA IDENTITY FULL;
ALTER TABLE public.typing_status  REPLICA IDENTITY FULL;

-- 2. Add tables to supabase_realtime publication
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

-- 3. Performance indexes
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
-- DONE — All tables are now Realtime-enabled
-- ============================================================
