// https://github.com/argyleink/blingblingjs

const sugar = {
  on: function(names, fn) {
    names
      .split(' ')
      .forEach(name =>
        this.addEventListener(name, fn))
    return this
  },
  off: function(names, fn) {
    names
      .split(' ')
      .forEach(name =>
        this.removeEventListener(name, fn))
    return this
  },
  attr: function(attr, val) {
    if (val === undefined) return this.getAttribute(attr)

    val == null
      ? this.removeAttribute(attr)
      : this.setAttribute(attr, val || '')

    return this
  }
}

function $(query, $context = document) {
  let $nodes = query instanceof NodeList || Array.isArray(query)
    ? query
    : query instanceof HTMLElement || query instanceof SVGElement
      ? [query]
      : $context.querySelectorAll(query)

  if (!$nodes.length) $nodes = []

  return Object.assign(
    Array.from($nodes).map($el => Object.assign($el, sugar)),
    {
      on: function(names, fn) {
        this.forEach($el => $el.on(names, fn))
        return this
      },
      off: function(names, fn) {
        this.forEach($el => $el.off(names, fn))
        return this
      },
      attr: function(attrs, val) {
        if (typeof attrs === 'string' && val === undefined)
          return this[0].attr(attrs)

        else if (typeof attrs === 'object')
          this.forEach($el =>
            Object.entries(attrs)
              .forEach(([key, val]) =>
                $el.attr(key, val)))

        else if (typeof attrs == 'string' && (val || val == null || val == ''))
          this.forEach($el => $el.attr(attrs, val))

        return this
      }
    }
  )
}


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
    history.replaceState(e.target.dataset.eventFilter, "", newUrl);
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
    history.replaceState(null, "", newUrl);
    updateDOM();
  });
}

function updateCalendarFilters() {
  $("[data-event-filter]").map(setupFilterLink);
  $("[data-event-filter-remove]").map(setupFilterRemoveLink);
  updateDOM();
}


function toggleScrolling() {
  const [bodyEl] = $("body");
  const toggleEl = $("[data-toggle-mobile-navigation]");
  toggleEl.on("click", () => {
    const className = "overflow-hidden";
    if (bodyEl.classList.contains(className)) {
      bodyEl.classList.remove(className);
    } else {
      bodyEl.classList.add(className);
    }
  });
}

const storageKey = "theme-preference";
const theme = { value: getColorPreference() };

const toggleEl = $("[data-toggle-theme]");
const [bodyEl] = $("body");

function getColorPreference() {
  if (localStorage.getItem(storageKey)) {
    return localStorage.getItem(storageKey);
  } else {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ?
      "dark" :
      "light";
  }
}

function setPreference() {
  localStorage.setItem(storageKey, theme.value);
  reflectPreference();
}

function reflectPreference() {
  bodyEl.attr("color-scheme", theme.value);
  toggleEl.attr("aria-label", theme.value);
  toggleEl.forEach(el => {
    const [switchToLightIco] = $("[data-toggle-theme-to-light]", el);
    const [switchToDarkIco] = $("[data-toggle-theme-to-dark]", el);
    if (theme.value === "light") {
      switchToLightIco.classList.add("hidden");
      switchToDarkIco.classList.remove("hidden");
    } else {
      switchToDarkIco.classList.add("hidden");
      switchToLightIco.classList.remove("hidden");
    }
  })
}

function toggleTheme() {
  reflectPreference()
  toggleEl.forEach((el) => {
    el.classList.remove("hidden");
    el.on("click", () => {
      theme.value = theme.value === "light" ?
        "dark" :
        "light";

      setPreference();
    });
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches: isDark }) => {
      theme.value = isDark ? "dark" : "light";
      setPreference();
    })
}

(function initialize() {
  toggleScrolling();
  toggleTheme();
  updateCalendarFilters();
}());
