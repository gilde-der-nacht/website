---
title: "Programm"
date: 2019-06-21
menu:
  main:
    weight: 20
toc: true
---

<template id="calendar-i18n">
    <p data-id="day-0" data-text="Sonntag">-</p>
    <p data-id="day-1" data-text="Montag">-</p>
    <p data-id="day-2" data-text="Dienstag">-</p>
    <p data-id="day-3" data-text="Mittwoch">-</p>
    <p data-id="day-4" data-text="Donnerstag">-</p>
    <p data-id="day-5" data-text="Freitag">-</p>
    <p data-id="day-6" data-text="Samstag">-</p>
    <p data-id="day-7" data-text="Sonntag">-</p>
    <p data-id="month-1" data-text="Januar">-</p>
    <p data-id="month-2" data-text="Februar">-</p>
    <p data-id="month-3" data-text="März">-</p>
    <p data-id="month-4" data-text="April">-</p>
    <p data-id="month-5" data-text="Mai">-</p>
    <p data-id="month-6" data-text="Juni">-</p>
    <p data-id="month-7" data-text="Juli">-</p>
    <p data-id="month-8" data-text="August">-</p>
    <p data-id="month-9" data-text="September">-</p>
    <p data-id="month-10" data-text="Oktober">-</p>
    <p data-id="month-11" data-text="November">-</p>
    <p data-id="month-12" data-text="Dezember">-</p>
    <p data-id="hour" data-text="Uhr">-</p>
</template>

<template id="entry-template">
    <label data-id="container">
        <div class="round-image"></div>
        <div class="round">
            <h1><span data-id="name"></span></h1>
            <p>Uhrzeit: <span data-id="day"></span>, <span data-id="from"></span> &mdash; <span data-id="to"></span></p>
            <p>Spielleiter: <span data-id="gm"></span></p>
            <p><span data-id="game-description"></span></p>
            <p><span data-id="game-tags"></span></p>
        </div>
    </label>
</template>

<div class="c-calendar"></div>

<script src="/scripts/cal-model.js"></script>
<script src="/scripts/cal-view.js"></script>
