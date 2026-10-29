import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const projectRoot = import.meta.dirname;

export default defineConfig({
  input: {
    home: resolve(projectRoot, 'index.html'),
    about: resolve(projectRoot, 'tentang.html'),
    catalog: resolve(projectRoot, 'katalog.html'),
    gallery: resolve(projectRoot, 'galeri.html'),
    simulator: resolve(projectRoot, 'simulasi.html'),
    contact: resolve(projectRoot, 'kontak.html'),
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'craft-nothing-degree-eur.trycloudflare.com',
      'https://offers-spend-flash-interaction.trycloudflare.com',
      'offers-spend-flash-interaction.trycloudflare.com',
    ],
  },
});
