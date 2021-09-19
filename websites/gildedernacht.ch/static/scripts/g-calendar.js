"use strict";

const calendarEntries = [...document.querySelectorAll(".g-calendar > li")];
const now = new Date();


calendarEntries.forEach(entry => {
  const { year, month, date } = entry.dataset;

  if (Number(year) < now.getFullYear()) {
    entry.remove();
  }
  if (Number(year) === now.getFullYear() && Number(month) < (now.getMonth() + 1)) {
    entry.remove();
  }
  if (Number(year) === now.getFullYear() && Number(month) === (now.getMonth() + 1) && Number(date) < now.getDate()) {
    entry.remove();
  }
});
