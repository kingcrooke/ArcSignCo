/**
 * EC Boutique Apartments. Hechos tomados del texto de Elizabeth (3 nov 2026).
 * status / badge: "unavailable" | "decorating" | "soon" | "available"
 * blocked: fechas inclusive que el calendario no deja elegir.
 * No poner precios, teléfono ni número de calle.
 */
(function () {
  var GAZCUE = {
    area: "Gazcue",
    city: "Santo Domingo",
    district: "Distrito Nacional",
    country: {
      es: "República Dominicana",
      en: "Dominican Republic",
      fr: "République dominicaine",
    },
  };

  window.RENTALS = {
    email: "elicrooke25@gmail.com",
    viewing: {
      weekdays: [2, 4, 6],
      times: ["10:00", "13:00", "16:00"],
      daysToShow: 3,
      timeZone: "America/Santo_Domingo",
    },
    mapQuery: "Gazcue, Santo Domingo, Dominican Republic",
    listings: [
      {
        id: "d12",
        badge: "unavailable",
        badgeLabel: {
          es: "Ocupado · No disponible",
          en: "Occupied · Not available",
          fr: "Occupé · Indisponible",
        },
        comingSoon: false,
        blocked: [{ start: "2026-10-29", end: "2027-03-30" }],
        diagram: "d12",
        aptNumber: "D12",
        realPhotos: true,
        name: {
          es: "D12 · dos niveles",
          en: "D12 · two levels",
          fr: "D12 · deux niveaux",
        },
        layoutShort: {
          es: "2 niveles · loft",
          en: "2 levels · loft",
          fr: "2 niveaux · loft",
        },
        addressShort: { es: "Gazcue", en: "Gazcue", fr: "Gazcue" },
        floorNote: {
          es: "La planta baja de este apartamento es el 4.º piso del condominio. Arriba hay un segundo nivel.",
          en: "The lower floor of this apartment is the 4th floor of the building. There is a second level above.",
          fr: "Le niveau bas de cet appartement est le 4e étage de l’immeuble. Au-dessus, un second niveau.",
        },
        address: GAZCUE,
        summary: {
          es: "Apartamento de dos niveles, amueblado. Hoy está alquilado.",
          en: "A furnished two-level apartment. It is rented right now.",
          fr: "Appartement meublé sur deux niveaux. Il est loué en ce moment.",
        },
        description: {
          es: "La planta baja está en el cuarto piso del condominio. Ahí están la habitación secundaria, la sala, un medio baño de visita, un espacio de estar, el comedor con balcón y la cocina abierta. Una escalera de caracol de hierro y madera sube al segundo nivel y a la azotea. En el segundo nivel está la habitación principal, con acceso directo a la terraza.",
          en: "The lower floor is on the fourth floor of the building. It holds the second bedroom, the living room, a guest half-bath, a sitting area, the dining room with a balcony, and the open kitchen. An iron-and-wood spiral stair goes up to the second level and the roof. The master bedroom is on the second level, with direct access to the terrace.",
          fr: "Le niveau bas est au quatrième étage de l’immeuble. On y trouve la chambre secondaire, le séjour, des toilettes invités, un coin salon, la salle à manger avec balcon et la cuisine ouverte. Un colimaçon en fer et en bois monte au second niveau et au toit. La chambre principale est au second niveau, avec un accès direct à la terrasse.",
        },
        layout: {
          es: "Abajo: habitación secundaria, sala, medio baño, estar, comedor con balcón de hierro, cocina abierta y cuarto de servicio. Arriba: habitación principal y terraza en la azotea.",
          en: "Below: second bedroom, living room, half-bath, sitting area, dining room with an iron balcony, open kitchen, and service room. Above: master bedroom and rooftop terrace.",
          fr: "En bas : chambre secondaire, séjour, toilettes, coin salon, salle à manger avec balcon en fer, cuisine ouverte et pièce de service. En haut : chambre principale et terrasse sur le toit.",
        },
        photoNote: {
          es: "Fotos del D12.",
          en: "Photos of D12.",
          fr: "Photos du D12.",
        },
        lowerTitle: { es: "Planta baja · 4.º piso", en: "Lower floor · 4th floor", fr: "Niveau bas · 4e étage" },
        upperTitle: { es: "Segundo nivel", en: "Second level", fr: "Second niveau" },
        lower: [
          { es: "Habitación secundaria: baño completo, clóset, cama full, aire inverter, abanico de techo, librero, mesita de noche y escritorio", en: "Second bedroom: full bathroom, closet, full bed, inverter air conditioning, ceiling fan, bookcase, nightstand, and desk", fr: "Chambre secondaire : salle de bain complète, placard, lit full, climatisation inverter, ventilateur de plafond, bibliothèque, table de chevet et bureau" },
          { es: "Sala: sofá de tres plazas, mesa de centro, mesitas auxiliares, butaca, abanico de techo y aire acondicionado", en: "Living room: three-seat sofa, coffee table, side tables, armchair, ceiling fan, and air conditioning", fr: "Séjour : canapé trois places, table basse, tables d’appoint, fauteuil, ventilateur de plafond et climatisation" },
          { es: "Medio baño de visita", en: "Guest half-bath", fr: "Toilettes invités" },
          { es: "Espacio de estar con dos butacas y abanico de techo", en: "Sitting area with two armchairs and a ceiling fan", fr: "Coin salon avec deux fauteuils et un ventilateur de plafond" },
          { es: "Escalera de caracol de hierro y madera hacia el segundo nivel y la azotea", en: "Iron-and-wood spiral stair to the second level and the roof", fr: "Colimaçon en fer et en bois vers le second niveau et le toit" },
          { es: "Comedor de cuatro sillas con balcón de hierro", en: "Dining table for four, with an iron balcony", fr: "Salle à manger pour quatre, avec balcon en fer" },
          { es: "Cocina de concepto abierto, totalmente equipada", en: "Open kitchen, fully equipped", fr: "Cuisine ouverte, entièrement équipée" },
          { es: "Cuarto de servicio con baño, área de lavado y lavadora automática", en: "Service room with a bathroom, laundry area, and an automatic washer", fr: "Pièce de service avec salle de bain, buanderie et lave-linge automatique" },
        ],
        upper: [
          { es: "Habitación principal: balcón con dos sillas y mesita, baño completo, aire acondicionado, dos abanicos de techo, cama queen, clósets, cajonera y escritorio o vanity", en: "Master bedroom: balcony with two chairs and a small table, full bathroom, air conditioning, two ceiling fans, queen bed, closets, a chest of drawers, and a desk or vanity", fr: "Chambre principale : balcon avec deux chaises et une petite table, salle de bain complète, climatisation, deux ventilateurs de plafond, lit queen, placards, commode et bureau ou coiffeuse" },
          { es: "Acceso directo a la terraza en la azotea: BBQ de gas, medio baño, lavadero adicional, juego de muebles de exterior, plantas naturales y bombillos colgantes", en: "Direct access to the rooftop terrace: gas barbecue, half-bath, extra wash sink, outdoor furniture, live plants, and hanging bulbs", fr: "Accès direct à la terrasse sur le toit : barbecue au gaz, toilettes, lavabo supplémentaire, mobilier d’extérieur, plantes et ampoules suspendues" },
        ],
        includes: [
          { es: "Inversor con dos baterías", en: "Inverter with two batteries", fr: "Onduleur avec deux batteries" },
          { es: "Internet", en: "Internet", fr: "Internet" },
          { es: "Calentador de agua", en: "Water heater", fr: "Chauffe-eau" },
          { es: "Bomba y tinaco de reserva", en: "Pump and reserve water tank", fr: "Pompe et citerne de réserve" },
          { es: "Tres aires acondicionados", en: "Three air conditioners", fr: "Trois climatiseurs" },
          { es: "Cinco abanicos de techo", en: "Five ceiling fans", fr: "Cinq ventilateurs de plafond" },
          { es: "Acceso a un parqueo con portón eléctrico", en: "Access to parking with an electric gate", fr: "Accès à un stationnement avec portail électrique" },
          { es: "Puerta de cristal común con token", en: "Shared glass door with a token", fr: "Porte vitrée commune avec jeton" },
          { es: "Puerta de madera con cerradura de código y puerta de hierro", en: "Wood door with a code lock, and an iron door", fr: "Porte en bois avec serrure à code, et porte en fer" },
        ],
        media: [
          { kind: "photo", src: "media/d12-sala.webp", caption: { es: "Sala", en: "Living room", fr: "Séjour" } },
          { kind: "photo", src: "media/d12-comedor-balcon.webp", caption: { es: "Comedor y balcón", en: "Dining room and balcony", fr: "Salle à manger et balcon" } },
          { kind: "photo", src: "media/d12-habitacion-principal.webp", caption: { es: "Habitación principal, techo de madera", en: "Master bedroom, wood ceiling", fr: "Chambre principale, plafond en bois" } },
          { kind: "photo", src: "media/d12-escalera-caracol.webp", caption: { es: "Escalera de caracol de hierro y madera", en: "Iron-and-wood spiral stair", fr: "Colimaçon en fer et en bois" } },
          { kind: "photo", src: "media/d12-terraza-dia.webp", caption: { es: "Terraza en la azotea, de día", en: "Rooftop terrace, daytime", fr: "Terrasse sur le toit, de jour" } },
          { kind: "video", src: "media/d12-recorrido.mp4", poster: "media/d12-recorrido-poster.webp", caption: { es: "Recorrido del D12", en: "D12 tour", fr: "Visite du D12" } },
        ],
      },
      {
        id: "d2",
        badge: "decorating",
        badgeLabel: {
          es: "En decoración · Próximamente",
          en: "Being furnished · Coming soon",
          fr: "En décoration · Bientôt",
        },
        comingSoon: true,
        blocked: [],
        diagram: "d2",
        aptNumber: "D2",
        realPhotos: true,
        name: { es: "D2 · una habitación", en: "D2 · one bedroom", fr: "D2 · une chambre" },
        layoutShort: { es: "1 habitación · mezzanine", en: "1 bedroom · mezzanine", fr: "1 chambre · mezzanine" },
        addressShort: { es: "Gazcue", en: "Gazcue", fr: "Gazcue" },
        floorNote: {
          es: "En proceso de decoración y limpieza.",
          en: "Decoration and cleaning are still in progress.",
          fr: "La décoration et le nettoyage sont encore en cours.",
        },
        address: GAZCUE,
        summary: {
          es: "Una habitación con mezzanine. Todavía se está decorando y limpiando.",
          en: "One bedroom with a mezzanine. Decoration and cleaning are still underway.",
          fr: "Une chambre avec mezzanine. La décoration et le nettoyage sont encore en cours.",
        },
        description: {
          es: "Tiene una habitación con aire acondicionado, abanico de techo y baño completo. La sala tiene abanico de techo. La cocina es de concepto abierto, con comedor. Hay área de lavado con lavadora y un estar-terraza con dos abanicos de techo. Una escalera de caracol de hierro sube al entrepiso y a la azotea.",
          en: "It has a bedroom with air conditioning, a ceiling fan, and a full bathroom. The living room has a ceiling fan. The kitchen is open to the dining area. There is a laundry with a washer, and a sitting terrace with two ceiling fans. An iron spiral stair goes up to the mezzanine and the roof.",
          fr: "Il a une chambre avec climatisation, ventilateur de plafond et salle de bain complète. Le séjour a un ventilateur de plafond. La cuisine est ouverte sur la salle à manger. Il y a une buanderie avec lave-linge et une terrasse-salon avec deux ventilateurs de plafond. Un colimaçon en fer monte à la mezzanine et au toit.",
        },
        layout: {
          es: "Habitación, sala, cocina abierta con comedor, lavado y estar-terraza. El entrepiso y la azotea se alcanzan por la escalera de caracol de hierro.",
          en: "Bedroom, living room, open kitchen with dining, laundry, and a sitting terrace. The mezzanine and the roof are reached by the iron spiral stair.",
          fr: "Chambre, séjour, cuisine ouverte avec salle à manger, buanderie et terrasse-salon. La mezzanine et le toit se rejoignent par le colimaçon en fer.",
        },
        photoNote: {
          es: "Una foto del proceso. La decoración no está terminada.",
          en: "One photo of the work in progress. Furnishing is not finished.",
          fr: "Une photo du chantier. La décoration n’est pas terminée.",
        },
        includes: [
          { es: "Inversor con dos baterías", en: "Inverter with two batteries", fr: "Onduleur avec deux batteries" },
          { es: "Calentador de agua", en: "Water heater", fr: "Chauffe-eau" },
          { es: "Bomba y tinaco de reserva", en: "Pump and reserve water tank", fr: "Pompe et citerne de réserve" },
          { es: "Aire acondicionado", en: "Air conditioning", fr: "Climatisation" },
          { es: "Cuatro abanicos de techo", en: "Four ceiling fans", fr: "Quatre ventilateurs de plafond" },
          { es: "Decoración y plantas", en: "Decoration and plants", fr: "Décoration et plantes" },
          { es: "Acceso a un parqueo con portón eléctrico", en: "Access to parking with an electric gate", fr: "Accès à un stationnement avec portail électrique" },
          { es: "Puerta común con token", en: "Shared door with a token", fr: "Porte commune avec jeton" },
          { es: "Puerta de madera con cerradura de código y puerta de hierro", en: "Wood door with a code lock, and an iron door", fr: "Porte en bois avec serrure à code, et porte en fer" },
        ],
        media: [
          { kind: "photo", src: "media/d2-en-decoracion.webp", caption: { es: "En proceso de decoración", en: "Decoration in progress", fr: "Décoration en cours" } },
        ],
      },
      {
        id: "d1",
        badge: "soon",
        badgeLabel: {
          es: "Próximamente",
          en: "Coming soon",
          fr: "Bientôt",
        },
        comingSoon: true,
        blocked: [],
        diagram: false,
        aptNumber: "D1",
        realPhotos: false,
        name: { es: "D1 · una habitación", en: "D1 · one bedroom", fr: "D1 · une chambre" },
        layoutShort: { es: "1 habitación · línea blanca", en: "1 bedroom · appliances", fr: "1 chambre · électroménager" },
        addressShort: { es: "Gazcue", en: "Gazcue", fr: "Gazcue" },
        floorNote: {
          es: "Todavía no hay fotos.",
          en: "There are no photos yet.",
          fr: "Il n’y a pas encore de photos.",
        },
        address: GAZCUE,
        summary: {
          es: "Una habitación. Próximamente. Sin fotos todavía.",
          en: "One bedroom. Coming soon. No photos yet.",
          fr: "Une chambre. Bientôt. Pas encore de photos.",
        },
        description: {
          es: "Habitación con clóset y baño completo, sala, y cocina de concepto abierto con desayunador y comedor. Tiene estar-terraza y una escalera tipo rampa, de hierro y madera, con acceso a la azotea y al área de lavado. En el texto no hay muebles, aire acondicionado ni inversor: lo que se indica es línea blanca.",
          en: "A bedroom with a closet and a full bathroom, a living room, and an open kitchen with a breakfast bar and dining. It has a sitting terrace and an iron-and-wood ramp stair, with access to the roof and the laundry area. The notes do not list furniture, air conditioning, or an inverter. What is listed is the appliances.",
          fr: "Chambre avec placard et salle de bain complète, séjour, et cuisine ouverte avec comptoir de petit-déjeuner et salle à manger. Il y a une terrasse-salon et un escalier en rampe, fer et bois, avec accès au toit et à la buanderie. Le texte ne cite ni meubles, ni climatisation, ni onduleur. Ce qui est indiqué, c’est l’électroménager.",
        },
        layout: {
          es: "Habitación, sala, cocina abierta con desayunador y comedor, estar-terraza, rampa hacia la azotea y el lavado.",
          en: "Bedroom, living room, open kitchen with a breakfast bar and dining, sitting terrace, and a ramp to the roof and the laundry.",
          fr: "Chambre, séjour, cuisine ouverte avec comptoir et salle à manger, terrasse-salon, rampe vers le toit et la buanderie.",
        },
        photoNote: {
          es: "No hay fotos del D1. El recuadro no es el apartamento.",
          en: "There are no photos of D1. This panel is not the apartment.",
          fr: "Il n’y a pas de photos du D1. Ce cadre n’est pas l’appartement.",
        },
        includes: [
          { es: "Solo línea blanca: estufa, nevera y extractor", en: "Appliances only: stove, refrigerator, and extractor fan", fr: "Électroménager seulement : cuisinière, réfrigérateur et hotte" },
          { es: "Bomba y tinaco de reserva", en: "Pump and reserve water tank", fr: "Pompe et citerne de réserve" },
          { es: "Calentador de agua", en: "Water heater", fr: "Chauffe-eau" },
          { es: "Acceso a un parqueo con portón eléctrico", en: "Access to parking with an electric gate", fr: "Accès à un stationnement avec portail électrique" },
          { es: "Puerta de cristal común con token", en: "Shared glass door with a token", fr: "Porte vitrée commune avec jeton" },
        ],
        media: [
          { kind: "pattern", caption: { es: "Próximamente", en: "Coming soon", fr: "Bientôt" } },
        ],
      },
    ],
    neighborhood: [
      {
        src: "media/colonial.webp",
        caption: { es: "Zona Colonial, Santo Domingo", en: "Colonial Zone, Santo Domingo", fr: "Zone coloniale, Santo Domingo" },
      },
      {
        src: "media/zona.webp",
        caption: { es: "Calle de la Zona Colonial", en: "A street in the Colonial Zone", fr: "Une rue de la zone coloniale" },
      },
      {
        src: "media/malecon.webp",
        caption: { es: "Costa de Santo Domingo", en: "The Santo Domingo coast", fr: "Le littoral de Santo Domingo" },
      },
    ],
    credits: [
      { name: "Elizabeth Crooke", source: "EC Boutique Apartments", work: "Fotos del D12 y del D2, y el recorrido", url: "mailto:elicrooke25@gmail.com" },
      { name: "Florian Koetter", source: "Pexels", work: "Video de ambiente, Santo Domingo", url: "https://www.pexels.com/video/9754299/" },
      { name: "Hoteles Sublimes", source: "Pexels", work: "Zona Colonial", url: "https://www.pexels.com/photo/29141847/" },
      { name: "Victor Rosario", source: "Unsplash", work: "Calle colonial", url: "https://unsplash.com/photos/pdzOfrfY7Pw" },
      { name: "Dangelie Perez", source: "Pexels", work: "Costa de Santo Domingo", url: "https://www.pexels.com/photo/17070246/" },
    ],
  };
})();
