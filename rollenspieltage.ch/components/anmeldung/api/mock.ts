import type { SaveServer } from "@rst/components/anmeldung/api/save";
import type { RegistrationsServer } from "@rst/components/anmeldung/api/registrations";
import type { Result } from "@rst/components/anmeldung/api/utils";
import type { ProgramServer } from "@rst/components/anmeldung/api/program";

const validTimeStamp = "2024-08-15T07:45:21.335Z";
const uuid = {
  game: "37831e19-29d6-40bd-b99d-fb91b78aa7f9",
  slot: "bfcbd156-b703-4664-9944-8936aede8476",
};

function fromLocalStoreOrDefault(key: string, fallback: string): string {
  const localSave = localStorage.getItem(key);

  if (localSave === null) {
    return fallback;
  }

  return localSave;
}

function toLocalStorage(key: string, state: string): void {
  localStorage.setItem(key, state);
}
/*
 * Save
 */

const SAVE_KEY = "SAVE";

const saveMock = {
  version: 1,
  init: {
    name: "John Doe",
    email: "john@doe.ch",
    mobile: "+41 66 123 45 67",
  },
  lastSaved: validTimeStamp,
  playing: {
    wantsUpdates: false,
    reservations: [],
  },
  master: {
    games: [
      {
        uuid: uuid.game,
        kind: "published",
        title: "Grolle in der Dunkelheit",
        system: "Warhammer Fantasy Rollenspiel",
        description: {
          short:
            "Ein kurzes Abenteuer bei dem es um Fantasy, Action und einfaches Rollenspiel geht.",
          long: "Eine kleine Gruppe wagt sich in die dunklen Schächten einer Mine und weiter hinab, um einen mächtigen Gegenstand wieder zu erlangen. Wie werden die Gefährten auf die Gefahren des Untergrundes reagieren und welche Gefahren lauern in der Finsternis?",
        },
        slots: [
          {
            uuid: uuid.slot,
            day: "SATURDAY",
            from: 10,
            to: 12,
          },
          {
            uuid: crypto.randomUUID(),
            day: "SUNDAY",
            from: 14,
            to: 17,
          },
        ],
        playerCount: {
          min: 1,
          max: 3,
        },
        tagNames: ["deutsch"],
      },
    ],
    wantsHelp: false,
  },
  helping: {},
} satisfies SaveServer;

export async function mockedLoadSave(): Promise<Result<unknown>> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          kind: "SUCCESS",
          data: JSON.parse(
            fromLocalStoreOrDefault(SAVE_KEY, JSON.stringify(saveMock)),
          ),
        }),
      1_000,
    ),
  );
}

export async function mockedSaveState(
  state: SaveServer,
  secret: string,
): Promise<Result<string>> {
  return new Promise((res) =>
    setTimeout(() => {
      toLocalStorage(SAVE_KEY, JSON.stringify(state));
      return res({ kind: "SUCCESS", data: secret });
    }, 1_000),
  );
}

/*
 * Program
 */

const programMock = [
  {
    uuid: crypto.randomUUID(),
    gamemaster: "Game Master",
    title: "Grolle in der Dunkelheit",
    system: "Warhammer Fantasy Rollenspiel",
    description: {
      short:
        "Ein kurzes Abenteuer bei dem es um Fantasy, Action und einfaches Rollenspiel geht.",
      long: "Eine kleine Gruppe wagt sich in die dunklen Schächten einer Mine und weiter hinab, um einen mächtigen Gegenstand wieder zu erlangen. Wie werden die Gefährten auf die Gefahren des Untergrundes reagieren und welche Gefahren lauern in der Finsternis?",
    },
    slot: {
      day: "SATURDAY",
      from: 10,
      to: 13,
    },
    playerCount: {
      min: 1,
      max: 3,
      reserved: 0,
    },
    tags: ["ab12jahren"],
  },
  {
    uuid: crypto.randomUUID(),
    gamemaster: "Other Game Master",
    title: "Acrimony",
    system: "D&D",
    description: {
      short: "Ein Lo-Fi Space Western Abenteuer",
      long: 'Ein Lo-Fi Space Western Abenteuer: "Eine frisch formierte Gruppe von Kopfgeldjägern wird mit einer riskanten Mission betraut: Sie müssen den berüchtigten Outlaw Jeb "Rusty" Rourke in der abgeschiedenen Grenzstadt aufspüren. Bei dieser unbarmherzigen Jagd lernen die Spieler die harte Realität der Kopfgeldjagd kennen, wo jeder Schuss und jede Entscheidung über ihr Schicksal entscheidet.',
    },
    slot: {
      day: "SATURDAY",
      from: 10,
      to: 13,
    },
    playerCount: {
      min: 2,
      max: 8,
      reserved: 3,
    },
    tags: ["ab12jahren", "horror"],
  },
  {
    uuid: crypto.randomUUID(),
    gamemaster: "Some Other Game Master",
    title: "Solo RPGs",
    system: "",
    description: {
      short:
        "Wir spielen primär das Solo Rollenspiel NoteQuest, werden aber kurz auch noch ein paar andere Solo Rollenspiele miteinander anschauen.",
      long: "",
    },
    slot: {
      day: "SATURDAY",
      from: 14,
      to: 18,
    },
    playerCount: {
      min: 2,
      max: 4,
      reserved: 3,
    },
    tags: [],
  },
] satisfies ProgramServer;

export async function mockedLoadProgram(): Promise<Result<unknown>> {
  return new Promise((res) =>
    setTimeout(() => res({ kind: "SUCCESS", data: programMock }), 5_000),
  );
}

/*
 * Registrations
 */

const registrationsMock = {
  entries: [
    {
      uuid: uuid.slot,
      name: "Alice",
    },
    {
      uuid: uuid.slot,
      name: "Bob",
    },
  ],
} satisfies RegistrationsServer;

export async function mockedLoadRegistrations(
  uuids: string[],
): Promise<unknown> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          entries: registrationsMock.entries.filter((entry) =>
            uuids.includes(entry.uuid),
          ),
        }),
      5_000,
    ),
  );
}
