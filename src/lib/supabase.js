import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from .env (Vite exposes vars prefixed with VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the credentials look real (not placeholder values)
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

// Create and export the main Supabase client (Database 1 - Auth)
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-key'
);

// Create and export Database 2 Supabase client for Product Sales (user_imagesss)
const PRODUCT_DB_URL = 'https://drqieumjptfmzhizjzge.supabase.co';
const PRODUCT_DB_KEY = 'sb_publishable_mCSK_djyZveTJsS4NLuKlw_0SNRIHq0';

export const productSupabase = createClient(PRODUCT_DB_URL, PRODUCT_DB_KEY);

// Export helper so other files can check if Supabase is properly configured
export const isSupabaseConfigured = () => isConfigured;

