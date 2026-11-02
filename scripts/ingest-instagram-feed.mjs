import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 1. Baca kredensial dari .env.local
const envPath = path.join(projectRoot, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: File .env.local tidak ditemukan!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Baca file JSON feed Instagram
const jsonPath = path.join(projectRoot, 'arumtenda_feed_160_posts.json');
if (!fs.existsSync(jsonPath)) {
  console.error('Error: File arumtenda_feed_160_posts.json tidak ditemukan!');
  process.exit(1);
}

const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`\n🚀 Memulai Ingestion ${posts.length} postingan Instagram Arum Tenda...\n`);

const TENT_TYPES = ['transparan', 'kerut', 'blukat', 'piramid'];

function determineTentType(caption, index) {
  const lower = (caption || '').toLowerCase();
  if (lower.includes('transparan')) return 'transparan';
  if (lower.includes('kerut')) return 'kerut';
  if (lower.includes('blukat')) return 'blukat';
  if (lower.includes('piramid') || lower.includes('pyramid')) return 'piramid';
  // Rotasi seimbang agar tiap filter di galeri memiliki portofolio
  return TENT_TYPES[index % TENT_TYPES.length];
}

// Konversi shortcode Instagram (Snowflake ID) ke tanggal publikasi asli
function shortcodeToDate(code) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let id = 0n;
  for (const char of code) {
    id = (id * 64n) + BigInt(chars.indexOf(char));
  }
  const timestamp = (id >> 23n) + 1314220021721n;
  return new Date(Number(timestamp));
}

async function run() {
  // 1. Hapus 6 foto dummy Unsplash lama
  console.log('🧹 Menghapus data mock/dummy Unsplash lama di database...');
  const { error: delError } = await supabase
    .from('gallery_items')
    .delete()
    .ilike('image_url', '%unsplash.com%');

  if (delError) {
    console.warn('Peringatan saat menghapus dummy Unsplash:', delError.message);
  } else {
    console.log('✅ Foto dummy Unsplash lama berhasil dibersihkan.');
  }

  // 2. Dapatkan daftar file yang sudah ada di Supabase Storage (agar tidak download ulang jika sudah ada)
  console.log('📦 Memeriksa file yang sudah ada di bucket "arum-media/instagram/"...');
  const { data: existingFiles } = await supabase.storage
    .from('arum-media')
    .list('instagram', { limit: 500 });
  
  const existingSet = new Set((existingFiles || []).map((f) => f.name));
  console.log(`ℹ️  Ditemukan ${existingSet.size} file yang sudah pernah di-upload.`);

  let successCount = 0;
  let failCount = 0;
  const CONCURRENCY = 6;

  // Helper untuk download dan upload per item
  async function processPost(item, index) {
    const filename = `${item.id}.jpg`;
    const storagePath = `instagram/${filename}`;
    let publicUrl = `${supabaseUrl}/storage/v1/object/public/arum-media/${storagePath}`;

    try {
      // Jika belum ada di storage, download dari CDN Meta lalu upload
      if (!existingSet.has(filename)) {
        const res = await fetch(item.image_url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal download dari Meta CDN: HTTP ${res.status}`);
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage
          .from('arum-media')
          .upload(storagePath, buffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Gagal upload ke Supabase: ${uploadError.message}`);
        }
      }

      // Pastikan URL publik permanen
      const { data: pubData } = supabase.storage
        .from('arum-media')
        .getPublicUrl(storagePath);
      if (pubData?.publicUrl) {
        publicUrl = pubData.publicUrl;
      }

      const title = (item.caption_line1 || 'Dokumentasi Acara Arum Tenda').trim().substring(0, 250);
      const tentType = determineTentType(title, index);

      const realPublishedAt = shortcodeToDate(item.id);

      // Cek apakah postingan sudah tercatat di tabel gallery_items
      const { data: existingRecord } = await supabase
        .from('gallery_items')
        .select('id')
        .eq('instagram_url', item.post_url)
        .maybeSingle();

      if (existingRecord) {
        await supabase
          .from('gallery_items')
          .update({
            title,
            tent_type: tentType,
            image_url: publicUrl,
            created_at: realPublishedAt.toISOString(),
          })
          .eq('id', existingRecord.id);
      } else {
        await supabase.from('gallery_items').insert({
          title,
          tent_type: tentType,
          image_url: publicUrl,
          instagram_url: item.post_url,
          is_featured: false,
          created_at: realPublishedAt.toISOString(),
        });
      }

      successCount++;
      if (successCount % 20 === 0 || successCount === posts.length) {
        console.log(`[${successCount}/${posts.length}] Berhasil diproses... (${title})`);
      }
    } catch (err) {
      failCount++;
      console.error(`❌ Gagal memproses item ${item.id} (${item.caption_line1}):`, err.message);
    }
  }

  // Eksekusi secara batch dengan concurrency control
  for (let i = 0; i < posts.length; i += CONCURRENCY) {
    const chunk = posts.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map((item, idx) => processPost(item, i + idx)));
  }

  console.log(`\n========================================`);
  console.log(`✨ SELESAI INGESTION FEED INSTAGRAM!`);
  console.log(`   Berhasil : ${successCount} item`);
  console.log(`   Gagal    : ${failCount} item`);
  console.log(`========================================\n`);

  // Verifikasi hitung total data di database
  const { count } = await supabase
    .from('gallery_items')
    .select('*', { count: 'exact', head: true });
  console.log(`📊 Total item aktif di tabel gallery_items saat ini: ${count} foto.\n`);
}

run().catch((err) => {
  console.error('Fatal error saat ingestion:', err);
  process.exit(1);
});
