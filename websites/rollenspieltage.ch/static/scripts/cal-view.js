'use strict';

const calendarMain = async () => {

    const formatDate = (event) => {
        return `${event.startDay}. August, ${event.startTime} – ${event.endTime} Uhr`;
    };

    const formatTags = (tags) => {
        const starIcon = '★';
        const output = [];
        tags.forEach(tag => {
            output.push(`${tag.tag}: ${starIcon.repeat(tag.stars)}`);
        });
        return output.join('<br />');
    };

    const calendar = new GoogleCalendar();
    await calendar.getDates()
        .then(entries => {
            document.querySelector('.saturday').innerHTML = '';
            document.querySelector('.sunday').innerHTML = '';
            entries.forEach(entry => {
                const output = `
<div class="c-container">
    <div class="c-round-image">
        <img src="${entry.imageUrl}"/>
    </div>
    <div class="c-round">
        <h1>${entry.gameSystem}</h1>
        <p class="c-round-date">${formatDate(entry)}</p>
        <p>${entry.gameMaster}</p>
        <p>${entry.description}</p>
        <p>${formatTags(entry.tags)}</p>
        ${entry.registerLink ? "<a href='" + entry.registerLink + "'><input class='c-btn' value='Anmeldung (Discord)' type='button' /></a>" : ""}
    </div>
</div>`;
                const container = entry.startDay === 29 ? document.querySelector('.saturday') : document.querySelector('.sunday');
                container.innerHTML += output;
            });
        });
};

calendarMain();
