// ─── AMA-TING TOUR v2 · APP.JS ───────────────────────────────────────────────

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const INVITE_CODE   = 'AMAT26';
const MASTERS_URL   = 'https://www.masters.com/en_US/scores/feeds/2026/scores.json';
const MISSED_CUT    = 20;
const STORAGE_PREFIX = 'amt_v2_';

const TOURNAMENTS = [
  { id:'masters',  name:'The Masters',       short:'Masters',  course:'Augusta National', location:'Augusta, GA',       dates:'Apr 9–12',  start:'2026-04-09', end:'2026-04-12', feed: MASTERS_URL,   type:'masters', color:'#1a3a2a', accent:'#c9a84c' },
  { id:'pga',      name:'PGA Championship',  short:'PGA',      course:'Aronimink GC',     location:'Newtown Square, PA', dates:'May 14–17', start:'2026-05-14', end:'2026-05-17', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811947', type:'espn', color:'#1a1a3a', accent:'#d4af37' },
  { id:'usopen',   name:'US Open',            short:'US Open',  course:'Shinnecock Hills', location:'Southampton, NY',    dates:'Jun 18–21', start:'2026-06-18', end:'2026-06-21', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811952', type:'espn', color:'#1a2a4a', accent:'#c8a96e' },
  { id:'theopen',  name:'The Open',           short:'The Open', course:'Royal Birkdale',   location:'Southport, England', dates:'Jul 16–19', start:'2026-07-16', end:'2026-07-19', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811957', type:'espn', color:'#2a1a1a', accent:'#c0c0c0' },
];

const POOL_PICKS = [
  { id:'storm',  name:'Storm',  initials:'ST', picks: ['Ludvig Åberg','Bryson DeChambeau','Tommy Fleetwood','Justin Thomas'] },
  { id:'rick',   name:'Rick',   initials:'RI', picks: ['Brooks Koepka','Collin Morikawa','Jon Rahm','Bryson DeChambeau'] },
  { id:'bryan',  name:'Bryan',  initials:'BR', picks: ['Bryson DeChambeau','Jon Rahm','Ludvig Åberg','Xander Schauffele'] },
  { id:'jarryd', name:'Jarryd', initials:'JA', picks: ['Bryson DeChambeau','Ludvig Åberg','Matt Fitzpatrick','Jon Rahm'] },
  { id:'rhys',   name:'Rhys',   initials:'RH', picks: ['Justin Rose','Ludvig Åberg','Patrick Reed','Cameron Smith'] },
  { id:'ddog',   name:'D.Dog',  initials:'DD', picks: ['Justin Rose','Cameron Young','Xander Schauffele','Tommy Fleetwood'] },
  { id:'ciaran', name:'Ciaran', initials:'CI', picks: ['Bryson DeChambeau','Justin Rose','Cameron Smith','Jon Rahm'] },
  { id:'mp',     name:'MP',     initials:'MP', picks: ['Bryson DeChambeau','Ludvig Åberg','Xander Schauffele','Collin Morikawa'] },
  { id:'mattf',  name:'Matt F', initials:'MF', picks: ['Matt Fitzpatrick','Bryson DeChambeau','Jon Rahm','Ludvig Åberg'] },
  { id:'rayne',  name:'Rayne',  initials:'RA', picks: ['Jon Rahm','Collin Morikawa','Dustin Johnson','Cameron Young'] },
];

const ACHIEVEMENTS = [
  { id:'winner',      icon:'🏆', name:'Winner',        desc:'Win a pool tournament' },
  { id:'podium',      icon:'🥉', name:'Podium',         desc:'Finish top 3' },
  { id:'clean-sheet', icon:'🎯', name:'Clean Sheet',    desc:'No missed cuts in a major' },
  { id:'eagle-eye',   icon:'🦅', name:'Eagle Eye',      desc:'Pick a player who scores eagle' },
  { id:'rumbler',     icon:'🫠', name:'Rumbler',        desc:'Finish last in a pool' },
  { id:'hat-trick',   icon:'👒', name:'Hat-Trick',      desc:'Win 3 pool tournaments' },
  { id:'statistician',icon:'📊', name:'Statistician',   desc:'Log 10 rounds' },
  { id:'sub-80',      icon:'⛳', name:'Sub-80 Club',    desc:'Shoot under 80' },
  { id:'best-picker', icon:'🎱', name:'Best Picker',    desc:'Highest pick accuracy in a season' },
  { id:'marathon',    icon:'🏌️', name:'Season Player',  desc:'Play all 4 majors in the pool' },
];

const NAME_ALIASES = {
  'ludvig aberg':'Ludvig Åberg','ludvig åberg':'Ludvig Åberg',
  'cam young':'Cameron Young','cameron young':'Cameron Young',
  'cam smith':'Cameron Smith','cameron smith':'Cameron Smith',
  'matt fitzpatrick':'Matt Fitzpatrick','matthew fitzpatrick':'Matt Fitzpatrick',
  'bryson dechambeau':'Bryson DeChambeau','bryson de chambeau':'Bryson DeChambeau',
  'jon rahm':'Jon Rahm','jonathan rahm':'Jon Rahm',
  'xander schauffele':'Xander Schauffele','xander schauffle':'Xander Schauffele',
  'collin morikawa':'Collin Morikawa',
  'brooks koepka':'Brooks Koepka',
  'justin rose':'Justin Rose',
  'tommy fleetwood':'Tommy Fleetwood',
  'rory mcilroy':'Rory McIlroy',
  'scottie scheffler':'Scottie Scheffler',
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

function getUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_PREFIX+'user')); }
  catch(e) { return null; }
}

