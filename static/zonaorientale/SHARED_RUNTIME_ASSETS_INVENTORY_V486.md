# V486 - Inventario asset runtime CSS/JS comuni

Data: 24/06/2026

## Obiettivo

Questa patch misura quali asset runtime CSS/JS sono identici tra ZonaOrientale e FantaMantraManager, senza spostarli e senza cambiare i path caricati dalle pagine.

## Risultato

- 60 asset CSS/JS comuni e identici.
- 29 asset con stesso path ma contenuto divergente: restano lega-specifici.
- 10 asset presenti solo in FantaMantraManager: restano lega-specifici.

## Decisione tecnica

Non vengono centralizzati i moduli JS in questa patch, perché diversi moduli usano import relativi e dipendenze incrociate. La centralizzazione va fatta per gradi, iniziando dai CSS comuni o da copie centralizzate con fallback, evitando di rompere il runtime.

## File introdotti

- `static/fanta-engine/data/shared-runtime-assets-inventory-v486.json`
- `static/fanta-engine/tools/audit-shared-runtime-assets-inventory-v486.mjs`

## Funzionalità preservate

Non vengono modificati Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, News, Regolamenti, Bilanci, Listone, Calciomercato o dati specifici di lega.
