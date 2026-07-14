#!/usr/bin/env node
import fs from 'node:fs';

const dataFiles = [
  'static/fanta-engine/data/sudatori/current/manifest.json',
  'static/fanta-engine/data/sudatori/current/sudatori-data.json'
];

const leaguePages = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];

const missingData = dataFiles.filter((file) => !fs.existsSync(file));
let publicSectionEnabled = false;

for (const page of leaguePages) {
  if (!fs.existsSync(page)) continue;
  const html = fs.readFileSync(page, 'utf8');
  if (/sudatori-section-v\d+\.(?:js|css)/.test(html)) {
    publicSectionEnabled = true;
  }
}

console.log('Audit Sudatori V662 OK', JSON.stringify({
  compatibilityAudit: true,
  dataChecked: missingData.length === 0,
  missingData,
  publicSectionEnabled
}));
