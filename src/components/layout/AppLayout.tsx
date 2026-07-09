// ============================================================
// App Layout — Liquid Glass Shell
// ============================================================

import type { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';

function AmbientOrbs() {
  return (
    <div className="ambient-orbs" aria-hidden="true">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
    </div>
  );
}

export function Header() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-40 liquid-glass-strong specular-border border-b border-t-0 border-l-0 border-r-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/50 transition-all duration-300">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              LoanEase
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!isDashboard && (
              <nav className="hidden sm:flex items-center gap-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === '/'
                      ? 'text-white bg-white/10 shadow-inner border border-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/apply"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    location.pathname === '/apply'
                      ? 'text-white bg-white/10 shadow-inner border border-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Apply
                </Link>
              </nav>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-500/10 border border-accent-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-accent-400 uppercase tracking-wider">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="py-10 liquid-glass-subtle border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">LoanEase</p>
              <p className="text-xs text-white/30">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-white/40">
            <button className="hover:text-white/80 transition-colors">Privacy Policy</button>
            <button className="hover:text-white/80 transition-colors">Terms of Service</button>
            <button className="hover:text-white/80 transition-colors">Support</button>
            <button className="hover:text-white/80 transition-colors">Contact</button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">RBI Registered NBFC</span>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-xs text-white/30 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              256-bit SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-500/30 selection:text-white relative">
      <AmbientOrbs />
      <Header />
      <main className="flex-1 w-full flex flex-col relative z-10">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}
