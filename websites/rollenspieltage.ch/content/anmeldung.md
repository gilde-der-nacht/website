---
title: "Anmeldung"
slug: "anmeldung"
aliases:
- /registration/
date: 2021-05-29
scripts:
- 'apollon'
---

{{< form uid="38f8295ff8bebc869daa5d83466af523c9a1491a19302a2e7dfc0f2ec1692bdf" >}}

{{< fieldset >}}
{{< input name="private-name" type="text" placeholder="Name" label="Name *" attributes="required">}}
{{< input name="private-email" type="email" placeholder="E-Mail" label="E-Mail *" attributes="required">}}

<label>Anmeldung als</label>
<small>treffe bitte mindestens eine Auswahl</small>

<label>
<input type="checkbox" checked>
Spieler:in
</label>

<label>
<input type="checkbox">
Spielleiter:in
</label>

<label>
mehr Spielen
<input type="range" id="balance" name="balance" min="0" max="2">
mehr Spielleiten
</label>

Zeitfenster (1 Stunden Slots)

{{< /fieldset >}}

{{< fieldset legend="Spieler:in" >}}

<label>Arten von Spielrunden</label>

<label class="radio">
    <input type="radio" name="answer">
    kurze aber viele Spielrunden
  </label>
  <label class="radio">
    <input type="radio" name="answer">
    lange aber wenige Spielrunden
  </label>
  <label class="radio">
    <input type="radio" name="answer">
    egal
  </label>

Genres (Skala Gerne-Egal-Lieber nicht)

Vorauswahl

Sonstiges (Eingabe)

Workshops/Diskussionsrunden (Skala Gerne-Egal-Lieber nicht)

Vorauswahl

Sonstiges (Eingabe)

Beigleitpersonen (Namen optional)
{{< /fieldset >}}

{{< fieldset legend="Spielleiter:in" >}}

<label>
  <input type="checkbox">
  Buddy-System, Unterstützung gewünscht
</label>

Pro Spielrunde

Titel + kurze Beschreibung

Genres

Vorauswahl

Sonstiges (Eingabe)

Dauer

Anzahl Spieler (min/max)

{{< /fieldset >}}

{{< fieldset legend="Abschluss" >}}

<label>Helferaufruf</label>
<small>ganz alleine würden wir die Rollenspieltage nicht durchführen können</small>
<label>
  <input type="checkbox">
  Aufbau/Abbau
</label>
<label>
  <input type="checkbox">
  Kasse (Buffet oder Flohmarkt)
</label>
<label>
  <input type="checkbox">
  Küche
</label>

{{< input name="private-message" type="textarea" placeholder="Fragen" label="Noch Fragen?">}}

{{< /fieldset >}}

{{< /form >}}
