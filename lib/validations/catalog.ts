import { z } from 'zod';

/**
 * Validasi baris harga per spesifikasi (product_prices)
 */
export const PriceItemSchema = z.object({
  id: z.string().uuid().optional(),
  spec_name: z
    .string()
    .trim()
    .min(1, 'Nama spesifikasi wajib diisi (misal: "Ukuran 4x6 m" atau "Roder VIP")'),
  price: z.coerce
    .number()
    .positive('Harga sewa harus lebih dari 0'),
  unit: z
    .string()
    .trim()
    .min(1, 'Satuan wajib diisi (misal: "m²", "set", "hari")'),
  min_order: z.coerce
    .number()
    .int('Minimal order harus bilangan bulat')
    .min(1, 'Minimal order minimal 1')
    .default(1),
  notes: z.string().trim().nullable().optional(),
  order_position: z.coerce.number().int().default(0),
});

/**
 * Validasi varian warna & gambar (product_colors)
 */
export const ColorItemSchema = z.object({
  id: z.string().uuid().optional(),
  color_name: z
    .string()
    .trim()
    .min(1, 'Nama warna wajib diisi (misal: Ivory, Emerald, Terracotta)'),
  hex_code: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Format HEX tidak valid. Contoh yang benar: #233729 atau #FFF'),
  image_url: z
    .string()
    .trim()
    .url('Format URL gambar tidak valid')
    .nullable()
    .optional()
    .or(z.literal('')),
  order_position: z.coerce.number().int().default(0),
});

/**
 * Validasi form produk lengkap (products + prices + colors)
 */
export const ProductFormSchema = z.object({
  id: z.string().uuid().optional(),
  category_id: z.string().uuid('Kategori ID harus berupa UUID valid').nullable().optional(),
  name: z
    .string()
    .trim()
    .min(2, 'Nama produk minimal 2 karakter')
    .max(255, 'Nama produk maksimal 255 karakter'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug minimal 2 karakter')
    .max(255, 'Slug maksimal 255 karakter')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug hanya boleh huruf kecil, angka, dan tanda strip (-) (misal: tenda-roder-vip)'
    ),
  description: z.string().trim().nullable().optional(),
  is_active: z.boolean().default(true),
  prices: z
    .array(PriceItemSchema)
    .min(1, 'Setidaknya harus ada minimal 1 baris spesifikasi harga'),
  colors: z.array(ColorItemSchema).default([]),
});

/**
 * Validasi form item galeri (gallery_items)
 */
export const GalleryFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .trim()
    .min(2, 'Judul foto galeri minimal 2 karakter')
    .max(255, 'Judul foto galeri maksimal 255 karakter'),
  tent_type: z
    .string()
    .trim()
    .min(1, 'Tipe tenda wajib dipilih (misal: transparan, kerut, blukat, piramid)'),
  image_url: z
    .string()
    .trim()
    .url('URL gambar foto galeri wajib berupa tautan valid'),
  instagram_url: z
    .string()
    .trim()
    .url('Format tautan Instagram harus berupa URL valid (https://...)')
    .nullable()
    .optional()
    .or(z.literal('')),
  is_featured: z.boolean().default(false),
});

export type PriceItemInput = z.infer<typeof PriceItemSchema>;
export type ColorItemInput = z.infer<typeof ColorItemSchema>;
export type ProductFormInput = z.infer<typeof ProductFormSchema>;
export type GalleryFormInput = z.infer<typeof GalleryFormSchema>;
