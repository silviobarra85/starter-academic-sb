## Aggiornamento V273

Il test end-to-end del Listone con Excel reale e' documentato in `docs/zonaorientale/listoni/LISTONE_TEST_REALE_V273.md`. Esito: formato Classic riconosciuto, 663 giocatori convertibili, confronto con `2026-05-15` funzionante, normalizzazione squadre aggiunta per evitare falsi cambi squadra.

# Handoff nuovo assistente AI - ZonaOrientale V272

Questo documento contiene le istruzioni da dare a un eventuale nuovo assistente AI per ripartire dal punto corrente senza perdere funzionalita.

## 1. File da passare al nuovo assistente

Passare sempre gli zip aggiornati:

```text
zonaorientale.zip
docs.zip
```

Se il task riguarda listoni, passare anche l'Excel reale usato in Admin -> Converti listone Excel.

Se il task riguarda notifiche trattative/Firebase, passare anche:

```text
docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V257.rules
docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V257_TRANSFER_NOTIFICATIONS.rules
```

## 2. Contesto repo

Repo reale:

```text
starter-academic-sb
```

Webapp:

```text
static/zonaorientale/
```

Documentazione:

```text
docs/zonaorientale/
```

Branch corrente:

```text
refactor/260528-zonaorientale-next
```

Versione runtime corrente dopo questo overlay:

```text
V274 codici squadre listone
```

## 3. Regole dell'utente da rispettare

- Consegnare sempre un solo zip overlay.
- Lo zip deve contenere le radici `zonaorientale/` e `docs/`.
- Quando si modifica codice/UI aggiornare sempre:
  - footer `Version` negli HTML;
  - cache-buster `?v=...`;
  - `DEPLOY_EXPECTED_VERSION_V181` in `assets/app.js`;
  - handoff e changelog/documentazione operativa.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita dell'utente.
- Per il progetto fantacalcio, alla consegna includere sempre i comandi Git e un messaggio commit coerente.
- I comandi locali standard sono:

```bash
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Aprire:

```text
http://localhost:1313/zonaorientale/
```

## 4. Funzionalita critiche da non perdere

### Pubblico

- Dashboard stagione.
- News e comunicati.
- Link WhatsApp news via `/zonaorientale/share/news/<id>`.
- Home con anteprima WhatsApp generica, non ultima news.
- Rose, movimenti, listone, competizioni, statistiche, archivio, confronto, regolamento.

### Presidente

- Login email/password e Google.
- Dashboard Presidente.
- Comunicato squadra.
- Comunicato avvenuto scambio: EmailJS + richiesta Admin `TRANSFER_NEWS`.
- Svincola Giocatori: email a `caparrotti86@yahoo.it`, senza scrittura Firebase.
- Fantamercato/trattative.
- Notifiche trattative: proposta ricevuta, esito proposta inviata, lettura sincronizzata con Firebase quando le rules V257 sono pubblicate.

### Admin

- Accetta utenti stabile anti-duplicati.
- Richieste presidenti: aggiorna, approva, rifiuta, elimina da Firebase comunicati APPROVED/ACCEPTED/REJECTED.
- Generatore comunicati automatici.
- Workflow pubblicazione Admin inline.
- Converti listone Excel: formato storico `Tutti/Ceduti` e formato Classic `Lista calciatori`.
- Snapshot, backup, competizioni, rose, albo, FIFA ranking, stadi, club.

## 5. Stato listoni dopo V268-V270

- V268 supporta due formati Excel: storico e Classic.
- V269 aggiunge confronto/storico listoni.
- V270 aggiunge colonna opzionale `Modifica` e righe `Uscito` con ultimo listone contenente il giocatore.
- Non rimuovere o semplificare queste logiche senza test su Excel reale.

## 6. Stato EmailJS

I flussi EmailJS attivi sono:

- comunicato avvenuto scambio;
- svincolo giocatori.

V266 ha migliorato oggetto, firma, mittente logico e Reply-To, ma la deliverability vera dipende da template EmailJS e dominio mittente autenticato SPF/DKIM/DMARC o futura migrazione a Netlify Function + provider transazionale.

## 7. Cose da non eliminare senza audit

- `assets/js/domain/competitions.js`: sotto audit, potenzialmente legacy ma non da rimuovere senza test competizioni.
- `assets/js/refactor/admin-publication-workflow-v213.js`: scollegato o legacy, ma il workflow inline e' attivo; non eliminare senza audit dedicato.
- `news.html`, `comunicati/*.html`, `tools/generate-news-share-pages.mjs`: legacy share/statico, da mantenere per compatibilita finche non deciso diversamente.
- fallback inline V249 e vecchi blocchi V50/V79: gia neutralizzati/affiancati, ma da rimuovere solo dopo test completi.

## 8. Checklist minima prima di ogni merge

- `node --check static/zonaorientale/assets/app.js`
- check moduli JS importati.
- check JSON asset.
- test home/news/listone/competizioni.
- test Dashboard Presidente.
- test Admin -> Richieste presidenti.
- test Admin -> Converti listone Excel con file reale.
- controllo footer/cache-buster/versione.


## V274 - Codici squadra canonici nel Listone

I listoni possono arrivare con sigle o nomi estesi delle squadre reali. Il sistema accetta entrambi, ma salva/visualizza la sigla canonica a 3 lettere e conserva l’originale come metadato quando disponibile.
