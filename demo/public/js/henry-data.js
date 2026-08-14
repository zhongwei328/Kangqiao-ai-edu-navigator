// Henry（牟海天）预置数据 —— 模块3 报告（展示态）
// 数据驱动：report3.js 据此渲染。后续 Step4 老师编辑态将直接读写此对象。
window.HENRY = {
  meta: {
    title: "Henry（牟海天）诊断报告",
    sub: "",
    input: "G7 学业成绩、性格测评、竞赛、Service as Action、英语标化、国籍（德国籍）",
    goal: "港三全奖（港大 / 港科大 / 港中文）｜其他目的地作参考",
    footer: "数据来源：2026 QS 排名；港三非本地生学费 2026 核实；PP 10043 公告；EU/ETH/TU Delft 公开招生政策；Henry 学业报告与测评（G7 下学年报告等）。缺口仍标 [待学校提供 / 待老师确认]。"
  },

  // 一、学生画像
  profile: {
    chips: [
      { k: "姓名", v: "牟海天（Henry）" },
      { k: "年级", v: "G7 / 昆山康桥国际学校" },
      { k: "国籍", v: "🇩🇪 德国籍（Non-JUPAS 国际生池）", note: "Non-JUPAS：以国际生身份申请港校，不与香港本地生或内地生共享招生名额。" },
      { k: "目标", v: "港三全奖（港大 / 港科大 / 港中文）", highlight: true },
      { k: "性格", v: "ESTP · 调研100% + 社会82%" }
    ],
    academics: [
      { name: "数学", score: 7, max: 7, pct: 100 },
      { name: "人文", score: 7, max: 7, pct: 100 },
      { name: "英语", score: 7, max: 7, pct: 100 },
      { name: "中文", score: 7, max: 7, pct: 100 },
      { name: "科学", score: 6, max: 7, pct: 85.7, low: true }
    ],
    risks: ["🔴 Service as Action 0/7", "🔴 英语写作 D6"],
    // 其它活动 / 成就（竞赛、标化等课堂外成绩）；IB 目标分属「目标/风险」，不在此列，已置于 summary.weaknesses
    achievements: [
      "🏅 MK金×3 · AMC8 Top5% · BC生物银",
      "🎤 Spelling Bee上海一等 · 演讲国赛金",
      "📘 学院托福 627 ≈ iBT 95–105"
    ],
    tags: [
      "🏅 MK金×3 · AMC8 Top5% · BC生物银",
      "🎤 Spelling Bee上海一等 · 演讲国赛金",
      "📘 学院托福 627 ≈ iBT 95–105"
    ]
  },

  // 二、材料提取信息总结
  summary: {
    tri: {
      green: { title: "🟢 亮点", items: [
        "数/人/英/中 均 MYP 7（数学·人文·中文各有满分项）",
        "数理+生物早积累（MK金×3 / AMC8 Top5% / BC生物银）",
        "Holland 调研100% + 社会82%、ESTP 实践型"
      ]},
      red: { title: "🔴 改进点", items: [
        "Service 0/7（全奖硬伤）",
        "科学 6（最大分差）",
        "英语写作 D6",
        "IB 目标分需持续关注（MYP≠DP）"
      ]},
      de: { title: "🇩🇪 战略亮点", items: [
        "德国护照 = 欧盟公民身份，将来可以低学费甚至免学费就读德国、瑞士等欧洲顶尖大学，给 Henry 多留一条稳妥后路。",
        "不止欧洲有用：申请美国顶尖理工院校不受部分签证限制；申请香港不用办港澳通行证和内地签注；将来去英国签证也更顺畅。",
        "一句话总结：无论港三结果如何，德国籍都能为 Henry 降低『没拿到全奖』和『未来去美国读研』这两类风险。"
      ]}
    },
    strengths: [
      { dim: "数学", text: "数学老师 Serena Liang：\"fantastic with numbers / gift for math\"；\"对任务和持续完成作业是其他学生的榜样\"（A/B 双满分 8/8，G7下 30/32）" },
      { dim: "人文", text: "人文老师 George Wang：\"在小组任务中分析活动指南时表现尤为出色\"；\"发展出比大多数同学更深入的思考\"、批判性思维满分 8/8" },
      { dim: "英语", text: "英语老师 Carol Li：\"学习的自我驱动力相当明显\"；听力满分 8/8，学院托福 627 ≈ iBT 95–105" },
      { dim: "中文", text: "中文老师 Camilla Tian：\"知识面广博，涉猎不少课外内容，发言时旁征博引、妙趣横生\"；创作满分 8/8" },
      { dim: "科学", text: "科学老师 Millicent Mawela：\"classroom leader\"、\"demonstrates knowledge beyond the topics taught\"、\"intelligent and highly motivated\"" },
      { dim: "综合", text: "多科教师一致赞\"乐于助人/领导力/学习热情\"；中文演讲国赛金奖×2 + 主持 Grade 7" },
      { dim: "专项运动", text: "游泳 MYP 满分 28/32；羽毛球少年一级运动员（中国羽协认证）" }
    ],
    weaknesses: [
      { dim: "英语写作", text: "英语老师 Carol Li：写作 D 档 6 分，\"使用一定范围的词汇/语法，有少量错误但不妨碍沟通\" → 输出型弱于输入，拖累 EE/IA/TOK" },
      { dim: "Service", text: "0/7 完成（仅规划 7/7）→ CAS / 领导力空白，直接拖累港三全奖" },
      { dim: "书写", text: "中文老师 Camilla Tian：\"唯有书写尚有提升空间，若多加练习把字迹打磨得更工整美观\"" },
      { dim: "科学", text: "B 探究设计、C 处理评估连续两学期 6 分 → 实验报告规范与数据精确性待提升（理解力 A/D 均 7，非理解问题）" },
      { dim: "IB 目标分", text: "MYP 当前为校内 1–7 量表（32 分制），与 DP 总分（45 分制）计算方式不同、不可直接相加；进入 DP 后以预估分持续跟踪" }
    ]
  },

  // 三、目标学校诊断
  diagnosis: {
    schools: [
      { name: "港科大", match: "★★★★★", rec: "★★★★★", tuition: "~HK$70 万", pct: 80,
        basis: "STEM/科研直输顶尖 PhD，最贴调研型 I=100%；读纯科研工程最优；冲工程需 Math AA HL 7 + 物理 HL 6 + 总分 40+" },
      { name: "港大", match: "★★★★½", rec: "★★★★½", tuition: "~HK$80–87 万", pct: 100,
        basis: "综合品牌 + 30%+ TOP20 深造率，选项最广；读医/商/法最优；人文 7 + 英语 7 已具优势" },
      { name: "港中文", match: "★★★★☆", rec: "★★★★☆", tuition: "~HK$71 万", pct: 81,
        basis: "双语书院制契合中英双 7、社会型 82%；医/传/计强；科研直输顶尖 PhD 强度略低" }
    ],
    starNote: "星级为估计值（非精确量化）：★★★★★=95–100%｜★★★★½=90–94%｜★★★★☆=85–89%。学费为 2026 非本地生核实值。专业未定前港科大/港大并列最高；读医→港大最优，读纯科研工程→港科大最优。",
    deImpact: [
      { b: "港三（主目标）", t: "Henry 以德国籍走港校『国际生通道』申请，不与内地生或香港本地生挤同一个池子；录取时学术要求不变，但手续上更方便——不用办港澳通行证和内地签注，将来留港工作也免掉一纸『赴港工作同意书』。" },
      { b: "财务对冲", t: "未获奖学金则四年自费 70–87 万港币；德国籍可解锁 EU 近乎免学费（TUM/ETH）作保底，降低\"必须拿全奖\"的刚性压力。" },
      { b: "进阶通道", t: "美国 PP 10043 限制中国籍理工科研究生签证，德/欧盟公民豁免——若将来赴美读研，德国籍是关键保护。" },
      { b: "结论", t: "不改变港三学术门槛，但显著降低\"拿不到奖\"与\"赴美读研\"两类风险，是净正向外部因素。", conclusion: true }
    ],
    majors: [
      { dir: "🥇 首选 · I 赛道", major: "数学 / 生物 / 量化方向（生物统计、环境科学、量化生物）",
        basis: "数学近满分（A/B 双满分）+ BC 生物全球银奖 + 兴趣地图\"生物天然兴奋\"；Holland 调研型 100%" },
      { dir: "I+R 交叉", major: "计算机科学 / 工程类",
        basis: "港科大工程 HL 门槛：数 AA HL 7 + 物理 HL 6 + 总 40+；动手实践（R=64%）契合" },
      { dir: "I+S 交叉", major: "医学 / 公共政策 / 国际关系",
        basis: "港大医学全球顶尖（读医→港大最优）；社会型 82% 提供协作/领导力基础" },
      { dir: "不建议", major: "纯人文 / 纯艺术",
        basis: "非其优势区（艺术/音乐校内 6 分，课外获奖属点缀）", warn: true }
    ],
    scholarship: [
      {
        type: "y",
        title: "港三全奖",
        status: "目前无法判断",
        why: "全奖通常要求学术顶尖 + 社会服务/领导力突出。Henry 目前 CAS/Service 0/7，这是全奖非常看重的短板；加上康桥历年港三全奖人数、申请人数等数据学校尚未提供，所以 AI 现在没法给出『能拿到』或『拿不到』的判断。",
        next: "第一步：本学期先把 Service/CAS 做起来；第二步：向升学组要港三全奖历史数据，再重新评估。"
      },
      {
        type: "g",
        title: "欧盟 / 美国深造",
        status: "通道打开",
        why: "德国籍让 Henry 可以走欧盟高校『免学费或低学费』通道（如德国 TU9、瑞士 ETH 等）；如果将来去美国读理工科研究生，也能避开部分针对中国籍学生的签证限制。",
        next: "这是港三之外的优质『Plan B』，即使港三没拿到全奖，也有高质量退路。"
      },
      {
        type: "n",
        title: "港三国际生通道",
        status: "不加分、不减分",
        why: "德国籍让 Henry 以『国际生』身份申请港校，不用跟内地生或香港本地生挤同一个池子；但港校录取的学术标准（成绩、竞赛、面试）不会因此降低。",
        next: "属于『手续更顺』，不是『降分捷径』，学术硬实力仍是核心。"
      }
    ]
  },

  // 四、干预手段
  intervention: {
    roadmap: {
      stages: [
        { label: "G7下", sub: "当前", desc: "补CAS·强基础", current: true },
        { label: "G8", desc: "稳7·竞赛升级" },
        { label: "G9", desc: "定方向·托福110" },
        { label: "G10", desc: "DP选课·EE" },
        { label: "G11", desc: "DP计分·申请准备" },
        { label: "G12", desc: "提交申请·面试" }
      ],
      goal: { emoji: "🏆", sub: "最终", main: "港三录取·冲全奖", note: "+ EU 备选通道" },
      legend: "最终目标（G12 申请时）：IB 40–42 → 港三录取（港科大优先）→ 冲刺全奖；保持德国籍 EU 备选通道。"
    },
    actions: [
      { goal: "补齐 CAS / Service ≥3/7", pri: "★★★★★", basis: "CAS 0/7 是全奖硬伤、领导力空白直接拖累港三全奖；校内最可控、可追踪，应紧急优先", inSchool: "校园志愿者/环保·支教立项，本学期启动，记录时长与反思", outSchool: "暂无信息" },
      { goal: "科学提升至 7", pri: "★★★★★", basis: "科学 6 是最大分差，DP 物理/生物 HL 需概念深度；关系到 HL 门槛，须 DP 前渐进", inSchool: "实验探究+概念补强，衔接 DP 物/生 HL 基础", outSchool: "暂无信息" },
      { goal: "英语写作 D6 → 7", pri: "★★★★☆", basis: "写作 D6 拖 EE/IA/TOK 后腿、决定 IB 40+；须系统补强才能稳 7、保总分", inSchool: "康桥语言中心写作工作坊，每周输出+批改", outSchool: "暂无信息" },
      { goal: "AMC10 备赛", pri: "★★★★★", basis: "数学竞赛强项自然进阶（AMC8 Top5% → AMC10），支撑港科大 STEM 画像", inSchool: "状元养成计划/数学组系统训练", outSchool: "暂无信息" },
      { goal: "机器人·科创", pri: "★★★★½", basis: "hands-on 契合 ESTP＋调研型，港科大 IRE/UROP 看重，可成科研实践背书、强化申请", inSchool: "状元养成计划机器人/科创项目，产出作品", outSchool: "暂无信息" },
      { goal: "英语辩论 / MUN", pri: "★★★★☆", basis: "补社会型 82% 表达与领导力、契合全奖看重的社会贡献，强化领导力叙事", inSchool: "辩论社/模拟联合国，争取角色与奖项", outSchool: "暂无信息" },
      { goal: "BBO / UKChO 进阶", pri: "★★★★☆", basis: "生物银奖进阶，强化生物工程方向专业画像与匹配度", inSchool: "状元养成计划·生物竞赛辅导（校队含生物科目，学术专案组统一组织 BBO/UKChO 备赛）", outSchool: "暂无信息" },
      { goal: "托福冲 iBT 110", pri: "★★★★☆", basis: "港三 + 美研硬门槛，当前 627≈iBT95–105 仍有空间，标化兜底、申请双通道", inSchool: "康桥语言中心规划备考", outSchool: "暂无信息" },
      { goal: "校外数理拔高（仅补充）", pri: "★★★☆☆", basis: "仅当校内不足时兜底、优先级低于校内资源，避免本末倒置", inSchool: "暂无信息", outSchool: "学而思/新东方，按需选报" }
    ]
  }
};

