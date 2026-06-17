export function installCommunicationGeneratorRefactorV210(deps = {}) {
  const {
    state,
    escapeHtml,
    getCurrentSeasonId,
    getSeasonSortValue,
    getSeasonTeamDisplayName,
    getCompetitionName,
    formatMatchResult,
    formatMatchStage,
    compareMatchesForDisplay,
    getSeasonLabel,
    getSeasonTeamById,
    getSeasonArchiveHonorTitles,
    getRenderAdminArea,
    setRenderAdminArea,
    getRenderAdminLightGate,
    setRenderAdminLightGate,
    getRenderAdminHelpPanel,
    setRenderAdminHelpPanel,
    expandAdminPanel
  } = deps;

  if (!state) throw new Error("installCommunicationGeneratorRefactorV210 requires state");

  const getSeasonSortValueV193 = typeof getSeasonSortValue === "function" ? getSeasonSortValue : (seasonId) => String(seasonId || "");
  const getCompetitionNameV196 = typeof getCompetitionName === "function" ? getCompetitionName : null;
  const getSeasonLabelV193 = typeof getSeasonLabel === "function" ? getSeasonLabel : null;
  const getSeasonArchiveHonorTitlesV196 = typeof getSeasonArchiveHonorTitles === "function" ? getSeasonArchiveHonorTitles : null;
  const safeEscapeHtml = typeof escapeHtml === "function" ? escapeHtml : (value) => String(value ?? "");
  const expandAdminPanelV250 = typeof expandAdminPanel === "function" ? expandAdminPanel : null;

const COMMUNICATION_GENERATOR_STORAGE_KEY_V197 = "fantaPetilloCommunicationGeneratorV197";

function getCommunicationGeneratorSeasonsV197() {
  const seasons = [...(state.raw.seasons || [])];
  return seasons.sort((a, b) => {
    const av = typeof getSeasonSortValueV193 === "function" ? getSeasonSortValueV193(a.id) : String(a.id || "");
    const bv = typeof getSeasonSortValueV193 === "function" ? getSeasonSortValueV193(b.id) : String(b.id || "");
    if (typeof av === "number" && typeof bv === "number") return bv - av;
    return String(bv).localeCompare(String(av));
  });
}

function getCommunicationGeneratorSelectedSeasonV197() {
  const seasons = getCommunicationGeneratorSeasonsV197();
  const valid = new Set(seasons.map((season) => season.id));
  let saved = "";
  try { saved = localStorage.getItem(COMMUNICATION_GENERATOR_STORAGE_KEY_V197) || ""; } catch (_) {}
  const candidate = state.communicationGeneratorSeasonIdV197 || saved || getCurrentSeasonId();
  const selected = valid.has(candidate) ? candidate : (seasons[0]?.id || getCurrentSeasonId() || "");
  state.communicationGeneratorSeasonIdV197 = selected;
  return selected;
}

function setCommunicationGeneratorSelectedSeasonV197(seasonId) {
  state.communicationGeneratorSeasonIdV197 = seasonId || getCommunicationGeneratorSelectedSeasonV197();
  try { localStorage.setItem(COMMUNICATION_GENERATOR_STORAGE_KEY_V197, state.communicationGeneratorSeasonIdV197); } catch (_) {}
  renderCommunicationGeneratorPanelV197();
}

function getCommunicationGeneratorSeasonTeamsV197(seasonId = getCommunicationGeneratorSelectedSeasonV197()) {
  return (state.raw.seasonTeams || [])
    .filter((team) => !seasonId || team.seasonId === seasonId)
    .sort((a, b) => String(getSeasonTeamDisplayName(a.id)).localeCompare(String(getSeasonTeamDisplayName(b.id)), "it", { sensitivity: "base" }));
}

function getCommunicationGeneratorCompetitionsV197(seasonId = getCommunicationGeneratorSelectedSeasonV197()) {
  return (state.raw.competitions || [])
    .filter((competition) => !seasonId || competition.seasonId === seasonId)
    .sort((a, b) => String(getCompetitionNameV196?.(a) || a.name || a.id).localeCompare(String(getCompetitionNameV196?.(b) || b.name || b.id), "it", { sensitivity: "base" }));
}

function getCommunicationGeneratorNewsDateV197() {
  const date = new Date();
  try {
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
  } catch (_) {
    return date.toISOString().slice(0, 10);
  }
}

function getCommunicationGeneratorCompetitionLabelV197(competition) {
  if (!competition) return "competizione";
  if (typeof getCompetitionNameV196 === "function") return getCompetitionNameV196(competition);
  return competition.name || competition.label || competition.id || "competizione";
}

function getCommunicationGeneratorCompletedMatchesV197(seasonId, competitionId = "") {
  const competitionIds = new Set(
    (state.raw.competitions || [])
      .filter((competition) => (!seasonId || competition.seasonId === seasonId) && (!competitionId || competition.id === competitionId))
      .map((competition) => competition.id)
  );
  return (state.raw.competitionMatches || [])
    .filter((match) => competitionIds.has(match.competitionId))
    .filter((match) => {
      const result = typeof formatMatchResult === "function" ? formatMatchResult(match) : "-";
      return String(match.status || "").toUpperCase() === "PLAYED" || result !== "-";
    })
    .sort((a, b) => {
      if (typeof compareMatchesForDisplay === "function") return compareMatchesForDisplay(b, a);
      return String(b.matchDate || b.date || "").localeCompare(String(a.matchDate || a.date || ""));
    });
}

function getCommunicationGeneratorCompetitionResultsV197(competitionId) {
  return (state.raw.competitionResults || [])
    .filter((result) => !competitionId || result.competitionId === competitionId)
    .sort((a, b) => Number(a.position || 999) - Number(b.position || 999));
}

function getCommunicationGeneratorRecentMovementsV197(seasonId, seasonTeamId = "") {
  const teams = getCommunicationGeneratorSeasonTeamsV197(seasonId);
  const validTeamIds = new Set(teams.map((team) => team.id));
  return (state.raw.fmMovements || [])
    .filter((movement) => validTeamIds.has(movement.seasonTeamId || ""))
    .filter((movement) => !seasonTeamId || movement.seasonTeamId === seasonTeamId)
    .sort((a, b) => String(b.createdAt || b.date || b.id || "").localeCompare(String(a.createdAt || a.date || a.id || "")))
    .slice(0, 8);
}

function getCommunicationGeneratorLatestHonorV197(seasonId) {
  return (state.raw.honorRoll || []).find((row) => (row.seasonId || row.id) === seasonId) || null;
}

function formatCommunicationGeneratorMatchLineV197(match) {
  const competition = (state.raw.competitions || []).find((item) => item.id === match.competitionId);
  const home = match.homeTeamName || getSeasonTeamDisplayName(match.homeSeasonTeamId);
  const away = match.awayTeamName || getSeasonTeamDisplayName(match.awaySeasonTeamId);
  const result = typeof formatMatchResult === "function" ? formatMatchResult(match) : "-";
  const stage = typeof formatMatchStage === "function" ? formatMatchStage(match) : "";
  return `${home} - ${away} ${result}${stage ? ` (${stage})` : ""}${competition ? ` · ${getCommunicationGeneratorCompetitionLabelV197(competition)}` : ""}`;
}

function formatCommunicationGeneratorMovementLineV197(movement) {
  const teamName = getSeasonTeamDisplayName(movement.seasonTeamId);
  const amount = movement.amount !== undefined && movement.amount !== null && movement.amount !== "" ? `${movement.amount} FM` : "FM";
  const description = movement.description || movement.playerName || movement.type || "movimento";
  return `${teamName}: ${description} (${amount})`;
}

function buildResultsAnnouncementDraftV197({ seasonId, competitionId, teamId, tone }) {
  const seasonLabel = typeof getSeasonLabelV193 === "function" ? getSeasonLabelV193(seasonId) : seasonId;
  const competition = (state.raw.competitions || []).find((item) => item.id === competitionId) || null;
  const matches = getCommunicationGeneratorCompletedMatchesV197(seasonId, competitionId).slice(0, 6);
  const title = competition ? `Risultati ${getCommunicationGeneratorCompetitionLabelV197(competition)}` : `Risultati ${seasonLabel}`;
  const intro = tone === "celebrativo"
    ? `La FantaPetillo si accende ancora: ecco il riepilogo aggiornato dei risultati della ${seasonLabel}.`
    : tone === "ironico"
      ? `Altro giro, altre sentenze: la ${seasonLabel} consegna nuovi verdetti e qualche inevitabile mal di pancia.`
      : `Pubblichiamo il riepilogo aggiornato dei risultati relativi alla ${seasonLabel}.`;
  const lines = matches.length ? matches.map(formatCommunicationGeneratorMatchLineV197).map((line) => `- ${line}`).join("\n") : "- Nessun risultato recente disponibile nei dati caricati.";
  const focus = teamId ? `\n\nFocus squadra: ${getSeasonTeamDisplayName(teamId)}.` : "";
  const body = `${intro}\n\n${lines}${focus}\n\nClassifiche e dettagli sono consultabili nella sezione Competizioni del sito.`;
  return { title, body, topic: "COMPETIZIONE", seasonId, seasonTeamId: teamId || "" };
}

function buildWinnerAnnouncementDraftV197({ seasonId, competitionId, teamId, tone }) {
  const seasonLabel = typeof getSeasonLabelV193 === "function" ? getSeasonLabelV193(seasonId) : seasonId;
  const competition = (state.raw.competitions || []).find((item) => item.id === competitionId) || null;
  const results = getCommunicationGeneratorCompetitionResultsV197(competitionId);
  const winnerId = results[0]?.seasonTeamId || competition?.winnerSeasonTeamId || teamId || "";
  const winner = winnerId ? getSeasonTeamDisplayName(winnerId) : "la squadra vincitrice";
  const competitionName = competition ? getCommunicationGeneratorCompetitionLabelV197(competition) : "competizione";
  const podium = results.slice(0, 3).map((row, index) => `${index + 1}. ${getSeasonTeamDisplayName(row.seasonTeamId)}${row.points !== undefined && row.points !== null && row.points !== "" ? ` - ${row.points} punti` : ""}`).join("\n");
  const title = `${winner} conquista ${competitionName}`;
  const opener = tone === "ironico"
    ? `Signori, il verdetto e' arrivato: ${winner} si prende ${competitionName} e lascia agli altri il consueto spazio per recriminazioni, calcoli e promesse di rivincita.`
    : tone === "celebrativo"
      ? `${winner} entra nella storia della ${seasonLabel}: ${competitionName} e' sua.`
      : `${winner} si aggiudica ${competitionName} nella ${seasonLabel}.`;
  const body = `${opener}\n\n${podium ? `Podio ufficiale:\n${podium}\n\n` : ""}Complimenti alla societa' vincitrice e appuntamento ai prossimi impegni della FantaPetillo.`;
  return { title, body, topic: "COMPETIZIONE", seasonId, seasonTeamId: winnerId || teamId || "" };
}

function buildMarketAnnouncementDraftV197({ seasonId, teamId, tone }) {
  const seasonLabel = typeof getSeasonLabelV193 === "function" ? getSeasonLabelV193(seasonId) : seasonId;
  const movements = getCommunicationGeneratorRecentMovementsV197(seasonId, teamId);
  const title = teamId ? `Aggiornamento mercato ${getSeasonTeamDisplayName(teamId)}` : `Aggiornamento Fantamercato ${seasonLabel}`;
  const intro = tone === "ironico"
    ? `Il mercato non dorme mai, soprattutto quando ci sono FM da contare e presidenti da tenere d'occhio.`
    : tone === "celebrativo"
      ? `Nuovi movimenti animano il Fantamercato della ${seasonLabel}.`
      : `Comunichiamo gli ultimi aggiornamenti relativi al Fantamercato della ${seasonLabel}.`;
  const lines = movements.length ? movements.map(formatCommunicationGeneratorMovementLineV197).map((line) => `- ${line}`).join("\n") : "- Nessun movimento FM recente disponibile nei dati caricati.";
  const body = `${intro}\n\n${lines}\n\nI dettagli aggiornati sono disponibili nelle sezioni squadra e Fantamercato.`;
  return { title, body, topic: "GENERALE", seasonId, seasonTeamId: teamId || "" };
}

function buildPublicationAnnouncementDraftV197({ seasonId, tone }) {
  const seasonLabel = typeof getSeasonLabelV193 === "function" ? getSeasonLabelV193(seasonId) : seasonId;
  const title = `Aggiornamento dati pubblici ${seasonLabel}`;
  const body = `${tone === "ironico" ? "La macchina organizzativa ha prodotto il suo verdetto digitale." : "I dati pubblici del sito sono stati aggiornati."}\n\nSono disponibili gli aggiornamenti relativi a stagione, rose, competizioni, Albo d'Oro, Palmarès e statistiche pubbliche.\n\nIn caso di anomalie dopo refresh o logout, segnalare eventuali dati non allineati cosi' da verificare snapshot e JSON statici.`;
  return { title, body, topic: "GENERALE", seasonId, seasonTeamId: "" };
}

function buildTeamFocusAnnouncementDraftV197({ seasonId, teamId, tone }) {
  const team = getSeasonTeamById(teamId) || getCommunicationGeneratorSeasonTeamsV197(seasonId)[0] || null;
  const seasonTeamId = team?.id || teamId || "";
  const teamName = seasonTeamId ? getSeasonTeamDisplayName(seasonTeamId) : "Squadra";
  const rosterCount = (state.raw.rosterEntries || []).filter((entry) => entry.seasonTeamId === seasonTeamId).length;
  const movements = getCommunicationGeneratorRecentMovementsV197(seasonId, seasonTeamId).slice(0, 4);
  const matches = getCommunicationGeneratorCompletedMatchesV197(seasonId).filter((match) => match.homeSeasonTeamId === seasonTeamId || match.awaySeasonTeamId === seasonTeamId).slice(0, 4);
  const title = `Focus ${teamName}`;
  const intro = tone === "ironico"
    ? `${teamName} finisce sotto la lente: numeri, mosse e qualche inevitabile motivo di discussione.`
    : tone === "celebrativo"
      ? `${teamName} protagonista: riepilogo aggiornato della stagione.`
      : `Riepilogo aggiornato per ${teamName}.`;
  const movementLines = movements.length ? movements.map(formatCommunicationGeneratorMovementLineV197).map((line) => `- ${line}`).join("\n") : "- Nessun movimento recente disponibile.";
  const matchLines = matches.length ? matches.map(formatCommunicationGeneratorMatchLineV197).map((line) => `- ${line}`).join("\n") : "- Nessuna partita recente disponibile.";
  const body = `${intro}\n\nRosa attuale nei dati caricati: ${rosterCount || "n.d."} giocatori.\n\nUltimi movimenti:\n${movementLines}\n\nUltime partite:\n${matchLines}`;
  return { title, body, topic: "COMUNICATO_SQUADRA", seasonId, seasonTeamId };
}

function buildHonorAnnouncementDraftV197({ seasonId, tone }) {
  const seasonLabel = typeof getSeasonLabelV193 === "function" ? getSeasonLabelV193(seasonId) : seasonId;
  const honor = getCommunicationGeneratorLatestHonorV197(seasonId);
  const titles = typeof getSeasonArchiveHonorTitlesV196 === "function" ? getSeasonArchiveHonorTitlesV196(honor) : [];
  const title = `Albo d'Oro aggiornato ${seasonLabel}`;
  const intro = tone === "celebrativo"
    ? `L'Albo d'Oro della ${seasonLabel} si arricchisce di nuovi protagonisti.`
    : tone === "ironico"
      ? `L'Albo d'Oro e' stato aggiornato: qualcuno festeggia, qualcuno controlla gia' i cavilli.`
      : `Aggiornato l'Albo d'Oro della ${seasonLabel}.`;
  const lines = titles.length ? titles.map((item) => `- ${item.label}: ${item.teamName}`).join("\n") : "- Nessun titolo principale disponibile nei dati caricati.";
  const body = `${intro}\n\n${lines}\n\nLa sezione Albo d'Oro, Palmarès e FIFA Ranking e' disponibile sul sito.`;
  return { title, body, topic: "GENERALE", seasonId, seasonTeamId: "" };
}

function buildCommunicationDraftV197(options = {}) {
  const payload = {
    template: options.template || document.getElementById("communicationTemplateV197")?.value || "results",
    seasonId: options.seasonId || document.getElementById("communicationSeasonV197")?.value || getCommunicationGeneratorSelectedSeasonV197(),
    competitionId: options.competitionId || document.getElementById("communicationCompetitionV197")?.value || "",
    teamId: options.teamId || document.getElementById("communicationTeamV197")?.value || "",
    tone: options.tone || document.getElementById("communicationToneV197")?.value || "istituzionale"
  };
  if (payload.template === "winner") return buildWinnerAnnouncementDraftV197(payload);
  if (payload.template === "market") return buildMarketAnnouncementDraftV197(payload);
  if (payload.template === "publication") return buildPublicationAnnouncementDraftV197(payload);
  if (payload.template === "team") return buildTeamFocusAnnouncementDraftV197(payload);
  if (payload.template === "honor") return buildHonorAnnouncementDraftV197(payload);
  return buildResultsAnnouncementDraftV197(payload);
}

function getCommunicationGeneratorOptionsHtmlV197(items, selectedId, getLabelFn) {
  return items.map((item) => `<option value="${safeEscapeHtml(item.id)}" ${item.id === selectedId ? "selected" : ""}>${safeEscapeHtml(getLabelFn(item))}</option>`).join("");
}

function renderCommunicationGeneratorHtmlV197(draft = state.communicationGeneratorDraftV197 || null) {
  const selectedSeason = getCommunicationGeneratorSelectedSeasonV197();
  const seasons = getCommunicationGeneratorSeasonsV197();
  const competitions = getCommunicationGeneratorCompetitionsV197(selectedSeason);
  const teams = getCommunicationGeneratorSeasonTeamsV197(selectedSeason);
  const currentDraft = draft || buildCommunicationDraftV197({ seasonId: selectedSeason });
  state.communicationGeneratorDraftV197 = currentDraft;
  const seasonOptions = getCommunicationGeneratorOptionsHtmlV197(seasons, selectedSeason, (season) => season.name || season.id);
  const competitionOptions = `<option value="">Tutte / automatica</option>${getCommunicationGeneratorOptionsHtmlV197(competitions, "", (competition) => getCommunicationGeneratorCompetitionLabelV197(competition))}`;
  const teamOptions = `<option value="">Nessuna / automatica</option>${getCommunicationGeneratorOptionsHtmlV197(teams, currentDraft.seasonTeamId || "", (team) => getSeasonTeamDisplayName(team.id))}`;
  return `
    <section class="panel communication-generator-v197" aria-labelledby="communicationGeneratorTitleV197">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Comunicati</p>
          <h3 id="communicationGeneratorTitleV197">Generatore comunicati automatici</h3>
          <p>Prepara una bozza partendo da risultati, mercato, Albo o dati di pubblicazione. Non salva nulla finche' non usi il form Comunicati.</p>
        </div>
        <span class="communication-generator-badge-v197">Zero letture extra</span>
      </div>
      <div class="communication-generator-grid-v197">
        <label><span>Tipo comunicato</span><select id="communicationTemplateV197" class="input">
          <option value="results">Risultati / riepilogo giornata</option>
          <option value="winner">Vincitore competizione</option>
          <option value="market">Aggiornamento mercato</option>
          <option value="team">Focus squadra</option>
          <option value="honor">Albo d'Oro / Palmarès</option>
          <option value="publication">Aggiornamento dati pubblici</option>
        </select></label>
        <label><span>Stagione</span><select id="communicationSeasonV197" class="input">${seasonOptions}</select></label>
        <label><span>Competizione</span><select id="communicationCompetitionV197" class="input">${competitionOptions}</select></label>
        <label><span>Squadra</span><select id="communicationTeamV197" class="input">${teamOptions}</select></label>
        <label><span>Tono</span><select id="communicationToneV197" class="input">
          <option value="istituzionale">Istituzionale</option>
          <option value="celebrativo">Celebrativo</option>
          <option value="ironico">Ironico leggero</option>
        </select></label>
        <div class="communication-generator-actions-v197">
          <button class="button button-primary" type="button" data-generate-communication-v197>Genera bozza</button>
          <button class="button button-secondary" type="button" data-copy-communication-v197>Copia testo</button>
          <button class="button button-secondary" type="button" data-insert-communication-v197>Inserisci nei Comunicati</button>
        </div>
      </div>
      <div class="communication-generator-preview-v197">
        <label><span>Titolo bozza</span><input id="communicationDraftTitleV197" class="input" type="text" value="${safeEscapeHtml(currentDraft.title || "")}" /></label>
        <label><span>Testo bozza</span><textarea id="communicationDraftBodyV197" class="input textarea" rows="9">${safeEscapeHtml(currentDraft.body || "")}</textarea></label>
      </div>
      <div class="communication-generator-info-v197">
        <article><strong>Come funziona</strong><p>Genera solo una bozza locale: puoi copiarla oppure inserirla nel form Comunicati e poi salvarla manualmente.</p></article>
        <article><strong>Dopo il salvataggio</strong><p>Ricordati di fare Snapshot pubblici → Aggiorna tutto e scaricare gli statici richiesti dai promemoria V189.</p></article>
        <article><strong>Mobile</strong><p>Il pannello usa card e campi a larghezza piena, senza tabelle larghe.</p></article>
      </div>
      <p id="communicationGeneratorStatusV197" class="form-status">Bozza generata il ${safeEscapeHtml(getCommunicationGeneratorNewsDateV197())}.</p>
    </section>`;
}

function renderCommunicationGeneratorPanelV197() {
  if (!state.isAdmin) return;
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;
  let holder = adminPanel.querySelector("#communicationGeneratorMountV197");
  if (!holder) {
    holder = document.createElement("div");
    holder.id = "communicationGeneratorMountV197";
    const wizard = adminPanel.querySelector("#publishWizardMountV191");
    const status = adminPanel.querySelector("#publicationStatusMountV190");
    const lightGate = adminPanel.querySelector(".admin-light-gate-v178");
    if (wizard) wizard.insertAdjacentElement("afterend", holder);
    else if (status) status.insertAdjacentElement("afterend", holder);
    else if (lightGate) lightGate.insertAdjacentElement("beforebegin", holder);
    else adminPanel.insertAdjacentElement("afterbegin", holder);
  }
  holder.innerHTML = renderCommunicationGeneratorHtmlV197(state.communicationGeneratorDraftV197);
  const template = document.getElementById("communicationTemplateV197");
  if (template && state.communicationGeneratorTemplateV197) template.value = state.communicationGeneratorTemplateV197;
  const tone = document.getElementById("communicationToneV197");
  if (tone && state.communicationGeneratorToneV197) tone.value = state.communicationGeneratorToneV197;
}

function setCommunicationGeneratorStatusV197(message, isError = false) {
  const status = document.getElementById("communicationGeneratorStatusV197");
  if (!status) return;
  status.textContent = message || "";
  status.classList.toggle("error", Boolean(isError));
}

function updateCommunicationDraftFromInputsV197() {
  state.communicationGeneratorTemplateV197 = document.getElementById("communicationTemplateV197")?.value || "results";
  state.communicationGeneratorToneV197 = document.getElementById("communicationToneV197")?.value || "istituzionale";
  const draft = buildCommunicationDraftV197();
  state.communicationGeneratorDraftV197 = draft;
  const title = document.getElementById("communicationDraftTitleV197");
  const body = document.getElementById("communicationDraftBodyV197");
  if (title) title.value = draft.title || "";
  if (body) body.value = draft.body || "";
  setCommunicationGeneratorStatusV197("Bozza aggiornata. Puoi copiarla o inserirla nel form Comunicati.");
  return draft;
}

async function copyCommunicationDraftV197(button = null) {
  const title = document.getElementById("communicationDraftTitleV197")?.value || state.communicationGeneratorDraftV197?.title || "Comunicato";
  const body = document.getElementById("communicationDraftBodyV197")?.value || state.communicationGeneratorDraftV197?.body || "";
  const text = `${title}\n\n${body}`.trim();
  try {
    await navigator.clipboard.writeText(text);
    const previous = button?.textContent;
    if (button) {
      button.textContent = "Copiato";
      window.setTimeout(() => { button.textContent = previous || "Copia testo"; }, 1200);
    }
    setCommunicationGeneratorStatusV197("Testo copiato negli appunti.");
  } catch (error) {
    console.warn("Copia comunicato non riuscita", error);
    window.prompt("Copia manualmente il comunicato", text);
  }
}

function insertCommunicationDraftIntoNewsFormV197() {
  const draft = state.communicationGeneratorDraftV197 || buildCommunicationDraftV197();
  const titleValue = document.getElementById("communicationDraftTitleV197")?.value || draft.title || "Comunicato";
  const bodyValue = document.getElementById("communicationDraftBodyV197")?.value || draft.body || "";
  if (expandAdminPanelV250) expandAdminPanelV250("adminNewsPanel");
  const title = document.getElementById("adminNewsTitle");
  const body = document.getElementById("adminNewsBody");
  const topic = document.getElementById("adminNewsTopic");
  const season = document.getElementById("adminNewsSeasonId");
  const team = document.getElementById("adminNewsSeasonTeamId");
  if (!title || !body) {
    setCommunicationGeneratorStatusV197("Carica dati amministrazione per inserire la bozza nel form Comunicati.", true);
    return;
  }
  title.value = titleValue;
  body.value = bodyValue;
  if (topic) topic.value = draft.topic || "GENERALE";
  if (season) season.value = draft.seasonId || getCommunicationGeneratorSelectedSeasonV197();
  if (team) team.value = draft.seasonTeamId || "";
  const newsStatus = document.getElementById("adminNewsStatus");
  if (newsStatus) newsStatus.textContent = "Bozza inserita dal generatore. Controlla e salva il comunicato.";
  setCommunicationGeneratorStatusV197("Bozza inserita nel form Comunicati. Controlla e premi Salva comunicato.");
  try { title.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (_) {}
}

const renderAdminAreaBeforeV197 = typeof getRenderAdminArea === "function" ? getRenderAdminArea() : null;
if (renderAdminAreaBeforeV197 && typeof setRenderAdminArea === "function") {
  setRenderAdminArea(function renderAdminAreaV197() {
    const result = renderAdminAreaBeforeV197?.();
    renderCommunicationGeneratorPanelV197();
    return result;
  });
}

const renderAdminLightGateBeforeV197 = typeof getRenderAdminLightGate === "function" ? getRenderAdminLightGate() : null;
if (renderAdminLightGateBeforeV197 && typeof setRenderAdminLightGate === "function") {
  setRenderAdminLightGate(function renderAdminLightGateV197() {
    const html = renderAdminLightGateBeforeV197() || "";
    if (html.includes("communicationGeneratorMountV197")) return html;
    return `<div id="communicationGeneratorMountV197">${renderCommunicationGeneratorHtmlV197(state.communicationGeneratorDraftV197)}</div>${html}`;
  });
}

document.addEventListener("change", (event) => {
  if (event.target?.id === "communicationSeasonV197") {
    setCommunicationGeneratorSelectedSeasonV197(event.target.value);
    return;
  }
  if (["communicationTemplateV197", "communicationCompetitionV197", "communicationTeamV197", "communicationToneV197"].includes(event.target?.id || "")) {
    updateCommunicationDraftFromInputsV197();
  }
}, true);

document.addEventListener("click", async (event) => {
  const generate = event.target.closest?.("[data-generate-communication-v197]");
  if (generate) {
    event.preventDefault();
    updateCommunicationDraftFromInputsV197();
    return;
  }
  const copy = event.target.closest?.("[data-copy-communication-v197]");
  if (copy) {
    event.preventDefault();
    await copyCommunicationDraftV197(copy);
    return;
  }
  const insert = event.target.closest?.("[data-insert-communication-v197]");
  if (insert) {
    event.preventDefault();
    insertCommunicationDraftIntoNewsFormV197();
  }
}, true);

function injectCommunicationGeneratorStylesV197() {
  if (document.getElementById("communicationGeneratorStylesV197")) return;
  const style = document.createElement("style");
  style.id = "communicationGeneratorStylesV197";
  style.textContent = `
    .communication-generator-v197 { border: 1px solid rgba(251,191,36,.28); background: linear-gradient(135deg, rgba(251,191,36,.07), rgba(59,130,246,.045)); min-width: 0; overflow: hidden; }
    .communication-generator-badge-v197 { border-radius: 999px; padding: .35rem .7rem; font-size: .78rem; font-weight: 800; color: #fde68a; border: 1px solid rgba(251,191,36,.35); background: rgba(251,191,36,.12); white-space: nowrap; }
    .communication-generator-grid-v197 { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .75rem; align-items: end; margin-top: 1rem; }
    .communication-generator-grid-v197 label, .communication-generator-preview-v197 label { display: grid; gap: .35rem; min-width: 0; }
    .communication-generator-grid-v197 label span, .communication-generator-preview-v197 label span { color: var(--muted); font-size: .78rem; text-transform: uppercase; letter-spacing: .08em; font-weight: 800; }
    .communication-generator-actions-v197 { display: flex; flex-wrap: wrap; gap: .5rem; grid-column: 1 / -1; }
    .communication-generator-preview-v197 { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: .75rem; margin-top: .9rem; }
    .communication-generator-preview-v197 textarea { min-height: 12rem; }
    .communication-generator-info-v197 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .65rem; margin-top: .9rem; }
    .communication-generator-info-v197 article { border: 1px solid rgba(255,255,255,.11); border-radius: 1rem; padding: .75rem; background: rgba(15,23,42,.45); min-width: 0; }
    .communication-generator-info-v197 strong, .communication-generator-info-v197 p { overflow-wrap: anywhere; }
    .communication-generator-info-v197 p { margin: .25rem 0 0; color: var(--muted); }
    @media (max-width: 1050px) {
      .communication-generator-grid-v197 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .communication-generator-preview-v197, .communication-generator-info-v197 { grid-template-columns: 1fr; }
    }
    @media (max-width: 680px) {
      .communication-generator-v197 { margin-inline: 0; }
      .communication-generator-grid-v197 { grid-template-columns: 1fr; }
      .communication-generator-actions-v197 { flex-direction: column; align-items: stretch; }
      .communication-generator-actions-v197 .button { width: 100%; }
      .communication-generator-badge-v197 { width: 100%; text-align: center; }
    }
  `;
  document.head.appendChild(style);
}

injectCommunicationGeneratorStylesV197();

const renderAdminHelpPanelBeforeV197 = typeof getRenderAdminHelpPanel === "function" ? getRenderAdminHelpPanel() : null;
if (renderAdminHelpPanelBeforeV197 && typeof setRenderAdminHelpPanel === "function") {
  setRenderAdminHelpPanel(function renderAdminHelpPanelV197() {
    let html = renderAdminHelpPanelBeforeV197?.() || "";
    if (html && !html.includes("Generatore comunicati automatici")) {
      html = html.replace("</div>\n    </section>", "        <article>\n          <h4>Generatore comunicati automatici</h4>\n          <p>Prepara bozze per risultati, vincitori, mercato, focus squadra, Albo e pubblicazione dati. Non salva su Firebase: copia o inserisce nel form Comunicati per revisione manuale.</p>\n        </article>\n      </div>\n    </section>");
    }
    return html;
  });
}

const api = {
  draft: buildCommunicationDraftV197,
  render: renderCommunicationGeneratorPanelV197,
  insert: insertCommunicationDraftIntoNewsFormV197,
  copy: copyCommunicationDraftV197,
  setSeason: setCommunicationGeneratorSelectedSeasonV197
};

if (typeof window !== "undefined") {
  window.FantaPetilloCommunicationGenerator = api;
}

return api;

}
