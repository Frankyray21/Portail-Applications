import type { Metadata, Viewport } from 'next';
import { ressource } from '@/lib/base';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portail SST — MRI',
  description:
    'Les applications santé et sécurité de Machines Roger International : prévention, formation et forage en mine.',
  icons: {
    icon: ressource('/favicon.svg'),
    apple: ressource('/apple-touch-icon.png'),
  },
  manifest: ressource('/manifest.webmanifest'),
  appleWebApp: { capable: true, title: 'Portail SST', statusBarStyle: 'default' },
};

// Le bandeau noir se prolonge dans la barre du navigateur, et le site suit
// le réglage clair ou sombre de l'appareil : sous terre, les écrans sont
// souvent en mode sombre.
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#101214' },
    { media: '(prefers-color-scheme: dark)', color: '#08090a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-CA">
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
