(function () {
  var STORAGE_KEY = "novastage-lang";

  var COPY = {
    en: {
      "meta.title": "NovaStage — Performing Arts in New York",
      "meta.description":
        "NovaStage LLC — New York performing arts education and professional stage production. Where talent grows and confidence takes the stage.",
      "lang.group": "Language",
      "lang.en": "EN",
      "lang.es": "ES",
      "skip": "Skip to content",
      "nav.aria": "Site navigation",
      "nav.menu": "Menu",
      "nav.company": "Company",
      "nav.programs": "Programs",
      "nav.schools": "For Schools",
      "nav.production": "Production",
      "nav.contact": "Contact",
      "slogan": "“Where talent grows and confidence takes the stage.”",
      "hero.copy":
        "Performing arts education and production designed to help every artist discover the light they carry.",
      "hero.programs": "Explore programs",
      "hero.contact": "Contact us",
      "about.kicker": "The company",
      "about.title": "Education meets the <em>electricity</em> of live performance.",
      "about.lead":
        "NovaStage LLC is a New York performing arts company bridging arts education and professional production. We create spaces where movement, identity and imagination become confidence onstage and beyond.",
      "about.note":
        "This introductory statement is a working direction while the company’s complete mission and vision are being developed.",
      "about.aria": "NovaStage creative principles",
      "about.orbit": "<span>Our creative center</span>Identity.<br />Movement.<br />Possibility.",
      "programs.kicker": "Programs",
      "programs.title": "A pathway for every <em>age</em> and every story.",
      "programs.lead":
        "Adaptable workshop tracks pair expressive movement with intentional learning goals. Short programs are typically structured across five weeks, with clear class plans from opening session to final sharing.",
      "programs.world.age": "Signature curriculum",
      "programs.world.title": "World Identity",
      "programs.world.body":
        "A movement-centered exploration of culture, self-expression and belonging—adapted to the age group, school community and program length.",
      "programs.world.note":
        "<strong>Mundos en Escena / Worlds on Stage:</strong> Students explore cultural myths, music, and traditional dance through theater and rhythm, building empathy and pride in identity—culminating in a school showcase that celebrates diversity.",
      "programs.first.age": "Ages 3–8",
      "programs.first.title": "First Movements",
      "programs.first.body": "Playful foundations in rhythm, creative movement, coordination and imagination.",
      "programs.young.age": "Ages 9–13",
      "programs.young.title": "Young Artists",
      "programs.young.body":
        "Technique, collaboration and creative voice for students building confidence through movement.",
      "programs.teen.age": "Ages 14–17",
      "programs.teen.title": "Teen Ensemble",
      "programs.teen.body":
        "Focused artistic development, choreography and performance practice for emerging artists.",
      "programs.community.age": "Community · all ages",
      "programs.community.title": "Movement Together",
      "programs.community.body":
        "Accessible programs that invite families and communities to move, create and celebrate shared stories.",
      "programs.styles.aria": "Available dance styles",
      "programs.style.1": "African Caribbean",
      "programs.style.2": "Creative movement",
      "programs.style.3": "Ballet",
      "programs.style.4": "Contemporary",
      "programs.style.5": "Latin dance",
      "programs.style.6": "American folk",
      "schools.kicker": "For schools",
      "schools.title": "A creative partner, built for the <em>school day.</em>",
      "schools.lead":
        "Programs are shaped for school directors, coordinators and DOE after-school teams—balancing artistic discovery with practical structure.",
      "schools.cta": "Request program information",
      "schools.1.title": "Structured curriculum",
      "schools.1.body": "Clear objectives and content shaped for each school, age range and program focus.",
      "schools.2.title": "Week-by-week plans",
      "schools.2.body": "A practical sequence that shows how learning develops from session to session.",
      "schools.3.title": "Professional teaching artists",
      "schools.3.body": "Experienced artists who bring craft, care and an active professional perspective.",
      "schools.4.title": "Adaptable delivery",
      "schools.4.body": "Five-week workshops, multi-month residencies and custom formats for specific communities.",
      "production.kicker": "Production",
      "production.title": "From the studio to the <em>spotlight.</em>",
      "production.lead":
        "NovaStage’s production arm develops performances, artist showcases and live experiences that carry the company’s educational spirit onto the professional stage.",
      "production.soon": "Production slate coming soon",
      "production.1.title": "Performances",
      "production.1.body": "Original and collaborative works",
      "production.2.title": "Showcases",
      "production.2.body": "Platforms for emerging voices",
      "production.3.title": "Events",
      "production.3.body": "Arts-led community experiences",
      "production.4.title": "Partnerships",
      "production.4.body": "Programs made with institutions",
      "contact.kicker": "Contact",
      "contact.title": "Let’s make room for what comes <em>next.</em>",
      "contact.lead": "Tell us about your school, community, program idea or production inquiry.",
      "contact.emailNote": " — placeholder until your email domain is confirmed",
      "contact.place": "New York, NY",
      "form.name": "Name",
      "form.email": "Email",
      "form.interest": "I’m interested in",
      "form.opt.school": "School programs",
      "form.opt.community": "Community workshops",
      "form.opt.production": "Production and events",
      "form.opt.general": "General inquiry",
      "form.message": "Tell us a little more",
      "form.submit": "Send message",
      "form.note":
        "Form preview only — submissions are not sent yet. (TODO: connect Netlify Forms or your preferred handler.)",
      "form.status":
        "Thank you — your message is ready to send once the contact form is connected. (TODO: wire up form handler.)",
      "footer.entity": "NovaStage LLC · New York, NY",
      "footer.credits": "Music credits",
      "music.fallback":
        "Music: tap Play music in the version bar for a classical preview track (licensed; see audio credits).",
      "music.play": "Play music",
      "music.pause": "Pause music",
      "music.play.aria": "Play version music",
      "music.pause.aria": "Pause version music",
      "music.credit": "Music (Version {version}): {piece} — {composer} · {performer} · {license}",
      "version.list": "Brand version preview",
      "version.tab": "Version {n}",
      "music.piece.1": "Dance of the Sugar Plum Fairy (The Nutcracker)",
      "music.piece.2": "Clair de lune (Suite bergamasque)",
      "music.piece.3": "Gymnopédie No. 1",
      "music.piece.4": "The Four Seasons — Spring, Mvt. I (Allegro)",
      "music.piece.5": "Waltz in A minor, B.150",
      "music.piece.6": "Arabesque No. 1 (Deux arabesques)",
      "music.piece.7": "Eine kleine Nachtmusik, K. 525 — II. Romanze",
      "music.performer.1": "Recording via Free Classical Music (YouTube upload to Commons)",
      "music.performer.2": "Laurens Goedhart",
      "music.performer.3": "Teknopazzo",
      "music.performer.4": "John Harrison (violin), Wichita State University Chamber Players",
      "music.performer.5": "Musopen recording (via Wikimedia Commons)",
      "music.performer.6": "Patrizia Prati, piano",
      "music.performer.7": "Musopen recording (via Wikimedia Commons)",
      "music.license.1": "CC BY 3.0",
      "music.license.2": "Public domain",
      "music.license.3": "CC0 1.0",
      "music.license.4": "CC BY-SA 4.0",
      "music.license.5": "Public domain",
      "music.license.6": "CC BY-SA 4.0",
      "music.license.7": "Public domain",
    },
    es: {
      "meta.title": "NovaStage — Artes escénicas en Nueva York",
      "meta.description":
        "NovaStage LLC — educación y producción profesional de artes escénicas en Nueva York. Donde el talento crece y la confianza toma el escenario.",
      "lang.group": "Idioma",
      "lang.en": "EN",
      "lang.es": "ES",
      "skip": "Saltar al contenido",
      "nav.aria": "Navegación del sitio",
      "nav.menu": "Menú",
      "nav.company": "La compañía",
      "nav.programs": "Programas",
      "nav.schools": "Para escuelas",
      "nav.production": "Producción",
      "nav.contact": "Contacto",
      "slogan": "“Donde el talento crece y la confianza toma el escenario.”",
      "hero.copy":
        "Educación y producción de artes escénicas pensadas para que cada artista descubra la luz que lleva dentro.",
      "hero.programs": "Explorar programas",
      "hero.contact": "Contáctanos",
      "about.kicker": "La compañía",
      "about.title": "La educación se encuentra con la <em>electricidad</em> del espectáculo en vivo.",
      "about.lead":
        "NovaStage LLC es una compañía de artes escénicas de Nueva York que une la educación artística y la producción profesional. Creamos espacios donde el movimiento, la identidad y la imaginación se vuelven confianza en el escenario y más allá.",
      "about.note":
        "Este texto de presentación es una dirección de trabajo, mientras se desarrolla la misión y la visión completas de la compañía.",
      "about.aria": "Principios creativos de NovaStage",
      "about.orbit": "<span>Nuestro centro creativo</span>Identidad.<br />Movimiento.<br />Posibilidad.",
      "programs.kicker": "Programas",
      "programs.title": "Un camino para cada <em>edad</em> y cada historia.",
      "programs.lead":
        "Los talleres se adaptan y combinan el movimiento expresivo con objetivos de aprendizaje claros. Los programas cortos suelen organizarse en cinco semanas, con planes de clase desde la primera sesión hasta la muestra final.",
      "programs.world.age": "Currículo insignia",
      "programs.world.title": "Identidad del mundo",
      "programs.world.body":
        "Una exploración del movimiento centrada en la cultura, la expresión personal y el sentido de pertenencia, adaptada a la edad, a la comunidad escolar y a la duración del programa.",
      "programs.world.note":
        "<strong>Mundos en Escena:</strong> Los estudiantes exploran mitos culturales, música y danzas tradicionales a través del teatro y el ritmo. Así construyen empatía y orgullo por su identidad, y cierran con una muestra escolar que celebra la diversidad.",
      "programs.first.age": "De 3 a 8 años",
      "programs.first.title": "Primeros movimientos",
      "programs.first.body": "Bases lúdicas de ritmo, movimiento creativo, coordinación e imaginación.",
      "programs.young.age": "De 9 a 13 años",
      "programs.young.title": "Jóvenes artistas",
      "programs.young.body":
        "Técnica, colaboración y voz creativa para estudiantes que ganan confianza a través del movimiento.",
      "programs.teen.age": "De 14 a 17 años",
      "programs.teen.title": "Ensamble para adolescentes",
      "programs.teen.body":
        "Desarrollo artístico, coreografía y práctica escénica para artistas que están empezando.",
      "programs.community.age": "Comunidad · todas las edades",
      "programs.community.title": "Moverse juntos",
      "programs.community.body":
        "Programas accesibles que invitan a familias y comunidades a moverse, crear y celebrar historias compartidas.",
      "programs.styles.aria": "Estilos de danza",
      "programs.style.1": "Afrocaribeño",
      "programs.style.2": "Movimiento creativo",
      "programs.style.3": "Ballet",
      "programs.style.4": "Contemporáneo",
      "programs.style.5": "Danza latina",
      "programs.style.6": "Folclor estadounidense",
      "schools.kicker": "Para escuelas",
      "schools.title": "Un aliado creativo, pensado para la <em>jornada escolar.</em>",
      "schools.lead":
        "Los programas se diseñan para directoras y directores, coordinadores y equipos extracurriculares del Departamento de Educación (DOE): equilibran el descubrimiento artístico con una estructura práctica.",
      "schools.cta": "Solicitar información del programa",
      "schools.1.title": "Currículo estructurado",
      "schools.1.body": "Objetivos y contenidos claros, adaptados a cada escuela, rango de edad y enfoque del programa.",
      "schools.2.title": "Planes semana a semana",
      "schools.2.body": "Una secuencia práctica que muestra cómo avanza el aprendizaje de una sesión a otra.",
      "schools.3.title": "Artistas docentes",
      "schools.3.body": "Artistas con experiencia que aportan oficio, cuidado y una mirada profesional activa.",
      "schools.4.title": "Formatos flexibles",
      "schools.4.body":
        "Talleres de cinco semanas, residencias de varios meses y formatos a la medida de cada comunidad.",
      "production.kicker": "Producción",
      "production.title": "Del estudio al <em>foco.</em>",
      "production.lead":
        "El área de producción de NovaStage crea espectáculos, muestras de artistas y experiencias en vivo que llevan el espíritu educativo de la compañía al escenario profesional.",
      "production.soon": "La programación de producciones estará disponible pronto",
      "production.1.title": "Espectáculos",
      "production.1.body": "Obras originales y en colaboración",
      "production.2.title": "Muestras",
      "production.2.body": "Espacios para voces emergentes",
      "production.3.title": "Eventos",
      "production.3.body": "Experiencias comunitarias guiadas por el arte",
      "production.4.title": "Alianzas",
      "production.4.body": "Programas creados con instituciones",
      "contact.kicker": "Contacto",
      "contact.title": "Hagamos espacio para lo que viene <em>después.</em>",
      "contact.lead": "Cuéntanos sobre tu escuela, tu comunidad, tu idea de programa o tu consulta de producción.",
      "contact.emailNote": " — texto provisional hasta confirmar el dominio del correo",
      "contact.place": "New York, NY",
      "form.name": "Nombre",
      "form.email": "Correo",
      "form.interest": "Me interesa",
      "form.opt.school": "Programas escolares",
      "form.opt.community": "Talleres comunitarios",
      "form.opt.production": "Producción y eventos",
      "form.opt.general": "Consulta general",
      "form.message": "Cuéntanos un poco más",
      "form.submit": "Enviar mensaje",
      "form.note":
        "Vista previa del formulario: los mensajes todavía no se envían. (Pendiente: conectar Netlify Forms u otro sistema.)",
      "form.status":
        "Gracias. Tu mensaje quedará listo para enviarse cuando el formulario esté conectado. (Pendiente: conectar el envío.)",
      "footer.entity": "NovaStage LLC · New York, NY",
      "footer.credits": "Créditos musicales",
      "music.fallback":
        "Música: toca Reproducir música en la barra de versiones para escuchar un tema clásico de muestra (con licencia; ver créditos musicales).",
      "music.play": "Reproducir música",
      "music.pause": "Pausar música",
      "music.play.aria": "Reproducir la música de la versión",
      "music.pause.aria": "Pausar la música de la versión",
      "music.credit": "Música (Versión {version}): {piece} — {composer} · {performer} · {license}",
      "version.list": "Vista previa de versiones de la marca",
      "version.tab": "Versión {n}",
      "music.piece.1": "Danza del Hada de Azúcar (El cascanueces)",
      "music.piece.2": "Claro de luna (Suite bergamasque)",
      "music.piece.3": "Gymnopédie n.º 1",
      "music.piece.4": "Las cuatro estaciones — Primavera, I. Allegro",
      "music.piece.5": "Vals en la menor, B.150",
      "music.piece.6": "Arabesca n.º 1 (Deux arabesques)",
      "music.piece.7": "Una pequeña serenata nocturna, K. 525 — II. Romanza",
      "music.performer.1": "Grabación de Free Classical Music (publicada en Commons desde YouTube)",
      "music.performer.2": "Laurens Goedhart",
      "music.performer.3": "Teknopazzo",
      "music.performer.4": "John Harrison (violín), Wichita State University Chamber Players",
      "music.performer.5": "Grabación de Musopen (vía Wikimedia Commons)",
      "music.performer.6": "Patrizia Prati, piano",
      "music.performer.7": "Grabación de Musopen (vía Wikimedia Commons)",
      "music.license.1": "CC BY 3.0",
      "music.license.2": "Dominio público",
      "music.license.3": "CC0 1.0",
      "music.license.4": "CC BY-SA 4.0",
      "music.license.5": "Dominio público",
      "music.license.6": "CC BY-SA 4.0",
      "music.license.7": "Dominio público",
    },
  };

  var currentLang = "en";

  function t(key, vars) {
    var dict = COPY[currentLang] || COPY.en;
    var value = dict[key];
    if (value === undefined) {
      value = COPY.en[key];
    }
    if (value === undefined) {
      return "";
    }
    if (!vars) {
      return value;
    }
    return value.replace(/\{(\w+)\}/g, function (_, name) {
      return vars[name] === undefined ? "" : String(vars[name]);
    });
  }

  function setLanguage(lang, writeUrl) {
    if (!COPY[lang]) {
      return;
    }
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (COPY[lang][key] !== undefined) {
        el.textContent = COPY[lang][key];
      }
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (COPY[lang][key] !== undefined) {
        el.innerHTML = COPY[lang][key];
      }
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (COPY[lang][key] !== undefined) {
        el.setAttribute("aria-label", COPY[lang][key]);
      }
    });

    document.title = t("meta.title");
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", t("meta.description"));
    }

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-btn") === lang ? "true" : "false");
    });

    var status = document.getElementById("form-status");
    if (status && status.getAttribute("data-filled") === "1") {
      status.textContent = t("form.status");
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }

    if (writeUrl) {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url.toString());
    }

    if (window.NOVASTAGE_refreshVersionLabels) {
      window.NOVASTAGE_refreshVersionLabels();
    }
    if (window.NOVASTAGE_audio && window.NOVASTAGE_audio.syncLabels) {
      window.NOVASTAGE_audio.syncLabels();
    }
  }

  function resolveLang() {
    var lang = "en";
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "es") {
        lang = stored;
      }
    } catch (e) {
      /* ignore */
    }
    var params = new URLSearchParams(window.location.search);
    if (params.get("lang") === "en") {
      lang = "en";
    }
    if (params.get("lang") === "es") {
      lang = "es";
    }
    return lang;
  }

  window.NOVASTAGE_t = t;
  window.NOVASTAGE_lang = function () {
    return currentLang;
  };
  window.NOVASTAGE_setLanguage = setLanguage;

  document.addEventListener("DOMContentLoaded", function () {
    setLanguage(resolveLang(), false);
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLanguage(btn.getAttribute("data-lang-btn"), true);
      });
    });
  });
})();
