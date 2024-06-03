import { Button } from "@common/components/Button";
import type { JSX } from "solid-js/jsx-runtime";
import { Kontaktdaten } from "./Kontaktdaten";
import { Samstag } from "./Samstag";
import { Sonntag } from "./Sonntag";
import { Zusammenfassung } from "./Zusammenfassung";
import { SimpleBox } from "@common/components/Box";
import type { Save, UpdateSave } from "./data";

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
  console.log(props.lastSaved);
  return (
    <SimpleBox>
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;">
        <div>
          Zuletzt gespeichert am {dateFormat.format(new Date(props.lastSaved))}
        </div>
        <Button
          disabled={props.state !== "HAS_CHANGES"}
          label={
            props.state === "NO_CHANGES"
              ? "Gespeichert."
              : props.state === "SAVING"
                ? "Wird gespeichert..."
                : "Speichern"
          }
          onClick={props.saveCurrentState}
        />
      </div>
    </SimpleBox>
  );
}

export function Tabs(props: {
  save: Save;
  updateSave: UpdateSave;
  activeTab: Tab;
  changeTab: (tab: Tab) => void;
  lastSaved: string;
  saveCurrentState: () => Promise<void>;
  saveState: SaveState;
}): JSX.Element {
  return (
    <>
      <TabsHeader activeTab={props.activeTab} changeTab={props.changeTab} />
      <br />
      <SimpleBox>
        {props.activeTab === "Contact" ? (
          <Kontaktdaten save={props.save} updateSave={props.updateSave} />
        ) : props.activeTab === "Saturday" ? (
          <Samstag />
        ) : props.activeTab === "Sunday" ? (
          <Sonntag />
        ) : (
          <Zusammenfassung />
        )}
        <SaveBar
          lastSaved={props.lastSaved}
          saveCurrentState={props.saveCurrentState}
          state={props.saveState}
        />
      </SimpleBox>
      <br />
      <TabsFooter activeTab={props.activeTab} changeTab={props.changeTab} />
    </>
  );
}
