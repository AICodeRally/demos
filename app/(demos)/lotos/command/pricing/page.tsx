'use client';

import { useState, Fragment } from 'react';
import { VEHICLES } from '@/data/lotos';
import { Toast } from '@/components/demos/lotos';

const MARKET_COMPS = [
  { source: 'CarGurus', vehicle: '2023 Mazda CX-5 Preferred', miles: 22000, price: 29500, daysListed: 18 },
  { source: 'AutoTrader', vehicle: '2023 Mazda CX-5 Touring', miles: 28000, price: 28800, daysListed: 22 },
  { source: 'Cars.com', vehicle: '2023 Mazda CX-5 Select', miles: 26000, price: 27900, daysListed: 15 },
  { source: 'Dealer Trade', vehicle: '2022 Mazda CX-5 Preferred', miles: 31000, price: 27200, daysListed: 28 },
  { source: 'Manheim', vehicle: '2023 Mazda CX-5 Preferred', miles: 25000, price: 23800, daysListed: 0 },
];

const COMP_DETAILS = [
  { link: 'cargurus.com/listing/cx5-pref-2023', listedAgo: '18d ago', condition: 'Excellent — no visible wear' },
  { link: 'autotrader.com/listing/cx5-tour-2023', listedAgo: '22d ago', condition: 'Good — minor tire wear' },
  { link: 'cars.com/listing/cx5-sel-2023', listedAgo: '15d ago', condition: 'Good — minor wear' },
  { link: 'dealertrade.com/listing/cx5-pref-2022', listedAgo: '28d ago', condition: 'Fair — small dent rear quarter' },
  { link: 'manheim.com/auction/cx5-pref-2023', listedAgo: 'Auction', condition: 'Good — minor wear' },
];

const AI_SUGGESTED_MIN = 28900;
const AI_SUGGESTED_MAX = 30500;
const AI_SUGGESTED_MIDPOINT = 29700;

function getDaysToSell(adjustment: number): string {
  if (adjustment <= -10) return '8-12 days';
  if (adjustment <= -5) return '12-18 days';
  if (adjustment === 0) return '18-25 days';
  if (adjustment <= 5) return '28-35 days';
  return '40-55 days';
}

const frontlineVehicles = VEHICLES.filter((v) => v.status === 'frontline');

