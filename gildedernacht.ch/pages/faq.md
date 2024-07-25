---
layout: "@gdn/layouts/Layout.astro"
title: Häufig gestellte Fragen
metaTitle: Häufig gestellte Fragen
toc: true
navigation:
  group: secondary
  label: Häufig gestellte Fragen
  order: 8
---

<button type="button" class="button-accent" data-toggle-details="">
  alle Antworten   
  <span data-toggle-label="open">zuklappen</span>
  <span data-toggle-label="close" hidden>aufklappen</span>
</button>

## Verein

<details open="">
  <summary>Was ist die Gilde der Nacht?</summary>

  Die Gilde der Nacht ist ein Verein, der das Spielhobby in und um Luzern fördert. Wir konzentrieren uns vor allem auf Brett-, Rollenspiele und Tabletop. Die Entstehungsgeschichte findest du auf der [Seite "Verein"](/verein).
  
</details>

<br/>

<details open="">
  <summary>Gibt es Mitgliedschaftsmöglichkeiten für die "Gilde der Nacht" und welche Vorteile bietet die Mitgliedschaft?</summary>

  Ja, eine Mitgliedschaft steht allen offen, ist jedoch keine Voraussetzung um an unseren Anlässen (siehe [Kalender](/#kalender)) teilnehmen zu dürfen. Mit einer Mitgliedschaft unterstützt du in erster Linie den Verein und besuchst unsere Spieltreffen kostenlos, aber ist ansonsten an keine speziellen Vorteile (oder Pflichten) gebunden (siehe [Seite "Statuten"](/statuten)).

  Da es sehr wichtig ist für uns, wiederholen wir es erneut: Alle unsere Events im Kalender sind öffentlich und sowohl Mitglieder als auch Nicht-Mitglieder sind gleichermassen willkommen.

</details>

<br/>

<details open="">
  <summary>Wie hoch ist der jährliche Mitgliederbeitrag?</summary>

  Der Mitgliederbeitrag wird an der jährlichen Generalversammlung bestimmt und belief sich in den vergangen Jahren jeweils auf 50 Franken. Mitglieder:innen unter 16 Jahren werden vom Mitgliederbeitrag ausgenommen.

  Ausserdem sehen die Statuten Minderungen und komplette Befreiung vom Mitgliederbeitrag situativ vor (siehe [Seite "Statuten"](/statuten)).

</details>

<br/>

<details open="">
  <summary>Gibt es eine Altersbeschränkung für die Mitgliedschaft im Verein?</summary>

  Nein, es gibt keine Altersbeschränkung. Jedoch sind nicht alle unsere Anlässe für alle Altersgruppen geeignet (siehe weiter unten).

</details>

<br/>

<details open="">
  <summary>Wie muss ich vorgehen, wenn ich Mitglied werden möchte?</summary>

  Uns ist ein persönlicher Bezug sehr wichtig und unsere Anlässe, an denen wir gemeinsam spielen, sind das Herz und Blut des Vereins. Komme deshalb bitte zwei-dreimal einen unseren zahlreichen Anlässen reinschnuppern. Wenn es dir bei uns gefällt, dann ist immer jemand vom Vorstand vor Ort, der den Beitritt zur Gilde durchführen kann.

</details>

<br/>

<details open="">
  <summary>Gibt es einen Newsletter oder einen Social-Media-Kanal, über den ich über Neuigkeiten informiert werden kann?</summary>

  Wir haben einen [Newsletter](/newsletter), über den wir vor allem über die ausserordentlichen oder grösseren Anlässe informieren. Wir betreiben ausserdem eine Discord-Instanz ([Chat](/chat)), auf dem regelmässig Neuigkeiten ausgetauscht werden. Auf anderen Plattformen sind wir wenig bis gar nicht aktiv.

</details>

<br hidden/>

<details open="" hidden>
  <summary>Gibt es bestimmte Regeln oder Richtlinien, die Vereinsmitglieder beachten müssen?</summary>

  Bitte beachte unseren Verhaltenskodex ([link], TODO). Dieser gilt auch für Nichtmitglieder an unseren Veranstaltungen oder in unserem Discord-Chat.

</details>

<br/>

<details open="">
  <summary>Gibt es Möglichkeiten, sich aktiv am Verein zu beteiligen, wie z.B. bei der Organisation von Events oder der Auswahl von Spielen?</summary>

  Ja wir können immer Unterstützung gebrauchen oder sind offen für neue Ideen. Unsere grösseren Anlässe sind nur möglich, dank zahlreicher Helfer:innen. Wenn du gerne etwas organisieren möchtest, dann sprich uns doch persönlich an einem unserer Events an oder sende uns eine Nachricht per [Kontaktformular](/kontakt).

</details>


<script>
{
  const toggle = document.querySelector("[data-toggle-details]");
  const details = document.querySelectorAll("details");
  const labelOpen = toggle.querySelector("[data-toggle-label='open']");
  const labelClose = toggle.querySelector("[data-toggle-label='close']");

  let open = true;

  toggle.addEventListener("click", () => {

    if (open) {
      labelOpen.hidden = true;
      labelClose.hidden = false;
    } else {
      labelOpen.hidden = false;
      labelClose.hidden = true;
    }

    open = !open;
    details.forEach((detail) => {
      detail.open = open;
    });
    
  });
}
</script>
