-- ==============================================================================
-- OPTIONAL SEED DATA: ARUM TENDA (PRODUK & GALERI AWAL)
-- ==============================================================================
-- Jalankan file ini SETELAH menjalankan 01_phase1_phase2_schema_and_rls.sql
-- Digunakan untuk mengisi data awal katalog & galeri agar tidak kosong.
-- ==============================================================================

DO $$
DECLARE
    cat_tenda_id UUID := gen_random_uuid();
    cat_perlengkapan_id UUID := gen_random_uuid();
    
    prod_roder_id UUID := gen_random_uuid();
    prod_dekorasi_id UUID := gen_random_uuid();
    prod_sarnafil_id UUID := gen_random_uuid();
    prod_tableware_id UUID := gen_random_uuid();
    prod_glassware_id UUID := gen_random_uuid();
    prod_meja_kursi_id UUID := gen_random_uuid();
BEGIN
    -- 1. Insert Categories
    INSERT INTO public.categories (id, name, slug, order_position)
    VALUES
        (cat_tenda_id, 'Tenda', 'tenda', 1),
        (cat_perlengkapan_id, 'Perlengkapan Acara', 'perlengkapan-acara', 2)
    ON CONFLICT (slug) DO NOTHING;

    -- Ambil ID jika sudah ada sebelumnya
    SELECT id INTO cat_tenda_id FROM public.categories WHERE slug = 'tenda';
    SELECT id INTO cat_perlengkapan_id FROM public.categories WHERE slug = 'perlengkapan-acara';

    -- 2. Insert Products
    -- 2.1 Tenda Roder
    INSERT INTO public.products (id, category_id, name, slug, description, is_active)
    VALUES (
        prod_roder_id,
        cat_tenda_id,
        'Tenda Roder',
        'tenda-roder',
        'Ruang luas tanpa tiang tengah, memberikan kenyamanan maksimal untuk acara pernikahan, pameran, dan perayaan besar.',
        true
    ) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO prod_roder_id;

    -- 2.2 Tenda Dekorasi
    INSERT INTO public.products (id, category_id, name, slug, description, is_active)
    VALUES (
        prod_dekorasi_id,
        cat_tenda_id,
        'Tenda Dekorasi',
        'tenda-dekorasi',
        'Kanopi dengan pilihan kain serut dan kombinasi warna elegan untuk suasana intimate yang personal dan sakral.',
        true
    ) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO prod_dekorasi_id;

    -- 2.3 Tenda Sarnafil
    INSERT INTO public.products (id, category_id, name, slug, description, is_active)
    VALUES (
        prod_sarnafil_id,
        cat_tenda_id,
        'Tenda Sarnafil',
        'tenda-sarnafil',
        'Pilihan kerucut modern yang praktis dan kokoh untuk booth bazar, area penerima tamu, pos keamanan, atau stan VIP.',
        true
    ) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO prod_sarnafil_id;

    -- 2.4 Paket Alat Makan
    INSERT INTO public.products (id, category_id, name, slug, description, is_active)
    VALUES (
        prod_tableware_id,
        cat_perlengkapan_id,
        'Paket Alat Makan',
        'paket-alat-makan',
        'Paket perlengkapan jamuan lengkap berisi piring keramik, sendok, garpu, dan perlengkapan saji higienis.',
        true
    ) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO prod_tableware_id;

    -- 2.5 Gelas & Glassware
    INSERT INTO public.products (id, category_id, name, slug, description, is_active)
    VALUES (
        prod_glassware_id,
        cat_perlengkapan_id,
        'Gelas & Glassware',
        'gelas-glassware',
        'Pilihan varian gelas air minum, gelas goblet, dan cangkir kopi/teh untuk meja tamu maupun meja VIP.',
        true
    ) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO prod_glassware_id;

    -- 2.6 Meja & Kursi
    INSERT INTO public.products (id, category_id, name, slug, description, is_active)
    VALUES (
        prod_meja_kursi_id,
        cat_perlengkapan_id,
        'Meja & Kursi Pesta',
        'meja-kursi-pesta',
        'Set meja bundar/kotak beserta kursi futura atau tiffany lengkap dengan cover kain beraneka warna.',
        true
    ) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO prod_meja_kursi_id;

    -- 3. Insert Product Prices (Dealer & Spec Prices)
    -- Hapus harga lama untuk produk terkait agar idempotent
    DELETE FROM public.product_prices WHERE product_id IN (prod_roder_id, prod_dekorasi_id, prod_sarnafil_id, prod_tableware_id, prod_glassware_id, prod_meja_kursi_id);

    INSERT INTO public.product_prices (product_id, spec_name, price, unit, min_order, notes, order_position)
    VALUES
        (prod_roder_id, 'Bentang 10m Standar', 85000, 'm²', 50, 'Termasuk rangka aluminium dan terpal blackout', 1),
        (prod_roder_id, 'Bentang 15m VIP', 110000, 'm²', 100, 'Tinggi tiang 4 meter, kokoh untuk event berskala besar', 2),
        (prod_dekorasi_id, 'Kain Serut Standar', 65000, 'm²', 20, 'Kombinasi 2 pilihan warna kain', 1),
        (prod_dekorasi_id, 'Dekorasi Full VIP & Plafon', 95000, 'm²', 30, 'Plafon bertingkat + lampu gantung dekoratif', 2),
        (prod_sarnafil_id, 'Ukuran 3 × 3 m', 350000, 'unit/hari', 1, 'Rangka kokoh aluminium, dinding samping opsional', 1),
        (prod_sarnafil_id, 'Ukuran 5 × 5 m', 600000, 'unit/hari', 1, 'Cocok untuk booth korporat atau tenda medis', 2),
        (prod_tableware_id, 'Paket Standar (Piring + Sendok + Garpu)', 18000, 'set', 50, 'Piring keramik putih bersih', 1),
        (prod_glassware_id, 'Gelas Minum Highball', 7000, 'pcs', 50, 'Kapasitas 300ml bening', 1),
        (prod_meja_kursi_id, 'Set Meja Bulat + 6 Kursi Futura', 120000, 'set', 5, 'Sudah termasuk taplak meja dan cover kursi', 1);

    -- 4. Insert Product Colors
    DELETE FROM public.product_colors WHERE product_id IN (prod_roder_id, prod_dekorasi_id, prod_sarnafil_id);

    INSERT INTO public.product_colors (product_id, color_name, hex_code, image_url, order_position)
    VALUES
        (prod_roder_id, 'Putih Bersih', '#FFFFFF', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=82', 1),
        (prod_roder_id, 'Transparan Clear', '#D4E2D4', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1100&q=82', 2),
        (prod_dekorasi_id, 'Ivory & Emas', '#F0ECE0', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1100&q=82', 1),
        (prod_dekorasi_id, 'Emerald Mewah', '#233729', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1100&q=82', 2),
        (prod_dekorasi_id, 'Terracotta Hangat', '#C86D51', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1100&q=82', 3),
        (prod_sarnafil_id, 'Putih Standar', '#FFFFFF', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1100&q=82', 1);

    -- 5. Insert Gallery Items
    DELETE FROM public.gallery_items WHERE title IN (
        'Pesta di ruang yang hangat',
        'Detail dekorasi untuk jamuan',
        'Perayaan bersama keluarga',
        'Ruang terbuka untuk berkumpul',
        'Tata meja untuk hari istimewa',
        'Warna dan detail perayaan'
    );

    INSERT INTO public.gallery_items (title, tent_type, image_url, instagram_url, is_featured)
    VALUES
        ('Pesta di ruang yang hangat', 'transparan', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=84', 'https://www.instagram.com/arumtenda/', true),
        ('Detail dekorasi untuk jamuan', 'kerut', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1100&q=84', 'https://www.instagram.com/arumtenda/', true),
        ('Perayaan bersama keluarga', 'blukat', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1100&q=84', 'https://www.instagram.com/arumtenda/', false),
        ('Ruang terbuka untuk berkumpul', 'piramid', 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1100&q=84', 'https://www.instagram.com/arumtenda/', true),
        ('Tata meja untuk hari istimewa', 'transparan', 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?auto=format&fit=crop&w=1100&q=84', 'https://www.instagram.com/arumtenda/', false),
        ('Warna dan detail perayaan', 'kerut', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1100&q=84', 'https://www.instagram.com/arumtenda/', false);

END $$;
