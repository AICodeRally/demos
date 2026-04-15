'use client';

import { useState, useEffect, useCallback } from 'react';
import { onBroadcast, broadcastAck, type BroadcastMessage, type CoachingPush, type AlertPush } from '@/lib/routeiq-broadcast';

interface Toast {
  id: string;
  type: 'coaching' | 'alert';
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'urgent';
  product?: string;
  cases?: number;
  timestamp: string;
}

export function ManagerToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsub = onBroadcast((msg: BroadcastMessage) => {
      if (msg.type === 'coaching') {
        const data = msg.data as CoachingPush;
        setToasts(prev => [{
          id: data.id,
          type: 'coaching',
          title: `Coach: ${data.stopName}`,
          message: data.message,
          product: data.product,
          cases: data.cases,
          timestamp: data.timestamp,
        }, ...prev]);
        broadcastAck(data.id);
      } else if (msg.type === 'alert') {
        const data = msg.data as AlertPush;
        setToasts(prev => [{
          id: data.id,
          type: 'alert',
          title: data.severity === 'urgent' ? 'URGENT' : data.severity === 'warning' ? 'Warning' : 'Info',
          message: data.message,
          severity: data.severity,
          timestamp: data.timestamp,
        }, ...prev]);
        broadcastAck(data.id);
      }
    });
    return unsub;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts(prev => prev.slice(0, -1));
    }, 8000);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-3 right-3 z-50 flex flex-col gap-2" style={{ maxWidth: 320 }}>
      {toasts.slice(0, 3).map((toast) => (
        <div
          key={toast.id}
          className="rounded-lg overflow-hidden shadow-lg"
          style={{
            animation: 'toast-slide-in 0.3s ease-out',
            border: toast.severity === 'urgent'
              ? '1px solid rgba(239,68,68,0.4)'
              : toast.severity === 'warning'
                ? '1px solid rgba(245,158,11,0.4)'
                : '1px solid rgba(37,99,235,0.3)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-1.5"
            style={{
              background: toast.severity === 'urgent'
                ? 'rgba(239,68,68,0.15)'
                : toast.severity === 'warning'
                  ? 'rgba(245,158,11,0.15)'
                  : 'rgba(37,99,235,0.12)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: 12 }}>
                {toast.severity === 'urgent' ? '🚨' : toast.severity === 'warning' ? '⚠️' : '📋'}
              </span>
              <span
                className="text-[10px] font-black uppercase tracking-wider"
                style={{
                  color: toast.severity === 'urgent'
                    ? '#EF4444'
                    : toast.severity === 'warning'
                      ? '#F59E0B'
                      : '#2563EB',
                }}
              >
                {toast.title}
              </span>
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-[10px] opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--pl-text-muted)' }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            className="px-3 py-2"
            style={{ background: 'var(--pl-bar-bg)', backdropFilter: 'blur(12px)' }}
          >
            <p className="text-[11px] leading-snug" style={{ color: 'var(--pl-text)' }}>
              {toast.message}
            </p>
            {toast.product && (
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'var(--pl-gold-bg)', color: 'var(--pl-gold)' }}
                >
                  {toast.product} {toast.cases && `· ${toast.cases}cs`}
                </span>
              </div>
            )}
            <div className="text-[9px] font-mono mt-1" style={{ color: 'var(--pl-text-muted)' }}>
              from Manager · {new Date(toast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
