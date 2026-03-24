export interface NFLTeam {
  name: string;
  abbr: string;
  city: string;
  color: string;
  colorAlt: string;
  conference: 'AFC' | 'NFC';
  division: string;
  tradeNote?: string; // e.g. "from ATL" for traded picks
}

// 2026 NFL Draft Round 1 order — actual draft order per ESPN/NFL.com
// Teams that traded away their 1st-round pick (ATL, GB, JAX, IND) do not appear.
// Teams with multiple picks appear at each pick slot.
export const NFL_TEAMS: NFLTeam[] = [
  // Pick 1
  { name: 'Raiders', abbr: 'LV', city: 'Las Vegas', color: '#000000', colorAlt: '#A5ACAF', conference: 'AFC', division: 'West' },
  // Pick 2
  { name: 'Jets', abbr: 'NYJ', city: 'New York', color: '#125740', colorAlt: '#FFFFFF', conference: 'AFC', division: 'East' },
  // Pick 3
  { name: 'Cardinals', abbr: 'ARI', city: 'Arizona', color: '#97233F', colorAlt: '#000000', conference: 'NFC', division: 'West' },
  // Pick 4
  { name: 'Titans', abbr: 'TEN', city: 'Tennessee', color: '#4B92DB', colorAlt: '#C8102E', conference: 'AFC', division: 'South' },
  // Pick 5
  { name: 'Giants', abbr: 'NYG', city: 'New York', color: '#0B2265', colorAlt: '#A71930', conference: 'NFC', division: 'East' },
  // Pick 6
  { name: 'Browns', abbr: 'CLE', city: 'Cleveland', color: '#311D00', colorAlt: '#FF3C00', conference: 'AFC', division: 'North' },
  // Pick 7
  { name: 'Commanders', abbr: 'WAS', city: 'Washington', color: '#5A1414', colorAlt: '#FFB612', conference: 'NFC', division: 'East' },
  // Pick 8
  { name: 'Saints', abbr: 'NO', city: 'New Orleans', color: '#D3BC8D', colorAlt: '#101820', conference: 'NFC', division: 'South' },
  // Pick 9 (traded from another team)
  { name: 'Chiefs', abbr: 'KC', city: 'Kansas City', color: '#E31837', colorAlt: '#FFB81C', conference: 'AFC', division: 'West', tradeNote: 'via trade' },
  // Pick 10
  { name: 'Bengals', abbr: 'CIN', city: 'Cincinnati', color: '#FB4F14', colorAlt: '#000000', conference: 'AFC', division: 'North' },
  // Pick 11
  { name: 'Dolphins', abbr: 'MIA', city: 'Miami', color: '#008E97', colorAlt: '#FC4C02', conference: 'AFC', division: 'East' },
  // Pick 12
  { name: 'Cowboys', abbr: 'DAL', city: 'Dallas', color: '#003594', colorAlt: '#869397', conference: 'NFC', division: 'East' },
  // Pick 13 (from ATL via trade)
  { name: 'Rams', abbr: 'LAR', city: 'Los Angeles', color: '#003594', colorAlt: '#FFA300', conference: 'NFC', division: 'West', tradeNote: 'from ATL' },
  // Pick 14
  { name: 'Ravens', abbr: 'BAL', city: 'Baltimore', color: '#241773', colorAlt: '#9E7C0C', conference: 'AFC', division: 'North' },
  // Pick 15
  { name: 'Buccaneers', abbr: 'TB', city: 'Tampa Bay', color: '#D50A0A', colorAlt: '#34302B', conference: 'NFC', division: 'South' },
  // Pick 16 (Jets' 2nd pick, from IND)
  { name: 'Jets', abbr: 'NYJ', city: 'New York', color: '#125740', colorAlt: '#FFFFFF', conference: 'AFC', division: 'East', tradeNote: 'from IND' },
  // Pick 17
  { name: 'Lions', abbr: 'DET', city: 'Detroit', color: '#0076B6', colorAlt: '#B0B7BC', conference: 'NFC', division: 'North' },
  // Pick 18
  { name: 'Vikings', abbr: 'MIN', city: 'Minnesota', color: '#4F2683', colorAlt: '#FFC62F', conference: 'NFC', division: 'North' },
  // Pick 19
  { name: 'Panthers', abbr: 'CAR', city: 'Carolina', color: '#0085CA', colorAlt: '#101820', conference: 'NFC', division: 'South' },
  // Pick 20 (Cowboys' 2nd pick, from GB)
  { name: 'Cowboys', abbr: 'DAL', city: 'Dallas', color: '#003594', colorAlt: '#869397', conference: 'NFC', division: 'East', tradeNote: 'from GB' },
  // Pick 21
  { name: 'Steelers', abbr: 'PIT', city: 'Pittsburgh', color: '#FFB612', colorAlt: '#101820', conference: 'AFC', division: 'North' },
  // Pick 22
  { name: 'Chargers', abbr: 'LAC', city: 'Los Angeles', color: '#0080C6', colorAlt: '#FFC20E', conference: 'AFC', division: 'West' },
  // Pick 23
  { name: 'Eagles', abbr: 'PHI', city: 'Philadelphia', color: '#004C54', colorAlt: '#A5ACAF', conference: 'NFC', division: 'East' },
  // Pick 24 (Browns' 2nd pick, from JAX)
  { name: 'Browns', abbr: 'CLE', city: 'Cleveland', color: '#311D00', colorAlt: '#FF3C00', conference: 'AFC', division: 'North', tradeNote: 'from JAX' },
  // Pick 25
  { name: 'Bears', abbr: 'CHI', city: 'Chicago', color: '#0B162A', colorAlt: '#C83803', conference: 'NFC', division: 'North' },
  // Pick 26
  { name: 'Bills', abbr: 'BUF', city: 'Buffalo', color: '#00338D', colorAlt: '#C60C30', conference: 'AFC', division: 'East' },
  // Pick 27
  { name: '49ers', abbr: 'SF', city: 'San Francisco', color: '#AA0000', colorAlt: '#B3995D', conference: 'NFC', division: 'West' },
  // Pick 28
  { name: 'Texans', abbr: 'HOU', city: 'Houston', color: '#03202F', colorAlt: '#A71930', conference: 'AFC', division: 'South' },
  // Pick 29 (Chiefs' 2nd pick, from LAR trade)
  { name: 'Chiefs', abbr: 'KC', city: 'Kansas City', color: '#E31837', colorAlt: '#FFB81C', conference: 'AFC', division: 'West', tradeNote: 'from LAR' },
  // Pick 30 (Dolphins' 2nd pick, from DEN)
  { name: 'Dolphins', abbr: 'MIA', city: 'Miami', color: '#008E97', colorAlt: '#FC4C02', conference: 'AFC', division: 'East', tradeNote: 'from DEN' },
  // Pick 31
  { name: 'Patriots', abbr: 'NE', city: 'New England', color: '#002244', colorAlt: '#C60C30', conference: 'AFC', division: 'East' },
  // Pick 32
  { name: 'Seahawks', abbr: 'SEA', city: 'Seattle', color: '#002244', colorAlt: '#69BE28', conference: 'NFC', division: 'West' },
];

