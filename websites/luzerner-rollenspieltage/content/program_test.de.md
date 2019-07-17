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



<script src="/scripts/apollon-model.js"></script>
<script src="/scripts/apollon-view.js"></script>

</script>
