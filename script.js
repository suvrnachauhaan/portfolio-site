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

// WHY CARDS FLIP ON CLICK
const whyCards=document.querySelectorAll('.why-card');
if(whyCards.length){
  whyCards.forEach(card=>{
    card.addEventListener('click',()=>{
      card.classList.toggle('is-flipped');
    });
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });
}

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
