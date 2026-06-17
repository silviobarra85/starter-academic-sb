# V465 - Checklist pubblicazione e share FantaPetillo

La V465 aggiunge nell'Admin di FantaPetilloMantraManager una card informativa selezionabile dal menu Admin:

```text
Checklist pubblicazione e share 2026-2027
```

## Obiettivo

La card riepiloga cosa manca per passare da clone sandbox/bootstrapping a sito pubblicabile:

- dati reali di presidenti, squadre e teamUsers;
- snapshot pubblici iniziali;
- verifica readiness Area Squadra;
- configurazione share/Netlify/Open Graph;
- decisione finale su noindex e go-live.

## Sicurezza

La card non scrive su Firebase, non modifica Netlify, non sblocca Area Squadra e non tocca ZonaOrientale.

## Ordine consigliato

1. Usare il kit V458 per compilare dati reali.
2. Validare con V459.
3. Generare preview Firestore con V460.
4. Importare con V461 solo dopo controllo.
5. Generare snapshot pubblici con V463.
6. Verificare Area Squadra con V464.
7. Preparare share/Netlify/Open Graph con patch successiva.
8. Sbloccare Area Squadra solo con patch dedicata.

## Stato dopo V465

FantaPetilloMantraManager resta protetto: Area Squadra non e' ancora abilitata e i dati reali non sono ancora richiesti per continuare lo sviluppo del template.
