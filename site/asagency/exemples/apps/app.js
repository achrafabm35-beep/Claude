/* Petits utilitaires partagés des apps d'exemple */
(function () {
  if (/[?&]shot/.test(location.search)) document.documentElement.classList.add("shot");
  const SHOT = document.documentElement.classList.contains("shot");
  const fmt = (n, d) => n.toLocaleString("fr-FR", { maximumFractionDigits: d || 0, minimumFractionDigits: d || 0 });
  window.countUp = (root) => {
    (root || document).querySelectorAll("[data-n]").forEach((el) => {
      const t = parseFloat(el.dataset.n), d = +(el.dataset.d || 0), pre = el.dataset.pre || "", suf = el.dataset.suf || "";
      if (SHOT) { el.textContent = pre + fmt(t, d) + suf; return; }
      const t0 = performance.now(), dur = 1400;
      const step = (now) => {
        const k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + fmt(t * e, d) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  /* navigation entre vues : <a data-view="x"> / <section class="view" id="v-x"> */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-view]");
    if (!a) return;
    e.preventDefault();
    document.querySelectorAll("[data-view]").forEach((x) => x.classList.toggle("on", x.dataset.view === a.dataset.view));
    document.querySelectorAll(".view").forEach((v) => {
      const on = v.id === "v-" + a.dataset.view;
      v.classList.toggle("on", on);
      if (on) { v.querySelectorAll(".rise, .bar i, .draw").forEach((n) => { n.style.animation = "none"; n.offsetHeight; n.style.animation = ""; }); countUp(v); }
    });
  });
  /* chips exclusives dans un même groupe */
  document.addEventListener("click", (e) => {
    const c = e.target.closest(".chips .chip");
    if (!c) return;
    c.parentElement.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === c));
  });
  window.addEventListener("DOMContentLoaded", () => countUp());
})();
