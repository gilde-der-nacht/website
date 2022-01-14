import $ from "./lib/blingbling.js";

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

export function toggleTheme() {
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
