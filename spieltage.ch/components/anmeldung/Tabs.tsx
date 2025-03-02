import { Button } from "@common/components/Button";
import { Match, Suspense, Switch, type JSX, type Resource } from "solid-js";
import { Kontaktdaten } from "@rst/components/anmeldung/Kontaktdaten";
import { Samstag } from "@rst/components/anmeldung/Samstag";
import { Sonntag } from "@rst/components/anmeldung/Sonntag";
import { Zusammenfassung } from "@rst/components/anmeldung/Zusammenfassung";
import { Box, SimpleBox } from "@common/components/Box";
import type {
  Program,
  ReservationFromServer,
  SaveFromServer,
  UpdateSave,
} from "@rst/components/anmeldung/data";
import type {
  Reservation,
  ReservationView,
} from "@rst/components/anmeldung/types";

export type Tab = "Contact" | "Saturday" | "Sunday" | "Summary";

function TabsHeader(props: {
  activeTab: Tab;
  changeTab: (tab: Tab) => void;
}): JSX.Element {
  return (
    <ul
      role="list"
      style="display: flex; flex-wrap: wrap; column-gap: 1rem; row-gap: .5rem;"
    >
      <li>
        <Button
          label="Kontaktdaten"
          kind={props.activeTab === "Contact" ? "special" : "gray"}
          onClick={() => props.changeTab("Contact")}
        />
      </li>
      <li>
        <Button
          label="Programm Samstag"
          kind={props.activeTab === "Saturday" ? "special" : "gray"}
          onClick={() => props.changeTab("Saturday")}
        />
      </li>
      <li>
        <Button
          label="Program Sonntag"
          kind={props.activeTab === "Sunday" ? "special" : "gray"}
          onClick={() => props.changeTab("Sunday")}
        />
      </li>
      <li>
        <Button
          label="Zusammenfassung"
          kind={props.activeTab === "Summary" ? "special" : "gray"}
          onClick={() => props.changeTab("Summary")}
        />
      </li>
    </ul>
  );
}

function TabsFooter(props: {
  activeTab: Tab;
  changeTab: (tab: Tab) => void;
}): JSX.Element {
  function prev(): void {
    switch (props.activeTab) {
      case "Saturday":
        props.changeTab("Contact");
        break;
      case "Sunday":
        props.changeTab("Saturday");
        break;
      case "Summary":
        props.changeTab("Sunday");
        break;
    }
  }

  function next(): void {
    switch (props.activeTab) {
      case "Contact":
        props.changeTab("Saturday");
        break;
      case "Saturday":
        props.changeTab("Sunday");
        break;
      case "Sunday":
        props.changeTab("Summary");
        break;
    }
  }

  return (
    <>
      <div style="display: flex; justify-content: space-between;">
        <div>
          {props.activeTab !== "Contact" ? (
            <Button label="<< Vorheriger Schritt" onClick={prev} />
          ) : null}
        </div>
        <div>
          {props.activeTab !== "Summary" ? (
            <Button label="Nächster Schritt >>" onClick={next} />
          ) : null}
        </div>
      </div>
    </>
  );
}
export type SaveState = "NO_CHANGES" | "SAVING" | "HAS_CHANGES";
function SaveBar(props: {
  lastSaved: string;
  saveCurrentState: () => Promise<void>;
  state: SaveState;
}): JSX.Element {
  const dateFormat = new Intl.DateTimeFormat("de-CH", {
    timeStyle: "short",
    dateStyle: "long",
  });
  return (
    <SimpleBox type={props.state === "HAS_CHANGES" ? "success" : "gray"}>
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
        <div>
          Zuletzt gespeichert am {dateFormat.format(new Date(props.lastSaved))}
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; margin-left: auto;">
          <p>
            <em>
              <small>
                {props.state === "NO_CHANGES"
                  ? "keine Änderungen entdeckt"
                  : props.state === "HAS_CHANGES"
                    ? "ungespeicherte Änderungen entdeckt"
                    : ""}
              </small>
            </em>
          </p>
          <Button
            disabled={props.state !== "HAS_CHANGES"}
            label={
              props.state === "NO_CHANGES"
                ? "Gespeichert."
                : props.state === "SAVING"
                  ? "Wird gespeichert..."
                  : "Speichern"
            }
            kind={props.state === "HAS_CHANGES" ? "success" : "gray"}
            onClick={props.saveCurrentState}
          />
        </div>
      </div>
    </SimpleBox>
  );
}

