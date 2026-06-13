'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../lib/api';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [matchesData, predictionsData] = await Promise.all([
          fetchApi('/matches'),
          fetchApi('/predictions'),
        ]);
        setMatches(matchesData);
        setPredictions(predictionsData);
      } catch (err: any) {
        console.error(err);
        setError('Error al cargar la información de los partidos.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const predictionsMap = new Map(predictions.map((p) => [p.matchId, p]));

  // Group matches
  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'IN_PROGRESS');
  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED');
  const finishedMatches = matches.filter(m => m.status === 'FINISHED');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Cargando partidos...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444' }}>{error}</div>;
  }

  const renderMatchCard = (match: any, isUpcoming: boolean) => {
    const userPrediction = predictionsMap.get(match.id);
    const deadlinePassed = new Date() > new Date(match.predictionDeadline);
    
    return (
      <div key={match.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
        {/* Glow effect for cards with active predictions */}
        {userPrediction && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--accent-primary)' }} />
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
            {formatDate(match.kickoffTime)}
          </span>
          {match.status === 'LIVE' || match.status === 'IN_PROGRESS' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              EN VIVO
            </span>
          ) : match.status === 'FINISHED' ? (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px' }}>
              FINALIZADO
            </span>
          ) : (
            <span style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', background: 'rgba(139, 92, 246, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
              PROGRAMADO
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', gap: '8px' }}>
          <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', minWidth: 0 }}>
            <h3 style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={match.homeTeam?.name}>{match.homeTeam?.name || 'Local'}</h3>
            {match.homeTeam?.logoUrl && (
              <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} style={{ width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0 }} />
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {match.status === 'FINISHED' || match.status === 'LIVE' || match.status === 'IN_PROGRESS' ? (
              <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--accent-secondary)' }}>
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div style={{ padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '6px', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                VS
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            {match.awayTeam?.logoUrl && (
              <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} style={{ width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0 }} />
            )}
            <h3 style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={match.awayTeam?.name}>{match.awayTeam?.name || 'Visitante'}</h3>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {userPrediction ? (
              <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Tu predicción: <strong style={{ color: 'var(--accent-primary)' }}>{userPrediction.predictedHomeScore} - {userPrediction.predictedAwayScore}</strong>
                {match.status === 'FINISHED' && (
                  <span style={{ marginLeft: '8px', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>
                    (+{userPrediction.pointsAwarded || 0} pts)
                  </span>
                )}
              </div>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                Sin predicción registrada
              </span>
            )}
          </div>
          
          {isUpcoming && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
              {!deadlinePassed && (
                <span style={{ fontSize: '0.75rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Vence: {new Date(match.predictionDeadline).toLocaleTimeString('es-PE', {hour: '2-digit', minute:'2-digit'})}
                </span>
              )}
              {deadlinePassed ? (
                <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Límite expirado
                </span>
              ) : (
                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  onClick={() => router.push(`/dashboard/matches/${match.id}`)}
                >
                  {userPrediction ? 'Ver Predicción' : 'Predecir'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Partidos</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Consulta la programación de partidos y realiza tus predicciones.</p>
      </header>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            Partidos en Vivo
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
            {liveMatches.map(m => renderMatchCard(m, false))}
          </div>
        </section>
      )}

      {/* Upcoming Matches Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '20px' }}>Próximos Partidos</h2>
        {upcomingMatches.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No hay próximos partidos programados.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
            {upcomingMatches.map(m => renderMatchCard(m, true))}
          </div>
        )}
      </section>

      {/* Finished Matches Section */}
      <section>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Partidos Finalizados</h2>
        {finishedMatches.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No hay partidos finalizados registrados.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
            {finishedMatches.map(m => renderMatchCard(m, false))}
          </div>
        )}
      </section>
    </div>
  );
}
