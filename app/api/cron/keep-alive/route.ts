import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  return handlePing(request);
}

export async function POST(request: NextRequest) {
  return handlePing(request);
}

async function handlePing(request: NextRequest) {
  const startTime = Date.now();

  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    // Validasi token jika CRON_SECRET dikonfigurasi di environment
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Token Bearer tidak valid atau tidak disediakan.' },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: 'Variabel lingkungan Supabase (URL / ANON KEY) belum lengkap.' },
        { status: 500 }
      );
    }

    // Client mandiri tanpa dependensi session/cookies
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Query ringan: ambil 1 ID produk saja untuk memicu database
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: `Gagal ping database: ${error.message}`,
          latencyMs,
          timestamp: new Date().toISOString(),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase keep-alive ping berhasil! Database aktif & siaga.',
      latencyMs,
      timestamp: new Date().toISOString(),
      rowCount: data?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Terjadi kesalahan saat ping keep-alive.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
