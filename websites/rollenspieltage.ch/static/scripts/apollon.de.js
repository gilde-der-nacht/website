"use strict";

const i18n = {
  language: 'de',
  general: {
    delete: "Löschen",
    introDescription:
      "Wir geben unser Bestes, dir ein möglichst spannendes, auf dich zugeschnittenes Programm zusammenzustellen. Um uns dabei zu helfen, bitten wir dich, uns deine Präferenzen mitzuteilen über dieses Anmeldeformular.",
    helpNeeded:
      "Zögere nicht, uns bei Unklarheiten und Fragen direkt zu kontaktieren.",
  },
  phases: {
    intro: "Einstieg",
    gaming: "Spielen",
    gamemastering: "Spielleiten",
    outro: "Abschluss",
    back: "Zurück",
    next: "Weiter",
    submit: "Anmeldung abschliessen",
    update: "Anmeldung updaten",
  },
  languages: {
    title: "Sprache",
    en: "Englisch",
    de: "Deutsch",
  },
  fields: {
    title: "Kontaktdaten",
    name: { label: "Name" },
    mail: {
      label: "E-Mail",
      info: "Wir verwenden deine E-Mail nur für die Luzerner Rollenspieltage 2021.",
    },
  },
  weekdays: {
    saturday: "Samstag, 28.8.21",
    sunday: "Sonntag, 29.8.21",
  },
  time: {
    description:
      "Bitte wähle die Stunden aus, an denen du am Anlass teilnehmen möchtest.",
    title: "Zeitfenster",
    hour: "Uhr",
  },
  genres: {
    title: "Genres",
    description:
      "Vermisst du ein konkretes Rollenspiel? Wir haben uns dieses Jahr bewusst dafür entschieden keine konkreten Spielrunden anzubieten. Wir möchten vor allem denjenigen entgegenkommen für die das Hobby neu ist und denjenigen die mutig sind und gerne etwas ausprobieren möchten.",
    missingGenre: "Vermisst du ein Genre?",
    preferences: {
      yes: "gerne",
      whatever: "egal",
      no: "lieber nicht",
    },
    list: {
      fantasy: "Fantasy",
      scifi: "Sci-Fi",
      horror: "Horror",
      crime: "Krimi",
      modern: "Modern",
      cyberpunk: "Cyberpunk",
      steampunk: "Steampunk",
      western: "Western",
      history: "Historisch",
    },
    addLabel: "hinzufügen",
  },
  workshops: {
    title: "Workshops / Diskussionsrunden",
    missingWorkshop:
      "Hast du Interesse an einem hier nicht aufgeführten Workshop / Diskussionsrunde?",
    preferences: {
      yes: "gerne",
      no: "nein",
    },
    list: {
      workshop_1: "Spielleiter Workshop #1",
      demo_discussion: "Demo Diskussion",
    },
    addLabel: "hinzufügen",
  },
  gaming: {
    description:
      "Für alle unsere Spielrunden brauchst du keine Vorkenntnisse. Du musst nichts vorbereiten und ausser ein wenig Freude auch nichts mitbringen.",
    participate: "Ja, ich möchte gerne als Spieler:in teilnehmen.",
    gameroundTypes: {
      title: "Arten von Spielrunden",
      description:
        "Uns interessiert, ob du an den Luzerner Rollenspieltagen lieber viele Rollenspiele in kurzen Runden testen möchtest oder dich auf wenige, dafür längere Runden fokussieren möchtest.",
      short: "kurze Spielrunden",
      whatever: "egal",
      long: "lange Spielrunden",
    },
    companions: {
      title: "Anmeldung für Gruppen",
      description:
        "Du kannst bis zu zwei Freunde hier hinzufügen, damit ihr gemeinsam spielen könnt. Ist eure Gruppe grösser, bitten wir euch in mehrere Gruppen aufzuteilen, da es für uns schwierig ist, Platz für grössere Gruppen zu finden.",
      names: "Optional darfst du uns die Namen deiner Freunde hier aufführen.",
    },
  },
  gamemastering: {
    participate: "Ja, ich möchte gerne als Spielleiter:in teilnehmen.",
    addAGameround: "füge eine neue Spielrunde hinzu",
    deleteGameround: "Spielrunde löschen",
    saveGameround: "Spielrunde speichern",
    editGameround: "Spielrunde bearbeiten",
    gameTitle: "Titel",
    duration: "Dauer",
    hours: "Stunde",
    minimum: "Minimum",
    maximum: "Maximum",
    playerCount: "Spieleranzahl",
    gameroundTitle: "Spielrunden",
    description: "Beschreibung",
    patrons: {
      title: "Stammspieler",
      description: "Reservierte Plätze für Stammspieler",
    },
    buddy: {
      title: "Buddy-System",
      description:
        "Du hast noch nie ein Rollenspiel geleitet oder möchtest aus einem anderen Grund Unterstützung? Gerne stellen wir dir einen Buddy zur Seite, der dich vor und am Event unterstützt.",
      option: "Ja, ich möchte gerne Unterstützung.",
    },
  },
  info: {
    chooseAtLeastOneOption: "triff bitte mindestens eine Auswahl",
  },
  helping: {
    title: "Helferaufruf",
    description:
      "Ganz alleine könnten wir die Rollenspieltage nicht durchführen. Du kannst uns in diesen Bereichen unterstützen.",
    tasks: {
      logistics: "Aufbau / Abbau",
      finance: "Kasse (Buffet oder Flohmarkt)",
      kitchen: "Küche",
    },
  },
  terms: {
    title: "Mögliche Auflagen des BAG",
    description: "",
    mask: "Nein, ich nehme nicht teil, falls Maskenpflicht am Spieltisch gilt.",
    testing:
      "Nein, ich nehme nicht teil, falls Eintritt nur mit einem Impfzertifikat oder negativem Testergebnis erlaubt ist.",
  },
  questions: {
    title: "Noch Fragen?",
    contact: "zum Kontaktformular",
    contactUrl: "/kontakt",
    chat: "zum Live-Chat",
    chatUrl: "/livechat",
    description: "Oder hinterlasse hier deine Fragen.",
  },
  errors: {
    missingName: "Bitte fülle das Feld «Name» (Schritt 1) aus.",
    missingEmail: "Bitte fülle das Feld «E-Mail» (Schritt 1) aus.",
    noLanguageSelected: "Bitte wähle mindestens eine Sprache (Schritt 1) aus.",
    noTimeSelected: "Bitte wähle mindestens ein Zeitfenster (Schritt 1) aus.",
    editMissingTitle: "Bitte fülle das Feld «Titel» aus.",
    editMissingDescription: "Bitte fülle das Feld «Beschreibung» aus.",
    editMissingGenres: "Bitte wähle mindestens ein Genre aus.",
    editMaxSmallerThanMin:
      "Die «Minimum» Spieleranzahl muss gleich oder kleiner als die «Maximum» Spieleranzahl sein.",
    editLinkNotValid:
      "Der aktuelle Link ist fehlerhaft. Melde dich allenfalls bei uns direkt per Kontaktformular.",
  },
  success: {
    description:
      "Danke für deine Anmeldung. Du kannst deine Anmeldung hier weiterhin anpassen. Speichere die aktuelle Seite, wenn du später davon Gebrauch machen möchtest. Du solltest ebenfalls eine E-Mail von uns erhalten haben als Bestätigung.",
  },
};
