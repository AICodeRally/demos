export interface PrayerRequest {
  id: string;
  author: string;
  request: string;
  date: string;
  category: 'health' | 'family' | 'guidance' | 'gratitude' | 'community';
  prayerCount: number;
  isAnonymous: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  priority: 'urgent' | 'normal' | 'info';
  audience: 'all' | 'staff' | 'volunteers' | 'youth';
}

export interface EmailCampaign {
  id: string;
  subject: string;
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
}

export const prayerRequests: PrayerRequest[] = [
  {
    id: 'pr001',
    author: 'Sarah Johnson',
    request: 'Praying for healing for my father who is recovering from surgery. He is doing well but needs strength for rehabilitation.',
    date: '2026-02-17',
    category: 'health',
    prayerCount: 47,
    isAnonymous: false,
  },
  {
    id: 'pr002',
    author: 'Anonymous',
    request: 'Please pray for guidance as I make an important career decision that will affect my family.',
    date: '2026-02-16',
    category: 'guidance',
    prayerCount: 32,
    isAnonymous: true,
  },
  {
    id: 'pr003',
    author: 'Maria Garcia',
    request: 'Grateful for God\'s provision in our lives. We just received wonderful news about my daughter\'s college acceptance!',
    date: '2026-02-16',
    category: 'gratitude',
    prayerCount: 58,
    isAnonymous: false,
  },
  {
    id: 'pr004',
    author: 'David Williams',
    request: 'Prayers for my wife Jennifer as she undergoes tests for a health concern. Trusting God for peace and good results.',
    date: '2026-02-15',
    category: 'health',
    prayerCount: 73,
    isAnonymous: false,
  },
  {
    id: 'pr005',
    author: 'Anonymous',
    request: 'Our marriage is going through a difficult season. Please pray for healing and restoration.',
    date: '2026-02-15',
    category: 'family',
    prayerCount: 42,
    isAnonymous: true,
  },
  {
    id: 'pr006',
    author: 'Thomas White',
    request: 'Praying for our youth mission trip this summer. That God would prepare hearts and provide financial support.',
    date: '2026-02-14',
    category: 'community',
    prayerCount: 51,
    isAnonymous: false,
  },
  {
    id: 'pr007',
    author: 'Patricia Anderson',
    request: 'Thankful for 30 years of marriage! God has been so faithful to us through every season.',
    date: '2026-02-14',
    category: 'gratitude',
    prayerCount: 89,
    isAnonymous: false,
  },
  {
    id: 'pr008',
    author: 'Joshua Robinson',
    request: 'Wisdom needed for church leadership as we plan for the new ministry year and make important decisions.',
    date: '2026-02-13',
    category: 'guidance',
    prayerCount: 38,
    isAnonymous: false,
  },
  {
    id: 'pr009',
    author: 'Anonymous',
    request: 'Struggling with anxiety and fear. Please pray for God\'s peace and presence in my life.',
    date: '2026-02-13',
    category: 'health',
    prayerCount: 62,
    isAnonymous: true,
  },
  {
    id: 'pr010',
    author: 'Michelle Martinez',
    request: 'Prayers for the family of Mrs. Henderson who passed away this week. May they feel God\'s comfort.',
    date: '2026-02-12',
    category: 'family',
    prayerCount: 94,
    isAnonymous: false,
  },
  {
    id: 'pr011',
    author: 'Kevin Lee',
    request: 'Pray for my job search. I was recently laid off and need God\'s direction for the next opportunity.',
    date: '2026-02-12',
    category: 'guidance',
    prayerCount: 55,
    isAnonymous: false,
  },
  {
    id: 'pr012',
    author: 'Amanda Robinson',
    request: 'Grateful for our small group community. God has used this group to strengthen our faith tremendously.',
    date: '2026-02-11',
    category: 'gratitude',
    prayerCount: 41,
    isAnonymous: false,
  },
  {
    id: 'pr013',
    author: 'Anonymous',
    request: 'Please pray for my teenager who is struggling with their faith and making poor choices.',
    date: '2026-02-11',
    category: 'family',
    prayerCount: 67,
    isAnonymous: true,
  },
  {
    id: 'pr014',
    author: 'Laura Scott',
    request: 'Prayers for our children\'s ministry Easter event. That many families in our community would attend and hear the gospel.',
    date: '2026-02-10',
    category: 'community',
    prayerCount: 44,
    isAnonymous: false,
  },
  {
    id: 'pr015',
    author: 'Eric Nelson',
    request: 'Praying for the refugee family our church is sponsoring. They arrived this week and need help adjusting.',
    date: '2026-02-10',
    category: 'community',
    prayerCount: 78,
    isAnonymous: false,
  },
];

