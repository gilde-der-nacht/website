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

{{< form/text-input name="name" type="text" placeholder="Name" label="Name" required="true" >}}

{{< form/text-input name="email" type="email" placeholder="E-Mail" label="E-Mail" required="true" >}}

{{< form/group label="Anmeldung als" description="treffe bitte mindestens eine Auswahl" >}}
  {{< form/checkbox name="participant-role" label="Spieler:in" checked="true" >}}
  {{< form/checkbox name="gamemaster-role" label="Spielleiter:in" >}}
{{< /form/group >}}

{{< form/slider label="Wähle deine Balance" name="participant-gamemaster-balance" steps="3" left="Spielen" right="Spielleiten" >}}

{{< form/group label="Sprache" description="treffe bitte mindestens eine Auswahl" >}}
  {{< form/checkbox name="language-german" label="Deutsch" checked="true" >}}
  {{< form/checkbox name="language-english" label="Englisch" >}}
{{< /form/group >}}

{{< form/calendar label="Samstag" name="saturday" >}}
  {{< form/calendar-slot label="10 Uhr" name="10" >}}
  {{< form/calendar-slot label="11 Uhr" name="11" >}}
{{< /form/calendar >}}

{{< form/calendar label="Sonntag" name="sunday" >}}
  {{< form/calendar-slot label="10 Uhr" name="10" >}}
  {{< form/calendar-slot label="11 Uhr" name="11" >}}
{{< /form/calendar >}}

{{< /form/fieldset >}}

{{< form/fieldset legend="Spieler:in" name="player-fieldset" >}}

{{< form/radio-group label="Arten von Spielrunden" name="gameround-types" >}}
  {{< form/radio name="short" label="kurze aber viele Spielrunden" >}}
  {{< form/radio name="long" label="lange aber wenige Spielrunden" >}}
  {{< form/radio name="matter-not" label="egal" checked="true" >}}
{{< /form/radio-group >}}

{{< form/multi-skala/multi-skala label="Genres" >}}

  {{< form/multi-skala/header >}}

    {{< form/multi-skala/header-icon icon="check-circle" label="Gerne" >}}
    {{< form/multi-skala/header-icon icon="dot-circle" label="Egal" >}}
    {{< form/multi-skala/header-icon icon="times-circle" label="lieber nicht" >}}

  {{< /form/multi-skala/header >}}

  {{< form/multi-skala/entry label="Fantasy" name="fantasy" >}}

    {{< form/multi-skala/entry-option name="like" >}}
    {{< form/multi-skala/entry-option name="matter-not" checked="true" >}}
    {{< form/multi-skala/entry-option name="not-like" >}}

  {{< /form/multi-skala/entry >}}

  {{< form/multi-skala/entry label="Sci-Fi" name="scifi" >}}

    {{< form/multi-skala/entry-option name="like" >}}
    {{< form/multi-skala/entry-option name="matter-not" checked="true" >}}
    {{< form/multi-skala/entry-option name="not-like" >}}

  {{< /form/multi-skala/entry >}}

  {{< form/multi-skala/entry-input label="Vermisst du ein Genre?" name="player-genre" >}}

    {{< form/multi-skala/entry-option name="like" checked="true" >}}
    {{< form/multi-skala/entry-option name="matter-not" >}}
    {{< form/multi-skala/entry-option name="not-like" >}}

  {{< /form/multi-skala/entry-input >}}

{{< /form/multi-skala/multi-skala >}}

{{< form/multi-skala/multi-skala label="Workshops/Diskussionsrunden" >}}

  {{< form/multi-skala/header >}}

    {{< form/multi-skala/header-icon icon="check-circle" label="Gerne" >}}
    {{< form/multi-skala/header-icon icon="times-circle" label="lieber nicht" >}}

  {{< /form/multi-skala/header >}}

  {{< form/multi-skala/entry label="Spielleiter Workshop" name="game-master-workshop" >}}

    {{< form/multi-skala/entry-option name="like" >}}
    {{< form/multi-skala/entry-option name="not-like" checked="true" >}}

  {{< /form/multi-skala/entry >}}

  {{< form/multi-skala/entry-input label="Hast du Interesse an einem hier nicht aufgeführten Workshop/Dikussionsrunde?" name="player-workshop" >}}

    {{< form/multi-skala/entry-option name="like" checked="true" >}}
    {{< form/multi-skala/entry-option name="not-like" >}}

  {{< /form/multi-skala/entry-input >}}

{{< /form/multi-skala/multi-skala >}}

{{< form/text-input name="companions" type="number" label="Beigleitpersonen" value="0" >}}

{{< /form/fieldset >}}

{{< form/fieldset legend="Spielleiter:in" name="gamemaster-fieldset" >}}

{{< form/checkbox name="gamemaster-buddy" label="Buddy-System, Unterstützung gewünscht" >}}

{{< form/text-input name="game-title" placeholder="Titel" type="text" label="Titel" >}}

{{< form/textarea name="game-description" placeholder="Beschreibung" label="Beschreibung" >}}

{{< form/group label="Genres" description="treffe bitte mindestens eine Auswahl" >}}
  {{< form/checkbox name="fantasy" label="Fantasy" >}}
  {{< form/checkbox name="scifi" label="Sci-Fi" >}}
  {{< form/checkbox-entry label="Vermisst du ein Genre?" >}}
{{< /form/group >}}

{{< form/text-input name="game-duration" type="number" label="Dauer (in Stunden)" required="true" value="3" >}}

{{< form/group label="Anzahl Spieler:innen" description="treffe bitte mindestens eine Auswahl" >}}

{{< form/text-input name="game-playercount-min" type="number" label="Minimum" required="true" value="2" >}}

{{< form/text-input name="game-playercount-max" type="number" label="Maximum" required="true" value="5" >}}

{{< /form/group >}}

{{< form/text-input name="game-slots-reserved" type="number" label="Stammspieler" value="0" >}}

{{< /form/fieldset >}}

{{< form/fieldset name="no-role-selected-fieldset" >}}
  <p>Bitte wähle aus, ob du als Spieler:in und/oder Spielleiter:in teilnehmen möchtest.</p>
{{< /form/fieldset >}}

{{< form/fieldset >}}

{{< form/group label="Helferaufruf" description="ganz alleine würden wir die Rollenspieltage nicht durchführen können" >}}

{{< form/checkbox name="helper-logistic" label="Aufbau/Abbau" >}}

{{< form/checkbox name="helper-checkout" label="Kasse (Buffet oder Flohmarkt)" >}}

{{< form/checkbox name="helper-kitchen" label="Küche" >}}

{{< /form/group >}}

{{< form/textarea name="message" placeholder="Fragen" label="Noch Fragen?" >}}

{{< /form/fieldset >}}

{{< /form/form >}}

<pre id="output"></pre>
