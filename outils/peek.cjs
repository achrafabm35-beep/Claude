// Capture rapide d'une page locale : node outils/peek.cjs <fichier.html> <sortie.png> [largeur] [hauteur] [scrollY] [full]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [f, out, w = 1440, h = 900, sy = 0, full] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + path.resolve(f)); await p.waitForTimeout(+(process.env.WAIT||1800));
  if (+sy) { await p.evaluate(y => window.scrollTo(0, y), +sy); await p.waitForTimeout(1500); }
  await p.screenshot({ path: out, fullPage: full === 'full' });
  if (errs.length) console.log('ERREURS', errs.join('\n'));
  await b.close();
})();
