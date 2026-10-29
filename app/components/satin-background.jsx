'use client';

import { useEffect } from 'react';

export default function SatinBackground() {
  useEffect(() => {
    import('../../shared/satin-background.js').catch((error) => {
      console.warn('Satin background module could not be loaded.', error);
    });
  }, []);

  return <canvas className="satin-background" aria-hidden="true" />;
}
