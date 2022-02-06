import $ from "./lib/blingbling.js";

function getActiveFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("tags")) {
        return [... new Set(urlParams.getAll("tags").map(str => str.split(",")).flat().filter(str => str.length > 0).map(str => str.toLowerCase()))];
    }
    return [];
}

function updateDOM() {
    const events = $("[data-event-tags]");
    events.map(e => e.classList.remove("hidden"));
    const activeFilters = getActiveFilters();
    if (!activeFilters.length) {
        return;
    }
    $("[data-event-filter").forEach(filter => {
        if (activeFilters.includes($(filter).attr("data-event-filter"))) {
            filter.classList.add("active");
        } else {
            filter.classList.remove("active");
        }
    });
    const filteredEvents = events.map(e => e.attr("data-event-tags")).filter(tags => {
        let found = false;
        activeFilters.forEach(filter => {
            if (tags.toLowerCase().includes(filter)) {
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
            if (e
                .attr("data-event-tags")
                .toLowerCase()
                .includes(filter)) {
                hasTag = true;
            }
        });
        if (!hasTag) {
            e.classList.add("hidden");
        }
    })
}

function setupFilterLink(link) {
    link.on("click", (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("tags");
        urlParams.append("tags", e.target.dataset.eventFilter);
        const newUrl = new URL(window.location);
        newUrl.search = urlParams;
        history.pushState(urlParams, "", newUrl);
        updateDOM();
    });
}

function setupFilterRemoveLink(link) {
    link.on("click", (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("tags");
        const newUrl = new URL(window.location);
        newUrl.search = urlParams;
        history.pushState(urlParams, "", newUrl);
        updateDOM();
    });
}

export function updateCalendarFilters() {
    $("[data-event-filter]").map(setupFilterLink);
    $("[data-event-filter-remove]").map(setupFilterRemoveLink);
    updateDOM();
}
