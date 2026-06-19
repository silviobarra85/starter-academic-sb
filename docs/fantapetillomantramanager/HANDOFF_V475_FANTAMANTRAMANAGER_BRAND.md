# Handoff V475 - FantaMantraManager branding

## Stato di partenza
La lega clone era pubblicata nella cartella `fantapetillomantramanager` con nome pubblico `FantaPetilloMantraManager`. Dopo V474 la pagina regolamento puntava al PDF 2026-2027 e non doveva essere toccata ZonaOrientale.

## Richiesta utente
- Rinominare il fanta in `FantaMantraManager`.
- Inserire il logo fornito dall'utente accanto al nome nella dashboard.
- Rimuovere dalla dashboard la scritta `LEGA FANTACALCIO IN CONFIGURAZIONE`.
- Usare lo stesso logo come favicon.
- Modifica solo FantaMantraManager/FantaPetillo, nessun intervento su ZonaOrientale.
- Overlay con soli file effettivamente modificati.

## Implementazione
- Nome pubblico aggiornato in HTML fallback, metadata, config runtime e manifest.
- Slug e URL restano `fantapetillomantramanager` per evitare rotture di link, redirect Netlify, Firebase e dati gia' configurati.
- Logo generato da `/mnt/data/Fantra Mantra Manager.png` in formati dashboard, favicon, Apple Touch e Android Chrome.
- Aggiunto CSS dedicato `assets/css/fantamantramanager-brand-v475.css` per il layout logo+titolo.
- Aggiornato footer/cache-buster a V475 sui file FantaMantraManager modificati.
- Aggiunto audit `tools/audit-brand-v475.mjs`.

## Funzionalita' da preservare
- Footer/news isolation V472.
- Tool sorteggio giornate V473.
- Regolamento PDF V474.
- Admin/bootstrap/Firebase dedicato esistente.
- Area Squadra ancora protetta secondo stato precedente.
- Device badge V434 mantenuto.

## Verifica consigliata
Da `static/fantapetillomantramanager` eseguire:

```bash
node tools/audit-brand-v475.mjs
```

Controllare poi in browser:
- titolo dashboard `FantaMantraManager`;
- logo accanto al nome;
- assenza della dicitura `LEGA FANTACALCIO IN CONFIGURAZIONE`;
- favicon aggiornata dopo refresh/cache hard reload.
