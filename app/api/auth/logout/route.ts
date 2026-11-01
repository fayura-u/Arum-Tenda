import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err: any) {
    console.warn('API logout error:', err?.message);
  }
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err: any) {
    console.warn('API logout error:', err?.message);
  }
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
