'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/utils/supabase/authorization';
import { GalleryFormSchema, type GalleryFormInput } from '@/lib/validations/catalog';
import type { ActionResponse } from './catalog';

/**
 * Server Action: Menambahkan foto/item baru ke galeri
 */
export async function createGalleryItemAction(data: GalleryFormInput): Promise<ActionResponse> {
  try {
    const validated = GalleryFormSchema.safeParse(data);
    if (!validated.success) {
      const flattened = validated.error.flatten();
      return {
        success: false,
        error: 'Validasi form galeri gagal.',
        fieldErrors: flattened.fieldErrors as Record<string, string[]>,
      };
    }

    const { title, tent_type, image_url, instagram_url, is_featured } = validated.data;
    const { supabase } = await requireAdmin();

    const { data: item, error: insertError } = await supabase
      .from('gallery_items')
      .insert({
        title,
        tent_type,
        image_url,
        instagram_url: instagram_url || null,
        is_featured: is_featured ?? false,
      })
      .select('id')
      .single();

    if (insertError || !item) {
      return { success: false, error: `Gagal menambahkan item galeri: ${insertError?.message}` };
    }

    // On-demand cache invalidation
    revalidatePath('/galeri');
    revalidatePath('/');

    return { success: true, data: { id: item.id } };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem saat menyimpan item galeri.' };
  }
}

/**
 * Server Action: Menghapus item galeri beserta aset gambarnya di storage jika relevan
 */
export async function deleteGalleryItemAction(id: string): Promise<ActionResponse> {
  try {
    if (!id) {
      return { success: false, error: 'ID item galeri tidak ditemukan.' };
    }

    const { supabase } = await requireAdmin();

    // 1. Ambil info gambar
    const { data: item } = await supabase
      .from('gallery_items')
      .select('image_url')
      .eq('id', id)
      .single();

    // 2. Hapus baris dari tabel
    const { error: deleteError } = await supabase.from('gallery_items').delete().eq('id', id);

    if (deleteError) {
      return { success: false, error: `Gagal menghapus item galeri: ${deleteError.message}` };
    }

    // 3. Bersihkan foto di Supabase Storage jika berasal dari bucket arum-media
    if (item?.image_url && item.image_url.includes('/arum-media/')) {
      const match = item.image_url.match(/\/arum-media\/(.+)$/);
      if (match && match[1]) {
        await supabase.storage.from('arum-media').remove([match[1]]);
      }
    }

    // On-demand cache invalidation
    revalidatePath('/galeri');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Terjadi kesalahan sistem saat menghapus item galeri.' };
  }
}
