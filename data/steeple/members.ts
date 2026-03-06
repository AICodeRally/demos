export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'visitor';
  familyId: string;
  smallGroups: string[];
  attendanceRate: number;
  totalGiving: number;
  memberType: 'member' | 'visitor' | 'staff' | 'elder' | 'deacon';
  address: string;
}

export const members: Member[] = [
  // Johnson Family
  { id: 'm001', firstName: 'Michael', lastName: 'Johnson', email: 'michael.johnson@email.com', phone: '555-0101', joinDate: '2015-03-15', status: 'active', familyId: 'f001', smallGroups: ['sg001', 'sg005'], attendanceRate: 92, totalGiving: 48500, memberType: 'elder', address: '123 Oak Street, Grace City, ST 12345' },
  { id: 'm002', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', phone: '555-0101', joinDate: '2015-03-15', status: 'active', familyId: 'f001', smallGroups: ['sg002', 'sg006'], attendanceRate: 95, totalGiving: 48500, memberType: 'member', address: '123 Oak Street, Grace City, ST 12345' },
  { id: 'm003', firstName: 'Emma', lastName: 'Johnson', email: 'emma.johnson@email.com', phone: '555-0101', joinDate: '2015-03-15', status: 'active', familyId: 'f001', smallGroups: ['sg007'], attendanceRate: 88, totalGiving: 0, memberType: 'member', address: '123 Oak Street, Grace City, ST 12345' },

  // Williams Family
  { id: 'm004', firstName: 'David', lastName: 'Williams', email: 'david.williams@email.com', phone: '555-0102', joinDate: '2018-06-20', status: 'active', familyId: 'f002', smallGroups: ['sg001'], attendanceRate: 85, totalGiving: 32000, memberType: 'deacon', address: '456 Maple Avenue, Grace City, ST 12345' },
  { id: 'm005', firstName: 'Jennifer', lastName: 'Williams', email: 'jennifer.williams@email.com', phone: '555-0102', joinDate: '2018-06-20', status: 'active', familyId: 'f002', smallGroups: ['sg002'], attendanceRate: 87, totalGiving: 32000, memberType: 'member', address: '456 Maple Avenue, Grace City, ST 12345' },

  // Garcia Family
  { id: 'm006', firstName: 'Carlos', lastName: 'Garcia', email: 'carlos.garcia@email.com', phone: '555-0103', joinDate: '2019-09-10', status: 'active', familyId: 'f003', smallGroups: ['sg003', 'sg005'], attendanceRate: 78, totalGiving: 28500, memberType: 'member', address: '789 Elm Drive, Grace City, ST 12345' },
  { id: 'm007', firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@email.com', phone: '555-0103', joinDate: '2019-09-10', status: 'active', familyId: 'f003', smallGroups: ['sg006'], attendanceRate: 82, totalGiving: 28500, memberType: 'member', address: '789 Elm Drive, Grace City, ST 12345' },
  { id: 'm008', firstName: 'Sofia', lastName: 'Garcia', email: 'sofia.garcia@email.com', phone: '555-0103', joinDate: '2019-09-10', status: 'active', familyId: 'f003', smallGroups: ['sg007'], attendanceRate: 75, totalGiving: 0, memberType: 'member', address: '789 Elm Drive, Grace City, ST 12345' },

  // Anderson Family
  { id: 'm009', firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@email.com', phone: '555-0104', joinDate: '2012-01-08', status: 'active', familyId: 'f004', smallGroups: ['sg001', 'sg004'], attendanceRate: 96, totalGiving: 65000, memberType: 'elder', address: '321 Pine Lane, Grace City, ST 12345' },
  { id: 'm010', firstName: 'Patricia', lastName: 'Anderson', email: 'patricia.anderson@email.com', phone: '555-0104', joinDate: '2012-01-08', status: 'active', familyId: 'f004', smallGroups: ['sg002'], attendanceRate: 94, totalGiving: 65000, memberType: 'member', address: '321 Pine Lane, Grace City, ST 12345' },

  // Thompson Family
  { id: 'm011', firstName: 'James', lastName: 'Thompson', email: 'james.thompson@email.com', phone: '555-0105', joinDate: '2020-02-14', status: 'active', familyId: 'f005', smallGroups: ['sg005'], attendanceRate: 72, totalGiving: 18000, memberType: 'member', address: '654 Cedar Court, Grace City, ST 12345' },
  { id: 'm012', firstName: 'Linda', lastName: 'Thompson', email: 'linda.thompson@email.com', phone: '555-0105', joinDate: '2020-02-14', status: 'active', familyId: 'f005', smallGroups: ['sg006'], attendanceRate: 76, totalGiving: 18000, memberType: 'member', address: '654 Cedar Court, Grace City, ST 12345' },
  { id: 'm013', firstName: 'Noah', lastName: 'Thompson', email: 'noah.thompson@email.com', phone: '555-0105', joinDate: '2020-02-14', status: 'active', familyId: 'f005', smallGroups: ['sg008'], attendanceRate: 68, totalGiving: 0, memberType: 'member', address: '654 Cedar Court, Grace City, ST 12345' },

  // Martinez Family
  { id: 'm014', firstName: 'Daniel', lastName: 'Martinez', email: 'daniel.martinez@email.com', phone: '555-0106', joinDate: '2016-11-22', status: 'active', familyId: 'f006', smallGroups: ['sg003'], attendanceRate: 89, totalGiving: 42000, memberType: 'deacon', address: '987 Birch Boulevard, Grace City, ST 12345' },
  { id: 'm015', firstName: 'Michelle', lastName: 'Martinez', email: 'michelle.martinez@email.com', phone: '555-0106', joinDate: '2016-11-22', status: 'active', familyId: 'f006', smallGroups: ['sg002', 'sg006'], attendanceRate: 91, totalGiving: 42000, memberType: 'member', address: '987 Birch Boulevard, Grace City, ST 12345' },

  // Lee Family
  { id: 'm016', firstName: 'Kevin', lastName: 'Lee', email: 'kevin.lee@email.com', phone: '555-0107', joinDate: '2021-05-30', status: 'active', familyId: 'f007', smallGroups: ['sg001'], attendanceRate: 65, totalGiving: 15000, memberType: 'member', address: '147 Willow Way, Grace City, ST 12345' },
  { id: 'm017', firstName: 'Amy', lastName: 'Lee', email: 'amy.lee@email.com', phone: '555-0107', joinDate: '2021-05-30', status: 'active', familyId: 'f007', smallGroups: ['sg006'], attendanceRate: 70, totalGiving: 15000, memberType: 'member', address: '147 Willow Way, Grace City, ST 12345' },

  // White Family
  { id: 'm018', firstName: 'Thomas', lastName: 'White', email: 'thomas.white@email.com', phone: '555-0108', joinDate: '2014-08-12', status: 'active', familyId: 'f008', smallGroups: ['sg004', 'sg005'], attendanceRate: 93, totalGiving: 52000, memberType: 'staff', address: '258 Spruce Street, Grace City, ST 12345' },
  { id: 'm019', firstName: 'Elizabeth', lastName: 'White', email: 'elizabeth.white@email.com', phone: '555-0108', joinDate: '2014-08-12', status: 'active', familyId: 'f008', smallGroups: ['sg002'], attendanceRate: 95, totalGiving: 52000, memberType: 'member', address: '258 Spruce Street, Grace City, ST 12345' },
  { id: 'm020', firstName: 'Olivia', lastName: 'White', email: 'olivia.white@email.com', phone: '555-0108', joinDate: '2014-08-12', status: 'active', familyId: 'f008', smallGroups: ['sg007'], attendanceRate: 90, totalGiving: 0, memberType: 'member', address: '258 Spruce Street, Grace City, ST 12345' },

  // Harris Family
  { id: 'm021', firstName: 'Christopher', lastName: 'Harris', email: 'christopher.harris@email.com', phone: '555-0109', joinDate: '2017-03-25', status: 'active', familyId: 'f009', smallGroups: ['sg001'], attendanceRate: 81, totalGiving: 36000, memberType: 'member', address: '369 Ash Avenue, Grace City, ST 12345' },
  { id: 'm022', firstName: 'Jessica', lastName: 'Harris', email: 'jessica.harris@email.com', phone: '555-0109', joinDate: '2017-03-25', status: 'active', familyId: 'f009', smallGroups: ['sg006'], attendanceRate: 84, totalGiving: 36000, memberType: 'member', address: '369 Ash Avenue, Grace City, ST 12345' },

  // Clark Family
  { id: 'm023', firstName: 'Matthew', lastName: 'Clark', email: 'matthew.clark@email.com', phone: '555-0110', joinDate: '2019-07-18', status: 'active', familyId: 'f010', smallGroups: ['sg003', 'sg005'], attendanceRate: 77, totalGiving: 24000, memberType: 'member', address: '741 Hickory Hill, Grace City, ST 12345' },
  { id: 'm024', firstName: 'Ashley', lastName: 'Clark', email: 'ashley.clark@email.com', phone: '555-0110', joinDate: '2019-07-18', status: 'active', familyId: 'f010', smallGroups: ['sg002'], attendanceRate: 79, totalGiving: 24000, memberType: 'member', address: '741 Hickory Hill, Grace City, ST 12345' },

  // Robinson Family
  { id: 'm025', firstName: 'Joshua', lastName: 'Robinson', email: 'joshua.robinson@email.com', phone: '555-0111', joinDate: '2013-10-05', status: 'active', familyId: 'f011', smallGroups: ['sg004'], attendanceRate: 90, totalGiving: 58000, memberType: 'elder', address: '852 Poplar Place, Grace City, ST 12345' },
  { id: 'm026', firstName: 'Amanda', lastName: 'Robinson', email: 'amanda.robinson@email.com', phone: '555-0111', joinDate: '2013-10-05', status: 'active', familyId: 'f011', smallGroups: ['sg002', 'sg006'], attendanceRate: 92, totalGiving: 58000, memberType: 'member', address: '852 Poplar Place, Grace City, ST 12345' },
  { id: 'm027', firstName: 'Ethan', lastName: 'Robinson', email: 'ethan.robinson@email.com', phone: '555-0111', joinDate: '2013-10-05', status: 'active', familyId: 'f011', smallGroups: ['sg007'], attendanceRate: 86, totalGiving: 0, memberType: 'member', address: '852 Poplar Place, Grace City, ST 12345' },

  // Walker Family
  { id: 'm028', firstName: 'Andrew', lastName: 'Walker', email: 'andrew.walker@email.com', phone: '555-0112', joinDate: '2020-09-11', status: 'active', familyId: 'f012', smallGroups: ['sg001'], attendanceRate: 62, totalGiving: 12500, memberType: 'member', address: '963 Sycamore Street, Grace City, ST 12345' },
  { id: 'm029', firstName: 'Stephanie', lastName: 'Walker', email: 'stephanie.walker@email.com', phone: '555-0112', joinDate: '2020-09-11', status: 'active', familyId: 'f012', smallGroups: ['sg006'], attendanceRate: 67, totalGiving: 12500, memberType: 'member', address: '963 Sycamore Street, Grace City, ST 12345' },

  // Young Family
  { id: 'm030', firstName: 'Ryan', lastName: 'Young', email: 'ryan.young@email.com', phone: '555-0113', joinDate: '2015-12-03', status: 'active', familyId: 'f013', smallGroups: ['sg003'], attendanceRate: 87, totalGiving: 44000, memberType: 'deacon', address: '159 Magnolia Drive, Grace City, ST 12345' },
  { id: 'm031', firstName: 'Nicole', lastName: 'Young', email: 'nicole.young@email.com', phone: '555-0113', joinDate: '2015-12-03', status: 'active', familyId: 'f013', smallGroups: ['sg002'], attendanceRate: 89, totalGiving: 44000, memberType: 'member', address: '159 Magnolia Drive, Grace City, ST 12345' },

  // King Family
  { id: 'm032', firstName: 'Brandon', lastName: 'King', email: 'brandon.king@email.com', phone: '555-0114', joinDate: '2018-04-16', status: 'active', familyId: 'f014', smallGroups: ['sg005'], attendanceRate: 74, totalGiving: 29000, memberType: 'member', address: '357 Dogwood Lane, Grace City, ST 12345' },
  { id: 'm033', firstName: 'Rachel', lastName: 'King', email: 'rachel.king@email.com', phone: '555-0114', joinDate: '2018-04-16', status: 'active', familyId: 'f014', smallGroups: ['sg006'], attendanceRate: 78, totalGiving: 29000, memberType: 'member', address: '357 Dogwood Lane, Grace City, ST 12345' },
  { id: 'm034', firstName: 'Liam', lastName: 'King', email: 'liam.king@email.com', phone: '555-0114', joinDate: '2018-04-16', status: 'active', familyId: 'f014', smallGroups: ['sg008'], attendanceRate: 70, totalGiving: 0, memberType: 'member', address: '357 Dogwood Lane, Grace City, ST 12345' },

  // Scott Family
  { id: 'm035', firstName: 'Jason', lastName: 'Scott', email: 'jason.scott@email.com', phone: '555-0115', joinDate: '2014-06-28', status: 'active', familyId: 'f015', smallGroups: ['sg001', 'sg004'], attendanceRate: 94, totalGiving: 54000, memberType: 'staff', address: '468 Redwood Road, Grace City, ST 12345' },
  { id: 'm036', firstName: 'Laura', lastName: 'Scott', email: 'laura.scott@email.com', phone: '555-0115', joinDate: '2014-06-28', status: 'active', familyId: 'f015', smallGroups: ['sg002'], attendanceRate: 96, totalGiving: 54000, memberType: 'member', address: '468 Redwood Road, Grace City, ST 12345' },

  // Green Family
  { id: 'm037', firstName: 'Benjamin', lastName: 'Green', email: 'benjamin.green@email.com', phone: '555-0116', joinDate: '2021-01-20', status: 'active', familyId: 'f016', smallGroups: ['sg003'], attendanceRate: 58, totalGiving: 9500, memberType: 'member', address: '579 Chestnut Circle, Grace City, ST 12345' },
  { id: 'm038', firstName: 'Megan', lastName: 'Green', email: 'megan.green@email.com', phone: '555-0116', joinDate: '2021-01-20', status: 'active', familyId: 'f016', smallGroups: ['sg006'], attendanceRate: 63, totalGiving: 9500, memberType: 'member', address: '579 Chestnut Circle, Grace City, ST 12345' },

  // Baker Family
  { id: 'm039', firstName: 'Nathan', lastName: 'Baker', email: 'nathan.baker@email.com', phone: '555-0117', joinDate: '2016-09-07', status: 'active', familyId: 'f017', smallGroups: ['sg005'], attendanceRate: 83, totalGiving: 38000, memberType: 'member', address: '680 Juniper Junction, Grace City, ST 12345' },
  { id: 'm040', firstName: 'Heather', lastName: 'Baker', email: 'heather.baker@email.com', phone: '555-0117', joinDate: '2016-09-07', status: 'active', familyId: 'f017', smallGroups: ['sg002'], attendanceRate: 86, totalGiving: 38000, memberType: 'member', address: '680 Juniper Junction, Grace City, ST 12345' },
  { id: 'm041', firstName: 'Ava', lastName: 'Baker', email: 'ava.baker@email.com', phone: '555-0117', joinDate: '2016-09-07', status: 'active', familyId: 'f017', smallGroups: ['sg007'], attendanceRate: 80, totalGiving: 0, memberType: 'member', address: '680 Juniper Junction, Grace City, ST 12345' },

  // Adams Family
  { id: 'm042', firstName: 'Tyler', lastName: 'Adams', email: 'tyler.adams@email.com', phone: '555-0118', joinDate: '2019-11-14', status: 'active', familyId: 'f018', smallGroups: ['sg001'], attendanceRate: 71, totalGiving: 21000, memberType: 'member', address: '791 Beech Boulevard, Grace City, ST 12345' },
  { id: 'm043', firstName: 'Samantha', lastName: 'Adams', email: 'samantha.adams@email.com', phone: '555-0118', joinDate: '2019-11-14', status: 'active', familyId: 'f018', smallGroups: ['sg006'], attendanceRate: 75, totalGiving: 21000, memberType: 'member', address: '791 Beech Boulevard, Grace City, ST 12345' },

  // Nelson Family
  { id: 'm044', firstName: 'Eric', lastName: 'Nelson', email: 'eric.nelson@email.com', phone: '555-0119', joinDate: '2017-07-02', status: 'active', familyId: 'f019', smallGroups: ['sg004'], attendanceRate: 88, totalGiving: 40000, memberType: 'deacon', address: '802 Laurel Lane, Grace City, ST 12345' },
  { id: 'm045', firstName: 'Rebecca', lastName: 'Nelson', email: 'rebecca.nelson@email.com', phone: '555-0119', joinDate: '2017-07-02', status: 'active', familyId: 'f019', smallGroups: ['sg002', 'sg006'], attendanceRate: 90, totalGiving: 40000, memberType: 'member', address: '802 Laurel Lane, Grace City, ST 12345' },

  // Mitchell Family
  { id: 'm046', firstName: 'Aaron', lastName: 'Mitchell', email: 'aaron.mitchell@email.com', phone: '555-0120', joinDate: '2020-05-22', status: 'active', familyId: 'f020', smallGroups: ['sg003'], attendanceRate: 66, totalGiving: 16500, memberType: 'member', address: '913 Cypress Court, Grace City, ST 12345' },
  { id: 'm047', firstName: 'Emily', lastName: 'Mitchell', email: 'emily.mitchell@email.com', phone: '555-0120', joinDate: '2020-05-22', status: 'active', familyId: 'f020', smallGroups: ['sg006'], attendanceRate: 69, totalGiving: 16500, memberType: 'member', address: '913 Cypress Court, Grace City, ST 12345' },

  // Visitors
  { id: 'm048', firstName: 'Mark', lastName: 'Stevens', email: 'mark.stevens@email.com', phone: '555-0121', joinDate: '2025-12-01', status: 'visitor', familyId: 'f021', smallGroups: [], attendanceRate: 40, totalGiving: 500, memberType: 'visitor', address: '1024 Visitor Lane, Grace City, ST 12345' },
  { id: 'm049', firstName: 'Lisa', lastName: 'Cooper', email: 'lisa.cooper@email.com', phone: '555-0122', joinDate: '2025-11-15', status: 'visitor', familyId: 'f022', smallGroups: [], attendanceRate: 45, totalGiving: 250, memberType: 'visitor', address: '1135 Guest Street, Grace City, ST 12345' },
  { id: 'm050', firstName: 'John', lastName: 'Phillips', email: 'john.phillips@email.com', phone: '555-0123', joinDate: '2025-10-20', status: 'visitor', familyId: 'f023', smallGroups: [], attendanceRate: 52, totalGiving: 750, memberType: 'visitor', address: '1246 Welcome Way, Grace City, ST 12345' },
];

export const memberStats = {
  totalMembers: 2147,
  activeMembers: 1893,
  visitors: 142,
  newThisMonth: 23,
  averageAttendance: 78,
};
