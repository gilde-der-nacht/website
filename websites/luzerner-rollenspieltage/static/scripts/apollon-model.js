'use strict';

// TODO put everything into a scope

//const olymp = new OlympMock({});
//const olymp = new Olymp({});
const olymp = new Olymp({server: 'https://api.gildedernacht.ch'});

const RESERVE_SEAT = 1;

function getGames() {
    return {
        'Adrian-EveryoneIsJohn': {
            name: 'Everyone is John (Einsteigerfreundlich)',
            gm: 'Adrian',
            gameDescription: 'Everyone is John ist ein stark vereinfachtes Rollenspiel. Jeder Spieler ist eine Stimme in Johns Kopf und versucht John zu verschiedenen Dingen zu überreden. Dabei kann man John zu nahezu allen Dingen überreden.',
            campaignDescription: 'Willst du eine von vielen Stimmen im schizophrenen Gehirn von John sein? Dann freue dich auf ein extrem chaotisches, kurzweiliges Rollenspiel.',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },
        'Adrian-Shadowrun': {
            name: 'Shadowrun (Einsteigerfreundlich)',
            gm: 'Adrian',
            gameDescription: 'Shadowrun spielt in der nahen Zukunft und verbindet den technischen und Dark-Future-Aspekt von Cyberpunk mit magischen Einflüssen der Fantasy (Magie, Elfen, Zwerge, Drachen)',
            campaignDescription: 'Wir tauchen gemeinsam in die düstere Cyberpunkwelt Shadowrun ein.',
            lang: 'DE',
            playersMax: 4 - RESERVE_SEAT,
        },

        'Kevin-Cthulhu-Filmriss': {
            name: 'Cthulhu (Einsteigerfreundlich)',
            gm: 'Kevin',
            gameDescription: 'Call of Cthulhu ist ein auf dem von H. P. Lovecraft geschaffenen Cthulhu-Mythos basierendes Rollenspiel. Es ist der erste erfolgreiche Versuch, nach dem Fantasy-Genre auch Horror in eine für das Rollenspiel geeignete Spielform zu bringen. Mit etwas "Glück" überlebt euer Charakter auch den Abend, jedoch wird er nie mehr derselbe sein.',
            campaignDescription: 'Filmriss: Ich schreibe diesen Brief unter beträchtlicher geistiger Anspannung. Wenn du diese zitternd gekriezelten Zeilen liest, wirst du mich für Wahnsinnig halten, dies zu beurteilen liegt mir jedoch fern. Nach einer anstrengenden Woche im Büro freute ich mich wie jeden Freitag auf die Kultfilmnacht in meinem Lieblingskino, dem Central...',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },
        'Kevin-Cthulhu-Zahltag': {
            name: 'Cthulhu (Einsteigerfreundlich)',
            gm: 'Kevin',
            gameDescription: 'Call of Cthulhu ist ein auf dem von H. P. Lovecraft geschaffenen Cthulhu-Mythos basierendes Rollenspiel. Es ist der erste erfolgreiche Versuch, nach dem Fantasy-Genre auch Horror in eine für das Rollenspiel geeignete Spielform zu bringen. Mit etwas "Glück" überlebt euer Charakter auch den Abend, jedoch wird er nie mehr derselbe sein.',
            campaignDescription: 'Zahltag: Ihr habt so richtig Mist gebaut. Euer Boss schäumt vor Wut und ihr wisst nicht ob ihr das ganze wieder gut machen könnt oder bei den Fischen landet. Euer Boss ist aber gnädig gestimmt und gibt euch nochmals eine Chance. Jemand hat in seinem Gebiet gewildert ohne ihm seinen Anteil zu geben. Hört sich doch einfach an, kurz beim Typen vorbeischauen, ihm eine Lektion erteilen und eure Schuld ist beglichen. Es werden Charaktere zur Verfügung gestellt, ihr könnt aber auch mit einem eigenen Charakter aus der Gangsterbranche auftauchen.',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },
        'Kevin-Pathfinder': {
            name: 'Pathfinder (Einsteigerfreundlich)',
            gm: 'Kevin',
            gameDescription: 'Pathfinder ist ein Fantasy Rollenspiel, das auf dem Klassiker Dungeons & Dragons (Version 3.5) beruht. Aufgrund der Open Game License sind die zum Spielen erforderlichen Regeln kostenlos verfügbar. Dank der sehr guten Einsteigerbox könnt ihr nach kurzem Lesen direkt loslegen und euch langsam an die Welt des Pen & Papers herantasten.',
            campaignDescription: "Die jungen Helden der Siedlung Kassen brechen auf zu ihrer Initiationszeremonie, einer alten Tradition, bei welcher es ein Stück der Ewigen Flamme zu bergen gilt, die in der Gruft des Gründers des Ortes brennt. Was sie jedoch vorfinden ist eine Begräbnisstätte voller Leichen von Dorfbewohnern sowie belebten Skeletten. Die Helden müssen den Fallen und Gefahren in der Krypta der Ewigen Flamme entgegentreten, den Ursprung der Verderbtheit finden. Für da Szenario werden Charaktere zur Verfügung gestellt, es können jedoch auch eigene Charaktere(lvl1) aus dem Grundregelwerk und Expertenregeln verwendet werden. Am Anfang werden die Regeln von Pathfinder für Anfänger erklärt.",
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },
        'Kevin-Paranoia': {
            name: 'Paranoia (Nur erfahrene Spieler)',
            gm: 'Kevin',
            gameDescription: 'Paranoia ist ein englischsprachiges satirisches Pen-&-Paper-Rollenspiel, das in einer düsteren Science-Fiction-Umgebung spielt, die Anleihen von Werken wie Catch-22, 1984 und Brazil nimmt.',
            campaignDescription: 'Umzug, 1 Block, Nur erfahrene Spieler',
            lang: 'DE',
            playersMax: 4 - RESERVE_SEAT,
        },

        'Oliver-Workshop': {
            name: 'Workshop: Vorbereitung für faule Spielleiter',
            gm: 'Oliver',
            gameDescription: '',
            campaignDescription: 'Lasst uns zusammen eine Spielrunde vorzubereiten und lerne die Techniken des faulen Spielleiters kennen.',
            lang: 'DE',
            playersMax: 6 - RESERVE_SEAT,
        },
        'Oliver-SdDf': {
            name: 'Schatten des Dämonenfürsten',
            gm: 'Oliver',
            gameDescription: 'Das System ist sehr verwandt mit dem beliebten Dungeons & Dragons Regelwerk. Der Schatten steht für den kommenden Untergang der Welt, wie wir sie kennen.',
            campaignDescription: 'Düsteres Fantasy. Die Story wird spontan entstehen – lass uns gemeinsam herausfinden, was passieren wird.',
            lang: 'DE',
            playersMax: 6 - RESERVE_SEAT,
        },

        'Thomas-BladesInTheDark': {
            name: 'Blades in the Dark (Für Erwachsene)',
            gm: 'Thomas',
            gameDescription: 'Blades in the Dark spielt im viktorianischen Doskvol, wo ihr eine kleine, aufstrebende Verbrecherbande seid, die um ihre Vorherrschaft kämpft.',
            campaignDescription: 'Je nach Motto, dass ihr selber wählt, seid ihr bei euren Verbrechen schnell, brutal, kreativ, ... was auch immer der morbide Teil eueres Herzens begehrt. Bei Blades in the Dark wird die Welt und die Geschichte mehr durch die Spieler gestaltet als durch den Spielleiter.',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },

        'Manuela-Finsterland-Stadt': {
            name: 'Finsterland (Einsteigerfreundlich)',
            gm: 'Manuela',
            gameDescription: 'Finsterland spielt in einer Welt, die dem Europa das 19. und 20. Jahrhunderts ähnelt, aber Magie, Monster und revolutionäre Technologien bietet.',
            campaignDescription: 'Stadtabenteuer: Die Welt ist im Umbruch. Der Fortschritt fegt das Althergebrachte weg. Begleitet mich nach Chinatown im Jahr 1812 um das Neuarsfest zu feiern. Doch was lauert in der dunklen Gasse?',
            lang: 'DE',
            playersMax: 4 - RESERVE_SEAT,
        },
        'Manuela-Finsterland-Piraten': {
            name: 'Finsterland (Einsteigerfreundlich)',
            gm: 'Manuela',
            gameDescription: 'Finsterland spielt in einer Welt, die dem Europa das 19. und 20. Jahrhunderts ähnelt, aber Magie, Monster und revolutionäre Technologien bietet.',
            campaignDescription: 'Piratenabenteuer. Die Welt ist im Umbruch. Der fortschritt fegt das Althergebrachte weg. Ihr habt eine gemütliche Reise mit einem Luftschiff der Angelare gebucht. Doch ihr habt nicht mit denn Luftpiraten gerechnet die schon auf Beute warten. Auf in ein luftiges Abenteuer.',
            lang: 'DE',
            playersMax: 4 - RESERVE_SEAT,
        },

        'Stefan-DnD-Aufklaerung': {
            name: 'D&D 5e (Grundkenntnisse erwünscht)',
            gm: 'Stefan',
            gameDescription: 'Eigenes, nicht-klassisches Setting. Grundkenntnisse der D&D Regeln sind erwünscht',
            campaignDescription: 'Aufklärungsmission: In einem wilden, ungezähmten Land, das von Halbwesen bevölkert ist, erhält eine Gruppe Abenteurer den Auftrag, herauszufinden, warum der Kontakt zu einigen Küstensiedlungen abgebrochen ist. Alle Charaktere sind Level 4 und vorgefertigt (kleine Änderungen sind möglich).',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },
        'Stefan-DnD-Befreiung': {
            name: 'D&D 5e (Grundkenntnisse erwünscht)',
            gm: 'Stefan',
            gameDescription: 'Eigenes, nicht-klassisches Setting. Grundkenntnisse der D&D Regeln sind erwünscht',
            campaignDescription: 'Befreiungsmission: In einem Land, das von Dämonenkulten beherrscht wird, versucht eine Gruppe Widerstandskämpfer, Gefangene aus einer Festung zu befreien. Alle Charaktere sind Level 4 und vorgefertigt (kleine Änderungen sind möglich).',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },

        'Victor-DnD': {
            name: 'D&D 1st Edition',
            gm: 'Victor',
            gameDescription: 'Dungeons & Dragons (commonly abbreviated as D&D or DnD) is a fantasy tabletop role-playing game (RPG) originally designed by Gary Gygax and Dave Arneson.',
            campaignDescription: "Tired of hearing old players say 'I was there when THAC0 was a thing'? Now is your time to experience this edition. 'Dragon of Despair' is the first in TSR's series of Dragonlance adventures for use with the AD&D game system. The players will adventure in the world of Krynn, visit strange places such as Haven or ruined Xak Tsaroth, and encounter the bizarre draconians and spectral minions.",
            lang: 'EN',
            playersMax: 8 - RESERVE_SEAT,
        },

        'Mark-LaserAndFeelings': {
            name: 'Lasers & Feelings',
            gm: 'Mark',
            gameDescription: 'Lasers & Feelings is a quick-play roleplaying game. The game is freely available and fits on one page.',
            campaignDescription: 'You are the crew of the interstellar scout ship Raptor. Your mission is to explore uncharted regions of space, deal with aliens both friendly and deadly, and defend the Consortium worlds against space dangers.',
            lang: 'EN',
            playersMax: 5 - RESERVE_SEAT,
        },

        'Ursula-TODO': {
            name: 'TODO',
            gm: 'Ursula',
            gameDescription: 'TODO',
            campaignDescription: 'TODO',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },

        'Martin-SwordSorcery': {
            name: 'Sword & Sorcery',
            gm: 'Martin',
            gameDescription: 'Sword & Sorcery ist mein eigenes Rollenspiel, mit Elementen von D&D und Dungeonworld.',
            campaignDescription: 'Schlüpfe in die Rolle eines Fantasy/Mittelalter Helden um verschiedene Herausforderungen zu meistern.',
            lang: 'DE',
            playersMax: 4 - RESERVE_SEAT,
        },

        'Stephan-Earthdawn': {
            name: 'Earhdawn',
            gm: 'Stephan',
            gameDescription: 'Earthdawn spielt in einer fiktiven fernen Vergangenheit unserer Erde. Die Welt von Earthdawn war zum Zeitpunkt der ersten Veröffentlichung die offizielle Vergangenheit der Welt von Shadowrun.',
            campaignDescription: 'Das Earthdawn-Einführungsabenteuer Kaer Tardim.',
            lang: 'DE',
            playersMax: 4 - RESERVE_SEAT,
        },

        'Jonas-Pathfinder': {
            name: 'Pathfinder (Einsteigerfreundlich)',
            gm: 'Jonas',
            gameDescription: 'Pathfinder basiert auf der Open Game License des Dungeons & Dragons-Regelwerks in Version 3.5.',
            campaignDescription: 'Wenn man mit Mörder, Halsabschneider, und Dieben dem dunklen Gott geopfert wird... hat man im Leben viel falsche Entscheidungen getroffen. Jetzt kann man seine Götter um Vergebung bitten oder trifft ein paar falsche Entscheidungen mehr und bleibt vielleicht am Leben.',
            lang: 'DE',
            playersMax: 6 - RESERVE_SEAT,
        },

        'Reto-DnD': {
            name: 'D&D 5e (Für erfahrene Spieler)',
            gm: 'Reto',
            gameDescription: 'Eigenes Dungeons & Dragons Abenteuer.',
            campaignDescription: 'Die Goblins von Fährmanns Wald. Warum immer die Heldin oder der Held eines Abenteuers sein? Wenn mann auch einmal ein kleiner grüner Schlitzohr sein kann, wie die Goblins so sind. Ihr seit Untertanen eines Hobgoblins Namens Qrag Bronzehammer. Der euch seit Jahren zu diebische Taten anstiftet aber nun scheint ihm das Gold der armen Bauern kein Reiz mehr zu haben. Ihr seht ihm zu, wie er immer wieder abends zur Burg des Grafen Erick von Pfefferlingen schaut.',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },

        'Lukas-DnD': {
            name: 'D&D 5e',
            gm: 'Lukas',
            gameDescription: 'Eigenes Dungeons & Dragons Abenteuer mit Charaktern auf Level 4.',
            campaignDescription: 'Ein Priester hat ein speziellen Auftrag für euch. Irgend etwas geht vor unter der Kirche, meint der Mann. Aber alleine in die Gruft gehen? Niemals.',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },

        'GianMarco-Dungeonslayer': {
            name: 'Dungeonslayer',
            gm: 'Gian-Marco',
            gameDescription: 'Bei Dungeonslayer ist das Dungeoncrawling in einem klassischen Fantasysetting ein wichtiges Element.',
            campaignDescription: 'TODO',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },

        'Dominique-DnD': {
            name: 'D&D 5e',
            gm: 'Dominique',
            gameDescription: '',
            campaignDescription: '',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },

        'Flutschi-Character': {
            name: 'Workshop: D&D Charakter erstellen',
            gm: 'Sandro',
            gameDescription: 'Sandro vom GamePlace hilft euch bei der Charakterkreation im beliebten Dungeons & Dragons Spielsystem.',
            campaignDescription: '',
            lang: 'DE',
            playersMax: 11 - RESERVE_SEAT,
        },

        'Flutschi-DnD': {
            name: 'D&D (Einsteigerfreundlich)',
            gm: 'Sandro',
            gameDescription: 'folgt. (Erscheine ein bisschen früher, um mit dem Spielleiter Sandro gemeinsam einen Charakter zu erstellen).',
            campaignDescription: 'folgt',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },

        /*
        'XXX': {
            name: '',
            gm: '',
            gameDescription: '',
            campaignDescription: '',
            lang: 'DE',
            playersMax: 5 - RESERVE_SEAT,
        },
        */
    };
}

