-- =====================================================
-- Products Table Schema for Pawfectly Handmade
-- =====================================================

-- Products table with all product information
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  category TEXT NOT NULL CHECK (category IN ('collars-leashes', 'treats-chews', 'beds-blankets', 'toys-accessories')),
  badge TEXT CHECK (badge IN ('new', 'sale', 'bestseller')),
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  stock INTEGER DEFAULT 0,
  bulk_pricing JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products(badge) WHERE badge IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view products)
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (true);

-- No write policies from frontend (admin only in future phase)

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE products IS 'Product catalog for Pawfectly Handmade e-commerce site';
