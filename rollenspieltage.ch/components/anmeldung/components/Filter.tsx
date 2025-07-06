import { Box } from "@common/components/Box";
import { Button, ButtonWithIcon } from "@common/components/Button";
import type { ProgramDay } from "@rst/components/anmeldung/utils/time";
import { For, type JSX } from "solid-js";
import {
  createStore,
  unwrap,
  type SetStoreFunction,
  type Store,
} from "solid-js/store";
import { gameTags } from "@rst/components/anmeldung/constant/tags";
import type { ProgramEntryClient } from "@rst/components/anmeldung/api/program";

type Option = "withOpenSeats" | "iHaveTime";

type ActiveOptions = Record<Option, boolean>;

export type ActiveFilter = {
  tags: string[];
  day: ProgramDay | null;
} & ActiveOptions;

const filterKeys = {
  day: "fDay",
  tags: "fTags",
  options: "fOpts",
};

export function initalizeFilters(): ActiveFilter {
  const url = new URL(location.href);
  const filterDayParam = url.searchParams.get(filterKeys.day);
  const activeDayFilter = ((): ProgramDay | null => {
    if (filterDayParam === "SATURDAY" || filterDayParam === "SUNDAY") {
      return filterDayParam;
    }
    return null;
  })();

  const filterTagsParam = url.searchParams.getAll(filterKeys.tags);

  const filterOptionsParam = url.searchParams.getAll(filterKeys.options);

  return {
    day: activeDayFilter,
    tags: filterTagsParam,
    withOpenSeats: filterOptionsParam.includes("withOpenSeats"),
    iHaveTime: filterOptionsParam.includes("iHaveTime"),
  };
}

type FilterUpdater = {
  toggleDay: (day: ProgramDay) => void;
  toggleTag: (tag: string) => void;
  toggleOption: (option: Option) => void;
  reset: () => void;
};

function createFilterUpdater(
  store: Store<ActiveFilter>,
  setter: SetStoreFunction<ActiveFilter>,
): FilterUpdater {
  return {
    toggleDay: (day) => {
      const isActive = store.day === day;
      const url = new URL(location.href);
      if (isActive) {
        url.searchParams.delete(filterKeys.day);
        setter("day", null);
      } else {
        url.searchParams.set(filterKeys.day, day);
        setter("day", day);
      }
      history.pushState(unwrap(store), "", url);
    },
    toggleTag: (tag) => {
      const isActive = store.tags.includes(tag);
      const url = new URL(location.href);
      if (isActive) {
        url.searchParams.delete(filterKeys.tags);
        setter(
          "tags",
          store.tags.filter((t) => t !== tag),
        );
        store.tags.forEach((t) => {
          url.searchParams.append(filterKeys.tags, t);
        });
      } else {
        url.searchParams.append(filterKeys.tags, tag);
        setter("tags", store.tags.length, tag);
      }
      history.pushState(unwrap(store), "", url);
    },
    toggleOption: (option) => {
      const isActive = store[option];
      const url = new URL(location.href);
      setter(option, !isActive);
      (["withOpenSeats", "iHaveTime"] satisfies Option[]).forEach((o) => {
        if (store[o]) {
          url.searchParams.append(filterKeys.options, o);
        }
      });
      history.pushState(unwrap(store), "", url);
    },
    reset: () => {
      setter({
        day: null,
        tags: [],
        withOpenSeats: false,
        iHaveTime: false,
      });

      const url = new URL(location.href);
      url.searchParams.delete(filterKeys.day);
      url.searchParams.delete(filterKeys.tags);
      url.searchParams.delete(filterKeys.options);
      history.pushState(unwrap(store), "", url);
    },
  };
}

export function Filters(props: {
  activeFilter: Store<ActiveFilter>;
}): JSX.Element {
  const [store, setStore] = createStore(props.activeFilter);
  const updater = createFilterUpdater(store, setStore);
  return (
    <Box>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between;">
        <h5 style="margin: 0;">Filter</h5>
        <ButtonWithIcon
          label="Filter zurücksetzen"
          icon="circle-xmark"
          kind="ghost-danger"
          onClick={() => updater.reset()}
        />
      </div>
      <h6 style="margin-block: 0.5rem;">Tage</h6>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <Button
          label="Samstag"
          kind={store.day !== "SUNDAY" ? "success" : "gray"}
          onClick={() => updater.toggleDay("SATURDAY")}
        />
        <Button
          label="Sonntag"
          kind={store.day !== "SATURDAY" ? "success" : "gray"}
          onClick={() => updater.toggleDay("SUNDAY")}
        />
      </div>
      <h6 style="margin-block: 0.5rem;">Kategorien</h6>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <For each={gameTags}>
          {(gameTag) => (
            <Button
              label={gameTag.label}
              kind={
                store.tags.length === 0 || store.tags.includes(gameTag.name)
                  ? "success"
                  : "gray"
              }
              onClick={() => updater.toggleTag(gameTag.name)}
            />
          )}
        </For>
      </div>
      {
        // <h6 style="margin-block: 0.5rem;">Weitere Filter</h6>
        // <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        //   <Button
        //     label="Zeige nur Spielrunden mit freien Plätzen an."
        //     kind={store.withOpenSeats ? "success" : "gray"}
        //     onClick={() => updater.toggleOption("withOpenSeats")}
        //   />
        //   <Button
        //     label="Zeige nur Spielrunden an, die sich nicht mit meinem bestehenden Programm überschneiden."
        //     kind={store.iHaveTime ? "success" : "gray"}
        //     onClick={() => updater.toggleOption("iHaveTime")}
        //   />
        // </div>
      }
    </Box>
  );
}

export function applyFilter(
  program: ProgramEntryClient[],
  filter: ActiveFilter,
): ProgramEntryClient[] {
  return program.filter((entry) => {
    if (filter.day !== entry.slot.day && filter.day !== null) {
      return false;
    }

    if (!tagsSelected(entry.tags, filter.tags)) {
      return false;
    }
    return true;
  });
}

function tagsSelected(entryTags: string[], filterTags: string[]): boolean {
  if (filterTags.length === 0) {
    return true;
  }

  const nonMatchingTags = filterTags.filter((ft) => !entryTags.includes(ft));
  return nonMatchingTags.length === 0;
}
