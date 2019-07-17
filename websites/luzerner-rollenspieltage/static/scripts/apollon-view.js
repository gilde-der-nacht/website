'use strict';

async function main() {
    const registrations = await getRegistrations();

    const i18nMap = {};
    document.getElementById('i18n').content.querySelectorAll('*').forEach(child => {
        i18nMap[child.dataset.id] = child.dataset.text;
    });

    function translate(what) {
        return i18nMap[what];
    }

    async function submit() {
        const nameNode = document.getElementById('name');
        const emailNode = document.getElementById('email');
        const commentNode = document.getElementById('comment');
        const name = nameNode.value;
        const email = emailNode.value;
        const comment = commentNode.value;
        await submitRegistration(name, email, comment);
    }

    function updateRoundState(roundNode, playersCurrent, playersMax, checkboxNode) {
        if (playersCurrent === playersMax) {
            roundNode.classList.add('round-full');
            roundNode.querySelector('[data-id=btn-choose]').value = 'Ausgebucht';
        } else if (checkboxNode.checked === true) {
            roundNode.classList.add('round-active');
            roundNode.querySelector('[data-id=btn-choose]').value = 'Ausgewählt';
        } else {
            roundNode.classList.remove('round-active');
            roundNode.querySelector('[data-id=btn-choose]').value = 'auswählen';
        }
    }

    function showSummaries(event) {
        const summaryTemplateNode = document.getElementById('summary-template');
        const summariesNode = document.getElementById('summaries');
        const roundsNode = document.getElementById('c-rounds');
        const fragment = document.createDocumentFragment();
        forEachRound(registrations, (roundId, round, game, playersMax, playersCurrent) => {
            const roundNode = roundsNode.querySelector('[data-round-id="' + roundId + '"]');
            const checkboxNode = roundNode.querySelector('[data-id=checkbox]');
            const hintNode = roundNode.querySelector('[data-id=hint]');
            hintNode.innerText = checkboxNode.checked ? 'SELECTED' : 'NOT SELECTED?'; // TODO do something useful here or remove it
            if(checkboxNode.checked === true) {
                const templateNode = summaryTemplateNode.content.cloneNode(true);
                templateNode.querySelector('[data-id=name]').innerText = game.name;
                templateNode.querySelector('[data-id=day]').innerText = translate(round.day);
                templateNode.querySelector('[data-id=from]').innerText = round.from;
                templateNode.querySelector('[data-id=to]').innerText = round.to;
                fragment.appendChild(templateNode);
            }

            updateRoundState(roundNode, playersCurrent, playersMax, checkboxNode)
        });

        replaceWithFragment(summariesNode, fragment);
    }

    function showRounds() {
        const roundTemplateNode = document.getElementById('round-template');
        const roundsNode = document.getElementById('c-rounds');
        const fragment = document.createDocumentFragment();

        forEachRound(registrations, (roundId, round, game, playersMax, playersCurrent) => {
            const templateNode = roundTemplateNode.content.cloneNode(true);
            const checkboxNode = templateNode.querySelector('[data-id=checkbox]');
            templateNode.querySelector('[data-id=container]').dataset.roundId = roundId;
            templateNode.querySelector('[data-id=name]').innerText = game.name;
            templateNode.querySelector('[data-id=gm]').innerText = game.gm;
            templateNode.querySelector('[data-id=game-description]').innerText = game.gameDescription;
            templateNode.querySelector('[data-id=campaign-description]').innerText = game.campaignDescription;
            templateNode.querySelector('[data-id=lang]').innerText = game.lang;
            templateNode.querySelector('[data-id=lang-img]').src = translate('flag-url-' + game.lang);
            templateNode.querySelector('[data-id=day]').innerText = translate(round.day);
            templateNode.querySelector('[data-id=from]').innerText = round.from;
            templateNode.querySelector('[data-id=to]').innerText = round.to;
            templateNode.querySelector('[data-id=players-current]').innerText = playersCurrent;
            templateNode.querySelector('[data-id=players-max]').innerText = game.playersMax;
            checkboxNode.addEventListener('change', showSummaries);
            fragment.appendChild(templateNode);
        });

        replaceWithFragment(roundsNode, fragment);
    }

    document.getElementById('submit').addEventListener('click', submit);

    showRounds();
    showSummaries();
}

window.addEventListener('load', main);
