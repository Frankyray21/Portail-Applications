import type { NextConfig } from 'next';

// Portail public statique : aucun serveur ni compte nécessaire sur GitHub Pages.
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Portail-Applications',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
