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

const error = (type) => {
    console.error({type});
};

const sendRegistration = (e) => {
    console.log('submit');

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

    document.querySelector('#output').innerHTML = JSON.stringify(data, null, 4);
};

const submit = document.querySelector('form');
submit.addEventListener('submit', sendRegistration, false);
