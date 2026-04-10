'use client';

import React, { useMemo } from 'react';
import { BarChart2, Table as TableIcon, BookOpen } from 'lucide-react';
import {
  ContractInputForm,
  type ContractInputs,
} from '@/components/demos/prizym-governance/asc606/ContractInputForm';
import {
  AllocationTable,
  type AllocationRow,
} from '@/components/demos/prizym-governance/asc606/AllocationTable';
import {
  RevenueSchedule,
  type MonthlyRevenue,
} from '@/components/demos/prizym-governance/asc606/RevenueSchedule';
import {
  JournalEntries,
  type JournalEntry,
} from '@/components/demos/prizym-governance/asc606/JournalEntries';

const DEFAULT_INPUTS: ContractInputs = {
  termMonths: 12,
  subscriptionAmount: 120000,
  subscriptionSSP: 132000,
  aiCreditsAmount: 2000,
  aiCreditsSSP: 2500,
  onboardingAmount: 25000,
  onboardingSSP: 30000,
  hardwareAmount: 5000,
  hardwareSSP: 5000,
  marketplaceFeePercent: 5,
  marketplaceVolume: 200000,
};

function fmt(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function SectionHeader({
  icon,
  title,
  subtitle,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accent: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <div className="pg-icon-bubble" style={{ borderColor: accent }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 14, color: '#f1f5f9', marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ASC606CalculatorPage() {
  const [inputs, setInputs] = React.useState<ContractInputs>(DEFAULT_INPUTS);

  const allocation = useMemo(() => {
    const totalFixed =
      inputs.subscriptionAmount +
      inputs.aiCreditsAmount +
      inputs.onboardingAmount +
      inputs.hardwareAmount;

    const totalSSP =
      inputs.subscriptionSSP +
      inputs.aiCreditsSSP +
      inputs.onboardingSSP +
      inputs.hardwareSSP;

    const allocate = (poSSP: number): number =>
      totalSSP > 0 ? (poSSP / totalSSP) * totalFixed : 0;

    const rows: AllocationRow[] = [
      {
        label: 'Subscription License',
        ssp: inputs.subscriptionSSP,
        allocated: allocate(inputs.subscriptionSSP),
        percentage: totalSSP > 0 ? (inputs.subscriptionSSP / totalSSP) * 100 : 0,
      },
      {
        label: 'AI Credits',
        ssp: inputs.aiCreditsSSP,
        allocated: allocate(inputs.aiCreditsSSP),
        percentage: totalSSP > 0 ? (inputs.aiCreditsSSP / totalSSP) * 100 : 0,
      },
      {
        label: 'Onboarding Services',
        ssp: inputs.onboardingSSP,
        allocated: allocate(inputs.onboardingSSP),
        percentage: totalSSP > 0 ? (inputs.onboardingSSP / totalSSP) * 100 : 0,
      },
      {
        label: 'Hardware',
        ssp: inputs.hardwareSSP,
        allocated: allocate(inputs.hardwareSSP),
        percentage: totalSSP > 0 ? (inputs.hardwareSSP / totalSSP) * 100 : 0,
      },
    ];

    const marketplaceFee = (inputs.marketplaceFeePercent / 100) * inputs.marketplaceVolume;

    return { rows, totalFixed, totalSSP, marketplaceFee };
  }, [inputs]);

  const schedule = useMemo<MonthlyRevenue[]>(() => {
    const { rows, marketplaceFee } = allocation;
    const term = Math.max(1, inputs.termMonths);

    const allocSub = rows[0].allocated;
    const allocAI = rows[1].allocated;
    const allocOnboard = rows[2].allocated;
    const allocHW = rows[3].allocated;

    const monthlyMkt = marketplaceFee / term;

    return Array.from({ length: term }, (_, i) => {
      const month = i + 1;
      const sub = allocSub / term;
      const ai = allocAI / term;
      const onboarding = month === 1 ? allocOnboard / 2 : month === 2 ? allocOnboard / 2 : 0;
      const hardware = month === 1 ? allocHW : 0;
      const marketplace = monthlyMkt;
      const total = sub + ai + onboarding + hardware + marketplace;

      return {
        month,
        subscription: sub,
        aiCredits: ai,
        onboarding,
        hardware,
        marketplace,
        total,
      };
    });
  }, [allocation, inputs.termMonths]);

  const journalEntries = useMemo<JournalEntry[]>(() => {
    const { rows, totalFixed, marketplaceFee } = allocation;
    const term = Math.max(1, inputs.termMonths);

    const month1 = schedule[0];
    if (!month1) return [];

    const month1Fixed =
      month1.subscription + month1.aiCredits + month1.onboarding + month1.hardware;
    const mktMonthly = marketplaceFee / term;

    return [
      {
        title: 'Invoice — Fixed Bundle',
        description: 'Record invoice at contract inception for full fixed consideration',
        entries: [
          { account: 'Accounts Receivable', debit: totalFixed },
          { account: 'Contract Liability (Deferred Revenue)', credit: totalFixed },
        ],
      },
      {
        title: 'Cash Collection — Fixed Bundle',
        description: 'Record cash received from customer',
        entries: [
          { account: 'Cash', debit: totalFixed },
          { account: 'Accounts Receivable', credit: totalFixed },
        ],
      },
      {
        title: 'Month 1 Revenue Recognition',
        description: 'Recognize revenue as performance obligations are satisfied',
        entries: [
          {
            account: 'Contract Liability (Deferred Revenue)',
            debit: month1Fixed,
            note: 'release to revenue',
          },
          {
            account: 'Subscription License Revenue',
            credit: month1.subscription,
            note: `${fmt(rows[0].allocated)} ÷ ${term} mo`,
          },
          {
            account: 'AI Credits Revenue',
            credit: month1.aiCredits,
            note: `${fmt(rows[1].allocated)} ÷ ${term} mo`,
          },
          {
            account: 'Professional Services Revenue — Onboarding',
            credit: month1.onboarding,
            note: 'POC 50% month 1',
          },
          {
            account: 'Hardware Revenue',
            credit: month1.hardware,
            note: 'point-in-time on delivery',
          },
        ],
      },
      {
        title: 'Marketplace Commission — Month 1',
        description: 'Recognize variable consideration as earned each period',
        entries: [
          { account: 'Accounts Receivable — Marketplace', debit: mktMonthly },
          {
            account: 'Marketplace Commission Revenue',
            credit: mktMonthly,
            note: `${inputs.marketplaceFeePercent}% of monthly volume`,
          },
        ],
      },
    ];
  }, [allocation, schedule, inputs.termMonths, inputs.marketplaceFeePercent]);

  const { totalFixed, marketplaceFee, rows } = allocation;
  const totalContractValue = totalFixed + marketplaceFee;

  return (
    <div className="pg-page" style={{ height: '100%' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 4 }}>
          ASC 606 Revenue Allocation Calculator
        </h1>
        <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.45 }}>
          Allocate transaction price across performance obligations using standalone selling prices. Monthly recognition schedule and sample journal entries generated below.
        </p>
      </div>

      {/* Money tiles */}
      <div className="pg-card-elevated" style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Fixed Bundle
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--pg-cyan-bright)', lineHeight: 1 }}>
              {fmt(totalFixed)}
            </div>
          </div>
          <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.22)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Variable (Marketplace)
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              {fmt(marketplaceFee)}
            </div>
          </div>
          <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.22)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Total Contract Value
            </div>
            <div style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              lineHeight: 1,
              background: 'linear-gradient(90deg, #7dd3fc, #a5b4fc, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {fmt(totalContractValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content — inputs+allocation, schedule, journal entries live inside one scroll region */}
      <div className="pg-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="pg-asc606-grid">
          <div className="pg-card-elevated" style={{ padding: 18 }}>
            <SectionHeader
              icon={<BookOpen size={20} color="var(--pg-cyan-bright)" strokeWidth={2.4} />}
              title="Contract Inputs"
              subtitle="Enter contract amounts and standalone selling prices"
              accent="var(--pg-cyan-bright)"
            />
            <ContractInputForm inputs={inputs} onChange={setInputs} />
          </div>

          <div className="pg-card-elevated" style={{ padding: 18 }}>
            <SectionHeader
              icon={<BarChart2 size={20} color="var(--pg-success-bright)" strokeWidth={2.4} />}
              title="SSP Allocation"
              subtitle="Relative standalone selling price method (ASC 606-10-32-31)"
              accent="var(--pg-success-bright)"
            />
            <AllocationTable
              rows={rows}
              totalFixed={totalFixed}
              totalSSP={allocation.totalSSP}
              marketplaceFee={marketplaceFee}
            />
          </div>
        </div>

        <div className="pg-card-elevated" style={{ padding: 18, marginBottom: 16 }}>
          <SectionHeader
            icon={<TableIcon size={20} color="var(--pg-info-bright)" strokeWidth={2.4} />}
            title="Monthly Revenue Schedule"
            subtitle={`${inputs.termMonths}-month recognition schedule by performance obligation`}
            accent="var(--pg-info-bright)"
          />
          <RevenueSchedule schedule={schedule} termMonths={inputs.termMonths} />
        </div>

        <div className="pg-card-elevated" style={{ padding: 18, marginBottom: 16 }}>
          <SectionHeader
            icon={<BookOpen size={20} color="var(--pg-oversee-bright)" strokeWidth={2.4} />}
            title="Sample Journal Entries"
            subtitle="Auto-generated based on contract structure — for illustrative purposes"
            accent="var(--pg-oversee-bright)"
          />
          <JournalEntries entries={journalEntries} />
        </div>

        <p style={{ fontSize: 14, color: '#f1f5f9', textAlign: 'center', paddingBottom: 8 }}>
          This calculator is for illustrative and discussion purposes only. Consult your accounting team and auditors for final ASC 606 treatment.
        </p>
      </div>
    </div>
  );
}
