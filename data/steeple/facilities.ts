export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'worship' | 'fellowship' | 'classroom' | 'office' | 'utility';
  status: 'available' | 'in-use' | 'maintenance';
  floor: string;
  amenities: string[];
}

export interface MaintenanceTicket {
  id: string;
  location: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'completed';
  reportedDate: string;
  assignedTo: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  lastServiced: string;
}

export const rooms: Room[] = [
  {
    id: 'r001',
    name: 'Main Sanctuary',
    capacity: 800,
    type: 'worship',
    status: 'available',
    floor: '1st Floor',
    amenities: ['Sound System', 'Projection', 'Piano', 'Organ', 'Baptistry', 'Stage Lighting', 'Live Stream'],
  },
  {
    id: 'r002',
    name: 'Fellowship Hall',
    capacity: 200,
    type: 'fellowship',
    status: 'available',
    floor: '1st Floor',
    amenities: ['Kitchen Access', 'Tables', 'Chairs', 'Sound System', 'Projection Screen'],
  },
  {
    id: 'r003',
    name: 'Chapel',
    capacity: 100,
    type: 'worship',
    status: 'available',
    floor: '2nd Floor',
    amenities: ['Piano', 'Sound System', 'Seating'],
  },
  {
    id: 'r004',
    name: 'Youth Center',
    capacity: 150,
    type: 'fellowship',
    status: 'in-use',
    floor: 'Basement',
    amenities: ['Game Tables', 'TV', 'Sound System', 'Kitchenette', 'Stage'],
  },
  {
    id: 'r005',
    name: 'Classroom 101',
    capacity: 30,
    type: 'classroom',
    status: 'available',
    floor: '2nd Floor',
    amenities: ['Whiteboard', 'Chairs', 'Tables', 'Closet Storage'],
  },
  {
    id: 'r006',
    name: 'Classroom 102',
    capacity: 30,
    type: 'classroom',
    status: 'available',
    floor: '2nd Floor',
    amenities: ['Whiteboard', 'Chairs', 'Tables', 'TV'],
  },
  {
    id: 'r007',
    name: 'Classroom 103',
    capacity: 30,
    type: 'classroom',
    status: 'available',
    floor: '2nd Floor',
    amenities: ['Whiteboard', 'Chairs', 'Tables', 'Piano'],
  },
  {
    id: 'r008',
    name: 'Classroom 104',
    capacity: 30,
    type: 'classroom',
    status: 'maintenance',
    floor: '2nd Floor',
    amenities: ['Whiteboard', 'Chairs', 'Tables', 'Projector'],
  },
  {
    id: 'r009',
    name: 'Classroom 105',
    capacity: 30,
    type: 'classroom',
    status: 'available',
    floor: '2nd Floor',
    amenities: ['Whiteboard', 'Chairs', 'Tables'],
  },
  {
    id: 'r010',
    name: 'Library',
    capacity: 25,
    type: 'classroom',
    status: 'available',
    floor: '2nd Floor',
    amenities: ['Bookshelves', 'Reading Tables', 'Chairs', 'Computer Station'],
  },
  {
    id: 'r011',
    name: 'Nursery',
    capacity: 40,
    type: 'utility',
    status: 'available',
    floor: '1st Floor',
    amenities: ['Cribs', 'Changing Station', 'Toys', 'Rocking Chairs', 'Security Check-in'],
  },
  {
    id: 'r012',
    name: 'Office Suite',
    capacity: 10,
    type: 'office',
    status: 'in-use',
    floor: '1st Floor',
    amenities: ['Desks', 'Computers', 'Phones', 'Copier', 'File Storage'],
  },
  {
    id: 'r013',
    name: 'Conference Room',
    capacity: 20,
    type: 'office',
    status: 'available',
    floor: '1st Floor',
    amenities: ['Conference Table', 'Chairs', 'TV', 'Whiteboard', 'Coffee Station'],
  },
  {
    id: 'r014',
    name: 'Kitchen',
    capacity: 15,
    type: 'utility',
    status: 'maintenance',
    floor: '1st Floor',
    amenities: ['Commercial Stove', 'Refrigerator', 'Freezer', 'Dishwasher', 'Prep Tables', 'Serving Window'],
  },
  {
    id: 'r015',
    name: 'Gym',
    capacity: 100,
    type: 'fellowship',
    status: 'available',
    floor: 'Basement',
    amenities: ['Basketball Court', 'Bleachers', 'Storage Closet'],
  },
];

