-- ============================================================
-- UniSwap Campus Marketplace — Seed / Sample Data
-- ============================================================
-- Run this AFTER schema.sql to populate tables with demo data
-- ============================================================


-- ============================================================
-- SEED: users table
-- ============================================================
INSERT INTO users (username, password, full_name) VALUES
  ('jana_k',      'pass123',  'Jana K'),
  ('ananya_s',    'pass456',  'Ananya Sharma'),
  ('rohan_v',     'pass789',  'Rohan Verma'),
  ('priya_n',     'pass321',  'Priya Nair'),
  ('karthik_r',   'pass654',  'Karthik Raja'),
  ('sneha_p',     'pass111',  'Sneha Patel'),
  ('devansh_g',   'pass222',  'Devansh Gupta'),
  ('vikram_s',    'pass333',  'Vikram Singh'),
  ('meera_m',     'pass444',  'Meera Menon')
ON CONFLICT (username) DO NOTHING;


-- ============================================================
-- SEED: user_imagesss table (product listings)
-- ============================================================
INSERT INTO user_imagesss (
  username, audience, object_names, image_urls, video_url,
  "Category", condition, product_name, selling_price, original_price, negotiable,
  brand, model, purchase_year, reason,
  description, hostel, department, pickup_preference, status
) VALUES

-- Product 1: Calculator
(
  'ananya_s', 'students',
  ARRAY['calc-img-1.jpg', 'calc-img-2.jpg', 'calc-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
  ],
  NULL,
  'Electronics', 'Like New',
  'Casio fx-991EX ClassWiz Scientific Calculator',
  950, 1695, true,
  'Casio', 'fx-991EX ClassWiz', 2023,
  'Upgrading to a graphing calculator for project work',
  'Barely used Casio scientific calculator. Includes original hard case, solar backup working 100%, and quick reference card. Perfect for B.Tech exams & GATE prep.',
  'Girls Hostel 2', 'Computer Science & Engineering', 'Central Library / CS Block',
  'Approved'
),

-- Product 2: Cycle
(
  'rohan_v', 'students',
  ARRAY['cycle-img-1.jpg', 'cycle-img-2.jpg', 'cycle-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
  ],
  NULL,
  'Cycles & Transport', 'Good',
  'Hero Sprint Next 24T Gear Cycle (Front Suspension)',
  3400, 7500, true,
  'Hero', 'Sprint Next 24T', 2022,
  'Graduating and moving out of campus',
  'Sturdy campus cycle. Smooth 21-speed Shimano gears, dual disc brakes, new gel seat cover installed last month. Perfect for commuting between hostels and lecture halls.',
  'Hostel 5 (Boys)', 'Mechanical Engineering', 'Main Gate Cycle Stand / Hostel 7',
  'Approved'
),

