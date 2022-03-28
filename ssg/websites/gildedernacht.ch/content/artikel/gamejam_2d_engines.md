---
title: "GameJam 2D Engines"
date: 2022-02-02
---

# GameJam 2D Engines

[[toc]]

## Gedanken

- Gibt es ein paar einfach zu verstehende, aber auch umfangreichere Tutorials?
- Gibt es eine Dokumentation zu den Funktionen? Beispiele in der Dokumentation?
- Wird die Software noch weiterenwickelt?
- Gibt es eine Community die einem weiterhelfen könnte?
- Gibt es spezifische Unterstützung für 2D?
- Was hat die Software für Funktionen? Grafik? Sound/Musik? Text? Netzwerk? Animation? Dialog? Partikel Effekte? Debugging? Performance Monitor? State Handling?
- Gibt es die Möglichkeit Logik umzusetzen ohne eine Programmiersprache zu kennen?
- Falls die Software eine Programmiersprache verwendet, ist es eine Sprache die bekannt ist?
- Wie lange dauert es wenn man eine kleine Änderung an der Logik vornimmt, bis man das Resultat auf dem Bildschirm ausprobieren kann? (Edit-Compile-Run Cycle)
- Wie kompliziert und zeitaufwändig ist es ein "Hello World" Beispiel umzusetzen?
- Ist es gut möglich das Resultat auf einer Webseite laufen zu lassen?

Weiterführendes

- Kann ich die Engine selber erweitern?
- Kann ich bei Problemen selber aktiv werden und eventuell sogar ein Patch submitten?
- Muss ich zusätzliche Software installieren damit ich die Engine ausprobieren kann?
- Ist ein Pfad denkbar zu einer anderen Engine?

## Engines

