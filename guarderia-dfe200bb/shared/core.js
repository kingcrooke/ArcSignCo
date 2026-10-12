function mergeCopy(base, overrides) {
  const out = { es: { ...base.es }, en: { ...base.en } };
  if (!overrides) return out;
  for (const lang of ['es', 'en']) {
    if (overrides[lang]) Object.assign(out[lang], overrides[lang]);
  }
  return out;
}

let currentLang = 'es';

function getCopy() {
  const base = window.GUARDERIA_COPY || { es: {}, en: {} };
  return mergeCopy(base, window.GUARDERIA_COPY_OVERRIDES);
}

function setLanguage(lang) {
  const COPY = getCopy();
  if (!COPY[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  const dict = COPY[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.title = dict['meta.title'] || document.title;
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.setAttribute('aria-pressed', btn.getAttribute('data-lang-btn') === lang ? 'true' : 'false');
  });
  const site = window.GUARDERIA_SITE || {};
  const verseEl = document.getElementById('verse-text');
  if (verseEl && site.verse) verseEl.textContent = site.verse[lang];
  const descriptorEl = document.getElementById('brand-descriptor');
  if (descriptorEl && site.descriptor) descriptorEl.textContent = site.descriptor[lang];
  const mottoEl = document.getElementById('brand-motto');
  if (mottoEl && site.motto) mottoEl.textContent = site.motto[lang];
  else if (mottoEl) mottoEl.hidden = true;
  const creditEl = document.getElementById('music-credit');
  if (creditEl && site.music && site.music.credit) {
    creditEl.textContent = site.music.credit[lang] || site.music.credit.es;
  }
  updateMusicButtonLabel();
  try {
    localStorage.setItem('guarderia-lang', lang);
  } catch {
    /* ignore */
  }
}

function updateMusicButtonLabel() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;
  const COPY = getCopy();
  const dict = COPY[currentLang] || COPY.es;
  const playing = !audio.paused;
  const base = dict['music.label'] || 'Música';
  btn.textContent = playing ? `${base} ▮▮` : `${base} ▶`;
}

function initForm() {
  const form = document.getElementById('inquiry-form');
  const notice = document.getElementById('form-notice');
  if (!form || !notice) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    notice.classList.add('is-visible');
    notice.focus();
  });
}

function initLang() {
  let lang = 'es';
  try {
    const stored = localStorage.getItem('guarderia-lang');
    if (stored === 'en' || stored === 'es') lang = stored;
  } catch {
    /* ignore */
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get('lang') === 'en') lang = 'en';
  if (params.get('lang') === 'es') lang = 'es';
  setLanguage(lang);
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang-btn')));
  });
}

function initMusic() {
  const site = window.GUARDERIA_SITE || {};
  const music = site.music;
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  if (!music || !btn || !audio) return;

  audio.src = music.src;
  audio.loop = true;
  audio.preload = 'none';

  btn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        btn.setAttribute('aria-pressed', 'true');
      } else {
        audio.pause();
        btn.setAttribute('aria-pressed', 'false');
      }
    } catch {
      /* play may be blocked until user gesture — already on click */
    }
    updateMusicButtonLabel();
  });

  audio.addEventListener('play', updateMusicButtonLabel);
  audio.addEventListener('pause', updateMusicButtonLabel);
}

document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initForm();
  initMusic();
});
