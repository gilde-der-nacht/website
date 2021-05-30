'use strict';

const show = (element) => {
    element.classList.remove("hidden");
};

const hide = (element) => {
    element.classList.add("hidden");
};

const manageVisibility = () => {
    const player = document.querySelector("#participant-role");
    const gameMaster = document.querySelector("#gamemaster-role");

    const playerFieldset = document.querySelector("#player-fieldset");
    const gameMasterFieldset = document.querySelector("#gamemaster-fieldset");
    const noRoleSelectedFieldset = document.querySelector("#no-role-selected-fieldset");

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
    }
};
