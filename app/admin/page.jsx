import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { isAdminUser } from '@/utils/supabase/authorization';
import { getAdminProducts, getAdminGallery, getCategories } from '@/lib/queries/catalog';
import AdminClient from './admin-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dasbor CMS Admin — Arum Tenda',
  description: 'Pengelolaan data katalog dan galeri Arum Tenda.',
};

export default async function AdminPage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    // If Supabase is not configured yet or fails, user is null
  }

  // Double-check auth di level server component
  if (!user) {
    redirect('/login?redirectTo=/admin');
  }

  if (!isAdminUser(user)) {
    redirect('/');
  }

  const [products, gallery, categories] = await Promise.all([
    getAdminProducts(),
    getAdminGallery(),
    getCategories(),
  ]);

  return (
    <AdminClient
      initialUser={user}
      initialProducts={products}
      initialGallery={gallery}
      initialCategories={categories}
    />
  );
}
