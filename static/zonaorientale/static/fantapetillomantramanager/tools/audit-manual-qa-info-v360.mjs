#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const quiet = process.argv.includes('--quiet');
const toolDir = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const candidates = [
  path.resolve(cwd, 'static', 'zonaorientale'),
  path.resolve(cwd, 'zonaorientale'),
  path.resolve(cwd),
  path.resolve(toolDir, '..')
];
const siteRoot = candidates.find((candidate) => fs.existsSync(path.join(candidate, 'assets', 'app.js')));
if (!siteRoot) {
  console.error('[audit-manual-qa-info-v360] site root non trovato');
  process.exit(1);
}
const app = fs.readFileSync(path.join(siteRoot, 'assets', 'app.js'), 'utf8');
const version = Number(app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/)?.[1] || 0);
const checks = [
  ['expected version >= V360', version >= 360],
  ['QA panel version constant present', /const version\s*=\s*['"]V\d+['"]/.test(app)],
  ['badge version present', /manual-qa-panel-v358__badge">V\d+/.test(app)],
  ['info text in checks', /info:\s*['"][^'"]{20,}/.test(app)],
  ['all historical check ids still present', /auth-admin[\s\S]*auth-presidente[\s\S]*admin-diagnostics[\s\S]*calciomercato-feed[\s\S]*calciomercato-filters[\s\S]*calciomercato-player-modal[\s\S]*calciomercato-player-diagnostics[\s\S]*calciomercato-admin-archive[\s\S]*listone[\s\S]*rose-player[\s\S]*competitions[\s\S]*trade-real[\s\S]*trade-simulator[\s\S]*mobile-nav[\s\S]*news-share/.test(app)],
  ['details info UI', /<details class="manual-qa-card-v358__info">/.test(app)],
  ['info summary i', /<summary title="Cosa controllare"[^>]*>i<\/summary>/.test(app)],
  ['export includes information column', /\| Stato \| Area \| Check \| Cosa controllare \| Note \|/.test(app)],
  ['smoke test verifies info presence', /getChecks\(\)\.every\(\(check\) => check\.info\)/.test(app)],
  ['admin-only preservation', /isAdminUser\(\)[\s\S]*root\.hidden\s*=\s*true/.test(app)]
];
const failures = checks.filter(([, ok]) => !ok).map(([label]) => label);
const infoCount = (app.match(/info:\s*['"]/g) || []).length;
if (infoCount < 15) failures.push(`expected at least 15 info entries, found ${infoCount}`);
if (!quiet) {
  console.log(`Audit manual QA info V360+: ${failures.length ? 'FAIL' : 'OK'} (runtime V${version})`);
  console.log(`Info entries: ${infoCount}`);
  failures.forEach((item) => console.log(`- ${item}`));
}
if (failures.length) process.exit(1);
