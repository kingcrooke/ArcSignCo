/**
 * Renders [data-arc-testimonials] when ARC_TESTIMONIALS has at least one entry; otherwise renders nothing.
 */
(function renderArcTestimonials() {
  const items = window.ARC_TESTIMONIALS;
  if (!Array.isArray(items) || items.length === 0) return;

  document.querySelectorAll("[data-arc-testimonials]").forEach((host) => {
    const section = document.createElement("section");
    section.className = "section alt arc-testimonials";
    section.setAttribute("aria-labelledby", "arc-testimonials-heading");

    const wrap = document.createElement("div");
    wrap.className = "wrap";

    const head = document.createElement("div");
    head.className = "section-head";
    head.innerHTML =
      '<span class="eyebrow">Testimonials</span><h2 id="arc-testimonials-heading">What clients say</h2>';
    wrap.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "card-grid";
    grid.setAttribute("role", "list");

    for (const item of items) {
      if (!item?.quote || !item?.attribution) continue;
      const card = document.createElement("article");
      card.className = "info-card arc-testimonial-card";
      card.setAttribute("role", "listitem");
      const quote = document.createElement("blockquote");
      quote.textContent = item.quote;
      const cite = document.createElement("p");
      cite.className = "arc-testimonial-attribution";
      cite.textContent = item.context
        ? `${item.attribution} — ${item.context}`
        : item.attribution;
      card.append(quote, cite);
      grid.appendChild(card);
    }

    if (!grid.children.length) return;

    wrap.appendChild(grid);
    section.appendChild(wrap);
    host.replaceWith(section);
  });
})();