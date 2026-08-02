import { createClient } from '@supabase/supabase-js';

// ── Database 1: Authentication (users table) ─────────────────
// Project: jumprmlmxzwxsabjvgtd
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-supabase-project-id') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

if (!isConfigured) {
  console.warn(
    '[Supabase] Credentials missing or invalid. Update your .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-key'
);

// ── Database 2: Products + Chat (all chat tables live here) ──
// Project: drqieumjptfmzhizjzge
const PRODUCT_DB_URL = 'https://drqieumjptfmzhizjzge.supabase.co';
const PRODUCT_DB_KEY = 'sb_publishable_mCSK_djyZveTJsS4NLuKlw_0SNRIHq0';

export const productSupabase = createClient(PRODUCT_DB_URL, PRODUCT_DB_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const isSupabaseConfigured = () => isConfigured;
