-- ==============================================================================
-- FASE 1 & FASE 2: SCHEMA, CASCADE, INDEX, RLS & STORAGE BUCKET (ARUM TENDA)
-- ==============================================================================
-- File ini siap dijalankan langsung di Supabase SQL Editor (Dashboard -> SQL Editor)
-- Didesain idempotent (aman dijalankan berulang kali).
-- ==============================================================================

-- 0. EXTENSION & TRIGGER HELPER
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 1. PEMBUATAN TABEL RELASIONAL (FASE 1)
-- ==============================================================================

-- Tabel categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    order_position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Tabel products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger auto-update timestamp untuk products
DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Tabel product_prices (Pricelist Dealer) dengan ON DELETE CASCADE
CREATE TABLE IF NOT EXISTS public.product_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    spec_name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    unit VARCHAR(50) NOT NULL,
    min_order INT NOT NULL DEFAULT 1,
    notes TEXT,
    order_position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Tabel product_colors (Varian Warna & Gambar) dengan ON DELETE CASCADE
CREATE TABLE IF NOT EXISTS public.product_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    color_name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(7) NOT NULL,
    image_url TEXT,
    order_position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Tabel gallery_items
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    tent_type VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    instagram_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 2. OPTIMASI INDEKS DATABASE (FASE 1)
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_prices_product ON public.product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_colors_product ON public.product_colors(product_id);
CREATE INDEX IF NOT EXISTS idx_gallery_type ON public.gallery_items(tent_type);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) - (FASE 2)
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- --- Kebijakan: categories ---
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories"
ON public.categories
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admin full access on categories" ON public.categories;
CREATE POLICY "Admin full access on categories"
ON public.categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- --- Kebijakan: products ---
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
CREATE POLICY "Public can read active products"
ON public.products
FOR SELECT
TO public
USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access on products" ON public.products;
CREATE POLICY "Admin full access on products"
ON public.products
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- --- Kebijakan: product_prices ---
DROP POLICY IF EXISTS "Public can read prices of active products" ON public.product_prices;
CREATE POLICY "Public can read prices of active products"
ON public.product_prices
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_prices.product_id AND p.is_active = true
    )
);

DROP POLICY IF EXISTS "Admin full access on product_prices" ON public.product_prices;
CREATE POLICY "Admin full access on product_prices"
ON public.product_prices
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- --- Kebijakan: product_colors ---
DROP POLICY IF EXISTS "Public can read colors of active products" ON public.product_colors;
CREATE POLICY "Public can read colors of active products"
ON public.product_colors
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_colors.product_id AND p.is_active = true
    )
);

DROP POLICY IF EXISTS "Admin full access on product_colors" ON public.product_colors;
CREATE POLICY "Admin full access on product_colors"
ON public.product_colors
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- --- Kebijakan: gallery_items ---
DROP POLICY IF EXISTS "Public can read gallery items" ON public.gallery_items;
CREATE POLICY "Public can read gallery items"
ON public.gallery_items
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admin full access on gallery_items" ON public.gallery_items;
CREATE POLICY "Admin full access on gallery_items"
ON public.gallery_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- 4. SETUP STORAGE BUCKET & STORAGE RLS (FASE 2)
-- ==============================================================================

-- Buat bucket 'arum-media' jika belum ada, dengan batas ukuran 5MB dan tipe MIME tertentu
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'arum-media',
    'arum-media',
    true,
    5242880, -- 5 MB (5 * 1024 * 1024 bytes)
    ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS pada storage.objects untuk bucket 'arum-media'
DROP POLICY IF EXISTS "Public can view arum-media images" ON storage.objects;
CREATE POLICY "Public can view arum-media images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'arum-media');

DROP POLICY IF EXISTS "Authenticated admin can upload images to arum-media" ON storage.objects;
CREATE POLICY "Authenticated admin can upload images to arum-media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'arum-media');

DROP POLICY IF EXISTS "Authenticated admin can update images in arum-media" ON storage.objects;
CREATE POLICY "Authenticated admin can update images in arum-media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'arum-media')
WITH CHECK (bucket_id = 'arum-media');

DROP POLICY IF EXISTS "Authenticated admin can delete images from arum-media" ON storage.objects;
CREATE POLICY "Authenticated admin can delete images from arum-media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'arum-media');
