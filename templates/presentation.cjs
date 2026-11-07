// Présentation AS Marketing Agency (PDF paysage, sans aucun prix).
// Usage : node outils/captures.cjs && node templates/presentation.cjs
// Produit templates/06-presentation.pdf (fichiers intermédiaires dans templates/.presentation-tmp, ignoré par git)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site/asagency');
const SHOTS = path.join(SITE, 'img/shots');
const OUT = __dirname;
const TMP = path.join(OUT, '.presentation-tmp');
fs.mkdirSync(TMP, { recursive: true });

const url = (f) => 'file://' + f;
const S = (n) => url(path.join(SHOTS, n));
const LOGO_FULL = url(path.join(SITE, 'img/logo-full.webp'));
const LOGO_MARK = url(path.join(SITE, 'img/logo-mark.webp'));

const FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap';

const IPHONE_CSS = fs.readFileSync(path.join(SITE, 'iphone.css'), 'utf8');
const CSS = IPHONE_CSS + `
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:297mm 210mm;margin:0}
:root{--ink:#141318;--muted:#6b6976;--bg:#f4f4f7;--aqua:#1fc6b6;--grad:linear-gradient(100deg,#1fc6b6,#8fb0f0 52%,#eaa6e6);--paper:#fffdf8;--tape:rgba(255,240,196,.85);
  --shadow:0 2px 3px rgba(20,19,24,.08),0 14px 24px -10px rgba(20,19,24,.35),0 30px 50px -30px rgba(20,19,24,.4)}
body{font-family:Inter,Arial,sans-serif;color:var(--ink);font-size:11pt;line-height:1.5}
.page{position:relative;width:297mm;height:210mm;overflow:hidden;page-break-after:always;background:var(--bg) url(BG_LIGHT) center/cover no-repeat;padding:16mm 18mm}
.page:last-child{page-break-after:auto}
.dark{background:var(--ink) url(BG_DARK) center/cover no-repeat;color:#fff}
.blob{position:absolute;border-radius:50%;opacity:.75}
.b1{width:150mm;height:150mm;background:radial-gradient(circle,#9af0e6,rgba(154,240,230,0) 70%);top:-50mm;right:-30mm}.b2{width:130mm;height:130mm;background:radial-gradient(circle,#f3c2ef,rgba(243,194,239,0) 70%);bottom:-60mm;left:-30mm}.b3{width:90mm;height:90mm;background:radial-gradient(circle,#bcd0fb,rgba(188,208,251,0) 70%);top:60mm;left:120mm;opacity:.45}
.dark .blob{opacity:.25}
/* le texte en dégradé (background-clip) laisse des traits parasites à l'impression PDF : couleur pleine de la charte */
.grad{color:#17b8a9}
.dark .grad{color:#5fe0d3}
.eyebrow{font:600 9pt 'Space Grotesk';letter-spacing:.2em;text-transform:uppercase;color:var(--aqua);margin-bottom:4mm}
h1,h2,h3{font-family:'Space Grotesk',Arial,sans-serif;letter-spacing:-.02em;line-height:1.02}
h2{font-size:32pt;font-weight:700}
.lead{color:var(--muted);font-size:12pt;max-width:150mm;margin-top:4mm}
.dark .lead{color:rgba(255,255,255,.7)}
.foot{position:absolute;left:18mm;right:18mm;bottom:8mm;display:flex;justify-content:space-between;align-items:center;font-size:8pt;color:var(--muted)}
.dark .foot{color:rgba(255,255,255,.5)}
.foot img{height:7mm}
.foot b{font-weight:600}
.z{position:relative;z-index:2}
/* cadres pro (navigateur / appareil) */
.fr{position:absolute;background:#fff;border-radius:3mm;overflow:hidden;box-shadow:0 1px 2px rgba(20,19,24,.08),0 24px 40px -18px rgba(20,19,24,.45);border:1px solid rgba(20,19,24,.08)}
.dark .fr{border-color:rgba(255,255,255,.12);box-shadow:0 30px 60px -20px rgba(0,0,0,.8)}
.fr .bar{height:6mm;background:#f1f1f4;display:flex;align-items:center;gap:1.4mm;padding:0 3mm;border-bottom:1px solid #e6e5ea}
.fr .bar i{width:2mm;height:2mm;border-radius:50%;background:#d6d5dc}.fr .bar i:nth-child(1){background:#ff6b6b}.fr .bar i:nth-child(2){background:#ffc145}.fr .bar i:nth-child(3){background:#3ad29f}
.fr .bar span{margin-left:3mm;flex:1;height:3mm;border-radius:99px;background:#fff;font-size:5.5pt;color:#9a98a3;line-height:3mm;padding-left:2mm}
.fr .vp{overflow:hidden}.fr img{display:block;width:100%}
.ph{position:absolute;z-index:4;border-radius:6mm;border:1.8mm solid #1d1c22;overflow:hidden;background:#000;box-shadow:0 26px 40px -18px rgba(20,19,24,.7)}
.adimg{position:absolute;border-radius:3mm;box-shadow:0 26px 40px -18px rgba(20,19,24,.7);z-index:3}
.ph::before{content:"";position:absolute;top:1.2mm;left:50%;width:9mm;height:2.2mm;margin-left:-4.5mm;border-radius:99px;background:#0d0c11;z-index:2}
.ph img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.lbl{position:absolute;font:600 8pt 'Space Grotesk';letter-spacing:.04em;display:flex;align-items:center;gap:2mm}
.lbl::before{content:"";width:6mm;height:1mm;border-radius:99px;background:var(--grad)}
.big{font:700 13pt 'Space Grotesk';letter-spacing:-.01em}
.chips{display:flex;gap:2mm;flex-wrap:wrap;margin-top:3mm}
.chips span{font-size:7.5pt;padding:1mm 2.6mm;border-radius:99px;background:#fff;border:1px solid #e6e5ea;color:var(--ink)}
.dark .chips span{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#fff}
.chips span.n{background:var(--grad);border:0;font-weight:600;color:#141318}
`;

