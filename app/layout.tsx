import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Le Hub — Applications',
  description:
    'Retrouvez les applications de Frank : prévention, formation et forage, découverte et vie pratique.',
  icons: { icon: '/Portail-Applications/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  );
}
