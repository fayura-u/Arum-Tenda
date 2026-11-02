import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 1. Baca kredensial dari .env.local
const envPath = path.join(projectRoot, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;

// 2. Kategori barang berdasarkan nama
function categorizeItem(name) {
  const lower = name.toLowerCase();
  if (lower.includes('kursi') || lower.includes('meja')) return 'kursi-meja';
  if (lower.includes('gelas') || lower.includes('cangkir') || lower.includes('toples')) return 'gelas';
  if (
    lower.includes('pemanas') ||
    lower.includes('prasmanan') ||
    lower.includes('dispenser') ||
    lower.includes('termos') ||
    lower.includes('tong nasi') ||
    lower.includes('panci') ||
    lower.includes('kompor') ||
    lower.includes('baskom')
  ) {
    return 'prasmanan';
  }
  return 'alat-makan'; // Piring, Sendok, Garpu, Mangkuk, Nampan
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function main() {
  console.log('🚀 Memulai Ingestion 50 Foto Inventaris dari Google Drive ke Supabase Storage...\n');

  // Ambil file list dari Google Drive folder
  const folderUrl = 'https://drive.google.com/drive/folders/1E4d55rO4wsIBrcAYf4RiUW_MkzKa1UNk?usp=sharing';
  const folderRes = await fetch(folderUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  const html = await folderRes.text();

  const regex = /aria-label="([^"]+\.(?:jpe?g|png|webp|heic)) (?:Image|Foto) Shared"[^>]+ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]+)-/gi;
  const items = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    items.push({
      fileName: match[1],
      fileId: match[2],
    });
  }

  console.log(`📋 Ditemukan ${items.length} file di Google Drive.`);

  // Cek file yang sudah ada di Supabase Storage bucket arum-media/inventory
  const { data: existingFiles } = await supabase.storage
    .from('arum-media')
    .list('inventory', { limit: 500 });

  const existingSet = new Set((existingFiles || []).map((f) => f.name));
  console.log(`ℹ️  Ditemukan ${existingSet.size} file yang sudah pernah di-upload ke Supabase.\n`);

  const results = [];
  const CONCURRENCY = 5;

  async function processItem(item, index) {
    const rawName = item.fileName.replace(/\.(jpe?g|png|webp|heic)$/i, '');
    const ext = item.fileName.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
    const cleanSlug = `${slugify(rawName)}.${ext === 'png' ? 'png' : 'jpg'}`;
    const storagePath = `inventory/${cleanSlug}`;
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    let publicUrl = `${supabaseUrl}/storage/v1/object/public/arum-media/${storagePath}`;
    const cleanFileId = item.fileId.replace(/-0$/, '');

    try {
      if (!existingSet.has(cleanSlug)) {
        // Coba download file dari CDN Google high-res
        let downloadRes = await fetch(
          `https://lh3.googleusercontent.com/d/${cleanFileId}=w1200`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          }
        );

        if (!downloadRes.ok) {
          downloadRes = await fetch(
            `https://drive.usercontent.google.com/download?id=${cleanFileId}&export=download`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            }
          );
        }

        if (!downloadRes.ok) {
          downloadRes = await fetch(
            `https://drive.google.com/thumbnail?id=${cleanFileId}&sz=w1200`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
            }
          );
        }

        if (!downloadRes.ok) {
          throw new Error(`HTTP error ${downloadRes.status} saat download dari GDrive`);
        }

        const arrayBuffer = await downloadRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage
          .from('arum-media')
          .upload(storagePath, buffer, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Gagal upload ke Supabase: ${uploadError.message}`);
        }
      }

      const { data: pubData } = supabase.storage
        .from('arum-media')
        .getPublicUrl(storagePath);
      if (pubData?.publicUrl) {
        publicUrl = pubData.publicUrl;
      }

      const category = categorizeItem(rawName);

      results.push({
        id: `inv-${index + 1}`,
        name: rawName,
        category,
        image: publicUrl,
        originalFileId: item.fileId,
      });

      console.log(`[${results.length}/${items.length}] ✅ Selesai: ${rawName} (${category})`);
    } catch (err) {
      console.error(`❌ Gagal memproses ${item.fileName}:`, err.message);
    }
  }

  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const chunk = items.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map((it, idx) => processItem(it, i + idx)));
  }

  // Sort hasil sesuai urutan nama
  results.sort((a, b) => a.name.localeCompare(b.name));

  // Simpan hasil ke data/inventory-items.json
  const dataDir = path.join(projectRoot, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const outPath = path.join(dataDir, 'inventory-items.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n========================================`);
  console.log(`✨ SELESAI INGESTION INVENTARIS!`);
  console.log(`   Total berhasil disimpan: ${results.length} barang`);
  console.log(`   Data JSON ditulis ke: ${outPath}`);
  console.log(`========================================\n`);
}

main().catch(console.error);
