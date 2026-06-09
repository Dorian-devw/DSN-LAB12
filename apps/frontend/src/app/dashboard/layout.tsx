'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchApi('/users/me')
      .then(setUser)
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', margin: '16px', display: 'flex', flexDirection: 'column', borderRadius: '24px' }}>
        <div style={{ padding: '32px 24px' }}>
          <h2 style={{ color: 'var(--accent-primary)', margin: 0, fontSize: '1.75rem' }}>GOLEATE!</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px', flex: 1 }}>
          <Link href="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-glass-hover)' }}>
            Resumen
          </Link>
          <Link href="/dashboard/matches" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Partidos
          </Link>
          <Link href="/dashboard/predictions" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Mis Predicciones
          </Link>
          <Link href="/dashboard/rankings" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Rankings
          </Link>
          <Link href="/dashboard/rooms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Salas
          </Link>
          <Link href="/dashboard/notifications" style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '12px 16px', borderRadius: '12px' }}>
            Notificaciones
          </Link>
        </nav>

        <div style={{ padding: '24px' }}>
          <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Puntos Totales</p>
            <h3 style={{ color: 'var(--accent-secondary)', fontSize: '2rem' }}>{user?.totalPoints || 0}</h3>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
