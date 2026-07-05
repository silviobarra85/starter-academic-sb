(function () {
  'use strict';

  var scheduled = false;
  var ROLE_CLASSES = ['fpt-v576-role-p', 'fpt-v576-role-d', 'fpt-v576-role-c', 'fpt-v576-role-a'];

  function norm(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' ');
  }

  function detectRoleFromText(text) {
    var value = norm(text);
    if (!value || value === '-') return '';
    var tokens = value.split(/[^A-Z]+/).filter(Boolean);
    var first = tokens[0] || value.charAt(0);
    if (first === 'P' || first === 'POR' || first.indexOf('PORT') === 0 || tokens.indexOf('PORTIERE') >= 0) return 'p';
    if (first === 'D' || first.indexOf('DC') === 0 || first.indexOf('DD') === 0 || first.indexOf('DS') === 0 || first.indexOf('DIF') === 0 || tokens.indexOf('DIFENSORE') >= 0) return 'd';
    if (first === 'C' || first === 'M' || first === 'E' || first === 'W' || first === 'T' || first.indexOf('CENT') === 0 || tokens.indexOf('CENTROCAMPISTA') >= 0) return 'c';
    if (first === 'A' || first === 'F' || first === 'PC' || first.indexOf('ATT') === 0 || first.indexOf('PUN') === 0 || tokens.indexOf('ATTACCANTE') >= 0) return 'a';
    return '';
  }

  function getHeaders(table) {
    return Array.prototype.slice.call(table.querySelectorAll('thead th'));
  }

  function getColumnIndexByLabels(table, labels) {
    var heads = getHeaders(table);
    for (var i = 0; i < heads.length; i += 1) {
      var text = norm(heads[i].textContent);
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
    if (table.closest('section[data-page="listone"]') || table.querySelector('#listoneTableBody') || table.id === 'listoneTable') return 'listone';
    if (table.closest('section[data-page="clubs"] #rosterClubCards') || table.closest('#rosterClubCards')) return 'rose';
    if (table.closest('section[data-page="teamarea"]') || table.classList.contains('team-profile-roster-table') || table.closest('.team-profile-roster-wrap')) return 'teamarea';
    if (table.classList.contains('free-agents-table') || table.classList.contains('listone-table')) return 'listone';
    if (table.classList.contains('roster-player-table')) return 'rose';
    return '';
  }

  function ensureWrapper(table) {
    var wrapper = table.closest('.table-wrap, .mobile-tabular-wrap, .listone-table-wrap, .roster-table-wrap, .team-profile-roster-wrap, .roster-inline-table-wrap');
    if (wrapper) {
      wrapper.classList.add('fanta-player-table-wrap-v576');
      wrapper.setAttribute('data-player-table-wrap-v576', 'true');
    }
  }

  function roleFromRow(row, roleIndex) {
    var direct = row.getAttribute('data-player-role') || row.getAttribute('data-role') || (row.dataset ? (row.dataset.playerRole || row.dataset.role) : '');
    var role = detectRoleFromText(direct);
    if (role) return role;
    if (row.classList.contains('player-role-gk') || row.classList.contains('zo-role-bg-v405-gk')) return 'p';
    if (row.classList.contains('player-role-def') || row.classList.contains('zo-role-bg-v405-def')) return 'd';
    if (row.classList.contains('player-role-mid') || row.classList.contains('zo-role-bg-v405-mid')) return 'c';
    if (row.classList.contains('player-role-fwd') || row.classList.contains('zo-role-bg-v405-fwd')) return 'a';
    var explicit = row.querySelector('.fpt-v576-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole, [data-label="R (RM)"], [data-label="Ruolo"], [data-label="R"]');
    role = detectRoleFromText(explicit && explicit.textContent);
    if (role) return role;
    var cells = row.children || [];
    if (roleIndex >= 0 && cells[roleIndex]) return detectRoleFromText(cells[roleIndex].textContent);
    return '';
  }

  function applyRole(row, role) {
    ROLE_CLASSES.forEach(function (name) { row.classList.remove(name); });
    if (role) {
      row.classList.add('fpt-v576-role-' + role);
      row.setAttribute('data-fpt-v576-role', role);
    } else {
      row.removeAttribute('data-fpt-v576-role');
    }
  }

  function markColumns(table) {
    var playerIndex = getColumnIndexByLabels(table, ['GIOCATORE', 'NOME']);
    var roleIndex = getColumnIndexByLabels(table, ['R (RM)', 'RUOLO', 'R']);
    var statusIndex = getColumnIndexByLabels(table, ['STATO']);
    var teamIndex = getColumnIndexByLabels(table, ['SQ', 'SQUADRA']);
    var costIndex = getColumnIndexByLabels(table, ['COSTO']);
    var qtaIndex = getColumnIndexByLabels(table, ['QT.A', 'QTA', 'QUOT. ATTUALE']);
    var marketIndex = getColumnIndexByLabels(table, ['MERCATO']);

    addColumnClassByIndex(table, playerIndex >= 0 ? playerIndex : 0, 'fpt-v576-col-player');
    addColumnClassByIndex(table, roleIndex, 'fpt-v576-col-role');
    addColumnClassByIndex(table, statusIndex, 'fpt-v576-col-status');
    addColumnClassByIndex(table, teamIndex, 'fpt-v576-col-team');
    addColumnClassByIndex(table, costIndex, 'fpt-v576-col-cost');
    addColumnClassByIndex(table, qtaIndex, 'fpt-v576-col-qta');
    addColumnClassByIndex(table, marketIndex, 'fpt-v576-col-market');

    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
      applyRole(row, roleFromRow(row, roleIndex));
    });
  }

  function decorateTable(table) {
    var type = classifyTable(table);
    if (!type) return 0;
    table.classList.add('fanta-player-table-v576');
    table.classList.remove('fanta-player-table-v576-teamarea', 'fanta-player-table-v576-rose', 'fanta-player-table-v576-listone');
    table.classList.add('fanta-player-table-v576-' + type);
    table.setAttribute('data-player-table-v576', type);
    ensureWrapper(table);
    markColumns(table);
    return 1;
  }

  function run() {
    scheduled = false;
    if (document.body) document.body.classList.add('player-table-mobile-v576-active');
    var selector = [
      'section[data-page="listone"] table.listone-table',
      'section[data-page="clubs"] #rosterClubCards table.roster-player-table',
      'section[data-page="teamarea"] table.team-profile-roster-table',
      'table.team-profile-roster-table',
      'table.roster-player-table',
      'table.listone-table',
      'table.free-agents-table'
    ].join(',');
    var decorated = 0;
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (table) {
      decorated += decorateTable(table);
    });
    return decorated;
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(run);
  }

  window.FantaPlayerTablesMobileV576 = { run: run, schedule: schedule, classifyTable: classifyTable };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  else schedule();

  window.addEventListener('load', schedule);
  window.addEventListener('hashchange', schedule);
  document.addEventListener('click', function () { window.setTimeout(schedule, 0); }, true);
  document.addEventListener('change', function () { window.setTimeout(schedule, 0); }, true);

  var observer = new MutationObserver(schedule);
  if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  else document.addEventListener('DOMContentLoaded', function () {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
}());
