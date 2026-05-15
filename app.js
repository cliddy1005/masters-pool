// ─── AMA-TING TOUR · APP.JS ───────────────────────────────────────────────────

const MISSED_CUT = 20;
const ADMIN_PIN  = '1005';
const STORE      = 'amt_';

const TOURNAMENTS = [
  { id:'masters',  name:'The Masters',      short:'Masters',   course:'Augusta National',    location:'Augusta, GA',        dates:'Apr 9–12, 2026',  start:'2026-04-09', end:'2026-04-12', feed:null,                                                                                                                           type:'hardcoded', cutPos:50, cutRound:2 },
  { id:'pga',      name:'PGA Championship', short:'PGA Champ', course:'Aronimink Golf Club',  location:'Newtown Square, PA', dates:'May 14–17, 2026', start:'2026-05-14', end:'2026-05-17', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811947', type:'espn',      cutPos:70, cutRound:2 },
  { id:'usopen',   name:'US Open',           short:'US Open',   course:'Shinnecock Hills',     location:'Southampton, NY',    dates:'Jun 18–21, 2026', start:'2026-06-18', end:'2026-06-21', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811952', type:'espn',      cutPos:60, cutRound:2 },
  { id:'theopen',  name:'The Open',          short:'The Open',  course:'Royal Birkdale',       location:'Southport, England', dates:'Jul 16–19, 2026', start:'2026-07-16', end:'2026-07-19', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811957', type:'espn',      cutPos:70, cutRound:2 },
];

// ─── PICKS PER TOURNAMENT ─────────────────────────────────────────────────────
// Each tournament can have different picks.
// Admin can override any tournament via admin.html.

const MASTERS_PICKS = [
  { id:'storm',  name:'Storm',  picks:['Ludvig Åberg','Bryson DeChambeau','Tommy Fleetwood','Justin Thomas'] },
  { id:'rick',   name:'Rick',   picks:['Brooks Koepka','Collin Morikawa','Jon Rahm','Bryson DeChambeau'] },
  { id:'bryan',  name:'Bryan',  picks:['Bryson DeChambeau','Jon Rahm','Ludvig Åberg','Xander Schauffele'] },
  { id:'jarryd', name:'Jarryd', picks:['Bryson DeChambeau','Ludvig Åberg','Matt Fitzpatrick','Jon Rahm'] },
  { id:'rhys',   name:'Rhys',   picks:['Justin Rose','Ludvig Åberg','Patrick Reed','Cameron Smith'] },
  { id:'ddog',   name:'D.Dog',  picks:['Justin Rose','Cameron Young','Xander Schauffele','Tommy Fleetwood'] },
  { id:'ciaran', name:'Ciaran', picks:['Bryson DeChambeau','Justin Rose','Cameron Smith','Jon Rahm'] },
  { id:'mp',     name:'MP',     picks:['Bryson DeChambeau','Ludvig Åberg','Xander Schauffele','Collin Morikawa'] },
  { id:'mattf',  name:'Matt F', picks:['Matt Fitzpatrick','Bryson DeChambeau','Jon Rahm','Ludvig Åberg'] },
  { id:'rayne',  name:'Rayne',  picks:['Jon Rahm','Collin Morikawa','Dustin Johnson','Cameron Young'] },
  { id:'devon',  name:'Devon',  picks:['Rasmus Højgaard','Sepp Straka','Ryan Gerard','Jon Rahm'] },
];

const PGA_PICKS = [
  { id:'storm',      name:'Storm',       picks:['Matt Fitzpatrick','Cameron Young','Justin Rose','Tommy Fleetwood'] },
  { id:'rick',       name:'Rick',        picks:['Tommy Fleetwood','Bryson DeChambeau','Collin Morikawa','Cameron Smith'] },
  { id:'ddog',       name:'D.Dog',       picks:['Matt Fitzpatrick','Xander Schauffele','Ludvig Åberg','Akshay Bhatia'] },
  { id:'rayne',      name:'Rayne',       picks:['Brooks Koepka','Shane Lowry','Matt Fitzpatrick','Jon Rahm'] },
  { id:'mattf',      name:'Matt F',      picks:['Matt Fitzpatrick','Justin Rose','Cameron Young','Rickie Fowler'] },
  { id:'rhys',       name:'Rhys',        picks:['Cameron Young','Matt Fitzpatrick','Tommy Fleetwood','Ben Griffin'] },
  { id:'devon',      name:'Devon',       picks:['Cameron Young','Matt Fitzpatrick','Russell Henley','Keegan Bradley'] },
  { id:'mp',         name:'MP',          picks:['Ludvig Åberg','Alex Fitzpatrick','Bryson DeChambeau','Brooks Koepka'] },
  { id:'ciaran',     name:'Ciaran',      picks:['Tommy Fleetwood','Cameron Young','Xander Schauffele','Justin Rose'] },
];

const DEFAULT_PICKS = {
  masters: MASTERS_PICKS,
  pga:     PGA_PICKS,
  usopen:  [], // set via admin when picks are confirmed
  theopen: [], // set via admin when picks are confirmed
};

// ─── MASTERS 2026 FINAL RESULTS (official, hardcoded as permanent fallback) ──
// Source: ESPN leaderboard · espn.co.uk/golf/leaderboard/_/tournamentId/401811941

const MASTERS_2026_FINAL = [
  { name:'Rory McIlroy',              score:-12, thru:'F', pos:'1',   status:'active' },
  { name:'Scottie Scheffler',         score:-11, thru:'F', pos:'2',   status:'active' },
  { name:'Tyrrell Hatton',            score:-10, thru:'F', pos:'T3',  status:'active' },
  { name:'Russell Henley',            score:-10, thru:'F', pos:'T3',  status:'active' },
  { name:'Justin Rose',               score:-10, thru:'F', pos:'T3',  status:'active' },
  { name:'Cameron Young',             score:-10, thru:'F', pos:'T3',  status:'active' },
  { name:'Collin Morikawa',           score:-9,  thru:'F', pos:'T7',  status:'active' },
  { name:'Sam Burns',                 score:-9,  thru:'F', pos:'T7',  status:'active' },
  { name:'Max Homa',                  score:-8,  thru:'F', pos:'T9',  status:'active' },
  { name:'Xander Schauffele',         score:-8,  thru:'F', pos:'T9',  status:'active' },
  { name:'Jake Knapp',                score:-7,  thru:'F', pos:'11',  status:'active' },
  { name:'Jordan Spieth',             score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Hideki Matsuyama',          score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Brooks Koepka',             score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Patrick Cantlay',           score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Patrick Reed',              score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Jason Day',                 score:-5,  thru:'F', pos:'T12', status:'active' },
  { name:'Maverick McNealy',          score:-4,  thru:'F', pos:'T18', status:'active' },
  { name:'Viktor Hovland',            score:-4,  thru:'F', pos:'T18', status:'active' },
  { name:'Matt Fitzpatrick',          score:-4,  thru:'F', pos:'T18', status:'active' },
  { name:'Keegan Bradley',            score:-3,  thru:'F', pos:'T21', status:'active' },
  { name:'Ludvig Åberg',              score:-3,  thru:'F', pos:'T21', status:'active' },
  { name:'Wyndham Clark',             score:-3,  thru:'F', pos:'T21', status:'active' },
  { name:'Matt McCarty',              score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Adam Scott',                score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Sam Stevens',               score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Brian Campbell',            score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Michael Brennan',           score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Chris Gotterup',            score:-2,  thru:'F', pos:'T24', status:'active' },
  { name:'Alex Noren',                score:-1,  thru:'F', pos:'T30', status:'active' },
  { name:'Harris English',            score:-1,  thru:'F', pos:'T30', status:'active' },
  { name:'Shane Lowry',               score:-1,  thru:'F', pos:'T30', status:'active' },
  { name:'Gary Woodland',             score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Dustin Johnson',            score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Brian Harman',              score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Tommy Fleetwood',           score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Ben Griffin',               score:0,   thru:'F', pos:'T33', status:'active' },
  { name:'Jon Rahm',                  score:1,   thru:'F', pos:'T38', status:'active' },
  { name:'Ryan Gerard',               score:1,   thru:'F', pos:'T38', status:'active' },
  { name:'Haotong Li',                score:1,   thru:'F', pos:'T38', status:'active' },
  { name:'Justin Thomas',             score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Jacob Bridgeman',           score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Sepp Straka',               score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Nick Taylor',               score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Kristoffer Reitan',         score:2,   thru:'F', pos:'T41', status:'active' },
  { name:'Sungjae Im',                score:3,   thru:'F', pos:'46',  status:'active' },
  { name:'Si Woo Kim',                score:4,   thru:'F', pos:'47',  status:'active' },
  { name:'Aaron Rai',                 score:5,   thru:'F', pos:'48',  status:'active' },
  { name:'Corey Conners',             score:6,   thru:'F', pos:'T49', status:'active' },
  { name:'Marco Penge',               score:6,   thru:'F', pos:'T49', status:'active' },
  { name:'Kurt Kitayama',             score:7,   thru:'F', pos:'51',  status:'active' },
  { name:'Sergio García',             score:8,   thru:'F', pos:'52',  status:'active' },
  { name:'Rasmus Højgaard',           score:10,  thru:'F', pos:'53',  status:'active' },
  { name:'Charl Schwartzel',          score:12,  thru:'F', pos:'54',  status:'active' },
  // Missed cut
  { name:'Harry Hall',                score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Ryan Fox',                  score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Danny Willett',             score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Bubba Watson',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'J.J. Spaun',               score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Nicolai Højgaard',          score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Bryson DeChambeau',         score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Zach Johnson',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Akshay Bhatia',             score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Robert MacIntyre',          score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Rasmus Neergaard-Petersen', score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Andrew Novak',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Tom McKibbin',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Cameron Smith',             score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Casey Jarvis',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Daniel Berger',             score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Michael Kim',               score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Fred Couples',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'José María Olazábal',       score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Mike Weir',                 score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Vijay Singh',               score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Carlos Ortiz',              score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Min Woo Lee',               score:0, thru:'', pos:'CUT', status:'CUT' },
  { name:'Davis Riley',               score:0, thru:'', pos:'CUT', status:'CUT' },
];

const HARDCODED_FINALS = { masters: MASTERS_2026_FINAL };

// ─── STORAGE ──────────────────────────────────────────────────────────────────

function store(k,v)    { try{localStorage.setItem(STORE+k,JSON.stringify(v));}catch(e){} }
function retrieve(k,fb){ try{const r=localStorage.getItem(STORE+k);return r!==null?JSON.parse(r):fb;}catch(e){return fb;} }

function getPicks(tid)         { return retrieve('picks_'+tid, DEFAULT_PICKS[tid]||[]); }
function savePicks(tid,picks)  { store('picks_'+tid, picks); }
function getCached(tid)        { return retrieve('cache_'+tid, null); }
function setCache(tid,data)    { store('cache_'+tid, {scores:data, fetchedAt:new Date().toISOString()}); }
function getFinal(tid)         { return retrieve('final_'+tid, null); }
function saveFinal(tid, pool)  { store('final_'+tid, {pool, savedAt:new Date().toISOString()}); }

// ─── NAME MATCHING ────────────────────────────────────────────────────────────

const NAME_MAP = {
  'ludvig aberg':'Ludvig Åberg','ludvig åberg':'Ludvig Åberg',
  'cam young':'Cameron Young','cameron young':'Cameron Young',
  'cam smith':'Cameron Smith','cameron smith':'Cameron Smith',
  'matt fitzpatrick':'Matt Fitzpatrick','matthew fitzpatrick':'Matt Fitzpatrick',
  'bryson dechambeau':'Bryson DeChambeau','bryson de chambeau':'Bryson DeChambeau',
  'jon rahm':'Jon Rahm','xander schauffele':'Xander Schauffele',
  'collin morikawa':'Collin Morikawa','brooks koepka':'Brooks Koepka',
  'justin rose':'Justin Rose','tommy fleetwood':'Tommy Fleetwood',
  'rory mcilroy':'Rory McIlroy','scottie scheffler':'Scottie Scheffler',
  'patrick reed':'Patrick Reed','dustin johnson':'Dustin Johnson',
  'rickie fowler':'Rickie Fowler','ricky fowler':'Rickie Fowler',
  'alex fitzpatrick':'Alex Fitzpatrick',
  'russell henley':'Russell Henley','russel henley':'Russell Henley',
  'ben griffin':'Ben Griffin',
  'akshay bhatia':'Akshay Bhatia',
  'shane lowry':'Shane Lowry',
  'keegan bradley':'Keegan Bradley',
  'cameron smith':'Cameron Smith',
};
function norm(s)  { return s.toLowerCase().replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[òóôõöø]/g,'o').replace(/[ùúûü]/g,'u').replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim(); }
function canon(s) { return NAME_MAP[norm(s)]||s.trim(); }
function match(a,b){
  if(!a||!b) return false;
  const ra=canon(a), rb=canon(b);
  const na=norm(ra).replace(/ /g,''), nb=norm(rb).replace(/ /g,'');
  if(na===nb) return true;
  const wa=norm(ra).split(' ').filter(Boolean), wb=norm(rb).split(' ').filter(Boolean);
  // Single-word on either side: last name only comparison (e.g. pick entered as "Fitzpatrick")
  if(wa.length===1||wb.length===1){
    const la=wa[wa.length-1], lb=wb[wb.length-1];
    return la.length>4 && la===lb;
  }
  // Both have first + last name: require last names match AND first names start the same
  // This handles "Cam Young" == "Cameron Young" but NOT "Alex Fitzpatrick" == "Matt Fitzpatrick"
  const lastA=wa[wa.length-1], lastB=wb[wb.length-1];
  if(lastA!==lastB) return false;
  const firstA=wa[0], firstB=wb[0];
  return firstA.startsWith(firstB) || firstB.startsWith(firstA);
}

// ─── SCORE HELPERS ────────────────────────────────────────────────────────────

function parseScore(s){ if(s===null||s===undefined)return 0;const str=String(s).trim();if(!str||str==='E'||str==='e')return 0;return parseInt(str.replace('+',''),10)||0; }
function fmtScore(n)  { if(typeof n!=='number')return'E';return n===0?'E':n>0?'+'+n:String(n); }
function scoreClass(n){ return typeof n!=='number'?'even':n<0?'under':n>0?'over':'even'; }

// ─── POOL CALC ────────────────────────────────────────────────────────────────

function calcPool(picks, scores) {
  const results = picks.map(p => {
    let total = 0;
    const golfers = p.picks.map(name => {
      const g = scores.find(s => match(s.name, name));
      if(!g){ total+=MISSED_CUT; return{name,score:MISSED_CUT,status:'notfound',thru:'?'}; }
      const isOut=g.status==='CUT'||g.status==='WD';
      const score=isOut?MISSED_CUT:g.score; total+=score;
      return{name:g.name||name,score,status:g.status||'active',thru:g.thru||''};
    });
    return{id:p.id,name:p.name,golfers,total};
  });
  // Assign positions by score
  results.sort((a,b)=>a.total-b.total);
  results.forEach((r,i)=>r.pos=i+1);
  return results;
}

// ─── SEASON STANDINGS ─────────────────────────────────────────────────────────

const DNS_PENALTY = 80; // fallback only — overridden dynamically in calcSeason

function calcSeason() {
  const people = {};
  const completedTourneys = TOURNAMENTS.filter(t => getFinal(t.id));

  completedTourneys.forEach(t => {
    const saved = getFinal(t.id);
    if(!saved?.pool?.length) return;
    const pool  = saved.pool;
    const worst = Math.max(...pool.map(r => r.total));

    pool.forEach(r => {
      const key = r.name;
      if(!people[key]) people[key] = { name:r.name, results:{}, totalScore:0, majorsPlayed:0, wins:0, rumblers:0 };
      people[key].results[t.id] = { pos:r.pos, total:r.total };
      people[key].totalScore   += r.total;
      people[key].majorsPlayed += 1;
      if(r.pos===1)       people[key].wins++;
      if(r.total===worst) people[key].rumblers++;
    });
  });

  // DNS penalty: previous tournament's worst pool score + 20
  // For the first tournament, fall back to DNS_PENALTY constant
  completedTourneys.forEach((t, i) => {
    const prevSaved = i > 0 ? getFinal(completedTourneys[i-1].id) : null;
    const prevWorst = prevSaved?.pool?.length
      ? Math.max(...prevSaved.pool.map(r => r.total)) + 20
      : DNS_PENALTY;

    Object.values(people).forEach(p => {
      if(!p.results[t.id]) {
        p.results[t.id] = { pos:null, total:prevWorst, dns:true };
        p.totalScore   += prevWorst;
      }
    });
  });

  return Object.values(people).sort((a,b) => a.totalScore - b.totalScore);
}

// ─── TOURNAMENT STATUS ────────────────────────────────────────────────────────

function tournStatus(t){ const now=new Date(),s=new Date(t.start+'T00:00:00'),e=new Date(t.end+'T23:59:59');if(now>=s&&now<=e)return'live';if(now>e)return'complete';return'upcoming'; }
function countdown(startStr){ const diff=new Date(startStr+'T00:00:00')-new Date();if(diff<=0)return null;return{days:Math.floor(diff/86400000),hours:Math.floor((diff%86400000)/3600000),mins:Math.floor((diff%3600000)/60000),secs:Math.floor((diff%60000)/1000)}; }

// ─── FEED PARSERS ─────────────────────────────────────────────────────────────

function parseESPN(data) {
  const competitors = data?.events?.[0]?.competitions?.[0]?.competitors||[];
  // Derive current tournament round from the data itself — find the highest
  // period number that any competitor has a linescore entry for.
  // More reliable than event.status.period which ESPN sometimes returns as 1 throughout.
  let eventPeriod = 1;
  for(const c of competitors) {
    for(const r of (c.linescores||[]).filter(r => 'value' in r)) {
      if(r.period > eventPeriod) eventPeriod = r.period;
    }
  }

  const parseDisp = s => {
    const str = String(s||'').trim();
    return (!str||str==='E') ? 0 : parseInt(str.replace('+',''),10)||0;
  };

  return competitors.map(c => {
    // Filter to actual rounds only — real rounds always have a 'value' property
    const rounds = (c.linescores||[]).filter(r => 'value' in r);

    // Cumulative score = sum of each round's score to par
    let score;
    if(rounds.length > 0) {
      score = rounds.reduce((sum, r) => sum + parseDisp(r.displayValue), 0);
    } else {
      const raw = c.score;
      score = typeof raw === 'number' ? raw : parseDisp(String(raw||''));
    }

    // Thru: show progress for the current event round only
    // If player hasn't started the current round, show nothing (not R1's 'F')
    const playerMaxPeriod = rounds.reduce((max,r) => r.period>max?r.period:max, 0);
    const currentRoundData = rounds.find(r => r.period === eventPeriod);
    const currentHoles = currentRoundData?.linescores?.length || 0;
    let thru = '';
    if(playerMaxPeriod < eventPeriod) {
      thru = ''; // finished previous round, hasn't teed off in current round yet
    } else if(currentHoles >= 18) {
      thru = 'F';
    } else if(currentHoles > 0) {
      thru = String(currentHoles);
    }

    const stType = (c.status?.type||'').toLowerCase();
    const cut = stType.includes('cut');
    const wd  = stType.includes('wd')||stType.includes('withdraw');

    return {
      name:   c.athlete?.displayName||c.athlete?.fullName||'Unknown',
      score, thru, pos: c.status?.position?.displayName||'',
      status: cut?'CUT':wd?'WD':'active',
    };
  }).sort((a,b)=>{
    const ao=a.status!=='active'?1:0, bo=b.status!=='active'?1:0;
    return ao!==bo?ao-bo:a.score-b.score;
  }).map((p,i,arr)=>{
    if(p.status!=='active'){ p.pos='CUT'; return p; }
    if(p.pos) return p;
    const tied = arr.filter(x=>x.status==='active'&&x.score===p.score);
    p.pos = tied.length>1
      ? 'T'+(arr.filter(x=>x.status==='active'&&x.score<p.score).length+1)
      : String(arr.filter(x=>x.status==='active'&&x.score<p.score).length+1);
    return p;
  });
}

async function fetchLive(t){
  const res=await fetch(t.feed+'&_='+Date.now());
  if(!res.ok)throw new Error('HTTP '+res.status);
  const data=await res.json();
  return parseESPN(data);
}

function uniqueGolfers(picks){ const seen=new Set(),list=[];picks.forEach(p=>p.picks.forEach(g=>{const c=canon(g);if(!seen.has(c)){seen.add(c);list.push(c);}}));return list.sort(); }

// ─── INIT (runs after all declarations) ──────────────────────────────────────

// One-time clear of stale picks for non-Masters tournaments
(function clearStalePicks(){
  if(!retrieve('picks_cleared_v3')) {
    ['pga','usopen','theopen'].forEach(tid => localStorage.removeItem(STORE+'picks_'+tid));
    store('picks_cleared_v3', true);
  }
})();

// Clear stale score caches when match logic changes — bump this version when deploying match fixes
const CACHE_VERSION = 'v4';
(function clearStaleCache(){
  if(retrieve('cache_version') !== CACHE_VERSION) {
    ['masters','pga','usopen','theopen'].forEach(tid => localStorage.removeItem(STORE+'cache_'+tid));
    store('cache_version', CACHE_VERSION);
  }
})();

// Re-seed Masters final from hardcoded data whenever version changes.
// Must run after NAME_MAP and calcPool are declared.
const MASTERS_DATA_VERSION = '2026-v4';
(function seedMasters(){
  if(retrieve('masters_data_version') !== MASTERS_DATA_VERSION) {
    const pool = calcPool(MASTERS_PICKS, MASTERS_2026_FINAL);
    saveFinal('masters', pool);
    store('masters_data_version', MASTERS_DATA_VERSION);
  }
})();
