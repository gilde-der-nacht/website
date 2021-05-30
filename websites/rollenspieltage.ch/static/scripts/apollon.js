'use strict';

const player = document.querySelector('#participant-role');
const gameMaster = document.querySelector('#gamemaster-role');

const show = (element) => {
    element.removeAttribute('hidden');
};

const hide = (element) => {
    element.setAttribute('hidden', 'true');
};

const manageVisibility = () => {
    const playerFieldset = document.querySelector('#player-fieldset');
    const gameMasterFieldset = document.querySelector('#gamemaster-fieldset');
    const noRoleSelectedFieldset = document.querySelector('#no-role-selected-fieldset');

    if (player.checked) {
        show(playerFieldset);
    } else {
        hide(playerFieldset);
    }

    if (gameMaster.checked) {
        show(gameMasterFieldset);
    } else {
        hide(gameMasterFieldset);
    }

    if(!player.checked && !gameMaster.checked) {
        show(noRoleSelectedFieldset);
    } else {
        hide(noRoleSelectedFieldset);
    }
};

player.addEventListener('change', manageVisibility);
gameMaster.addEventListener('change', manageVisibility);
manageVisibility();

const companions = document.querySelector('#companions').value;
const updateCompanion = () => {
    const companionCount = companions.value;
    const template = document.querySelector('#companion-name');

    for (let i = 0; i < companionCount; i++) {
        console.log({template});
    }

};
companions.addEventListener('change', updateCompanion);

const error = (type) => {
    console.error({type});
};

const sendRegistration = (e) => {
    e.preventDefault();

    const data = {};

    const name = document.querySelector('#name').value;
    if (name.length > 0) {
        data.name = name;
    } else {
        error('name');
    }

    const email = document.querySelector('#email').value;
    if (email.length > 0) {
        data.email = email;
    } else {
        error('email');
    }

    const roleBalance = document.querySelector('#participant-gamemaster-balance').value;
    data.role = {
        player: player.checked,
        gameMaster: gameMaster.checked,
        balance: roleBalance
    }

    const langDE = document.querySelector('#language-german').value;
    const langEN = document.querySelector('#language-english').value;
    data.language = {
        german: langDE,
        english: langEN
    }

    const listSaturday = document.querySelector('#saturday').querySelectorAll('input');
    const saturday = {};
    for (let entry of listSaturday) {
        saturday[entry.name] = entry.checked;
    }

    const listSunday = document.querySelector('#sunday').querySelectorAll('input');
    const sunday = {};
    for (let entry of listSunday) {
        sunday[entry.name] = entry.checked;
    }

    data.time = {saturday, sunday};

    if (player.checked) {
        const gameroundTypes = document.querySelector('#gameround-types').querySelectorAll('input');
        data.gameroundTypes = [...gameroundTypes].find(e => e.checked).value;

        const listGenres = document.querySelector('#grid-genre').querySelectorAll('input');
        const genres = {};
        [...listGenres].forEach(e => {
            if (e.checked) {
                genres[e.name] = e.value;
            }
        });
        data.genres = genres;

        const listWorkshops = document.querySelector('#grid-workshop').querySelectorAll('input');
        const workshops = {};
        [...listWorkshops].forEach(e => {
            if (e.checked) {
                workshops[e.name] = e.value;
            }
        });
        data.workshops = workshops;

    }

    document.querySelector('#output').innerHTML = JSON.stringify(data, null, 4);
};

const submit = document.querySelector('form');
submit.addEventListener('submit', sendRegistration, false);
