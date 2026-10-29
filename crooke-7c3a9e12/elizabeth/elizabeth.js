const STORAGE_LANG = "crooke-heritage-lang";

function applyLang(lang) {
  const next = lang === "es" ? "es" : "en";
  document.documentElement.lang = next;
  document.querySelectorAll("[data-lang-btn]").forEach(btn => {
    btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-btn") === next ? "true" : "false");
  });
  document.title =
    next === "es" ? "Elizabeth Crooke — Libro de los Crooke" : "Elizabeth Crooke — Book of the Crookes";
}

document.addEventListener("DOMContentLoaded", () => {
  let lang = document.documentElement.lang === "es" ? "es" : "en";
  try {
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved === "es" || saved === "en") lang = saved;
  } catch {
    /* keep the language already on the document */
  }
  applyLang(lang);
  document.querySelectorAll("[data-lang-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-lang-btn");
      try {
        localStorage.setItem(STORAGE_LANG, next);
      } catch {
        /* the toggle still applies for this visit */
      }
      applyLang(next);
    });
  });
});
