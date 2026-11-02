// WHATSAPP_NUMBER = 'PENDIENTE'
// Digits only, with country code, once the number is ready. Example: 17185551212
const WHATSAPP_NUMBER = 'PENDIENTE';

// PHONE_NUMBER = 'PENDIENTE'
// Digits only, with country code. Example: 17185551212
const PHONE_NUMBER = 'PENDIENTE';

window.GUARDERIA_SITE = {
  id: 'corderitos',
  basePath: '/guarderia-dfe200bb',
  name: { es: 'Corderitos', en: 'Corderitos' },
  descriptor: { es: 'Guardería Cristiana', en: 'Christian Day Care' },
  verse: {
    es: 'Isaías 40:11 — «en su brazo llevará los corderos»',
    en: 'Isaiah 40:11 — “He shall gather the lambs with his arm, and carry them in his bosom”',
  },
  music: {
    src: '/guarderia-dfe200bb/audio/music.mp3',
    credit: {
      es:
        'Música: Robert Schumann, «Träumerei» (Kinderszenen, Op. 15). Interpretación de dominio público vía Musopen / Wikimedia Commons.',
      en:
        'Music: Robert Schumann, “Träumerei” (Kinderszenen, Op. 15). Public-domain performance via Musopen / Wikimedia Commons.',
    },
  },
};

window.GUARDERIA_SITE.whatsappNumber = WHATSAPP_NUMBER;
window.GUARDERIA_SITE.phoneNumber = PHONE_NUMBER;

window.GUARDERIA_COPY_OVERRIDES = {
  es: {
    'meta.title': 'Corderitos — Guardería Cristiana (borrador)',
    'legal.name': '[NOMBRE LEGAL — p. ej. Corderitos Family Day Care LLC, PENDIENTE]',
    'hero.verse.quote': '«en su brazo llevará los corderos»',
    'hero.verse.cite': 'Isaías 40:11 (Reina-Valera 1960)',
    'footer.provider': 'Yodernis Crooke — Corderitos Guardería Cristiana (borrador)',
  },
  en: {
    'meta.title': 'Corderitos — Christian Day Care (draft)',
    'legal.name': '[LEGAL NAME — e.g. Corderitos Family Day Care LLC, PENDING]',
    'hero.verse.quote':
      '“He shall gather the lambs with his arm, and carry them in his bosom”',
    'hero.verse.cite': 'Isaiah 40:11 (King James Version)',
    'footer.provider': 'Yodernis Crooke — Corderitos Christian Day Care (draft)',
  },
};
