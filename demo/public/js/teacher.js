// Step4 老师审批 / 卡片化编辑页
// 复用 HENRY 数据，四块做成可编辑卡片：编辑/保存切换 + contenteditable + 星级控件 + AI建议 + 修订留痕
(function () {
  // 等待页面加载完成后绑定事件
  function init() {
  const H = window.applyInputOverride(window.HENRY);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const $ = sel => document.querySelector(sel);

  // —— 初始化默认状态：只读报告显示，卡片隐藏，审批栏隐藏 ——
  $('#cards').style.display = 'none';
  $('#report').style.display = 'block';
  $('#approveBar').style.display = 'none';

  // —— 星级转百分比（与模块3 一致）——
  function starPct(stars) {
    const full = (stars.match(/★/g) || []).length;
    const half = (stars.match(/½/g) || []).length;
    return Math.round(((full + half * 0.5) / 5) * 100);
  }

  // —— SVG 路线图（与模块3 展示页一致）——
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

  // —— 五步导航（与模块3 展示页同格式：N. 步骤，当前步高亮）——
  const NAV_STEPS = ['录入', 'AI访谈', '生成报告和老师审批', '校长审批', '导出'];
  const NAV_ACTIVE = 2; // 本页 = 生成报告和老师审批
  $('#topnav').innerHTML = NAV_STEPS.map((s, i) =>
    `<span class="step ${i === NAV_ACTIVE ? 'active' : ''}">${i + 1}. ${s}</span>`).join('');

  // —— 星级控件 ——
  function starHTML(key, val) {
    const n = (val.match(/★/g) || []).length;
    const half = val.includes('½');
    const full = half ? n - 1 : n;
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      const on = i <= full ? 'on' : (half && i === full + 1 ? 'on' : '');
      stars += `<span class="s ${on}" data-i="${i}">${half && i===full+1?'⯨':'★'}</span>`;
    }
    return `<span class="stars" data-key="${key}">${stars}</span>`;
  }

  // —— 各块渲染（文本包 .ed 以便编辑态可改）——
  function block1() {
    const p = H.profile;
    const chips = p.chips.map(c => `<span class="chip"><b>${esc(c.k)}</b> <span class="ed" data-f="chip">${esc(c.v)}</span>${c.note?`<small>${esc(c.note)}</small>`:''}</span>`).join('');
    const bars = p.academics.map(a => `
      <div class="bar-row"><span class="lab">${esc(a.name)}</span>
        <div class="bar-track"><div class="bar-fill ${a.low?'low':''}" style="width:${a.pct}%"></div></div>
        <span class="bar-val">${a.score} / ${a.max}</span></div>`).join('');
    const tags = p.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('');
    return `<div class="sec"><h2>一、学生画像（所有信息）</h2>
      <div class="chips">${chips}</div>
      <div style="font-size:13px;color:var(--text-l);margin:10px 0 2px;">学业竞争力（MYP 1–7 量表）</div>${bars}
      <div class="chips" style="margin-top:14px;">${tags}</div></div>`;
  }

  function block2() {
    const s = H.summary;
    const tri = `<div class="tricards">` + ['green','red','de'].map(k => {
      const c = s.tri[k];
      const items = c.items.map(i => `<li><span class="ed" data-f="tri">${esc(i)}</span></li>`).join('');
      return `<div class="tcard ${k==='green'?'g':k==='red'?'r':'d'}"><h3>${esc(c.title)}</h3><ul>${items}</ul></div>`;
    }).join('') + `</div>`;
    const strengths = s.strengths.map(r => `<tr><td>${esc(r.dim)}</td><td><span class="ed" data-f="str">${esc(r.text)}</span></td></tr>`).join('');
    const weaknesses = s.weaknesses.map(r => `<tr><td>${esc(r.dim)}</td><td><span class="ed" data-f="weak">${esc(r.text)}</span></td></tr>`).join('');
    return `<div class="sec"><h2>二、材料提取信息总结</h2>${tri}
      <div class="tq g"><h4>🟢 优点（引用老师评语）</h4><table>${strengths}</table></div>
      <div class="tq r"><h4>🔴 改进点（引用老师评语）</h4><table>${weaknesses}</table></div></div>`;
  }

  function block3() {
    const d = H.diagnosis;
    // 使用 meter 格式 + 可点击星级
    const sb = d.schools.map(s => `
      <div class="row"><span class="name">${esc(s.name)}</span><div class="grp">
        <div class="meter"><span class="mlab">匹配</span><div class="mtrack"><div class="mfill" style="width:${starPct(s.match)}%"></div></div><span class="stars clickable" data-key="match-${s.name}">${esc(s.match)}</span></div>
        <div class="meter"><span class="mlab">推荐</span><div class="mtrack"><div class="mfill" style="width:${starPct(s.rec)}%"></div></div><span class="stars clickable" data-key="rec-${s.name}">${esc(s.rec)}</span></div>
      </div></div>`).join('');
    const tu = d.schools.map(s => `<div class="row"><span class="name">${esc(s.name)}</span><div class="track"><div class="fill" style="width:${s.pct}%"></div></div><span class="val"><span class="ed" data-f="tuition">${esc(s.tuition)}</span></span></div>`).join('');
    // 专业推荐表格 - 让方向和专业也可编辑
    const majors = d.majors.map(m => `<tr ${m.warn?'class="warn"':''}><td><span class="ed" data-f="dir">${esc(m.dir)}</span></td><td><span class="ed" data-f="major">${esc(m.major)}</span></td><td><span class="ed" data-f="major-basis">${esc(m.basis)}</span></td></tr>`).join('');
    const deList = d.deImpact.map(x => `<li ${x.conclusion?'class="de-conclusion"':''}><b>${esc(x.b)}</b>：<span class="ed" data-f="de">${esc(x.t)}</span></li>`).join('');
    const schol = d.scholarship.map(p => `
      <div class="schol-card ${p.type}">
        <div class="schol-head"><span class="schol-badge ${p.type}">${esc(p.status)}</span><b>${esc(p.title)}</b></div>
        <div class="schol-why"><span class="ed" data-f="schol-why">${esc(p.why)}</span></div>
        <div class="schol-next"><b>建议：</b><span class="ed" data-f="schol-next">${esc(p.next)}</span></div>
      </div>`).join('');
    return `<div class="sec"><h2>三、目标学校诊断</h2>
      <p class="sub">三校星级对比 + 学费对比 ＋ 德国籍影响 ＋ 专业推荐 ＋ 奖学金可行性</p>
      <div class="sb">${sb}</div>
      <div class="tu"><div style="font-size:13px;color:var(--text-l);margin-bottom:2px;">4 年总自费（无奖学金）</div>${tu}</div>
      <div class="kq-box"><h4>🇩🇪 德国籍对目标学校诊断的影响</h4><ul>${deList}</ul></div>
      <div class="major"><div class="block-title">🎯 专业推荐（基于 Holland I=100% + 兴趣地图 + 学科优势）</div><table><tr><th>推荐方向</th><th>对应专业</th><th>依据</th></tr>${majors}</table></div>
      <div class="stat">${schol}</div>
      <div class="legend">${esc(d.starNote)}</div></div>`;
  }

  function block4() {
    const iv = H.intervention;
    const rm = iv.roadmap;
    // 使用与模块3一致的 SVG 路线图
    const roadmap = buildRoadmap(rm);
    // 路线图可编辑文本（年份+目标）
    const roadmapText = rm.stages.map(s => `${s.label}${s.sub ? ' '+s.sub : ''}：${s.desc}`).join('\n') + '\n\n目标：' + rm.goal.main + ' (' + rm.goal.note + ')';
    // 优先级也设为可编辑
    const rows = iv.actions.map(a => `<tr>
      <td><span class="ed" data-f="act-goal">${esc(a.goal)}</span></td>
      <td><span class="ed" data-f="act-pri">${esc(a.pri)}</span></td>
      <td><span class="ed" data-f="act-basis">${esc(a.basis)}</span></td>
      <td><span class="ed" data-f="act-in">${esc(a.inSchool)}</span></td>
      <td><span class="ed" data-f="act-out">${esc(a.outSchool)}</span></td></tr>`).join('');
    return `<div class="sec"><h2>四、干预手段</h2>
      ${roadmap}
      <textarea class="ed" data-f="roadmap-text" style="display:none;"></textarea>
      <div class="legend">${esc(rm.legend)}</div>
      <div class="block-title" style="margin-top:22px;">🎯 本学期目标拆解与行动建议</div>
      <table class="atbl"><tr><th>本学期目标</th><th>优先级</th><th>依据</th><th>校内</th><th>校外</th></tr>${rows}</table></div>`;
  }

  const BLOCKS = [
    {id:1, title:'学生画像', render:block1},
    {id:2, title:'材料提取信息总结', render:block2},
    {id:3, title:'目标学校诊断', render:block3},
    {id:4, title:'干预手段', render:block4}
  ];

  // —— 渲染卡片外壳 ——
  $('#cards').innerHTML = BLOCKS.map(b => `
    <div class="ecard" id="ecard${b.id}">
      <div class="ecard-head">
        <span class="num">${b.id}</span>
        <h3>${b.title}</h3>
        <span class="state" id="state${b.id}">未修改</span>
        <button class="btn ghost sm" onclick="TE.edit(${b.id})">✏️ 编辑</button>
        <button class="btn kq sm" style="display:none" id="save${b.id}" onclick="TE.save(${b.id})">💾 保存</button>
      </div>
      <div class="ecard-body" id="body${b.id}">${b.render()}</div>
      <div class="ecard-actions" id="acts${b.id}" style="display:none;padding:0 16px 14px;">
        <button class="btn ghost sm" onclick="TE.aiFor(${b.id})">✨ AI 建议修改</button>
        <button class="btn ghost sm" onclick="TE.cancel(${b.id})">撤销本块修改</button>
      </div>
    </div>`).join('');

  // —— 交互 ——
  const TE = {
    edit(id) {
      const card = $('#ecard'+id);
      card.classList.add('edit');
      card.querySelectorAll('.ed').forEach(el => el.setAttribute('contenteditable','true'));
      card.querySelector('.state').textContent = '编辑中';
      card.querySelector('.state').className = 'state edited';
      card.querySelector('[onclick^="TE.edit"]')?.style && (card.querySelector('[onclick^="TE.edit"]').style.display='none');
      $('#save'+id).style.display = '';
      $('#acts'+id).style.display = 'flex';
    },
    cancel(id) {
      // 重新渲染该块，丢弃未保存改动
      const body = $('#body'+id);
      body.innerHTML = BLOCKS[id-1].render();
      this._exit(id, false);
    },
    save(id) {
      const card = $('#ecard'+id);
      const changed = card.querySelectorAll('.ed.changed');
      if (changed.length) {
        const parts = [];
        changed.forEach(el => parts.push(el.getAttribute('data-f') || '文本'));
        addTrail(`修改了「${BLOCKS[id-1].title}」：${parts.length} 处文本已更新`);
      }
      this._exit(id, true);
    },
    _exit(id, markEdited) {
      const card = $('#ecard'+id);
      card.classList.remove('edit');
      card.querySelectorAll('.ed').forEach(el => { el.removeAttribute('contenteditable'); el.classList.remove('changed'); });
      const st = $('#state'+id);
      if (markEdited) { st.textContent = '已修改'; st.className = 'state edited'; }
      else { st.textContent = '未修改'; st.className = 'state'; dirty = false; }
      card.querySelector('[onclick^="TE.edit"]').style.display = '';
      $('#save'+id).style.display = 'none';
      $('#acts'+id).style.display = 'none';
    },
    aiFor(id) {
      // 演示预设：基于老师意见生成建议，采用后写入对应 .ed
      const note = $('#teacherNote').value.trim();
      const presets = AI_PRESETS[id] || [];
      const box = $('#aiSugs');
      if (!presets.length) { box.innerHTML = '<div class="ai-sug">该模块暂无需调整的建议。</div>'; }
      else {
        box.innerHTML = presets.map((p,i) => `
          <div class="ai-sug">
            <span class="tag">${esc(p.tag)}</span>
            <div class="txt">${esc(p.text)}</div>
            <div class="acts">
              <button class="btn ghost sm" onclick="TE.aiUse(${id},${i})">采用</button>
              <button class="btn ghost sm" onclick="this.closest('.ai-sug').style.opacity=.4">忽略</button>
            </div>
          </div>`).join('');
      }
      $('#aiModal').classList.add('show');
    },
    aiUse(id, i) {
      const p = AI_PRESETS[id][i];
      const card = $('#ecard'+id);
      if (!card.classList.contains('edit')) this.edit(id);
      // 使用更简单的方式查找目标元素
      let target = null;
      if (p.sel) {
        target = card.querySelector(p.sel);
      }
      if (!target && id === 3) {
        // 块3的特殊处理
        if (p.tag.includes('推荐度')) {
          // 找到港科大的推荐星级并修改
          const rows = card.querySelectorAll('.row');
          if (rows[0]) {
            const stars = rows[0].querySelector('.stars.clickable');
            if (stars) { stars.textContent = p.replace; stars.classList.add('changed'); target = stars; }
          }
        }
      }
      if (target) { 
        target.textContent = p.replace; 
        target.classList.add('changed'); 
      }
      // 同时把建议内容更新到老师审批意见框
      const noteBox = $('#teacherNote');
      if (noteBox && p.text) {
        noteBox.value = p.text;
        noteBox.classList.add('changed');
      }
      addTrail(`采用 AI 建议：${p.tag} — ${p.text.slice(0,24)}…`);
      dirty = true;
      $('#aiModal').classList.remove('show');
    }
  };
  window.TE = TE;

  // —— 修订留痕 ——
  function nowHM() {
    const d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }
  function addTrail(text) {
    const list = $('#trailList');
    if (list.querySelector('.empty')) list.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'item';
    const time = nowHM();
    div.innerHTML = `<b>王老师</b> · ${time} · ${esc(text)}`;
    list.prepend(div);
    // 保存到 localStorage，供校长审批页使用
    const trails = JSON.parse(localStorage.getItem('trails') || '[]');
    trails.unshift({ who: '王老师', time: time, what: text });
    localStorage.setItem('trails', JSON.stringify(trails));
  }

  // —— 全局事件 ——
  $('#btnSubmit').onclick = () => {
    const note = $('#teacherNote').value.trim();
    addTrail('提交审批意见：' + (note || '（总体意见空白）'));
    // 保存审批意见（供校长审批页 / 导出页使用）
    localStorage.setItem('teacherNote', note);

    // 1) 合成「包含老师意见的最新报告」：编辑态下卡片为最新内容
    let base = isEditMode
      ? syncReportFromCards()
      : (document.getElementById('report').innerHTML || syncReportFromCards());
    base = stripOpinion(base).replace(/ class="ed"/g, '');
    if (note) base += buildOpinionSection(note);   // 老师意见并入报告正文（单一数据源）
    document.getElementById('report').innerHTML = base;
    localStorage.setItem('teacherReportHTML', base);

    // 2) 退出编辑态，直接展示「包含老师意见的最新报告」
    isEditMode = false;
    dirty = false;
    $('#btnEdit').textContent = '✏️ 进入编辑模式';
    $('#report').style.display = 'block';
    $('#cards').style.display = 'none';
    $('#approveBar').style.display = 'none';
    const _tnd = $('#teacherNoteDisplay'); if (_tnd) { _tnd.style.display = 'none'; _tnd.innerHTML = ''; }
  };
  $('#aiClose').onclick = () => $('#aiModal').classList.remove('show');
  $('#aiModal').onclick = e => { if (e.target.id === 'aiModal') $('#aiModal').classList.remove('show'); };
  // 顶部「✨ 查看 AI 建议」：显示建议列表，点击采用才添加到意见框
  $('#btnAi').onclick = () => {
    const box = $('#aiSugs');
    const all = [];
    Object.keys(AI_PRESETS).forEach(id => AI_PRESETS[id].forEach((p, i) => all.push(Object.assign({ id, i }, p))));
    if (!all.length) { box.innerHTML = '<div class="ai-sug">暂无可用建议。</div>'; }
    else {
      box.innerHTML = all.map(o => `
        <div class="ai-sug">
          <span class="tag">${esc(o.tag)}</span>
          <div class="txt">${esc(o.text)}</div>
          <div class="acts">
            <button class="btn kq sm" onclick="applyAiSuggestion('${o.text.replace(/'/g, "\\'")}', this)">采用</button>
          </div>
        </div>`).join('');
    }
    $('#aiModal').classList.add('show');
  };
  // 全局函数：采用建议（叠加模式，不重复相同意见）
  window.applyAiSuggestion = function(text, btn) {
    const noteBox = $('#teacherNote');
    if (noteBox) {
      const current = noteBox.value.trim();
      if (current && current.includes(text)) {
        // 已有相同意见，不重复添加
      } else if (current) {
        noteBox.value = current + '\n' + text;
      } else {
        noteBox.value = text;
      }
      noteBox.classList.add('changed');
      dirty = true;
      addTrail('采用 AI 建议：' + text.slice(0,20) + '…');
    }
    // 标记按钮为已采用，不关闭弹窗
    if (btn) {
      btn.textContent = '✓ 已采用';
      btn.disabled = true;
      btn.classList.remove('kq');
      btn.classList.add('ghost');
    }
  };

  // 标记 changed + 星级点选（事件委托）
  document.addEventListener('input', e => {
    if (e.target.classList?.contains('ed')) { e.target.classList.add('changed'); dirty = true; }
  });
  document.addEventListener('click', e => {
    // 处理可点击星级（编辑模式下）
    const starEl = e.target.closest('.stars.clickable');
    if (starEl && e.target.closest('.ecard.edit')) {
      const key = starEl.dataset.key;
      const current = starEl.textContent;
      const n = (current.match(/★/g) || []).length;
      const next = n >= 5 ? 1 : n + 1;
      starEl.textContent = '★'.repeat(next);
      starEl.classList.add('changed');
      dirty = true;
      return;
    }
    // 处理星级控件内的点选
    const s = e.target.closest('.stars .s');
    if (s && e.target.closest('.ecard.edit')) {
      const stars = s.parentElement;
      const i = +s.dataset.i;
      stars.querySelectorAll('.s').forEach((el,idx) => el.classList.toggle('on', idx < i));
    }
  });

  // —— 演示预设 AI 建议 ——
  const AI_PRESETS = {
    3: [
      {tag:'推荐度上调', sel:'#ecard3 .row:nth-child(1) .stars.clickable',
       text:'老师意见：港科大 STEM 直输 PhD，推荐度从 ★★★★★ 已是最高，保持。', replace:'★★★★★'},
      {tag:'德国籍补一句', sel:'#ecard3 .kq-box ul li:first-child .ed',
       text:'在德国籍影响「港三主目标」中补一句：德国籍同时便于后续申请欧陆英文授课硕士，无需额外语言考试。',
       replace:'Henry 以德国籍走港校「国际生通道」申请，不与内地生或香港本地生挤同一个池子；录取时学术要求不变，但手续上更方便——不用办港澳通行证和内地签注，将来留港工作也免掉一纸「赴港工作同意书」；同时便于申请欧陆英文授课硕士。'}
    ],
    4: [
      {tag:'行动补强', sel:'#ecard4 table tr:first-child td:first-child .ed',
       text:'在「补齐 CAS / Service」目标后补一句：结合德语角/环保社，发挥德国籍文化连接优势。',
       replace:'补齐 CAS / Service ≥3/7（结合德语角/环保社，发挥德国籍文化连接优势）'}
    ]
  };

  // —— 内容修改持久化：把编辑后的报告存到 localStorage，供校长审批页 / 导出页读取 ——
  let isEditMode = false;
  let dirty = false; // 是否有未保存的内容修改

  // 把四块编辑卡片的当前内容同步成只读报告 HTML
  function syncReportFromCards() {
    const cardContents = [];
    for (let i = 1; i <= 4; i++) {
      const card = document.getElementById('ecard' + i);
      if (card) cardContents.push(card.querySelector('.ecard-body').innerHTML);
    }
    return cardContents.map(c => `<section class="sec">${c.replace(/contenteditable="true"/g, '')}</section>`).join('');
  }
  // 老师审批意见段落（并入报告正文，便于校长页 / 导出页统一展示）
  function buildOpinionSection(note) {
    const safe = esc(note);
    return `<section class="sec teacher-note-sec"><h2>老师审批意见</h2><div class="teacher-note-box">${safe.replace(/\n/g, '<br>')}</div></section>`;
  }
  // 去掉旧的意见段落，避免重复提交时叠加
  function stripOpinion(html) {
    return html.replace(/<section class="sec teacher-note-sec">[\s\S]*?<\/section>/g, '');
  }
  // 有修改时才写 localStorage，避免覆盖上一会话已保存的修改
  function persistReportIfDirty() {
    if (!dirty) return;
    const html = syncReportFromCards();
    document.getElementById('report').innerHTML = html;
    localStorage.setItem('teacherReportHTML', html);
  }
  // 把已保存的修改回填到四块编辑卡片（保证再次进入编辑态也显示修改后内容）
  function loadSavedIntoCards(saved) {
    const sections = [...saved.matchAll(/<section class="sec">([\s\S]*?)<\/section>/g)];
    sections.forEach((m, idx) => {
      const card = document.getElementById('ecard' + (idx + 1));
      const body = card && card.querySelector('.ecard-body');
      if (body) {
        body.innerHTML = m[1];
        body.querySelectorAll('.ed').forEach(el => el.setAttribute('contenteditable', 'true'));
      }
    });
  }

  // 离开页面（如直接点「校长审批 ▶」）时，若处于编辑态且有改动，先存盘
  window.addEventListener('beforeunload', () => {
    if (isEditMode && dirty) {
      const html = syncReportFromCards();
      document.getElementById('report').innerHTML = html;
      localStorage.setItem('teacherReportHTML', html);
    }
  });

  // —— 切换编辑模式（合并后的展示+编辑页）——
  window.toggleEditMode = function() {
    isEditMode = !isEditMode;
    const btn = $('#btnEdit');
    const bar = $('#approveBar');
    const report = $('#report');
    const cards = $('#cards');

    if (isEditMode) {
      // 进入编辑模式：显示卡片，隐藏只读报告，显示审批栏
      btn.textContent = '👁 退出编辑模式';
      report.style.display = 'none';
      const _tnd2 = $('#teacherNoteDisplay'); if (_tnd2) _tnd2.style.display = 'none';
      cards.style.display = 'block';
      bar.style.display = 'block';
      // 预填已保存的老师审批意见
      const savedNote = localStorage.getItem('teacherNote');
      $('#teacherNote').value = savedNote || '';
      console.log('进入编辑模式');
      // 渲染四块编辑卡片（每块默认进入编辑状态）
      if (true) {
        console.log('Rendering cards...');
        const html = BLOCKS.map(b => `
          <div class="ecard edit" id="ecard${b.id}">
            <div class="ecard-head">
              <span class="num">${b.id}</span>
              <h3>${b.title}</h3>
              <span class="state edited" id="state${b.id}">编辑中</span>
              <button class="btn kq sm" onclick="TE.save(${b.id})">💾 保存</button>
            </div>
            <div class="ecard-body" id="body${b.id}">${b.render()}</div>
            <div class="ecard-actions" style="display:flex;padding:0 16px 14px;">
              <button class="btn ghost sm" onclick="TE.cancel(${b.id})">撤销本块修改</button>
            </div>
          </div>`).join('');
        cards.innerHTML = html;
        // 自动给所有 .ed 元素添加 contenteditable
        cards.querySelectorAll('.ed').forEach(el => el.setAttribute('contenteditable', 'true'));
        // 若有已保存的修改，回填到卡片，保证编辑态也显示修改后内容
        const saved = localStorage.getItem('teacherReportHTML');
        if (saved && saved.trim()) loadSavedIntoCards(saved);
        dirty = false;
        console.log('Cards rendered, innerHTML length:', cards.innerHTML.length);
      }
    } else {
      // 退出编辑模式：把卡片中编辑的内容同步到只读报告，并统一并入老师意见，然后显示
      btn.textContent = '✏️ 进入编辑模式';
      const synced = stripOpinion(syncReportFromCards()).replace(/ class="ed"/g, '');
      const note = (localStorage.getItem('teacherNote') || '').trim();
      let html = synced;
      if (note) html += buildOpinionSection(note);   // 始终并入老师意见，避免退出时丢失
      report.innerHTML = html;
      if (dirty) localStorage.setItem('teacherReportHTML', html);
      report.style.display = 'block';
      cards.style.display = 'none';
      bar.style.display = 'none';
      // 老师审批意见已并入报告正文，无需在独立 div 重复展示
    }
  };
  } // 结束 init 函数

  // 等待页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
