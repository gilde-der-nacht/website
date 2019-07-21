'use strict';

// TODO put in class

//const olymp = OlympMock();

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
        //'Adrian-1': { gameId: 'Adrian-0', day: 'saturday', from: 15, to: 17 },
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
    //console.assert(await olymp.status(), 'Olymp API Version Mismatch');
    // TODO check if accidently used APOLLO (without N)
    const APOLLON_UID = '095da522f49aebbd35443fd2349d578a1aaf4a9ea05ae7d59383a5f416d4fd3b';
    //const registrations = await olymp.getEntries(REGISTRATION_UID);
    const registrations = [
        {publicBody: {rounds: ['Adrian-0', 'Adrian-1'], userId: '1'}, privateBody: {name: 'a', email: 'a@unknown.tld'}},
        {publicBody: {rounds: ['Adrian-0'], userId: '2'}, privateBody: {name: 'b', email: 'b@unknown.tld'}},
        {publicBody: {rounds: ['Adrian-0'], userId: '3'}, privateBody: {name: 'c', email: 'c@unknown.tld'}},
        {publicBody: {rounds: ['Adrian-0'], userId: '4'}, privateBody: {name: 'd', email: 'd@unknown.tld'}},
        //{publicBody: {rounds: ['Adrian-0'], userId: '5'}, privateBody: {name: 'e', email: 'e@unknown.tld'}},
        //{publicBody: {rounds: ['Adrian-1'], userId: '1'}, privateBody: {name: 'a', email: 'a@unknown.tld'}},
    ];
    // TODO Olymp.filterMostRecent(registrations)
    return registrations;
}

async function registrationAdd(name, email, comment, rounds) {
    async function digest(message) {
        return message
    }

    const userId = await digest(email);
    const publicBody = {
        userId: userId,
        rounds: rounds,
    };
    const privateBody = {
        name: name,
        email: email,
        comment: comment,
    };
    // TODO submit
    console.log('registrationAdd ' + JSON.stringify(publicBody) + '\n' + JSON.stringify(privateBody));
}

// TODO add jslint and jsformat stuff to olymp

// TODO move to Olymp, move groupBy and other functions into Olymp aswell
// se lodash.sortyBy 
// https://ramdajs.com/docs/#sortBy
// at the moment only ascending sorting is supported
function sortBy(array, ...criterias) {
    const result = array.slice(0);
    result.sort((a, b) => {
        for(let i = 0; i < criterias.length; i += 1) {
            const ca = criterias[i](a);
            const cb = criterias[i](b);
            if((i < criterias.length) && (ca === cb)) {
                continue;
            }
            return ca > cb; // > = ascending, < = descending
        }
    });
    return result;
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
