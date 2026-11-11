// Visuels pour les réseaux sociaux : posts 1080 × 1350 et stories 1080 × 1920, composés à partir des vraies captures.
// Usage : node templates/social.cjs   → templates/social/*.jpg
const { execFileSync } = require('child_process');
const L = require('./lib.cjs');
const { path, fs, img, shot, iphone, win, SITES, LOGOS } = L;

const OUT = path.join(__dirname, 'social');
fs.mkdirSync(OUT, { recursive: true });
const TMP = L.tmpDir('social');
const LOGO = img('logo-mark-light.webp');

const CSS = L.IPHONE_CSS + `
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0f;--mute:#b4b3c4;--aqua:#1fc6b6;--blue:#8fb0f0;--pink:#eaa6e6;--ink:#121117;--grad:linear-gradient(100deg,#1fc6b6,#8fb0f0 52%,#eaa6e6);--sans:"Inter Tight",Arial,sans-serif;--serif:"Instrument Serif",Georgia,serif}
body{background:#333;font-family:var(--sans);color:#fff;-webkit-font-smoothing:antialiased}
.v{position:relative;width:1080px;height:1350px;overflow:hidden;background:var(--bg);margin-bottom:40px}
.v.story{height:1920px}
.pad{position:absolute;left:80px;right:80px}
.h{font:600 104px/.95 var(--sans);letter-spacing:-.045em;word-spacing:.05em}
.h em,.em{font-family:var(--serif);font-style:italic;font-weight:400;letter-spacing:-.02em;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.1em}
.h em{font-size:1.06em}
.eyebrow{display:flex;align-items:center;gap:18px;margin-bottom:34px;font:600 25px/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--aqua)}
.eyebrow::before{content:"";width:54px;height:3px;background:var(--aqua)}
.sub{margin-top:30px;font-size:38px;line-height:1.3;color:var(--mute);letter-spacing:-.01em}
.glow{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none}
.brand{position:absolute;left:80px;right:80px;bottom:64px;z-index:9;display:flex;justify-content:space-between;align-items:center}
.brand img{height:76px}
.brand span{padding:20px 34px;border-radius:99px;background:#fff;color:var(--ink);font:600 30px/1 var(--sans);letter-spacing:-.02em}
.story .brand{bottom:170px}
.pill{display:inline-flex;align-items:center;gap:14px;padding:20px 32px;border-radius:99px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.28);font:500 32px/1 var(--sans);background:rgba(10,10,15,.5)}
.pill--ok::before{content:"✓";color:var(--aqua);font-weight:700}
.win{position:absolute;border-radius:22px;overflow:hidden;background:#1c1c27;box-shadow:0 0 0 2px rgba(255,255,255,.14),0 70px 120px -40px #000}
.win__bar{display:flex;align-items:center;gap:10px;height:44px;padding:0 20px}
.win__bar i{width:13px;height:13px;border-radius:50%;background:#ff5f57}.win__bar i:nth-child(2){background:#febc2e}.win__bar i:nth-child(3){background:#28c840}
.win__bar span{display:none}
.win__img{aspect-ratio:16/9;background:#fff;overflow:hidden}
.win__img img{display:block;width:100%;height:100%;object-fit:cover;object-position:0 0}
.iphone{position:absolute}
.tag{position:absolute;z-index:5;padding:14px 24px;border-radius:99px;font:700 24px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase}
.bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.veil{position:absolute;inset:0}
.center{text-align:center}

/* méthode */
.rows{display:grid;gap:20px}
.row{display:grid;grid-template-columns:92px 1fr;gap:34px;align-items:center;padding:28px 36px;border-radius:34px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 2px rgba(255,255,255,.09)}
.row i{display:grid;place-items:center;width:92px;height:92px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.3);font:600 40px/1 var(--sans);font-style:normal}
.row b{display:block;font:600 45px/1.05 var(--sans);letter-spacing:-.035em}
.row span{display:block;margin-top:10px;font-size:31px;color:var(--mute)}
.row.on{background:var(--grad);color:var(--ink);box-shadow:none}
.row.on i{background:var(--ink);color:#fff;box-shadow:none}.row.on span{color:#2c2a36}
.row small{display:inline-block;margin-left:14px;padding:8px 16px;border-radius:99px;background:var(--ink);color:#fff;font:700 20px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;vertical-align:middle}
/* métiers */
.cloud{display:flex;flex-wrap:wrap;gap:18px}
.cloud span{padding:26px 40px;border-radius:99px;font:600 44px/1 var(--sans);letter-spacing:-.03em;box-shadow:inset 0 0 0 2px rgba(255,255,255,.2)}
.cloud span.a{background:var(--aqua);color:var(--ink);box-shadow:none}.cloud span.b{background:var(--blue);color:var(--ink);box-shadow:none}.cloud span.c{background:var(--pink);color:var(--ink);box-shadow:none}.cloud span.w{background:#fff;color:var(--ink);box-shadow:none}
/* logos */
.paper{background:#f4f1ea;color:var(--ink)}
.paper .eyebrow{color:#0e9c8f}.paper .eyebrow::before{background:#0e9c8f}
.lgs{position:absolute;left:80px;right:80px;display:grid;grid-template-columns:1fr 1fr;gap:22px}
.lgs div{display:grid;place-items:center;height:180px;border-radius:30px}
.lgs img{max-width:60%;max-height:44%}
.paper .brand span{background:var(--ink);color:#fff}
/* bandes */
.strips{position:absolute;left:-60px;top:-240px;display:flex;gap:30px;transform:rotate(9deg)}
.strip{width:290px;border-radius:20px;overflow:hidden;box-shadow:0 0 0 2px rgba(255,255,255,.12),0 60px 100px -30px #000}
.strip img{display:block;width:100%}
.strip:nth-child(2){margin-top:-150px}.strip:nth-child(3){margin-top:90px}.strip:nth-child(4){margin-top:-60px}
.num{font:600 420px/.8 var(--sans);letter-spacing:-.07em;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.05em}
`;

