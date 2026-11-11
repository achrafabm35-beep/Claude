/* =========================================================
   AS Marketing Agency — interactions et animations
   GSAP + ScrollTrigger (sans épinglage : uniquement position: sticky),
   défilement adouci par Lenis à la souris. ?shot fige tout (captures).
   ========================================================= */
(() => {
  const root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove("js"); return; }
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STATIC = root.classList.contains("shot") || reduce;
  if (STATIC) { root.classList.remove("js"); root.classList.add("shot"); }

  /* on arrive toujours en haut de l’accueil (sauf lien vers une section) */
  if ("scrollRestoration" in history && !location.hash) { history.scrollRestoration = "manual"; window.scrollTo(0, 0); }

  /* ---------- contenu généré ---------- */
  /* mur d’accueil : 6 colonnes, chaque piste est doublée pour boucler sans couture */
  const S = "img/shots/";
  const PH = { brume: ["#ffeaa8", "#111"], souffle: ["#f3ebe0", "#111"], orbe: ["#312b6f", "#fff"], solstice: ["#0e0617", "#fff"] };
  const WALL = [
    [46, ["app-projets-dash", "m:brume", "ad-solstice-carre", "app-carto-atelier", "site-orbe"]],
    [58, ["site-solstice", "app-stockly", "ad-brume-story", "app-amelio-actions", "app-projets-budget"]],
    [42, ["app-amelio-dash", "site-brume", "m:souffle", "app-reserva", "ad-pepin-carre"]],
    [54, ["app-carto-plan", "ad-souffle-story", "app-projets-gantt", "site-souffle", "app-closr"]],
    [48, ["ad-orbe-banniere", "app-projets-risques", "m:orbe", "app-carto-dash", "app-amelio-achats"]],
    [62, ["app-projets-portfolio", "m:solstice", "ad-lenoir-banniere", "app-projets-hebdo", "app-carto-dash2"]],
  ];
  const tile = (n) => {
    if (n.startsWith("m:")) { const k = n.slice(2);
      return `<div class="htile htile--phone"><div class="iphone" style="--sb:${PH[k][0]};--sbtext:${PH[k][1]}"><div class="iphone__screen"><span class="iphone__bar"><b>9:41</b><i></i></span><img src="${S}mobile-${k}-s.webp" alt="" decoding="async" /></div></div></div>`; }
    return `<div class="htile"><img src="${S}${n}-s.webp" alt="" decoding="async" /></div>`;
  };
  const wall = $("#wall");
  wall.innerHTML = WALL.map(([d, items]) => `<div class="hcol" style="--d:${d}s"><div class="hcol__track">${items.map(tile).join("").repeat(2)}</div></div>`).join("");

  /* faux tableur du comparateur */
  const xl = $("#xlGrid");
  if (xl) {
    const cols = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
    const head = ["Projet", "Resp.", "Début", "Fin prévue", "Fin réelle", "Budget", "Dépensé", "Écart", "Statut", "Commentaire", "MAJ"];
    const rows = [
      ["Ligne inspection", "A.M.", "24/08", "25/02", "", "185 000", "49 210", "#REF!", "EN COURS", "voir mail du 12", "??"],
      ["Extension atelier B", "J.P.", "01/03", "30/09", "15/11", "92 000", "101 400", "-9 400", "RETARD", "attente devis v3", "S42"],
      ["Migration ERP", "S.L.", "15/01", "30/06", "", "240 000", "198 700", "41 300", "à valider", "", "S39"],
      ["Refonte packaging", "C.D.", "02/05", "20/12", "", "38 000", "#VALEUR!", "#VALEUR!", "OK ?", "relancer fournisseur", ""],
      ["Audit énergie", "A.M.", "10/09", "10/11", "08/11", "12 500", "12 480", "20", "TERMINÉ", "", "S45"],
      ["Nouveau site web", "M.R.", "", "31/01", "", "", "6 300", "", "EN COURS", "qui a le fichier final ?", ""],
      ["Formation sécurité", "J.P.", "03/10", "17/10", "17/10", "4 200", "4 200", "0", "TERMINÉ", "", "S42"],
      ["Robot palettiseur", "S.L.", "12/02", "01/08", "", "310 000", "275 950", "#N/A", "RETARD", "copie de l’onglet OLD", "S31"],
      ["Certification ISO", "C.D.", "20/04", "20/12", "", "18 000", "9 870", "8 130", "EN COURS", "", "S44"],
      ["Déménagement stock", "M.R.", "05/06", "05/07", "22/07", "27 000", "33 150", "-6 150", "TERMINÉ", "budget dépassé !!", "S30"],
      ["Appli terrain", "A.M.", "01/11", "", "", "", "", "", "à lancer", "attendre retour direction", ""],
      ["TOTAL", "", "", "", "", "926 700", "#REF!", "#REF!", "", "", ""],
    ];
    const tone = { "#REF!": "r", "#VALEUR!": "r", "#N/A": "r", RETARD: "o", "TERMINÉ": "g", "EN COURS": "b", "à valider": "y", "OK ?": "y", "à lancer": "p", "??": "y" };
    let h = cols.map((c) => `<span class="h">${c}</span>`).join("") + `<span class="h">1</span>` + head.map((c) => `<span class="t">${c}</span>`).join("");
    rows.forEach((r, i) => { h += `<span class="h">${i + 2}</span>` + r.map((c, j) => `<span class="${tone[c] || (j === 9 && c ? "y" : "")}">${c}</span>`).join(""); });
    for (let i = 0; i < 3; i++) h += `<span class="h">${rows.length + 2 + i}</span>` + "<span></span>".repeat(11);
    xl.innerHTML = h;
  }

  /* découpe des titres en mots masqués */
  const splitNode = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
          const w = document.createElement("span"); w.className = "w";
          const wi = document.createElement("span"); wi.className = "wi"; wi.textContent = part;
          w.appendChild(wi); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") splitNode(n);
    });
  };
  $$("[data-split]").forEach(splitNode);

  /* manifeste : un élément par mot */
  const manifesto = $("#manifesto");
  const mwrap = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) { const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) return f.appendChild(document.createTextNode(" "));
        const s = document.createElement("span"); s.className = "mw"; s.textContent = p; f.appendChild(s); });
      n.replaceWith(f);
    } else if (n.nodeType === 1) mwrap(n);
  });
  if (manifesto) mwrap(manifesto);

  /* ---------- applications : onglets ---------- */
  const APPS = [
    { d: "Planning, budget, risques et reporting au même endroit.", r: "le planning Excel, le suivi budget et le PowerPoint du lundi.", c: ["Gantt interactif", "Budget en direct", "Rapport en un clic"], pip: 0 },
    { d: "Vos ateliers et vos postes sur un plan, avec les indicateurs dessus.", r: "les relevés papier et les plans imprimés.", c: ["Plan interactif", "Indicateurs par zone", "Questionnaires terrain"], pip: 1 },
    { d: "Idées, actions, audits et achats suivis jusqu’au bout.", r: "le tableau d’actions que plus personne ne met à jour.", c: ["Boîte à idées", "Plans d’actions", "Suivi des gains"], pip: 2 },
    { d: "Vos clients réservent seuls, les rappels partent tout seuls.", r: "le carnet de rendez-vous et les appels manqués.", c: ["Agenda partagé", "Rappels par SMS", "Réservation 24 h/24"], demo: "exemples/apps/reserva.html" },
    { d: "Commandes en direct, stock à jour, réassort automatique.", r: "l’inventaire du dimanche soir.", c: ["Ventes en temps réel", "Alertes de stock", "Réassort automatique"], demo: "exemples/apps/stockly.html" },
    { d: "Chaque prospect suivi, chaque relance envoyée.", r: "les relances oubliées et les devis perdus.", c: ["Pipeline visuel", "Relances automatiques", "Taux de conversion"], demo: "exemples/apps/closr.html" },
  ];
  const tabs = $$("#tabs button"), shots = $$("#frame .frame__img img"), pip = $("#pip"), pips = $$("#pip img");
  const aDesc = $("#appDesc"), aRep = $("#appRep"), aChips = $("#appChips"), aDemo = $("#appDemo"), aInfo = $("#appinfo");
  let cur = 0, bar = null, auto = false;
  const fill = (i) => { const a = APPS[i];
    aDesc.textContent = a.d; aRep.innerHTML = `<b>Remplace</b> ${a.r}`;
    aChips.innerHTML = a.c.map((c) => `<li>${c}</li>`).join("");
    aDemo.hidden = !a.demo; if (a.demo) aDemo.href = a.demo; };
  const show = (i, user) => {
    if (i === cur && !user && bar) return;
    cur = i; const a = APPS[i];
    tabs.forEach((t, k) => { t.classList.toggle("on", k === i); t.setAttribute("aria-selected", k === i); });
    shots.forEach((s, k) => s.classList.toggle("on", k === i));
    pip.classList.toggle("off", a.pip === undefined);
    if (a.pip !== undefined) pips.forEach((p, k) => p.classList.toggle("on", k === a.pip));
    if (STATIC) fill(i);
    else gsap.to(aInfo, { autoAlpha: 0, y: 10, duration: 0.2, ease: "power1.in", onComplete: () => { fill(i); gsap.to(aInfo, { autoAlpha: 1, y: 0, duration: 0.45 }); } });
    if (innerWidth <= 960) tabs[i].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    play();
  };
  const play = () => {
    if (bar) bar.kill(); gsap.set("#tabs button i", { scaleX: 0 });
    if (STATIC || !auto) return;
    bar = gsap.fromTo(tabs[cur].querySelector("i"), { scaleX: 0 }, { scaleX: 1, duration: 6.5, ease: "none", onComplete: () => show((cur + 1) % APPS.length) });
  };
  tabs.forEach((t, i) => t.addEventListener("click", () => show(i, true)));
  fill(0);

  /* ---------- comparateur avant / après ---------- */
  const cmp = $("#compare");
  if (cmp) {
    const handle = $("#cmpHandle"); let p = 50;
    const setP = (v) => { p = Math.max(3, Math.min(97, v)); cmp.style.setProperty("--p", p + "%"); handle.setAttribute("aria-valuenow", Math.round(p)); };
    const fromEvent = (e) => { const r = cmp.getBoundingClientRect(); setP(((e.clientX - r.left) / r.width) * 100); };
    let drag = false;
    cmp.addEventListener("pointerdown", (e) => { drag = true; cmp.setPointerCapture(e.pointerId); fromEvent(e); cmp._tw && cmp._tw.kill(); });
    cmp.addEventListener("pointermove", (e) => drag && fromEvent(e));
    ["pointerup", "pointercancel"].forEach((ev) => cmp.addEventListener(ev, () => (drag = false)));
    handle.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") setP(p - 4); if (e.key === "ArrowRight") setP(p + 4); });
    setP(50);
    if (!STATIC) {
      const o = { v: 94 };
      cmp._tw = gsap.timeline({ scrollTrigger: { trigger: cmp, start: "top 70%", once: true }, onUpdate: () => setP(o.v) })
        .fromTo(o, { v: 94 }, { v: 26, duration: 1.5, ease: "power3.inOut" }).to(o, { v: 52, duration: 1.1, ease: "power2.inOut" });
      setP(94);
    }
  }

  /* ---------- par métier ---------- */
  const JOBS = [
    [["01", "Devis & chantiers", "Du premier chiffrage à la facture finale, sans ressaisie."], ["02", "Planning des équipes", "Qui est sur quel chantier, cette semaine et la suivante."], ["03", "Suivi des achats", "Matériaux commandés, livrés, posés. Et la marge en direct."]],
    [["01", "Caisse & stock", "Chaque vente met le stock à jour, sur place comme en ligne."], ["02", "Fidélité clients", "Cartes, offres et relances envoyées au bon moment."], ["03", "Tableau des ventes", "Vos meilleurs produits et vos heures creuses, en un coup d'œil."]],
    [["01", "Réservations", "Tables réservées en ligne, rappels automatiques, moins d’absents."], ["02", "Commandes fournisseurs", "Les quantités se calculent à partir des ventes de la semaine."], ["03", "Hygiène & relevés", "Températures et nettoyages cochés sur tablette, archivés tout seuls."]],
    [["01", "Pilotage de projets", "Planning, budget et risques partagés avec toute l’équipe."], ["02", "Cartographie des ateliers", "Vos postes sur un plan, avec les indicateurs associés."], ["03", "Amélioration continue", "Idées, plans d’actions et gains suivis jusqu’au bout."]],
    [["01", "Prise de rendez-vous", "Vos clients réservent seuls, à toute heure."], ["02", "Rappels automatiques", "SMS et e-mails envoyés la veille. Fini les oublis."], ["03", "Fiches clients", "Historique, préférences et notes, toujours sous la main."]],
    [["01", "CRM commercial", "Chaque prospect suivi, chaque relance envoyée à temps."], ["02", "Devis & facturation", "Créés en deux clics, signés en ligne, relancés tout seuls."], ["03", "Suivi du temps", "Les heures passées par client et par dossier, sans tableur."]],
  ];
  const jobGrid = $("#jobGrid"), jobTabs = $$("#jobTabs button");
  const drawJobs = (j) => (jobGrid.innerHTML = JOBS[j].map(([ic, t, d]) => `<article class="job"><i>${ic}</i><h3>${t}</h3><p>${d}</p></article>`).join(""));
  if (jobGrid) {
    drawJobs(0);
    jobTabs.forEach((b) => b.addEventListener("click", () => {
      if (b.classList.contains("on")) return;
      jobTabs.forEach((x) => x.classList.toggle("on", x === b)); drawJobs(+b.dataset.j);
      if (!STATIC) gsap.fromTo("#jobGrid .job", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 });
    }));
  }

  /* ---------- sites : hauteur de défilement des captures ---------- */
  const measure = () => $$(".scrollshot").forEach((box) => { const img = box.querySelector("img"); if (!img.offsetHeight) return;
    const dy = Math.max(0, img.offsetHeight - box.offsetHeight); box.style.setProperty("--dy", -dy + "px"); box.style.setProperty("--t", Math.max(3, dy / 260).toFixed(1) + "s"); box.style.setProperty("--t2", Math.max(8, dy / 110).toFixed(1) + "s"); });
  $$(".scrollshot img").forEach((img) => (img.complete ? 0 : img.addEventListener("load", measure, { once: true })));
  measure(); addEventListener("resize", measure);

  /* compteurs */
  const fmt = (el, v) => (el.textContent = Math.round(v) + (el.dataset.suffix || ""));

  /* ---------- mode figé (captures, mouvement réduit) ---------- */
  if (STATIC) { $$("[data-count]").forEach((el) => fmt(el, +el.dataset.count)); $$(".tile").forEach((t) => t.classList.add("in")); return; }

  /* ---------- défilement adouci (souris uniquement) ---------- */
  let lenis = null;
  if (fine && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href"); const el = id.length > 1 && $(id); if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: id === "#top" ? 0 : -40, duration: 1.4 }); else el.scrollIntoView({ behavior: "smooth" });
  }));

  /* ---------- ouverture ---------- */
  const loader = $("#loader");
  const intro = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } })
    .to(loader, { yPercent: -100, duration: 0.8, ease: "power4.inOut", onComplete: () => loader.remove() })
    .fromTo(".hwall", { scale: 1.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2, ease: "expo.out" }, "-=0.45")
    .to("#heroTitle .in", { y: 0, duration: 1.2, stagger: 0.12 }, "-=1.5")
    .from(".hero__cue", { autoAlpha: 0, y: -12, duration: 0.8 }, "-=0.5");
  let started = false; const start = () => { if (started) return; started = true; intro.play(); };
  addEventListener("load", () => setTimeout(start, 150)); setTimeout(start, 1600);

  /* ---------- accueil au défilement : on plonge dans le mur ---------- */
  gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom bottom", scrub: 0.5 } })
    .fromTo(wall, { rotationX: 30, rotationY: 0, rotationZ: -12, scale: 1.18 }, { rotationX: 10, rotationZ: -4, scale: 2.1, duration: 1 }, 0)
    .to("#heroTitle", { scale: 1.3, autoAlpha: 0, duration: 0.42 }, 0)
    .to(".hero__cue", { autoAlpha: 0, duration: 0.12 }, 0)
    .to("#veil", { opacity: 0.35, duration: 0.5 }, 0)
    .to("#heroOut", { opacity: 1, duration: 0.34 }, 0.66);
  ScrollTrigger.create({ trigger: "#hero", start: "top top", end: "bottom top", onToggle: (s) => wall.classList.toggle("paused", !s.isActive) });
  if (fine) {
    const hw = $(".hwall"), rx = gsap.quickTo(hw, "rotationX", { duration: 1.1 }), ry = gsap.quickTo(hw, "rotationY", { duration: 1.1 });
    addEventListener("pointermove", (e) => { if (scrollY > innerHeight) return; ry((e.clientX / innerWidth - 0.5) * 6); rx(-(e.clientY / innerHeight - 0.5) * 4); }, { passive: true });
  }

  /* ---------- barre de navigation + progression ---------- */
  const nav = $("#nav");
  ScrollTrigger.create({ start: 60, end: "max", onToggle: (s) => nav.classList.toggle("scrolled", s.isActive) });
  gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  $$(".nav__links a").forEach((a) => { const sec = $(a.getAttribute("href")); if (!sec) return;
    ScrollTrigger.create({ trigger: sec, start: "top 50%", end: "bottom 50%", onToggle: (s) => a.classList.toggle("on", s.isActive) }); });

  /* ---------- apparitions ---------- */
  ScrollTrigger.batch("[data-r]", { start: "top 90%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, overwrite: true }) });
  $$("[data-split]").forEach((el) => gsap.to(el.querySelectorAll(".wi"), { y: 0, duration: 1.1, stagger: 0.05, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
  if (manifesto) gsap.fromTo($$(".mw", manifesto), { opacity: 0.14 }, { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: manifesto, start: "top 82%", end: "bottom 48%", scrub: 0.4 } });
  $$(".tile").forEach((t) => ScrollTrigger.create({ trigger: t, start: "top 82%", once: true, onEnter: () => t.classList.add("in") }));
  $$("[data-count]").forEach((el) => { const o = { v: 0 }, end = +el.dataset.count; if (!end) return;
    fmt(el, 0); gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => fmt(el, o.v), scrollTrigger: { trigger: el, start: "top 92%", once: true } }); });

  /* applications : lecture auto seulement quand la vitrine est à l’écran */
  ScrollTrigger.create({ trigger: "#showcase", start: "top 70%", end: "bottom 20%", onToggle: (s) => { auto = s.isActive; play(); } });
  if (fine) { const sc = $(".showcase__main"); sc.addEventListener("pointerenter", () => bar && bar.pause()); sc.addEventListener("pointerleave", () => bar && bar.resume()); }
  if (fine) gsap.to(pip, { yPercent: -30, ease: "none", scrollTrigger: { trigger: "#showcase", start: "top bottom", end: "bottom top", scrub: 0.6 } });

  /* méthode : la ligne se remplit */
  const mob = matchMedia("(max-width: 860px)").matches;
  gsap.to("#stepsLine", { [mob ? "scaleY" : "scaleX"]: 1, ease: "none", scrollTrigger: { trigger: "#steps", start: "top 78%", end: mob ? "bottom 60%" : "top 34%", scrub: 0.5 } });

  /* sites : sur écran tactile, les captures défilent seules quand elles sont visibles */
  if (!fine) $$(".scrollshot").forEach((b) => ScrollTrigger.create({ trigger: b, start: "top 80%", end: "bottom 20%", onToggle: (s) => b.classList.toggle("auto", s.isActive) }));

  /* publicités : colonnes à des vitesses différentes */
  $$(".pubcol").forEach((c) => { const v = +c.dataset.speed || 6;
    gsap.fromTo(c, { yPercent: v }, { yPercent: -v, ease: "none", scrollTrigger: { trigger: "#pubGrid", start: "top bottom", end: "bottom top", scrub: 0.6 } }); });

  /* boutons aimantés */
  if (fine) $$("[data-magnet]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.4 }), y = gsap.quickTo(el, "y", { duration: 0.4 });
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.28); y((e.clientY - r.top - r.height / 2) * 0.28); });
    el.addEventListener("pointerleave", () => { x(0); y(0); });
  });

  addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
