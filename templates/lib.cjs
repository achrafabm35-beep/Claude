// Outils communs aux documents (brochure, pack de bienvenue, visuels réseaux sociaux).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site/asagency');
const url = (f) => 'file://' + f;
const img = (n) => url(path.join(SITE, 'img', n));
const shot = (n) => img('shots/' + n);
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap';
const IPHONE_CSS = fs.readFileSync(path.join(SITE, 'iphone.css'), 'utf8');

const tmpDir = (name) => { const d = path.join(__dirname, '.tmp', name); fs.mkdirSync(d, { recursive: true }); return d; };
const ready = async (p) => {
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  await p.waitForTimeout(500);
};

// Morceaux du vrai site (mode ?shot : animations figées) réutilisés dans les documents.
// jobs : [{ name, w, h, sel?, css?, scale? }] → { name: URL du fichier PNG }
async function pieces(browser, dir, jobs) {
  const out = {};
  for (const j of jobs) {
    const ctx = await browser.newContext({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: j.scale || 2 });
    const p = await ctx.newPage();
    await p.goto(url(path.join(SITE, 'index.html')) + '?shot');
    await p.addStyleTag({ content: '#loader,#progress,.nav{display:none!important}' + (j.css || '') });
    await ready(p);
    const f = path.join(dir, j.name + '.png');
    if (j.sel) { const el = await p.$(j.sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await el.screenshot({ path: f }); }
    else await p.screenshot({ path: f });
    out[j.name] = url(f);
    await ctx.close();
  }
  return out;
}

// Écrit le HTML, capture chaque élément `sel` et renvoie les fichiers image.
async function raster(browser, dir, html, { sel = '.page', w, h, scale = 2, type = 'jpeg', quality = 86 } = {}) {
  const htmlPath = path.join(dir, 'doc.html');
  fs.writeFileSync(htmlPath, html);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const p = await ctx.newPage();
  await p.goto(url(htmlPath));
  await ready(p);
  const els = await p.$$(sel);
  const files = [];
  for (let i = 0; i < els.length; i++) {
    const name = (await els[i].getAttribute('data-name')) || String(i + 1).padStart(2, '0');
    const f = path.join(dir, name + (type === 'jpeg' ? '.jpg' : '.png'));
    await els[i].screenshot(type === 'jpeg' ? { path: f, type, quality } : { path: f });
    files.push(f);
  }
  await ctx.close();
  return files;
}

// Assemble des images pleine page en PDF (une image par page) : rendu identique partout, sans rectangles noirs.
async function imagesToPdf(browser, files, out, wmm, hmm) {
  const html = `<!doctype html><meta charset="utf-8"><style>@page{size:${wmm}mm ${hmm}mm;margin:0}*{margin:0}img{display:block;width:${wmm}mm;height:${hmm}mm;page-break-after:always}img:last-child{page-break-after:auto}</style>${files.map((f) => `<img src="${url(f)}">`).join('')}`;
  const f = path.join(path.dirname(files[0]), 'assemble.html');
  fs.writeFileSync(f, html);
  const p = await browser.newPage();
  await p.goto(url(f));
  await ready(p);
  await p.pdf({ path: out, width: wmm + 'mm', height: hmm + 'mm', printBackground: true, preferCSSPageSize: true });
  await p.close();
}

// PDF vectoriel (texte sélectionnable) pour les documents sobres : ni ombre, ni flou, ni transparence dans ces pages.
async function htmlToPdf(browser, dir, name, html, out) {
  const f = path.join(dir, name + '.html');
  fs.writeFileSync(f, html);
  const p = await browser.newPage();
  await p.goto(url(f));
  await ready(p);
  await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await p.close();
}

// iPhone réaliste (maquette du site) ; la hauteur découle de la largeur
const SB = { brume: ['#ffeaa8', '#111'], souffle: ['#f3ebe0', '#111'], orbe: ['#312b6f', '#fff'], solstice: ['#0e0617', '#fff'] };
const iphone = (slug, style = '') => { const [bg, fg] = SB[slug] || ['#fff', '#111']; return `<div class="iphone" style="--sb:${bg};--sbtext:${fg};${style}"><div class="iphone__screen"><span class="iphone__bar"><b>9:41</b><i></i></span><img src="${shot(`mobile-${slug}.webp`)}"></div></div>`; };
// fenêtre de navigateur
const win = (src, style = '', adr = 'app.votre-entreprise.fr', cls = '') => `<figure class="win ${cls}" style="${style}"><div class="win__bar"><i></i><i></i><i></i><span>${adr}</span></div><div class="win__img"><img src="${src}"></div></figure>`;

const APPS = [
  { n: 'Pilotage de projets', f: 'app-projets-dash', d: 'Planning, budget, risques et reporting au même endroit.', r: 'le planning Excel et le PowerPoint du lundi' },
  { n: 'Cartographie terrain', f: 'app-carto-plan', d: 'Vos ateliers et vos postes sur un plan, avec les indicateurs dessus.', r: 'les relevés papier et les plans imprimés' },
  { n: 'Amélioration continue', f: 'app-amelio-dash', d: 'Idées, actions, audits et achats suivis jusqu’au bout.', r: 'le tableau d’actions jamais à jour' },
  { n: 'Réservation en ligne', f: 'app-reserva', d: 'Vos clients réservent seuls, les rappels partent tout seuls.', r: 'le carnet de rendez-vous et les appels manqués' },
  { n: 'Ventes & stocks', f: 'app-stockly', d: 'Commandes en direct, stock à jour, réassort automatique.', r: 'l’inventaire du dimanche soir' },
  { n: 'CRM commercial', f: 'app-closr', d: 'Chaque prospect suivi, chaque relance envoyée.', r: 'les relances oubliées et les devis perdus' },
];
const SITES = [
  { s: 'solstice', n: 'Solstice', t: 'Festival · billetterie', adr: 'solstice-festival.fr' },
  { s: 'brume', n: 'Brume', t: 'Boissons · boutique en ligne', adr: 'brume-infusions.fr' },
  { s: 'orbe', n: 'Orbe', t: 'Logiciel · page de vente', adr: 'orbe.fr' },
  { s: 'souffle', n: 'Souffle', t: 'Studio · réservation en ligne', adr: 'souffle-studio.fr' },
];
const LOGOS = JSON.parse(fs.readFileSync(path.join(SITE, 'img/logos/logos.json'), 'utf8'));

module.exports = { chromium, fs, path, ROOT, SITE, url, img, shot, FONTS, IPHONE_CSS, tmpDir, pieces, raster, imagesToPdf, htmlToPdf, iphone, win, APPS, SITES, LOGOS };
