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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;

async function main() {
  console.log('🔄 Memperbarui foto produk perlengkapan di database Supabase...');

  // 1. Dapatkan produk yang belum punya gambar atau perlengkapan acara
  const { data: products } = await supabase.from('products').select('id, name, slug');
  if (!products) return;

  const prodMap = Object.fromEntries(products.map((p) => [p.slug, p.id]));

  const colorVariants = [
    // Paket Alat Makan
    {
      product_id: prodMap['paket-alat-makan'],
      color_name: 'Piring Keramik Putih',
      hex_code: '#ffffff',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/piring-makan-keramik-putih.jpg`,
      order_position: 1,
    },
    {
      product_id: prodMap['paket-alat-makan'],
      color_name: 'Piring Lis Emas',
      hex_code: '#d4af37',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/piring-makan-lis-emas.jpg`,
      order_position: 2,
    },
    {
      product_id: prodMap['paket-alat-makan'],
      color_name: 'Sendok Garpu Stainless',
      hex_code: '#c0c0c0',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/sendok-garpu-stainless.jpg`,
      order_position: 3,
    },

    // Gelas & Glassware
    {
      product_id: prodMap['gelas-glassware'],
      color_name: 'Cangkir Tatakan Keramik',
      hex_code: '#f8f9fa',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/cangkir-tatakan-keramik.jpg`,
      order_position: 1,
    },
    {
      product_id: prodMap['gelas-glassware'],
      color_name: 'Gelas Kaca Bening',
      hex_code: '#e9ecef',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/gelas-kaca-bening.jpg`,
      order_position: 2,
    },
    {
      product_id: prodMap['gelas-glassware'],
      color_name: 'Toples Es Buah',
      hex_code: '#dee2e6',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/toples-es-buah.jpg`,
      order_position: 3,
    },

    // Meja & Kursi Pesta
    {
      product_id: prodMap['meja-kursi-pesta'],
      color_name: 'Kursi Futura Merah',
      hex_code: '#b91c1c',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/kursi-futura-merah.jpg`,
      order_position: 1,
    },
    {
      product_id: prodMap['meja-kursi-pesta'],
      color_name: 'Kursi Lipat Hitam',
      hex_code: '#18181b',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/kursi-lipat-hitam.jpg`,
      order_position: 2,
    },
    {
      product_id: prodMap['meja-kursi-pesta'],
      color_name: 'Kursi Plastik Hijau',
      hex_code: '#15803d',
      image_url: `${supabaseUrl}/storage/v1/object/public/arum-media/inventory/kursi-plastik-hijau.jpg`,
      order_position: 3,
    },
  ];

  for (const variant of colorVariants) {
    if (!variant.product_id) continue;

    // Cek apakah varian sudah ada
    const { data: existing } = await supabase
      .from('product_colors')
      .select('id')
      .eq('product_id', variant.product_id)
      .eq('color_name', variant.color_name)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('product_colors')
        .update({
          image_url: variant.image_url,
          hex_code: variant.hex_code,
          order_position: variant.order_position,
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('product_colors').insert(variant);
    }
    console.log(`✅ Varian "${variant.color_name}" terhubung ke produk.`);
  }

  console.log('\n✨ Selesai memperbarui foto varian produk perlengkapan!');
}

main().catch(console.error);