const foot = (n, dark) => `<div class="foot">${dark ? '<b style="font:700 14pt Space Grotesk;color:#fff;letter-spacing:-.02em">AS</b>' : `<img src="${LOGO_MARK}">`}<span><b>AS Marketing Agency</b> · On le fait. Vous l'aimez. Ensuite, on parle.</span><span>${String(n).padStart(2, '0')}</span></div>`;
// cadre navigateur : f = capture, style = position/taille, h = hauteur visible (sinon image entière), pos = object-position
const fr = (f, style, h, url_ = 'votre-outil.fr') => `<figure class="fr" style="${style}"><div class="bar"><i></i><i></i><i></i><span>${url_}</span></div><div class="vp"${h ? ` style="height:${h}"` : ''}><img src="${S(f)}"></div></figure>`;
// iPhone réaliste (même maquette que le site : site/asagency/iphone.css) ; la hauteur découle de la largeur
const SB = { 'mobile-lumen.jpg': ['#0e0a07', '#fff'], 'mobile-velora.jpg': ['#2b1f23', '#fff'], 'mobile-kinetik.jpg': ['#12101d', '#fff'], 'mobile-verdi.jpg': ['#f1eee7', '#111'] };
const ph = (f, style) => { const [bg, fg] = SB[f] || ['#fff', '#111']; return `<div class="iphone" style="position:absolute;z-index:4;--sb:${bg};--sbtext:${fg};${style.replace(/height:[^;]+;?/, '')}"><div class="iphone__screen"><span class="iphone__bar"><b>9:41</b><i></i></span><img src="${S(f)}"></div></div>`; };
const lbl = (t, style) => `<span class="lbl" style="${style}">${t}</span>`;

const pages = [];

