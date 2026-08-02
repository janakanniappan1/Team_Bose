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
-- SEED: user_images table (product listings)
-- ============================================================
INSERT INTO user_images (
  username, object_names, image_urls, "Category", condition,
  product_name, selling_price, original_price, brand, model,
  purchase_year, negotiable, reason, description
) VALUES

-- Product 1: Calculator
(
  'ananya_s',
  ARRAY['calc-img-1.jpg', 'calc-img-2.jpg', 'calc-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
  ],
  'Electronics', 'Like New (Mint Condition)',
  'Casio fx-991CW Advanced Scientific Calculator',
  900, 1595, 'Casio', 'fx-991CW',
  2025, true,
  'Completed math course requirement',
  'Practically brand new Casio CW scientific calculator. Purchased last semester for engineering math. Includes box, manual, and protective case.'
),

-- Product 2: Cycle
(
  'rohan_v',
  ARRAY['cycle-img-1.jpg', 'cycle-img-2.jpg', 'cycle-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'
  ],
  'Cycles & Transport', 'Good',
  'Hero Sprint Next 24T Gear Cycle (Front Suspension)',
  3400, 7500, 'Hero', 'Sprint Next 24T',
  2022, true,
  'Graduating and moving out of campus',
  'Sturdy campus cycle. Smooth 21-speed Shimano gears, dual disc brakes, new gel seat cover installed last month. Perfect for commuting between hostels and lecture halls.'
),

-- Product 3: Book
(
  'priya_n',
  ARRAY['book-img-1.jpg', 'book-img-2.jpg', 'book-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  ],
  'Books & Notes', 'Like New',
  'CLRS Introduction to Algorithms - 3rd Edition',
  650, 1499, 'MIT Press', 'CLRS 3rd Edition',
  2023, false,
  'Completed the course, no longer needed',
  'Essential textbook for DS&A course. Crisp binding, zero pen marks or highlighter stains. Free hand-written algorithm revision notes included!'
),

-- Product 4: Mini Fridge
(
  'karthik_r',
  ARRAY['fridge-img-1.jpg', 'fridge-img-2.jpg', 'fridge-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
  ],
  'Hostel Essentials', 'Good',
  'Godrej Direct Cool Mini Fridge 45L',
  4800, 9900, 'Godrej', 'Direct Cool 45L',
  2022, true,
  'Moving out of hostel after final exams',
  'Keeps milk, fruits, cold coffee & energy drinks freezing cold. Low noise, 5-star power rating. Selling because moving out after final exams.'
),

-- Product 5: Chair
(
  'sneha_p',
  ARRAY['chair-img-1.jpg', 'chair-img-2.jpg', 'chair-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80'
  ],
  'Furniture', 'Like New',
  'Ergonomic Mesh Study Chair with Lumbar Support',
  1800, 4200, 'Generic', 'High-Back Mesh',
  2023, true,
  'Shifting to a new room with a built-in chair',
  'High-back breathing mesh desk chair. Pneumatic height adjustment, 360-degree silent swivel wheels. No squeaks or tears. Great for long night study sessions.'
),

-- Product 6: Lab Coat
(
  'devansh_g',
  ARRAY['labcoat-img-1.jpg', 'labcoat-img-2.jpg', 'labcoat-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
  ],
  'Lab Equipment', 'Brand New',
  'Chemistry Lab Coat + Borosilicate Safety Goggles Set',
  350, 850, 'Generic', 'Size M Lab Set',
  2024, false,
  'Bought extra set, only need one',
  '100% Cotton heavy-duty white lab coat (Size M) with anti-fog UV protective goggles. Mandatory requirement for 1st & 2nd year chemistry labs.'
),

-- Product 7: Badminton Racket
(
  'vikram_s',
  ARRAY['racket-img-1.jpg', 'racket-img-2.jpg', 'racket-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
  ],
  'Sports Gear', 'Good',
  'Yonex Muscle Power 29 Badminton Racket Pair + Bag',
  1200, 2800, 'Yonex', 'Muscle Power 29',
  2022, true,
  'Switching to a heavier racket for tournaments',
  'Set of 2 Yonex original graphite shaft badminton rackets strung with BG65 at 24 lbs tension. Includes carrying case and 3 Mavis 350 shuttles.'
),

-- Product 8: LED Lamp
(
  'meera_m',
  ARRAY['lamp-img-1.jpg', 'lamp-img-2.jpg', 'lamp-img-3.jpg'],
  ARRAY[
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80'
  ],
  'Hostel Essentials', 'Like New',
  'Mini Portable Desk LED Lamp with Rechargeable Battery',
  320, 799, 'Generic', 'USB-C LED Lamp',
  2024, false,
  'Got a new study lamp as birthday gift',
  '3 brightness color modes, touch sensor dimmer, USB Type-C charging. Battery lasts 8 hours. Great for hostel night electricity cut-offs.'
);
