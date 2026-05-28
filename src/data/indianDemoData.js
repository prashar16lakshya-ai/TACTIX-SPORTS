// ============================================================
// Indian Demo Data — TACTIX Realistic Dataset
// ============================================================

export const SCHOOL_NAME = 'Delhi Public School, Gurugram'
export const SCHOOL_CODE = 'DPS-GGN-001'

export const ADMIN = {
  id: 'demo-admin-001',
  name: 'Suresh Nair',
  role: 'admin',
  email: 'suresh.nair@dps.edu.in',
}

export const COACH = {
  uid: 'demo-coach-001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@dps.edu.in',
  role: 'coach',
  teamName: 'DPS Gurugram Athletics',
  stats: { winRate: 76, avgScore: '8.4', lastScore: '9.2' },
  roster: { active: 13, injured: 2, pending: 0, total: 15 }
}

export const GROUPS = [
  {
    id: 'grp-001',
    name: 'Cheetah XI',
    sport: 'Cricket',
    sportIcon: 'sports_cricket',
    color: '#0cca75',
    description: 'Elite cricket squad training for district championships',
    coachId: 'demo-coach-001',
    coachName: 'Rajesh Kumar',
    leaderId: 'demo-p-001',
    leaderName: 'Priya Sharma',
    memberCount: 6,
  },
  {
    id: 'grp-002',
    name: 'Thunderbolts',
    sport: 'Athletics',
    sportIcon: 'directions_run',
    color: '#f59e0b',
    description: 'Track & field specialists focused on sprint and relay events',
    coachId: 'demo-coach-001',
    coachName: 'Rajesh Kumar',
    leaderId: 'demo-p-008',
    leaderName: 'Kabir Nair',
    memberCount: 5,
  },
  {
    id: 'grp-003',
    name: 'Falcon Smash',
    sport: 'Badminton',
    sportIcon: 'sports_tennis',
    color: '#DC143C',
    description: 'Competitive badminton squad representing the school at state level',
    coachId: 'demo-coach-001',
    coachName: 'Rajesh Kumar',
    leaderId: 'demo-p-013',
    leaderName: 'Saanvi Reddy',
    memberCount: 4,
  },
]

// Helper to compute performance score
const perf = (attendance, trainingScore, wins, matches) => {
  const attScore = attendance * 0.4
  const trainScore = trainingScore * 0.35
  const matchScore = matches > 0 ? (wins / matches) * 100 * 0.25 : 0
  return Math.round(attScore + trainScore + matchScore)
}

