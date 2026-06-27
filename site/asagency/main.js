/* =========================================================
   AS._agency — animations GSAP
   - registerPlugin(ScrollTrigger) une fois
   - timeline d'entrée du hero (titre révélé mot par mot)
   - blobs animés, marquee infini réactif au scroll
   - compteurs de stats, révélations au scroll (batch)
   - gsap.matchMedia() pour respecter prefers-reduced-motion
   ========================================================= */

document.documentElement.classList.add("js");
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out" });

const mm = gsap.matchMedia();

/* ---------- Barre de progression ---------- */
gsap.to("#scrollProgress", {
  scaleX: 1, ease: "none",
  scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
});

/* ---------- Nav : masquer en descendant ---------- */
let lastDir = 0;
ScrollTrigger.create({
  start: "top -100", end: "max",
  onUpdate: (self) => {
    if (self.direction === lastDir) return;
    lastDir = self.direction;
    gsap.to("#nav", { yPercent: self.direction === 1 ? -120 : 0, duration: 0.5 });
  },
});

mm.add(
  {
    animate: "(prefers-reduced-motion: no-preference)",
    reduce: "(prefers-reduced-motion: reduce)",
  },
  (ctx) => {
    const { reduce } = ctx.conditions;

    /* ---------- HERO ---------- */
    if (reduce) {
      gsap.set("[data-anim], .hero__title .word", { autoAlpha: 1, y: 0 });
    } else {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__title .word", { yPercent: 115, duration: 1, stagger: 0.06 })
        .to("[data-anim]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.3)
        .from("[data-anim]", { y: 22, duration: 0.8, stagger: 0.12 }, 0.3);

      /* blobs flottants */
      gsap.to(".blob--1", { x: -60, y: 50, scale: 1.1, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob--2", { x: 70, y: -40, scale: 1.15, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob--3", { x: -50, y: -60, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    /* ---------- Marquee infini ---------- */
    const marquee = document.getElementById("marquee");
    if (marquee && !reduce) {
      const half = marquee.scrollWidth / 2;
      const loop = gsap.to(marquee, { x: -half, duration: 22, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          const v = 1 + Math.min(Math.abs(self.getVelocity() / 320), 6);
          gsap.to(loop, { timeScale: v, duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: 1, duration: 0.8, delay: 0.3 });
        },
      });
    }

    /* ---------- Révélations génériques ---------- */
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      if (reduce) return gsap.set(el, { autoAlpha: 1, y: 0 });
      gsap.fromTo(el, { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: el, start: "top 86%" } });
    });

    /* ---------- Cartes (batch) ---------- */
    if (reduce) {
      gsap.set("[data-card]", { autoAlpha: 1, y: 0 });
    } else {
      gsap.set("[data-card]", { autoAlpha: 0, y: 50 });
      ScrollTrigger.batch("[data-card]", {
        start: "top 88%",
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, overwrite: true }),
      });
    }

    /* ---------- Compteurs ---------- */
    gsap.utils.toArray("[data-count]").forEach((el) => {
      const target = +el.dataset.count;
      const pre = el.dataset.prefix || "";
      const suf = el.dataset.suffix || "";
      if (reduce) { el.textContent = pre + target + suf; return; }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%" },
        onUpdate: () => (el.textContent = pre + Math.round(obj.v) + suf),
      });
    });
  }
);

window.addEventListener("load", () => ScrollTrigger.refresh());
