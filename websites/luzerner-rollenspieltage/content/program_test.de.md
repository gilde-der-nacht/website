---
title: "Anmelden"
date: 2019-06-21
toc: true
---

Suche dir die Spielrunden aus, bei denen du gerne teilnehmen möchtest und schicke ganz unten das Formular ab:

<template id="i18n">
    <p data-id="friday" data-text="Freitag">-</p>
    <p data-id="saturday" data-text="Samstag">-</p>
    <!-- e.g. countryflags.com -->
    <p data-id="flag-url-DE" data-text="/graphics/germany-flag-small.png">-</p>
    <p data-id="flag-url-EN" data-text="/graphics/united-kingdom-flag-small.png">-</p>
</template>

<template id="round-template">
    <label data-id="container">
        <div class="round">
            <h1><span data-id="name"></span></h1>
            <p>Spielleiter: <span data-id="gm"></span></p>
            <p>Spielbeschreibung: <span data-id="game-description"></span></p>
            <p>Kampagnenbeschreibung: <span data-id="campaign-description"></span></p>
            <p>Sprache: <span data-id="lang"></span> <img height="10" data-id="lang-img"></p>
            <p>Tag/Zeit: <span data-id="day"></span> / <span data-id="from"></span> - <span data-id="to"></span></p>
            <p>Spieler Aktuell: <strong><span data-id="players-current"></span></strong> / Max: <span data-id="players-max"></span></p>
            <input data-id="checkbox" type="checkbox">
            <p><input data-id="btn-choose" class="c-btn" type="button"></p>
            <p class="hint"><span data-id="hint"></span></p>
        </div>
    </label>
</template>

<template id="summary-template">
    <p data-id="container">Name: <span data-id="name"></span> / Tag <span data-id="day"></span> / Von <span data-id="from"></span> / Bis <span data-id="to"></span></p>
</template>

# Freitag, 30. August 2019

<div id="c-rounds" class="u-bleed-out"></div>

# Samstag, 31. August 2019

<pre>TODO: Tage aufteilen</pre>

# Anmeldung abschliessen

<div class="c-form">
<form action="https://formsubmit.co/mail@rollenspieltag.ch" method="POST">
    <div>
        <p class="c-form--item c-form-field--text">
            <label for="name">Name *</label>
            <input name="name" id="name" type="text" placeholder="Name">
        </p>
        <p class="c-form--item c-form-field--text">
            <label for="email">E-Mail *</label>
            <input name="email" id="email" type="email" placeholder="E-Mail">
        </p>
        <p class="c-form--item c-form-field--text">
            <label for="comment">Kommentar</label>
            <textarea comment="message" id="comment" placeholder="Kommentar"></textarea>
        </p>

<h2>Zusammenfassung</h2>

<div id="summaries"></div>
        <input class="c-btn" type="submit" id="submit" value="Absenden">
        <input type="hidden" name="_next" value="http://localhost:1313/program_test/">
        <input type="hidden" name="_captcha" value="false">
    </div>
</form>
</div>



<script src="/scripts/rollenspieltage.js"></script>
<script>
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

</script>