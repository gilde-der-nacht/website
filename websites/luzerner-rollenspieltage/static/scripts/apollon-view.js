'use strict';

function replaceWithFragment(node, fragment) {
    node.innerHTML = ''; // ugly?
    node.appendChild(fragment);
}

// TODO prefix important ids with apollon-
async function main() {
    const registrations = await getRegistrations();

    const i18nMap = {};
    document.getElementById('apollon-i18n').content.querySelectorAll('*').forEach(child => {
        i18nMap[child.dataset.id] = child.dataset.text;
    });

    function translate(what) {
        return i18nMap[what];
    }
    
    function getSelectedRounds() {
        const roundsNode = document.getElementById('apollon-rounds');
        const containers = [...roundsNode.querySelectorAll('[data-id=container]')];
        return containers.reduce((accumulator, roundNode) => {
            const checkboxNode = roundNode.querySelector('[data-id=checkbox]');
            if(checkboxNode.checked === true) {
                accumulator.push(roundNode.dataset.roundId);
            }
            return accumulator;
        }, []);
    }

    async function submit() {
        const nameNode = document.getElementById('name');
        const emailNode = document.getElementById('email');
        const commentNode = document.getElementById('comment');
        const name = nameNode.value;
        const email = emailNode.value;
        const comment = commentNode.value;
        const rounds = selectedRounds();
        await registrationAdd(name, email, comment, rounds);
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
        const summaryTemplateNode = document.getElementById('apollon-summary-template');
        const roundsNode = document.getElementById('apollon-rounds');
        const fragment = document.createDocumentFragment();
        const selectedRoundIds = getSelectedRounds();
        const overlappingRoundIds = roundsDayTimeOverlapping(selectedRoundIds);
        let overlapping = overlappingRoundIds.length > 0;
        roundsDetailed(registrations).forEach(entry => {
            const roundNode = roundsNode.querySelector('[data-round-id="' + entry.roundId + '"]');
            const checkboxNode = roundNode.querySelector('[data-id=checkbox]');
            const hintNode = roundNode.querySelector('[data-id=hint]');
            hintNode.innerText = overlappingRoundIds.includes(entry.roundId) ? translate('overlapping') : '';
            if(checkboxNode.checked === true) {
                const templateNode = summaryTemplateNode.content.cloneNode(true);
                templateNode.querySelector('[data-id=name]').innerText = entry.game.name;
                templateNode.querySelector('[data-id=day]').innerText = translate(entry.round.day);
                templateNode.querySelector('[data-id=from]').innerText = entry.round.from;
                templateNode.querySelector('[data-id=to]').innerText = entry.round.to;
                fragment.appendChild(templateNode);
            }
            updateRoundState(roundNode, entry.playersCurrent, entry.game.playersMax, checkboxNode)
        });
        document.getElementById('apollon-summary-hint').innerText = overlapping ? translate('overlapping') : '';
        replaceWithFragment(document.getElementById('apollon-summary'), fragment);
    }

    /*
    For every round, copy an "<template>", populate it with interesting information,
    then put all elements into the browser.
    */
    function showRounds() {
        const roundTemplateNode = document.getElementById('apollon-round-template');
        const fragment = {
            'friday': document.createDocumentFragment(),
            'saturday': document.createDocumentFragment(),
        };
        roundsDetailed(registrations).forEach(entry => {
            const templateNode = roundTemplateNode.content.cloneNode(true);
            templateNode.querySelector('[data-id=container]').dataset.roundId = entry.roundId;
            templateNode.querySelector('[data-id=name]').innerText = entry.game.name;
            templateNode.querySelector('[data-id=gm]').innerText = entry.game.gm;
            templateNode.querySelector('[data-id=game-description]').innerText = entry.game.gameDescription;
            templateNode.querySelector('[data-id=campaign-description]').innerText = entry.game.campaignDescription;
            templateNode.querySelector('[data-id=lang]').innerText = entry.game.lang;
            templateNode.querySelector('[data-id=lang-img]').src = translate('flag-url-' + entry.game.lang);
            templateNode.querySelector('[data-id=day]').innerText = translate(entry.round.day);
            templateNode.querySelector('[data-id=from]').innerText = entry.round.from;
            templateNode.querySelector('[data-id=to]').innerText = entry.round.to;
            templateNode.querySelector('[data-id=players-current]').innerText = entry.playersCurrent;
            templateNode.querySelector('[data-id=players-max]').innerText = entry.game.playersMax;
            templateNode.querySelector('[data-id=checkbox]').addEventListener('change', showSummaries);
            fragment[entry.round.day].appendChild(templateNode);
        });
        Object.keys(fragment).forEach(day => {
            replaceWithFragment(document.getElementById('apollon-rounds-' + day), fragment[day]);
        });
    }

    document.getElementById('submit').addEventListener('click', submit);

    showRounds();
    showSummaries();
}

window.addEventListener('load', main);