function setUser(u) {
  localStorage.setItem(STORAGE_PREFIX+'user', JSON.stringify(u));
}

function requireAuth() {
  const u = getUser();
  if (!u) { window.location.href = '../v2/login.html'; return null; }
  return u;
}

function signOut() {
  if (confirm('Sign out of Ama-Ting Tour?')) {
    localStorage.removeItem(STORAGE_PREFIX+'user');
    window.location.href = '../v2/login.html';
  }
}

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────

function store(key, val) {
  try { localStorage.setItem(STORAGE_PREFIX+key, JSON.stringify(val)); } catch(e) {}
}
function retrieve(key, fallback=null) {
  try {
    const r = localStorage.getItem(STORAGE_PREFIX+key);
    return r ? JSON.parse(r) : fallback;
  } catch(e) { return fallback; }
}

// ─── ROUNDS ──────────────────────────────────────────────────────────────────

function getRounds() { return retrieve('rounds', []); }
function saveRound(round) {
  const rounds = getRounds();
  round.id = Date.now().toString();
  round.created = new Date().toISOString();
  rounds.unshift(round);
  store('rounds', rounds);
  recalcStats();
  return round;
}
function deleteRound(id) {
  const rounds = getRounds().filter(r => r.id !== id);
  store('rounds', rounds);
  recalcStats();
}
function getRound(id) { return getRounds().find(r => r.id === id); }

// ─── STATS CALC ───────────────────────────────────────────────────────────────

function recalcStats() {
  const rounds = getRounds();
  if (!rounds.length) { store('stats', null); return; }
  const scores = rounds.map(r => r.grossScore);
  const vsPar  = rounds.map(r => r.vspar);
  const putts  = rounds.filter(r => r.totalPutts).map(r => r.totalPutts);
  const stats = {
    rounds:       rounds.length,
    avg:          +(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1),
    best:         Math.min(...scores),
    worst:        Math.max(...scores),
    bestVsPar:    Math.min(...vsPar),
    avgVsPar:     +(vsPar.reduce((a,b)=>a+b,0)/vsPar.length).toFixed(1),
    avgPutts:     putts.length ? +(putts.reduce((a,b)=>a+b,0)/putts.length).toFixed(1) : null,
    avgGir:       +(rounds.filter(r=>r.gir!=null).map(r=>r.gir/18*100).reduce((a,b)=>a+b,0)/rounds.length).toFixed(0),
    avgFir:       +(rounds.filter(r=>r.fir!=null).map(r=>r.fir/14*100).reduce((a,b)=>a+b,0)/rounds.length).toFixed(0),
  };
  store('stats', stats);
  checkAchievements(rounds, stats);
}

function getStats() { return retrieve('stats'); }

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

