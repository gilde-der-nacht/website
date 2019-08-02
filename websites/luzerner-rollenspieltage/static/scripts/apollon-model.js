'use strict';

//const olymp = new OlympMock({});
//const olymp = new Olymp({});
const olymp = new Olymp({server: 'https://api.gildedernacht.ch'});

function getGames() {
    return {
        'Adrian-EveryoneIsJohn': {
            name: 'Everyone is John',
            gm: 'Adrian',
            gameDescription: '(THOMAS) Everyone is John ist ein stark vereinfachtes Rollenspiel. Jeder Spieler ist eine Stimme in Johns Kopf und versucht John zu verschiedenen Dingen zu überreden. Dabei kann man John zu nahezu allen Dingen überreden.',
            campaignDescription: 'Willst du eine von vielen Stimmen im schizophrenen Gehirn von John sein? Dann freue dich auf ein extrem chaotisches, kurzweiliges Rollenspiel.',
            lang: 'DE',
            playersMax: 5 - 1,
        },
        'Adrian-Shadowrun': {
            name: 'Shadowrun',
            gm: 'Adrian',
            gameDescription: '(THOMAS) Shadowrun spielt in der nahen Zukunft und verbindet den technischen und Dark-Future-Aspekt von Cyberpunk mit magischen Einflüssen der Fantasy (Magie, Elfen, Zwerge, Drachen)',
            campaignDescription: 'Wir tauchen gemeinsam in die düstere Cyberpunkwelt Shadowrun ein.',
            lang: 'DE',
            playersMax: 4 - 1,
        },

        'Kevin-Cthulhu-Filmriss': {
            name: 'Cthulhu (Filmriss)',
            gm: 'Kevin',
            gameDescription: 'Call of Cthulhu ist ein auf dem von H. P. Lovecraft geschaffenen Cthulhu-Mythos basierendes Rollenspiel. Es ist der erste erfolgreiche Versuch, nach dem Fantasy-Genre auch Horror in eine für das Rollenspiel geeignete Spielform zu bringen. Wolltet ihr schon immer in die Welt des Cthulhu Mythos eintauchen und zusammen mit euren Charakteren an den Rand des Wahnsinns gelangen? Jetzt habt ihr die Möglichkeit dazu. Mit etwas Glück überlebt euer Charakter auch den Abend, jedoch wird er nie mehr derselbe sein. Kann man da noch von Glück reden.',
            campaignDescription: 'Ich schreibe diesen Brief unter beträchtlicher geistiger Anspannung. Wenn du diese zitternd gekriezelten Zeilen liest, wirst du mich für Wahnsinnig halten, dies zu beurteilen liegt mir jedoch fern. Ich versuche mit dem Brief nicht meine Taten schön zu reden, da ich selber nicht weiss wie es soweit kommen konnte. Vielmehr versuche ich Sinn in das erlebte von heute Abend zu bringen. Nach einer anstrengenden Woche im Büro freute ich mich wie jeden Freitag auf die Kultfilmnacht in meinem Lieblingskino, dem Central... Das Szenario wird mit vorgefertigten Charakteren gespielt. Ebenfalls werden am Anfang die Regeln von Cthulhu für Anfänger erklärt. Es handelt sich um ein Closed Room Szenario, das heisst das ganze spielt ausschliesslich in den Räumlichkeiten vom Kino.',
            lang: 'DE',
            playersMax: 5 - 1,
        },
        'Kevin-Cthulhu-Zahltag': {
            name: 'Cthulhu (Zahltag)',
            gm: 'Kevin',
            gameDescription: 'Call of Cthulhu ist ein auf dem von H. P. Lovecraft geschaffenen Cthulhu-Mythos basierendes Rollenspiel. Es ist der erste erfolgreiche Versuch, nach dem Fantasy-Genre auch Horror in eine für das Rollenspiel geeignete Spielform zu bringen. Wolltet ihr schon immer in die Welt des Cthulhu Mythos eintauchen und zusammen mit euren Charakteren an den Rand des Wahnsinns gelangen? Jetzt habt ihr die Möglichkeit dazu. Mit etwas Glück überlebt euer Charakter auch den Abend, jedoch wird er nie mehr derselbe sein. Kann man da noch von Glück reden.',
            campaignDescription: 'Ihr habt so richtig Mist gebaut. Euer Boss schäumt vor Wut und ihr wisst nicht ob ihr das ganze wieder gut machen könnt oder bei den Fischen landet. Euer Boss ist aber gnädig gestimmt und gibt euch nochmals eine Chance. Jemand hat in seinem Gebiet gewildert ohne ihm seinen Anteil zu geben. Erledigt das für ihn und ihr seid quitt. Hört sich doch einfach an, kurz beim Typen vorbeischauen, ihm eine Lektion erteilen und eure Schuld ist beglichen. Jedoch hätte es euch stutzig machen sollen, dass ein Ritualdolch samt Inschrift gestohlen wurde, aber wer glaubt schon an sowas. Für das Szenario werden Charaktere zur Verfügung gestellt, ihr könnt aber auch mit einem eigenen Charakter aus der Gangsterbranche auftauchen. Ebenfalls werden am Anfang die Regeln von Cthulhu für Anfänger erklärt. Es handelt sich um ein offenes Szenario, welches in Arkham spielt.',
            lang: 'DE',
            playersMax: 5 - 1,
        },
        'Kevin-Pathfinder': {
            name: 'Pathfinder',
            gm: 'Kevin',
            gameDescription: 'Pathfinder ist ein Fantasy Rollenspiel, das auf dem Klassiker Dungeons & Dragons (Version 3.5) beruht. Aufgrund der Open Game License sind die zum Spielen erforderlichen Regeln kostenlos verfügbar. Ebenfalls existiert eine sehr gute Einsteigerbox mit allem was man für den ersten Spieleabend benötigt. So könnt ihr nach kurzem Lesen direkt loslegen und euch langsam an die Welt des Pen & Papers herantasten. Es werden fortlaufend neue Bücher publiziert um die Welt von Pathfinder zu erweitert. Diese enthalten oftmals neue Klassen, Rassen, Fähigkeiten, aber auch detaillierte Beschreibungen zu diversen Gebieten, für jeden ist etwas dabei. Wollt ihr ein Szenario als Drache spielen oder als Groot die Welt von Pathfinder unsicher machen, kein Problem. In einem der Bücher findet ihr bestimmt eine Anleitung dafür.',
            campaignDescription: "Die jungen Helden der Siedlung Kassen brechen auf zu ihrer Initiationszeremonie, einer alten Tradition, bei welcher es ein Stück der Ewigen Flamme zu bergen gilt, die in der Gruft des Gründers des Ortes brennt. Was sie jedoch vorfinden ist eine Begräbnisstätte voller Leichen von Dorfbewohnern sowie belebten Skeletten. Die Helden müssen den Fallen und Gefahren in der Krypta der Ewigen Flamme entgegentreten, den Ursprung der Verderbtheit finden. Für da Szenario werden Charaktere zur Verfügung gestellt, es können jedoch auch eigene Charaktere(lvl1) aus dem Grundregelwerk und Expertenregeln verwendet werden. Am Anfang werden die Regeln von Pathfinder für Anfänger erklärt. Das ganze ist in drei Teile eingeteilt. Der Beginn in der Ortschaft Kassen, sowie kennenlernen von diversen NPC's. Als nächstes der Aufbruch aus Kassen und eine zweitägige Reise durch die Wälder mit all ihren Gefahren. Und im dritten Akt die Ankunft bei der Gruft und deren Erforschung.",
            lang: 'DE',
            playersMax: 5 - 1,
        },
        'Kevin-Paranoia': {
            name: 'Paranoia (Nur erfahrene Spieler)',
            gm: 'Kevin',
            gameDescription: '(THOMAS) Paranoia ist ein englischsprachiges satirisches Pen-&-Paper-Rollenspiel, das in einer düsteren Science-Fiction-Umgebung spielt, die Anleihen von Werken wie Catch-22, 1984 und Brazil nimmt.',
            campaignDescription: 'Umzug, 1 Block, Nur erfahrene Spieler',
            lang: 'DE',
            playersMax: 4 - 1,
        },

        'Oliver-Workshop': {
            name: 'Workshop Lazy Dungeonmaster',
            gm: 'Oliver',
            gameDescription: '',
            campaignDescription: 'Helft mir die Spielrunde vorzubereiten, die ich darauf hin leiten werde und lerne die Techniken des faulen Spielleiters kennen.',
            lang: 'DE',
            playersMax: 6 - 1,
        },
        'Oliver-SdDf': {
            name: 'Schatten des Dämonenfürsten',
            gm: 'Oliver',
            gameDescription: 'SdDf Beschreibung???',
            campaignDescription: 'Was immer am Workshop davor zusammengesponnen wird.',
            lang: 'DE',
            playersMax: 6 - 1,
        },

        'Thomas-BladesInTheDark': {
            name: 'Blades in the Dark',
            gm: 'Thomas',
            gameDescription: 'Mitten im viktorianischen Doskvol seid ihr eine kleine, aufstrebende Verbrecherbande, die um die Vorherrschaft kämpft',
            campaignDescription: 'Je nach Motto, dass ihr selber wählt, seid ihr bei euren Verbrechen schnell, brutal, ... was auch immer der morbide Teil eueres Herzens begehrt. Dieses Rollenspiel ist eher für Erwachsene geeignet.',
            lang: 'DE',
            playersMax: 5 - 1,
        },

        'Manuela-Finsterland-Stadt': {
            name: 'Finsterland (Stadtabenteuer)',
            gm: 'Manuela',
            gameDescription: '(THOMAS) Finsterland spielt in einer Welt, die dem Europa das 19. und 20. Jahrhunderts ähnelt, aber Magie, Monster und revolutionäre Technologien bietet.',
            campaignDescription: 'Stadtabenteuer',
            lang: 'DE',
            playersMax: 4 - 1,
        },
        'Manuela-Finsterland-Piraten': {
            name: 'Finsterland (Piratenabenteuer)',
            gm: 'Manuela',
            gameDescription: '(THOMAS) Finsterland spielt in einer Welt, die dem Europa das 19. und 20. Jahrhunderts ähnelt, aber Magie, Monster und revolutionäre Technologien bietet.',
            campaignDescription: 'Piratenabenteuer',
            lang: 'DE',
            playersMax: 4 - 1,
        },

        'Stefan-DnD-Aufklaerung': {
            name: 'D&D 5e (Aufklärungsmission)',
            gm: 'Stefan',
            gameDescription: 'Eigenes, nicht-klassisches Setting. Grundkenntnisse der Regeln sind erwünscht',
            campaignDescription: '',
            lang: 'DE',
            playersMax: 5 - 1,
        },
        'Stefan-DnD-Befreiung': {
            name: 'D&D 5e (Befreiungsmission)',
            gm: 'Stefan',
            gameDescription: 'Eigenes, nicht-klassisches Setting. Grundkenntnisse der Regeln sind erwünscht',
            campaignDescription: 'In einem Land, das von Dämonenkulten beherrscht wird, versucht eine Gruppe Widerstandskämpfer, Gefangene aus einer Festung zu befreien.',
            lang: 'DE',
            playersMax: 5 - 1,
        },

        'Viktor-DnD': {
            name: 'D&D 1st Edition',
            gm: 'Viktor',
            gameDescription: '',
            campaignDescription: "Tired of hearing old players say 'I was there when THAC0 was a thing'? Now is your time to experience this edition. 'Dragon of Despair' is the first in TSR's series of Dragonlance adventures for use with the AD&D game system. The players will adventure in the world of Krynn, visit strange places such as Haven or ruined Xak Tsaroth, and encounter the bizarre draconians and spectral minions.",
            lang: 'EN',
            playersMax: 8 - 1,
        },

        'Martin-SwordSorcery': {
            name: 'Sword & Sorcery (Eigenes Rollenspiel)',
            gm: 'Martin',
            gameDescription: '',
            campaignDescription: '',
            lang: 'DE',
            playersMax: 4 - 1,
        },

        'Stephan-Earthdawn': {
            name: 'Earhdawn',
            gm: 'Stephan',
            gameDescription: '',
            campaignDescription: '',
            lang: 'DE',
            playersMax: 4 - 1,
        },

        'Jonas-Pathfinder': {
            name: 'Pathfinder',
            gm: 'Jonas',
            gameDescription: '',
            campaignDescription: '',
            lang: 'DE',
            playersMax: 6 - 1,
        },

        /*
        'XXX': {
            name: '',
            gm: '',
            gameDescription: '',
            campaignDescription: '',
            lang: 'DE',
            playersMax: 5,
        },
        */
    };
}

