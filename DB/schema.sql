-- ============================================================
-- UniSwap Campus Marketplace — Supabase Database Schema
-- ============================================================

-- TABLE 1: users
-- Used for login, signup, password reset
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username   TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  full_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert (for login & signup)
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON users FOR SELECT USING (true);
CREATE POLICY "Allow password update" ON users FOR UPDATE USING (true);


-- ============================================================
-- TABLE 2: user_images
-- Used by upload_product.py to store product listings with images
-- ============================================================
CREATE TABLE IF NOT EXISTS user_images (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username       TEXT NOT NULL,
  object_names   TEXT[],
  image_urls     TEXT[],
  "Category"     TEXT,
  condition      TEXT,
  product_name   TEXT,
  selling_price  INTEGER,
  original_price INTEGER,
  brand          TEXT,
  model          TEXT,
  purchase_year  INTEGER,
  negotiable     BOOLEAN DEFAULT FALSE,
  reason         TEXT,
  description    TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_images ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for products
CREATE POLICY "Allow public insert" ON user_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON user_images FOR SELECT USING (true);


-- ============================================================
-- STORAGE BUCKET: imagies
-- Public bucket for product images
-- ============================================================
-- Run in Supabase Dashboard > Storage > New Bucket:
--   Name       : imagies
--   Public     : true
--   File size  : 10MB max
--   Allowed    : image/jpeg, image/png, image/webp
