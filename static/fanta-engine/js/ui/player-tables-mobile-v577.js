(function () {
  'use strict';

  var VERSION = 'v577';
  var scheduled = false;
  var ROLE_CLASSES = ['fpt-v577-role-p', 'fpt-v577-role-d', 'fpt-v577-role-c', 'fpt-v577-role-a'];
  var TYPE_CLASSES = ['fanta-player-table-v577-teamarea', 'fanta-player-table-v577-rose', 'fanta-player-table-v577-listone'];

  function isMobileViewport() {
    try {
      return window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches;
    } catch (_) {
      return window.innerWidth <= 900;
    }
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
    var playerIndex = getColumnIndexByLabels(table, ['GIOCATORE', 'NOME']);
    var roleIndex = getColumnIndexByLabels(table, ['R (RM)', 'RUOLO', 'R']);
    return playerIndex >= 0 && roleIndex >= 0;
  }

  function classifyTable(table) {
    if (!table || table.nodeType !== 1) return '';

    /* Team Area / pagina squadra must win before generic listone-table classes.
       That table is rendered dynamically inside #teamProfilePageBody and receives
       legacy listone skin classes later, so class-only detection is not enough. */
    if (
      table.closest('#teamProfilePageBody') ||
      table.closest('#teamProfileDialog') ||
      table.closest('.team-profile-roster-wrap') ||
      table.classList.contains('team-profile-roster-table') ||
      table.closest('section[data-page="teamprofile"]') ||
      (table.closest('section[data-page="teamarea"]') && hasPlayerHeaders(table))
    ) return 'teamarea';

    if (
      table.closest('section[data-page="clubs"] #rosterClubCards') ||
      table.closest('#rosterClubCards') ||
      table.closest('.roster-detail-row') ||
      (table.classList.contains('roster-player-table') && !table.classList.contains('team-profile-roster-table'))
    ) return 'rose';

    if (
      table.closest('section[data-page="listone"]') ||
      table.querySelector('#listoneTableBody') ||
      table.id === 'listoneTable' ||
      table.classList.contains('free-agents-table') ||
      table.classList.contains('listone-table')
    ) return 'listone';

    return '';
  }

  function ensureWrapper(table, type) {
    var wrapper = table.closest('.table-wrap, .mobile-tabular-wrap, .listone-table-wrap, .roster-table-wrap, .team-profile-roster-wrap, .roster-inline-table-wrap');
    if (wrapper) {
      wrapper.classList.add('fanta-player-table-wrap-v577', 'fanta-player-table-wrap-v577-' + type);
      wrapper.setAttribute('data-player-table-wrap-v577', type);
    }
    return wrapper;
  }

  function roleFromRow(row, roleIndex) {
    var direct = row.getAttribute('data-player-role') || row.getAttribute('data-role') || (row.dataset ? (row.dataset.playerRole || row.dataset.role) : '');
    var role = detectRoleFromText(direct);
    if (role) return role;
    if (row.classList.contains('player-role-gk') || row.classList.contains('zo-role-bg-v405-gk')) return 'p';
    if (row.classList.contains('player-role-def') || row.classList.contains('zo-role-bg-v405-def')) return 'd';
    if (row.classList.contains('player-role-mid') || row.classList.contains('zo-role-bg-v405-mid')) return 'c';
    if (row.classList.contains('player-role-fwd') || row.classList.contains('zo-role-bg-v405-fwd')) return 'a';
    var explicit = row.querySelector('.fpt-v577-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole, [data-label="R (RM)"], [data-label="Ruolo"], [data-label="R"]');
    role = detectRoleFromText(explicit && explicit.textContent);
    if (role) return role;
    var cells = row.children || [];
    if (roleIndex >= 0 && cells[roleIndex]) return detectRoleFromText(cells[roleIndex].textContent);
    return '';
  }

  function applyRole(row, role) {
    ROLE_CLASSES.forEach(function (name) { row.classList.remove(name); });
    if (role) {
      row.classList.add('fpt-v577-role-' + role);
      row.setAttribute('data-fpt-v577-role', role);
    } else {
      row.removeAttribute('data-fpt-v577-role');
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

    addColumnClassByIndex(table, playerIndex >= 0 ? playerIndex : 0, 'fpt-v577-col-player');
    addColumnClassByIndex(table, roleIndex, 'fpt-v577-col-role');
    addColumnClassByIndex(table, statusIndex, 'fpt-v577-col-status');
    addColumnClassByIndex(table, teamIndex, 'fpt-v577-col-team');
    addColumnClassByIndex(table, costIndex, 'fpt-v577-col-cost');
    addColumnClassByIndex(table, qtaIndex, 'fpt-v577-col-qta');
    addColumnClassByIndex(table, marketIndex, 'fpt-v577-col-market');

    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
      applyRole(row, roleFromRow(row, roleIndex));
    });
  }

  function roleColor(role) {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) {
      if (role === 'p') return '#4a3612';
      if (role === 'd') return '#123d27';
      if (role === 'c') return '#17345f';
      if (role === 'a') return '#4a1d1d';
      return '#111827';
    }
    if (role === 'p') return '#fff2b3';
    if (role === 'd') return '#d9f8df';
    if (role === 'c') return '#dbeafe';
    if (role === 'a') return '#fee2e2';
    return '#ffffff';
  }

  function roleLine(role) {
    if (role === 'p') return '#d97706';
    if (role === 'd') return '#16a34a';
    if (role === 'c') return '#2563eb';
    if (role === 'a') return '#dc2626';
    return 'rgba(148, 163, 184, 0.5)';
  }

  function important(node, prop, value) {
    if (!node || !node.style) return;
    node.style.setProperty(prop, value, 'important');
  }

  function removeImportant(node, prop) {
    if (!node || !node.style) return;
    node.style.removeProperty(prop);
  }

  function widthForType(type) {
    if (type === 'listone') {
      return {
        player: 'clamp(17rem, 92vw, 27rem)',
        playerMax: 'clamp(20rem, 108vw, 30rem)',
        tableMin: '100%'
      };
    }
    return {
      player: 'clamp(10.25rem, 54vw, 14rem)',
      playerMax: 'clamp(11.25rem, 62vw, 16rem)',
      tableMin: '100%'
    };
  }

  function setCellSizing(cell) {
    important(cell, 'box-sizing', 'border-box');
    important(cell, 'text-align', 'left');
    important(cell, 'vertical-align', 'middle');
    important(cell, 'white-space', 'normal');
    important(cell, 'overflow', 'hidden');
    important(cell, 'text-overflow', 'clip');
    important(cell, 'font-size', '0.68rem');
    important(cell, 'line-height', '1.18');
    important(cell, 'padding', '0.42rem 0.5rem');
  }

  function applyInlineMobileStyles(table, type) {
    if (!isMobileViewport()) return;
    var sizes = widthForType(type);
    important(table, 'table-layout', 'fixed');
    important(table, 'width', 'max-content');
    important(table, 'min-width', sizes.tableMin);
    important(table, 'border-collapse', 'separate');
    important(table, 'border-spacing', '0');
    important(table, 'font-size', '0.68rem');

    var wrapper = table.closest('[data-player-table-wrap-v577], .team-profile-roster-wrap, .roster-inline-table-wrap, .listone-table-wrap, .mobile-tabular-wrap, .table-wrap');
    if (wrapper) {
      important(wrapper, 'max-width', '100%');
      important(wrapper, 'max-height', 'min(70vh, 620px)');
      important(wrapper, 'overflow', 'auto');
      important(wrapper, '-webkit-overflow-scrolling', 'touch');
      important(wrapper, 'overscroll-behavior', 'contain');
      important(wrapper, 'position', 'relative');
    }

    Array.prototype.forEach.call(table.querySelectorAll('th, td'), function (cell) {
      setCellSizing(cell);
    });

    Array.prototype.forEach.call(table.querySelectorAll('thead th'), function (cell) {
      important(cell, 'position', 'sticky');
      important(cell, 'top', '0');
      important(cell, 'z-index', '260');
      important(cell, 'background-color', 'rgba(15, 23, 42, 0.99)');
      important(cell, 'color', '#f8fafc');
      important(cell, 'font-weight', '800');
      important(cell, 'border-bottom', '1px solid rgba(148, 163, 184, 0.34)');
    });

    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v577-col-player, th:first-child, td:first-child'), function (cell) {
      important(cell, 'position', 'sticky');
      important(cell, 'left', '0');
      important(cell, 'z-index', cell.tagName === 'TH' ? '290' : '250');
      important(cell, 'width', sizes.player);
      important(cell, 'min-width', sizes.player);
      important(cell, 'max-width', sizes.playerMax);
      important(cell, 'white-space', 'normal');
      important(cell, 'overflow-wrap', 'anywhere');
      important(cell, 'word-break', 'normal');
      important(cell, 'text-align', 'left');
      important(cell, 'box-shadow', '8px 0 14px rgba(2, 6, 23, 0.42)');
    });

    Array.prototype.forEach.call(table.querySelectorAll('thead .fpt-v577-col-player, thead th:first-child'), function (cell) {
      important(cell, 'background-color', 'rgba(15, 23, 42, 0.99)');
      important(cell, 'color', '#f8fafc');
    });

    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v577-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole'), function (cell) {
      important(cell, 'width', '5.375rem');
      important(cell, 'min-width', '5.375rem');
      important(cell, 'max-width', '5.375rem');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v577-col-status, .roster-col-status, .team-profile-status-cell, .listone-col-status'), function (cell) {
      important(cell, 'width', '3.25rem');
      important(cell, 'min-width', '3.25rem');
      important(cell, 'max-width', '3.25rem');
      important(cell, 'overflow-wrap', 'anywhere');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v577-col-team, .roster-col-team, .team-profile-team-cell, .listone-col-realTeam'), function (cell) {
      important(cell, 'width', '3.125rem');
      important(cell, 'min-width', '3.125rem');
      important(cell, 'max-width', '3.125rem');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v577-col-cost, .fpt-v577-col-qta, .roster-col-cost, .roster-col-qta, .team-profile-cost-cell, .team-profile-qta-cell, .listone-col-quotationCurrent, .listone-col-rosterCost, .listone-col-fvm'), function (cell) {
      important(cell, 'width', '3.75rem');
      important(cell, 'min-width', '3.75rem');
      important(cell, 'max-width', '3.75rem');
      important(cell, 'text-align', 'left');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v577-col-market, .roster-col-market, .team-profile-market-cell'), function (cell) {
      important(cell, 'width', '5.25rem');
      important(cell, 'min-width', '5.25rem');
      important(cell, 'max-width', '5.25rem');
    });

    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
      var role = row.getAttribute('data-fpt-v577-role') || '';
      var color = roleColor(role);
      var line = roleLine(role);
      Array.prototype.forEach.call(row.children || [], function (cell, index) {
        important(cell, 'background-color', color);
        important(cell, 'color', document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8fafc' : '#0f172a');
        if (index === 0 || cell.classList.contains('fpt-v577-col-player')) {
          important(cell, 'box-shadow', 'inset 4px 0 ' + line + ', 8px 0 14px rgba(2, 6, 23, 0.42)');
        }
      });
    });

    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v577-col-player a, td:first-child a, .fpt-v577-col-player strong, td:first-child strong'), function (node) {
      important(node, 'white-space', 'normal');
      important(node, 'overflow', 'visible');
      important(node, 'text-overflow', 'clip');
      important(node, 'line-height', '1.16');
      important(node, 'word-break', 'normal');
      important(node, 'overflow-wrap', 'anywhere');
      important(node, 'color', 'inherit');
    });
  }

  function clearInlineMobileStyles(table) {
    if (isMobileViewport()) return;
    Array.prototype.forEach.call(table.querySelectorAll('th, td'), function (cell) {
      ['position', 'left', 'top', 'z-index', 'width', 'min-width', 'max-width', 'background-color', 'box-shadow', 'white-space', 'overflow-wrap', 'word-break', 'text-overflow', 'overflow'].forEach(function (prop) {
        removeImportant(cell, prop);
      });
    });
  }

  function decorateTable(table) {
    var type = classifyTable(table);
    if (!type) return 0;
    table.classList.add('fanta-player-table-v577');
    TYPE_CLASSES.forEach(function (name) { table.classList.remove(name); });
    table.classList.add('fanta-player-table-v577-' + type);
    table.setAttribute('data-player-table-v577', type);
    ensureWrapper(table, type);
    markColumns(table);
    applyInlineMobileStyles(table, type);
    clearInlineMobileStyles(table);
    return 1;
  }

  function run() {
    scheduled = false;
    if (document.body) document.body.classList.add('player-table-mobile-v577-active');
    var selector = [
      '#teamProfilePageBody table',
      '#teamProfileDialog table',
      '.team-profile-roster-wrap table',
      'section[data-page="teamprofile"] table',
      'section[data-page="teamarea"] table',
      'section[data-page="clubs"] #rosterClubCards table.roster-player-table',
      '#rosterClubCards table.roster-player-table',
      'section[data-page="listone"] table.listone-table',
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

  function schedule(delay) {
    if (scheduled) return;
    scheduled = true;
    var runner = function () { window.requestAnimationFrame(run); };
    if (delay) window.setTimeout(runner, delay);
    else runner();
  }

  window.FantaPlayerTablesMobileV577 = { run: run, schedule: schedule, classifyTable: classifyTable };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { schedule(); });
  else schedule();

  window.addEventListener('load', function () { schedule(); schedule(250); schedule(800); });
  window.addEventListener('hashchange', function () { schedule(); schedule(250); });
  window.addEventListener('resize', function () { schedule(); });
  document.addEventListener('click', function () { schedule(); schedule(120); schedule(500); }, true);
  document.addEventListener('change', function () { schedule(); schedule(120); }, true);

  var observer = new MutationObserver(function () { schedule(); });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  else document.addEventListener('DOMContentLoaded', function () {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
}());
