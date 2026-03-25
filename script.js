// PAGE LOADER
function initPageLoader(){
  const skipOnce=sessionStorage.getItem('skip-loader-once')==='1';
  if(skipOnce){
    sessionStorage.removeItem('skip-loader-once');
    return;
  }
  if(document.getElementById('pageLoader')) return;

  const doodles=[
    {
      svg:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M22 44h40a8 8 0 0 1 8 8v8a12 12 0 0 1-12 12H34a12 12 0 0 1-12-12z"/><path d="M69 52h7a8 8 0 0 1 0 16h-6"/><path d="M34 41c0-6 4-8 4-14"/><path d="M46 41c0-6 4-8 4-14"/><path d="M19 72h50"/></svg>`,
      caption:'Brewing coffee and loading pixels.'
    },
    {
      svg:`<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="14" y="20" width="68" height="50" rx="5"/><path d="M24 20v-9m16 9v-9m16 9v-9m16 9v-9"/><path d="M25 37h16m6 0h23M25 50h13m5 0h30M25 61h34"/></svg>`,
      caption:'Scanning film frames for visual rhythm.'
    },
    {
      svg:`<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="40" y="16" width="16" height="36" rx="8"/><path d="M32 36v9a16 16 0 0 0 32 0v-9"/><path d="M48 61v16"/><path d="M36 77h24"/><path d="M28 24l8 3m32-3-8 3"/></svg>`,
      caption:'Mic check: clarity, timing, confidence.'
    },
    {
      svg:`<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="47" cy="18" r="6"/><path d="M47 24v20"/><path d="M47 35 27 48"/><path d="M47 35 66 48"/><path d="M47 44 34 70"/><path d="M47 44 63 73"/><path d="M20 74h56"/></svg>`,
      caption:'Theatre energy, now in interaction form.'
    },
    {
      svg:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M18 24h28v50H18z"/><path d="M46 27h32v47H46z"/><path d="M24 33h16m-16 10h16m-16 10h14m28-17H54m12 10H54m12 10H54"/></svg>`,
      caption:'Turning notes, books, and sketches into systems.'
    },
    {
      svg:`<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="14"/><path d="M48 18v11m0 38v11m30-30H67m-38 0H18m50.6-20.6-8 8m-25.2 25.2-8 8m41.2 0-8-8m-25.2-25.2-8-8"/></svg>`,
      caption:'Catching sunlight before opening Figma.'
    },
    {
      svg:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M14 45c6 0 6 6 12 6s6-6 12-6 6 6 12 6 6-6 12-6 6 6 12 6 6-6 12-6"/><path d="M14 58c6 0 6 6 12 6s6-6 12-6 6 6 12 6 6-6 12-6 6 6 12 6 6-6 12-6"/><path d="M18 74h60"/></svg>`,
      caption:'Good waves, good stories, good design.'
    }
  ];

  document.body.classList.add('is-loading');
  const loader=document.createElement('div');
  loader.id='pageLoader';
  loader.innerHTML=`
    <div class="loader-box" role="status" aria-live="polite" aria-label="Loading page">
      <div class="loader-doodle" id="loaderDoodle">${doodles[0].svg}</div>
      <div class="loader-percent" id="loaderPercent">0%</div>
      <div class="loader-text">Loading portfolio</div>
      <div class="loader-caption" id="loaderCaption">${doodles[0].caption}</div>
    </div>
  `;
  document.body.prepend(loader);

  const percentEl=document.getElementById('loaderPercent');
  const doodleEl=document.getElementById('loaderDoodle');
  const captionEl=document.getElementById('loaderCaption');

  let iconIdx=0;
  const iconTimer=setInterval(()=>{
    iconIdx=(iconIdx+1)%doodles.length;
    if(captionEl) captionEl.classList.add('switching');
    setTimeout(()=>{
      doodleEl.innerHTML=doodles[iconIdx].svg;
      if(captionEl){
        captionEl.textContent=doodles[iconIdx].caption;
        captionEl.classList.remove('switching');
      }
    },140);
  },900);

  let progress=0;
  let target=10;
  let finished=false;
  let canFinish=false;

  const progressTimer=setInterval(()=>{
    if(progress<target && Math.random()>.24){
      progress=Math.min(progress+1,target);
      percentEl.textContent=`${progress}%`;
    }
    if(finished && canFinish && progress>=100){
      clearInterval(progressTimer);
      clearInterval(iconTimer);
      loader.classList.add('done');
      setTimeout(()=>{
        loader.remove();
        document.body.classList.remove('is-loading');
      },620);
    }
  },28);

  const driftTimer=setInterval(()=>{
    if(finished && canFinish){
      target=100;
      clearInterval(driftTimer);
      return;
    }
    target=Math.min(96,target+Math.floor(Math.random()*7)+4);
  },220);

  setTimeout(()=>{
    canFinish=true;
    if(finished) target=100;
  },2200);

  window.addEventListener('load',()=>{
    finished=true;
    if(canFinish) target=100;
  },{once:true});

  setTimeout(()=>{
    if(!finished){
      finished=true;
      canFinish=true;
      target=100;
    }
  },6500);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initPageLoader,{once:true});
}else{
  initPageLoader();
}

