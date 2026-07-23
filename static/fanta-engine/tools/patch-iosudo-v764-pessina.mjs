#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.argv[2] || '.');
const dataRoot = path.join(repoRoot, 'static', 'fanta-engine', 'data', 'sudatori', 'current');
const runtimePath = path.join(dataRoot, 'sudatori-runtime.json');
const archivePath = path.join(dataRoot, 'sudatori-data.json');
const manifestPath = path.join(dataRoot, 'manifest.json');
const staleOverlayPaths = [
  path.join(repoRoot, 'incoming', 'overlays', 'overlay_v773_iosudo_v764_fix_pessina_header.zip'),
  path.join(repoRoot, 'incoming', 'overlays', 'overlay_v774_iosudo_v764_ci_compatibile.zip')
];

const VERSION = 'V764';
const BUILD_TAG = 'iosudo-v764';
const RELEASE_NOTE = 'V764: Matteo Pessina protetto come centrocampista del Monza; Massimo Pessina resta portiere del Bologna; header applicazione aggiornato.';

const protectedIdentities = {
  'bologna-pessina-mas': { id: 'bologna-pessina-mas', teamId: 'bologna', teamName: 'Bologna', playerName: 'Massimo Pessina', role: 'P' },
  'monza-pessina-mas': { id: 'monza-pessina-mas', teamId: 'monza', teamName: 'Monza', playerName: 'Matteo Pessina', role: 'C' }
};

function norm(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function teamKey(value) {
  const key = norm(value);
  const aliases = new Map([
    ['bologna', 'bol'], ['bol', 'bol'],
    ['monza', 'mon'], ['mon', 'mon']
  ]);
  return aliases.get(key) || key;
}

function identityFor(item) {
  if (!item || typeof item !== 'object') return null;
  const ids = [];
  if (item.id) ids.push(String(item.id));
  if (item.canonicalPlayerId) ids.push(String(item.canonicalPlayerId));
  if (Array.isArray(item.canonicalPlayerIds)) item.canonicalPlayerIds.forEach((id) => { if (id) ids.push(String(id)); });
  for (const id of ids) {
    if (protectedIdentities[id]) return protectedIdentities[id];
  }
  const name = norm(item.playerName || item.target || item.name || item.originalName || item.disambiguatedName || '');
  if (!name.includes('pessina')) return null;
  const team = teamKey(item.teamId || item.teamName || item.team || item.realTeamOriginal || '');
  if (team === 'bol') return protectedIdentities['bologna-pessina-mas'];
  if (team === 'mon') return protectedIdentities['monza-pessina-mas'];
  return null;
}

function patchObjectGraph(root) {
  const stack = [root];
  const seen = new Set();
  let inspected = 0;
  let matched = 0;
  let corrected = 0;

  while (stack.length) {
    const item = stack.pop();
    if (!item || typeof item !== 'object' || seen.has(item)) continue;
    seen.add(item);
    inspected += 1;

    const identity = identityFor(item);
    if (identity) {
      matched += 1;
      const before = JSON.stringify(item);
      if (item.id && protectedIdentities[item.id]) item.id = identity.id;
      if (item.playerName != null) item.playerName = identity.playerName;
      if (item.target != null) item.target = identity.playerName;
      if (item.name != null && norm(item.name).includes('pessina')) item.name = identity.playerName;
      if (item.originalName != null && norm(item.originalName).includes('pessina')) item.originalName = identity.playerName;
      if (item.disambiguatedName != null) item.disambiguatedName = identity.playerName;
      if (item.canonicalFullName != null) item.canonicalFullName = identity.playerName;
      if (item.teamId != null) item.teamId = identity.teamId;
      if (item.teamName != null) item.teamName = identity.teamName;
      if (item.role != null || item.id === identity.id) item.role = identity.role;
      if (item.classicRole != null) item.classicRole = identity.role;
      if (item.rosterRole != null) item.rosterRole = identity.role;

      if (identity.id === 'monza-pessina-mas') {
        for (const key of ['formationPosition', 'formationSourcePosition', 'formationLine', 'position']) {
          if (['P', 'POR', 'Por'].includes(String(item[key] || ''))) item[key] = 'CC';
        }
        if (item.listone && teamKey(item.listone.realTeamOriginal || item.listone.realTeam || '') === 'bol') {
          delete item.listone;
          if (String(item.fantacalcioId || '') === '7172') delete item.fantacalcioId;
          delete item.listoneMatchMethodV754;
          delete item.listoneMatchMethodV756;
        }
      }

      if (identity.id === 'bologna-pessina-mas' && item.listone) {
        item.listone.classicRole = 'P';
        if (item.listone.rosterRole != null) item.listone.rosterRole = 'P';
      }

      if (Array.isArray(item.nameAliasesV755)) {
        item.nameAliasesV755 = Array.from(new Set(item.nameAliasesV755
          .filter((alias) => norm(alias) !== 'pessina')
          .concat([identity.playerName])));
      }
      item.identityOverrideV764 = `${identity.teamName}: identita protetta per nome completo, squadra e ruolo`;
      if (before !== JSON.stringify(item)) corrected += 1;
    }

    for (const value of Object.values(item)) {
      if (value && typeof value === 'object') stack.push(value);
    }
  }
  return { inspected, matched, corrected };
}

function updateMeta(meta) {
  if (!meta || typeof meta !== 'object') return;
  meta.id = 'sudatori-iosudo-v764';
  meta.version = VERSION;
  meta.dedupVersion = VERSION;
  meta.buildTag = BUILD_TAG;
  meta.runtimePayloadVersion = VERSION;
  meta.appVersion = VERSION;
  meta.pessinaIdentityPolicyV764 = {
    protectedSurname: 'Pessina',
    globalSurnameAliasAllowed: false,
    identities: Object.values(protectedIdentities).map((item) => Object.assign({}, item, { identityOverrideV764: `${item.teamName}: identita protetta per nome completo, squadra e ruolo` }))
  };
  if (meta.playerCatalogAuditV757 && typeof meta.playerCatalogAuditV757 === 'object') {
    meta.playerCatalogAuditV757.version = VERSION;
    meta.playerCatalogAuditV757.identityOverrides = Object.assign({}, meta.playerCatalogAuditV757.identityOverrides || {}, {
      'bologna-pessina-mas': 'Massimo Pessina',
      'monza-pessina-mas': 'Matteo Pessina'
    });
    const protectedAliases = new Set(meta.playerCatalogAuditV757.protectedSurnameAliases || []);
    protectedAliases.add('Pessina');
    meta.playerCatalogAuditV757.protectedSurnameAliases = Array.from(protectedAliases);
    meta.playerCatalogAuditV757.pessinaDisambiguationV764 = {
      bologna: { id: 'bologna-pessina-mas', name: 'Massimo Pessina', role: 'P', identityOverrideV764: 'Bologna: identita protetta per nome completo, squadra e ruolo' },
      monza: { id: 'monza-pessina-mas', name: 'Matteo Pessina', role: 'C', identityOverrideV764: 'Monza: identita protetta per nome completo, squadra e ruolo' }
    };
  }
  const notes = Array.isArray(meta.notes) ? meta.notes : [];
  meta.notes = [RELEASE_NOTE, ...notes.filter((note) => note !== RELEASE_NOTE)];
}

function patchJsonFile(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`File dati non trovato: ${filePath}`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const result = patchObjectGraph(data);
  updateMeta(data.meta);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  return result;
}

function patchManifest() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Manifest non trovato: ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  updateMeta(manifest);
  manifest.id = 'sudatori-iosudo-v764';
  manifest.version = VERSION;
  manifest.appVersion = VERSION;
  manifest.dedupVersion = VERSION;
  manifest.runtimePayloadVersion = VERSION;
  manifest.buildTag = BUILD_TAG;
  manifest.pessinaIdentityPolicyV764 = {
    globalSurnameAliasAllowed: false,
    bologna: { id: 'bologna-pessina-mas', name: 'Massimo Pessina', role: 'P' },
    monza: { id: 'monza-pessina-mas', name: 'Matteo Pessina', role: 'C' }
  };
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function appendDoc(relativePath, heading, body) {
  const filePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(filePath)) return false;
  let text = fs.readFileSync(filePath, 'utf8');
  if (text.includes(heading)) return false;
  if (!text.endsWith('\n')) text += '\n';
  text += `\n${heading}\n\n${body.trim()}\n`;
  fs.writeFileSync(filePath, text);
  return true;
}

