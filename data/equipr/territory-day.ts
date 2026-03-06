export interface RouteStop {
  id: number;
  type: 'primary' | 'opportunity' | 'follow-up' | 'drive-by';
  name: string;
  address: string;
  distance: string; // From previous stop
  driveTime: string;
  reason: string;
  lastVisit?: string;
  lastVisitNotes?: string;
  revenuePotential?: number;
  currentRentals?: number;
  activeContracts?: number;
  aiInsight?: string;
  contactName?: string;
  contactPhone?: string;
  equipmentNeeds?: string[];
  tags?: string[];
}

export interface RouteSummary {
  totalStops: number;
  totalMiles: number;
  totalDriveTime: string;
  revenuePotentialTotal: number;
  optimizedVsNaive: string; // e.g., "42 fewer miles"
  primaryJob: string;
  rep: string;
  date: string;
}

export const ROUTE_SUMMARY: RouteSummary = {
  totalStops: 7,
  totalMiles: 118,
  totalDriveTime: '2h 45m',
  revenuePotentialTotal: 485000,
  optimizedVsNaive: '42 fewer miles, 55 min saved',
  primaryJob: 'ABC Construction — Scottsdale Commercial Build',
  rep: 'Marcus Chen',
  date: 'Wednesday, Feb 26, 2026',
};

