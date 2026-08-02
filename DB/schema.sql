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


-- ============================================================
-- 🛒 TABLE 3: buyer_marketplace
-- Active approved products displayed for buyers to browse & buy
-- ============================================================
CREATE TABLE IF NOT EXISTS buyer_marketplace (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_title     TEXT NOT NULL,
  price             INTEGER NOT NULL,
  original_price    INTEGER,
  category          TEXT DEFAULT 'electronics',
  condition         TEXT DEFAULT 'Like New',
  seller_name       TEXT NOT NULL,
  seller_contact    TEXT,
  location          TEXT,
  department        TEXT,
  image_urls        TEXT[],
  description       TEXT,
  negotiable        BOOLEAN DEFAULT TRUE,
  status            TEXT DEFAULT 'Available',  -- Available | Reserved | Sold
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE buyer_marketplace ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select buyer_marketplace" ON buyer_marketplace FOR SELECT USING (true);
CREATE POLICY "Allow public insert buyer_marketplace" ON buyer_marketplace FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update buyer_marketplace" ON buyer_marketplace FOR UPDATE USING (true);


-- ============================================================
-- 💳 TABLE 4: buyer_orders
-- Records of purchases/orders placed by buyers
-- ============================================================
CREATE TABLE IF NOT EXISTS buyer_orders (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id        UUID,
  product_title     TEXT NOT NULL,
  price             INTEGER NOT NULL,
  buyer_name        TEXT NOT NULL,
  buyer_email       TEXT,
  buyer_phone       TEXT,
  seller_name       TEXT NOT NULL,
  pickup_location   TEXT,
  status            TEXT DEFAULT 'Completed',  -- Pending Pickup | Completed | Cancelled
  order_date        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE buyer_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select buyer_orders" ON buyer_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert buyer_orders" ON buyer_orders FOR INSERT WITH CHECK (true);


-- ============================================================
-- 💬 TABLE 5: chat_threads
-- Stores all active chat conversations between buyers & sellers
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_threads (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_name       TEXT NOT NULL,
  seller_username   TEXT NOT NULL,
  seller_avatar     TEXT,
  seller_dept       TEXT,
  seller_phone      TEXT,
  buyer_name        TEXT NOT NULL,
  buyer_username    TEXT NOT NULL,
  buyer_avatar      TEXT,
  item_title        TEXT NOT NULL,
  item_price        INTEGER NOT NULL,
  item_image        TEXT,
  is_online         BOOLEAN DEFAULT TRUE,
  unread_count      INTEGER DEFAULT 0,
  last_msg_time     TEXT DEFAULT 'Just now',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select chat_threads" ON chat_threads FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_threads" ON chat_threads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update chat_threads" ON chat_threads FOR UPDATE USING (true);


-- ============================================================
-- ✉️ TABLE 6: chat_messages
-- Stores full message history for every chat thread
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id         UUID REFERENCES chat_threads(id) ON DELETE CASCADE,
  sender            TEXT NOT NULL, -- 'user' | 'seller'
  sender_username   TEXT,
  text              TEXT NOT NULL,
  sent_time         TEXT DEFAULT 'Just now',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select chat_messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);


-- ============================================================
-- 🔔 TABLE 7: user_notifications
-- Stores alerts and message notifications for users
-- ============================================================
CREATE TABLE IF NOT EXISTS user_notifications (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username          TEXT NOT NULL DEFAULT 'Jana K',
  title             TEXT NOT NULL,
  message           TEXT NOT NULL,
  type              TEXT DEFAULT 'message', -- 'message' | 'sold' | 'price_drop' | 'offer'
  unread            BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select user_notifications" ON user_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert user_notifications" ON user_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update user_notifications" ON user_notifications FOR UPDATE USING (true);