export const PLAYERS = [
  // — Cheetah XI (Cricket) —
  {
    id: 'demo-p-001', name: 'Priya Sharma',      avatar: 'PS', class: '11-A', age: 16,
    sport: 'Cricket',   email: 'priya.s@dps.edu.in',
    groupId: 'grp-001', groupName: 'Cheetah XI',
    leaderId: 'demo-p-001', leaderName: 'Priya Sharma', isLeader: true,
    status: 'active',   attendance: 96, trainingScore: 94, matchesPlayed: 12, wins: 9,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 24, percentage: 96 },
  },
  {
    id: 'demo-p-002', name: 'Aarav Mehta',       avatar: 'AM', class: '10-A', age: 15,
    sport: 'Cricket',   email: 'aarav.m@dps.edu.in',
    groupId: 'grp-001', groupName: 'Cheetah XI',
    leaderId: 'demo-p-001', leaderName: 'Priya Sharma',
    status: 'active',   attendance: 88, trainingScore: 82, matchesPlayed: 10, wins: 6,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 22, percentage: 88 },
  },
  {
    id: 'demo-p-003', name: 'Rohan Verma',       avatar: 'RV', class: '11-C', age: 16,
    sport: 'Cricket',   email: 'rohan.v@dps.edu.in',
    groupId: 'grp-001', groupName: 'Cheetah XI',
    leaderId: 'demo-p-001', leaderName: 'Priya Sharma',
    status: 'active',   attendance: 72, trainingScore: 78, matchesPlayed: 8,  wins: 4,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 18, percentage: 72 },
  },
  {
    id: 'demo-p-004', name: 'Meera Joshi',       avatar: 'MJ', class: '11-A', age: 16,
    sport: 'Cricket',   email: 'meera.j@dps.edu.in',
    groupId: 'grp-001', groupName: 'Cheetah XI',
    leaderId: 'demo-p-001', leaderName: 'Priya Sharma',
    status: 'injured',  attendance: 60, trainingScore: 55, matchesPlayed: 5,  wins: 2,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 15, percentage: 60 },
  },
  {
    id: 'demo-p-005', name: 'Ananya Iyer',       avatar: 'AI', class: '10-B', age: 15,
    sport: 'Cricket',   email: 'ananya.i@dps.edu.in',
    groupId: 'grp-001', groupName: 'Cheetah XI',
    leaderId: 'demo-p-001', leaderName: 'Priya Sharma',
    status: 'active',   attendance: 92, trainingScore: 88, matchesPlayed: 11, wins: 7,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 23, percentage: 92 },
  },
  {
    id: 'demo-p-006', name: 'Dev Malhotra',      avatar: 'DM', class: '12-A', age: 17,
    sport: 'Cricket',   email: 'dev.m@dps.edu.in',
    groupId: 'grp-001', groupName: 'Cheetah XI',
    leaderId: 'demo-p-001', leaderName: 'Priya Sharma',
    status: 'active',   attendance: 80, trainingScore: 85, matchesPlayed: 9,  wins: 5,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 20, percentage: 80 },
  },

  // — Thunderbolts (Athletics) —
  {
    id: 'demo-p-007', name: 'Arjun Singh',       avatar: 'AS', class: '12-B', age: 17,
    sport: 'Athletics', email: 'arjun.s@dps.edu.in',
    groupId: 'grp-002', groupName: 'Thunderbolts',
    leaderId: 'demo-p-008', leaderName: 'Kabir Nair',
    status: 'active',   attendance: 94, trainingScore: 90, matchesPlayed: 8,  wins: 6,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 23, percentage: 94 },
  },
  {
    id: 'demo-p-008', name: 'Kabir Nair',        avatar: 'KN', class: '12-B', age: 17,
    sport: 'Athletics', email: 'kabir.n@dps.edu.in',
    groupId: 'grp-002', groupName: 'Thunderbolts',
    leaderId: 'demo-p-008', leaderName: 'Kabir Nair', isLeader: true,
    status: 'active',   attendance: 98, trainingScore: 96, matchesPlayed: 10, wins: 8,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 24, percentage: 98 },
  },
  {
    id: 'demo-p-009', name: 'Diya Kapoor',       avatar: 'DK', class: '9-B',  age: 14,
    sport: 'Athletics', email: 'diya.k@dps.edu.in',
    groupId: 'grp-002', groupName: 'Thunderbolts',
    leaderId: 'demo-p-008', leaderName: 'Kabir Nair',
    status: 'active',   attendance: 84, trainingScore: 79, matchesPlayed: 7,  wins: 4,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 21, percentage: 84 },
  },
  {
    id: 'demo-p-010', name: 'Vihaan Gupta',      avatar: 'VG', class: '10-C', age: 15,
    sport: 'Athletics', email: 'vihaan.g@dps.edu.in',
    groupId: 'grp-002', groupName: 'Thunderbolts',
    leaderId: 'demo-p-008', leaderName: 'Kabir Nair',
    status: 'active',   attendance: 76, trainingScore: 72, matchesPlayed: 6,  wins: 3,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 19, percentage: 76 },
  },
  {
    id: 'demo-p-011', name: 'Ishaan Patel',      avatar: 'IP', class: '9-A',  age: 14,
    sport: 'Athletics', email: 'ishaan.p@dps.edu.in',
    groupId: 'grp-002', groupName: 'Thunderbolts',
    leaderId: 'demo-p-008', leaderName: 'Kabir Nair',
    status: 'active',   attendance: 68, trainingScore: 65, matchesPlayed: 5,  wins: 2,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 17, percentage: 68 },
  },

  // — Falcon Smash (Badminton) —
  {
    id: 'demo-p-012', name: 'Nisha Verma',       avatar: 'NV', class: '10-A', age: 15,
    sport: 'Badminton', email: 'nisha.v@dps.edu.in',
    groupId: 'grp-003', groupName: 'Falcon Smash',
    leaderId: 'demo-p-013', leaderName: 'Saanvi Reddy',
    status: 'active',   attendance: 90, trainingScore: 87, matchesPlayed: 8,  wins: 5,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 22, percentage: 90 },
  },
  {
    id: 'demo-p-013', name: 'Saanvi Reddy',      avatar: 'SR', class: '12-A', age: 17,
    sport: 'Badminton', email: 'saanvi.r@dps.edu.in',
    groupId: 'grp-003', groupName: 'Falcon Smash',
    leaderId: 'demo-p-013', leaderName: 'Saanvi Reddy', isLeader: true,
    status: 'active',   attendance: 95, trainingScore: 93, matchesPlayed: 10, wins: 8,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 24, percentage: 95 },
  },
  {
    id: 'demo-p-014', name: 'Ritesh Yadav',      avatar: 'RY', class: '11-B', age: 16,
    sport: 'Badminton', email: 'ritesh.y@dps.edu.in',
    groupId: 'grp-003', groupName: 'Falcon Smash',
    leaderId: 'demo-p-013', leaderName: 'Saanvi Reddy',
    status: 'active',   attendance: 78, trainingScore: 74, matchesPlayed: 7,  wins: 3,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 19, percentage: 78 },
  },
  {
    id: 'demo-p-015', name: 'Trisha Das',        avatar: 'TD', class: '9-C',  age: 14,
    sport: 'Badminton', email: 'trisha.d@dps.edu.in',
    groupId: 'grp-003', groupName: 'Falcon Smash',
    leaderId: 'demo-p-013', leaderName: 'Saanvi Reddy',
    status: 'inactive', attendance: 52, trainingScore: 48, matchesPlayed: 3,  wins: 1,
    get score() { return perf(this.attendance, this.trainingScore, this.wins, this.matchesPlayed) },
    attendanceStats: { total: 25, attended: 13, percentage: 52 },
  },
]

