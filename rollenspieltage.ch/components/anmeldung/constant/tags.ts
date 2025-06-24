import type { Tag } from "@rst/components/anmeldung/api/shared";

export const gameTags = [
  {
    name: "ab6jahren",
    label: "Ab 6 Jahren",
    description:
      "Spannungs- und Bedrohungsmomente werden kurz gehalten. In Begleitung oder nach Absprache mit einem Elternteil. Beispiele: My Little Pony, ...",
  },
  {
    name: "ab12jahren",
    label: "Ab 12 Jahren",
    description:
      "Antisoziales und destruktives wird auf ein Minimum begrenzt. Keine Diskriminierung, keine Radikalisierung, Sexualität wird nicht explizit dargestellt.",
  },
  {
    name: "ab18jahren",
    label: "Ab 18 Jahren",
    description:
      "Keinerlei Richtlinien bezüglich Inhalt, in der Gruppe sollte aber diskutiert werden, was akzeptabel ist und was nicht. Beispiele: Vampire the Masquerade, ...",
  },
  {
    name: "fantasy",
    label: "Fantasy",
    description:
      "Spielt in einer alternativen Vergangenheit, in welcher Elemente wie: Ritterinnen, Hexenmeister, Rüstungen, Magie, Goblins, Turniere usw. vorkommen können. Beispiele: Das Schwarze Auge, Dungeons & Dragons, ...",
  },
  {
    name: "sciencefiction",
    label: "Science Fiction",
    description:
      "Spielt in einer alternativen Zukunft, in welcher Elemente wie: Raumschiffe, Sternenportale, Künstliche Intelligenzen, Laserkanonen usw. vorkommen können. Beispiele: Shadowrun, Alien, ...",
  },
  {
    name: "postapokalyptisch",
    label: "Postapokalyptisch",
    description:
      "Spielt in einer Welt mitten oder nach einem Kollaps, wo die Mehrheit ums Überleben kämpft. Beispiele: Mutant Year Zero, Apocalypse World",
  },
  {
    name: "horror",
    label: "Horror",
    description:
      "Eine gruselige Atmosphäre, psychologischen Druck oder unvorhersehbare Schreckensmomente. Beispiele: Cthulhu, ...",
  },  
  {
    name: "offenewelt",
    label: "Offene Welt",
    description:
      "Es gibt nur einen losen Handlungsfaden, die Rollenspiel-Gruppe muss sich ihre Ziele selber festlegen. Beispiele: Ironsworn, Blades in the Dark, ...",
  },
  {
    name: "gemeinsamespielleitung",
    label: "Gemeinsame Spielleitung",
    description:
      "Die Regeln und die Umwelt werden gemeinsam von allen Spielenden umgesetzt. Beispiele: Microscope, The Quiet Year, ...",
  },
  {
    name: "regelleicht",
    label: "Regelleicht",
    description:
      "Die kompletten Regeln haben alle auf einer Seite Platz. Beispiele: Fiasco, Everyone is John, ...",
  },
  {
    name: "deutsch",
    label: "Deutsch",
    description: "Bei der Spielrunde reden die Spielenden miteinander Deutsch.",
  },
  {
    name: "englisch",
    label: "Englisch",
    description:
      "Bei der Spielrunde reden die Spielenden miteinander Englisch.",
  },
  {
    name: "workshop",
    label: "Workshop",
    description:
      "Unter Anleitung, gemeinsam ein Rollenspiel-Thema vertiefen. Kreative Techniken stehen im Vordergrund. Beispiele: Gemeinsam ein Dungeon erschaffen, Gemeinsam ein Hintergrundgeschichte schreiben, ...",
  },  
] satisfies Tag[];
