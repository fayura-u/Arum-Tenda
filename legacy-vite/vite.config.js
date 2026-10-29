import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const legacyRoot = import.meta.dirname;
const workspaceRoot = resolve(legacyRoot, '..');

export default defineConfig({
  root: legacyRoot,
  build: {
    rollupOptions: {
      input: {
        home: resolve(legacyRoot, 'index.html'),
        about: resolve(legacyRoot, 'tentang.html'),
        catalog: resolve(legacyRoot, 'katalog.html'),
        gallery: resolve(legacyRoot, 'galeri.html'),
        simulator: resolve(legacyRoot, 'simulasi.html'),
        contact: resolve(legacyRoot, 'kontak.html'),
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    fs: { allow: [workspaceRoot] },
    allowedHosts: [
      'craft-nothing-degree-eur.trycloudflare.com',
      'https://offers-spend-flash-interaction.trycloudflare.com',
      'offers-spend-flash-interaction.trycloudflare.com',
    ],
  },
});
