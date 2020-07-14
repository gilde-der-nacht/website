'use strict';

class RPGEvent {
    constructor() {
        this.gameSystem;
        this.gameMaster;
        this.description;
        this.startDay;
        this.endDay;
        this.startTime;
        this.endTime;
        this.imageUrl;
        this.tags = [];
    }
}

class GoogleCalendar {
    constructor(calendarID = 'gildedernacht@gmail.com', apiKey = 'AIzaSyBRXYQfvv3KHyZmZrhxzWDOghX_c7xfnGo') {
        this.url = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarID + '/events?key=' + apiKey + '&SameSite=None';
    }

    toRPGEvent(e) {
        const event = new RPGEvent();

        // GameSystem
        event.gameSystem = e.summary;

        // GameMaster
        const gmRegex = new RegExp('(Spielleiter(in)?: .+?) [\\n\(]');
        event.gameMaster = gmRegex.exec(e.description)[1]

        // Description
        const descRegex = new RegExp('Kamera.+?\\n{1,3}((.|\\n)+)\\n{2}Anfänger');
        const descRegexFound = descRegex.exec(e.description)
        if (descRegexFound) {
            event.description = descRegexFound[1]
        } else {
            console.log(e);
        }

        // StartDay
        event.startDay = e.start.dateObj.getDate();

        // EndDay
        event.endDay = e.end.dateObj.getDate();

        // StartTime
        event.startTime = e.start.dateObj.getHours();

        // EndTime
        event.endTime = e.end.dateObj.getHours();

        // ImageUrl
        const imgRegex = new RegExp('Banner: (.+)');
        event.imageUrl = imgRegex.exec(e.description)[1]

        // Tags
        const tags = [
            'Anfängerfreundlich',
            'Für die ganze Familie',
            'Burgen & Rittertum',
            'Magie & Zauberwerk',
            'Rätsel',
            'Improvisation'
        ];
        const star = '★';
        tags.forEach(tag => {
            const tagRegex = new RegExp(tag + ': .+\\n');
            const line = tagRegex.exec(e.description);
            if (line) {
                const stars = line[0].match(new RegExp(star, 'g')).length;
                event.tags.push({
                    tag,
                    stars
                });
            }
        });

        return event;
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
                // only Rollenspieltag-Events
                return entries.filter(entry => {
                    return entry.description && entry.description.includes('★');
                });
            })
            .then(entries => {
                // sort by start date
                return entries.sort((entryA, entryB) => {
                    return entryA.start.dateObj - entryB.start.dateObj;
                });
            }).then(entries => {
                // parse to useful obj
                return entries.map(this.toRPGEvent);
            })
    }
}
