'use client';

import { registerLayout } from '../registry';
import { WizardProvider, useWizard } from '../wizard/context';
import { Icon } from '../parts/IconResolver';
import type { ResolvedDemoConfig } from '../config/types';
import type { SharedParts } from '../registry';
import { ChevronLeft, ChevronRight, Grid3X3, ListOrdered, Check } from 'lucide-react';
import { CaptureDrawer } from '../cockpit/CaptureDrawer';

function WizardInner({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  const wiz = useWizard();
  const currentStepDef = wiz.steps[wiz.currentStep];

  if (wiz.mode === 'explore') {
    return (
      <div className="flex h-screen flex-col bg-[var(--sem-bg-primary)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-6">
          <span className="text-lg font-bold text-[var(--sem-text-primary)]">{config.product.name}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={wiz.toggleMode}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--sem-text-muted)] hover:bg-white/10"
            >
              <ListOrdered className="h-3.5 w-3.5" /> Guided Mode
            </button>
            <parts.ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-[var(--sem-text-primary)]">
                {config.product.name} — All Steps
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wiz.steps.map((step, i) => {
                  const completed = wiz.completedSteps.has(step.id);
                  return (
                    <button
                      key={step.id}
                      onClick={() => wiz.goToStep(i)}
                      className="group flex flex-col items-start gap-3 rounded-xl border border-[var(--sem-border-default)] bg-[var(--sem-bg-secondary)] p-5 text-left transition-all hover:border-[var(--comp-sidebar-active-accent)]"
                    >
                      <div className="flex w-full items-center justify-between">
                        <Icon name={step.icon} className="h-5 w-5 text-[var(--comp-sidebar-active-accent)]" />
                        {completed ? (
                          <Check className="h-4 w-4 text-[var(--palette-success)]" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border-2 border-[var(--sem-border-default)]" />
                        )}
                      </div>
                      <span className="font-medium text-[var(--sem-text-primary)]">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
          {config.cockpit?.enabled && <CaptureDrawer config={config} />}
        </div>
        <parts.Footer config={config} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--sem-bg-primary)]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--comp-header-border)] bg-[var(--comp-header-bg)] px-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-[var(--sem-text-primary)]">{config.product.name}</span>
          <span className="text-sm text-[var(--sem-text-muted)]">
            Step {wiz.currentStep + 1} of {wiz.steps.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={wiz.toggleMode}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--sem-text-muted)] hover:bg-white/10"
          >
            <Grid3X3 className="h-3.5 w-3.5" /> Free Explore
          </button>
          <parts.ThemeToggle />
        </div>
      </header>

      <div className="flex shrink-0 gap-1 px-6 py-2 bg-[var(--sem-bg-secondary)]">
        {wiz.steps.map((step, i) => (
          <div
            key={step.id}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: i <= wiz.currentStep
                ? 'var(--comp-progress-bar-fill)'
                : 'var(--sem-border-default)',
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--sem-border-subtle)]">
        {currentStepDef && <Icon name={currentStepDef.icon} className="h-4 w-4 text-[var(--comp-sidebar-active-accent)]" />}
        <span className="text-sm font-medium text-[var(--sem-text-primary)]">
          {currentStepDef?.label}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[var(--sem-bg-content)] p-6">
          {children}
        </main>
        {config.cockpit?.enabled && <CaptureDrawer config={config} />}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-[var(--sem-border-subtle)] bg-[var(--comp-footer-bg)] px-6 py-3">
        <button
          onClick={wiz.goBack}
          disabled={wiz.currentStep === 0}
          className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-[var(--sem-text-muted)] transition-colors hover:text-[var(--sem-text-primary)] disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={() => {
            if (currentStepDef) wiz.markComplete(currentStepDef.id);
            wiz.goNext();
          }}
          className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--comp-progress-bar-fill)' }}
        >
          {wiz.currentStep === wiz.steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function WizardLayout({ config, children, parts }: {
  config: ResolvedDemoConfig;
  children: React.ReactNode;
  parts: SharedParts;
}) {
  if (!config.wizard) {
    throw new Error(`DemoShell: layout 'wizard' requires a 'wizard' config with steps`);
  }

  return (
    <WizardProvider
      steps={config.wizard.steps}
      startInGuided={config.wizard.startInGuided}
      slug={config.slug}
    >
      <WizardInner config={config} children={children} parts={parts} />
    </WizardProvider>
  );
}

registerLayout({
  id: 'wizard',
  label: 'Wizard',
  render: (props) => <WizardLayout {...props} />,
});
