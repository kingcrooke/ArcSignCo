const STORAGE_LANG = 'crooke-heritage-lang';

const PEOPLE = [
  {
    id: 'morel-ancestor',
    living: false,
    nameEn: '[MOREL ANCESTOR — TO BE ADDED]',
    nameEs: '[ANTEPASADO MOREL — POR AÑADIR]',
    noteEn: 'Placeholder branch above Mary Thelma Morel de Crooke.',
    noteEs: 'Rama provisional sobre Mary Thelma Morel de Crooke.',
    source: 'not-asked',
  },
  {
    id: 'crooke-ancestor',
    living: false,
    nameEn: '[CROOKE ANCESTOR — TO BE ADDED]',
    nameEs: '[ANTEPASADO CROOKE — POR AÑADIR]',
    noteEn: 'Placeholder branch above Charles Crooke.',
    noteEs: 'Rama provisional sobre Charles Crooke.',
    source: 'not-asked',
  },
  {
    id: 'charles',
    living: false,
    deceased: true,
    nameEn: 'Charles Crooke',
    nameEs: 'Charles Crooke',
    tagEn: 'In memoriam',
    tagEs: 'En memoria',
    noteEn: 'Memorial chapter holds tributes. Dates: [DATES — TO BE ADDED].',
    noteEs: 'El capítulo memorial guarda tributos. Fechas: [FECHAS — POR AÑADIR].',
    source: 'not-asked',
  },
  {
    id: 'mami',
    living: true,
    nameEn: "Mary Thelma Morel de Crooke ('Mami')",
    nameEs: "Mary Thelma Morel de Crooke ('Mami')",
    tagEn: 'Living — private details omitted',
    tagEs: 'Viva — sin datos sensibles',
    noteEn: 'Oral history and recipes to be gathered with her consent.',
    noteEs: 'Historias y recetas por recoger con su consentimiento.',
    source: 'not-asked',
  },
  {
    id: 'jesus',
    living: true,
    nameEn: 'Jesus Crooke',
    nameEs: 'Jesus Crooke',
    tagEn: 'Living — site steward',
    tagEs: 'Vivo — custodio del sitio',
    noteEn: '[BIO — TO BE ADDED]',
    noteEs: '[BIOGRAFÍA — POR AÑADIR]',
    source: 'not-asked',
  },
  {
    id: 'elizabeth',
    living: true,
    nameEn: 'Elizabeth Crooke',
    nameEs: 'Elizabeth Crooke',
    tagEn: 'Living — private details omitted',
    tagEs: 'Viva — sin datos sensibles',
    noteEn: '[BIO — TO BE ADDED]',
    noteEs: '[BIOGRAFÍA — POR AÑADIR]',
    source: 'not-asked',
  },
  {
    id: 'yodernis',
    living: true,
    nameEn: 'Yodernis Crooke',
    nameEs: 'Yodernis Crooke',
    tagEn: 'Living — private details omitted',
    tagEs: 'Viva — sin datos sensibles',
    noteEn: '[BIO — TO BE ADDED]',
    noteEs: '[BIOGRAFÍA — POR AÑADIR]',
    source: 'not-asked',
  },
];