export function Tabs(props: {
  save: SaveFromServer;
  updateSave: UpdateSave;
  activeTab: Tab;
  lastSaved: string;
  saveState: SaveState;
  programResource: Resource<Program>;
  confirmedReservations: ReservationFromServer[];
  tentativeReservations: Reservation[];
  markedForDeletionReservations: number[];
  changeTab: (tab: Tab) => void;
  saveCurrentState: () => Promise<void>;
  addTentativeReservation: (reservation: Reservation) => void;
  deleteReservation: (reservation: ReservationView) => void;
}): JSX.Element {
  return (
    <>
      <TabsHeader activeTab={props.activeTab} changeTab={props.changeTab} />
      <div style="padding-block: 1rem;">
        <SimpleBox>
          {props.activeTab === "Contact" ? (
            <Kontaktdaten save={props.save} updateSave={props.updateSave} />
          ) : props.activeTab === "Saturday" ? (
            <>
              <h2>Programm Samstag</h2>
              <Suspense fallback={<Box>Programm wird geladen ...</Box>}>
                <Switch>
                  <Match when={props.programResource()}>
                    {(program) => (
                      <Samstag
                        selfName={props.save.name}
                        program={program()}
                        wantsEmailUpdates={props.save.wantsEmailUpdates}
                        confirmedReservations={props.confirmedReservations}
                        tentativeReservations={props.tentativeReservations}
                        markedForDeletionReservations={
                          props.markedForDeletionReservations
                        }
                        addTentativeReservation={props.addTentativeReservation}
                        updateSave={props.updateSave}
                        deleteReservation={props.deleteReservation}
                      />
                    )}
                  </Match>
                </Switch>
              </Suspense>
            </>
          ) : props.activeTab === "Sunday" ? (
            <>
              <h2>Programm Sonntag</h2>
              <Suspense fallback={<Box>Programm wird geladen ...</Box>}>
                <Switch>
                  <Match when={props.programResource()}>
                    {(program) => (
                      <Sonntag
                        selfName={props.save.name}
                        program={program()}
                        wantsEmailUpdates={props.save.wantsEmailUpdates}
                        confirmedReservations={props.confirmedReservations}
                        tentativeReservations={props.tentativeReservations}
                        markedForDeletionReservations={
                          props.markedForDeletionReservations
                        }
                        addTentativeReservation={props.addTentativeReservation}
                        updateSave={props.updateSave}
                        deleteReservation={props.deleteReservation}
                      />
                    )}
                  </Match>
                </Switch>
              </Suspense>
            </>
          ) : (
            <div class="content">
              <h2>Zusammenfassung</h2>
              <small>
                Hier hast du die komplette Übersicht über alle deine Eingaben.
                Du kannst bis am <strong>Freitag, 23. August 2024</strong>{" "}
                zurückkommen und deine Kontaktdaten und Reservationen anpassen.
              </small>
              <Suspense fallback={<Box>Zusammenfassung wird geladen ...</Box>}>
                <Switch>
                  <Match when={props.programResource()}>
                    {(program) => (
                      <Zusammenfassung
                        save={props.save}
                        tentativeReservations={props.tentativeReservations}
                        program={program()}
                        markedForDeletionReservations={
                          props.markedForDeletionReservations
                        }
                      />
                    )}
                  </Match>
                </Switch>
              </Suspense>
            </div>
          )}
          <div style="padding-block: 2rem 1rem; position: sticky; bottom: 0; background-image: linear-gradient(transparent, var(--clr-3) 25%);">
            <SaveBar
              lastSaved={props.lastSaved}
              saveCurrentState={props.saveCurrentState}
              state={props.saveState}
            />
          </div>
        </SimpleBox>
      </div>
      <TabsFooter activeTab={props.activeTab} changeTab={props.changeTab} />
    </>
  );
}
