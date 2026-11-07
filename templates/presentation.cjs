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

const FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=Caveat:wght@600;700&display=swap';

const CSS = `
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
/* billets */
.note{position:absolute;background:var(--paper);padding:2.6mm 2.6mm 3.4mm;border-radius:1.2mm;box-shadow:var(--shadow);transform:rotate(var(--r,0deg))}
.note::before,.note::after{content:"";position:absolute;width:24mm;height:7mm;background:var(--tape);top:-3.2mm;z-index:3;box-shadow:0 .3mm .6mm rgba(0,0,0,.08)}
.note::before{left:12%;transform:rotate(-7deg)}.note::after{right:12%;transform:rotate(6deg)}
.note.pin::before{width:5mm;height:5mm;border-radius:50%;left:50%;margin-left:-2.5mm;top:-1.5mm;background:radial-gradient(circle at 35% 35%,#ff9ab0,#d23a62);transform:none}
.note.pin::after{display:none}
.note img{display:block;width:100%;border-radius:.6mm}
.cap{font-family:Caveat,cursive;font-size:17pt;line-height:1;margin-top:2mm;display:flex;justify-content:space-between;align-items:baseline;color:#2b2a33}
.cap small{font:600 6.5pt Inter;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.tag{position:absolute;font-family:Caveat,cursive;font-size:17pt;line-height:1.05;background:#fff3a8;padding:2.5mm 3.5mm 2mm;box-shadow:var(--shadow);transform:rotate(var(--r,-6deg));z-index:5}
.chips{display:flex;gap:2mm;flex-wrap:wrap;margin-top:3mm}
.chips span{font-size:7.5pt;padding:1mm 2.6mm;border-radius:99px;background:#fff;border:1px solid #e6e5ea;color:var(--ink)}
.dark .note{color:var(--ink)}
.chips span.n{background:var(--grad);border:0;font-weight:600}
`;

const foot = (n, dark) => `<div class="foot">${dark ? '<b style="font:700 14pt Space Grotesk;color:#fff;letter-spacing:-.02em">AS</b>' : `<img src="${LOGO_MARK}">`}<span><b>AS Marketing Agency</b> · On le fait. Vous l'aimez. Ensuite, on parle.</span><span>${String(n).padStart(2, '0')}</span></div>`;
const note = (src, cap, small, style, cls = '', h) => `<figure class="note ${cls}" style="${style}">${h ? `<div style="height:${h};overflow:hidden;border-radius:.6mm">` : ''}<img src="${src}">${h ? '</div>' : ''}<figcaption class="cap">${cap}<small>${small}</small></figcaption></figure>`;

const pages = [];

/* 1. Couverture */
pages.push(`<section class="page">
  <div class="z" style="position:absolute;left:18mm;top:22mm;width:128mm">
    <img src="${LOGO_FULL}" style="width:62mm;margin-bottom:10mm">
    <p class="eyebrow">Présentation de l'agence</p>
    <h1 style="font-size:46pt;font-weight:700;letter-spacing:-.035em">On le fait.<br>Vous l'aimez.<br><span class="grad">Ensuite, on parle.</span></h1>
    <p class="lead" style="margin-top:7mm">Sites web, applications, logos, réseaux sociaux et publicités digitales. Avant de vous demander quoi que ce soit, on vous montre une première version concrète de votre projet.</p>
  </div>
  ${note(S('site-velora.jpg'), 'Velora', 'e-shop', 'width:112mm;left:158mm;top:20mm;--r:-5deg')}
  ${note(S('app-pilote.jpg'), 'Pilote', 'application', 'width:104mm;left:178mm;top:84mm;--r:4deg')}
  ${note(S('site-kinetik.jpg'), 'Kinetik', 'site vitrine', 'width:92mm;left:150mm;top:118mm;--r:-2deg', 'pin')}
  <span class="tag" style="left:252mm;top:160mm;--r:-7deg">fait avant<br>d'être payé ✓</span>
  <span class="tag" style="left:142mm;top:100mm;--r:5deg;background:#c8f5ee">livré en 72 h !</span>
</section>`);

