/**
 * Elizabeth: edite ESTE archivo para cambiar los apartamentos.
 *
 * status: "available" o "occupied"
 *   → la etiqueta Disponible / Available / Disponible (FR: Disponible) u Ocupado.
 * comingSoon: true → además muestra "Próximamente".
 * aptNumber: "12" y "D2" ya están. En las fichas vacías, deje "PLACEHOLDER".
 * No escriba tarifas, depósitos ni montos en este archivo. La tarifa se pide
 * con el botón de más información.
 *
 * El correo está en RENTALS.email (TODO: cámbielo; no ponga un teléfono real).
 * Días de visita: viewing.weekdays (0 domingo … 6 sábado).
 * Horas: viewing.times, hora de Santo Domingo.
 *
 * Ortografía: la nota de voz dice "Penso". El callejero y los negocios del
 * Condominio Italo nº 38 escriben "César Nicolás Penson". Aquí se usa Penson
 * para que el mapa caiga en el edificio. Confirme si hiciera falta.
 */
(function () {
  var BUILDING = {
    lat: 18.471702,
    lng: -69.900747,
    query: "Condominio Italo, Calle César Nicolás Penson 38, Gazcue, Santo Domingo, Dominican Republic",
  };

  window.RENTALS = {
    email: "rentals@example.com",
    viewing: {
      weekdays: [2, 4, 6],
      times: ["10:00", "13:00", "16:00"],
      daysToShow: 3,
      timeZone: "America/Santo_Domingo",
    },
    building: BUILDING,
    listings: [
      {
        id: "apt-12",
        status: "available",
        comingSoon: false,
        diagram: "levels",
        geo: { lat: BUILDING.lat, lng: BUILDING.lng },
        mapQuery: BUILDING.query,
        mapZoom: 17,
        aptNumber: "12",
        name: {
          es: "Apartamento 12 · dos habitaciones",
          en: "Apartment 12 · two bedrooms",
          fr: "Appartement 12 · deux chambres",
        },
        layoutShort: {
          es: "2 habitaciones · planta 4 y loft",
          en: "2 bedrooms · 4th floor and loft",
          fr: "2 chambres · 4e étage et mezzanine",
        },
        addressShort: {
          es: "César Nicolás Penson #38",
          en: "César Nicolás Penson #38",
          fr: "César Nicolás Penson n° 38",
        },
        floorNote: {
          es: "Planta 4, sin ascensor · loft en el 5.º nivel",
          en: "4th floor, no elevator · loft on the 5th level",
          fr: "4e étage, sans ascenseur · mezzanine au 5e niveau",
        },
        address: {
          street: "Calle César Nicolás Penson #38",
          building: "Condominio Italo",
          area: "Gazcue",
          city: "Santo Domingo",
          district: "Distrito Nacional",
          country: {
            es: "República Dominicana",
            en: "Dominican Republic",
            fr: "République dominicaine",
          },
        },
        mapNote: {
          es: "El pin corresponde a Condominio Italo, calle César Nicolás Penson #38.",
          en: "The pin is Condominio Italo, Calle César Nicolás Penson #38.",
          fr: "Le repère est le Condominio Italo, calle César Nicolás Penson n° 38.",
        },
        summary: {
          es: "Apartamento de dos habitaciones en la cuarta planta, con un loft tipo penthouse en el quinto nivel donde está la habitación principal.",
          en: "A two-bedroom apartment on the fourth floor, with a penthouse-style loft on the fifth level where the master bedroom is.",
          fr: "Appartement de deux chambres au quatrième étage, avec une mezzanine façon penthouse au cinquième niveau, où se trouve la chambre principale.",
        },
        description: {
          es: "Está en la cuarta planta del Condominio Italo y no hay ascensor. Encima hay un segundo nivel, tipo penthouse, en una quinta planta: ahí está la habitación principal, con piso de madera y techo de madera. Abajo quedan la sala, un área de estar y la cocina abierta al comedor. El apartamento es muy luminoso. Cada habitación tiene baño completo y vestidor. Hay terraza en la azotea. Entre los dos niveles, la escalera es de caracol, de hierro y madera. Hay dos balcones: uno pequeño en la cocina y otro en la habitación principal.",
          en: "It is on the fourth floor of Condominio Italo, and there is no elevator. Above it, a second level — penthouse style — sits on a fifth floor. That is the master bedroom, with a wood floor and a wood ceiling. Below are the living room, a sitting area, and a kitchen open to the dining area. The apartment is very bright. Each bedroom has a full bathroom and a walk-in closet. There is a rooftop terrace. The stair between the two levels is a spiral of iron and wood. There are two balconies: a small one off the kitchen, and one off the master bedroom.",
          fr: "Il est au quatrième étage du Condominio Italo, sans ascenseur. Au-dessus, un second niveau, façon penthouse, occupe un cinquième niveau : c’est la chambre principale, avec parquet et plafond en bois. En bas se trouvent le séjour, un coin salon et la cuisine ouverte sur la salle à manger. L’appartement est très lumineux. Chaque chambre a une salle de bain complète et un dressing. Il y a une terrasse sur le toit. L’escalier entre les deux niveaux est un colimaçon en fer et en bois. Il y a deux balcons : un petit côté cuisine, et un autre côté chambre principale.",
        },
        layout: {
          es: "Dos niveles. En el quinto: habitación principal, baño, vestidor y balcón. En el cuarto: sala, estar, cocina-comedor, segunda habitación con baño y vestidor, área de lavado y un balcón pequeño en la cocina. La terraza está en la azotea.",
          en: "Two levels. On the fifth: master bedroom, bathroom, walk-in closet, and balcony. On the fourth: living room, sitting area, open kitchen and dining, second bedroom with bathroom and walk-in closet, laundry, and a small balcony off the kitchen. The terrace is on the roof.",
          fr: "Deux niveaux. Au cinquième : chambre principale, salle de bain, dressing et balcon. Au quatrième : séjour, coin salon, cuisine-salle à manger, seconde chambre avec salle de bain et dressing, buanderie, et un petit balcon côté cuisine. La terrasse est sur le toit.",
        },
        stay: {
          es: "Alquiler de corto plazo, por menos de un año, en dólares estadounidenses. Está pensado para profesionales extranjeros en asignación de trabajo y para estudiantes. La tarifa no está en esta página: se pide con «Pedir más información».",
          en: "A short-term rental, for stays under one year, in US dollars. It is meant for foreign professionals on assignment and for students. The rate is not on this page. Ask with “Request more information”.",
          fr: "Location de courte durée, pour moins d’un an, en dollars américains. Elle s’adresse à des professionnels étrangers en mission et à des étudiants. Le tarif n’est pas sur cette page : il se demande avec « Demander plus d’informations ».",
        },
        fitFor: [
          { es: "Profesionales extranjeros en asignación de trabajo", en: "Foreign professionals on assignment", fr: "Professionnels étrangers en mission" },
          { es: "Estudiantes", en: "Students", fr: "Étudiants" },
          { es: "Una pareja, o dos personas", en: "A couple, or two people", fr: "Un couple, ou deux personnes" },
          { es: "Un solo niño de unos 10 años o más, en la cama full", en: "One child about 10 or older, on the full bed", fr: "Un seul enfant d’environ 10 ans ou plus, sur le lit full" },
        ],
        notFor: [
          { es: "Niños pequeños. Las habitaciones están en pisos distintos, y no hay camas individuales.", en: "Small children. The bedrooms are on different floors, and there are no single beds.", fr: "Jeunes enfants. Les chambres sont à des étages différents, et il n’y a pas de lits simples." },
          { es: "Más de un niño. Solo hay una cama full, además de la queen.", en: "More than one child. There is only one full bed, besides the queen.", fr: "Plus d’un enfant. Il n’y a qu’un lit full, en plus du lit queen." },
          { es: "Familias numerosas", en: "Large families", fr: "Familles nombreuses" },
        ],
        pet: {
          es: "Se aceptan mascotas si quien alquila se compromete a cuidar los espacios. Hay un cargo por la mascota, aparte del depósito, porque el depósito no cubre el daño que un animal puede hacer en muebles y camas. El monto no se publica: se envía al pedir más información.",
          en: "Pets are welcome if the renter agrees to look after the place. A pet fee is charged apart from the deposit, because the deposit does not cover damage an animal can do to furniture and beds. The amount is not published. It is sent when you request more information.",
          fr: "Les animaux sont acceptés si la personne qui loue s’engage à prendre soin des lieux. Un supplément pour l’animal est demandé en plus de la caution, parce que la caution ne couvre pas les dégâts qu’un animal peut faire aux meubles et aux lits. Le montant n’est pas publié : il est envoyé quand vous demandez plus d’informations.",
        },
        amenities: [
          { es: "Dos habitaciones, cada una con baño completo y vestidor", en: "Two bedrooms, each with a full bathroom and a walk-in closet", fr: "Deux chambres, chacune avec salle de bain complète et dressing" },
          { es: "Cuarta planta, sin ascensor", en: "Fourth floor, no elevator", fr: "Quatrième étage, sans ascenseur" },
          { es: "Loft tipo penthouse en el quinto nivel, con la habitación principal", en: "Penthouse-style loft on the fifth level, with the master bedroom", fr: "Mezzanine façon penthouse au cinquième niveau, avec la chambre principale" },
          { es: "Piso y techo de madera en la habitación principal", en: "Wood floor and wood ceiling in the master bedroom", fr: "Parquet et plafond en bois dans la chambre principale" },
          { es: "Sala, área de estar y cocina abierta al comedor", en: "Living room, sitting area, and kitchen open to the dining area", fr: "Séjour, coin salon et cuisine ouverte sur la salle à manger" },
          { es: "Muy luminoso", en: "Very bright", fr: "Très lumineux" },
          { es: "Terraza en la azotea", en: "Rooftop terrace", fr: "Terrasse sur le toit" },
          { es: "Portón eléctrico", en: "Electric gate", fr: "Portail électrique" },
          { es: "Cerraduras con código", en: "Code locks", fr: "Serrures à code" },
          { es: "Puertas de cristal en la escalera principal", en: "Glass doors on the main stairwell", fr: "Portes vitrées dans la cage d’escalier principale" },
          { es: "Acceso al parqueo", en: "Parking access", fr: "Accès au stationnement" },
          { es: "Área de lavado", en: "Laundry area", fr: "Buanderie" },
          { es: "Dos balcones: uno pequeño en la cocina y uno en la habitación principal", en: "Two balconies: a small one off the kitchen and one off the master bedroom", fr: "Deux balcons : un petit côté cuisine et un côté chambre principale" },
          { es: "Escalera de caracol de hierro y madera", en: "Iron-and-wood spiral staircase", fr: "Escalier en colimaçon, fer et bois" },
          { es: "Inversor de electricidad", en: "Power inverter", fr: "Onduleur électrique" },
          { es: "Aire acondicionado inverter, tipo split, en la sala y en cada habitación", en: "Inverter split air conditioning in the living room and in each bedroom", fr: "Climatisation inverter split dans le séjour et dans chaque chambre" },
          { es: "Cinco abanicos de techo: dos en la habitación principal, uno en el estar, uno en la sala y uno en la habitación secundaria", en: "Five ceiling fans: two in the master bedroom, one in the sitting area, one in the living room, and one in the second bedroom", fr: "Cinq ventilateurs de plafond : deux dans la chambre principale, un dans le coin salon, un dans le séjour et un dans la seconde chambre" },
          { es: "Amueblado completo: sofá cama, cama queen en la principal y una cama full en la secundaria", en: "Fully furnished: sofa bed, queen bed in the master, and one full bed in the second bedroom", fr: "Entièrement meublé : canapé-lit, lit queen dans la chambre principale et un lit full dans la seconde" },
          { es: "No hay camas individuales", en: "No single beds", fr: "Pas de lits simples" },
        ],
        media: [
          { kind: "photo", motif: "living", caption: { es: "Sala y cocina abierta", en: "Living room and open kitchen", fr: "Séjour et cuisine ouverte" } },
          { kind: "photo", motif: "sitting", caption: { es: "Área de estar", en: "Sitting area", fr: "Coin salon" } },
          { kind: "photo", motif: "loft", caption: { es: "Habitación principal, piso y techo de madera", en: "Master bedroom, wood floor and ceiling", fr: "Chambre principale, parquet et plafond en bois" } },
          { kind: "photo", motif: "bedroom", caption: { es: "Segunda habitación", en: "Second bedroom", fr: "Seconde chambre" } },
          { kind: "photo", motif: "stair", caption: { es: "Escalera de caracol, hierro y madera", en: "Spiral staircase, iron and wood", fr: "Colimaçon, fer et bois" } },
          { kind: "photo", motif: "terrace", caption: { es: "Terraza en la azotea", en: "Rooftop terrace", fr: "Terrasse sur le toit" } },
          { kind: "video", motif: "video", src: "", caption: { es: "Recorrido en video", en: "Video walkthrough", fr: "Visite en vidéo" } },
        ],
      },
      {
        id: "d2",
        status: "available",
        comingSoon: false,
        diagram: "d2",
        geo: { lat: BUILDING.lat, lng: BUILDING.lng },
        mapQuery: BUILDING.query,
        mapZoom: 17,
        aptNumber: "D2",
        name: {
          es: "D2 · una habitación",
          en: "D2 · one bedroom",
          fr: "D2 · une chambre",
        },
        layoutShort: {
          es: "1 habitación · entrepiso",
          en: "1 bedroom · mezzanine",
          fr: "1 chambre · mezzanine",
        },
        addressShort: {
          es: "Mismo edificio · otro bloque",
          en: "Same building · other block",
          fr: "Même immeuble · autre bloc",
        },
        floorNote: {
          es: "En principio, planta 4, en el otro bloque",
          en: "Expected on the 4th floor, in the other block",
          fr: "En principe au 4e étage, dans l’autre bloc",
        },
        address: {
          street: "Calle César Nicolás Penson #38",
          building: "Condominio Italo",
          area: "Gazcue",
          city: "Santo Domingo",
          district: "Distrito Nacional",
          country: {
            es: "República Dominicana",
            en: "Dominican Republic",
            fr: "République dominicaine",
          },
        },
        mapNote: {
          es: "El pin es el Condominio Italo. D2 está previsto en el otro bloque. El nombre del bloque no está escrito.",
          en: "The pin is Condominio Italo. D2 is expected in the other block. The block name is not listed.",
          fr: "Le repère est le Condominio Italo. D2 est prévu dans l’autre bloc. Le nom du bloc n’est pas indiqué.",
        },
        summary: {
          es: "D2 es un apartamento más pequeño, de una habitación, con entrepiso de oficina o estudio.",
          en: "D2 is a smaller one-bedroom apartment, with a mezzanine used as an office or study.",
          fr: "D2 est un appartement plus petit, d’une chambre, avec une mezzanine bureau ou étude.",
        },
        description: {
          es: "D2 es más pequeño y hoy tiene una habitación. Hay espacio para agregar una segunda habitación más adelante. Tiene sala, cocina, comedor abierto y terraza. El entrepiso se usa como oficina o estudio. El área de lavado incluye lavadora. Hay aire acondicionado en la habitación y un abanico de techo. Se puede subir a la azotea y al entrepiso. Hay un respaldo para los cortes de luz; el detalle de ese equipo todavía no está confirmado.",
          en: "D2 is smaller, and it has one bedroom today. There is room to add a second bedroom later. It has a living room, a kitchen, open dining, and a terrace. The mezzanine is used as an office or study. The laundry includes a washer. There is air conditioning in the bedroom, and a ceiling fan. The roof and the mezzanine are accessible. There is backup for power outages. The details of that backup are not confirmed yet.",
          fr: "D2 est plus petit, et il a une chambre aujourd’hui. Il y a la place pour ajouter une seconde chambre plus tard. Il a un séjour, une cuisine, une salle à manger ouverte et une terrasse. La mezzanine sert de bureau ou d’étude. La buanderie comprend une machine à laver. Il y a la climatisation dans la chambre, et un ventilateur de plafond. Le toit et la mezzanine sont accessibles. Il y a un secours pour les coupures de courant. Le détail de ce secours n’est pas encore confirmé.",
        },
        layout: {
          es: "Planta principal: sala, cocina, comedor abierto, habitación y lavado con lavadora, más la terraza. Entrepiso: oficina o estudio. Acceso a la azotea y al entrepiso. El esquema de abajo no es un plano medido.",
          en: "Main floor: living room, kitchen, open dining, bedroom, and laundry with a washer, plus the terrace. Mezzanine: office or study. Access to the roof and to the mezzanine. The sketch below is not a measured plan.",
          fr: "Niveau principal : séjour, cuisine, salle à manger ouverte, chambre et buanderie avec machine à laver, plus la terrasse. Mezzanine : bureau ou étude. Accès au toit et à la mezzanine. Le schéma plus bas n’est pas un plan coté.",
        },
        stay: null,
        fitFor: [],
        notFor: [],
        pet: {
          es: "La regla de mascotas de D2 no está publicada. Pida más información.",
          en: "D2’s pet rule is not published. Request more information.",
          fr: "La règle pour les animaux de D2 n’est pas publiée. Demandez plus d’informations.",
        },
        amenities: [
          { es: "Una habitación, más pequeña que el apartamento 12", en: "One bedroom, smaller than apartment 12", fr: "Une chambre, plus petit que l’appartement 12" },
          { es: "Hay espacio para agregar una segunda habitación más adelante", en: "There is room to add a second bedroom later", fr: "Il y a la place pour ajouter une seconde chambre plus tard" },
          { es: "Entrepiso usado como oficina o estudio", en: "Mezzanine used as an office or study", fr: "Mezzanine utilisée comme bureau ou étude" },
          { es: "Sala", en: "Living room", fr: "Séjour" },
          { es: "Terraza", en: "Terrace", fr: "Terrasse" },
          { es: "Cocina y comedor abierto", en: "Kitchen and open dining", fr: "Cuisine et salle à manger ouverte" },
          { es: "Área de lavado con lavadora", en: "Laundry with a washer", fr: "Buanderie avec machine à laver" },
          { es: "Aire acondicionado en la habitación", en: "Air conditioning in the bedroom", fr: "Climatisation dans la chambre" },
          { es: "Un abanico de techo", en: "A ceiling fan", fr: "Un ventilateur de plafond" },
          { es: "Acceso a la azotea y al entrepiso", en: "Access to the roof and to the mezzanine", fr: "Accès au toit et à la mezzanine" },
          { es: "Respaldo para cortes de luz: detalle por confirmar (PLACEHOLDER)", en: "Backup for power outages: details to be confirmed (PLACEHOLDER)", fr: "Secours pour les coupures de courant : détail à confirmer (PLACEHOLDER)" },
        ],
        media: [
          { kind: "photo", motif: "living", caption: { es: "Sala", en: "Living room", fr: "Séjour" } },
          { kind: "photo", motif: "kitchen", caption: { es: "Cocina y comedor abierto", en: "Kitchen and open dining", fr: "Cuisine et salle à manger ouverte" } },
          { kind: "photo", motif: "mezz", caption: { es: "Entrepiso, oficina o estudio", en: "Mezzanine, office or study", fr: "Mezzanine, bureau ou étude" } },
          { kind: "photo", motif: "bedroom", caption: { es: "Habitación", en: "Bedroom", fr: "Chambre" } },
          { kind: "photo", motif: "laundry", caption: { es: "Lavado con lavadora", en: "Laundry with washer", fr: "Buanderie avec machine à laver" } },
          { kind: "photo", motif: "terrace", caption: { es: "Terraza", en: "Terrace", fr: "Terrasse" } },
          { kind: "video", motif: "video", src: "", caption: { es: "Recorrido en video", en: "Video walkthrough", fr: "Visite en vidéo" } },
        ],
      },
      {
        id: "italo-block-c",
        status: "available",
        comingSoon: true,
        diagram: false,
        geo: { lat: BUILDING.lat, lng: BUILDING.lng },
        mapQuery: BUILDING.query,
        mapZoom: 17,
        aptNumber: "PLACEHOLDER",
        name: {
          es: "Tercer apartamento · próximamente",
          en: "Third apartment · coming soon",
          fr: "Troisième appartement · bientôt",
        },
        layoutShort: {
          es: "Por publicar",
          en: "To be published",
          fr: "À publier",
        },
        addressShort: {
          es: "Mismo edificio · planta 4",
          en: "Same building · 4th floor",
          fr: "Même immeuble · 4e étage",
        },
        floorNote: {
          es: "Previsto en la planta 4 · ficha vacía",
          en: "Planned on the 4th floor · empty listing",
          fr: "Prévu au 4e étage · fiche vide",
        },
        address: {
          street: "Calle César Nicolás Penson #38",
          building: "Condominio Italo",
          area: "Gazcue",
          city: "Santo Domingo",
          district: "Distrito Nacional",
          country: {
            es: "República Dominicana",
            en: "Dominican Republic",
            fr: "République dominicaine",
          },
        },
        mapNote: {
          es: "Misma dirección prevista. Esta ficha está vacía a propósito.",
          en: "Same address expected. This listing is empty on purpose.",
          fr: "Même adresse prévue. Cette fiche est vide exprès.",
        },
        summary: {
          es: "PLACEHOLDER. Tercer apartamento, todavía sin detalles.",
          en: "PLACEHOLDER. Third apartment, details not written yet.",
          fr: "PLACEHOLDER. Troisième appartement, détails pas encore écrits.",
        },
        description: {
          es: "PLACEHOLDER. Próximamente. Tercer espacio, previsto en el mismo edificio y la misma planta, en uno de los dos bloques. Las amenidades, las fotos y el número de apartamento se agregarán aquí. Hasta entonces no es una oferta.",
          en: "PLACEHOLDER. Coming soon. A third apartment, expected in the same building and on the same floor, in one of the two blocks. Amenities, photos, and the apartment number will be added here. Until then it is not an offer.",
          fr: "PLACEHOLDER. Bientôt. Troisième appartement, prévu dans le même immeuble et au même étage, dans l’un des deux blocs. Les équipements, les photos et le numéro seront ajoutés ici. D’ici là, ce n’est pas une offre.",
        },
        layout: {
          es: "Por publicar.",
          en: "To be published.",
          fr: "À publier.",
        },
        fitFor: [],
        notFor: [],
        pet: {
          es: "La política de mascotas de este apartamento se escribirá cuando exista la ficha.",
          en: "This apartment’s pet policy will be written when the listing exists.",
          fr: "La règle pour les animaux de cet appartement sera écrite quand la fiche existera.",
        },
        amenities: [],
        media: [
          { kind: "photo", motif: "emptyA", caption: { es: "Foto por agregar", en: "Photo to be added", fr: "Photo à ajouter" } },
          { kind: "photo", motif: "block", caption: { es: "El edificio, sin foto todavía", en: "The building, no photo yet", fr: "L’immeuble, pas encore de photo" } },
          { kind: "video", motif: "video", src: "", caption: { es: "Video por agregar", en: "Video to be added", fr: "Vidéo à ajouter" } },
        ],
      },
      {
        id: "address-tbd",
        status: "available",
        comingSoon: true,
        diagram: false,
        geo: null,
        mapQuery: "Gazcue, Santo Domingo, Dominican Republic",
        mapZoom: 14,
        aptNumber: "PLACEHOLDER",
        name: {
          es: "Cuarto apartamento · dirección por confirmar",
          en: "Fourth apartment · address to be confirmed",
          fr: "Quatrième appartement · adresse à confirmer",
        },
        layoutShort: {
          es: "Por publicar",
          en: "To be published",
          fr: "À publier",
        },
        addressShort: {
          es: "Puede ser otra dirección",
          en: "May be a different address",
          fr: "Peut être une autre adresse",
        },
        floorNote: {
          es: "Planta y edificio por confirmar",
          en: "Floor and building to be confirmed",
          fr: "Étage et immeuble à confirmer",
        },
        address: {
          street: "PLACEHOLDER",
          building: "PLACEHOLDER",
          area: "Gazcue",
          city: "Santo Domingo",
          district: "Distrito Nacional",
          country: {
            es: "República Dominicana",
            en: "Dominican Republic",
            fr: "République dominicaine",
          },
        },
        mapNote: {
          es: "Este apartamento puede quedar en otra dirección, no en el Condominio Italo. El mapa muestra Gazcue, no un edificio confirmado.",
          en: "This apartment may be at a different address, not at Condominio Italo. The map shows Gazcue, not a confirmed building.",
          fr: "Cet appartement peut se trouver à une autre adresse, pas au Condominio Italo. La carte montre Gazcue, pas un immeuble confirmé.",
        },
        summary: {
          es: "PLACEHOLDER. Cuarto espacio. La dirección puede ser otra.",
          en: "PLACEHOLDER. Fourth apartment. The address may be different.",
          fr: "PLACEHOLDER. Quatrième appartement. L’adresse peut être différente.",
        },
        description: {
          es: "PLACEHOLDER. Próximamente. Este cuarto espacio puede quedar en otro lugar, no en la misma dirección del Condominio Italo. Todavía no hay calle, número, fotos ni amenidades. No se puede reservar.",
          en: "PLACEHOLDER. Coming soon. This fourth apartment may be somewhere else, not at the Condominio Italo address. There is no street, number, photos, or amenities yet. It cannot be reserved.",
          fr: "PLACEHOLDER. Bientôt. Ce quatrième appartement peut être ailleurs, pas à l’adresse du Condominio Italo. Il n’y a pas encore de rue, de numéro, de photos ni d’équipements. On ne peut pas le réserver.",
        },
        layout: {
          es: "Por publicar.",
          en: "To be published.",
          fr: "À publier.",
        },
        fitFor: [],
        notFor: [],
        pet: {
          es: "La política de mascotas de este apartamento se escribirá cuando exista la ficha.",
          en: "This apartment’s pet policy will be written when the listing exists.",
          fr: "La règle pour les animaux de cet appartement sera écrite quand la fiche existera.",
        },
        amenities: [],
        media: [
          { kind: "photo", motif: "grid", caption: { es: "Zona por confirmar", en: "Area to be confirmed", fr: "Quartier à confirmer" } },
          { kind: "photo", motif: "emptyB", caption: { es: "Foto por agregar", en: "Photo to be added", fr: "Photo à ajouter" } },
          { kind: "video", motif: "video", src: "", caption: { es: "Video por agregar", en: "Video to be added", fr: "Vidéo à ajouter" } },
        ],
      },
    ],
  };
})();