const I18N = {
  en: {
    'draft.banner': 'PRIVATE FAMILY SITE — share link only · not indexed',
    'brand.sub': 'Book of the Crookes',
    'nav.home': 'Home',
    'nav.book': 'The Book',
    'nav.tree': 'Family Tree',
    'nav.origins': 'Origins',
    'nav.memorial': 'Memorial',
    'nav.recipes': 'Recipes & Stories',
    'nav.vault': 'Vault',
    'nav.interview': 'Share your story',
    'lang.en': 'EN',
    'lang.es': 'ES',
    'home.title': 'The Crooke family heritage archive',
    'home.lead':
      'A Caribbean Archive shell and Great Book chapters for the Morel and Crooke lines. Facts appear only when the family adds and approves them.',
    'home.emblem.caption':
      'A household emblem made for the Crooke family, not a historic grant of arms.',
    'home.motto.label': 'Family motto (placeholder)',
    'home.motto.val': '[MOTTO — FAMILY TO CHOOSE]',
    'home.blazon': 'Emblem symbolism and blazon: [BLAZON — TO BE ADDED]',
    'home.disclaimer':
      'Crest artwork: art coming from Build. Every fact on this site carries an archive source label.',
    'source.told': 'Told by {name}',
    'source.paper': 'Paper we hold',
    'source.notAsked': 'Not yet asked',
    'book.title': 'The Book of the Crookes',
    'book.intro':
      'Chapters read like a family volume. Unknown passages stay clearly marked until interviews and scans are ready.',
    'book.ch1': 'Prologue — why this archive exists',
    'book.ch2': 'Mary Thelma Morel de Crooke (Mami)',
    'book.ch3': 'Charles Crooke — remembrance',
    'book.ch4': 'Siblings — Elizabeth & Yodernis',
    'book.ch5': 'Morel roots (Dominican line)',
    'book.ch6': 'Crooke roots',
    'book.ch7': 'Migration stories',
    'book.ch8': 'Kitchen & table',
    'book.body.placeholder': '[CHAPTER TEXT — TO BE ADDED]',
    'tree.title': 'Interactive family tree',
    'tree.hint': 'Tap a name to see notes. Ancestors above Charles and Mami are placeholders only.',
    'tree.detail.title': 'Profile notes',
    'tree.detail.empty': 'Select a family member in the tree.',
    'origins.title': 'Two origin tracks',
    'origins.morel.title': 'Morel track',
    'origins.morel.body':
      'Dominican family line through Mary Thelma Morel de Crooke. Places, names, and stories: [MOREL ORIGINS — TO BE RESEARCHED].',
    'origins.crooke.title': 'Crooke track',
    'origins.crooke.body':
      'Crooke family line through Charles Crooke. Places, names, and stories: [CROOKE ORIGINS — TO BE RESEARCHED].',
    'origins.map': 'Migration map: [ROUTES — TO BE ADDED] (no coordinates until verified).',
    'memorial.title': 'In memory of Charles Crooke',
    'memorial.lead':
      'A quiet room for photos, letters, and what he taught us. Submitted only by family.',
    'memorial.gallery':
      'Photo mosaic: art coming from Build · [PHOTOS — TO BE ADDED] (no family scans on this shareable page)',
    'memorial.timeline': 'Life timeline: [EVENTS — TO BE ADDED]',
    'memorial.tribute': 'Family tributes: [TRIBUTES — TO BE ADDED]',
    'recipes.title': 'Recipes & stories',
    'recipes.lead': 'Kitchen chapter excerpts and short oral-history clips (transcripts required).',
    'recipes.r1': '[RECIPE NAME — TO BE ADDED]',
    'recipes.r2': '[STORY TITLE — TO BE ADDED]',
    'recipes.r3': '[RECIPE NAME — TO BE ADDED]',
    'vault.title': 'Document vault',
    'vault.lead':
      'Scans, audio, and albums will be linked here when ready — never committed to the public git repo. Password protection is planned for a later phase.',
    'vault.status': '[VAULT — COMING SOON]',
    'vault.policy':
      'No birthdates, street addresses, document numbers, DNA results, or photo scans on shareable pages. Originals stay offline or in a future private vault.',
    'footer.privacy':
      'Privacy: no birthdates, addresses, document numbers, DNA, or photo scans on these pages; family photos and scans are not stored in the public repository. Do not share this URL publicly.',
    'footer.steward': 'Family steward: Jesus Crooke',
  },
  es: {
    'draft.banner': 'SITIO FAMILIAR PRIVADO — solo enlace · no indexado',
    'brand.sub': 'Libro de los Crooke',
    'nav.home': 'Inicio',
    'nav.book': 'El Libro',
    'nav.tree': 'Árbol',
    'nav.origins': 'Orígenes',
    'nav.memorial': 'Memorial',
    'nav.recipes': 'Recetas e historias',
    'nav.vault': 'Archivo',
    'nav.interview': 'Comparte tu historia',
    'lang.en': 'EN',
    'lang.es': 'ES',
    'home.title': 'Archivo patrimonial de la familia Crooke',
    'home.lead':
      'Un archivo caribeño con capítulos de gran libro para las líneas Morel y Crooke. Los hechos aparecen solo cuando la familia los añade y aprueba.',
    'home.emblem.caption':
      'Un emblema familiar hecho para la familia Crooke, no un escudo de armas histórico concedido.',
    'home.motto.label': 'Lema familiar (provisional)',
    'home.motto.val': '[LEMA — LA FAMILIA ELIGE]',
    'home.blazon': 'Simbolismo del emblema y blasón: [BLASÓN — POR AÑADIR]',
    'home.disclaimer':
      'Arte del escudo: art coming from Build. Cada dato en el sitio lleva una etiqueta de fuente de archivo.',
    'source.told': 'Lo contó {name}',
    'source.paper': 'Documento en familia',
    'source.notAsked': 'Aún no preguntado',
    'book.title': 'El Libro de los Crooke',
    'book.intro':
      'Capítulos con tono de volumen familiar. Lo desconocido queda marcado hasta las entrevistas y digitalizaciones.',
    'book.ch1': 'Prólogo — por qué existe este archivo',
    'book.ch2': 'Mary Thelma Morel de Crooke (Mami)',
    'book.ch3': 'Charles Crooke — recuerdo',
    'book.ch4': 'Hermanas — Elizabeth y Yodernis',
    'book.ch5': 'Raíces Morel (línea dominicana)',
    'book.ch6': 'Raíces Crooke',
    'book.ch7': 'Historias de migración',
    'book.ch8': 'Cocina y mesa',
    'book.body.placeholder': '[TEXTO DEL CAPÍTULO — POR AÑADIR]',
    'tree.title': 'Árbol familiar interactivo',
    'tree.hint': 'Toca un nombre para ver notas. Los antepasados sobre Charles y Mami son provisionales.',
    'tree.detail.title': 'Notas del perfil',
    'tree.detail.empty': 'Elige un familiar en el árbol.',
    'origins.title': 'Dos líneas de origen',
    'origins.morel.title': 'Línea Morel',
    'origins.morel.body':
      'Línea dominicana a través de Mary Thelma Morel de Crooke. Lugares, nombres e historias: [ORÍGENES MOREL — POR INVESTIGAR].',
    'origins.crooke.title': 'Línea Crooke',
    'origins.crooke.body':
      'Línea Crooke a través de Charles Crooke. Lugares, nombres e historias: [ORÍGENES CROOKE — POR INVESTIGAR].',
    'origins.map': 'Mapa de migración: [RUTAS — POR AÑADIR] (sin coordenadas hasta verificar).',
    'memorial.title': 'En memoria de Charles Crooke',
    'memorial.lead':
      'Un espacio para fotos, cartas y lo que nos enseñó. Solo contenido de la familia.',
    'memorial.gallery':
      'Mosaico de fotos: art coming from Build · [FOTOS — POR AÑADIR] (sin escaneos familiares en esta página compartible)',
    'memorial.timeline': 'Línea de vida: [EVENTOS — POR AÑADIR]',
    'memorial.tribute': 'Tributos familiares: [TRIBUTOS — POR AÑADIR]',
    'recipes.title': 'Recetas e historias',
    'recipes.lead': 'Extractos de cocina y relatos breves (con transcripción).',
    'recipes.r1': '[NOMBRE DE RECETA — POR AÑADIR]',
    'recipes.r2': '[TÍTULO DE HISTORIA — POR AÑADIR]',
    'recipes.r3': '[NOMBRE DE RECETA — POR AÑADIR]',
    'vault.title': 'Archivo documental',
    'vault.lead':
      'Aquí enlazaremos escaneos, audio y álbumes cuando estén listos — nunca en el repositorio git público. Contraseña en una fase posterior.',
    'vault.status': '[ARCHIVO — PRÓXIMAMENTE]',
    'vault.policy':
      'Sin fechas de nacimiento, direcciones, números de documento, ADN ni escaneos de fotos en páginas compartibles. Los originales quedan fuera de línea o en un archivo privado futuro.',
    'footer.privacy':
      'Privacidad: sin fechas de nacimiento, direcciones, números de documento, ADN ni escaneos en estas páginas; fotos y escaneos familiares no se guardan en el repositorio público. No compartas esta URL en público.',
    'footer.steward': 'Custodio familiar: Jesus Crooke',
  },
};

