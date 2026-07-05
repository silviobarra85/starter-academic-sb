(function () {
  'use strict';

  var MEDIA = '(max-width: 900px), (hover: none) and (pointer: coarse)';
  var scheduled = false;

  function isMobile() {
    try { return window.matchMedia && window.matchMedia(MEDIA).matches; }
    catch (error) { return true; }
  }

  function norm(text) {
    return String(text || '').trim().toUpperCase();
  }

  function detectRoleFromText(text) {
    var value = norm(text).replace(/\s+/g, ' ');
    if (!value) return '';
    if (value === 'P' || value.indexOf('PORT') === 0) return 'p';
    if (value === 'D' || value.indexOf('DIF') === 0) return 'd';
    if (value === 'C' || value.indexOf('CEN') === 0) return 'c';
    if (value === 'A' || value.indexOf('ATT') === 0) return 'a';
    var first = value.charAt(0);
    return ['P', 'D', 'C', 'A'].indexOf(first) >= 0 ? first.toLowerCase() : '';
  }

  function getColumnIndexByLabels(table, labels) {
    var heads = Array.prototype.slice.call(table.querySelectorAll('thead th'));
    for (var i = 0; i < heads.length; i += 1) {
      var text = norm(heads[i].textContent).replace(/\s+/g, ' ');
      for (var j = 0; j < labels.length; j += 1) {
        if (text === labels[j] || text.indexOf(labels[j]) === 0) return i;
      }
    }
    return -1;
  }

  function addColumnClassByIndex(table, index, className) {
    if (index < 0) return;
    Array.prototype.forEach.call(table.querySelectorAll('tr'), function (row) {
      var cells = row.children || [];
      if (cells[index]) cells[index].classList.add(className);
    });
  }

  function classifyTable(table) {
    if (!table || table.nodeType !== 1) return '';
    if (table.classList.contains('listone-table') || table.classList.contains('free-agents-table')) return 'listone';
    if (table.classList.contains('team-profile-roster-table')) return 'teamarea';
    if (table.classList.contains('roster-player-table')) {
      if (table.closest('#rosterClubCards, #clubs, .mobile-roster-detail-card-v156, .desktop-roster-table-v156')) return 'rose';
      return 'teamarea';
    }
    return '';
  }

  function ensureWrapper(table) {
    var wrapper = table.closest('.table-wrap, .mobile-tabular-wrap, .listone-table-wrap, .roster-table-wrap, .team-profile-roster-wrap');
    if (wrapper) wrapper.classList.add('fanta-player-table-wrap-v575');
  }

  function roleFromRow(row, roleIndex) {
    var dataRole = row.getAttribute('data-player-role');
    var role = detectRoleFromText(dataRole);
    if (role) return role;
    var explicit = row.querySelector('.roster-col-role, .team-profile-role-cell, .listone-col-classicRole, .fanta-player-role-col-v575, [data-label="R (RM)"], [data-label="Ruolo"], [data-label="R"]');
    role = detectRoleFromText(explicit && explicit.textContent);
    if (role) return role;
    var cells = row.children || [];
    if (roleIndex >= 0 && cells[roleIndex]) return detectRoleFromText(cells[roleIndex].textContent);
    return '';
  }

  function applyRole(row, role) {
    ['p', 'd', 'c', 'a'].forEach(function (item) {
      row.classList.remove('fanta-role-' + item + '-v575');
    });
    if (role) row.classList.add('fanta-role-' + role + '-v575');
  }

  function markColumns(table, type) {
    var playerIndex = getColumnIndexByLabels(table, ['GIOCATORE', 'NOME']);
    var roleIndex = getColumnIndexByLabels(table, ['R (RM)', 'RUOLO', 'R']);
    var statusIndex = getColumnIndexByLabels(table, ['STATO']);
    var teamIndex = getColumnIndexByLabels(table, ['SQ', 'SQUADRA']);
    var costIndex = getColumnIndexByLabels(table, ['COSTO']);
    var qtaIndex = getColumnIndexByLabels(table, ['QT.A', 'QTA', 'QUOT. ATTUALE']);
    var marketIndex = getColumnIndexByLabels(table, ['MERCATO']);

    addColumnClassByIndex(table, playerIndex >= 0 ? playerIndex : 0, 'fanta-player-name-col-v575');
    addColumnClassByIndex(table, roleIndex, 'fanta-player-role-col-v575');
    addColumnClassByIndex(table, statusIndex, 'fanta-player-status-col-v575');
    addColumnClassByIndex(table, teamIndex, 'fanta-player-team-col-v575');
    addColumnClassByIndex(table, costIndex, 'fanta-player-cost-col-v575');
    addColumnClassByIndex(table, qtaIndex, 'fanta-player-qta-col-v575');
    addColumnClassByIndex(table, marketIndex, 'fanta-player-market-col-v575');

    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
      applyRole(row, roleFromRow(row, roleIndex));
    });
  }

  function decorateTable(table) {
    var type = classifyTable(table);
    if (!type) return;
    table.classList.add('fanta-player-table-v575');
    table.classList.remove('fanta-player-table-v575-teamarea', 'fanta-player-table-v575-rose', 'fanta-player-table-v575-listone');
    table.classList.add('fanta-player-table-v575-' + type);
    table.setAttribute('data-player-table-v575', type);
    ensureWrapper(table);
    markColumns(table, type);
  }

  function run() {
    scheduled = false;
    if (!isMobile()) return;
    document.querySelectorAll('table.listone-table, table.free-agents-table, table.roster-player-table, table.team-profile-roster-table').forEach(decorateTable);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(run);
  }

  window.FantaPlayerTablesMobileV575 = { run: run, schedule: schedule };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  else schedule();

  window.addEventListener('load', schedule);
  window.addEventListener('hashchange', schedule);
  document.addEventListener('click', function () { setTimeout(schedule, 0); }, true);
  document.addEventListener('change', function () { setTimeout(schedule, 0); }, true);

  var observer = new MutationObserver(schedule);
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  else document.addEventListener('DOMContentLoaded', function () {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}());
