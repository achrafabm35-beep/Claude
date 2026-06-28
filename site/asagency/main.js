/* =========================================================
   AS Marketing Agency — animations GSAP
   - registerPlugin(ScrollTrigger) une fois
   - hero : titre révélé mot par mot + mot rotatif (boostée / magnifiée…)
   - logo & halo flottants, chips en lévitation, blobs animés
   - marquee réactif au scroll, compteurs, révélations (batch)
   - gsap.matchMedia() pour respecter prefers-reduced-motion
   ========================================================= */

document.documentElement.classList.add("js");
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out" });

const mm = gsap.matchMedia();

/* Barre de progression */
gsap.to("#scrollProgress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

/* Nav : masquer en descendant */
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
      tl.from(".hero__title .word", { yPercent: 115, duration: 1, stagger: 0.07 })
        .from(".rot", { yPercent: 115, duration: 0.9 }, "-=0.6")
        .to("[data-anim]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.25)
        .from("[data-anim]", { y: 24, duration: 0.8, stagger: 0.1 }, 0.25);

      /* halo qui tourne, logo + chips en lévitation */
      gsap.to(".hero__halo", { rotation: 360, duration: 40, repeat: -1, ease: "none" });
      gsap.to(".hero__logo", { y: 16, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.utils.toArray(".chip").forEach((c, i) => {
        gsap.to(c, { y: i % 2 ? 18 : -18, x: i % 2 ? -10 : 10, duration: 4 + i, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.3 });
      });

      /* blobs */
      gsap.to(".blob--1", { x: -60, y: 50, scale: 1.1, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob--2", { x: 70, y: -40, scale: 1.15, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob--3", { x: -50, y: -60, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" });

      /* léger parallax du logo au scroll */
      gsap.to(".hero__visual", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }

    /* ---------- Mot rotatif ---------- */
    const rot = document.querySelector(".rot");
    if (rot) {
      const words = JSON.parse(rot.dataset.words || "[]");
      if (!reduce && words.length > 1) {
        let i = 0;
        const cycle = () => {
          const next = words[(i + 1) % words.length];
          const tl = gsap.timeline({ onComplete: () => { i = (i + 1) % words.length; gsap.delayedCall(1.6, cycle); } });
          tl.to(rot, { yPercent: -110, autoAlpha: 0, duration: 0.45, ease: "power2.in" })
            .add(() => { rot.textContent = next; })
            .fromTo(rot, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" });
        };
        gsap.delayedCall(2, cycle);
      }
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

    /* ---------- Révélations ---------- */
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      if (reduce) return gsap.set(el, { autoAlpha: 1, y: 0 });
      gsap.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: el, start: "top 86%" } });
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
      const target = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      if (reduce) { el.textContent = pre + target + suf; return; }
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%" }, onUpdate: () => (el.textContent = pre + Math.round(obj.v) + suf) });
    });
  }
);

window.addEventListener("load", () => ScrollTrigger.refresh());
