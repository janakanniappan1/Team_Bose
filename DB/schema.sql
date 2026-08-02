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
-- Used by upload_product.py and SellProductPage.jsx to store product listings
-- Columns match the Sell Product form exactly
-- ============================================================
CREATE TABLE IF NOT EXISTS user_images (
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