function getRounds() {
    return {
        'Adrian-0': { gameId: 'Adrian-EveryoneIsJohn', day: 'friday', from: 19, to: 22 },
        'Adrian-1': { gameId: 'Adrian-EveryoneIsJohn', day: 'saturday', from: 16, to: 19.5 },
        'Adrian-2': { gameId: 'Adrian-Shadowrun', day: 'saturday', from: 19.5, to: 1 },

        'Kevin-0': { gameId: 'Kevin-Cthulhu-Filmriss', day: 'friday', from: 19, to: 1 },
        'Kevin-1': { gameId: 'Kevin-Cthulhu-Zahltag', day: 'saturday', from: 13, to: 16 },
        'Kevin-2': { gameId: 'Kevin-Pathfinder', day: 'saturday', from: 16, to: 19.5 },
        'Kevin-3': { gameId: 'Kevin-Paranoia', day: 'saturday', from: 19.5, to: 1 },

        'Oliver-0': { gameId: 'Oliver-Workshop', day: 'saturday', from: 19.5, to: 22 },
        'Oliver-1': { gameId: 'Oliver-SdDf', day: 'saturday', from: 22, to: 1 },

        'Thomas-0': { gameId: 'Thomas-BladesInTheDark', day: 'saturday', from: 19.5, to: 22 },

        'Manuela-0': { gameId: 'Manuela-Finsterland-Stadt', day: 'friday', from: 19.5, to: 22 },
        'Manuela-1': { gameId: 'Manuela-Finsterland-Piraten', day: 'saturday', from: 16, to: 19.5 },

        'Stefan-0': { gameId: 'Stefan-DnD-Aufklaerung', day: 'friday', from: 19.5, to: 1 },
        'Stefan-1': { gameId: 'Stefan-DnD-Befreiung', day: 'saturday', from: 13, to: 19.5 },

        'Viktor-0': { gameId: 'Viktor-DnD', day: 'saturday', from: 13, to: 16 },

        'Martin-0': { gameId: 'Martin-SwordSorcery', day: 'saturday', from: 13, to: 16 },
        'Martin-1': { gameId: 'Martin-SwordSorcery', day: 'saturday', from: 19.5, to: 22 },

        'Stephan-0': { gameId: 'Stephan-Earthdawn', day: 'saturday', from: 19.5, to: 22 },

        'Jonas-0': { gameId: 'Jonas-Pathfinder', day: 'saturday', from: 13, to: 16 },
        'Jonas-1': { gameId: 'Jonas-Pathfinder', day: 'saturday', from: 16, to: 19.5 },

        /*
        'XXX': { gameId: 'XXX', day: 'friday', from: 13, to: 13 },
        'XXX': { gameId: 'XXX', day: 'friday', from: 13, to: 13 },
        'XXX': { gameId: 'XXX', day: 'friday', from: 13, to: 13 },
        'XXX': { gameId: 'XXX', day: 'friday', from: 13, to: 13 },
        */
    };
}

