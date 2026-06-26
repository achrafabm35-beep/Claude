/* =========================================================
   AS — animations GSAP
   Bonnes pratiques appliquées (skills GSAP officiels) :
   - registerPlugin(ScrollTrigger) une seule fois
   - gsap.defaults() pour des réglages globaux
   - transform aliases (x, y, scale) plutôt que width/top/left
   - autoAlpha plutôt qu'opacity pour les fondus
   - timelines plutôt que des delays chaînés
   - ScrollTrigger.batch() pour révéler les cartes
   - gsap.matchMedia() pour prefers-reduced-motion + responsive
   - ScrollTrigger sur les timelines de haut niveau uniquement
   ========================================================= */

document.documentElement.classList.add("js");

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ duration: 0.9, ease: "power3.out" });

/* Découpe un texte en mots enveloppés pour l'animation par lignes */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((w) => `<span class="rl-word"><span>${w}</span></span>`)
    .join(" ");
  return el.querySelectorAll(".rl-word > span");
}

window.addEventListener("load", () => {
  const mm = gsap.matchMedia();

  /* ---------- LOADER (timeline) ---------- */
  const loader = document.getElementById("loader");
  const countEl = document.getElementById("loaderCount");
  const counter = { v: 0 };

  const intro = gsap.timeline();
  intro
    .to(counter, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => (countEl.textContent = Math.round(counter.v)),
    })
    .to(".loader__mark", { autoAlpha: 0, y: -30, duration: 0.6 }, "+=0.15")
    .to(loader, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.2")
    .set(loader, { display: "none" })
    .add(heroIn, "-=0.5"); // enchaîne l'entrée du hero

  /* ---------- HERO (timeline) ---------- */
  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__title .word", {
      yPercent: 120,
      duration: 1.1,
      stagger: 0.08,
    })
      .to("[data-anim='eyebrow']", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.2)
      .fromTo(
        "[data-anim='eyebrow']",
        { y: 20 },
        { y: 0, duration: 0.8 },
        0.2
      )
      .to(
        "[data-anim='lead']",
        { autoAlpha: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo("[data-anim='lead']", { y: 24 }, { y: 0, duration: 0.8 }, "<")
      .to(
        "[data-anim='actions']",
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 },
        "-=0.6"
      )
      .fromTo(
        "[data-anim='actions']",
        { y: 24 },
        { y: 0, duration: 0.8, stagger: 0.1 },
        "<"
      );
  }

  /* ---------- PROGRESS BAR ---------- */
  gsap.to("#scrollProgress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  /* ---------- NAV : masquer au scroll vers le bas ---------- */
  let lastDir = 0;
  ScrollTrigger.create({
    start: "top -120",
    end: "max",
    onUpdate: (self) => {
      const dir = self.direction;
      if (dir === lastDir) return;
      lastDir = dir;
      gsap.to("#nav", {
        yPercent: dir === 1 ? -130 : 0,
        duration: 0.5,
        ease: "power2.out",
      });
    },
  });

  /* ---------- MARQUEE (boucle infinie, scroll-réactive) ---------- */
  const marquee = document.getElementById("marquee");
  const half = marquee.scrollWidth / 2;
  const loop = gsap.to(marquee, {
    x: -half,
    duration: 18,
    ease: "none",
    repeat: -1,
  });
  // accélère légèrement selon la vélocité du scroll
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const v = 1 + Math.min(Math.abs(self.getVelocity() / 300), 6);
      gsap.to(loop, { timeScale: v, duration: 0.3, overwrite: true });
      gsap.to(loop, { timeScale: 1, duration: 0.8, delay: 0.3 });
    },
  });

  /* ===================================================================
     Animations sensibles au mouvement : encapsulées dans matchMedia
     pour respecter prefers-reduced-motion (accessibilité).
     =================================================================== */
  mm.add(
    {
      animate: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (ctx) => {
      const { reduce } = ctx.conditions;

      /* --- Révélation des titres ligne par ligne --- */
      document.querySelectorAll(".reveal-lines").forEach((el) => {
        const words = splitWords(el);
        if (reduce) {
          gsap.set(words, { autoAlpha: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          words,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power4.out",
            stagger: 0.04,
            scrollTrigger: { trigger: el, start: "top 80%" },
          }
        );
      });

      if (reduce) {
        // Pas d'animation de mouvement : on affiche tout simplement
        gsap.set("[data-card], [data-anim]", { autoAlpha: 1, y: 0 });
        document.querySelectorAll("[data-count]").forEach((n) => {
          n.textContent = n.dataset.count;
        });
        return; // on s'arrête : pas de parallax / horizontal / batch animés
      }

      /* --- Révélation des cartes (ScrollTrigger.batch) --- */
      gsap.set("[data-card]", { y: 60, autoAlpha: 0 });
      ScrollTrigger.batch("[data-card]", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.to(els, {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.12,
            overwrite: true,
          }),
      });

      /* --- Parallax (transforms uniquement) --- */
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const depth = parseFloat(el.dataset.parallax) || 0.2;
        gsap.to(el, {
          yPercent: depth * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      /* --- Compteurs animés --- */
      gsap.utils.toArray("[data-count]").forEach((n) => {
        const target = +n.dataset.count;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: n, start: "top 90%" },
          onUpdate: () => (n.textContent = Math.round(obj.v)),
        });
      });

      /* --- Scroll horizontal (containerAnimation, ease:none) --- */
      const track = document.getElementById("showcaseTrack");
      const showcase = document.getElementById("showcase");
      if (track && showcase) {
        const getScroll = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -getScroll(),
          ease: "none", // requis pour un mapping 1:1 avec le scroll
          scrollTrigger: {
            trigger: showcase,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + getScroll(),
            invalidateOnRefresh: true,
          },
        });
      }

      // matchMedia révèle/cleanup automatiquement ; rien à retourner
    }
  );

  // Recalcule les positions une fois polices/images chargées
  ScrollTrigger.refresh();
});
