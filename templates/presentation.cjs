// Brochure AS Marketing Agency (PDF A4 paysage, sans aucun prix).
// Usage : node outils/captures.cjs && node templates/presentation.cjs
// Chaque page est rendue en image puis assemblée : le PDF s'affiche à l'identique partout.
const L = require('./lib.cjs');
const { path, img, shot, iphone, win, APPS, SITES, LOGOS } = L;

const OUT = path.join(__dirname, 'presentation.pdf');
const FG = { solstice: '#fff4e6', brume: '#24190a', orbe: '#fff', souffle: '#3b2a20', lenoir: '#f3e7d0', pepin: '#2a1a12', varenne: '#f4ecd8', nordik: '#10203f' };
const JOBS = [
  ['Artisans & BTP', ['Devis & chantiers', 'Planning des équipes', 'Suivi des achats']],
  ['Commerces', ['Caisse & stock', 'Fidélité clients', 'Tableau des ventes']],
  ['Restauration', ['Réservations', 'Commandes fournisseurs', 'Hygiène & relevés']],
  ['Industrie', ['Pilotage de projets', 'Cartographie des ateliers', 'Amélioration continue']],
  ['Santé & bien-être', ['Prise de rendez-vous', 'Rappels automatiques', 'Fiches clients']],
  ['Services', ['CRM commercial', 'Devis & facturation', 'Suivi du temps']],
];

