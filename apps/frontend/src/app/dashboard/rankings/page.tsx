'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '../../../lib/api';

export default function RankingsPage() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        const data = await fetchApi('/rankings/global');
        setRankings(data);
      } catch (err) {
        console.error('Error al cargar rankings', err);
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '8px', color: 'var(--accent-primary)' }}>Ranking Global</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Los mejores predictores de TECSUP. ¿Tienes lo necesario para ser el número 1?</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando tabla de posiciones...</div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Posición</th>
                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Jugador</th>
                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Puntos Totales</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((user, index) => (
                <tr 
                  key={user.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border-subtle)',
                    background: index === 0 ? 'rgba(234, 179, 8, 0.1)' : index === 1 ? 'rgba(148, 163, 184, 0.1)' : index === 2 ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '20px', fontSize: '1.25rem', fontWeight: index < 3 ? 800 : 500, color: index === 0 ? '#eab308' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'var(--text-primary)' }}>
                    #{index + 1}
                  </td>
                  <td style={{ padding: '20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      {user.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}</span>
                      )}
                    </div>
                    {user.fullName || 'Estudiante'}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right', fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {user.totalPoints}
                  </td>
                </tr>
              ))}
              {rankings.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Aún no hay predictores en el ranking.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
