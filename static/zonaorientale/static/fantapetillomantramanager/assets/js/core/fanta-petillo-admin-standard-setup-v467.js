(function fantaPetilloAdminStandardSetupV467() {
  "use strict";

  const VERSION = "467";
  const CARD_ID = "fantaPetilloAdminStandardSetupV467";
  let scheduled = false;

  function safeText(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getAdminPanel() {
    return document.getElementById("adminPanel");
  }

  function createCard() {
    const section = document.createElement("section");
    section.id = CARD_ID;
    section.className = "panel fpm-admin-standard-setup-v467";
    section.dataset.adminCardVisibilityKeyV456 = "admin-setup-standard-da-admin-fantapetillo-v467";
    section.setAttribute("aria-label", "Setup standard da Admin FantaPetillo 2026-2027");
    section.innerHTML = `
      <div class="panel-header">
        <div>
          <p class="eyebrow">FantaPetillo · V${safeText(VERSION)}</p>
          <h3>Setup standard da Admin 2026-2027</h3>
          <p>Usa il flusso normale del gestionale: crea squadre, fai registrare i presidenti, associa gli utenti e poi genera gli snapshot pubblici.</p>
        </div>
      </div>
      <div class="fpm-standard-setup-v467__notice">
        <strong>Metodo attivo:</strong> manuale da Admin. I vecchi strumenti CSV/import/seed sono stati rimossi dal caricamento dell'interfaccia.
      </div>
      <ol class="fpm-standard-setup-v467__steps">
        <li><strong>Stagione:</strong> verifica o crea la stagione <code>2026-2027</code>.</li>
        <li><strong>Squadre:</strong> crea le squadre reali dalla card Squadre.</li>
        <li><strong>Presidenti:</strong> fai registrare gli utenti o creali in Firebase Authentication.</li>
        <li><strong>Accetta utenti:</strong> carica richieste, approva gli utenti e associa ciascun presidente alla squadra corretta.</li>
        <li><strong>Budget e stadio:</strong> imposta 250 FM iniziali, livello stadio e altri parametri reali.</li>
        <li><strong>Snapshot pubblici:</strong> usa la procedura standard Admin → Snapshot pubblici → Aggiorna tutto e scarica gli overlay.</li>
        <li><strong>Repo:</strong> applica gli overlay scaricati e committa i JSON statici generati.</li>
      </ol>
      <div class="fpm-standard-setup-v467__grid">
        <div>
          <h4>Da usare</h4>
          <p>Card standard: Stagioni, Squadre, Presidenti/Utenti, Accetta utenti, Budget/Bilanci, Snapshot pubblici.</p>
        </div>
        <div>
          <h4>Non serve più</h4>
          <p>CSV template, validatore dati reali, preview seed, import Firestore e snapshot builder dedicato.</p>
        </div>
      </div>
      <button type="button" class="button button-secondary button-small" data-fpm-standard-setup-download-v467>Scarica promemoria</button>`;
    return section;
  }

  function findMount(adminPanel) {
    return adminPanel.querySelector(".admin-category-body") || adminPanel;
  }

  function installCard() {
    const adminPanel = getAdminPanel();
    if (!adminPanel || document.getElementById(CARD_ID)) return;
    const mount = findMount(adminPanel);
    const reference = adminPanel.querySelector("#adminTopControlsMountV313") || adminPanel.querySelector(".page-heading");
    const card = createCard();
    if (reference && reference.parentElement === adminPanel) reference.insertAdjacentElement("afterend", card);
    else mount.insertAdjacentElement("afterbegin", card);
    if (window.LeagueAdminCardVisibilityV456 && typeof window.LeagueAdminCardVisibilityV456.apply === "function") {
      window.LeagueAdminCardVisibilityV456.apply();
    }
  }

  function downloadMemo() {
    const content = [
      "# Setup standard da Admin - FantaPetilloMantraManager V467",
      "",
      "1. Verifica o crea la stagione 2026-2027.",
      "2. Crea le squadre reali dalla card Squadre.",
      "3. Fai registrare i presidenti oppure creali in Firebase Authentication.",
      "4. Da Accetta utenti, approva e associa ogni utente alla squadra corretta.",
      "5. Imposta budget, stadio e dati gestionali.",
      "6. Genera Snapshot pubblici da Admin e scarica gli overlay.",
      "7. Applica gli overlay alla repo e committa.",
      "",
      "Gli strumenti CSV/import/seed non sono più caricati nell'interfaccia Admin."
    ].join("\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fantapetillo-setup-standard-admin-v467.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function scheduleInstall() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      installCard();
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-fpm-standard-setup-download-v467]");
    if (!button) return;
    event.preventDefault();
    downloadMemo();
  });

  const observer = new MutationObserver(scheduleInstall);
  function init() {
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    installCard();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.FantaPetilloAdminStandardSetupV467 = Object.freeze({ version: `V${VERSION}`, install: installCard });
})();
