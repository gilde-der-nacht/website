---
layout: default
title: Mitglied werden
---

# Werde ein Gilde der Nacht Mitglied

{% Form uid="02522b6176808d38d02d70bd158b212e6772e3f542ab7ab19523cb5ab235d21a" %}

{% Input label="Name", name="private-name" %}
{% Textarea label="Adresse", name="private-print-address", required=false %}
{% Input label="Geburtsdatum", name="private-print-birthday", type="date", required=false %}
{% Input label="E-Mail", name="private-email", type="email" %}
{% Input label="Mobil", name="private-print-mobil", type="tel", required=false %}
{% Textarea label="Kommentar", name="private-message", required=false %}
{% HiddenInput name="language", value="de" %}
{% HiddenInput name="redirect", value="https://gildedernacht.ch/mitglied/" %}
{% HiddenInput name="identification", value="https://gildedernacht.ch/mitglied/" %}

{% endForm %}