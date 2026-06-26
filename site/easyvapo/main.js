/* =========================================================
   EasyVapo — animations GSAP (produit photographié réel)
   - registerPlugin(ScrollTrigger) une fois
   - section épinglée + scrub : le vrai bouchon se retire au scroll,
     le gicleur apparaît, une vaporisation jaillit, le niveau se recharge
   - textes synchronisés (steps) avec le défilement
   - gsap.matchMedia() pour respecter prefers-reduced-motion
   - transforms / autoAlpha uniquement
   ========================================================= */

document.documentElement.classList.add("js");
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out" });

const mm = gsap.matchMedia();

mm.add(
  {
    animate: "(prefers-reduced-motion: no-preference)",
    reduce: "(prefers-reduced-motion: reduce)",
  },
  (ctx) => {
    const { reduce } = ctx.conditions;

    /* --- Révélations génériques --- */
    gsap.utils.toArray(".reveal").forEach((el) => {
      if (reduce) return gsap.set(el, { autoAlpha: 1, y: 0 });
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: el, start: "top 85%" } }
      );
    });

    const steps = gsap.utils.toArray(".step");
    const particles = gsap.utils.toArray(".spray i");

    /* --- Mode accessibilité : pas d'animation au scroll --- */
    if (reduce) {
      gsap.set("#cap", { xPercent: 46, yPercent: -58, rotation: 16 }); // bouchon retiré
      gsap.set(".spray", { autoAlpha: 0 });
      gsap.set("#level", { scaleY: 1, rotation: -3, transformOrigin: "50% 100%" });
      gsap.set(steps, { autoAlpha: 0 });
      gsap.set('[data-step="0"]', { autoAlpha: 1 });
      return;
    }

    /* --- états initiaux --- */
    gsap.set(steps, { autoAlpha: 0, y: 24 });
    gsap.set('[data-step="0"]', { autoAlpha: 1, y: 0 });
    gsap.set(".spray", { autoAlpha: 0 });
    gsap.set(particles, { x: 0, y: 0, scale: 0, transformOrigin: "50% 50%" });
    gsap.set("#level", { scaleY: 0, rotation: -3, transformOrigin: "50% 100%" });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: "#stage",
        start: "top top",
        end: "+=2600",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // 1) Le bouchon se retire (translation + légère rotation)
    tl.to(".stage__hint", { autoAlpha: 0, duration: 0.06 }, 0)
      .to("#cap", { xPercent: 46, yPercent: -58, rotation: 16, duration: 0.34, ease: "power2.inOut" }, 0)
      .to('[data-step="0"]', { autoAlpha: 0, y: -24, duration: 0.12 }, 0.06)
      .fromTo('[data-step="1"]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.16)
      .to("#cap", { xPercent: 90, yPercent: -90, rotation: 26, autoAlpha: 0, duration: 0.18 }, 0.34)

      // 2) La vaporisation jaillit du gicleur
      .to('[data-step="1"]', { autoAlpha: 0, y: -24, duration: 0.1 }, 0.42)
      .fromTo('[data-step="2"]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.48)
      .set(".spray", { autoAlpha: 1 }, 0.44)
      .to(particles, { scale: 1, duration: 0.08, stagger: 0.008 }, 0.45)
      .to(
        particles,
        {
          x: (i) => (i - 3) * 26 + gsap.utils.random(-10, 10),
          y: () => gsap.utils.random(-70, -150),
          scale: 0,
          autoAlpha: 0,
          duration: 0.22,
          ease: "power2.out",
          stagger: 0.01,
        },
        0.5
      )
      .set(".spray", { autoAlpha: 0 }, 0.78)

      // 3) La recharge : le niveau remonte dans la fenêtre
      .to('[data-step="2"]', { autoAlpha: 0, y: -24, duration: 0.1 }, 0.76)
      .fromTo('[data-step="3"]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.82)
      .to("#level", { scaleY: 1, duration: 0.22 }, 0.8);

    return () => tl.kill();
  }
);

/* =========================================================
   Sélecteur de couleurs : filtres CSS appliqués à la vraie photo
   ========================================================= */
const root = document.documentElement;
const colorName = document.getElementById("colorName");
const miniVapo = document.getElementById("miniVapo");
const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".swatch").forEach((sw) => {
  sw.addEventListener("click", () => {
    document.querySelector(".swatch.is-active")?.classList.remove("is-active");
    sw.classList.add("is-active");

    const filter = sw.dataset.filter === "none" ? "none" : sw.dataset.filter;
    if (miniVapo) miniVapo.style.filter =
      "drop-shadow(0 30px 40px rgba(0,0,0,0.5)) " + (filter === "none" ? "" : filter);
    root.style.setProperty("--glow", sw.style.getPropertyValue("--s") || "#7d8aa6");
    if (colorName) colorName.textContent = sw.dataset.name;

    if (miniVapo && !reduceMQ.matches) {
      gsap.fromTo(miniVapo, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    }
  });
});

/* Recalcule les positions une fois les images/police chargées */
window.addEventListener("load", () => ScrollTrigger.refresh());