/* 1. Couverture */
pages.push(`<section class="page">
  <div class="z" style="position:absolute;left:18mm;top:16mm;width:106mm">
    <img src="${LOGO_FULL}" style="width:50mm;margin-bottom:8mm">
    <h1 style="font-size:40pt;font-weight:700;letter-spacing:-.035em">On le fait.<br>Vous l'aimez.<br><span class="grad">Ensuite,<br>on parle.</span></h1>
    <p class="lead" style="margin-top:6mm">On vous montre d'abord, vous décidez ensuite.</p>
    <div style="display:flex;gap:2.4mm;margin-top:7mm">${['Applications', 'Sites web', 'Publicités', 'Logos'].map(t => `<span style="font:600 8.5pt 'Space Grotesk';padding:1.6mm 3.4mm;border-radius:99px;background:#fff;border:1px solid #e6e5ea">${t}</span>`).join('')}</div>
  </div>
  ${fr('site-velora.jpg', 'width:112mm;left:172mm;top:12mm', '', 'velora.fr')}
  ${fr('app-projets-dash.jpg', 'width:132mm;left:140mm;top:52mm', '', 'app.votre-entreprise.fr')}
  <img class="adimg" src="${url(path.join(TMP, 'ad-story.png'))}" style="width:36mm;left:128mm;top:112mm">
  <img class="adimg" src="${url(path.join(TMP, 'ad-banner.png'))}" style="width:78mm;left:170mm;top:140mm">
  ${ph('mobile-kinetik.jpg', 'width:32mm;left:252mm;top:108mm')}
</section>`);

/* 3. Applications : ouverture */
pages.push(`<section class="page dark">
  <div class="z" style="position:absolute;left:18mm;top:20mm;width:96mm">
    <p class="eyebrow">Applications sur mesure</p>
    <h2 style="font-size:34pt;line-height:1.04">Votre métier mérite <span class="grad">son propre outil.</span></h2>
    <p class="lead" style="font-size:12pt">Fini les fichiers Excel éparpillés. On construit l'application qui colle à vos process, et vous la testez avant de payer.</p>
    <div style="margin-top:10mm;display:flex;flex-direction:column;gap:4mm">
      ${[['Vos données, enfin centralisées', 'Une seule source, à jour pour toute l\'équipe.'], ['Tableaux de bord en temps réel', 'Les bons chiffres, sans retraitement.'], ['Reporting en un clic', 'Exports PowerPoint, PDF et Excel prêts à partager.']].map(([t, d]) => `<div style="display:flex;gap:4mm;align-items:flex-start"><span style="flex:none;width:7mm;height:7mm;border-radius:2mm;background:var(--grad);color:#141318;display:grid;place-items:center;font-weight:700;font-size:9pt">✓</span><div><b style="font-size:10.5pt">${t}</b><div style="font-size:9pt;color:rgba(255,255,255,.6)">${d}</div></div></div>`).join('')}
    </div>
  </div>
  ${fr('app-projets-gantt.jpg', 'width:132mm;left:150mm;top:18mm;opacity:.9', '', 'pilotage.app/planning')}
  ${fr('app-amelio-dash.jpg', 'width:150mm;left:126mm;top:82mm', '', 'amelioration.app')}
  ${foot(2, true)}
</section>`);

/* 4-6. Une page par application */
const appPage = (n, kicker, title, chips, main, side1, side2, host) => `<section class="page">
  <div class="z" style="position:absolute;left:18mm;top:16mm;width:180mm"><p class="eyebrow">${kicker}</p><h2 style="font-size:28pt">${title}</h2><div class="chips">${chips.map(c => `<span>${c}</span>`).join('')}</div></div>
  ${fr(main, 'width:178mm;left:18mm;top:62mm', '', host)}
  ${fr(side1, 'width:82mm;left:200mm;top:38mm', '', host)}
  ${fr(side2, 'width:82mm;left:200mm;top:98mm', '', host)}
  ${foot(n)}
</section>`;
pages.push(appPage(3, 'Application · Pilotage de projets', 'Tous vos projets, <span class="grad">sur un seul écran.</span>', ['Planning', 'Budget', 'Risques', 'Reporting hebdo', 'Export PowerPoint'], 'app-projets-dash.jpg', 'app-projets-gantt.jpg', 'app-projets-risques.jpg', 'pilotage.app'));
pages.push(appPage(4, 'Application · Cartographie terrain', 'Vos sites et ateliers, <span class="grad">en un coup d\'œil.</span>', ['Plan interactif', 'Zoom par zone', 'Questionnaires terrain', 'Tableau de bord'], 'app-carto-plan.jpg', 'app-carto-dash.jpg', 'app-carto-atelier.jpg', 'cartographie.app'));
pages.push(appPage(5, 'Application · Amélioration continue', 'Idées, actions, audits : <span class="grad">tout avance.</span>', ['Idées & actions', 'Audits', 'Achats vs budget', 'Suivi d\'équipe'], 'app-amelio-dash.jpg', 'app-amelio-actions.jpg', 'app-amelio-achats.jpg', 'amelioration.app'));

