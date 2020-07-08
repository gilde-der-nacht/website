'use strict';

const calendarMain = async () => {

    const formatDate = (event) => {
        return `${event.startDay}. August, ${event.startTime} – ${event.endTime} Uhr`;
    };

    const calendar = new GoogleCalendar();
    await calendar.getDates()
        .then(entries => {
            entries.forEach(entry => {                
                const output = `
<div data-id="container">
    <div class="round-image">
        <img src="${entry.imageUrl}"/>
    </div>
    <div class="round">
        <h1>${entry.gameSystem}</h1>
        <p>${formatDate(entry)}</p>
        <p>${entry.gameMaster}</p>
        <p>${entry.description}</p>
        <p>${entry.tags.join('<br />')}</p>
    </div>
</div>`;
                const container = entry.startDay === 29 ? document.querySelector('.saturday') : document.querySelector('.sunday');
                container.innerHTML += output;
            });
        });
};

calendarMain();