// All 32 NFL franchises (for team selection UI)
// Includes teams that traded away their 1st-round pick (ATL, GB, JAX, IND)
export const ALL_NFL_FRANCHISES: NFLTeam[] = [
  // AFC East
  { name: 'Bills', abbr: 'BUF', city: 'Buffalo', color: '#00338D', colorAlt: '#C60C30', conference: 'AFC', division: 'East' },
  { name: 'Dolphins', abbr: 'MIA', city: 'Miami', color: '#008E97', colorAlt: '#FC4C02', conference: 'AFC', division: 'East' },
  { name: 'Jets', abbr: 'NYJ', city: 'New York', color: '#125740', colorAlt: '#FFFFFF', conference: 'AFC', division: 'East' },
  { name: 'Patriots', abbr: 'NE', city: 'New England', color: '#002244', colorAlt: '#C60C30', conference: 'AFC', division: 'East' },
  // AFC North
  { name: 'Ravens', abbr: 'BAL', city: 'Baltimore', color: '#241773', colorAlt: '#9E7C0C', conference: 'AFC', division: 'North' },
  { name: 'Bengals', abbr: 'CIN', city: 'Cincinnati', color: '#FB4F14', colorAlt: '#000000', conference: 'AFC', division: 'North' },
  { name: 'Browns', abbr: 'CLE', city: 'Cleveland', color: '#311D00', colorAlt: '#FF3C00', conference: 'AFC', division: 'North' },
  { name: 'Steelers', abbr: 'PIT', city: 'Pittsburgh', color: '#FFB612', colorAlt: '#101820', conference: 'AFC', division: 'North' },
  // AFC South
  { name: 'Texans', abbr: 'HOU', city: 'Houston', color: '#03202F', colorAlt: '#A71930', conference: 'AFC', division: 'South' },
  { name: 'Colts', abbr: 'IND', city: 'Indianapolis', color: '#002C5F', colorAlt: '#A2AAAD', conference: 'AFC', division: 'South' },
  { name: 'Jaguars', abbr: 'JAX', city: 'Jacksonville', color: '#006778', colorAlt: '#D7A22A', conference: 'AFC', division: 'South' },
  { name: 'Titans', abbr: 'TEN', city: 'Tennessee', color: '#4B92DB', colorAlt: '#C8102E', conference: 'AFC', division: 'South' },
  // AFC West
  { name: 'Broncos', abbr: 'DEN', city: 'Denver', color: '#FB4F14', colorAlt: '#002244', conference: 'AFC', division: 'West' },
  { name: 'Chiefs', abbr: 'KC', city: 'Kansas City', color: '#E31837', colorAlt: '#FFB81C', conference: 'AFC', division: 'West' },
  { name: 'Raiders', abbr: 'LV', city: 'Las Vegas', color: '#000000', colorAlt: '#A5ACAF', conference: 'AFC', division: 'West' },
  { name: 'Chargers', abbr: 'LAC', city: 'Los Angeles', color: '#0080C6', colorAlt: '#FFC20E', conference: 'AFC', division: 'West' },
  // NFC East
  { name: 'Cowboys', abbr: 'DAL', city: 'Dallas', color: '#003594', colorAlt: '#869397', conference: 'NFC', division: 'East' },
  { name: 'Giants', abbr: 'NYG', city: 'New York', color: '#0B2265', colorAlt: '#A71930', conference: 'NFC', division: 'East' },
  { name: 'Eagles', abbr: 'PHI', city: 'Philadelphia', color: '#004C54', colorAlt: '#A5ACAF', conference: 'NFC', division: 'East' },
  { name: 'Commanders', abbr: 'WAS', city: 'Washington', color: '#5A1414', colorAlt: '#FFB612', conference: 'NFC', division: 'East' },
  // NFC North
  { name: 'Bears', abbr: 'CHI', city: 'Chicago', color: '#0B162A', colorAlt: '#C83803', conference: 'NFC', division: 'North' },
  { name: 'Lions', abbr: 'DET', city: 'Detroit', color: '#0076B6', colorAlt: '#B0B7BC', conference: 'NFC', division: 'North' },
  { name: 'Packers', abbr: 'GB', city: 'Green Bay', color: '#203731', colorAlt: '#FFB612', conference: 'NFC', division: 'North' },
  { name: 'Vikings', abbr: 'MIN', city: 'Minnesota', color: '#4F2683', colorAlt: '#FFC62F', conference: 'NFC', division: 'North' },
  // NFC South
  { name: 'Falcons', abbr: 'ATL', city: 'Atlanta', color: '#A71930', colorAlt: '#000000', conference: 'NFC', division: 'South' },
  { name: 'Panthers', abbr: 'CAR', city: 'Carolina', color: '#0085CA', colorAlt: '#101820', conference: 'NFC', division: 'South' },
  { name: 'Saints', abbr: 'NO', city: 'New Orleans', color: '#D3BC8D', colorAlt: '#101820', conference: 'NFC', division: 'South' },
  { name: 'Buccaneers', abbr: 'TB', city: 'Tampa Bay', color: '#D50A0A', colorAlt: '#34302B', conference: 'NFC', division: 'South' },
  // NFC West
  { name: 'Cardinals', abbr: 'ARI', city: 'Arizona', color: '#97233F', colorAlt: '#000000', conference: 'NFC', division: 'West' },
  { name: 'Rams', abbr: 'LAR', city: 'Los Angeles', color: '#003594', colorAlt: '#FFA300', conference: 'NFC', division: 'West' },
  { name: '49ers', abbr: 'SF', city: 'San Francisco', color: '#AA0000', colorAlt: '#B3995D', conference: 'NFC', division: 'West' },
  { name: 'Seahawks', abbr: 'SEA', city: 'Seattle', color: '#002244', colorAlt: '#69BE28', conference: 'NFC', division: 'West' },
];

// Teams that traded away their 1st-round pick (no picks in Round 1)
export const NO_FIRST_ROUND_PICK = new Set(['ATL', 'GB', 'JAX', 'IND', 'DEN']);

// Get pick slots for a given team abbreviation
export function getPickSlots(abbr: string): number[] {
  const slots: number[] = [];
  NFL_TEAMS.forEach((t, i) => {
    if (t.abbr === abbr) slots.push(i + 1);
  });
  return slots;
}