const CSS = L.IPHONE_CSS + `
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0a0f;--bg2:#12121a;--text:#f4f3f8;--mute:#a3a2b4;--line:rgba(255,255,255,.1);--aqua:#1fc6b6;--blue:#8fb0f0;--pink:#eaa6e6;--ink:#121117;--paper:#f4f1ea;
  --grad:linear-gradient(100deg,#1fc6b6,#8fb0f0 52%,#eaa6e6);--sans:"Inter Tight",Arial,sans-serif;--serif:"Instrument Serif",Georgia,serif}
body{background:#000;font-family:var(--sans);color:var(--text);-webkit-font-smoothing:antialiased}
.page{position:relative;width:297mm;height:210mm;overflow:hidden;background:var(--bg);padding:17mm 20mm}
.glow{position:absolute;border-radius:50%;filter:blur(26mm);opacity:.5;pointer-events:none}
.eyebrow{display:flex;align-items:center;gap:3mm;font:600 8.2pt/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--aqua);margin-bottom:6mm}
.eyebrow::before{content:"";width:8mm;height:.5mm;background:var(--aqua)}
h1,h2{font-weight:600;letter-spacing:-.035em;word-spacing:.05em;line-height:.98}
h2{font-size:38pt}
h1 em,h2 em,.em{font-family:var(--serif);font-style:italic;font-weight:400;letter-spacing:-.015em;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.08em}
.lead{margin-top:6mm;color:var(--mute);font-size:13pt;line-height:1.45;max-width:105mm}
.foot{position:absolute;left:20mm;right:20mm;bottom:8mm;display:flex;justify-content:space-between;align-items:center;font:500 7.6pt/1 var(--sans);letter-spacing:.04em;color:#77768a}
.foot img{height:6.5mm}
.paper .foot{color:#8b8792}
.z{position:relative;z-index:2}
.pill{display:inline-flex;align-items:center;gap:2mm;padding:2.6mm 4.4mm;border-radius:99px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);font:500 10pt/1 var(--sans)}
.pill--ok::before{content:"✓";color:var(--aqua);font-weight:700}
/* fenêtre de navigateur */
.win{border-radius:3mm;overflow:hidden;background:#1c1c27;box-shadow:0 0 0 1px rgba(255,255,255,.12),0 20mm 34mm -16mm #000}
.win__bar{display:flex;align-items:center;gap:1.5mm;height:6mm;padding:0 3mm}
.win__bar i{width:2mm;height:2mm;border-radius:50%;background:#ff5f57}.win__bar i:nth-child(2){background:#febc2e}.win__bar i:nth-child(3){background:#28c840}
.win__bar span{margin:0 auto;padding:1.1mm 9mm 1.1mm 3mm;border-radius:1.4mm;background:rgba(255,255,255,.07);font:500 6pt/1 var(--sans);color:#8d8c9d;transform:translateX(-5mm)}
.win__img{aspect-ratio:16/9;overflow:hidden;background:#fff}
.win__img img{display:block;width:100%;height:100%;object-fit:cover;object-position:0 0}
.win--site .win__img{aspect-ratio:16/10}
.iphone{position:absolute}

/* 1. couverture */
.cover{padding:0}
.cover__wall{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cover__veil{position:absolute;inset:0;background:linear-gradient(90deg,#08080c 0%,#08080c 30%,rgba(8,8,12,.93) 44%,rgba(8,8,12,.5) 64%,rgba(8,8,12,.05) 100%),linear-gradient(0deg,rgba(8,8,12,.85),transparent 34%)}
.cover__in{position:absolute;inset:0;padding:18mm 22mm;display:flex;flex-direction:column;justify-content:space-between}
.cover__logo{height:17mm;width:auto;align-self:flex-start}
.cover h1{font-size:72pt;line-height:.92;letter-spacing:-.045em}
.cover h1 span{display:block}
.cover h1 .t3{font-size:.5em;letter-spacing:-.03em;color:#c9c8d6;margin-top:5mm;font-weight:500}
.cover__bot{display:flex;justify-content:space-between;align-items:flex-end}
.cover__bot ul{display:flex;gap:2.5mm;list-style:none}
.cover__bot b{padding:2.8mm 5mm;border-radius:99px;background:#fff;color:var(--ink);font:600 11pt/1 var(--sans);letter-spacing:-.01em}

/* 2. principe */
.princ{display:grid;grid-template-columns:118mm 1fr;gap:16mm}
.princ h2{font-size:44pt}
.stepsv{position:relative;display:grid;gap:4mm}
.stepsv::before{content:"";position:absolute;left:5.5mm;top:8mm;bottom:8mm;width:.5mm;background:linear-gradient(var(--aqua),var(--blue),var(--pink))}
.stepv{position:relative;display:grid;grid-template-columns:11mm 1fr;gap:6mm;align-items:center;padding:5mm 7mm 5mm 0}
.stepv i{display:grid;place-items:center;width:11mm;height:11mm;border-radius:50%;background:var(--bg);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);font:600 10pt/1 var(--sans);font-style:normal}
.stepv h3{font:600 15pt/1.1 var(--sans);letter-spacing:-.025em}
.stepv p{margin-top:1.4mm;color:var(--mute);font-size:10.5pt}
.stepv.free{border-radius:5mm;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px var(--line);padding-left:0}
.stepv.free i{background:var(--grad);color:var(--ink);box-shadow:none}
.stepv .badge{display:inline-block;margin-left:2.5mm;padding:1mm 2.4mm;border-radius:99px;background:rgba(31,198,182,.16);color:var(--aqua);font:600 7pt/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;vertical-align:middle}
.nums{position:absolute;left:20mm;right:20mm;bottom:22mm;display:grid;grid-template-columns:repeat(4,1fr);gap:8mm;padding-top:8mm;border-top:1px solid var(--line)}
.nums b{display:block;font:600 34pt/1 var(--sans);letter-spacing:-.045em;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.nums span{display:block;margin-top:2mm;color:var(--mute);font-size:9.5pt}

/* 3. applications */
.stage{position:absolute;right:-74mm;top:24mm;width:236mm;perspective:420mm}
.stage .win{transform:rotateY(-17deg) rotateX(5deg) rotateZ(1deg);transform-origin:0 50%;box-shadow:0 0 0 1px rgba(255,255,255,.14),-14mm 24mm 40mm -14mm #000,0 0 60mm -10mm rgba(31,198,182,.4)}
.stage .pipw{position:absolute;left:-20mm;bottom:-20mm;width:92mm;transform:rotate(-5deg);box-shadow:0 0 0 1px rgba(255,255,255,.18),0 14mm 24mm -8mm #000}
.intro{width:102mm}.intro .lead{max-width:84mm}
.intro h2{font-size:42pt}
.intro ul{display:grid;gap:2.4mm;margin-top:9mm;list-style:none;justify-items:start}

/* 4. avant / après */
.center{text-align:center}.center .eyebrow{justify-content:center}
.cmp{display:block;width:206mm;margin:7mm auto 0;border-radius:4mm;box-shadow:0 0 0 1px rgba(255,255,255,.12),0 18mm 34mm -16mm #000,0 0 70mm -20mm rgba(143,176,240,.5)}
.cmpcap{display:grid;grid-template-columns:1fr 1fr;gap:10mm;width:206mm;margin:6mm auto 0;font-size:10.5pt;color:var(--mute)}
.cmpcap b{display:block;font:600 12pt/1.2 var(--sans);color:#fff;letter-spacing:-.02em;margin-bottom:1mm}
.cmpcap div:last-child{text-align:right}

/* 5. six applications */
.apps6{display:grid;grid-template-columns:repeat(3,1fr);gap:7mm 7mm;margin-top:9mm}
.app .win{box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.app .win__bar{height:4.4mm}.app .win__bar i{width:1.5mm;height:1.5mm}.app .win__bar span{display:none}
.app .win__img{aspect-ratio:16/8.1}
.app h3{margin-top:3.2mm;font:600 12.5pt/1.1 var(--sans);letter-spacing:-.025em}
.app p{margin-top:1.2mm;font-size:8.8pt;line-height:1.35;color:var(--mute)}
.app p b{color:var(--pink);font-weight:600}
.rowhead{display:flex;justify-content:space-between;align-items:flex-end;gap:10mm}
.rowhead h2{font-size:30pt}
.rowhead p{max-width:78mm;color:var(--mute);font-size:10.5pt;line-height:1.4;text-align:right}

/* 6. fonctions */
.bentoimg{display:block;width:257mm;margin-top:9mm}

/* 7. métiers */
.jobs{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;margin-top:8mm}
.job{padding:7mm 8mm 5mm;border-radius:5mm;background:var(--bg2);box-shadow:inset 0 0 0 1px var(--line)}
.job span{font:italic 400 16pt/1 var(--serif);background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.job h3{margin:2mm 0 4.5mm;font:600 18pt/1.1 var(--sans);letter-spacing:-.03em}
.job li{display:flex;align-items:center;gap:2.4mm;padding:2.7mm 0;border-top:1px solid var(--line);list-style:none;font-size:11.5pt;color:#d6d5e2}
.job li::before{content:"";width:1.4mm;height:1.4mm;border-radius:50%;background:var(--aqua)}
.tant{position:absolute;left:0;right:0;bottom:19mm;text-align:center;font:600 15pt/1 var(--sans);letter-spacing:-.025em}
.tant .em{font-size:1.12em}

/* 8. sites */
.sitesp{display:grid;grid-template-columns:60mm 1fr;gap:9mm;height:176mm;align-items:center}
.sitesp h2{font-size:31pt}
.sitesp .lead{font-size:11.5pt}
.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:8mm 13mm;padding-right:5mm;margin-top:-6mm}
.scell{position:relative}
.scell .iphone{right:-6mm;bottom:4mm;width:21mm;z-index:3}
.scell figcaption,.scell .cap{display:flex;align-items:baseline;gap:3mm;margin-top:2.6mm;font:600 11.5pt/1 var(--sans);letter-spacing:-.025em}
.scell .cap small{font:400 8.5pt/1 var(--sans);color:var(--mute);letter-spacing:0}

/* 9. défilement */
.strips{position:absolute;right:-16mm;top:-26mm;display:flex;gap:5.5mm;transform:rotate(7deg);transform-origin:50% 50%}
.strip{width:45mm;border-radius:3mm;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.12),0 14mm 30mm -10mm #000}
.strip img{display:block;width:100%}
.strip:nth-child(1){margin-top:22mm}.strip:nth-child(2){margin-top:-6mm}.strip:nth-child(3){margin-top:30mm}.strip:nth-child(4){margin-top:4mm}
.fadeL{position:absolute;inset:0;background:linear-gradient(90deg,var(--bg) 0%,var(--bg) 32%,rgba(10,10,15,.6) 39%,rgba(10,10,15,0) 47%),linear-gradient(0deg,var(--bg),transparent 16%)}
.scrollp{position:absolute;left:20mm;top:0;bottom:0;width:84mm;display:flex;flex-direction:column;justify-content:center}
.scrollp h2{font-size:36pt}

/* 10. logos */
.paper{background:var(--paper);color:var(--ink)}
.paper .eyebrow{color:#0e9c8f}.paper .eyebrow::before{background:#0e9c8f}
.lgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:4.5mm;margin-top:8mm}
.lg{display:grid;place-items:center;height:41mm;border-radius:5mm}
.lg img{max-width:62%;max-height:42%}
.kit{display:grid;grid-template-columns:1.25fr repeat(4,1fr);gap:4.5mm;margin-top:5mm;align-items:stretch}
.kit__txt{align-self:center;padding-right:4mm}
.kit__txt h3{font:600 17pt/1.05 var(--sans);letter-spacing:-.035em}
.kit__txt p{margin-top:2mm;color:#5d5a66;font-size:9.5pt;line-height:1.4}
.kit__it{position:relative;display:grid;place-items:center;height:41mm;padding-bottom:5mm;border-radius:5mm;background:#fff}
.kit__it small{position:absolute;left:4mm;bottom:3.4mm;font:500 7.5pt/1 var(--sans);color:#77747f}
.pal{display:flex}.pal i{width:11mm;height:11mm;margin:0 -1.2mm;border-radius:50%;box-shadow:0 0 0 .8mm #fff}
.kit__it b{font:400 34pt/1 Georgia,serif;color:#24190a;letter-spacing:-.04em}
.kit__it .ic{width:16mm;border-radius:4mm}
.kit__it .card{display:grid;place-items:center;width:38mm;aspect-ratio:85/55;border-radius:2mm;background:#ffe9a8}.kit__it .card img{width:56%}

/* 11. publicités */
.pubsp{display:grid;grid-template-columns:62mm 1fr;gap:10mm;height:176mm;align-items:center}
.pubsp h2{font-size:31pt}
.pubsp .lead{font-size:11.5pt}
.pgrid{position:relative;height:156mm}
.pgrid img{position:absolute;border-radius:3.5mm;box-shadow:0 0 0 1px rgba(255,255,255,.1),0 12mm 24mm -12mm #000}

/* 12. contact */
.end{display:grid;grid-template-columns:1fr 78mm;gap:14mm;align-items:center}
.end h1{font-size:60pt;line-height:.94;letter-spacing:-.045em}
.end ul{display:flex;gap:2.5mm;margin-top:10mm;list-style:none;flex-wrap:wrap}
.card{padding:8mm;border-radius:7mm;background:#fff;color:var(--ink);text-align:center;box-shadow:0 20mm 40mm -20mm #000}
.card img.qr{display:block;width:44mm;margin:0 auto 6mm}
.card b{display:block;font:600 17pt/1 var(--sans);letter-spacing:-.035em}
.card span{display:block;margin-top:2.4mm;font-size:9.5pt;color:#5d5a66}
.card hr{border:0;border-top:1px solid #e7e4ec;margin:5mm 0}
.end__logo{position:absolute;left:20mm;top:17mm;height:15mm}
.end__sign{position:absolute;left:20mm;bottom:15mm;font:600 11pt/1 var(--sans);letter-spacing:-.02em;color:#c9c8d6}
`;

