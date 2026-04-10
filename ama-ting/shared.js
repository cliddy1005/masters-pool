// ─── AMA-TING TOUR · SHARED CONFIG ──────────────────────────────────────────
// Included by all tournament sub-pages.

const MISSED_CUT_PENALTY = 20;

const POOL_PICKS = [
  { name: 'Storm',  golfers: ['Ludvig Aberg',      'Bryson DeChambeau', 'Tommy Fleetwood',   'Justin Thomas'] },
  { name: 'Rick',   golfers: ['Brooks Koepka',     'Collin Morikawa',   'Jon Rahm',          'Bryson DeChambeau'] },
  { name: 'Bryan',  golfers: ['Bryson DeChambeau', 'Jon Rahm',          'Ludvig Aberg',      'Xander Schauffele'] },
  { name: 'Jarryd', golfers: ['Bryson DeChambeau', 'Ludvig Aberg',      'Matt Fitzpatrick',  'Jon Rahm'] },
  { name: 'Rhys',   golfers: ['Justin Rose',       'Ludvig Aberg',      'Patrick Reed',      'Cameron Smith'] },
  { name: 'D.Dog',  golfers: ['Justin Rose',       'Cameron Young',     'Xander Schauffele', 'Tommy Fleetwood'] },
  { name: 'Ciaran', golfers: ['Bryson DeChambeau', 'Justin Rose',       'Cameron Smith',     'Jon Rahm'] },
  { name: 'MP',     golfers: ['Bryson DeChambeau', 'Ludvig Aberg',      'Xander Schauffele', 'Collin Morikawa'] },
  { name: 'Matt F', golfers: ['Matt Fitzpatrick',  'Bryson DeChambeau', 'Jon Rahm',          'Ludvig Aberg'] },
  { name: 'Rayne',  golfers: ['Jon Rahm',          'Collin Morikawa',   'Dustin Johnson',    'Cameron Young'] },
];

// Tournament definitions — update ESPN/masters feed URLs each year
const TOURNAMENTS = {
  masters: {
    id:       'masters',
    name:     'The Masters',
    year:     2026,
    course:   'Augusta National Golf Club',
    location: 'Augusta, GA',
    start:    '2026-04-09',
    end:      '2026-04-12',
    feedUrl:  'https://www.masters.com/en_US/scores/feeds/2026/scores.json',
    feedType: 'masters',
    path:     '/masters-pool/ama-ting/masters/',
    color:    '#1a3a2a',
    accent:   '#c9a84c',
    storageKey: 'amt_masters_2026',
  },
  pga: {
    id:       'pga',
    name:     'PGA Championship',
    year:     2026,
    course:   'Aronimink Golf Club',
    location: 'Newtown Square, PA',
    start:    '2026-05-11',
    end:      '2026-05-17',
    feedUrl:  'https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard?tournamentId=401811947',
    feedType: 'espn',
    path:     '/masters-pool/ama-ting/pga/',
    color:    '#1a1a3a',
    accent:   '#d4af37',
    storageKey: 'amt_pga_2026',
  },
  usopen: {
    id:       'usopen',
    name:     'US Open',
    year:     2026,
    course:   'Shinnecock Hills Golf Club',
    location: 'Southampton, NY',
    start:    '2026-06-18',
    end:      '2026-06-21',
    feedUrl:  'https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard?tournamentId=401811952',
    feedType: 'espn',
    path:     '/masters-pool/ama-ting/us-open/',
    color:    '#1a2a4a',
    accent:   '#c8a96e',
    storageKey: 'amt_usopen_2026',
  },
  theopen: {
    id:       'theopen',
    name:     'The Open',
    year:     2026,
    course:   'Royal Birkdale Golf Club',
    location: 'Southport, England',
    start:    '2026-07-16',
    end:      '2026-07-19',
    feedUrl:  'https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard?tournamentId=401811957',
    feedType: 'espn',
    path:     '/masters-pool/ama-ting/the-open/',
    color:    '#2a1a1a',
    accent:   '#c0c0c0',
    storageKey: 'amt_theopen_2026',
  },
};

// ─── NAME MATCHING ────────────────────────────────────────────────────────────