export const announcements: Announcement[] = [
  {
    id: 'an001',
    title: 'Easter Services Schedule Change',
    body: 'Due to expected high attendance, we will have a combined Easter service at 10:00 AM instead of our usual two services. Plan to arrive early for good seating!',
    author: 'Robert Anderson',
    date: '2026-02-17',
    priority: 'urgent',
    audience: 'all',
  },
  {
    id: 'an002',
    title: 'Volunteer Needed for Nursery',
    body: 'We are looking for 2 volunteers to serve in the nursery this Sunday during the 11:00 AM service. Background check required. Contact Laura Scott if interested.',
    author: 'Laura Scott',
    date: '2026-02-16',
    priority: 'normal',
    audience: 'volunteers',
  },
  {
    id: 'an003',
    title: 'Building Fund Update',
    body: 'Great news! We have reached 70% of our building fund goal. Thank you for your faithful giving. We are on track to break ground this summer!',
    author: 'Michael Johnson',
    date: '2026-02-16',
    priority: 'info',
    audience: 'all',
  },
  {
    id: 'an004',
    title: 'Youth Retreat Registration Closes Friday',
    body: 'This is the final week to register for the March youth retreat. Cost is $125 per student. Contact Thomas White with any questions.',
    author: 'Thomas White',
    date: '2026-02-15',
    priority: 'normal',
    audience: 'youth',
  },
  {
    id: 'an005',
    title: 'Staff Meeting Moved to Tuesday',
    body: 'This week\'s staff meeting has been moved from Monday 9:00 AM to Tuesday 2:00 PM due to the President\'s Day holiday.',
    author: 'Office Administrator',
    date: '2026-02-14',
    priority: 'urgent',
    audience: 'staff',
  },
  {
    id: 'an006',
    title: 'New Small Groups Starting in March',
    body: 'We are launching 5 new small groups in March! Topics include marriage, parenting, financial freedom, and Bible study. Sign up at the welcome desk.',
    author: 'Amanda Robinson',
    date: '2026-02-13',
    priority: 'info',
    audience: 'all',
  },
  {
    id: 'an007',
    title: 'Community Food Pantry Needs Donations',
    body: 'Our monthly food pantry is running low on canned vegetables, pasta, and cereal. Please consider bringing donations this Sunday.',
    author: 'Daniel Martinez',
    date: '2026-02-12',
    priority: 'normal',
    audience: 'all',
  },
  {
    id: 'an008',
    title: 'Parking Lot Construction Starts Monday',
    body: 'We will be repaving the north parking lot starting Monday, February 23. Please use the south entrance and overflow parking during this time. Expected completion: 2 weeks.',
    author: 'Facilities Team',
    date: '2026-02-11',
    priority: 'urgent',
    audience: 'all',
  },
];

export const emailCampaigns: EmailCampaign[] = [
  {
    id: 'ec001',
    subject: 'Easter at Grace Community - April 12',
    sentDate: '2026-02-15',
    recipients: 2147,
    openRate: 52,
    clickRate: 18,
  },
  {
    id: 'ec002',
    subject: 'This Week at Grace - February 16-22',
    sentDate: '2026-02-14',
    recipients: 1893,
    openRate: 38,
    clickRate: 12,
  },
  {
    id: 'ec003',
    subject: 'Youth Retreat Registration - Don\'t Miss Out!',
    sentDate: '2026-02-12',
    recipients: 412,
    openRate: 64,
    clickRate: 31,
  },
  {
    id: 'ec004',
    subject: 'Building Fund Update - 70% to Goal!',
    sentDate: '2026-02-10',
    recipients: 2147,
    openRate: 45,
    clickRate: 15,
  },
  {
    id: 'ec005',
    subject: 'New Small Groups Starting in March',
    sentDate: '2026-02-08',
    recipients: 1893,
    openRate: 41,
    clickRate: 22,
  },
];

export const commsStats = {
  activePrayerRequests: 15,
  pendingAnnouncements: 3,
  emailsSentThisMonth: 4250,
  averageOpenRate: 42,
};
