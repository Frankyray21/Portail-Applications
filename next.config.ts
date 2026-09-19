import type { NextConfig } from 'next';
import { BASE_PATH } from './lib/base';

// Portail public statique : aucun serveur ni compte nécessaire sur GitHub Pages.
const nextConfig: NextConfig = {
  output: 'export',
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
