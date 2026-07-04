#!/usr/bin/env node
import process from 'node:process';

const BASE_URL = (process.env.FANTA_BASE_URL || 'http://127.0.0.1:1313').replace(/\/+$/, '');
const SITE_PREFIX_RAW = process.env.FANTA_SITE_PREFIX || '';
const SITE_PREFIX = SITE_PREFIX_RAW ? `/${SITE_PREFIX_RAW.replace(/^\/+|\/+$/g, '')}` : '';
const HEADLESS = !process.argv.includes('--headed');
const EXPECTED_VERSION = 'V503';

const pages = [
  { id: 'zona-home', path: '/zonaorientale/', brand: 'ZonaOrientale Salerno' },
  { id: 'zona-competition', path: '/zonaorientale/competition.html', brand: 'ZonaOrientale Salerno' },
  { id: 'zona-player', path: '/zonaorientale/player.html', brand: 'ZonaOrientale Salerno' },
  { id: 'fmm-home', path: '/fantapetillomantramanager/', brand: 'FantaMantraManager' },
  { id: 'fmm-competition', path: '/fantapetillomantramanager/competition.html', brand: 'FantaMantraManager' },
  { id: 'fmm-player', path: '/fantapetillomantramanager/player.html', brand: 'FantaMantraManager' },
  { id: 'fmm-news', path: '/fantapetillomantramanager/news.html', brand: 'FantaMantraManager', expectFooterVersion: false },
  { id: 'fmm-bilanci', path: '/fantapetillomantramanager/bilanci.html', brand: 'FantaMantraManager', expectFooterVersion: false }
];

function buildUrl(path) {
  return `${BASE_URL}${SITE_PREFIX}${path}`;
}

function isIgnorableConsoleError(message) {
  const text = String(message || '');
  return [
    'favicon.ico',
    'ResizeObserver loop completed with undelivered notifications'
  ].some((needle) => text.includes(needle));
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    console.error('Playwright non e installato in questo ambiente.');
    console.error('Installa localmente con: npm init playwright@latest');
    console.error('Poi esegui di nuovo questo script.');
    process.exit(2);
  }

  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const failures = [];
  let ok = 0;

  for (const item of pages) {
    const url = buildUrl(item.path);
    const page = await context.newPage();
    const pageFailures = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' && !isIgnorableConsoleError(msg.text())) {
        pageFailures.push(`console error: ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => pageFailures.push(`pageerror: ${err.message}`));
    page.on('requestfailed', (request) => pageFailures.push(`request failed: ${request.url()} ${request.failure()?.errorText || ''}`));
    page.on('response', (response) => {
      const status = response.status();
      if (status >= 400) pageFailures.push(`HTTP ${status}: ${response.url()}`);
    });

    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response) pageFailures.push('nessuna response principale');
      else if (response.status() >= 400) pageFailures.push(`response principale HTTP ${response.status()}`);
      await page.waitForTimeout(1200);
      const title = await page.title();
      if (!title || !title.trim()) pageFailures.push('title vuoto');
      const bodyText = await page.locator('body').innerText({ timeout: 5000 });
      if (item.expectFooterVersion !== false && !bodyText.includes(EXPECTED_VERSION)) pageFailures.push(`footer/versione ${EXPECTED_VERSION} non trovata`);
      if (!bodyText.includes(item.brand)) pageFailures.push(`brand ${item.brand} non trovato`);
      const assetCount = await page.locator('script[src],link[href],img[src]').count();
      if (assetCount < 3) pageFailures.push('pochi asset rilevati nella pagina');
    } catch (error) {
      pageFailures.push(error.message || String(error));
    } finally {
      await page.close();
    }

    if (pageFailures.length) {
      failures.push({ page: item.id, url, failures: pageFailures });
      console.error(`FAIL - ${item.id} ${url}`);
      for (const failure of pageFailures) console.error(`  - ${failure}`);
    } else {
      ok += 1;
      console.log(`OK  - ${item.id} ${url}`);
    }
  }

  await browser.close();

  if (failures.length) {
    console.error(`\nPlaywright smoke V503 fallito: ${ok} OK, ${failures.length} FAIL`);
    process.exit(1);
  }
  console.log(`\nPlaywright smoke V503 completato: ${ok} OK, 0 FAIL`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
