import { chromium } from 'playwright';
import path from 'path'; import fs from 'fs';
const [,, cut] = process.argv; const site = cut==='site';
const dir = `frames-${cut}`; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p = await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+path.resolve('reel/reel.html')+(site?'?site=1':'')+(cut==='mobile'?'?mobile=1':''));
await p.evaluate(()=>document.fonts.ready);
const FPS=30, N=13*FPS;
for (let f=0; f<N; f++){ await p.evaluate(t=>window.render(t), f/FPS); await p.screenshot({path:`${dir}/f${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:94}); }
await b.close(); console.log(cut,'frames',N);
