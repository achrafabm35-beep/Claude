/* =========================================================
   EasyVapo — animations GSAP
   - registerPlugin(ScrollTrigger) une fois
   - section épinglée + scrub : le bouchon se retire au scroll,
     le gicleur apparaît, une vaporisation jaillit, le niveau se recharge
   - textes synchronisés (steps) avec le défilement
   - gsap.matchMedia() pour respecter prefers-reduced-motion
   - transforms / autoAlpha plutôt que propriétés de layout
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
      if (reduce) {
        gsap.set(el, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    /* =========================================================
       SCÈNE ÉPINGLÉE : le bouchon se retire au défilement
       ========================================================= */
    const steps = gsap.utils.toArray(".step");

    if (reduce) {
      // Accessibilité : pas d'animation au scroll, on montre l'état final
      gsap.set("#cap", { autoAlpha: 0 });
      gsap.set(".spray", { autoAlpha: 0 });
      gsap.set(steps, { autoAlpha: 0 });
      gsap.set('[data-step="0"]', { autoAlpha: 1 });
      gsap.set("#liquid", { attr: { y: 215, height: 187 } });
      return;
    }

    // états initiaux
    gsap.set(steps, { autoAlpha: 0, y: 24 });
    gsap.set('[data-step="0"]', { autoAlpha: 1, y: 0 });
    gsap.set(".spray", { autoAlpha: 0 });
    gsap.set(".spray circle", { transformOrigin: "110px 96px", scale: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: "#stage",
        start: "top top",
        end: "+=2400",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // 1) Le bouchon se soulève et s'efface
    tl.to(".stage__hint", { autoAlpha: 0, duration: 0.08 }, 0)
      .to("#cap", { y: -170, rotation: 7, transformOrigin: "50% 50%", duration: 0.28 }, 0)
      .to('[data-step="0"]', { autoAlpha: 0, y: -24, duration: 0.12 }, 0.06)
      .fromTo('[data-step="1"]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.14)
      .to("#cap", { y: -300, autoAlpha: 0, duration: 0.2 }, 0.2)
      .fromTo("#nozzle", { y: 8 }, { y: 0, duration: 0.18 }, 0.18)

      // 2) La vaporisation jaillit
      .to('[data-step="1"]', { autoAlpha: 0, y: -24, duration: 0.1 }, 0.4)
      .fromTo('[data-step="2"]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.46)
      .to(".spray", { autoAlpha: 1, duration: 0.05 }, 0.43)
      .to(".spray circle", { scale: 1, duration: 0.12, stagger: 0.012 }, 0.44)
      .to(
        ".spray circle",
        { y: -34, x: (i) => (i - 3) * 12, autoAlpha: 0, duration: 0.22, stagger: 0.012 },
        0.54
      )
      .set(".spray", { autoAlpha: 0 }, 0.78)

      // 3) La recharge : le niveau remonte
      .to('[data-step="2"]', { autoAlpha: 0, y: -24, duration: 0.1 }, 0.74)
      .fromTo('[data-step="3"]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.8)
      .fromTo(
        "#liquid",
        { attr: { y: 392, height: 10 } },
        { attr: { y: 215, height: 187 }, duration: 0.24 },
        0.78
      );

    return () => tl.kill();
  }
);

/* =========================================================
   Sélecteur de couleurs (recolore le produit instantanément
   + petit rebond) — hors matchMedia, simple et fiable
   ========================================================= */
const root = document.documentElement;
const colorName = document.getElementById("colorName");
const miniVapo = document.getElementById("miniVapo");

document.querySelectorAll(".swatch").forEach((sw) => {
  sw.addEventListener("click", () => {
    document.querySelector(".swatch.is-active")?.classList.remove("is-active");
    sw.classList.add("is-active");

    root.style.setProperty("--c1", sw.dataset.c1);
    root.style.setProperty("--c2", sw.dataset.c2);
    root.style.setProperty("--c3", sw.dataset.c3);
    if (colorName) colorName.textContent = sw.dataset.name;

    // petit rebond du flacon (respecte reduced-motion)
    if (miniVapo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(miniVapo, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    }
  });
});

/* Recalcule les positions une fois la police chargée */
window.addEventListener("load", () => ScrollTrigger.refresh());
