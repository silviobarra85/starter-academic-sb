#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const BASE_URL = (process.env.FANTA_BASE_URL || 'http://127.0.0.1:1313').replace(/\/+$/, '');
const SITE_PREFIX_RAW = process.env.FANTA_SITE_PREFIX || '';
const SITE_PREFIX = SITE_PREFIX_RAW ? `/${SITE_PREFIX_RAW.replace(/^\/+|\/+$/g, '')}` : '';
const EXPECTED_VERSION = 'V508';
const HEADLESS = !process.argv.includes('--headed');
const MOBILE_ONLY = process.argv.includes('--mobile-only');
const DESKTOP_ONLY = process.argv.includes('--desktop-only');
const REPORT_DIR_ARG = process.argv.find((arg) => arg.startsWith('--report-dir='));
const REPORT_DIR = REPORT_DIR_ARG ? REPORT_DIR_ARG.split('=').slice(1).join('=') : 'static/fanta-engine/reports';

const pages = [
  { id: 'zona-home', path: '/zonaorientale/', brand: 'ZonaOrientale Salerno', checks: ['menu', 'footer', 'assets'] },
  { id: 'zona-competition', path: '/zonaorientale/competition.html', brand: 'ZonaOrientale Salerno', checks: ['footer', 'assets'] },
  { id: 'zona-player', path: '/zonaorientale/player.html', brand: 'ZonaOrientale Salerno', checks: ['footer', 'assets'] },
  { id: 'fmm-home', path: '/fantapetillomantramanager/', brand: 'FantaMantraManager', checks: ['menu', 'footer', 'assets'] },
  { id: 'fmm-competition', path: '/fantapetillomantramanager/competition.html', brand: 'FantaMantraManager', checks: ['footer', 'assets'] },
  { id: 'fmm-player', path: '/fantapetillomantramanager/player.html', brand: 'FantaMantraManager', checks: ['footer', 'assets'] },
  { id: 'fmm-news', path: '/fantapetillomantramanager/news.html', brand: 'FantaMantraManager', checks: ['assets'], expectFooterVersion: false },
  { id: 'fmm-bilanci', path: '/fantapetillomantramanager/bilanci.html', brand: 'FantaMantraManager', checks: ['assets'], expectFooterVersion: false }
];

const viewports = [
  { id: 'mobile', width: 390, height: 844, isMobile: true },
  { id: 'desktop', width: 1366, height: 900, isMobile: false }
].filter((item) => {
  if (MOBILE_ONLY) return item.id === 'mobile';
  if (DESKTOP_ONLY) return item.id === 'desktop';
  return true;
});

function buildUrl(pagePath) {
  return `${BASE_URL}${SITE_PREFIX}${pagePath}`;
}

function isIgnorableConsoleError(message) {
  const text = String(message || '');
  return [
    'favicon.ico',
    'ResizeObserver loop completed with undelivered notifications',
    'NetworkError when attempting to fetch resource',
    'Failed to load resource: the server responded with a status of 404 (Not Found) favicon'
  ].some((needle) => text.includes(needle));
}

function shouldIgnoreFailedRequest(url) {
  return String(url || '').includes('favicon.ico');
}

async function safeCount(page, selector) {
  try { return await page.locator(selector).count(); } catch { return 0; }
}

async function checkPage({ page, item, viewport, response, pageFailures }) {
  if (!response) pageFailures.push('nessuna response principale');
  else if (response.status() >= 400) pageFailures.push(`response principale HTTP ${response.status()}`);

  const title = await page.title();
  if (!title || !title.trim()) pageFailures.push('title vuoto');

  const bodyText = await page.locator('body').innerText({ timeout: 7000 }).catch(() => '');
  if (!bodyText.trim()) pageFailures.push('body vuoto');
  if (item.expectFooterVersion !== false && !bodyText.includes(EXPECTED_VERSION)) pageFailures.push(`footer/versione ${EXPECTED_VERSION} non trovata`);
  if (!bodyText.includes(item.brand)) pageFailures.push(`brand ${item.brand} non trovato`);

  const assetCount = await safeCount(page, 'script[src],link[href],img[src]');
  if (assetCount < 3) pageFailures.push('pochi asset rilevati nella pagina');

  if (item.checks.includes('menu')) {
    const navCount = await safeCount(page, 'nav, [role="navigation"], .bottom-nav, .mobile-bottom-nav, [data-mobile-nav], [data-league-nav]');
    if (navCount < 1) pageFailures.push(`navigazione non rilevata (${viewport.id})`);
  }

  if (item.path.endsWith('/')) {
    const hasListoneText = /listone|calciomercato|fantamercato/i.test(bodyText);
    if (!hasListoneText) pageFailures.push('home senza riferimenti listone/calciomercato/fantamercato');
  }
}

