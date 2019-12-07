'use strict';

class GoogleCalendar {

}

class Calendar {
    constructor(calenderClass) {
        const requestData = calenderClass.load();
    }

    static getDates() {
        return [{
            title: 'Spieltreffen',
            date: 'Samstag, 7. Dezember 2019 — 14.00',
            place: 'Pfarreiheim St. Johannes, Schädrütistrasse 26, 6006 Luzern',
            description: 'Schön, dass du mit uns spielst.',
            image: 'https://scontent.fzrh3-1.fna.fbcdn.net/v/t1.0-9/s960x960/69694518_1216457091891380_8506334758685376512_o.jpg?_nc_cat=105&_nc_ohc=pud3E5jHmvMAQkneL2We_HdGFVn1JMjtxHPuUmpgqJzocUuB_sqM-eTFA&_nc_ht=scontent.fzrh3-1.fna&oh=10828d4cb8514aeaf0acaef5e7205580&oe=5E4E6370'
        }];
    }





}
