// Génère les captures des exemples (sites, apps de démo, publicités) utilisées par le site, la brochure et les visuels.
// Usage : node outils/captures.cjs            (tout)
//         node outils/captures.cjs sites|apps|pubs
// Sorties en WebP dans site/asagency/img/shots/ ; « -s » = petite version pour le mur d'accueil.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const ROOT = path.resolve(__dirname, '../site/asagency');
const OUT = path.join(ROOT, 'img/shots');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'shots-'));
fs.mkdirSync(OUT, { recursive: true });

const SITES = ['solstice', 'brume', 'orbe', 'souffle'];
const APPS = ['reserva', 'stockly', 'closr'];
const only = process.argv[2];

// PNG → WebP (largeur max, qualité) via Pillow
const webp = (jobs) => execFileSync('python3', ['-c', `
import sys, json
from PIL import Image
for src, dst, w, q in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGB')
    if w and im.size[0] > w: im = im.resize((w, round(im.size[1] * w / im.size[0])), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=q, method=6)
`, JSON.stringify(jobs)]);

(async () => {
  const browser = await chromium.launch();
  const jobs = [];
  const open = async (ctx, rel) => {
    const p = await ctx.newPage();
    await p.goto('file://' + path.join(ROOT, rel) + '?shot');
    await p.waitForLoadState('networkidle').catch(() => {});
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(700);
    return p;
  };

  if (!only || only === 'sites') {
    const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
    for (const s of SITES) {
      let p = await open(desk, `exemples/sites/${s}.html`);
      await p.screenshot({ path: `${TMP}/site-${s}.png` });
      await p.screenshot({ path: `${TMP}/site-${s}-full.png`, fullPage: true });
      await p.close();
      p = await open(mob, `exemples/sites/${s}.html`);
      await p.screenshot({ path: `${TMP}/mobile-${s}.png` });
      await p.close();
      jobs.push([`${TMP}/site-${s}.png`, `${OUT}/site-${s}.webp`, 1440, 82], [`${TMP}/site-${s}.png`, `${OUT}/site-${s}-s.webp`, 640, 78],
        [`${TMP}/site-${s}-full.png`, `${OUT}/site-${s}-full.webp`, 1000, 76],
        [`${TMP}/mobile-${s}.png`, `${OUT}/mobile-${s}.webp`, 600, 80], [`${TMP}/mobile-${s}.png`, `${OUT}/mobile-${s}-s.webp`, 300, 76]);
      console.log('✓ site', s);
    }
  }

  if (!only || only === 'apps') {
    const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    for (const a of APPS) {
      const p = await open(desk, `exemples/apps/${a}.html`);
      await p.screenshot({ path: `${TMP}/app-${a}.png` });
      await p.close();
      jobs.push([`${TMP}/app-${a}.png`, `${OUT}/app-${a}.webp`, 1440, 84], [`${TMP}/app-${a}.png`, `${OUT}/app-${a}-s.webp`, 640, 78]);
      console.log('✓ app', a);
    }
  }

  if (!only || only === 'pubs') {
    const ctx = await browser.newContext({ viewport: { width: 1500, height: 1500 }, deviceScaleFactor: 2.25 });
    const p = await ctx.newPage();
    await p.goto('file://' + path.join(__dirname, 'pubs.html'));
    await p.waitForLoadState('networkidle').catch(() => {});
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(700);
    for (const el of await p.$$('.ad')) {
      const n = await el.getAttribute('data-name');
      await el.screenshot({ path: `${TMP}/ad-${n}.png` });
      jobs.push([`${TMP}/ad-${n}.png`, `${OUT}/ad-${n}.webp`, 0, 86], [`${TMP}/ad-${n}.png`, `${OUT}/ad-${n}-s.webp`, 420, 78]);
      console.log('✓ pub', n);
    }
  }

  await browser.close();
  webp(jobs);
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('→', jobs.length, 'images dans', OUT);
})();