const NAME_ALIASES = {
  'rory mcilroy':         'Rory McIlroy',
  'scottie scheffler':    'Scottie Scheffler',
  'xander schauffele':    'Xander Schauffele',
  'jon rahm':             'Jon Rahm',
  'jonathan rahm':        'Jon Rahm',
  'brooks koepka':        'Brooks Koepka',
  'collin morikawa':      'Collin Morikawa',
  'patrick reed':         'Patrick Reed',
  'justin thomas':        'Justin Thomas',
  'tommy fleetwood':      'Tommy Fleetwood',
  'hideki matsuyama':     'Hideki Matsuyama',
  'jordan spieth':        'Jordan Spieth',
  'dustin johnson':       'Dustin Johnson',
  'bryson dechambeau':    'Bryson DeChambeau',
  'bryson de chambeau':   'Bryson DeChambeau',
  'cameron young':        'Cameron Young',
  'cam young':            'Cameron Young',
  'matt fitzpatrick':     'Matt Fitzpatrick',
  'matthew fitzpatrick':  'Matt Fitzpatrick',
  'shane lowry':          'Shane Lowry',
  'tyrrell hatton':       'Tyrrell Hatton',
  'justin rose':          'Justin Rose',
  'ludvig aberg':         'Ludvig Åberg',
  'ludvig åberg':         'Ludvig Åberg',
  'akshay bhatia':        'Akshay Bhatia',
  'cameron smith':        'Cameron Smith',
  'cam smith':            'Cameron Smith',
};

function normName(raw) {
  if (!raw) return '';
  return raw.toLowerCase().trim()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
}

function namesMatch(a, b) {
  if (!a || !b) return false;
  const ra = NAME_ALIASES[normName(a)] || a;
  const rb = NAME_ALIASES[normName(b)] || b;
  const na = normName(ra).replace(/ /g, '');
  const nb = normName(rb).replace(/ /g, '');
  if (na === nb) return true;
  const lastA = normName(ra).split(' ').pop();
  const lastB = normName(rb).split(' ').pop();
  if (lastA.length > 4 && lastA === lastB) return true;
  if (na.length > 4 && (na.includes(nb) || nb.includes(na))) return true;
  return false;
}

// ─── SCORE HELPERS ────────────────────────────────────────────────────────────

function parseScore(s) {
  if (s === null || s === undefined) return 0;
  const str = String(s).trim();
  if (str === '' || str === 'E' || str === 'e') return 0;
  return parseInt(str.replace('+', ''), 10) || 0;
}

function fmtScore(n) {
  if (typeof n !== 'number') return 'E';
  if (n === 0) return 'E';
  return n > 0 ? '+' + n : '' + n;
}

function scoreClass(n) {
  if (typeof n !== 'number') return 'even';
  return n < 0 ? 'under' : n > 0 ? 'over' : 'even';
}

// ─── POOL CALCULATION ─────────────────────────────────────────────────────────

function calcPool(picks, field) {
  const results = picks.map(p => {
    let total = 0;
    const golfers = p.golfers.map(gName => {
      const player = field.find(f => namesMatch(f.name, gName));
      if (!player) {
        total += MISSED_CUT_PENALTY;
        return { name: gName, score: MISSED_CUT_PENALTY, status: 'notfound', thru: '?' };
      }
      const isOut = player.status === 'CUT' || player.status === 'WD';
      const score = isOut ? MISSED_CUT_PENALTY : player.score;
      total += score;
      return { name: player.name, score, status: player.status, thru: player.thru, pos: player.pos };
    });
    return { participant: p.name, golfers, total };
  });
  results.sort((a, b) => a.total - b.total);
  results.forEach((r, i) => r.pos = i + 1);
  return results;
}

// ─── MASTERS.COM PARSER ───────────────────────────────────────────────────────

function parseMastersFeed(data) {
  const players = data?.data?.player || [];
  return players.map(p => {
    const status = p.status || '';
    const isCut = status === 'C' || status === 'MC' || status.startsWith('C');
    const isWD  = status === 'W' || status === 'WD';
    function rnd(key) {
      const rd = p[key];
      if (!rd || rd.roundStatus === 'Pre') return null;
      return typeof rd.fantasy === 'number' ? rd.fantasy : null;
    }
    return {
      name: p.full_name || '',
      score: parseScore(p.topar),
      today: parseScore(p.today),
      thru: p.thru || '-',
      pos: p.pos || '-',
      status: isCut ? 'CUT' : isWD ? 'WD' : 'active',
      r1: rnd('round1'), r2: rnd('round2'), r3: rnd('round3'), r4: rnd('round4'),
    };
  }).sort((a, b) => {
    const ao = a.status === 'CUT' || a.status === 'WD' ? 1 : 0;
    const bo = b.status === 'CUT' || b.status === 'WD' ? 1 : 0;
    return ao !== bo ? ao - bo : a.score - b.score;
  });
}

// ─── SEASON STORAGE ───────────────────────────────────────────────────────────
// Each tournament page saves its final pool result to localStorage
// so the landing page can aggregate them.

function saveResult(storageKey, poolResults) {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      saved: new Date().toISOString(),
      results: poolResults,
    }));
  } catch(e) {}
}

function loadResult(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}
