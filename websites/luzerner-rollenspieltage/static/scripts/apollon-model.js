'use strict';

const olymp = new OlympMock({});

function getGames() {
    return {
        'Adrian-0': {
            name: 'Shadowrun',
            gm: 'Adrian',
            gameDescription: 'Dystopisch BlaBla ...',
            campaignDescription: 'BlaBla ...',
            lang: 'DE',
            playersMax: 5,
        },
        'Manuela-0': {
            name: 'Finsterwald',
            gm: 'Manuela',
            gameDescription: 'Steampunk Blabla ...',
            campaignDescription: 'BlaBla ...',
            lang: 'DE',
            playersMax: 4,
        },
        'EnglishMan-0': {
            name: 'D&D',
            gm: 'EnglishMan',
            gameDescription: 'D & D Blabla ...',
            campaignDescription: 'Hack & Slash BlaBla ...',
            lang: 'EN',
            playersMax: 2,
        },
    };
}

function getRounds() {
    return {
        'Adrian-0': { gameId: 'Adrian-0', day: 'friday', from: 13, to: 15 },
        'Adrian-1': { gameId: 'Adrian-0', day: 'saturday', from: 15, to: 17 },
        //'Adrian-2': { gameId: 'Adrian-0', day: 'saturday', from: 13, to: 15 },

        'Manuela-0': { gameId: 'Manuela-0', day: 'friday', from: 13, to: 15 },
        //'Manuela-1': { gameId: 'Manuela-0', day: 'friday', from: 15, to: 17 },
        'Manuela-2': { gameId: 'Manuela-0', day: 'saturday', from: 13, to: 15 },

        'EnglishMan-0': { gameId: 'EnglishMan-0', day: 'friday', from: 13, to: 15 },
        //'EnglishMan-1': { gameId: 'EnglishMan-0', day: 'friday', from: 15, to: 17 },
        'EnglishMan-2': { gameId: 'EnglishMan-0', day: 'saturday', from: 13, to: 15 },
    };
}

async function getRegistrations() {
    const APOLLON_UID = '095da522f49aebbd35443fd2349d578a1aaf4a9ea05ae7d59383a5f416d4fd3b';
    console.assert(await olymp.status(), 'Olymp API Version Mismatch');
    if(true) {
        olymp.resourceAdd(APOLLON_UID);
        await olymp.entriesAdd(APOLLON_UID, 'a@unknown.tld', {rounds: ['Adrian-0', 'Adrian-1']}, {name: 'a', email: 'a@unknown.tld'});
        await olymp.entriesAdd(APOLLON_UID, 'b@unknown.tld', {rounds: ['Adrian-0']}, {name: 'b', email: 'b@unknown.tld'});
        await olymp.entriesAdd(APOLLON_UID, 'c@unknown.tld', {rounds: ['Adrian-0']}, {name: 'c', email: 'c@unknown.tld'});
        await olymp.entriesAdd(APOLLON_UID, 'd@unknown.tld', {rounds: ['Adrian-0']}, {name: 'd', email: 'd@unknown.tld'});
        //await olymp.entriesAdd(APOLLON_UID, 'e@unknown.tld', publicBody: {rounds: ['Adrian-1'], privateBody: {name: 'e', email: 'e@unknown.tld'});
    }
    const registrations = await olymp.entriesList(APOLLON_UID);
    return registrations;
}

async function registrationAdd(name, email, comment, rounds) {
    const identification = email;
    const publicBody = {
        rounds: rounds,
    };
    const privateBody = {
        name: name,
        email: email,
        comment: comment,
    };
    // TODO submit
    console.log('registrationAdd\n' + identification + '\n' + JSON.stringify(publicBody) + '\n' + JSON.stringify(privateBody));
}

function roundsDetailed(registrations) {
    const rounds = getRounds();
    const games = getGames();
    const unsorted = Object.keys(rounds).map(roundId => {
        const round = rounds[roundId];
        const game = games[round.gameId];
        const playersCurrent = registrations.reduce((accumulator, registration) => {
            return accumulator + registration.publicBody.rounds.reduce((accumulator, registrationRoundId) => {
                return accumulator + (registrationRoundId === roundId ? 1 : 0);
            }, 0);
        }, 0);
        return {roundId: roundId, round: round, game: game, playersCurrent: playersCurrent};
    });
    return sortBy(unsorted, i => i.round.day, i => i.round.from, i => i.game.name);
}

function roundsDayTimeOverlapping(roundIdOthers) {
    const rounds = getRounds();
    return roundIdOthers.reduce((accumulator, roundIdA) => {
        const roundA = rounds[roundIdA];
        roundIdOthers.forEach(roundIdB => {
            const roundB = rounds[roundIdB];
            if((roundIdA !== roundIdB) && (roundA.day === roundB.day) && (roundA.from === roundB.from)) {
                accumulator.push(roundIdA);
                return;
            }
        });
        return accumulator;
    }, []);
}
