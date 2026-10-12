const STORAGE_LANG = 'crooke-heritage-lang';

const I18N = {
  en: {
    'nav.back': '← Book of the Crookes',
    'nav.interview': 'Share your story',
    'lang.en': 'EN',
    'lang.es': 'ES',
    'draft.banner': 'PRIVATE FAMILY SITE — share link only · not indexed',
    'title': 'Share your story',
    'intro':
      'Answer in writing below, or attach a short voice recording. Jesus reviews every submission before anything appears on the family site. Skip any question you prefer not to answer.',
    'review':
      'Your answers are not published automatically. Jesus will review them and may follow up before adding text to the Book of the Crookes.',
    'privacy.title': 'Privacy — do not include in your answers',
    'privacy.body':
      'Never type or record: Social Security numbers; passport, national ID, or immigration document numbers; bank or credit-card details; full birthdates of living people; or anyone’s current street address.',
    'field.name': 'Your name',
    'field.name_es': 'Tu nombre',
    'field.relationship': 'Relationship to the family',
    'field.relationship_es': 'Parentesco con la familia',
    'field.phone': 'Phone for follow-up',
    'field.phone_es': 'Teléfono para seguimiento',
    'field.email': 'Email for follow-up',
    'field.email_es': 'Correo para seguimiento',
    'field.voice': 'Voice recording (optional)',
    'field.voice_es': 'Grabación de voz (opcional)',
    'field.voice.hint':
      'One file, about 10 MB max (MP3, M4A, WAV, OGG). Say your name and today’s date at the start.',
    'field.voice.fallback': 'Or record a voice note and email it to',
    'submit': 'Send to Jesus for review',
    'opt': '(optional)',
    'sec.about': 'About you and your childhood',
    'sec.about_es': 'Sobre ti y tu niñez',
    'sec.parents': 'Parents',
    'sec.parents_es': 'Padres',
    'sec.grandparents': 'Grandparents and older generations',
    'sec.grandparents_es': 'Abuelos y generaciones mayores',
    'sec.places': 'Places and origins (Morel & Crooke)',
    'sec.places_es': 'Lugares y orígenes (Morel y Crooke)',
    'sec.charles': 'Charles Crooke — memorial memories',
    'sec.charles_es': 'Charles Crooke — recuerdos para el memorial',
    'sec.mami': 'Mami and Charles’s story',
    'sec.mami_es': 'La historia de Mami y Charles',
    'sec.traditions': 'Traditions, faith, holidays',
    'sec.traditions_es': 'Tradiciones, fe, fiestas',
    'sec.food': 'Food and family recipes',
    'sec.food_es': 'Comida y recetas familiares',
    'sec.work': 'Work and skills passed down',
    'sec.work_es': 'Trabajo y oficios heredados',
    'sec.sayings': 'Sayings, nicknames, songs, stories',
    'sec.sayings_es': 'Dichos, apodos, canciones, cuentos',
    'sec.photos': 'Photos and papers (describe only — no ID scans)',
    'sec.photos_es': 'Fotos y papeles (solo describir — sin escaneos de IDs)',
    'sec.who': 'Who else should we talk to',
    'sec.who_es': 'Con quién más debemos hablar',
  },
  es: {
    'nav.back': '← Libro de los Crooke',
    'nav.interview': 'Comparte tu historia',
    'lang.en': 'EN',
    'lang.es': 'ES',
    'draft.banner': 'SITIO FAMILIAR PRIVADO — solo enlace · no indexado',
    'title': 'Comparte tu historia',
    'intro':
      'Responde por escrito abajo o adjunta una grabación de voz breve. Jesús revisa cada envío antes de que algo aparezca en el sitio familiar. Omite cualquier pregunta que prefieras no contestar.',
    'review':
      'Tus respuestas no se publican solas. Jesús las revisará y puede hacer seguimiento antes de añadir texto al Libro de los Crooke.',
    'privacy.title': 'Privacidad — no incluyas en tus respuestas',
    'privacy.body':
      'Nunca escribas ni grabes: números de Seguro Social; pasaporte, cédula o documentos de migración; datos bancarios o de tarjetas; fechas de nacimiento completas de personas vivas; ni direcciones actuales.',
    'field.name': 'Tu nombre',
    'field.name_es': 'Tu nombre',
    'field.relationship': 'Parentesco con la familia',
    'field.relationship_es': 'Parentesco con la familia',
    'field.phone': 'Teléfono para seguimiento',
    'field.phone_es': 'Teléfono para seguimiento',
    'field.email': 'Correo para seguimiento',
    'field.email_es': 'Correo para seguimiento',
    'field.voice': 'Grabación de voz (opcional)',
    'field.voice_es': 'Grabación de voz (opcional)',
    'field.voice.hint':
      'Un archivo, máx. ~10 MB (MP3, M4A, WAV, OGG). Di tu nombre y la fecha al inicio.',
    'field.voice.fallback': 'O graba una nota de voz y envíala por correo a',
    'submit': 'Enviar a Jesús para revisión',
    'opt': '(opcional)',
    'sec.about': 'Sobre ti y tu niñez',
    'sec.about_es': 'Sobre ti y tu niñez',
    'sec.parents': 'Padres',
    'sec.parents_es': 'Padres',
    'sec.grandparents': 'Abuelos y generaciones mayores',
    'sec.grandparents_es': 'Abuelos y generaciones mayores',
    'sec.places': 'Lugares y orígenes (Morel y Crooke)',
    'sec.places_es': 'Lugares y orígenes (Morel y Crooke)',
    'sec.charles': 'Charles Crooke — recuerdos para el memorial',
    'sec.charles_es': 'Charles Crooke — recuerdos para el memorial',
    'sec.mami': 'La historia de Mami y Charles',
    'sec.mami_es': 'La historia de Mami y Charles',
    'sec.traditions': 'Tradiciones, fe, fiestas',
    'sec.traditions_es': 'Tradiciones, fe, fiestas',
    'sec.food': 'Comida y recetas familiares',
    'sec.food_es': 'Comida y recetas familiares',
    'sec.work': 'Trabajo y oficios heredados',
    'sec.work_es': 'Trabajo y oficios heredados',
    'sec.sayings': 'Dichos, apodos, canciones, cuentos',
    'sec.sayings_es': 'Dichos, apodos, canciones, cuentos',
    'sec.photos': 'Fotos y papeles (solo describir — sin escaneos de IDs)',
    'sec.photos_es': 'Fotos y papeles (solo describir — sin escaneos de IDs)',
    'sec.who': 'Con quién más debemos hablar',
    'sec.who_es': 'Con quién más debemos hablar',
  },
};

