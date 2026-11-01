'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAdminAction } from '@/app/actions/auth';
import SubpageHeader from '@/app/components/subpage-header';
import SubpageFooter from '@/app/components/subpage-footer';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginAdminAction(formData);

    if (result.success) {
      window.location.href = redirectTo;
    } else {
      setErrorMessage(result.error || 'Login gagal. Silakan periksa kembali email dan kata sandi Anda.');
      setLoading(false);
    }
  }

  return (
    <>
      {errorMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            fontSize: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #fecaca',
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
        <div>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              fontSize: '10px',
              letterSpacing: '0.08em',
              fontWeight: 600,
              marginBottom: '6px',
              color: '#4b5563',
            }}
          >
            EMAIL
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="admin@arumtenda.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid #dedad0',
              background: '#ffffff',
              fontSize: '13px',
              color: 'var(--ink)',
              outlineColor: 'var(--green)',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              fontSize: '10px',
              letterSpacing: '0.08em',
              fontWeight: 600,
              marginBottom: '6px',
              color: '#4b5563',
            }}
          >
            KATA SANDI
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid #dedad0',
              background: '#ffffff',
              fontSize: '13px',
              color: 'var(--ink)',
              outlineColor: 'var(--green)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="button button-dark"
          style={{
            width: '100%',
            justifyContent: 'center',
            marginTop: '10px',
            padding: '14px',
            fontSize: '11px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Memverifikasi...' : 'Masuk ke Dasbor'}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="subpage">
      <SubpageHeader activePage="/login" />
      <main className="subpage-main" style={{ maxWidth: '440px', padding: '140px 20px 120px' }}>
        <p className="eyebrow">PORTAL CMS ARUM TENDA</p>
        <h1 style={{ fontSize: '38px', marginBottom: '12px' }}>Masuk Admin</h1>
        <p style={{ fontSize: '13px', color: '#6f756e', marginBottom: '32px' }}>
          Silakan masukkan kredensial akun terautentikasi untuk mengelola katalog dan galeri.
        </p>

        <Suspense fallback={<p style={{ fontSize: '12px', color: '#6f756e' }}>Memuat form...</p>}>
          <LoginForm />
        </Suspense>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '11px', color: '#6f756e', textDecoration: 'underline' }}>
            ← Kembali ke Beranda
          </Link>
        </div>
      </main>
      <SubpageFooter activePage="/login" />
    </div>
  );
}
