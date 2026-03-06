export interface EmcoGate {
  threshold: number;
  label: string;
  multiplier: number;
}

export const EMCO_GATES: Record<string, EmcoGate> = {
  core: { threshold: 0.85, label: 'Core Brands \u2265 85%', multiplier: 1.0 },
  emerging: { threshold: 0.70, label: 'Emerging Brands \u2265 70%', multiplier: 1.25 },
  combined: { threshold: 0.90, label: 'Combined \u2265 90%', multiplier: 1.50 },
};
