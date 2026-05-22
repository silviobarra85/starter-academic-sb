# REFACTOR V168 - CSS mobile consolidato e letture mercato

Data: 2026-05-21
Branch: feature/zonaorientale-competizioni-statiche

## Obiettivo

Pulire il caricamento della UI mobile e ridurre letture Firebase non necessarie introdotte dal Fantamercato.

## Modifiche

- Creato `static/zonaorientale/assets/css/mobile-suite-v168.css`, che consolida i CSS mobile da V140 a V167 nello stesso ordine di caricamento.
- Aggiornati `index.html` e `competition.html` per usare un solo file CSS mobile invece di molti file `mobile-*.css`.
- Rimosso l'inserimento di `transferListings` e `transferNegotiations` da `COLLECTIONS`, per evitare che il caricamento completo admin legga sempre intere raccolte.
- Il mercato resta caricato dalla funzione dedicata V133, con query mirate:
  - `transferListings`: stagione corrente e `status == ACTIVE`;
  - `transferNegotiations`: solo trattative della squadra coinvolta, salvo admin.

## File vecchi non piu referenziati

Dopo test si possono rimuovere i vecchi CSS mobile:

```bash
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-block-ui-v140.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-unified-ui-v141.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-rosters-v143.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-teamarea-v144.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-competitions-v145.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-listone-v146.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-admin-v147.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-content-v148.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-final-polish-v149.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v150.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v151.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v152.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v153.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v154.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v155.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v156.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v158.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v159.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v160.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v161.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v162.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v163.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v164.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v165.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v166.css
git rm --ignore-unmatch static/zonaorientale/assets/css/mobile-hotfix-v167.css
```

## Test

- Desktop: verificare che la UI resti invariata.
- Mobile: Dashboard, Rose, Squadra, Fantamercato, Coppe, Listone, News, Albo/Palmares, Regolamento, Admin.
- Firebase: verificare che Fantamercato e Trattative si carichino correttamente.
