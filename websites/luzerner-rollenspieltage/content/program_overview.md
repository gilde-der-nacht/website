---
title: "Program Overview"
date: 2019-08-22
toc: true
---

_Hint: This page is only for the organization and show an overview for all GMs and and overview for all rounds._

<div><input id="apollon-hide-button" class="c-btn" type="submit" value="Toggle Form Visibility"></div>
<div class="c-form" id="apollon-login-form">
<form action="#">
<div>
    <p class="c-form--item c-form-field--text">
        <label for="login">Login *</label>
        <input name="login" id="login" type="text" placeholder="Login" required />
    </p>
    <p class="c-form--item c-form-field--text">
        <label for="password">Password *</label>
        <input name="password" id="password" type="password" placeholder="Password" required />
    </p>
    <input id="apollon-login-button" class="c-btn" type="submit" value="Login">
</div>
</form>
</div>

# Rounds

<div id="apollon-rounds-overview"></div>

# GMs

<div id="apollon-gms-overview"></div>

# Players

<div id="apollon-players-overview"></div>





<script src="https://api.gildedernacht.ch/olymp.js"></script>

<script src="/scripts/apollon-model.js"></script>
<script>
    'use strict';

    async function main(event) {
        event.preventDefault();
        const loginForm = document.getElementById('apollon-login-form');
        const username = loginForm.querySelector('#login');
        const password = loginForm.querySelector('#password');

        const apollon = new ApollonModel({
            server: 'https://api.gildedernacht.ch',
            username: username.value,
            password: password.value
        });

        username.value = "";
        password.value = "";


        const games = apollon.getGames();
        console.log('games', games);
        const rounds = apollon.getRounds();
        console.log('rounds', rounds);
        const registrations = await apollon.getRegistrations();

        /*
        TODO

        showRoundsOverview & showGmsOverview are written a bit ugly and just create a HTML.
        For a proof of concepts this is enough. If this functionality is further used, some kind
        of a template should be used.
        */

        function showRoundsOverview() {
            const roundsOverviewNode = document.getElementById('apollon-rounds-overview');
            const fragment = document.createDocumentFragment();

            let html = '';
            Object.keys(rounds).forEach(roundId => {
                const round = rounds[roundId];
                const game = games[round.gameId];
                html += '<h2>' + game.name + ' - ' + game.gm + '</h2>';
                html += '<h6>' + round.day + ', from ' + round.from + ' to ' + round.to + ' / Max players: ' + game.playersMax + '</h6>';
                registrations.forEach(registration => {
                    registration.publicBody.rounds.forEach(registrationRoundId => {
                        if (registrationRoundId === roundId) {
                            const name =
                                `${registration.privateBody.name} - ${registration.privateBody.email}`;
                            html += '<div>' + name + '</div>';
                        }
                    });
                });
            });
            roundsOverviewNode.innerHTML = html;
        }

        function showGmsOverview() {
            const gmsOverviewNode = document.getElementById('apollon-gms-overview');
            const fragment = document.createDocumentFragment();

            const gms = {};
            Object.keys(rounds).forEach(roundId => {
                const round = rounds[roundId];
                const game = games[round.gameId];
                if (!(game.gm in gms)) {
                    gms[game.gm] = [];
                }
                gms[game.gm].push(round);
            });

            let html = '';
            Object.keys(gms).forEach(gm => {
                html += '<h2>' + gm + '</h2>';
                gms[gm].forEach(round => {
                    html += '<p>' + games[round.gameId].name + ' ' + round.day + ' ' + round
                        .from + '-' + round.to + '</p>';
                });
            });
            gmsOverviewNode.innerHTML = html;
        }

        function showPlayersOverview() {
            const playersOverviewNode = document.getElementById('apollon-players-overview');
            const fragment = document.createDocumentFragment();
            playersOverviewNode.innerHtml = "text";
        }

        showRoundsOverview();
        showGmsOverview();
        showPlayersOverview();
    }

    function hideForm(event) {
        event.preventDefault();
        const loginForm = document.getElementById('apollon-login-form');

        if (loginForm.style.display == 'none') {
            loginForm.style.display = 'initial';
        } else {
            loginForm.style.display = 'none';
        }
    }

    document.getElementById('apollon-login-button').addEventListener('click', main);
    document.getElementById('apollon-hide-button').addEventListener('click', hideForm);
</script>