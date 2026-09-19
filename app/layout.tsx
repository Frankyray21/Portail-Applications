import type { Metadata } from 'next';
import { ressource } from '@/lib/base';
import './globals.css';

export const metadata: Metadata = {
  title: 'Le Hub — Applications',
  description:
    'Retrouvez les applications de Frank : prévention, formation et forage, découverte et vie pratique.',
  icons: { icon: ressource('/favicon.svg') },
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