export default function LotosPricingPage() {
  const [selectedId, setSelectedId] = useState('STK-018');
  const [adjustment, setAdjustment] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [localPrices, setLocalPrices] = useState<Record<string, number>>(() => {
    const prices: Record<string, number> = {};
    VEHICLES.forEach((v) => { prices[v.id] = v.askingPrice; });
    return prices;
  });
  const [expandedComp, setExpandedComp] = useState<number | null>(null);

  const vehicle = VEHICLES.find((v) => v.id === selectedId) ?? VEHICLES.find((v) => v.id === 'STK-018')!;

  const currentAsk = localPrices[vehicle.id] ?? vehicle.askingPrice;
  const adjustedAsk = Math.round(currentAsk * (1 + adjustment / 100));
  const daysToSell = getDaysToSell(adjustment);

  const barMin = 22000;
  const barMax = 34000;
  const barRange = barMax - barMin;
  const toPercent = (v: number) => Math.max(0, Math.min(100, ((v - barMin) / barRange) * 100));

  const sugMinPct = toPercent(AI_SUGGESTED_MIN);
  const sugMaxPct = toPercent(AI_SUGGESTED_MAX);
  const askPct = toPercent(adjustedAsk);

  function handleApplyPrice() {
    setLocalPrices((prev) => ({ ...prev, [vehicle.id]: adjustedAsk }));
    setToastMsg(`Price updated to $${adjustedAsk.toLocaleString()}`);
    setAdjustment(0);
  }

  return (
    <div className="lot-page">
      {toastMsg && <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />}

      <div style={{ marginBottom: '24px' }}>
        <h1 className="lot-heading">
          AI Pricing Engine
        </h1>
        <p className="lot-description">
          Market comps, suggested price range, and what-if scenario modeling
        </p>
      </div>

      <div
        className="lot-card lot-animate-in"
        style={{ marginBottom: '24px' }}
      >
        <div style={{ marginBottom: '12px' }}>
          <label
            htmlFor="vehicle-select"
            style={{ fontSize: '14px', fontWeight: 600, color: 'var(--lot-text-muted)', display: 'block', marginBottom: '6px' }}
          >
            Select Vehicle
          </label>
          <select
            id="vehicle-select"
            value={selectedId}
            onChange={(e) => { setSelectedId(e.target.value); setAdjustment(0); }}
            className="lot-input"
            style={{
              minWidth: '360px',
              cursor: 'pointer',
            }}
          >
            {frontlineVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} — {v.year} {v.make} {v.model} {v.trim}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '8px' }}>
          {[
            { label: 'Asking Price', value: `$${currentAsk.toLocaleString()}` },
            { label: 'Acq + Recon', value: `$${(vehicle.acquisitionCost + vehicle.reconCost).toLocaleString()}` },
            { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} mi` },
            { label: 'Days on Lot', value: `${vehicle.daysOnLot} days` },
            { label: 'Color', value: vehicle.color },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div
          className="lot-card lot-animate-in"
          style={{ overflow: 'hidden', padding: 0 }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--lot-border-faint)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text)' }}>Market Comparables</h2>
            <p style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginTop: '2px' }}>Based on 2023 Mazda CX-5 segment</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--lot-border-faint)' }}>
                {['Source', 'Vehicle', 'Miles', 'Price', 'Days'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 600,
                      color: 'var(--lot-text-muted)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MARKET_COMPS.map((comp, idx) => (
                <Fragment key={comp.source}>
                  <tr
                    style={{ borderBottom: expandedComp === idx ? 'none' : '1px solid var(--lot-border-faint)', cursor: 'pointer', background: expandedComp === idx ? 'var(--lot-card-alt)' : 'transparent' }}
                    onClick={() => setExpandedComp(expandedComp === idx ? null : idx)}
                  >
                    <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: 'var(--lot-text)' }}>
                      {comp.source}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '14px', color: 'var(--lot-text-secondary)' }}>
                      {comp.vehicle}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '14px', color: 'var(--lot-text-secondary)', whiteSpace: 'nowrap' }}>
                      {comp.miles.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: 'var(--lot-text)', whiteSpace: 'nowrap' }}>
                      ${comp.price.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '14px', color: comp.daysListed === 0 ? 'var(--lot-text-muted)' : 'var(--lot-text-secondary)' }}>
                      {comp.daysListed === 0 ? 'Auction' : `${comp.daysListed}d`}
                    </td>
                  </tr>
                  {expandedComp === idx && (
                    <tr key={`${comp.source}-detail`} style={{ borderBottom: '1px solid var(--lot-border-faint)' }}>
                      <td colSpan={5} style={{ padding: '0 14px 12px 14px' }}>
                        <div
                          style={{
                            background: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            display: 'flex',
                            gap: '24px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Source Link</div>
                            <div style={{ fontSize: '14px', color: '#2563EB', fontWeight: 600 }}>{COMP_DETAILS[idx].link}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Listed</div>
                            <div style={{ fontSize: '14px', color: 'var(--lot-text)', fontWeight: 600 }}>{COMP_DETAILS[idx].listedAgo}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Condition</div>
                            <div style={{ fontSize: '14px', color: 'var(--lot-text)', fontWeight: 600 }}>{COMP_DETAILS[idx].condition}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="lot-card lot-animate-in"
        >
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text)', marginBottom: '4px' }}>
            AI Price Suggestion
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '6px 12px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A' }}>
              ${AI_SUGGESTED_MIN.toLocaleString()} — ${AI_SUGGESTED_MAX.toLocaleString()}
            </span>
            <span style={{ fontSize: '14px', color: '#16A34A', fontWeight: 600 }}>
              · 87% confidence
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative', height: '40px', marginBottom: '8px' }}>
              <div
                className="lot-progress-track"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '6px',
                  borderRadius: '3px',
                  transform: 'translateY(-50%)',
                }}
              />
              <div
                className="lot-progress-fill"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${sugMinPct}%`,
                  width: `${sugMaxPct - sugMinPct}%`,
                  height: '10px',
                  background: '#BBF7D0',
                  borderRadius: '5px',
                  transform: 'translateY(-50%)',
                  border: '1px solid #16A34A',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${toPercent(AI_SUGGESTED_MIDPOINT)}%`,
                  width: '3px',
                  height: '18px',
                  background: '#16A34A',
                  borderRadius: '2px',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${askPct}%`,
                  width: '12px',
                  height: '12px',
                  background: '#2563EB',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 0 0 2px #2563EB',
                  zIndex: 2,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--lot-text-muted)' }}>
              <span>${barMin.toLocaleString()}</span>
              <span>${barMax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '12px', height: '8px', background: '#BBF7D0', border: '1px solid #16A34A', borderRadius: '2px' }} />
                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>AI Suggested Range</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '10px', height: '10px', background: '#2563EB', borderRadius: '50%' }} />
                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>
                  Current Ask (${adjustedAsk.toLocaleString()})
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#FEF3C7',
              border: '1px solid #FCD34D',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '14px',
              color: '#92400E',
            }}
          >
            Current asking price <strong>${currentAsk.toLocaleString()}</strong> is{' '}
            {currentAsk > AI_SUGGESTED_MAX ? 'above' : currentAsk < AI_SUGGESTED_MIN ? 'below' : 'within'} the
            AI-suggested range. {currentAsk > AI_SUGGESTED_MAX ? 'Consider a $500-$1,000 reduction to align with market.' : currentAsk < AI_SUGGESTED_MIN ? 'Room to increase — market supports a higher price.' : 'Price is well-positioned for current market conditions.'}
          </div>
        </div>
      </div>

      <div
        className="lot-card lot-animate-in"
      >
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--lot-text)', marginBottom: '4px' }}>
          What-If Pricing Scenario
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginBottom: '20px' }}>
          Adjust price to see projected days-to-sell impact
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[-10, -5, 0, 5, 10].map((pct) => (
            <button
              key={pct}
              onClick={() => setAdjustment(pct)}
              className={adjustment === pct ? 'lot-btn lot-btn-active' : 'lot-btn'}
            >
              {pct === 0 ? 'Current' : pct > 0 ? `+${pct}%` : `${pct}%`}
            </button>
          ))}
          <button
            onClick={handleApplyPrice}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#16A34A',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Apply Price
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: 'var(--lot-border)', background: 'var(--lot-card-alt)' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              Adjusted Asking Price
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--lot-text)' }}>
              ${adjustedAsk.toLocaleString()}
            </div>
            {adjustment !== 0 && (
              <div style={{ fontSize: '14px', color: adjustment < 0 ? '#DC2626' : '#16A34A', marginTop: '2px', fontWeight: 600 }}>
                {adjustment > 0 ? '+' : ''}${(adjustedAsk - currentAsk).toLocaleString()} vs current
              </div>
            )}
          </div>

          <div
            className="rounded-xl border p-5"
            style={{ borderColor: 'var(--lot-border)', background: 'var(--lot-card-alt)' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              Projected Days to Sell
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: adjustment <= -5 ? '#16A34A' : adjustment >= 5 ? '#DC2626' : '#D97706' }}
            >
              {daysToSell}
            </div>
          </div>

          <div
            className="rounded-xl border p-5"
            style={{ borderColor: 'var(--lot-border)', background: 'var(--lot-card-alt)' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              Gross Profit (Est.)
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--lot-text)' }}>
              ${(adjustedAsk - vehicle.acquisitionCost - vehicle.reconCost).toLocaleString()}
            </div>
          </div>

          <div
            className="rounded-xl border p-5"
            style={{ borderColor: 'var(--lot-border)', background: 'var(--lot-card-alt)' }}
          >
            <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              vs AI Suggested Range
            </div>
            <div
              className="text-3xl font-bold"
              style={{
                color:
                  adjustedAsk >= AI_SUGGESTED_MIN && adjustedAsk <= AI_SUGGESTED_MAX
                    ? '#16A34A'
                    : '#DC2626',
              }}
            >
              {adjustedAsk >= AI_SUGGESTED_MIN && adjustedAsk <= AI_SUGGESTED_MAX
                ? 'In Range'
                : adjustedAsk > AI_SUGGESTED_MAX
                ? `$${(adjustedAsk - AI_SUGGESTED_MAX).toLocaleString()} High`
                : `$${(AI_SUGGESTED_MIN - adjustedAsk).toLocaleString()} Low`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
