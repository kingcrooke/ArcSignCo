# Testimonials (`ARC_TESTIMONIALS`)

The site loads `testimonials-data.js` and `testimonials.js` on pages that include a `<div data-arc-testimonials hidden></div>` placeholder. When the data array is **empty**, the section is not shown on the live page.

## Add a quote

1. Open `assets/js/testimonials-data.js`.
2. Add an object Jesus has approved for publication:

```javascript
window.ARC_TESTIMONIALS = [
  {
    quote: "Exact client words here.",
    attribution: "Name, company or role",
    context: "Optional short project label",
  },
];
```

3. Deploy. Do not invent quotes or use placeholders in production.