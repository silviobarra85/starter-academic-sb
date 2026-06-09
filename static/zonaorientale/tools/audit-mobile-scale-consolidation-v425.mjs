#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error(`[V425] ${message}`);
  process.exitCode = 1;
};
const pass = (message) => {
  if (!quiet) console.log(`[V425] ${message}`);
};
const expectIncludes = (content, needle, label) => {
  if (!content.includes(needle)) fail(`${label}: missing ${needle}`);
};

const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const app = read('assets/app.js');
const mobileCss = read('assets/css/refactor/mobile-controls.css');
const check = read('tools/check-zonaorientale.sh');

for (const [file, content] of [['index.html', index], ['competition.html', competition], ['player.html', player]]) {
  if (!content.match(/\?v=(42[5-9]|4[3-9][0-9])/)) fail(`${file}: cache-buster V425+ mancante`);
  if (!content.match(/V42[5-9]|V4[3-9][0-9]/)) fail(`${file}: footer V425+ mancante`);
  if (content.includes('?v=424')) fail(`${file}: stale cache-buster ?v=424`);
}

if (!app.match(/DEPLOY_EXPECTED_VERSION_V181 = \"(42[5-9]|4[3-9][0-9])\"/)) fail('app deploy version V425+ mancante');
expectIncludes(app, 'ZonaOrientaleMobileTypographyV425', 'app V425 marker');
expectIncludes(app, 'canonicalScale', 'app V425 canonical scale marker');
if (app.includes('DEPLOY_EXPECTED_VERSION_V181 = "424"')) fail('app.js: stale deploy version 424');

for (const token of [
  '--zo-mobile-canonical-title-v425',
  '--zo-mobile-canonical-text-v425',
  '--zo-mobile-canonical-meta-v425',
  '--zo-mobile-canonical-label-v425',
  '.archive-season-subcard',
  '.teamarea-card',
  '.admin-card',
  '.team-profile-roster-table td:first-child'
]) {
  expectIncludes(mobileCss, token, 'mobile CSS V425');
}

for (const literal of ['0.78rem', '0.73rem', '0.66rem', '0.62rem']) {
  expectIncludes(mobileCss, literal, `mobile CSS scale ${literal}`);
}

expectIncludes(check, 'audit-mobile-scale-consolidation-v425.mjs', 'check-zonaorientale V425 gate');

if (!process.exitCode) pass('consolidamento scala mobile V425 verificato');
