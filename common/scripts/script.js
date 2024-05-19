import { updateCalendarFilters } from "./_calendar-filter.js";
import { toggleScrolling } from "./_mobile-menu.js";
import { toggleTheme } from "./_theme-switcher.js";

(function initialize() {
    toggleScrolling();
    toggleTheme();
    updateCalendarFilters();
}());
