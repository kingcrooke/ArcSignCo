/**
 * Progressive before/after compare: side-by-side without JS; draggable slider when JS runs.
 */
(function initBeforeAfter() {
  const roots = document.querySelectorAll("[data-before-after]");
  if (!roots.length) return;
  document.documentElement.classList.add("ba-js");

  for (const root of roots) {
    const range = root.querySelector(".ba-range");
    const afterWrap = root.querySelector(".ba-after-wrap");
    if (!range || !afterWrap) continue;

    const sync = () => {
      const pct = Number(range.value);
      afterWrap.style.clipPath = `inset(0 0 0 ${100 - pct}%)`;
      root.style.setProperty("--ba-pct", `${pct}%`);
    };
    range.addEventListener("input", sync);
    range.addEventListener("change", sync);
    sync();
  }
})();