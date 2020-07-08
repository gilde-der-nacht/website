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
            entries.forEach(entry => {
                const output = `
<div class="c-container">
    <div class="round-image">
        <img src="${entry.imageUrl}"/>
    </div>
    <div class="round">
        <h1>${entry.gameSystem}</h1>
        <p>${formatDate(entry)}</p>
        <p>${entry.gameMaster}</p>
        <p>${entry.description}</p>
        <p>${formatTags(entry.tags)}</p>
    </div>
</div>`;
                const container = entry.startDay === 29 ? document.querySelector('.saturday') : document.querySelector('.sunday');
                container.innerHTML += output;
            });
        });
};

calendarMain();
