const STORAGE_LANG = 'crooke-heritage-lang';

const PEOPLE = [
  {
    id: 'morel-ancestor',
    living: false,
    nameEn: '[MOREL ANCESTOR — TO BE ADDED]',
    nameEs: '[ANTEPASADO MOREL — POR AÑADIR]',
    noteEn: 'Placeholder branch above Mary Thelma Morel de Crooke. Elizabeth’s interview does not name Mami’s parents.',
    noteEs: 'Rama provisional sobre Mary Thelma Morel de Crooke. La entrevista de Elizabeth no nombra a los padres de Mami.',
    source: 'not-asked',
  },
  {
    id: 'crooke-grandfather',
    living: false,
    nameEn: 'Crooke grandfather',
    nameEs: 'Abuelo Crooke',
    tagEn: 'Name not recorded',
    tagEs: 'Nombre no registrado',
    noteEn:
      'English-speaking Black Caribbean chef in the Trujillo era. Elizabeth says the family may have been in textiles (?), that they settled in the Caribbean (radicaron ?), that he met her grandmother in the Dominican Republic, did not adjust to the country, and left three children: Charles, Ana Luisa, and Georgie. No dates recorded.',
    noteEs:
      'Chef caribeño de habla inglesa, negro, en la época de Trujillo. Elizabeth dice que la familia pudo ser textilera (?), que se radicaron (?) en el Caribe, que él conoció a su abuela en la República Dominicana, no se acostumbró al país y dejó tres hijos: Charles, Ana Luisa y Georgie. Sin fechas registradas.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'tavarez-grandmother',
    living: false,
    nameEn: 'Tavárez (?) grandmother',
    nameEs: 'Abuela Tavárez (?)',
    tagEn: 'Name not recorded',
    tagEs: 'Nombre no registrado',
    noteEn:
      'Paternal grandmother, of the Tavárez (?) family. Elizabeth connects them with the historic Tavárez Justo (?) family. They lived around La México (?). No dates recorded.',
    noteEs:
      'Abuela paterna, de la familia Tavárez (?). Elizabeth la relaciona con la familia histórica Tavárez Justo (?). Vivían por La México (?). Sin fechas registradas.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'charles',
    living: false,
    deceased: true,
    nameEn: 'Charles Crooke',
    nameEs: 'Charles Crooke',
    tagEn: 'In memoriam',
    tagEs: 'En memoria',
    noteEn:
      'Elizabeth remembers her father as a great dancer. He was born and raised in a barrio near La México (?) whose name she could not recall. He was not very involved in her dance career at first and accepted it later. He died about six years before her October 2026 interview. Exact dates: [DATES — TO BE ADDED].',
    noteEs:
      'Elizabeth recuerda a su padre como un gran bailarín. Nació y se crio en un barrio cerca de La México (?) cuyo nombre no pudo recordar. Al principio no estuvo muy metido en su carrera de danza y después lo aceptó. Murió unos seis años antes de la entrevista de octubre de 2026. Fechas exactas: [FECHAS — POR AÑADIR].',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'mami',
    living: true,
    nameEn: "Mary Thelma Morel de Crooke ('Mami')",
    nameEs: "Mary Thelma Morel de Crooke ('Mami')",
    tagEn: 'Living — private details omitted',
    tagEs: 'Viva — sin datos sensibles',
    noteEn:
      'Elizabeth’s mother, and the main support for her dance career. She kept the December traditions: new clothes for Christmas, Three Kings’ Day gifts, and a twig tree with cotton and angel hair (pelo de ángel). Elizabeth hopes to interview her next.',
    noteEs:
      'Madre de Elizabeth y el apoyo principal de su carrera de danza. Mantuvo las tradiciones de diciembre: ropa nueva para Navidad, regalos de Reyes y un árbol de palitos con algodón y pelo de ángel. Elizabeth quiere entrevistarla después.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'ana-luisa',
    living: false,
    nameEn: 'Ana Luisa',
    nameEs: 'Ana Luisa',
    tagEn: 'Sister of Charles',
    tagEs: 'Hermana de Charles',
    noteEn: 'Paternal aunt. With Mami and Manuel, she supported Elizabeth’s dance career. Married to Manuel. No dates recorded.',
    noteEs: 'Tía paterna. Junto con Mami y Manuel, apoyó la carrera de danza de Elizabeth. Casada con Manuel. Sin fechas registradas.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'manuel',
    living: false,
    deceased: true,
    nameEn: 'Manuel',
    nameEs: 'Manuel',
    tagEn: 'In memoriam · husband of Ana Luisa',
    tagEs: 'En memoria · esposo de Ana Luisa',
    noteEn: 'Uncle by marriage. Elizabeth has lovely memories of him and names him among those who supported her dancing. No dates recorded.',
    noteEs: 'Tío político. Elizabeth guarda lindos recuerdos de él y lo cuenta entre quienes apoyaron su danza. Sin fechas registradas.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'georgie',
    living: false,
    nameEn: 'Georgie',
    nameEs: 'Georgie',
    tagEn: 'Brother of Charles',
    tagEs: 'Hermano de Charles',
    noteEn: 'Paternal uncle. One of the three children the Crooke grandfather left in the Dominican Republic. No dates recorded.',
    noteEs: 'Tío paterno. Uno de los tres hijos que el abuelo Crooke dejó en la República Dominicana. Sin fechas registradas.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'charlie',
    living: false,
    deceased: true,
    nameEn: "Charlie ('Cheche' ?)",
    nameEs: "Charlie ('Cheche' ?)",
    tagEn: 'In memoriam · half-brother',
    tagEs: 'En memoria · medio hermano',
    noteEn:
      'Elizabeth’s older half-brother on her father’s side. She gives the names Charlie and Cheche (?). The other parent is not recorded. No dates recorded.',
    noteEs:
      'Medio hermano mayor de Elizabeth, por parte de su padre. Ella da los nombres Charlie y Cheche (?). El otro padre o la otra madre no está registrado. Sin fechas registradas.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'jesus',
    living: true,
    nameEn: 'Jesus Crooke',
    nameEs: 'Jesus Crooke',
    tagEn: 'Living — site steward',
    tagEs: 'Vivo — custodio del sitio',
    noteEn: 'Brother of Elizabeth and Yodernis. [BIO — TO BE ADDED]',
    noteEs: 'Hermano de Elizabeth y Yodernis. [BIOGRAFÍA — POR AÑADIR]',
    source: 'not-asked',
  },
  {
    id: 'elizabeth',
    living: true,
    nameEn: 'Elizabeth Crooke',
    nameEs: 'Elizabeth Crooke',
    tagEn: 'Living — private details omitted',
    tagEs: 'Viva — sin datos sensibles',
    noteEn:
      'Sister of Jesus. Born in Moca, Dominican Republic, barrio Roque (?). Dance career, supported above all by Mami, Ana Luisa, and Manuel. Her chapter holds the interview.',
    noteEs:
      'Hermana de Jesus. Nació en Moca, República Dominicana, barrio Roque (?). Carrera de danza, con apoyo sobre todo de Mami, Ana Luisa y Manuel. Su capítulo guarda la entrevista.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
    page: '/crooke-7c3a9e12/elizabeth/',
    storyEn: 'View her story',
    storyEs: 'Ver su historia',
  },
  {
    id: 'yodernis',
    living: true,
    nameEn: 'Yodernis Crooke',
    nameEs: 'Yodernis Crooke',
    tagEn: 'Living — private details omitted',
    tagEs: 'Viva — sin datos sensibles',
    noteEn: 'Sister of Jesus and Elizabeth. [BIO — TO BE ADDED]',
    noteEs: 'Hermana de Jesus y Elizabeth. [BIOGRAFÍA — POR AÑADIR]',
    source: 'not-asked',
  },
  {
    id: 'cecilia',
    living: false,
    nameEn: 'Tía Cecilia',
    nameEs: 'Tía Cecilia',
    tagEn: 'Branch not recorded',
    tagEs: 'Rama no registrada',
    noteEn:
      'Aunt in Moca and mother of cousins Elizabeth grew up near, including Yencenia (?). Which side of the family is not recorded, so she is not tied to a parent here.',
    noteEs:
      'Tía en Moca y madre de primas con las que Elizabeth creció, entre ellas Yencenia (?). No se registró de qué lado de la familia, así que aquí no se ata a un padre o una madre.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'yencenia',
    living: false,
    nameEn: 'Yencenia (?)',
    nameEs: 'Yencenia (?)',
    tagEn: 'Cousin in Moca · branch not recorded',
    tagEs: 'Prima en Moca · rama no registrada',
    noteEn:
      'Daughter of Tía Cecilia, about Elizabeth’s age when they were children in Moca. They drifted apart as their schooling and upbringing diverged. The name is uncertain. No dates recorded.',
    noteEs:
      'Hija de tía Cecilia, más o menos de la edad de Elizabeth cuando eran niñas en Moca. Se fueron alejando porque la educación y la formación se separaron. El nombre es incierto. Sin fechas registradas.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
  {
    id: 'hilda',
    living: false,
    nameEn: 'Tía Hilda',
    nameEs: 'Tía Hilda',
    tagEn: 'Branch not recorded',
    tagEs: 'Rama no registrada',
    noteEn: 'Aunt Elizabeth hopes to interview, so she can talk about her own childhood. Side of the family not recorded. No dates recorded.',
    noteEs:
      'Tía a quien Elizabeth quiere entrevistar, para que hable de su propia infancia. No se registró de qué lado de la familia. Sin fechas registradas.',
    source: 'told',
    sourceWho: 'Elizabeth Crooke',
  },
];

const I18N = {
  en: {
    'draft.banner': 'PRIVATE FAMILY SITE — share link only · not indexed',
    'brand.sub': 'Book of the Crookes',
    'nav.home': 'Home',
    'nav.book': 'The Book',
    'nav.members': 'Members',
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
    'members.title': 'Members',
    'members.lead': 'Every name in the archive, in alphabetical order. A name with a chapter opens that page.',
    'members.noChapter': 'No chapter yet',
    'source.told': 'Told by {name}',
    'source.paper': 'Paper we hold',
    'source.notAsked': 'Not yet asked',
    'book.title': 'The Book of the Crookes',
    'book.intro':
      'Chapters read like a family volume. Unknown passages stay clearly marked until interviews and scans are ready.',
    'book.ch1': 'Prologue — why this archive exists',
    'book.ch2': 'Mary Thelma Morel de Crooke (Mami)',
    'book.ch3': 'Charles Crooke — remembrance',
    'book.ch4': 'Elizabeth Crooke — voice and memories',
    'book.yodernis': 'Yodernis Crooke — [CHAPTER — TO BE ADDED]',
    'book.ch5': 'Morel roots (Dominican line)',
    'book.ch6': 'Crooke roots',
    'book.ch7': 'Migration stories',
    'book.ch8': 'Kitchen & table',
    'book.body.placeholder': '[CHAPTER TEXT — TO BE ADDED]',
    'tree.title': 'Interactive family tree',
    'tree.hint':
      'Tap a name to see notes. The Morel ancestor above Mami is still a placeholder. The last row is named by Elizabeth; their branch is not recorded, so they are not tied to a parent.',
    'tree.unplaced': 'Named by Elizabeth. Branch not recorded — not tied to a parent.',
    'tree.detail.title': 'Profile notes',
    'tree.detail.empty': 'Select a family member in the tree.',
    'origins.title': 'Two origin tracks',
    'origins.morel.title': 'Morel track',
    'origins.morel.body':
      'Dominican family line through Mary Thelma Morel de Crooke. Places, names, and stories: [MOREL ORIGINS — TO BE RESEARCHED].',
    'origins.crooke.title': 'Crooke track',
    'origins.crooke.body':
      'Crooke family line through Charles Crooke. Places, names, and stories: [CROOKE ORIGINS — TO BE RESEARCHED].',
    'origins.crooke.elizabeth':
      'Elizabeth says her Crooke grandfather was an English-speaking Black Caribbean chef in the Trujillo era. He met her Tavárez (?) grandmother in the Dominican Republic, did not adjust, and left three children: Charles, Ana Luisa, and Georgie. They lived around La México (?). No dates recorded.',
    'origins.map': 'Migration map: [ROUTES — TO BE ADDED] (no coordinates until verified).',
    'memorial.title': 'In memory of Charles Crooke',
    'memorial.lead':
      'A quiet room for photos, letters, and what he taught us. Submitted only by family.',
    'memorial.gallery':
      'Photo mosaic: art coming from Build · [PHOTOS — TO BE ADDED] (no family scans on this shareable page)',
    'memorial.timeline': 'Life timeline: [EVENTS — TO BE ADDED]',
    'memorial.tribute': 'Family tributes: [TRIBUTES — TO BE ADDED]',
    'memorial.elizabeth':
      'Elizabeth remembers her father as a great dancer. He died about six years before she recorded her interview in October 2026. Exact dates are still not recorded.',
    'recipes.title': 'Recipes & stories',
    'recipes.lead': 'Kitchen chapter excerpts and short oral-history clips (transcripts required).',
    'recipes.r1': '[RECIPE NAME — TO BE ADDED]',
    'recipes.r2': '[STORY TITLE — TO BE ADDED]',
    'recipes.r3': '[RECIPE NAME — TO BE ADDED]',
    'recipes.elizabeth':
      'Family recipes — Elizabeth said there are many more. The one she started to tell was in a part of the recording that did not survive.',
    'vault.title': 'Document vault',
    'vault.lead':
      'Scans, audio, and albums will be linked here when ready — never committed to the public git repo. Password protection is planned for a later phase.',
    'vault.status': '[VAULT — COMING SOON]',
    'vault.policy':
      'No birthdates, phone numbers, email addresses, street addresses, document numbers, DNA results, or photo scans on shareable pages. Originals stay offline or in a future private vault.',
    'footer.privacy':
      'Privacy: no birthdates, phone numbers, email addresses, street addresses, document numbers, DNA, or photo scans on these pages; family photos and scans are not stored in the public repository. Do not share this URL publicly.',
    'footer.steward': 'Family steward: Jesus Crooke',
  },
  es: {
    'draft.banner': 'SITIO FAMILIAR PRIVADO — solo enlace · no indexado',
    'brand.sub': 'Libro de los Crooke',
    'nav.home': 'Inicio',
    'nav.book': 'El Libro',
    'nav.members': 'Miembros',
    'nav.tree': 'Árbol familiar',
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
    'members.title': 'Miembros',
    'members.lead': 'Cada nombre del archivo, en orden alfabético. Un nombre con capítulo abre esa página.',
    'members.noChapter': 'Sin capítulo',
    'source.told': 'Lo contó {name}',
    'source.paper': 'Documento en familia',
    'source.notAsked': 'Aún no preguntado',
    'book.title': 'El Libro de los Crooke',
    'book.intro':
      'Capítulos con tono de volumen familiar. Lo desconocido queda marcado hasta las entrevistas y digitalizaciones.',
    'book.ch1': 'Prólogo — por qué existe este archivo',
    'book.ch2': 'Mary Thelma Morel de Crooke (Mami)',
    'book.ch3': 'Charles Crooke — recuerdo',
    'book.ch4': 'Elizabeth Crooke — voz y recuerdos',
    'book.yodernis': 'Yodernis Crooke — [CAPÍTULO — POR AÑADIR]',
    'book.ch5': 'Raíces Morel (línea dominicana)',
    'book.ch6': 'Raíces Crooke',
    'book.ch7': 'Historias de migración',
    'book.ch8': 'Cocina y mesa',
    'book.body.placeholder': '[TEXTO DEL CAPÍTULO — POR AÑADIR]',
    'tree.title': 'Árbol familiar interactivo',
    'tree.hint':
      'Toca un nombre para ver notas. El antepasado Morel sobre Mami sigue siendo provisional. La última fila la nombró Elizabeth; no se registró su rama, así que no se atan a un padre o una madre.',
    'tree.unplaced': 'Los nombró Elizabeth. Rama no registrada: no se atan a un padre o una madre.',
    'tree.detail.title': 'Notas del perfil',
    'tree.detail.empty': 'Elige un familiar en el árbol.',
    'origins.title': 'Dos líneas de origen',
    'origins.morel.title': 'Línea Morel',
    'origins.morel.body':
      'Línea dominicana a través de Mary Thelma Morel de Crooke. Lugares, nombres e historias: [ORÍGENES MOREL — POR INVESTIGAR].',
    'origins.crooke.title': 'Línea Crooke',
    'origins.crooke.body':
      'Línea Crooke a través de Charles Crooke. Lugares, nombres e historias: [ORÍGENES CROOKE — POR INVESTIGAR].',
    'origins.crooke.elizabeth':
      'Elizabeth cuenta que su abuelo Crooke fue un chef caribeño de habla inglesa, negro, en la época de Trujillo. Conoció a su abuela Tavárez (?) en la República Dominicana, no se acostumbró y dejó tres hijos: Charles, Ana Luisa y Georgie. Vivían por La México (?). Sin fechas registradas.',
    'origins.map': 'Mapa de migración: [RUTAS — POR AÑADIR] (sin coordenadas hasta verificar).',
    'memorial.title': 'En memoria de Charles Crooke',
    'memorial.lead':
      'Un espacio para fotos, cartas y lo que nos enseñó. Solo contenido de la familia.',
    'memorial.gallery':
      'Mosaico de fotos: art coming from Build · [FOTOS — POR AÑADIR] (sin escaneos familiares en esta página compartible)',
    'memorial.timeline': 'Línea de vida: [EVENTOS — POR AÑADIR]',
    'memorial.tribute': 'Tributos familiares: [TRIBUTOS — POR AÑADIR]',
    'memorial.elizabeth':
      'Elizabeth recuerda a su padre como un gran bailarín. Murió unos seis años antes de que ella grabara su entrevista, en octubre de 2026. Las fechas exactas siguen sin registrarse.',
    'recipes.title': 'Recetas e historias',
    'recipes.lead': 'Extractos de cocina y relatos breves (con transcripción).',
    'recipes.r1': '[NOMBRE DE RECETA — POR AÑADIR]',
    'recipes.r2': '[TÍTULO DE HISTORIA — POR AÑADIR]',
    'recipes.r3': '[NOMBRE DE RECETA — POR AÑADIR]',
    'recipes.elizabeth':
      'Recetas de la familia — Elizabeth dijo que hay muchísimas más. La que empezó a contar estaba en un tramo de la grabación que no sobrevivió.',
    'vault.title': 'Archivo documental',
    'vault.lead':
      'Aquí enlazaremos escaneos, audio y álbumes cuando estén listos — nunca en el repositorio git público. Contraseña en una fase posterior.',
    'vault.status': '[ARCHIVO — PRÓXIMAMENTE]',
    'vault.policy':
      'Sin fechas de nacimiento, teléfonos, correos, direcciones, números de documento, ADN ni escaneos de fotos en páginas compartibles. Los originales quedan fuera de línea o en un archivo privado futuro.',
    'footer.privacy':
      'Privacidad: sin fechas de nacimiento, teléfonos, correos, direcciones, números de documento, ADN ni escaneos en estas páginas; fotos y escaneos familiares no se guardan en el repositorio público. No compartas esta URL en público.',
    'footer.steward': 'Custodio familiar: Jesus Crooke',
  },
};

const PANELS = ['home', 'book', 'members', 'tree', 'origins', 'memorial', 'recipes', 'vault'];

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
  renderMembers();
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

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function storyButtonLabel(p) {
  if (lang === 'es') return p.storyEs || 'Ver su historia';
  return p.storyEn || 'View their story';
}

function memberSortKey(p) {
  return personLabel(p)
    .replace(/[\[\]]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function renderMembers() {
  const mount = document.getElementById('members-mount');
  if (!mount) return;
  const people = [...PEOPLE].sort((a, b) =>
    memberSortKey(a).localeCompare(memberSortKey(b), lang === 'es' ? 'es' : 'en', { sensitivity: 'base' }),
  );
  mount.innerHTML = `<ul class="member-list">${people
    .map(p => {
      const name = esc(personLabel(p));
      const tag = esc(personTag(p));
      if (p.page) {
        return `<li><a class="member-row" href="${esc(p.page)}"><span class="member-copy"><span class="member-name">${name}</span><span class="member-tag">${tag}</span></span><span class="btn-story">${esc(storyButtonLabel(p))}</span></a></li>`;
      }
      return `<li><div class="member-row"><span class="member-copy"><span class="member-name">${name}</span><span class="member-tag">${tag}</span></span><span class="member-none">${esc(t('members.noChapter'))}</span></div></li>`;
    })
    .join('')}</ul>`;
}

function renderTree() {
  const mount = document.getElementById('tree-mount');
  if (!mount) return;

  const row = (ids, cls = '') => {
    const nodes = ids
      .map(id => {
        const p = personById(id);
        if (!p) return '';
        const dead = p.deceased === true;
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
      ${row(['morel-ancestor', 'crooke-grandfather', 'tavarez-grandmother'])}
      <div class="tree-connector" aria-hidden="true"></div>
      ${row(['mami', 'charles', 'ana-luisa', 'manuel', 'georgie'])}
      <div class="tree-connector" aria-hidden="true"></div>
      ${row(['charlie', 'jesus', 'elizabeth', 'yodernis'])}
      <p class="tree-branch-label">${t('tree.unplaced')}</p>
      ${row(['cecilia', 'yencenia', 'hilda'], 'tree-row--unplaced')}
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
  const link = p.page
    ? `<a class="btn-story" href="${esc(p.page)}">${esc(storyButtonLabel(p))}</a>`
    : '';
  box.innerHTML = `${sourceTagHtml(src, who)}<p><strong>${esc(personLabel(p))}</strong></p><p>${esc(note)}</p>${link}`;
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
