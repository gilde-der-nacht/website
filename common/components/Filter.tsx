import { Box } from "@common/components/Box";
import { Button, ButtonWithIcon } from "@common/components/Button";
import {
  arr,
  createReactive,
  obj,
  type Reactive,
} from "@common/utils/reactivity";
import type { ProgramDay } from "@common/utils/time";
import { For, Show, type Accessor, type JSX, type Setter } from "solid-js";

export type DayFilterState = ProgramDay | null;

export function DayFilter(props: {
  dayFilter: Accessor<DayFilterState>;
  setDayFilter: Setter<DayFilterState>;
  exclude?: ProgramDay[];
}): JSX.Element {
  const exclude = props.exclude ?? [];

  return (
    <Box>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
        <h5 style="margin: 0;">Filter</h5>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <Button
          label="Alle Tage"
          kind={props.dayFilter() === null ? "success" : "gray"}
          onClick={() => props.setDayFilter(null)}
        />
        <Show when={!exclude.includes("FRIDAY")}>
          <Button
            label="Freitag"
            kind={props.dayFilter() === "FRIDAY" ? "success" : "gray"}
            onClick={() => props.setDayFilter("FRIDAY")}
          />
        </Show>
        <Show when={!exclude.includes("SATURDAY")}>
          <Button
            label="Samstag"
            kind={props.dayFilter() === "SATURDAY" ? "success" : "gray"}
            onClick={() => props.setDayFilter("SATURDAY")}
          />
        </Show>
        <Show when={!exclude.includes("SUNDAY")}>
          <Button
            label="Sonntag"
            kind={props.dayFilter() === "SUNDAY" ? "success" : "gray"}
            onClick={() => props.setDayFilter("SUNDAY")}
          />
        </Show>
      </div>
    </Box>
  );
}

export type ActiveFilter = {
  tags: string[];
  day: DayFilterState;
  language: "Deutsch" | "Englisch" | null;
};

type FilterUpdater = {
  toggleDay: (day: DayFilterState) => void;
  toggleTag: (tag: string) => void;
  toggleAllTags: () => void;
  toggleLanguage: (language: "Deutsch" | "Englisch" | null) => void;
};

function createFilterUpdater(filters$: Reactive<ActiveFilter>): FilterUpdater {
  return {
    toggleDay: (day) => {
      const isActive = filters$.get().day === day;
      if (isActive) {
        filters$.pipe(obj.sub("day")).set(null);
      } else {
        filters$.pipe(obj.sub("day")).set(day);
      }
    },
    toggleTag: (tag) => {
      const isActive = filters$.get().tags.includes(tag);
      if (isActive) {
        filters$
          .pipe(obj.sub("tags"))
          .set(filters$.get().tags.filter((t) => t !== tag));
      } else {
        arr.push(filters$.pipe(obj.sub("tags")), tag);
      }
    },
    toggleAllTags: () => {
      filters$.pipe(obj.sub("tags")).set([]);
    },
    toggleLanguage: (language) => {
      const isActive = filters$.get().language === language;
      if (isActive) {
        filters$.pipe(obj.sub("language")).set(null);
      } else {
        filters$.pipe(obj.sub("language")).set(language);
      }
    },
  };
}

export function Filters(props: {
  filters$: Reactive<ActiveFilter>;
  tags: { label: string; name: string; count: number }[];
}): JSX.Element {
  const updater = createFilterUpdater(props.filters$);
  const expandTags$ = createReactive(false);

  function getMostUsedTags(): string[] {
    return props.tags
      .toSorted((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((tag) => tag.name)
      .filter((tag) => !["Frei Verfügbares Rollenspiel"].includes(tag));
  }

  return (
    <Box>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
        <h5 style="margin: 0;">Filter</h5>
      </div>
      <h6 style="margin-block: 0.5rem;">Tage</h6>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <Button
          label={"Alle Tage".toLocaleUpperCase()}
          kind={props.filters$.get().day === null ? "success" : "gray"}
          onClick={() => updater.toggleDay(null)}
          style="margin-inline-end: 1rem;"
        />
        <Button
          label="Samstag"
          kind={props.filters$.get().day !== "SUNDAY" ? "success" : "gray"}
          onClick={() => updater.toggleDay("SATURDAY")}
        />
        <Button
          label="Sonntag"
          kind={props.filters$.get().day !== "SATURDAY" ? "success" : "gray"}
          onClick={() => updater.toggleDay("SUNDAY")}
        />
      </div>
      <h6 style="margin-block: 0.5rem;">Kategorien </h6>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <Button
          label={"Alle Kategorien".toLocaleUpperCase()}
          kind={props.filters$.get().tags.length === 0 ? "success" : "gray"}
          onClick={() => updater.toggleAllTags()}
          style="margin-inline-end: 1rem;"
        />
        <For each={props.tags}>
          {(categories) => (
            <Show
              when={
                expandTags$.get() || getMostUsedTags().includes(categories.name)
              }
            >
              <Button
                label={categories.label}
                kind={
                  props.filters$.get().tags.length === 0 ||
                  props.filters$.get().tags.includes(categories.name)
                    ? "success"
                    : "gray"
                }
                onClick={() => {
                  const newTagFilter = new Set(
                    props.filters$.get().tags.concat(categories.name),
                  );
                  if (newTagFilter.size === props.tags.length) {
                    updater.toggleAllTags();
                  } else {
                    updater.toggleTag(categories.name);
                  }
                }}
              />
            </Show>
          )}
        </For>
        <Show
          when={expandTags$.get()}
          fallback={
            <ButtonWithIcon
              icon="circle-plus"
              label=""
              onClick={() => expandTags$.set(!expandTags$.get())}
            />
          }
        >
          <ButtonWithIcon
            icon="circle-minus"
            label=""
            onClick={() => expandTags$.set(!expandTags$.get())}
          />
        </Show>
      </div>
      <h6 style="margin-block: 0.5rem;">Sprache</h6>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <Button
          label={"Alle Sprachen".toLocaleUpperCase()}
          kind={props.filters$.get().language === null ? "success" : "gray"}
          onClick={() => updater.toggleLanguage(null)}
          style="margin-inline-end: 1rem;"
        />
        <Button
          label="Deutsch"
          kind={
            props.filters$.get().language !== "Englisch" ? "success" : "gray"
          }
          onClick={() => updater.toggleLanguage("Deutsch")}
        />
        <Button
          label="Englisch"
          kind={
            props.filters$.get().language !== "Deutsch" ? "success" : "gray"
          }
          onClick={() => updater.toggleLanguage("Englisch")}
        />
      </div>
    </Box>
  );
}
