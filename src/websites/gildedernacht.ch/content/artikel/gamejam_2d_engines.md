---
title: "GameJam 2D Engines"
date: 2021-10-08
---

# GameJam 2D Engines

[[toc]]

## Gedanken

- Gibt es ein paar einfach zu verstehende, aber auch umfangreichere Tutorials?
- Gibt es eine Dokumentation zu allen Funktionen? Beispiele in der Dokumentation?
- Wird die Engine noch weiterenwickelt?
- Kann ich die Engine selber erweitern?
- Was hat die Engine für Funktionen? Grafik? Sound? Musik? Text? Netzwerk? Animation? Dialog? Partikel Effekte? Debugging? Performance? State Handling?
- Kann ich bei Problemen selber aktiv werden und eventuell sogar ein Patch submitten?
- Muss ich zusätzliche Software installieren damit ich die Engine ausprobieren kann?
- Ist es möglich die Engine ohne C/C++ Kentnisse zu verwenden?
- Ist ein Pfad denkbar zu einer anderen Engine?
- Falls die Engine eine Scriptsprache verwendet, ist es eine Sprache die auch sonst bekannt ist?
- Wie lange dauert es wenn man eine kleine Änderung an der Logik vornimmt, bis man das Resultat auf dem Bildschirm ausprobieren kann? (Edit-Compile-Run Cycle)

## Engines

| Name | Link | OpenSource | IDE | Entwicklungssprache |
| - | - | - | - | - |
| ct.js | [ctjs.rocks](https://ctjs.rocks/) | Ja [github.com](https://github.com/ct-js) | Ja | JavaScript |
| Phaser | [phaser.io](https://phaser.io) | Ja [github.com](https://github.com/photonstorm/phaser) | Teilweise | JavaScript |
| PixiJS | [pixijs.com](https://pixijs.com) | Ja [github.com](https://github.com/pixijs) | Nein | JavaScript |
| GDevelop | [gdevelop.io](https://gdevelop.io) | Ja [github.com](https://github.com/4ian/GDevelop) | Ja | Event/Action Board, JavaScript |
| Godot Engine | [godotengine.org](https://godotengine.org/) | Ja [github.com](https://github.com/) | Ja | GDScript, C#, C++, Visual Scripting |
| Impact | [impactjs.com](https://impactjs.com) | ??? [github.com](https://github.com/phoboslab/Impact) | Teilweise | JavaScript |
| Melon JS | [melonjs.org](https://www.melonjs.org) | Ja [github.com](https://github.com/melonjs/melonJS) | Nein | JavaScript |
| LÖVE | [love2d.org](https://love2d.org/) | Ja [github.com](https://github.com/love2d/love) | Nein | Lua |
| Unity | [unity.com](https://unity.com) | Nein | Ja | C# |
| Construct 3 | [construct.net](https://www.construct.net) | Nein | Ja | Block Based, JavaScript |
| Clickteam Fusion 2.5 | [clickteam.com](https://www.clickteam.com) | Nein | Ja | Event Editor |
| GameMaker Studio 2 | [yoyogames.com](https://www.yoyogames.com/en/gamemaker) | Nein | Ja | GML, DND |
| Cocos2D | [cocos.com](https://www.cocos.com/en/cocos2dx) | Nein | ??? |??? |

## Anmerkungen

- ct.js
  - Verwendet intern PixiJS.
  - Verwendet nicht übliche Begriffe wie Scene, Map, Sprite, ... und erwähnt das auch in der Dokumentation. Grund?
  - Der Write/Run/Play-Loop dauert relativ lange.
  - Text Objekte können nur im Code erstellt werden.
  - Hat ein tween Beispiel wo then verwendet wird, was ein Hinweis sein könnte dass man async/await noch nicht kennt? Auch wenn man await verwendet gibt es ein Fehler, weil z.B. OnCreate nicht mit async markiert ist.
  - Kann man Objekte in einem Room wirklich nicht manuell verschieben?
- PixiJS
  - Nicht spezifisch eine Game Engine.
- Melon JS
  - Direkter Support für Tilemaps wie sie in [Tiled](https://www.mapeditor.org) erstellt werden.
- Unity
  - Ein leeres Projekt ist einige MB gross (Thomas: meines war 200 MB, stimmt das?) und hat hunderte von Dateien. Die [gitignore](https://github.com/github/gitignore/blob/main/Unity.gitignore) Datei die GitHub offiziell vorschlägt ist verhältnismässig gross.
- Phaser
  - Benötigt einen Webserver (z.B. Live Server in Visual Studio Code).
  - Für Phaser alleine verwendet man seinen eigenen Standard Entwicklungseditor (z.B. Visual Studio Code).
  - "Hello World" hat wenige Zeilen Code, die eher deklarativ sind. Später wird das aber schnell eine Mischung aus deklarativer und nicht deklarativer Programmierung (update Methode).
  - Hat viele Beispiele (> 1700) die man Online ausprobieren und verändern kann.
  - Die kostenlosten Version des [Editors](https://phasereditor2d.com/pricing/) ist eingeschränkt.
  - Verwendet intern PixiJS.
  - Bei Events wird die Event Source nicht mitgegeben, wie das sonst solche Event System oft machen, womit es mühsamer wird ein Event generisch zu schreiben, weil man immer manuell muss (Closure, ...).
  - Dokumentation bescheibt zwar Klassen, aber die Methoden der Klassen werden in den Beispielen selten direkt verwendet sondern immer indirekt. Auch das instanzieren erfolgt meistens indirekt. Es fühlt sich komisch an, dass für die Instanzierung von Klassen oft mehrere Optionen vorhanden sind. Die Dokumentation selber hat keine Beispiele, so dass oft nicht klar ist wie man etwas verwendet.
- Construct 3
  - Es gibt ein JavaScript SDK um die Engine zu erweitern.
  - Unklar ob es bei der kostenlose Variante überhaupt möglich ist ein Spiel auf eine Webseite zu laden.
  - Education Edition ist ab ca. 30 CHF / Monat zu haben.
- GameMaker Studio 2
  - Free Edition hat kein Web Export.
  - GML erinnert im ersten Moment etwas an Java
  - DND ist ein Block basierter Editor der aber eine Programmiersprache 1:1 versucht abzubilden (switch, if, variablen, ...).
- Impact
  - Es gibt ein Leveleditor (Weltmeister)
- GDevelop
  - Rotationen gehen im Uhrzeigersinn, was wahrscheinlich anderst ist als bei der grossen Mehrheit. Das könnte unter Umständen für Änfänger einfacher sein, weil es wie eine Uhr ist, aber dann wäre es konsequenter gewesen die 0° dann auch oben zu machen, was aber nicht der Fall ist.
  - Eine Änderung im Event Board kann man sofort ausprobieren, ohne etwas zu speichern.
  - Es scheint relativ aufwändig automatisch Aktionen nacheinander ausführen zu lassen z.B. Führe Tween-1 dann Tween-2 und dann Tween-3 aus.
- Three.JS
  - Ist eher für 3D, ist als Beispiel hier wie eine Dokumentation aussehen könnte.
  - Sehr übersichtliche Dokumentation, wo jede Klasse ein kleines Beispiel hat.
  - Viele gute Beispiele, mit unterschiedlichen Komplexitätsstufen.
