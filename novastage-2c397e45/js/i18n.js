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
      "invert.label": "Invert colors",
      "skip": "Skip to content",
      "nav.aria": "Site navigation",
      "nav.menu": "Menu",
      "nav.company": "Company",
      "nav.programs": "Programs",
      "nav.schools": "For Schools",
      "nav.production": "Production",
      "nav.portfolio": "Portfolio",
      "nav.contact": "Contact",
      "meta.portfolio.title": "Elizabeth Crooke — Choreographer · Director · Dancer | NovaStage",
      "meta.portfolio.description":
        "Source-backed portfolio for Elizabeth Crooke — Ballet Folklórico Nacional Dominicano leadership, Dominican and NYC career, and NovaStage booking.",
      "portfolio.eyebrow": "NovaStage artist portfolio",
      "portfolio.roles": "Choreographer · Director · Dancer",
      "portfolio.tagline":
        "From Dominican national stages to New York classrooms — movement rooted in folklore, classical craft, and cultural storytelling.",
      "portfolio.cta.book": "Book via NovaStage",
      "portfolio.cta.work": "View productions",
      "portfolio.photo.placeholder": "Photo placeholder — licensed headshot pending",
      "portfolio.bio.kicker": "Biography",
      "portfolio.bio.title": "A life in <em>movement</em> across two shores.",
      "portfolio.bio.lead":
        "Elizabeth Crooke is a choreographer, director, and dancer whose career spans the Dominican Republic’s flagship folk and ballet institutions and New York arts education. Hispanic Culture Arts describes 25+ years in choreography and teaching, with specialties in ballet, contemporary, musical theater, Afro-Caribbean dance, Dominican folk, and Latin social dances.",
      "portfolio.bio.lead2":
        "She holds a BA in Dance Pedagogy (2010) and an MA in Performing Arts from Rey Juan Carlos University, Madrid (HCA). Press and institutional records document leadership of the Ballet Folklórico Nacional Dominicano, cultural programming for Dominican foreign affairs, and independent teaching for NYC public schools since 2022.",
      "portfolio.timeline.kicker": "Career timeline",
      "portfolio.timeline.title": "Dominican Republic to <em>New York.</em>",
      "portfolio.timeline.lead":
        "Milestones drawn from Hispanic Culture Arts, Dominican national press, and documented institutional credits. Dates reflect published sources unless noted.",
      "portfolio.timeline.t1.year": "2010 · Education",
      "portfolio.timeline.t1.title": "Dance pedagogy & performing arts studies",
      "portfolio.timeline.t1.body":
        "BA in Dance Pedagogy (2010); MA in Performing Arts, Rey Juan Carlos University, Madrid — as listed on Hispanic Culture Arts.",
      "portfolio.timeline.t2.year": "2012",
      "portfolio.timeline.t2.title": "Premios Casandra — Coreógrafo clásico",
      "portfolio.timeline.t2.body":
        "Winner, classical choreographer category (Premios Casandra 2012), listed in El Nacional and acknowledged in Ensegundos, March 2012.",
      "portfolio.timeline.t3.year": "2012–2016",
      "portfolio.timeline.t3.title": "Artistic Director, Ballet Folklórico Nacional Dominicano",
      "portfolio.timeline.t3.body":
        "Directed the national folkloric ballet of the Dominican Republic (BFND). HCA lists 2012–2016; El Nacional covered her as director in 2013 (“Somos Dominicana!”) and 2016 (folklore identity interview).",
      "portfolio.timeline.t4.year": "2013",
      "portfolio.timeline.t4.title": "MOMENTOS · Restauración & Premios Soberano",
      "portfolio.timeline.t4.body":
        "Choreographed the Restauración piece in patriotic ballet MOMENTOS (El Nacional, May 2013). Led choreography and casting for Premios Soberano 2013 at Teatro Nacional (Ensegundos / Listín, Jan 2013).",
      "portfolio.timeline.t5.year": "2016–2020",
      "portfolio.timeline.t5.title": "Ministry of Foreign Affairs — cultural promotion",
      "portfolio.timeline.t5.body":
        "Head of Cultural Promotion and artistic director of the Popular and Contemporary Folk Dance Company, Ministry of Foreign Affairs (HCA). Open letter (Aug 2020) describes Encargada de Difusión Cultural and directing the MIREX artistic corps.",
      "portfolio.timeline.t6.year": "2022",
      "portfolio.timeline.t6.title": "Fundación Mov Arte · Ballet Sinergia · Colombia",
      "portfolio.timeline.t6.body":
        "As director of Fundación Mov Arte, led Ballet Sinergia to the Ibero-American Festival in Bucaramanga, Colombia, with “República Dominicana Soy” (Diario Hispaniola & El Día, April 2022).",
      "portfolio.timeline.t7.year": "2022–present",
      "portfolio.timeline.t7.title": "New York — teaching artist & independent vendor",
      "portfolio.timeline.t7.body":
        "Teaching artist with Hispanic Culture Arts (Bronx). HCA states she has taught dance education programs for NYC public schools as an independent vendor since 2022.",
      "portfolio.work.kicker": "Featured productions",
      "portfolio.work.title": "Stages, spectacles & <em>cultural diplomacy.</em>",
      "portfolio.work.w1.meta": "BFND · Teatro Nacional · 2013",
      "portfolio.work.w1.title": "Somos Dominicana!",
      "portfolio.work.w1.body":
        "Updated BFND profile presented at Teatro Nacional, Sala Carlos Piantini; musical collaboration with David Armengod (El Nacional, Nov 2013).",
      "portfolio.work.w2.meta": "Patriotic ballet · ~2013",
      "portfolio.work.w2.title": "MOMENTOS — Restauración",
      "portfolio.work.w2.body":
        "Choreography for Restauración sequence with BFND, Ballet Nacional dancers, and guests; Franklin Díaz as Luperón (El Nacional, May 2013).",
      "portfolio.work.w3.meta": "Awards show · Apr 2013",
      "portfolio.work.w3.title": "Premios Soberano 2013",
      "portfolio.work.w3.body":
        "Show choreographer and casting lead; genres included lyrical, street/urban, Latin mix, and freestyle (Ensegundos, Jan 2013).",
      "portfolio.work.w4.meta": "Festival · Colombia · 2022",
      "portfolio.work.w4.title": "República Dominicana Soy",
      "portfolio.work.w4.body":
        "Ballet Sinergia / Fundación Mov Arte — merengue, bachata, and Congos de Villa Mella on tour with ~20 artists (Diario Hispaniola & El Día).",
      "portfolio.work.w5.meta": "Casandra · nomination cycle",
      "portfolio.work.w5.title": "Danza: Cuatro estilos",
      "portfolio.work.w5.body":
        "Nominee, classical/modern dancer category (“Danza: Cuatro estilos”) — Dominicana Online Casandra nominee list (separate from 2012 choreographer win).",
      "portfolio.expertise.kicker": "Styles & expertise",
      "portfolio.expertise.title": "Technique, folklore & <em>musical collaboration.</em>",
      "portfolio.expertise.lead":
        "Movement vocabulary reflected across HCA teaching specialties and Dominican press coverage of BFND and touring work.",
      "portfolio.expertise.p1": "Classical ballet",
      "portfolio.expertise.p2": "Contemporary",
      "portfolio.expertise.p3": "Dominican & Latin American folklore",
      "portfolio.expertise.p4": "Afro-Caribbean / African diaspora",
      "portfolio.expertise.p5": "Historical & cultural narrative pieces",
      "portfolio.expertise.p6": "Musical theater",
      "portfolio.expertise.p7": "Latin & social dances",
      "portfolio.expertise.p8": "Music direction collaboration",
      "portfolio.orgs.kicker": "Companies & institutions",
      "portfolio.orgs.title": "Affiliations & <em>leadership.</em>",
      "portfolio.orgs.o1.name": "Ballet Folklórico Nacional Dominicano (BFND)",
      "portfolio.orgs.o1.role": "Artistic Director (published 2012–2016, HCA)",
      "portfolio.orgs.o2.name": "Ballet Nacional Dominicano",
      "portfolio.orgs.o2.role": "Former company dancer (2020 open letter)",
      "portfolio.orgs.o3.name": "Fundación Mov Arte · Ballet Sinergia",
      "portfolio.orgs.o3.role": "Director / choreographer (2022 press)",
      "portfolio.orgs.o4.name": "Ministerio de Relaciones Exteriores (MIREX)",
      "portfolio.orgs.o4.role": "Cultural promotion & artistic corps (HCA; 2020 press)",
      "portfolio.orgs.o5.name": "Hispanic Culture Arts",
      "portfolio.orgs.o5.role": "Teaching artist — Bronx, NY (HCA About)",
      "portfolio.orgs.o6.name": "Danzart Studio",
      "portfolio.orgs.o6.role": "Casting & studio contact (Premios Soberano 2013 notices)",
      "portfolio.teaching.kicker": "Teaching",
      "portfolio.teaching.title": "Classrooms, ensembles & <em>community.</em>",
      "portfolio.teaching.lead":
        "HCA lists ballet, contemporary, musical theater, Afro-Caribbean, Dominican folk, and Latin social dances for K–12 and community settings. Since 2022 she has taught NYC public school programs as an independent vendor (HCA).",
      "portfolio.teaching.note":
        "Collaborator bio on HCA also references co-led workshops with Isidro Bobadilla for Jazz Power Inc. (dates and venues not listed on the public page).",
      "portfolio.teaching.placeholder": "Classroom photo placeholder — usage rights pending",
      "portfolio.press.kicker": "Press & recognition",
      "portfolio.press.title": "Documented <em>coverage.</em>",
      "portfolio.press.lead": "Selected articles and award listings — external links open in a new tab.",
      "portfolio.press.p1.title": "Premios Casandra — Coreógrafo clásico winner list",
      "portfolio.press.p1.source": "El Nacional",
      "portfolio.press.p2.title": "“Somos Dominicana!” — BFND profile",
      "portfolio.press.p2.source": "El Nacional · 2013",
      "portfolio.press.p3.title": "Elizabeth y la Restauración — MOMENTOS",
      "portfolio.press.p3.source": "El Nacional · 2013",
      "portfolio.press.p4.title": "Crooke respeta bases del folklore RD",
      "portfolio.press.p4.source": "El Nacional · 2016",
      "portfolio.press.p5.title": "Teaching artist biography",
      "portfolio.press.p5.source": "Hispanic Culture Arts",
      "portfolio.media.kicker": "Photo & video",
      "portfolio.media.title": "Reel & gallery <em>coming soon.</em>",
      "portfolio.media.lead":
        "No verified personal showreel URL was found in public research. Slots below are reserved for cleared performance and classroom footage.",
      "portfolio.media.v1": "Video placeholder — BFND / stage performance",
      "portfolio.media.v2": "Video placeholder — choreography reel",
      "portfolio.booking.kicker": "Booking",
      "portfolio.booking.title": "Produce with <em>NovaStage.</em>",
      "portfolio.booking.lead":
        "NovaStage books dancers, models, musicians, choreography, and full show production. Share your dates, venue, and creative goals — we’ll route production inquiries through NovaStage.",
      "portfolio.booking.s1": "Performers & ensemble casting",
      "portfolio.booking.s2": "Original choreography & cultural repertoire",
      "portfolio.booking.s3": "Music direction collaboration",
      "portfolio.booking.s4": "School residencies & community showcases",
      "portfolio.booking.s5": "Full-scale show production",
      "portfolio.booking.emailNote": " — NovaStage booking placeholder",
      "portfolio.booking.interestLabel": "Booking interest",
      "portfolio.booking.opt.dancers": "Dancers / performers",
      "portfolio.booking.opt.choreography": "Choreography",
      "portfolio.booking.opt.musicians": "Musicians",
      "portfolio.booking.opt.production": "Full show production",
      "portfolio.booking.submit": "Request booking",
      "portfolio.form.status":
        "Thank you — your booking request is ready to send once the contact form is connected. (TODO: wire up form handler.)",
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
      "music.piece.8": "Clair de lune (Suite bergamasque)",
      "music.performer.1": "Recording via Free Classical Music (YouTube upload to Commons)",
      "music.performer.2": "Laurens Goedhart",
      "music.performer.3": "Teknopazzo",
      "music.performer.4": "John Harrison (violin), Wichita State University Chamber Players",
      "music.performer.5": "Musopen recording (via Wikimedia Commons)",
      "music.performer.6": "Patrizia Prati, piano",
      "music.performer.7": "Musopen recording (via Wikimedia Commons)",
      "music.performer.8": "Laurens Goedhart",
      "music.license.1": "CC BY 3.0",
      "music.license.2": "Public domain",
      "music.license.3": "CC0 1.0",
      "music.license.4": "CC BY-SA 4.0",
      "music.license.5": "Public domain",
      "music.license.6": "CC BY-SA 4.0",
      "music.license.7": "Public domain",
      "music.license.8": "Public domain",
    },
    es: {
      "meta.title": "NovaStage — Artes escénicas en Nueva York",
      "meta.description":
        "NovaStage LLC — educación y producción profesional de artes escénicas en Nueva York. Donde el talento crece y la confianza toma el escenario.",
      "lang.group": "Idioma",
      "lang.en": "EN",
      "lang.es": "ES",
      "invert.label": "Invertir colores",
      "skip": "Saltar al contenido",
      "nav.aria": "Navegación del sitio",
      "nav.menu": "Menú",
      "nav.company": "La compañía",
      "nav.programs": "Programas",
      "nav.schools": "Para escuelas",
      "nav.production": "Producción",
      "nav.portfolio": "Portafolio",
      "nav.contact": "Contacto",
      "meta.portfolio.title": "Elizabeth Crooke — Coreógrafa · Directora · Bailarina | NovaStage",
      "meta.portfolio.description":
        "Portafolio documentado de Elizabeth Crooke — dirección del Ballet Folklórico Nacional Dominicano, trayectoria en RD y NYC, y reservas con NovaStage.",
      "portfolio.eyebrow": "Portafolio de artista NovaStage",
      "portfolio.roles": "Coreógrafa · Directora · Bailarina",
      "portfolio.tagline":
        "De los escenarios nacionales dominicanos a las aulas de Nueva York — movimiento arraigado en folclor, técnica clásica y narrativa cultural.",
      "portfolio.cta.book": "Reservar con NovaStage",
      "portfolio.cta.work": "Ver producciones",
      "portfolio.photo.placeholder": "Marcador de foto — retrato con licencia pendiente",
      "portfolio.bio.kicker": "Biografía",
      "portfolio.bio.title": "Una vida en <em>movimiento</em> entre dos orillas.",
      "portfolio.bio.lead":
        "Elizabeth Crooke es coreógrafa, directora y bailarina cuya carrera abarca las principales instituciones folclóricas y de ballet de la República Dominicana y la educación artística en Nueva York. Hispanic Culture Arts describe más de 25 años en coreografía y docencia, con especialidades en ballet, contemporáneo, teatro musical, danza afrocaribeña, folclor dominicano y danzas sociales latinas.",
      "portfolio.bio.lead2":
        "Tiene licenciatura en Pedagogía de la Danza (2010) y maestría en Artes Escénicas de la Universidad Rey Juan Carlos, Madrid (HCA). Prensa e instituciones documentan su dirección del Ballet Folklórico Nacional Dominicano, programación cultural para la cancillería dominicana y docencia independiente en escuelas públicas de NYC desde 2022.",
      "portfolio.timeline.kicker": "Línea de tiempo",
      "portfolio.timeline.title": "De República Dominicana a <em>Nueva York.</em>",
      "portfolio.timeline.lead":
        "Hitos tomados de Hispanic Culture Arts, prensa nacional dominicana y créditos institucionales documentados. Las fechas reflejan fuentes publicadas salvo que se indique lo contrario.",
      "portfolio.timeline.t1.year": "2010 · Formación",
      "portfolio.timeline.t1.title": "Pedagogía de la danza y artes escénicas",
      "portfolio.timeline.t1.body":
        "Licenciatura en Pedagogía de la Danza (2010); maestría en Artes Escénicas, Universidad Rey Juan Carlos, Madrid — según Hispanic Culture Arts.",
      "portfolio.timeline.t2.year": "2012",
      "portfolio.timeline.t2.title": "Premios Casandra — Coreógrafo clásico",
      "portfolio.timeline.t2.body":
        "Ganadora en la categoría coreógrafo clásico (Premios Casandra 2012), listada en El Nacional y reconocida en Ensegundos, marzo de 2012.",
      "portfolio.timeline.t3.year": "2012–2016",
      "portfolio.timeline.t3.title": "Directora artística, Ballet Folklórico Nacional Dominicano",
      "portfolio.timeline.t3.body":
        "Dirigió el ballet folclórico nacional de la República Dominicana (BFND). HCA indica 2012–2016; El Nacional la cubrió como directora en 2013 («Somos Dominicana!») y 2016 (entrevista sobre identidad folclórica).",
      "portfolio.timeline.t4.year": "2013",
      "portfolio.timeline.t4.title": "MOMENTOS · Restauración y Premios Soberano",
      "portfolio.timeline.t4.body":
        "Coreografía de la pieza de Restauración en el ballet patriótico MOMENTOS (El Nacional, mayo 2013). Lideró coreografía y casting de Premios Soberano 2013 en el Teatro Nacional (Ensegundos / Listín, ene. 2013).",
      "portfolio.timeline.t5.year": "2016–2020",
      "portfolio.timeline.t5.title": "Ministerio de Relaciones Exteriores — promoción cultural",
      "portfolio.timeline.t5.body":
        "Jefa de Promoción Cultural y directora artística de la Compañía de Danza Popular y Contemporánea, Ministerio de Relaciones Exteriores (HCA). Carta abierta (ago. 2020) describe el cargo de Encargada de Difusión Cultural y la dirección del cuerpo artístico del MIREX.",
      "portfolio.timeline.t6.year": "2022",
      "portfolio.timeline.t6.title": "Fundación Mov Arte · Ballet Sinergia · Colombia",
      "portfolio.timeline.t6.body":
        "Como directora de Fundación Mov Arte, llevó Ballet Sinergia al Festival Iberoamericano en Bucaramanga, Colombia, con «República Dominicana Soy» (Diario Hispaniola y El Día, abril 2022).",
      "portfolio.timeline.t7.year": "2022–actualidad",
      "portfolio.timeline.t7.title": "Nueva York — artista docente y proveedora independiente",
      "portfolio.timeline.t7.body":
        "Artista docente con Hispanic Culture Arts (Bronx). HCA indica que imparte programas de educación en danza en escuelas públicas de NYC como proveedora independiente desde 2022.",
      "portfolio.work.kicker": "Producciones destacadas",
      "portfolio.work.title": "Escenarios, espectáculos y <em>diplomacia cultural.</em>",
      "portfolio.work.w1.meta": "BFND · Teatro Nacional · 2013",
      "portfolio.work.w1.title": "Somos Dominicana!",
      "portfolio.work.w1.body":
        "Nuevo perfil del BFND en el Teatro Nacional, Sala Carlos Piantini; colaboración musical con David Armengod (El Nacional, nov. 2013).",
      "portfolio.work.w2.meta": "Ballet patriótico · ~2013",
      "portfolio.work.w2.title": "MOMENTOS — Restauración",
      "portfolio.work.w2.body":
        "Coreografía de la secuencia de Restauración con BFND, bailarines del Ballet Nacional e invitados; Franklin Díaz como Luperón (El Nacional, mayo 2013).",
      "portfolio.work.w3.meta": "Gala de premios · abr. 2013",
      "portfolio.work.w3.title": "Premios Soberano 2013",
      "portfolio.work.w3.body":
        "Coreógrafa del espectáculo y líder de casting; géneros incluyeron lírico, urbano, mezcla latina y estilo libre (Ensegundos, ene. 2013).",
      "portfolio.work.w4.meta": "Festival · Colombia · 2022",
      "portfolio.work.w4.title": "República Dominicana Soy",
      "portfolio.work.w4.body":
        "Ballet Sinergia / Fundación Mov Arte — merengue, bachata y Congos de Villa Mella en gira con ~20 artistas (Diario Hispaniola y El Día).",
      "portfolio.work.w5.meta": "Casandra · ciclo de nominación",
      "portfolio.work.w5.title": "Danza: Cuatro estilos",
      "portfolio.work.w5.body":
        "Nominada, categoría bailarina clásica y/o moderna («Danza: Cuatro estilos») — lista de nominados en Dominicana Online (distinto del premio de coreógrafo 2012).",
      "portfolio.expertise.kicker": "Estilos y experiencia",
      "portfolio.expertise.title": "Técnica, folclor y <em>colaboración musical.</em>",
      "portfolio.expertise.lead":
        "Vocabulario de movimiento reflejado en las especialidades docentes de HCA y la cobertura de prensa dominicana del BFND y giras.",
      "portfolio.expertise.p1": "Ballet clásico",
      "portfolio.expertise.p2": "Contemporáneo",
      "portfolio.expertise.p3": "Folclor dominicano y latinoamericano",
      "portfolio.expertise.p4": "Afrocaribeño / diáspora africana",
      "portfolio.expertise.p5": "Piezas históricas y culturales",
      "portfolio.expertise.p6": "Teatro musical",
      "portfolio.expertise.p7": "Danza latina y social",
      "portfolio.expertise.p8": "Colaboración en dirección musical",
      "portfolio.orgs.kicker": "Compañías e instituciones",
      "portfolio.orgs.title": "Afiliaciones y <em>liderazgo.</em>",
      "portfolio.orgs.o1.name": "Ballet Folklórico Nacional Dominicano (BFND)",
      "portfolio.orgs.o1.role": "Directora artística (publicado 2012–2016, HCA)",
      "portfolio.orgs.o2.name": "Ballet Nacional Dominicano",
      "portfolio.orgs.o2.role": "Ex bailarina de compañía (carta abierta 2020)",
      "portfolio.orgs.o3.name": "Fundación Mov Arte · Ballet Sinergia",
      "portfolio.orgs.o3.role": "Directora / coreógrafa (prensa 2022)",
      "portfolio.orgs.o4.name": "Ministerio de Relaciones Exteriores (MIREX)",
      "portfolio.orgs.o4.role": "Promoción cultural y cuerpo artístico (HCA; prensa 2020)",
      "portfolio.orgs.o5.name": "Hispanic Culture Arts",
      "portfolio.orgs.o5.role": "Artista docente — Bronx, NY (HCA About)",
      "portfolio.orgs.o6.name": "Danzart Studio",
      "portfolio.orgs.o6.role": "Casting y estudio (avisos Premios Soberano 2013)",
      "portfolio.teaching.kicker": "Docencia",
      "portfolio.teaching.title": "Aulas, ensembles y <em>comunidad.</em>",
      "portfolio.teaching.lead":
        "HCA enumera ballet, contemporáneo, teatro musical, afrocaribeño, folclor dominicano y danzas sociales latinas para K–12 y comunidad. Desde 2022 imparte programas en escuelas públicas de NYC como proveedora independiente (HCA).",
      "portfolio.teaching.note":
        "La biografía de un colaborador en HCA también menciona talleres co-dirigidos con Isidro Bobadilla para Jazz Power Inc. (fechas y sedes no figuran en la página pública).",
      "portfolio.teaching.placeholder": "Marcador de foto en aula — derechos de uso pendientes",
      "portfolio.press.kicker": "Prensa y reconocimiento",
      "portfolio.press.title": "Cobertura <em>documentada.</em>",
      "portfolio.press.lead": "Artículos y listas de premios seleccionados — los enlaces externos se abren en una pestaña nueva.",
      "portfolio.press.p1.title": "Premios Casandra — lista de ganadores Coreógrafo clásico",
      "portfolio.press.p1.source": "El Nacional",
      "portfolio.press.p2.title": "«Somos Dominicana!» — perfil BFND",
      "portfolio.press.p2.source": "El Nacional · 2013",
      "portfolio.press.p3.title": "Elizabeth y la Restauración — MOMENTOS",
      "portfolio.press.p3.source": "El Nacional · 2013",
      "portfolio.press.p4.title": "Crooke respeta bases del folklore RD",
      "portfolio.press.p4.source": "El Nacional · 2016",
      "portfolio.press.p5.title": "Biografía de artista docente",
      "portfolio.press.p5.source": "Hispanic Culture Arts",
      "portfolio.media.kicker": "Foto y video",
      "portfolio.media.title": "Reel y galería <em>próximamente.</em>",
      "portfolio.media.lead":
        "No se encontró URL pública verificada de showreel personal en la investigación. Los espacios siguientes están reservados para material de escenario y aula con autorización.",
      "portfolio.media.v1": "Marcador de video — BFND / escenario",
      "portfolio.media.v2": "Marcador de video — reel de coreografía",
      "portfolio.booking.kicker": "Reservas",
      "portfolio.booking.title": "Producir con <em>NovaStage.</em>",
      "portfolio.booking.lead":
        "NovaStage reserva bailarines, modelos, músicos, coreografía y producción integral de espectáculos. Comparte fechas, sede y objetivos creativos — canalizamos las consultas de producción por NovaStage.",
      "portfolio.booking.s1": "Casting de intérpretes y ensembles",
      "portfolio.booking.s2": "Coreografía original y repertorio cultural",
      "portfolio.booking.s3": "Colaboración en dirección musical",
      "portfolio.booking.s4": "Residencias escolares y muestras comunitarias",
      "portfolio.booking.s5": "Producción escénica a gran escala",
      "portfolio.booking.emailNote": " — correo provisional de reservas NovaStage",
      "portfolio.booking.interestLabel": "Interés de reserva",
      "portfolio.booking.opt.dancers": "Bailarines / intérpretes",
      "portfolio.booking.opt.choreography": "Coreografía",
      "portfolio.booking.opt.musicians": "Músicos",
      "portfolio.booking.opt.production": "Producción integral",
      "portfolio.booking.submit": "Solicitar reserva",
      "portfolio.form.status":
        "Gracias. Tu solicitud de reserva quedará lista para enviarse cuando el formulario esté conectado. (Pendiente: conectar el envío.)",
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
      "music.piece.8": "Claro de luna (Suite bergamasque)",
      "music.performer.1": "Grabación de Free Classical Music (publicada en Commons desde YouTube)",
      "music.performer.2": "Laurens Goedhart",
      "music.performer.3": "Teknopazzo",
      "music.performer.4": "John Harrison (violín), Wichita State University Chamber Players",
      "music.performer.5": "Grabación de Musopen (vía Wikimedia Commons)",
      "music.performer.6": "Patrizia Prati, piano",
      "music.performer.7": "Grabación de Musopen (vía Wikimedia Commons)",
      "music.performer.8": "Laurens Goedhart",
      "music.license.1": "CC BY 3.0",
      "music.license.2": "Dominio público",
      "music.license.3": "CC0 1.0",
      "music.license.4": "CC BY-SA 4.0",
      "music.license.5": "Dominio público",
      "music.license.6": "CC BY-SA 4.0",
      "music.license.7": "Dominio público",
      "music.license.8": "Dominio público",
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

    var page =
      document.body.getAttribute("data-active-page") ||
      (window.NOVASTAGE_activePage ? window.NOVASTAGE_activePage() : "home");
    if (page === "portfolio") {
      document.title = t("meta.portfolio.title");
    } else {
      document.title = t("meta.title");
    }
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", page === "portfolio" ? t("meta.portfolio.description") : t("meta.description"));
    }

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-btn") === lang ? "true" : "false");
    });

    var status = document.getElementById("form-status");
    if (status && status.getAttribute("data-filled") === "1") {
      status.textContent = t("form.status");
    }
    var portfolioStatus = document.getElementById("portfolio-form-status");
    if (portfolioStatus && portfolioStatus.getAttribute("data-filled") === "1") {
      portfolioStatus.textContent = t("portfolio.form.status");
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
    if (window.NOVASTAGE_refreshInvertLabel) {
      window.NOVASTAGE_refreshInvertLabel();
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

  window.NOVASTAGE_setPortfolioMeta = function (page) {
    document.body.setAttribute("data-active-page", page || "home");
    document.title =
      page === "portfolio" ? t("meta.portfolio.title") : t("meta.title");
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        page === "portfolio" ? t("meta.portfolio.description") : t("meta.description")
      );
    }
  };

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