/* 7. Nouvelles applications */
pages.push(`<section class="page dark">
  <div class="z" style="width:200mm"><p class="eyebrow">Et pour chaque métier</p><h2 style="font-size:30pt">Réservation, ventes, CRM :<br><span class="grad">on s'adapte à vous.</span></h2></div>
  ${[['app-reserva.jpg', 'Réservation en ligne', 'Agenda, réservation 24 h/24, rappels SMS.', 18], ['app-stockly.jpg', 'Ventes & stocks', 'Ventes en direct et réassort automatique.', 107], ['app-closr.jpg', 'CRM commercial', 'Pipeline, relances auto, entonnoir.', 196]].map(([f, t, d, x]) => `
    ${fr(f, `width:83mm;left:${x}mm;top:76mm`, '', 'demo.asagency.store')}
    <div class="z" style="position:absolute;left:${x}mm;top:132mm;width:83mm"><span class="chips" style="margin:0 0 2mm"><span class="n">Nouveau</span></span><div class="big">${t}</div><p style="font-size:9pt;color:rgba(255,255,255,.65);margin-top:1mm">${d}</p></div>`).join('')}
  ${foot(6, true)}
</section>`);

/* 8. Méthode */
const steps = [['01', 'Vous nous parlez du projet', '20 minutes, sans cahier des charges.'], ['02', 'On réalise une première version', 'Du concret sous 72 h.'], ['03', 'Vous validez, ou pas', 'Sinon, vous ne nous devez rien.'], ['04', 'On lance et on vous suit', 'Mise en ligne, réglages, évolutions.']];
pages.push(`<section class="page">
  <div class="z"><p class="eyebrow">Notre méthode</p><h2>4 étapes, et la première version<br>est <span class="grad">offerte</span>.</h2></div>
  <div class="z" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6mm;margin-top:16mm">
    ${steps.map(([n, t, d], k) => `<div style="background:${k === 1 ? '#141318' : '#fff'};color:${k === 1 ? '#fff' : 'inherit'};border-radius:6mm;padding:8mm 6mm;min-height:80mm;box-shadow:0 18px 40px -26px rgba(20,19,24,.35);position:relative">
      ${k === 1 ? '<span style="position:absolute;top:-3mm;right:6mm;background:var(--grad);color:#141318;font:700 8pt Space Grotesk;letter-spacing:.12em;padding:1.2mm 3mm;border-radius:99px">OFFERT</span>' : ''}
      <div class="grad" style="font:700 40pt 'Space Grotesk'">${n}</div>
      <h3 style="font-size:15pt;margin:6mm 0 3mm">${t}</h3><p style="font-size:10pt;color:${k === 1 ? 'rgba(255,255,255,.7)' : 'var(--muted)'}">${d}</p></div>`).join('')}
  </div>
  ${foot(7)}
</section>`);

/* 9-10. Sites */
pages.push(`<section class="page">
  <div class="z" style="width:84mm"><p class="eyebrow">Sites web</p><h2 style="font-size:30pt">Des sites qui <span class="grad">bougent.</span></h2>
    <p class="lead" style="font-size:11pt">Zoom au scroll, parallax, titres animés. Pensés pour retenir l'attention et convertir.</p>
    <div class="chips"><span>Vitrine</span><span>E-commerce</span><span>Mobile first</span><span>SEO</span></div></div>
  ${fr('site-lumen-full.jpg', 'width:62mm;left:108mm;top:16mm', '168mm', 'lumen.fr')}
  ${fr('site-verdi-full.jpg', 'width:62mm;left:174mm;top:16mm', '168mm', 'verdi.fr')}
  ${fr('site-kinetik-full.jpg', 'width:44mm;left:240mm;top:16mm', '168mm', 'kinetik.fr')}
  ${foot(8)}
</section>`);
pages.push(`<section class="page dark">
  ${fr('site-velora.jpg', 'width:168mm;left:18mm;top:20mm', '', 'velora.fr')}
  ${fr('site-kinetik.jpg', 'width:120mm;left:40mm;top:104mm', '', 'kinetik.fr')}
  <div class="z" style="position:absolute;left:200mm;top:20mm;width:84mm"><p class="eyebrow">Version mobile</p><h2 style="font-size:24pt">Parfaits aussi<br><span class="grad">dans la poche.</span></h2></div>
  ${['lumen', 'velora', 'kinetik'].map((s, k) => ph('mobile-' + s + '.jpg', `width:28mm;left:${198 + k * 30}mm;top:${[78, 68, 78][k]}mm`)).join('')}
  ${foot(9, true)}
</section>`);

