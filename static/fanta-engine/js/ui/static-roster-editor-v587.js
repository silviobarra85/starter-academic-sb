(function installStaticRosterEditorV587() {
  'use strict';

  const VERSION = 'V587';
  const PANEL_ID = 'adminStaticRosterEditorPanelV587';
  const ROOT_ID = 'adminStaticRosterEditorRootV587';
  const DATA = {
    manifest: null,
    rosterFileName: '',
    roster: null,
    originalRoster: null,
    listoneManifest: null,
    listone: null,
    selectedTeamIndex: 0,
    selectedPlayerIndex: -1,
    dirty: false,
    message: ''
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function currentLeagueSlug() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const known = ['zonaorientale', 'fantapetillomantramanager', '_league-template'];
    return parts.find((part) => known.includes(part)) || parts[parts.length - 1] || 'zonaorientale';
  }

  function leagueBaseUrl() {
    return new URL('./', window.location.href);
  }

  function engineBaseUrl() {
    return new URL('../fanta-engine/', leagueBaseUrl());
  }

  async function fetchJson(url) {
    const response = await fetch(`${url}${url.search ? '&' : '?'}v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status} su ${url}`);
    return response.json();
  }

  function getLatestManifestEntry(manifest) {
    const rosters = Array.isArray(manifest?.rosters) ? manifest.rosters : [];
    return rosters
      .slice()
      .sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || '')))[0] || null;
  }

  function getListoniForSeason(seasonId) {
    const listoni = Array.isArray(DATA.listoneManifest?.listoni) ? DATA.listoneManifest.listoni : [];
    return listoni.filter((entry) => String(entry.seasonId || '') === String(seasonId || ''));
  }

  function getLatestListoneEntry(seasonId) {
    const sameSeason = getListoniForSeason(seasonId);
    const pool = sameSeason.length ? sameSeason : (Array.isArray(DATA.listoneManifest?.listoni) ? DATA.listoneManifest.listoni : []);
    return pool.slice().sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || '')))[0] || null;
  }

  function countPlayers(roster) {
    return (roster?.rosters || []).reduce((sum, item) => sum + (Array.isArray(item.players) ? item.players.length : 0), 0);
  }

  function normalizeRosterShape(roster) {
    const copy = JSON.parse(JSON.stringify(roster || {}));
    copy.meta = copy.meta || {};
    copy.rosters = Array.isArray(copy.rosters) ? copy.rosters : [];
    copy.rosters.forEach((team) => {
      team.players = Array.isArray(team.players) ? team.players : [];
      team.players.forEach((player) => {
        player.role = String(player.role || player.classicRole || player.rosterRole || '').trim().toUpperCase();
        player.playerName = String(player.playerName || player.name || '').trim();
        player.realTeam = String(player.realTeam || '').trim().toUpperCase();
        if (player.cost !== '' && player.cost != null && !Number.isNaN(Number(player.cost))) player.cost = Number(player.cost);
      });
      team.playerCount = team.players.length;
    });
    copy.meta.teams = copy.rosters.length;
    copy.meta.players = countPlayers(copy);
    return copy;
  }

  function getSelectedTeam() {
    return DATA.roster?.rosters?.[DATA.selectedTeamIndex] || null;
  }

  function listonePlayers() {
    return Array.isArray(DATA.listone?.players) ? DATA.listone.players : [];
  }

  function playerToRosterEntry(player, costOverride) {
    const rawCost = costOverride === '' || costOverride == null
      ? (player.rosterCost ?? player.cost ?? player.quotationCurrent ?? 0)
      : costOverride;
    const costNumber = Number(String(rawCost).replace(',', '.'));
    return {
      role: String(player.classicRole || player.rosterRole || player.role || '').trim().toUpperCase(),
      playerName: String(player.playerName || '').trim(),
      realTeam: String(player.realTeam || '').trim().toUpperCase(),
      cost: Number.isFinite(costNumber) ? costNumber : 0
    };
  }

  function findRosterOwner(playerName) {
    const target = normalize(playerName);
    for (const roster of DATA.roster?.rosters || []) {
      const found = (roster.players || []).find((player) => normalize(player.playerName) === target);
      if (found) return roster;
    }
    return null;
  }

  function sortPlayers(players) {
    const roleOrder = { P: 0, D: 1, C: 2, A: 3 };
    return players.sort((a, b) => {
      const roleDiff = (roleOrder[a.role] ?? 9) - (roleOrder[b.role] ?? 9);
      if (roleDiff) return roleDiff;
      return String(a.playerName || '').localeCompare(String(b.playerName || ''), 'it', { sensitivity: 'base' });
    });
  }

  function refreshMetaFromForm() {
    if (!DATA.roster) return null;
    const seasonId = document.getElementById('adminStaticRosterSeasonIdV587')?.value?.trim() || DATA.roster.meta?.seasonId || '';
    const loadedAt = document.getElementById('adminStaticRosterLoadedAtV587')?.value || todayIso();
    const label = document.getElementById('adminStaticRosterLabelV587')?.value?.trim() || DATA.roster.meta?.label || `Rose ${seasonId}`;
    const id = `${seasonId}-${loadedAt}`;
    const sourceFile = DATA.roster.meta?.sourceFile || DATA.originalRoster?.meta?.sourceFile || 'admin-static-roster-editor-v587';

    DATA.roster.meta = {
      ...DATA.roster.meta,
      id,
      seasonId,
      label,
      loadedAt,
      sourceFile,
      teams: DATA.roster.rosters.length,
      players: countPlayers(DATA.roster)
    };
    DATA.roster.rosters.forEach((team) => {
      team.playerCount = Array.isArray(team.players) ? team.players.length : 0;
    });
    return DATA.roster.meta;
  }

  function buildManifest() {
    const meta = refreshMetaFromForm();
    const base = JSON.parse(JSON.stringify(DATA.manifest || { rosters: [] }));
    base.rosters = Array.isArray(base.rosters) ? base.rosters : [];
    const file = `${meta.id}.json`;
    const entry = {
      id: meta.id,
      seasonId: meta.seasonId,
      label: meta.label,
      loadedAt: meta.loadedAt,
      file,
      teams: meta.teams,
      players: meta.players
    };
    base.rosters = [entry, ...base.rosters.filter((item) => item.id !== entry.id && item.file !== entry.file)]
      .sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || '')));
    return base;
  }

  function downloadJson(filename, value) {
    const text = JSON.stringify(value, null, 2) + '\n';
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.remove();
    }, 300);
  }

  function setMessage(message, isError = false) {
    DATA.message = message || '';
    const node = document.getElementById('adminStaticRosterEditorStatusV587');
    if (node) {
      node.textContent = DATA.message;
      node.classList.toggle('error', !!isError);
    }
  }

  async function loadRoster(entry) {
    if (!entry?.file) throw new Error('Entry rose non valida.');
    DATA.rosterFileName = entry.file;
    const url = new URL(`assets/rose/${entry.file}`, leagueBaseUrl());
    DATA.roster = normalizeRosterShape(await fetchJson(url));
    DATA.originalRoster = JSON.parse(JSON.stringify(DATA.roster));
    DATA.selectedTeamIndex = 0;
    DATA.dirty = false;
    await loadListoneForSeason(DATA.roster.meta?.seasonId || entry.seasonId || '');
  }

  async function loadListoneForSeason(seasonId) {
    if (!DATA.listoneManifest) {
      DATA.listoneManifest = await fetchJson(new URL('data/shared-assets/current/assets/listoni/manifest.json', engineBaseUrl()));
    }
    const entry = getLatestListoneEntry(seasonId);
    if (!entry?.file) {
      DATA.listone = null;
      return;
    }
    DATA.listone = await fetchJson(new URL(`data/shared-assets/current/assets/listoni/${entry.file}`, engineBaseUrl()));
  }

  async function loadInitialData() {
    setMessage('Caricamento ultima rosa e listone...');
    DATA.manifest = await fetchJson(new URL('assets/rose/manifest.json', leagueBaseUrl()));
    const latest = getLatestManifestEntry(DATA.manifest);
    if (!latest) throw new Error('Nessuna rosa trovata in assets/rose/manifest.json.');
    await loadRoster(latest);
    renderEditor();
    setMessage(`Rosa caricata: ${latest.file}. Listone: ${DATA.listone?.meta?.id || DATA.listone?.id || 'non disponibile'}.`);
  }

  function renderTeamOptions() {
    return (DATA.roster?.rosters || []).map((team, index) => `
      <option value="${index}" ${index === DATA.selectedTeamIndex ? 'selected' : ''}>${escapeHtml(team.name || `Rosa ${index + 1}`)} (${team.players?.length || 0})</option>
    `).join('');
  }

  function renderSnapshotOptions() {
    const rosters = Array.isArray(DATA.manifest?.rosters) ? DATA.manifest.rosters : [];
    return rosters.map((entry) => `
      <option value="${escapeHtml(entry.file)}" ${entry.file === DATA.rosterFileName ? 'selected' : ''}>${escapeHtml(entry.loadedAt || entry.id)} · ${escapeHtml(entry.label || entry.file)}</option>
    `).join('');
  }

  function renderPlayerOptions() {
    return listonePlayers().map((player, index) => {
      const owner = findRosterOwner(player.playerName);
      const ownerText = owner ? ` · in ${owner.name}` : ' · svincolato';
      const label = `${player.playerName || ''} · ${player.classicRole || player.rosterRole || ''} · ${player.realTeam || ''}${ownerText}`;
      return `<option value="${index}">${escapeHtml(label)}</option>`;
    }).join('');
  }

  function renderRosterRows() {
    const team = getSelectedTeam();
    const rows = sortPlayers([...(team?.players || [])]).map((player, index) => {
      const originalIndex = (team.players || []).indexOf(player);
      return `
        <tr data-role="${escapeHtml(player.role || '')}">
          <td><strong>${escapeHtml(player.playerName || '')}</strong></td>
          <td>${escapeHtml(player.role || '')}</td>
          <td>${escapeHtml(player.realTeam || '')}</td>
          <td>${escapeHtml(player.cost ?? '')}</td>
          <td><button class="button button-danger button-small" type="button" data-admin-static-roster-remove-v587="${originalIndex}">Togli</button></td>
        </tr>`;
    }).join('');
    return rows || `<tr><td colspan="5" class="muted center">Nessun giocatore in questa rosa.</td></tr>`;
  }

  function renderEditor() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    const meta = DATA.roster?.meta || {};
    const league = currentLeagueSlug();
    const fileName = `${meta.seasonId || 'stagione'}-${document.getElementById('adminStaticRosterLoadedAtV587')?.value || meta.loadedAt || todayIso()}.json`;
    const selectedTeam = getSelectedTeam();
    root.innerHTML = `
      <div class="static-roster-editor-v587-grid">
        <label>
          Rosa di partenza
          <select id="adminStaticRosterSnapshotV587" class="input">${renderSnapshotOptions()}</select>
        </label>
        <label>
          Data nuova rosa
          <input id="adminStaticRosterLoadedAtV587" class="input" type="date" value="${escapeHtml(meta.loadedAt || todayIso())}" />
        </label>
        <label>
          Stagione output
          <input id="adminStaticRosterSeasonIdV587" class="input" type="text" value="${escapeHtml(meta.seasonId || '')}" />
        </label>
        <label>
          Label
          <input id="adminStaticRosterLabelV587" class="input" type="text" value="${escapeHtml(meta.label || '')}" />
        </label>
        <label class="span-2">
          Rosa da modificare
          <select id="adminStaticRosterTeamV587" class="input">${renderTeamOptions()}</select>
        </label>
      </div>

      <div class="static-roster-editor-v587-summary">
        <span><strong>${escapeHtml(selectedTeam?.name || '-')}</strong></span>
        <span>${escapeHtml(selectedTeam?.players?.length || 0)} giocatori</span>
        <span>${escapeHtml(DATA.roster?.rosters?.length || 0)} rose</span>
        <span>${escapeHtml(countPlayers(DATA.roster))} giocatori totali</span>
        <span>Listone: ${escapeHtml(DATA.listone?.meta?.id || DATA.listone?.id || '-')}</span>
      </div>

      <details class="admin-edit-section static-roster-editor-v587-section" open>
        <summary><strong>Giocatori rosa selezionata</strong><span>${escapeHtml(selectedTeam?.players?.length || 0)}</span></summary>
        <div class="table-wrap static-roster-editor-v587-table-wrap">
          <table class="static-roster-editor-v587-table">
            <thead><tr><th>Giocatore</th><th>Ruolo</th><th>Squadra</th><th>Costo</th><th>Azione</th></tr></thead>
            <tbody>${renderRosterRows()}</tbody>
          </table>
        </div>
      </details>

      <div class="static-roster-editor-v587-add-box">
        <h4>Aggiungi dal listone</h4>
        <div class="static-roster-editor-v587-grid">
          <label class="span-2">
            Giocatore listone
            <select id="adminStaticRosterPlayerV587" class="input">
              <option value="">Seleziona un giocatore</option>
              ${renderPlayerOptions()}
            </select>
          </label>
          <label>
            Costo
            <input id="adminStaticRosterPlayerCostV587" class="input" type="number" step="0.5" min="0" placeholder="auto" />
          </label>
          <label class="static-roster-editor-v587-check">
            <input id="adminStaticRosterMoveDuplicateV587" type="checkbox" checked />
            Se presente in altra rosa, spostalo qui
          </label>
          <div class="form-actions span-2">
            <button id="adminStaticRosterAddPlayerV587" class="button button-primary" type="button">Aggiungi alla rosa</button>
          </div>
        </div>
      </div>

      <div class="static-roster-editor-v587-downloads">
        <div>
          <strong>File da caricare su GitHub</strong>
          <small>Rosa: <code>static/${escapeHtml(league)}/assets/rose/${escapeHtml(fileName)}</code></small>
          <small>Manifest: <code>static/${escapeHtml(league)}/assets/rose/manifest.json</code></small>
        </div>
        <div class="form-actions">
          <button id="adminStaticRosterDownloadRosterV587" class="button button-primary" type="button">Scarica JSON rosa</button>
          <button id="adminStaticRosterDownloadManifestV587" class="button button-secondary" type="button">Scarica manifest</button>
          <button id="adminStaticRosterDownloadBothV587" class="button button-secondary" type="button">Scarica entrambi</button>
        </div>
      </div>
      <span id="adminStaticRosterEditorStatusV587" class="form-status">${escapeHtml(DATA.message || '')}</span>
    `;
    attachEditorEvents();
  }

  function attachEditorEvents() {
    document.getElementById('adminStaticRosterSnapshotV587')?.addEventListener('change', async (event) => {
      try {
        const file = event.target.value;
        const entry = (DATA.manifest?.rosters || []).find((item) => item.file === file);
        await loadRoster(entry);
        renderEditor();
        setMessage(`Caricata rosa ${file}.`);
      } catch (error) {
        setMessage(`Errore caricamento rosa: ${error.message || error}`, true);
      }
    });
    document.getElementById('adminStaticRosterTeamV587')?.addEventListener('change', (event) => {
      DATA.selectedTeamIndex = Number(event.target.value) || 0;
      renderEditor();
    });
    document.getElementById('adminStaticRosterSeasonIdV587')?.addEventListener('change', async (event) => {
      try {
        await loadListoneForSeason(event.target.value);
        renderEditor();
        setMessage(`Listone aggiornato per stagione ${event.target.value}: ${DATA.listone?.meta?.id || DATA.listone?.id || '-'}.`);
      } catch (error) {
        setMessage(`Errore listone: ${error.message || error}`, true);
      }
    });
    document.getElementById('adminStaticRosterPlayerV587')?.addEventListener('change', (event) => {
      const player = listonePlayers()[Number(event.target.value)];
      const costInput = document.getElementById('adminStaticRosterPlayerCostV587');
      if (costInput && player) costInput.value = player.rosterCost ?? player.quotationCurrent ?? '';
    });
    document.querySelectorAll('[data-admin-static-roster-remove-v587]').forEach((button) => {
      button.addEventListener('click', () => {
        const team = getSelectedTeam();
        const index = Number(button.dataset.adminStaticRosterRemoveV587);
        if (!team || !Number.isInteger(index)) return;
        const removed = team.players.splice(index, 1)[0];
        team.playerCount = team.players.length;
        DATA.dirty = true;
        refreshMetaFromForm();
        renderEditor();
        setMessage(`Rimosso ${removed?.playerName || 'giocatore'} da ${team.name}.`);
      });
    });
    document.getElementById('adminStaticRosterAddPlayerV587')?.addEventListener('click', () => {
      const select = document.getElementById('adminStaticRosterPlayerV587');
      const idx = Number(select?.value);
      const player = listonePlayers()[idx];
      const team = getSelectedTeam();
      if (!player || !team) {
        setMessage('Seleziona un giocatore e una rosa.', true);
        return;
      }
      const moveDuplicate = document.getElementById('adminStaticRosterMoveDuplicateV587')?.checked !== false;
      const owner = findRosterOwner(player.playerName);
      if (owner && owner !== team) {
        if (!moveDuplicate) {
          setMessage(`${player.playerName} è già in ${owner.name}. Abilita lo spostamento o rimuovilo prima.`, true);
          return;
        }
        owner.players = (owner.players || []).filter((item) => normalize(item.playerName) !== normalize(player.playerName));
        owner.playerCount = owner.players.length;
      }
      if ((team.players || []).some((item) => normalize(item.playerName) === normalize(player.playerName))) {
        setMessage(`${player.playerName} è già presente in ${team.name}.`, true);
        return;
      }
      const cost = document.getElementById('adminStaticRosterPlayerCostV587')?.value;
      team.players = team.players || [];
      team.players.push(playerToRosterEntry(player, cost));
      sortPlayers(team.players);
      team.playerCount = team.players.length;
      DATA.dirty = true;
      refreshMetaFromForm();
      renderEditor();
      setMessage(`Aggiunto ${player.playerName} a ${team.name}.`);
    });
    document.getElementById('adminStaticRosterDownloadRosterV587')?.addEventListener('click', () => {
      const meta = refreshMetaFromForm();
      downloadJson(`${meta.id}.json`, normalizeRosterShape(DATA.roster));
      setMessage(`Scaricato ${meta.id}.json.`);
    });
    document.getElementById('adminStaticRosterDownloadManifestV587')?.addEventListener('click', () => {
      downloadJson('manifest.json', buildManifest());
      setMessage('Scaricato manifest.json aggiornato.');
    });
    document.getElementById('adminStaticRosterDownloadBothV587')?.addEventListener('click', () => {
      const meta = refreshMetaFromForm();
      downloadJson(`${meta.id}.json`, normalizeRosterShape(DATA.roster));
      window.setTimeout(() => downloadJson('manifest.json', buildManifest()), 350);
      setMessage(`Scaricati ${meta.id}.json e manifest.json.`);
    });
    ['adminStaticRosterLoadedAtV587', 'adminStaticRosterSeasonIdV587', 'adminStaticRosterLabelV587'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', refreshMetaFromForm);
    });
  }

  function panelHtml() {
    return `
      <article id="${PANEL_ID}" class="panel admin-collapsible-panel static-roster-editor-v587-panel" data-feature-card-id="adminStaticRosterEditorPanelV587" data-visibility="admin" data-category="admin">
        <header class="collapsible-panel-header">
          <div>
            <p class="eyebrow">File statici</p>
            <h3>Editor rose GitHub</h3>
            <p>Modifica l'ultima rosa in <code>assets/rose</code>, aggiungi giocatori dal listone e scarica JSON + manifest pronti per commit.</p>
          </div>
          <button class="button button-secondary button-small" type="button" data-static-roster-editor-toggle-v587>Riduci</button>
        </header>
        <div class="collapsible-panel-body" data-static-roster-editor-body-v587>
          <div id="${ROOT_ID}" class="static-roster-editor-v587-root">
            <p class="muted">Caricamento editor rose...</p>
          </div>
        </div>
      </article>
    `;
  }

  function insertPanelIfNeeded() {
    const adminPanel = document.getElementById('adminPanel');
    if (!adminPanel || document.getElementById(PANEL_ID)) return;
    if (!adminPanel.querySelector('.admin-collapsible-panel, .panel')) return;
    const anchor = document.getElementById('adminPublicSnapshotsPanel') || document.getElementById('adminBackupPanel');
    if (anchor) anchor.insertAdjacentHTML('beforebegin', panelHtml());
    else adminPanel.insertAdjacentHTML('beforeend', panelHtml());
    document.querySelector('[data-static-roster-editor-toggle-v587]')?.addEventListener('click', (event) => {
      const body = document.querySelector('[data-static-roster-editor-body-v587]');
      if (!body) return;
      const collapsed = body.classList.toggle('hidden');
      event.currentTarget.textContent = collapsed ? 'Apri' : 'Riduci';
    });
    loadInitialData().catch((error) => {
      const root = document.getElementById(ROOT_ID);
      if (root) root.innerHTML = `<p class="form-status error">Errore editor rose: ${escapeHtml(error.message || error)}</p>`;
    });
  }

  function boot() {
    insertPanelIfNeeded();
    const observer = new MutationObserver(() => insertPanelIfNeeded());
    observer.observe(document.body, { childList: true, subtree: true });
    window.FantaStaticRosterEditorV587 = {
      version: VERSION,
      reload: loadInitialData,
      render: renderEditor,
      getState: () => DATA
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
