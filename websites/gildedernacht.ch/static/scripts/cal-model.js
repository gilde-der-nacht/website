'use strict';

class GoogleCalendar {
    constructor(calendarID = 'gildedernacht@gmail.com', apiKey = 'AIzaSyBRXYQfvv3KHyZmZrhxzWDOghX_c7xfnGo') {
        this.url = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarID + '/events?key=' + apiKey + '&SameSite=None';
    }

    async getDates() {
        return await fetch(this.url)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            }).then(response => {
                return response.json();
            }).then(data => {
                // get only the events
                return data.items;
            }).then(entries => {
                // remove events without a defined start
                return entries.filter(entry => entry.start);
            }).then(entries => {
                // save different date format as a standard js date object
                return entries.map(entry => {
                    entry.start.dateObj = new Date(entry.start.dateTime || entry.start.date);
                    entry.end.dateObj = new Date(entry.end.dateTime || entry.end.date);
                    return entry;
                });
            }).then(entries => {
                // remove event which have already ended
                return entries.filter(entry => {
                    const currDate = new Date();
                    const endDate = entry.end.dateObj;
                    return (currDate < endDate);
                });
            }).then(entries => {
                // sort by start date
                return entries.sort((entryA, entryB) => {
                    return entryA.start.dateObj - entryB.start.dateObj;
                });
            })
    }
}
