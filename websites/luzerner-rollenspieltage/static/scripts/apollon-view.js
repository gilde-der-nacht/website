'use strict';

function replaceWithFragment(node, fragment) {
    node.innerHTML = ''; // ugly?
    node.appendChild(fragment);
}

async function main() {
    const apollon = new ApollonModel({
        server: 'https://api.gildedernacht.ch'
    });

    const registrations = await apollon.getRegistrations();

    const i18nMap = {};
    document.getElementById('apollon-i18n').content.querySelectorAll('*').forEach(child => {
        i18nMap[child.dataset.id] = child.dataset.text;
    });

    function translate(what) {
        return i18nMap[what];
    }

    function formatTime(time) {
        time = time % 24;
        const hours = Math.floor(time);
        const minutes = (time % 1 === 0) ? '00' : '30';
        return `${hours}.${minutes}`;
    }

    function getSelectedRounds() {
        const roundsNode = document.getElementById('apollon-rounds');
        const containers = [...roundsNode.querySelectorAll('[data-id=container]')];
        return containers.reduce((accumulator, roundNode) => {
            const checkboxNode = roundNode.querySelector('[data-id=checkbox]');
            if (checkboxNode.checked === true) {
                accumulator.push(roundNode.dataset.roundId);
            }
            return accumulator;
        }, []);
    }

    function afterSubmit(rounds) {
        window.scrollTo(0, 0);
        document.getElementById('apollon-submitted-hint').innerText = translate('submitted-thanks');
        const printId = 'apollon-submitted-summary'
        document.getElementById(printId).classList.add('success');
        printTable(printId, rounds);
        showRounds();
        showSummaries();
        clearForm();
    }

    function clearForm() {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('comment').value = '';
    }

    async function submit() {
        const nameNode = document.getElementById('name');
        const emailNode = document.getElementById('email');
        const commentNode = document.getElementById('comment');
        const name = nameNode.value;
        const email = emailNode.value;
        const comment = commentNode.value;
        if ((name === "") || (email === "")) {
            showSummaries();
            document.getElementById('apollon-summary-hint').innerText += '\n' + translate('form-empty'); // TODO: better solution for multiple hints
            return;
        }
        const rounds = getSelectedRounds();
        await apollon.registrationAdd(name, email, comment, rounds);
        afterSubmit(rounds);
    }

    function updateRoundState(roundNode, playersCurrent, playersMax, checkboxNode) {
        if (playersCurrent >= playersMax) {
            roundNode.classList.add('round-full');
            roundNode.querySelector('[data-id=btn-choose]').value = translate('full');
        } else if (checkboxNode.checked === true) {
            roundNode.classList.add('round-active');
            roundNode.querySelector('[data-id=btn-choose]').value = translate('choosen');
        } else {
            roundNode.classList.remove('round-active');
            roundNode.querySelector('[data-id=btn-choose]').value = translate('choose');
        }
    }

    function showSummaries(event) {
        const roundsNode = document.getElementById('apollon-rounds');
        const selectedRoundIds = getSelectedRounds();
        const overlappingRoundIds = apollon.roundsDayTimeOverlapping(selectedRoundIds);
        let overlapping = overlappingRoundIds.length > 0;
        apollon.roundsDetailed(registrations).forEach(entry => {
            const roundNode = roundsNode.querySelector('[data-round-id="' + entry.roundId + '"]');
            const checkboxNode = roundNode.querySelector('[data-id=checkbox]');
            const hintNode = roundNode.querySelector('[data-id=hint]');
            hintNode.innerText = overlappingRoundIds.includes(entry.roundId) ? translate('overlapping') : '';
            updateRoundState(roundNode, entry.playersCurrent, entry.game.playersMax, checkboxNode);
        });
        document.getElementById('apollon-summary-hint').innerText = overlapping ? translate('overlapping') : '';
        printTable('apollon-summary', selectedRoundIds);
    }

    function printTable(locationId, rounds) {
        const summaryTableTemplateNode = document.getElementById('apollon-summary-table');
        const summaryRowTemplateNode = document.getElementById('apollon-summary-row');
        const rowFragment = document.createDocumentFragment();

        rounds.forEach(key => {
            const round = apollon.getRounds()[key];
            const entry = apollon.getGames()[round.gameId];

            const templateNode = summaryRowTemplateNode.content.cloneNode(true);
            templateNode.querySelector('[data-id=name]').innerText = entry.name;
            templateNode.querySelector('[data-id=day]').innerText = translate(round.day);
            templateNode.querySelector('[data-id=from]').innerText = formatTime(round.from);
            templateNode.querySelector('[data-id=to]').innerText = formatTime(round.to);
            rowFragment.appendChild(templateNode);
        });

        if (rounds.length > 0) {
            const templateNode = summaryTableTemplateNode.content.cloneNode(true);
            replaceWithFragment(document.getElementById(locationId), templateNode);
            replaceWithFragment(document.querySelector('#' + locationId + ' tbody'), rowFragment);
        } else {
            document.getElementById(locationId).innerText = '';
        }
    }

    /*
    For every round, copy a "<template>", populate it with interesting information,
    then put all elements into the browser.
    */
    function showRounds() {
        const roundTemplateNode = document.getElementById('apollon-round-template');
        const fragment = {
            'friday': document.createDocumentFragment(),
            'saturday': document.createDocumentFragment(),
        };
        apollon.roundsDetailed(registrations).forEach(entry => {
            const templateNode = roundTemplateNode.content.cloneNode(true);
            templateNode.querySelector('[data-id=container]').dataset.roundId = entry.roundId;
            templateNode.querySelector('[data-id=name]').innerText = entry.game.name;
            templateNode.querySelector('[data-id=gm]').innerText = entry.game.gm;
            templateNode.querySelector('[data-id=game-description]').innerText = entry.game.gameDescription;
            templateNode.querySelector('[data-id=campaign-description]').innerText = entry.game.campaignDescription;
            templateNode.querySelector('[data-id=lang]').innerText = entry.game.lang;
            templateNode.querySelector('[data-id=lang-img]').src = translate('flag-url-' + entry.game.lang);
            templateNode.querySelector('[data-id=day]').innerText = translate(entry.round.day);
            templateNode.querySelector('[data-id=from]').innerText = formatTime(entry.round.from);
            templateNode.querySelector('[data-id=to]').innerText = formatTime(entry.round.to);
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