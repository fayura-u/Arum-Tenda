'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SatinBackground() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;
    import('../../shared/satin-background.js').catch((error) => {
      console.warn('Satin background module could not be loaded.', error);
    });
  }, [isAdmin]);

  if (isAdmin) return null;

  return <canvas className="satin-background" aria-hidden="true" />;
}
