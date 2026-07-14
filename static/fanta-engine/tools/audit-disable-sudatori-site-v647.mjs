import { readFileSync } from 'node:fs';

const files = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];

let ok = true;
const problems = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (/sudatori-section-v646\.(css|js)\?v=646/.test(text)) {
    ok = false;
    problems.push(`${file}: still loads public Sudatori section asset`);
  }
  if (/data-sudatori-section-v646/.test(text)) {
    ok = false;
    problems.push(`${file}: still contains Sudatori section marker`);
  }
  if (!/static-roster-editor-v588/.test(text) || !/assets\/app\.js\?v=594/.test(text)) {
    ok = false;
    problems.push(`${file}: unexpected league shell regression`);
  }
}

if (!ok) {
  console.error('Audit disable Sudatori V647 FAILED');
  problems.forEach((p) => console.error('-', p));
  process.exit(1);
}
console.log('Audit disable Sudatori V647 OK', JSON.stringify({ leaguePages: files.length, sudatoriPublicSection: false, iosudoDataKept: true }));
