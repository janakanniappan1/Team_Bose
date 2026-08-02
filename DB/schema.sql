-- ============================================================
-- UniSwap Campus Marketplace — Supabase Dual Database Schemas
-- ============================================================

-- ============================================================
-- 🔐 DATABASE 1: AUTHENTICATION DATABASE
-- Project URL : https://jumprmlmxzwxsabjvgtd.supabase.co
-- Used by     : React Frontend (authService.js via .env)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username   TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  full_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security & Policies for Database 1
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON users FOR SELECT USING (true);
CREATE POLICY "Allow password update" ON users FOR UPDATE USING (true);


-- ============================================================
-- 🛍️ DATABASE 2: PRODUCT LISTINGS & STORAGE DATABASE
-- Project URL : https://drqieumjptfmzhizjzge.supabase.co
-- Used by     : Python Upload Script (upload_product.py)
-- Bucket      : imagies (Public)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_imagesss (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Seller Info
  username          TEXT NOT NULL,
  audience          TEXT DEFAULT 'students',   -- 'students' | 'faculty' | 'all'

  -- Photos & Video
  object_names      TEXT[],                    -- Storage file names (up to 8 images)
  image_urls        TEXT[],                    -- Public URLs of uploaded images
  video_url         TEXT,                      -- Optional: YouTube/Drive/Video URL

  -- Product Core Details
  "Category"        TEXT,                      -- Electronics, Books, Cycles, etc.
  condition         TEXT,                      -- Brand New | Like New | Good
  product_name      TEXT,                      -- Product Name / Title
  selling_price     INTEGER,                   -- Selling Price in Rs
  original_price    INTEGER,                   -- Original Purchase Price in Rs
  negotiable        BOOLEAN DEFAULT FALSE,     -- Price Negotiable checkbox

  -- Optional Specifications
  brand             TEXT,                      -- Brand name
  model             TEXT,                      -- Model number/name
  purchase_year     INTEGER,                   -- Year of purchase
  reason            TEXT,                      -- Reason for Selling

  -- Description & Location
  description       TEXT,                      -- Full Product Description
  hostel            TEXT,                      -- Seller's hostel/location
  department        TEXT,                      -- Seller's department
  pickup_preference TEXT,                      -- Preferred pickup spot

  -- Metadata
  status            TEXT DEFAULT 'Pending Approval', -- Pending Approval | Approved | Sold
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security & Policies for Database 2
ALTER TABLE user_imagesss ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON user_imagesss FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON user_imagesss FOR SELECT USING (true);
