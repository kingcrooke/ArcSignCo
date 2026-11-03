/**
 * EC Boutique Apartments. Edit apartments here.
 * status: "available" | "unavailable" | "decorating" | "soon"
 * blocked: inclusive dates the calendar will not accept.
 * Email is RENTALS.email. Do not add prices or a phone number.
 */
(function () {
  var BUILDING = {
    lat: 18.471702,
    lng: -69.900747,
    query: "Condominio Italo, Calle César Nicolás Penson 38, Gazcue, Santo Domingo, Dominican Republic",
  };
  var ADDRESS = {
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
  };
  var MAP_NOTE = {
    es: "El pin corresponde a Condominio Italo, calle César Nicolás Penson #38.",
    en: "The pin is Condominio Italo, Calle César Nicolás Penson #38.",
    fr: "Le repère est le Condominio Italo, calle César Nicolás Penson n° 38.",
  };

  window.RENTALS = {
    email: "elicrooke25@gmail.com",
    contactName: "Elizabeth Crooke",
    viewing: {
      weekdays: [2, 4, 6],
      times: ["10:00", "13:00", "16:00"],
      daysToShow: 3,
      timeZone: "America/Santo_Domingo",
    },
    building: BUILDING,
    listings: [
      {
        id: "d12",
        status: "unavailable",
        comingSoon: false,
        blocked: [{ start: "2026-10-29", end: "2027-03-30" }],
        diagram: "levels",
        geo: { lat: BUILDING.lat, lng: BUILDING.lng },
        mapQuery: BUILDING.query,
        mapZoom: 17,
        aptNumber: "D12",
        name: { es: "D12 · dos niveles", en: "D12 · two levels", fr: "D12 · deux niveaux" },
        layoutShort: { es: "2 niveles · loft", en: "2 levels · loft", fr: "2 niveaux · loft" },
        addressShort: { es: "César Nicolás Penson #38", en: "César Nicolás Penson #38", fr: "César Nicolás Penson n° 38" },
        floorNote: {
          es: "Planta baja en el 4.º piso, sin ascensor · segundo nivel arriba",
          en: "Lower floor on the 4th floor, no elevator · second level above",
          fr: "Niveau bas au 4e étage, sans ascenseur · second niveau au-dessus",
        },
        address: ADDRESS,
        mapNote: MAP_NOTE,
        summary: {
          es: "Apartamento loft de dos niveles, amueblado. Hoy está ocupado.",
          en: "A furnished two-level loft. It is occupied right now.",
          fr: "Loft meublé sur deux niveaux. Il est occupé en ce moment.",
        },
        description: {
          es: "La planta baja está en el cuarto piso del condominio: habitación secundaria, sala, medio baño de visita, estar, comedor con balcón de hierro y cocina abierta. La escalera de caracol, de hierro y madera, sube al segundo nivel y a la azotea. Arriba está la habitación principal, con acceso directo a la terraza.",
          en: "The lower floor is on the fourth floor of the building: second bedroom, living room, guest half-bath, sitting area, dining room with an iron balcony, and an open kitchen. The iron-and-wood spiral stair goes up to the second level and the roof. The master bedroom is above, with direct access to the terrace.",
          fr: "Le niveau bas est au quatrième étage : chambre secondaire, séjour, toilettes invités, coin salon, salle à manger avec balcon en fer et cuisine ouverte. Le colimaçon en fer et en bois monte au second niveau et au toit. La chambre principale est en haut, avec un accès direct à la terrasse.",
        },
        layout: {
          es: "Abajo, en el 4.º piso: habitación secundaria, sala, medio baño, estar, comedor, cocina y cuarto de servicio. Arriba: habitación principal y terraza en la azotea.",
          en: "Below, on the 4th floor: second bedroom, living room, half-bath, sitting area, dining room, kitchen, and service room. Above: master bedroom and rooftop terrace.",
          fr: "En bas, au 4e étage : chambre secondaire, séjour, toilettes, coin salon, salle à manger, cuisine et pièce de service. En haut : chambre principale et terrasse sur le toit.",
        },
        photoNote: { es: "Fotos del D12.", en: "Photos of D12.", fr: "Photos du D12." },
        levelLabels: [
          { es: "Segundo nivel · habitación principal y terraza", en: "Second level · master bedroom and terrace", fr: "Second niveau · chambre principale et terrasse" },
          { es: "4.º piso · habitación secundaria, sala, comedor y cocina", en: "4th floor · second bedroom, living room, dining room and kitchen", fr: "4e étage · chambre secondaire, séjour, salle à manger et cuisine" },
        ],
        stay: null,
        fitFor: [],
        notFor: [],
        pet: { es: "", en: "", fr: "" },
        amenities: [
          { es: "Habitación secundaria: baño completo, clóset, cama full, aire inverter, abanico de techo, librero, mesita de noche y escritorio", en: "Second bedroom: full bathroom, closet, full bed, inverter air conditioning, ceiling fan, bookcase, nightstand, and desk", fr: "Chambre secondaire : salle de bain complète, placard, lit full, climatisation inverter, ventilateur de plafond, bibliothèque, table de chevet et bureau" },
          { es: "Sala: sofá de tres plazas, mesa de centro, mesitas auxiliares, butaca, abanico de techo y aire acondicionado", en: "Living room: three-seat sofa, coffee table, side tables, armchair, ceiling fan, and air conditioning", fr: "Séjour : canapé trois places, table basse, tables d’appoint, fauteuil, ventilateur de plafond et climatisation" },
          { es: "Medio baño de visita", en: "Guest half-bath", fr: "Toilettes invités" },
          { es: "Estar con dos butacas y abanico de techo", en: "Sitting area with two armchairs and a ceiling fan", fr: "Coin salon avec deux fauteuils et un ventilateur de plafond" },
          { es: "Escalera de caracol de hierro y madera hacia el segundo nivel y la azotea", en: "Iron-and-wood spiral stair to the second level and the roof", fr: "Colimaçon en fer et en bois vers le second niveau et le toit" },
          { es: "Comedor de cuatro sillas con balcón de hierro", en: "Dining for four, with an iron balcony", fr: "Salle à manger pour quatre, avec balcon en fer" },
          { es: "Cocina de concepto abierto, totalmente equipada", en: "Open kitchen, fully equipped", fr: "Cuisine ouverte, entièrement équipée" },
          { es: "Cuarto de servicio con baño, área de lavado y lavadora automática", en: "Service room with a bathroom, laundry, and an automatic washer", fr: "Pièce de service avec salle de bain, buanderie et lave-linge automatique" },
          { es: "Habitación principal: balcón con dos sillas y mesita, baño completo, aire acondicionado, dos abanicos de techo, cama queen, clósets, cajonera y escritorio o vanity", en: "Master bedroom: balcony with two chairs and a small table, full bathroom, air conditioning, two ceiling fans, queen bed, closets, chest of drawers, and a desk or vanity", fr: "Chambre principale : balcon avec deux chaises et une petite table, salle de bain complète, climatisation, deux ventilateurs de plafond, lit queen, placards, commode et bureau ou coiffeuse" },
          { es: "Terraza en la azotea: BBQ de gas, medio baño, lavadero adicional, muebles de exterior, plantas naturales y bombillos colgantes", en: "Rooftop terrace: gas barbecue, half-bath, extra wash sink, outdoor furniture, live plants, and hanging bulbs", fr: "Terrasse sur le toit : barbecue au gaz, toilettes, lavabo supplémentaire, mobilier d’extérieur, plantes et ampoules suspendues" },
          { es: "Inversor con dos baterías, internet, calentador de agua, bomba y tinaco de reserva", en: "Inverter with two batteries, internet, water heater, pump, and reserve tank", fr: "Onduleur avec deux batteries, internet, chauffe-eau, pompe et citerne de réserve" },
          { es: "Tres aires acondicionados y cinco abanicos de techo", en: "Three air conditioners and five ceiling fans", fr: "Trois climatiseurs et cinq ventilateurs de plafond" },
          { es: "Parqueo con portón eléctrico; puerta de cristal común con token; puerta de madera con código y puerta de hierro", en: "Parking with an electric gate; shared glass door with a token; wood door with a code lock and an iron door", fr: "Stationnement avec portail électrique ; porte vitrée commune avec jeton ; porte en bois à code et porte en fer" },
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
        status: "decorating",
        comingSoon: true,
        blocked: [],
        diagram: false,
        geo: { lat: BUILDING.lat, lng: BUILDING.lng },
        mapQuery: BUILDING.query,
        mapZoom: 17,
        aptNumber: "D2",
        name: { es: "D2 · una habitación", en: "D2 · one bedroom", fr: "D2 · une chambre" },
        layoutShort: { es: "1 habitación · mezzanine", en: "1 bedroom · mezzanine", fr: "1 chambre · mezzanine" },
        addressShort: { es: "César Nicolás Penson #38", en: "César Nicolás Penson #38", fr: "César Nicolás Penson n° 38" },
        floorNote: {
          es: "En proceso de decoración y limpieza.",
          en: "Decoration and cleaning are still in progress.",
          fr: "La décoration et le nettoyage sont encore en cours.",
        },
        address: ADDRESS,
        mapNote: MAP_NOTE,
        summary: {
          es: "Una habitación con mezzanine. Se está decorando y limpiando.",
          en: "One bedroom with a mezzanine. It is still being furnished and cleaned.",
          fr: "Une chambre avec mezzanine. La décoration et le nettoyage sont en cours.",
        },
        description: {
          es: "Habitación con aire acondicionado, abanico de techo y baño completo. Sala con abanico de techo. Cocina de concepto abierto con comedor. Área de lavado con lavadora. Estar-terraza con dos abanicos de techo. La escalera de caracol es de hierro y sube al entrepiso y a la azotea.",
          en: "A bedroom with air conditioning, a ceiling fan, and a full bathroom. Living room with a ceiling fan. Open kitchen with dining. Laundry with a washer. A sitting terrace with two ceiling fans. The spiral stair is iron and goes up to the mezzanine and the roof.",
          fr: "Chambre avec climatisation, ventilateur de plafond et salle de bain complète. Séjour avec ventilateur de plafond. Cuisine ouverte avec salle à manger. Buanderie avec lave-linge. Terrasse-salon avec deux ventilateurs de plafond. Le colimaçon est en fer et monte à la mezzanine et au toit.",
        },
        layout: {
          es: "Habitación, sala, cocina abierta con comedor, lavado y estar-terraza. Entrepiso y azotea por la escalera de caracol de hierro.",
          en: "Bedroom, living room, open kitchen with dining, laundry, and a sitting terrace. Mezzanine and roof by the iron spiral stair.",
          fr: "Chambre, séjour, cuisine ouverte avec salle à manger, buanderie et terrasse-salon. Mezzanine et toit par le colimaçon en fer.",
        },
        photoNote: {
          es: "Una foto del proceso. La decoración no está terminada.",
          en: "One photo of the work in progress. Furnishing is not finished.",
          fr: "Une photo du chantier. La décoration n’est pas terminée.",
        },
        stay: null,
        fitFor: [],
        notFor: [],
        pet: { es: "", en: "", fr: "" },
        amenities: [
          { es: "Habitación con aire acondicionado, abanico de techo y baño completo", en: "Bedroom with air conditioning, a ceiling fan, and a full bathroom", fr: "Chambre avec climatisation, ventilateur de plafond et salle de bain complète" },
          { es: "Sala con abanico de techo", en: "Living room with a ceiling fan", fr: "Séjour avec ventilateur de plafond" },
          { es: "Cocina de concepto abierto con comedor", en: "Open kitchen with dining", fr: "Cuisine ouverte avec salle à manger" },
          { es: "Área de lavado con lavadora", en: "Laundry with a washer", fr: "Buanderie avec lave-linge" },
          { es: "Estar-terraza con dos abanicos de techo", en: "Sitting terrace with two ceiling fans", fr: "Terrasse-salon avec deux ventilateurs de plafond" },
          { es: "Escalera de caracol de hierro hacia el entrepiso y la azotea", en: "Iron spiral stair to the mezzanine and the roof", fr: "Colimaçon en fer vers la mezzanine et le toit" },
          { es: "Inversor con dos baterías, calentador de agua, bomba y tinaco de reserva", en: "Inverter with two batteries, water heater, pump, and reserve tank", fr: "Onduleur avec deux batteries, chauffe-eau, pompe et citerne de réserve" },
          { es: "Aire acondicionado y cuatro abanicos de techo", en: "Air conditioning and four ceiling fans", fr: "Climatisation et quatre ventilateurs de plafond" },
          { es: "Decoración y plantas", en: "Decoration and plants", fr: "Décoration et plantes" },
          { es: "Parqueo con portón eléctrico; puerta común con token; puerta de madera con código y puerta de hierro", en: "Parking with an electric gate; shared door with a token; wood door with a code lock and an iron door", fr: "Stationnement avec portail électrique ; porte commune avec jeton ; porte en bois à code et porte en fer" },
        ],
        media: [
          { kind: "photo", src: "media/d2-en-decoracion.webp", caption: { es: "En proceso de decoración", en: "Decoration in progress", fr: "Décoration en cours" } },
        ],
      },
      {
        id: "d1",
        status: "soon",
        comingSoon: true,
        blocked: [],
        diagram: false,
        geo: { lat: BUILDING.lat, lng: BUILDING.lng },
        mapQuery: BUILDING.query,
        mapZoom: 17,
        aptNumber: "D1",
        name: { es: "D1 · una habitación", en: "D1 · one bedroom", fr: "D1 · une chambre" },
        layoutShort: { es: "1 habitación · línea blanca", en: "1 bedroom · appliances", fr: "1 chambre · électroménager" },
        addressShort: { es: "César Nicolás Penson #38", en: "César Nicolás Penson #38", fr: "César Nicolás Penson n° 38" },
        floorNote: {
          es: "Próximamente. Todavía no hay fotos.",
          en: "Coming soon. There are no photos yet.",
          fr: "Bientôt. Il n’y a pas encore de photos.",
        },
        address: ADDRESS,
        mapNote: MAP_NOTE,
        summary: {
          es: "Una habitación, próximamente. Sin fotos todavía.",
          en: "One bedroom, coming soon. No photos yet.",
          fr: "Une chambre, bientôt. Pas encore de photos.",
        },
        description: {
          es: "Habitación con clóset y baño completo, sala, y cocina de concepto abierto con desayunador y comedor. Estar-terraza y escalera tipo rampa, de hierro y madera, con acceso a la azotea y al área de lavado. Lo indicado es la línea blanca: estufa, nevera y extractor. El texto no lista muebles, aire acondicionado ni inversor.",
          en: "A bedroom with a closet and a full bathroom, a living room, and an open kitchen with a breakfast bar and dining. A sitting terrace and an iron-and-wood ramp stair, with access to the roof and the laundry area. What is listed is the appliances: stove, refrigerator, and extractor fan. The notes do not list furniture, air conditioning, or an inverter.",
          fr: "Chambre avec placard et salle de bain complète, séjour, et cuisine ouverte avec comptoir de petit-déjeuner et salle à manger. Terrasse-salon et escalier en rampe, fer et bois, avec accès au toit et à la buanderie. Ce qui est indiqué, c’est l’électroménager : cuisinière, réfrigérateur et hotte. Le texte ne cite ni meubles, ni climatisation, ni onduleur.",
        },
        layout: {
          es: "Habitación, sala, cocina abierta con desayunador y comedor, estar-terraza, y rampa hacia la azotea y el lavado.",
          en: "Bedroom, living room, open kitchen with a breakfast bar and dining, sitting terrace, and a ramp to the roof and the laundry.",
          fr: "Chambre, séjour, cuisine ouverte avec comptoir et salle à manger, terrasse-salon, et rampe vers le toit et la buanderie.",
        },
        photoNote: {
          es: "No hay fotos del D1. Este recuadro no es el apartamento.",
          en: "There are no photos of D1. This panel is not the apartment.",
          fr: "Il n’y a pas de photos du D1. Ce cadre n’est pas l’appartement.",
        },
        stay: null,
        fitFor: [],
        notFor: [],
        pet: { es: "", en: "", fr: "" },
        amenities: [
          { es: "Habitación con clóset y baño completo", en: "Bedroom with a closet and a full bathroom", fr: "Chambre avec placard et salle de bain complète" },
          { es: "Sala", en: "Living room", fr: "Séjour" },
          { es: "Cocina de concepto abierto con desayunador y comedor", en: "Open kitchen with a breakfast bar and dining", fr: "Cuisine ouverte avec comptoir de petit-déjeuner et salle à manger" },
          { es: "Estar-terraza", en: "Sitting terrace", fr: "Terrasse-salon" },
          { es: "Escalera tipo rampa, de hierro y madera, con acceso a la azotea y al área de lavado", en: "Iron-and-wood ramp stair, with access to the roof and the laundry area", fr: "Escalier en rampe, fer et bois, avec accès au toit et à la buanderie" },
          { es: "Solo línea blanca: estufa, nevera y extractor", en: "Appliances only: stove, refrigerator, and extractor fan", fr: "Électroménager seulement : cuisinière, réfrigérateur et hotte" },
          { es: "Bomba y tinaco de reserva, y calentador de agua", en: "Pump and reserve tank, and a water heater", fr: "Pompe et citerne de réserve, et chauffe-eau" },
          { es: "Parqueo con portón eléctrico y puerta de cristal común con token", en: "Parking with an electric gate, and a shared glass door with a token", fr: "Stationnement avec portail électrique, et porte vitrée commune avec jeton" },
        ],
        media: [
          { kind: "pattern", caption: { es: "Próximamente", en: "Coming soon", fr: "Bientôt" } },
        ],
      },
    ],
    neighborhood: [
      { src: "media/colonial.webp", caption: { es: "Zona Colonial, Santo Domingo", en: "Colonial Zone, Santo Domingo", fr: "Zone coloniale, Santo Domingo" } },
      { src: "media/zona.webp", caption: { es: "Calle de la Zona Colonial", en: "A street in the Colonial Zone", fr: "Une rue de la zone coloniale" } },
      { src: "media/malecon.webp", caption: { es: "Costa de Santo Domingo", en: "The Santo Domingo coast", fr: "Le littoral de Santo Domingo" } },
    ],
    samples: [
      {
        name: "Ejemplo · M.",
        text: {
          es: "Ejemplo, no es una reseña real. Miré el mapa y las fechas antes de escribir.",
          en: "Sample, not a real review. I looked at the map and the dates before writing.",
          fr: "Exemple, pas un vrai avis. J’ai regardé la carte et les dates avant d’écrire.",
        },
      },
      {
        name: "Ejemplo · A.",
        text: {
          es: "Ejemplo, no es una reseña real. Quería saber de una vez cómo es el acceso al D12.",
          en: "Sample, not a real review. I wanted to know right away what access to D12 is like.",
          fr: "Exemple, pas un vrai avis. Je voulais savoir tout de suite comment on accède au D12.",
        },
      },
      {
        name: "Ejemplo · L.",
        text: {
          es: "Ejemplo, no es una reseña real. Pedí la tarifa por correo. En la página no hay precios.",
          en: "Sample, not a real review. I asked for the rate by email. The page has no prices.",
          fr: "Exemple, pas un vrai avis. J’ai demandé le tarif par e-mail. La page n’a pas de prix.",
        },
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