const SECTION_HINTS = {
  en: {
    about_you:
      'Names/nicknames; where you grew up; earliest memory; childhood games; cousins and friends.',
    parents: 'Mother and father — personalities, how they met (if known), work and lessons.',
    grandparents: 'Grandparents’ stories; elders you heard about; who keeps old photos.',
    places_origins:
      'Morel and Crooke places; migration; settling in New York area; neighborhoods and community.',
    charles_memorial: 'How you describe Charles; favorite stories; what he cared about; lessons he left.',
    mami_charles_story: 'Mami as mother/partner; family life with Jesus, Elizabeth, Yodernis; traditions.',
    traditions_faith: 'Important holidays; faith and church; typical celebrations.',
    food_recipes: 'Dishes that mean “home”; who taught you; ingredients and table traditions.',
    work_skills: 'Jobs across generations; skills learned at home; family crafts or businesses.',
    sayings_stories: 'Nicknames; proverbs; songs; stories elders told.',
    photos_papers: 'What albums or papers exist and who holds them — do not upload ID scans.',
    who_else: 'Relatives or friends with old stories; best way to reach them (no private numbers needed here).',
  },
  es: {
    about_you:
      'Nombres/apodos; dónde creciste; primer recuerdo; juegos de niñez; primos y amigos.',
    parents: 'Madre y padre — personalidad, cómo se conocieron (si sabes), trabajo y enseñanzas.',
    grandparents: 'Historias de abuelos; mayores que oíste nombrar; quién guarda fotos antiguas.',
    places_origins:
      'Lugares Morel y Crooke; migración; llegada al área de NY; barrios y comunidad.',
    charles_memorial: 'Cómo describes a Charles; historias favoritas; qué le importaba; lecciones.',
    mami_charles_story: 'Mami como madre/pareja; vida familiar con Jesus, Elizabeth, Yodernis; tradiciones.',
    traditions_faith: 'Fiestas importantes; fe e iglesia; celebraciones típicas.',
    food_recipes: 'Platos que significan “hogar”; quién enseñó; ingredientes y mesa familiar.',
    work_skills: 'Trabajos por generaciones; oficios en casa; negocios familiares.',
    sayings_stories: 'Apodos; refranes; canciones; cuentos de los mayores.',
    photos_papers: 'Qué álbumes o papeles existen y quién los tiene — no subas escaneos de IDs.',
    who_else: 'Familiares o amigos con historias antiguas; cómo contactarlos (sin números privados).',
  },
};

let lang = 'en';

function t(key) {
  return I18N[lang][key] ?? I18N.en[key] ?? key;
}

function applyI18n() {
  document.documentElement.lang = lang === 'es' ? 'es' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.classList.contains('legend-es')) return;
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('.legend-es').forEach(el => {
    const base = el.getAttribute('data-i18n');
    el.textContent = I18N.en[`${base}_es`] ?? I18N.en[base] ?? '';
    el.style.display = lang === 'en' ? 'block' : 'none';
  });
  document.querySelectorAll('[data-hint]').forEach(el => {
    const id = el.getAttribute('data-hint');
    el.textContent = SECTION_HINTS[lang][id] ?? SECTION_HINTS.en[id] ?? '';
  });
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    const on = btn.getAttribute('data-lang-btn') === lang;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function setLang(next) {
  lang = next;
  try {
    localStorage.setItem(STORAGE_LANG, lang);
  } catch {
    /* ignore */
  }
  applyI18n();
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved === 'es' || saved === 'en') lang = saved;
  } catch {
    /* ignore */
  }
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang-btn')));
  });
  applyI18n();
});
