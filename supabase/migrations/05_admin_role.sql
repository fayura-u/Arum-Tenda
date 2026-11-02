-- Admin role authorization.
-- Promote a trusted user by setting app_metadata.role = 'admin' in Supabase Auth.
-- For example, from the SQL Editor (replace the email before running):
-- UPDATE auth.users
-- SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- WHERE email = 'your-admin-email@example.com';
-- The user must sign out and back in for the new role claim to appear in their JWT.

-- Replace the earlier authenticated-user write grants with Admin-only policies.
DROP POLICY IF EXISTS "Admin full access on categories" ON public.categories;
CREATE POLICY "Admin full access on categories"
ON public.categories
FOR ALL
TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin full access on products" ON public.products;
CREATE POLICY "Admin full access on products"
ON public.products
FOR ALL
TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin full access on product_prices" ON public.product_prices;
CREATE POLICY "Admin full access on product_prices"
ON public.product_prices
FOR ALL
TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin full access on product_colors" ON public.product_colors;
CREATE POLICY "Admin full access on product_colors"
ON public.product_colors
FOR ALL
TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admin full access on gallery_items" ON public.gallery_items;
CREATE POLICY "Admin full access on gallery_items"
ON public.gallery_items
FOR ALL
TO authenticated
USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

-- Public image reads remain public; file mutations require the Admin claim.
DROP POLICY IF EXISTS "Authenticated admin can upload images to arum-media" ON storage.objects;
CREATE POLICY "Admin can upload images to arum-media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'arum-media'
  AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);

DROP POLICY IF EXISTS "Authenticated admin can update images in arum-media" ON storage.objects;
CREATE POLICY "Admin can update images in arum-media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'arum-media'
  AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
)
WITH CHECK (
  bucket_id = 'arum-media'
  AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);

DROP POLICY IF EXISTS "Authenticated admin can delete images from arum-media" ON storage.objects;
CREATE POLICY "Admin can delete images from arum-media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'arum-media'
  AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
