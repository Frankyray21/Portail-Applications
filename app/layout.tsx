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
  appleWebApp: { capable: true, title: 'Portail SST', statusBarStyle: 'black' },
};

// Le portail est sombre, quel que soit le réglage de l'appareil : sous terre
// et sur une tablette de terrain, c'est lui qu'on veut. La coquille se
// prolonge dans la barre du navigateur ; le bouton du bandeau met les deux
// à jour s'il passe au clair.
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#08090a',
};

// Posé avant le premier affichage. Il fait deux choses : marquer que le
// JavaScript répond (le bouton de thème ne s'affiche qu'alors, puisque sans
// lui il ne ferait rien), et rétablir le thème clair s'il a été choisi —
// sans quoi on verrait le sombre une fraction de seconde avant la bascule.
const AVANT_AFFICHAGE = `document.documentElement.dataset.js='';try{if(localStorage.getItem('portail-sst-theme')==='clair'){document.documentElement.dataset.theme='clair';document.querySelector('meta[name="theme-color"]').content='#101214'}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-CA">
      <head>
        <script dangerouslySetInnerHTML={{ __html: AVANT_AFFICHAGE }} />
      </head>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
