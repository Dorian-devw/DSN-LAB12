'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../lib/api';

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetchApi('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Error al solicitar OTP. Por favor verifica tu correo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ email, otpCode: otp }),
      });
      localStorage.setItem('goleate_token', data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'OTP incorrecto o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <nav style={{ 
        padding: '24px 48px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <h1 style={{ color: 'var(--accent-primary)', margin: 0, fontSize: '2rem' }}>GOLEATE!</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>Ingresar con TECSUP</button>
      </nav>

      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '4rem', marginBottom: '24px', color: '#fff' }}>
          Predice. Compite. <span style={{ color: 'var(--accent-secondary)' }}>Domina.</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', marginBottom: '48px', lineHeight: 1.6 }}>
          La mejor plataforma de predicciones deportivas universitarias. Únete a salas académicas, sube en los rankings y demuestra tu conocimiento de fútbol.
        </p>
        
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="glass-panel animate-float" style={{ padding: '32px', width: '300px', textAlign: 'left' }}>
            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>Predicciones</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Fija tus predicciones de partidos y gana puntos por puntajes exactos y resultados correctos.</p>
          </div>
          
          <div className="glass-panel animate-float" style={{ padding: '32px', width: '300px', textAlign: 'left', animationDelay: '1s' }}>
            <h3 style={{ color: 'var(--accent-secondary)', marginBottom: '16px' }}>Rankings</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Compite en la tabla de clasificación global o desafía a tus compañeros en salas privadas.</p>
          </div>
          
          <div className="glass-panel animate-float" style={{ padding: '32px', width: '300px', textAlign: 'left', animationDelay: '2s' }}>
            <h3 style={{ color: '#eab308', marginBottom: '16px' }}>Insights con IA</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Obtén análisis previos de los partidos impulsados por Groq para ayudarte a hacer las mejores predicciones.</p>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }}>
            <button 
              onClick={() => { setShowModal(false); setStep(1); setError(''); }}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            
            <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Ingreso a GOLEATE!</h2>
            
            {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
            
            {step === 1 ? (
              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Correo Electrónico</label>
                  <input 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#fff' }}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Enviando...' : 'Recibir Código OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textAlign: 'center' }}>Código enviado a {email}</p>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Ingresa el Código (6 dígitos)</label>
                  <input 
                    type="text" 
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#fff', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5em' }}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Verificando...' : 'Verificar y Entrar'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