function getEarnedAchievements() { return retrieve('achievements', []); }
function checkAchievements(rounds, stats) {
  const earned = new Set(getEarnedAchievements().map(a=>a.id));
  const newEarned = [];
  if (stats.rounds >= 10 && !earned.has('statistician'))
    newEarned.push({id:'statistician', earnedAt: new Date().toISOString()});
  if (stats.best < 80 && !earned.has('sub-80'))
    newEarned.push({id:'sub-80', earnedAt: new Date().toISOString()});
  if (newEarned.length) {
    const all = getEarnedAchievements().concat(newEarned);
    store('achievements', all);
  }
}

// ─── NAME MATCHING ────────────────────────────────────────────────────────────

function normName(s) {
  if(!s) return '';
  return s.toLowerCase().replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e')
    .replace(/[òóôõö]/g,'o').replace(/[ùúûü]/g,'u').replace(/ñ/g,'n')
    .replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim();
}
function canonName(s) { return NAME_ALIASES[normName(s)] || s.trim(); }
function namesMatch(a, b) {
  if(!a||!b) return false;
  const ra=canonName(a), rb=canonName(b);
  const na=normName(ra).replace(/ /g,''), nb=normName(rb).replace(/ /g,'');
  if(na===nb) return true;
  const lastA=normName(ra).split(' ').pop(), lastB=normName(rb).split(' ').pop();
  if(lastA.length>4 && lastA===lastB) return true;
  if(na.length>4&&(na.includes(nb)||nb.includes(na))) return true;
  return false;
}

// ─── SCORE HELPERS ────────────────────────────────────────────────────────────

function parseScore(s) {
  if(s===null||s===undefined) return 0;
  const str=String(s).trim();
  if(str===''||str==='E'||str==='e') return 0;
  return parseInt(str.replace('+',''),10)||0;
}
function fmtScore(n) {
  if(typeof n!=='number') return 'E';
  if(n===0) return 'E';
  return n>0?'+'+n:String(n);
}
function scoreClass(n) {
  if(typeof n!=='number') return 'even';
  return n<0?'under':n>0?'over':'even';
}
function scoreCellClass(score, par) {
  const diff = score - par;
  if(diff <= -2) return 'score-eagle';
  if(diff === -1) return 'score-birdie';
  if(diff === 0)  return 'score-par';
  if(diff === 1)  return 'score-bogey';
  return 'score-double';
}

// ─── TOURNAMENT STATUS ────────────────────────────────────────────────────────

function getTournamentStatus(t) {
  const now = new Date();
  const start = new Date(t.start+'T08:00:00');
  const end   = new Date(t.end+'T20:00:00');
  if(now>=start && now<=end) return 'live';
  if(now>end) return 'complete';
  return 'upcoming';
}

function getActiveTournament() {
  return TOURNAMENTS.find(t=>getTournamentStatus(t)==='live') ||
         TOURNAMENTS.find(t=>getTournamentStatus(t)==='upcoming') ||
         TOURNAMENTS[TOURNAMENTS.length-1];
}

function countdown(startStr) {
  const start = new Date(startStr+'T08:00:00');
  const diff = start - new Date();
  if(diff<=0) return null;
  const days  = Math.floor(diff/86400000);
  const hours = Math.floor((diff%86400000)/3600000);
  const mins  = Math.floor((diff%3600000)/60000);
  const secs  = Math.floor((diff%60000)/1000);
  return {days, hours, mins, secs};
}

// ─── MASTERS FEED PARSER ──────────────────────────────────────────────────────

function parseMastersFeed(data) {
  const players = data?.data?.player||[];
  return players.map(p=>{
    const st=p.status||'';
    const isCut=st==='C'||st==='MC'||st.startsWith('C');
    const isWD=st==='W'||st==='WD';
    function rnd(k){const rd=p[k];if(!rd||rd.roundStatus==='Pre')return null;return typeof rd.fantasy==='number'?rd.fantasy:null;}
    return {
      name:p.full_name||'',score:parseScore(p.topar),today:parseScore(p.today),
      thru:p.thru||'-',pos:p.pos||'-',
      status:isCut?'CUT':isWD?'WD':'active',
      r1:rnd('round1'),r2:rnd('round2'),r3:rnd('round3'),r4:rnd('round4'),
    };
  }).sort((a,b)=>{
    const ao=a.status==='CUT'||a.status==='WD'?1:0;
    const bo=b.status==='CUT'||b.status==='WD'?1:0;
    return ao!==bo?ao-bo:a.score-b.score;
  });
}

