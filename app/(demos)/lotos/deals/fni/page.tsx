'use client';

import { useState } from 'react';
import { FNI_PRODUCTS, DEALS } from '@/data/lotos';

const PRODUCT_DETAILS: Record<string, { termInfo: string; recommendedFor: string }> = {
  'FNI-001': { termInfo: '84-month bumper-to-bumper coverage', recommendedFor: 'High-mileage vehicles or customers wanting peace of mind on older units' },
  'FNI-002': { termInfo: '60-month coverage with $100 deductible', recommendedFor: 'Vehicles with advanced electronics and infotainment systems' },
  'FNI-003': { termInfo: '36-month coverage, paintless dent repair included', recommendedFor: 'Customers leasing or with long commutes in hail-prone areas' },
  'FNI-004': { termInfo: '72-month tire & wheel replacement plan', recommendedFor: 'Trucks, SUVs, and customers driving on rough roads or construction zones' },
  'FNI-005': { termInfo: '60-month GAP waiver agreement', recommendedFor: 'Customers financing more than 100% LTV or with minimal down payment' },
  'FNI-006': { termInfo: '36-month ceramic coating with annual refresh', recommendedFor: 'Premium vehicles or customers who want to preserve resale value' },
};

export default function FniMenuPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['FNI-001', 'FNI-002']));
  const [selectedDealId, setSelectedDealId] = useState('DL-2026-005');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const deal = DEALS.find((d) => d.id === selectedDealId)!;

  const toggleProduct = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedProducts = FNI_PRODUCTS.filter((p) => selected.has(p.id));
  const totalRetail = selectedProducts.reduce((sum, p) => sum + p.retailPrice, 0);
  const totalGross = selectedProducts.reduce((sum, p) => sum + p.dealerGross, 0);

  const fundedDeals = DEALS.filter((d) => d.status === 'funded' && d.fniGross > 0);
  const avgFniPerDeal =
    fundedDeals.length > 0
      ? Math.round(fundedDeals.reduce((sum, d) => sum + d.fniGross, 0) / fundedDeals.length)
      : 0;

  const TARGET_PENETRATION = 70;

  return (
    <div className="lot-page">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="lot-heading">
            F&amp;I Menu
          </h1>
          <p className="lot-description">
            Select products to present — running gross updates in real time
          </p>
        </div>
        <select
          value={selectedDealId}
          onChange={(e) => setSelectedDealId(e.target.value)}
          className="lot-input"
        >
          {DEALS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.id} — ${d.salePrice.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FNI_PRODUCTS.map((product) => {
            const isSelected = selected.has(product.id);
            const isExpanded = expandedProduct === product.id;
            const details = PRODUCT_DETAILS[product.id];
            return (
              <div
                key={product.id}
                className="lot-card lot-animate-in"
                style={{
                  borderColor: isSelected ? '#2563EB' : 'var(--lot-border)',
                  borderWidth: isSelected ? '2px' : '1px',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', cursor: 'pointer' }}
                        onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                      >
                        <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--lot-text)' }}>
                          {product.name}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: 'var(--lot-text-muted)',
                            background: 'var(--lot-border-faint)',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontWeight: 500,
                          }}
                        >
                          {product.id}
                        </span>
                        <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)', marginLeft: 'auto' }}>
                          {isExpanded ? '▾' : '▸'}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', marginBottom: '12px' }}>
                        {product.description}
                      </div>

                      <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Retail Price</div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text)' }}>
                            ${product.retailPrice.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Dealer Cost</div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text-secondary)' }}>
                            ${product.dealerCost.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>Dealer Gross</div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A' }}>
                            ${product.dealerGross.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600 }}>
                            Penetration Rate
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB' }}>
                            {product.penetrationRate}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: '8px',
                            background: 'var(--lot-border-faint)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${product.penetrationRate}%`,
                              background: product.penetrationRate >= 50 ? '#16A34A' : product.penetrationRate >= 30 ? '#D97706' : '#DC2626',
                              borderRadius: '4px',
                              transition: 'width 0.3s',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: `${TARGET_PENETRATION}%`,
                              width: '2px',
                              height: '100%',
                              borderLeft: '2px dashed var(--lot-text)',
                              opacity: 0.5,
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                          <span style={{ fontSize: '14px', color: 'var(--lot-text-muted)' }}>Target: {TARGET_PENETRATION}%</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', paddingTop: '2px' }}>
                      <button
                        onClick={() => toggleProduct(product.id)}
                        style={{
                          width: '48px',
                          height: '26px',
                          borderRadius: '13px',
                          background: isSelected ? '#2563EB' : '#D1D5DB',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background 0.2s',
                          flexShrink: 0,
                        }}
                        aria-label={isSelected ? 'Remove product' : 'Add product'}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '3px',
                            left: isSelected ? '25px' : '3px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'var(--lot-card)',
                            transition: 'left 0.2s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          }}
                        />
                      </button>
                      <span style={{ fontSize: '14px', color: isSelected ? '#2563EB' : 'var(--lot-text-muted)', fontWeight: 600 }}>
                        {isSelected ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </div>

                {isExpanded && details && (
                  <div
                    style={{
                      borderTop: '1px solid var(--lot-border)',
                      padding: '16px 20px',
                      background: 'var(--lot-card-alt)',
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px',
                    }}
                  >
                    <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--lot-text)' }}>Full Description:</strong> {product.description}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--lot-text)' }}>Term:</strong> {details.termInfo}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--lot-text-secondary)' }}>
                      <strong style={{ color: 'var(--lot-text)' }}>Recommended For:</strong> {details.recommendedFor}
                    </div>
                    <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '6px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#2563EB' }}>
                        Active Deal: {deal.id} — Sale Price ${deal.salePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="lot-card lot-animate-in">
            <h2 className="lot-subheading" style={{ marginBottom: '16px' }}>
              Running Total
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--lot-border-faint)',
                }}
              >
                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 500 }}>Products Selected</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}
                >
                  {selected.size} of {FNI_PRODUCTS.length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 500 }}>Total Retail</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text)' }}>
                  ${totalRetail.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid var(--lot-border)',
                  paddingTop: '12px',
                }}
              >
                <span style={{ fontSize: '15px', color: 'var(--lot-text)', fontWeight: 700 }}>Total Dealer Gross</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#16A34A' }}>
                  ${totalGross.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="lot-card lot-animate-in">
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text)', marginBottom: '12px' }}>
              Benchmark
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '2px' }}>
                  Avg F&amp;I / Deal (Funded)
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#7C3AED' }}>
                  ${avgFniPerDeal.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--lot-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                  This Deal vs Avg
                </div>
                {totalGross >= avgFniPerDeal ? (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}
                  >
                    +${(totalGross - avgFniPerDeal).toLocaleString()} above avg
                  </span>
                ) : (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
                  >
                    ${(avgFniPerDeal - totalGross).toLocaleString()} below avg
                  </span>
                )}
              </div>
            </div>
          </div>

          {selected.size > 0 && (
            <div className="lot-card lot-animate-in">
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--lot-text)', marginBottom: '12px' }}>
                Selected Products
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 0',
                      borderBottom: '1px solid var(--lot-border-faint)',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: 'var(--lot-text-secondary)', fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#16A34A' }}>
                      ${p.dealerGross.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
