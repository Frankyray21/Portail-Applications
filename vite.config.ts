import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// La destination demandée est GitHub Pages : exporter uniquement des fichiers
// publics, sans runtime Cloudflare, authentification ni dépendance à Sites.
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext()],
  server: { host: '127.0.0.1' },
});