/* 11. Logos */
pages.push(`<section class="page">
  <div class="z" style="position:absolute;left:18mm;top:16mm;width:70mm"><p class="eyebrow">Logos & identité</p><h2 style="font-size:28pt">Des marques qui ont du caractère.</h2>
    <p class="lead" style="font-size:10.5pt">Chaque logo raconte une histoire et se décline sur tous vos supports.</p></div>
  <img src="${url(path.join(TMP, 'logos.png'))}" class="z" style="position:absolute;left:96mm;top:44mm;width:186mm">
  ${foot(10)}
</section>`);

/* 12. Pubs */
pages.push(`<section class="page">
  <div class="z"><p class="eyebrow">Publicités digitales</p><h2>Des pubs qui <span class="grad">arrêtent le pouce</span>.</h2>
    <p class="lead">Stories, posts sponsorisés, bannières : des formats animés pour Instagram, Facebook, TikTok et le web.</p></div>
  <img src="${url(path.join(TMP, 'ads.png'))}" class="z" style="position:absolute;left:18mm;right:18mm;bottom:18mm;width:261mm">
  ${foot(11)}
</section>`);

/* 13. Pourquoi nous */
const rows = [['Vous payez avant de voir le résultat', 'Vous voyez une première version avant tout paiement'], ['Des semaines avant une première maquette', 'Du concret sous 72 h'], ['Des modèles génériques', '100 % sur mesure, pensé pour votre activité'], ['Un interlocuteur différent à chaque étape', 'Une seule équipe, de l\'idée au lancement'], ['Livraison puis plus de nouvelles', 'Suivi, ajustements et accompagnement']];
pages.push(`<section class="page">
  <div class="z"><p class="eyebrow">Pourquoi AS Marketing Agency</p><h2>La confiance, <span class="grad">ça se montre</span>.</h2></div>
  <div class="z" style="display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:10mm">
    <div style="background:#fff;border:1px solid #e6e5ea;border-radius:6mm;padding:7mm"><h3 style="font-size:13pt;color:var(--muted);margin-bottom:4mm">Le parcours habituel</h3>${rows.map(r => `<p style="padding:2.6mm 0;border-bottom:1px solid #eee;color:var(--muted);font-size:10.5pt">✕&nbsp;&nbsp;${r[0]}</p>`).join('')}</div>
    <div style="background:#141318;color:#fff;border-radius:6mm;padding:7mm;position:relative;overflow:hidden"><span style="position:absolute;inset:0 0 auto;height:1.6mm;background:var(--grad)"></span><h3 style="font-size:13pt;margin-bottom:4mm" class="grad">Avec AS Marketing Agency</h3>${rows.map(r => `<p style="padding:2.6mm 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:10.5pt"><b style="color:#1fc6b6">✓</b>&nbsp;&nbsp;${r[1]}</p>`).join('')}</div>
  </div>
  ${foot(12)}
</section>`);

/* 14. Contact */
pages.push(`<section class="page dark">
  <div class="z" style="position:absolute;left:18mm;top:30mm;width:150mm">
    <p class="eyebrow">Votre projet</p>
    <h2 style="font-size:44pt;line-height:1.02">Décrivez-le.<br><span class="grad">On vous le montre.</span></h2>
    <p class="lead" style="font-size:13pt;margin-top:7mm">Envoyez-nous quelques lignes sur votre projet. Vous recevez une première version sous 72 h, et vous ne vous engagez que si elle vous plaît.</p>
    <div style="margin-top:10mm;display:flex;flex-direction:column;gap:3mm;font-size:13pt">
      <span>✉&nbsp;&nbsp;<b>as.agency.off@gmail.com</b></span><span>◍&nbsp;&nbsp;<b>asagency.store</b></span>
    </div>
    <span style="display:inline-block;margin-top:9mm;background:var(--grad);color:#141318;font:700 11pt 'Space Grotesk';padding:3.5mm 7mm;border-radius:99px">Première version offerte, sans engagement</span>
  </div>
  <div style="position:absolute;right:20mm;top:40mm;width:92mm;height:92mm;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff,#f4f4f7 60%,#d9f6f2);display:grid;place-items:center;box-shadow:0 30px 80px -20px rgba(31,198,182,.5)"><img src="${LOGO_FULL}" style="width:72mm"></div>
  ${foot(13, true)}
</section>`);