function toMarkdownReport({ results, startedAt, endedAt, okCount, failCount }) {
  const lines = [];
  lines.push(`# Playwright smoke V508`);
  lines.push('');
  lines.push(`- Avvio: ${startedAt}`);
  lines.push(`- Fine: ${endedAt}`);
  lines.push(`- Base URL: ${BASE_URL}`);
  lines.push(`- Site prefix: ${SITE_PREFIX || '(nessuno)'}`);
  lines.push(`- Esito: ${okCount} OK, ${failCount} FAIL`);
  lines.push('');
  lines.push('| Viewport | Pagina | Esito | Dettagli |');
  lines.push('|---|---|---:|---|');
  for (const item of results) {
    const details = item.failures.length ? item.failures.join('<br>') : 'OK';
    lines.push(`| ${item.viewport} | ${item.page} | ${item.failures.length ? 'FAIL' : 'OK'} | ${details.replace(/\|/g, '\\|')} |`);
  }
  lines.push('');
  lines.push('Note: il test non fa login, non invia EmailJS e non scrive Firebase.');
  return `${lines.join('\n')}\n`;
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    console.error('Playwright non e installato in questo ambiente.');
    console.error('Installa localmente con: npm install -D playwright && npx playwright install chromium');
    console.error('Poi esegui: FANTA_BASE_URL=http://127.0.0.1:1313 node static/fanta-engine/tools/playwright-smoke-v508.mjs');
    process.exit(2);
  }

  const startedAt = new Date().toISOString();
  const browser = await chromium.launch({ headless: HEADLESS });
  const results = [];
  let okCount = 0;
  let failCount = 0;

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.isMobile });
    for (const item of pages) {
      const url = buildUrl(item.path);
      const page = await context.newPage();
      const pageFailures = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error' && !isIgnorableConsoleError(msg.text())) pageFailures.push(`console error: ${msg.text()}`);
      });
      page.on('pageerror', (err) => pageFailures.push(`pageerror: ${err.message}`));
      page.on('requestfailed', (request) => {
        if (!shouldIgnoreFailedRequest(request.url())) pageFailures.push(`request failed: ${request.url()} ${request.failure()?.errorText || ''}`);
      });
      page.on('response', (res) => {
        const status = res.status();
        if (status >= 400 && !shouldIgnoreFailedRequest(res.url())) pageFailures.push(`HTTP ${status}: ${res.url()}`);
      });

      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => undefined);
        await page.waitForTimeout(600);
        await checkPage({ page, item, viewport, response, pageFailures });
      } catch (error) {
        pageFailures.push(error.message || String(error));
      } finally {
        await page.close();
      }

      if (pageFailures.length) {
        failCount += 1;
        console.error(`FAIL - ${viewport.id} ${item.id} ${url}`);
        for (const failure of pageFailures) console.error(`  - ${failure}`);
      } else {
        okCount += 1;
        console.log(`OK  - ${viewport.id} ${item.id} ${url}`);
      }
      results.push({ viewport: viewport.id, page: item.id, url, failures: pageFailures });
    }
    await context.close();
  }

  await browser.close();
  const endedAt = new Date().toISOString();
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const reportBase = path.join(REPORT_DIR, `playwright-smoke-v508-${startedAt.replace(/[:.]/g, '-')}`);
  fs.writeFileSync(`${reportBase}.json`, JSON.stringify({ version: 'V508', baseUrl: BASE_URL, sitePrefix: SITE_PREFIX, startedAt, endedAt, okCount, failCount, results }, null, 2));
  fs.writeFileSync(`${reportBase}.md`, toMarkdownReport({ results, startedAt, endedAt, okCount, failCount }));
  console.log(`\nReport scritto in: ${reportBase}.md`);

  if (failCount > 0) {
    console.error(`\nPlaywright smoke V508 fallito: ${okCount} OK, ${failCount} FAIL`);
    process.exit(1);
  }
  console.log(`\nPlaywright smoke V508 completato: ${okCount} OK, 0 FAIL`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