const foot = (n, light) => `<div class="foot"><img src="${img(light ? 'logo-mark.webp' : 'logo-mark-light.webp')}"><span>AS Marketing Agency · asagency.store</span><span>${String(n).padStart(2, '0')}</span></div>`;

(async () => {
  const browser = await L.chromium.launch();
  const TMP = L.tmpDir('presentation');
  const P = await L.pieces(browser, TMP, [
    { name: 'wall', w: 1500, h: 1061, css: '.hero__title,.hero__cue,.hero__veil{display:none!important}' },
    { name: 'compare', w: 1440, h: 900, sel: '#compare' },
    { name: 'bento', w: 1440, h: 900, sel: '#bento', css: '.tile{opacity:1!important;transform:none!important}' },
  ]);
  const pages = [];

  /* 1. Couverture */
  pages.push(`<section class="page cover">
    <img class="cover__wall" src="${P.wall}"><div class="cover__veil"></div>
    <div class="cover__in">
      <img class="cover__logo" src="${img('logo-mark-light.webp')}">
      <h1><span>On le fait.</span><span><em>Vous l’aimez.</em></span><span class="t3">Ensuite, on parle.</span></h1>
      <div class="cover__bot"><ul><li class="pill">Applications</li><li class="pill">Sites web</li><li class="pill">Logos</li><li class="pill">Publicités</li></ul><b>asagency.store</b></div>
    </div>
  </section>`);

  /* 2. Le principe */
  pages.push(`<section class="page">
    <i class="glow" style="width:150mm;height:150mm;left:-60mm;top:-70mm;background:#1fc6b6;opacity:.28"></i>
    <div class="princ z">
      <div><p class="eyebrow">Notre principe</p><h2>Vous voyez votre projet <em>avant de payer.</em></h2><p class="lead">Pas de devis à l’aveugle. On réalise une première version, vous jugez sur pièce.</p></div>
      <div class="stepsv">
        <div class="stepv"><i>1</i><div><h3>Vous nous racontez</h3><p>Vingt minutes d’échange, sans cahier des charges.</p></div></div>
        <div class="stepv free"><i>2</i><div><h3>On réalise une première version<span class="badge">Offert</span></h3><p>Du concret sous 72 h, sans rien payer.</p></div></div>
        <div class="stepv"><i>3</i><div><h3>Vous décidez</h3><p>Ça ne vous plaît pas ? Vous ne nous devez rien.</p></div></div>
        <div class="stepv"><i>4</i><div><h3>On lance ensemble</h3><p>Mise en ligne, formation et suivi.</p></div></div>
      </div>
    </div>
    <div class="nums"><div><b>0 €</b><span>avant d’avoir vu votre projet</span></div><div><b>72 h</b><span>pour une première version</span></div><div><b>24 h</b><span>pour vous répondre</span></div><div><b>100 %</b><span>sur mesure</span></div></div>
    ${foot(2)}
  </section>`);

  /* 3. Applications */
  pages.push(`<section class="page">
    <i class="glow" style="width:170mm;height:170mm;right:-40mm;top:10mm;background:#8fb0f0;opacity:.3"></i>
    <div class="stage">${win(shot('app-projets-dash.webp'))}${win(shot('app-projets-gantt.webp'), '', 'planning', 'pipw')}</div>
    <div class="intro z"><p class="eyebrow">Applications sur mesure</p><h2>Vos fichiers Excel ont fait <em>leur temps.</em></h2><p class="lead">On construit l’application qui colle à votre métier.</p>
      <ul><li class="pill pill--ok">Pensée pour votre quotidien</li><li class="pill pill--ok">Prête en quelques jours</li><li class="pill pill--ok">Visible avant de payer</li></ul></div>
    ${foot(3)}
  </section>`);

  /* 4. Avant / après */
  pages.push(`<section class="page center">
    <p class="eyebrow">Avant, après</p><h2>Le même travail. <em>Sans la galère.</em></h2>
    <img class="cmp" src="${P.compare}">
    <div class="cmpcap"><div style="text-align:left"><b>Avant</b>Des fichiers partout, des versions en double, des formules cassées.</div><div><b>Après</b>Une seule application, claire et à jour pour tout le monde.</div></div>
    ${foot(4)}
  </section>`);

  /* 5. Six applications */
  pages.push(`<section class="page">
    <div class="rowhead"><div><p class="eyebrow">Déjà réalisées</p><h2>Six applications. <em>Six quotidiens simplifiés.</em></h2></div></div>
    <div class="apps6">${APPS.map((a) => `<article class="app">${win(shot(a.f + '.webp'))}<h3>${a.n}</h3><p>${a.d}<br><b>Remplace</b> ${a.r}.</p></article>`).join('')}</div>
    ${foot(5)}
  </section>`);

  /* 6. Dans chaque application */
  pages.push(`<section class="page">
    <p class="eyebrow">Dans chaque application</p><h2>Tout ce qui vous fait <em>gagner du temps.</em></h2>
    <img class="bentoimg" src="${P.bento}">
    ${foot(6)}
  </section>`);

  /* 7. Par métier */
  pages.push(`<section class="page">
    <i class="glow" style="width:160mm;height:120mm;right:-50mm;bottom:-60mm;background:#eaa6e6;opacity:.22"></i>
    <p class="eyebrow">Et chez vous ?</p><h2>Une application pour <em>chaque métier.</em></h2>
    <div class="jobs z">${JOBS.map(([n, l], i) => `<article class="job"><span>0${i + 1}</span><h3>${n}</h3><ul>${l.map((x) => `<li>${x}</li>`).join('')}</ul></article>`).join('')}</div>
    <p class="tant">Votre idée n’est pas dans la liste ? <span class="em">Tant mieux.</span></p>
    ${foot(7)}
  </section>`);

  /* 8. Sites web */
  pages.push(`<section class="page" style="padding-right:12mm">
    <i class="glow" style="width:140mm;height:140mm;left:-70mm;bottom:-70mm;background:#1fc6b6;opacity:.25"></i>
    <div class="sitesp z">
      <div><p class="eyebrow">Sites web</p><h2>Des sites qui donnent <em>envie de rester.</em></h2><p class="lead">Vitrine, boutique, réservation, page de vente : chaque site est dessiné pour sa marque.</p></div>
      <div class="sgrid">${SITES.map((s) => `<div class="scell">${win(shot(`site-${s.s}.webp`), '', s.adr, 'win--site')}${iphone(s.s)}<p class="cap">${s.n}<small>${s.t}</small></p></div>`).join('')}</div>
    </div>
    ${foot(8)}
  </section>`);

  /* 9. Du premier écran au dernier */
  pages.push(`<section class="page">
    <div class="strips">${SITES.map((s) => `<div class="strip"><img src="${shot(`site-${s.s}-full.webp`)}"></div>`).join('')}</div>
    <div class="fadeL"></div>
    <div class="scrollp"><p class="eyebrow">Du premier écran au dernier</p><h2>Fluides, animés, <em>pensés pour le mobile.</em></h2><p class="lead" style="max-width:74mm;font-size:12pt">Animations au défilement, formulaires, paiement et réservation : tout fonctionne, sur tous les écrans.</p></div>
    ${foot(9)}
  </section>`);

  /* 10. Logos */
  pages.push(`<section class="page paper">
    <p class="eyebrow">Logos &amp; identité</p><h2>Des logos qu’on <em>reconnaît de loin.</em></h2>
    <div class="lgrid">${LOGOS.map((l) => `<div class="lg" style="background:${l.bg}"><img src="${img(`logos/${l.slug}.svg`)}" style="color:${FG[l.slug]}"></div>`).join('')}</div>
    <div class="kit">
      <div class="kit__txt"><h3>Et tout ce qui va avec.</h3><p>Couleurs, typographies, icône, carte de visite : une identité complète, prête à imprimer et à publier.</p></div>
      <div class="kit__it"><div class="pal"><i style="background:#24190a"></i><i style="background:#f6b400"></i><i style="background:#e06b00"></i><i style="background:#ffe9a8"></i></div><small>Couleurs</small></div>
      <div class="kit__it"><b>Aa</b><small>Typographies</small></div>
      <div class="kit__it"><img class="ic" src="${img('logos/brume-mark.svg')}"><small>Icône</small></div>
      <div class="kit__it"><span class="card"><img src="${img('logos/brume.svg')}"></span><small>Carte de visite</small></div>
    </div>
    ${foot(10, true)}
  </section>`);

  /* 11. Publicités */
  const ad = (n, s) => `<img src="${shot(`ad-${n}.webp`)}" style="${s}">`;
  pages.push(`<section class="page">
    <i class="glow" style="width:150mm;height:150mm;right:-50mm;top:-80mm;background:#eaa6e6;opacity:.22"></i>
    <div class="pubsp z">
      <div><p class="eyebrow">Publicités &amp; réseaux sociaux</p><h2>Des pubs qui <em>arrêtent le pouce.</em></h2><p class="lead">Stories, posts, bannières : des visuels prêts à publier, aux couleurs de votre marque.</p></div>
      <div class="pgrid">
        ${ad('brume-story', 'left:0;top:0;width:52mm')}
        ${ad('pepin-carre', 'left:0;top:97.5mm;width:52mm')}
        ${ad('solstice-carre', 'left:57mm;top:16mm;width:70mm')}
        ${ad('orbe-banniere', 'left:57mm;top:91mm;width:70mm')}
        ${ad('souffle-story', 'left:132mm;top:6mm;width:52mm')}
        ${ad('lenoir-banniere', 'left:132mm;top:103.5mm;width:52mm')}
      </div>
    </div>
    ${foot(11)}
  </section>`);

  /* 12. Contact */
  pages.push(`<section class="page">
    <i class="glow" style="width:190mm;height:190mm;left:-40mm;bottom:-110mm;background:#1fc6b6;opacity:.35"></i>
    <i class="glow" style="width:150mm;height:150mm;right:-40mm;top:-60mm;background:#8fb0f0;opacity:.3"></i>
    <img class="end__logo" src="${img('logo-mark-light.webp')}">
    <div class="end z" style="height:100%">
      <div><p class="eyebrow">Votre projet</p><h1>Décrivez-le.<br><em>On vous le montre.</em></h1>
        <ul><li class="pill pill--ok">Sans engagement</li><li class="pill pill--ok">Aucun paiement avant validation</li><li class="pill pill--ok">Réponse sous 24 h</li></ul></div>
      <div class="card"><img class="qr" src="${img('qr-asagency.svg')}"><b>asagency.store</b><span>Scannez pour décrire votre projet</span><hr><span style="margin:0;color:#121117;font-weight:600">as.agency.off@gmail.com</span></div>
    </div>
    <p class="end__sign">On le fait. Vous l’aimez. <span class="em" style="font-size:1.15em">Ensuite, on parle.</span></p>
  </section>`);

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><link href="${L.FONTS}" rel="stylesheet"><style>${CSS}</style></head><body>${pages.join('\n')}</body></html>`;
  const files = await L.raster(browser, TMP, html, { w: 1123, h: 794, scale: 2, quality: 86 });
  await L.imagesToPdf(browser, files, OUT, 297, 210);
  await browser.close();
  console.log('✓', path.relative(L.ROOT, OUT), '—', files.length, 'pages,', Math.round(L.fs.statSync(OUT).size / 1024), 'Ko');
})();
