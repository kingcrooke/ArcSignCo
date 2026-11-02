// WHATSAPP_NUMBER = 'PENDIENTE'
// Digits only, with country code, once the number is ready. Example: 17185551212
const WHATSAPP_NUMBER = 'PENDIENTE';

// PHONE_NUMBER = 'PENDIENTE'
// Digits only, with country code. Example: 17185551212
const PHONE_NUMBER = 'PENDIENTE';

window.GUARDERIA_SITE = {
  id: 'v5',
  basePath: '/guarderia-dfe200bb/v5',
  name: { es: 'Luz del Hogar', en: 'Luz del Hogar' },
  descriptor: { es: 'Guardería Cristiana', en: 'Christian Day Care' },
  verse: {
    es: 'Mateo 5:14 — «Vosotros sois la luz del mundo»',
    en: 'Matthew 5:14 — “Ye are the light of the world”',
  },
  music: {
    src: '/guarderia-dfe200bb/v5/audio/music.mp3',
    credit: {
      es:
        'Música: Erik Satie, Gymnopédie No. 1. Interpretación: Kevin MacLeod — Wikimedia Commons (CC BY 3.0).',
      en:
        'Music: Erik Satie, Gymnopédie No. 1. Performance: Kevin MacLeod — Wikimedia Commons (CC BY 3.0).',
    },
  },
};

window.GUARDERIA_SITE.whatsappNumber = WHATSAPP_NUMBER;
window.GUARDERIA_SITE.phoneNumber = PHONE_NUMBER;

window.GUARDERIA_COPY_OVERRIDES = {
  es: {
    'meta.title': 'Luz del Hogar — Guardería Cristiana (borrador v5)',
    'legal.name': '[NOMBRE LEGAL — p. ej. Luz del Hogar Family Day Care LLC, PENDIENTE]',
    'hero.verse.quote': '«Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder»',
    'hero.verse.cite': 'Mateo 5:14 (Reina-Valera 1960)',
    'footer.provider': 'Yodernis Crooke — Luz del Hogar Guardería Cristiana (borrador v5)',
  },
  en: {
    'meta.title': 'Luz del Hogar — Christian Day Care (draft v5)',
    'legal.name': '[LEGAL NAME — e.g. Luz del Hogar Family Day Care LLC, PENDING]',
    'hero.verse.quote': '“Ye are the light of the world. A city that is set on an hill cannot be hid.”',
    'hero.verse.cite': 'Matthew 5:14 (King James Version)',
    'footer.provider': 'Yodernis Crooke — Luz del Hogar Christian Day Care (draft v5)',
  },
};