function parseESPNFeed(data) {
  const competitors=data?.events?.[0]?.competitions?.[0]?.competitors||[];
  return competitors.map(c=>{
    const rawScore=c.score?.value, dispScore=c.score?.displayValue;
    let score=0;
    if(typeof rawScore==='number') score=rawScore;
    else if(dispScore==='E') score=0;
    else if(dispScore) score=parseInt(dispScore.replace('+',''),10)||0;
    const st=(c.status?.type||'').toLowerCase();
    const isCut=st.includes('cut'), isWD=st.includes('wd')||st.includes('withdraw');
    const rounds=(c.linescores||[]).filter(l=>l.type!=='total');
    const r=[null,null,null,null];
    rounds.forEach((l,i)=>{if(i<4)r[i]=parseInt(l.value)||null;});
    return {
      name:c.athlete?.displayName||c.athlete?.fullName||'Unknown',
      score,thru:String(c.status?.period||'--'),pos:c.status?.position?.displayName||'--',
      status:isCut?'CUT':isWD?'WD':'active',r1:r[0],r2:r[1],r3:r[2],r4:r[3],
    };
  }).sort((a,b)=>{
    const ao=a.status==='CUT'||a.status==='WD'?1:0;
    const bo=b.status==='CUT'||b.status==='WD'?1:0;
    return ao!==bo?ao-bo:a.score-b.score;
  });
}

async function fetchField(tournament) {
  const res = await fetch(tournament.feed + '?_='+Date.now());
  if(!res.ok) throw new Error('HTTP '+res.status);
  const data = await res.json();
  return tournament.type==='masters' ? parseMastersFeed(data) : parseESPNFeed(data);
}

function calcPool(picks, field) {
  const results = picks.map(p=>{
    let total=0;
    const golfers = p.picks.map(gName=>{
      const player = field.find(f=>namesMatch(f.name,gName));
      if(!player){total+=MISSED_CUT;return{name:gName,score:MISSED_CUT,status:'notfound',thru:'?'};}
      const isOut=player.status==='CUT'||player.status==='WD';
      const score=isOut?MISSED_CUT:player.score;
      total+=score;
      return{name:player.name,score,status:player.status,thru:player.thru,pos:player.pos};
    });
    return{id:p.id,participant:p.name,initials:p.initials,golfers,total};
  });
  results.sort((a,b)=>a.total-b.total);
  results.forEach((r,i)=>r.pos=i+1);
  return results;
}

// ─── POOL RESULT STORE ────────────────────────────────────────────────────────

function savePoolResult(tournamentId, pool) {
  store('pool_'+tournamentId, {saved:new Date().toISOString(), results:pool});
}
function getPoolResult(tournamentId) { return retrieve('pool_'+tournamentId); }

// ─── NAV RENDERER ─────────────────────────────────────────────────────────────

