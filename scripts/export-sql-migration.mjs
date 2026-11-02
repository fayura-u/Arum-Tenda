import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

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

async function main() {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error querying gallery items:', error);
    process.exit(1);
  }

  let sql = `-- ==============================================================================
-- MIGRATION 04: SEED 160 DOKUMENTASI INSTAGRAM RESMI ARUM TENDA (@arumtendapbg)
-- ==============================================================================
-- 1. Bersihkan foto dummy Unsplash lama jika masih tersisa
DELETE FROM public.gallery_items WHERE image_url ILIKE '%unsplash.com%';

-- 2. Masukkan 160 postingan dokumentasi asli Instagram Arum Tenda
INSERT INTO public.gallery_items (id, title, tent_type, image_url, instagram_url, is_featured, created_at)
VALUES
`;

  const rows = data.map((d) => {
    const escapedTitle = d.title.replace(/'/g, "''");
    const escapedUrl = d.image_url.replace(/'/g, "''");
    const escapedIg = d.instagram_url ? `'${d.instagram_url.replace(/'/g, "''")}'` : 'NULL';
    return `  ('${d.id}', '${escapedTitle}', '${d.tent_type}', '${escapedUrl}', ${escapedIg}, ${d.is_featured}, '${d.created_at}')`;
  });

  sql += rows.join(',\n');
  sql += `
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  tent_type = EXCLUDED.tent_type,
  image_url = EXCLUDED.image_url,
  instagram_url = EXCLUDED.instagram_url;
`;

  const outPath = path.join(projectRoot, 'supabase', 'migrations', '04_seed_instagram_feed.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`✅ File migration berhasil ditulis: ${outPath} (${data.length} records)`);
}

main().catch(console.error);