export const ROUTE_STOPS: RouteStop[] = [
  {
    id: 1,
    type: 'primary',
    name: 'ABC Construction — Scottsdale Commercial Build',
    address: '8420 E McDowell Rd, Scottsdale, AZ 85257',
    distance: '— (start)',
    driveTime: '22 min from branch',
    reason: 'Primary job site visit — $12M commercial build, Phase 3',
    lastVisit: 'Feb 12, 2026',
    lastVisitNotes: 'Met with site super Dave Torres. They\'re running 2 CAT 320s and a boom lift. Dave mentioned they\'ll need additional aerial equipment for curtain wall installation starting March 10. Competitor SunState quoted them — need to lock rate before they decide.',
    revenuePotential: 180000,
    currentRentals: 3,
    activeContracts: 1,
    aiInsight: 'Dodge data confirms curtain wall phase starts March 10. Window to lock aerial equipment rental: 12 days. SunState\'s nearest branch is 28 miles away — you have the proximity advantage.',
    contactName: 'Dave Torres, Site Super',
    contactPhone: '(480) 555-0147',
    equipmentNeeds: ['JLG 600S Boom Lift', 'Scissor Lifts (3)', 'Material Hoist'],
    tags: ['Dodge Alert', 'Competitive Threat', 'Upsell'],
  },
  {
    id: 2,
    type: 'opportunity',
    name: 'Meridian Homes — Luxury Subdivision',
    address: '7800 E Camelback Rd, Scottsdale, AZ 85251',
    distance: '2.1 mi',
    driveTime: '6 min',
    reason: 'New project alert — 24-lot luxury subdivision just broke ground. You drive right past it.',
    lastVisit: undefined,
    lastVisitNotes: undefined,
    revenuePotential: 95000,
    currentRentals: 0,
    activeContracts: 0,
    aiInsight: 'Permit data shows foundation work starting this week. Meridian Homes rented $62K from you 18 months ago on a similar project in Tempe. They know your equipment.',
    contactName: 'Project office on-site',
    equipmentNeeds: ['Excavators (2)', 'Skid Steers (3)', 'Compactors'],
    tags: ['Dodge Alert', 'Win-Back', 'Drive-By'],
  },
  {
    id: 3,
    type: 'follow-up',
    name: 'Desert Ridge Contractors',
    address: '20910 N Tatum Blvd, Phoenix, AZ 85050',
    distance: '8.4 mi',
    driveTime: '14 min',
    reason: 'Follow up on rate renewal — contract expires March 15. CRM flagged.',
    lastVisit: 'Jan 28, 2026',
    lastVisitNotes: 'Owner Mike Sato was happy with equipment but grumbled about the 8% rate increase. Offered volume discount if they commit to 6-month extension. He said he\'d think about it. Need to close before competitor poaches.',
    revenuePotential: 72000,
    currentRentals: 5,
    activeContracts: 2,
    aiInsight: 'Mike\'s contracts expire in 17 days. He has 2 new jobs starting in April (Dodge data). If you lose him now, you lose $72K/yr PLUS the new project revenue.',
    contactName: 'Mike Sato, Owner',
    contactPhone: '(602) 555-0293',
    equipmentNeeds: ['Renewal: 3 Skid Steers, 2 Excavators'],
    tags: ['CRM Alert', 'Renewal Risk', 'Rate Discussion'],
  },
  {
    id: 4,
    type: 'drive-by',
    name: 'Kiewit — I-17 Widening Project',
    address: 'I-17 & Happy Valley Rd, Phoenix, AZ',
    distance: '5.2 mi',
    driveTime: '10 min',
    reason: 'Active job site — ADOT project transitioning phases. Quick check on equipment condition.',
    lastVisit: 'Feb 19, 2026',
    lastVisitNotes: 'Dropped off replacement hydraulic hoses for Excavator #3. Operator mentioned the compaction phase starts in 3 weeks and they\'ll need rollers. Referred me to procurement contact at Kiewit regional office.',
    revenuePotential: 45000,
    currentRentals: 4,
    activeContracts: 1,
    aiInsight: 'Telematics shows Excavator #2 at 4,890 hours — service due at 5,000. Proactive service visit builds goodwill and protects the contract.',
    contactName: 'Site Office — Ask for Jim',
    contactPhone: '(623) 555-0188',
    equipmentNeeds: ['Rollers (2)', 'Compactors (1)', 'Service: Excavator #2'],
    tags: ['Telematics Alert', 'Phase Transition', 'Upsell'],
  },
  {
    id: 5,
    type: 'opportunity',
    name: 'Valley Solar Farms — New Installation',
    address: '31200 N Cave Creek Rd, Cave Creek, AZ 85331',
    distance: '12.8 mi',
    driveTime: '18 min',
    reason: 'Solar farm project just permitted — only 15 min detour from your route.',
    lastVisit: undefined,
    lastVisitNotes: undefined,
    revenuePotential: 55000,
    currentRentals: 0,
    activeContracts: 0,
    aiInsight: 'Valley Solar is a new player — no rental history with anyone in the market. First mover advantage. They\'ll need trenchers, mini excavators, and telehandlers for panel installation.',
    contactName: 'Office trailer on-site',
    equipmentNeeds: ['Trenchers (2)', 'Mini Excavators', 'Telehandlers (3)'],
    tags: ['Permit Alert', 'New Customer', 'First Mover'],
  },
  {
    id: 6,
    type: 'follow-up',
    name: 'Penta Building Group',
    address: '14850 N Scottsdale Rd, Scottsdale, AZ 85254',
    distance: '9.1 mi',
    driveTime: '15 min',
    reason: 'Proposal sent 5 days ago — no response. Stop by to close.',
    lastVisit: 'Feb 21, 2026',
    lastVisitNotes: 'Presented package deal for their new mixed-use project: $38K/month for 6-month commitment. PM Sarah Kim seemed interested but needed to run it by her VP. She mentioned competitor BlueLine had a similar quote but with older equipment.',
    revenuePotential: 228000,
    currentRentals: 0,
    activeContracts: 0,
    aiInsight: 'Sarah viewed your proposal PDF 3 times in the last 2 days (email tracking). She\'s interested but may be comparing with BlueLine. Show up with updated equipment specs and delivery timeline — that\'s your edge.',
    contactName: 'Sarah Kim, Project Manager',
    contactPhone: '(480) 555-0412',
    equipmentNeeds: ['Boom Lifts (4)', 'Scissor Lifts (6)', 'Telehandlers (2)'],
    tags: ['CRM Alert', 'Proposal Follow-Up', 'Competitive'],
  },
  {
    id: 7,
    type: 'drive-by',
    name: 'Branch Return — Equipment Check',
    address: 'Blue Horizons Equipment Solutions — Scottsdale Branch',
    distance: '6.5 mi',
    driveTime: '12 min',
    reason: 'End of route — check returned equipment, update CRM notes.',
    lastVisit: 'Today',
    lastVisitNotes: undefined,
    revenuePotential: 0,
    aiInsight: '3 units scheduled for return today. Quick yard walkthrough ensures condition is documented before next rental.',
    contactName: 'Branch Manager — Tony',
    tags: ['End of Route'],
  },
];

// Stop type styling
export const STOP_TYPE_META: Record<RouteStop['type'], { label: string; color: string; bgColor: string; icon: string }> = {
  primary: { label: 'Primary Job', color: '#2563EB', bgColor: 'rgba(37,99,235,0.12)', icon: 'MapPin' },
  opportunity: { label: 'Opportunity', color: '#10B981', bgColor: 'rgba(16,185,129,0.12)', icon: 'Sparkles' },
  'follow-up': { label: 'Follow-Up', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)', icon: 'PhoneCall' },
  'drive-by': { label: 'Drive-By', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.12)', icon: 'Eye' },
};

// Data sources powering the route
export const ROUTE_DATA_SOURCES = [
  { name: 'Dodge Construction', records: '3 projects on route' },
  { name: 'CRM History', records: '4 customer records' },
  { name: 'Trackunit Telematics', records: '12 units tracked' },
  { name: 'Municipal Permits', records: '2 new permits' },
  { name: 'Google Maps API', records: 'Real-time traffic' },
  { name: 'Weather', records: 'Clear, 72\u00B0F' },
];
