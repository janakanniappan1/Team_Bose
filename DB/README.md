# 🗄️ UniSwap Campus Marketplace — Dual Database Setup

This project uses **2 separate Supabase databases**:

1. **🔐 Database 1: Authentication & User Accounts** (`jumprmlmxzwxsabjvgtd.supabase.co`)
2. **🛍️ Database 2: Product Listings & Media Uploads** (`drqieumjptfmzhizjzge.supabase.co`)

---

## 📁 DB Folder Structure

```
DB/
├── schema.sql          → SQL schemas for both Database 1 & Database 2
├── seed_data.sql       → Sample seed data for both databases
├── upload_product.py   → Python script (connects to Database 2 for uploads)
└── README.md           → This documentation file
```

---

## 🔐 Database 1: Authentication (`jumprmlmxzwxsabjvgtd.supabase.co`)

> **Used by**: Frontend React App (`authService.js` via `.env`)

### Connection Credentials
- **URL**: `https://jumprmlmxzwxsabjvgtd.supabase.co`
- **Key**: Configured in `.env` as `VITE_SUPABASE_ANON_KEY`

### Table: `users`
```sql
CREATE TABLE IF NOT EXISTS users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username   TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  full_name  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🛍️ Database 2: Product Listings & Storage (`drqieumjptfmzhizjzge.supabase.co`)

> **Used by**: Product upload Python script (`upload_product.py`) & Product storage

### Connection Credentials
- **URL**: `https://drqieumjptfmzhizjzge.supabase.co`
- **Key**: `sb_publishable_mCSK_djyZveTJsS4NLuKlw_0SNRIHq0`
- **Storage Bucket**: `imagies` (Public bucket for images)

### Table: `user_images`
```sql
CREATE TABLE IF NOT EXISTS user_images (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username          TEXT NOT NULL,
  audience          TEXT DEFAULT 'students',
  object_names      TEXT[],
  image_urls        TEXT[],
  video_url         TEXT,
  "Category"        TEXT,
  condition         TEXT,
  product_name      TEXT,
  selling_price     INTEGER,
  original_price    INTEGER,
  negotiable        BOOLEAN DEFAULT FALSE,
  brand             TEXT,
  model             TEXT,
  purchase_year     INTEGER,
  reason            TEXT,
  description       TEXT,
  hostel            TEXT,
  department        TEXT,
  pickup_preference TEXT,
  status            TEXT DEFAULT 'Pending Approval',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔵 Setup Instructions for Both Databases

### For Database 1 (Authentication):
1. Log into Supabase → Select `jumprmlmxzwxsabjvgtd` project.
2. Go to **SQL Editor** → **New Query**.
3. Run the `users` table section from `schema.sql`.

### For Database 2 (Product Sales & Uploads):
1. Log into Supabase → Select `drqieumjptfmzhizjzge` project.
2. Go to **SQL Editor** → **New Query**.
3. Run the `user_images` table section from `schema.sql`.
4. Go to **Storage** → Create a public bucket named **`imagies`**.

---

## 🐍 Running the Upload Script

To upload products to Database 2 via terminal:

```bash
python DB/upload_product.py
```

It will prompt for product details & 3–8 image file paths, then automatically upload images to the `imagies` bucket and insert the product row into Database 2!
