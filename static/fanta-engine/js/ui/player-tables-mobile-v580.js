(function () {
  'use strict';

  var VERSION = 'v580';
  var scheduled = false;
  var ROLE_CLASSES = ['fpt-v580-role-p', 'fpt-v580-role-d', 'fpt-v580-role-c', 'fpt-v580-role-a'];
  var TYPE_CLASSES = ['fanta-player-table-v580-teamarea', 'fanta-player-table-v580-rose', 'fanta-player-table-v580-listone'];
  var cachedListoneStyle = null;

  function isMobileViewport() {
    try { return window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches; }
    catch (_) { return window.innerWidth <= 900; }
  }

  function norm(text) {
    return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase().replace(/\s+/g, ' ');
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

  function getHeaders(table) { return Array.prototype.slice.call(table.querySelectorAll('thead th')); }

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
    if (table.closest('#teamProfilePageBody') || table.closest('#teamProfileDialog') || table.closest('.team-profile-roster-wrap') || table.classList.contains('team-profile-roster-table') || table.closest('section[data-page="teamprofile"]') || (table.closest('section[data-page="teamarea"]') && hasPlayerHeaders(table))) return 'teamarea';
    if (table.closest('section[data-page="clubs"] #rosterClubCards') || table.closest('#rosterClubCards') || table.closest('.roster-detail-row') || (table.classList.contains('roster-player-table') && !table.classList.contains('team-profile-roster-table'))) return 'rose';
    if (table.closest('section[data-page="listone"]') || table.querySelector('#listoneTableBody') || table.id === 'listoneTable' || table.classList.contains('free-agents-table') || table.classList.contains('listone-table')) return 'listone';
    return '';
  }

  function ensureWrapper(table, type) {
    var wrapper = table.closest('.table-wrap, .mobile-tabular-wrap, .listone-table-wrap, .roster-table-wrap, .team-profile-roster-wrap, .roster-inline-table-wrap');
    if (wrapper) {
      wrapper.classList.add('fanta-player-table-wrap-v580', 'fanta-player-table-wrap-v580-' + type);
      wrapper.setAttribute('data-player-table-wrap-v580', type);
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
    var explicit = row.querySelector('.fpt-v580-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole, [data-label="R (RM)"], [data-label="Ruolo"], [data-label="R"]');
    role = detectRoleFromText(explicit && explicit.textContent);
    if (role) return role;
    var cells = row.children || [];
    if (roleIndex >= 0 && cells[roleIndex]) return detectRoleFromText(cells[roleIndex].textContent);
    return '';
  }

  function applyRole(row, role) {
    ROLE_CLASSES.forEach(function (name) { row.classList.remove(name); });
    if (role) {
      row.classList.add('fpt-v580-role-' + role);
      row.setAttribute('data-fpt-v580-role', role);
    } else {
      row.removeAttribute('data-fpt-v580-role');
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
    addColumnClassByIndex(table, playerIndex >= 0 ? playerIndex : 0, 'fpt-v580-col-player');
    addColumnClassByIndex(table, roleIndex, 'fpt-v580-col-role');
    addColumnClassByIndex(table, statusIndex, 'fpt-v580-col-status');
    addColumnClassByIndex(table, teamIndex, 'fpt-v580-col-team');
    addColumnClassByIndex(table, costIndex, 'fpt-v580-col-cost');
    addColumnClassByIndex(table, qtaIndex, 'fpt-v580-col-qta');
    addColumnClassByIndex(table, marketIndex, 'fpt-v580-col-market');
    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) { applyRole(row, roleFromRow(row, roleIndex)); });
  }

  function important(node, prop, value) {
    if (!node || !node.style || value == null || value === '') return;
    node.style.setProperty(prop, value, 'important');
  }

  function computedStyleMap(node, props) {
    var out = {};
    if (!node || !window.getComputedStyle) return out;
    var cs = window.getComputedStyle(node);
    props.forEach(function (prop) { out[prop] = cs.getPropertyValue(prop); });
    return out;
  }

  function nonTransparent(color) {
    var value = String(color || '').replace(/\s+/g, '').toLowerCase();
    return value && value !== 'transparent' && value !== 'rgba(0,0,0,0)';
  }

  function findRoleRow(table, role) {
    var selectors = [
      'tbody tr[data-fpt-v580-role="' + role + '"]',
      role === 'p' ? 'tbody tr.zo-role-bg-v405-gk, tbody tr.player-role-gk' : '',
      role === 'd' ? 'tbody tr.zo-role-bg-v405-def, tbody tr.player-role-def' : '',
      role === 'c' ? 'tbody tr.zo-role-bg-v405-mid, tbody tr.player-role-mid' : '',
      role === 'a' ? 'tbody tr.zo-role-bg-v405-fwd, tbody tr.player-role-fwd' : ''
    ].filter(Boolean).join(',');
    return table.querySelector(selectors);
  }

  function fallbackRole(role) {
    var map = {
      p: { row: 'rgba(245, 158, 11, 0.12)', first: 'linear-gradient(90deg, rgba(245, 158, 11, 0.34), rgba(245, 158, 11, 0.16))', shadow: 'inset 4px 0 rgba(245, 158, 11, 0.82), 8px 0 14px rgba(15, 23, 42, 0.22)' },
      d: { row: 'rgba(34, 197, 94, 0.10)', first: 'linear-gradient(90deg, rgba(34, 197, 94, 0.32), rgba(34, 197, 94, 0.14))', shadow: 'inset 4px 0 rgba(34, 197, 94, 0.78), 8px 0 14px rgba(15, 23, 42, 0.22)' },
      c: { row: 'rgba(56, 189, 248, 0.10)', first: 'linear-gradient(90deg, rgba(56, 189, 248, 0.32), rgba(59, 130, 246, 0.14))', shadow: 'inset 4px 0 rgba(56, 189, 248, 0.78), 8px 0 14px rgba(15, 23, 42, 0.22)' },
      a: { row: 'rgba(248, 113, 113, 0.10)', first: 'linear-gradient(90deg, rgba(248, 113, 113, 0.32), rgba(239, 68, 68, 0.14))', shadow: 'inset 4px 0 rgba(248, 113, 113, 0.78), 8px 0 14px rgba(15, 23, 42, 0.22)' }
    };
    return map[role] || { row: '#ffffff', first: '#ffffff', shadow: '8px 0 14px rgba(15, 23, 42, 0.22)' };
  }

  function sampleListoneStyle() {
    var table = document.querySelector('section[data-page="listone"] table.listone-table, table#listoneTable, table.listone-table, table.free-agents-table');
    if (!table) return cachedListoneStyle;
    var firstHeader = table.querySelector('thead th:first-child');
    var anyHeader = table.querySelector('thead th');
    var anyCell = table.querySelector('tbody td') || table.querySelector('td');
    var tableStyle = computedStyleMap(table, ['font-size', 'font-family', 'border-collapse', 'border-spacing']);
    var cellStyle = computedStyleMap(anyCell, ['font-size', 'font-family', 'line-height', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'font-weight']);
    var headerStyle = computedStyleMap(anyHeader || firstHeader, ['background-color', 'background-image', 'color', 'font-size', 'font-family', 'line-height', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'font-weight', 'text-transform', 'letter-spacing']);
    var firstHeaderStyle = computedStyleMap(firstHeader || anyHeader, ['background-color', 'background-image', 'box-shadow', 'color']);
    var roles = {};
    ['p', 'd', 'c', 'a'].forEach(function (role) {
      var fb = fallbackRole(role);
      var row = findRoleRow(table, role);
      var first = row && row.children && row.children[0];
      var second = row && row.children && (row.children[1] || row.children[0]);
      var firstStyle = computedStyleMap(first, ['background-color', 'background-image', 'box-shadow', 'color', 'font-weight']);
      var secondStyle = computedStyleMap(second, ['background-color', 'background-image', 'color']);
      roles[role] = {
        rowBackgroundColor: nonTransparent(secondStyle['background-color']) ? secondStyle['background-color'] : fb.row,
        rowBackgroundImage: secondStyle['background-image'] && secondStyle['background-image'] !== 'none' ? secondStyle['background-image'] : 'none',
        firstBackgroundColor: nonTransparent(firstStyle['background-color']) ? firstStyle['background-color'] : 'transparent',
        firstBackgroundImage: firstStyle['background-image'] && firstStyle['background-image'] !== 'none' ? firstStyle['background-image'] : fb.first,
        firstBoxShadow: firstStyle['box-shadow'] && firstStyle['box-shadow'] !== 'none' ? firstStyle['box-shadow'] : fb.shadow,
        firstColor: firstStyle.color || '#f8fafc',
        firstFontWeight: firstStyle['font-weight'] || '900',
        rowColor: secondStyle.color || '#0f172a'
      };
    });
    cachedListoneStyle = { table: tableStyle, cell: cellStyle, header: headerStyle, firstHeader: firstHeaderStyle, roles: roles };
    return cachedListoneStyle;
  }

  function fallbackListoneStyle() {
    var roles = {};
    ['p', 'd', 'c', 'a'].forEach(function (role) {
      var fb = fallbackRole(role);
      roles[role] = { rowBackgroundColor: fb.row, rowBackgroundImage: 'none', firstBackgroundColor: 'transparent', firstBackgroundImage: fb.first, firstBoxShadow: fb.shadow, firstColor: '#f8fafc', firstFontWeight: '900', rowColor: '#0f172a' };
    });
    return {
      table: { 'font-size': 'var(--fanta-table-mobile-font-v550, 0.64rem)', 'font-family': '' },
      cell: { 'font-size': 'inherit', 'font-family': '', 'line-height': '1.14', 'padding-top': '5px', 'padding-right': '4px', 'padding-bottom': '5px', 'padding-left': '4px', 'font-weight': '' },
      header: { 'background-color': 'rgba(15, 23, 42, 0.98)', 'background-image': 'none', color: '#f8fafc', 'font-size': 'inherit', 'font-family': '', 'line-height': '1.14', 'padding-top': '5px', 'padding-right': '4px', 'padding-bottom': '5px', 'padding-left': '4px', 'font-weight': '800', 'text-transform': 'uppercase', 'letter-spacing': '0.04em' },
      firstHeader: { 'background-color': 'rgba(15, 23, 42, 0.98)', 'background-image': 'none', 'box-shadow': '8px 0 14px rgba(15, 23, 42, 0.26)', color: '#f8fafc' },
      roles: roles
    };
  }

  function listoneStyle() {
    return sampleListoneStyle() || fallbackListoneStyle();
  }

  function widthForType(type) {
    return {
      player: type === 'listone' ? 'clamp(8.5rem, 46vw, 13.5rem)' : 'clamp(5.25rem, 28vw, 7rem)',
      playerMax: type === 'listone' ? 'clamp(10rem, 54vw, 15rem)' : 'clamp(6rem, 32vw, 8rem)',
      status: '3.75rem', role: '5.375rem', small: '3.75rem', team: '3.125rem', market: '5.25rem'
    };
  }

  function setCellSizing(cell, style) {
    important(cell, 'box-sizing', 'border-box');
    important(cell, 'display', 'table-cell');
    important(cell, 'text-align', 'left');
    important(cell, 'vertical-align', 'middle');
    important(cell, 'font-size', style.cell['font-size'] || 'inherit');
    if (style.cell['font-family']) important(cell, 'font-family', style.cell['font-family']);
    important(cell, 'line-height', style.cell['line-height'] || '1.14');
    important(cell, 'padding-top', style.cell['padding-top'] || '5px');
    important(cell, 'padding-right', style.cell['padding-right'] || '4px');
    important(cell, 'padding-bottom', style.cell['padding-bottom'] || '5px');
    important(cell, 'padding-left', style.cell['padding-left'] || '4px');
    important(cell, 'height', 'auto');
    important(cell, 'min-height', '0');
  }

  function applyColumnWidths(table, type) {
    var sizes = widthForType(type);
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v580-col-player, th:first-child, td:first-child'), function (cell) {
      important(cell, 'position', 'sticky'); important(cell, 'left', '0');
      important(cell, 'z-index', cell.tagName === 'TH' ? '310' : '270');
      important(cell, 'width', sizes.player); important(cell, 'min-width', sizes.player); important(cell, 'max-width', sizes.playerMax);
      important(cell, 'white-space', 'normal'); important(cell, 'overflow', 'visible'); important(cell, 'text-overflow', 'clip');
      important(cell, 'overflow-wrap', 'anywhere'); important(cell, 'word-break', 'normal'); important(cell, 'text-align', 'left');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v580-col-role, .roster-col-role, .team-profile-role-cell, .listone-col-classicRole'), function (cell) {
      important(cell, 'width', sizes.role); important(cell, 'min-width', sizes.role); important(cell, 'max-width', sizes.role);
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v580-col-status, .roster-col-status, .team-profile-status-cell, .listone-col-status'), function (cell) {
      important(cell, 'width', sizes.status); important(cell, 'min-width', sizes.status); important(cell, 'max-width', sizes.status); important(cell, 'overflow-wrap', 'anywhere');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v580-col-team, .roster-col-team, .team-profile-team-cell, .listone-col-realTeam'), function (cell) {
      important(cell, 'width', sizes.team); important(cell, 'min-width', sizes.team); important(cell, 'max-width', sizes.team);
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v580-col-cost, .fpt-v580-col-qta, .roster-col-cost, .roster-col-qta, .team-profile-cost-cell, .team-profile-qta-cell, .listone-col-quotationCurrent, .listone-col-rosterCost, .listone-col-fvm'), function (cell) {
      important(cell, 'width', sizes.small); important(cell, 'min-width', sizes.small); important(cell, 'max-width', sizes.small); important(cell, 'text-align', 'left');
    });
    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v580-col-market, .roster-col-market, .team-profile-market-cell'), function (cell) {
      important(cell, 'width', sizes.market); important(cell, 'min-width', sizes.market); important(cell, 'max-width', sizes.market);
    });
  }

  function applyListoneCloneToTarget(table, type) {
    if (!isMobileViewport()) return;
    if (type === 'listone') return; /* Listone is the visual source. Do not rewrite it. */
    var style = listoneStyle();
    var sizes = widthForType(type);
    important(table, 'display', 'table'); important(table, 'table-layout', 'fixed'); important(table, 'width', 'max-content'); important(table, 'min-width', '100%');
    important(table, 'border-collapse', 'separate'); important(table, 'border-spacing', '0');
    important(table, 'font-size', style.table['font-size'] || 'var(--fanta-table-mobile-font-v550, 0.64rem)');
    if (style.table['font-family']) important(table, 'font-family', style.table['font-family']);

    var wrapper = table.closest('[data-player-table-wrap-v580], .team-profile-roster-wrap, .roster-inline-table-wrap, .listone-table-wrap, .mobile-tabular-wrap, .table-wrap');
    if (wrapper) { important(wrapper, 'max-width', '100%'); important(wrapper, 'overflow', 'auto'); important(wrapper, '-webkit-overflow-scrolling', 'touch'); important(wrapper, 'overscroll-behavior', 'contain'); important(wrapper, 'position', 'relative'); }

    Array.prototype.forEach.call(table.querySelectorAll('th, td'), function (cell) { setCellSizing(cell, style); });
    Array.prototype.forEach.call(table.querySelectorAll('thead th'), function (cell) {
      important(cell, 'position', 'sticky'); important(cell, 'top', '0'); important(cell, 'z-index', '280');
      important(cell, 'background-color', style.header['background-color'] || 'rgba(15, 23, 42, 0.98)');
      if (style.header['background-image'] && style.header['background-image'] !== 'none') important(cell, 'background-image', style.header['background-image']);
      important(cell, 'color', style.header.color || '#f8fafc'); important(cell, 'font-weight', style.header['font-weight'] || '800');
      important(cell, 'text-transform', style.header['text-transform'] || 'uppercase'); important(cell, 'letter-spacing', style.header['letter-spacing'] || '0.04em'); important(cell, 'text-align', 'left');
    });
    Array.prototype.forEach.call(table.querySelectorAll('thead th:first-child, thead .fpt-v580-col-player'), function (cell) {
      important(cell, 'z-index', '310');
      important(cell, 'background-color', style.firstHeader['background-color'] || style.header['background-color'] || 'rgba(15, 23, 42, 0.98)');
      if (style.firstHeader['background-image'] && style.firstHeader['background-image'] !== 'none') important(cell, 'background-image', style.firstHeader['background-image']);
      important(cell, 'color', style.firstHeader.color || style.header.color || '#f8fafc');
    });

    applyColumnWidths(table, type);

    Array.prototype.forEach.call(table.querySelectorAll('tbody tr'), function (row) {
      var role = row.getAttribute('data-fpt-v580-role') || '';
      var roleStyle = style.roles[role] || fallbackListoneStyle().roles[role] || fallbackRole('');
      Array.prototype.forEach.call(row.children || [], function (cell, index) {
        important(cell, 'background-color', roleStyle.rowBackgroundColor || '#ffffff');
        if (roleStyle.rowBackgroundImage && roleStyle.rowBackgroundImage !== 'none') important(cell, 'background-image', roleStyle.rowBackgroundImage);
        else important(cell, 'background-image', 'none');
        important(cell, 'color', roleStyle.rowColor || '#0f172a');
        if (index === 0 || cell.classList.contains('fpt-v580-col-player')) {
          important(cell, 'background-color', roleStyle.firstBackgroundColor || 'transparent');
          important(cell, 'background-image', roleStyle.firstBackgroundImage || roleStyle.rowBackgroundImage || 'none');
          important(cell, 'box-shadow', roleStyle.firstBoxShadow || '8px 0 14px rgba(15, 23, 42, 0.22)');
          important(cell, 'color', roleStyle.firstColor || '#f8fafc');
          important(cell, 'font-weight', roleStyle.firstFontWeight || '900');
        }
      });
    });

    Array.prototype.forEach.call(table.querySelectorAll('.fpt-v580-col-player a, td:first-child a, .fpt-v580-col-player strong, td:first-child strong, .fpt-v580-col-player span, td:first-child span'), function (node) {
      important(node, 'white-space', 'normal'); important(node, 'overflow', 'visible'); important(node, 'text-overflow', 'clip'); important(node, 'line-height', 'inherit'); important(node, 'word-break', 'normal'); important(node, 'overflow-wrap', 'anywhere'); important(node, 'color', 'inherit'); important(node, 'font-size', 'inherit');
    });
  }

  function decorateTable(table) {
    var type = classifyTable(table);
    if (!type) return 0;
    table.classList.add('fanta-player-table-v580');
    TYPE_CLASSES.forEach(function (name) { table.classList.remove(name); });
    table.classList.add('fanta-player-table-v580-' + type);
    table.setAttribute('data-player-table-v580', type);
    ensureWrapper(table, type);
    markColumns(table);
    if (type === 'listone') sampleListoneStyle();
    applyListoneCloneToTarget(table, type);
    return 1;
  }

  function run() {
    scheduled = false;
    if (document.body) document.body.classList.add('player-table-mobile-v580-active');
    var selector = ['section[data-page="listone"] table.listone-table', 'table#listoneTable', 'table.listone-table', 'table.free-agents-table', '#teamProfilePageBody table', '#teamProfileDialog table', '.team-profile-roster-wrap table', 'section[data-page="teamprofile"] table', 'section[data-page="teamarea"] table', 'section[data-page="clubs"] #rosterClubCards table.roster-player-table', '#rosterClubCards table.roster-player-table', 'table.team-profile-roster-table', 'table.roster-player-table'].join(',');
    var tables = Array.prototype.slice.call(document.querySelectorAll(selector));
    tables.filter(function (t) { return classifyTable(t) === 'listone'; }).forEach(decorateTable);
    tables.filter(function (t) { return classifyTable(t) !== 'listone'; }).forEach(decorateTable);
    return tables.length;
  }

  function schedule(delay) {
    if (scheduled) return;
    scheduled = true;
    var runner = function () { window.requestAnimationFrame(run); };
    if (delay) window.setTimeout(runner, delay); else runner();
  }

  window.FantaPlayerTablesMobileV580 = { run: run, schedule: schedule, classifyTable: classifyTable, sampleListoneStyle: sampleListoneStyle };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { schedule(); }); else schedule();
  window.addEventListener('load', function () { schedule(); schedule(250); schedule(800); });
  window.addEventListener('hashchange', function () { schedule(); schedule(250); });
  window.addEventListener('resize', function () { cachedListoneStyle = null; schedule(); });
  document.addEventListener('click', function () { schedule(); schedule(120); schedule(500); schedule(1200); }, true);
  document.addEventListener('change', function () { schedule(); schedule(120); }, true);
  var observer = new MutationObserver(function () { schedule(); });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  else document.addEventListener('DOMContentLoaded', function () { observer.observe(document.body, { childList: true, subtree: true, characterData: true }); });
}());
