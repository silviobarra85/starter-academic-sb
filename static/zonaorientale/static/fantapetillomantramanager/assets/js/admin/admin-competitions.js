/* V217: included in patch and cache-busted by app.js import so Admin results uses the complete standings editor. */
export function createAdminCompetitionHelpersV131({
  state,
  escapeHtml,
  getLabel,
  renderAdminPanel,
  getValidSeasonSelection,
  getSeasonName,
  getSeasonTeamsForSeason,
  getParticipantsCount,
  getCompetitionResults,
  isRankingCompetition,
  getCompetitionStatusClass,
  getCompetitionFormatLabel,
  getCompetitionDisplayName,
  getDisputableCompetitionsForSeason,
  isCompetitionNotDisputed,
  buildMaps,
  getAdminMatchDisplayRows,
  getMatchSerieAMatchday,
  formatMatchStage,
  formatMatchResult,
  getAdminMatchTeamText,
  renderAdminMatchSourceBadges,
  getAdminMatchActionButtons,
  COMPETITION_TYPES,
  COMPETITION_FORMATS,
  COMPETITION_STATUSES,
  MATCH_STATUSES,
  STANDARD_KNOCKOUT_MATCHDAYS
}) {
  function renderOptions(items, selectedValue = "", labelGetter = (item) => item.label || item.name || item.id || item.value) {
    return (items || []).map((item) => {
      const value = item.value ?? item.id ?? item;
      return `<option value="${escapeHtml(value)}" ${String(value) === String(selectedValue) ? "selected" : ""}>${escapeHtml(labelGetter(item))}</option>`;
    }).join("");
  }

  function renderCompetitionAdminPanel() {
    const selectedSeasonId = getValidSeasonSelection("selectedAdminCompetitionSeasonId");
    const seasonOptions = renderOptions(state.raw.seasons || [], selectedSeasonId, (season) => season.name || season.id);
    const typeOptions = renderOptions(COMPETITION_TYPES || []);
    const formatOptions = renderOptions(COMPETITION_FORMATS || []);
    const statusOptions = renderOptions(COMPETITION_STATUSES || []);
    const filteredCompetitions = (state.raw.competitions || []).filter((competition) => competition.seasonId === selectedSeasonId);
    const rows = filteredCompetitions.map((competition) => `
      <div class="admin-list-item">
        <span>
          <strong>${escapeHtml(competition.name || competition.id)}</strong>
          <small>${escapeHtml(getSeasonName(competition.seasonId))} · ${escapeHtml(getLabel(COMPETITION_TYPES, competition.type))} · ${escapeHtml(getCompetitionFormatLabel(competition.format))}</small>
        </span>
        <span>
          <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
          <button class="button button-secondary button-small" type="button" data-admin-edit-competition="${escapeHtml(competition.id)}">Modifica</button>
          <button class="button button-danger button-small" type="button" data-admin-delete-competition="${escapeHtml(competition.id)}">Elimina</button>
        </span>
      </div>
    `).join("") || `<p class="muted admin-empty-message">Nessuna competizione inserita per la stagione selezionata.</p>`;

    return renderAdminPanel("adminCompetitionsPanel", "Firebase", "Competizioni", "Crea competizioni per stagione: Campionato, coppe, playoff o competizioni personalizzate.", `
        <form id="adminCompetitionForm" class="form-grid">
          <input id="adminCompetitionId" type="hidden" />
          <label>Stagione<select id="adminCompetitionSeasonId" class="input" required>${seasonOptions}</select></label>
          <label>Nome competizione<input id="adminCompetitionName" class="input" type="text" placeholder="Es. Campionato" required /></label>
          <label>Trofeo / tipo<select id="adminCompetitionType" class="input" required>${typeOptions}</select></label>
          <label>Formula<select id="adminCompetitionFormat" class="input" required>${formatOptions}</select></label>
          <label>Stato<select id="adminCompetitionStatus" class="input" required>${statusOptions}</select></label>
          <label class="span-2">Note<input id="adminCompetitionNotes" class="input" type="text" placeholder="Opzionale" /></label>
          <div class="form-actions span-2">
            <button class="button button-primary" type="submit">Salva competizione</button>
            <button id="adminCompetitionReset" class="button button-secondary" type="button">Nuova</button>
            <button id="adminCompetitionCreateDefaults" class="button button-secondary" type="button">Crea competizioni standard</button>
            <span id="adminCompetitionStatusText" class="form-status"></span>
          </div>
        </form>
        <details class="admin-edit-section" open>
          <summary><strong>Competizioni della stagione selezionata</strong><span>${filteredCompetitions.length}</span></summary>
          <div class="admin-list">${rows}</div>
        </details>`);
  }

  function renderCompetitionResultsAdminPanel() {
    const selectedSeasonId = getValidSeasonSelection("selectedAdminResultsSeasonId");
    const seasonOptions = renderOptions(state.raw.seasons || [], selectedSeasonId, (season) => season.name || season.id);
    const concluded = (state.raw.competitions || []).filter((competition) => competition.status === "CONCLUSA" && competition.seasonId === selectedSeasonId);
    const selectedId = state.selectedResultCompetitionId && concluded.some((competition) => competition.id === state.selectedResultCompetitionId)
      ? state.selectedResultCompetitionId
      : concluded[0]?.id || "";
    state.selectedResultCompetitionId = selectedId;

    const competitionOptions = concluded.map((competition) => `
      <option value="${escapeHtml(competition.id)}" ${competition.id === selectedId ? "selected" : ""}>${escapeHtml(competition.name)}</option>
    `).join("");

    const body = `
      <form id="adminCompetitionResultsForm" class="form-grid">
        <label>
          Stagione
          <select id="adminCompetitionResultsSeasonId" class="input" required>${seasonOptions}</select>
        </label>
        <label>
          Competizione conclusa
          <select id="adminCompetitionResultsCompetitionId" class="input" ${concluded.length ? "required" : "disabled"}>${competitionOptions}</select>
          <small class="field-hint">I risultati si possono inserire solo per competizioni con stato Conclusa.</small>
        </label>
        <div id="adminCompetitionResultsEditor" class="span-2">
          ${concluded.length ? renderCompetitionResultsEditor(selectedId) : `<p class="muted">Nessuna competizione conclusa per la stagione selezionata. Prima imposta una competizione su <strong>Conclusa</strong>.</p>`}
        </div>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit" ${concluded.length ? "" : "disabled"}>Salva risultati e aggiorna albo</button>
          <span id="adminCompetitionResultsStatus" class="form-status"></span>
        </div>
      </form>`;

    return renderAdminPanel("adminCompetitionResultsPanel", "Firebase", "Risultati competizioni", "Inserisci classifiche o finali. Questi dati alimentano automaticamente Albo d'oro e Palmarès.", body);
  }

  function renderCompetitionResultsEditor(competitionId) {
    const competition = (state.raw.competitions || []).find((item) => item.id === competitionId);
    if (!competition) return `<p class="muted">Seleziona una competizione.</p>`;

    const seasonTeams = getSeasonTeamsForSeason(competition.seasonId);
    if (!seasonTeams.length) {
      return `<p class="muted">Nessuna squadra associata alla stagione ${escapeHtml(competition.seasonId)}. Inseriscile nella sezione “Squadre per stagione”.</p>`;
    }

    const currentResults = getCompetitionResults(competition.id);
    const resultsByPosition = new Map(currentResults.map((result) => [Number(result.position), result]));
    const teamOptions = (selectedId = "") => `
      <option value="">Seleziona squadra</option>
      ${seasonTeams.map((seasonTeam) => `
        <option value="${escapeHtml(seasonTeam.id)}" ${seasonTeam.id === selectedId ? "selected" : ""}>${escapeHtml(seasonTeam.name)}</option>
      `).join("")}`;

    if (!isRankingCompetition(competition)) {
      const winner = resultsByPosition.get(1);
      const second = resultsByPosition.get(2);
      return `
        <div class="compact-card result-editor-card">
          <h3>${escapeHtml(competition.name)}</h3>
          <p class="muted">Formula a gironi/eliminazione: inserisci vincitore e secondo classificato.</p>
          <div class="form-grid">
            <label>
              Vincitore
              <select class="input" data-result-position="1" data-result-team>${teamOptions(winner?.seasonTeamId || "")}</select>
            </label>
            <label>
              Secondo
              <select class="input" data-result-position="2" data-result-team>${teamOptions(second?.seasonTeamId || "")}</select>
            </label>
          </div>
        </div>`;
    }

    const getRankingValueV216 = (result, keys = []) => {
      for (const key of keys) {
        const value = result?.[key];
        if (value !== undefined && value !== null && value !== "") return value;
      }
      return "";
    };
    const rankingInputV216 = (result, position, attr, keys, step = "1") => `
      <input class="input standing-admin-input-v216" type="number" step="${escapeHtml(step)}" value="${escapeHtml(getRankingValueV216(result, keys))}" data-result-position="${position}" ${attr} />`;

    const expectedRows = Math.max(getParticipantsCount(competition.seasonId), seasonTeams.length, currentResults.length);
    const rows = Array.from({ length: expectedRows }, (_, index) => {
      const position = index + 1;
      const result = resultsByPosition.get(position) || {};
      return `
        <tr>
          <td data-label="POS" class="number standing-admin-pos-v216">${position}</td>
          <td data-label="SQUADRA" class="standing-admin-team-v216">
            <select class="input" data-result-position="${position}" data-result-team>${teamOptions(result.seasonTeamId || "")}</select>
          </td>
          <td data-label="PUNTI" class="number">${rankingInputV216(result, position, "data-result-points", ["points", "punti", "rankingPoints", "tablePoints", "totalPoints"], "0.5")}</td>
          <td data-label="PG" class="number">${rankingInputV216(result, position, "data-result-played", ["played", "games", "matches", "playedMatches", "partite", "pg", "g"])}</td>
          <td data-label="V" class="number">${rankingInputV216(result, position, "data-result-wins", ["wins", "won", "victories", "vittorie", "vinte", "v"])}</td>
          <td data-label="N" class="number">${rankingInputV216(result, position, "data-result-draws", ["draws", "drawn", "ties", "pareggi", "pareggiate", "n"])}</td>
          <td data-label="P" class="number">${rankingInputV216(result, position, "data-result-losses", ["losses", "lost", "defeats", "sconfitte", "perse", "p"])}</td>
          <td data-label="GF" class="number">${rankingInputV216(result, position, "data-result-goals-for", ["goalsFor", "goals_for", "gf", "goalfatti", "goalsScored", "scoredGoals", "retiFatte"])}</td>
          <td data-label="GS" class="number">${rankingInputV216(result, position, "data-result-goals-against", ["goalsAgainst", "goals_against", "ga", "gs", "goalSubiti", "goalsConceded", "concededGoals", "retiSubite"])}</td>
          <td data-label="DR" class="number">${rankingInputV216(result, position, "data-result-goal-difference", ["goalDifference", "goal_difference", "diffReti", "differenzaReti", "dr", "gd", "difference"])}</td>
          <td data-label="FPT" class="number">${rankingInputV216(result, position, "data-result-fantapoints", ["fantapoints", "fantapunti", "fpt", "fantasyPoints", "totalFantapoints", "totalFantasyPoints"], "0.5")}</td>
        </tr>`;
    }).join("");

    return `
      <div class="compact-card result-editor-card result-editor-card-v216">
        <h3>${escapeHtml(competition.name)}</h3>
        <p class="muted">Competizione a classifica: inserisci dal primo all'ultimo posto con statistiche complete di campionato.</p>
        <div class="table-wrap result-admin-table-wrap result-admin-standing-wrap-v216">
          <table class="competition-results-admin-table-v216">
            <thead><tr><th>POS</th><th>SQUADRA</th><th class="number">PUNTI</th><th class="number">PG</th><th class="number">V</th><th class="number">N</th><th class="number">P</th><th class="number">GF</th><th class="number">GS</th><th class="number">DR</th><th class="number">FPT</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  function renderCompetitionMatchesAdminPanel() {
    const selectedSeasonId = getValidSeasonSelection("selectedAdminMatchSeasonId");
    const competitionsForSelectedSeason = getDisputableCompetitionsForSeason(selectedSeasonId);
    const blockedCompetitionsCount = (state.raw.competitions || []).filter((competition) => competition.seasonId === selectedSeasonId && isCompetitionNotDisputed(competition)).length;

    const selectedCompetitionId = state.selectedMatchCompetitionId && competitionsForSelectedSeason.some((competition) => competition.id === state.selectedMatchCompetitionId)
      ? state.selectedMatchCompetitionId
      : competitionsForSelectedSeason[0]?.id || "";
    state.selectedMatchCompetitionId = selectedCompetitionId;

    const seasonOptions = renderOptions(state.raw.seasons || [], selectedSeasonId, (season) => season.name || season.id);
    const competitionOptions = competitionsForSelectedSeason.map((competition) => `
      <option value="${escapeHtml(competition.id)}" ${competition.id === selectedCompetitionId ? "selected" : ""}>${escapeHtml(getCompetitionDisplayName(competition))}</option>
    `).join("");
    const statusOptions = renderOptions(MATCH_STATUSES || []);
    const matchdayOptions = (STANDARD_KNOCKOUT_MATCHDAYS || []).map((matchday) => `<option value="${escapeHtml(matchday)}"></option>`).join("");

    const { competitionsById } = buildMaps();
    const selectedCompetition = competitionsById.get(selectedCompetitionId) || competitionsForSelectedSeason[0] || null;
    const firebaseMatchesForSelectedCompetition = (state.raw.competitionMatches || []).filter((match) => {
      const matchSeasonId = match.seasonId || competitionsById.get(match.competitionId)?.seasonId || "";
      return matchSeasonId === selectedSeasonId && (!selectedCompetitionId || match.competitionId === selectedCompetitionId);
    });
    const allDisplayRows = getAdminMatchDisplayRows(selectedCompetition, firebaseMatchesForSelectedCompetition);

    const matchdayValues = Array.from(new Set(
      allDisplayRows.map((row) => row.displayMatch.matchday || row.displayMatch.stage || "").filter(Boolean)
    )).sort((a, b) => b.localeCompare(a, "it", { numeric: true }));

    const selectedMatchdayFilter = state.selectedAdminMatchdayFilter && matchdayValues.includes(state.selectedAdminMatchdayFilter)
      ? state.selectedAdminMatchdayFilter
      : "";
    state.selectedAdminMatchdayFilter = selectedMatchdayFilter;

    const matchdayFilterOptions = [`<option value="">Tutte le fasi/giornate</option>`, ...matchdayValues.map((matchday) => `
      <option value="${escapeHtml(matchday)}" ${matchday === selectedMatchdayFilter ? "selected" : ""}>${escapeHtml(matchday)}</option>
    `)].join("");

    const filteredRows = selectedMatchdayFilter
      ? allDisplayRows.filter((row) => (row.displayMatch.matchday || row.displayMatch.stage || "") === selectedMatchdayFilter)
      : allDisplayRows;

    const rows = filteredRows.map((row) => {
      const match = row.displayMatch;
      const competition = competitionsById.get(match.competitionId) || selectedCompetition;
      const statusLabel = getLabel(MATCH_STATUSES, match.status) || match.status || "-";
      return `
        <div class="admin-list-item${row.hasJson ? " admin-list-item-static-covered" : ""}${row.isDeleted ? " admin-list-item-deleted" : ""}">
          <span>
            <strong>${escapeHtml(getSeasonName(competition?.seasonId || match.seasonId))} · ${escapeHtml(getCompetitionDisplayName(competition) || match.competitionId)}</strong>
            <small><strong>Fase/giornata:</strong> ${escapeHtml(formatMatchStage(match))}${getMatchSerieAMatchday(match) ? ` · Serie A: ${escapeHtml(getMatchSerieAMatchday(match))}` : ""} · ${escapeHtml(match.matchDate || "-")} · ${escapeHtml(getAdminMatchTeamText(match, "home"))} - ${escapeHtml(getAdminMatchTeamText(match, "away"))} · ${escapeHtml(formatMatchResult(match))}</small>
          </span>
          <span class="admin-match-actions">
            ${renderAdminMatchSourceBadges(row)}
            <span class="status ${match.status === "GIOCATA" ? "status-ok" : "status-warning"}">${escapeHtml(statusLabel)}</span>
            ${getAdminMatchActionButtons(row)}
          </span>
        </div>`;
    }).join("") || `<p class="muted admin-empty-message">Nessuna partita trovata per stagione, competizione e fase/giornata selezionate.</p>`;

    const jsonCount = filteredRows.filter((row) => row.hasJson).length;
    const firebaseCount = filteredRows.filter((row) => row.hasFirebase).length;
    const deletedCount = filteredRows.filter((row) => row.isDeleted).length;
    const saveDisabled = competitionsForSelectedSeason.length ? "" : "disabled";
    const detailsOpen = state.keepCompetitionMatchesListOpenV117 ? " open" : "";

    return renderAdminPanel("adminCompetitionMatchesPanel", "Firebase + JSON", "Partite competizioni", "Inserisci calendario e risultati solo per competizioni disputate. JSON indica il calendario statico, Firebase il record attivo, deleted la copia Firebase rimossa.", `
        <form id="adminCompetitionMatchesForm" class="form-grid">
          <input id="adminCompetitionMatchId" type="hidden" />
          <label>Stagione<select id="adminCompetitionMatchSeasonId" class="input" required>${seasonOptions}</select></label>
          <label>
            Competizione
            <select id="adminCompetitionMatchCompetitionId" class="input" required>${competitionOptions}</select>
            <small class="field-hint">Le competizioni segnate come Non disputata sono escluse.${blockedCompetitionsCount ? ` Escluse: ${blockedCompetitionsCount}.` : ""}</small>
          </label>
          <label>
            Filtro elenco fase/giornata
            <select id="adminCompetitionMatchdayFilter" class="input">${matchdayFilterOptions}</select>
            <small class="field-hint">La lista sotto viene filtrata per stagione, competizione e fase/giornata.</small>
          </label>
          <label>
            Fase
            <input id="adminCompetitionMatchday" class="input" type="text" list="adminCompetitionMatchdayOptions" placeholder="Es. Giornata 1 oppure QF - Andata" required />
            <datalist id="adminCompetitionMatchdayOptions">${matchdayOptions}</datalist>
            <small class="field-hint">Per competizioni a gironi puoi usare QF/SF/F/Finale/Finalissima o scrivere una giornata libera.</small>
          </label>
          <label>Data<input id="adminCompetitionMatchDate" class="input" type="date" /></label>
          <label>Giornata Serie A reale<input id="adminCompetitionMatchSerieAMatchday" class="input" type="number" min="1" step="1" placeholder="Es. 12" /></label>
          <label>Squadra casa<select id="adminCompetitionMatchHome" class="input" required></select></label>
          <label>Squadra trasferta<select id="adminCompetitionMatchAway" class="input" required></select></label>
          <label>Stato partita<select id="adminCompetitionMatchStatus" class="input" required>${statusOptions}</select></label>
          <label>Gol casa<input id="adminCompetitionMatchHomeGoals" class="input" type="number" min="0" step="1" /></label>
          <label>Gol trasferta<input id="adminCompetitionMatchAwayGoals" class="input" type="number" min="0" step="1" /></label>
          <label>FP casa<input id="adminCompetitionMatchHomeScore" class="input" type="number" step="0.5" /></label>
          <label>FP trasferta<input id="adminCompetitionMatchAwayScore" class="input" type="number" step="0.5" /></label>
          <label class="span-2">Note<input id="adminCompetitionMatchNotes" class="input" type="text" placeholder="Opzionale" /></label>
          <div class="form-actions span-2">
            <button class="button button-primary" type="submit" ${saveDisabled}>Salva partita</button>
            <button id="adminCompetitionMatchReset" class="button button-secondary" type="button">Nuova</button>
            <span id="adminCompetitionMatchStatusText" class="form-status"></span>
          </div>
        </form>
        <details class="admin-edit-section" data-admin-details-key="competition-matches-filtered"${detailsOpen}>
          <summary><strong>Partite filtrate</strong><span>${filteredRows.length} · ${jsonCount} JSON · ${firebaseCount} Firebase attive${deletedCount ? ` · ${deletedCount} deleted` : ""}</span></summary>
          <p class="field-hint">JSON = partita letta da <code>assets/competitions</code>. Firebase = record attivo in Firestore. deleted = la copia Firebase e stata rimossa/marcata deleted, ma il JSON statico resta visibile.</p>
          <div class="admin-list">${rows}</div>
        </details>`);
  }

  return {
    renderCompetitionAdminPanel,
    renderCompetitionResultsAdminPanel,
    renderCompetitionResultsEditor,
    renderCompetitionMatchesAdminPanel
  };
}
