'use strict';

// ============================================================
// CATALOG — panel types, symbols, templates
// Edit this file to add/remove panel types and templates.
// ============================================================

const SVG_NS = 'http://www.w3.org/2000/svg';

// ── Language ─────────────────────────────────────────────────
let LANG = localStorage.getItem('joinery-lang') || 'en';
function setLang(lang) { LANG = lang; localStorage.setItem('joinery-lang', lang); }
function getLang() { return LANG; }

// ── Type labels (English) ─────────────────────────────────────
const PANE_TYPE_LABELS = {
  'fixed':              'Fixed',
  'casement-left':      'Casement L',
  'casement-right':     'Casement R',
  'casement-top':       'Top Hung',
  'casement-bottom':    'Bottom Hung',
  'awning':             'Awning',
  'hopper':             'Hopper',
  'sliding-2t':         'Sliding 2T',
  'sliding-3t':         'Sliding 3T',
  'pivot-v':            'Pivot V',
  'pivot-h':            'Pivot H',
  'tilt-turn':          'Tilt-Turn',
  'louvre':             'Louvre',
  'sliding-single':     'Single Slide R',
  'hung-double':        'Double Hung',
  'projecting':         'Projecting',
  'tate-suberidashi':   'Vert. Slide-Out',
  // New operation types
  'casement-double':    'Double Casement',
  'outward-tilt':       'Outward Tilt',
  'sliding-apart':      'Slide Apart',
  'sliding-left':       'Single Slide L',
  // Door types
  'door-single':        'Single Door',
  'door-double':        'Double Door',
  'door-sliding':       'Sliding Door',
  'door-bifold':        'Bifold Door',
  'door-french':        'French Doors',
  'door-pocket':        'Pocket Door',
  'door-overhead':      'Overhead Door',
  'door-accordion':     'Accordion Door',
  'door-parent-child':  'Parent-Child Door',
  // New door types
  'door-sliding-apart': 'Door Slide Apart',
  'door-free-swing':    'Free Swing',
  'door-bypass':        'Bypass Door',
  // Traditional Japanese types
  'shoji':              'Shoji Screen',
  'fusuma':             'Fusuma',
  'ranma':              'Ranma Transom',
  'koshido':            'Lattice Door',
  'shitomido':          'Shitomido Shutter',
  'agedo':              'Lift Door',
};

// ── Type labels (Japanese / JIS A 0150) ──────────────────────
const PANE_TYPE_LABELS_JA = {
  'fixed':              '嵌殺し',
  'casement-left':      '片開き（左勝手）',
  'casement-right':     '片開き（右勝手）',
  'casement-top':       '上吊り',
  'casement-bottom':    '下吊り',
  'awning':             '外倒し（下辺蝶番）',
  'hopper':             '内倒し',
  'sliding-2t':         '引違い',
  'sliding-3t':         '3枚建引違い',
  'pivot-v':            '縦軸回転',
  'pivot-h':            '横軸回転',
  'tilt-turn':          '内倒し兼用回転',
  'louvre':             'ガラリ',
  'sliding-single':     '片引き（右勝手）',
  'hung-double':        '上げ下げ窓',
  'projecting':         '突出し',
  'tate-suberidashi':   '縦辷出し',
  'casement-double':    '両開き',
  'outward-tilt':       '外倒し',
  'sliding-apart':      '引分け',
  'sliding-left':       '片引き（左勝手）',
  'door-single':        '片開き扉',
  'door-double':        '両開き扉',
  'door-sliding':       '引き戸',
  'door-bifold':        '折れ戸',
  'door-french':        'フランス扉',
  'door-pocket':        '引込戸',
  'door-overhead':      'オーバーヘッドドア',
  'door-accordion':     'アコーディオンドア',
  'door-parent-child':  '親子扉',
  'door-sliding-apart': '引分け扉',
  'door-free-swing':    '自由戸',
  'door-bypass':        '立て引き',
  'shoji':              '障子',
  'fusuma':             '襖',
  'ranma':              '欄間',
  'koshido':            '格子戸',
  'shitomido':          '蔀戸',
  'agedo':              '上げ戸',
};

// Returns label in current language
function L(typeId) {
  if (LANG === 'ja') return PANE_TYPE_LABELS_JA[typeId] ?? PANE_TYPE_LABELS[typeId] ?? typeId;
  return PANE_TYPE_LABELS[typeId] ?? typeId;
}

const PANE_TYPE_ICONS = {
  'fixed':'▭','casement-left':'◁','casement-right':'▷',
  'casement-top':'△','casement-bottom':'▽',
  'awning':'⌒','hopper':'⌣','sliding-2t':'↔',
  'sliding-3t':'⟺','pivot-v':'⊕','pivot-h':'⊗',
  'tilt-turn':'◈','louvre':'≡',
  'sliding-single':'→','hung-double':'↕',
  'projecting':'⌅','tate-suberidashi':'↗',
  'casement-double':'⇔','outward-tilt':'⌅',
  'sliding-apart':'↔','sliding-left':'←',
  'door-single':'🚪','door-double':'⟨⟩',
  'door-sliding':'↦','door-bifold':'⋈','door-french':'⟪⟫',
  'door-pocket':'⇥','door-overhead':'⊟',
  'door-accordion':'〰','door-parent-child':'⊣',
  'door-sliding-apart':'⇔','door-free-swing':'↺','door-bypass':'⊡',
  'shoji':'⊞','fusuma':'▤','ranma':'⊟','koshido':'⊡','shitomido':'⌬','agedo':'⇑',
};

const GLASS_COLORS = {
  'fixed':              'rgba(120,185,230,0.38)',
  'casement-left':      'rgba(100,200,155,0.38)',
  'casement-right':     'rgba(100,200,155,0.38)',
  'casement-top':       'rgba(100,200,155,0.38)',
  'casement-bottom':    'rgba(100,200,155,0.38)',
  'awning':             'rgba(120,200,160,0.38)',
  'hopper':             'rgba(120,200,160,0.38)',
  'sliding-2t':         'rgba(80,210,190,0.38)',
  'sliding-3t':         'rgba(80,210,190,0.38)',
  'pivot-v':            'rgba(180,150,230,0.38)',
  'pivot-h':            'rgba(180,150,230,0.38)',
  'tilt-turn':          'rgba(200,210,100,0.38)',
  'louvre':             'rgba(220,185,130,0.38)',
  'sliding-single':     'rgba(80,210,190,0.38)',
  'hung-double':        'rgba(80,195,210,0.38)',
  'projecting':         'rgba(120,200,160,0.38)',
  'tate-suberidashi':   'rgba(100,200,155,0.38)',
  'casement-double':    'rgba(100,200,155,0.38)',
  'outward-tilt':       'rgba(120,200,160,0.38)',
  'sliding-apart':      'rgba(80,210,190,0.38)',
  'sliding-left':       'rgba(80,210,190,0.38)',
  'door-single':        'rgba(200,170,120,0.32)',
  'door-double':        'rgba(200,170,120,0.32)',
  'door-sliding':       'rgba(200,170,120,0.32)',
  'door-bifold':        'rgba(200,170,120,0.32)',
  'door-french':        'rgba(200,170,120,0.32)',
  'door-pocket':        'rgba(200,170,120,0.32)',
  'door-overhead':      'rgba(180,155,110,0.32)',
  'door-accordion':     'rgba(200,170,120,0.32)',
  'door-parent-child':  'rgba(200,170,120,0.32)',
  'door-sliding-apart': 'rgba(200,170,120,0.32)',
  'door-free-swing':    'rgba(200,170,120,0.32)',
  'door-bypass':        'rgba(200,170,120,0.32)',
  // Traditional Japanese types — warm wood/paper tones
  'shoji':              'rgba(240,228,195,0.55)',
  'fusuma':             'rgba(205,188,158,0.60)',
  'ranma':              'rgba(195,168,115,0.50)',
  'koshido':            'rgba(175,152,108,0.52)',
  'shitomido':          'rgba(155,142,108,0.55)',
  'agedo':              'rgba(170,150,112,0.52)',
};

