# Operazioni overlay

Overlay cumulativo V785, pronto per la GitHub Action.

- Caricare lo zip integro in `incoming/overlays/` e fare commit/push.
- Non applicare prima la V783: questa V785 ne contiene integralmente le modifiche.
- La action copia `static/` e `docs/` nella radice del repository.
- ioSudo viene sostituito dalla pagina di manutenzione V785.
- Il nuovo listone `2026-08-05` diventa il predefinito condiviso; `2026-07-04` resta selezionabile.
- Le configurazioni e i footer di ZonaOrientale/FantaMantraManager restano invariati per preservare il contratto static-first.
- Audit inclusi: `audit-sudatori-section-v785.mjs` e `audit-iosudo-v785.mjs`.
- Il nome `audit-iosudo-v785.mjs` rispetta il pattern `audit-iosudo-v*.mjs` usato dalla GitHub Action; in questo modo il vecchio audit V782 non viene più selezionato.
- L'overlay non modifica `.github/workflows` e contiene soltanto file effettivamente aggiornati.