-- Product 3: Algorithm Book
(
  'priya_n', 'students',
  ARRAY['book-img-1.jpg', 'book-img-2.jpg', 'book-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  ],
  NULL,
  'Books & Notes', 'Like New',
  'CLRS Introduction to Algorithms - 3rd Edition',
  650, 1499, false,
  'MIT Press', 'CLRS 3rd Edition', 2023,
  'Completed the course, no longer needed',
  'Essential textbook for DS&A course. Crisp binding, zero pen marks or highlighter stains. Free hand-written algorithm revision notes included!',
  'Girls Hostel 1', 'Information Technology', 'Central Library / CS Block',
  'Approved'
),

-- Product 4: Mini Fridge
(
  'karthik_r', 'students',
  ARRAY['fridge-img-1.jpg', 'fridge-img-2.jpg', 'fridge-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
  ],
  NULL,
  'Hostel Essentials', 'Good',
  'Godrej Direct Cool Mini Fridge 45L',
  4800, 9900, true,
  'Godrej', 'Direct Cool 45L', 2022,
  'Moving out of hostel after final exams',
  'Keeps milk, fruits, cold coffee & energy drinks freezing cold. Low noise, 5-star power rating. Selling because moving out after final exams.',
  'Hostel 9 (Boys)', 'Electrical & Electronics Engineering', 'SAC Canteen / Hostel 9 Gate',
  'Approved'
),

-- Product 5: Ergonomic Chair
(
  'sneha_p', 'students',
  ARRAY['chair-img-1.jpg', 'chair-img-2.jpg', 'chair-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80'
  ],
  NULL,
  'Furniture', 'Like New',
  'Ergonomic Mesh Study Chair with Lumbar Support',
  1800, 4200, true,
  'Generic', 'High-Back Mesh', 2023,
  'Shifting to a new room with a built-in chair',
  'High-back breathing mesh desk chair. Pneumatic height adjustment, 360-degree silent swivel wheels. No squeaks or tears. Great for long night study sessions.',
  'Girls Hostel 2', 'Biotechnology', 'Girls Hostel 2 Main Entrance',
  'Approved'
),

-- Product 6: Lab Coat + Goggles
(
  'devansh_g', 'students',
  ARRAY['labcoat-img-1.jpg', 'labcoat-img-2.jpg', 'labcoat-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
  ],
  NULL,
  'Lab Equipment', 'Brand New',
  'Chemistry Lab Coat + Borosilicate Safety Goggles Set',
  350, 850, false,
  'Generic', 'Size M Lab Set', 2024,
  'Bought extra set, only need one',
  '100% Cotton heavy-duty white lab coat (Size M) with anti-fog UV protective goggles. Mandatory requirement for 1st & 2nd year chemistry labs.',
  'Hostel 1 (Boys)', 'Chemical Engineering', 'Chemistry Lab Block',
  'Approved'
),

-- Product 7: Badminton Rackets
(
  'vikram_s', 'students',
  ARRAY['racket-img-1.jpg', 'racket-img-2.jpg', 'racket-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
  ],
  NULL,
  'Sports Gear', 'Good',
  'Yonex Muscle Power 29 Badminton Racket Pair + Bag',
  1200, 2800, true,
  'Yonex', 'Muscle Power 29', 2022,
  'Switching to a heavier racket for tournaments',
  'Set of 2 Yonex original graphite shaft badminton rackets strung with BG65 at 24 lbs tension. Includes carrying case and 3 Mavis 350 shuttles.',
  'Hostel 3 (Boys)', 'Civil Engineering', 'Sports Complex / Indoor Court',
  'Approved'
),

-- Product 8: Portable LED Lamp
(
  'meera_m', 'students',
  ARRAY['lamp-img-1.jpg', 'lamp-img-2.jpg', 'lamp-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80'
  ],
  NULL,
  'Hostel Essentials', 'Like New',
  'Mini Portable Desk LED Lamp with Rechargeable Battery',
  320, 799, false,
  'Generic', 'USB-C LED Lamp', 2024,
  'Got a new study lamp as birthday gift',
  '3 brightness color modes, touch sensor dimmer, USB Type-C charging. Battery lasts 8 hours. Great for hostel night electricity cut-offs.',
  'Girls Hostel 1', 'Electronics & Communication', 'Hostel 3 Common Room / SAC',
  'Approved'
);


-- ============================================================
-- SEED: buyer_marketplace table (Products for Buyers to Buy)
-- ============================================================
INSERT INTO buyer_marketplace (
  product_title, price, original_price, category, condition,
  seller_name, seller_contact, location, department, image_urls,
  description, negotiable, status
) VALUES
(
  'Casio fx-991EX ClassWiz Engineering Scientific Calculator', 950, 1695, 'electronics', 'Like New',
  'Ananya Sharma', '+91 98765 43210', 'Hostel 4 (C-Block)', 'Computer Science',
  ARRAY['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'],
  'Barely used Casio scientific calculator. Includes original hard case & quick reference card.', true, 'Available'
),
(
  'Hero Sprint Next 24T Gear Cycle', 3400, 7500, 'cycles', 'Good',
  'Rohan Verma', '+91 98123 45678', 'Hostel 5', 'Mechanical Engineering',
  ARRAY['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
  'Smooth 21-speed Shimano gears, dual disc brakes, new gel seat cover.', true, 'Available'
),
(
  'CLRS Introduction to Algorithms - 3rd Edition', 650, 1499, 'books', 'Like New',
  'Priya Nair', '+91 97654 32109', 'Girls Hostel 1', 'Information Technology',
  ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
  'Essential textbook for DS&A. Free hand-written revision notes included!', false, 'Available'
);


-- ============================================================
-- SEED: buyer_orders table (Buyer Purchase History)
-- ============================================================
INSERT INTO buyer_orders (
  product_title, price, buyer_name, buyer_email, seller_name, pickup_location, status
) VALUES
(
  'MacBook Air M1 (2020) 256GB SSD', 48500, 'Jana K', 'jana.k@campus.edu', 'Dr. Ramesh Kumar', 'Central Library Foyer', 'Completed'
),
(
  'Engineering Mathematics Vol 1 & 2 Textbook', 450, 'Jana K', 'jana.k@campus.edu', 'Priya Patel', 'SAC Canteen', 'Completed'
);


-- ============================================================
-- SEED: chat_threads & chat_messages table (User Conversations)
-- ============================================================
INSERT INTO chat_threads (
  seller_name, seller_avatar, seller_dept, seller_phone, buyer_name,
  item_title, item_price, item_image, is_online, unread_count, last_msg_time
) VALUES
(
  'Ananya Sharma',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'Computer Science & Engineering', '+91 98765 43210', 'Jana K',
  'Casio fx-991EX Calculator', 950,
  'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=250&q=80',
  true, 1, '10:45 AM'
),
(
  'Rohan Verma',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'Mechanical Engineering', '+91 98123 45678', 'Jana K',
  'Hero Sprint 24T Cycle', 3400,
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=250&q=80',
  false, 0, 'Yesterday'
);


