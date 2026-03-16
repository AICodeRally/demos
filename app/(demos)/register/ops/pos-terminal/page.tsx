'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wifi, ShoppingCart, PauseCircle, Send, Sparkles, MessageSquare, User } from 'lucide-react';
import { TabletFrame } from '@/components/demos/routeiq-route/TabletFrame';
import { useRegisterTheme } from '@/components/demos/register/ThemeProvider';
import { AIInsightCard } from '@/components/demos/register/AIInsightCard';
import { ShowroomCatalog } from '@/components/demos/register/pos/ShowroomCatalog';
import { SaleTicket } from '@/components/demos/register/pos/SaleTicket';
import { CommissionMini } from '@/components/demos/register/pos/CommissionMini';
import { RewardsPanel } from '@/components/demos/register/pos/RewardsPanel';
import { CloseSaleFlow } from '@/components/demos/register/pos/CloseSaleFlow';
import { D365EventLog } from '@/components/demos/register/pos/D365EventLog';
import { BundleBuilder } from '@/components/demos/register/pos/BundleBuilder';
import { calculate } from '@/lib/swic-engine/calculator';
import { onRegisterBroadcast, type BroadcastMessage } from '@/lib/register-broadcast';
import { SUMMIT_SLEEP_CONFIG, CATALOG_ITEMS, STORE_CONTEXT, POS_REPS, SAMPLE_PERIODS } from '@/data/register/summit-sleep';
import { getInsight } from '@/data/register/ai-insights';
import type { SaleItem } from '@/lib/swic-engine/types';
import type { D365TransactionEvent } from '@/data/register/d365-schemas';

type PosTab = 'lines' | 'rewards' | 'coaching' | 'd365';

const REP = POS_REPS[0]; // Sarah Johnson
const PERIOD = SAMPLE_PERIODS['rep-sarah'];

/* ── Toast ───────────────────────────────────────────────── */

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', top: 16, right: 16, zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px', borderRadius: 12,
        background: 'var(--register-primary)', border: '1px solid var(--register-accent)',
        maxWidth: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <Send size={14} style={{ color: 'var(--register-accent)', flexShrink: 0 }} />
      <p style={{ fontSize: '0.8rem', color: '#FFFFFF', margin: 0 }}>{message}</p>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1rem', marginLeft: 8 }}>&times;</button>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────── */

