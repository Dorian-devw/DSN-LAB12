'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';

export default function DashboardOverview() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>('--:--:--');

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await fetchApi('/users/me');
        setUser(userData);
        
        const matchesData = await fetchApi('/matches');
        setMatches(matchesData);
      } catch (err) {
        console.error(err);
        router.push('/'); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  // Next deadline countdown timer logic
  useEffect(() => {
    if (matches.length === 0) return;

    // Find the nearest upcoming prediction deadline that is in the future
    const now = new Date();
    const upcomingDeadlines = matches
      .filter((m) => m.status === 'SCHEDULED' && new Date(m.predictionDeadline) > now)
      .map((m) => new Date(m.predictionDeadline));

    if (upcomingDeadlines.length === 0) {
      setTimeRemaining('Sin partidos');
      return;
    }

    // Sort to get the earliest deadline
    upcomingDeadlines.sort((a, b) => a.getTime() - b.getTime());
    const nextDeadline = upcomingDeadlines[0];

    const calculateTime = () => {
      const difference = nextDeadline.getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeRemaining('Expirado');
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formatNum = (num: number) => num.toString().padStart(2, '0');

      if (days > 0) {
        setTimeRemaining(`${days}d ${formatNum(hours)}:${formatNum(minutes)}:${formatNum(seconds)}`);
      } else {
        setTimeRemaining(`${formatNum(hours)}:${formatNum(minutes)}:${formatNum(seconds)}`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [matches]);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Cargando...</div>;
  }

  // Slice to only show top 3 upcoming matches
  const topMatches = matches
    .filter((m) => m.status === 'SCHEDULED')
    .slice(0, 3);

  const formatAccuracy = (accuracy: any) => {
    if (accuracy === undefined || accuracy === null) return '--%';
    return `${Number(accuracy).toFixed(1)}%`;
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          ¡Bienvenido de vuelta{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Aquí tienes el resumen de tus predicciones para los próximos partidos.</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Puntos Totales</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1 }}>
              {user?.totalPoints || 0}
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Tasa de Precisión</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-secondary)', lineHeight: 1 }}>
              {formatAccuracy(user?.accuracyRate)}
            </span>
            <span style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
              ({user?.correctPredictions || 0}/{user?.totalPredictions || 0} aciertos)
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Próximo Límite</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: '#eab308', lineHeight: 1 }}>
              {timeRemaining}
            </span>
            <span style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
              restantes
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '24px' }}>Próximos Partidos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topMatches.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No hay partidos programados próximamente.</p>
          ) : (
            topMatches.map((match) => (
              <div key={match.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(16px, 3vw, 24px)', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 24px)', flex: '1 1 250px' }}>
                  <div style={{ textAlign: 'right', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', minWidth: 0 }}>
                    <div>
                      <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.homeTeam?.name || 'Local'}</h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>Local</p>
                    </div>
                    {match.homeTeam?.logoUrl && (
                      <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} style={{ width: 'clamp(32px, 5vw, 40px)', height: 'clamp(32px, 5vw, 40px)', objectFit: 'contain', flexShrink: 0 }} />
                    )}
                  </div>
                  
                  <div style={{ padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontWeight: 'bold', flexShrink: 0, border: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                    VS
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    {match.awayTeam?.logoUrl && (
                      <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} style={{ width: 'clamp(32px, 5vw, 40px)', height: 'clamp(32px, 5vw, 40px)', objectFit: 'contain', flexShrink: 0 }} />
                    )}
                    <div>
                      <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.awayTeam?.name || 'Visitante'}</h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>Visitante</p>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flex: '0 0 auto', marginLeft: 'auto', marginRight: 'auto', flexShrink: 0 }}>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '8px 24px', fontSize: '0.875rem', letterSpacing: '1px', textTransform: 'uppercase', width: '100%' }} 
                    onClick={() => router.push(`/dashboard/matches/${match.id}`)}
                  >
                    Predecir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
