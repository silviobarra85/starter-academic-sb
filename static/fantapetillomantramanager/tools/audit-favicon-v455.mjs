import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const root = path.resolve(process.cwd());
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
const checks = [];
function check(label, ok) { checks.push({ label, ok: Boolean(ok) }); }

const pages = ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html'];
for (const page of pages) {
  const html = read(page);
  check(`${page} usa favicon PNG cache-proof V455`, html.includes('fantapetillo-favicon-v455-32.png?v=456'));
  check(`${page} usa apple touch cache-proof V455`, html.includes('fantapetillo-apple-touch-icon-v455.png?v=456'));
}
check('favicon 32 V455 presente', exists('assets/icons/fantapetillo-favicon-v455-32.png'));
check('favicon 16 V455 presente', exists('assets/icons/fantapetillo-favicon-v455-16.png'));
check('apple touch V455 presente', exists('assets/icons/fantapetillo-apple-touch-icon-v455.png'));
check('manifest usa icone cache-proof', read('site.webmanifest').includes('fantapetillo-android-chrome-512-v455.png'));

const failed = checks.filter((item) => !item.ok);
if (!quiet) checks.forEach((item) => console.log(`${item.ok ? 'OK' : 'FAIL'} ${item.label}`));
if (failed.length) {
  console.error(`Audit favicon FantaPetillo V455 fallito: ${failed.map((item) => item.label).join('; ')}`);
  process.exit(1);
}
