'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../lib/api';

export default function PredictionsPage() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPredictions() {
      try {
        const data = await fetchApi('/predictions');
        setPredictions(data);
      } catch (err: any) {
        console.error(err);
        setError('Error al cargar tus predicciones.');
      } finally {
        setLoading(false);
      }
    }
    loadPredictions();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Cargando predicciones...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444' }}>{error}</div>;
  }

  // Split predictions into active (scheduled/live) and past (finished)
  const activePredictions = predictions.filter(
    (p) => p.match.status !== 'FINISHED'
  );
  const pastPredictions = predictions.filter(
    (p) => p.match.status === 'FINISHED'
  );

  const renderPredictionCard = (pred: any) => {
    const match = pred.match;
    const deadlinePassed = new Date() > new Date(match.predictionDeadline);
    
    return (
      <div key={pred.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        {/* Glow left border matching achievement status */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', 
          backgroundColor: pred.isExactScore ? 'var(--accent-primary)' : 
                           pred.isCorrectWinner ? 'var(--accent-secondary)' : 
                           match.status === 'FINISHED' ? 'var(--text-muted)' : '#eab308' 
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
            {formatDate(match.kickoffTime)}
          </span>
          
          {match.status === 'LIVE' || match.status === 'IN_PROGRESS' ? (
            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
              EN VIVO
            </span>
          ) : match.status === 'FINISHED' ? (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px' }}>
              FINALIZADO
            </span>
          ) : (
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', background: 'rgba(0, 255, 136, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
              GUARDADO
            </span>
          )}
        </div>

        {/* Match Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', gap: '8px' }}>
          <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', minWidth: 0 }}>
            <h3 style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={match.homeTeam?.name}>{match.homeTeam?.name || 'Local'}</h3>
            {match.homeTeam?.logoUrl && (
              <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} style={{ width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0 }} />
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, gap: '4px' }}>
            {match.status === 'FINISHED' || match.status === 'LIVE' || match.status === 'IN_PROGRESS' ? (
              <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--text-primary)' }}>
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                VS
              </div>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Resultado Real
            </span>
          </div>
          
          <div style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            {match.awayTeam?.logoUrl && (
              <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} style={{ width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0 }} />
            )}
            <h3 style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={match.awayTeam?.name}>{match.awayTeam?.name || 'Visitante'}</h3>
          </div>
        </div>

        {/* Prediction Panel */}
        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '16px', 
          borderRadius: '12px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          border: '1px solid var(--border-subtle)' 
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tu Predicción</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '2px' }}>
              {pred.predictedHomeScore} - {pred.predictedAwayScore}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            {match.status === 'FINISHED' ? (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Puntos Ganados</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                  +{pred.pointsAwarded || 0} pts
                </div>
              </div>
            ) : (
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  No modificable
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status markers & achievements */}
        {match.status === 'FINISHED' && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
            {pred.isExactScore && (
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: 'rgba(0, 255, 136, 0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                🎯 Resultado Exacto
              </span>
            )}
            {pred.isCorrectWinner && !pred.isExactScore && (
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-secondary)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                ✔️ Ganador Correcto
              </span>
            )}
            {pred.earlyBonusAwarded && (
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                ⚡ Bono Predicción Temprana (+5)
              </span>
            )}
            {!pred.isCorrectWinner && !pred.isExactScore && (
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                ❌ Sin puntos
              </span>
            )}
          </div>
        )}

        {pred.earlyBonusAwarded && match.status !== 'FINISHED' && (
          <div style={{ display: 'flex' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
              ⚡ Bono Asegurado (+5 pts)
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Mis Predicciones</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Historial y estado de todos tus pronósticos.</p>
      </header>

      {/* Active predictions */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '20px' }}>Predicciones Activas</h2>
        {activePredictions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No tienes predicciones activas para próximos partidos.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
            {activePredictions.map(renderPredictionCard)}
          </div>
        )}
      </section>

      {/* Finished predictions */}
      <section>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Historial</h2>
        {pastPredictions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No tienes predicciones en partidos finalizados.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
            {pastPredictions.map(renderPredictionCard)}
          </div>
        )}
      </section>
    </div>
  );
}