function renderNav(activePage, basePath='') {
  const user = getUser();
  if(!user) return;
  const initials = (user.displayName||'?').slice(0,2).toUpperCase();
  const at = getActiveTournament();
  const statusClass = getTournamentStatus(at)==='live'?'live-dot':'upcoming-dot';

  const items = [
    {id:'dashboard', icon:'🏠', label:'Dashboard',    href:`${basePath}dashboard.html`},
    {id:'pool',      icon:'🏌️', label:'Pool',         href:`${basePath}pool.html`},
    {id:'season',    icon:'🏆', label:'Season',       href:`${basePath}season.html`},
    {id:'rounds',    icon:'⛳', label:'My Rounds',    href:`${basePath}rounds.html`},
    {id:'stats',     icon:'📊', label:'Stats',        href:`${basePath}stats.html`},
    {id:'profile',   icon:'👤', label:'Profile',      href:`${basePath}profile.html`},
  ];

  document.querySelectorAll('.sidebar-user-fill').forEach(el => {
    el.innerHTML = `
      <div class="avatar">${initials}</div>
      <div><div class="user-name">${user.displayName}</div>
      <div class="user-handle">@${user.username}</div></div>`;
  });

  document.querySelectorAll('.sidebar-nav-fill').forEach(el => {
    el.innerHTML = `
      <div class="nav-section-label">Main</div>
      ${items.map(item=>`
        <a href="${item.href}" class="nav-item ${activePage===item.id?'active':''}">
          <span class="nav-icon">${item.icon}</span>
          <span>${item.label}</span>
        </a>`).join('')}
      <div class="nav-section-label">Account</div>
      <a href="${basePath}profile.html" class="nav-item ${activePage==='admin'?'active':''}">
        <span class="nav-icon">⚙️</span><span>Admin</span>
      </a>`;
  });

  document.querySelectorAll('.mobile-nav-fill').forEach(el => {
    el.innerHTML = items.slice(0,5).map(item=>`
      <a href="${item.href}" class="mobile-nav-item ${activePage===item.id?'active':''}">
        <span class="mn-icon">${item.icon}</span>${item.label}
      </a>`).join('');
  });

  document.querySelectorAll('.sign-out-btn').forEach(el => {
    el.onclick = signOut;
  });
}

// ─── MOCK SAMPLE ROUNDS (seeded for new users) ────────────────────────────────

const SAMPLE_ROUNDS = [
  { course:'Caversham Heath', date:'2026-03-15', grossScore:81, vspar:9, totalPutts:33, gir:6, fir:8, notes:'Tough conditions, wind on back 9', holes: Array.from({length:18},(_,i)=>({ hole:i+1, par:[4,5,4,3,4,3,4,5,4,4,4,3,5,4,5,3,4,4][i], score:[5,5,4,3,5,3,4,6,5,5,5,3,5,4,5,4,4,4][i], putts:[2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,1,2][i], fir:i<14?[1,1,0,null,1,null,0,1,1,1,0,null,1,0,1,null,0,1][i]:null, gir:[0,1,1,0,0,1,1,0,0,0,0,1,1,1,0,0,1,0][i], penalties:[0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0][i] })) },
  { course:'Temple Golf Club', date:'2026-02-28', grossScore:78, vspar:6, totalPutts:31, gir:8, fir:9, notes:'Best round of the year so far', holes: Array.from({length:18},(_,i)=>({ hole:i+1, par:[4,5,4,3,4,3,4,5,4,4,4,3,5,4,5,3,4,4][i], score:[4,5,4,3,4,3,5,5,5,4,4,3,5,4,5,3,4,5][i], putts:[1,2,1,2,1,1,2,2,2,1,2,1,2,2,2,1,1,2][i], fir:i<14?[1,1,1,null,1,null,1,1,0,1,1,null,1,1,0,null,1,0][i]:null, gir:[1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,0][i], penalties:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0][i] })) },
  { course:'Caversham Heath', date:'2026-01-20', grossScore:85, vspar:13, totalPutts:36, gir:4, fir:6, notes:'January rust, short game off', holes: Array.from({length:18},(_,i)=>({ hole:i+1, par:[4,5,4,3,4,3,4,5,4,4,4,3,5,4,5,3,4,4][i], score:[5,6,5,4,5,4,5,6,5,5,5,4,5,5,6,3,5,5][i], putts:[2,3,2,2,2,2,2,2,2,2,2,2,2,2,3,1,2,3][i], fir:i<14?[1,0,0,null,1,null,1,0,1,0,0,null,1,1,0,null,0,1][i]:null, gir:[0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,1,0,0][i], penalties:[0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0][i] })) },
];

function seedSampleRounds() {
  if(retrieve('rounds_seeded')) return;
  const user = getUser();
  if(!user) return;
  const rounds = SAMPLE_ROUNDS.map((r,i)=>({
    ...r, id:(1000+i).toString(),
    created: new Date(r.date).toISOString(),
  }));
  store('rounds', rounds);
  store('rounds_seeded', true);
  recalcStats();
}

// ─── POOL MOCK RESULTS (for season standings when no live data) ───────────────

