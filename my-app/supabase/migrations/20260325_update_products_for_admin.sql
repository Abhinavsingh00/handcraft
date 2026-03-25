-- Migration: Update products table for admin dashboard compatibility
-- Created: 2025-03-25
-- This migration aligns the products table with the admin dashboard expectations

-- First, check if the products table exists with the old schema
-- If it does, we need to migrate data before altering

-- Add new columns for admin dashboard
DO $$
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'status'
    ) THEN
        ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'active';
        ALTER TABLE products ADD CONSTRAINT check_status
            CHECK (status IN ('active', 'draft', 'archived'));
    END IF;

    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE products ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;

    -- Add title column (rename from name if needed) for admin compatibility
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'title'
    ) THEN
        ALTER TABLE products ADD COLUMN title TEXT;

        -- Migrate data from name to title if name exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'products' AND column_name = 'name'
        ) THEN
            UPDATE products SET title = name WHERE title IS NULL;
        END IF;
    END IF;
END $$;

-- Create indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);

-- Update RLS policies for admin operations
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Admins can insert products"
ON products FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update products"
ON products FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete products"
ON products FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Update the public read policy to only show active products
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
CREATE POLICY "Active products are publicly readable"
ON products FOR SELECT USING (status = 'active');

-- Grant admins ability to view all products
CREATE POLICY "Admins can view all products"
ON products FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
