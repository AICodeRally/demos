// Training data: courses, completions, learner progress

export type CourseCategory = 'Fundraising Fundamentals' | 'Major Gifts' | 'Board Development' | 'Campaign Strategy' | 'Donor Relations' | 'Operations';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseFormat = 'Workshop' | 'Seminar' | 'Webinar' | 'Coaching';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  format: CourseFormat;
  duration: string;
  instructor: string;
  description: string;
  modules: { title: string; lessons: string[]; duration: string }[];
  enrollmentCount: number;
  rating: number;
}

export const COURSES: Course[] = [
  {
    id: 'course-1', title: 'Introduction to Fundraising', category: 'Fundraising Fundamentals', level: 'Beginner', format: 'Webinar', duration: '4 hours', instructor: 'Sarah Kim', description: 'Foundation course covering the fundraising lifecycle, donor psychology, and gift cultivation basics.',
    modules: [
      { title: 'The Fundraising Landscape', lessons: ['History of Philanthropy', 'Giving Trends 2025-2026', 'Fundraising Ethics'], duration: '60 min' },
      { title: 'Understanding Donors', lessons: ['Donor Motivations', 'Generational Giving Patterns', 'Donor Lifecycle'], duration: '60 min' },
      { title: 'The Ask', lessons: ['Preparing for Solicitation', 'Making the Ask', 'Handling Objections'], duration: '60 min' },
      { title: 'Stewardship Basics', lessons: ['Thank You Best Practices', 'Impact Reporting', 'Retention Strategies'], duration: '60 min' },
    ],
    enrollmentCount: 156, rating: 4.8,
  },
  {
    id: 'course-2', title: 'Major Gift Officer Certification', category: 'Major Gifts', level: 'Advanced', format: 'Workshop', duration: '16 hours', instructor: 'Jennifer Blake', description: 'Intensive certification program for major gift officers covering portfolio management, moves management, and closing strategies.',
    modules: [
      { title: 'Portfolio Management', lessons: ['Building Your Portfolio', 'Prioritization Framework', 'Activity Metrics'], duration: '4 hours' },
      { title: 'Prospect Research', lessons: ['Wealth Screening', 'Affinity Indicators', 'Capacity vs Inclination'], duration: '4 hours' },
      { title: 'Cultivation Strategies', lessons: ['Engagement Touchpoints', 'Peer-to-Peer Cultivation', 'Event Strategy'], duration: '4 hours' },
      { title: 'Solicitation & Closing', lessons: ['The Ask Meeting', 'Negotiation Techniques', 'Gift Agreements'], duration: '4 hours' },
    ],
    enrollmentCount: 48, rating: 4.9,
  },
  {
    id: 'course-3', title: 'Board Fundraising Bootcamp', category: 'Board Development', level: 'Beginner', format: 'Workshop', duration: '6 hours', instructor: 'Marcus Rivera', description: 'Hands-on workshop designed for board members who are new to fundraising or uncomfortable with the ask.',
    modules: [
      { title: 'Why Board Members Must Fundraise', lessons: ['Fiduciary Duty', 'Your Unique Value', 'Overcoming Fear'], duration: '2 hours' },
      { title: 'Finding Your Style', lessons: ['Types of Asks', 'Your Personal Story', 'Practice Sessions'], duration: '2 hours' },
      { title: 'Taking Action', lessons: ['Your 90-Day Plan', 'Accountability Partners', 'Celebrating Wins'], duration: '2 hours' },
    ],
    enrollmentCount: 92, rating: 4.7,
  },
  {
    id: 'course-4', title: 'Capital Campaign Masterclass', category: 'Campaign Strategy', level: 'Advanced', format: 'Seminar', duration: '12 hours', instructor: 'Jennifer Blake', description: 'Expert-level seminar on planning, executing, and completing successful capital campaigns.',
    modules: [
      { title: 'Campaign Planning', lessons: ['Feasibility Study Design', 'Gift Range Chart', 'Timeline & Milestones'], duration: '3 hours' },
      { title: 'Leadership Phase', lessons: ['Campaign Committee', 'Lead Gift Solicitation', 'Quiet Phase Management'], duration: '3 hours' },
      { title: 'Public Phase', lessons: ['Community Engagement', 'Marketing & Communications', 'Challenge Gifts'], duration: '3 hours' },
      { title: 'Campaign Completion', lessons: ['Closing Strategies', 'Celebration & Recognition', 'Post-Campaign Planning'], duration: '3 hours' },
    ],
    enrollmentCount: 34, rating: 4.9,
  },
  {
    id: 'course-5', title: 'Donor Stewardship Excellence', category: 'Donor Relations', level: 'Intermediate', format: 'Webinar', duration: '3 hours', instructor: 'Sarah Kim', description: 'Best practices for retaining donors through meaningful stewardship and impact communication.',
    modules: [
      { title: 'Stewardship Planning', lessons: ['Tiered Stewardship Matrix', 'Automation vs Personal Touch', 'Budget Planning'], duration: '60 min' },
      { title: 'Impact Communication', lessons: ['Storytelling Techniques', 'Data Visualization for Donors', 'Annual Impact Reports'], duration: '60 min' },
      { title: 'Retention Strategies', lessons: ['Lapsed Donor Recovery', 'Upgrade Pathways', 'Monthly Giving Programs'], duration: '60 min' },
    ],
    enrollmentCount: 78, rating: 4.6,
  },
  {
    id: 'course-6', title: 'Fundraising Operations & CRM', category: 'Operations', level: 'Intermediate', format: 'Workshop', duration: '8 hours', instructor: 'Carlos Mendez', description: 'Hands-on training in donor database management, gift processing, and operational best practices.',
    modules: [
      { title: 'CRM Fundamentals', lessons: ['System Selection', 'Data Architecture', 'Migration Planning'], duration: '2 hours' },
      { title: 'Gift Processing', lessons: ['Receipt Workflows', 'Acknowledgment Standards', 'Compliance'], duration: '2 hours' },
      { title: 'Reporting & Analytics', lessons: ['KPI Dashboards', 'Custom Reports', 'Board Reporting'], duration: '2 hours' },
      { title: 'Data Hygiene', lessons: ['Deduplication', 'Address Validation', 'NCOA Updates'], duration: '2 hours' },
    ],
    enrollmentCount: 65, rating: 4.5,
  },
  {
    id: 'course-7', title: 'Annual Fund Strategy', category: 'Fundraising Fundamentals', level: 'Intermediate', format: 'Seminar', duration: '6 hours', instructor: 'Sarah Kim', description: 'Comprehensive annual fund planning including direct mail, digital, events, and personal solicitation.',
    modules: [
      { title: 'Annual Fund Planning', lessons: ['Calendar Development', 'Segmentation Strategy', 'Budget Allocation'], duration: '2 hours' },
      { title: 'Multi-Channel Execution', lessons: ['Direct Mail', 'Email & Digital', 'Social Media Giving'], duration: '2 hours' },
      { title: 'Measurement & Optimization', lessons: ['Response Rate Analysis', 'ROI by Channel', 'Year-over-Year Growth'], duration: '2 hours' },
    ],
    enrollmentCount: 87, rating: 4.7,
  },
  {
    id: 'course-8', title: 'Planned Giving Foundations', category: 'Major Gifts', level: 'Intermediate', format: 'Webinar', duration: '4 hours', instructor: 'Thomas Park', description: 'Introduction to planned giving vehicles, marketing approaches, and legacy society development.',
    modules: [
      { title: 'Planned Giving Vehicles', lessons: ['Bequests', 'Charitable Gift Annuities', 'Charitable Remainder Trusts'], duration: '90 min' },
      { title: 'Marketing Planned Giving', lessons: ['Identifying Prospects', 'Conversation Starters', 'Professional Advisor Partnerships'], duration: '75 min' },
      { title: 'Legacy Society', lessons: ['Program Design', 'Recognition & Events', 'Tracking & Reporting'], duration: '75 min' },
    ],
    enrollmentCount: 42, rating: 4.4,
  },
];

