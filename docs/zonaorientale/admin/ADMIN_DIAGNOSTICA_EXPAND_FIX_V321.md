# V321 - Fix espansione Diagnostica dati Admin

## Scopo

Ripristina l'espansione/riduzione del pannello `Admin -> Diagnostica dati`.

## Causa probabile

Il pannello diagnostica V276 viene iniettato dopo il render principale dell'area Admin.
Dopo V313 i pannelli Admin partono ridotti, ma il pulsante della diagnostica poteva restare senza listener diretto perche' `attachAdminHandlers()` era gia' stato eseguito.

## Intervento

Aggiunto un handler delegato e limitato al solo pannello `adminDataDiagnosticsPanelV276`.

## Funzionalita preservate

- Admin -> Richieste presidenti.
- Admin -> Diagnostica dati.
- Admin -> Converti listone Excel.
- Listone pubblico/Admin ed export CSV solo Admin.
- Rose e pagina squadra.
- Dashboard Presidente.
- Calciomercato RSS.
- Firebase/Auth/EmailJS.
- Mobile navigation.

## Test consigliati

1. Login Admin.
2. Verificare che `Diagnostica dati` parta ridotta.
3. Cliccare `Espandi`: la tabella diagnostica deve aprirsi.
4. Cliccare `Riduci`: il pannello deve richiudersi.
5. Cliccare `Aggiorna diagnostica` dentro il pannello aperto.
