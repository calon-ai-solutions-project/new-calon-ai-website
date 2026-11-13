// Builds integration logo SVGs (Simple Icons, CC0 / SVG Logos by Gil Barbara, CC0)
// into project/assets/integrations and prints the About page "Built around your stack" grid.
import * as si from 'simple-icons';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const L = require('@iconify-json/logos/icons.json');

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const siBySlug = new Map(Object.values(si).filter(x => x && x.slug).map(x => [x.slug, x]));

function fromSI(slug) {
  const i = siBySlug.get(slug);
  if (!i) throw new Error('simple-icons missing ' + slug);
  let svg = i.svg.replace('<svg ', `<svg fill="#${i.hex}" `).replace(/<title>.*?<\/title>/, '');
  // Typeform's mark is a wordmark that fills only a thin band of the 24x24 canvas: crop it to that band.
  if (slug === 'typeform') return { svg: svg.replace('viewBox="0 0 24 24"', 'viewBox="0 9.2 24 5.6"'), w: 240, h: 56 };
  return { svg, w: 24, h: 24 };
}
function fromLogos(key) {
  const ic = L.icons[key];
  if (!ic) throw new Error('logos missing ' + key);
  const w = ic.width || L.width, h = ic.height || L.height;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${ic.body}</svg>`, w, h };
}

// [name, source, key, suffix]  — source: 'si' | 'logos' | null (no verified logo: keep the name)
const CATS = [
  ['Field &amp; job management', [
    ['Joblogic', 'file', 'brand-joblogic.png'], ['ServiceM8', 'file', 'brand-servicem8.png'],
    ['Simpro', 'file', 'brand-simpro.png'], ['BigChange'], ['Tradify', 'file', 'brand-tradify.png'],
    ['Commusoft', 'file', 'brand-commusoft.png'], ['Fergus'],
    ['FieldAware'], ['Klipboard'], ['Procore'], ['Buildertrend']]],
  ['Accounting &amp; finance', [
    ['Xero', 'logos', 'xero'], ['QuickBooks', 'si', 'quickbooks'], ['Sage 50', 'si', 'sage', '50'],
    ['Sage 200', 'si', 'sage', '200'], ['FreeAgent']]],
  ['CRM &amp; sales', [
    ['HubSpot', 'si', 'hubspot'], ['Pipedrive', 'logos', 'pipedrive'], ['Salesforce', 'logos', 'salesforce'],
    ['Monday', 'logos', 'monday-icon'], ['Zoho CRM', 'logos', 'zoho', 'CRM']]],
  ['Learning &amp; training', [
    ['Moodle', 'si', 'moodle'], ['TalentLMS'], ['Tutor LMS'], ['Thinkific']]],
  ['Marketing &amp; lead', [
    ['Mailchimp', 'logos', 'mailchimp-freddie'], ['ActiveCampaign'], ['HubSpot Marketing', 'si', 'hubspot', 'Marketing'],
    ['Google Ads', 'logos', 'google-ads']]],
  ['Forms &amp; onboarding', [
    ['Typeform', 'si', 'typeform'], ['Jotform'], ['Microsoft Forms']]],
  ['Documents &amp; comms', [
    ['SharePoint'], ['Microsoft 365'], ['Google Workspace', 'logos', 'google-workspace'], ['Dropbox', 'logos', 'dropbox'],
    ['Microsoft Teams', 'logos', 'microsoft-teams'], ['WhatsApp Business', 'logos', 'whatsapp-icon', 'Business'],
    ['Slack', 'logos', 'slack-icon', null, true], ['Gmail', 'logos', 'google-gmail', null, true],
    ['Google Drive', 'logos', 'google-drive', null, true], ['Notion', 'logos', 'notion-icon', null, true],
    ['Twilio', 'logos', 'twilio-icon', null, true]]],
  ['Reporting &amp; BI', [
    ['Power BI', 'logos', 'microsoft-power-bi'], ['Tableau', 'logos', 'tableau-icon'], ['Looker Studio'],
    ['Google Sheets', 'si', 'googlesheets', null, true], ['Airtable', 'logos', 'airtable', null, true],
    ['Google Analytics', 'logos', 'google-analytics', null, true]]],
  ['Automation &amp; AI', [
    ['Zapier', 'logos', 'zapier-icon', null, true], ['Make', 'si', 'make', null, true], ['n8n', 'si', 'n8n', null, true],
    ['OpenAI', 'logos', 'openai-icon', null, true], ['Claude', 'logos', 'claude-icon', null, true]]],
  ['Payments &amp; scheduling', [
    ['Stripe', 'logos', 'stripe', null, true], ['Calendly', 'si', 'calendly', null, true],
    ['Google Calendar', 'logos', 'google-calendar', null, true]]],
];

const slugify = s => s.toLowerCase().replace(/&amp;/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const written = new Set();
let html = '', count = { logo: 0, text: 0, added: 0 };
for (const [cat, items] of CATS) {
  html += `        <div class="ig-cat"><p class="ig-label">${cat}</p><div class="ig-row">`;
  for (const [name, src, key, suffix, added] of items) {
    if (added) count.added++;
    const label = name.replace(/&/g, '&amp;');
    if (!src) {
      count.text++;
      html += `<span class="ig ig-text" tabindex="0" data-name="${label}"><span>${label}</span></span>`;
      continue;
    }
    let file, w, h;
    if (src === 'file') {
      // official logo supplied by Calon (already trimmed PNG in the output folder)
      file = key;
      const buf = fs.readFileSync(path.join(OUT, file));
      w = buf.readUInt32BE(16); h = buf.readUInt32BE(20);
      written.add(file);
    } else {
      let svg; ({ svg, w, h } = src === 'si' ? fromSI(key) : fromLogos(key));
      file = `${src === 'si' ? 'si' : 'lg'}-${key}.svg`;
      if (!written.has(file)) { fs.writeFileSync(path.join(OUT, file), svg + '\n'); written.add(file); }
    }
    const wide = w / h > 1.6 ? ' ig-wide' : '';
    count.logo++;
    html += `<span class="ig${wide}${suffix ? ' ig-suf' : ''}" tabindex="0" data-name="${label}"><img src="assets/integrations/${file}" alt="${label}" width="${Math.round(w)}" height="${Math.round(h)}" loading="lazy" decoding="async">${suffix ? `<b>${suffix}</b>` : ''}</span>`;
  }
  html += `</div></div>\n`;
}
fs.writeFileSync(process.argv[3], html);
console.log(count, 'files', written.size);
