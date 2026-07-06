(function () {
  'use strict';

  var VERSION = 'v583';
  var scheduled = false;
  var TYPES = ['teamarea', 'rose', 'listone'];
  var TYPE_CLASSES = TYPES.map(function (type) { return 'fanta-player-table-v583-' + type; });
  var ROLE_CLASSES = ['fpt-v583-role-p', 'fpt-v583-role-d', 'fpt-v583-role-c', 'fpt-v583-role-a'];
  var PRIOR_VERSIONS = ['v570', 'v571', 'v572', 'v573', 'v574', 'v575', 'v576', 'v577', 'v578', 'v579', 'v580', 'v581', 'v582', 'v583'];
  var LEGACY_ROLE_CLASSES = [
    'zo-role-bg-v405-gk', 'zo-role-bg-v405-def', 'zo-role-bg-v405-mid', 'zo-role-bg-v405-fwd',
    'player-role-gk', 'player-role-def', 'player-role-mid', 'player-role-fwd',
    'role-gk', 'role-def', 'role-mid', 'role-fwd',
    'role-p', 'role-d', 'role-c', 'role-a'
  ];

  var COLORS = {
    p: { row: 'linear-gradient(90deg, rgba(120, 53, 15, 0.92), rgba(146, 64, 14, 0.78))', first: 'linear-gradient(90deg, rgba(245, 158, 11, 0.58), rgba(120, 53, 15, 0.98))', line: 'rgba(245, 158, 11, 0.92)' },
    d: { row: 'linear-gradient(90deg, rgba(20, 83, 45, 0.92), rgba(22, 101, 52, 0.76))', first: 'linear-gradient(90deg, rgba(34, 197, 94, 0.54), rgba(20, 83, 45, 0.98))', line: 'rgba(34, 197, 94, 0.88)' },
    c: { row: 'linear-gradient(90deg, rgba(12, 74, 110, 0.92), rgba(30, 64, 175, 0.76))', first: 'linear-gradient(90deg, rgba(56, 189, 248, 0.54), rgba(30, 64, 175, 0.98))', line: 'rgba(56, 189, 248, 0.88)' },
    a: { row: 'linear-gradient(90deg, rgba(127, 29, 29, 0.92), rgba(153, 27, 27, 0.76))', first: 'linear-gradient(90deg, rgba(248, 113, 113, 0.56), rgba(127, 29, 29, 0.98))', line: 'rgba(248, 113, 113, 0.90)' }
  };

  var WIDTHS = {
    player: 'clamp(5.25rem, 28vw, 7rem)',
    playerMax: 'clamp(6rem, 32vw, 8rem)',
    role: '5.375rem',
    team: '3.125rem',
    small: '3.75rem',
    market: '5.25rem',
    status: { teamarea: '8rem', rose: '4.75rem', listone: '5.25rem', default: '4.75rem' },
    listoneRoster: '6.25rem',
    listoneChange: '6.25rem'
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
    Array.prototype.forEach.call(cell.querySelectorAll('.status, .status-badge, .player-status, .mini-badge, [class*="status-"]'), function (badge) {
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
      important(badge, 'text-shadow', 'none');
    });
  }

  function clearLegacyRoleClasses(node) {
    if (!node || !node.classList) return;
    LEGACY_ROLE_CLASSES.forEach(function (name) { node.classList.remove(name); });
  }

  function clearLegacyRoleClassesDeep(row) {
    clearLegacyRoleClasses(row);
    if (!row || !row.querySelectorAll) return;
    Array.prototype.forEach.call(row.querySelectorAll('*'), clearLegacyRoleClasses);
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

  function roleFromClasses(node) {
    if (!node || !node.classList) return '';
    var classes = Array.prototype.slice.call(node.classList).join(' ').toLowerCase();
    if (/\b(gk|role-p|player-role-gk|zo-role-bg-v405-gk)\b/.test(classes)) return 'p';
    if (/\b(def|role-d|player-role-def|zo-role-bg-v405-def)\b/.test(classes)) return 'd';
    if (/\b(mid|role-c|player-role-mid|zo-role-bg-v405-mid)\b/.test(classes)) return 'c';
    if (/\b(fwd|role-a|player-role-fwd|zo-role-bg-v405-fwd)\b/.test(classes)) return 'a';
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
      wrapper.classList.add('fanta-player-table-wrap-v583', 'fanta-player-table-wrap-v583-' + type);
      wrapper.setAttribute('data-player-table-wrap-v583', type);
      return wrapper;
    }
    var parent = table.parentNode;
    if (!parent || parent.nodeType !== 1) return null;
    var created = document.createElement('div');
    created.className = 'fanta-player-table-wrap-v583 fanta-player-table-wrap-v583-' + type;
    created.setAttribute('data-player-table-wrap-v583', type);
    parent.insertBefore(created, table);
    created.appendChild(table);
    return created;
  }

  function markColumns(table) {
    var playerIndex = getColumnIndexByLabels(table, ['GIOCATORE', 'NOME', 'CALCIATORE']);
    var roleIndex = getColumnIndexByLabels(table, ['R (RM)', 'RUOLO', 'R']);
    var statusIndex = getColumnIndexByLabels(table, ['STATO', 'STATUS']);
    var teamIndex = getColumnIndexByLabels(table, ['SQUADRA', 'TEAM', 'CLUB', 'SQ']);
    var costIndex = getColumnIndexByLabels(table, ['COSTO', 'PREZZO', 'COSTO ROSA']);
    var qtaIndex = getColumnIndexByLabels(table, ['QT.A', 'QTA', 'QUOTAZIONE ATTUALE']);
    var marketIndex = getColumnIndexByLabels(table, ['MERCATO', 'FANTAMERCATO']);
    var rosterIndex = getColumnIndexByLabels(table, ['ROSA', 'FANTASQUADRA', 'FANTA SQUADRA']);
    var changeIndex = getColumnIndexByLabels(table, ['MODIFICA', 'MODIFICHE']);
    addColumnClassByIndex(table, playerIndex >= 0 ? playerIndex : 0, 'fpt-v583-col-player');
    addColumnClassByIndex(table, roleIndex, 'fpt-v583-col-role');
    addColumnClassByIndex(table, statusIndex, 'fpt-v583-col-status');
    addColumnClassByIndex(table, teamIndex, 'fpt-v583-col-team');
    addColumnClassByIndex(table, costIndex, 'fpt-v583-col-cost');
    addColumnClassByIndex(table, qtaIndex, 'fpt-v583-col-qta');
    addColumnClassByIndex(table, marketIndex, 'fpt-v583-col-market');
    addColumnClassByIndex(table, rosterIndex, 'fpt-v583-col-roster');
    addColumnClassByIndex(table, changeIndex, 'fpt-v583-col-change');
    return {
      roleIndex: roleIndex,
      playerIndex: playerIndex >= 0 ? playerIndex : 0,
      statusIndex: statusIndex,
      rosterIndex: rosterIndex,
      changeIndex: changeIndex
    };
  }

  function inferRoleForRow(row, indexes) {
    var role = roleFromClasses(row);
    if (!role && row.querySelectorAll) {
      var all = Array.prototype.slice.call(row.querySelectorAll('*'));
      for (var i = 0; i < all.length && !role; i += 1) role = roleFromClasses(all[i]);
    }
    if (!role && indexes.roleIndex >= 0 && row.children[indexes.roleIndex]) role = detectRoleFromText(row.children[indexes.roleIndex].textContent);
    if (!role) {
      var roleCell = row.querySelector('.fpt-v583-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole, [data-role]');
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
    important(wrapper, 'background', 'rgba(15, 23, 42, 0.96)');
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
    important(cell, 'width', WIDTHS.player);
    important(cell, 'min-width', WIDTHS.player);
    important(cell, 'max-width', WIDTHS.playerMax);
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

  function setWidth(cells, value) {
    Array.prototype.forEach.call(cells, function (cell) {
      important(cell, 'width', value);
      important(cell, 'min-width', value);
      important(cell, 'max-width', value);
      important(cell, 'text-align', 'left');
      important(cell, 'white-space', 'normal');
      important(cell, 'overflow-wrap', 'anywhere');
      normalizeStatusBadge(cell);
    });
  }

  function applyColumnWidths(table, type) {
    setWidth(table.querySelectorAll('.fpt-v583-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole'), WIDTHS.role);
    setWidth(table.querySelectorAll('.fpt-v583-col-status, .roster-col-status, .team-profile-status-cell, .listone-col-status'), WIDTHS.status[type] || WIDTHS.status.default);
    setWidth(table.querySelectorAll('.fpt-v583-col-team, .roster-col-team, .team-profile-team-cell, .listone-col-realTeam'), WIDTHS.team);
    setWidth(table.querySelectorAll('.fpt-v583-col-cost, .fpt-v583-col-qta, .roster-col-cost, .roster-col-qta, .team-profile-cost-cell, .team-profile-qta-cell, .listone-col-quotationCurrent, .listone-col-rosterCost, .listone-col-fvm'), WIDTHS.small);
    setWidth(table.querySelectorAll('.fpt-v583-col-market, .roster-col-market, .team-profile-market-cell'), WIDTHS.market);
    if (type === 'listone') {
      setWidth(table.querySelectorAll('.fpt-v583-col-roster, .listone-col-fantasyRoster'), WIDTHS.listoneRoster);
      setWidth(table.querySelectorAll('.fpt-v583-col-change, .listone-col-historyChange'), WIDTHS.listoneChange);
    }
  }

  function applyRoleStyle(row, role) {
    var color = COLORS[role] || null;
    Array.prototype.forEach.call(row.children || [], function (cell, index) {
      if (color) {
        important(cell, 'background', index === 0 ? color.first : color.row);
        important(cell, 'color', '#f8fafc');
        important(cell, 'font-weight', index === 0 ? '900' : '700');
        if (index === 0) important(cell, 'box-shadow', 'inset 4px 0 ' + color.line + ', 8px 0 14px rgba(2, 6, 23, 0.46)');
      } else {
        important(cell, 'background', 'rgba(15, 23, 42, 0.92)');
        important(cell, 'color', '#f8fafc');
      }
      forceWhiteText(cell);
      normalizeStatusBadge(cell);
    });
  }

  function applyLinks(table) {
    Array.prototype.forEach.call(table.querySelectorAll('td:first-child a, .fpt-v583-col-player a, td:first-child strong, .fpt-v583-col-player strong, td:first-child span, .fpt-v583-col-player span'), function (node) {
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

  function markFreeAgents(table, indexes) {
    if (!table || table.getAttribute('data-player-table-v583') !== 'listone') return;
    var candidates = [];
    if (indexes.rosterIndex >= 0) {
      Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
        var cell = row.children[indexes.rosterIndex];
        if (cell) candidates.push(cell);
      });
    }
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v583-col-roster, .listone-col-fantasyRoster'), function (cell) {
      if (candidates.indexOf(cell) < 0) candidates.push(cell);
    });
    candidates.forEach(function (cell) {
      var text = norm(cell.textContent);
      if (text.indexOf('SVINCOLATI') >= 0 || text.indexOf('NON PRESENTE') >= 0) {
        cell.classList.add('fpt-v583-free-agent');
        important(cell, 'color', '#fde68a');
        Array.prototype.forEach.call(cell.querySelectorAll('*'), function (node) {
          important(node, 'color', '#fde68a');
          important(node, 'font-weight', '900');
        });
      }
    });
  }

  function clearPriorMarks(table) {
    PRIOR_VERSIONS.forEach(function (ver) {
      table.removeAttribute('data-player-table-' + ver);
      table.classList.remove('fanta-player-table-' + ver, 'fanta-player-table-' + ver + '-teamarea', 'fanta-player-table-' + ver + '-rose', 'fanta-player-table-' + ver + '-listone');
    });
    Array.prototype.forEach.call(table.querySelectorAll('[class*="fpt-v"]'), function (node) {
      Array.prototype.slice.call(node.classList).forEach(function (name) {
        if (/^fpt-v\d+/.test(name)) node.classList.remove(name);
      });
    });
  }

  function decorateTable(table) {
    var type = classifyTable(table);
    if (!type) return 0;
    clearPriorMarks(table);
    table.classList.add('fanta-player-table-v583', 'fanta-player-table-v583-' + type);
    table.setAttribute('data-player-table-v583', type);
    var wrapper = ensureWrapper(table, type);
    var indexes = markColumns(table);

    if (!isMobileViewport()) return 1;

    applyWrapperInline(wrapper);
    applyTableInline(table);
    Array.prototype.forEach.call(table.querySelectorAll('th, td'), applyCellBase);
    Array.prototype.forEach.call(table.querySelectorAll('thead th'), applyHeader);
    Array.prototype.forEach.call(table.querySelectorAll('th:first-child, td:first-child, .fpt-v583-col-player'), function (cell) { applyPlayerCell(cell, cell.tagName === 'TH'); });
    applyColumnWidths(table, type);
    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
      ROLE_CLASSES.forEach(function (name) { row.classList.remove(name); });
      var role = inferRoleForRow(row, indexes);
      clearLegacyRoleClassesDeep(row);
      if (role) {
        row.classList.add('fpt-v583-role-' + role);
        row.setAttribute('data-fpt-v583-role', role);
      } else {
        row.removeAttribute('data-fpt-v583-role');
      }
      applyRoleStyle(row, role);
    });
    applyLinks(table);
    markFreeAgents(table, indexes);
    return 1;
  }

  function run() {
    scheduled = false;
    if (document.body) {
      PRIOR_VERSIONS.forEach(function (ver) { document.body.classList.remove('player-table-mobile-' + ver + '-active'); });
      document.body.classList.add('player-table-mobile-v583-active');
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

  window.FantaPlayerTablesMobileV583 = { run: run, schedule: schedule, classifyTable: classifyTable };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { schedule(); }); else schedule();
  window.addEventListener('load', function () { schedule(); schedule(250); schedule(800); schedule(1600); });
  window.addEventListener('hashchange', function () { schedule(); schedule(250); schedule(800); });
  window.addEventListener('resize', function () { schedule(); schedule(250); });
  document.addEventListener('click', function () { schedule(); schedule(120); schedule(500); schedule(1200); }, true);
  document.addEventListener('change', function () { schedule(); schedule(120); schedule(500); }, true);
  var observer = new MutationObserver(function () { schedule(); });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  else document.addEventListener('DOMContentLoaded', function () { observer.observe(document.body, { childList: true, subtree: true, characterData: true }); });
}());
