export interface MinistryTeam {
  id: string;
  name: string;
  leader: string;
  memberCount: number;
  volunteerHours: number;
  description: string;
  meetingSchedule: string;
  color: string;
}

export interface VolunteerEntry {
  id: string;
  name: string;
  hours: number;
  team: string;
  role: string;
}

export interface TrainingRecord {
  id: string;
  name: string;
  certification: string;
  completedDate: string;
  expiresDate: string;
  status: 'current' | 'expiring' | 'expired';
}

export const ministryTeams: MinistryTeam[] = [
  {
    id: 'mt001',
    name: 'Worship Ministry',
    leader: 'Jason Scott',
    memberCount: 45,
    volunteerHours: 520,
    description: 'Leads congregational worship through music, technical support, and creative arts',
    meetingSchedule: 'Wednesday 7:00 PM',
    color: '#2563EB',
  },
  {
    id: 'mt002',
    name: "Children's Ministry",
    leader: 'Laura Scott',
    memberCount: 38,
    volunteerHours: 480,
    description: 'Provides spiritual formation and care for children birth through 5th grade',
    meetingSchedule: 'Monthly - 1st Tuesday 7:00 PM',
    color: '#7C3AED',
  },
  {
    id: 'mt003',
    name: 'Youth Ministry',
    leader: 'Thomas White',
    memberCount: 22,
    volunteerHours: 340,
    description: 'Disciples middle school and high school students through programs and mentoring',
    meetingSchedule: 'Monthly - 2nd Sunday 2:00 PM',
    color: '#059669',
  },
  {
    id: 'mt004',
    name: 'Outreach Ministry',
    leader: 'Daniel Martinez',
    memberCount: 30,
    volunteerHours: 385,
    description: 'Engages the local community through service projects and evangelism',
    meetingSchedule: 'Monthly - 3rd Thursday 7:00 PM',
    color: '#D97706',
  },
  {
    id: 'mt005',
    name: 'Missions Team',
    leader: 'Joshua Robinson',
    memberCount: 18,
    volunteerHours: 290,
    description: 'Coordinates local and global mission partnerships and trips',
    meetingSchedule: 'Quarterly - 2nd Saturday 9:00 AM',
    color: '#DC2626',
  },
  {
    id: 'mt006',
    name: 'Small Groups Ministry',
    leader: 'Amanda Robinson',
    memberCount: 25,
    volunteerHours: 310,
    description: 'Facilitates connection and discipleship through home-based groups',
    meetingSchedule: 'Monthly - Last Tuesday 7:00 PM',
    color: '#0891B2',
  },
  {
    id: 'mt007',
    name: 'Hospitality Team',
    leader: 'Michelle Martinez',
    memberCount: 32,
    volunteerHours: 395,
    description: 'Creates welcoming environments through greeters, ushers, and refreshments',
    meetingSchedule: 'Bi-monthly - 1st Sunday 12:30 PM',
    color: '#C026D3',
  },
  {
    id: 'mt008',
    name: 'Deacons',
    leader: 'David Williams',
    memberCount: 12,
    volunteerHours: 180,
    description: 'Provides pastoral care, benevolence support, and practical ministry',
    meetingSchedule: 'Monthly - 3rd Thursday 6:00 PM',
    color: '#65A30D',
  },
  {
    id: 'mt009',
    name: 'Elder Board',
    leader: 'Robert Anderson',
    memberCount: 8,
    volunteerHours: 220,
    description: 'Provides spiritual oversight, teaching, and strategic leadership',
    meetingSchedule: 'Monthly - 4th Thursday 7:00 PM',
    color: '#EA580C',
  },
  {
    id: 'mt010',
    name: 'Tech & Media Team',
    leader: 'Ryan Young',
    memberCount: 15,
    volunteerHours: 280,
    description: 'Operates sound, video, lighting, and livestream for services and events',
    meetingSchedule: 'As needed for services',
    color: '#7E22CE',
  },
];

export const volunteerLeaderboard: VolunteerEntry[] = [
  { id: 'v001', name: 'Laura Scott', hours: 142, team: "Children's Ministry", role: 'Director' },
  { id: 'v002', name: 'Jason Scott', hours: 136, team: 'Worship Ministry', role: 'Worship Leader' },
  { id: 'v003', name: 'Thomas White', hours: 128, team: 'Youth Ministry', role: 'Youth Pastor' },
  { id: 'v004', name: 'Michelle Martinez', hours: 98, team: 'Hospitality Team', role: 'Coordinator' },
  { id: 'v005', name: 'Amanda Robinson', hours: 94, team: 'Small Groups Ministry', role: 'Director' },
  { id: 'v006', name: 'Daniel Martinez', hours: 89, team: 'Outreach Ministry', role: 'Leader' },
  { id: 'v007', name: 'Ryan Young', hours: 85, team: 'Tech & Media Team', role: 'Tech Director' },
  { id: 'v008', name: 'Joshua Robinson', hours: 78, team: 'Missions Team', role: 'Missions Director' },
  { id: 'v009', name: 'Sarah Johnson', hours: 72, team: "Children's Ministry", role: 'Teacher' },
  { id: 'v010', name: 'Elizabeth White', hours: 68, team: "Women's Ministry", role: 'Coordinator' },
  { id: 'v011', name: 'David Williams', hours: 65, team: 'Deacons', role: 'Chairman' },
  { id: 'v012', name: 'Robert Anderson', hours: 62, team: 'Elder Board', role: 'Chairman' },
  { id: 'v013', name: 'Nicole Young', hours: 58, team: 'Worship Ministry', role: 'Vocalist' },
  { id: 'v014', name: 'Patricia Anderson', hours: 54, team: 'Hospitality Team', role: 'Greeter' },
  { id: 'v015', name: 'Rebecca Nelson', hours: 51, team: "Children's Ministry", role: 'Assistant' },
];

