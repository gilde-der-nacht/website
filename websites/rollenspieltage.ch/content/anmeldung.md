---
title: "Anmeldung"
slug: "anmeldung"
aliases:
- /registration/
date: 2021-05-29
scripts:
- 'apollon'
---

{{< form/form uid="38f8295ff8bebc869daa5d83466af523c9a1491a19302a2e7dfc0f2ec1692bdf" >}}

{{< form/fieldset >}}
{{< form/text-input name="private-name" type="text" placeholder="Name" label="Name *" attributes="required">}}
{{< form/text-input name="private-email" type="email" placeholder="E-Mail" label="E-Mail *" attributes="required">}}

<label>Anmeldung als</label>
<small>treffe bitte mindestens eine Auswahl</small>

{{< form/checkbox name="private-participant-role" label="Spieler:in" attributes="checked">}}

{{< form/checkbox name="private-gamemaster-role" label="Spielleiter:in" >}}

<label>
mehr Spielen
<input type="range" id="balance" name="balance" min="0" max="2">
mehr Spielleiten
</label>

Zeitfenster (1 Stunden Slots)

{{< /form/fieldset >}}

{{< form/fieldset legend="Spieler:in" >}}

{{< form/radio-group >}}
  {{< form/radio name="short" label="kurze aber viele Spielrunden">}}
  {{< form/radio name="long" label="lange aber wenige Spielrunden">}}
  {{< form/radio name="not-matter" label="egal">}}
{{< /form/radio-group >}}

Genres (Skala Gerne-Egal-Lieber nicht)
* Vorauswahl
* Sonstiges (Eingabe)

Workshops/Diskussionsrunden (Skala Gerne-Egal-Lieber nicht)
<i class="fas fa-camera"></i>
* Vorauswahl
* Sonstiges (Eingabe)

Beigleitpersonen (Namen optional)
{{< /form/fieldset >}}

{{< form/fieldset legend="Spielleiter:in" >}}

{{< form/checkbox name="private-gamemaster-buddy" label="Buddy-System, Unterstützung gewünscht" >}}

Pro Spielrunde

Titel + kurze Beschreibung

Genres
* Vorauswahl
* Sonstiges (Eingabe)

{{< form/text-input name="private-game-duration" type="number" label="Dauer (in Stunden) *" attributes="required">}}

<label>Anzahl Spieler</label>

{{< form/text-input name="private-game-playercount-min" type="number" label="Minimum *" attributes="required">}}

{{< form/text-input name="private-game-playercount-max" type="number" label="Maximum *" attributes="required">}}

{{< /form/fieldset >}}

{{< form/fieldset legend="Abschluss" >}}

<label>Helferaufruf</label>
<small>ganz alleine würden wir die Rollenspieltage nicht durchführen können</small>

{{< form/checkbox name="private-helper-logistic" label="Aufbau/Abbau" >}}

{{< form/checkbox name="private-helper-checkout" label="Kasse (Buffet oder Flohmarkt)" >}}

{{< form/checkbox name="private-helper-kitchen" label="Küche" >}}

{{< form/textarea name="private-message" placeholder="Fragen" label="Noch Fragen?">}}

{{< /form/fieldset >}}

{{< /form/form >}}
