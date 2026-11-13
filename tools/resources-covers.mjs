// Renders the Resources cover images (editorial illustrations in Calon AI's brand style).
//   node tools/resources-covers.mjs [slug ...]
// Needs Playwright with Chromium (set PW_CHROMIUM to a Chromium binary if it is not the default).
// Writes content/resources/img/<cover>.webp (1200x630), <cover>-sm.webp (640x336) and <cover>.jpg (Open Graph).
// Add a COVERS entry for each new article; the motif decides the illustration.
import fs from 'fs';
import path from 'path';
import url from 'url';
import http from 'http';
import { createRequire } from 'module';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = createRequire(path.join(process.cwd(), 'x.js'))('playwright')); }
const OUT = path.join(REPO, 'content', 'resources', 'img');
fs.mkdirSync(OUT, { recursive: true });

const L = (f) => `/assets/integrations/${f}`;
export const COVERS = {
  'chatgpt-not-working': { kicker: 'Troubleshooting', h: 'ChatGPT not working?', motif: 'error', logo: L('lg-openai-icon.svg'), app: 'ChatGPT', err: 'Something went wrong. Please try again.', checks: ['Check status page', 'Refresh and start a new chat', 'Turn off VPN', 'Log out and back in', 'Try another network'] },
  'claude-errors-fixes': { kicker: 'Troubleshooting', h: 'Claude errors, explained', motif: 'error', logo: L('lg-claude-icon.svg'), app: 'Claude', err: '5-hour limit reached - resets 3:00 PM', checks: ['Usage limits', 'Length limit', 'Capacity', 'Login errors', 'Outages'] },
  'how-to-use-chatgpt': { kicker: 'Beginner guide', h: 'How to use ChatGPT for work', motif: 'chat', logo: L('lg-openai-icon.svg') },
  'prompt-engineering-guide': { kicker: 'Tutorial', h: 'Write better AI prompts', motif: 'prompt' },
  'how-to-use-claude': { kicker: 'Beginner guide', h: 'How to use Claude', motif: 'artifact', logo: L('lg-claude-icon.svg') },
  'claude-vs-chatgpt': { kicker: 'Comparison', h: 'Claude vs ChatGPT for business', motif: 'versus', a: L('lg-claude-icon.svg'), b: L('lg-openai-icon.svg'), an: 'Claude', bn: 'ChatGPT' },
  'claude-code-getting-started': { kicker: 'Tutorial', h: 'Getting started with Claude Code', motif: 'terminal', logo: L('lg-claude-icon.svg') },
  'zapier-vs-make-vs-n8n': { kicker: 'Comparison', h: 'Zapier vs Make vs n8n', motif: 'flows', logos: [[L('lg-zapier-icon.svg'), 'Zapier'], [L('si-make.svg'), 'Make'], [L('si-n8n.svg'), 'n8n']] },
  'connect-business-apps': { kicker: 'How-to guide', h: 'Connect your business apps', motif: 'connect', a: L('si-hubspot.svg'), b: L('lg-xero.svg') },
  'automate-repetitive-business-tasks': { kicker: 'Guide', h: 'Automate the repetitive work', motif: 'pipeline' },
  'ai-customer-support-small-business': { kicker: 'Guide', h: 'AI customer support, done well', motif: 'support', logos: [L('lg-google-gmail.svg'), L('lg-whatsapp-icon.svg'), L('lg-slack-icon.svg')] },
  'ai-data-privacy-uk-business': { kicker: 'Safety & privacy', h: 'AI and company data: the UK rules', motif: 'shield' },
  'claude-fable-5-2-mythos-5-2': { kicker: 'AI news', h: 'Claude Fable 5.2 and Mythos 5.2', motif: 'news', logo: L('lg-claude-icon.svg'), date: '9 November 2026', items: ['Up to 30% faster outputs', 'Fable for everyone, Mythos for vetted teams', '$8 / $40 per million tokens'] },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function art(c) {
  switch (c.motif) {
    case 'error': return `<div class="win"><div class="bar"><i></i><i></i><i></i><span><img src="${c.logo}">${esc(c.app)}</span></div>
      <div class="msg u">Can you summarise this contract for me?</div>
      <div class="alert"><b>!</b>${esc(c.err)}</div>
      <div class="msg ai ghost"></div></div>
      <div class="check">${c.checks.map((x, i) => `<p class="${i < 3 ? 'on' : ''}"><span>${i < 3 ? tick : ''}</span>${esc(x)}</p>`).join('')}</div>`;
    case 'chat': return `<div class="win big"><div class="bar"><i></i><i></i><i></i><span><img src="${c.logo}">ChatGPT</span></div>
      <div class="msg u">Draft a polite follow-up to a customer whose quote expires on Friday. Under 100 words, UK spelling.</div>
      <div class="msg ai"><b>Subject: Your quote is still available until Friday</b><br>Hi Sarah, just a quick note that the quote we sent for your new boiler is valid until Friday…</div>
      <div class="input"><span class="clip">+</span>Ask anything<span class="send">↑</span></div></div>
      <div class="tag t1">Context</div><div class="tag t2">Clear task</div><div class="tag t3">Upload files</div>`;
    case 'prompt': return `<div class="stack">${[['Context', 'Who it is for and why'], ['Task', 'Exactly what to produce'], ['Material', 'Paste or attach the source'], ['Constraints', 'Tone, length, what to avoid'], ['Format', 'Bullets, table, one page']].map(([a, b], i) => `<div class="blk" style="--i:${i}"><b>${a}</b><span>${b}</span></div>`).join('')}</div>`;
    case 'artifact': return `<div class="win big split"><div class="bar"><i></i><i></i><i></i><span><img src="${c.logo}">Claude</span></div>
      <div class="cols"><div class="left"><div class="msg u">Turn these notes into a one-page onboarding checklist.</div><div class="msg ai">Here is your checklist. I have grouped it by first day, first week and first month.</div><div class="proj"><small>Project</small>New starter onboarding<em>3 files · instructions</em></div></div>
      <div class="doc"><small>Artifact</small><h4>Onboarding checklist</h4>${['Day one: IT access and safety induction', 'Week one: shadow two jobs', 'Month one: first solo visit'].map((x) => `<p><span>${tick}</span>${x}</p>`).join('')}<div class="lines"><i></i><i></i><i></i></div></div></div></div>`;
    case 'versus': return `<div class="vs"><div class="side"><div class="lg"><img src="${c.a}"></div><b>${c.an}</b>${[86, 92, 74].map((w, i) => `<div class="meter"><span style="width:${w}%"></span></div>`).join('')}</div>
      <div class="v">VS</div>
      <div class="side"><div class="lg"><img src="${c.b}"></div><b>${c.bn}</b>${[90, 78, 88].map((w) => `<div class="meter"><span style="width:${w}%"></span></div>`).join('')}</div></div>`;
    case 'terminal': return `<div class="term"><div class="bar"><i></i><i></i><i></i><span>~/projects/invoices</span></div><pre><span class="p">$</span> curl -fsSL https://claude.ai/install.sh | bash
<span class="p">$</span> cd invoices &amp;&amp; claude
<span class="cm">&gt;</span> change invoice dates to UK format and add a test
<span class="d">● Plan</span>  update formatDate() · add test · run suite
<span class="g">  ✓ src/format.ts</span>   <span class="g">+4 −2</span>
<span class="g">  ✓ tests/format.test.ts</span>  <span class="g">+18</span>
<span class="ok">  ✓ 42 tests passed</span></pre></div>`;
    case 'flows': return `<div class="flows">${c.logos.map(([src, n], k) => `<div class="flow"><div class="fh"><img src="${src}">${n}</div><div class="nodes">${[0, 1, 2].map((i) => `<span class="nd${i === 1 && k === 1 ? ' br' : ''}"></span>`).join('<i></i>')}</div></div>`).join('')}</div>`;
    case 'connect': return `<div class="conn"><div class="app"><img src="${c.a}"></div><div class="wire"><span class="pill">Webhook</span><span class="dot"></span><span class="pill">API</span></div><div class="app"><img src="${c.b}"></div></div><div class="legend">${['Trigger', 'Map fields', 'Find or create', 'Notify'].map((x) => `<span>${x}</span>`).join('')}</div>`;
    case 'pipeline': return `<div class="pipe"><div class="todo">${['Log new enquiries', 'Chase missing documents', 'Check timesheets', 'Send quote follow-ups', 'Build Monday report', 'Book reminders'].map((x) => `<p>${x}</p>`).join('')}</div>
      <div class="engine"><span>Workflow</span><b>+ AI</b></div>
      <div class="done">${['Enquiries logged', 'Documents chased', 'Report ready'].map((x) => `<p><span>${tick}</span>${x}</p>`).join('')}</div></div>`;
    case 'support': return `<div class="sup"><div class="in">${c.logos.map((src, i) => `<div class="m"><img src="${src}"><i style="width:${[70, 54, 62][i]}%"></i></div>`).join('')}</div>
      <div class="hub">AI<br><small>triage</small></div>
      <div class="lanes"><p class="l1">Reply instantly</p><p class="l2">Route to team</p><p class="l3">Escalate to a person</p></div></div>`;
    case 'shield': return `<div class="priv"><div class="win"><div class="bar"><i></i><i></i><i></i><span>Business account</span></div>
      <div class="msg u">Summarise this complaint from <s>████████</s> at <s>██████████</s></div>
      <div class="msg ai">Summary: delayed install, customer wants a revised date…</div></div>
      <div class="shieldbig"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><rect x="9" y="10.5" width="6" height="5" rx="1"/><path d="M10.2 10.5V9a1.8 1.8 0 013.6 0v1.5"/></svg><p>UK GDPR</p></div></div>`;
    case 'news': return `<div class="news"><div class="nh"><img src="${c.logo}"><span>Anthropic</span><em>${esc(c.date)}</em></div><h3>Claude Fable 5.2<br><span>&amp; Mythos 5.2</span></h3>${c.items.map((x) => `<p><span></span>${esc(x)}</p>`).join('')}</div>`;
    default: return '';
  }
}

const CSS = `
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;font-family:'Inter Tight',system-ui,sans-serif;color:#fff;letter-spacing:-.015em}
.c{position:relative;width:1200px;height:630px;overflow:hidden;background:radial-gradient(70% 90% at 82% 30%,rgba(126,196,240,.24),transparent 70%),radial-gradient(50% 70% at 0% 100%,rgba(90,174,226,.14),transparent 70%),linear-gradient(160deg,#0E1B36,#0A1428 55%,#081022)}
.c::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(126,196,240,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(126,196,240,.06) 1px,transparent 1px);background-size:48px 48px;mask:radial-gradient(80% 80% at 70% 40%,#000,transparent)}
.txt{position:absolute;left:64px;top:64px;width:430px;z-index:2}
.k{display:inline-block;font-size:17px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#7EC4F0;border:1.5px solid rgba(126,196,240,.5);border-radius:999px;padding:8px 16px;margin-bottom:26px}
h1{font-size:58px;line-height:1.02;letter-spacing:-.045em;font-weight:600}
.brand{position:absolute;left:64px;bottom:54px;display:flex;align-items:center;gap:12px;font-size:22px;font-weight:500;z-index:2}
.brand span{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,#1d3a63,#0B1830 70%);border:1px solid rgba(126,196,240,.4)}.brand img{width:28px}.brand b{color:#7EC4F0;font-weight:500}
.art{position:absolute;left:540px;top:0;width:660px;height:630px;transform:translateY(56px)}
.win,.term{position:absolute;background:#F5F8FB;color:#0A1428;border-radius:22px;box-shadow:0 40px 90px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.2);overflow:hidden}
.bar{display:flex;align-items:center;gap:7px;padding:14px 18px;background:#E7EEF5;font-size:16px;font-weight:600;color:#30455C}.bar i{width:12px;height:12px;border-radius:50%;background:#C9D6E3}.bar span{display:flex;align-items:center;gap:8px;margin-left:12px}.bar img{width:22px;height:22px}
.msg{margin:16px 20px;padding:14px 16px;border-radius:16px;font-size:17px;line-height:1.4}.msg.u{margin-left:auto;max-width:78%;background:#0A1428;color:#fff;border-bottom-right-radius:4px;width:fit-content}.msg.ai{background:#fff;border:1px solid #DCE6EF;max-width:88%}.msg.ghost{height:46px;background:repeating-linear-gradient(90deg,#E8EEF4 0 60%,transparent 60% 100%);border:0;width:60%}
/* error */
.art .win{left:10px;top:110px;width:380px}.alert{display:flex;gap:12px;align-items:center;margin:8px 20px;padding:14px 16px;border-radius:14px;background:#FDECEC;color:#8E1F1F;font-size:16.5px;font-weight:600;line-height:1.3}.alert b{flex:none;width:28px;height:28px;border-radius:50%;background:#D93A3A;color:#fff;display:flex;align-items:center;justify-content:center}
.check{position:absolute;right:18px;top:270px;width:250px;padding:20px 20px 12px;border-radius:20px;background:rgba(17,28,51,.92);border:1px solid rgba(126,196,240,.35);box-shadow:0 30px 70px rgba(0,0,0,.5)}.check p{display:flex;align-items:center;gap:10px;font-size:16px;margin-bottom:12px;color:rgba(226,236,247,.75)}.check p span{flex:none;width:24px;height:24px;border-radius:7px;border:1.5px solid rgba(126,196,240,.5);display:flex;align-items:center;justify-content:center;color:#06101F}.check p.on{color:#fff}.check p.on span{background:#7EC4F0;border-color:#7EC4F0}.check svg{width:16px}
/* chat */
.win.big{left:40px;top:70px;width:560px}.input{display:flex;align-items:center;gap:12px;margin:18px 20px 20px;padding:12px 14px;border-radius:999px;border:1px solid #CFDCE8;color:#7A8CA0;font-size:17px;background:#fff}.clip{width:30px;height:30px;border-radius:50%;background:#EEF3F8;display:flex;align-items:center;justify-content:center;font-weight:600;color:#30455C}.send{margin-left:auto;width:34px;height:34px;border-radius:50%;background:#0A1428;color:#fff;display:flex;align-items:center;justify-content:center}
.tag{position:absolute;padding:9px 16px;border-radius:999px;background:#7EC4F0;color:#06101F;font-weight:700;font-size:16px;box-shadow:0 12px 30px rgba(0,0,0,.4)}.t1{left:6px;top:150px}.t2{right:22px;top:260px}.t3{left:30px;bottom:96px}
/* prompt */
.stack{position:absolute;left:70px;top:70px;width:520px}.blk{display:flex;align-items:baseline;gap:18px;margin-bottom:14px;padding:20px 24px;border-radius:18px;background:rgba(17,28,51,.9);border:1px solid rgba(126,196,240,.3);box-shadow:0 18px 40px rgba(0,0,0,.35);transform:translateX(calc(var(--i)*18px))}.blk b{width:150px;flex:none;font-size:22px;color:#7EC4F0}.blk span{font-size:19px;color:rgba(226,236,247,.85)}.blk:nth-child(2){background:#fff;border-color:#fff}.blk:nth-child(2) b{color:#1F6FA8}.blk:nth-child(2) span{color:#0A1428}
/* artifact */
.win.split{left:20px;top:80px;width:620px}.cols{display:flex}.left{width:50%}.left .msg.u{max-width:90%}.proj{margin:10px 20px 20px;padding:12px 14px;border-radius:14px;border:1px dashed #9FB6CB;font-size:16px;font-weight:600}.proj small,.doc small{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5D7A97;margin-bottom:4px;font-weight:600}.proj em{display:block;font-style:normal;font-weight:400;color:#5D7A97;font-size:14px;margin-top:4px}
.doc{width:50%;margin:16px 18px 20px 0;padding:18px;border-radius:16px;background:#fff;border:1px solid #DCE6EF;box-shadow:0 10px 30px rgba(10,20,40,.12)}.doc h4{font-size:20px;margin-bottom:12px}.doc p{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.35;margin-bottom:10px}.doc p span{flex:none;width:20px;height:20px;border-radius:6px;background:#7EC4F0;display:flex;align-items:center;justify-content:center;color:#06101F}.doc svg{width:13px}.lines i{display:block;height:9px;border-radius:5px;background:#E8EEF4;margin-top:9px}.lines i:nth-child(2){width:80%}.lines i:nth-child(3){width:55%}
/* versus */
.vs{position:absolute;left:30px;top:110px;width:600px;display:flex;align-items:center;gap:22px}.side{flex:1;padding:30px 26px;border-radius:24px;background:#F5F8FB;color:#0A1428;box-shadow:0 30px 70px rgba(0,0,0,.5)}.side .lg{width:84px;height:84px;border-radius:22px;background:#fff;border:1px solid #DCE6EF;display:flex;align-items:center;justify-content:center;margin-bottom:16px}.side .lg img{width:54px;height:54px}.side b{display:block;font-size:28px;margin-bottom:18px}.meter{height:12px;border-radius:6px;background:#E2EAF2;margin-top:12px;overflow:hidden}.meter span{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#5AAEE2,#7EC4F0)}.v{font-size:30px;font-weight:800;color:#7EC4F0}
/* terminal */
.term{left:30px;top:96px;width:610px;background:#060D1C;color:#DCE8F3;border:1px solid rgba(126,196,240,.3)}.term .bar{background:#0E1A33;color:rgba(226,236,247,.7)}.term .bar i{background:#2A3D5C}.term pre{padding:22px 24px 26px;font:17px/1.75 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre}.p{color:#7EC4F0}.term .cm{color:#E3A06D}.d{color:#E3A06D}.g{color:#7FD3A0}.ok{color:#7FD3A0;font-weight:700}
/* flows */
.flows{position:absolute;left:40px;top:96px;width:580px;display:flex;flex-direction:column;gap:22px}.flow{display:flex;align-items:center;gap:24px;padding:20px 24px;border-radius:20px;background:rgba(17,28,51,.92);border:1px solid rgba(126,196,240,.3);box-shadow:0 18px 40px rgba(0,0,0,.35)}.fh{width:150px;flex:none;display:flex;align-items:center;gap:12px;font-size:22px;font-weight:600}.fh img{width:40px;height:40px;padding:6px;border-radius:10px;background:#fff}.nodes{flex:1;display:flex;align-items:center}.nodes i{flex:1;height:3px;background:linear-gradient(90deg,#7EC4F0,rgba(126,196,240,.3))}.nd{width:46px;height:46px;border-radius:14px;background:#F5F8FB;box-shadow:0 0 0 4px rgba(126,196,240,.18)}.nd.br{border-radius:50%;background:#7EC4F0}
/* connect */
.conn{position:absolute;left:40px;top:150px;width:580px;display:flex;align-items:center}.app{width:150px;height:150px;flex:none;border-radius:34px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 70px rgba(0,0,0,.5)}.app img{width:86px;height:86px}.wire{flex:1;position:relative;height:150px;display:flex;align-items:center;justify-content:space-around}.wire::before{content:'';position:absolute;left:0;right:0;top:50%;height:4px;background:linear-gradient(90deg,#7EC4F0,#5AAEE2);box-shadow:0 0 18px rgba(126,196,240,.8)}.pill{position:relative;padding:8px 14px;border-radius:999px;background:#0E1A33;border:1.5px solid #7EC4F0;color:#7EC4F0;font-weight:700;font-size:15px}.dot{position:relative;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 0 20px #7EC4F0}
.legend{position:absolute;left:40px;top:370px;width:580px;display:flex;gap:10px}.legend span{flex:1;text-align:center;padding:12px 6px;border-radius:14px;background:rgba(17,28,51,.92);border:1px solid rgba(126,196,240,.3);font-size:16px;font-weight:600}
/* pipeline */
.pipe{position:absolute;left:20px;top:80px;width:620px;height:470px}.todo{position:absolute;left:0;top:0;width:220px;padding:16px;border-radius:20px;background:#F5F8FB;color:#0A1428;box-shadow:0 30px 70px rgba(0,0,0,.5)}.todo p{font-size:15.5px;padding:10px 10px;border-radius:10px;background:#fff;border:1px solid #DCE6EF;margin-bottom:8px}.engine{position:absolute;left:250px;top:150px;width:150px;height:150px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,#1d3a63,#0B1830 70%);border:2px solid #7EC4F0;box-shadow:0 0 50px rgba(126,196,240,.5);font-size:19px;font-weight:600}.engine b{color:#7EC4F0;font-size:24px}.pipe::before,.pipe::after{content:'';position:absolute;top:224px;height:4px;background:#7EC4F0;box-shadow:0 0 14px #7EC4F0}.pipe::before{left:220px;width:30px}.pipe::after{left:400px;width:30px}
.done{position:absolute;left:430px;top:110px;width:200px;padding:16px;border-radius:20px;background:rgba(17,28,51,.95);border:1px solid rgba(126,196,240,.4)}.done p{display:flex;gap:10px;align-items:center;font-size:16px;margin:8px 0}.done span{flex:none;width:24px;height:24px;border-radius:7px;background:#7EC4F0;color:#06101F;display:flex;align-items:center;justify-content:center}.done svg{width:15px}
/* support */
.sup{position:absolute;left:20px;top:120px;width:630px;display:flex;align-items:center;gap:26px}.in{width:220px;display:flex;flex-direction:column;gap:14px}.m{display:flex;align-items:center;gap:12px;padding:14px;border-radius:16px;background:#F5F8FB;box-shadow:0 18px 40px rgba(0,0,0,.4)}.m img{width:34px;height:34px}.m i{height:12px;border-radius:6px;background:#D5E0EB}.hub{flex:none;width:120px;height:120px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,#1d3a63,#0B1830 70%);border:2px solid #7EC4F0;box-shadow:0 0 50px rgba(126,196,240,.5);font-size:30px;font-weight:700;line-height:1}.hub small{font-size:15px;font-weight:500;color:#7EC4F0;margin-top:6px}.lanes{flex:1;display:flex;flex-direction:column;gap:14px}.lanes p{padding:16px 18px;border-radius:16px;font-size:18px;font-weight:600}.l1{background:#7EC4F0;color:#06101F}.l2{background:rgba(17,28,51,.95);border:1px solid rgba(126,196,240,.4)}.l3{background:#fff;color:#0A1428}
/* shield */
.priv .win{left:30px;top:120px;width:470px}.priv s{text-decoration:none;color:#0A1428;background:#0A1428;border-radius:4px}.msg.u s{background:#7EC4F0;color:#7EC4F0}.shieldbig{position:absolute;right:30px;top:290px;width:190px;padding:22px;border-radius:26px;background:rgba(17,28,51,.95);border:1px solid rgba(126,196,240,.45);text-align:center;color:#7EC4F0;box-shadow:0 30px 70px rgba(0,0,0,.5)}.shieldbig svg{width:110px}.shieldbig p{font-size:20px;font-weight:700;color:#fff;margin-top:6px}
/* news */
.news{position:absolute;left:40px;top:84px;width:570px;padding:34px 36px;border-radius:26px;background:#F5F8FB;color:#0A1428;box-shadow:0 40px 90px rgba(0,0,0,.55)}.nh{display:flex;align-items:center;gap:12px;font-weight:700;font-size:19px;margin-bottom:20px}.nh img{width:36px}.nh em{margin-left:auto;font-style:normal;font-weight:600;color:#1F6FA8;font-size:16px;padding:6px 12px;border-radius:999px;background:#E3F1FB}.news h3{font-size:46px;line-height:1.04;letter-spacing:-.04em;margin-bottom:22px}.news h3 span{color:#1F6FA8}.news p{display:flex;align-items:center;gap:12px;font-size:19px;margin-top:12px;color:#22364C}.news p span{width:10px;height:10px;border-radius:50%;background:#5AAEE2;flex:none}
`;

function html(c) {
  return `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><div class="c">
<div class="txt"><span class="k">${esc(c.kicker)}</span><h1>${esc(c.h)}</h1></div>
<div class="brand"><span><img src="/assets/calon-mark.png"></span>Calon <b>AI</b>&nbsp;<span style="width:auto;height:auto;border:0;background:none;color:rgba(226,236,247,.6);font-size:18px">Resources</span></div>
<div class="art ${c.motif === 'shield' ? 'priv' : ''}">${art(c)}</div></div></body></html>`;
}

// static server for /assets
const PROJECT = path.join(REPO, 'project');
const pages = new Map();
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  if (pages.has(p)) { res.setHeader('content-type', 'text/html'); return res.end(pages.get(p)); }
  const f = path.join(PROJECT, p);
  if (!f.startsWith(PROJECT) || !fs.existsSync(f)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', f.endsWith('.svg') ? 'image/svg+xml' : f.endsWith('.png') ? 'image/png' : 'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const only = process.argv.slice(2);
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const enc = await browser.newPage();
await enc.goto(base + '/assets/calon-mark.png');
for (const [slug, c] of Object.entries(COVERS)) {
  if (only.length && !only.includes(slug)) continue;
  pages.set(`/cover/${slug}`, html(c));
  await page.goto(`${base}/cover/${slug}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const png = (await page.screenshot({ type: 'png' })).toString('base64');
  const out = await enc.evaluate(async (b64) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const enc2 = (w, h, type, q) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, w, h); return cv.toDataURL(type, q).split(',')[1]; };
    return { lg: enc2(1200, 630, 'image/webp', 0.86), sm: enc2(640, 336, 'image/webp', 0.84), jpg: enc2(1200, 630, 'image/jpeg', 0.86) };
  }, png);
  fs.writeFileSync(path.join(OUT, `${slug}.webp`), Buffer.from(out.lg, 'base64'));
  fs.writeFileSync(path.join(OUT, `${slug}-sm.webp`), Buffer.from(out.sm, 'base64'));
  fs.writeFileSync(path.join(OUT, `${slug}.jpg`), Buffer.from(out.jpg, 'base64'));
  console.log('cover', slug);
}
await browser.close();
server.close();