const PANELS = ['home', 'book', 'tree', 'origins', 'memorial', 'recipes', 'vault'];

let lang = 'en';
let selectedPersonId = null;

function t(key) {
  return I18N[lang][key] ?? I18N.en[key] ?? key;
}

function sourceLabel(kind, name = '') {
  if (kind === 'told') {
    return t('source.told').replace('{name}', name || '[NAME — TO BE ADDED]');
  }
  if (kind === 'paper') return t('source.paper');
  return t('source.notAsked');
}

function sourceTagHtml(kind, name = '') {
  const safeKind = kind === 'told' || kind === 'paper' ? kind : 'not-asked';
  const label = sourceLabel(safeKind, name);
  return `<span class="archive-source archive-source--${safeKind}" data-source="${safeKind}"${name ? ` data-source-name="${name}"` : ''}>${label}</span>`;
}

function applySourceTags() {
  document.querySelectorAll('[data-source]').forEach(el => {
    const kind = el.getAttribute('data-source') || 'not-asked';
    const name = el.getAttribute('data-source-name') || '';
    el.textContent = sourceLabel(kind, name);
    el.className = `archive-source archive-source--${kind === 'told' || kind === 'paper' ? kind : 'not-asked'}`;
  });
}

function applyI18n() {
  document.documentElement.lang = lang === 'es' ? 'es' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  applySourceTags();
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    const on = btn.getAttribute('data-lang-btn') === lang;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  renderTree();
  if (selectedPersonId) showPersonDetail(selectedPersonId);
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

function personById(id) {
  return PEOPLE.find(p => p.id === id);
}

function personLabel(p) {
  return lang === 'es' ? p.nameEs : p.nameEn;
}

function personTag(p) {
  if (p.tagEn) return lang === 'es' ? p.tagEs : p.tagEn;
  if (p.living) return lang === 'es' ? 'Viva — sin datos sensibles' : 'Living — private details omitted';
  return lang === 'es' ? 'Antepasado provisional' : 'Placeholder ancestor';
}

function renderTree() {
  const mount = document.getElementById('tree-mount');
  if (!mount) return;

  const row = (ids, cls = '') => {
    const nodes = ids
      .map(id => {
        const p = personById(id);
        if (!p) return '';
        const dead = p.deceased || (!p.living && !id.includes('ancestor'));
        return `<button type="button" class="tree-node${dead ? ' deceased' : ''}${selectedPersonId === id ? ' is-selected' : ''}" data-person="${id}">
          <span class="name">${personLabel(p)}</span>
          <span class="tag">${personTag(p)}</span>
        </button>`;
      })
      .join('');
    return `<div class="tree-row ${cls}">${nodes}</div>`;
  };

  mount.innerHTML = `
    <div class="tree-canvas">
      ${row(['morel-ancestor', 'crooke-ancestor'])}
      <div class="tree-connector" aria-hidden="true"></div>
      ${row(['mami', 'charles'])}
      <div class="tree-connector" aria-hidden="true"></div>
      ${row(['jesus', 'elizabeth', 'yodernis'])}
    </div>
  `;

  mount.querySelectorAll('[data-person]').forEach(btn => {
    btn.addEventListener('click', () => showPersonDetail(btn.getAttribute('data-person')));
  });
}

function showPersonDetail(id) {
  selectedPersonId = id;
  const p = personById(id);
  const box = document.getElementById('tree-detail-body');
  if (!box || !p) return;
  const note = lang === 'es' ? p.noteEs : p.noteEn;
  const src = p.source || 'not-asked';
  const who = p.sourceWho || '';
  box.innerHTML = `${sourceTagHtml(src, who)}<p><strong>${personLabel(p)}</strong></p><p>${note}</p>`;
  renderTree();
}

function activatePanel(id) {
  if (!PANELS.includes(id)) id = 'home';
  PANELS.forEach(name => {
    const panel = document.getElementById(`panel-${name}`);
    if (panel) panel.classList.toggle('is-active', name === id);
  });
  document.querySelectorAll('.nav-tabs a').forEach(a => {
    a.classList.toggle('is-active', a.getAttribute('data-panel') === id);
  });
  if (id === 'tree' && !selectedPersonId) {
    const detail = document.getElementById('tree-detail-body');
    if (detail) detail.textContent = t('tree.detail.empty');
  }
}

function readPanelFromHash() {
  const raw = (location.hash || '#home').replace(/^#/, '');
  activatePanel(raw);
}

function initNav() {
  document.querySelectorAll('.nav-tabs a').forEach(a => {
    a.addEventListener('click', e => {
      const panel = a.getAttribute('data-panel');
      if (panel) {
        e.preventDefault();
        location.hash = panel;
        activatePanel(panel);
      }
    });
  });
  window.addEventListener('hashchange', readPanelFromHash);
}

function initLang() {
  try {
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved === 'es' || saved === 'en') lang = saved;
  } catch {
    /* ignore */
  }
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang-btn')));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initNav();
  readPanelFromHash();
  applyI18n();
  const detail = document.getElementById('tree-detail-body');
  if (detail) detail.textContent = t('tree.detail.empty');
});
