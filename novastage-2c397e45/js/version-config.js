/**
 * NovaStage site version tokens — single file to remove when preview mode is retired.
 *
 * Every wordmark uses Glacial Indifference. Versions 1, 3, 4, 6, and 8 use the
 * Canva Bethlehem lockup. Version 8 is that lockup with gold Nova and turquoise Stage.
 * Versions 2, 5, and 7 keep their sites, with the star kept clear of the type.
 * The previous 1/3/4/6 designs live only in git tag novastage-all-7-versions.
 * Do not renumber the ids.
 */
window.NOVASTAGE_VERSION_CONFIG = {
  storageKey: "novastage-site-version",
  defaultVersion: 2,
  audioVolume: 0.4,
  audioFadeMs: 900,
  versions: [
    {
      id: 1,
      enabled: true,
      isNew: true,
      palette: "h",
      tabLabel: "Version 1",
      wordmarkFont: "glacial",
      lockupEmphasis: "bethlehem",
      audio: {
        mp3: "audio/version-1.mp3",
        ogg: "audio/version-1.ogg",
        piece: "Dance of the Sugar Plum Fairy (The Nutcracker)",
        composer: "Pyotr Ilyich Tchaikovsky",
        performer: "Recording via Free Classical Music (YouTube upload to Commons)",
        license: "CC BY 3.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Tchaikovsky_-_Dance_of_the_Sugar_Plum_Fairy_-_The_Nutcracker.ogg",
      },
    },
    {
      id: 2,
      enabled: true,
      palette: "b",
      tabLabel: "Version 2",
      wordmarkFont: "glacial",
      lockupEmphasis: "normal",
      audio: {
        mp3: "audio/version-2.mp3",
        ogg: "audio/version-2.ogg",
        piece: "Clair de lune (Suite bergamasque)",
        composer: "Claude Debussy",
        performer: "Laurens Goedhart",
        license: "Public domain",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg",
      },
    },
    {
      id: 3,
      enabled: true,
      isNew: true,
      palette: "i",
      tabLabel: "Version 3",
      wordmarkFont: "glacial",
      lockupEmphasis: "bethlehem",
      audio: {
        mp3: "audio/version-3.mp3",
        ogg: "audio/version-3.ogg",
        piece: "Gymnopédie No. 1",
        composer: "Erik Satie",
        performer: "Teknopazzo",
        license: "CC0 1.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1..ogg",
      },
    },
    {
      id: 4,
      enabled: true,
      isNew: true,
      palette: "j",
      tabLabel: "Version 4",
      wordmarkFont: "glacial",
      lockupEmphasis: "bethlehem",
      audio: {
        mp3: "audio/version-4.mp3",
        ogg: "audio/version-4.ogg",
        piece: 'The Four Seasons — Spring, Mvt. I (Allegro)',
        composer: "Antonio Vivaldi",
        performer: "John Harrison (violin), Wichita State University Chamber Players",
        license: "CC BY-SA 4.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Vivaldi_-_Four_Seasons_1_Spring_mvt_1_Allegro_-_John_Harrison_violin.oga",
      },
    },
    {
      id: 5,
      enabled: true,
      palette: "e",
      tabLabel: "Version 5",
      wordmarkFont: "glacial",
      lockupEmphasis: "crest",
      audio: {
        mp3: "audio/version-5.mp3",
        ogg: "audio/version-5.ogg",
        piece: "Waltz in A minor, B.150",
        composer: "Frédéric Chopin",
        performer: "Musopen recording (via Wikimedia Commons)",
        license: "Public domain",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Chopin_-_Waltz_in_A_minor,_B_150.ogg",
      },
    },
    {
      id: 6,
      enabled: true,
      isNew: true,
      palette: "k",
      tabLabel: "Version 6",
      wordmarkFont: "glacial",
      lockupEmphasis: "bethlehem",
      audio: {
        mp3: "audio/version-6.mp3",
        ogg: "audio/version-6.ogg",
        piece: "Arabesque No. 1 (Deux arabesques)",
        composer: "Claude Debussy",
        performer: "Patrizia Prati, piano",
        license: "CC BY-SA 4.0",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Claude_Debussy_-_Premi%C3%A8re_Arabesque_-_Patrizia_Prati.ogg",
      },
    },
    {
      id: 7,
      enabled: true,
      palette: "g",
      tabLabel: "Version 7",
      wordmarkFont: "glacial",
      lockupEmphasis: "eclipse",
      audio: {
        mp3: "audio/version-7.mp3",
        ogg: "audio/version-7.ogg",
        piece: "Eine kleine Nachtmusik, K. 525 — II. Romanze",
        composer: "Wolfgang Amadeus Mozart",
        performer: "Musopen recording (via Wikimedia Commons)",
        license: "Public domain",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Mozart_-_Serenade_No._13_for_strings_in_G_major,_K._525_-_Romanze.ogg",
      },
    },
    {
      id: 8,
      enabled: true,
      isNew: true,
      palette: "l",
      tabLabel: "Version 8",
      wordmarkFont: "glacial",
      lockupEmphasis: "bethlehem",
      audio: {
        mp3: "audio/version-2.mp3",
        ogg: "audio/version-2.ogg",
        piece: "Clair de lune (Suite bergamasque)",
        composer: "Claude Debussy",
        performer: "Laurens Goedhart",
        license: "Public domain",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg",
      },
    },
  ],
};
