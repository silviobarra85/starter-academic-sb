const TEMPLATE_LEAGUE_SLUG = '__LEAGUE_SLUG__';
const CONFIG_URL = './assets/league-config.json?v=__CACHE_VERSION__';

async function initTemplateLeagueV507() {
  const banner = document.createElement('div');
  banner.style.cssText = 'max-width:960px;margin:0 auto 24px;padding:12px 24px;border-radius:14px;background:#fff7d6;border:1px solid #f3d67a;color:#5b4700';
  banner.setAttribute('data-template-warning-v507', 'true');
  try {
    const response = await fetch(CONFIG_URL, { cache: 'no-store' });
    const config = await response.json();
    const checklist = config?.templateHardening?.checklistRequired ? ' Checklist V507 obbligatoria.' : '';
    banner.textContent = `${config.name} e' una lega generata da template V507. Completa configurazione, dati, Firebase, EmailJS, Netlify e audit prima della pubblicazione.${checklist}`;
  } catch (error) {
    banner.textContent = `Template V507 (${TEMPLATE_LEAGUE_SLUG}): configurazione non ancora disponibile o non valida.`;
  }
  document.body.insertBefore(banner, document.querySelector('main'));
}

initTemplateLeagueV507();
