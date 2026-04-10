'use client';

import React from 'react';

export interface ContractInputs {
  termMonths: number;
  subscriptionAmount: number;
  subscriptionSSP: number;
  aiCreditsAmount: number;
  aiCreditsSSP: number;
  onboardingAmount: number;
  onboardingSSP: number;
  hardwareAmount: number;
  hardwareSSP: number;
  marketplaceFeePercent: number;
  marketplaceVolume: number;
}

interface ContractInputFormProps {
  inputs: ContractInputs;
  onChange: (inputs: ContractInputs) => void;
}

function CurrencyInput({
  label,
  value,
  fieldKey,
  onChange,
  prefix = '$',
}: {
  label: string;
  value: number;
  fieldKey: keyof ContractInputs;
  onChange: (key: keyof ContractInputs, value: number) => void;
  prefix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--color-muted)] select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => onChange(fieldKey, parseFloat(e.target.value) || 0)}
          className={`w-full ${prefix ? 'pl-7' : 'pl-3'} pr-3 py-2 text-sm bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-md text-[color:var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-info-border)] focus:border-transparent transition-colors`}
        />
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  fieldKey,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  fieldKey: keyof ContractInputs;
  onChange: (key: keyof ContractInputs, value: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => onChange(fieldKey, parseFloat(e.target.value) || 0)}
          className="w-full pl-3 pr-8 py-2 text-sm bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-md text-[color:var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-info-border)] focus:border-transparent transition-colors"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-muted)] select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider whitespace-nowrap">
        {title}
      </span>
      <div className="flex-1 h-px bg-[color:var(--color-border)]" />
    </div>
  );
}

export function ContractInputForm({ inputs, onChange }: ContractInputFormProps) {
  const handleChange = (key: keyof ContractInputs, value: number) => {
    onChange({ ...inputs, [key]: value });
  };

  return (
    <div className="space-y-5">
      <SectionDivider title="Contract Term" />
      <NumberInput
        label="Term Length"
        value={inputs.termMonths}
        fieldKey="termMonths"
        onChange={handleChange}
        suffix="months"
      />

      <SectionDivider title="Fixed Components" />

      {/* Subscription */}
      <div>
        <p className="text-xs font-semibold text-[color:var(--color-foreground)] mb-2">Subscription</p>
        <div className="grid grid-cols-2 gap-3">
          <CurrencyInput
            label="Contract Amount"
            value={inputs.subscriptionAmount}
            fieldKey="subscriptionAmount"
            onChange={handleChange}
          />
          <CurrencyInput
            label="Standalone SSP"
            value={inputs.subscriptionSSP}
            fieldKey="subscriptionSSP"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* AI Credits */}
      <div>
        <p className="text-xs font-semibold text-[color:var(--color-foreground)] mb-2">AI Credits</p>
        <div className="grid grid-cols-2 gap-3">
          <CurrencyInput
            label="Contract Amount"
            value={inputs.aiCreditsAmount}
            fieldKey="aiCreditsAmount"
            onChange={handleChange}
          />
          <CurrencyInput
            label="Standalone SSP"
            value={inputs.aiCreditsSSP}
            fieldKey="aiCreditsSSP"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Onboarding */}
      <div>
        <p className="text-xs font-semibold text-[color:var(--color-foreground)] mb-2">Onboarding Services</p>
        <div className="grid grid-cols-2 gap-3">
          <CurrencyInput
            label="Contract Amount"
            value={inputs.onboardingAmount}
            fieldKey="onboardingAmount"
            onChange={handleChange}
          />
          <CurrencyInput
            label="Standalone SSP"
            value={inputs.onboardingSSP}
            fieldKey="onboardingSSP"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Hardware */}
      <div>
        <p className="text-xs font-semibold text-[color:var(--color-foreground)] mb-2">Hardware</p>
        <div className="grid grid-cols-2 gap-3">
          <CurrencyInput
            label="Contract Amount"
            value={inputs.hardwareAmount}
            fieldKey="hardwareAmount"
            onChange={handleChange}
          />
          <CurrencyInput
            label="Standalone SSP"
            value={inputs.hardwareSSP}
            fieldKey="hardwareSSP"
            onChange={handleChange}
          />
        </div>
      </div>

      <SectionDivider title="Variable Components" />

      {/* Marketplace */}
      <div>
        <p className="text-xs font-semibold text-[color:var(--color-foreground)] mb-2">Marketplace Commission</p>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Fee Rate"
            value={inputs.marketplaceFeePercent}
            fieldKey="marketplaceFeePercent"
            onChange={handleChange}
            suffix="%"
          />
          <CurrencyInput
            label="Est. Annual Volume"
            value={inputs.marketplaceVolume}
            fieldKey="marketplaceVolume"
            onChange={handleChange}
          />
        </div>
        <p className="text-xs text-[color:var(--color-muted)] mt-2">
          Estimated annual fee: ${((inputs.marketplaceFeePercent / 100) * inputs.marketplaceVolume).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}
