'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

// Simple toast system: dispatches a custom event on window that the
// <ToastHost/> listens for. Any component can call showDemoToast()
// without importing a context.

type ToastTone = 'success' | 'info' | 'warning' | 'danger';

type ToastPayload = {
  message: string;
  tone?: ToastTone;
};

type ToastItem = ToastPayload & { id: number };

let toastCounter = 0;

export function showDemoToast(message: string, tone: ToastPayload['tone'] = 'info') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<ToastPayload>('pg-demo-toast', { detail: { message, tone } }),
  );
}

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const { message, tone } = (e as CustomEvent<ToastPayload>).detail;
      const id = ++toastCounter;
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    };
    window.addEventListener('pg-demo-toast', onToast);
    return () => window.removeEventListener('pg-demo-toast', onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        const color =
          t.tone === 'success' ? 'var(--pg-success-bright)' :
          t.tone === 'warning' ? 'var(--pg-warning-bright)' :
          t.tone === 'danger' ? 'var(--pg-danger-bright)' :
          'var(--pg-cyan-bright)';
        const Icon =
          t.tone === 'success' ? CheckCircle2 :
          t.tone === 'warning' ? AlertTriangle :
          t.tone === 'danger' ? XCircle :
          Info;
        return (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 22px',
              borderRadius: 12,
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(18px) saturate(150%)',
              border: `1.5px solid ${color}`,
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.5)',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 700,
              pointerEvents: 'auto',
              animation: 'pg-dropdown-in 160ms cubic-bezier(0.16, 1, 0.3, 1) both',
              minWidth: 260,
            }}
          >
            <Icon size={18} color={color} strokeWidth={2.4} />
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
