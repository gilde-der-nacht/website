---
layout: default
eleventyNavigation:
  parent: main
  key: index
  title: Startseite
  order: 1
---

{% Box type="special", link="/en", linkLabel="take me to the English summary" %}
Do you prefer to read up on us in English?
{% endBox %}

# Herzlich willkommen

Die **Gilde der Nacht** organisiert Spieltreffen, an denen alle **Brett-, Rollen- und Tabletop-Spieler:innen** herzlich willkommen sind. Um nichts zu verpassen, empfehlen wir dir, dich in unseren [Erinnerungs-Newsletter](/newsletter) einzutragen.

{% Slider size="small" %}

![2018, Luzerner Rollenspieltag](./images/2018-rollenspieltag.jpg)
![2017, Spieltreffen](./images/2017-spieltreffen.jpg)
![2016, Luzerner Spieltage](./images/2016-spieltage.jpg)
![2014, Spieltreffen](./images/2014-spieltreffen.jpg)

{% endSlider %}

## Kalender

{% ButtonLink link="https://calendar.google.com/calendar/ical/gildedernacht%40gmail.com/public/basic.ics", label="Kalender abonnieren (ICS)" %}

{% EventFilters events=(calendar.items) %}

{% EventList events=(calendar.items) %}
