export type InspectionType =
  | 'bop-test'
  | 'flare-check'
  | 'spill-kit'
  | 'h2s-monitor'
  | 'tank-environmental'
  | 'wellhead-safety-valve';

export type ComplianceStatus = 'pass' | 'fail' | 'pending' | 'na';

export interface ComplianceCheck {
  item: string;
  status: ComplianceStatus;
  notes: string;
}

export interface HseStop {
  id: string;
  sequence: number;
  inspectionType: InspectionType;
  location: string;
  padId: string | null;
  arrivalTime: string;
  duration: number;
  checks: ComplianceCheck[];
  lastInspected: string;
  inspectorName: string;
  priority: 'routine' | 'follow-up' | 'urgent';
  lat: number;
  lng: number;
}

export interface HseRoute {
  routeId: string;
  officerName: string;
  date: string;
  region: string;
  stops: HseStop[];
  totalDuration: string;
}

export const HSE_INSPECTION_ROUTE: HseRoute = {
  routeId: 'HSE-2026-03-04',
  officerName: 'Carlos Mendoza',
  date: '2026-03-04',
  region: 'Permian Basin — All Pads',
  totalDuration: '5h 30m',
  stops: [
    {
      id: 'hse-01',
      sequence: 1,
      inspectionType: 'bop-test',
      location: 'Rattlesnake 17-1H (Active Drilling)',
      padId: 'pad-b',
      arrivalTime: '07:00',
      duration: 60,
      checks: [
        { item: 'Annular BOP function test', status: 'pending', notes: '' },
        { item: 'Ram BOP function test (blind/pipe)', status: 'pending', notes: '' },
        { item: 'Choke manifold pressure test', status: 'pending', notes: '' },
        { item: 'Kill line pressure test', status: 'pending', notes: '' },
        { item: 'Accumulator precharge pressure', status: 'pending', notes: '' },
        { item: 'Remote BOP control panel check', status: 'pending', notes: '' },
      ],
      lastInspected: '2026-02-25',
      inspectorName: 'Carlos Mendoza',
      priority: 'routine',
      lat: 31.3700,
      lng: -103.5400,
    },
    {
      id: 'hse-02',
      sequence: 2,
      inspectionType: 'flare-check',
      location: 'Diamondback Pad Flare Stack',
      padId: 'pad-d',
      arrivalTime: '08:15',
      duration: 45,
      checks: [
        { item: 'Flare pilot flame active', status: 'pending', notes: '' },
        { item: 'Flare stack structural integrity', status: 'pending', notes: '' },
        { item: 'Combustion efficiency (visual + meter)', status: 'pending', notes: '' },
        { item: 'TCEQ flare permit current', status: 'pending', notes: '' },
        { item: 'Gas capture rate ≥ 95%', status: 'pending', notes: '' },
      ],
      lastInspected: '2026-02-18',
      inspectorName: 'Carlos Mendoza',
      priority: 'routine',
      lat: 31.3360,
      lng: -103.6790,
    },
    {
      id: 'hse-03',
      sequence: 3,
      inspectionType: 'spill-kit',
      location: 'Sidewinder Pad Tank Battery',
      padId: 'pad-c',
      arrivalTime: '09:15',
      duration: 40,
      checks: [
        { item: 'Spill kit inventory complete (absorbent, booms, PPE)', status: 'pending', notes: '' },
        { item: 'Secondary containment berm integrity', status: 'pending', notes: '' },
        { item: 'Drain valves closed and locked', status: 'pending', notes: '' },
        { item: 'SPCC plan posted and current', status: 'pending', notes: '' },
        { item: 'Emergency contact numbers visible', status: 'pending', notes: '' },
      ],
      lastInspected: '2026-02-20',
      inspectorName: 'Carlos Mendoza',
      priority: 'follow-up',
      lat: 31.4490,
      lng: -103.6110,
    },
    {
      id: 'hse-04',
      sequence: 4,
      inspectionType: 'h2s-monitor',
      location: 'Mustang Pad — Tank Gauging Area',
      padId: 'pad-a',
      arrivalTime: '10:10',
      duration: 50,
      checks: [
        { item: 'Fixed H2S monitors calibrated (bump test)', status: 'pending', notes: '' },
        { item: 'Personal H2S monitors issued to all personnel', status: 'pending', notes: '' },
        { item: 'Wind sock operational', status: 'pending', notes: '' },
        { item: 'Evacuation route signs posted', status: 'pending', notes: '' },
        { item: 'SCBA equipment inspection (2 units)', status: 'pending', notes: '' },
        { item: 'H2S contingency plan current', status: 'pending', notes: '' },
      ],
      lastInspected: '2026-02-22',
      inspectorName: 'Carlos Mendoza',
      priority: 'routine',
      lat: 31.4130,
      lng: -103.4840,
    },
    {
      id: 'hse-05',
      sequence: 5,
      inspectionType: 'tank-environmental',
      location: 'Rattlesnake Pad — Secondary Containment',
      padId: 'pad-b',
      arrivalTime: '11:15',
      duration: 45,
      checks: [
        { item: 'Liner integrity (visual for tears/punctures)', status: 'pending', notes: '' },
        { item: 'Containment volume adequate (110% largest tank)', status: 'pending', notes: '' },
        { item: 'No standing fluids in containment', status: 'pending', notes: '' },
        { item: 'Level gauges and alarms functional', status: 'pending', notes: '' },
        { item: 'Recent rainfall collection drained properly', status: 'pending', notes: '' },
      ],
      lastInspected: '2026-02-15',
      inspectorName: 'Carlos Mendoza',
      priority: 'follow-up',
      lat: 31.3690,
      lng: -103.5430,
    },
    {
      id: 'hse-06',
      sequence: 6,
      inspectionType: 'wellhead-safety-valve',
      location: 'Diamondback 1-1H (High-Pressure Well)',
      padId: 'pad-d',
      arrivalTime: '12:15',
      duration: 50,
      checks: [
        { item: 'Surface safety valve (SSV) function test', status: 'pending', notes: '' },
        { item: 'Subsurface safety valve (SSSV) confirmed set', status: 'pending', notes: '' },
        { item: 'Wellhead pressure rated for max shut-in', status: 'pending', notes: '' },
        { item: 'Wing valve and master valve operation', status: 'pending', notes: '' },
        { item: 'Wellhead corrosion inspection', status: 'pending', notes: '' },
        { item: 'ESD (Emergency Shutdown) system test', status: 'pending', notes: '' },
      ],
      lastInspected: '2026-02-10',
      inspectorName: 'Carlos Mendoza',
      priority: 'urgent',
      lat: 31.3350,
      lng: -103.6800,
    },
  ],
};
