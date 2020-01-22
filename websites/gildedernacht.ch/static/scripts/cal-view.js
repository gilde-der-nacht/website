'use strict';

const calendarMain = async () => {

    const i18nMap = {};
    document.getElementById('calendar-i18n').content.querySelectorAll('*').forEach(child => {
        i18nMap[child.dataset.id] = child.dataset.text;
    });

    const translate = (what) => {
        return i18nMap[what];
    };

    const formatDate = (start, end) => {
        const startDay = translate('day-' + start.getDay());
        const startDate = start.getDate();
        const startMonth = translate('month-' + (start.getMonth() + 1));
        const startYear = start.getFullYear();
        const startTimeHours = start.getHours();
        const startTimeMinutes = start.getMinutes() === 0 ? '00' : start.getMinutes();

        const endDay = translate('day-' + end.getDay());
        const endDate = end.getDate();
        const endMonth = translate('month-' + (end.getMonth() + 1));
        const endYear = end.getFullYear();

        if (end.getDay() === start.getDay()) {
            return `${startDay}, ${startDate}. ${startMonth} ${startYear} &ndash; ${startTimeHours}.${startTimeMinutes} ${translate('hour')}`;
        } else {
            return `${startDay}, ${startDate}. ${startMonth} ${startYear} &<br /> ${endDay}, ${endDate}. ${endMonth} ${endYear}`;
        }
    };


    const calendar = new GoogleCalendar();
    await calendar.getDates()
        .then(entries => {
            let output = '';
            entries.forEach(entry => {
                const startDate = entry.start.dateObj;
                const endDate = entry.end.dateObj;

                const dateFormatted = formatDate(startDate, endDate);

                const title = entry.summary;
                let image = '';
                if (title.includes('Spieltreffen')) {
                    image = '/images/calendar-spieltreffen.jpg';
                } else {
                    image = '/images/calendar-filler.jpg';
                }

                let url = '';
                if (title.includes('Spieltage')) {
                    url = 'spieltage.ch';
                } else if (title.includes('Rollenspieltage')) {
                    url = 'rollenspieltage.ch';
                }

                output += `
                     <div class="c-calendar--entry">
                         <div class="c-calendar--entry-photo">
                             <img src="${image}" />
                         </div>
                         <div class="c-calendar--entry-content">
                             <h1 class="c-calendar--entry-title">${title}</h1>
                             <p class="c-calendar--entry-date">${dateFormatted}</p>
                             <a href="https://${url}"><p>${url}</p></a>
                         </div>
                     </div>`;
            });
            document.querySelector('.c-calendar').innerHTML = output;
        });
};

calendarMain();
