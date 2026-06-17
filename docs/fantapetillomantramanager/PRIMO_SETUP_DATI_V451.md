# V451 - Primo setup dati FantaPetilloMantraManager

Stato: Admin abilitato, Firebase dedicato collegato, Area Squadra ancora protetta.

## Obiettivo

Usare l'Admin del clone per sostituire i dati placeholder con dati reali minimi, senza sbloccare ancora l'Area Squadra presidenti.

## Ordine consigliato in Admin

1. Apri `/fantapetillomantramanager/#admin` e accedi con il primo admin.
2. Controlla il pannello `Checklist FantaPetilloMantraManager` aggiunto in V451.
3. In `Stagioni`, conferma o modifica `2025-2026` e imposta il numero squadre partecipanti.
4. In `Presidenti`, inserisci tutti i presidenti.
5. In `Squadre`, inserisci le squadre madri e i loghi come nome file in `assets/logos/` se gia disponibili.
6. In `Squadre per stagione`, associa le squadre alla stagione corrente.
7. In `Stadi`, inserisci i dati disponibili.
8. In `Snapshot pubblici`, esegui `Aggiorna tutto`.
9. Scarica overlay snapshot e applicalo alla repo.
10. Esegui i test e committa.

## Cosa non fare ancora

- Non sbloccare Area Squadra presidenti.
- Non creare `teamUsers` finche i presidenti/squadre non sono definiti.
- Non togliere `noindex,nofollow`.
- Non eliminare le rules V450: restano quelle consigliate.

## File aggiunti in V451

```text
static/fantapetillomantramanager/assets/js/core/fanta-petillo-admin-onboarding-v451.js
static/fantapetillomantramanager/tools/audit-admin-onboarding-v451.mjs
static/fantapetillomantramanager/tools/fantapetillo-setup-checklist-v451.json
static/zonaorientale/tools/audit-fantapetillo-admin-onboarding-v451.mjs
```

## Stato sicurezza

L'onboarding V451 e' solo una guida runtime: non scrive su Firebase e non sblocca Area Squadra. Le scritture restano quelle dell'Admin gia autorizzate dalle rules V450.
