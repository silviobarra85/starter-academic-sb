# FUNZIONALITAV361 - Simulatore notifiche trade da interfaccia Admin

Versione: V361
Data: 05/06/2026

## Obiettivo

Rendere piu' semplice il test delle notifiche Fantamercato senza usare la console browser.
La Checklist QA Admin ora include un pannello operativo per simulare e pulire notifiche trade locali.

## Funzionalita' preservate

- Trattative reali Firebase invariate.
- Badge notifiche reali invariati.
- Simulatore V255 preservato.
- Azioni locali V349 preservate.
- Dashboard Presidente invariata.
- Fantamercato interno invariato.
- Admin, Calciomercato, Listone, Rose, Competizioni e mobile navigation invariati.

## Nuove funzioni QA/Admin

Nella Checklist QA Admin, area Fantamercato:

- Simula ricevuta.
- Esito accettato.
- Esito rifiutato.
- Aggiorna badge.
- Pulisci simulazioni.
- Stato simulazioni locali visibile nella card.

Le azioni sono locali e non scrivono su Firebase.

## API runtime

```js
window.ZonaOrientaleTradeSimulatorPanelV361
```

Metodi principali:

```js
getStatus()
simulateIncoming()
simulateResolved('ACCEPTED')
simulateResolved('REJECTED')
refreshBadges()
clearLocalSimulations()
runSmokeTest()
```

## Cosa controllare manualmente

1. Accedere come admin/presidente approvato.
2. Aprire la Checklist QA Admin.
3. Filtrare area Fantamercato.
4. Usare i pulsanti del pannello simulazioni.
5. Verificare che Accetta/Rifiuta sulle simulazioni non producano errore Firebase.
6. Pulire le simulazioni locali e verificare che i badge si aggiornino.
