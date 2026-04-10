'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, BarChart2, Table as TableIcon, BookOpen } from 'lucide-react';
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
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-[color:var(--color-info-bg)] border border-[color:var(--color-info-border)]">
        <span className="text-[color:var(--color-primary)]">{icon}</span>
      </div>
      <div>
        <h2 className="text-lg font-bold text-[color:var(--color-foreground)]">{title}</h2>
        {subtitle && <p className="text-sm text-[color:var(--color-muted)]">{subtitle}</p>}
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/prizym-governance/design"
            className="font-medium text-[color:var(--color-muted)] hover:text-[color:var(--color-info)] transition-colors"
          >
            Design
          </Link>
          <ChevronRight className="w-4 h-4 text-[color:var(--color-muted)]" />
          <span className="font-semibold text-[color:var(--color-info)]">ASC 606 Calculator</span>
        </nav>

        {/* Page header */}
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 theme-card-strong">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold bg-[linear-gradient(90deg,#0ea5e9,#6366f1,#8b5cf6)] bg-clip-text text-transparent">
                ASC 606 Revenue Allocation Calculator
              </h1>
              <p className="text-sm text-[color:var(--color-muted)] mt-1 max-w-xl">
                Allocate transaction price across performance obligations using standalone selling
                prices. Generates a monthly revenue schedule and sample journal entries.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-right">
                <p className="text-xs text-[color:var(--color-muted)] uppercase tracking-wide">
                  Fixed Bundle
                </p>
                <p className="text-xl font-bold text-[color:var(--color-primary)]">
                  {fmt(totalFixed)}
                </p>
              </div>
              <div className="w-px h-10 bg-[color:var(--color-border)]" />
              <div className="text-right">
                <p className="text-xs text-[color:var(--color-muted)] uppercase tracking-wide">
                  Var. Est.
                </p>
                <p className="text-xl font-bold text-[color:var(--color-foreground)]">
                  {fmt(marketplaceFee)}
                </p>
              </div>
              <div className="w-px h-10 bg-[color:var(--color-border)]" />
              <div className="text-right">
                <p className="text-xs text-[color:var(--color-muted)] uppercase tracking-wide">
                  Total Contract
                </p>
                <p className="text-xl font-bold text-[color:var(--color-foreground)]">
                  {fmt(totalContractValue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column: inputs + allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 theme-card">
            <SectionHeader
              icon={<BookOpen className="w-5 h-5" />}
              title="Contract Inputs"
              subtitle="Enter contract amounts and standalone selling prices"
            />
            <ContractInputForm inputs={inputs} onChange={setInputs} />
          </div>

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 theme-card">
            <SectionHeader
              icon={<BarChart2 className="w-5 h-5" />}
              title="SSP Allocation"
              subtitle="Relative standalone selling price method (ASC 606-10-32-31)"
            />
            <AllocationTable
              rows={rows}
              totalFixed={totalFixed}
              totalSSP={allocation.totalSSP}
              marketplaceFee={marketplaceFee}
            />
          </div>
        </div>

        {/* Revenue Schedule */}
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 theme-card">
          <SectionHeader
            icon={<TableIcon className="w-5 h-5" />}
            title="Monthly Revenue Schedule"
            subtitle={`${inputs.termMonths}-month recognition schedule by performance obligation`}
          />
          <RevenueSchedule schedule={schedule} termMonths={inputs.termMonths} />
        </div>

        {/* Journal Entries */}
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 theme-card">
          <SectionHeader
            icon={<BookOpen className="w-5 h-5" />}
            title="Sample Journal Entries"
            subtitle="Auto-generated based on contract structure — for illustrative purposes"
          />
          <JournalEntries entries={journalEntries} />
        </div>

        <p className="text-xs text-[color:var(--color-muted)] text-center pb-4">
          This calculator is for illustrative and discussion purposes only. Consult your accounting
          team and auditors for final ASC 606 treatment.
        </p>
      </div>
    </div>
  );
}
