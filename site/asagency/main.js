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

/* vitrine des applications */
let appJump = null, curApp = -1;
function setApp(i) {
  if (i === curApp) return;
  curApp = i;
  const meta = (window.APPS || [])[i] || {};
  document.querySelectorAll("#applist button").forEach((b) => b.classList.toggle("on", +b.dataset.i === i));
  document.querySelectorAll("#screen .shot").forEach((im) => im.classList.toggle("on", +im.dataset.i === i));
  document.querySelectorAll("#pip img").forEach((im) => im.classList.toggle("on", +im.dataset.i === i));
  document.getElementById("pip")?.classList.toggle("hide", !meta.pip);
  const cta = document.getElementById("screenCta");
  if (cta) { cta.classList.toggle("show", !!meta.demo); if (meta.demo) document.getElementById("demoLink").href = meta.demo; }
}
document.querySelectorAll("#applist button").forEach((b) => b.addEventListener("click", () => (appJump ? appJump(+b.dataset.i) : setApp(+b.dataset.i))));
setApp(0);

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
        gsap.set("[data-anim], [data-reveal], .wi, .hero__title .word, .htile, .hwall__plane", { autoAlpha: 1, y: 0, yPercent: 0 });
        document.querySelectorAll(".mw").forEach((w) => (w.style.opacity = 1));
        document.querySelectorAll(".draw-logo *").forEach((p) => (p.style.strokeDashoffset = 0));
        return;
      }

      /* ---------- INTRO + ACCUEIL (mur de réalisations) ---------- */
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(curtain, { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.75, onComplete: () => curtain.classList.add("gone") })
        .from(".hwall__plane", { scale: 2.4, rotationX: 0, rotationZ: 0, autoAlpha: 0, duration: 2.2, ease: "expo.out" }, "-=0.6")
        .from(".htile", { autoAlpha: 0, y: 120, duration: 1.4, stagger: { each: 0.025, from: "random" }, clearProps: "opacity,visibility,transform" }, "<0.1")
        .from(".hero__title .word", { yPercent: 115, duration: 1.1, stagger: 0.12 }, "<0.5")
        .from(".hero__scroll", { autoAlpha: 0, y: -10, duration: 0.8 }, "-=0.4");

      /* le mur suit légèrement la souris */
      const wall = document.querySelector(".hwall");
      if (fine && wall) {
        const rx = gsap.quickTo(wall, "rotationX", { duration: 1.2 }), ry = gsap.quickTo(wall, "rotationY", { duration: 1.2 });
        window.addEventListener("pointermove", (e) => { ry((e.clientX / innerWidth - 0.5) * 8); rx(-(e.clientY / innerHeight - 0.5) * 6); });
      }

      /* au défilement : on plonge dans le mur, la phrase s'envole */
      const plunge = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "#hero", start: "top top", end: "+=80%", scrub: 0.6, pin: true, anticipatePin: 1 } });
      plunge.to(".hwall__plane", { scale: 2.3, rotationX: 8, rotationZ: -4, duration: 1 }, 0)
        .to(".hero__title", { scale: 1.6, autoAlpha: 0, filter: "blur(10px)", duration: 0.6 }, 0)
        .to(".hero__scroll", { autoAlpha: 0, duration: 0.15 }, 0)
        .to(".hero__veil", { opacity: 0.4, duration: 0.5 }, 0)
        .to(".hwall", { autoAlpha: 0.35, duration: 0.4 }, 0.6);

      /* barre de navigation claire sur l'accueil sombre */
      const navEl = document.getElementById("nav");
      ScrollTrigger.create({ trigger: "#hero", start: "top top", end: "bottom 60", onLeave: () => navEl.classList.remove("on-dark"), onEnterBack: () => navEl.classList.add("on-dark") });

      /* blobs */
      gsap.to(".blob--1", { x: -60, y: 50, scale: 1.1, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob--2", { x: 70, y: -40, scale: 1.15, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".blob--3", { x: -50, y: -60, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" });


      /* ---------- MacBook : pivote, s'ouvre, puis l'application défile à l'écran ---------- */
      const macPage = document.getElementById("macPage");
      if (macPage) {
        const lid = document.getElementById("macLid"), scr = document.getElementById("macScreen"), back = document.getElementById("macBack");
        // visibilité selon l'angle du couvercle (évite l'écran vu « de dos », y compris sur Safari)
        const faces = () => {
          const a = gsap.getProperty(lid, "rotationX");
          gsap.set(scr, { autoAlpha: gsap.utils.clamp(0, 1, (a + 72) / 14) });
          gsap.set(back, { autoAlpha: gsap.utils.clamp(0, 1, (-a - 40) / 14) });
        };
        const mac = gsap.timeline({ defaults: { ease: "none" }, onUpdate: faces, scrollTrigger: { trigger: "#mac", start: "top top", end: "+=240%", scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true } });
        mac.fromTo("#macRig", { rotation: 0, rotationY: -36, rotationX: -22, scale: 0.86 }, { rotation: 0, rotationY: 0, rotationX: -14, scale: 1, duration: 1.2, ease: "power2.inOut" }, 0)
          .fromTo(lid, { rotationX: -90 }, { rotationX: -2, duration: 1, ease: "power2.inOut" }, 0.3)
          .to(macPage, { y: () => -(macPage.offsetHeight - macPage.parentElement.offsetHeight), duration: 1.6, ease: "power1.inOut" }, 1.35);
        faces();
      }

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

      /* ---------- éléments qui se redressent en 3D à l'apparition ---------- */
      gsap.utils.toArray("[data-rise]").forEach((n, i) => {
        gsap.from(n, {
          y: 90, rotationX: 28, transformPerspective: 1200, transformOrigin: "50% 100%", autoAlpha: 0, scale: 0.94,
          duration: 1.2, ease: "power4.out", delay: (i % 3) * 0.08, clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: n, start: "top 90%" },
        });
      });
      gsap.from(".ads .ad", { y: 100, rotationX: 25, transformPerspective: 1200, autoAlpha: 0, stagger: 0.12, duration: 1.2, ease: "power4.out", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: ".ads", start: "top 85%" } });

      /* téléphones */
      gsap.from("#phones .device", { y: 180, scale: 0.85, stagger: 0.1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: "#phones", start: "top 88%" } });

      /* ---------- applications : vitrine épinglée ---------- */
      gsap.from("#screen .frame", { rotationX: 35, y: 120, scale: 0.85, autoAlpha: 0, duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: "#showcase", start: "top 80%" } });
      if (desktop) {
        const n = (window.APPS || []).length;
        ScrollTrigger.create({
          trigger: "#showcase", start: "top top", end: () => "+=" + n * 70 + "%", pin: true,
          onUpdate: (self) => setApp(Math.min(n - 1, Math.floor(self.progress * n))),
        });
        appJump = (i) => {
          const st = ScrollTrigger.getAll().find((t) => t.pin === document.getElementById("showcase"));
          if (st) window.scrollTo({ top: st.start + (st.end - st.start) * ((i + 0.5) / n), behavior: "smooth" });
        };
      }
      /* mur d'écrans qui glisse avec le scroll */
      gsap.utils.toArray("[data-wall]").forEach((r) => {
        const dir = +r.dataset.wall;
        gsap.fromTo(r, { xPercent: dir > 0 ? -30 : 0 }, { xPercent: dir > 0 ? 0 : -30, ease: "none", scrollTrigger: { trigger: ".wall", start: "top bottom", end: "bottom top", scrub: true } });
      });

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