// Skip loader for next navigation when opening project pages.
document.querySelectorAll('a[href^="project-"]').forEach(link=>{
  link.addEventListener('click',()=>{
    sessionStorage.setItem('skip-loader-once','1');
  });
});

// THEME
const html=document.documentElement;
const saved=localStorage.getItem('sc-theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
html.setAttribute('data-theme',saved);updateThemeUI(saved);
const themeToggle=document.getElementById('themeToggle');
if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    const next=html.getAttribute('data-theme')==='light'?'dark':'light';
    html.setAttribute('data-theme',next);localStorage.setItem('sc-theme',next);
    updateThemeUI(next);
    setTimeout(drawGrid,50);
  });
}
function updateThemeUI(t){
  const themeIcon=document.getElementById('themeIcon');
  const themeLabel=document.getElementById('themeLabel');
  if(themeIcon) themeIcon.textContent=t==='dark'?'●':'○';
  if(themeLabel) themeLabel.textContent=t==='dark'?'Dark':'Light';
}

// HERO GRID
function drawGrid(){
  const hero=document.getElementById('hero');
  const svgEl=document.getElementById('hero-grid');
  if(!hero||!svgEl) return;
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
  const hero=document.getElementById('hero');
  if(!hero) return;
  hero.classList.remove('grid-ready');
  drawGrid();
});

// GRID FADE ON SCROLL
const heroEl=document.getElementById('hero');
const gridSvg=document.getElementById('hero-grid');
const gmEls=document.querySelectorAll('.grid-mark');
if(heroEl&&gridSvg){
  window.addEventListener('scroll',()=>{
    const fade=Math.max(0,1-(window.scrollY/(heroEl.offsetHeight*0.6)));
    gridSvg.style.opacity=fade;
    gmEls.forEach(m=>m.style.opacity=fade*0.9);
  },{passive:true});
}

// SCROLL PROGRESS
const prog=document.getElementById('progress');
window.addEventListener('scroll',()=>{
  if(!prog) return;
  const s=document.documentElement.scrollTop;
  const h=document.documentElement.scrollHeight-window.innerHeight;
  prog.style.width=(s/h*100)+'%';
},{passive:true});

// NAV
const navbar=document.getElementById('navbar');
if(navbar){
  window.addEventListener('scroll',()=>navbar.classList.toggle('filled',window.scrollY>40),{passive:true});
}

// CURSOR
const cdot=document.getElementById('cdot'),cring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0;
if(cdot&&cring){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    cdot.style.left=mx+'px';cdot.style.top=my+'px';
  });
  (function loop(){
    rx+=(mx-rx)*.1;ry+=(my-ry)*.1;
    cring.style.left=rx+'px';cring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.project-row,.chip,.work-tab').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cring.style.width='34px';cring.style.height='34px';cring.style.opacity='1';});
    el.addEventListener('mouseleave',()=>{cring.style.width='24px';cring.style.height='24px';cring.style.opacity='.4';});
  });
}

