'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Compass,
  Grid2X2,
  Leaf,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  APPLICATIONS,
  COLLECTIONS,
  applicationsCollection,
} from '@/lib/catalogue';
import { sectionCourante } from '@/lib/navigation';

const navigation = [
  {
    id: 'accueil',
    label: 'Toutes',
    mobile: 'Toutes',
    icon: Compass,
    count: APPLICATIONS.length,
  },
  ...COLLECTIONS.map((collection) => ({
    id: collection.id,
    label: collection.label,
    mobile: collection.id === 'forage' ? 'Forage' : collection.label,
    icon: { prevention: ShieldCheck, forage: Wrench, quotidien: Leaf }[
      collection.id
    ],
    count: applicationsCollection(collection.id).length,
  })),
];

export function HubShell({ children }: { children: ReactNode }) {
  const [active, setActive] = useState('accueil');
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = mobileNavRef.current;
    if (!nav) return;
    const rootStyle = document.documentElement.style;
    const previousHeight = rootStyle.getPropertyValue(
      '--hub-mobile-nav-height',
    );
    const updateHeight = () =>
      rootStyle.setProperty(
        '--hub-mobile-nav-height',
        `${nav.getBoundingClientRect().height}px`,
      );
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(nav);
    return () => {
      observer.disconnect();
      if (previousHeight)
        rootStyle.setProperty('--hub-mobile-nav-height', previousHeight);
      else rootStyle.removeProperty('--hub-mobile-nav-height');
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const positions = navigation.flatMap((item) => {
        const section = document.getElementById(item.id);
        return section
          ? [{ id: item.id, top: section.getBoundingClientRect().top }]
          : [];
      });
      const bottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2;
      setActive(sectionCourante(positions, bottom));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div className="hub-shell">
      <aside className="hub-sidebar" aria-label="Le Hub">
        <SidebarHeader className="hub-sidebar__header">
          <a className="brand" href="#accueil" aria-label="Le Hub, accueil">
            <span className="brand__symbol">
              <Grid2X2 size={23} aria-hidden="true" />
            </span>
            <span>
              Le Hub<span className="brand__label">La collection de Frank</span>
            </span>
          </a>
        </SidebarHeader>
        <SidebarContent className="hub-sidebar__content">
          <p className="nav-heading">EXPLORER</p>
          <nav aria-label="Navigation principale">
            <SidebarMenu className="hub-menu">
              {navigation.map(({ id, label, icon: Icon, count }) => (
                <SidebarMenuItem key={id}>
                  <a
                    href={`#${id}`}
                    className="nav-link"
                    aria-current={active === id ? 'location' : undefined}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{label}</span>
                    <span className="nav-count">{count}</span>
                  </a>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </nav>
        </SidebarContent>
        <SidebarFooter className="hub-sidebar__footer">
          <a
            className="source-link"
            href="https://github.com/Frankyray21/Portail-Applications"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Le projet sur GitHub — nouvel onglet"
          >
            Le projet sur GitHub <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <span>Le Hub · Version 1.1</span>
        </SidebarFooter>
      </aside>
      <div className="hub-workspace">
        <header className="app-topbar">
          <a href="#accueil" className="mobile-brand">
            <Grid2X2 size={22} aria-hidden="true" /> Le Hub
          </a>
        </header>
        {children}
      </div>
      <nav
        className="mobile-nav"
        aria-label="Navigation mobile"
        ref={mobileNavRef}
      >
        {navigation.map(({ id, label, mobile, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={label}
            aria-current={active === id ? 'location' : undefined}
          >
            <Icon size={21} aria-hidden="true" />
            <span>{mobile}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
