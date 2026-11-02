'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type { ActionResponse } from './catalog';

/**
 * Server Action: Login admin dengan email dan kata sandi via Supabase Auth
 */
export async function loginAdminAction(formData: FormData): Promise<ActionResponse> {
  try {
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (!email || !password) {
      return { success: false, error: 'Email dan kata sandi wajib diisi.' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message === 'Invalid login credentials'
          ? 'Email atau kata sandi salah. Silakan coba lagi.'
          : error.message,
      };
    }

    if (data.user.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Akun ini belum diberi akses Admin. Hubungi pemilik situs.',
      };
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
      data: {
        userId: data.user.id,
        email: data.user.email,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Terjadi kesalahan sistem saat memproses login.',
    };
  }
}

/**
 * Server Action: Logout admin dan hapus cookie sesi
 */
export async function logoutAdminAction(): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Terjadi kesalahan sistem saat memproses logout.',
    };
  }
}