const APOLLON_UID = '095da522f49aebbd35443fd2349d578a1aaf4a9ea05ae7d59383a5f416d4fd3b';

async function getRegistrations() {
    console.assert(await olymp.status(), 'Olymp API Version Mismatch');
    if(olymp.constructor == OlympMock) {
        olymp.resourceAdd(APOLLON_UID);
        await olymp.entriesAdd(APOLLON_UID, 'a@unknown.tld', {rounds: ['Adrian-0', 'Adrian-1']}, {name: 'a', email: 'a@unknown.tld'});
        await olymp.entriesAdd(APOLLON_UID, 'b@unknown.tld', {rounds: ['Adrian-0']}, {name: 'b', email: 'b@unknown.tld'});
        await olymp.entriesAdd(APOLLON_UID, 'c@unknown.tld', {rounds: ['Adrian-0']}, {name: 'c', email: 'c@unknown.tld'});
        await olymp.entriesAdd(APOLLON_UID, 'd@unknown.tld', {rounds: ['Adrian-0']}, {name: 'd', email: 'd@unknown.tld'});
        await olymp.entriesAdd(APOLLON_UID, 'e@unknown.tld', {rounds: ['Adrian-0']}, {name: 'e', email: 'e@unknown.tld'});
        await olymp.entriesAdd(APOLLON_UID, 'f@unknown.tld', {rounds: ['Adrian-1']}, {name: 'f', email: 'f@unknown.tld'});
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
    //console.log('registrationAdd\n' + identification + '\n' + JSON.stringify(publicBody) + '\n' + JSON.stringify(privateBody));
    await olymp.entriesAdd(APOLLON_UID, identification, publicBody, privateBody);
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
