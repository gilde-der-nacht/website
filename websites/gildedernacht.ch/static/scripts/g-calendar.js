"use strict";

const calendarMain = async () => {
  const i18nMap = {};
  document
    .getElementById("calendar-i18n")
    .content.querySelectorAll("*")
    .forEach((child) => {
      i18nMap[child.dataset.id] = child.dataset.text;
    });

  const translate = (what) => {
    return i18nMap[what];
  };

  const formatDate = (start, end) => {
    const startDay = translate("day-" + start.getDay());
    const startDate = start.getDate();
    const startMonth = translate("month-" + (start.getMonth() + 1));
    const startYear = start.getFullYear();
    const startTimeHours = start.getHours();
    const startTimeMinutes =
      start.getMinutes() === 0 ? "00" : start.getMinutes();

    const endDay = translate("day-" + end.getDay());
    const endDate = end.getDate();
    const endMonth = translate("month-" + (end.getMonth() + 1));
    const endYear = end.getFullYear();

    if (end.getDay() === start.getDay()) {
      return `${startDay}, ${startDate}. ${startMonth} ${startYear} &ndash; ${startTimeHours}.${startTimeMinutes} ${translate(
        "hour"
      )}`;
    } else {
      return `${startDay}, ${startDate}. ${startMonth} ${startYear} &<br /> ${endDay}, ${endDate}. ${endMonth} ${endYear}`;
    }
  };

  const calendar = new GoogleCalendar();
  await calendar.getDates().then((entries) => {
    let output = "";
    entries.forEach((entry) => {
      const startDate = entry.start.dateObj;
      const endDate = entry.end.dateObj;

      const dateFormatted = formatDate(startDate, endDate);

      const title = entry.summary;
      let image = "";
      if (title.includes("Spieltreffen")) {
        image = "/images/avatars/blue.png";
      } else if (title.includes("Spieltage")) {
        image = "/images/avatars/lst.png";
      } else if (title.includes("Rollenspieltage")) {
        image = "/images/avatars/rst.png";
      } else if (title.includes("Rollenspiel-Stammtisch")) {
        image = "/images/avatars/lila.png";
      } else if (title.includes("Stammtisch")) {
        image = "/images/avatars/green.png";
      } else if (title.includes("Buchclub")) {
        image = "/images/avatars/blue.png";
      } else {
        image = "/images/avatars/gdn.png";
      }

      let url = "";
      if (title.includes("Spieltage")) {
        url = "spieltage.ch";
      } else if (title.includes("Rollenspieltage")) {
        url = "rollenspieltage.ch";
      } else if (title.includes("Rollenspiel-Stammtisch")) {
        url = "gildedernacht.ch/stammtisch";
      } else if (title.includes("Online")) {
        url = "chat.gildedernacht.ch";
      }

      output += `
        <li>
          <img src="${image}" />
          <div class="body">
            <h1 class="title">${title}</h1>
            <p class="date">${dateFormatted}</p>
            <p><small><em>${
              entry.description ? entry.description : ""
            }</em></small></p>
            <a href="https://${url}"><p>${url}</p></a>
          </div>
        </li>`;
    });
    document.querySelector(".g-calendar").innerHTML = output;
  });
};

class GoogleCalendar {
  constructor(
    calendarID = "gildedernacht@gmail.com",
    apiKey = "AIzaSyBRXYQfvv3KHyZmZrhxzWDOghX_c7xfnGo"
  ) {
    this.url =
      "https://www.googleapis.com/calendar/v3/calendars/" +
      calendarID +
      "/events?key=" +
      apiKey +
      "&SameSite=None";
  }

  async getDates() {
    return await fetch(this.url)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // get only the events
        return data.items;
      })
      .then((entries) => {
        // remove events without a defined start
        return entries.filter((entry) => entry.start);
      })
      .then((entries) => {
        // save different date format as a standard js date object
        return entries.map((entry) => {
          entry.start.dateObj = new Date(
            entry.start.dateTime || entry.start.date
          );
          if (entry.end.dateTime) {
            entry.end.dateObj = new Date(entry.end.dateTime);  
          } else {
            const endDate = new Date(entry.end.date);
            endDate.setDate(endDate.getDate() - 1); // hack for time zones -> use a better library in the future
            entry.end.dateObj = endDate;
          }          
          return entry;
        });
      })
      .then((entries) => {
        // remove event which have already ended
        return entries.filter((entry) => {
          const currDate = new Date();
          const endDate = entry.end.dateObj;
          return currDate < endDate;
        });
      })
      .then((entries) => {
        // sort by start date
        return entries.sort((entryA, entryB) => {
          return entryA.start.dateObj - entryB.start.dateObj;
        });
      });
  }
}

calendarMain();
