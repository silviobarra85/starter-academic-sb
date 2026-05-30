# Email deliverability EmailJS - V266

## Obiettivo

Ridurre la probabilita' che le email operative del gestionale finiscano in spam. I flussi interessati sono:

- Dashboard Presidente -> Comunicato avvenuto scambio;
- Dashboard Presidente -> Svincola Giocatori.

## Modifiche codice V266

Il codice passa a EmailJS parametri piu' coerenti e riconoscibili:

- `from_name`: `Lega ZonaOrientale Salerno`;
- `sender_name`: `Lega ZonaOrientale Salerno`;
- `app_name` / `league_name`: `Lega ZonaOrientale Salerno`;
- `reply_to`: email dell'utente loggato quando disponibile;
- oggetti email piu' sobri;
- firma finale standard del gestionale.

Questi parametri non bastano da soli: il template EmailJS deve usarli e il servizio email collegato deve essere autenticato lato dominio.

## Configurazione consigliata in EmailJS

1. Aprire EmailJS Dashboard.
2. Andare in **Email Services**.
3. Per produzione preferire un provider transazionale, ad esempio SendGrid, Mailgun, Brevo, Postmark o Amazon SES.
4. Evitare, se possibile, un account Gmail/Yahoo personale come mittente operativo stabile.
5. Aprire il servizio collegato e verificare che l'invio di test arrivi correttamente.
6. Aprire **Email Templates** e il template usato dal sito.
7. Impostare i campi in questo modo, se disponibili nel template:
   - **To Email**: `{{to_email}}`;
   - **From Name**: `{{from_name}}` oppure `{{app_name}}`;
   - **From Email**: usare l'indirizzo predefinito/autenticato del servizio email, non l'email del presidente;
   - **Reply-To**: `{{reply_to}}`;
   - **Subject**: `{{subject}}`;
   - **Content/Message**: `{{message}}`.
8. Salvare e usare **Test It** su EmailJS.

## DNS: SPF, DKIM, DMARC

La configurazione DNS non si fa genericamente in EmailJS: si fa nel DNS del dominio mittente usando i record forniti dal provider email collegato a EmailJS.

Passaggi generici:

1. Scegliere il dominio o sottodominio mittente, per esempio `mail.silviobarra.com` o `lega.silviobarra.com`.
2. Nel provider transazionale collegato a EmailJS, aprire la sezione **Domain authentication / Sender authentication**.
3. Aggiungere il dominio mittente.
4. Copiare i record DNS richiesti dal provider. Normalmente sono:
   - TXT SPF;
   - CNAME/TXT DKIM;
   - TXT DMARC.
5. Inserire i record nel pannello DNS del dominio.
6. Tornare nel provider e premere **Verify**.
7. Dopo la verifica, usare quell'indirizzo/dominio come mittente tecnico del template EmailJS.

Esempio DMARC iniziale prudente:

```text
_dmarc.example.com TXT v=DMARC1; p=none; rua=mailto:dmarc@example.com; adkim=s; aspf=s
```

Dopo alcune settimane di controllo si puo' valutare `p=quarantine` o `p=reject`, ma non partire direttamente con policy aggressive se non si conosce tutto il traffico email del dominio.

## Test dopo V266

- Inviare un comunicato avvenuto scambio.
- Inviare una informativa svincolo giocatori.
- Verificare se la mail arriva in inbox o spam.
- Aprire gli header della mail ricevuta e controllare SPF/DKIM/DMARC.
- Controllare in console: `window.ZonaOrientaleEmailJsDeliverabilityV266`.

## Nota

Se si usa ancora un servizio personale in EmailJS, la deliverability puo' restare variabile. La soluzione piu' robusta e' collegare EmailJS a un provider transazionale autenticato oppure, in futuro, spostare l'invio su Netlify Function server-side con provider dedicato.
