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

  useEffect(() => {
    async function loadMatch() {
      try {
        const data = await fetchApi(`/matches/${id}`);
        setMatch(data);
        
        // Fetch AI Insight
        try {
          const aiData = await fetchApi(`/ai/insights/${id}`);
          if (aiData?.insight) {
            setInsight(aiData.insight);
          }
        } catch (e) {
          console.error("AI Insight failed", e);
        }
      } catch (err) {
        console.error(err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, [id, router]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homeScore === '' || awayScore === '') return;
    
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
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setMessage(err.message || 'Error al guardar la predicción.');
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
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Asegúrate de guardar tu predicción antes del inicio del partido para ganar puntos.</p>

      <div className="glass-panel" style={{ padding: '48px 24px', marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{match.homeTeam?.name || 'Local'}</h2>
          </div>
          
          <div style={{ padding: '16px 24px', background: 'var(--bg-secondary)', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--accent-secondary)' }}>
            VS
          </div>
          
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{match.awayTeam?.name || 'Visitante'}</h2>
          </div>
        </div>
      </div>

      {insight && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid #eab308' }}>
          <h3 style={{ color: '#eab308', marginBottom: '8px', fontSize: '1.25rem' }}>Análisis de IA (Groq)</h3>
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{insight}"</p>
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
            style={{ width: '100px', height: '80px', fontSize: '2.5rem', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: '#fff' }}
            required
          />
          <span style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>-</span>
          <input 
            type="number" 
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value === '' ? '' : parseInt(e.target.value))}
            style={{ width: '100px', height: '80px', fontSize: '2.5rem', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: '#fff' }}
            required
          />
        </div>

        {message && (
          <p style={{ color: message.includes('éxito') ? 'var(--accent-primary)' : '#ef4444' }}>{message}</p>
        )}

        <button type="submit" className="btn-primary" disabled={saving} style={{ width: '100%', maxWidth: '300px', marginTop: '16px' }}>
          {saving ? 'Guardando...' : 'Confirmar Predicción'}
        </button>
      </form>
    </div>
  );
}
