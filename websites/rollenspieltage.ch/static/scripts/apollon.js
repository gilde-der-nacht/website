'use strict';

const player = document.querySelector("#participant-role");
const gameMaster = document.querySelector("#gamemaster-role");

const show = (element) => {
    element.classList.removeAttribute("hidden");
};

const hide = (element) => {
    element.classList.setAttribute("hidden", "true");
};

const manageVisibility = () => {
    const playerFieldset = document.querySelector("#player-fieldset");
    const gameMasterFieldset = document.querySelector("#gamemaster-fieldset");
    const noRoleSelectedFieldset = document.querySelector("#no-role-selected-fieldset");

    console.log({player: player.checked, gameMaster: gameMaster.checked});

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

player.addEventListener("change", manageVisibility);
gameMaster.addEventListener("change", manageVisibility);
