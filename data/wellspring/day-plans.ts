export type StopType =
  | 'yard-departure'
  | 'producing-well'
  | 'alarm-response'
  | 'tank-battery'
  | 'chemical-injection'
  | 'new-completion'
  | 'permit-site'
  | 'workover'
  | 'drive-by'
  | 'yard-return';

export type DataSource = 'scada' | 'enverus' | 'aries' | 'rrc' | 'weather' | 'maintenance';

export interface AIInsight {
  source: DataSource;
  insight: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FieldAction {
  action: string;
  completed: boolean;
}

export interface Stop {
  id: string;
  sequence: number;
  type: StopType;
  wellId: string | null;
  wellName: string;
  address: string;
  arrivalTime: string;
  duration: number;
  fieldActions: FieldAction[];
  aiInsights: AIInsight[];
  scadaReadings: {
    pressure?: number;
    temperature?: number;
    flowRate?: number;
    status?: string;
  } | null;
  productionData: {
    oilBpd?: number;
    gasMcfd?: number;
    waterCut?: number;
  } | null;
  photoRequired: boolean;
  alarmSeverity: 'critical' | 'warning' | null;
  lat: number;
  lng: number;
}

export interface DayPlan {
  foremanId: string;
  foremanName: string;
  date: string;
  route: string;
  region: string;
  regionName: string;
  stops: Stop[];
  totalMiles: number;
  totalDuration: string;
  truckNumber: string;
}

// ──────────────────────────────────────────────────────────────
// JAKE'S DAY PLAN — PB-EAST, 10 stops
// ──────────────────────────────────────────────────────────────

export const JAKE_DAY_PLAN: DayPlan = {
  foremanId: 'foreman-jake',
  foremanName: 'Jake Thornton',
  date: '2026-03-04',
  route: 'PB-EAST',
  region: 'pb-east',
  regionName: 'Permian Basin East (Reeves County)',
  totalMiles: 67,
  totalDuration: '7h 45m',
  truckNumber: 'PBR-114',
  stops: [
    {
      id: 'jake-01',
      sequence: 1,
      type: 'yard-departure',
      wellId: null,
      wellName: 'Pecos Yard',
      address: '1200 S Eddy St, Pecos, TX 79772',
      arrivalTime: '06:00',
      duration: 30,
      fieldActions: [
        { action: 'Load scale inhibitor (2 drums)', completed: false },
        { action: 'Pre-trip inspection', completed: false },
        { action: 'Sync tablet — download overnight SCADA alerts', completed: false },
      ],
      aiInsights: [
        { source: 'weather', insight: 'High wind advisory after 2 PM — secure loose equipment early', priority: 'medium' },
        { source: 'maintenance', insight: 'Chemical truck PBR-114 PM due in 3 days — schedule on return', priority: 'low' },
      ],
      scadaReadings: null,
      productionData: null,
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.4230,
      lng: -103.4930,
    },
    {
      id: 'jake-02',
      sequence: 2,
      type: 'producing-well',
      wellId: 'M-14',
      wellName: 'Mustang 14-3H',
      address: 'Mustang Pad, County Rd 401, Reeves County',
      arrivalTime: '06:45',
      duration: 40,
      fieldActions: [
        { action: 'Daily gauge reading — casing and tubing pressure', completed: false },
        { action: 'Check pumpjack balance and polish rod', completed: false },
        { action: 'Record tank level (sight glass)', completed: false },
        { action: 'Inspect wellhead for leaks', completed: false },
      ],
      aiInsights: [
        { source: 'maintenance', insight: 'Production up 12% since rod change last Tuesday — new rods bedding in well', priority: 'medium' },
        { source: 'scada', insight: 'Casing pressure stable at 185 psi — within normal range', priority: 'low' },
      ],
      scadaReadings: { pressure: 185, temperature: 142, flowRate: 46, status: 'normal' },
      productionData: { oilBpd: 46, gasMcfd: 84, waterCut: 0.41 },
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.4140,
      lng: -103.4820,
    },
    {
      id: 'jake-03',
      sequence: 3,
      type: 'tank-battery',
      wellId: null,
      wellName: 'Mustang Central Tank Battery',
      address: 'Mustang Pad Central, County Rd 401, Reeves County',
      arrivalTime: '07:30',
      duration: 45,
      fieldActions: [
        { action: 'Dip all 3 tanks — record oil/water heights', completed: false },
        { action: 'Check separator pressure and dump valves', completed: false },
        { action: 'Verify LACT meter calibration', completed: false },
        { action: 'Photograph tank gauge readings', completed: false },
      ],
      aiInsights: [
        { source: 'scada', insight: 'Tank #2 at 78% capacity — schedule hauler by Thursday', priority: 'high' },
        { source: 'aries', insight: 'Oil cut holding at 62% vs 38% water — consistent with decline model', priority: 'low' },
      ],
      scadaReadings: { pressure: 42, temperature: 98, status: 'normal' },
      productionData: null,
      photoRequired: true,
      alarmSeverity: null,
      lat: 31.4130,
      lng: -103.4835,
    },
    {
      id: 'jake-04',
      sequence: 4,
      type: 'alarm-response',
      wellId: 'R-07',
      wellName: 'Rattlesnake 7-1H',
      address: 'Rattlesnake Pad, FM 652, Reeves County',
      arrivalTime: '08:15',
      duration: 50,
      fieldActions: [
        { action: 'Investigate SCADA low-pressure alarm', completed: false },
        { action: 'Check ESP amperage draw', completed: false },
        { action: 'Inspect flowline for leaks or restrictions', completed: false },
        { action: 'Bleed casing if pressure above threshold', completed: false },
      ],
      aiInsights: [
        { source: 'maintenance', insight: 'Similar low-pressure alarm preceded rod part on Mustang 9-2H last month — run dynamometer if persistent', priority: 'high' },
        { source: 'scada', insight: 'Tubing pressure dropped 22 psi in 4 hours — possible parted rod or gas lock', priority: 'high' },
      ],
      scadaReadings: { pressure: 118, temperature: 148, flowRate: 42, status: 'alarm' },
      productionData: { oilBpd: 61, gasMcfd: 115, waterCut: 0.37 },
      photoRequired: true,
      alarmSeverity: 'warning',
      lat: 31.3710,
      lng: -103.5380,
    },
    {
      id: 'jake-05',
      sequence: 5,
      type: 'chemical-injection',
      wellId: 'S-04',
      wellName: 'Sidewinder 22-4H',
      address: 'Sidewinder Pad, County Rd 218, Pecos County',
      arrivalTime: '09:00',
      duration: 35,
      fieldActions: [
        { action: 'Refill scale inhibitor chemical tank', completed: false },
        { action: 'Verify injection pump rate — target 2.5 gal/hr', completed: false },
        { action: 'Sample chemical residual from flow tee', completed: false },
      ],
      aiInsights: [
        { source: 'aries', insight: 'Water cut increasing 0.3%/week — scale risk elevated for next 60 days', priority: 'medium' },
        { source: 'maintenance', insight: 'Chemical pump replaced 45 days ago — check diaphragm wear', priority: 'low' },
      ],
      scadaReadings: { pressure: 210, temperature: 155, flowRate: 82, status: 'normal' },
      productionData: { oilBpd: 82, gasMcfd: 180, waterCut: 0.34 },
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.4450,
      lng: -103.6050,
    },
    {
      id: 'jake-06',
      sequence: 6,
      type: 'producing-well',
      wellId: 'D-06',
      wellName: 'Diamondback 6-2H',
      address: 'Diamondback Pad, FM 1776, Pecos County',
      arrivalTime: '09:45',
      duration: 40,
      fieldActions: [
        { action: 'Gas lift valve pressure check', completed: false },
        { action: 'Record casing and tubing pressure', completed: false },
        { action: 'Check gas lift injection rate on meter', completed: false },
      ],
      aiInsights: [
        { source: 'enverus', insight: 'XTO permitted 3 new wells in adjacent section 22 — potential frac hit risk in 6 months', priority: 'medium' },
        { source: 'scada', insight: 'ESP running at 52 Hz — optimal for current inflow', priority: 'low' },
      ],
      scadaReadings: { pressure: 245, temperature: 162, flowRate: 138, status: 'normal' },
      productionData: { oilBpd: 138, gasMcfd: 315, waterCut: 0.27 },
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.3380,
      lng: -103.6750,
    },
    {
      id: 'jake-07',
      sequence: 7,
      type: 'new-completion',
      wellId: 'S-11',
      wellName: 'Copperhead 18-1H',
      address: 'Copperhead Lease, County Rd 310, Pecos County',
      arrivalTime: '10:30',
      duration: 60,
      fieldActions: [
        { action: 'Record flowback volumes — oil, gas, water', completed: false },
        { action: 'Measure choke size and flowing pressure', completed: false },
        { action: 'Collect fluid sample for lab', completed: false },
        { action: 'Run IP test — 24-hour rate projection', completed: false },
        { action: 'Photograph flowback equipment', completed: false },
      ],
      aiInsights: [
        { source: 'aries', insight: 'Zone B Wolfcamp flowing 40% above type curve — potential 800 MBOE EUR upgrade', priority: 'high' },
        { source: 'rrc', insight: 'H-10 completion report due to RRC by March 15 — gather final data today', priority: 'medium' },
      ],
      scadaReadings: { pressure: 2840, temperature: 178, flowRate: 165, status: 'flowback' },
      productionData: { oilBpd: 165, gasMcfd: 380, waterCut: 0.25 },
      photoRequired: true,
      alarmSeverity: null,
      lat: 31.4520,
      lng: -103.6200,
    },
    {
      id: 'jake-08',
      sequence: 8,
      type: 'workover',
      wellId: 'R-09',
      wellName: 'Sidewinder 22-2H',
      address: 'Sidewinder Pad South, County Rd 218, Pecos County',
      arrivalTime: '11:15',
      duration: 40,
      fieldActions: [
        { action: 'Check workover rig progress — rod pump conversion from ESP', completed: false },
        { action: 'Verify tubing tally vs program', completed: false },
        { action: 'Review BHA with rig supervisor', completed: false },
      ],
      aiInsights: [
        { source: 'maintenance', insight: 'Workover on budget ($142K of $165K approved) — Friday completion target', priority: 'medium' },
        { source: 'aries', insight: 'Rod pump expected to recover 85% of ESP rate at 60% lower LOE', priority: 'low' },
      ],
      scadaReadings: null,
      productionData: null,
      photoRequired: true,
      alarmSeverity: null,
      lat: 31.4400,
      lng: -103.6120,
    },
    {
      id: 'jake-09',
      sequence: 9,
      type: 'drive-by',
      wellId: null,
      wellName: 'Inactive Lease (County Rd 302)',
      address: 'County Rd 302 & FM 1776, Pecos County',
      arrivalTime: '12:00',
      duration: 15,
      fieldActions: [
        { action: 'Observe competitor rig activity', completed: false },
        { action: 'Note rig contractor and direction of operations', completed: false },
      ],
      aiInsights: [
        { source: 'enverus', insight: 'New Cimarex permit filed for Section 18, Block 55, T3S — 2-mile lateral targeting 2nd Bone Spring', priority: 'high' },
        { source: 'rrc', insight: 'RRC permit #08-38742 approved Feb 28 — expect spud within 30 days', priority: 'medium' },
      ],
      scadaReadings: null,
      productionData: null,
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.3550,
      lng: -103.6500,
    },
    {
      id: 'jake-10',
      sequence: 10,
      type: 'yard-return',
      wellId: null,
      wellName: 'Pecos Yard',
      address: '1200 S Eddy St, Pecos, TX 79772',
      arrivalTime: '12:45',
      duration: 45,
      fieldActions: [
        { action: 'Sync field data to SCADA system', completed: false },
        { action: 'File daily production reports', completed: false },
        { action: 'Submit alarm investigation notes', completed: false },
        { action: 'Update chemical inventory log', completed: false },
      ],
      aiInsights: [
        { source: 'maintenance', insight: 'Rattlesnake 7-1H alarm requires follow-up — recommend dyno test tomorrow', priority: 'high' },
      ],
      scadaReadings: null,
      productionData: null,
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.4230,
      lng: -103.4930,
    },
  ],
};

// ──────────────────────────────────────────────────────────────
// MARIA'S DAY PLAN — PB-WEST, 8 stops
// ──────────────────────────────────────────────────────────────

export const MARIA_DAY_PLAN: DayPlan = {
  foremanId: 'foreman-maria',
  foremanName: 'Maria Vasquez',
  date: '2026-03-04',
  route: 'PB-WEST',
  region: 'pb-west',
  regionName: 'Permian Basin West (Pecos County)',
  totalMiles: 52,
  totalDuration: '6h 30m',
  truckNumber: 'PBR-108',
  stops: [
    {
      id: 'maria-01',
      sequence: 1,
      type: 'yard-departure',
      wellId: null,
      wellName: 'Fort Stockton Yard',
      address: '800 W Dickinson Blvd, Fort Stockton, TX 79735',
      arrivalTime: '06:00',
      duration: 25,
      fieldActions: [
        { action: 'Load corrosion inhibitor (1 drum)', completed: false },
        { action: 'Pre-trip inspection', completed: false },
        { action: 'Download overnight SCADA summary', completed: false },
      ],
      aiInsights: [
        { source: 'weather', insight: 'Clear skies, 42°F at departure — roads dry', priority: 'low' },
      ],
      scadaReadings: null,
      productionData: null,
      photoRequired: false,
      alarmSeverity: null,
      lat: 30.8900,
      lng: -102.8790,
    },
    {
      id: 'maria-02',
      sequence: 2,
      type: 'tank-battery',
      wellId: null,
      wellName: 'Sidewinder West Tank Battery',
      address: 'Sidewinder Pad West, FM 1053, Pecos County',
      arrivalTime: '06:45',
      duration: 45,
      fieldActions: [
        { action: 'Dip 2 production tanks and 1 water tank', completed: false },
        { action: 'Check LACT meter totalizer reading', completed: false },
        { action: 'Verify separator dump cycle', completed: false },
        { action: 'Photograph gauge readings', completed: false },
      ],
      aiInsights: [
        { source: 'scada', insight: 'Water tank at 82% — hauler dispatch needed today', priority: 'high' },
        { source: 'aries', insight: 'Pad producing 5% above monthly forecast — strong performance', priority: 'low' },
      ],
      scadaReadings: { pressure: 38, temperature: 95, status: 'normal' },
      productionData: null,
      photoRequired: true,
      alarmSeverity: null,
      lat: 31.4510,
      lng: -103.6250,
    },
    {
      id: 'maria-03',
      sequence: 3,
      type: 'producing-well',
      wellId: 'S-05',
      wellName: 'Sidewinder 5-2H',
      address: 'Sidewinder Pad, County Rd 218, Pecos County',
      arrivalTime: '07:35',
      duration: 35,
      fieldActions: [
        { action: 'Record tubing and casing pressures', completed: false },
        { action: 'Check gas lift injection rate', completed: false },
        { action: 'Verify SCADA telemetry vs field gauge', completed: false },
      ],
      aiInsights: [
        { source: 'scada', insight: 'Gas lift rate optimal at 450 Mcfd injection — no adjustment needed', priority: 'low' },
        { source: 'maintenance', insight: 'Next preventive maintenance due in 12 days', priority: 'low' },
      ],
      scadaReadings: { pressure: 215, temperature: 158, flowRate: 98, status: 'normal' },
      productionData: { oilBpd: 98, gasMcfd: 218, waterCut: 0.34 },
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.4480,
      lng: -103.6100,
    },
    {
      id: 'maria-04',
      sequence: 4,
      type: 'alarm-response',
      wellId: 'D-08',
      wellName: 'Diamondback 8-2H',
      address: 'Diamondback Pad South, FM 1776, Pecos County',
      arrivalTime: '08:20',
      duration: 55,
      fieldActions: [
        { action: 'Investigate ESP high-temperature alarm', completed: false },
        { action: 'Check VSD frequency and amperage', completed: false },
        { action: 'Inspect surface electrical connections', completed: false },
        { action: 'Measure fluid level with echometer', completed: false },
      ],
      aiInsights: [
        { source: 'scada', insight: 'ESP motor temperature 285°F — 15°F above normal, trending up over 48 hours', priority: 'high' },
        { source: 'maintenance', insight: 'ESP installed 4 months ago — check for sand ingestion or gas interference', priority: 'high' },
      ],
      scadaReadings: { pressure: 230, temperature: 285, flowRate: 118, status: 'alarm' },
      productionData: { oilBpd: 132, gasMcfd: 302, waterCut: 0.27 },
      photoRequired: true,
      alarmSeverity: 'warning',
      lat: 31.3320,
      lng: -103.6850,
    },
    {
      id: 'maria-05',
      sequence: 5,
      type: 'chemical-injection',
      wellId: 'D-04',
      wellName: 'Diamondback 4-2H',
      address: 'Diamondback Pad, FM 1776, Pecos County',
      arrivalTime: '09:20',
      duration: 30,
      fieldActions: [
        { action: 'Refill corrosion inhibitor tank', completed: false },
        { action: 'Verify injection rate — target 1.8 gal/hr', completed: false },
        { action: 'Inspect injection point for buildup', completed: false },
      ],
      aiInsights: [
        { source: 'aries', insight: 'CO2 content 4.2% — corrosion risk moderate, maintain current treatment', priority: 'medium' },
      ],
      scadaReadings: { pressure: 240, temperature: 160, flowRate: 145, status: 'normal' },
      productionData: { oilBpd: 145, gasMcfd: 330, waterCut: 0.28 },
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.3370,
      lng: -103.6780,
    },
    {
      id: 'maria-06',
      sequence: 6,
      type: 'producing-well',
      wellId: 'D-01',
      wellName: 'Diamondback 1-1H',
      address: 'Diamondback Pad North, FM 1776, Pecos County',
      arrivalTime: '10:00',
      duration: 40,
      fieldActions: [
        { action: 'Record flowing wellhead pressure and temperature', completed: false },
        { action: 'Adjust choke — currently 22/64"', completed: false },
        { action: 'Check flowline erosion probe reading', completed: false },
      ],
      aiInsights: [
        { source: 'aries', insight: 'Top producer on Diamondback pad — 180 bopd, tracking 950 MBOE EUR', priority: 'low' },
        { source: 'enverus', insight: 'Offset operator (Pioneer) reporting strong Wolfcamp A results in same section', priority: 'medium' },
      ],
      scadaReadings: { pressure: 265, temperature: 168, flowRate: 180, status: 'normal' },
      productionData: { oilBpd: 180, gasMcfd: 420, waterCut: 0.22 },
      photoRequired: false,
      alarmSeverity: null,
      lat: 31.3350,
      lng: -103.6800,
    },
    {
      id: 'maria-07',
      sequence: 7,
      type: 'permit-site',
      wellId: null,
      wellName: 'PBR Federal 24-1H (Proposed)',
      address: 'Section 24, Block 56, T3S, Pecos County',
      arrivalTime: '10:50',
      duration: 30,
      fieldActions: [
        { action: 'Survey proposed well pad location', completed: false },
        { action: 'Check for environmental features (arroyos, habitat)', completed: false },
        { action: 'Photograph site from 4 compass points', completed: false },
      ],
      aiInsights: [
        { source: 'rrc', insight: 'BLM APD submitted Feb 10 — expected approval by April', priority: 'medium' },
        { source: 'enverus', insight: 'Federal lease bonus $4,200/acre — competitive with state offerings', priority: 'low' },
      ],
      scadaReadings: null,
      productionData: null,
      photoRequired: true,
      alarmSeverity: null,
      lat: 31.3100,
      lng: -103.7100,
    },
    {
      id: 'maria-08',
      sequence: 8,
      type: 'yard-return',
      wellId: null,
      wellName: 'Fort Stockton Yard',
      address: '800 W Dickinson Blvd, Fort Stockton, TX 79735',
      arrivalTime: '11:30',
      duration: 30,
      fieldActions: [
        { action: 'Upload field data and photos', completed: false },
        { action: 'File daily production reports', completed: false },
        { action: 'Log ESP alarm investigation — recommend pulling unit if temp stays above 280°F', completed: false },
      ],
      aiInsights: [
        { source: 'maintenance', insight: 'Diamondback 8-2H ESP requires monitoring — set 4-hour SCADA check interval', priority: 'high' },
      ],
      scadaReadings: null,
      productionData: null,
      photoRequired: false,
      alarmSeverity: null,
      lat: 30.8900,
      lng: -102.8790,
    },
  ],
};

export const DAY_PLANS: DayPlan[] = [JAKE_DAY_PLAN, MARIA_DAY_PLAN];
