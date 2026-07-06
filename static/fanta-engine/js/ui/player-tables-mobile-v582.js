(function () {
  'use strict';

  var VERSION = 'v582';
  var scheduled = false;
  var TYPE_CLASSES = ['fanta-player-table-v582-teamarea', 'fanta-player-table-v582-rose', 'fanta-player-table-v582-listone'];
  var ROLE_CLASSES = ['fpt-v582-role-p', 'fpt-v582-role-d', 'fpt-v582-role-c', 'fpt-v582-role-a'];

  var COLORS = {
    p: { row: 'linear-gradient(90deg, rgba(120, 53, 15, 0.92), rgba(146, 64, 14, 0.78))', first: 'linear-gradient(90deg, rgba(245, 158, 11, 0.58), rgba(120, 53, 15, 0.98))', line: 'rgba(245, 158, 11, 0.92)' },
    d: { row: 'linear-gradient(90deg, rgba(20, 83, 45, 0.92), rgba(22, 101, 52, 0.76))', first: 'linear-gradient(90deg, rgba(34, 197, 94, 0.54), rgba(20, 83, 45, 0.98))', line: 'rgba(34, 197, 94, 0.88)' },
    c: { row: 'linear-gradient(90deg, rgba(12, 74, 110, 0.92), rgba(30, 64, 175, 0.76))', first: 'linear-gradient(90deg, rgba(56, 189, 248, 0.54), rgba(30, 64, 175, 0.98))', line: 'rgba(56, 189, 248, 0.88)' },
    a: { row: 'linear-gradient(90deg, rgba(127, 29, 29, 0.92), rgba(153, 27, 27, 0.76))', first: 'linear-gradient(90deg, rgba(248, 113, 113, 0.56), rgba(127, 29, 29, 0.98))', line: 'rgba(248, 113, 113, 0.90)' }
  };
  function isMobileViewport() {
    try { return window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches; }
    catch (_) { return window.innerWidth <= 900; }
  }

  function important(el, prop, value) {
    if (!el || !el.style) return;
    try { el.style.setProperty(prop, value, 'important'); } catch (_) {}
  }

  function forceWhiteText(node) {
    if (!node || !node.querySelectorAll) return;
    important(node, 'color', '#f8fafc');
    important(node, 'text-shadow', 'none');
    Array.prototype.forEach.call(node.querySelectorAll('*'), function (child) {
      important(child, 'color', '#f8fafc');
      important(child, 'text-shadow', 'none');
    });
  }

  function normalizeStatusBadge(cell) {
    if (!cell || !cell.querySelectorAll) return;
    Array.prototype.forEach.call(cell.querySelectorAll('.status, .status-badge, .player-status, .mini-badge'), function (badge) {
      important(badge, 'min-height', '0');
      important(badge, 'padding', '0.16rem 0.34rem');
      important(badge, 'border-radius', '999px');
      important(badge, 'border', '1px solid rgba(248, 250, 252, 0.24)');
      important(badge, 'background', 'rgba(15, 23, 42, 0.48)');
      important(badge, 'color', '#f8fafc');
      important(badge, 'font-size', '0.62rem');
      important(badge, 'line-height', '1.08');
      important(badge, 'font-weight', '900');
      important(badge, 'letter-spacing', '0.02em');
      important(badge, 'text-align', 'left');
      important(badge, 'white-space', 'normal');
    });
  }

  function clearLegacyRoleClasses(row) {
    if (!row || !row.classList) return;
    [
      'zo-role-bg-v405-gk', 'zo-role-bg-v405-def', 'zo-role-bg-v405-mid', 'zo-role-bg-v405-fwd',
      'player-role-gk', 'player-role-def', 'player-role-mid', 'player-role-fwd'
    ].forEach(function (name) { row.classList.remove(name); });
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
      wrapper.classList.add('fanta-player-table-wrap-v582', 'fanta-player-table-wrap-v582-' + type);
      wrapper.setAttribute('data-player-table-wrap-v582', type);
      return wrapper;
    }
    var parent = table.parentNode;
    if (!parent || parent.nodeType !== 1) return null;
    var created = document.createElement('div');
    created.className = 'fanta-player-table-wrap-v582 fanta-player-table-wrap-v582-' + type;
    created.setAttribute('data-player-table-wrap-v582', type);
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
    addColumnClassByIndex(table, playerIndex >= 0 ? playerIndex : 0, 'fpt-v582-col-player');
    addColumnClassByIndex(table, roleIndex, 'fpt-v582-col-role');
    addColumnClassByIndex(table, statusIndex, 'fpt-v582-col-status');
    addColumnClassByIndex(table, teamIndex, 'fpt-v582-col-team');
    addColumnClassByIndex(table, costIndex, 'fpt-v582-col-cost');
    addColumnClassByIndex(table, qtaIndex, 'fpt-v582-col-qta');
    addColumnClassByIndex(table, marketIndex, 'fpt-v582-col-market');
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
    important(cell, 'color', '#f8fafc');
    important(cell, 'text-shadow', 'none');
    forceWhiteText(cell);
    normalizeStatusBadge(cell);
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
      important(cell, 'background', 'rgba(15, 23, 42, 0.92)');
      important(cell, 'color', '#f8fafc');
      important(cell, 'box-shadow', '8px 0 14px rgba(2, 6, 23, 0.46)');
    }
    forceWhiteText(cell);
  }

  function applyColumnWidths(table) {
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v582-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole'), function (cell) {
      important(cell, 'width', '5.375rem'); important(cell, 'min-width', '5.375rem'); important(cell, 'max-width', '5.375rem');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v582-col-status, .roster-col-status, .team-profile-status-cell, .listone-col-status'), function (cell) {
      important(cell, 'width', '4rem'); important(cell, 'min-width', '4rem'); important(cell, 'max-width', '4rem'); important(cell, 'overflow-wrap', 'anywhere'); important(cell, 'text-align', 'left');
      normalizeStatusBadge(cell);
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v582-col-team, .roster-col-team, .team-profile-team-cell, .listone-col-realTeam'), function (cell) {
      important(cell, 'width', '3.125rem'); important(cell, 'min-width', '3.125rem'); important(cell, 'max-width', '3.125rem');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v582-col-cost, .fpt-v582-col-qta, .roster-col-cost, .roster-col-qta, .team-profile-cost-cell, .team-profile-qta-cell, .listone-col-quotationCurrent, .listone-col-rosterCost, .listone-col-fvm'), function (cell) {
      important(cell, 'width', '3.75rem'); important(cell, 'min-width', '3.75rem'); important(cell, 'max-width', '3.75rem'); important(cell, 'text-align', 'left');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v582-col-market, .roster-col-market, .team-profile-market-cell'), function (cell) {
      important(cell, 'width', '5.25rem'); important(cell, 'min-width', '5.25rem'); important(cell, 'max-width', '5.25rem');
    });
  }

  function applyRoleStyle(row, role) {
    var color = COLORS[role] || null;
    Array.prototype.forEach.call(row.children || [], function (cell, index) {
      if (color) {
        important(cell, 'background', index === 0 ? color.first : color.row);
        important(cell, 'color', '#f8fafc');
        important(cell, 'font-weight', index === 0 ? '900' : '700');
        if (index === 0) {
          important(cell, 'box-shadow', 'inset 4px 0 ' + color.line + ', 8px 0 14px rgba(2, 6, 23, 0.46)');
        }
      } else {
        important(cell, 'background', 'rgba(15, 23, 42, 0.92)');
        important(cell, 'color', '#f8fafc');
      }
      forceWhiteText(cell);
      normalizeStatusBadge(cell);
    });
  }

  function applyLinks(table) {
    Array.prototype.forEach.call(table.querySelectorAll('td:first-child a, .fpt-v582-col-player a, td:first-child strong, .fpt-v582-col-player strong, td:first-child span, .fpt-v582-col-player span'), function (node) {
      important(node, 'display', 'inline');
      important(node, 'white-space', 'normal');
      important(node, 'overflow', 'visible');
      important(node, 'text-overflow', 'clip');
      important(node, 'overflow-wrap', 'anywhere');
      important(node, 'word-break', 'normal');
      important(node, 'line-height', 'inherit');
      important(node, 'color', '#f8fafc');
      important(node, 'font-size', 'inherit');
    });
  }

  function decorateTable(table) {
    var type = classifyTable(table);
    if (!type) return 0;
    table.classList.add('fanta-player-table-v582');
    TYPE_CLASSES.forEach(function (name) { table.classList.remove(name); });
    ['v570','v571','v572','v573','v574','v575','v576','v577','v578','v579','v580','v582'].forEach(function (ver) {
      table.removeAttribute('data-player-table-' + ver);
      table.classList.remove('fanta-player-table-' + ver, 'fanta-player-table-' + ver + '-teamarea', 'fanta-player-table-' + ver + '-rose', 'fanta-player-table-' + ver + '-listone');
    });
    table.classList.add('fanta-player-table-v582-' + type);
    table.setAttribute('data-player-table-v582', type);
    var wrapper = ensureWrapper(table, type);
    var indexes = markColumns(table);

    if (!isMobileViewport()) return 1;

    applyWrapperInline(wrapper);
    applyTableInline(table);
    Array.prototype.forEach.call(table.querySelectorAll('th, td'), applyCellBase);
    Array.prototype.forEach.call(table.querySelectorAll('thead th'), function (cell) { applyHeader(cell); });
    Array.prototype.forEach.call(table.querySelectorAll('th:first-child, td:first-child, .fpt-v582-col-player'), function (cell) { applyPlayerCell(cell, cell.tagName === 'TH'); });
    applyColumnWidths(table);
    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
      ROLE_CLASSES.forEach(function (name) { row.classList.remove(name); });
      var role = inferRoleForRow(row, indexes);
      clearLegacyRoleClasses(row);
      if (role) {
        row.classList.add('fpt-v582-role-' + role);
        row.setAttribute('data-fpt-v582-role', role);
      }
      applyRoleStyle(row, role);
    });
    applyLinks(table);
    return 1;
  }

  function run() {
    scheduled = false;
    if (document.body) {
      document.body.classList.add('player-table-mobile-v582-active');
      ['v570','v571','v572','v573','v574','v575','v576','v577','v578','v579','v580','v582'].forEach(function (ver) {
        document.body.classList.remove('player-table-mobile-' + ver + '-active');
      });
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

  window.FantaPlayerTablesMobileV582 = { run: run, schedule: schedule, classifyTable: classifyTable };
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
