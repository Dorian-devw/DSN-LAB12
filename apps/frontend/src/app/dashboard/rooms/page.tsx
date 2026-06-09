'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '../../../lib/api';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Room State
  const [showCreate, setShowCreate] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  // Join Room State
  const [showJoin, setShowJoin] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const [message, setMessage] = useState('');

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/rooms/me');
      setRooms(data);
    } catch (err) {
      console.error('Error al cargar salas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/rooms', {
        method: 'POST',
        body: JSON.stringify({ name: newRoomName, description: newRoomDesc }),
      });
      setMessage('¡Sala creada con éxito!');
      setShowCreate(false);
      setNewRoomName('');
      setNewRoomDesc('');
      loadRooms();
    } catch (err: any) {
      setMessage(err.message || 'Error al crear la sala.');
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/rooms/join', {
        method: 'POST',
        body: JSON.stringify({ inviteCode }),
      });
      setMessage('¡Te uniste a la sala con éxito!');
      setShowJoin(false);
      setInviteCode('');
      loadRooms();
    } catch (err: any) {
      setMessage(err.message || 'Error al unirse a la sala.');
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Mis Salas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Compite con tus amigos en grupos privados o académicos.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-primary" style={{ background: 'var(--accent-secondary)' }} onClick={() => setShowJoin(true)}>Unirse a Sala</button>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>Crear Sala</button>
        </div>
      </header>

      {message && <p style={{ color: message.includes('éxito') ? 'var(--accent-primary)' : '#ef4444', marginBottom: '24px' }}>{message}</p>}

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Cargando salas...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {rooms.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Aún no perteneces a ninguna sala.</p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{room.name}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{room.description || 'Sin descripción'}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Código:</span>
                  <span style={{ fontWeight: 'bold', letterSpacing: '2px', color: 'var(--accent-primary)' }}>{room.inviteCode}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Room Modal */}
      {showCreate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowCreate(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: '24px' }}>Crear Nueva Sala</h2>
            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Nombre de la sala" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#fff' }} />
              <input type="text" placeholder="Descripción (opcional)" value={newRoomDesc} onChange={e => setNewRoomDesc(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#fff' }} />
              <button type="submit" className="btn-primary">Crear</button>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoin && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowJoin(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ marginBottom: '24px' }}>Unirse a Sala</h2>
            <form onSubmit={handleJoinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Código de Invitación (Ej: X9A2B1)" value={inviteCode} onChange={e => setInviteCode(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#fff', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase' }} />
              <button type="submit" className="btn-primary" style={{ background: 'var(--accent-secondary)' }}>Unirse</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
