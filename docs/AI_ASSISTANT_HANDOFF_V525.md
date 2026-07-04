# AI handoff V525 - Fast reload bootstrap

Overlay whole-site applicabile con un solo giro di comandi.

## Scope

V525 e' una patch di stabilizzazione boot/performance percepita. Non e' ancora l'adapter dati multi-season: quello slitta a V526 per evitare di sommare migrazione dati e ottimizzazione reload nello stesso overlay.

## Guardrail

- Non modificare `FUNZIONALITA'.md`.
- Non rimuovere fallback locali Listoni/Calciomercato.
- Non cambiare Firebase, EmailJS o ruoli admin/presidente.
- Conservare overlay unico `static/` + `docs/` con soli file modificati.

## Prossimo overlay

V526 - Adapter dati multi-season.
