// 模块3 报告展示页渲染（数据驱动，展示态）
// 读取 window.HENRY，渲染 4 块：学生画像 / 材料总结 / 目标诊断 / 干预手段
(function () {
  const H = window.applyInputOverride(window.HENRY);
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function renderMeta() {
    document.getElementById('reportTitle').textContent = H.meta.title;
    const subEl = document.getElementById('reportSub');
    subEl.textContent = 'Step 3 / 5 · ' + (H.meta.sub || '生成 AI 诊断报告初稿；老师可进入编辑模式现场修改并审批');
    subEl.insertAdjacentHTML('afterend', `<span class="goal-highlight">${esc(H.meta.goal.split('｜')[0])}</span>`);
  }

  function renderNav() {
    const steps = ['录入', 'AI访谈', '生成报告和老师审批', '校长审批', '导出'];
    const active = 2; // 本页 = 生成报告和老师审批
    document.getElementById('topnav').innerHTML = steps.map((s, i) =>
      `<span class="step ${i === active ? 'active' : ''}">${i + 1}. ${s}</span>`).join('');
  }

  // 一、学生画像
  function sec1() {
    const p = H.profile;
    const chips = p.chips.map(c => {
      const note = c.note ? `<small>${esc(c.note)}</small>` : '';
      const cls = c.highlight ? 'chip chip-highlight' : 'chip';
      return `<span class="${cls}"><b>${esc(c.k)}</b> ${esc(c.v)}${note}</span>`;
    }).join('');
    const tags = p.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('');
    return `<section class="sec">
      <h2>一、学生画像（所有信息）</h2>
      <p class="sub">基本信息</p>
      <div class="chips">${chips}</div>
      <div class="chips" style="margin-top:14px;">${tags}</div>
    </section>`;
  }

  // 二、材料提取信息总结
  function sec2() {
    const s = H.summary;
    const p = H.profile;
    const bars = p.academics.map(a => `
      <div class="bar-row"><span class="lab">${esc(a.name)}</span>
        <div class="bar-track"><div class="bar-fill ${a.low ? 'low' : ''}" style="width:${a.pct}%"></div></div>
        <span class="bar-val">${a.score} / ${a.max}</span></div>`).join('');
    const tri = `
      <div class="tricards">
        <div class="tcard g"><h3>${esc(s.tri.green.title)}</h3><ul>${s.tri.green.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
        <div class="tcard r"><h3>${esc(s.tri.red.title)}</h3><ul>${s.tri.red.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
        <div class="tcard d"><h3>${esc(s.tri.de.title)}</h3><ul>${s.tri.de.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
      </div>`;
    const strengths = s.strengths.map(r => `<tr><td>${esc(r.dim)}</td><td>${esc(r.text)}</td></tr>`).join('');
    const weaknesses = s.weaknesses.map(r => `<tr><td>${esc(r.dim)}</td><td>${esc(r.text)}</td></tr>`).join('');
    return `<section class="sec">
      <h2>二、材料提取信息总结</h2>
      <p class="sub">学业竞争力仪表盘 ＋ 亮点 / 改进点 / 战略亮点 ＋ 老师评语（🟢优点 / 🔴改进点）</p>
      <div style="font-size:13px;color:var(--text-l);margin:4px 0 2px;">学业竞争力（MYP 1–7 量表）</div>
      ${bars}
      ${tri}
      <div class="tq g"><h4>🟢 优点（引用老师评语）</h4><table>${strengths}</table></div>
      <div class="tq r"><h4>🔴 改进点（引用老师评语）</h4><table>${weaknesses}</table></div>
    </section>`;
  }

  // 三、目标学校诊断
  function sec3() {
    const d = H.diagnosis;
    const sb = d.schools.map(s => `
      <div class="row"><span class="name">${esc(s.name)}</span><div class="grp">
        <div class="meter"><span class="mlab">匹配</span><div class="mtrack"><div class="mfill" style="width:${starPct(s.match)}%"></div></div><span class="stars">${esc(s.match)}</span></div>
        <div class="meter"><span class="mlab">推荐</span><div class="mtrack"><div class="mfill" style="width:${starPct(s.rec)}%"></div></div><span class="stars">${esc(s.rec)}</span></div>
      </div></div>`).join('');
    const tu = d.schools.map(s => `
      <div class="row"><span class="name">${esc(s.name)}</span><div class="track"><div class="fill" style="width:${s.pct}%"></div></div><span class="val">${esc(s.tuition)}</span></div>`).join('');
    const deList = d.deImpact.map(x => `<li ${x.conclusion ? 'class="de-conclusion"' : ''}><b>${esc(x.b)}</b>：${esc(x.t)}</li>`).join('');
    const majors = d.majors.map(m => `<tr ${m.warn ? 'class="warn"' : ''}><td>${esc(m.dir)}</td><td>${esc(m.major)}</td><td>${esc(m.basis)}</td></tr>`).join('');
    const schol = d.scholarship.map(p => `
      <div class="schol-card ${p.type}">
        <div class="schol-head">
          <span class="schol-badge ${p.type}">${esc(p.status)}</span>
          <b>${esc(p.title)}</b>
        </div>
        <div class="schol-why">${esc(p.why)}</div>
        <div class="schol-next"><b>建议：</b>${esc(p.next)}</div>
      </div>`).join('');
    return `<section class="sec">
      <h2>三、目标学校诊断</h2>
      <p class="sub">三校星级对比 + 学费对比 ＋ 德国籍影响 ＋ 专业推荐 ＋ 奖学金可行性</p>
      <div class="sb">${sb}</div>
      <div class="tu"><div style="font-size:13px;color:var(--text-l);margin-bottom:2px;">4 年总自费（无奖学金）</div>${tu}</div>
      <div class="kq-box"><h4>🇩🇪 德国籍对目标学校诊断的影响</h4><ul>${deList}</ul></div>
      <div class="major"><div class="block-title">🎯 专业推荐（基于 Holland I=100% + 兴趣地图 + 学科优势）</div>
        <table><tr><th>推荐方向</th><th>对应专业</th><th>依据</th></tr>${majors}</table></div>
      <div class="stat">${schol}</div>
      <div class="legend">${esc(d.starNote)}</div>
    </section>`;
  }

  // 四、干预手段
  function sec4() {
    const iv = H.intervention;
    const roadmap = buildRoadmap(iv.roadmap);
    const rows = iv.actions.map(a => `
      <tr><td>${esc(a.goal)}</td><td class="pri">${esc(a.pri)}</td><td>${esc(a.basis)}</td>
        <td>${esc(a.inSchool)}</td><td class="${a.outSchool === '暂无信息' ? 'na' : ''}">${esc(a.outSchool)}</td></tr>`).join('');
    return `<section class="sec">
      <h2>四、干预手段</h2>
      <p class="sub">表1 · 最终目标拆解（路线图）｜ 表2 · 本学期目标拆解与行动建议</p>
      <div class="block-title">📍 最终目标拆解 · 成长路线图（G7 → G12 → 申请结果）</div>
      ${roadmap}
      <div class="legend">${esc(iv.roadmap.legend)}</div>
      <div class="block-title" style="margin-top:22px;">🎯 本学期目标拆解与行动建议</div>
      <table class="atbl"><tr><th>本学期目标</th><th>优先级</th><th>依据</th><th>校内</th><th>校外</th></tr>${rows}</table>
    </section>`;
  }

  function starPct(stars) {
    const full = (stars.match(/★/g) || []).length;
    const half = (stars.match(/½/g) || []).length;
    return Math.round(((full + half * 0.5) / 5) * 100);
  }

  function buildRoadmap(rm) {
    const n = rm.stages.length;
    const sx = i => 70 + 140 * i;
    const goalX = sx(n - 1) + 130;
    const W = goalX + 60;
    const Hh = 210, y = 95;
    let nodes = '';
    rm.stages.forEach((st, i) => {
      const x = sx(i);
      const fill = st.current ? '#920783' : '#fff';
      const txtColor = st.current ? '#fff' : '#6c0561';
      nodes += `<circle cx="${x}" cy="${y}" r="28" fill="${fill}" stroke="#920783" stroke-width="3"/>`;
      nodes += `<text x="${x}" y="99" fill="${txtColor}" font-size="13" font-weight="700" text-anchor="middle" font-family="sans-serif">${esc(st.label)}</text>`;
      if (st.sub) nodes += `<text x="${x}" y="113" fill="${txtColor}" font-size="9" text-anchor="middle" font-family="sans-serif">${esc(st.sub)}</text>`;
      nodes += `<text x="${x}" y="148" fill="#333" font-size="11" text-anchor="middle" font-family="sans-serif">${esc(st.desc)}</text>`;
    });
    const g = rm.goal;
    nodes += `<circle cx="${goalX}" cy="${y}" r="36" fill="#55044c" stroke="#920783" stroke-width="3"/>`;
    nodes += `<text x="${goalX}" y="90" fill="#fff" font-size="20" text-anchor="middle" font-family="sans-serif">${g.emoji}</text>`;
    nodes += `<text x="${goalX}" y="108" fill="#fff" font-size="10" font-weight="700" text-anchor="middle" font-family="sans-serif">${esc(g.sub)}</text>`;
    nodes += `<text x="${goalX}" y="158" fill="#6c0561" font-size="11" font-weight="700" text-anchor="middle" font-family="sans-serif">${esc(g.main)}</text>`;
    nodes += `<text x="${goalX}" y="174" fill="#23ac38" font-size="10" font-weight="700" text-anchor="middle" font-family="sans-serif">${esc(g.note)}</text>`;
    return `<svg class="roadmap" viewBox="0 0 ${W} ${Hh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="成长路线图">
      <defs><linearGradient id="kqline" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#920783"/><stop offset="100%" stop-color="#55044c"/></linearGradient></defs>
      <line x1="70" y1="${y}" x2="${goalX}" y2="${y}" stroke="url(#kqline)" stroke-width="4" stroke-dasharray="2 6" stroke-linecap="round"/>
      ${nodes}
    </svg>`;
  }

  function init() {
    if (!H) {
      document.getElementById('report').innerHTML = '<p style="color:var(--red)">数据加载失败。</p>';
      return;
    }
    renderMeta();
    renderNav();
    document.getElementById('report').innerHTML = sec1() + sec2() + sec3() + sec4();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
