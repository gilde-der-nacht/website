---
title: "Anmeldung"
slug: "anmeldung"
aliases:
  - /registration/
date: 2021-05-29
scripts:
  - 'apollon'
---

{{< form uid="38f8295ff8bebc869daa5d83466af523c9a1491a19302a2e7dfc0f2ec1692bdf" >}} 

{{< input name="private-name" type="text" placeholder="Name" label="Name *" attributes="required">}} 
{{< input name="private-email" type="email" placeholder="E-Mail" label="E-Mail *" attributes="required">}} 

<label>
  <input type="checkbox" active>
  Spieler:in
</label>

<label>
  <input type="checkbox">
  Spielleiter:in
</label>

<label>
  mehr Spielen
  <input type="range" id="balance" name="balance" min="0" max="2">
  mehr Spielleiten
</label>

{{< input name="private-message" type="textarea" placeholder="Fragen" label="Noch Fragen?">}} 

{{< /form >}}