function getRounds() {
    return {
        'Adrian-0': { gameId: 'Adrian-EveryoneIsJohn', day: 'friday', from: 19, to: 22 },
        'Adrian-1': { gameId: 'Adrian-Shadowrun', day: 'friday', from: 22, to: 1 },
        'Adrian-2': { gameId: 'Adrian-EveryoneIsJohn', day: 'saturday', from: 16, to: 19.5 },
        'Adrian-3': { gameId: 'Adrian-Shadowrun', day: 'saturday', from: 19.5, to: 1 },

        'Kevin-0': { gameId: 'Kevin-Cthulhu-Zahltag', day: 'friday', from: 19, to: 1 },
        'Kevin-1': { gameId: 'Kevin-Paranoia', day: 'saturday', from: 13, to: 16 },
        'Kevin-2': { gameId: 'Kevin-Cthulhu-Filmriss', day: 'saturday', from: 16, to: 19.5 },
        'Kevin-3': { gameId: 'Kevin-Pathfinder', day: 'saturday', from: 19.5, to: 1 },

        'Oliver-0': { gameId: 'Oliver-Workshop', day: 'saturday', from: 19.5, to: 22 },
        'Oliver-1': { gameId: 'Oliver-SdDf', day: 'saturday', from: 22, to: 1 },

        'Thomas-0': { gameId: 'Thomas-BladesInTheDark', day: 'saturday', from: 19.5, to: 22 },

        'Manuela-0': { gameId: 'Manuela-Finsterland-Stadt', day: 'friday', from: 19.5, to: 22 },
        'Manuela-1': { gameId: 'Manuela-Finsterland-Piraten', day: 'saturday', from: 16, to: 19.5 },

        'Stefan-0': { gameId: 'Stefan-DnD-Aufklaerung', day: 'friday', from: 19.5, to: 1 },
        'Stefan-1': { gameId: 'Stefan-DnD-Befreiung', day: 'saturday', from: 13, to: 19.5 },

        'Victor-0': { gameId: 'Victor-DnD', day: 'saturday', from: 13, to: 16 },

        'Mark-0': { gameId: 'Mark-LaserAndFeelings', day: 'saturday', from: 16, to: 19.5 },

        'Martin-0': { gameId: 'Martin-SwordSorcery', day: 'saturday', from: 13, to: 16 },
        'Martin-1': { gameId: 'Martin-SwordSorcery', day: 'saturday', from: 19.5, to: 22 },

        'Stephan-0': { gameId: 'Stephan-Earthdawn', day: 'saturday', from: 19.5, to: 22 },

        'Jonas-0': { gameId: 'Jonas-Pathfinder', day: 'saturday', from: 13, to: 16 },

        'Reto-0': { gameId: 'Reto-DnD', day: 'saturday', from: 19.5, to: 22 },

        'Lukas-0': { gameId: 'Lukas-DnD', day: 'saturday', from: 13, to: 16 },

        'GianMarco-0': { gameId: 'GianMarco-Dungeonslayer', day: 'friday', from: 19, to: 22 },
        'GianMarco-1': { gameId: 'GianMarco-Dungeonslayer', day: 'saturday', from: 16, to: 19.5 },
        'GianMarco-2': { gameId: 'GianMarco-Dungeonslayer', day: 'saturday', from: 19.5, to: 22 },

        'Flutschi-0': { gameId: 'Flutschi-Character', day: 'saturday', from: 13, to: 15.3 },
        'Flutschi-1': { gameId: 'Flutschi-DnD', day: 'saturday', from: 16, to: 22 },

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
    const versionApplication = "0.0.0";
    const versionServer = (await olymp.status()).version;
    console.assert(versionServer === versionApplication, 'Olymp API Version Mismatch');

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
    function timeOverlapping(a, b) {
        if(a.to <= b.from) {
            return false;
        }
        if(a.from >= b.to) {
            return false;
        }
        return true;
    }

    const rounds = getRounds();
    return roundIdOthers.reduce((accumulator, roundIdA) => {
        const roundA = rounds[roundIdA];
        roundIdOthers.forEach(roundIdB => {
            const roundB = rounds[roundIdB];
            if((roundIdA !== roundIdB) && (roundA.day === roundB.day) && (timeOverlapping(roundA, roundB) || timeOverlapping(roundB, roundA))) {
                accumulator.push(roundIdA);
                return;
            }
        });
        return accumulator;
    }, []);
}
