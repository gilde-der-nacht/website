'use strict';

const calendarMain = async () => {

    const i18nMap = {};
    document.getElementById('calendar-i18n').content.querySelectorAll('*').forEach(child => {
        i18nMap[child.dataset.id] = child.dataset.text;
    });

    const translate = (what) => {
        return i18nMap[what];
    };

    const formatDate = (event) => {
        return `${event.startDay}. August, ${event.startTime} – ${event.endTime} Uhr`;
    };

    const calendar = new GoogleCalendar();
    await calendar.getDates()
        .then(entries => {
            let output = '';
            entries.forEach(entry => {
                console.log(entry);
                const dateFormatted = formatDate(entry);

                output += `
<div data-id="container">
    <div class="round-image">
        <img src="${entry.imageUrl}"/>
    </div>
    <div class="round">
        <h1>${entry.gameSystem}</h1>
        <p>${dateFormatted}</p>
        <p>${entry.gameMaster}</p>
        <p>${entry.description}</p>
        <p>${entry.tags.join('<br />')}</p>
    </div>
</div>`;
            });
            document.querySelector('.c-calendar').innerHTML = output;
        });
};

calendarMain();
