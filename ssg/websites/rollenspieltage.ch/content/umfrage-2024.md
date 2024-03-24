---
layout: default
title: Umfrage 2024
---

# Umfrage 2024

Wir haben zwei Fragen an dich. Bitte beantworte uns diese, damit wir den Event gemeinsam gestalten können.

Versetze dich in die beiden Rollen und schreib auf, was du in dieser Rolle erleben/tun möchtest. Es gibt keine Einschränkungen.

{% Form uid="02522b6176808d38d02d70bd158b212e6772e3f542ab7ab19523cb5ab235d21a" %}

Frage 1: als Besucher:in

{% Textarea label="Was erwartest du von den Rollenspieltagen? Was möchtest du da erleben? Weswegen gehst du hin?", name="private-visitor", required=false %}

Frage 2: als Macher:in

{% Textarea label="Was könntest/möchtest du anbieten? Was würdest du organisieren, wenn alles möglich wäre?", name="private-gamemaster", required=false %}

Kontaktdaten

{% Input label="Name", name="public-name" %}

{% Input label="E-Mail-Adresse", type="email", name="public-email" %}

{% HiddenInput name="language", value="de" %}
{% HiddenInput name="redirect", value="https://rollenspieltage.ch/umfrage-2024/" %}
{% HiddenInput name="identification", value="https://rollenspieltage.ch/umfrage-2024/" %}

{% endForm %}