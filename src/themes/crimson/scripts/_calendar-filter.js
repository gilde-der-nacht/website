import $ from "./lib/blingbling.js";

function getActiveFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("tag")) {
        return [... new Set(urlParams.getAll("tag").map(str => str.split(",")).flat().filter(str => str.length > 0))];
    }
    return [];
}

export function updateCalendarFilters() {
    const events = $("[data-event-tags]");
    events.map(e => e.classList.remove("hidden"));

    const activeFilters = getActiveFilters();
    if (!activeFilters.length) {
        return;
    }
    const filteredEvents = events.map(e => e.attr("data-event-tags")).filter(tags => {
        let found = false;
        activeFilters.forEach(filter => {
            if (tags.includes(filter)) {
                found = true;
            }
        });
        return found;
    });
    if (!filteredEvents.length) {
        return;
    }
    events.forEach(e => {
        let hasTag = false;
        activeFilters.forEach(filter => {
            if (e.attr("data-event-tags").includes(filter)) {
                hasTag = true;
            }
        });
        if (!hasTag) {
            e.classList.add("hidden");
        }
    })
}