export const ALL_PLAYERS = [...PLAYERS]

export const GROUP_LEADERS = PLAYERS.filter(p => p.isLeader).map(p => ({
  id: p.id,
  name: p.name,
  groupId: p.groupId,
  groupName: p.groupName,
  class: p.class,
  sport: p.sport,
  email: p.email,
  age: p.age,
}))

export const INITIAL_PROFILE = {
  name: ADMIN.name,
  class: '10',
  section: 'A',
  sport: 'Cricket',
  bio: '',
  phone: '',
  photo: '',
}

export const ACTIVITY_LOGS = [
  { id: 'log-001', message: '15 players imported successfully via Bulk Import', time: 'Today, 9:00 AM', type: 'success' },
  { id: 'log-002', message: 'Falcon Smash group created with 4 players', time: 'Today, 9:30 AM', type: 'info' },
  { id: 'log-003', message: 'Attendance marked for Cheetah XI (6/6 present)', time: 'Today, 10:00 AM', type: 'success' },
  { id: 'log-004', message: 'Meera Joshi marked as injured – training paused', time: 'Yesterday, 4:20 PM', type: 'warning' },
  { id: 'log-005', message: 'Performance report generated for Thunderbolts', time: 'Yesterday, 2:15 PM', type: 'info' },
]

// CSV template with team name (not teamId) — matches BulkImport FIELDS
export const DEMO_CSV_CONTENT = `name,position,teamName
Aarav Mehta,Batsman,Cheetah XI
Diya Kapoor,Sprinter,Thunderbolts
Rohan Verma,All-rounder,Cheetah XI
Nisha Verma,Doubles Specialist,Falcon Smash
Kabir Nair,Long-distance Runner,Thunderbolts
Ishaan Patel,Javelin Thrower,Thunderbolts
Meera Joshi,Wicket Keeper,Cheetah XI
Vihaan Gupta,High Jumper,Thunderbolts
Saanvi Reddy,Singles Specialist,Falcon Smash
Arjun Sharma,Middle-order Batsman,Cheetah XI`

export const SPORTS_LIST = ['Cricket', 'Athletics', 'Badminton', 'Football', 'Kabaddi', 'Table Tennis', 'Chess', 'Volleyball', 'Swimming']

export const ANNOUNCEMENTS = [
  { 
    id: 'ann-1', 
    title: 'Student selected for District Athletics', 
    description: 'Aarav Mehta from Class 10-A has been selected for the District Level Athletics Meet in Gurugram.', 
    type: 'player', 
    date: '2026-04-28', 
    verified: true,
    createdBy: 'Coach Rajesh',
    relatedPlayers: ['Aarav Mehta']
  },
  { 
    id: 'ann-2', 
    title: 'Cheetah XI wins Inter-School Trophy', 
    description: 'The Cheetah XI cricket squad has won the annual Inter-School Sports Trophy held at DPS.', 
    type: 'team', 
    date: '2026-04-25', 
    verified: true,
    createdBy: 'Admin',
    relatedPlayers: []
  },
  { 
    id: 'ann-3', 
    title: 'School ranks Top 5 in Sports Excellence', 
    description: 'Delhi Public School, Gurugram has been ranked among the top 5 schools for sports excellence in the region.', 
    type: 'school', 
    date: '2026-04-20', 
    verified: true,
    createdBy: 'Admin',
    relatedPlayers: []
  },
];

export const ALERTS = [
  { id: 'alert-1', message: 'Medical clearance pending for Rahul Singh', type: 'warning', time: '2 hours ago' },
  { id: 'alert-2', message: 'U-17 Basketball team registration closes tomorrow', type: 'critical', time: '5 hours ago' },
  { id: 'alert-3', message: 'New equipment arrived for Badminton facility', type: 'info', time: '1 day ago' },
  { id: 'alert-4', message: 'Weather warning: Move outdoor practice indoors', type: 'warning', time: '1 day ago' }
];

export const REMARKS = [
  { id: 'rem-1', text: "Excellent footwork and stamina. Ready for district trials.", author: "Coach Rajesh", date: "Oct 12, 2026" },
  { id: 'rem-2', text: "Needs to work on weak-foot passing.", author: "Coach Rajesh", date: "Sep 28, 2026" },
  { id: 'rem-3', text: "Recovering well from minor ankle sprain. Can resume full training next week.", author: "Physio Team", date: "Sep 15, 2026" }
];
