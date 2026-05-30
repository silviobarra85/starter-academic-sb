# Audit V280 - Leggibilita mobile in modalita Light

## Scopo

Primo controllo statico sulla leggibilita della UI mobile in tema Light, richiesto dopo la semplificazione del Listone.

## Esito sintetico

Il tema Light ha gia' diverse correzioni per tabelle e intestazioni sticky, ma il CSS contiene ancora aree a rischio contrasto, soprattutto dove colori chiari nati per il tema scuro vengono usati su sfondi chiari o semitrasparenti.

## Aree a rischio individuate

### 1. Testo muted su sfondi grigio chiaro

Vari elementi usano `var(--muted)` in Light, pari a `#64748b`, su sfondi come `#e5e7eb`, `#e2e8f0` o pannelli bianchi trasparenti.

Rischio: testo secondario poco leggibile in card, filtri e righe compatte, soprattutto da smartphone.

### 2. Colori hardcoded chiari ereditati dal tema dark

Sono presenti colori come:

```text
#94a3b8
#cbd5e1
#bbf7d0
#fbbf24
#fde68a
```

Questi colori funzionano su sfondo scuro, ma in Light possono diventare poco leggibili se non sovrascritti da regole dedicate.

### 3. Badge e stati

Badge tecnici o di stato con testo verde/ambra chiaro su background chiaro possono perdere contrasto. Alcuni badge sono gia' corretti in Light, altri vanno verificati se compaiono ancora in mobile/Admin.

### 4. Tabelle mobile

Le intestazioni tabella in Light sono forzate a sfondo scuro e testo chiaro, scelta corretta. Il rischio principale resta nel corpo tabella: celle dense, testo muted, bordi leggeri e righe trasparenti possono rendere difficile leggere dati piccoli.

### 5. CSS duplicato/stratificato

Esistono molte regole storiche V90/V97/V98 e fallback `body.is-mobile-ux`. La stratificazione non e' un bug immediato, ma rende facile introdurre conflitti se si interviene senza una patch mirata.

## Proposta per prossima uscita

Preparare una release dedicata, ad esempio `V281 - contrasto mobile Light`, con obiettivi limitati:

1. rafforzare il colore dei testi secondari in mobile Light;
2. correggere badge/stati con colori chiari non adatti a sfondi chiari;
3. aumentare contrasto del corpo tabella in Light;
4. non cambiare layout desktop;
5. non toccare Firebase, listoni JSON o logiche Admin.

## Test manuale consigliato

- Tema Light attivo.
- Smartphone reale o viewport mobile.
- Home.
- Listone.
- Competizioni.
- Archivio.
- Statistiche.
- Dashboard Presidente.
- Admin, almeno Diagnostica dati e Richieste presidenti.

Per ogni sezione controllare:

- titoli card;
- testi secondari/muted;
- badge;
- celle tabella;
- bottoni secondari;
- contrasto dopo scroll su intestazioni sticky.
