---
title: "Register"
date: 2019-06-21
toc: true
---

<p id="apollon-submitted-hint"></p>
<p id="apollon-submitted-summary"></p>

Select the rounds you would like to participate in and submit the form below:

<template id="apollon-i18n">
    <p data-id="friday" data-text="Friday">-</p>
    <p data-id="saturday" data-text="Saturday">-</p>
    <p data-id="choose" data-text="Choose">-</p>
    <p data-id="choosen" data-text="Selected">-</p>
    <p data-id="full" data-text="Round Full">-</p>
    <!-- e.g. countryflags.com -->
    <p data-id="flag-url-DE" data-text="/graphics/germany-flag-small.png">-</p>
    <p data-id="flag-url-EN" data-text="/graphics/united-kingdom-flag-small.png">-</p>
    <p data-id="overlapping" data-text="Attention: At least two game rounds overlap in time!">-</p>
    <p data-id="submitted-thanks" data-text="Thank you for signing up for the following rounds:">-</p>
    <p data-id="form-empty" data-text="Please fill out your name and email address.">-</p>
</template>

<template id="apollon-round-template">
    <label data-id="container">
        <div class="round">
            <h1><span data-id="name"></span></h1>
            <p>Game Master: <span data-id="gm"></span></p>
            <p>Game System Description: <span data-id="game-description"></span></p>
            <p>Story: <span data-id="campaign-description"></span></p>
            <p>Language: <span data-id="lang"></span> <img height="10" data-id="lang-img"></p>
            <p>Day and Time: <span data-id="day"></span>, <span data-id="from"></span> &mdash; <span data-id="to"></span></p>
            <p>Players currently: <strong><span data-id="players-current"></span></strong> / Max: <span data-id="players-max"></span></p>
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
            <th>Day</th>
            <th>from</th>
            <th>to</th>
        </tr>
        </thead>
        <tbody id="apollon-summary-entries">
        </tbody>
    </table>
</template>

<template id="apollon-summary-row">
    <tr>
        <td><span data-id="name"></span></td>
        <td><span data-id="day"></span></td>
        <td><span data-id="from"></span></td>
        <td><span data-id="to"></span></td>
    </tr>
</template>

<div id="apollon-rounds">
    <h1>Friday, 30. August 2019</h1>
    <div id="apollon-rounds-friday" class="u-bleed-out c-rounds">
        <em>Rounds are being loaded. Thank you for your patience.</em>
    </div>
    <h1>Saturday, 31. August 2019</h1>
    <div id="apollon-rounds-saturday" class="u-bleed-out c-rounds">
        <em>Rounds are being loaded. Thank you for your patience.</em>
    </div>
</div>

# Submit registration

<div class="c-form">
    <div>
        <p class="c-form--item c-form-field--text">
            <label for="name">Name *</label>
            <input name="name" id="name" type="text" placeholder="Name">
        </p>
        <p class="c-form--item c-form-field--text">
            <label for="email">E-mail *</label>
            <input name="email" id="email" type="email" placeholder="E-mail">
        </p>
        <p class="c-form--item c-form-field--text">
            <label for="comment">Message</label>
            <textarea comment="message" id="comment" placeholder="Message"></textarea>
        </p>
        <h2>Summary</h2>
        <p id="apollon-summary-hint" class="hint"></p>
        <div id="apollon-summary"></div>
        <input class="c-btn" type="submit" id="submit" value="Submit">
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