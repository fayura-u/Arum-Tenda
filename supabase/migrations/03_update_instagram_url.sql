-- ==============================================================================
-- MIGRASI 03: PERBARUI TAUTAN INSTAGRAM KE AKUN RESMI (@arumtendapbg)
-- ==============================================================================

UPDATE public.gallery_items
SET instagram_url = 'https://www.instagram.com/arumtendapbg/'
WHERE instagram_url = 'https://www.instagram.com/arumtenda/'
   OR instagram_url IS NULL
   OR instagram_url LIKE '%instagram.com/arumtenda/%';