// ── Glass performance presets (per product, 24mm IGU defaults) ─
const GLASS_PRESETS = {
  'clear':      { uValue: 2.8, shgc: 0.76, vlt: 0.81 },
  'low-e':      { uValue: 1.1, shgc: 0.35, vlt: 0.65 },
  'laminated':  { uValue: 2.6, shgc: 0.72, vlt: 0.80 },
  'obscure':    { uValue: 2.8, shgc: 0.74, vlt: 0.42 },
  'tinted':     { uValue: 2.7, shgc: 0.48, vlt: 0.43 },
  'reflective': { uValue: 2.5, shgc: 0.26, vlt: 0.21 },
};

const WINDOW_TYPES = [
  'fixed','casement-left','casement-right','casement-top','casement-bottom',
  'awning','hopper','sliding-2t','sliding-3t','pivot-v','pivot-h','tilt-turn','louvre',
  'sliding-single','sliding-left','hung-double','projecting','tate-suberidashi',
  'casement-double','outward-tilt','sliding-apart',
  'shoji','fusuma','ranma','shitomido',
];
const DOOR_TYPES = [
  'door-single','door-double','door-sliding','door-bifold','door-french',
  'door-pocket','door-overhead','door-accordion','door-parent-child',
  'door-sliding-apart','door-free-swing','door-bypass',
  'koshido','agedo',
];
// Curtain wall panel types (subset of operation types, different BIM codes)
const CURTAIN_TYPES = [
  'fixed','casement-left','casement-right','casement-double',
  'louvre','sliding-single','sliding-left','sliding-apart',
  'projecting','tate-suberidashi','outward-tilt','pivot-v','door-parent-child',
];

// ── BIM reference codes ───────────────────────────────────────
const TYPE_REFS = {
  'fixed':              'W-FIX',
  'casement-left':      'W-CS-L',
  'casement-right':     'W-CS-R',
  'casement-top':       'W-CS-T',
  'casement-bottom':    'W-CS-B',
  'awning':             'W-AW',
  'hopper':             'W-HP',
  'sliding-2t':         'W-SL2',
  'sliding-3t':         'W-SL3',
  'pivot-v':            'W-PV-V',
  'pivot-h':            'W-PV-H',
  'tilt-turn':          'W-TT',
  'louvre':             'W-LV',
  'sliding-single':     'W-SL1',
  'hung-double':        'W-HD',
  'projecting':         'W-PJ',
  'tate-suberidashi':   'W-TSS',
  'casement-double':    'W-CS-DB',
  'outward-tilt':       'W-OT',
  'sliding-apart':      'W-SLA',
  'sliding-left':       'W-SL1-L',
  'door-single':        'D-SG',
  'door-double':        'D-DB',
  'door-sliding':       'D-SL',
  'door-bifold':        'D-BF',
  'door-french':        'D-FR',
  'door-pocket':        'D-PK',
  'door-overhead':      'D-OH',
  'door-accordion':     'D-AC',
  'door-parent-child':  'D-PC',
  'door-sliding-apart': 'D-SLA',
  'door-free-swing':    'D-FS',
  'door-bypass':        'D-BP',
  'shoji':              'W-SJ',
  'fusuma':             'W-FM',
  'ranma':              'W-RN',
  'koshido':            'D-KS',
  'shitomido':          'D-ST',
  'agedo':              'D-AG',
};

// Curtain wall overrides (Obayashi CuPnl series)
const CURTAIN_REFS = {
  'fixed':              'CuPnl-F',
  'casement-left':      'CuPnl-D',
  'casement-right':     'CuPnl-D',
  'casement-double':    'CuPnl-R',
  'louvre':             'CuPnl-G',
  'sliding-single':     'CuPnl-H',
  'sliding-left':       'CuPnl-H',
  'sliding-apart':      'CuPnl-HC',
  'projecting':         'CuPnl-P',
  'tate-suberidashi':   'CuPnl-S',
  'outward-tilt':       'CuPnl-T',
  'pivot-v':            'CuPnl-A',
  'door-parent-child':  'CuPnl-Y',
};

// Returns the correct BIM ref depending on opening category
function getRef(typeId, openingCategory) {
  if (openingCategory === 'curtain') return CURTAIN_REFS[typeId] ?? TYPE_REFS[typeId] ?? '—';
  return TYPE_REFS[typeId] ?? '—';
}

// ============================================================
// SVG HELPERS
// ============================================================
function el(tag, attrs) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k,v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}
function line(x1,y1,x2,y2,stroke,sw) {
  return el('line',{x1,y1,x2,y2,stroke,'stroke-width':sw,'pointer-events':'none'});
}
function path(d,stroke,sw) {
  return el('path',{d,stroke,'stroke-width':sw,fill:'none','pointer-events':'none'});
}

