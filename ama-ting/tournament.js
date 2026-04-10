// ─── AMA-TING TOUR · TOURNAMENT PAGE LOGIC ───────────────────────────────────
// Called by each tournament page via initTournament(config)

let golfField = [];
let poolPicks = [];
let refreshTimer = null;
let _config = {};

function initTournament(config) {
  _config = config;
  poolPicks = POOL_PICKS; // from shared.js
  fetchAndRender();
}

// ─── FETCH ────────────────────────────────────────────────────────────────────

async function fetchAndRender() {
  const btn = document.getElementById('refresh-btn');
  btn.disabled = true;
  btn.textContent = '↻ Fetching…';
  hideBanner();

  try {
    const res = await fetch(_config.feedUrl + '?_=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    golfField = _config.feedType === 'masters' ? parseMastersFeed(data) : parseESPNFeed(data);
    updateStatus(data);

    if (!golfField.length) {
      showBanner('warn', 'No player data returned — the tournament may not have started yet.');
    }

    const pool = calcPool(poolPicks, golfField);
    saveResult(_config.storageKey, pool);
    renderPool(pool);
    renderGolf();
    checkUnmatched(pool);

  } catch(e) {
    console.error('Fetch error:', e);
    showBanner('err', `Could not fetch live scores: ${e.message}. Showing last known data.`);
    // Render from last saved result if available
    const saved = loadResult(_config.storageKey);
    if (saved) renderPool(saved.results);
    renderGolf();
  }

  btn.disabled = false;
  btn.textContent = '↻ Refresh';
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(fetchAndRender, 5 * 60 * 1000);
}

// ─── PARSERS ──────────────────────────────────────────────────────────────────

function parseESPNFeed(data) {
  const competitors = data?.events?.[0]?.competitions?.[0]?.competitors || [];
  return competitors.map(c => {
    const rawScore = c.score?.value;
    const dispScore = c.score?.displayValue;
    let score = 0;
    if (typeof rawScore === 'number') score = rawScore;
    else if (dispScore === 'E') score = 0;
    else if (dispScore) score = parseInt(dispScore.replace('+',''), 10) || 0;

    const st = (c.status?.type || '').toLowerCase();
    const isCut = st.includes('cut');
    const isWD  = st.includes('wd') || st.includes('withdraw');
    const rounds = (c.linescores || []).filter(l => l.type !== 'total');
    const r = [null,null,null,null];
    rounds.forEach((l,i) => { if(i<4) r[i] = parseInt(l.value)||null; });

    return {
      name:   c.athlete?.displayName || c.athlete?.fullName || 'Unknown',
      score,
      thru:   String(c.status?.period || '--'),
      pos:    c.status?.position?.displayName || '--',
      status: isCut ? 'CUT' : isWD ? 'WD' : 'active',
      r1:r[0], r2:r[1], r3:r[2], r4:r[3],
    };
  }).sort((a,b) => {
    const ao = a.status === 'CUT' || a.status === 'WD' ? 1 : 0;
    const bo = b.status === 'CUT' || b.status === 'WD' ? 1 : 0;
    return ao !== bo ? ao - bo : a.score - b.score;
  });
}

// ─── STATUS BAR ───────────────────────────────────────────────────────────────

function updateStatus(data) {
  const statusEl = document.getElementById('tournament-status');
  const roundEl  = document.getElementById('round-info');
  const dotEl    = document.getElementById('live-dot');

  const { label, roundLabel, isLive } = _config.statusFn(data);
  statusEl.textContent = label;
  roundEl.textContent  = roundLabel;
  dotEl.style.background = isLive ? '#4caf50' : '#aaa';
  document.getElementById('last-updated').textContent =
    'Updated ' + new Date().toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'});
}

// ─── RENDER POOL ──────────────────────────────────────────────────────────────

function renderPool(pool) {
  const container = document.getElementById('pool-table');
  if (!pool || !pool.length) {
    container.innerHTML = '<div class="no-data">No data yet.</div>';
    return;
  }

  const worstScore = pool[pool.length - 1].total;

  let html = `<div class="pool-table-inner">
    <div class="pool-header">
      <div>Pos</div><div>Player</div>
      <div>Pick 1</div><div>Pick 2</div><div>Pick 3</div><div>Pick 4</div>
      <div style="text-align:right">Total</div>
    </div>`;

  pool.forEach((row, i) => {
    const isLast = row.total === worstScore;
    const posClass = i===0?'pos-1':i===1?'pos-2':i===2?'pos-3':isLast?'pos-last':'pos-other';

    const chips = row.golfers.map(g => {
      const isCut = g.status === 'CUT' || g.status === 'WD';
      const isNF  = g.status === 'notfound';
      const cls   = (isCut||isNF) ? 'golfer-chip cut' : 'golfer-chip';
      const last  = g.name.split(' ').slice(-1)[0];
      let scoreHtml;
      if (isCut) {
        scoreHtml = `<span class="chip-score cut-pen">+${MISSED_CUT_PENALTY}</span><span class="chip-thru">CUT</span>`;
      } else if (isNF) {
        scoreHtml = `<span class="chip-score cut-pen">+${MISSED_CUT_PENALTY}</span><span class="chip-thru">?</span>`;
      } else {
        const thru = g.thru==='F' ? 'F' : !g.thru||g.thru==='-' ? '-' : `H${g.thru}`;
        scoreHtml = `<span class="chip-score ${scoreClass(g.score)}">${fmtScore(g.score)}</span><span class="chip-thru">${thru}</span>`;
      }
      return `<div class="${cls}"><span class="chip-name" title="${g.name}">${last}</span>${scoreHtml}</div>`;
    }).join('');

    const badge = isLast ? `<div class="punishment-badge" title="Rumbler incoming">🍺🥃</div>` : '';

    html += `
      <div class="pool-row${isLast?' is-last':''}">
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
          <div class="pos-badge ${posClass}">${i+1}</div>${badge}
        </div>
        <div>
          <div class="player-name">${row.participant}</div>
          ${isLast ? `<div class="punishment-label">Rumbler 🫠</div>` : ''}
        </div>
        ${chips}
        <div class="total-score ${scoreClass(row.total)}">${fmtScore(row.total)}</div>
      </div>`;
  });

  container.innerHTML = html + '</div>';
}

// ─── RENDER GOLF TABLE ────────────────────────────────────────────────────────

function renderGolf() {
  const container = document.getElementById('golf-table');
  if (!golfField.length) {
    container.innerHTML = '<div class="no-data">No leaderboard data available.</div>';
    return;
  }

  const allPicks = new Set(poolPicks.flatMap(p => p.golfers.map(g => g.toLowerCase())));
  const isPicked = name => Array.from(allPicks).some(n => namesMatch(n, name));

  let html = `
    <div class="golf-header">
      <div>Pos</div><div>Golfer</div>
      <div class="gcol-r1" style="text-align:center">R1</div>
      <div class="gcol-r2" style="text-align:center">R2</div>
      <div class="gcol-r3" style="text-align:center">R3</div>
      <div class="gcol-r4" style="text-align:center">R4</div>
      <div style="text-align:center">Thru</div>
      <div style="text-align:center">Total</div>
    </div>`;

  golfField.slice(0, 60).forEach(g => {
    const isCut  = g.status === 'CUT' || g.status === 'WD';
    const picked = isPicked(g.name);
    const cls    = ['golf-row', isCut?'is-cut':'', picked?'is-picked':''].filter(Boolean).join(' ');
    const dot    = picked ? '<span class="picked-dot"></span>' : '';
    const pos    = isCut ? (g.status==='WD'?'WD':'CUT') : g.pos;
    const thru   = isCut ? '—' : g.thru==='F' ? 'F' : !g.thru||g.thru==='-' ? '—' : 'H'+g.thru;
    const fmt    = n => (n===null||n===undefined) ? '—' : String(n);

    html += `
      <div class="${cls}">
        <div class="golf-pos">${pos}</div>
        <div class="golf-name">${g.name}${dot}</div>
        <div class="gcell gcol-r1">${fmt(g.r1)}</div>
        <div class="gcell gcol-r2">${fmt(g.r2)}</div>
        <div class="gcell gcol-r3">${fmt(g.r3)}</div>
        <div class="gcell gcol-r4">${fmt(g.r4)}</div>
        <div class="gcell" style="font-size:12px;color:var(--text-muted)">${thru}</div>
        <div class="gcell ${isCut?'cut-label':scoreClass(g.score)}">${isCut?(g.status==='WD'?'WD':'CUT'):fmtScore(g.score)}</div>
      </div>`;
  });

  container.innerHTML = html;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function checkUnmatched(pool) {
  const unmatched = pool.flatMap(r =>
    r.golfers.filter(g => g.status === 'notfound').map(g => `"${g.name}" (${r.participant})`)
  );
  if (unmatched.length) {
    showBanner('warn', `Could not match ${unmatched.length} pick(s): ${unmatched.slice(0,4).join(', ')}${unmatched.length>4?'…':''}`);
  }
}

function showBanner(type, msg) {
  const el = document.getElementById('banner');
  el.className = 'banner ' + type;
  el.textContent = msg;
}
function hideBanner() {
  const el = document.getElementById('banner');
  if (el) el.className = 'banner';
}

function exportCSV() {
  const saved = loadResult(_config.storageKey);
  if (!saved) return;
  const rows = [['Participant','Pick1','Score1','Pick2','Score2','Pick3','Score3','Pick4','Score4','Total']];
  saved.results.forEach(r => {
    rows.push([r.participant, ...r.golfers.flatMap(g => [g.name, fmtScore(g.score)]), fmtScore(r.total)]);
  });
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
  a.download = `${_config.tournamentId}_pool_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}
