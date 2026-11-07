/* =========================================================
   AS Marketing Agency — animations GSAP
   - intro (rideau), titre mot par mot + phrase rotative
   - billets collés : parallax souris dans le hero, « collage » au scroll
   - manifeste qui s'illumine mot par mot, étapes empilées
   - plongée zoom épinglée, apps en défilement horizontal
   - logos dessinés au trait, curseur et boutons magnétiques
   - ?shot dans l'URL : tout est figé (captures pour le PDF)
   ========================================================= */
const SHOT = document.documentElement.classList.contains("shot");
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out" });

/* ---------- utilitaires ---------- */
const splitWords = (el) => {
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) return f.appendChild(document.createTextNode(p));
        const w = document.createElement("span"); w.className = "w";
        const wi = document.createElement("span"); wi.className = "wi"; wi.textContent = p;
        w.appendChild(wi); f.appendChild(w);
      });
      n.replaceWith(f);
    } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
  });
  walk(el);
};
document.querySelectorAll("[data-split]").forEach(splitWords);

/* manifeste : un span par mot */
const mani = document.getElementById("manifesto");
if (mani) {
  const hl = ["l'inverse", "d'abord", "vraie", "première", "version", "confiance."];
  mani.innerHTML = mani.textContent.split(/\s+/).map((w) => `<span class="mw${hl.includes(w) ? " hl" : ""}">${w}</span>`).join(" ");
}

/* hauteur du cadre pour l'effet de défilement des captures */
const setFrames = () => document.querySelectorAll(".scrollshot").forEach((f) => f.style.setProperty("--frame-h", f.clientHeight + "px"));
setFrames();
window.addEventListener("resize", setFrames);

/* logos : préparation du tracé */
document.querySelectorAll(".draw-logo").forEach((svg) => {
  svg.querySelectorAll("path, circle, rect").forEach((p) => {
    const len = p.getTotalLength ? Math.ceil(p.getTotalLength()) : 400;
    p.style.strokeDasharray = len; p.style.strokeDashoffset = SHOT ? 0 : len;
  });
});