| Name | Link | OpenSource | IDE | Entwicklungssprache |
| - | - | - | - | - |
| ct.js | [ctjs.rocks](https://ctjs.rocks/) | Ja [github.com](https://github.com/ct-js) | Ja | JavaScript |
| Phaser | [phaser.io](https://phaser.io) | Ja [github.com](https://github.com/photonstorm/phaser) | Teilweise | JavaScript |
| PixiJS | [pixijs.com](https://pixijs.com) | Ja [github.com](https://github.com/pixijs) | Nein | JavaScript |
| GDevelop | [gdevelop.io](https://gdevelop.io) | Ja [github.com](https://github.com/4ian/GDevelop) | Ja | Event/Action Board, JavaScript |
| Godot | [godotengine.org](https://godotengine.org/) | Ja [github.com](https://github.com/) | Ja | GDScript, C#, C++, Visual Scripting |
| Impact | [impactjs.com](https://impactjs.com) | ??? [github.com](https://github.com/phoboslab/Impact) | Teilweise | JavaScript |
| Melon JS | [melonjs.org](https://www.melonjs.org) | Ja [github.com](https://github.com/melonjs/melonJS) | Nein | JavaScript |
| LÖVE | [love2d.org](https://love2d.org/) | Ja [github.com](https://github.com/love2d/love) | Nein | Lua |
| Unity | [unity.com](https://unity.com) | Nein | Ja | C# |
| Construct 3 | [construct.net](https://www.construct.net) | Nein | Ja | Block Based, JavaScript |
| Clickteam Fusion 2.5 | [clickteam.com](https://www.clickteam.com) | Nein | Ja | Event Editor |
| GameMaker Studio 2 | [yoyogames.com](https://www.yoyogames.com/en/gamemaker) | Nein | Ja | GML, DND |
| Cocos Creator | [cocos.com](https://www.cocos.com/en/creator/download) | ??? | Ja |??? |

## Anmerkungen

Eine lose und opinionated Sammlung von Fragen und Gedanken zu den jeweiligen Engines.

- ct.js
  - Verwendet intern PixiJS.
  - Verwendet nicht übliche Begriffe wie Scene, Map, Sprite, ... und erwähnt das auch in der Dokumentation. Grund?
  - Der Edit/Compile/Run-Loop dauert länger als z.B. bei GDevelop oder Godot, und das obwohl es eigentlich Engine explizit für HTML5 ist.
  - Text Objekte können nur im Code erstellt werden.
  - Hat ein tween Beispiel wo "then" verwendet wird, was ein Hinweis sein könnte dass man async/await noch nicht kennt? Auch wenn man await verwendet gibt es ein Fehler, weil z.B. OnCreate nicht mit async markiert ist.
  - Kann man Objekte in einem Room wirklich nicht manuell verschieben?
  - Scheint keinen eigenen Loop für Physik/Collision zu haben, d.h. wahrscheinlich wird alles von der Framerate abhängig gemacht, was gefährlich ist.
- Melon JS
  - Direkter Support für Tilemaps wie sie in [Tiled](https://www.mapeditor.org) erstellt werden.
- Unity
  - Man muss zuerst ein Unity Konto erstellen, dann den Unity Hub herunterladen, um dann die Engine herunterzuladen und zu installieren.
  - Ein leeres Projekt ist einige MB gross (2022-02-02 ein leeres Core 2D ist 130 MB) und hat hunderte von Dateien. Die [gitignore](https://github.com/github/gitignore/blob/main/Unity.gitignore) Datei die GitHub offiziell vorschlägt ist verhältnismässig gross. Eventuell wird man git LFS benötigen.
  - Kleine Änderung z.B. an einer Scene, führen oft dazu dass sich eine Datei teilweise komplett ändert (es gibt keine unification) was die Verwendung von git/diffs nicht vereinfacht.
  - Man braucht zusätzlich einen Code Editor (z.B. Visual Studio Code) wenn man in C# entwickeln möchte.
  - Man merkt immer wieder dass die Engine intern alles in 3D Koordinaten hält. Wenn man etwas in 2D animiert, sieht man trotzdem 3D Koordinaten. Partikel Effekte z.B. gibt es auch nur in 3D.
  - Hat neben dem Render-Loop auch ein Physics-Loop.
  - Mit der 2011 Version (bei 2010 ein Package) hat ein Visual Programming Modul mit dem man Scripts und auch State Diagramme machen kann. Der erste Eindruck war, dass das einen guten Stand hat.
  - Wenn man ein GameObject, mit all seinen Components mehrmals verwenden möchte, macht man daraus ein Prefab.
  - Hat ein ECS, und umgeht damit einige Nachteile wenn man nur auf Inheritance setzt (Wie das z.B. Godot macht).
- Godot
  - Setzt nahezu überall auf das Konzept der Vererbung. Es wird in der Dokumentation auch versucht diese Designentscheidung zu verteidigen. "Vererbung" versucht die Softwarentwicklung aber schon länger zu vermeiden. Als Alternative wird oft "Composition over Inhertiance" erwähnt auch schon im Buch "Design Pattern" von 1994. Ein ECS System wie das von Unity, folgt ebenfalls diesem Prinzip.
  - Hat ein Visual Programming Editor. Das hat zwar funktioniert, aber fühlte sich teilweise an dass einfache Dinge mühsamer waren als man das vielleicht erwarten würde.
- Phaser
  - Benötigt einen Webserver (z.B. Live Server in Visual Studio Code).
  - Für Phaser alleine verwendet man seinen eigenen Standard Entwicklungseditor (z.B. Visual Studio Code).
  - "Hello World" hat wenige Zeilen Code, die eher deklarativ sind. Später wird das aber schnell eine Mischung aus deklarativer und nicht deklarativer Programmierung (update Methode).
  - Hat viele Beispiele (> 1700) die man Online ausprobieren und verändern kann.
  - Die kostenlosten Version des [Editors](https://phasereditor2d.com/pricing/) ist eingeschränkt.
  - Verwendet intern PixiJS.
  - Bei Events wird die Event Source nicht mitgegeben, wie das sonst Event System oft der Fall, womit es mühsamer wird ein Event generisch zu schreiben (z.B. mit Closures).
  - Dokumentation bescheibt zwar Klassen, aber die Methoden der Klassen werden in den Beispielen selten direkt verwendet sondern immer indirekt. Auch das instanzieren erfolgt meistens indirekt. Es fühlt sich komisch an, dass für die Instanzierung von Klassen oft mehrere Optionen vorhanden sind. Die Dokumentation selber hat keine Beispiele, so dass oft nicht klar ist wie man etwas verwendet.
- Construct 3
  - Es gibt ein JavaScript SDK um die Engine zu erweitern.
  - Unklar ob es bei der kostenlose Variante überhaupt möglich ist ein Spiel auf eine Webseite zu laden.
  - Education Edition wäre ab ca. 30 CHF / Person zu haben.
- GameMaker Studio 2
  - Free Edition hat kein Web Export.
  - GML erinnert im ersten Moment etwas an Java
  - DND ist ein Block basierter Editor der aber eine Programmiersprache 1:1 versucht abzubilden (switch, if, variablen, ...).
- Impact
  - Es gibt ein Leveleditor (Weltmeister)
- GDevelop
  - Rotationen gehen im Uhrzeigersinn, was wahrscheinlich anders ist als bei der grossen Mehrheit. Das könnte unter Umständen für Änfänger einfacher sein, weil es wie eine Uhr ist, aber dann wäre es konsequenter gewesen die 0° dann auch oben zu machen, was aber nicht der Fall ist.
  - Eine Änderung im Event Board kann man sofort ausprobieren, ohne etwas zu speichern.
  - Es scheint relativ aufwändig automatisch Aktionen nacheinander ausführen zu lassen z.B. Führe Tween-1 dann Tween-2 und dann Tween-3  aus.
- Cocos Creator
  - Software muss über ein zusätzliche Software (wie Unity) runtergeladen werden.
  - Editor scheint für Windows oder Mac zu funktionieren.
- Three.JS
  - Ist als Beispiel hier wie eine Dokumentation aussehen könnte.
  - Ist eher aus das 3D Rendering allein spezialisiert, keine dedizierte Game Engine.
  - Sehr übersichtliche Dokumentation, wo jede Klasse ein kleines Beispiel hat.
  - Viele gute Beispiele, mit unterschiedlichen Komplexitätsstufen.
- Pixi.JS
  - Ebenfalls wie Three.JS, eine sehr gute Dokumentation und viele gute Beispiele.
  - Ist eher auf das 2D Rendering spezialisiert, keine dedizierte Game Engine.
