'use strict';

const calendarMain = async () => {

    const i18nMap = {};
    document.getElementById('calendar-i18n').content.querySelectorAll('*').forEach(child => {
        i18nMap[child.dataset.id] = child.dataset.text;
    });

    const translate = (what) => {
        return i18nMap[what];
    };

    const formatDate = (start, _end) => {
        const startDay = translate('day-' + start.getDay());
        const startDate = start.getDate();
        const startMonth = translate('month-' + (start.getMonth() + 1));
        const startYear = start.getFullYear();
        const startTimeHours = start.getHours();
        const startTimeMinutes = start.getMinutes() === 0 ? '00' : start.getMinutes();

        return `${startDay}, ${startDate}. ${startMonth} ${startYear} &ndash; ${startTimeHours}.${startTimeMinutes} ${translate('hour')}`;
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
                if (title === 'Spieltreffen') {
                    image = 'https://scontent.fzrh3-1.fna.fbcdn.net/v/t1.0-9/s960x960/69694518_1216457091891380_8506334758685376512_o.jpg?_nc_cat=105&_nc_ohc=pud3E5jHmvMAQkneL2We_HdGFVn1JMjtxHPuUmpgqJzocUuB_sqM-eTFA&_nc_ht=scontent.fzrh3-1.fna&oh=10828d4cb8514aeaf0acaef5e7205580&oe=5E4E6370';
                } else {
                    image = '/images/calendar-filler.jpg';
                }

                output += `
                     <div class="c-calendar--entry">
                         <div class="c-calendar--entry-photo">
                             <img src="${image}" />
                         </div>
                         <div class="c-calendar--entry-content">
                             <h1 class="c-calendar--entry-title">${title}</h1>
                             <p class="c-calendar--entry-date">${dateFormatted}</p>
                         </div>
                     </div>`;
            });
            document.querySelector('.c-calendar').innerHTML = output;
        });
};

calendarMain();