if (SHOT) {
  document.getElementById("curtain")?.classList.add("gone");
  document.querySelectorAll(".mw").forEach((w) => (w.style.opacity = 1));
} else {
  /* barre de progression + nav */
  gsap.to("#scrollProgress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  let lastDir = 0;
  ScrollTrigger.create({
    start: "top -100", end: "max",
    onUpdate: (self) => {
      if (self.direction === lastDir) return;
      lastDir = self.direction;
      gsap.to("#nav", { yPercent: self.direction === 1 ? -120 : 0, duration: 0.5 });
    },
  });

  const mm = gsap.matchMedia();
  mm.add(
    { animate: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)", desktop: "(min-width: 761px)", fine: "(hover: hover) and (pointer: fine)" },
    (ctx) => {
      const { reduce, desktop, fine } = ctx.conditions;
      const curtain = document.getElementById("curtain");

      if (reduce) {
        curtain.classList.add("gone");
        gsap.set("[data-anim], [data-reveal], .wi, .hero__title .word", { autoAlpha: 1, y: 0, yPercent: 0 });
        document.querySelectorAll(".mw").forEach((w) => (w.style.opacity = 1));
        document.querySelectorAll(".draw-logo *").forEach((p) => (p.style.strokeDashoffset = 0));
        return;
      }

      /* ---------- INTRO + HERO ---------- */
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(curtain, { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.75, onComplete: () => curtain.classList.add("gone") })
        .from(".hero__title .word", { yPercent: 115, duration: 1, stagger: 0.07 }, "-=0.35")
        .from(".rot", { yPercent: 115, duration: 0.9 }, "-=0.7")
        .fromTo("[data-anim]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.8")
        .from("#heroBoard .note, #heroBoard .sticker, #heroBoard .tag", {
          y: () => gsap.utils.random(-260, -160), x: () => gsap.utils.random(-80, 80), rotation: () => gsap.utils.random(-30, 30),
          scale: 1.25, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: "back.out(1.4)", clearProps: "transform,opacity,visibility",
        }, "-=1");

      /* parallax souris sur le tableau du hero */
      const board = document.getElementById("heroBoard");
      if (fine && board) {
        const items = [...board.querySelectorAll(".layer")].map((el) => ({
          el, d: +el.dataset.depth,
          x: gsap.quickTo(el, "x", { duration: 0.8 }), y: gsap.quickTo(el, "y", { duration: 0.8 }),
        }));
        window.addEventListener("pointermove", (e) => {
          const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
          items.forEach((i) => { i.x(nx * 30 * i.d); i.y(ny * 24 * i.d); });
        });
      }
      gsap.to("#heroBoard", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

      /* blobs */
      gsap.to(".blob--1", { x: -60, y: 50, scale: 1.1, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob--2", { x: 70, y: -40, scale: 1.15, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob--3", { x: -50, y: -60, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" });

      /* phrase rotative */
      const rot = document.querySelector(".rot");
      const words = JSON.parse(rot.dataset.words || "[]");
      let wi = 0;
      const cycle = () => {
        const next = words[(wi + 1) % words.length];
        gsap.timeline({ onComplete: () => { wi = (wi + 1) % words.length; gsap.delayedCall(2, cycle); } })
          .to(rot, { yPercent: -110, autoAlpha: 0, duration: 0.45, ease: "power2.in" })
          .add(() => { rot.textContent = next; })
          .fromTo(rot, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55 });
      };
      gsap.delayedCall(3.6, cycle);

      /* marquee réactif à la vitesse de scroll */
      const marquee = document.getElementById("marquee");
      const loop = gsap.to(marquee, { xPercent: -50, duration: 24, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity() / 300), 6);
          gsap.to(loop, { timeScale: (self.direction === 1 ? 1 : -1) * (1 + v), duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: self.direction === 1 ? 1 : -1, duration: 0.9, delay: 0.3 });
        },
      });

      /* ---------- titres + révélations ---------- */
      gsap.utils.toArray("[data-split]").forEach((el) => {
        gsap.from(el.querySelectorAll(".wi"), { yPercent: 115, duration: 1, stagger: 0.05, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 86%" } });
      });
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: el, start: "top 88%" } });
      });

      /* ---------- manifeste mot par mot ---------- */
      gsap.to(".mw", { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "#manifesto", start: "top 80%", end: "bottom 40%", scrub: true } });

      /* ---------- étapes empilées ---------- */
      const steps = gsap.utils.toArray(".step");
      steps.forEach((s, i) => {
        if (i === steps.length - 1) return;
        gsap.to(s, { scale: 0.92 + i * 0.015, filter: "brightness(0.96)", ease: "none", scrollTrigger: { trigger: steps[i + 1], start: "top 80%", end: "top 20%", scrub: true } });
      });
      gsap.from(steps, { y: 80, autoAlpha: 0, stagger: 0.1, scrollTrigger: { trigger: ".steps", start: "top 85%" } });

      /* ---------- plongée zoom ---------- */
      const dv = gsap.utils.toArray("#diveScreen .dv");
      const dive = gsap.timeline({ scrollTrigger: { trigger: "#dive", start: "top top", end: "+=220%", scrub: 1, pin: true } });
      dive.fromTo("#diveScreen", { scale: 0.55, rotation: -6, borderRadius: 30 }, { scale: 1, rotation: 0, borderRadius: 14, ease: "power2.out", duration: 1 })
        .to("#diveText", { autoAlpha: 0, scale: 0.8, duration: 0.5 }, 0.2)
        .to(dv[1], { opacity: 1, duration: 0.3 }, 1.1)
        .to(dv[2], { opacity: 1, duration: 0.3 }, 1.7)
        .to("#diveScreen", { scale: 2.6, ease: "power2.in", duration: 1 }, 2.1)
        .to("#dive", { backgroundColor: "#f4f4f7", duration: 0.4 }, 2.6);

      /* ---------- billets « collés » au scroll ---------- */
      gsap.utils.toArray("[data-stick]").forEach((n, i) => {
        gsap.from(n, {
          y: -140, x: gsap.utils.random(-60, 60), rotation: gsap.utils.random(-22, 22), scale: 1.18, autoAlpha: 0,
          duration: 1, ease: "back.out(1.6)", delay: (i % 3) * 0.08, clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: n, start: "top 88%" },
        });
      });

      /* téléphones qui s'ouvrent en éventail */
      gsap.from("#phones .phone", { y: 160, rotation: 0, scale: 0.85, stagger: 0.1, duration: 1.1, ease: "back.out(1.3)", scrollTrigger: { trigger: "#phones", start: "top 85%" } });
      gsap.to("#phones", { scale: 1.08, ease: "none", scrollTrigger: { trigger: "#phones", start: "top bottom", end: "bottom top", scrub: true } });

      /* ---------- apps : défilement horizontal ---------- */
      if (desktop) {
        const track = document.getElementById("appsTrack");
        const hs = gsap.to(track, {
          x: () => -(track.scrollWidth - innerWidth), ease: "none",
          scrollTrigger: { trigger: "#apps", start: "top top", end: () => "+=" + (track.scrollWidth - innerWidth), scrub: 1, pin: true, invalidateOnRefresh: true },
        });
        /* zoom dans chaque capture à mesure qu'elle arrive au centre */
        track.querySelectorAll(".note").forEach((n) => {
          gsap.fromTo(n.querySelector(".note__img img"), { scale: 1.45, transformOrigin: "50% 0%" }, {
            scale: 1, ease: "none",
            scrollTrigger: { trigger: n, containerAnimation: hs, start: "left right", end: "center center", scrub: true },
          });
        });
      } else {
        gsap.utils.toArray("#appsTrack .note").forEach((n) => gsap.from(n, { y: 80, rotation: 8, autoAlpha: 0, duration: 0.9, clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: n, start: "top 88%" } }));
      }

      /* ---------- logos dessinés ---------- */
      gsap.utils.toArray(".draw-logo").forEach((svg) => {
        const t = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 85%" } });
        t.to(svg.querySelectorAll("path, circle, rect"), { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: "power2.inOut" })
          .from(svg.querySelectorAll("text"), { autoAlpha: 0, x: -20, duration: 0.8, stagger: 0.1 }, "-=0.9");
      });

      /* ---------- cartes services ---------- */
      gsap.set("[data-card]", { autoAlpha: 0, y: 50 });
      ScrollTrigger.batch("[data-card]", { start: "top 90%", onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, overwrite: true }) });
      document.querySelectorAll(".card").forEach((c) => c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
      }));

      /* compteurs */
      gsap.utils.toArray("[data-count]").forEach((el) => {
        const o = { v: 0 }, t = +el.dataset.count, suf = el.dataset.suffix || "";
        el.textContent = "0" + suf;
        gsap.to(o, { v: t, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%" }, onUpdate: () => (el.textContent = Math.round(o.v) + suf) });
      });

      /* ---------- curseur + boutons magnétiques ---------- */
      if (fine) {
        const cur = document.getElementById("cursor");
        const cx = gsap.quickTo(cur, "x", { duration: 0.35 }), cy = gsap.quickTo(cur, "y", { duration: 0.35 });
        window.addEventListener("pointermove", (e) => { cx(e.clientX); cy(e.clientY); cur.classList.add("on"); });
        document.querySelectorAll("[data-cursor]").forEach((el) => {
          el.addEventListener("pointerenter", () => { cur.textContent = el.dataset.cursor; cur.classList.add("big"); });
          el.addEventListener("pointerleave", () => { cur.textContent = ""; cur.classList.remove("big"); });
        });
        document.querySelectorAll("[data-magnet]").forEach((b) => {
          const mx = gsap.quickTo(b, "x", { duration: 0.4 }), my = gsap.quickTo(b, "y", { duration: 0.4 });
          b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.4); });
          b.addEventListener("pointerleave", () => { mx(0); my(0); });
        });
      }
    }
  );
}

window.addEventListener("load", () => { setFrames(); ScrollTrigger.refresh(); });
