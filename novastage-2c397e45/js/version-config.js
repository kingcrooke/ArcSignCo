/**
 * NovaStage site version tokens — single file to remove when preview mode is retired.
 * Map: Version 1–5 → palette A–E. Versions 6–7 use the illumination lockup.
 */
window.NOVASTAGE_VERSION_CONFIG = {
  storageKey: "novastage-site-version",
  defaultVersion: 1,
  audioVolume: 0.4,
  audioFadeMs: 900,
  versions: [
    {
      id: 1,
      palette: "a",
      tabLabel: "Version 1",
      wordmarkFont: "primary",
      lockupEmphasis: "normal",
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
      palette: "b",
      tabLabel: "Version 2",
      wordmarkFont: "alternate",
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
      palette: "c",
      tabLabel: "Version 3",
      wordmarkFont: "primary",
      lockupEmphasis: "normal",
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
      palette: "d",
      tabLabel: "Version 4",
      wordmarkFont: "primary",
      lockupEmphasis: "bold",
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
      palette: "e",
      tabLabel: "Version 5",
      wordmarkFont: "alternate",
      lockupEmphasis: "normal",
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
      palette: "f",
      tabLabel: "Version 6",
      wordmarkFont: "primary",
      lockupEmphasis: "illumination",
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
      palette: "g",
      tabLabel: "Version 7",
      wordmarkFont: "alternate",
      lockupEmphasis: "illumination",
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
  ],
};
