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

## Kalender

{% EventFilters events=(calendar.items) %}

{% EventList events=(calendar.items) %}