export default function POSTerminal() {
  const { theme } = useRegisterTheme();
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [activeTab, setActiveTab] = useState<PosTab>('lines');
  const [d365Events, setD365Events] = useState<D365TransactionEvent[]>([]);
  const [showCloseSale, setShowCloseSale] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
  const [coachingFeed, setCoachingFeed] = useState<{ id: string; source: 'ai' | 'manager'; title: string; message: string; time: string }[]>([
    { id: 'ai-1', source: 'ai', title: 'Bundle Opportunity', message: 'Customers who buy King mattresses have 31% adjustable base attach rate. Lead with the sleep system pitch.', time: '9:15 AM' },
    { id: 'ai-2', source: 'ai', title: 'Tier Progress', message: 'You\'re $3,000 from Silver tier. Two more premium sales this week unlocks 5% commission rate.', time: '9:02 AM' },
    { id: 'ai-3', source: 'ai', title: 'Traffic Alert', message: 'Mall foot traffic spike predicted 2-4pm today. Prepare floor coverage for peak walk-ins.', time: '8:45 AM' },
  ]);
  const [coachingUnread, setCoachingUnread] = useState(0);

  const insight = getInsight('ops/floor');

  // Commission calculation
  const result = cartItems.length > 0 ? calculate(SUMMIT_SLEEP_CONFIG, cartItems, PERIOD) : null;
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = +(subtotal * STORE_CONTEXT.taxRate).toFixed(2);
  const total = subtotal + tax;

  // Broadcast listener — persist coaching messages to feed + show toast
  useEffect(() => {
    const unsub = onRegisterBroadcast((msg: BroadcastMessage) => {
      let text = '';
      if (msg.type === 'coaching') {
        text = `Coaching: ${msg.data.repName} — ${msg.data.action}`;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        setCoachingFeed((prev) => [{
          id: `mgr-${Date.now()}`,
          source: 'manager' as const,
          title: `From Manager: ${msg.data.repName}`,
          message: msg.data.message || msg.data.action || 'Manager coaching update received.',
          time: timeStr,
        }, ...prev]);
        if (activeTab !== 'coaching') setCoachingUnread((n) => n + 1);
      } else if (msg.type === 'comp-update') {
        text = `Comp Update: ${msg.data.summary}`;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        setCoachingFeed((prev) => [{
          id: `comp-${Date.now()}`,
          source: 'manager' as const,
          title: 'Comp Plan Update',
          message: msg.data.summary || 'Compensation rules have been updated.',
          time: timeStr,
        }, ...prev]);
        if (activeTab !== 'coaching') setCoachingUnread((n) => n + 1);
      } else if (msg.type === 'alert') {
        text = `Alert: ${msg.data.message}`;
      } else if (msg.type === 'pos-sync') {
        text = `POS Sync: ${msg.data.reason}`;
      }
      if (text) {
        setToasts((prev) => [...prev, { id: `${Date.now()}`, message: text }]);
      }
    });
    return unsub;
  }, [activeTab]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cart operations
  const addItem = useCallback((item: SaleItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const handleCloseSale = useCallback((event: D365TransactionEvent) => {
    setD365Events((prev) => [event, ...prev]);
    setCartItems([]);
    setShowCloseSale(false);
    setActiveTab('d365');
  }, []);

  const handleNewSale = useCallback(() => {
    setCartItems([]);
    setActiveTab('lines');
  }, []);

  // Commission breakdown string
  const breakdownStr = result
    ? result.components.filter((c) => c.amount > 0).map((c) => `${c.label}: $${c.amount.toFixed(2)}`).join(' + ')
    : 'Add items to see';

  const TABS: { id: PosTab; label: string; badge?: number }[] = [
    { id: 'lines', label: 'Lines' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'coaching', label: 'Coaching', badge: coachingUnread },
    { id: 'd365', label: `D365 Log (${d365Events.length})` },
  ];

  // AI upsell card for the sale ticket
  const hasMattress = cartItems.some((i) => i.category === 'Mattress');
  const hasBase = cartItems.some((i) => i.category === 'Adjustable Base');
  const aiUpsell = hasMattress && !hasBase ? (
    <AIInsightCard compact label="AI Upsell">
      Add an ErgoMotion Adjustable Base for +$25 SPIFF bonus and +$75 Sleep System Bundle.
    </AIInsightCard>
  ) : null;

  return (
    <div className="pos-terminal-frame" style={{ minHeight: '100vh', background: 'var(--register-bg)', color: 'var(--register-text)' }}>
      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
      ))}

      {/* Close Sale modal */}
      {showCloseSale && (
        <CloseSaleFlow
          items={cartItems}
          rep={REP}
          store={STORE_CONTEXT}
          total={total}
          onClose={handleCloseSale}
          onCancel={() => setShowCloseSale(false)}
        />
      )}

      <TabletFrame isDark={theme === 'dark'}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* ── Top Bar ─────────────────────────────── */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 16px',
              background: 'var(--register-primary)',
              borderBottom: '1px solid var(--register-border)',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>Summit Sleep</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Store: Galleria #247</span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Terminal: 115</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', color: '#10B981' }}>
                <Wifi size={12} /> D365 Connected
              </span>
            </div>
          </div>

          {/* ── Main Split ──────────────────────────── */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left: Showroom Catalog (40%) */}
            <div style={{ width: '40%', borderRight: '1px solid var(--register-border)', display: 'flex', flexDirection: 'column' }}>
              <ShowroomCatalog items={CATALOG_ITEMS} onAddItem={addItem} />
            </div>

            {/* Right: Tabs + Content (60%) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--register-border)' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'coaching') setCoachingUnread(0);
                    }}
                    style={{
                      padding: '8px 16px', fontSize: '0.75rem', fontWeight: 600,
                      background: activeTab === tab.id ? 'var(--register-bg-elevated)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--register-text)' : 'var(--register-text-muted)',
                      borderBottom: activeTab === tab.id ? '2px solid var(--register-accent)' : '2px solid transparent',
                      border: 'none', borderBottomStyle: 'solid',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    {tab.label}
                    {tab.badge && tab.badge > 0 ? (
                      <span style={{
                        position: 'absolute', top: 2, right: 2,
                        minWidth: 16, height: 16, borderRadius: 8,
                        background: '#EF4444', color: '#fff',
                        fontSize: '0.6rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 4px',
                      }}>
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {activeTab === 'lines' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 10, overflow: 'hidden' }}>
                    {/* AI Insight at top if cart has items */}
                    {cartItems.length > 0 && insight && (
                      <div style={{ marginBottom: 8 }}>
                        <AIInsightCard compact>{insight.text}</AIInsightCard>
                      </div>
                    )}
                    <SaleTicket
                      items={cartItems}
                      onRemoveItem={removeItem}
                      onUpdateQuantity={updateQty}
                      aiUpsellSlot={aiUpsell}
                    />
                    {/* Bundle badge */}
                    {cartItems.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        <BundleBuilder items={cartItems} />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'rewards' && (
                  <RewardsPanel items={cartItems} period={PERIOD} config={SUMMIT_SLEEP_CONFIG} />
                )}

                {activeTab === 'coaching' && (
                  <div style={{ flex: 1, overflow: 'auto', padding: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {coachingFeed.map((card) => (
                        <div
                          key={card.id}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 10,
                            background: card.source === 'ai'
                              ? 'rgba(139,92,246,0.06)'
                              : 'rgba(59,130,246,0.06)',
                            border: `1px solid ${card.source === 'ai' ? 'rgba(139,92,246,0.15)' : 'rgba(59,130,246,0.15)'}`,
                            borderLeft: `3px solid ${card.source === 'ai' ? '#8B5CF6' : '#3B82F6'}`,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {card.source === 'ai' ? (
                                <Sparkles size={12} style={{ color: '#8B5CF6' }} />
                              ) : (
                                <User size={12} style={{ color: '#3B82F6' }} />
                              )}
                              <span style={{
                                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                                color: card.source === 'ai' ? '#8B5CF6' : '#3B82F6',
                                letterSpacing: '0.05em',
                              }}>
                                {card.source === 'ai' ? 'AI Insight' : 'Manager'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--register-text-dim)' }}>{card.time}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--register-text)', marginBottom: 2 }}>
                            {card.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--register-text-muted)', lineHeight: 1.4 }}>
                            {card.message}
                          </div>
                        </div>
                      ))}
                      {coachingFeed.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--register-text-dim)', fontSize: '0.8rem' }}>
                          <MessageSquare size={24} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                          <p>No coaching messages yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'd365' && (
                  <div style={{ padding: 10, flex: 1, overflow: 'auto' }}>
                    <D365EventLog events={d365Events} />
                  </div>
                )}
              </div>

              {/* ── Bottom Bar ──────────────────────── */}
              <div style={{ borderTop: '1px solid var(--register-border)', padding: '8px 12px' }}>
                {/* Order summary row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <span className="register-meta-label">Subtotal</span>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)', margin: 0 }}>
                        ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="register-meta-label">Tax</span>
                      <p style={{ fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums', color: 'var(--register-text-muted)', margin: 0 }}>
                        ${tax.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="register-meta-label">Total</span>
                      <p style={{ fontSize: '1rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--register-text)', margin: 0 }}>
                        ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Commission mini */}
                  <CommissionMini
                    totalCommission={result?.totalCommission ?? 0}
                    breakdown={breakdownStr}
                  />
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleNewSale}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 8,
                      border: '1px solid var(--register-border)',
                      background: 'var(--register-bg-surface)',
                      color: 'var(--register-text-muted)',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <ShoppingCart size={14} /> New Sale
                  </button>
                  <button
                    style={{
                      flex: 1, padding: '10px', borderRadius: 8,
                      border: '1px solid var(--register-border)',
                      background: 'var(--register-bg-surface)',
                      color: 'var(--register-text-muted)',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <PauseCircle size={14} /> Hold
                  </button>
                  <button
                    onClick={() => cartItems.length > 0 && setShowCloseSale(true)}
                    disabled={cartItems.length === 0}
                    style={{
                      flex: 2, padding: '10px', borderRadius: 8,
                      border: 'none',
                      background: cartItems.length > 0 ? '#10B981' : 'var(--register-bg-surface)',
                      color: cartItems.length > 0 ? '#FFFFFF' : 'var(--register-text-dim)',
                      fontSize: '0.85rem', fontWeight: 700, cursor: cartItems.length > 0 ? 'pointer' : 'default',
                      opacity: cartItems.length > 0 ? 1 : 0.5,
                    }}
                  >
                    Close Sale
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabletFrame>
    </div>
  );
}
