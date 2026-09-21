import type { Metadata, Viewport } from 'next';
import { ressource } from '@/lib/base';
import './globals.css';

export const metadata: Metadata = {
  title: 'Le Hub — Applications',
  description:
    'Retrouvez les applications de Frank : prévention, formation, forage et découverte.',
  icons: {
    icon: ressource('/favicon.svg'),
    apple: ressource('/apple-touch-icon.png'),
  },
  manifest: ressource('/manifest.webmanifest'),
  appleWebApp: { capable: true, title: 'Le Hub', statusBarStyle: 'default' },
};

// Le bandeau pétrole se prolonge dans la barre du navigateur, et le site
// suit le réglage clair ou sombre de l'appareil : sous terre, les écrans
// sont souvent en mode sombre.
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#094850' },
    { media: '(prefers-color-scheme: dark)', color: '#00353c' },
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
