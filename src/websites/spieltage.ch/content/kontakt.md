---
layout: default
title: Kontakt
eleventyNavigation:
  key: contact
  title: Kontakt
  order: 9
---

# Kontakt

Schreib uns doch was Nettes:

{% Form uid="02522b6176808d38d02d70bd158b212e6772e3f542ab7ab19523cb5ab235d21a" %}

{% Input label="Name", name="private-name" %}
{% Input label="E-Mail", name="private-email", type="email" %}
{% Textarea label="Nachricht", name="private-message" %}

{% endForm %}
