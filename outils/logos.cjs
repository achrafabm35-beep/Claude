// Génère les logos d'exemple en SVG vectorisé (textes convertis en tracés : aucune police à charger).
// Usage : NODE_PATH=<dossier node_modules avec opentype.js et @fontsource/*> node outils/logos.cjs
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const OUT = path.resolve(__dirname, '../site/asagency/img/logos');
fs.mkdirSync(OUT, { recursive: true });
const NM = (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean)[0] || path.resolve(__dirname, '../node_modules');
const font = (pkg, file) => { const b = fs.readFileSync(path.join(NM, '@fontsource', pkg, 'files', `${pkg}-latin-${file}.woff`)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };

const F = {
  unb8: font('unbounded', '800-normal'), unb5: font('unbounded', '500-normal'),
  fra8: font('fraunces', '800-normal'), dm7: font('dm-sans', '700-normal'),
  sora7: font('sora', '700-normal'), cori5: font('cormorant-garamond', '500-italic'),
  jost5: font('jost', '500-normal'), jost6: font('jost', '600-normal'),
  bri8: font('bricolage-grotesque', '800-normal'), play5: font('playfair-display', '500-normal'),
  arc9i: font('archivo', '900-italic'),
};

// texte → tracé ; ls = interlettrage en em. Renvoie { d, w } avec la ligne de base en y = 0.
const text = (f, str, size, ls = 0) => {
  const s = size / f.unitsPerEm, gl = [...str].map((c) => f.charToGlyph(c)); let x = 0, d = '';
  gl.forEach((g, i) => { d += g.getPath(x, 0, size).toPathData(2); x += g.advanceWidth * s; if (i < gl.length - 1) x += f.getKerningValue(g, gl[i + 1]) * s + ls * size; });
  return { d, w: x };
};
const cap = (f, size) => (f.tables.os2.sCapHeight || f.ascender * 0.7) * size / f.unitsPerEm;
const xh = (f, size) => (f.tables.os2.sxHeight || f.ascender * 0.5) * size / f.unitsPerEm;
const P = (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`;
const G = (x, y, inner) => `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">${inner}</g>`;
const svg = (w, h, inner, defs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(w)} ${Math.ceil(h)}" width="${Math.ceil(w)}" height="${Math.ceil(h)}">${defs ? `<defs>${defs}</defs>` : ''}${inner}</svg>\n`;

const LOGOS = [];
const add = (slug, name, sector, bg, full, mark) => LOGOS.push({ slug, name, sector, bg, full, mark });

/* 1. Solstice — festival */
{
  const grad = '<linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffd23f"/><stop offset=".55" stop-color="#ff6a1f"/><stop offset="1" stop-color="#ff2e88"/></linearGradient>';
  const rays = [-150, -120, -90, -60, -30].map((a) => { const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return `M${(34 + c * 33).toFixed(1)} ${(42 + s * 33).toFixed(1)}L${(34 + c * 41).toFixed(1)} ${(42 + s * 41).toFixed(1)}`; }).join('');
  const mark = `<path d="M8 42a26 26 0 0 1 52 0z" fill="url(#sg)"/><path d="${rays}" stroke="#ffd23f" stroke-width="3.4" stroke-linecap="round" fill="none"/><rect x="11" y="47" width="46" height="4.4" rx="2.2" fill="#ff4f5e"/><rect x="18" y="55.5" width="32" height="4.4" rx="2.2" fill="#ff2e88"/>`;
  const t = text(F.unb8, 'SOLSTICE', 38, -0.02), s = text(F.unb5, 'FESTIVAL · JUIN 2027', 8.6, 0.3);
  const W = 68 + 14 + t.w, H = 64;
  add('solstice', 'Solstice', 'Festival de musique', '#0d0716',
    svg(W, H, mark + G(82, 37, P(t.d, '#fff4e6')) + G(83, 55, P(s.d, '#ffd23f')), grad),
    svg(68, 64, mark, grad));
}

/* 2. Brume — boissons */
{
  const t = text(F.fra8, 'brume', 72, -0.03), s = text(F.dm7, 'INFUSIONS PÉTILLANTES', 9.4, 0.34);
  const bub = (ox) => `<circle cx="${ox}" cy="26" r="7.5" fill="#e06b00"/><circle cx="${ox + 13}" cy="11" r="4.6" fill="#f6b400"/><circle cx="${ox + 3}" cy="3.6" r="2.6" fill="#e06b00"/>`;
  const W = t.w + 26, H = 104;
  add('brume', 'Brume', 'Infusions pétillantes', '#ffe9a8',
    svg(W, H, G(0, 82, P(t.d, '#24190a')) + bub(t.w + 2) + G((t.w - s.w) / 2, 101, P(s.d, '#9a4a00'))),
    svg(64, 64, `<rect width="64" height="64" rx="16" fill="#f6b400"/>` + G(14, 47, P(text(F.fra8, 'b', 56).d, '#24190a')) + `<circle cx="48" cy="20" r="5.5" fill="#fff"/><circle cx="53" cy="9" r="3" fill="#fff"/>`));
}

/* 3. Orbe — logiciel */
{
  const grad = '<linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8b7dff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>';
  const mark = `<circle cx="27" cy="33" r="21" fill="none" stroke="url(#og)" stroke-width="9"/><circle cx="50" cy="9" r="8" fill="#22d3ee"/>`;
  const t = text(F.sora7, 'orbe', 58, -0.04);
  add('orbe', 'Orbe', 'Logiciel de facturation', '#07070d',
    svg(72 + t.w, 60, mark + G(72, 51, P(t.d, '#f3f3fa')), grad), svg(60, 60, mark, grad));
}

/* 4. Souffle — studio */
{
  const mark = `<path d="M2 62V24a22 22 0 0 1 44 0v38z" fill="none" stroke="#2b2420" stroke-width="2.2"/><circle cx="24" cy="26" r="9" fill="#c4623a"/>`;
  const t = text(F.cori5, 'souffle', 66, -0.01), s = text(F.jost5, 'PILATES & YOGA', 9.6, 0.36);
  add('souffle', 'Souffle', 'Studio de Pilates & yoga', '#f3ebdf',
    svg(64 + t.w + 4, 84, G(0, 2, mark) + G(64, 46, P(t.d, '#2b2420')) + G(67, 80, P(s.d, '#5f6f52'))), svg(48, 64, mark));
}

/* 5. Lenoir — menuiserie */
{
  const mark = `<clipPath id="lc"><rect width="60" height="60" rx="11"/></clipPath><g clip-path="url(#lc)"><rect width="60" height="60" fill="#d2a56d"/><g fill="none" stroke="#1f2d27" stroke-width="4.2"><circle cx="0" cy="60" r="17"/><circle cx="0" cy="60" r="31"/><circle cx="0" cy="60" r="45"/><circle cx="0" cy="60" r="59"/></g></g>`;
  const t = text(F.jost6, 'LENOIR', 40, 0.2), s = text(F.jost5, 'MENUISERIE & AGENCEMENT', 9, 0.3);
  add('lenoir', 'Lenoir', 'Menuiserie & agencement', '#1f2d27',
    svg(78 + t.w, 60, mark + G(78, 35, P(t.d, '#f4ede0')) + G(79, 54, P(s.d, '#d2a56d'))), svg(60, 60, mark));
}

/* 6. Pépin — épicerie */
{
  const mark = `<circle cx="30" cy="38" r="26" fill="#e5482d"/><path d="M30 23c9 10 10 21 0 28c-10-7-9-18 0-28z" fill="#fff3e3"/><path d="M31 12C35 1 47 0 53 4c-4 10-13 13-22 8z" fill="#2f7d4f"/>`;
  const t = text(F.bri8, 'Pépin', 62, -0.035), s = text(F.dm7, 'ÉPICERIE DE SAISON', 9, 0.32);
  add('pepin', 'Pépin', 'Épicerie de saison', '#fff3e3',
    svg(70 + t.w, 80, mark + G(70, 47, P(t.d, '#2a1a12')) + G(72, 77, P(s.d, '#2f7d4f'))), svg(60, 66, mark));
}

/* 7. Varenne — avocats (logo centré) */
{
  const v = text(F.play5, 'V', 44), t = text(F.play5, 'VARENNE', 30, 0.32), s = text(F.jost5, 'AVOCATS', 9.5, 0.6);
  const W = Math.max(t.w, 200), cx = W / 2, gold = '#c9a961';
  const mark = (x) => `<circle cx="${x}" cy="33" r="31" fill="none" stroke="${gold}" stroke-width="1.4"/>` + G(x - v.w / 2, 33 + cap(F.play5, 44) / 2, P(v.d, gold));
  const lineW = (W - s.w) / 2 - 12;
  add('varenne', 'Varenne', "Cabinet d'avocats", '#101c33',
    svg(W, 126, mark(cx) + G(cx - t.w / 2, 101, P(t.d, '#f6f1e6')) + G(cx - s.w / 2, 122, P(s.d, gold)) + `<path d="M0 118.500h${lineW.toFixed(1)}M${(W - lineW).toFixed(1)} 118.500H${W}" stroke="${gold}" stroke-width="1" opacity=".7"/>`),
    svg(64, 66, mark(32)));
}

/* 8. Nordik — transport */
{
  const mark = `<g transform="translate(12 0) skewX(-12)"><path d="M4 14h13l22 26V30h-9L46.5 6L63 30h-9v26H41L17 28v28H4z" fill="#1f4bff"/></g>`;
  const t = text(F.arc9i, 'NORDIK', 46, -0.01), s = text(F.jost6, 'TRANSPORT & LOGISTIQUE', 9, 0.3);
  add('nordik', 'Nordik', 'Transport & logistique', '#eaf0ff',
    svg(78 + t.w, 62, mark + G(76, 40, P(t.d, '#0b1433')) + G(74, 58, P(s.d, '#1f4bff'))), svg(72, 62, mark));
}

for (const l of LOGOS) { fs.writeFileSync(path.join(OUT, `${l.slug}.svg`), l.full); fs.writeFileSync(path.join(OUT, `${l.slug}-mark.svg`), l.mark); }
fs.writeFileSync(path.join(OUT, 'logos.json'), JSON.stringify(LOGOS.map(({ slug, name, sector, bg }) => ({ slug, name, sector, bg })), null, 1));
console.log('✓', LOGOS.length, 'logos →', OUT);