export const trainingRecords: TrainingRecord[] = [
  {
    id: 'tr001',
    name: 'Laura Scott',
    certification: 'Child Protection Training',
    completedDate: '2025-11-15',
    expiresDate: '2027-11-15',
    status: 'current',
  },
  {
    id: 'tr002',
    name: 'Jason Scott',
    certification: 'Worship Leader Certification',
    completedDate: '2024-06-20',
    expiresDate: '2026-06-20',
    status: 'current',
  },
  {
    id: 'tr003',
    name: 'Thomas White',
    certification: 'Youth Worker Safety',
    completedDate: '2025-09-10',
    expiresDate: '2027-09-10',
    status: 'current',
  },
  {
    id: 'tr004',
    name: 'Sarah Johnson',
    certification: 'Child Protection Training',
    completedDate: '2025-11-15',
    expiresDate: '2027-11-15',
    status: 'current',
  },
  {
    id: 'tr005',
    name: 'Daniel Martinez',
    certification: 'First Aid & CPR',
    completedDate: '2024-03-22',
    expiresDate: '2026-03-22',
    status: 'expiring',
  },
  {
    id: 'tr006',
    name: 'Michelle Martinez',
    certification: 'Food Handler Certification',
    completedDate: '2023-08-15',
    expiresDate: '2026-08-15',
    status: 'current',
  },
  {
    id: 'tr007',
    name: 'Amanda Robinson',
    certification: 'Small Group Leader Training',
    completedDate: '2025-01-10',
    expiresDate: '2027-01-10',
    status: 'current',
  },
  {
    id: 'tr008',
    name: 'Joshua Robinson',
    certification: 'Missions Leadership Training',
    completedDate: '2024-05-18',
    expiresDate: '2026-05-18',
    status: 'current',
  },
  {
    id: 'tr009',
    name: 'David Williams',
    certification: 'Deacon Training',
    completedDate: '2024-02-28',
    expiresDate: '2026-02-28',
    status: 'expiring',
  },
  {
    id: 'tr010',
    name: 'Robert Anderson',
    certification: 'Elder Leadership Training',
    completedDate: '2024-01-15',
    expiresDate: '2027-01-15',
    status: 'current',
  },
  {
    id: 'tr011',
    name: 'Ryan Young',
    certification: 'Audio/Visual Technical Training',
    completedDate: '2025-04-12',
    expiresDate: '2027-04-12',
    status: 'current',
  },
  {
    id: 'tr012',
    name: 'Elizabeth White',
    certification: 'Child Protection Training',
    completedDate: '2025-11-15',
    expiresDate: '2027-11-15',
    status: 'current',
  },
  {
    id: 'tr013',
    name: 'Nicole Young',
    certification: 'Vocal Performance Training',
    completedDate: '2024-09-08',
    expiresDate: '2026-09-08',
    status: 'current',
  },
  {
    id: 'tr014',
    name: 'Patricia Anderson',
    certification: 'First Aid & CPR',
    completedDate: '2023-12-01',
    expiresDate: '2025-12-01',
    status: 'expired',
  },
  {
    id: 'tr015',
    name: 'Rebecca Nelson',
    certification: 'Child Protection Training',
    completedDate: '2025-11-15',
    expiresDate: '2027-11-15',
    status: 'current',
  },
  {
    id: 'tr016',
    name: 'Carlos Garcia',
    certification: 'Usher Training',
    completedDate: '2025-02-20',
    expiresDate: '2027-02-20',
    status: 'current',
  },
  {
    id: 'tr017',
    name: 'Maria Garcia',
    certification: 'Nursery Volunteer Training',
    completedDate: '2025-10-05',
    expiresDate: '2027-10-05',
    status: 'current',
  },
  {
    id: 'tr018',
    name: 'Christopher Harris',
    certification: 'Security Team Training',
    completedDate: '2025-07-14',
    expiresDate: '2027-07-14',
    status: 'current',
  },
  {
    id: 'tr019',
    name: 'Jessica Harris',
    certification: 'Grief Support Facilitator',
    completedDate: '2024-11-20',
    expiresDate: '2026-11-20',
    status: 'current',
  },
  {
    id: 'tr020',
    name: 'Nathan Baker',
    certification: 'Building Security Training',
    completedDate: '2025-06-30',
    expiresDate: '2027-06-30',
    status: 'current',
  },
];

export const ministryStats = {
  totalVolunteers: 487,
  totalHoursMonthly: 3240,
  activeTeams: 10,
  certificationsCurrent: 156,
};
