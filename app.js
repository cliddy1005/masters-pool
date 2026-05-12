// ─── AMA-TING TOUR · SHARED DATA & LOGIC ────────────────────────────────────

const MISSED_CUT = 20;
const ADMIN_PIN  = '1005';  // change this to whatever you want
const STORE      = 'amt_';

const TOURNAMENTS = [
  { id:'masters',  name:'The Masters',       short:'Masters',   course:'Augusta National',    location:'Augusta, GA',        dates:'Apr 9–12, 2026',  start:'2026-04-09', end:'2026-04-12', feed:'https://www.masters.com/en_US/scores/feeds/2026/scores.json', type:'masters', color:'#1a3a2a', accent:'#c9a84c' },
  { id:'pga',      name:'PGA Championship',  short:'PGA Champ', course:'Aronimink Golf Club',  location:'Newtown Square, PA', dates:'May 14–17, 2026', start:'2026-05-14', end:'2026-05-17', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811947', type:'espn', color:'#1a1a3a', accent:'#d4af37' },
  { id:'usopen',   name:'US Open',            short:'US Open',   course:'Shinnecock Hills',     location:'Southampton, NY',    dates:'Jun 18–21, 2026', start:'2026-06-18', end:'2026-06-21', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811952', type:'espn', color:'#1a2a4a', accent:'#5b8db8' },
  { id:'theopen',  name:'The Open',           short:'The Open',  course:'Royal Birkdale',       location:'Southport, England', dates:'Jul 16–19, 2026', start:'2026-07-16', end:'2026-07-19', feed:'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard?tournamentId=401811957', type:'espn', color:'#1c1c2e', accent:'#aaaaaa' },
];

// Default picks — admin can override via admin.html
const DEFAULT_PICKS = [
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
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────

function store(k, v)     { try { localStorage.setItem(STORE+k, JSON.stringify(v)); } catch(e) {} }
function retrieve(k, fb) { try { const r=localStorage.getItem(STORE+k); return r!==null?JSON.parse(r):fb; } catch(e) { return fb; } }

function getPicks()         { return retrieve('picks', DEFAULT_PICKS); }
function savePicks(picks)   { store('picks', picks); }
function getScores(tid)     { return retrieve('scores_'+tid, []); }
function saveScores(tid, s) { store('scores_'+tid, s); }

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
  'justin thomas':'Justin Thomas',
};
function norm(s)   { return s.toLowerCase().replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[òóôõöø]/g,'o').replace(/[ùúûü]/g,'u').replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim(); }
function canon(s)  { return NAME_MAP[norm(s)]||s.trim(); }
function match(a,b){ if(!a||!b)return false; const ra=canon(a),rb=canon(b); const na=norm(ra).replace(/ /g,''),nb=norm(rb).replace(/ /g,''); if(na===nb)return true; const la=norm(ra).split(' ').pop(),lb=norm(rb).split(' ').pop(); if(la.length>4&&la===lb)return true; return false; }

// ─── SCORE HELPERS ────────────────────────────────────────────────────────────

function parseScore(s) { if(s===null||s===undefined)return 0; const str=String(s).trim(); if(!str||str==='E'||str==='e')return 0; return parseInt(str.replace('+',''),10)||0; }
function fmtScore(n)   { if(typeof n!=='number')return'E'; return n===0?'E':n>0?'+'+n:String(n); }
function scoreClass(n) { return typeof n!=='number'?'even':n<0?'under':n>0?'over':'even'; }

// ─── POOL CALC ────────────────────────────────────────────────────────────────

function calcPool(picks, scores) {
  const results = picks.map(p => {
    let total = 0;
    const golfers = p.picks.map(name => {
      const g = scores.find(s => match(s.name, name));
      if(!g) { total += MISSED_CUT; return { name, score:MISSED_CUT, status:'notfound', thru:'?' }; }
      const isOut = g.status==='CUT'||g.status==='WD';
      const score = isOut ? MISSED_CUT : g.score;
      total += score;
      return { name:g.name||name, score, status:g.status||'active', thru:g.thru||'' };
    });
    return { id:p.id, name:p.name, golfers, total };
  });
  results.sort((a,b) => a.total-b.total);
  results.forEach((r,i) => r.pos = i+1);
  return results;
}

// ─── TOURNAMENT STATUS ────────────────────────────────────────────────────────

function tournStatus(t) {
  const now=new Date(), s=new Date(t.start+'T08:00:00'), e=new Date(t.end+'T20:00:00');
  if(now>=s&&now<=e) return 'live';
  if(now>e) return 'complete';
  return 'upcoming';
}

function countdown(startStr) {
  const diff = new Date(startStr+'T08:00:00') - new Date();
  if(diff<=0) return null;
  return { days:Math.floor(diff/86400000), hours:Math.floor((diff%86400000)/3600000), mins:Math.floor((diff%3600000)/60000), secs:Math.floor((diff%60000)/1000) };
}

// ─── LIVE FEED PARSERS ────────────────────────────────────────────────────────

function parseMasters(data) {
  return (data?.data?.player||[]).map(p => {
    const st=p.status||'', cut=st==='C'||st==='MC'||st.startsWith('C'), wd=st==='W'||st==='WD';
    return { name:p.full_name||'', score:parseScore(p.topar), thru:p.thru||'', pos:p.pos||'', status:cut?'CUT':wd?'WD':'active' };
  }).sort((a,b)=>{const ao=a.status!=='active'?1:0,bo=b.status!=='active'?1:0;return ao!==bo?ao-bo:a.score-b.score;});
}

function parseESPN(data) {
  return (data?.events?.[0]?.competitions?.[0]?.competitors||[]).map(c => {
    const raw=c.score?.value, disp=c.score?.displayValue;
    let score=0; if(typeof raw==='number')score=raw; else if(disp==='E')score=0; else if(disp)score=parseInt(disp.replace('+',''),10)||0;
    const st=(c.status?.type||'').toLowerCase(), cut=st.includes('cut'), wd=st.includes('wd')||st.includes('withdraw');
    return { name:c.athlete?.displayName||'Unknown', score, thru:String(c.status?.period||''), pos:c.status?.position?.displayName||'', status:cut?'CUT':wd?'WD':'active' };
  }).sort((a,b)=>{const ao=a.status!=='active'?1:0,bo=b.status!=='active'?1:0;return ao!==bo?ao-bo:a.score-b.score;});
}

async function fetchLive(t) {
  let url = t.feed;
  if(t.type==='espn') url = url.replace('/leaderboard?','/scoreboard?');
  const res = await fetch(url+'&_='+Date.now());
  if(!res.ok) throw new Error('HTTP '+res.status);
  const data = await res.json();
  return t.type==='masters' ? parseMasters(data) : parseESPN(data);
}

// ─── UNIQUE GOLFERS from all picks ───────────────────────────────────────────

function uniqueGolfers(picks) {
  const seen = new Set(), list = [];
  picks.forEach(p => p.picks.forEach(g => { const c=canon(g); if(!seen.has(c)){seen.add(c);list.push(c);} }));
  return list.sort();
}
