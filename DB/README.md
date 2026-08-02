# 🗄️ UniSwap Campus Marketplace — Database Folder

This folder contains all database-related files for the **UniSwap Campus Marketplace** project.

---

## 📁 Folder Structure

```
DB/
├── schema.sql          → SQL to CREATE all Supabase tables
├── seed_data.sql       → Sample data to INSERT into tables
├── upload_product.py   → Python script to upload products via terminal
└── README.md           → This file
```

---

## 🔵 Supabase Setup Guide

### Step 1 — Create Tables
1. Go to [Supabase Dashboard](https://supabase.com) → Your Project
2. Click **SQL Editor** → **New Query**
3. Paste the contents of `schema.sql` and click **Run**

### Step 2 — Insert Sample Data
1. Open **SQL Editor** → **New Query**
2. Paste the contents of `seed_data.sql` and click **Run**

### Step 3 — Create Storage Bucket
1. Go to **Storage** → **New Bucket**
2. Name: `imagies`
3. Toggle: **Public bucket** → ON
4. Click **Create**

---

## 📊 Tables Overview

### `users` Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated primary key |
| username | TEXT | Unique login name |
| password | TEXT | Plain text (upgrade to hashed for production) |
| full_name | TEXT | Display name |
| created_at | TIMESTAMPTZ | Auto timestamp |

### `user_images` Table
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated primary key |
| username | TEXT | Seller's username |
| object_names | TEXT[] | Array of 3 storage file names |
| image_urls | TEXT[] | Array of 3 public image URLs |
| Category | TEXT | Electronics, Books, Cycles, etc. |
| condition | TEXT | Like New, Good, Fair, etc. |
| product_name | TEXT | Name of the item |
| selling_price | INTEGER | Price in ₹ |
| original_price | INTEGER | MRP in ₹ |
| brand | TEXT | Brand name |
| model | TEXT | Model number/name |
| purchase_year | INTEGER | Year item was purchased |
| negotiable | BOOLEAN | true / false |
| reason | TEXT | Why selling |
| description | TEXT | Full product description |
| created_at | TIMESTAMPTZ | Auto timestamp |

---

## 🐍 Upload Product via Python Script

### Install dependency
```bash
pip install supabase
```

### Run the script
```bash
python DB/upload_product.py
```

### You will be prompted for:
```
Username             :
Category             :
Condition            :
Product Name         :
Selling Price (₹)    :
Original Price (₹)   :
Brand                :
Model                :
Purchase Year        :
Negotiable (yes/no)  :
Reason for Selling   :
Description          :

Image 1 Path         : C:\Users\...\image1.jpg
Image 2 Path         : C:\Users\...\image2.jpg
Image 3 Path         : C:\Users\...\image3.jpg
```

---

## 🔑 Supabase Credentials

| Key | Value |
|-----|-------|
| Project URL | `https://jumprmlmxzwxsabjvgtd.supabase.co` |
| Anon Key | Stored in `.env` as `VITE_SUPABASE_ANON_KEY` |

> ⚠️ Never commit real keys to public repositories.

---

## 🏗️ Architecture

```
Frontend (React/Vite)
    └── src/lib/supabase.js     ← Supabase JS client
        └── src/services/
            ├── authService.js  ← users table
            ├── productService.js (localStorage for now)
            └── chatService.js  (localStorage for now)

Backend Scripts
    └── DB/upload_product.py    ← Direct Python → Supabase insert
```
