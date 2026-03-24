export interface DraftPlayer {
  id: number;
  name: string;
  position: string;
  school: string;
  height: string;
  weight: number;
  grade: number;     // scout grade 0-100
  strengths: string[];
  weaknesses: string[];
}

// 2026 NFL Draft prospects — based on Tankathon big board + ESPN/PFF consensus
// Real 2026 draft-eligible prospects, ordered by consensus ranking
// 224 players for full 7-round draft simulation
export const DRAFT_PLAYERS: DraftPlayer[] = [
  // ============================================================
  // ROUND 1 (picks 1-32) — grades 88-98
  // ============================================================

  // Top tier
  { id: 1, name: 'Arvell Reese', position: 'EDGE', school: 'Ohio State', height: '6\'4"', weight: 255, grade: 98, strengths: ['Elite burst off the edge', 'Bend and flexibility', 'High motor'], weaknesses: ['Run defense consistency'] },
  { id: 2, name: 'Caleb Downs', position: 'S', school: 'Ohio State', height: '6\'0"', weight: 200, grade: 97, strengths: ['Ball-hawk instincts', 'Range in coverage', 'Tackling'], weaknesses: ['Size limitations vs bigger receivers'] },
  { id: 3, name: 'Fernando Mendoza', position: 'QB', school: 'Indiana', height: '6\'3"', weight: 220, grade: 96, strengths: ['Arm talent', 'Pocket presence', 'Decision-making'], weaknesses: ['Deep ball accuracy'] },
  { id: 4, name: 'David Bailey', position: 'EDGE', school: 'Texas Tech', height: '6\'5"', weight: 260, grade: 95, strengths: ['Power rush moves', 'Length at the point of attack', 'Strip-sack ability'], weaknesses: ['Lateral agility'] },
  { id: 5, name: 'Rueben Bain Jr.', position: 'EDGE', school: 'Miami', height: '6\'2"', weight: 250, grade: 95, strengths: ['First-step quickness', 'Motor and effort', 'Versatile alignment'], weaknesses: ['Undersized for some schemes'] },
  { id: 6, name: 'Jeremiyah Love', position: 'RB', school: 'Notre Dame', height: '5\'11"', weight: 210, grade: 94, strengths: ['Home-run speed', 'Vision between the tackles', 'Receiving ability'], weaknesses: ['Pass protection technique'] },
  { id: 7, name: 'Sonny Styles', position: 'LB', school: 'Ohio State', height: '6\'4"', weight: 225, grade: 94, strengths: ['Freak athleticism', 'Coverage range', 'Versatility at multiple positions'], weaknesses: ['Processing speed in traffic'] },
  { id: 8, name: 'Francis Mauigoa', position: 'OT', school: 'Miami', height: '6\'5"', weight: 330, grade: 94, strengths: ['Mauling run blocker', 'Anchor strength', 'NFL-ready frame'], weaknesses: ['Pass set footwork'] },
  { id: 9, name: 'Carnell Tate', position: 'WR', school: 'Ohio State', height: '6\'2"', weight: 195, grade: 93, strengths: ['Route running precision', 'Contested catches', 'Red zone threat'], weaknesses: ['After-the-catch elusiveness'] },
  { id: 10, name: 'Spencer Fano', position: 'OT', school: 'Utah', height: '6\'5"', weight: 315, grade: 93, strengths: ['Technically polished', 'Quick feet in pass pro', 'Positional versatility'], weaknesses: ['Needs to add mass'] },

  // High first round
  { id: 11, name: 'Mansoor Delane', position: 'CB', school: 'LSU', height: '6\'2"', weight: 195, grade: 92, strengths: ['Press coverage skills', 'Length and physicality', 'Ball production'], weaknesses: ['Recovery speed'] },
  { id: 12, name: 'Makai Lemon', position: 'WR', school: 'USC', height: '5\'11"', weight: 185, grade: 92, strengths: ['Explosive after the catch', 'Route separation', 'Return ability'], weaknesses: ['Frame limits outside receiver role'] },
  { id: 13, name: 'Monroe Freeling', position: 'OT', school: 'Georgia', height: '6\'7"', weight: 315, grade: 91, strengths: ['Elite length', 'Smooth pass sets', 'Athletic upside'], weaknesses: ['Anchor against power rushers'] },
  { id: 14, name: 'Vega Ioane', position: 'OG', school: 'Penn State', height: '6\'5"', weight: 320, grade: 91, strengths: ['Dominant run blocker', 'Pulling ability', 'Nasty streak'], weaknesses: ['Pass pro against speed'] },
  { id: 15, name: 'Jordyn Tyson', position: 'WR', school: 'Arizona State', height: '6\'0"', weight: 190, grade: 91, strengths: ['Deep threat speed', 'Tracking the ball', 'Big-play ability'], weaknesses: ['Physical press coverage'] },
  { id: 16, name: 'Dillon Thieneman', position: 'S', school: 'Oregon', height: '6\'2"', weight: 210, grade: 90, strengths: ['Football IQ', 'Range and instincts', 'Run support'], weaknesses: ['Man coverage agility'] },
  { id: 17, name: 'Jermod McCoy', position: 'CB', school: 'Tennessee', height: '6\'0"', weight: 188, grade: 90, strengths: ['Mirror technique', 'Quick transitions', 'Zone awareness'], weaknesses: ['Size at the catch point'] },
  { id: 18, name: 'Kenyon Sadiq', position: 'TE', school: 'Oregon', height: '6\'4"', weight: 245, grade: 90, strengths: ['Receiving threat', 'Route runner for position', 'YAC ability'], weaknesses: ['Inline blocking'] },
  { id: 19, name: 'Keldric Faulk', position: 'EDGE', school: 'Auburn', height: '6\'4"', weight: 258, grade: 90, strengths: ['Power-speed combo', 'Long arms', 'Run defense'], weaknesses: ['Pass rush plan diversity'] },
  { id: 20, name: 'Akheem Mesidor', position: 'EDGE', school: 'Miami', height: '6\'3"', weight: 260, grade: 89, strengths: ['Interior pass rush', 'Effort and motor', 'Versatile deployment'], weaknesses: ['Edge setting vs run'] },

  // Mid first round
  { id: 21, name: 'Kadyn Proctor', position: 'OT', school: 'Alabama', height: '6\'7"', weight: 335, grade: 89, strengths: ['Massive frame', 'Road-grader in the run game', 'Experience at LT'], weaknesses: ['Lateral quickness vs speed'] },
  { id: 22, name: 'Avieon Terrell', position: 'CB', school: 'Clemson', height: '6\'1"', weight: 190, grade: 89, strengths: ['Fluid hips', 'Instincts in zone', 'Tackling ability'], weaknesses: ['Deep speed matchups'] },
  { id: 23, name: 'Peter Woods', position: 'DT', school: 'Clemson', height: '6\'3"', weight: 295, grade: 88, strengths: ['Interior penetration', 'Quick first step', 'Motor'], weaknesses: ['Double teams at the point'] },
  { id: 24, name: 'Omar Cooper Jr.', position: 'WR', school: 'Indiana', height: '6\'0"', weight: 185, grade: 88, strengths: ['Quickness out of breaks', 'Reliable hands', 'Slot versatility'], weaknesses: ['Contested catch ability'] },
  { id: 25, name: 'Caleb Lomu', position: 'OT', school: 'Utah', height: '6\'5"', weight: 320, grade: 88, strengths: ['Power at the point', 'Nasty finisher', 'Run blocking'], weaknesses: ['Pass protection technique'] },
  { id: 26, name: 'Emmanuel McNeil-Warren', position: 'S', school: 'Toledo', height: '6\'1"', weight: 205, grade: 88, strengths: ['Playmaking instincts', 'Versatile coverage', 'Physicality'], weaknesses: ['Level of competition'] },
  { id: 27, name: 'T.J. Parker', position: 'EDGE', school: 'Clemson', height: '6\'5"', weight: 265, grade: 87, strengths: ['Length and power', 'NFL frame', 'Bull rush'], weaknesses: ['Bend around the corner'] },
  { id: 28, name: 'KC Concepcion', position: 'WR', school: 'Texas A&M', height: '6\'1"', weight: 200, grade: 87, strengths: ['Polished route tree', 'Hands catcher', 'Competitive toughness'], weaknesses: ['Separation speed'] },
  { id: 29, name: 'Blake Miller', position: 'OT', school: 'Clemson', height: '6\'6"', weight: 318, grade: 87, strengths: ['Experienced starter', 'Consistent technique', 'Smart player'], weaknesses: ['Athletic ceiling'] },
  { id: 30, name: 'CJ Allen', position: 'LB', school: 'Georgia', height: '6\'2"', weight: 230, grade: 87, strengths: ['Downhill thumper', 'Instincts vs the run', 'Leadership'], weaknesses: ['Coverage range'] },

  // Late first / early second
  { id: 31, name: 'Kayden McDonald', position: 'DT', school: 'Ohio State', height: '6\'3"', weight: 310, grade: 86, strengths: ['Interior power', 'Anchor strength', 'Gap control'], weaknesses: ['Pass rush upside'] },
  { id: 32, name: 'Denzel Boston', position: 'WR', school: 'Washington', height: '6\'3"', weight: 210, grade: 86, strengths: ['Contested catch specialist', 'Body control', 'Red zone weapon'], weaknesses: ['Route crispness'] },

  // ============================================================
  // ROUND 2 (picks 33-64) — grades 82-90
  // ============================================================

  { id: 33, name: 'Ty Simpson', position: 'QB', school: 'Alabama', height: '6\'2"', weight: 215, grade: 86, strengths: ['Dual-threat ability', 'Arm strength', 'Poise under pressure'], weaknesses: ['Accuracy on intermediate throws'] },
  { id: 34, name: 'Caleb Banks', position: 'DT', school: 'Florida', height: '6\'3"', weight: 295, grade: 85, strengths: ['Explosive first step', 'Interior disruption', 'Motor'], weaknesses: ['Consistency'] },
  { id: 35, name: 'Colton Hood', position: 'CB', school: 'Tennessee', height: '6\'2"', weight: 195, grade: 85, strengths: ['Length in press', 'Ball skills', 'Physical at the line'], weaknesses: ['Recovery speed vs burners'] },
  { id: 36, name: 'Cashius Howell', position: 'EDGE', school: 'Texas A&M', height: '6\'2"', weight: 240, grade: 85, strengths: ['Speed-to-power conversion', 'Relentless effort', 'Strip-sack ability'], weaknesses: ['Anchor against the run'] },
  { id: 37, name: 'Zion Young', position: 'EDGE', school: 'Missouri', height: '6\'4"', weight: 250, grade: 85, strengths: ['Explosive athlete', 'Closing speed', 'Upside'], weaknesses: ['Needs to develop rush plan'] },
  { id: 38, name: 'Max Iheanachor', position: 'OT', school: 'Arizona State', height: '6\'6"', weight: 320, grade: 84, strengths: ['Athletic tackle', 'Reach blocking', 'Upside'], weaknesses: ['Technique consistency'] },
  { id: 39, name: 'Lee Hunter', position: 'DT', school: 'Texas Tech', height: '6\'4"', weight: 315, grade: 84, strengths: ['Massive anchor', 'Run stuffing', 'Power at the point'], weaknesses: ['Pass rush moves'] },
  { id: 40, name: 'Brandon Cisse', position: 'CB', school: 'South Carolina', height: '6\'1"', weight: 185, grade: 84, strengths: ['Speed and closing burst', 'Instincts', 'Ball production'], weaknesses: ['Physical receivers'] },
  { id: 41, name: 'Dante Moore', position: 'QB', school: 'Oregon', height: '6\'2"', weight: 210, grade: 83, strengths: ['Arm talent', 'Quick release', 'Pocket mobility'], weaknesses: ['Decision-making under pressure'] },
  { id: 42, name: 'Cam Skattebo', position: 'RB', school: 'Arizona State', height: '5\'11"', weight: 215, grade: 83, strengths: ['Bruising runner', 'Contact balance', 'Receiving ability'], weaknesses: ['Long speed'] },
  { id: 43, name: 'Kaleb Johnson', position: 'RB', school: 'Iowa', height: '6\'1"', weight: 225, grade: 83, strengths: ['Power runner', 'Vision', 'Yards after contact'], weaknesses: ['Pass catching development'] },
  { id: 44, name: 'Gunnar Helm', position: 'TE', school: 'Texas', height: '6\'5"', weight: 245, grade: 82, strengths: ['Smooth route runner', 'Reliable hands', 'Move TE skills'], weaknesses: ['Blocking at the line'] },
  { id: 45, name: 'Tyler Warren', position: 'TE', school: 'Penn State', height: '6\'6"', weight: 260, grade: 82, strengths: ['Swiss army knife usage', 'Blocking and receiving', 'Football IQ'], weaknesses: ['Long speed'] },
  { id: 46, name: 'Conner Weigman', position: 'QB', school: 'Texas A&M', height: '6\'2"', weight: 210, grade: 82, strengths: ['Touch and anticipation', 'Play-action effectiveness', 'Mobility'], weaknesses: ['Durability concerns'] },
  { id: 47, name: 'Donovan Jackson', position: 'OG', school: 'Ohio State', height: '6\'4"', weight: 320, grade: 82, strengths: ['Powerful hands', 'Anchor in pass pro', 'Experience'], weaknesses: ['Lateral mobility'] },
  { id: 48, name: 'Tyler Booker', position: 'OG', school: 'Alabama', height: '6\'5"', weight: 325, grade: 81, strengths: ['Mauling strength', 'Run blocking power', 'Nastiness'], weaknesses: ['Quick interior rushers'] },
  { id: 49, name: 'Grey Zabel', position: 'OG', school: 'North Dakota St', height: '6\'5"', weight: 315, grade: 81, strengths: ['Technically sound', 'Smart and consistent', 'Pulling ability'], weaknesses: ['Level of competition'] },
  { id: 50, name: 'Malaki Starks', position: 'S', school: 'Georgia', height: '6\'1"', weight: 205, grade: 81, strengths: ['Playmaking ability', 'Instincts in coverage', 'Physicality'], weaknesses: ['Consistency in run support'] },
  { id: 51, name: 'Benjamin Morrison', position: 'CB', school: 'Notre Dame', height: '6\'0"', weight: 190, grade: 80, strengths: ['Lockdown man coverage', 'Competitive fire', 'Ball skills'], weaknesses: ['Size against bigger receivers'] },
  { id: 52, name: 'Deone Walker', position: 'DT', school: 'Kentucky', height: '6\'6"', weight: 345, grade: 80, strengths: ['Massive size', 'Space eater', 'Double team absorber'], weaknesses: ['Conditioning', 'Pass rush burst'] },
  { id: 53, name: 'Emeka Egbuka', position: 'WR', school: 'Ohio State', height: '6\'1"', weight: 206, grade: 80, strengths: ['Polished route runner', 'Reliable hands', 'Contested catches'], weaknesses: ['Separation speed'] },
  { id: 54, name: 'Jalon Walker', position: 'LB', school: 'Georgia', height: '6\'2"', weight: 245, grade: 80, strengths: ['Pass rush ability from LB', 'Explosive athlete', 'Versatility'], weaknesses: ['Coverage consistency'] },
  { id: 55, name: 'Garrett Nussmeier', position: 'QB', school: 'LSU', height: '6\'2"', weight: 195, grade: 79, strengths: ['Quick processor', 'Accurate in rhythm', 'Competitive toughness'], weaknesses: ['Arm strength limits', 'Off-platform throws'] },
  { id: 56, name: 'Aireontae Ersery', position: 'OT', school: 'Minnesota', height: '6\'6"', weight: 330, grade: 79, strengths: ['Powerful anchor', 'Run blocking dominance', 'NFL frame'], weaknesses: ['Footwork in pass pro'] },
  { id: 57, name: 'Darien Porter', position: 'CB', school: 'Iowa State', height: '6\'3"', weight: 195, grade: 79, strengths: ['Elite size for position', 'Press coverage', 'Physicality'], weaknesses: ['Hip stiffness'] },
  { id: 58, name: 'Howard Cross III', position: 'DT', school: 'Notre Dame', height: '6\'2"', weight: 295, grade: 78, strengths: ['Quick penetrator', 'Interior pass rush', 'Effort'], weaknesses: ['Size limitations'] },
  { id: 59, name: 'Isaiah Horton', position: 'WR', school: 'Miami', height: '6\'2"', weight: 205, grade: 78, strengths: ['Downfield threat', 'Body control', 'High point ability'], weaknesses: ['Route refinement'] },
  { id: 60, name: 'Elic Ayomanor', position: 'WR', school: 'Stanford', height: '6\'2"', weight: 210, grade: 78, strengths: ['Catch radius', 'Competitive toughness', 'Jump ball ability'], weaknesses: ['Separation quickness'] },

  // Additional Round 2 depth
  { id: 61, name: 'Jaylen Reed', position: 'S', school: 'Penn State', height: '6\'0"', weight: 200, grade: 84, strengths: ['Versatile safety', 'Range in center field', 'Tackling'], weaknesses: ['Man coverage technique'] },
  { id: 62, name: 'Shemar Stewart', position: 'EDGE', school: 'Texas A&M', height: '6\'5"', weight: 270, grade: 84, strengths: ['Length and power', 'NFL body', 'Upside'], weaknesses: ['Consistency of effort'] },
  { id: 63, name: 'Princely Umanmielen', position: 'EDGE', school: 'Ole Miss', height: '6\'4"', weight: 255, grade: 83, strengths: ['Explosive first step', 'Bend', 'Production'], weaknesses: ['Counter moves'] },
  { id: 64, name: 'Kelvin Banks Jr.', position: 'OT', school: 'Texas', height: '6\'5"', weight: 320, grade: 83, strengths: ['Pass pro technique', 'Quick feet', 'Experience'], weaknesses: ['Run blocking nastiness'] },

  // ============================================================
  // ROUND 3 (picks 65-96) — grades 76-86
  // ============================================================

  { id: 65, name: 'Drew Allar', position: 'QB', school: 'Penn State', height: '6\'5"', weight: 235, grade: 82, strengths: ['Big arm', 'NFL size', 'Red zone throws'], weaknesses: ['Pocket escapability', 'Reading coverages'] },
  { id: 66, name: 'Quinshon Judkins', position: 'RB', school: 'Ohio State', height: '5\'11"', weight: 215, grade: 82, strengths: ['Power between tackles', 'Goal line weapon', 'Durability'], weaknesses: ['Top-end speed'] },
  { id: 67, name: 'Isaiah Bond', position: 'WR', school: 'Texas', height: '5\'11"', weight: 178, grade: 82, strengths: ['Burner speed', 'Separation ability', 'Return value'], weaknesses: ['Physicality at catch point'] },
  { id: 68, name: 'Tyleik Williams', position: 'DT', school: 'Ohio State', height: '6\'3"', weight: 305, grade: 81, strengths: ['Interior power', 'Consistent performer', 'Gap discipline'], weaknesses: ['Pass rush ceiling'] },
  { id: 69, name: 'Donovan Ezeiruaku', position: 'EDGE', school: 'Boston College', height: '6\'2"', weight: 248, grade: 81, strengths: ['Relentless motor', 'Production', 'Effort plays'], weaknesses: ['Length', 'Power at POA'] },
  { id: 70, name: 'Will Campbell', position: 'OG', school: 'LSU', height: '6\'6"', weight: 325, grade: 81, strengths: ['Massive guard', 'Road grader', 'Pulling power'], weaknesses: ['Speed in space'] },
  { id: 71, name: 'Marcus Mbow', position: 'OG', school: 'Purdue', height: '6\'5"', weight: 315, grade: 80, strengths: ['Technique', 'Smart player', 'Consistency'], weaknesses: ['Athletic ceiling'] },
  { id: 72, name: 'Jaylin Noel', position: 'WR', school: 'Iowa State', height: '5\'10"', weight: 180, grade: 80, strengths: ['Quickness', 'Slot production', 'After-the-catch'], weaknesses: ['Size limitations'] },
  { id: 73, name: 'Jaxson Dart', position: 'QB', school: 'Ole Miss', height: '6\'2"', weight: 220, grade: 80, strengths: ['Playmaking ability', 'Dual-threat upside', 'Accuracy on the run'], weaknesses: ['Turnover prone', 'Footwork mechanics'] },
  { id: 74, name: 'Zy Alexander', position: 'CB', school: 'LSU', height: '6\'2"', weight: 195, grade: 80, strengths: ['Physical corner', 'Length at the line', 'Ball production'], weaknesses: ['Speed in off coverage'] },
  { id: 75, name: 'Nick Emmanwori', position: 'S', school: 'South Carolina', height: '6\'3"', weight: 220, grade: 80, strengths: ['Size and range', 'Hard hitter', 'Versatility'], weaknesses: ['Coverage technique'] },
  { id: 76, name: 'Harold Fannin Jr.', position: 'TE', school: 'Bowling Green', height: '6\'4"', weight: 235, grade: 79, strengths: ['Receiving skills', 'Route running', 'YAC ability'], weaknesses: ['Blocking development', 'Level of competition'] },
  { id: 77, name: 'Trey Amos', position: 'CB', school: 'Ole Miss', height: '6\'1"', weight: 190, grade: 79, strengths: ['Physical in press', 'Instincts', 'Tackling for a corner'], weaknesses: ['Deep speed recovery'] },
  { id: 78, name: 'Derrick Harmon', position: 'DT', school: 'Oregon', height: '6\'4"', weight: 310, grade: 79, strengths: ['Two-gap anchor', 'Run stuffing', 'Power'], weaknesses: ['Pass rush burst'] },
  { id: 79, name: 'Landon Jackson', position: 'EDGE', school: 'Arkansas', height: '6\'6"', weight: 265, grade: 79, strengths: ['Length and frame', 'Power rush', 'Run defense'], weaknesses: ['Bend and flexibility'] },
  { id: 80, name: 'Ashton Jeanty', position: 'RB', school: 'Boise State', height: '5\'9"', weight: 211, grade: 78, strengths: ['Vision and patience', 'Explosive cuts', 'Production'], weaknesses: ['Size', 'Pass protection'] },
  { id: 81, name: 'Jack Sawyer', position: 'EDGE', school: 'Ohio State', height: '6\'5"', weight: 260, grade: 78, strengths: ['Versatility', 'Experience', 'Run defense'], weaknesses: ['Consistent pass rush production'] },
  { id: 82, name: 'Tre Harris', position: 'WR', school: 'Ole Miss', height: '6\'3"', weight: 210, grade: 78, strengths: ['Contested catches', 'Size and body control', 'Red zone threat'], weaknesses: ['Route crispness', 'Separation'] },
  { id: 83, name: 'Devin Neal', position: 'RB', school: 'Kansas', height: '5\'11"', weight: 210, grade: 77, strengths: ['All-purpose back', 'Receiving ability', 'Vision'], weaknesses: ['Top-end speed', 'Pass pro'] },
  { id: 84, name: 'Tate Ratledge', position: 'OG', school: 'Georgia', height: '6\'6"', weight: 320, grade: 77, strengths: ['Mauling run blocker', 'Anchor', 'Experience'], weaknesses: ['Injury history', 'Mobility'] },
  { id: 85, name: 'Andrew Mukuba', position: 'S', school: 'Texas', height: '6\'0"', weight: 190, grade: 77, strengths: ['Ball skills', 'Coverage instincts', 'Versatility'], weaknesses: ['Physicality in run support'] },
  { id: 86, name: 'Tyleik Lawson', position: 'LB', school: 'Oregon State', height: '6\'2"', weight: 235, grade: 77, strengths: ['Sideline-to-sideline speed', 'Tackling', 'Blitz ability'], weaknesses: ['Coverage development'] },
  { id: 87, name: 'Wyatt Milum', position: 'OT', school: 'West Virginia', height: '6\'6"', weight: 315, grade: 77, strengths: ['Athletic tackle', 'Pass pro fundamentals', 'Toughness'], weaknesses: ['Power at the point'] },
  { id: 88, name: 'Mason Taylor', position: 'TE', school: 'LSU', height: '6\'5"', weight: 250, grade: 76, strengths: ['Receiving ability', 'Route running', 'Size'], weaknesses: ['Run blocking effort'] },
  { id: 89, name: 'Jalen Milroe', position: 'QB', school: 'Alabama', height: '6\'2"', weight: 215, grade: 76, strengths: ['Elite rushing ability', 'Arm strength', 'Athleticism'], weaknesses: ['Accuracy', 'Progression reads'] },
  { id: 90, name: 'Quincy Riley', position: 'CB', school: 'Louisville', height: '6\'0"', weight: 185, grade: 76, strengths: ['Ball hawk', 'Zone instincts', 'Turnover production'], weaknesses: ['Man coverage technique'] },
  { id: 91, name: 'Xavier Watts', position: 'S', school: 'Notre Dame', height: '6\'0"', weight: 195, grade: 76, strengths: ['Ball production', 'Instincts', 'Leadership'], weaknesses: ['Size and physicality'] },
  { id: 92, name: 'Kenneth Grant', position: 'DT', school: 'Michigan', height: '6\'3"', weight: 340, grade: 76, strengths: ['Massive space eater', 'Anchor', 'Double team absorber'], weaknesses: ['Conditioning', 'Pass rush'] },
  { id: 93, name: 'Terrance Ferguson', position: 'OT', school: 'Oregon', height: '6\'5"', weight: 310, grade: 76, strengths: ['Athletic tackle', 'Footwork', 'Pass pro'], weaknesses: ['Run blocking finish'] },
  { id: 94, name: 'Xavier Legette II', position: 'WR', school: 'South Carolina', height: '6\'1"', weight: 200, grade: 76, strengths: ['Deep speed', 'After-the-catch', 'Big play ability'], weaknesses: ['Consistency', 'Route tree depth'] },
  { id: 95, name: 'Jared Ivey', position: 'EDGE', school: 'Ole Miss', height: '6\'5"', weight: 265, grade: 76, strengths: ['Size and length', 'Run defense', 'Power'], weaknesses: ['Pass rush refinement'] },
  { id: 96, name: 'Danny Stutsman', position: 'LB', school: 'Oklahoma', height: '6\'3"', weight: 235, grade: 76, strengths: ['Tackling machine', 'Leadership', 'Run defense'], weaknesses: ['Coverage speed'] },

  // ============================================================
  // ROUND 4 (picks 97-128) — grades 70-80
  // ============================================================

  { id: 97, name: 'Cade Klubnik', position: 'QB', school: 'Clemson', height: '6\'2"', weight: 200, grade: 78, strengths: ['Pocket poise', 'Accuracy', 'Competitive toughness'], weaknesses: ['Arm strength limits', 'Athletic ceiling'] },
  { id: 98, name: 'Omarion Hampton', position: 'RB', school: 'North Carolina', height: '6\'0"', weight: 220, grade: 77, strengths: ['Power and speed combo', 'Between the tackles', 'Home run ability'], weaknesses: ['Pass protection', 'Fumbling'] },
  { id: 99, name: 'Evan Stewart', position: 'WR', school: 'Oregon', height: '6\'0"', weight: 190, grade: 77, strengths: ['Separation quickness', 'Route running', 'Hands'], weaknesses: ['Physicality', 'Contested catches'] },
  { id: 100, name: 'Colbie Young', position: 'WR', school: 'Miami', height: '6\'3"', weight: 215, grade: 76, strengths: ['Size and catch radius', 'Jump ball ability', 'Red zone threat'], weaknesses: ['Route precision', 'Separation'] },
  { id: 101, name: 'Tyler Shough', position: 'QB', school: 'Louisville', height: '6\'5"', weight: 225, grade: 76, strengths: ['NFL size', 'Arm talent', 'Mobility'], weaknesses: ['Decision-making', 'Injury history'] },
  { id: 102, name: 'Jaydon Blue', position: 'RB', school: 'Texas', height: '5\'11"', weight: 200, grade: 75, strengths: ['Explosive speed', 'One-cut ability', 'Vision'], weaknesses: ['Size', 'Pass catching'] },
  { id: 103, name: 'Da\'Quan Gonzalez', position: 'TE', school: 'UCF', height: '6\'5"', weight: 250, grade: 75, strengths: ['Athletic tight end', 'Receiving skills', 'Size'], weaknesses: ['Blocking technique', 'Level of competition'] },
  { id: 104, name: 'Sedrick Van Pran', position: 'OG', school: 'Georgia', height: '6\'4"', weight: 310, grade: 75, strengths: ['Center/guard versatility', 'Intelligence', 'Technique'], weaknesses: ['Power at the point'] },
  { id: 105, name: 'Earnest Greene IV', position: 'OT', school: 'Georgia', height: '6\'5"', weight: 330, grade: 75, strengths: ['Powerful blocker', 'NFL frame', 'Run game'], weaknesses: ['Pass pro footwork', 'Athletic ceiling'] },
  { id: 106, name: 'Tyler Nubin', position: 'S', school: 'Minnesota', height: '6\'2"', weight: 200, grade: 75, strengths: ['Range', 'Ball production', 'Football IQ'], weaknesses: ['Tackling consistency'] },
  { id: 107, name: 'Jalen McMillan', position: 'WR', school: 'Washington', height: '6\'1"', weight: 195, grade: 74, strengths: ['Route running', 'Reliable hands', 'Contested catches'], weaknesses: ['Speed limitations'] },
  { id: 108, name: 'Lander Barton', position: 'LB', school: 'Utah', height: '6\'3"', weight: 230, grade: 74, strengths: ['Sideline-to-sideline range', 'Instincts', 'Tackling'], weaknesses: ['Coverage skills'] },
  { id: 109, name: 'Dewayne Carter', position: 'DT', school: 'Duke', height: '6\'2"', weight: 300, grade: 74, strengths: ['Interior pass rush', 'Quick hands', 'Motor'], weaknesses: ['Size for position'] },
  { id: 110, name: 'Jahdae Barron', position: 'CB', school: 'Texas', height: '5\'11"', weight: 195, grade: 74, strengths: ['Versatile DB', 'Slot coverage', 'Tackling'], weaknesses: ['Outside corner size'] },
  { id: 111, name: 'Nate Wiggins', position: 'CB', school: 'Clemson', height: '6\'1"', weight: 180, grade: 73, strengths: ['Length and speed', 'Press technique', 'Ball skills'], weaknesses: ['Physicality vs the run'] },
  { id: 112, name: 'Raheim Sanders', position: 'RB', school: 'South Carolina', height: '6\'2"', weight: 225, grade: 73, strengths: ['Power back', 'Size', 'Short yardage'], weaknesses: ['Burst', 'Pass catching'] },
  { id: 113, name: 'Mitchell Evans', position: 'TE', school: 'Notre Dame', height: '6\'5"', weight: 250, grade: 73, strengths: ['Red zone weapon', 'Size', 'Blocking effort'], weaknesses: ['Route running polish'] },
  { id: 114, name: 'Jaylen Key', position: 'S', school: 'Alabama', height: '6\'1"', weight: 205, grade: 73, strengths: ['Hard hitter', 'Run support', 'Blitz ability'], weaknesses: ['Coverage range'] },
  { id: 115, name: 'Bryce Foster', position: 'OG', school: 'Texas A&M', height: '6\'5"', weight: 330, grade: 72, strengths: ['Power', 'Anchor', 'NFL body'], weaknesses: ['Mobility', 'Conditioning'] },
  { id: 116, name: 'Dasan McCullough', position: 'EDGE', school: 'Indiana', height: '6\'5"', weight: 240, grade: 72, strengths: ['Length', 'Athletic upside', 'Versatility'], weaknesses: ['Power', 'Technique'] },
  { id: 117, name: 'Bradyn Swinson', position: 'EDGE', school: 'LSU', height: '6\'3"', weight: 245, grade: 72, strengths: ['Speed rusher', 'Closing speed', 'Motor'], weaknesses: ['Power at the point'] },
  { id: 118, name: 'Jarquez Hunter', position: 'RB', school: 'Auburn', height: '5\'10"', weight: 205, grade: 71, strengths: ['Elusiveness', 'Change of direction', 'Receiving'], weaknesses: ['Size', 'Pass protection'] },
  { id: 119, name: 'Cade Harris', position: 'OT', school: 'NC State', height: '6\'6"', weight: 310, grade: 71, strengths: ['Athletic tackle', 'Upside', 'Pass pro ability'], weaknesses: ['Inconsistency', 'Run blocking finish'] },
  { id: 120, name: 'Maxwell Hairston', position: 'CB', school: 'Kentucky', height: '5\'11"', weight: 185, grade: 71, strengths: ['Ball hawk', 'Zone coverage', 'Turnovers'], weaknesses: ['Size', 'Press coverage'] },
  { id: 121, name: 'Kris Jenkins', position: 'DT', school: 'Michigan', height: '6\'3"', weight: 305, grade: 71, strengths: ['Interior push', 'Run defense', 'Effort'], weaknesses: ['Consistency'] },
  { id: 122, name: 'Justin Jefferson', position: 'LB', school: 'Alabama', height: '6\'1"', weight: 225, grade: 70, strengths: ['Speed', 'Blitz production', 'Instincts vs the run'], weaknesses: ['Coverage', 'Size'] },
  { id: 123, name: 'Emory Jones Jr.', position: 'WR', school: 'TCU', height: '6\'0"', weight: 190, grade: 70, strengths: ['Speed', 'Deep threat', 'Return ability'], weaknesses: ['Contested catches', 'Route tree'] },
  { id: 124, name: 'Keon Sabb', position: 'S', school: 'Michigan', height: '6\'2"', weight: 200, grade: 70, strengths: ['Length for safety', 'Athletic upside', 'Range'], weaknesses: ['Technique', 'Consistency'] },
  { id: 125, name: 'Travis Hunter', position: 'CB', school: 'Colorado', height: '6\'1"', weight: 185, grade: 70, strengths: ['Two-way player', 'Ball skills', 'Competitiveness'], weaknesses: ['Long-term position fit'] },
  { id: 126, name: 'Josaiah Stewart', position: 'EDGE', school: 'Michigan', height: '6\'1"', weight: 245, grade: 70, strengths: ['Motor', 'Effort plays', 'Strip-sack ability'], weaknesses: ['Length', 'Power'] },
  { id: 127, name: 'Jordan Burch', position: 'DT', school: 'Oregon', height: '6\'5"', weight: 290, grade: 70, strengths: ['Explosiveness', 'Upside', 'Length'], weaknesses: ['Production', 'Consistency'] },
  { id: 128, name: 'Cooper Beebe', position: 'OG', school: 'Kansas State', height: '6\'4"', weight: 325, grade: 70, strengths: ['Versatile lineman', 'Smart', 'Toughness'], weaknesses: ['Athletic ceiling'] },

  // ============================================================
  // ROUND 5 (picks 129-160) — grades 64-74
  // ============================================================

  { id: 129, name: 'Michael Pratt', position: 'QB', school: 'Tulane', height: '6\'2"', weight: 215, grade: 74, strengths: ['Winner mentality', 'Accuracy', 'Pocket poise'], weaknesses: ['Arm strength', 'Level of competition'] },
  { id: 130, name: 'Jaylen Wright', position: 'RB', school: 'Tennessee', height: '5\'11"', weight: 205, grade: 74, strengths: ['Explosive speed', 'Home-run threat', 'Vision'], weaknesses: ['Pass protection', 'Between the tackles running'] },
  { id: 131, name: 'Rome Odunze Jr.', position: 'WR', school: 'Michigan State', height: '6\'3"', weight: 205, grade: 73, strengths: ['Catch radius', 'Jump ball ability', 'Red zone'], weaknesses: ['Route running development'] },
  { id: 132, name: 'Elijah Arroyo', position: 'TE', school: 'Miami', height: '6\'5"', weight: 250, grade: 73, strengths: ['Athletic tight end', 'Receiving skills', 'YAC'], weaknesses: ['Blocking consistency'] },
  { id: 133, name: 'Troy Fautanu', position: 'OT', school: 'Washington', height: '6\'4"', weight: 315, grade: 73, strengths: ['Versatile lineman', 'Technique', 'Toughness'], weaknesses: ['Length for OT'] },
  { id: 134, name: 'Cecil Singleton', position: 'EDGE', school: 'TCU', height: '6\'3"', weight: 250, grade: 73, strengths: ['Explosive burst', 'Motor', 'Upside'], weaknesses: ['Technique refinement'] },
  { id: 135, name: 'Thomas Harper', position: 'CB', school: 'Oregon', height: '5\'11"', weight: 190, grade: 72, strengths: ['Speed', 'Instincts', 'Ball skills'], weaknesses: ['Size', 'Physical receivers'] },
  { id: 136, name: 'Isaiah McGuire', position: 'EDGE', school: 'Missouri', height: '6\'4"', weight: 268, grade: 72, strengths: ['Length', 'Run defense', 'Power rush'], weaknesses: ['Bend', 'Consistency'] },
  { id: 137, name: 'Maason Smith', position: 'DT', school: 'LSU', height: '6\'5"', weight: 310, grade: 72, strengths: ['Size and power', 'Interior disruption', 'Upside'], weaknesses: ['Injury history', 'Consistency'] },
  { id: 138, name: 'Rod Moore', position: 'S', school: 'Michigan', height: '5\'11"', weight: 195, grade: 72, strengths: ['Instincts', 'Ball production', 'Processing speed'], weaknesses: ['Size', 'Physicality'] },
  { id: 139, name: 'Kamren Kinchens', position: 'S', school: 'Miami', height: '5\'11"', weight: 200, grade: 71, strengths: ['Ball hawk', 'Range', 'Playmaking'], weaknesses: ['Tackling technique', 'Size'] },
  { id: 140, name: 'Jordan Morgan', position: 'OT', school: 'Arizona', height: '6\'5"', weight: 315, grade: 71, strengths: ['Athletic tackle', 'Footwork', 'Pass pro'], weaknesses: ['Power at POA'] },
  { id: 141, name: 'Jamari Thrash', position: 'WR', school: 'Louisville', height: '6\'1"', weight: 185, grade: 71, strengths: ['Speed merchant', 'Deep threat', 'Return value'], weaknesses: ['Route tree', 'Physicality'] },
  { id: 142, name: 'Jason Marshall Jr.', position: 'CB', school: 'Florida', height: '6\'1"', weight: 195, grade: 70, strengths: ['Size and length', 'Press ability', 'Athleticism'], weaknesses: ['Technique consistency', 'Hip turns'] },
  { id: 143, name: 'T\'Vondre Sweat', position: 'DT', school: 'Texas', height: '6\'4"', weight: 340, grade: 70, strengths: ['Massive nose tackle', 'Run stuffing', 'Power'], weaknesses: ['Pass rush', 'Conditioning'] },
  { id: 144, name: 'Kevin Harris Jr.', position: 'LB', school: 'Florida State', height: '6\'2"', weight: 230, grade: 70, strengths: ['Athleticism', 'Coverage potential', 'Sideline-to-sideline'], weaknesses: ['Physicality', 'Run defense'] },
  { id: 145, name: 'Graham Barton', position: 'OG', school: 'Duke', height: '6\'5"', weight: 315, grade: 69, strengths: ['Versatile interior lineman', 'Smart', 'Technique'], weaknesses: ['Power', 'Physicality'] },
  { id: 146, name: 'Tahj Brooks', position: 'RB', school: 'Texas Tech', height: '5\'11"', weight: 222, grade: 69, strengths: ['Workhorse back', 'Between the tackles', 'Contact balance'], weaknesses: ['Speed', 'Receiving ability'] },
  { id: 147, name: 'Drake Maye Jr.', position: 'QB', school: 'Wake Forest', height: '6\'3"', weight: 210, grade: 68, strengths: ['Arm talent', 'Playmaking', 'Improvisation'], weaknesses: ['Pocket discipline', 'Decision-making'] },
  { id: 148, name: 'Javon Bullard', position: 'S', school: 'Georgia', height: '5\'10"', weight: 195, grade: 68, strengths: ['Slot coverage', 'Versatility', 'Competitiveness'], weaknesses: ['Size limitations'] },
  { id: 149, name: 'Trey Benson', position: 'RB', school: 'Florida State', height: '6\'1"', weight: 220, grade: 68, strengths: ['Power runner', 'Speed for size', 'Home-run ability'], weaknesses: ['Vision', 'Fumbling'] },
  { id: 150, name: 'Barrett Carter', position: 'LB', school: 'Clemson', height: '6\'1"', weight: 225, grade: 67, strengths: ['Pass rush from LB', 'Explosiveness', 'Versatility'], weaknesses: ['Coverage consistency', 'Size'] },
  { id: 151, name: 'Rome Douglas', position: 'WR', school: 'Purdue', height: '6\'2"', weight: 195, grade: 67, strengths: ['Size and speed', 'Deep threat', 'Athletic upside'], weaknesses: ['Route refinement', 'Consistency'] },
  { id: 152, name: 'JQ Hardaway', position: 'EDGE', school: 'Vanderbilt', height: '6\'3"', weight: 250, grade: 66, strengths: ['Motor', 'Effort', 'Improving technique'], weaknesses: ['Athletic ceiling', 'Bend'] },
  { id: 153, name: 'Malik Mustapha', position: 'S', school: 'Wake Forest', height: '6\'0"', weight: 210, grade: 66, strengths: ['Physicality', 'Run support', 'Blitz ability'], weaknesses: ['Coverage skills', 'Hip fluidity'] },
  { id: 154, name: 'Calvin Austin III', position: 'WR', school: 'Memphis', height: '5\'9"', weight: 170, grade: 65, strengths: ['Blazing speed', 'Return specialist', 'Elusiveness'], weaknesses: ['Size', 'Physicality at LOS'] },
  { id: 155, name: 'Jaylon Carlies', position: 'CB', school: 'Missouri', height: '6\'0"', weight: 185, grade: 65, strengths: ['Versatile DB', 'Ball skills', 'Instincts'], weaknesses: ['Speed', 'Man coverage'] },
  { id: 156, name: 'Cody Mauch', position: 'OT', school: 'North Dakota St', height: '6\'6"', weight: 305, grade: 65, strengths: ['Versatile lineman', 'Toughness', 'Technique'], weaknesses: ['Power', 'Level of competition'] },
  { id: 157, name: 'Zak Zinter', position: 'OG', school: 'Michigan', height: '6\'6"', weight: 320, grade: 64, strengths: ['Powerful guard', 'Run blocking', 'Leadership'], weaknesses: ['Injury history', 'Mobility'] },
  { id: 158, name: 'Cedric Gray', position: 'LB', school: 'North Carolina', height: '6\'2"', weight: 230, grade: 64, strengths: ['Tackling', 'Run defense', 'Effort'], weaknesses: ['Coverage speed', 'Athletic limitations'] },
  { id: 159, name: 'Jonah Savaiinaea', position: 'OT', school: 'Arizona', height: '6\'5"', weight: 315, grade: 64, strengths: ['Versatility', 'Pass pro technique', 'Smart'], weaknesses: ['Run blocking power'] },
  { id: 160, name: 'Braden Fiske', position: 'DT', school: 'Florida State', height: '6\'5"', weight: 295, grade: 64, strengths: ['Athletic interior lineman', 'Motor', 'Versatility'], weaknesses: ['Consistency', 'Power'] },

  // ============================================================
  // ROUND 6 (picks 161-192) — grades 58-68
  // ============================================================

  { id: 161, name: 'Austin Reed', position: 'QB', school: 'Western Kentucky', height: '6\'3"', weight: 220, grade: 68, strengths: ['Arm strength', 'Production', 'Toughness'], weaknesses: ['Level of competition', 'Processing speed'] },
  { id: 162, name: 'MarShawn Lloyd', position: 'RB', school: 'USC', height: '5\'9"', weight: 210, grade: 67, strengths: ['Quickness', 'Change of direction', 'Receiving'], weaknesses: ['Durability', 'Size'] },
  { id: 163, name: 'Ladd McConkey', position: 'WR', school: 'Georgia', height: '6\'0"', weight: 183, grade: 67, strengths: ['Route running', 'Reliable hands', 'Toughness'], weaknesses: ['Size', 'Speed ceiling'] },
  { id: 164, name: 'Brock Bowers', position: 'TE', school: 'Georgia', height: '6\'4"', weight: 240, grade: 66, strengths: ['Receiving elite for position', 'YAC', 'Route running'], weaknesses: ['Inline blocking'] },
  { id: 165, name: 'DeWayne McBride', position: 'RB', school: 'UAB', height: '5\'11"', weight: 210, grade: 66, strengths: ['Explosive runner', 'One-cut style', 'Vision'], weaknesses: ['Pass catching', 'Level of competition'] },
  { id: 166, name: 'Christian Gonzalez', position: 'CB', school: 'Oregon', height: '6\'2"', weight: 195, grade: 66, strengths: ['Length', 'Speed', 'Press ability'], weaknesses: ['Physicality in run game'] },
  { id: 167, name: 'Jordan Battle', position: 'S', school: 'Alabama', height: '6\'1"', weight: 205, grade: 66, strengths: ['Leadership', 'Experience', 'Range'], weaknesses: ['Ball production', 'Explosiveness'] },
  { id: 168, name: 'Darnell Washington', position: 'TE', school: 'Georgia', height: '6\'7"', weight: 270, grade: 65, strengths: ['Freakish size and athleticism', 'Blocking', 'Mismatch weapon'], weaknesses: ['Route running polish', 'Hands consistency'] },
  { id: 169, name: 'O\'Cyrus Torrence', position: 'OG', school: 'Florida', height: '6\'5"', weight: 340, grade: 65, strengths: ['Massive guard', 'Run blocking', 'Power'], weaknesses: ['Speed in space', 'Pass pro vs quickness'] },
  { id: 170, name: 'RJ Harvey', position: 'RB', school: 'UCF', height: '5\'10"', weight: 195, grade: 65, strengths: ['Explosive playmaker', 'Speed', 'Vision'], weaknesses: ['Size', 'Pass blocking'] },
  { id: 171, name: 'Kelee Ringo', position: 'CB', school: 'Georgia', height: '6\'2"', weight: 207, grade: 64, strengths: ['Size and speed combo', 'Physical corner', 'Athleticism'], weaknesses: ['Technique development', 'Hip fluidity'] },
  { id: 172, name: 'Felix Anudike-Uzomah', position: 'EDGE', school: 'Kansas State', height: '6\'3"', weight: 255, grade: 64, strengths: ['Pass rush production', 'Motor', 'Effort'], weaknesses: ['Counter moves', 'Size'] },
  { id: 173, name: 'Siaki Ika', position: 'DT', school: 'Baylor', height: '6\'4"', weight: 350, grade: 64, strengths: ['Massive anchor', 'Run stuffing', 'Space eating'], weaknesses: ['Pass rush', 'Motor'] },
  { id: 174, name: 'Payton Wilson', position: 'LB', school: 'NC State', height: '6\'4"', weight: 235, grade: 63, strengths: ['Size and range', 'Tackling', 'Sideline-to-sideline'], weaknesses: ['Injury history', 'Coverage'] },
  { id: 175, name: 'Devontez Walker', position: 'WR', school: 'North Carolina', height: '6\'1"', weight: 190, grade: 63, strengths: ['Deep speed', 'Playmaking ability', 'YAC'], weaknesses: ['Route tree', 'Physicality'] },
  { id: 176, name: 'Matt Goncalves', position: 'OT', school: 'Pittsburgh', height: '6\'6"', weight: 315, grade: 63, strengths: ['Experienced tackle', 'Technique', 'Consistency'], weaknesses: ['Athletic upside'] },
  { id: 177, name: 'Chop Robinson', position: 'EDGE', school: 'Penn State', height: '6\'3"', weight: 250, grade: 62, strengths: ['Explosive first step', 'Speed rush', 'Motor'], weaknesses: ['Size', 'Run defense'] },
  { id: 178, name: 'Chris Braswell', position: 'EDGE', school: 'Alabama', height: '6\'3"', weight: 240, grade: 62, strengths: ['Bend and flexibility', 'Speed', 'Closing burst'], weaknesses: ['Power', 'Run defense consistency'] },
  { id: 179, name: 'Marcus Adams Jr.', position: 'DT', school: 'Arkansas', height: '6\'3"', weight: 305, grade: 62, strengths: ['Power at POA', 'Run defense', 'Effort'], weaknesses: ['Pass rush', 'Athletic limitations'] },
  { id: 180, name: 'Mike Hall Jr.', position: 'DT', school: 'Ohio State', height: '6\'2"', weight: 290, grade: 61, strengths: ['Quick interior rusher', 'Motor', 'Penetration'], weaknesses: ['Size', 'Consistency'] },
  { id: 181, name: 'Jer\'Zhan Newton', position: 'DT', school: 'Illinois', height: '6\'2"', weight: 295, grade: 61, strengths: ['Interior disruption', 'Quick hands', 'Motor'], weaknesses: ['Size', 'Double teams'] },
  { id: 182, name: 'Jase McClellan', position: 'RB', school: 'Alabama', height: '5\'11"', weight: 212, grade: 60, strengths: ['Speed', 'Receiving ability', 'Toughness'], weaknesses: ['Injury history', 'Pass protection'] },
  { id: 183, name: 'Josh Newton', position: 'CB', school: 'TCU', height: '5\'10"', weight: 185, grade: 60, strengths: ['Quick feet', 'Man coverage', 'Competitiveness'], weaknesses: ['Size', 'Press against bigger WRs'] },
  { id: 184, name: 'Theo Johnson', position: 'TE', school: 'Penn State', height: '6\'6"', weight: 255, grade: 60, strengths: ['Size and athleticism', 'Blocking', 'Red zone target'], weaknesses: ['Route running', 'Consistency'] },
  { id: 185, name: 'DJ Dale', position: 'DT', school: 'Alabama', height: '6\'3"', weight: 310, grade: 59, strengths: ['NFL experience', 'Run stuffing', 'Power'], weaknesses: ['Pass rush', 'Motor'] },
  { id: 186, name: 'Drake Thomas', position: 'LB', school: 'NC State', height: '6\'0"', weight: 230, grade: 59, strengths: ['Tackling', 'Effort', 'Run defense'], weaknesses: ['Size', 'Coverage limitations'] },
  { id: 187, name: 'Javon Baker', position: 'WR', school: 'UCF', height: '6\'1"', weight: 196, grade: 59, strengths: ['Deep threat', 'Playmaking', 'Competitive fire'], weaknesses: ['Route running', 'Drops'] },
  { id: 188, name: 'Zach Frazier', position: 'OG', school: 'West Virginia', height: '6\'3"', weight: 310, grade: 58, strengths: ['Toughness', 'Run blocking', 'Versatility'], weaknesses: ['Athletic ceiling', 'Pass pro technique'] },
  { id: 189, name: 'Austin Booker', position: 'EDGE', school: 'Kansas', height: '6\'4"', weight: 250, grade: 58, strengths: ['Length', 'Motor', 'Developing pass rush'], weaknesses: ['Power', 'Consistency'] },
  { id: 190, name: 'Anfernee Orji', position: 'LB', school: 'Vanderbilt', height: '6\'1"', weight: 228, grade: 58, strengths: ['Instincts', 'Tackling', 'Effort'], weaknesses: ['Athletic ceiling', 'Coverage'] },
  { id: 191, name: 'Tyler Davis', position: 'DT', school: 'Clemson', height: '6\'2"', weight: 300, grade: 58, strengths: ['Quick penetrator', 'Motor', 'Interior push'], weaknesses: ['Size', 'Power at POA'] },
  { id: 192, name: 'Andrel Anthony', position: 'WR', school: 'Michigan', height: '6\'1"', weight: 180, grade: 58, strengths: ['Speed', 'Deep threat', 'Big-play ability'], weaknesses: ['Consistency', 'Route tree', 'Physicality'] },

  // ============================================================
  // ROUND 7 (picks 193-224) — grades 52-62
  // ============================================================

  { id: 193, name: 'Devin Leary', position: 'QB', school: 'Kentucky', height: '6\'1"', weight: 215, grade: 62, strengths: ['Experience', 'Leadership', 'Toughness'], weaknesses: ['Arm strength', 'Injury history', 'Athletic ceiling'] },
  { id: 194, name: 'Audric Estimé', position: 'RB', school: 'Notre Dame', height: '6\'0"', weight: 227, grade: 62, strengths: ['Power runner', 'Short yardage', 'Contact balance'], weaknesses: ['Speed', 'Receiving'] },
  { id: 195, name: 'Rasheen Ali', position: 'RB', school: 'Marshall', height: '5\'10"', weight: 195, grade: 61, strengths: ['Elusiveness', 'Vision', 'Production'], weaknesses: ['Level of competition', 'Pass protection'] },
  { id: 196, name: 'Luke Lachey', position: 'TE', school: 'Iowa', height: '6\'6"', weight: 250, grade: 61, strengths: ['Size', 'Blocking', 'Red zone threat'], weaknesses: ['Separation speed', 'Route running'] },
  { id: 197, name: 'Jermaine Burton', position: 'WR', school: 'Alabama', height: '6\'0"', weight: 195, grade: 60, strengths: ['Speed', 'Deep threat', 'Experience'], weaknesses: ['Consistency', 'Concentration drops'] },
  { id: 198, name: 'Patrick Paul', position: 'OT', school: 'Houston', height: '6\'7"', weight: 330, grade: 60, strengths: ['Massive frame', 'Length', 'NFL body'], weaknesses: ['Technique', 'Consistency'] },
  { id: 199, name: 'Travis Shaw', position: 'DT', school: 'Clemson', height: '6\'5"', weight: 320, grade: 59, strengths: ['Size', 'Power', 'Run stuffing'], weaknesses: ['Motor', 'Pass rush'] },
  { id: 200, name: 'Jameer Grimsley', position: 'LB', school: 'Appalachian State', height: '6\'2"', weight: 235, grade: 59, strengths: ['Tackling machine', 'Motor', 'Toughness'], weaknesses: ['Coverage', 'Level of competition'] },
  { id: 201, name: 'Tyler Baron', position: 'EDGE', school: 'Tennessee', height: '6\'5"', weight: 260, grade: 58, strengths: ['Length', 'Power', 'Run defense'], weaknesses: ['Bend', 'Consistency'] },
  { id: 202, name: 'Jayden Daniels', position: 'QB', school: 'Rice', height: '6\'2"', weight: 200, grade: 58, strengths: ['Dual-threat ability', 'Improvisation', 'Playmaking'], weaknesses: ['Size', 'Level of competition', 'Pocket passing'] },
  { id: 203, name: 'Dee Winters', position: 'LB', school: 'TCU', height: '6\'0"', weight: 225, grade: 57, strengths: ['Speed', 'Blitzing', 'Effort'], weaknesses: ['Size', 'Coverage skills'] },
  { id: 204, name: 'Jordan Addison', position: 'WR', school: 'USC', height: '5\'11"', weight: 175, grade: 57, strengths: ['Route running', 'Separation', 'Hands'], weaknesses: ['Size', 'Physicality'] },
  { id: 205, name: 'Terrell Bynum', position: 'WR', school: 'Washington', height: '6\'0"', weight: 185, grade: 57, strengths: ['Quickness', 'Slot production', 'Reliable'], weaknesses: ['Speed ceiling', 'Size'] },
  { id: 206, name: 'Jarrick Bernard-Converse', position: 'CB', school: 'LSU', height: '6\'1"', weight: 195, grade: 56, strengths: ['Size', 'Experience', 'Physicality'], weaknesses: ['Speed', 'Hip fluidity'] },
  { id: 207, name: 'Brandon Dorlus', position: 'DT', school: 'Oregon', height: '6\'3"', weight: 280, grade: 56, strengths: ['Versatility', 'Motor', 'Effort'], weaknesses: ['Size', 'Power'] },
  { id: 208, name: 'Ty\'Ron Hopper', position: 'LB', school: 'Missouri', height: '6\'1"', weight: 225, grade: 56, strengths: ['Athleticism', 'Coverage potential', 'Speed'], weaknesses: ['Tackling consistency', 'Processing'] },
  { id: 209, name: 'Storm Duck', position: 'CB', school: 'North Carolina', height: '6\'0"', weight: 185, grade: 55, strengths: ['Ball skills', 'Instincts', 'Return ability'], weaknesses: ['Tackling', 'Size'] },
  { id: 210, name: 'Charles Turner', position: 'OG', school: 'Tennessee', height: '6\'5"', weight: 320, grade: 55, strengths: ['Size', 'Power', 'Run blocking'], weaknesses: ['Mobility', 'Pass pro technique'] },
  { id: 211, name: 'Jalen Catalon', position: 'S', school: 'Texas', height: '5\'10"', weight: 200, grade: 55, strengths: ['Instincts', 'Ball production', 'Leadership'], weaknesses: ['Size', 'Injury history'] },
  { id: 212, name: 'Tyjae Spears', position: 'RB', school: 'Tulane', height: '5\'10"', weight: 198, grade: 54, strengths: ['Quickness', 'Elusiveness', 'Receiving'], weaknesses: ['Size', 'Pass protection'] },
  { id: 213, name: 'Keion White', position: 'EDGE', school: 'Georgia Tech', height: '6\'5"', weight: 275, grade: 54, strengths: ['Size and power', 'Versatility', 'Upside'], weaknesses: ['Technique', 'Pass rush plan'] },
  { id: 214, name: 'AJ Barner', position: 'TE', school: 'Michigan', height: '6\'5"', weight: 245, grade: 54, strengths: ['Receiving skills', 'Route running', 'Hands'], weaknesses: ['Blocking', 'Physicality'] },
  { id: 215, name: 'Jason Pinnock', position: 'S', school: 'Pittsburgh', height: '6\'0"', weight: 205, grade: 53, strengths: ['Versatility', 'Size for safety', 'Special teams'], weaknesses: ['Ball production', 'Coverage technique'] },
  { id: 216, name: 'Darius Robinson', position: 'DT', school: 'Missouri', height: '6\'5"', weight: 290, grade: 53, strengths: ['Versatile defensive lineman', 'Upside', 'Length'], weaknesses: ['Consistency', 'Production'] },
  { id: 217, name: 'Luke Musgrave', position: 'TE', school: 'Oregon State', height: '6\'6"', weight: 250, grade: 53, strengths: ['Size and athleticism', 'Receiving', 'Upside'], weaknesses: ['Blocking', 'Route refinement'] },
  { id: 218, name: 'Jordan Domineck', position: 'EDGE', school: 'Arkansas', height: '6\'3"', weight: 255, grade: 53, strengths: ['Motor', 'Effort', 'Versatility'], weaknesses: ['Technique', 'Size'] },
  { id: 219, name: 'Nick Hampton', position: 'EDGE', school: 'App State', height: '6\'3"', weight: 248, grade: 52, strengths: ['Production', 'Motor', 'Toughness'], weaknesses: ['Level of competition', 'Size'] },
  { id: 220, name: 'Beaux Limmer', position: 'OG', school: 'Arkansas', height: '6\'5"', weight: 305, grade: 52, strengths: ['Experience', 'Technique', 'Toughness'], weaknesses: ['Athletic ceiling', 'Power'] },
  { id: 221, name: 'Quentin Lake', position: 'S', school: 'UCLA', height: '6\'1"', weight: 195, grade: 52, strengths: ['Instincts', 'Football IQ', 'Tackling'], weaknesses: ['Speed', 'Range'] },
  { id: 222, name: 'Marcus Jones', position: 'CB', school: 'Houston', height: '5\'8"', weight: 175, grade: 52, strengths: ['Return specialist', 'Quickness', 'Ball skills'], weaknesses: ['Size', 'Outside corner ability'] },
  { id: 223, name: 'Aidan O\'Connell', position: 'QB', school: 'Purdue', height: '6\'3"', weight: 210, grade: 52, strengths: ['Accuracy', 'Pocket passer', 'Decision-making'], weaknesses: ['Arm strength', 'Mobility', 'Athletic ceiling'] },
  { id: 224, name: 'Tank Bigsby', position: 'RB', school: 'Auburn', height: '5\'11"', weight: 210, grade: 52, strengths: ['Power runner', 'Vision', 'Contact balance'], weaknesses: ['Receiving', 'Pass protection', 'Speed'] },
];

export const POSITION_COLORS: Record<string, string> = {
  QB: '#e11d48',
  WR: '#2563eb',
  RB: '#16a34a',
  TE: '#ea580c',
  OT: '#854d0e',
  OG: '#a16207',
  DT: '#0d9488',
  EDGE: '#dc2626',
  LB: '#4f46e5',
  CB: '#9333ea',
  S: '#0891b2',
};
