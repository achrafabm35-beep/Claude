/* =========================================================
   Effets partagés des sites d'exemple — AS Marketing Agency
   Attributs :
   data-split      titre révélé mot par mot
   data-reveal     apparition en fondu + montée
   data-zoom       zoom au scroll (data-zoom="1.35" = échelle de départ)
   data-zoomout    agrandissement au scroll (ex. titre qui « traverse » l'écran)
   data-parallax   décalage vertical (data-parallax="-20" en %)
   data-tilt       inclinaison 3D au survol
   data-count      compteur animé
   data-hscroll    section à défilement horizontal épinglée
   data-marquee    bandeau infini
   ?shot           (dans l'URL) fige les animations pour les captures
   ========================================================= */
(function () {
  const SHOT = /[?&]shot/.test(location.search);
  document.documentElement.classList.add("js");
  if (SHOT) document.documentElement.classList.add("shot");
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });

  /* découpe des titres en mots */
  const splitNode = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(part));
          const w = document.createElement("span"); w.className = "w";
          const wi = document.createElement("span"); wi.className = "wi"; wi.textContent = part;
          w.appendChild(wi); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") splitNode(n);
    });
  };
  document.querySelectorAll("[data-split]").forEach(splitNode);

  if (SHOT) {
    gsap.set("[data-reveal], .wi", { autoAlpha: 1, y: 0, yPercent: 0 });
    document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = (el.dataset.prefix || "") + el.dataset.count + (el.dataset.suffix || "")));
    return;
  }

  const mm = gsap.matchMedia();
  mm.add({ ok: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
    const { reduce } = ctx.conditions;
    if (reduce) {
      gsap.set("[data-reveal], .wi", { autoAlpha: 1, y: 0, yPercent: 0 });
      document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = (el.dataset.prefix || "") + el.dataset.count + (el.dataset.suffix || "")));
      return;
    }

    gsap.utils.toArray("[data-split]").forEach((el, i) => {
      gsap.from(el.querySelectorAll(".wi"), {
        yPercent: 110, duration: 1.1, stagger: 0.06, ease: "power4.out", delay: i === 0 ? 0.2 : 0,
        scrollTrigger: i === 0 ? undefined : { trigger: el, start: "top 85%" },
      });
    });

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1, scrollTrigger: { trigger: el, start: "top 88%" } });
    });

    gsap.utils.toArray("[data-zoom]").forEach((el) => {
      const s = parseFloat(el.dataset.zoom) || 1.3;
      gsap.fromTo(el, { scale: s }, { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    gsap.utils.toArray("[data-zoomout]").forEach((el) => {
      const s = parseFloat(el.dataset.zoomout) || 6;
      const host = el.closest("[data-pin]") || el.parentElement;
      gsap.to(el, { scale: s, ease: "power2.in", scrollTrigger: { trigger: host, start: "top top", end: "+=120%", scrub: true, pin: !!el.closest("[data-pin]") } });
    });

    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      gsap.to(el, { yPercent: parseFloat(el.dataset.parallax) || -20, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    gsap.utils.toArray("[data-count]").forEach((el) => {
      const o = { v: 0 }, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      gsap.to(o, { v: +el.dataset.count, duration: 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => (el.textContent = pre + Math.round(o.v) + suf) });
    });

    gsap.utils.toArray("[data-hscroll]").forEach((sec) => {
      const track = sec.querySelector("[data-track]");
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 40), ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + (track.scrollWidth - window.innerWidth), scrub: 1, pin: true, invalidateOnRefresh: true },
      });
    });

    gsap.utils.toArray("[data-marquee]").forEach((m) => {
      gsap.to(m, { xPercent: -50, duration: parseFloat(m.dataset.marquee) || 20, ease: "none", repeat: -1 });
    });

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.5 }), ry = gsap.quickTo(card, "rotationY", { duration: 0.5 });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 16);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 16);
      });
      card.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
