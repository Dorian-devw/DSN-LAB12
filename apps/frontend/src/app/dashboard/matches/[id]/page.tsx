'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../lib/api';

export default function MatchPredictionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [match, setMatch] = useState<any>(null);
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const [homeScore, setHomeScore] = useState<number | ''>('');
  const [awayScore, setAwayScore] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [hasPrediction, setHasPrediction] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    async function loadMatch() {
      try {
        const data = await fetchApi(`/matches/${id}`);
        setMatch(data);
        
        // Fetch user prediction to see if they already predicted
        try {
          const preds = await fetchApi('/predictions');
          const myPred = preds.find((p: any) => p.matchId === id);
          if (myPred) {
            setHomeScore(myPred.predictedHomeScore);
            setAwayScore(myPred.predictedAwayScore);
            setHasPrediction(true);
          }
        } catch (e) {
          console.error("Error al cargar predicciones", e);
        }
        
        // Fetch AI Insight
        try {
          const aiData = await fetchApi(`/ai/insights/${id}`);
          if (aiData?.insight) {
            setInsight(aiData.insight);
          }
        } catch (e) {
          console.error("Error al cargar análisis de IA", e);
        }
      } catch (err) {
        console.error("Error al cargar partido", err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, [id, router]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homeScore === '' || awayScore === '' || hasPrediction) return;
    
    if (!showConfirmModal) {
      setShowConfirmModal(true);
      return;
    }
    
    setSaving(true);
    setMessage('');
    try {
      await fetchApi(`/predictions/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          predictedHomeScore: Number(homeScore),
          predictedAwayScore: Number(awayScore)
        })
      });
      setMessage('¡Predicción guardada con éxito!');
      setHasPrediction(true);
      setShowConfirmModal(false);
      setTimeout(() => router.push('/dashboard/matches'), 2000);
    } catch (err: any) {
      setMessage(err.message || 'Error al guardar la predicción.');
      setShowConfirmModal(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Cargando partido...</div>;
  if (!match) return <div style={{ color: 'var(--text-secondary)' }}>Partido no encontrado.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => router.back()} 
        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '1rem' }}
      >
        &larr; Volver
      </button>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Predecir Partido</h1>
      
      {!hasPrediction ? (
        <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#eab308' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span style={{ fontSize: '0.95rem' }}>
            <strong>Atención:</strong> Tienes hasta el <strong>{new Date(match.predictionDeadline).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</strong> para guardar tu predicción.
          </span>
        </div>
      ) : (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span style={{ fontSize: '0.95rem' }}>
            Ya has registrado tu predicción para este partido.
          </span>
        </div>
      )}

      <div className="glass-panel" style={{ padding: 'clamp(24px, 5vw, 48px) clamp(12px, 3vw, 24px)', marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 3vw, 32px)' }}>
          <div style={{ flex: 1, textAlign: 'right', minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
            <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 2rem)', color: 'var(--text-primary)', wordBreak: 'break-word', margin: 0 }}>{match.homeTeam?.name || 'Local'}</h2>
            {match.homeTeam?.logoUrl && (
              <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} style={{ width: 'clamp(32px, 8vw, 64px)', height: 'clamp(32px, 8vw, 64px)', objectFit: 'contain', flexShrink: 0 }} />
            )}
          </div>
          
          <div style={{ padding: 'clamp(8px, 2vw, 16px) clamp(12px, 3vw, 24px)', background: 'var(--bg-secondary)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(1rem, 3vw, 1.5rem)', color: 'var(--accent-secondary)', flexShrink: 0 }}>
            VS
          </div>
          
          <div style={{ flex: 1, textAlign: 'left', minWidth: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
            {match.awayTeam?.logoUrl && (
              <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} style={{ width: 'clamp(32px, 8vw, 64px)', height: 'clamp(32px, 8vw, 64px)', objectFit: 'contain', flexShrink: 0 }} />
            )}
            <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 2rem)', color: 'var(--text-primary)', wordBreak: 'break-word', margin: 0 }}>{match.awayTeam?.name || 'Visitante'}</h2>
          </div>
        </div>
      </div>

      {insight && (
        <div style={{ padding: 'clamp(16px, 4vw, 32px)', background: 'var(--bg-secondary)', borderRadius: '16px', borderLeft: '4px solid #eab308', marginBottom: '32px' }}>
          <h3 style={{ color: '#eab308', marginBottom: '16px', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>Análisis de la IA</h3>
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6, margin: 0, fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
            "{insight}"
          </p>
        </div>
      )}

      <form onSubmit={handlePredict} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.5rem' }}>Tu Predicción</h3>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <input 
            type="number" 
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value === '' ? '' : parseInt(e.target.value))}
            style={{ width: '100px', height: '80px', fontSize: '2.5rem', textAlign: 'center', background: hasPrediction ? 'rgba(255,255,255,0.05)' : 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: hasPrediction ? 'var(--text-secondary)' : '#fff', cursor: hasPrediction ? 'not-allowed' : 'text' }}
            required
            disabled={hasPrediction}
          />
          <span style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>-</span>
          <input 
            type="number" 
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value === '' ? '' : parseInt(e.target.value))}
            style={{ width: '100px', height: '80px', fontSize: '2.5rem', textAlign: 'center', background: hasPrediction ? 'rgba(255,255,255,0.05)' : 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: hasPrediction ? 'var(--text-secondary)' : '#fff', cursor: hasPrediction ? 'not-allowed' : 'text' }}
            required
            disabled={hasPrediction}
          />
        </div>

        {message && (
          <p style={{ color: message.includes('éxito') ? 'var(--accent-primary)' : '#ef4444', textAlign: 'center' }}>{message}</p>
        )}

        {!hasPrediction && (
          <button type="submit" className="btn-primary" disabled={saving} style={{ width: '100%', maxWidth: '300px', marginTop: '16px' }}>
            {saving ? 'Procesando...' : 'Confirmar Predicción'}
          </button>
        )}
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', margin: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', margin: 0 }}>Confirmar Predicción</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>Reglas de Puntuación:</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-primary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Acierto exacto del marcador: <strong>+3 pts</strong></li>
                <li>Acierto del ganador o empate (tendencia): <strong>+1 pt</strong></li>
                <li>Predicción con +24h de anticipación: <strong>+1 pt extra</strong></li>
              </ul>
            </div>

            <div style={{ padding: '12px', borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.9rem' }}>
              <strong>Importante:</strong> Una vez confirmada, <strong>no podrás modificar</strong> tu predicción.
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <button 
                onClick={() => setShowConfirmModal(false)}
                style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                disabled={saving}
              >
                Cancelar
              </button>
              <button 
                onClick={handlePredict}
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Sí, Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
