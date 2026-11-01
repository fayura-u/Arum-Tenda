'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { ProductFormSchema, type ProductFormInput } from '@/lib/validations/catalog';

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action: Membuat produk baru beserta relasi harga dan varian warna secara atomik.
 */
export async function createProductAction(data: ProductFormInput): Promise<ActionResponse> {
  try {
    const validated = ProductFormSchema.safeParse(data);
    if (!validated.success) {
      const flattened = validated.error.flatten();
      return {
        success: false,
        error: 'Validasi form produk gagal. Periksa kembali isian formulir.',
        fieldErrors: flattened.fieldErrors as Record<string, string[]>,
      };
    }

    const { name, slug, category_id, description, is_active, prices, colors } = validated.data;
    const supabase = await createClient();

    // 1. Insert ke tabel products
    const { data: product, error: prodError } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        category_id: category_id || null,
        description: description || null,
        is_active: is_active ?? true,
      })
      .select('id')
      .single();

    if (prodError || !product) {
      if (prodError?.code === '23505') {
        return { success: false, error: 'Slug produk sudah digunakan. Silakan gunakan slug lain.' };
      }
      return { success: false, error: `Gagal menyimpan produk: ${prodError?.message}` };
    }

    const productId = product.id;

    // 2. Batch insert ke tabel product_prices
    if (prices && prices.length > 0) {
      const priceRows = prices.map((price, index) => ({
        product_id: productId,
        spec_name: price.spec_name,
        price: price.price,
        unit: price.unit,
        min_order: price.min_order ?? 1,
        notes: price.notes || null,
        order_position: price.order_position ?? index + 1,
      }));

      const { error: priceError } = await supabase.from('product_prices').insert(priceRows);
      if (priceError) {
        // Rollback produk jika gagal
        await supabase.from('products').delete().eq('id', productId);
        return { success: false, error: `Gagal menyimpan spesifikasi harga: ${priceError.message}` };
      }
    }

    // 3. Batch insert ke tabel product_colors
    if (colors && colors.length > 0) {
      const colorRows = colors.map((color, index) => ({
        product_id: productId,
        color_name: color.color_name,
        hex_code: color.hex_code,
        image_url: color.image_url || null,
        order_position: color.order_position ?? index + 1,
      }));

      const { error: colorError } = await supabase.from('product_colors').insert(colorRows);
      if (colorError) {
        // Rollback produk jika gagal
        await supabase.from('products').delete().eq('id', productId);
        return { success: false, error: `Gagal menyimpan varian warna: ${colorError.message}` };
      }
    }

    // 4. On-demand cache invalidation
    revalidatePath('/katalog');
    revalidatePath('/galeri');
    revalidatePath('/');

    return { success: true, data: { id: productId } };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem saat membuat produk.' };
  }
}

/**
 * Server Action: Mengupdate data produk dan sinkronisasi baris harga serta varian warna.
 */
export async function updateProductAction(
  id: string,
  data: ProductFormInput
): Promise<ActionResponse> {
  try {
    if (!id) {
      return { success: false, error: 'ID produk tidak ditemukan.' };
    }

    const validated = ProductFormSchema.safeParse(data);
    if (!validated.success) {
      const flattened = validated.error.flatten();
      return {
        success: false,
        error: 'Validasi form produk gagal. Periksa kembali isian formulir.',
        fieldErrors: flattened.fieldErrors as Record<string, string[]>,
      };
    }

    const { name, slug, category_id, description, is_active, prices, colors } = validated.data;
    const supabase = await createClient();

    // 1. Update data dasar produk
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name,
        slug,
        category_id: category_id || null,
        description: description || null,
        is_active: is_active ?? true,
      })
      .eq('id', id);

    if (updateError) {
      if (updateError.code === '23505') {
        return { success: false, error: 'Slug sudah dipakai oleh produk lain.' };
      }
      return { success: false, error: `Gagal memperbarui produk: ${updateError.message}` };
    }

    // 2. Sinkronisasi baris harga (hapus dan perbarui daftar)
    await supabase.from('product_prices').delete().eq('product_id', id);
    if (prices && prices.length > 0) {
      const priceRows = prices.map((price, index) => ({
        product_id: id,
        spec_name: price.spec_name,
        price: price.price,
        unit: price.unit,
        min_order: price.min_order ?? 1,
        notes: price.notes || null,
        order_position: price.order_position ?? index + 1,
      }));
      const { error: priceError } = await supabase.from('product_prices').insert(priceRows);
      if (priceError) {
        return { success: false, error: `Gagal memperbarui harga: ${priceError.message}` };
      }
    }

    // 3. Sinkronisasi varian warna (hapus dan perbarui daftar)
    await supabase.from('product_colors').delete().eq('product_id', id);
    if (colors && colors.length > 0) {
      const colorRows = colors.map((color, index) => ({
        product_id: id,
        color_name: color.color_name,
        hex_code: color.hex_code,
        image_url: color.image_url || null,
        order_position: color.order_position ?? index + 1,
      }));
      const { error: colorError } = await supabase.from('product_colors').insert(colorRows);
      if (colorError) {
        return { success: false, error: `Gagal memperbarui varian warna: ${colorError.message}` };
      }
    }

    // 4. On-demand cache invalidation
    revalidatePath('/katalog');
    revalidatePath('/galeri');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem saat memperbarui produk.' };
  }
}

/**
 * Server Action: Menghapus produk (cascade otomatis menghapus harga & warna)
 * sekaligus membersihkan aset gambar di Supabase Storage.
 */
export async function deleteProductAction(id: string): Promise<ActionResponse> {
  try {
    if (!id) {
      return { success: false, error: 'ID produk tidak ditemukan.' };
    }

    const supabase = await createClient();

    // 1. Ambil data gambar terkait di product_colors sebelum produk dihapus
    const { data: colorRows } = await supabase
      .from('product_colors')
      .select('image_url')
      .eq('product_id', id);

    // 2. Hapus baris produk dari database (PostgreSQL CASCADE akan menghapus prices & colors)
    const { error: deleteError } = await supabase.from('products').delete().eq('id', id);

    if (deleteError) {
      return { success: false, error: `Gagal menghapus produk: ${deleteError.message}` };
    }

    // 3. Bersihkan aset file di Storage bucket jika berasal dari arum-media
    if (colorRows && colorRows.length > 0) {
      const filesToDelete = colorRows
        .map((row) => row.image_url)
        .filter((url): url is string => Boolean(url && url.includes('/arum-media/')))
        .map((url) => {
          const match = url.match(/\/arum-media\/(.+)$/);
          return match ? match[1] : null;
        })
        .filter((path): path is string => Boolean(path));

      if (filesToDelete.length > 0) {
        await supabase.storage.from('arum-media').remove(filesToDelete);
      }
    }

    // 4. On-demand cache invalidation
    revalidatePath('/katalog');
    revalidatePath('/galeri');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem saat menghapus produk.' };
  }
}