let staleOverlaysRemoved = 0;
for (const stalePath of staleOverlayPaths) {
  if (fs.existsSync(stalePath)) {
    fs.rmSync(stalePath, { force: true });
    staleOverlaysRemoved += 1;
  }
}

const runtimeResult = patchJsonFile(runtimePath);
const archiveResult = patchJsonFile(archivePath);
patchManifest();
const docsUpdated = [
  appendDoc('docs/HANDOFF_IOSUDO_DATI.md', '## V764 - Pessina e header applicazione', '- Massimo Pessina: Bologna, ruolo P, ID `bologna-pessina-mas`.\n- Matteo Pessina: Monza, ruolo C, ID `monza-pessina-mas`.\n- Il cognome `Pessina` non e un alias globale.\n- L header visibile deve riportare la versione applicativa corrente.'),
  appendDoc('docs/OVERLAY_ROADMAP.md', '## V764 - Protezione identita Pessina', '- Protezione strutturale per i due Pessina.\n- Versione applicativa visibile nell header e aggiornata a ogni release.'),
  appendDoc('docs/OVERLAY_OPERATIONS.md', '## Regola operativa V764', 'Ogni overlay ioSudo deve aggiornare insieme: header visibile, file JS/CSS versionati, service worker, manifest e documentazione canonica pertinente.')
].filter(Boolean).length;

console.log(`[patch-iosudo-v764] OK - runtime ${runtimeResult.corrected}/${runtimeResult.matched} correzioni, archivio ${archiveResult.corrected}/${archiveResult.matched}, docs aggiornati ${docsUpdated}, overlay obsoleti rimossi ${staleOverlaysRemoved}.`);
