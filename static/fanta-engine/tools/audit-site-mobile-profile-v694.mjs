import fs from 'node:fs';
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  const index = fs.readFileSync(`static/${league}/index.html`, 'utf8');
  const app = fs.readFileSync(`static/${league}/assets/app.js`, 'utf8');
  if (!index.includes('site-performance-v694.css?v=694')) throw new Error(`${league}: css non V694`);
  if (!index.includes('./assets/app.js?v=694')) throw new Error(`${league}: app cache-buster non V694`);
  if (!index.includes('Fantacalcio - V694 - Aggiornato al 16/07/2026')) throw new Error(`${league}: footer index non V694`);
  if (!app.includes('fantaSiteProfileMovementsV694')) throw new Error(`${league}: patch movimenti V694 assente`);
  if (!app.includes('site-mobile-profile-movement-card-v694')) throw new Error(`${league}: card profilo V694 assente`);
}
console.log('Audit site mobile profile V694 OK');