/* 2. Philosophie */
pages.push(`<section class="page dark">
  <div class="z" style="max-width:220mm;margin-top:10mm">
    <p class="eyebrow">Notre philosophie</p>
    <h2 style="font-size:40pt;line-height:1.08">Une agence vous demande souvent de payer avant de voir quoi que ce soit.<br><span class="grad">Nous, on fait l'inverse.</span></h2>
    <p class="lead" style="font-size:14pt;max-width:200mm;margin-top:8mm">On crée d'abord une vraie première version de votre projet. Vous la voyez, vous la testez, et vous décidez ensuite, en toute confiance. Si elle ne vous plaît pas, vous ne nous devez rien.</p>
  </div>
  <div class="z" style="display:flex;gap:6mm;position:absolute;left:18mm;right:18mm;bottom:24mm">
    ${[['0 €', 'à payer avant d\'avoir vu votre projet'], ['72 h', 'pour recevoir une première version'], ['24 h', 'pour une réponse à votre demande'], ['100 %', 'sur mesure, rien n\'est un template']].map(([b, t]) => `<div style="flex:1;border:1px solid rgba(255,255,255,.15);border-radius:5mm;padding:6mm"><div class="grad" style="font:700 30pt 'Space Grotesk'">${b}</div><div style="color:rgba(255,255,255,.7);font-size:10pt;margin-top:1mm">${t}</div></div>`).join('')}
  </div>
  ${foot(2, true)}
</section>`);

/* 3. Méthode */
const steps = [['01', 'Vous nous parlez de votre projet', 'Un échange de 20 minutes, par message, téléphone ou visio. Pas de cahier des charges à rédiger.', '💬'],
  ['02', 'On réalise une première version', 'Maquette de site, prototype d\'app, pistes de logo ou visuels de pub : du concret sous 72 h.', '⚡'],
  ['03', 'Vous validez, ou pas', 'Ça vous plaît ? On continue ensemble. Sinon, vous ne nous devez rien.', '✓'],
  ['04', 'On lance et on vous accompagne', 'Mise en ligne, réglages, suivi des résultats et ajustements dans la durée.', '🚀']];
pages.push(`<section class="page">
  <div class="z"><p class="eyebrow">Notre méthode</p><h2>4 étapes, et la première version<br>est <span class="grad">offerte</span>.</h2></div>
  <div class="z" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6mm;margin-top:14mm">
    ${steps.map(([n, t, d, i], k) => `<div style="background:${k === 1 ? '#141318' : '#fff'};color:${k === 1 ? '#fff' : 'inherit'};border-radius:6mm;padding:7mm 6mm;min-height:96mm;box-shadow:0 18px 40px -26px rgba(20,19,24,.35);position:relative;transform:translateY(${k % 2 ? 8 : 0}mm)">
      ${k === 1 ? '<span style="position:absolute;top:-3mm;right:6mm;background:var(--grad);color:#141318;font:700 8pt Space Grotesk;letter-spacing:.12em;padding:1.2mm 3mm;border-radius:99px">OFFERT</span>' : ''}
      <div style="width:16mm;height:16mm;border-radius:5mm;background:var(--grad);display:grid;place-items:center;font-size:18pt">${i}</div>
      <div class="grad" style="font:700 30pt 'Space Grotesk';margin-top:6mm">${n}</div>
      <h3 style="font-size:14pt;margin:2mm 0 3mm">${t}</h3><p style="font-size:9.5pt;color:${k === 1 ? 'rgba(255,255,255,.7)' : 'var(--muted)'}">${d}</p></div>`).join('')}
  </div>
  ${foot(3)}
</section>`);

/* 4. Services */
const services = [['◍', 'Sites web', 'Vitrines, landing pages et e-commerce animés, rapides et optimisés pour Google.'], ['◳', 'Applications', 'Outils internes, dashboards, réservation, CRM : des apps sur mesure pour votre métier.'], ['◈', 'Logo & identité', 'Logo, charte graphique, cartes de visite, templates de documents et présentations.'], ['▶', 'Publicités digitales', 'Stories, posts sponsorisés, bannières et vidéos courtes qui donnent envie de cliquer.'], ['◎', 'Réseaux sociaux', 'Stratégie, création et gestion de vos comptes, avec un calendrier éditorial clair.'], ['⚙', 'Automatisations', 'Relances, newsletters et workflows qui vous font gagner des heures chaque semaine.']];
pages.push(`<section class="page">
  <div class="z"><p class="eyebrow">Ce que nous faisons</p><h2>Tout pour exister en ligne,<br><span class="grad">et convertir.</span></h2></div>
  <div class="z" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;margin-top:12mm">
    ${services.map(([i, t, d]) => `<div style="background:#fff;border:1px solid #e6e5ea;border-radius:6mm;padding:7mm"><div style="width:14mm;height:14mm;border-radius:4mm;background:var(--grad);color:#fff;display:grid;place-items:center;font-size:15pt">${i}</div><h3 style="font-size:15pt;margin:4mm 0 2mm">${t}</h3><p style="font-size:9.5pt;color:var(--muted)">${d}</p></div>`).join('')}
  </div>
  ${foot(4)}
</section>`);

