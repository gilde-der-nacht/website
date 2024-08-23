import { Match, Suspense, Switch, type JSX, type Resource } from "solid-js";
import { Kontaktdaten } from "@rst/components/anmeldung/Kontaktdaten";
import { Samstag } from "@rst/components/anmeldung/Samstag";
import { Sonntag } from "@rst/components/anmeldung/Sonntag";
import { Zusammenfassung } from "@rst/components/anmeldung/ZusammenfassungFrozen";
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
          <div style="padding-block: 2rem 1rem; bottom: 0; background-image: linear-gradient(transparent, var(--clr-3) 25%);">
            <SaveBar
              lastSaved={props.lastSaved}
              saveCurrentState={props.saveCurrentState}
              state={props.saveState}
            />
          </div>
        </SimpleBox>
      </div>
    </>
  );
}
