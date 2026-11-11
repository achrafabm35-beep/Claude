/* =========================================================
   Effets partagés des sites d'exemple — AS Marketing Agency
   Attributs :
   data-split        titre révélé ligne par ligne / mot par mot
   data-reveal       apparition en fondu + montée (data-reveal="left|right|scale")
   data-stagger      les enfants directs apparaissent en cascade
   data-parallax     décalage vertical au défilement (ex. data-parallax="-18" en %)
   data-rotate       rotation liée au défilement (ex. data-rotate="40" en degrés)
   data-tilt         inclinaison 3D au survol
   data-magnet       bouton aimanté
   data-count        compteur animé (data-prefix / data-suffix / data-dec)
   ?shot             (dans l'URL) fige les animations pour les captures
   ========================================================= */
(function () {
  const SHOT = /[?&]shot/.test(location.search);
  const root = document.documentElement;
  root.classList.add(SHOT ? "shot" : "js");
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* découpe des titres en mots (chaque mot dans un masque) */
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
      } else if (n.nodeType === 1 && n.tagName !== "BR" && !n.hasAttribute("data-nosplit")) splitNode(n);
    });
  };
  $$("[data-split]").forEach(splitNode);

  const fmt = (el, v) => {
    const dec = +el.dataset.dec || 0;
    const s = dec ? v.toFixed(dec).replace(".", ",") : Math.round(v).toLocaleString("fr-FR");
    el.textContent = (el.dataset.prefix || "") + s + (el.dataset.suffix || "");
  };
  const finalCounts = () => $$("[data-count]").forEach((el) => fmt(el, parseFloat(el.dataset.count)));

  if (SHOT) { finalCounts(); window.FX = { shot: true }; return; }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduce) { root.classList.replace("js", "shot"); finalCounts(); window.FX = { shot: true }; return; }

  /* défilement adouci (souris) */
  let lenis = null;
  if (fine && window.Lenis) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const t = a.getAttribute("href"); if (t.length < 2) return;
      const el = document.querySelector(t); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, { offset: -70 });
    }));
  }

  /* titres */
  $$("[data-split]").forEach((el) => {
    const first = el.hasAttribute("data-now");
    gsap.fromTo(el.querySelectorAll(".wi"), { yPercent: 115 }, {
      yPercent: 0, duration: 1.15, stagger: 0.055, ease: "power4.out", delay: first ? 0.15 : 0,
      scrollTrigger: first ? undefined : { trigger: el, start: "top 88%", once: true },
    });
  });

  /* apparitions */
  const from = { left: { x: -60 }, right: { x: 60 }, scale: { scale: 0.9 }, "": { y: 46 } };
  $$("[data-reveal]").forEach((el) => {
    gsap.fromTo(el, { autoAlpha: 0, ...(from[el.dataset.reveal] || from[""]) }, {
      autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 1, delay: +el.dataset.delay || 0,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
  $$("[data-stagger]").forEach((el) => {
    gsap.fromTo(el.children, { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1, y: 0, duration: 0.9, stagger: +el.dataset.stagger || 0.08,
      scrollTrigger: { trigger: el, start: "top 86%", once: true },
    });
  });

  /* liés au défilement */
  $$("[data-parallax]").forEach((el) => {
    gsap.fromTo(el, { yPercent: -(parseFloat(el.dataset.parallax) || -18) / 2 }, {
      yPercent: (parseFloat(el.dataset.parallax) || -18) / 2, ease: "none",
      scrollTrigger: { trigger: el.closest("[data-scene]") || el, start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
  });
  $$("[data-rotate]").forEach((el) => {
    gsap.to(el, { rotation: parseFloat(el.dataset.rotate) || 40, ease: "none",
      scrollTrigger: { trigger: el.closest("[data-scene]") || el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
  });

  /* compteurs */
  $$("[data-count]").forEach((el) => {
    const o = { v: 0 }, end = parseFloat(el.dataset.count);
    fmt(el, 0);
    gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => fmt(el, o.v),
      scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });

  /* survol */
  if (fine) {
    $$("[data-tilt]").forEach((el) => {
      const max = +el.dataset.tilt || 8;
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.5 }), ry = gsap.quickTo(el, "rotationY", { duration: 0.5 });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * max * 2); rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      });
      el.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
    $$("[data-magnet]").forEach((el) => {
      const x = gsap.quickTo(el, "x", { duration: 0.4 }), y = gsap.quickTo(el, "y", { duration: 0.4 });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.3); y((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener("pointerleave", () => { x(0); y(0); });
    });
  }

  window.FX = { shot: false, lenis, fine };
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
