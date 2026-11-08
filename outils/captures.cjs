// Génère les captures des exemples (sites + apps) utilisées par le site et le PDF.
// Usage : node outils/captures.cjs
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '../site/asagency');
const OUT = path.join(ROOT, 'img/shots');
fs.mkdirSync(OUT, { recursive: true });

const SITES = ['lumen', 'verdi', 'velora', 'kinetik'];
const APPS = ['reserva', 'stockly', 'closr'];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const shot = async (rel, out, opts = {}) => {
    await page.goto('file://' + path.join(ROOT, rel) + '?shot');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, out), type: 'jpeg', quality: 82, ...opts });
    console.log('✓', out);
  };
  for (const s of SITES) await shot(`exemples/sites/${s}.html`, `site-${s}.jpg`);
  for (const a of APPS) await shot(`exemples/apps/${a}.html`, `app-${a}.jpg`);
  await page.close();

  // pages complètes réduites à 900 px de large (effet « défilement dans le cadre »)
  const fctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.625 });
  const fp = await fctx.newPage();
  for (const s of SITES) {
    await fp.goto('file://' + path.join(ROOT, `exemples/sites/${s}.html`) + '?shot');
    await fp.waitForLoadState('networkidle').catch(() => {});
    await fp.waitForTimeout(900);
    const h = await fp.evaluate(() => document.documentElement.scrollHeight);
    await fp.screenshot({ path: path.join(OUT, `site-${s}-full.jpg`), type: 'jpeg', quality: 78, fullPage: true, clip: { x: 0, y: 0, width: 1440, height: h } });
    console.log('✓', `site-${s}-full.jpg`);
  }

  // version mobile des sites (pour les maquettes de téléphone)
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mp = await m.newPage();
  for (const s of SITES) {
    await mp.goto('file://' + path.join(ROOT, `exemples/sites/${s}.html`) + '?shot');
    await mp.waitForLoadState('networkidle').catch(() => {});
    await mp.waitForTimeout(900);
    await mp.screenshot({ path: path.join(OUT, `mobile-${s}.jpg`), type: 'jpeg', quality: 80 });
    console.log('✓', `mobile-${s}.jpg`);
  }
  // pubs du site, en images (mur d'accueil)
  const ap = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  await ap.goto('file://' + path.join(ROOT, 'index.html') + '?shot');
  await ap.waitForLoadState('networkidle').catch(() => {});
  await ap.waitForTimeout(1200);
  for (const k of ['story', 'square', 'banner']) {
    await (await ap.$('.ads .ad--' + k)).screenshot({ path: path.join(OUT, `ad-${k}.jpg`), type: 'jpeg', quality: 84 });
    console.log('✓', `ad-${k}.jpg`);
  }
  await browser.close();
})();