export interface Completion {
  id: string;
  courseId: string;
  courseTitle: string;
  learnerName: string;
  learnerOrg: string;
  completedDate: string;
  score: number;
  certificateIssued: boolean;
}

export const COMPLETIONS: Completion[] = [
  { id: 'comp-1', courseId: 'course-1', courseTitle: 'Introduction to Fundraising', learnerName: 'Maria Gonzalez', learnerOrg: 'Hope Springs Foundation', completedDate: '2026-03-10', score: 94, certificateIssued: true },
  { id: 'comp-2', courseId: 'course-3', courseTitle: 'Board Fundraising Bootcamp', learnerName: 'Robert Williams', learnerOrg: 'Mountain View Academy', completedDate: '2026-03-08', score: 88, certificateIssued: true },
  { id: 'comp-3', courseId: 'course-5', courseTitle: 'Donor Stewardship Excellence', learnerName: 'Angela Brooks', learnerOrg: 'SafeHaven Social Services', completedDate: '2026-03-05', score: 91, certificateIssued: true },
  { id: 'comp-4', courseId: 'course-1', courseTitle: 'Introduction to Fundraising', learnerName: 'Rev. Karen Foster', learnerOrg: 'Unity Church Network', completedDate: '2026-03-02', score: 87, certificateIssued: true },
  { id: 'comp-5', courseId: 'course-7', courseTitle: 'Annual Fund Strategy', learnerName: 'Lisa Chang', learnerOrg: 'Green Valley Community Foundation', completedDate: '2026-02-28', score: 92, certificateIssued: true },
  { id: 'comp-6', courseId: 'course-2', courseTitle: 'Major Gift Officer Certification', learnerName: 'Diana Reeves', learnerOrg: 'TPPG (Internal)', completedDate: '2026-02-25', score: 96, certificateIssued: true },
  { id: 'comp-7', courseId: 'course-6', courseTitle: 'Fundraising Operations & CRM', learnerName: 'Sarah Mitchell', learnerOrg: 'Heritage Arts Collective', completedDate: '2026-02-20', score: 85, certificateIssued: true },
  { id: 'comp-8', courseId: 'course-4', courseTitle: 'Capital Campaign Masterclass', learnerName: 'Dr. James Chen', learnerOrg: 'Riverside Health Alliance', completedDate: '2026-02-15', score: 93, certificateIssued: true },
];

export const TRAINING_KPIS = {
  totalEnrollments: 602,
  completionRate: 78,
  avgSatisfaction: 4.7,
  certificatesIssued: 234,
};
