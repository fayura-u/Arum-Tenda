import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Updates the Supabase session in Edge Middleware, refreshing expired tokens.
 * Handles automatic redirect protection for /admin routes and /login.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase is not configured yet, let requests pass through during local dev
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do NOT run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Proteksi rute /admin/* (Fase 6)
  // Kecualikan permintaan Server Action (next-action) agar tidak merusak siklus response payload action
  const isServerAction = request.headers.has('next-action');
  if (pathname.startsWith('/admin') && !isServerAction) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url, { status: 307 });
    }

    if (user.app_metadata?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url, { status: 307 });
    }
  }

  // Jika user sudah login dan mengakses /login, arahkan langsung ke /admin
  if (pathname === '/login' && user) {
    const url = request.nextUrl.clone();
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/admin';
    url.pathname = redirectTo;
    url.searchParams.delete('redirectTo');
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
