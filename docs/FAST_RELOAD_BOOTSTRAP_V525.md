# V525 - Fast reload bootstrap

## Obiettivo

Ridurre il ritardo percepito appena si ricarica la pagina e le piccole esitazioni residue quando si passa rapidamente a Listone o Calciomercato.

## Cosa cambia

- Runtime/cache-buster whole-site portato a `?v=525`.
- Entry point principali con `modulepreload` per `league-config`, `app.js` e `public-data-autoload`.
- `public-data-autoload-v512.js` mantiene gli alias storici e aggiunge `V525`.
- I timer tardivi di boot/load vengono cancellati quando arriva un intento utente esplicito, per esempio click o hashchange.
- I refresh tardivi V511 vengono ignorati se i dati della pagina corrente sono gia renderizzabili.

## Cosa non cambia

- Nessuna scrittura Firebase.
- Nessuna modifica EmailJS.
- Nessuna migrazione dati.
- Nessuna cancellazione dei fallback locali.
- Asset Listoni/Calciomercato ancora centralizzati in `static/fanta-engine/data/shared-assets/current/`.
- `docs/zonaorientale/FUNZIONALITA'.md` non modificato.

## Verifica manuale

1. Aprire ZonaOrientale in finestra anonima o con hard refresh.
2. Ripetere su FantaPetilloMantraManager.
3. Controllare che Network mostri `?v=525` per `app.js` e `public-data-autoload-v512.js`.
4. Passare rapidamente tra Dashboard, Listone e Calciomercato.
5. Verificare che non ci siano errori console e che la pagina non torni a dashboard.
