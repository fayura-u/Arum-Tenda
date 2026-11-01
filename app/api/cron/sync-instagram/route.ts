import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient, createClient } from '@/utils/supabase/server';

/**
 * Route Handler: Cron Sync Instagram Feed via Meta Graph API
 * Dilindungi Bearer Token (CRON_SECRET)
 */
export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    // 1. Validasi Secret Bearer Token
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak: Bearer token tidak valid atau tidak disediakan.' },
        { status: 401 }
      );
    }

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            'INSTAGRAM_ACCESS_TOKEN belum dikonfigurasi di environment. Sinkronisasi dilewati.',
        },
        { status: 200 }
      );
    }

    // 2. Fetch media terbaru dari Meta Graph API
    const metaApiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=15&access_token=${accessToken}`;
    const response = await fetch(metaApiUrl, { cache: 'no-store' });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, error: 'Gagal mengambil data dari Meta Graph API', details: errorData },
        { status: 502 }
      );
    }

    const json = await response.json();
    const mediaList = json.data || [];

    // 3. Gunakan client Supabase (prefer admin client jika ada service role, jika tidak gunakan client standar)
    let supabase;
    try {
      supabase = await createAdminClient();
    } catch {
      supabase = await createClient();
    }

    let syncedCount = 0;

    for (const item of mediaList) {
      const imageUrl =
        item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
      const permalink = item.permalink;
      const caption = item.caption || 'Koleksi Dokumentasi Arum Tenda';

      if (!imageUrl) continue;

      // Ambil judul singkat dari baris pertama caption
      const title = caption.split('\n')[0].substring(0, 100) || 'Dokumentasi Acara';

      // Deteksi tipe tenda dari caption
      const lowerCaption = caption.toLowerCase();
      let tentType = 'transparan';
      if (lowerCaption.includes('kerut')) tentType = 'kerut';
      else if (lowerCaption.includes('blukat')) tentType = 'blukat';
      else if (lowerCaption.includes('piramid') || lowerCaption.includes('pyramid')) tentType = 'piramid';

      // Cek apakah postingan ini sudah tersimpan di gallery_items
      const { data: existing } = await supabase
        .from('gallery_items')
        .select('id')
        .eq('instagram_url', permalink)
        .maybeSingle();

      if (existing) {
        // Update data jika sudah ada
        await supabase
          .from('gallery_items')
          .update({
            title,
            tent_type: tentType,
            image_url: imageUrl,
          })
          .eq('id', existing.id);
      } else {
        // Insert baru
        await supabase.from('gallery_items').insert({
          title,
          tent_type: tentType,
          image_url: imageUrl,
          instagram_url: permalink,
          is_featured: false,
        });
      }

      syncedCount++;
    }

    // 4. On-demand cache invalidation
    revalidatePath('/galeri');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: `Berhasil menyinkronkan ${syncedCount} item dari Instagram.`,
      count: syncedCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Terjadi kesalahan internal saat sinkronisasi Instagram.' },
      { status: 500 }
    );
  }
}
