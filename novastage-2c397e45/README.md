# NovaStage LLC — Marketing Website & Brand Package

Static marketing site and printable brand guidelines for **NovaStage LLC**, a New York performing arts company (arts education and professional production).

## Preview locally

No build step required. From the repository root:

```bash
python3 -m http.server 8847
```

Then open [http://127.0.0.1:8847](http://127.0.0.1:8847) for the website and [http://127.0.0.1:8847/brand/index.html](http://127.0.0.1:8847/brand/index.html) for brand guidelines.

## Structure

| Path | Description |
|------|-------------|
| `index.html` | One-page marketing site |
| `css/` | Site styles and design tokens |
| `js/main.js` | Navigation, reveal animations, contact form placeholder |
| `assets/logos/` | Approved JPG lockups + SVG wordmark variants |
| `assets/icons/favicon.svg` | App icon (gold star on charcoal) |
| `brand/index.html` | Brand guidelines (print to PDF) |
| `brand/templates/` | Social, print, and email HTML templates |
| `brand/exports/` | PNG exports of templates (generated) |
| `netlify.toml` | Netlify static publish config |

## Contact & email

Use `hello@yourdomain.com` until your domain is confirmed. The contact form is UI-only (TODO: wire Netlify Forms or another handler).

## Deploy

Ready for Netlify: publish directory is the repo root (`netlify.toml` included). Do not deploy until you are ready to connect forms and final email DNS.
