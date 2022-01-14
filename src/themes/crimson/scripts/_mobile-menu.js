import $ from "./lib/blingbling.js";

export function toggleScrolling() {
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
