---
title: "Anmelden"
date: 2019-06-21
toc: true
---

<p id="apollon-submitted-hint"></p>
<p id="apollon-submitted-summary"></p>

Suche dir die Spielrunden aus, bei denen du gerne teilnehmen möchtest und schicke ganz unten das Formular ab:

<template id="apollon-i18n">
    <p data-id="friday" data-text="Freitag">-</p>
    <p data-id="saturday" data-text="Samstag">-</p>
    <p data-id="choose" data-text="Auswählen">-</p>
    <p data-id="choosen" data-text="Ausgewählt">-</p>
    <p data-id="full" data-text="Ausgebucht">-</p>
    <!-- e.g. countryflags.com -->
    <p data-id="flag-url-DE" data-text="/graphics/germany-flag-small.png">-</p>
    <p data-id="flag-url-EN" data-text="/graphics/united-kingdom-flag-small.png">-</p>
    <p data-id="overlapping" data-text="Achtung: Mindestens zwei Spielrunden überlappen zeitlich!">-</p>
    <p data-id="submitted-thanks" data-text="Danke für das Anmelden für folgende Runden:">-</p>
    <p data-id="form-empty" data-text="Bitte Name und E-Mail-Adresse ausfüllen.">-</p>
</template>

<template id="apollon-round-template">
    <label data-id="container">
        <div class="round">
            <h1><span data-id="name"></span></h1>
            <p>Spielleiter: <span data-id="gm"></span></p>
            <p>Spielbeschreibung: <span data-id="game-description"></span></p>
            <p>Kampagnenbeschreibung: <span data-id="campaign-description"></span></p>
            <p>Sprache: <span data-id="lang"></span> <img height="10" data-id="lang-img"></p>
            <p>Tag und Zeit: <span data-id="day"></span>, <span data-id="from"></span> &mdash; <span data-id="to"></span> <span>Uhr</span></p>
            <p>Spieler Aktuell: <strong><span data-id="players-current"></span></strong> / Max: <span data-id="players-max"></span></p>
            <input data-id="checkbox" type="checkbox">
            <p><input data-id="btn-choose" class="c-btn" type="button"></p>
            <p class="hint"><span data-id="hint"></span></p>
        </div>
    </label>
</template>

<template id="apollon-summary-table">
    <table id="apollon-table-template">
        <thead>
        <tr>
            <th>Name</th>
            <th>Tag</th>
            <th>von</th>
            <th>bis</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</template>

<template id="apollon-summary-row">
    <tr>
        <td><span data-id="name"></span></td>
        <td><span data-id="day"></span></td>
        <td class="u-no-break"><span data-id="from"></span> Uhr</td>
        <td class="u-no-break"><span data-id="to"></span> Uhr</td>
    </tr>
</template>

<div id="apollon-rounds">
    <h1>Freitag, 30. August 2019</h1>
    <div id="apollon-rounds-friday" class="u-bleed-out c-rounds"></div>
    <h1>Samstag, 31. August 2019</h1>
    <div id="apollon-rounds-saturday" class="u-bleed-out c-rounds"></div>
</div>

# Anmeldung abschliessen

<div class="c-form">
    <div>
        <p class="c-form--item c-form-field--text">
            <label for="name">Name *</label>
            <input name="name" id="name" type="text" placeholder="Name" required>
        </p>
        <p class="c-form--item c-form-field--text">
            <label for="email">E-Mail *</label>
            <input name="email" id="email" type="email" placeholder="E-Mail" required>
        </p>
        <p class="c-form--item c-form-field--text">
            <label for="comment">Kommentar</label>
            <textarea comment="message" id="comment" placeholder="Kommentar"></textarea>
        </p>
        <h2>Zusammenfassung</h2>
        <p id="apollon-summary-hint" class="hint"></p>
        <div id="apollon-summary"></div>
        <input class="c-btn" type="submit" id="submit" value="Absenden">
        <input type="hidden" name="_next" value="http://localhost:1313/program_test/">
        <input type="hidden" name="_captcha" value="false">
    </div>

</div>

<!--
<script src="http://127.0.0.1:5000/olymp.js"></script>
-->
<script src="https://api.gildedernacht.ch/olymp.js"></script>
<script src="/scripts/apollon-model.js"></script>
<script src="/scripts/apollon-view.js"></script>
