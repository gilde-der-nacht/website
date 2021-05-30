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

{{< form/text-input name="private-name" type="text" placeholder="Name" label="Name" required="true" >}}

{{< form/text-input name="private-email" type="email" placeholder="E-Mail" label="E-Mail" required="true">}}

{{< form/group label="Anmeldung als" description="treffe bitte mindestens eine Auswahl" >}}

{{< form/checkbox name="private-participant-role" label="Spieler:in" checked="true">}}

{{< form/checkbox name="private-gamemaster-role" label="Spielleiter:in" >}}

{{< /form/group >}}

{{< form/slider label="Wähle deine Balance" name="participant-gamemaster-balance" steps="3" left="Spielen" right="Spielleiten" >}}

{{< form/group label="Sprache" description="treffe bitte mindestens eine Auswahl" >}}

{{< form/checkbox name="private-language-german" label="Deutsch" checked="true">}}

{{< form/checkbox name="private-language-english" label="Englisch" >}}

{{< /form/group >}}

Zeitfenster (1 Stunden Slots)

{{< /form/fieldset >}}

{{< form/fieldset legend="Spieler:in" >}}

{{< form/radio-group label="Arten von Spielrunden" name="gameround-types">}}
  {{< form/radio name="short" label="kurze aber viele Spielrunden">}}
  {{< form/radio name="long" label="lange aber wenige Spielrunden">}}
  {{< form/radio name="not-matter" label="egal" checked="true">}}
{{< /form/radio-group >}}

{{< form/multi-skala label="Genres">}}

  {{< form/multi-skala-header >}}

    {{< form/multi-skala-header-icon icon="thumbs-up" label="Gerne" >}}
    {{< form/multi-skala-header-icon icon="hashtag" label="Egal" >}}
    {{< form/multi-skala-header-icon icon="thumbs-down" label="lieber nicht" >}}

  {{< /form/multi-skala-header >}}

{{< /form/multi-skala >}}

Genres (Skala Gerne-Egal-Lieber nicht)
* Vorauswahl
* Sonstiges (Eingabe)

Workshops/Diskussionsrunden (Skala Gerne-Egal-Lieber nicht)
* Vorauswahl
* Sonstiges (Eingabe)

{{< form/text-input name="private-companions" type="number" label="Beigleitpersonen" value="0" >}}

{{< /form/fieldset >}}

{{< form/fieldset legend="Spielleiter:in" >}}

{{< form/checkbox name="private-gamemaster-buddy" label="Buddy-System, Unterstützung gewünscht" >}}

{{< form/text-input name="private-game-title" placeholder="Titel" type="text" label="Titel" required="true">}}

{{< form/textarea name="private-game-description" placeholder="Beschreibung" label="Beschreibung">}}

Genres
* Vorauswahl
* Sonstiges (Eingabe)

{{< form/text-input name="private-game-duration" type="number" label="Dauer (in Stunden)" required="true" value="3" >}}

{{< form/group label="Anzahl Spieler:innen" description="treffe bitte mindestens eine Auswahl" >}}

{{< form/text-input name="private-game-playercount-min" type="number" label="Minimum" required="true" value="2" >}}

{{< form/text-input name="private-game-playercount-max" type="number" label="Maximum" required="true" value="5" >}}

{{< /form/group >}}

{{< form/text-input name="private-game-slots-reserved" type="number" label="Stammspieler" value="0" >}}

{{< /form/fieldset >}}

{{< form/fieldset legend="Abschluss" >}}

{{< form/group label="Helferaufruf" description="ganz alleine würden wir die Rollenspieltage nicht durchführen können" >}}

{{< form/checkbox name="private-helper-logistic" label="Aufbau/Abbau" >}}

{{< form/checkbox name="private-helper-checkout" label="Kasse (Buffet oder Flohmarkt)" >}}

{{< form/checkbox name="private-helper-kitchen" label="Küche" >}}

{{< /form/group >}}

{{< form/textarea name="private-message" placeholder="Fragen" label="Noch Fragen?">}}

{{< /form/fieldset >}}

{{< /form/form >}}
