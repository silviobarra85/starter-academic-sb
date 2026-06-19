(function fantaPetilloShareNetlifyV466() {
  "use strict";

  const VERSION = "466";
  const CARD_ID = "fantaPetilloShareNetlifyV466";
  const SEASON_ID = "2026-2027";
  const CHECKLIST_FILENAME = "fantapetillo-share-netlify-open-graph-v466.md";

  function safeText(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function downloadText(filename, content, type) {
    const blob = new Blob([content], { type: type || "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function buildChecklistMarkdown() {
    return `# Share, Netlify e Open Graph FantaMantraManager ${SEASON_ID}\n\n` +
`## Obiettivo V${VERSION}\n\n` +
`Preparare la preview dinamica dei comunicati FantaMantra senza intaccare ZonaOrientale.\n\n` +
`## File da applicare\n\n` +
`- \`netlify.toml\`: contiene il redirect \`/fantapetillomantramanager/share/news/:id\`.\n` +
`- \`netlify/functions/news-share.js\`: funzione multi-lega con mapping separato per ZonaOrientale e FantaMantra.\n\n` +
`## Verifiche dopo deploy branch\n\n` +
`1. Aprire \`https://silviobarra.com/fantapetillomantramanager/share/news/test\`.\n` +
`2. Verificare che non venga usato il Firebase ZonaOrientale.\n` +
`3. Verificare tag \`og:site_name\`, \`og:title\`, \`og:image\` e redirect verso \`/fantapetillomantramanager/#news-test\`.\n` +
`4. Verificare che \`/zonaorientale/share/news/:id\` continui a funzionare.\n\n` +
`## Stato pre-produzione\n\n` +
`FantaMantra resta noindex e l'Area Squadra resta protetta: questa patch prepara solo share/preview.\n`;
  }

  function row(title, text, status) {
    return `<li class="fpmm-share-netlify-v466__row ${safeText(status || "")}">
      <span aria-hidden="true"></span>
      <div><strong>${safeText(title)}</strong><p>${text}</p></div>
    </li>`;
  }

  function createCard() {
    const section = document.createElement("section");
    section.id = CARD_ID;
    section.className = "panel fpmm-share-netlify-v466";
    section.dataset.adminCardVisibilityKeyV456 = "admin-fantapetillo-share-netlify-v466";
    section.setAttribute("aria-labelledby", "fantaPetilloShareNetlifyTitleV466");
    section.innerHTML = `
      <div class="panel-header">
        <div>
          <p class="eyebrow">FantaMantra · Share V${safeText(VERSION)}</p>
          <h3 id="fantaPetilloShareNetlifyTitleV466">Share, Netlify e Open Graph 2026-2027</h3>
          <p class="muted">Promemoria operativo per preview comunicati, redirect Netlify e metadati social del clone.</p>
        </div>
        <button type="button" class="button button-secondary button-small" data-fpmm-download-share-netlify-v466>Scarica checklist</button>
      </div>
      <div class="fpmm-share-netlify-v466__notice">
        La V466 prepara <strong>redirect e funzione Netlify multi-lega</strong>. La card non scrive su Firebase e non sblocca l'Area Squadra.
      </div>
      <div class="fpmm-share-netlify-v466__grid">
        <article>
          <h4>File Netlify inclusi nell'overlay</h4>
          <ul>
            ${row("netlify.toml", "Aggiunge il redirect <code>/fantapetillomantramanager/share/news/:id</code> verso <code>news-share</code> con parametro lega.", "ok")}
            ${row("news-share.js", "La funzione riconosce ZonaOrientale e FantaMantra, usando progetto Firebase, nome lega e immagine OG separati.", "ok")}
            ${row("Compatibilita' ZonaOrientale", "Il redirect storico <code>/zonaorientale/share/news/:id</code> resta supportato.", "ok")}
          </ul>
        </article>
        <article>
          <h4>Da testare dopo deploy</h4>
          <ul>
            ${row("Preview FantaMantra", "Apri un link share comunicato FantaMantra e controlla i meta tag Open Graph.", "todo")}
            ${row("Preview ZonaOrientale", "Verifica che un vecchio link share ZonaOrientale continui a generare anteprima corretta.", "todo")}
            ${row("No go-live", "Noindex e Area Squadra protetta restano attivi fino alla patch finale.", "wait")}
          </ul>
        </article>
      </div>
      <details class="fpmm-share-netlify-v466__details">
        <summary>Snippet redirect V466</summary>
        <pre><code>[[redirects]]
  from = "/fantapetillomantramanager/share/news/:id"
  to = "/.netlify/functions/news-share?id=:id&amp;league=fantapetillomantramanager"
  status = 200</code></pre>
      </details>`;
    return section;
  }

  function attachHandlers(card) {
    if (card.__fpmmShareNetlifyHandlersV466) return;
    card.__fpmmShareNetlifyHandlersV466 = true;
    card.addEventListener("click", (event) => {
      if (!event.target.closest?.("[data-fpmm-download-share-netlify-v466]")) return;
      downloadText(CHECKLIST_FILENAME, buildChecklistMarkdown(), "text/markdown;charset=utf-8");
    });
  }

  function mountCard() {
    const adminPanel = document.getElementById("adminPanel");
    if (!adminPanel) return;
    let card = document.getElementById(CARD_ID);
    if (!card) {
      card = createCard();
      const launchCard = document.getElementById("fantaPetilloLaunchReadinessV465");
      const readinessCard = document.getElementById("fantaPetilloTeamAreaReadinessV464");
      if (launchCard) launchCard.insertAdjacentElement("afterend", card);
      else if (readinessCard) readinessCard.insertAdjacentElement("afterend", card);
      else adminPanel.insertAdjacentElement("afterbegin", card);
    }
    attachHandlers(card);
    if (window.LeagueAdminCardVisibilityV456 && typeof window.LeagueAdminCardVisibilityV456.apply === "function") {
      window.LeagueAdminCardVisibilityV456.apply();
    }
  }

  let attempts = 0;
  function init() {
    mountCard();
    const timer = window.setInterval(() => {
      attempts += 1;
      mountCard();
      if (attempts >= 20 || document.getElementById(CARD_ID)) window.clearInterval(timer);
    }, 500);
    window.addEventListener("hashchange", () => window.setTimeout(mountCard, 100));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.FantaMantraShareNetlifyV466 = Object.freeze({
    version: `V${VERSION}`,
    seasonId: SEASON_ID,
    writesToFirebase: false,
    mount: mountCard,
    buildChecklistMarkdown
  });
})();