const brand = (t = 'asagency.store', logo = LOGO) => `<div class="brand"><img src="${logo}"><span>${t}</span></div>`;
const FADE = '<div class="veil" style="background:linear-gradient(0deg,#0a0a0f 6%,rgba(10,10,15,0) 26%);z-index:6"></div>';
const V = (name, body, cls = '') => `<section class="v ${cls}" data-name="${name}">${body}</section>`;

(async () => {
  const browser = await L.chromium.launch();
  const hide = '.hero__title,.hero__cue,.hero__veil{display:none!important}';
  const P = await L.pieces(browser, TMP, [
    { name: 'wall', w: 1500, h: 1061, css: hide, scale: 2 },
    { name: 'before', w: 1440, h: 900, sel: '#compare', scale: 1.5, css: '.compare__before{clip-path:none!important}.compare__tag,.compare__handle{display:none!important}#compare{border-radius:0!important;box-shadow:none!important}' },
  ]);
  const A = (f) => shot(f + '.webp');
  const v = [];

  /* ---------- posts ---------- */
  v.push(V('post-01-on-le-fait', `<img class="bgimg" src="${P.wall}">
    <div class="veil" style="background:radial-gradient(ellipse 78% 46% at 50% 50%,rgba(8,8,12,.95),rgba(8,8,12,.7) 60%,rgba(8,8,12,.2)),linear-gradient(0deg,rgba(8,8,12,.9),transparent 26%)"></div>
    <div class="pad center" style="top:440px"><h1 class="h" style="font-size:150px;line-height:.9">On le fait.<br><em>Vous l’aimez.</em></h1><p style="margin-top:34px;font:500 58px/1 var(--sans);letter-spacing:-.035em;color:#d6d5e2">Ensuite, on parle.</p></div>
    ${brand()}`));

  v.push(V('post-02-applications', `<i class="glow" style="width:900px;height:900px;right:-300px;top:380px;background:#8fb0f0;opacity:.42"></i>
    <div class="pad" style="top:96px"><p class="eyebrow">Applications sur mesure</p><h1 class="h">Vos fichiers Excel ont fait <em>leur temps.</em></h1></div>
    <div style="position:absolute;left:150px;top:560px;width:1300px;height:800px;perspective:1700px">
      ${win(A('app-projets-dash'), 'left:0;top:0;width:1300px;transform:rotateY(-19deg) rotateX(7deg) rotateZ(1.5deg);transform-origin:0 50%;box-shadow:0 0 0 2px rgba(255,255,255,.16),-60px 90px 140px -40px #000,0 0 200px -40px rgba(31,198,182,.55)')}
      ${win(A('app-projets-gantt'), 'left:-90px;top:400px;width:520px;transform:rotate(-6deg)')}
    </div>
    ${FADE}${brand()}`));

  v.push(V('post-03-avant-apres', `<i class="glow" style="width:800px;height:800px;right:-260px;bottom:-200px;background:#1fc6b6;opacity:.4"></i>
    <div class="pad" style="top:96px"><p class="eyebrow">Avant, après</p><h1 class="h" style="font-size:98px">Le même travail. <em>Sans la galère.</em></h1></div>
    ${win(P.before, 'left:-50px;top:440px;width:800px;transform:rotate(-5deg);filter:saturate(.75) brightness(.88)')}
    <span class="tag" style="left:60px;top:432px;background:#ff5f57;color:#fff;transform:rotate(-5deg)">Avant</span>
    ${win(A('app-projets-dash'), 'left:230px;top:720px;width:900px;transform:rotate(3deg);box-shadow:0 0 0 2px rgba(255,255,255,.2),0 70px 120px -30px #000,0 0 160px -30px rgba(31,198,182,.6)')}
    <span class="tag" style="right:-6px;top:716px;background:var(--grad);color:var(--ink);transform:rotate(3deg)">Après</span>
    ${FADE}${brand()}`));

  v.push(V('post-04-72-heures', `<i class="glow" style="width:900px;height:900px;left:90px;top:120px;background:#8fb0f0;opacity:.3"></i>
    ${win(A('app-stockly'), 'left:-170px;top:70px;width:520px;transform:rotate(-9deg)')}
    ${iphone('brume', 'right:-70px;top:-20px;width:230px;transform:rotate(11deg)')}
    ${win(A('site-solstice'), 'right:-190px;top:880px;width:520px;transform:rotate(-7deg)')}
    <div style="position:absolute;left:-30px;top:930px;width:360px;height:190px;border-radius:30px;background:#ffe9a8;display:grid;place-items:center;transform:rotate(7deg);box-shadow:0 60px 100px -30px #000"><img src="${img('logos/brume.svg')}" style="width:60%"></div>
    <div class="pad center" style="top:330px"><p class="num">72 h</p><h1 class="h" style="margin-top:46px;font-size:88px">pour voir votre projet.<br><em>Sans rien payer.</em></h1></div>
    ${brand()}`));

  v.push(V('post-05-sites-mobiles', `<i class="glow" style="width:900px;height:800px;left:90px;top:520px;background:#eaa6e6;opacity:.34"></i>
    <div class="pad" style="top:96px"><p class="eyebrow">Sites web</p><h1 class="h">Des sites qui donnent <em>envie de rester.</em></h1></div>
    ${iphone('solstice', 'left:70px;top:610px;width:330px;transform:rotate(-10deg)')}
    ${iphone('souffle', 'right:70px;top:610px;width:330px;transform:rotate(10deg)')}
    ${iphone('brume', 'left:345px;top:490px;width:390px;z-index:3')}
    <div class="veil" style="background:linear-gradient(0deg,#0a0a0f 4%,rgba(10,10,15,0) 24%);z-index:4"></div>
    ${brand()}`));

  v.push(V('post-06-du-premier-ecran-au-dernier', `<div class="strips">${SITES.map((s) => `<div class="strip"><img src="${A(`site-${s.s}-full`)}"></div>`).join('')}</div>
    <div class="veil" style="background:linear-gradient(0deg,#0a0a0f 22%,rgba(10,10,15,.82) 40%,rgba(10,10,15,0) 66%)"></div>
    <div class="pad" style="bottom:210px"><h1 class="h" style="font-size:112px">Fluides. Animés.<br><em>Pensés pour le mobile.</em></h1></div>
    ${brand()}`));

  v.push(V('post-07-logos', `<div class="pad" style="top:96px"><p class="eyebrow">Logos &amp; identité</p><h1 class="h" style="font-size:98px">Des logos qu’on <em>reconnaît de loin.</em></h1></div>
    <div class="lgs" style="top:400px">${LOGOS.map((l) => `<div style="background:${l.bg}"><img src="${img(`logos/${l.slug}.svg`)}"></div>`).join('')}</div>
    ${brand('asagency.store', img('logo-mark.webp'))}`, 'paper'));

  v.push(V('post-08-methode', `<i class="glow" style="width:800px;height:800px;left:-300px;top:-300px;background:#1fc6b6;opacity:.34"></i>
    <div class="pad" style="top:96px"><p class="eyebrow">La méthode</p><h1 class="h" style="font-size:98px">On le fait d’abord. <em>Vous payez ensuite.</em></h1></div>
    <div class="pad rows" style="top:424px">
      <div class="row"><i>1</i><div><b>Vous nous racontez</b><span>Vingt minutes, sans cahier des charges.</span></div></div>
      <div class="row on"><i>2</i><div><b>On réalise une première version<small>Offert</small></b><span>Du concret sous 72 h, sans rien payer.</span></div></div>
      <div class="row"><i>3</i><div><b>Vous décidez</b><span>Ça ne vous plaît pas ? Vous ne devez rien.</span></div></div>
      <div class="row"><i>4</i><div><b>On lance ensemble</b><span>Mise en ligne, formation et suivi.</span></div></div>
    </div>
    ${brand()}`));

  v.push(V('post-09-metiers', `<i class="glow" style="width:900px;height:700px;right:-300px;bottom:-100px;background:#eaa6e6;opacity:.34"></i>
    <div class="pad" style="top:96px"><p class="eyebrow">Et chez vous ?</p><h1 class="h">Une application pour <em>chaque métier.</em></h1></div>
    <div class="pad cloud" style="top:410px"><span class="a">Artisans &amp; BTP</span><span>Commerces</span><span class="w">Restauration</span><span class="b">Industrie</span><span>Santé &amp; bien-être</span><span class="c">Services</span></div>
    <div style="position:absolute;left:90px;top:800px;width:1200px;perspective:1700px">${win(A('app-reserva'), 'position:relative;width:1200px;transform:rotateX(16deg) rotateZ(-3deg);transform-origin:50% 0;box-shadow:0 0 0 2px rgba(255,255,255,.16),0 0 200px -40px rgba(143,176,240,.7)')}</div>
    <div class="veil" style="background:linear-gradient(0deg,#0a0a0f 8%,rgba(10,10,15,0) 30%)"></div>
    ${brand()}`));

  v.push(V('post-10-votre-projet', `<i class="glow" style="width:1100px;height:1000px;left:-200px;bottom:-500px;background:#1fc6b6;opacity:.5"></i>
    <i class="glow" style="width:800px;height:800px;right:-300px;top:-300px;background:#8fb0f0;opacity:.42"></i>
    <div class="pad" style="top:270px"><p class="eyebrow">Votre projet</p><h1 class="h" style="font-size:150px;line-height:.92">Décrivez-le.<br><em>On vous le montre.</em></h1>
      <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:70px"><span class="pill pill--ok">Sans engagement</span><span class="pill pill--ok">Réponse sous 24 h</span><span class="pill pill--ok">Aucun paiement avant validation</span></div></div>
    ${brand()}`));

  /* ---------- stories ---------- */
  v.push(V('story-01-on-le-fait', `<img class="bgimg" src="${P.wall}">
    <div class="veil" style="background:radial-gradient(ellipse 90% 34% at 50% 48%,rgba(8,8,12,.94),rgba(8,8,12,.6) 62%,rgba(8,8,12,.14)),linear-gradient(0deg,rgba(8,8,12,.92),transparent 26%,transparent 80%,rgba(8,8,12,.8))"></div>
    <div class="pad center" style="top:700px"><h1 class="h" style="font-size:158px;line-height:.9">On le fait.<br><em>Vous l’aimez.</em></h1><p style="margin-top:36px;font:500 60px/1 var(--sans);letter-spacing:-.035em;color:#d6d5e2">Ensuite, on parle.</p></div>
    ${brand()}`, 'story'));

  v.push(V('story-02-applications', `<i class="glow" style="width:1000px;height:1000px;right:-360px;top:640px;background:#8fb0f0;opacity:.42"></i>
    <div class="pad" style="top:270px"><p class="eyebrow">Applications sur mesure</p><h1 class="h" style="font-size:112px">Vos fichiers Excel ont fait <em>leur temps.</em></h1></div>
    <div style="position:absolute;left:130px;top:860px;width:1400px;height:900px;perspective:1700px">
      ${win(A('app-projets-dash'), 'left:0;top:0;width:1400px;transform:rotateY(-20deg) rotateX(7deg) rotateZ(1.5deg);transform-origin:0 50%;box-shadow:0 0 0 2px rgba(255,255,255,.16),-60px 90px 140px -40px #000,0 0 200px -40px rgba(31,198,182,.55)')}
      ${win(A('app-closr'), 'left:-70px;top:470px;width:560px;transform:rotate(-6deg)')}
    </div>
    <div class="veil" style="background:linear-gradient(0deg,#0a0a0f 9%,rgba(10,10,15,0) 26%)"></div>
    ${brand('Première version offerte')}`, 'story'));

  v.push(V('story-03-sites', `<i class="glow" style="width:1000px;height:900px;left:40px;top:760px;background:#eaa6e6;opacity:.36"></i>
    <div class="pad" style="top:270px"><p class="eyebrow">Sites web</p><h1 class="h" style="font-size:112px">Des sites qui donnent <em>envie de rester.</em></h1></div>
    ${iphone('orbe', 'left:40px;top:900px;width:360px;transform:rotate(-11deg)')}
    ${iphone('solstice', 'right:40px;top:900px;width:360px;transform:rotate(11deg)')}
    ${iphone('souffle', 'left:310px;top:760px;width:460px;z-index:3')}
    <div class="veil" style="background:linear-gradient(0deg,#0a0a0f 9%,rgba(10,10,15,0) 24%);z-index:4"></div>
    ${brand()}`, 'story'));

  v.push(V('story-04-premiere-version', `<i class="glow" style="width:1000px;height:1000px;left:40px;top:330px;background:#1fc6b6;opacity:.3"></i>
    ${win(A('app-amelio-dash'), 'left:-200px;top:1180px;width:640px;transform:rotate(-8deg)')}
    ${win(A('site-orbe'), 'right:-210px;top:1240px;width:640px;transform:rotate(7deg)')}
    ${iphone('brume', 'left:405px;top:1150px;width:270px;z-index:3')}
    <div class="pad center" style="top:300px"><p class="eyebrow" style="justify-content:center">Votre première version</p><p class="num" style="font-size:440px">72 h</p><h1 class="h" style="margin-top:50px;font-size:96px">pour voir votre projet.<br><em>Sans rien payer.</em></h1></div>
    <div class="veil" style="background:linear-gradient(0deg,#0a0a0f 9%,rgba(10,10,15,0) 22%);z-index:4"></div>
    ${brand()}`, 'story'));

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><link href="${L.FONTS}" rel="stylesheet"><style>${CSS}</style></head><body>${v.join('\n')}</body></html>`;
  const files = await L.raster(browser, TMP, html, { sel: '.v', w: 1080, h: 1920, scale: 2, type: 'png' });
  await browser.close();
  // rendu en double résolution puis réduction : contours nets à 1080 px de large
  execFileSync('python3', ['-c', `
import sys, json, os
from PIL import Image
for src in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGB')
    im = im.resize((1080, round(im.size[1] * 1080 / im.size[0])), Image.LANCZOS)
    im.save(os.path.join(sys.argv[2], os.path.basename(src)[:-4] + '.jpg'), 'JPEG', quality=92, optimize=True)
`, JSON.stringify(files), OUT]);
  console.log('✓', files.length, 'visuels dans', path.relative(L.ROOT, OUT));
})();
