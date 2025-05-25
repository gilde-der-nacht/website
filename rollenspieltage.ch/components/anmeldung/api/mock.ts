import type { SaveServer } from "@rst/components/anmeldung/api/save";
import type { PublicProgramServer } from "@rst/components/anmeldung/api/program";
import { resetEditFormServer } from "@rst/components/anmeldung/api/gameround-edit";

const validTimeStamp = "2024-08-15T07:45:21.335Z";

/*
 * Save
 */

const SAVE_KEY = "SAVE";

const saveMock = {
  uuid: crypto.randomUUID(),
  name: "John Doe",
  email: "john@doe.ch",
  mobile: "+41 66 123 45 67",
  lastSaved: validTimeStamp,
  playing: {
    wantsUpdates: false,
  },
  master: {
    games: [
      {
        uuid: crypto.randomUUID(),
        title: "Grolle in der Dunkelheit",
        system: "Warhammer Fantasy Rollenspiel",
        description: {
          short:
            "Ein kurzes Abenteuer bei dem es um Fantasy, Action und einfaches Rollenspiel geht.",
          long: "Eine kleine Gruppe wagt sich in die dunklen Schächten einer Mine und weiter hinab, um einen mächtigen Gegenstand wieder zu erlangen. Wie werden die Gefährten auf die Gefahren des Untergrundes reagieren und welche Gefahren lauern in der Finsternis?",
        },
        slots: [
          {
            uuid: crypto.randomUUID(),
            day: "SATURDAY",
            from: 10,
            to: 12,
          },
        ],
        playerCount: {
          min: 1,
          max: 3,
        },
        playerNames: [],
        tagNames: ["deutsch"],
      },
    ],
    newEditForm: resetEditFormServer(),
    wantsHelp: false,
  },
  helping: {},
} satisfies SaveServer;

export async function mockedLoadSave(): Promise<unknown> {
  return Promise.resolve(fromLocalStoreOrDefault(SAVE_KEY, saveMock));
}

/*
 * Program
 */

const PROGRAM_KEY = "PROGRAM";

const programMock = {
  entries: [
    {
      uuid: crypto.randomUUID(),
      gamemaster: "Mike Hunziker",
      title: "Grolle in der Dunkelheit",
      system: "Warhammer Fantasy Rollenspiel",
      description: {
        short:
          "Ein kurzes Abenteuer bei dem es um Fantasy, Action und einfaches Rollenspiel geht.",
        long: "Eine kleine Gruppe wagt sich in die dunklen Schächten einer Mine und weiter hinab, um einen mächtigen Gegenstand wieder zu erlangen. Wie werden die Gefährten auf die Gefahren des Untergrundes reagieren und welche Gefahren lauern in der Finsternis?",
      },
      slots: [],
      playerCount: {
        min: 1,
        max: 3,
        reserved: 0,
      },
      tagNames: ["children"],
    },
  ],
} satisfies PublicProgramServer;

export async function mockedLoadProgram(): Promise<unknown> {
  return Promise.resolve(fromLocalStoreOrDefault(PROGRAM_KEY, programMock));
}
function fromLocalStoreOrDefault(key: string, fallback: unknown): unknown {
  const localSave = localStorage.getItem(key);

  if (localSave === null) {
    return fallback;
  }

  return localSave;
}
