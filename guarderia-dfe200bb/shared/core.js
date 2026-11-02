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

function dictFor(lang) {
  const COPY = getCopy();
  return COPY[lang] || COPY.es || {};
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
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
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
    creditEl.setAttribute('lang', lang);
  }
  updateMusicButtonLabel();
  updateNavToggleLabel();
  refreshContactLinks();
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
  const dict = dictFor(currentLang);
  const playing = !audio.paused;
  const base = dict['music.label'] || 'Música';
  btn.textContent = playing ? `${base} ▮▮` : `${base} ▶`;
  const ariaKey = playing ? 'music.aria.pause' : 'music.aria.play';
  btn.setAttribute('aria-label', dict[ariaKey] || (playing ? 'Pause music' : 'Play music'));
}

function isMobileNav() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function updateNavToggleLabel() {
  const btn = document.querySelector('.nav-toggle');
  if (!btn) return;
  const dict = dictFor(currentLang);
  const open = btn.getAttribute('aria-expanded') === 'true';
  const key = open ? 'nav.menu.close' : 'nav.menu.open';
  btn.setAttribute('aria-label', dict[key] || (open ? 'Cerrar menú' : 'Abrir menú'));
}

function setNavOpen(open) {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  const mobile = isMobileNav();
  const show = Boolean(open) && mobile;
  nav.classList.toggle('is-open', show);
  btn.setAttribute('aria-expanded', show ? 'true' : 'false');
  nav.inert = mobile && !show;
  document.body.classList.toggle('nav-open', show);
  updateNavToggleLabel();
}

function initNav() {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  setNavOpen(false);

  btn.addEventListener('click', () => {
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    setNavOpen(willOpen);
    if (willOpen) {
      const first = nav.querySelector('a');
      if (first) first.focus();
    }
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setNavOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    setNavOpen(false);
    btn.focus();
  });

  document.addEventListener('click', (event) => {
    if (!isMobileNav()) return;
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    if (btn.contains(event.target) || nav.contains(event.target)) return;
    setNavOpen(false);
  });

  const query = window.matchMedia('(max-width: 767px)');
  const onChange = () => setNavOpen(false);
  if (typeof query.addEventListener === 'function') query.addEventListener('change', onChange);
  else if (typeof query.addListener === 'function') query.addListener(onChange);
}

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function isReadyNumber(value) {
  if (value == null) return false;
  if (/pendiente/i.test(String(value))) return false;
  const digits = digitsOnly(value);
  return digits.length >= 10 && digits.length <= 15;
}

function whatsappHref(digits, name) {
  const text = `Hola, me interesa la guardería ${name}. ¿Podría darme más información?`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function refreshContactLinks() {
  const site = window.GUARDERIA_SITE || {};
  const dict = dictFor(currentLang);
  const name = (site.name && site.name.es) || 'Corderitos';
  const waReady = isReadyNumber(site.whatsappNumber);
  const phoneReady = isReadyNumber(site.phoneNumber);

  document.querySelectorAll('[data-contact="whatsapp"]').forEach((el) => {
    if (waReady) {
      el.href = whatsappHref(digitsOnly(site.whatsappNumber), name);
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.removeAttribute('title');
      el.dataset.pending = 'false';
    } else {
      el.href = '#contacto';
      el.removeAttribute('target');
      el.title = dict['contact.pending.whatsapp'] || '';
      el.dataset.pending = 'true';
    }
  });

  document.querySelectorAll('[data-contact="phone"]').forEach((el) => {
    if (phoneReady) {
      el.href = `tel:+${digitsOnly(site.phoneNumber)}`;
      el.removeAttribute('target');
      el.removeAttribute('title');
      el.dataset.pending = 'false';
    } else {
      el.href = '#contacto';
      el.removeAttribute('target');
      el.title = dict['contact.pending.phone'] || '';
      el.dataset.pending = 'true';
    }
  });
}

function initContact() {
  const dialog = document.getElementById('contact-pending');
  const dialogText = document.getElementById('contact-pending-text');

  document.querySelectorAll('[data-contact]').forEach((el) => {
    el.addEventListener('click', (event) => {
      if (el.dataset.pending !== 'true') return;
      event.preventDefault();
      const dict = dictFor(currentLang);
      const key = el.dataset.contact === 'phone' ? 'contact.pending.phone' : 'contact.pending.whatsapp';
      const message = dict[key] || el.title || '';
      if (dialog && dialogText && typeof dialog.showModal === 'function') {
        dialogText.setAttribute('data-i18n', key);
        dialogText.textContent = message;
        if (!dialog.open) dialog.showModal();
      } else {
        window.alert(message);
      }
    });
  });

  refreshContactLinks();
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
      /* play may be blocked until a user gesture — this handler is that gesture */
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
  initNav();
  initContact();
});