// —— 最小贯通：Step1 录入覆盖报告头部画像（姓名 / 年级 / 学校 / 目标）——
// 仅在存在有效录入（有姓名）时覆盖；否则原样返回 Henry 预设，不影响原演示。
// 贯通链路：Step1 保存 localStorage['studentInput'] → 本函数映射到报告 chips/meta.title
//          → report3(只读报告) / teacher.js(编辑卡片) / principal.html(校长页) / export.html(导出PDF) 全部生效。
window.getStudentInput = function () {
  try {
    const raw = localStorage.getItem('studentInput');
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !d.name) return null;   // 必须填了姓名才算有效录入
    return d;
  } catch (e) { return null; }
};
window.applyInputOverride = function (src) {
  const d = window.getStudentInput();
  if (!d) return src;
  const profile = JSON.parse(JSON.stringify(src.profile));
  const meta = JSON.parse(JSON.stringify(src.meta));
  profile.chips = profile.chips.map(c => {
    if (c.k === '姓名') return Object.assign({}, c, { v: d.name });
    if (c.k === '年级') {
      const school = d.school ? (' / ' + d.school) : '';
      return Object.assign({}, c, { v: (d.grade || 'G7') + school });
    }
    if (c.k === '目标') {
      const t = [d.targetCountries, d.targetMajor].filter(Boolean).join(' · ');
      return Object.assign({}, c, { v: t || c.v, highlight: true });
    }
    return c;
  });
  meta.title = d.name + ' 诊断报告';
  return Object.assign({}, src, { profile: profile, meta: meta });
};