const MOCK_MASTERS_POOL = [
  {id:'ddog',  participant:'D.Dog',  pos:1, total:-5, golfers:[{name:'Justin Rose',score:-3,status:'active'},{name:'Cameron Young',score:1,status:'active'},{name:'Xander Schauffele',score:-2,status:'active'},{name:'Tommy Fleetwood',score:-1,status:'active'}]},
  {id:'rhys',  participant:'Rhys',   pos:2, total:-3, golfers:[{name:'Justin Rose',score:-3,status:'active'},{name:'Ludvig Åberg',score:1,status:'active'},{name:'Patrick Reed',score:-3,status:'active'},{name:'Cameron Smith',score:2,status:'active'}]},
  {id:'storm', participant:'Storm',  pos:3, total:2,  golfers:[{name:'Ludvig Åberg',score:1,status:'active'},{name:'Bryson DeChambeau',score:4,status:'active'},{name:'Tommy Fleetwood',score:-1,status:'active'},{name:'Justin Thomas',score:-2,status:'active'}]},
  {id:'mp',    participant:'MP',     pos:4, total:5,  golfers:[{name:'Bryson DeChambeau',score:4,status:'active'},{name:'Ludvig Åberg',score:1,status:'active'},{name:'Xander Schauffele',score:-2,status:'active'},{name:'Collin Morikawa',score:2,status:'active'}]},
  {id:'bryan', participant:'Bryan',  pos:5, total:7,  golfers:[{name:'Bryson DeChambeau',score:4,status:'active'},{name:'Jon Rahm',score:4,status:'active'},{name:'Ludvig Åberg',score:1,status:'active'},{name:'Xander Schauffele',score:-2,status:'active'}]},
  {id:'ciaran',participant:'Ciaran', pos:6, total:7,  golfers:[{name:'Bryson DeChambeau',score:4,status:'active'},{name:'Justin Rose',score:-3,status:'active'},{name:'Cameron Smith',score:2,status:'active'},{name:'Jon Rahm',score:4,status:'active'}]},
  {id:'rayne', participant:'Rayne',  pos:7, total:8,  golfers:[{name:'Jon Rahm',score:4,status:'active'},{name:'Collin Morikawa',score:2,status:'active'},{name:'Dustin Johnson',score:1,status:'active'},{name:'Cameron Young',score:1,status:'active'}]},
  {id:'rick',  participant:'Rick',   pos:8, total:11, golfers:[{name:'Brooks Koepka',score:1,status:'active'},{name:'Collin Morikawa',score:2,status:'active'},{name:'Jon Rahm',score:4,status:'active'},{name:'Bryson DeChambeau',score:4,status:'active'}]},
  {id:'mattf', participant:'Matt F', pos:9, total:11, golfers:[{name:'Matt Fitzpatrick',score:20,status:'CUT'},{name:'Bryson DeChambeau',score:4,status:'active'},{name:'Jon Rahm',score:4,status:'active'},{name:'Ludvig Åberg',score:1,status:'active'}]},
  {id:'jarryd',participant:'Jarryd', pos:10,total:11, golfers:[{name:'Bryson DeChambeau',score:4,status:'active'},{name:'Ludvig Åberg',score:1,status:'active'},{name:'Matt Fitzpatrick',score:20,status:'CUT'},{name:'Jon Rahm',score:4,status:'active'}]},
];

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────

function fmtDate(str) {
  if(!str) return '';
  const d = new Date(str);
  return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}

function timeAgo(str) {
  const diff = Date.now()-new Date(str).getTime();
  if(diff<60000)    return 'just now';
  if(diff<3600000)  return Math.floor(diff/60000)+'m ago';
  if(diff<86400000) return Math.floor(diff/3600000)+'h ago';
  return Math.floor(diff/86400000)+'d ago';
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Tick countdown timers if present
  const cd = document.getElementById('main-countdown');
  if(cd) {
    function tickCd() {
      const at = getActiveTournament();
      const c = countdown(at.start);
      if(!c) { cd.innerHTML = '<span style="color:var(--gold);font-weight:700">Live now</span>'; return; }
      cd.innerHTML = `<span>${c.days}d</span> <span>${String(c.hours).padStart(2,'0')}h</span> <span>${String(c.mins).padStart(2,'0')}m</span> <span>${String(c.secs).padStart(2,'0')}s</span>`;
    }
    tickCd();
    setInterval(tickCd, 1000);
  }
});
