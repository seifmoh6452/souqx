-- SOUQX Database Schema
-- Run this in your new Supabase project's SQL Editor

-- 1. Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  brand_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EGP',
  category TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  description TEXT DEFAULT '',
  sizes JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]',
  in_stock BOOLEAN DEFAULT true,
  trending BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  whatsapp_number TEXT DEFAULT '+201001234567',
  high_copy_price NUMERIC,
  master_box_price NUMERIC,
  original_price NUMERIC,
  image_colors JSONB DEFAULT '[]',
  size_chart TEXT,
  sort_order NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  code TEXT PRIMARY KEY,
  discount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'percent')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) — required by Supabase
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Allow anon (public) access — same as your existing setup
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update orders" ON orders FOR UPDATE USING (true);

CREATE POLICY "Allow public read promo_codes" ON promo_codes FOR SELECT USING (true);
CREATE POLICY "Allow public insert promo_codes" ON promo_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete promo_codes" ON promo_codes FOR DELETE USING (true);
