#!/usr/bin/env node
// Fetches the RTÉ Irish Open leaderboard and writes irishopen-live.json in the
// app's field shape ({name,score,thru,pos,status}). Run periodically to refresh.
const https = require('https');
const fs = require('fs');
const path = require('path');

const RTE_URL = 'https://www.rte.ie/sport/results/golf/european-tour-1/28889/irish-open-908776/';
const OUT = path.join(__dirname, '..', 'irishopen-live.json');

function get(url){
  return new Promise((resolve,reject)=>{
    https.get(url,{headers:{'User-Agent':'Mozilla/5.0'}},res=>{
      if(res.statusCode>=300&&res.statusCode<400&&res.headers.location) return get(res.headers.location).then(resolve,reject);
      if(res.statusCode!==200) return reject(new Error('HTTP '+res.statusCode));
      let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(d));
    }).on('error',reject);
  });
}
function decode(s){ return s.replace(/&amp;/g,'&').replace(/&#039;|&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&aacute;/g,'á').replace(/&oacute;/g,'ó').replace(/&eacute;/g,'é').replace(/&oslash;/g,'ø').replace(/&aring;/g,'å').replace(/&[a-z]+;/g,'').trim(); }
function toPar(s){ s=(s||'').trim(); if(!s||s==='E'||s==='-'||s==='e') return 0; const n=parseInt(s.replace('+',''),10); return isNaN(n)?0:n; }

function parse(html){
  const rows = [...html.matchAll(/<tr class="row-[^"]*">([\s\S]*?)<\/tr>/g)];
  const cell = (block, cls) => { const m=block.match(new RegExp('<td class="'+cls+'[^"]*">([\\s\\S]*?)</td>')); return m?decode(m[1].replace(/<[^>]+>/g,' ')):''; };
  const players = rows.map(r=>{
    const b=r[1];
    const nameM=b.match(/<div class="player_name">([\s\S]*?)<\/div>/);
    const name=nameM?decode(nameM[1]):'';
    const rawScore=cell(b,'score');
    const rawHole=cell(b,'hole');
    const rawPos=cell(b,'position');
    const flagM=b.match(/<span class="flag ([a-z-]+)"/);
    if(!name) return null;
    const up=rawScore.toUpperCase();
    let status='active';
    if(/\bMC\b|CUT/.test(up)) status='CUT';
    else if(/WD|RTD|DQ|DSQ/.test(up)) status='WD';
    const score = (status==='active')? toPar(rawScore) : 0;
    let thru='';
    if(status==='active'){
      const h=rawHole.trim();
      if(/^F$|^18$/.test(h)) thru='F';
      else if(/^\d+$/.test(h) && +h>0) thru=String(+h);
      else thru='';
    }
    return { name, score, thru, pos:(status!=='active')?'CUT':(rawPos||''), status, flag:flagM?flagM[1]:'' };
  }).filter(Boolean);
  return players;
}

(async()=>{
  const html = await get(RTE_URL);
  const statusM = html.match(/<span class="status">([\s\S]*?)<\/span>/);
  const players = parse(html);
  if(!players.length) throw new Error('no players parsed');
  const roundStatus = statusM?decode(statusM[1]):'';
  const scores = players.map(({flag,...p})=>p);
  // Only rewrite when the meaningful data (scores + round status) actually changes,
  // so a fresh timestamp alone doesn't cause a commit during frozen/quiet periods.
  let prev=null; try{ prev=JSON.parse(fs.readFileSync(OUT,'utf8')); }catch(e){}
  const same = prev && prev.roundStatus===roundStatus && JSON.stringify(prev.scores)===JSON.stringify(scores);
  if(same){ console.error(`no change | status: ${roundStatus} (${players.length} players)`); return; }
  const out = { source:'RTÉ', event:'Amgen Irish Open', roundStatus, updated:new Date().toISOString(), scores };
  fs.writeFileSync(OUT, JSON.stringify(out,null,0));
  console.error(`parsed ${players.length} players | status: ${roundStatus}`);
  // quick preview
  players.slice(0,5).forEach(p=>console.error(`  ${p.pos} ${p.name} ${p.score} thru:${p.thru||'-'} ${p.status}`));
})().catch(e=>{ console.error('ERROR', e.message); process.exit(1); });
