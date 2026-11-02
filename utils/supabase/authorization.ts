import 'server-only';

import { createClient } from '@/utils/supabase/server';

/** Require a verified Supabase user whose trusted app metadata grants Admin access. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || user.app_metadata?.role !== 'admin') {
    throw new Error('Akses ditolak: role Admin diperlukan.');
  }

  return { supabase, user };
}

export function isAdminUser(user: { app_metadata?: Record<string, unknown> } | null | undefined) {
  return user?.app_metadata?.role === 'admin';
}
