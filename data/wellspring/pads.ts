export interface Pad {
  id: string;
  name: string;
  wellCount: number;
  activeWells: number;
  avgOilBpd: number;
  avgWaterCut: number;
  uptime: number;
  loeBoe: number;
  safety: number;
  lat: number;
  lng: number;
  county: string;
}

export const PADS: Pad[] = [
  {
    id: 'pad-a',
    name: 'Mustang Pad',
    wellCount: 18,
    activeWells: 16,
    avgOilBpd: 37,
    avgWaterCut: 0.43,
    uptime: 0.91,
    loeBoe: 12.40,
    safety: 0.98,
    lat: 31.4125,
    lng: -103.4850,
    county: 'Reeves',
  },
  {
    id: 'pad-b',
    name: 'Rattlesnake Pad',
    wellCount: 16,
    activeWells: 15,
    avgOilBpd: 53,
    avgWaterCut: 0.39,
    uptime: 0.94,
    loeBoe: 10.80,
    safety: 0.97,
    lat: 31.3680,
    lng: -103.5420,
    county: 'Reeves',
  },
  {
    id: 'pad-c',
    name: 'Sidewinder Pad',
    wellCount: 14,
    activeWells: 14,
    avgOilBpd: 91,
    avgWaterCut: 0.33,
    uptime: 0.96,
    loeBoe: 8.90,
    safety: 1.00,
    lat: 31.4480,
    lng: -103.6100,
    county: 'Pecos',
  },
  {
    id: 'pad-d',
    name: 'Diamondback Pad',
    wellCount: 12,
    activeWells: 12,
    avgOilBpd: 151,
    avgWaterCut: 0.24,
    uptime: 0.98,
    loeBoe: 7.20,
    safety: 1.00,
    lat: 31.3350,
    lng: -103.6800,
    county: 'Pecos',
  },
];
