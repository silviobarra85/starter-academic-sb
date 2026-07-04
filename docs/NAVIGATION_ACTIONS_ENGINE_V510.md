# Navigation actions engine V510

## Problema corretto

Dopo la fase di centralizzazione dashboard, l'utente ha notato che cliccando su alcuni tasti non veniva portato alla sezione relativa.

La verifica ha indicato una causa architetturale: la navigazione era distribuita tra listener statici, pulsanti legacy e link dinamici creati dopo il bootstrap. Il problema poteva quindi apparire solo su alcuni pulsanti, soprattutto dashboard/home mobile o sezioni aggiunte via JavaScript.

## Soluzione

V510 aggiunge un piccolo motore comune in:

```text
static/fanta-engine/js/ui/navigation-actions-v510.js
```

Il motore intercetta in delega:

```text
[data-page-link]
[data-v42-page-link]
```

e chiama il router locale `setAppPageV42`, così il comportamento storico rimane preservato.

## Cosa non cambia

- Firebase non cambia.
- EmailJS non cambia.
- Dashboard renderer V509 resta invariato.
- Ruoli Admin/Presidente restano invariati.
- Le pagine restano `app-page` con `data-page`.

## Controlli manuali

Dopo V510 verificare su entrambe le leghe:

1. Click su voci nav desktop.
2. Click su bottom nav mobile.
3. Click su menu mobile Altro.
4. Click sui pulsanti della dashboard/home mobile: News, Competizioni, Mercato, Listone, Comunicati.
5. Click su Area Squadra/Trattative dopo login presidente.

## Note per il prossimo assistente

Per nuove sezioni o pulsanti, usare preferibilmente:

```html
<button type="button" data-page-link="nomepagina">Apri</button>
```

oppure, per compatibilità legacy:

```html
<button type="button" data-v42-page-link="nomepagina">Apri</button>
```

Non aggiungere nuovi listener puntuali se basta il motore V510.