// PROJECT CARD TILT
const tiltCards=document.querySelectorAll('[data-tilt="true"]');
tiltCards.forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const rect=card.getBoundingClientRect();
    const px=(e.clientX-rect.left)/rect.width;
    const py=(e.clientY-rect.top)/rect.height;
    const rx=(py-.5)*-4;
    const ry=(px-.5)*5;
    card.style.transform=`translateY(-3px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='';
  });
});

// FADE IN
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*55);obs.unobserve(e.target);}
  });
},{threshold:0.08});
document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));

// WORK TABS
const workTabs=document.querySelectorAll('.work-tab');
if(workTabs.length){
  workTabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      workTabs.forEach(btn=>{
        btn.classList.remove('active');
        btn.setAttribute('aria-selected','false');
      });
      document.querySelectorAll('.work-panel').forEach(panel=>{
        panel.classList.remove('active');
        panel.setAttribute('hidden','');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      const panel=document.getElementById(tab.dataset.target);
      if(panel){
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      }
    });
  });
}

// CHAT
function getLocalReply(question){
  const q=question.toLowerCase();
  const replies=[
    {
      keys:['process','workflow','how do you design','approach'],
      text:'I work in six loops: define context, map flows, test assumptions, wireframe, stress-test with edge cases, then polish. I prototype early so decisions come from behavior, not vibes. My bias is always clarity first, then character.'
    },
    {
      keys:['cs','computer science','engineering'],
      text:'CS helps me see interfaces as systems, not screens. I think in states, logic, dependencies, and failure paths. So my designs are easier to build, more robust, and less likely to break in real product conditions.'
    },
    {
      keys:['ai','future','replace'],
      text:'AI is best as a force multiplier. It speeds up exploration, content drafts, and variations. But judgment, ethics, prioritization, and taste are still human territory. I use AI to move faster, not to think less.'
    },
    {
      keys:['icon','bookworm','website','eco','marriage','project'],
      text:'My project theme is simple: make experiences easier to understand and harder to abandon. Every project starts with user friction mapping, then structure, then visual craft. If it looks good but confuses users, it is unfinished.'
    },
    {
      keys:['hire','contact','available','freelance','full-time'],
      text:'Yes, I am open to UI/UX, product design, and design systems roles, full-time or freelance. You can reach me from the contact section and I usually reply fast.'
    }
  ];
  const found=replies.find(item=>item.keys.some(key=>q.includes(key)));
  return found ? found.text : 'I can answer about my projects, process, design systems, AI in design, and how I think as a CS + design hybrid. Ask me something specific and I will be direct.';
}
function addMsg(text,role){
  const w=document.getElementById('chatMessages');
  if(!w) return;
  const div=document.createElement('div');div.className=`msg ${role}`;
  div.innerHTML=`<div class="msg-av">${role==='bot'?'SC':'You'}</div><div class="msg-b">${text}</div>`;
  w.appendChild(div);w.scrollTop=w.scrollHeight;
}
function showTyping(){
  const w=document.getElementById('chatMessages');const d=document.createElement('div');
  if(!w) return;
  d.className='msg bot';d.id='typing';
  d.innerHTML=`<div class="msg-av">SC</div><div class="msg-b typing"><span></span><span></span><span></span></div>`;
  w.appendChild(d);w.scrollTop=w.scrollHeight;
}
function hideTyping(){const t=document.getElementById('typing');if(t)t.remove();}
async function sendMessage(){
  const inp=document.getElementById('chatInput'),btn=document.getElementById('sendBtn');
  if(!inp||!btn) return;
  const text=inp.value.trim();if(!text)return;
  const chips=document.getElementById('chips');
  if(chips) chips.style.display='none';
  inp.value='';btn.disabled=true;addMsg(text,'user');showTyping();
  setTimeout(()=>{
    hideTyping();
    addMsg(getLocalReply(text),'bot');
    btn.disabled=false;inp.focus();
  },550);
}
function sendChip(el){
  const input=document.getElementById('chatInput');
  if(!input) return;
  input.value=el.textContent;
  sendMessage();
}
const chatInput=document.getElementById('chatInput');
if(chatInput){
  chatInput.addEventListener('keydown',e=>{if(e.key==='Enter')sendMessage();});
}

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
