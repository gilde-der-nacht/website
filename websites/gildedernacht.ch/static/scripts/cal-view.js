'use strict';

const calendar = Calendar.getDates();

calendar.forEach(event => {
    let outputHTML = document.querySelector('.c-calendar');
    outputHTML.innerHTML += `
    <div class="c-calendar--entry">
        <div class="c-calendar--entry-photo">
            <img src="${event.image}" />
        </div>
        <div class="c-calendar--entry-content">
            <h1 class="c-calendar--entry-title">${event.title}</h1>
            <p class="c-calendar--entry-date">${event.date}</p>
            <p class="c-calendar--entry-description">${event.description}</p>
        </div>
    </div>`;
});