/* 5-6. Sites */
pages.push(`<section class="page">
  <div class="z" style="width:92mm"><p class="eyebrow">Sites web</p><h2 style="font-size:28pt">Des sites qui bougent, qui zooment et qui convertissent.</h2>
    <p class="lead" style="font-size:10.5pt">Titres révélés mot par mot, images qui zooment au scroll, effets de profondeur, galeries horizontales, compteurs animés… Chaque site est pensé pour retenir l'attention.</p>
    <div class="chips"><span>Zoom au scroll</span><span>Parallax</span><span>Défilement horizontal</span><span>Mobile first</span><span>SEO</span></div></div>
  ${note(S('site-lumen-full.jpg'), 'Lumen, brasserie', 'site vitrine', 'width:76mm;left:116mm;top:14mm;--r:-3deg', '', '158mm')}
  ${note(S('site-verdi-full.jpg'), 'Verdi Architectes', 'portfolio', 'width:76mm;left:200mm;top:20mm;--r:2.5deg', '', '158mm')}
  <span class="tag" style="left:60mm;top:150mm;--r:-5deg">la page entière,<br>de haut en bas ↓</span>
  ${foot(5)}
</section>`);
pages.push(`<section class="page">
  ${note(S('site-velora.jpg'), 'Velora, soins naturels', 'e-commerce', 'width:120mm;left:16mm;top:18mm;--r:-2.5deg')}
  ${note(S('site-kinetik.jpg'), 'Kinetik, club de training', 'site + app', 'width:120mm;left:24mm;top:104mm;--r:2deg', 'pin')}
  <div class="z" style="position:absolute;left:158mm;top:16mm;width:122mm"><p class="eyebrow">Sites web · version mobile</p><h2 style="font-size:24pt">Parfaits sur ordinateur.<br><span class="grad">Et dans la poche.</span></h2></div>
  <div class="z" style="position:absolute;left:156mm;top:62mm;display:flex;gap:5mm">
    ${['lumen', 'velora', 'kinetik', 'verdi'].map((s, k) => `<div style="width:28mm;height:60.6mm;border-radius:5mm;border:1.6mm solid #1d1c22;overflow:hidden;box-shadow:0 18px 30px -16px rgba(20,19,24,.6);transform:rotate(${[-6, -2, 2, 6][k]}deg) translateY(${[6, 0, 0, 6][k]}mm)"><img src="${S('mobile-' + s + '.jpg')}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div>`).join('')}
  </div>
  <p class="z" style="position:absolute;left:158mm;top:142mm;width:120mm;font-size:10pt;color:var(--muted)">Chaque exemple est en ligne et animé : ouvrez-les sur notre site, rubrique « Sites web », pour voir les effets de zoom, de parallax et de défilement.</p>
  ${foot(6)}
</section>`);

/* 7-8. Apps */
const app = (f, t, s, d, tags, style, cls) => `<figure class="note ${cls || ''}" style="${style}"><img src="${S(f)}"><figcaption class="cap">${t}<small>${s}</small></figcaption><p style="font-size:8pt;color:var(--muted);margin-top:1mm">${d}</p><div class="chips" style="margin-top:1.6mm">${tags}</div></figure>`;
pages.push(`<section class="page dark">
  <div class="z" style="width:150mm"><p class="eyebrow">Applications sur mesure</p><h2 style="font-size:28pt">Des outils que vos équipes<br>ont <span class="grad">envie d'utiliser</span>.</h2></div>
  ${app('app-ergomap.jpg', 'ErgoMap', 'santé au travail', 'Plan d\'usine interactif, zoom par atelier, zones de douleur et dashboard des risques.', '<span>Industrie</span><span>Cartographie</span>', 'width:96mm;left:14mm;top:62mm;--r:-3deg')}
  ${app('app-pilote.jpg', 'Pilote', 'gestion de projets', 'Météo projet, Gantt, matrice des risques, suivi hebdo, export PowerPoint.', '<span>PMO</span><span>Reporting</span>', 'width:96mm;left:100mm;top:80mm;--r:2deg', 'pin')}
  ${app('app-kaizen.jpg', 'Kaizen Hub', 'amélioration continue', 'Idées, photos avant / après, audits 5S en radar, achats vs budget.', '<span>Lean</span><span>5S</span>', 'width:96mm;left:186mm;top:60mm;--r:-1.5deg')}
  ${foot(7, true)}
</section>`);
pages.push(`<section class="page dark">
  <div class="z" style="width:180mm"><p class="eyebrow">Applications · nouveautés</p><h2 style="font-size:28pt">Réservation, e-commerce, CRM :<br><span class="grad">on s'adapte à votre métier.</span></h2></div>
  ${app('app-reserva.jpg', 'Réserva', 'prise de rendez-vous', 'Agenda d\'équipe, réservation en ligne 24 h/24, rappels SMS automatiques.', '<span class="n">Nouveau</span><span>Instituts</span>', 'width:96mm;left:14mm;top:72mm;--r:2deg', 'pin')}
  ${app('app-stockly.jpg', 'Stockly', 'ventes & stocks', 'Ventes en direct, meilleures ventes et réassort automatique.', '<span class="n">Nouveau</span><span>E-commerce</span>', 'width:96mm;left:100mm;top:60mm;--r:-2.5deg')}
  ${app('app-closr.jpg', 'Closr', 'CRM commercial', 'Pipeline en glisser-déposer, relances automatiques, entonnoir.', '<span class="n">Nouveau</span><span>Ventes</span>', 'width:96mm;left:186mm;top:76mm;--r:1.5deg')}
  ${foot(8, true)}
</section>`);

/* 9. Logos */
pages.push(`<section class="page">
  <div class="z" style="position:absolute;left:18mm;top:16mm;width:70mm"><p class="eyebrow">Logos & identité</p><h2 style="font-size:28pt">Des marques qui ont du caractère.</h2>
    <p class="lead" style="font-size:10.5pt">Restauration, architecture, cosmétique, sport, beauté, décoration : chaque logo raconte une histoire et se décline sur tous vos supports.</p>
    <p class="lead" style="font-size:10.5pt">Sur le site, chaque logo se dessine au trait sous vos yeux.</p></div>
  <img src="${url(path.join(TMP, 'logos.png'))}" class="z" style="position:absolute;left:96mm;top:34mm;width:186mm">
  ${foot(9)}
</section>`);

/* 10. Pubs */
pages.push(`<section class="page">
  <div class="z"><p class="eyebrow">Publicités digitales</p><h2>Des pubs qui <span class="grad">arrêtent le pouce</span>.</h2>
    <p class="lead">Stories, posts sponsorisés, bannières : des formats animés pour Instagram, Facebook, TikTok et le web.</p></div>
  <img src="${url(path.join(TMP, 'ads.png'))}" class="z" style="position:absolute;left:18mm;right:18mm;bottom:18mm;width:261mm">
  ${foot(10)}
</section>`);

/* 11. Pourquoi nous */
const rows = [['Vous payez avant de voir le résultat', 'Vous voyez une première version avant tout paiement'], ['Des semaines avant une première maquette', 'Du concret sous 72 h'], ['Des modèles génériques', '100 % sur mesure, pensé pour votre activité'], ['Un interlocuteur différent à chaque étape', 'Une seule équipe, de l\'idée au lancement'], ['Livraison puis plus de nouvelles', 'Suivi, ajustements et accompagnement']];
pages.push(`<section class="page">
  <div class="z"><p class="eyebrow">Pourquoi AS Marketing Agency</p><h2>La confiance, <span class="grad">ça se montre</span>.</h2></div>
  <div class="z" style="display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:10mm">
    <div style="background:#fff;border:1px solid #e6e5ea;border-radius:6mm;padding:7mm"><h3 style="font-size:13pt;color:var(--muted);margin-bottom:4mm">Le parcours habituel</h3>${rows.map(r => `<p style="padding:2.6mm 0;border-bottom:1px solid #eee;color:var(--muted);font-size:10.5pt">✕&nbsp;&nbsp;${r[0]}</p>`).join('')}</div>
    <div style="background:#141318;color:#fff;border-radius:6mm;padding:7mm;position:relative;overflow:hidden"><span style="position:absolute;inset:0 0 auto;height:1.6mm;background:var(--grad)"></span><h3 style="font-size:13pt;margin-bottom:4mm" class="grad">Avec AS Marketing Agency</h3>${rows.map(r => `<p style="padding:2.6mm 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:10.5pt"><b style="color:#1fc6b6">✓</b>&nbsp;&nbsp;${r[1]}</p>`).join('')}</div>
  </div>
  ${foot(11)}
</section>`);

/* 12. Contact */
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
  ${foot(12, true)}
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
  await p.setViewportSize({ width: 1440, height: 900 });
  for (const dark of [false, true]) {
    await p.setViewportSize({ width: 1123, height: 794 });
    await p.setContent(BG(dark));
    await p.screenshot({ path: path.join(TMP, dark ? 'bg-dark.jpg' : 'bg-light.jpg'), type: 'jpeg', quality: 80 });
  }
  await p.close();

  const htmlPath = path.join(TMP, '06-presentation.html');
  fs.writeFileSync(htmlPath, html.replace('BG_LIGHT', url(path.join(TMP, 'bg-light.jpg'))).replace('BG_DARK', url(path.join(TMP, 'bg-dark.jpg'))));
  const page = await browser.newPage();
  await page.goto(url(htmlPath));
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(OUT, '06-presentation.pdf'), width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('✓ templates/06-presentation.pdf');
})();