export const maintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'mt001',
    location: 'Main Sanctuary',
    issue: 'Stage lighting needs replacement bulbs',
    priority: 'medium',
    status: 'open',
    reportedDate: '2026-02-15',
    assignedTo: 'Mike Johnson',
  },
  {
    id: 'mt002',
    location: 'Kitchen',
    issue: 'Dishwasher not draining properly',
    priority: 'high',
    status: 'in-progress',
    reportedDate: '2026-02-12',
    assignedTo: 'Tom Anderson',
  },
  {
    id: 'mt003',
    location: 'Classroom 104',
    issue: 'HVAC making loud noise',
    priority: 'medium',
    status: 'in-progress',
    reportedDate: '2026-02-10',
    assignedTo: 'Tom Anderson',
  },
  {
    id: 'mt004',
    location: 'Parking Lot',
    issue: 'Pothole near entrance needs repair',
    priority: 'medium',
    status: 'open',
    reportedDate: '2026-02-14',
    assignedTo: 'Facilities Team',
  },
  {
    id: 'mt005',
    location: 'Fellowship Hall',
    issue: 'Ceiling tile water stain - check for leak',
    priority: 'high',
    status: 'open',
    reportedDate: '2026-02-16',
    assignedTo: 'Tom Anderson',
  },
  {
    id: 'mt006',
    location: 'Youth Center',
    issue: 'Paint touch-up needed on walls',
    priority: 'low',
    status: 'open',
    reportedDate: '2026-02-08',
    assignedTo: 'Volunteer Team',
  },
  {
    id: 'mt007',
    location: 'Main Sanctuary',
    issue: 'Pew cushion repair needed in row 12',
    priority: 'low',
    status: 'completed',
    reportedDate: '2026-02-01',
    assignedTo: 'Mike Johnson',
  },
  {
    id: 'mt008',
    location: 'Office Suite',
    issue: 'Copier paper jam - frequent issue',
    priority: 'medium',
    status: 'open',
    reportedDate: '2026-02-17',
    assignedTo: 'Service Contract',
  },
];

export const equipment: Equipment[] = [
  {
    id: 'eq001',
    name: 'Sanctuary Sound System',
    category: 'Audio/Visual',
    condition: 'excellent',
    location: 'Main Sanctuary',
    lastServiced: '2026-01-15',
  },
  {
    id: 'eq002',
    name: 'Projection System - Main',
    category: 'Audio/Visual',
    condition: 'good',
    location: 'Main Sanctuary',
    lastServiced: '2025-12-10',
  },
  {
    id: 'eq003',
    name: 'Steinway Grand Piano',
    category: 'Musical Instruments',
    condition: 'excellent',
    location: 'Main Sanctuary',
    lastServiced: '2026-01-20',
  },
  {
    id: 'eq004',
    name: 'Allen Organ',
    category: 'Musical Instruments',
    condition: 'good',
    location: 'Main Sanctuary',
    lastServiced: '2025-11-05',
  },
  {
    id: 'eq005',
    name: 'Commercial Dishwasher',
    category: 'Kitchen',
    condition: 'fair',
    location: 'Kitchen',
    lastServiced: '2026-02-12',
  },
  {
    id: 'eq006',
    name: 'Walk-in Refrigerator',
    category: 'Kitchen',
    condition: 'good',
    location: 'Kitchen',
    lastServiced: '2025-10-22',
  },
  {
    id: 'eq007',
    name: 'Commercial Stove (6-burner)',
    category: 'Kitchen',
    condition: 'good',
    location: 'Kitchen',
    lastServiced: '2025-09-15',
  },
  {
    id: 'eq008',
    name: 'HVAC System - Main Building',
    category: 'Climate Control',
    condition: 'good',
    location: 'Building-wide',
    lastServiced: '2025-08-30',
  },
  {
    id: 'eq009',
    name: 'HVAC System - Education Wing',
    category: 'Climate Control',
    condition: 'fair',
    location: 'Building-wide',
    lastServiced: '2025-08-30',
  },
  {
    id: 'eq010',
    name: 'Live Stream Camera System',
    category: 'Audio/Visual',
    condition: 'excellent',
    location: 'Main Sanctuary',
    lastServiced: '2026-01-15',
  },
  {
    id: 'eq011',
    name: 'Worship Band Sound Equipment',
    category: 'Audio/Visual',
    condition: 'good',
    location: 'Main Sanctuary',
    lastServiced: '2025-12-20',
  },
  {
    id: 'eq012',
    name: 'Nursery Security Check-in System',
    category: 'Technology',
    condition: 'excellent',
    location: 'Nursery',
    lastServiced: '2026-01-10',
  },
  {
    id: 'eq013',
    name: 'Backup Generator',
    category: 'Electrical',
    condition: 'good',
    location: 'Exterior',
    lastServiced: '2025-11-01',
  },
  {
    id: 'eq014',
    name: 'Lawn Mower (Commercial)',
    category: 'Grounds',
    condition: 'fair',
    location: 'Maintenance Shed',
    lastServiced: '2025-04-15',
  },
  {
    id: 'eq015',
    name: 'Snow Removal Equipment',
    category: 'Grounds',
    condition: 'good',
    location: 'Maintenance Shed',
    lastServiced: '2025-11-15',
  },
];

export const facilityStats = {
  totalRooms: 15,
  available: 11,
  inMaintenance: 2,
  utilizationRate: 73,
};
