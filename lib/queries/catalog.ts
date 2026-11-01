import { createClient as createServerSupabase, createAdminClient } from '@/utils/supabase/server';
import { createClient as createDirectSupabase } from '@supabase/supabase-js';

export interface PriceRecord {
  id: string;
  product_id: string;
  spec_name: string;
  price: number;
  unit: string;
  min_order: number;
  notes: string | null;
  order_position: number;
}

export interface ColorRecord {
  id: string;
  product_id: string;
  color_name: string;
  hex_code: string;
  image_url: string | null;
  order_position: number;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  order_position: number;
}

export interface ProductRecord {
  id: string;
  category_id: string | null;
  category?: CategoryRecord | null;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  prices: PriceRecord[];
  colors: ColorRecord[];
}

export interface GalleryItemRecord {
  id: string;
  title: string;
  tent_type: string;
  image_url: string;
  instagram_url: string | null;
  is_featured: boolean;
  created_at: string;
}

/**
 * Helper internal untuk mendapatkan client Supabase yang paling andal
 */
async function getReliableClient(forAdmin = false) {
  if (forAdmin) {
    try {
      return await createAdminClient();
    } catch {
      // Fallback jika SERVICE_ROLE_KEY tidak diset
    }
  }

  try {
    return await createServerSupabase();
  } catch {
    // Fallback tanpa cookies untuk query data publik
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && anonKey) {
      return createDirectSupabase(url, anonKey);
    }
    throw new Error('Supabase URL atau Anon Key tidak ditemukan di environment.');
  }
}

/**
 * 1. Mengambil seluruh produk aktif untuk konsumsi publik (/katalog)
 */
export async function getCatalogProducts(): Promise<ProductRecord[]> {
  try {
    const supabase = await getReliableClient(false);

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), prices:product_prices(*), colors:product_colors(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching catalog products:', error.message);
      return [];
    }

    return (data || []).map((product: any) => ({
      ...product,
      prices: (product.prices || []).sort(
        (a: PriceRecord, b: PriceRecord) => a.order_position - b.order_position
      ),
      colors: (product.colors || []).sort(
        (a: ColorRecord, b: ColorRecord) => a.order_position - b.order_position
      ),
    })) as ProductRecord[];
  } catch (err: any) {
    console.warn('Supabase getCatalogProducts error:', err.message);
    return [];
  }
}

/**
 * 2. Mengambil SELURUH produk untuk Dasbor CMS Admin (/admin)
 *    Termasuk yang berstatus draft/nonaktif
 */
export async function getAdminProducts(): Promise<ProductRecord[]> {
  try {
    const supabase = await getReliableClient(true);

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), prices:product_prices(*), colors:product_colors(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin products:', error.message);
      return [];
    }

    return (data || []).map((product: any) => ({
      ...product,
      prices: (product.prices || []).sort(
        (a: PriceRecord, b: PriceRecord) => a.order_position - b.order_position
      ),
      colors: (product.colors || []).sort(
        (a: ColorRecord, b: ColorRecord) => a.order_position - b.order_position
      ),
    })) as ProductRecord[];
  } catch (err: any) {
    console.warn('Supabase getAdminProducts error:', err.message);
    return [];
  }
}

/**
 * 3. Mengambil 1 produk spesifik berdasarkan slug
 */
export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  try {
    const supabase = await getReliableClient(false);

    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), prices:product_prices(*), colors:product_colors(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      ...data,
      prices: (data.prices || []).sort(
        (a: PriceRecord, b: PriceRecord) => a.order_position - b.order_position
      ),
      colors: (data.colors || []).sort(
        (a: ColorRecord, b: ColorRecord) => a.order_position - b.order_position
      ),
    } as ProductRecord;
  } catch (err: any) {
    console.warn('Error fetching product by slug:', err.message);
    return null;
  }
}

/**
 * 4. Mengambil foto galeri publik dengan filter opsional
 */
export async function getGalleryItems(category?: string): Promise<GalleryItemRecord[]> {
  try {
    const supabase = await getReliableClient(false);

    let query = supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.ilike('tent_type', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching gallery items:', error.message);
      return [];
    }

    return (data || []) as GalleryItemRecord[];
  } catch (err: any) {
    console.warn('Supabase getGalleryItems error:', err.message);
    return [];
  }
}

/**
 * 5. Mengambil foto galeri untuk Dasbor Admin
 */
export async function getAdminGallery(): Promise<GalleryItemRecord[]> {
  try {
    const supabase = await getReliableClient(true);

    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin gallery:', error.message);
      return [];
    }

    return (data || []) as GalleryItemRecord[];
  } catch (err: any) {
    console.warn('Supabase getAdminGallery error:', err.message);
    return [];
  }
}

const defaultCategoriesFallback: CategoryRecord[] = [
  { id: '0a35085f-146a-443d-b6d6-1c0c1d7750ad', name: 'Tenda', slug: 'tenda', order_position: 1 },
  { id: '0668eac3-0979-4d6e-963b-89fb7ee0758b', name: 'Perlengkapan Acara', slug: 'perlengkapan-acara', order_position: 2 },
];

/**
 * 6. Mengambil seluruh kategori produk
 */
export async function getCategories(): Promise<CategoryRecord[]> {
  try {
    const supabase = await getReliableClient(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error.message);
      return defaultCategoriesFallback;
    }

    if (!data || data.length === 0) {
      return defaultCategoriesFallback;
    }

    return data as CategoryRecord[];
  } catch (err: any) {
    console.warn('Supabase getCategories error:', err.message);
    return defaultCategoriesFallback;
  }
}