// ============================================================
// OPERATION SYMBOLS (elevation view)
// ============================================================
function drawSymbol(g, type, x, y, w, h) {
  const cx=x+w/2, cy=y+h/2;
  const sw = Math.max(1.5, Math.min(w,h)*0.015);
  const col = 'rgba(74,158,255,0.75)';
  const col2 = 'rgba(74,255,170,0.65)';

  switch(type) {
    case 'casement-left':
      g.append(line(x+w,y,   x, cy, col, sw));
      g.append(line(x+w,y+h, x, cy, col, sw));
      { const r=Math.min(w,h)*0.28; g.append(path(`M ${x} ${cy-r} A ${r} ${r} 0 0 1 ${x} ${cy+r}`,col,sw*0.8)); }
      break;
    case 'casement-right':
      g.append(line(x,y,   x+w, cy, col, sw));
      g.append(line(x,y+h, x+w, cy, col, sw));
      { const r=Math.min(w,h)*0.28; g.append(path(`M ${x+w} ${cy-r} A ${r} ${r} 0 0 0 ${x+w} ${cy+r}`,col,sw*0.8)); }
      break;
    case 'casement-top':
    case 'awning':
    case 'outward-tilt':
      g.append(line(x,  y+h, cx, y, col, sw));
      g.append(line(x+w,y+h, cx, y, col, sw));
      { const r=Math.min(w,h)*0.25; g.append(path(`M ${cx-r} ${y} A ${r} ${r} 0 0 0 ${cx+r} ${y}`,col,sw*0.8)); }
      break;
    case 'casement-bottom':
    case 'hopper':
      g.append(line(x,  y, cx, y+h, col, sw));
      g.append(line(x+w,y, cx, y+h, col, sw));
      { const r=Math.min(w,h)*0.25; g.append(path(`M ${cx-r} ${y+h} A ${r} ${r} 0 0 1 ${cx+r} ${y+h}`,col,sw*0.8)); }
      break;
    case 'tilt-turn':
      g.append(line(x,y,   x+w, cy, col, sw));
      g.append(line(x,y+h, x+w, cy, col, sw));
      g.append(line(x,  y+h, cx, y, col2, sw*0.85));
      g.append(line(x+w,y+h, cx, y, col2, sw*0.85));
      break;
    case 'casement-double': {
      // Both leaves swing outward — left hinge + right hinge, meeting at centre
      const mid = cx;
      g.append(line(mid,y, x,   cy, col, sw));
      g.append(line(mid,y+h, x, cy, col, sw));
      { const r=Math.min(w*0.45,h)*0.28; g.append(path(`M ${x} ${cy-r} A ${r} ${r} 0 0 1 ${x} ${cy+r}`,col,sw*0.8)); }
      g.append(line(mid,y, x+w,   cy, col, sw));
      g.append(line(mid,y+h, x+w, cy, col, sw));
      { const r=Math.min(w*0.45,h)*0.28; g.append(path(`M ${x+w} ${cy-r} A ${r} ${r} 0 0 0 ${x+w} ${cy+r}`,col,sw*0.8)); }
      g.append(el('line',{x1:mid,y1:y+h*0.08,x2:mid,y2:y+h*0.92,stroke:'rgba(74,158,255,0.35)','stroke-width':sw*0.6,'stroke-dasharray':`${h*0.05},${h*0.04}`,'pointer-events':'none'}));
      break;
    }
    case 'sliding-2t': {
      const m=w*0.15; const ay=cy;
      g.append(line(x+m,ay, x+w-m,ay, col, sw));
      g.append(line(x+m,ay, x+m+w*0.07,ay-h*0.07, col, sw));
      g.append(line(x+m,ay, x+m+w*0.07,ay+h*0.07, col, sw));
      g.append(line(x+w-m,ay, x+w-m-w*0.07,ay-h*0.07, col, sw));
      g.append(line(x+w-m,ay, x+w-m-w*0.07,ay+h*0.07, col, sw));
      g.append(el('line',{x1:cx,y1:y+h*0.15,x2:cx,y2:y+h*0.85,stroke:'rgba(74,158,255,0.35)','stroke-width':sw*0.7,'stroke-dasharray':`${h*0.05},${h*0.04}`,'pointer-events':'none'}));
      break;
    }
    case 'sliding-3t': {
      const m=w*0.1; const ay=cy;
      g.append(line(x+m,ay, x+w-m,ay, col, sw));
      g.append(line(x+m,ay, x+m+w*0.06,ay-h*0.07, col, sw));
      g.append(line(x+m,ay, x+m+w*0.06,ay+h*0.07, col, sw));
      g.append(line(x+w-m,ay, x+w-m-w*0.06,ay-h*0.07, col, sw));
      g.append(line(x+w-m,ay, x+w-m-w*0.06,ay+h*0.07, col, sw));
      const dx=w/3;
      [dx,dx*2].forEach(dv => g.append(el('line',{x1:x+dv,y1:y+h*0.15,x2:x+dv,y2:y+h*0.85,stroke:'rgba(74,158,255,0.35)','stroke-width':sw*0.7,'stroke-dasharray':`${h*0.05},${h*0.04}`,'pointer-events':'none'})));
      break;
    }
    case 'sliding-apart': {
      // Two panels slide from centre outward
      const m3=w*0.12, ay3=cy;
      g.append(line(cx-m3, ay3, x+m3,   ay3, col, sw));
      g.append(line(x+m3, ay3, x+m3+w*0.07, ay3-h*0.07, col, sw));
      g.append(line(x+m3, ay3, x+m3+w*0.07, ay3+h*0.07, col, sw));
      g.append(line(cx+m3, ay3, x+w-m3, ay3, col, sw));
      g.append(line(x+w-m3, ay3, x+w-m3-w*0.07, ay3-h*0.07, col, sw));
      g.append(line(x+w-m3, ay3, x+w-m3-w*0.07, ay3+h*0.07, col, sw));
      g.append(el('line',{x1:cx,y1:y+h*0.15,x2:cx,y2:y+h*0.85,stroke:'rgba(74,158,255,0.35)','stroke-width':sw*0.7,'stroke-dasharray':`${h*0.05},${h*0.04}`,'pointer-events':'none'}));
      break;
    }
    case 'pivot-v': {
      g.append(line(cx,y+h*0.05, cx,y+h*0.95, col, sw));
      const r=Math.min(w,h)*0.28;
      g.append(path(`M ${cx} ${cy-r} A ${r} ${r} 0 0 1 ${cx} ${cy+r}`,col,sw*0.8));
      g.append(path(`M ${cx} ${cy-r} A ${r} ${r} 0 0 0 ${cx} ${cy+r}`,col,sw*0.8));
      break;
    }
    case 'pivot-h': {
      g.append(line(x+w*0.05,cy, x+w*0.95,cy, col, sw));
      const r=Math.min(w,h)*0.28;
      g.append(path(`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`,col,sw*0.8));
      g.append(path(`M ${cx-r} ${cy} A ${r} ${r} 0 0 0 ${cx+r} ${cy}`,col,sw*0.8));
      break;
    }
    case 'louvre': {
      const n = Math.max(3, Math.floor(h/55));
      for (let i=1;i<n;i++) { const sy=y+h*i/n; g.append(line(x+w*0.08,sy, x+w*0.92,sy, col, sw)); }
      break;
    }
    case 'door-single': {
      const r=Math.min(w*0.85, h*0.85);
      g.append(line(x, y, x, y+h, col, sw));
      g.append(path(`M ${x} ${y+h} A ${r} ${r} 0 0 1 ${x+r} ${y+h}`, col, sw*0.8));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-double': {
      const r2=Math.min(w*0.44, h*0.7);
      g.append(line(x+w/2, y, x+w/2, y+h, 'rgba(74,158,255,0.35)', sw*0.7));
      g.append(path(`M ${x} ${y+h} A ${r2} ${r2} 0 0 1 ${x+r2} ${y+h}`, col, sw*0.8));
      g.append(path(`M ${x+w} ${y+h} A ${r2} ${r2} 0 0 0 ${x+w-r2} ${y+h}`, col, sw*0.8));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-sliding': {
      const m=w*0.15; const ay=cy;
      g.append(line(x+m,ay, x+w-m,ay, col, sw));
      g.append(line(x+m,ay, x+m+w*0.07,ay-h*0.07, col, sw));
      g.append(line(x+m,ay, x+m+w*0.07,ay+h*0.07, col, sw));
      g.append(line(x+w-m,ay, x+w-m-w*0.07,ay-h*0.07, col, sw));
      g.append(line(x+w-m,ay, x+w-m-w*0.07,ay+h*0.07, col, sw));
      g.append(el('line',{x1:cx,y1:y+h*0.15,x2:cx,y2:y+h*0.85,stroke:'rgba(74,158,255,0.35)','stroke-width':sw*0.7,'stroke-dasharray':`${h*0.05},${h*0.04}`,'pointer-events':'none'}));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-bifold': {
      const tp=w*0.25;
      g.append(line(x+tp, y, x+w/2, y+h, col, sw));
      g.append(line(x+w-tp, y, x+w/2, y+h, col, sw));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-french': {
      const r3=Math.min(w*0.38, h*0.6);
      g.append(line(x, y, x, y+h, col, sw));
      g.append(line(x+w, y, x+w, y+h, col, sw));
      g.append(path(`M ${x} ${y+h} A ${r3} ${r3} 0 0 1 ${x+r3} ${y}`, col, sw*0.8));
      g.append(path(`M ${x+w} ${y+h} A ${r3} ${r3} 0 0 0 ${x+w-r3} ${y}`, col, sw*0.8));
      g.append(line(x+w/2, y, x+w/2, y+h, 'rgba(74,158,255,0.35)', sw*0.7));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-sliding-apart': {
      // Two door panels slide apart from centre + threshold
      const m4=w*0.12, ay4=cy;
      g.append(line(cx-m4, ay4, x+m4,   ay4, col, sw));
      g.append(line(x+m4, ay4, x+m4+w*0.07, ay4-h*0.07, col, sw));
      g.append(line(x+m4, ay4, x+m4+w*0.07, ay4+h*0.07, col, sw));
      g.append(line(cx+m4, ay4, x+w-m4, ay4, col, sw));
      g.append(line(x+w-m4, ay4, x+w-m4-w*0.07, ay4-h*0.07, col, sw));
      g.append(line(x+w-m4, ay4, x+w-m4-w*0.07, ay4+h*0.07, col, sw));
      g.append(el('line',{x1:cx,y1:y+h*0.15,x2:cx,y2:y+h*0.85,stroke:'rgba(74,158,255,0.35)','stroke-width':sw*0.7,'stroke-dasharray':`${h*0.05},${h*0.04}`,'pointer-events':'none'}));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-free-swing': {
      // Swings both directions — arc outward + dashed arc inward
      const rF=Math.min(w*0.78, h*0.78);
      g.append(line(x, y, x, y+h, col, sw));
      g.append(path(`M ${x} ${y+h} A ${rF} ${rF} 0 0 1 ${Math.min(x+rF,x+w)} ${y+h}`, col, sw*0.8));
      g.append(el('path',{d:`M ${x} ${y+h} A ${rF} ${rF} 0 0 0 ${Math.min(x+rF,x+w)} ${y+h}`,stroke:col,fill:'none','stroke-width':sw*0.7,'stroke-dasharray':`${w*0.05},${w*0.04}`,'pointer-events':'none'}));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-bypass': {
      // Two panels on overlapping parallel tracks
      const ay5L=cy-h*0.09, ay5R=cy+h*0.09;
      const overlap=w*0.15;
      g.append(line(x+w*0.05, ay5L, x+w*0.55+overlap, ay5L, col, sw));
      g.append(line(x+w*0.55-overlap, ay5R, x+w*0.95, ay5R, col, sw));
      g.append(el('rect',{x:x+w*0.55-overlap,y:y+h*0.18,width:overlap*2,height:h*0.64,fill:'rgba(74,158,255,0.08)',stroke:'rgba(74,158,255,0.35)','stroke-width':sw*0.5,'pointer-events':'none'}));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    // ── Japanese types ──────────────────────────────────────────
    case 'sliding-single': {
      const divX = x + w * 0.55;
      const m = w * 0.08;
      g.append(line(x+m, cy, divX-m, cy, col, sw));
      g.append(line(divX-m, cy, divX-m-w*0.07, cy-h*0.07, col, sw));
      g.append(line(divX-m, cy, divX-m-w*0.07, cy+h*0.07, col, sw));
      g.append(el('line',{x1:divX,y1:y+h*0.1,x2:divX,y2:y+h*0.9,stroke:'rgba(74,158,255,0.4)','stroke-width':sw*0.7,'stroke-dasharray':`${h*0.06},${h*0.04}`,'pointer-events':'none'}));
      const fixT=el('text',{x:divX+(w-divX+x)*0.5,y:cy+h*0.05,fill:'rgba(74,158,255,0.65)','font-size':Math.max(8,Math.min(w,h)*0.1),'text-anchor':'middle','dominant-baseline':'middle','pointer-events':'none','font-family':'monospace'});
      fixT.textContent='FIX'; g.append(fixT);
      break;
    }
    case 'sliding-left': {
      // Mirror of sliding-single: panel on right slides left; FIX on left
      const divX2 = x + w * 0.45;
      const m2 = w * 0.08;
      g.append(line(divX2+m2, cy, x+w-m2, cy, col, sw));
      g.append(line(divX2+m2, cy, divX2+m2+w*0.07, cy-h*0.07, col, sw));
      g.append(line(divX2+m2, cy, divX2+m2+w*0.07, cy+h*0.07, col, sw));
      g.append(el('line',{x1:divX2,y1:y+h*0.1,x2:divX2,y2:y+h*0.9,stroke:'rgba(74,158,255,0.4)','stroke-width':sw*0.7,'stroke-dasharray':`${h*0.06},${h*0.04}`,'pointer-events':'none'}));
      const fixT2=el('text',{x:x+(divX2-x)*0.5,y:cy+h*0.05,fill:'rgba(74,158,255,0.65)','font-size':Math.max(8,Math.min(w,h)*0.1),'text-anchor':'middle','dominant-baseline':'middle','pointer-events':'none','font-family':'monospace'});
      fixT2.textContent='FIX'; g.append(fixT2);
      break;
    }
    case 'hung-double': {
      const midY = y + h * 0.5;
      g.append(el('line',{x1:x+w*0.08,y1:midY,x2:x+w*0.92,y2:midY,stroke:'rgba(74,158,255,0.45)','stroke-width':sw*0.9,'pointer-events':'none'}));
      g.append(line(cx, y+h*0.15, cx, midY-h*0.05, col, sw));
      g.append(line(cx, y+h*0.15, cx-w*0.07, y+h*0.26, col, sw));
      g.append(line(cx, y+h*0.15, cx+w*0.07, y+h*0.26, col, sw));
      g.append(line(cx, midY+h*0.05, cx, y+h*0.85, col, sw));
      g.append(line(cx, y+h*0.85, cx-w*0.07, y+h*0.74, col, sw));
      g.append(line(cx, y+h*0.85, cx+w*0.07, y+h*0.74, col, sw));
      break;
    }
    case 'projecting': {
      g.append(line(x, y, cx, y+h, col, sw));
      g.append(line(x+w, y, cx, y+h, col, sw));
      const rp=Math.min(w,h)*0.25;
      g.append(path(`M ${cx-rp} ${y+h} A ${rp} ${rp} 0 0 0 ${cx+rp} ${y+h}`, col, sw*0.8));
      break;
    }
    case 'tate-suberidashi': {
      g.append(line(x, y, cx, cy, col, sw));
      g.append(line(x, y+h, cx, cy, col, sw));
      const rts=Math.min(w,h)*0.28;
      g.append(path(`M ${x} ${cy-rts} A ${rts} ${rts} 0 0 1 ${x} ${cy+rts}`, col, sw*0.8));
      break;
    }
    case 'door-pocket': {
      const pm = w*0.1;
      g.append(line(x+pm, cy, x+w*0.7, cy, col, sw));
      g.append(line(x+w*0.7, cy, x+w*0.6, cy-h*0.07, col, sw));
      g.append(line(x+w*0.7, cy, x+w*0.6, cy+h*0.07, col, sw));
      g.append(el('rect',{x:x+w*0.72,y:y+h*0.05,width:w*0.22,height:h*0.9,fill:'none',stroke:'rgba(74,158,255,0.4)','stroke-width':sw*0.7,'stroke-dasharray':`${h*0.06},${h*0.04}`,'pointer-events':'none'}));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-overhead': {
      const nOH = Math.max(4, Math.floor(h/60));
      for(let i=1;i<nOH;i++){ const hy=y+h*i/nOH; g.append(line(x+w*0.06,hy, x+w*0.94,hy, col, sw*0.8)); }
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-accordion': {
      const nAC = Math.max(4, Math.round(w/120)*2);
      const pts=[]; for(let i=0;i<=nAC;i++) pts.push(`${x+w*i/nAC},${i%2===0?y+h*0.1:y+h*0.9}`);
      g.append(el('polyline',{points:pts.join(' '),fill:'none',stroke:col,'stroke-width':sw,'pointer-events':'none'}));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'door-parent-child': {
      const bigW=w*0.68; const smallW=w*0.32;
      const rBig=Math.min(bigW*0.9, h*0.85);
      const rSmall=Math.min(smallW*0.9, h*0.5);
      g.append(line(x, y, x, y+h, col, sw));
      g.append(path(`M ${x} ${y+h} A ${rBig} ${rBig} 0 0 1 ${x+rBig} ${y+h}`, col, sw*0.8));
      g.append(line(x+bigW, y, x+bigW, y+h, 'rgba(74,158,255,0.35)', sw*0.7));
      g.append(line(x+w, y, x+w, y+h, col, sw));
      g.append(path(`M ${x+w} ${y+h} A ${rSmall} ${rSmall} 0 0 0 ${x+w-rSmall} ${y+h}`, col, sw*0.8));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    // ── Traditional Japanese types ───────────────────────────────
    case 'shoji': {
      // Cross-hatch shoji grid + slide arrow
      const nc = Math.max(3, Math.min(5, Math.floor(w/80)));
      const nr = Math.max(3, Math.min(5, Math.floor(h/60)));
      for (let i=1; i<nc; i++) g.append(line(x+w*i/nc, y+h*0.06, x+w*i/nc, y+h*0.94, col, sw*0.65));
      for (let i=1; i<nr; i++) g.append(line(x+w*0.06, y+h*i/nr, x+w*0.94, y+h*i/nr, col, sw*0.65));
      g.append(line(cx, y+h*0.87, cx+w*0.22, y+h*0.87, col, sw*0.9));
      g.append(line(cx+w*0.22, y+h*0.87, cx+w*0.15, y+h*0.81, col, sw*0.9));
      g.append(line(cx+w*0.22, y+h*0.87, cx+w*0.15, y+h*0.93, col, sw*0.9));
      break;
    }
    case 'fusuma': {
      // Two horizontal rails + central pull knob + slide arrow
      const rH2 = h*0.04;
      g.append(el('rect',{x:x+w*0.08,y:y+h*0.28-rH2,width:w*0.84,height:rH2*2,fill:'rgba(74,158,255,0.10)',stroke:col,'stroke-width':sw*0.7,'pointer-events':'none'}));
      g.append(el('rect',{x:x+w*0.08,y:y+h*0.72-rH2,width:w*0.84,height:rH2*2,fill:'rgba(74,158,255,0.10)',stroke:col,'stroke-width':sw*0.7,'pointer-events':'none'}));
      const kr = Math.min(w,h)*0.06;
      g.append(el('circle',{cx,cy,r:kr,fill:'none',stroke:col,'stroke-width':sw*0.9,'pointer-events':'none'}));
      g.append(el('circle',{cx,cy,r:kr*0.4,fill:col,'pointer-events':'none'}));
      g.append(line(cx+kr*2.2, cy, cx+w*0.34, cy, col, sw*0.85));
      g.append(line(cx+w*0.34, cy, cx+w*0.27, cy-h*0.04, col, sw*0.85));
      g.append(line(cx+w*0.34, cy, cx+w*0.27, cy+h*0.04, col, sw*0.85));
      break;
    }
    case 'ranma': {
      // Dense kumiko-lattice with diagonal accent (decorative transom)
      const nc3 = Math.max(4, Math.min(8, Math.floor(w/55)));
      const nr3 = Math.max(2, Math.min(4, Math.floor(h/50)));
      for (let i=1; i<nc3; i++) g.append(line(x+w*i/nc3, y+h*0.06, x+w*i/nc3, y+h*0.94, col, sw*0.60));
      for (let i=1; i<nr3; i++) g.append(line(x+w*0.06, y+h*i/nr3, x+w*0.94, y+h*i/nr3, col, sw*0.60));
      g.append(line(x+w*0.06, y+h*0.06, x+w*0.94, y+h*0.94, 'rgba(74,158,255,0.20)', sw*0.5));
      g.append(line(x+w*0.94, y+h*0.06, x+w*0.06, y+h*0.94, 'rgba(74,158,255,0.20)', sw*0.5));
      break;
    }
    case 'koshido': {
      // Open lattice door — kumiko grid + threshold
      const nc4 = Math.max(3, Math.min(6, Math.floor(w/70)));
      const nr4 = Math.max(3, Math.min(6, Math.floor(h/70)));
      for (let i=1; i<nc4; i++) g.append(line(x+w*i/nc4, y+h*0.06, x+w*i/nc4, y+h*0.92, col, sw*0.70));
      for (let i=1; i<nr4; i++) g.append(line(x+w*0.06, y+h*i/nr4, x+w*0.94, y+h*i/nr4, col, sw*0.70));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
    case 'shitomido': {
      // Heian flip-up shutter: lower panel vertical, upper panel folded up
      g.append(line(x+w*0.06, y+h/2, x+w*0.06, y+h*0.94, col, sw));
      g.append(line(x+w*0.94, y+h/2, x+w*0.94, y+h*0.94, col, sw));
      g.append(line(x+w*0.06, y+h*0.94, x+w*0.94, y+h*0.94, col, sw));
      // Upper panel angled open (fold line at mid-height)
      g.append(line(x+w*0.06, y+h/2, cx-w*0.08, y+h*0.10, col, sw));
      g.append(line(x+w*0.94, y+h/2, cx+w*0.08, y+h*0.10, col, sw));
      g.append(line(cx-w*0.08, y+h*0.10, cx+w*0.08, y+h*0.10, col, sw));
      // Hinge line at mid
      g.append(el('line',{x1:x+w*0.06,y1:y+h/2,x2:x+w*0.94,y2:y+h/2,stroke:'rgba(74,158,255,0.45)','stroke-width':sw*0.8,'stroke-dasharray':`${w*0.04},${w*0.03}`,'pointer-events':'none'}));
      break;
    }
    case 'agedo': {
      // Lift-up door: side track rails + raised panel (dashed) + upward arrow + threshold
      g.append(el('line',{x1:x+w*0.09,y1:y+h*0.06,x2:x+w*0.09,y2:y+h*0.94,stroke:'rgba(74,158,255,0.40)','stroke-width':sw*0.7,'pointer-events':'none'}));
      g.append(el('line',{x1:x+w*0.91,y1:y+h*0.06,x2:x+w*0.91,y2:y+h*0.94,stroke:'rgba(74,158,255,0.40)','stroke-width':sw*0.7,'pointer-events':'none'}));
      g.append(el('rect',{x:x+w*0.13,y:y+h*0.07,width:w*0.74,height:h*0.28,fill:'rgba(74,158,255,0.06)',stroke:col,'stroke-width':sw*0.65,'stroke-dasharray':`${w*0.04},${w*0.03}`,'pointer-events':'none'}));
      const ay7 = cy + h*0.18;
      g.append(line(cx, ay7, cx, ay7-h*0.28, col, sw));
      g.append(line(cx, ay7-h*0.28, cx-w*0.09, ay7-h*0.18, col, sw));
      g.append(line(cx, ay7-h*0.28, cx+w*0.09, ay7-h*0.18, col, sw));
      g.append(line(x, y+h, x+w, y+h, 'rgba(255,153,68,0.85)', sw*1.2));
      break;
    }
  }
}

// ============================================================
// TEMPLATES
// ============================================================
const TEMPLATES = {
  window: [
    { name:'Fixed Picture', desc:'Single fixed pane',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(120,185,230,0.4)" stroke="#5A5E6A" stroke-width="1.5"/>',
      make(){ const c=mkComposition(); c.meta.name='Fixed Picture'; return c; } },
    { name:'Single Casement', desc:'One casement-left pane',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(100,200,155,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="34" y1="2" x2="2" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="34" y1="24" x2="2" y2="13" stroke="#4A9EFF" stroke-width="1.2"/>',
      make(){ const c=mkComposition(); c.meta.name='Single Casement'; c.composition.type='casement-left'; return c; } },
    { name:'Double Casement', desc:'Two casements side by side',
      icon:'<rect x="2" y="2" width="14" height="22" fill="rgba(100,200,155,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><rect x="20" y="2" width="14" height="22" fill="rgba(100,200,155,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="4" y1="2" x2="15" y2="13" stroke="#4A9EFF" stroke-width="1"/><line x1="4" y1="24" x2="15" y2="13" stroke="#4A9EFF" stroke-width="1"/><line x1="32" y1="2" x2="21" y2="13" stroke="#4A9EFF" stroke-width="1"/><line x1="32" y1="24" x2="21" y2="13" stroke="#4A9EFF" stroke-width="1"/>',
      make(){ const c=mkComposition(); c.meta.name='Double Casement'; const l=mkPane(); l.type='casement-right'; const r=mkPane(); r.type='casement-left'; c.composition={id:uid(),kind:'split',axis:'V',dividers:[{ratio:0.5}],children:[l,r]}; return c; } },
    { name:'Sliding 2-Track', desc:'Single sliding panel',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(80,210,190,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="5" y1="13" x2="31" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="18" y1="4" x2="18" y2="22" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="2,2"/>',
      make(){ const c=mkComposition(); c.meta.name='Sliding 2-Track'; c.composition.type='sliding-2t'; return c; } },
    { name:'Awning over Fixed', desc:'Awning top, fixed bottom',
      icon:'<rect x="2" y="2" width="32" height="10" fill="rgba(120,200,160,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><rect x="2" y="14" width="32" height="10" fill="rgba(120,185,230,0.4)" stroke="#5A5E6A" stroke-width="1.5"/>',
      make(){ const c=mkComposition(); c.meta.name='Awning over Fixed'; const t=mkPane(); t.type='awning'; const b=mkPane(); b.type='fixed'; c.composition={id:uid(),kind:'split',axis:'H',dividers:[{ratio:0.35}],children:[t,b]}; return c; } },
    { name:'Picture + Side Lites', desc:'Fixed centre, casements either side',
      icon:'<rect x="2" y="2" width="9" height="22" fill="rgba(100,200,155,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><rect x="13" y="2" width="10" height="22" fill="rgba(120,185,230,0.4)" stroke="#5A5E6A" stroke-width="1.5"/><rect x="25" y="2" width="9" height="22" fill="rgba(100,200,155,0.38)" stroke="#5A5E6A" stroke-width="1.5"/>',
      make(){ const c=mkComposition(); c.meta.name='Picture + Side Lites'; c.frame.overallWidth=1800; const l=mkPane(); l.type='casement-right'; const m=mkPane(); m.type='fixed'; const r=mkPane(); r.type='casement-left'; c.composition={id:uid(),kind:'split',axis:'V',dividers:[{ratio:0.25},{ratio:0.75}],children:[l,m,r]}; return c; } },
    { name:'両開き Double Casement', desc:'Both leaves swing outward from centre',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(100,200,155,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="18" y1="2" x2="2" y2="12" stroke="#4A9EFF" stroke-width="1.1"/><line x1="18" y1="24" x2="2" y2="12" stroke="#4A9EFF" stroke-width="1.1"/><line x1="18" y1="2" x2="34" y2="12" stroke="#4A9EFF" stroke-width="1.1"/><line x1="18" y1="24" x2="34" y2="12" stroke="#4A9EFF" stroke-width="1.1"/><line x1="18" y1="2" x2="18" y2="24" stroke="#4A9EFF" stroke-width="0.7" stroke-dasharray="2,2"/>',
      make(){ const c=mkComposition(); c.meta.name='両開き Double Casement'; c.composition.type='casement-double'; c.frame.overallWidth=1400; return c; } },
    { name:'引分け Slide Apart', desc:'Two panels slide from centre outward',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(80,210,190,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="8" y1="13" x2="2" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="13" x2="5" y2="10" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="13" x2="5" y2="16" stroke="#4A9EFF" stroke-width="1.2"/><line x1="28" y1="13" x2="34" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="34" y1="13" x2="31" y2="10" stroke="#4A9EFF" stroke-width="1.2"/><line x1="34" y1="13" x2="31" y2="16" stroke="#4A9EFF" stroke-width="1.2"/><line x1="18" y1="4" x2="18" y2="22" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="2,2"/>',
      make(){ const c=mkComposition(); c.meta.name='引分け Slide Apart'; c.composition.type='sliding-apart'; c.frame.overallWidth=1600; return c; } },
    { name:'4枚建引違い 4-Track', desc:'4-panel sliding window',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(80,210,190,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="5" y1="13" x2="31" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="10" y1="4" x2="10" y2="22" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="2,2"/><line x1="18" y1="4" x2="18" y2="22" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="2,2"/><line x1="26" y1="4" x2="26" y2="22" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="2,2"/>',
      make(){ const c=mkComposition(); c.meta.name='4枚建引違い'; c.composition.type='sliding-3t'; c.frame.overallWidth=2000; return c; } },
    { name:'障子 Shoji Screen', desc:'Traditional paper-screen sliding window',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(240,228,195,0.55)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="12" y1="2" x2="12" y2="24" stroke="#4A9EFF" stroke-width="0.8"/><line x1="22" y1="2" x2="22" y2="24" stroke="#4A9EFF" stroke-width="0.8"/><line x1="2" y1="10" x2="34" y2="10" stroke="#4A9EFF" stroke-width="0.8"/><line x1="2" y1="17" x2="34" y2="17" stroke="#4A9EFF" stroke-width="0.8"/>',
      make(){ const c=mkComposition(); c.meta.name='障子 Shoji Screen'; c.composition.type='shoji'; c.frame.overallWidth=900; c.frame.overallHeight=1800; c.frame.material='timber'; return c; } },
    { name:'欄間 Ranma Transom', desc:'Decorative carved transom above opening',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(195,168,115,0.50)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="10" y1="2" x2="10" y2="24" stroke="#4A9EFF" stroke-width="0.7"/><line x1="18" y1="2" x2="18" y2="24" stroke="#4A9EFF" stroke-width="0.7"/><line x1="26" y1="2" x2="26" y2="24" stroke="#4A9EFF" stroke-width="0.7"/><line x1="2" y1="9" x2="34" y2="9" stroke="#4A9EFF" stroke-width="0.7"/><line x1="2" y1="17" x2="34" y2="17" stroke="#4A9EFF" stroke-width="0.7"/><line x1="2" y1="3" x2="34" y2="23" stroke="#4A9EFF" stroke-width="0.5" stroke-dasharray="1,1"/>',
      make(){ const c=mkComposition(); c.meta.name='欄間 Ranma'; const ranma=mkPane(); ranma.type='ranma'; const main=mkPane(); main.type='sliding-2t'; c.composition={id:uid(),kind:'split',axis:'H',dividers:[{ratio:0.25}],children:[ranma,main]}; c.frame.overallWidth=1800; c.frame.overallHeight=2100; c.frame.material='timber'; return c; } },
  ],
  door: [
    { name:'Single Door', desc:'Single swing door',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="2" y1="2" x2="2" y2="24" stroke="#4A9EFF" stroke-width="1.5"/><path d="M 2 24 A 20 20 0 0 1 22 4" stroke="#4A9EFF" stroke-width="1.2" fill="none"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='Single Door'; c.openingType='door'; c.composition.type='door-single'; c.frame.overallWidth=900; c.frame.overallHeight=2100; return c; } },
    { name:'Double Door', desc:'Two-leaf swing doors',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="18" y1="2" x2="18" y2="24" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="3,2"/><path d="M 2 24 A 14 14 0 0 1 16 10" stroke="#4A9EFF" stroke-width="1.2" fill="none"/><path d="M 34 24 A 14 14 0 0 0 20 10" stroke="#4A9EFF" stroke-width="1.2" fill="none"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='Double Door'; c.openingType='door'; const l=mkPane(); l.type='door-single'; const r=mkPane(); r.type='door-single'; c.composition={id:uid(),kind:'split',axis:'V',dividers:[{ratio:0.5}],children:[l,r]}; c.frame.overallWidth=1800; c.frame.overallHeight=2100; return c; } },
    { name:'Sliding Door', desc:'Two-track sliding panel',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="5" y1="13" x2="31" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="18" y1="4" x2="18" y2="22" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="2,2"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='Sliding Door'; c.openingType='door'; c.composition.type='door-sliding'; c.frame.overallWidth=1800; c.frame.overallHeight=2100; return c; } },
    { name:'Bifold Door', desc:'Folding panel system',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="11" y1="2" x2="18" y2="14" stroke="#4A9EFF" stroke-width="1.2"/><line x1="18" y1="14" x2="25" y2="2" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='Bifold Door'; c.openingType='door'; c.composition.type='door-bifold'; c.frame.overallWidth=2400; c.frame.overallHeight=2100; return c; } },
    { name:'French Doors', desc:'Outswing pair with centre post',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="18" y1="2" x2="18" y2="24" stroke="#4A9EFF" stroke-width="1" stroke-dasharray="3,2"/><path d="M 2 24 A 12 12 0 0 1 14 12" stroke="#4A9EFF" stroke-width="1.2" fill="none"/><path d="M 34 24 A 12 12 0 0 0 22 12" stroke="#4A9EFF" stroke-width="1.2" fill="none"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='French Doors'; c.openingType='door'; const l=mkPane(); l.type='door-french'; const r=mkPane(); r.type='door-french'; c.composition={id:uid(),kind:'split',axis:'V',dividers:[{ratio:0.5}],children:[l,r]}; c.frame.overallWidth=1800; c.frame.overallHeight=2100; return c; } },
    { name:'親子扉 Parent-Child', desc:'Large main leaf + small side leaf',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="2" y1="2" x2="2" y2="24" stroke="#4A9EFF" stroke-width="1.5"/><path d="M 2 24 A 18 18 0 0 1 20 6" stroke="#4A9EFF" stroke-width="1.2" fill="none"/><line x1="24" y1="2" x2="24" y2="24" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/><line x1="34" y1="2" x2="34" y2="24" stroke="#4A9EFF" stroke-width="1.2"/><path d="M 34 24 A 8 8 0 0 0 26 16" stroke="#4A9EFF" stroke-width="1" fill="none"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='親子扉 Parent-Child'; c.openingType='door'; c.composition.type='door-parent-child'; c.frame.overallWidth=1200; c.frame.overallHeight=2100; return c; } },
    { name:'引込戸 Pocket Door', desc:'Single leaf slides into wall pocket',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="5" y1="13" x2="22" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="22" y1="13" x2="18" y2="10" stroke="#4A9EFF" stroke-width="1.2"/><line x1="22" y1="13" x2="18" y2="16" stroke="#4A9EFF" stroke-width="1.2"/><rect x="24" y="3" width="9" height="20" fill="none" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="3,2"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='引込戸 Pocket Door'; c.openingType='door'; c.composition.type='door-pocket'; c.frame.overallWidth=900; c.frame.overallHeight=2100; return c; } },
    { name:'引分け扉 Door Slide Apart', desc:'Two panels slide apart from centre',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="8" y1="13" x2="2" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="13" x2="5" y2="10" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="13" x2="5" y2="16" stroke="#4A9EFF" stroke-width="1.2"/><line x1="28" y1="13" x2="34" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="34" y1="13" x2="31" y2="10" stroke="#4A9EFF" stroke-width="1.2"/><line x1="34" y1="13" x2="31" y2="16" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='引分け扉 Door Slide Apart'; c.openingType='door'; c.composition.type='door-sliding-apart'; c.frame.overallWidth=1800; c.frame.overallHeight=2100; return c; } },
    { name:'自由戸 Free Swing', desc:'Swings both directions (café door)',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(200,170,120,0.32)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="2" y1="2" x2="2" y2="24" stroke="#4A9EFF" stroke-width="1.5"/><path d="M 2 24 A 20 20 0 0 1 22 4" stroke="#4A9EFF" stroke-width="1.2" fill="none"/><path d="M 2 24 A 20 20 0 0 0 22 4" stroke="#4A9EFF" stroke-width="1" fill="none" stroke-dasharray="3,2"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.8"/>',
      make(){ const c=mkComposition(); c.meta.name='自由戸 Free Swing'; c.openingType='door'; c.composition.type='door-free-swing'; c.frame.overallWidth=900; c.frame.overallHeight=2100; return c; } },
    { name:'格子戸 Lattice Door', desc:'Open kumiko-lattice traditional door',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(175,152,108,0.52)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="11" y1="2" x2="11" y2="22" stroke="#4A9EFF" stroke-width="0.9"/><line x1="18" y1="2" x2="18" y2="22" stroke="#4A9EFF" stroke-width="0.9"/><line x1="25" y1="2" x2="25" y2="22" stroke="#4A9EFF" stroke-width="0.9"/><line x1="2" y1="9" x2="34" y2="9" stroke="#4A9EFF" stroke-width="0.9"/><line x1="2" y1="17" x2="34" y2="17" stroke="#4A9EFF" stroke-width="0.9"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.5"/>',
      make(){ const c=mkComposition(); c.meta.name='格子戸 Lattice Door'; c.openingType='door'; c.composition.type='koshido'; c.frame.overallWidth=900; c.frame.overallHeight=1900; c.frame.material='timber'; return c; } },
    { name:'上げ戸 Lift Door', desc:'Panel slides vertically upward into wall',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(170,150,112,0.52)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="8" y1="2" x2="8" y2="24" stroke="#4A9EFF" stroke-width="0.8"/><line x1="28" y1="2" x2="28" y2="24" stroke="#4A9EFF" stroke-width="0.8"/><line x1="18" y1="18" x2="18" y2="8" stroke="#4A9EFF" stroke-width="1.2"/><line x1="18" y1="8" x2="13" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="18" y1="8" x2="23" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="24" x2="34" y2="24" stroke="#FF9944" stroke-width="1.5"/>',
      make(){ const c=mkComposition(); c.meta.name='上げ戸 Lift Door'; c.openingType='door'; c.composition.type='agedo'; c.frame.overallWidth=1800; c.frame.overallHeight=2400; c.frame.material='timber'; return c; } },
  ],
  curtain: [
    { name:'CuPnl 嵌殺し Fixed', desc:'Fixed curtain wall panel',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(120,185,230,0.4)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="2" y1="2" x2="34" y2="24" stroke="rgba(74,158,255,0.3)" stroke-width="0.8"/>',
      make(){ const c=mkComposition(); c.meta.name='CuPnl 嵌殺し Fixed'; c.openingType='curtain'; c.composition.type='fixed'; c.frame.overallWidth=1000; c.frame.overallHeight=3000; return c; } },
    { name:'CuPnl 片開き Casement', desc:'Single casement curtain panel',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(100,200,155,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="34" y1="2" x2="2" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="34" y1="24" x2="2" y2="13" stroke="#4A9EFF" stroke-width="1.2"/>',
      make(){ const c=mkComposition(); c.meta.name='CuPnl 片開き Casement'; c.openingType='curtain'; c.composition.type='casement-left'; c.frame.overallWidth=1000; c.frame.overallHeight=3000; return c; } },
    { name:'CuPnl 引分け Slide Apart', desc:'Sliding-apart curtain panel',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(80,210,190,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="8" y1="13" x2="2" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="13" x2="5" y2="10" stroke="#4A9EFF" stroke-width="1.2"/><line x1="2" y1="13" x2="5" y2="16" stroke="#4A9EFF" stroke-width="1.2"/><line x1="28" y1="13" x2="34" y2="13" stroke="#4A9EFF" stroke-width="1.2"/><line x1="34" y1="13" x2="31" y2="10" stroke="#4A9EFF" stroke-width="1.2"/><line x1="34" y1="13" x2="31" y2="16" stroke="#4A9EFF" stroke-width="1.2"/><line x1="18" y1="4" x2="18" y2="22" stroke="#4A9EFF" stroke-width="0.8" stroke-dasharray="2,2"/>',
      make(){ const c=mkComposition(); c.meta.name='CuPnl 引分け Slide Apart'; c.openingType='curtain'; c.composition.type='sliding-apart'; c.frame.overallWidth=1500; c.frame.overallHeight=3000; return c; } },
    { name:'CuPnl 両開き Double', desc:'Double casement curtain panel',
      icon:'<rect x="2" y="2" width="32" height="22" fill="rgba(100,200,155,0.38)" stroke="#5A5E6A" stroke-width="1.5"/><line x1="18" y1="2" x2="2" y2="12" stroke="#4A9EFF" stroke-width="1.1"/><line x1="18" y1="24" x2="2" y2="12" stroke="#4A9EFF" stroke-width="1.1"/><line x1="18" y1="2" x2="34" y2="12" stroke="#4A9EFF" stroke-width="1.1"/><line x1="18" y1="24" x2="34" y2="12" stroke="#4A9EFF" stroke-width="1.1"/>',
      make(){ const c=mkComposition(); c.meta.name='CuPnl 両開き Double'; c.openingType='curtain'; c.composition.type='casement-double'; c.frame.overallWidth=1200; c.frame.overallHeight=3000; return c; } },
  ],
};
