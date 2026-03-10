// THEME
const html=document.documentElement;
const saved=localStorage.getItem('sc-theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
html.setAttribute('data-theme',saved);updateThemeUI(saved);
document.getElementById('themeToggle').addEventListener('click',()=>{
  const next=html.getAttribute('data-theme')==='light'?'dark':'light';
  html.setAttribute('data-theme',next);localStorage.setItem('sc-theme',next);
  updateThemeUI(next);
  setTimeout(drawGrid,50);
});
function updateThemeUI(t){
  document.getElementById('themeIcon').textContent=t==='dark'?'●':'○';
  document.getElementById('themeLabel').textContent=t==='dark'?'Dark':'Light';
}

// HERO GRID
function drawGrid(){
  const hero=document.getElementById('hero');
  const svgEl=document.getElementById('hero-grid');
  const W=hero.offsetWidth,H=hero.offsetHeight;
  svgEl.setAttribute('viewBox',`0 0 ${W} ${H}`);
  svgEl.style.width=W+'px';svgEl.style.height=H+'px';

  const isDark=html.getAttribute('data-theme')==='dark';
  const strokeColor=isDark?'rgba(242,242,242,0.04)':'rgba(26,26,26,0.055)';

  const COLS=12,ROWS=8;
  const cw=W/COLS,rh=H/ROWS;
  let markup='';
  for(let c=0;c<=COLS;c++){
    const x=Math.round(c*cw);
    markup+=`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${strokeColor}" stroke-width="1"/>`;
  }
  for(let r=0;r<=ROWS;r++){
    const y=Math.round(r*rh);
    markup+=`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${strokeColor}" stroke-width="1"/>`;
  }
  svgEl.innerHTML=markup;

  // position crosshair marks at grid intersections
  const mpos=[
    {id:'gm1',c:1,r:2},{id:'gm2',c:11,r:4},
    {id:'gm3',c:4,r:6},{id:'gm4',c:8,r:2},
  ];
  mpos.forEach(m=>{
    const el=document.getElementById(m.id);
    if(!el)return;
    el.style.left=(m.c*cw-5)+'px';
    el.style.top=(m.r*rh-5)+'px';
  });

  setTimeout(()=>hero.classList.add('grid-ready'),250);
}
window.addEventListener('load',drawGrid);
window.addEventListener('resize',()=>{
  document.getElementById('hero').classList.remove('grid-ready');
  drawGrid();
});

// GRID FADE ON SCROLL
const heroEl=document.getElementById('hero');
const gridSvg=document.getElementById('hero-grid');
const gmEls=document.querySelectorAll('.grid-mark');
window.addEventListener('scroll',()=>{
  const fade=Math.max(0,1-(window.scrollY/(heroEl.offsetHeight*0.6)));
  gridSvg.style.opacity=fade;
  gmEls.forEach(m=>m.style.opacity=fade*0.9);
},{passive:true});

// SCROLL PROGRESS
const prog=document.getElementById('progress');
window.addEventListener('scroll',()=>{
  const s=document.documentElement.scrollTop;
  const h=document.documentElement.scrollHeight-window.innerHeight;
  prog.style.width=(s/h*100)+'%';
},{passive:true});

// NAV
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('filled',window.scrollY>40),{passive:true});

// CURSOR
const cdot=document.getElementById('cdot'),cring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cdot.style.left=mx+'px';cdot.style.top=my+'px';
});
(function loop(){
  rx+=(mx-rx)*.1;ry+=(my-ry)*.1;
  cring.style.left=rx+'px';cring.style.top=ry+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.project-row,.chip').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cring.style.width='34px';cring.style.height='34px';cring.style.opacity='1';});
  el.addEventListener('mouseleave',()=>{cring.style.width='24px';cring.style.height='24px';cring.style.opacity='.4';});
});

// FADE IN
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*55);obs.unobserve(e.target);}
  });
},{threshold:0.08});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

// CHAT
const SP=`You are Suvarna Chauhan — UI/UX designer, 1.5 years experience, CS background, Master's in Design student. Answering questions on your portfolio.
Tone: confident, sharp, witty, opinionated. No fluff. Under 110 words. Never say "Great question!" Sound like a real person with strong opinions.
PHILOSOPHY: Design = structured problem-solving with empathy. Aesthetics attract, functionality sustains. Logic + creativity = collaborators. AI amplifies, doesn't replace.
APPROACH: Think in systems. Ask why before what. Prototype to think. Challenge patterns.
WORK: Reduced task time 25-30%. Built 200+ icon system. Used Rive for purposeful animation. Research that reframed problems.
PERSONAL: Master's student. Notices bad kerning. Problem solver, fast learner, genuinely nice human. Open to full-time/freelance: UI/UX, design systems, product design.`;
const msgs=[];
async function callClaude(q){
  msgs.push({role:'user',content:q});
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:SP,messages:msgs})});
  const d=await r.json();
  const reply=d.content?.[0]?.text||'Try asking differently.';
  msgs.push({role:'assistant',content:reply});return reply;
}
function addMsg(text,role){
  const w=document.getElementById('chatMessages');
  const div=document.createElement('div');div.className=`msg ${role}`;
  div.innerHTML=`<div class="msg-av">${role==='bot'?'SC':'You'}</div><div class="msg-b">${text}</div>`;
  w.appendChild(div);w.scrollTop=w.scrollHeight;
}
function showTyping(){
  const w=document.getElementById('chatMessages');const d=document.createElement('div');
  d.className='msg bot';d.id='typing';
  d.innerHTML=`<div class="msg-av">SC</div><div class="msg-b typing"><span></span><span></span><span></span></div>`;
  w.appendChild(d);w.scrollTop=w.scrollHeight;
}
function hideTyping(){const t=document.getElementById('typing');if(t)t.remove();}
async function sendMessage(){
  const inp=document.getElementById('chatInput'),btn=document.getElementById('sendBtn');
  const text=inp.value.trim();if(!text)return;
  document.getElementById('chips').style.display='none';
  inp.value='';btn.disabled=true;addMsg(text,'user');showTyping();
  try{const r=await callClaude(text);hideTyping();addMsg(r,'bot');}
  catch(e){hideTyping();addMsg('Something went wrong. Try again.','bot');}
  btn.disabled=false;inp.focus();
}
function sendChip(el){
  document.getElementById('chatInput').value=el.textContent;
  sendMessage();
}
document.getElementById('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMessage();});

// PHOTO UPLOAD
const photoInput=document.getElementById('photoInput');
const aboutPhoto=document.getElementById('aboutPhoto');
const photoPlaceholder=document.getElementById('photoPlaceholder');
if(photoInput){
  photoInput.addEventListener('change',e=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      aboutPhoto.src=ev.target.result;
      aboutPhoto.classList.add('loaded');
      photoPlaceholder.style.display='none';
    };
    reader.readAsDataURL(file);
  });
}
