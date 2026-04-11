'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Home, FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate,
  Calculator, Grid3x3, Network, Scale, BarChart3, ClipboardCheck,
  CheckSquare, PenLine, Gavel, AlertOctagon, Briefcase, Users,
  Calendar, History, Sparkles, Circle, Bell, Search,
} from 'lucide-react';
import demoConfig from '@/app/(demos)/prizym-governance/demo.config';
import { CommandPalette } from '@/components/demos/prizym-governance/CommandPalette';

const ICON_MAP: Record<string, typeof Home> = {
  Home, FileText, BookOpen, ListChecks, ShieldCheck, LayoutTemplate,
  Calculator, Grid3x3, Network, Scale, BarChart3, ClipboardCheck,
  CheckSquare, PenLine, Gavel, AlertOctagon, Briefcase, Users,
  Calendar, History, Sparkles,
};

// Drop the "Home" section — the top-left logo handles home navigation.
const NAV_SECTIONS = demoConfig.nav.filter((s) => s.section !== 'Home');

function findSectionForPath(pathname: string): string | null {
  for (const sec of NAV_SECTIONS) {
    if (sec.items.some((i) => i.href === pathname || pathname.startsWith(`${i.href}/`))) {
      return sec.section;
    }
  }
  return null;
}

const NOTIFICATIONS = [
  { id: 'n1', title: 'EXC-2026-012 escalated to CRB', time: '8m ago', color: 'var(--pg-warning-bright)' },
  { id: 'n2', title: '3 policies past attestation deadline', time: '42m ago', color: 'var(--pg-danger-bright)' },
  { id: 'n3', title: 'Q1 SPIF approved — $267K payout', time: '2h ago', color: 'var(--pg-success-bright)' },
  { id: 'n4', title: 'Northwind compliance score +2% WoW', time: '5h ago', color: 'var(--pg-cyan-bright)' },
];

export function PrizymShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const urlSection = useMemo(() => findSectionForPath(pathname), [pathname]);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const topbarRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown whenever the route changes (module click lands us on a new URL).
  useEffect(() => {
    setOpenSection(null);
    setNotifOpen(false);
    setProfileOpen(false);
    setPaletteOpen(false);
  }, [pathname]);

  // ESC key closes dropdown / popovers.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenSection(null);
        setNotifOpen(false);
        setProfileOpen(false);
        setPaletteOpen(false);
      }
      // Cmd+K / Ctrl+K toggles the global search palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Pointer-down outside the topbar + dropdown closes it.
  useEffect(() => {
    if (!openSection && !notifOpen && !profileOpen) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (topbarRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpenSection(null);
      setNotifOpen(false);
      setProfileOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [openSection, notifOpen, profileOpen]);

  const dropdownSection = openSection
    ? NAV_SECTIONS.find((s) => s.section === openSection) ?? null
    : null;

  return (
    <div className="pg-bshell">
      <header className="pg-bshell-topbar" ref={topbarRef}>
        <Link href="/prizym-governance" className="pg-bshell-logo" aria-label="Go to workspace home">
          <span className="pg-bshell-logo-title">Prizym SGM</span>
          <span className="pg-bshell-logo-sub">Sales Governance Manager</span>
        </Link>

        <nav className="pg-bshell-sections-inner" aria-label="Primary">
          {NAV_SECTIONS.map((sec) => {
            const highlighted = urlSection === sec.section;
            const isOpen = openSection === sec.section;
            const showActive = highlighted || isOpen;
            const isDirectNav = sec.items.length === 1;
            return (
              <button
                key={sec.section}
                type="button"
                aria-expanded={isDirectNav ? undefined : isOpen}
                aria-haspopup={isDirectNav ? undefined : 'menu'}
                onClick={() => {
                  if (isDirectNav) {
                    setOpenSection(null);
                    router.push(sec.items[0].href);
                  } else {
                    setOpenSection((prev) => (prev === sec.section ? null : sec.section));
                  }
                }}
                className={`pg-bshell-section${showActive ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
                style={showActive ? { borderColor: sec.color, color: sec.color, background: `${sec.color}1a` } : undefined}
              >
                {sec.section}
              </button>
            );
          })}
        </nav>

        <div className="pg-bshell-topbar-meta">
          {/* Global search trigger */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="pg-bshell-search-trigger"
            aria-label="Search (⌘K)"
          >
            <Search size={16} strokeWidth={2.4} />
            <span>Search</span>
            <kbd className="pg-bshell-kbd">⌘K</kbd>
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
              className="pg-icon-bubble"
              style={{ cursor: 'pointer', borderColor: 'var(--pg-warning-bright)', position: 'relative' }}
              aria-label="Notifications"
            >
              <Bell size={19} color="var(--pg-warning-bright)" strokeWidth={2.4} />
              <span className="pg-bshell-notif-dot" />
            </button>
            {notifOpen && (
              <div className="pg-bshell-popover" role="menu" aria-label="Notifications">
                <div className="pg-bshell-popover-header">
                  <span>Notifications</span>
                  <span className="pg-bshell-popover-count">{NOTIFICATIONS.length} new</span>
                </div>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="pg-bshell-notif-item" style={{ borderLeftColor: n.color }}>
                    <div className="pg-bshell-notif-title">{n.title}</div>
                    <div className="pg-bshell-notif-time">{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User avatar */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
              className="pg-bshell-avatar"
              aria-label="User menu"
            >
              AC
            </button>
            {profileOpen && (
              <div className="pg-bshell-popover" role="menu" aria-label="User menu">
                <div className="pg-bshell-popover-header">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Avery Caldwell</span>
                    <span className="pg-bshell-popover-sub">SVP, Global Sales Ops · Northwind Distribution</span>
                  </div>
                </div>
                {['My Workspace', 'Settings', 'Keyboard shortcuts', 'Sign out'].map((l) => (
                  <button key={l} className="pg-bshell-menu-item" type="button" onClick={() => { setProfileOpen(false); }}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {demoConfig.product.badge && (
            <span className="pg-bshell-badge">{demoConfig.product.badge}</span>
          )}
        </div>
      </header>

      {dropdownSection && (
        <div
          ref={dropdownRef}
          className="pg-bshell-dropdown"
          role="menu"
          aria-label={`${dropdownSection.section} modules`}
        >
          <div className="pg-bshell-dropdown-inner">
            {dropdownSection.items.map((item) => {
              const Icon = ICON_MAP[item.icon] ?? Circle;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpenSection(null)}
                  className={`pg-bshell-module${active ? ' is-active' : ''}`}
                  style={active ? { borderColor: dropdownSection.color, color: dropdownSection.color, background: `${dropdownSection.color}22` } : undefined}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <main className="pg-bshell-content">{children}</main>

      <footer className="pg-bshell-footer">
        <span className="pg-bshell-footer-copy">{demoConfig.footer?.copyright}</span>
        {demoConfig.footer?.poweredBy && (
          <span className="pg-bshell-footer-power">Powered by {demoConfig.footer.poweredBy}</span>
        )}
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
