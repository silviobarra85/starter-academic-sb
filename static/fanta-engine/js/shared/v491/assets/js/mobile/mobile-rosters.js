export function createMobileRosterHelpersV169(deps) {
  const {
    state,
    escapeHtml,
    formatFm,
    formatStadium,
    getRosterForSeasonTeam,
    getSeasonTeamDisplayName,
    getSeasonTeamLogo,
    getSeasonTeamPresidentNames,
    getStadiumForSeasonTeam,
    getTeamDisplayName,
    getTeamFmBalance,
    renderPresidentStack,
    renderRosterPlayerTable,
    renderSeasonTeamNameWithLogo,
    renderTeamLogo
  } = deps;

  function formatCompactMobileDateV156(value) {
    const text = String(value ?? "");
    if (!text) return text;
    return text
      .replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, (_, year, month, day) => `${day}-${month}-${String(year).slice(-2)}`)
      .replace(/\b(\d{2})\/(\d{2})\/(\d{4})\b/g, (_, day, month, year) => `${day}-${month}-${String(year).slice(-2)}`);
  }

  function isMobileDateFormattingEnabledV156() {
    return document.body?.classList.contains("is-mobile-ux")
      || window.matchMedia?.("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
  }

  function applyMobileCompactDatesV156(root = document.body) {
    if (!root || !isMobileDateFormattingEnabledV156()) return;
    const skipTags = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "PRE", "CODE"]);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (!/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/.test(node.nodeValue || "")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const next = formatCompactMobileDateV156(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function renderMobileRosterSelectBlockV156(seasonTeam, { roster, balance, isExpanded } = {}) {
    const name = getSeasonTeamDisplayName(seasonTeam.id);
    const logo = getSeasonTeamLogo(seasonTeam);
    const count = (roster?.playerCount ?? (roster?.players || []).length) || 0;
    const presidentNames = getSeasonTeamPresidentNames(seasonTeam);
    return `
      <button class="mobile-roster-select-block-v156 ${isExpanded ? "is-selected" : ""}" type="button" data-toggle-roster-club="${escapeHtml(seasonTeam.id)}" aria-expanded="${isExpanded ? "true" : "false"}">
        <span class="mobile-roster-select-logo-v156">${renderTeamLogo(name, logo)}</span>
        <span class="mobile-roster-select-name-v156">${escapeHtml(name)}</span>
        <span class="mobile-roster-select-meta-v156">${escapeHtml(presidentNames || "Presidente da assegnare")}</span>
        <span class="mobile-roster-select-meta-v156">${escapeHtml(count)} gioc. · ${escapeHtml(formatFm(balance))}</span>
      </button>`;
  }

  function renderMobileRosterSelectedDetailsV156(seasonTeams, teamsById) {
    const expanded = seasonTeams.filter((seasonTeam) => state.expandedRosterClubIds.has(seasonTeam.id));
    if (!expanded.length) {
      return `<p class="mobile-roster-empty-hint-v156 muted">Tocca una rosa per aprire il dettaglio giocatori.</p>`;
    }

    return expanded.map((seasonTeam) => {
      const team = teamsById.get(seasonTeam.teamId);
      const roster = getRosterForSeasonTeam(seasonTeam);
      const stadium = getStadiumForSeasonTeam(seasonTeam.id);
      const balance = getTeamFmBalance(seasonTeam.id);
      const presidentNames = getSeasonTeamPresidentNames(seasonTeam);
      const name = getSeasonTeamDisplayName(seasonTeam.id) || getTeamDisplayName(team);
      return `
        <article class="mobile-roster-detail-card-v156">
          <div class="mobile-roster-detail-head-v156">
            ${renderTeamLogo(name, getSeasonTeamLogo(seasonTeam))}
            <div>
              <h3>${escapeHtml(name)}</h3>
              <p>${escapeHtml(presidentNames || "Presidente da assegnare")}</p>
            </div>
            <button class="button button-secondary button-small" type="button" data-toggle-roster-club="${escapeHtml(seasonTeam.id)}" aria-expanded="true">Riduci</button>
          </div>
          <div class="mobile-roster-detail-stats-v156">
            <span><strong>${escapeHtml(formatFm(balance))}</strong><small>FM</small></span>
            <span><strong>${escapeHtml((roster?.playerCount ?? (roster?.players || []).length) || 0)}</strong><small>Giocatori</small></span>
            <span><strong>${escapeHtml(formatStadium(stadium))}</strong><small>Stadio</small></span>
          </div>
          ${renderRosterPlayerTable(roster?.players || [])}
        </article>`;
    }).join("");
  }

  function renderDesktopRosterTableV156(seasonTeams, teamsById) {
    return `
      <div class="desktop-roster-table-v156 table-wrap mobile-tabular-wrap roster-season-table-wrap">
        <table class="mobile-tabular roster-season-table">
          <thead>
            <tr>
              <th>Rosa</th>
              <th>Presidenti</th>
              <th class="number">FM</th>
              <th class="number">Gioc.</th>
              <th>Stadio</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            ${seasonTeams.map((seasonTeam) => {
              const roster = getRosterForSeasonTeam(seasonTeam);
              const stadium = getStadiumForSeasonTeam(seasonTeam.id);
              const balance = getTeamFmBalance(seasonTeam.id);
              const isExpanded = state.expandedRosterClubIds.has(seasonTeam.id);
              return `
                <tr class="roster-team-row ${isExpanded ? "is-expanded" : ""}">
                  <td data-label="Rosa" class="roster-team-name">${renderSeasonTeamNameWithLogo(seasonTeam.id)}</td>
                  <td data-label="Presidenti">${renderPresidentStack(getSeasonTeamPresidentNames(seasonTeam))}</td>
                  <td data-label="FM" class="number"><strong>${escapeHtml(formatFm(balance))}</strong></td>
                  <td data-label="Gioc." class="number">${escapeHtml(roster?.playerCount ?? 0)}</td>
                  <td data-label="Stadio">${escapeHtml(formatStadium(stadium))}</td>
                  <td data-label="Azione"><button class="button button-secondary button-small" type="button" data-toggle-roster-club="${escapeHtml(seasonTeam.id)}" aria-expanded="${isExpanded ? "true" : "false"}">${isExpanded ? "Riduci" : "Ingrandisci"}</button></td>
                </tr>
                ${isExpanded ? `<tr class="roster-detail-row"><td colspan="6">${renderRosterPlayerTable(roster?.players || [])}</td></tr>` : ""}`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
  }

  function renderMobileRosterSelectorV156(seasonTeams, teamsById) {
    return `
      <div class="mobile-roster-selector-v156" aria-label="Seleziona rosa">
        <div class="mobile-roster-selector-head-v156">
          <span class="eyebrow">Seleziona rosa</span>
          <strong>${escapeHtml(seasonTeams.length)} rose</strong>
        </div>
        <div class="mobile-roster-grid-v156">
          ${seasonTeams.map((seasonTeam) => {
            const roster = getRosterForSeasonTeam(seasonTeam);
            const balance = getTeamFmBalance(seasonTeam.id);
            const isExpanded = state.expandedRosterClubIds.has(seasonTeam.id);
            return renderMobileRosterSelectBlockV156(seasonTeam, { roster, balance, isExpanded });
          }).join("")}
        </div>
        <div class="mobile-roster-selected-v156">
          ${renderMobileRosterSelectedDetailsV156(seasonTeams, teamsById)}
        </div>
      </div>`;
  }

  return {
    formatCompactMobileDateV156,
    isMobileDateFormattingEnabledV156,
    applyMobileCompactDatesV156,
    renderMobileRosterSelectBlockV156,
    renderMobileRosterSelectedDetailsV156,
    renderDesktopRosterTableV156,
    renderMobileRosterSelectorV156
  };
}
