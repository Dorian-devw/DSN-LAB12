'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchApi('/users/me')
      .then(setUser)
      .catch(console.error);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Mobile Nav Toggle */}
      <button 
        className="mobile-nav-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Navigation"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isMobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`glass-panel desktop-sidebar ${isMobileMenuOpen ? 'mobile-sidebar-active' : ''}`}>
        <div style={{ padding: '32px 24px' }}>
          <h2 style={{ color: 'var(--accent-primary)', margin: 0, fontSize: '1.75rem' }}>GOLEATE!</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px', flex: 1 }}>
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-glass-hover)' }}>
            Resumen
          </Link>
          <Link href="/dashboard/matches" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Partidos
          </Link>
          <Link href="/dashboard/predictions" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Mis Predicciones
          </Link>
          <Link href="/dashboard/rankings" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Rankings
          </Link>
          <Link href="/dashboard/rooms" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Salas
          </Link>
          <Link href="/dashboard/notifications" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Notificaciones
          </Link>
        </nav>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Puntos Totales</p>
            <h3 style={{ color: 'var(--accent-secondary)', fontSize: '2rem' }}>{user?.totalPoints || 0}</h3>
          </div>
          
          <button 
            onClick={() => {
              localStorage.removeItem('goleate_token');
              window.location.href = '/';
            }}
            style={{
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
