'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '../../../lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      const data = await fetchApi('/notifications');
      setNotifications(data);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar las notificaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetchApi(`/notifications/${id}/read`, {
        method: 'PATCH',
      });
      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error al marcar la notificación como leída:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Cargando notificaciones...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444' }}>{error}</div>;
  }

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'ACHIEVEMENT_UNLOCKED':
        return { color: 'var(--accent-primary)', bg: 'rgba(0, 255, 136, 0.1)', border: 'rgba(0, 255, 136, 0.2)', label: 'LOGRO' };
      case 'MATCH_REMINDER':
        return { color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.2)', label: 'PARTIDO' };
      case 'RANKING_UPDATE':
        return { color: 'var(--accent-secondary)', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', label: 'RANKING' };
      default:
        return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.2)', label: 'SISTEMA' };
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Notificaciones</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Alertas de tus predicciones, salas y logros desbloqueados.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
        {notifications.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No tienes notificaciones en este momento.</p>
        ) : (
          notifications.map((notif) => {
            const style = getTypeStyle(notif.notificationType);
            return (
              <div 
                key={notif.id} 
                className="glass-panel" 
                style={{ 
                  padding: '20px 24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: '24px',
                  opacity: notif.isRead ? 0.7 : 1,
                  position: 'relative'
                }}
              >
                {/* Glow bar for unread notifications */}
                {!notif.isRead && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: style.color }} />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      background: style.bg, 
                      color: style.color, 
                      border: `1px solid ${style.border}` 
                    }}>
                      {style.label}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                    {notif.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                </div>

                {!notif.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notif.id)}
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid var(--border-subtle)', 
                      color: 'var(--text-primary)', 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                  >
                    Marcar como leído
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
