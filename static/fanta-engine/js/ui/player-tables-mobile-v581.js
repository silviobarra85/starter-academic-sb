(function () {
  'use strict';

  var VERSION = 'v581';
  var scheduled = false;
  var TYPE_CLASSES = ['fanta-player-table-v581-teamarea', 'fanta-player-table-v581-rose', 'fanta-player-table-v581-listone'];
  var ROLE_CLASSES = ['fpt-v581-role-p', 'fpt-v581-role-d', 'fpt-v581-role-c', 'fpt-v581-role-a'];

  var COLORS = {
    p: { row: 'rgba(245, 158, 11, 0.16)', first: 'linear-gradient(90deg, rgba(245, 158, 11, 0.34), rgba(245, 158, 11, 0.16))', line: 'rgba(245, 158, 11, 0.82)' },
    d: { row: 'rgba(34, 197, 94, 0.14)', first: 'linear-gradient(90deg, rgba(34, 197, 94, 0.32), rgba(34, 197, 94, 0.14))', line: 'rgba(34, 197, 94, 0.78)' },
    c: { row: 'rgba(56, 189, 248, 0.14)', first: 'linear-gradient(90deg, rgba(56, 189, 248, 0.32), rgba(59, 130, 246, 0.14))', line: 'rgba(56, 189, 248, 0.78)' },
    a: { row: 'rgba(248, 113, 113, 0.14)', first: 'linear-gradient(90deg, rgba(248, 113, 113, 0.32), rgba(239, 68, 68, 0.14))', line: 'rgba(248, 113, 113, 0.78)' }
  };

  function isMobileViewport() {
    try { return window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches; }
    catch (_) { return window.innerWidth <= 900; }
  }

  function important(el, prop, value) {
    if (!el || !el.style) return;
    try { el.style.setProperty(prop, value, 'important'); } catch (_) {}
  }

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

  function hasPlayerHeaders(table) {
    var playerIndex = getColumnIndexByLabels(table, ['GIOCATORE', 'NOME', 'CALCIATORE']);
    var roleIndex = getColumnIndexByLabels(table, ['R (RM)', 'RUOLO', 'R']);
    return playerIndex >= 0 && roleIndex >= 0;
  }

  function classifyTable(table) {
    if (!table || table.nodeType !== 1) return '';
    if (table.closest('#teamProfilePageBody') || table.closest('#teamProfileDialog') || table.closest('.team-profile-roster-wrap') || table.classList.contains('team-profile-roster-table') || table.closest('section[data-page="teamprofile"]') || (table.closest('section[data-page="teamarea"]') && hasPlayerHeaders(table))) return 'teamarea';
    if (table.closest('section[data-page="clubs"] #rosterClubCards') || table.closest('#rosterClubCards') || table.closest('.roster-detail-row') || (table.classList.contains('roster-player-table') && !table.classList.contains('team-profile-roster-table'))) return 'rose';
    if (table.closest('section[data-page="listone"]') || table.querySelector('#listoneTableBody') || table.id === 'listoneTable' || table.classList.contains('free-agents-table') || table.classList.contains('listone-table')) return 'listone';
    return '';
  }

  function ensureWrapper(table, type) {
    var wrapper = table.closest('.table-wrap, .mobile-tabular-wrap, .listone-table-wrap, .roster-table-wrap, .team-profile-roster-wrap, .roster-inline-table-wrap');
    if (wrapper) {
      wrapper.classList.add('fanta-player-table-wrap-v581', 'fanta-player-table-wrap-v581-' + type);
      wrapper.setAttribute('data-player-table-wrap-v581', type);
      return wrapper;
    }
    var parent = table.parentNode;
    if (!parent || parent.nodeType !== 1) return null;
    var created = document.createElement('div');
    created.className = 'fanta-player-table-wrap-v581 fanta-player-table-wrap-v581-' + type;
    created.setAttribute('data-player-table-wrap-v581', type);
    parent.insertBefore(created, table);
    created.appendChild(table);
    return created;
  }

  function markColumns(table) {
    var playerIndex = getColumnIndexByLabels(table, ['GIOCATORE', 'NOME', 'CALCIATORE']);
    var roleIndex = getColumnIndexByLabels(table, ['R (RM)', 'RUOLO', 'R']);
    var statusIndex = getColumnIndexByLabels(table, ['STATO', 'STATUS']);
    var teamIndex = getColumnIndexByLabels(table, ['SQUADRA', 'TEAM', 'CLUB']);
    var costIndex = getColumnIndexByLabels(table, ['COSTO', 'PREZZO']);
    var qtaIndex = getColumnIndexByLabels(table, ['QT.A', 'QTA', 'QUOTAZIONE ATTUALE']);
    var marketIndex = getColumnIndexByLabels(table, ['MERCATO', 'FANTAMERCATO']);
    addColumnClassByIndex(table, playerIndex >= 0 ? playerIndex : 0, 'fpt-v581-col-player');
    addColumnClassByIndex(table, roleIndex, 'fpt-v581-col-role');
    addColumnClassByIndex(table, statusIndex, 'fpt-v581-col-status');
    addColumnClassByIndex(table, teamIndex, 'fpt-v581-col-team');
    addColumnClassByIndex(table, costIndex, 'fpt-v581-col-cost');
    addColumnClassByIndex(table, qtaIndex, 'fpt-v581-col-qta');
    addColumnClassByIndex(table, marketIndex, 'fpt-v581-col-market');
    return { roleIndex: roleIndex, playerIndex: playerIndex >= 0 ? playerIndex : 0 };
  }

  function inferRoleForRow(row, indexes) {
    var role = '';
    if (row.classList.contains('zo-role-bg-v405-gk') || row.classList.contains('player-role-gk')) role = 'p';
    else if (row.classList.contains('zo-role-bg-v405-def') || row.classList.contains('player-role-def')) role = 'd';
    else if (row.classList.contains('zo-role-bg-v405-mid') || row.classList.contains('player-role-mid')) role = 'c';
    else if (row.classList.contains('zo-role-bg-v405-fwd') || row.classList.contains('player-role-fwd')) role = 'a';
    if (!role && indexes.roleIndex >= 0 && row.children[indexes.roleIndex]) role = detectRoleFromText(row.children[indexes.roleIndex].textContent);
    if (!role) {
      var roleCell = row.querySelector('.roster-col-role, .team-profile-role-cell, .listone-col-classicRole, [data-role]');
      if (roleCell) role = detectRoleFromText(roleCell.textContent || roleCell.getAttribute('data-role'));
    }
    return role;
  }

  function applyWrapperInline(wrapper) {
    if (!wrapper) return;
    important(wrapper, 'max-width', '100%');
    important(wrapper, 'max-height', 'min(70vh, 620px)');
    important(wrapper, 'overflow', 'auto');
    important(wrapper, '-webkit-overflow-scrolling', 'touch');
    important(wrapper, 'overscroll-behavior', 'contain');
    important(wrapper, 'border-radius', '14px');
    important(wrapper, 'position', 'relative');
  }

  function applyTableInline(table) {
    important(table, 'table-layout', 'fixed');
    important(table, 'width', 'max-content');
    important(table, 'min-width', '100%');
    important(table, 'border-collapse', 'separate');
    important(table, 'border-spacing', '0');
    important(table, 'font-size', '0.68rem');
  }

  function applyCellBase(cell) {
    important(cell, 'box-sizing', 'border-box');
    important(cell, 'display', 'table-cell');
    important(cell, 'vertical-align', 'middle');
    important(cell, 'text-align', 'left');
    important(cell, 'white-space', 'normal');
    important(cell, 'overflow', 'hidden');
    important(cell, 'text-overflow', 'clip');
    important(cell, 'padding', '0.42rem 0.5rem');
    important(cell, 'line-height', '1.18');
    important(cell, 'font-size', '0.68rem');
  }

  function applyHeader(cell) {
    important(cell, 'position', 'sticky');
    important(cell, 'top', '0');
    important(cell, 'z-index', '260');
    important(cell, 'background', 'rgba(15, 23, 42, 0.99)');
    important(cell, 'color', '#f8fafc');
    important(cell, 'border-bottom', '1px solid rgba(148, 163, 184, 0.34)');
    important(cell, 'font-weight', '800');
    important(cell, 'text-align', 'left');
  }

  function applyPlayerCell(cell, isHeader) {
    important(cell, 'position', 'sticky');
    important(cell, 'left', '0');
    important(cell, 'z-index', isHeader ? '290' : '250');
    important(cell, 'width', 'clamp(5.25rem, 28vw, 7rem)');
    important(cell, 'min-width', 'clamp(5.25rem, 28vw, 7rem)');
    important(cell, 'max-width', 'clamp(6rem, 32vw, 8rem)');
    important(cell, 'white-space', 'normal');
    important(cell, 'overflow', 'visible');
    important(cell, 'text-overflow', 'clip');
    important(cell, 'overflow-wrap', 'anywhere');
    important(cell, 'word-break', 'normal');
    important(cell, 'text-align', 'left');
    if (isHeader) {
      important(cell, 'background', 'rgba(15, 23, 42, 0.99)');
      important(cell, 'color', '#f8fafc');
    } else {
      important(cell, 'background', '#ffffff');
      important(cell, 'box-shadow', '8px 0 14px rgba(2, 6, 23, 0.42)');
    }
  }

  function applyColumnWidths(table) {
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v581-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole'), function (cell) {
      important(cell, 'width', '5.375rem'); important(cell, 'min-width', '5.375rem'); important(cell, 'max-width', '5.375rem');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v581-col-status, .roster-col-status, .team-profile-status-cell, .listone-col-status'), function (cell) {
      important(cell, 'width', '3.75rem'); important(cell, 'min-width', '3.75rem'); important(cell, 'max-width', '3.75rem'); important(cell, 'overflow-wrap', 'anywhere');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v581-col-team, .roster-col-team, .team-profile-team-cell, .listone-col-realTeam'), function (cell) {
      important(cell, 'width', '3.125rem'); important(cell, 'min-width', '3.125rem'); important(cell, 'max-width', '3.125rem');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v581-col-cost, .fpt-v581-col-qta, .roster-col-cost, .roster-col-qta, .team-profile-cost-cell, .team-profile-qta-cell, .listone-col-quotationCurrent, .listone-col-rosterCost, .listone-col-fvm'), function (cell) {
      important(cell, 'width', '3.75rem'); important(cell, 'min-width', '3.75rem'); important(cell, 'max-width', '3.75rem'); important(cell, 'text-align', 'left');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v581-col-market, .roster-col-market, .team-profile-market-cell'), function (cell) {
      important(cell, 'width', '5.25rem'); important(cell, 'min-width', '5.25rem'); important(cell, 'max-width', '5.25rem');
    });
  }

  function applyRoleStyle(row, role) {
    var color = COLORS[role] || null;
    Array.prototype.forEach.call(row.children || [], function (cell, index) {
      if (color) {
        important(cell, 'background', index === 0 ? color.first : color.row);
        if (index === 0) {
          important(cell, 'box-shadow', 'inset 4px 0 ' + color.line + ', 8px 0 14px rgba(2, 6, 23, 0.42)');
          important(cell, 'color', '#f8fafc');
          important(cell, 'font-weight', '900');
        } else {
          important(cell, 'color', '#0f172a');
        }
      }
    });
  }

  function applyLinks(table) {
    Array.prototype.forEach.call(table.querySelectorAll('td:first-child a, .fpt-v581-col-player a, td:first-child strong, .fpt-v581-col-player strong, td:first-child span, .fpt-v581-col-player span'), function (node) {
      important(node, 'display', 'inline');
      important(node, 'white-space', 'normal');
      important(node, 'overflow', 'visible');
      important(node, 'text-overflow', 'clip');
      important(node, 'overflow-wrap', 'anywhere');
      important(node, 'word-break', 'normal');
      important(node, 'line-height', 'inherit');
      important(node, 'color', 'inherit');
      important(node, 'font-size', 'inherit');
    });
  }

  function decorateTable(table) {
    var type = classifyTable(table);
    if (!type) return 0;
    table.classList.add('fanta-player-table-v581');
    TYPE_CLASSES.forEach(function (name) { table.classList.remove(name); });
    table.classList.add('fanta-player-table-v581-' + type);
    table.setAttribute('data-player-table-v581', type);
    table.removeAttribute('data-player-table-v580');
    var wrapper = ensureWrapper(table, type);
    var indexes = markColumns(table);

    if (!isMobileViewport()) return 1;

    applyWrapperInline(wrapper);
    applyTableInline(table);
    Array.prototype.forEach.call(table.querySelectorAll('th, td'), applyCellBase);
    Array.prototype.forEach.call(table.querySelectorAll('thead th'), function (cell) { applyHeader(cell); });
    Array.prototype.forEach.call(table.querySelectorAll('th:first-child, td:first-child, .fpt-v581-col-player'), function (cell) { applyPlayerCell(cell, cell.tagName === 'TH'); });
    applyColumnWidths(table);
    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
      ROLE_CLASSES.forEach(function (name) { row.classList.remove(name); });
      var role = inferRoleForRow(row, indexes);
      if (role) {
        row.classList.add('fpt-v581-role-' + role);
        row.setAttribute('data-fpt-v581-role', role);
      }
      applyRoleStyle(row, role);
    });
    applyLinks(table);
    return 1;
  }

  function run() {
    scheduled = false;
    if (document.body) {
      document.body.classList.add('player-table-mobile-v581-active');
      document.body.classList.remove('player-table-mobile-v580-active');
    }
    var selector = [
      'section[data-page="listone"] table.listone-table',
      'table#listoneTable',
      'table.listone-table',
      'table.free-agents-table',
      '#teamProfilePageBody table',
      '#teamProfileDialog table',
      '.team-profile-roster-wrap table',
      'section[data-page="teamprofile"] table',
      'section[data-page="teamarea"] table',
      'section[data-page="clubs"] #rosterClubCards table.roster-player-table',
      '#rosterClubCards table.roster-player-table',
      'table.team-profile-roster-table',
      'table.roster-player-table'
    ].join(',');
    var count = 0;
    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (table) { count += decorateTable(table); });
    return count;
  }

  function schedule(delay) {
    if (scheduled) return;
    scheduled = true;
    var runner = function () { window.requestAnimationFrame(run); };
    if (delay) window.setTimeout(runner, delay); else runner();
  }

  window.FantaPlayerTablesMobileV581 = { run: run, schedule: schedule, classifyTable: classifyTable };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { schedule(); }); else schedule();
  window.addEventListener('load', function () { schedule(); schedule(250); schedule(800); });
  window.addEventListener('hashchange', function () { schedule(); schedule(250); schedule(800); });
  window.addEventListener('resize', function () { schedule(); schedule(250); });
  document.addEventListener('click', function () { schedule(); schedule(120); schedule(500); schedule(1200); }, true);
  document.addEventListener('change', function () { schedule(); schedule(120); schedule(500); }, true);
  var observer = new MutationObserver(function () { schedule(); });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  else document.addEventListener('DOMContentLoaded', function () { observer.observe(document.body, { childList: true, subtree: true, characterData: true }); });
}());