const BG = (dark) => `<html><body style="margin:0;width:1123px;height:794px;overflow:hidden;background:${dark ? '#141318' : '#f4f4f7'}">
  <div style="position:absolute;width:620px;height:620px;border-radius:50%;background:#9af0e6;filter:blur(90px);opacity:${dark ? .22 : .55};top:-220px;right:-120px"></div>
  <div style="position:absolute;width:540px;height:540px;border-radius:50%;background:#f3c2ef;filter:blur(90px);opacity:${dark ? .2 : .55};bottom:-260px;left:-120px"></div>
  <div style="position:absolute;width:380px;height:380px;border-radius:50%;background:#bcd0fb;filter:blur(80px);opacity:${dark ? .15 : .4};top:240px;left:480px"></div></body></html>`;

const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>AS Marketing Agency — Présentation</title><link href="${FONTS}" rel="stylesheet"><style>${CSS}</style></head><body>${pages.join('\n')}</body></html>`;

(async () => {
  const browser = await chromium.launch();
  // captures des blocs « logos » et « pubs » depuis le site (mode figé)
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.6 });
  await p.goto(url(path.join(SITE, 'index.html')) + '?shot');
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1200);
  await p.addStyleTag({ content: 'html,body{background:transparent!important}.bg,.grain{display:none!important}.logos,.ads{padding:24px 18px 30px}' });
  await (await p.$('.logos')).screenshot({ path: path.join(TMP, 'logos.png'), omitBackground: true });
  await (await p.$('.ads')).screenshot({ path: path.join(TMP, 'ads.png'), omitBackground: true });
  for (const k of ['story', 'square', 'banner']) await (await p.$('.ads .ad--' + k)).screenshot({ path: path.join(TMP, 'ad-' + k + '.png'), omitBackground: true });
  await p.setViewportSize({ width: 1440, height: 900 });
  for (const dark of [false, true]) {
    await p.setViewportSize({ width: 1123, height: 794 });
    await p.setContent(BG(dark));
    await p.screenshot({ path: path.join(TMP, dark ? 'bg-dark.jpg' : 'bg-light.jpg'), type: 'jpeg', quality: 80 });
  }
  await p.close();

  const htmlPath = path.join(TMP, '06-presentation.html');
  fs.writeFileSync(htmlPath, html.replace('BG_LIGHT', url(path.join(TMP, 'bg-light.jpg'))).replace('BG_DARK', url(path.join(TMP, 'bg-dark.jpg'))));
  // Chaque page est rendue en image (JPEG) puis assemblée : aucune ombre floue ni transparence dans le PDF,
  // ce qui évite les rectangles noirs affichés par certains lecteurs (Aperçu, iOS…).
  const page = await browser.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 2 });
  await page.goto(url(htmlPath));
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const secs = await page.$$('section.page');
  const imgs = [];
  for (let i = 0; i < secs.length; i++) {
    const f = path.join(TMP, `page-${String(i + 1).padStart(2, '0')}.jpg`);
    await secs[i].screenshot({ path: f, type: 'jpeg', quality: 86 });
    imgs.push(f);
  }
  await page.close();
  const flat = `<!DOCTYPE html><html><head><style>@page{size:297mm 210mm;margin:0}*{margin:0;padding:0}img{display:block;width:297mm;height:210mm;page-break-after:always}img:last-child{page-break-after:auto}</style></head><body>${imgs.map(f => `<img src="${url(f)}">`).join('')}</body></html>`;
  const flatPath = path.join(TMP, 'flat.html');
  fs.writeFileSync(flatPath, flat);
  const pp = await browser.newPage();
  await pp.goto(url(flatPath));
  await pp.waitForLoadState('networkidle').catch(() => {});
  await pp.pdf({ path: path.join(OUT, '06-presentation.pdf'), width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('✓ templates/06-presentation.pdf');
})();
