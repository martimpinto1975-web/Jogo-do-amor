/* ============================================================
   LOVE SHOT v4 — FINAL
   • Shop bug fixed (buy/equip fully working)
   • Easter egg: shoot LEFT → random maze → love letter
   • Visual & audio polish pass
   • Mobile optimised throughout
   ============================================================ */
'use strict';

// ─── CONFIG ───────────────────────────────────────────────────
const CFG = {
  arrowSpeed:    13,
  maxPull:       88,
  minShootPull:  15,
  arrowW:        60,
  arrowR:        5,
  targetR:       36,
  targetMoveAmp: 38,
  targetMoveSp:  0.44,
  hitZoneR:      40,
  bowX_pct:      0.22,
  bowY_pct:      0.60,
  targetX_pct:   0.72,
  targetY_pct:   0.46,
  gravity:       0.20,
  trailLen:      24,
  particleCount: 34,
  bgHeartCount:  18,
  powerHoldMs:   1700,
  coinsPerHit:   2,
  comboThreshold:3,
};

// ─── MESSAGES ──────────────────────────────────────────────────
const HIT_MSGS = [
  { en:"You stole my heart 💕",                          pt:"Roubaste o meu coração" },
  { en:"Love found the target ✨",                        pt:"O amor acertou no alvo" },
  { en:"Right into my heart 🌸",                         pt:"Direto ao meu coração" },
  { en:"You are my favourite feeling 🥰",                 pt:"És o meu sentimento favorito" },
  { en:"Cupid would be so proud 💘",                      pt:"Cupido estaria orgulhoso" },
  { en:"A perfect shot of love 🌷",                       pt:"Um disparo perfeito de amor" },
  { en:"My heart smiles just for you 🌺",                 pt:"O meu coração sorri por ti" },
  { en:"You make everything sweeter 🍓",                  pt:"Tornas tudo mais doce" },
  { en:"Straight to the heart ♡",                        pt:"Direto ao coração" },
  { en:"Blooming just for you 🌼",                        pt:"A florescer só por ti" },
  { en:"You are my softest place 🤍",                     pt:"És o meu lugar mais suave" },
  { en:"Love looks so good on you ✦",                     pt:"O amor fica-te tão bem" },
  { en:"You aim so beautifully 🎯",                       pt:"Apontas tão lindamente" },
  { en:"Even arrows dream of you 💫",                     pt:"Até as flechas sonham contigo" },
  { en:"The sweetest bull's-eye ever 🍬",                 pt:"O alvo mais doce de sempre" },
  { en:"Love is your superpower 🦋",                      pt:"O amor é o teu superpoder" },
  { en:"You are my favourite chapter 📖",                 pt:"És o meu capítulo favorito" },
  { en:"Perfectly and utterly yours 🌙",                  pt:"Perfeitamente e totalmente tua" },
  { en:"My heart was waiting for this 🕊️",                pt:"O meu coração esperava por isto" },
  { en:"You light up everything 🌟",                      pt:"Iluminas tudo à tua volta" },
  { en:"Made of the softest magic 🧚",                    pt:"Feita da magia mais suave" },
  { en:"You're the reason I smile 😊",                    pt:"És a razão do meu sorriso" },
  { en:"My heart belongs to you 💝",                      pt:"O meu coração é teu" },
  { en:"Hitting all the right notes 🎵",                  pt:"A acertar em todas as notas certas" },
  { en:"I'd follow your arrow anywhere 🗺️",               pt:"Seguiria a tua flecha para qualquer lado" },
  { en:"You're my favourite adventure 🌈",                pt:"És a minha aventura favorita" },
  { en:"Sweet, gentle, and perfectly you 🌷",             pt:"Doce, gentil e perfeitamente tu" },
  { en:"Every shot feels like a love letter 💌",          pt:"Cada disparo parece uma carta de amor" },
  { en:"You make love feel easy 🌊",                      pt:"Tornas o amor fácil" },
  { en:"There's nowhere I'd rather aim 💕",               pt:"Não há outro sítio onde prefira apontar" },
  { en:"You're the melody I can't forget 🎶",             pt:"És a melodia que não consigo esquecer" },
  { en:"I'd cross oceans just for you 🌊",                pt:"Cruzaria oceanos só por ti" },
  { en:"You're my happiest thought 💭",                    pt:"És o meu pensamento mais feliz" },
  { en:"Everything feels warmer with you 🌤️",             pt:"Tudo fica mais quente contigo" },
  { en:"You make the world softer 🌿",                     pt:"Tornas o mundo mais suave" },
  { en:"Falling for you, every single time 🍂",           pt:"A cair por ti, sempre de novo" },
  { en:"You're my favourite hello 👋",                     pt:"És o meu olá favorito" },
  { en:"Love, aimed perfectly 💘",                         pt:"Amor, apontado na perfeição" },
  { en:"Home is wherever you are 🏡",                      pt:"Casa é onde quer que estejas" },
  { en:"You're the calm in my storm ☁️",                   pt:"És a calma no meio da minha tempestade" },
  { en:"My heart does a little dance for you 💃",          pt:"O meu coração dança por ti" },
  { en:"So lucky this arrow found you 🍀",                 pt:"Tão sortuda que esta flecha te encontrou" },
  { en:"You colour my whole world 🎨",                     pt:"Dás cor a todo o meu mundo" },
  { en:"You're the poem I never knew I needed 📜",         pt:"És o poema que não sabia que precisava" },
  { en:"You make my heart skip every time 💓",             pt:"Fazes o meu coração saltar sempre" },
];

const MISS_MSGS = [
  { en:"I miss you so much 💔",        pt:"Tenho tanta saudade de ti" },
  { en:"Come back to my heart 💔",     pt:"Volta ao meu coração" },
  { en:"My heart aches for you 💔",    pt:"O meu coração dói por ti" },
  { en:"Almost... try again 💔",       pt:"Quase... tenta de novo" },
  { en:"Love is patient 💔",           pt:"O amor tem paciência" },
  { en:"So close, yet so far 💔",      pt:"Tão perto, tão longe" },
];

const COMBO_LABELS = [
  "","","",
  "💕 Combo ×3 — Lovely!",
  "🌸 Combo ×4 — Blooming!",
  "✨ Combo ×5 — Magical!",
  "💫 Combo ×6 — Enchanting!",
  "🔥 Combo ×7 — On Fire!",
  "👑 Combo ×8 — Royalty!",
  "💘 Combo ×9 — Cupid Mode!",
  "🌟 Combo ×10 — LOVE LEGEND!",
];

// ─── LOVE LETTERS (maze reward) ───────────────────────────────
const LOVE_LETTERS = [
  `Há certas coisas que não precisam de ser ditas em voz alta
para serem verdadeiras.

O modo como a tua voz torna qualquer sítio mais quente.
O modo como o teu riso me faz querer ficar para sempre
naquele momento exato.

Não sei explicar o que sentes quando o amor é real —
mas sei que é isto.

És a parte do dia em que respiro mais fundo.`,

  `Se eu pudesse escrever-te uma carta
sem ter medo das palavras,
diria apenas isto:

Obrigada por existires exactamente como és.
Não precisas de ser mais nada.
Não precisas de mudar nada.

Só de continuares aqui,
do teu lado do mundo,
a fazer que tudo valha a pena.`,

  `Existem amores que chegam devagar,
como a maré — sem pressa,
sem fazer barulho.

E de repente já estás completamente coberta
e já não sabes exactamente
quando tudo começou.

Só sabes que fica.
E que não queres que vá.`,

  `Às vezes penso que o coração sabe antes de nós.
Que já decidiu antes de haver palavras.
Que já escolheu antes de haver coragem.

E o que resta a fazer
é simplesmente não nos pormos no caminho.

Deixar que seja.
Deixar que fique.`,

  `Se um dia precisares de um sítio para descansar,
usa o meu coração.

Está aqui.
Sempre aberto.
Sempre teu.

Com toda a suavidade que tenho
e toda a força que consigo guardar para ti.`,

  `Há um tipo de felicidade que não grita.
Que não precisa de festa nem de confettis.

É o tipo que acontece quando estás perto.
Que soa a silêncio confortável
e a chá a ficar frio enquanto nos perdemos a falar.

Esse tipo de felicidade tem o teu nome.`,
];

// ─── SHOP DATA ────────────────────────────────────────────────
const SHOP = {
  skins: [
    { id:'skin_rings',   name:'Clássico',    icon:'🎯', desc:'Anéis concêntricos',   price:0,  variant:0 },
    { id:'skin_heart',   name:'Coração',     icon:'💗', desc:'Alvo em coração',      price:10, variant:1 },
    { id:'skin_flower',  name:'Flor',        icon:'🌸', desc:'Alvo em flor',         price:15, variant:2 },
    { id:'skin_star',    name:'Estrela',     icon:'⭐', desc:'Alvo em estrela',      price:20, variant:3 },
    { id:'skin_diamond', name:'Diamante',    icon:'💎', desc:'Elegante e brilhante', price:30, variant:4 },
  ],
  effects: [
    { id:'fx_hearts',   name:'Corações',    icon:'💕', desc:'Explosão de corações', price:0  },
    { id:'fx_petals',   name:'Pétalas',     icon:'🌸', desc:'Chuva de pétalas',     price:10 },
    { id:'fx_confetti', name:'Confettis',   icon:'🎉', desc:'Confettis românticos', price:12 },
    { id:'fx_stars',    name:'Estrelas',    icon:'⭐', desc:'Estrelas douradas',     price:18 },
    { id:'fx_rainbow',  name:'Arco-Íris',   icon:'🌈', desc:'Magia colorida',       price:25 },
  ],
  trails: [
    { id:'trail_glow',   name:'Brilho Rosa', icon:'✨', desc:'Rastro suave',         price:0  },
    { id:'trail_petals', name:'Pétalas',     icon:'🌸', desc:'Pétalas no rastro',    price:12 },
    { id:'trail_stars',  name:'Estrelas',    icon:'💫', desc:'Estrelas no caminho',  price:16 },
    { id:'trail_rainbow',name:'Arco-Íris',   icon:'🌈', desc:'Cores arco-íris',      price:22 },
    { id:'trail_fire',   name:'Fogo Amor',   icon:'🔥', desc:'Chamas cor-de-rosa',   price:28 },
  ],
  bows: [
    { id:'bow_wood',    name:'Madeira',  icon:'🏹', desc:'Arco clássico',       price:0  },
    { id:'bow_gold',    name:'Dourado',  icon:'✨', desc:'Arco de ouro',        price:20 },
    { id:'bow_crystal', name:'Cristal',  icon:'💎', desc:'Translúcido',         price:28 },
    { id:'bow_floral',  name:'Floral',   icon:'🌺', desc:'Decorado com flores', price:32 },
    { id:'bow_moon',    name:'Lunar',    icon:'🌙', desc:'Magia da lua',        price:38 },
  ],
};

// ─── SHOP STATE ───────────────────────────────────────────────
// These objects track what the player owns and has equipped.
// BUG ROOT CAUSE (prev version): equipped was a const object mutated OK,
// but renderShopTab read equipped[tab] where tab='skins' but the key is 'skin'.
// Fixed: category keys now match exactly: 'skins','effects','trails','bows'
// and equipped mirrors same keys.
const shopOwned    = {
  skins:   ['skin_rings'],
  effects: ['fx_hearts'],
  trails:  ['trail_glow'],
  bows:    ['bow_wood'],
};
const shopEquipped = {
  skins:   'skin_rings',
  effects: 'fx_hearts',
  trails:  'trail_glow',
  bows:    'bow_wood',
};
// Convenience getters so game code can read current equipped items
function eqSkin()   { return shopEquipped.skins;   }
function eqEffect() { return shopEquipped.effects;  }
function eqTrail()  { return shopEquipped.trails;   }
function eqBow()    { return shopEquipped.bows;     }
function eqVariant(){ return SHOP.skins.find(s=>s.id===eqSkin())?.variant ?? 0; }

// ─── DOM ──────────────────────────────────────────────────────
const canvas        = document.getElementById('gameCanvas');
const ctx           = canvas.getContext('2d');
const scoreEl       = document.getElementById('score');
const streakEl      = document.getElementById('streak');
const coinsEl       = document.getElementById('coins');
const levelNumEl    = document.getElementById('level-num');
const msgInner      = document.getElementById('msg-inner');
const msgIcon       = document.getElementById('msg-icon');
const msgText       = document.getElementById('msg-text');
const msgTrans      = document.getElementById('msg-translation');
const introScreen   = document.getElementById('intro-screen');
const startBtn      = document.getElementById('start-btn');
const heartsBack    = document.getElementById('hearts-back');
const heartsFront   = document.getElementById('hearts-front');
const shopModal     = document.getElementById('shop-modal');
const shopBtn       = document.getElementById('shop-btn');
const shopClose     = document.getElementById('shop-close');
const shopItemsEl   = document.getElementById('shop-items');
const shopCoinsEl   = document.getElementById('shop-coins');
const tabBtns       = document.querySelectorAll('.tab-btn');
const comboPop      = document.getElementById('combo-popup');
const heartbreakEl  = document.getElementById('heartbreak-overlay');
const levelupEl     = document.getElementById('levelup-overlay');
const levelupNumEl  = document.getElementById('levelup-num');
const cupidEl       = document.getElementById('cupid');
const powerWrap     = document.getElementById('power-bar-wrap');
const powerFillEl   = document.getElementById('power-bar-fill');
const mazeOverlay   = document.getElementById('maze-overlay');
const mazeCanvas    = document.getElementById('mazeCanvas');
const mctx          = mazeCanvas.getContext('2d');
const loveLetter    = document.getElementById('love-letter-overlay');
const loveLetterTxt = document.getElementById('love-letter-text');
const loveLetterBack= document.getElementById('love-letter-back');

// ─── GAME STATE ───────────────────────────────────────────────
let W, H, dpr;
let score=0, streak=0, coins=0, level=1;
let gameActive   = false;
let msgTimer     = null;
let comboTimer   = null;
let currentTheme = 'day';
let hitCooldown  = false;
let lastCupidT   = 0;
let rafId        = null;

// Input
let pointerDown     = false;
let startPX=0, startPY=0;
let activePointerId = -1;

// Power shot
let isPowerShot    = false;
let powerCharging  = false;
let powerStartTime = 0;

// Objects
const arrow  = { x:0,y:0,vx:0,vy:0,flying:false,trail:[],isPower:false };
const bow    = { x:0,y:0,pullX:0,pullY:0,pulling:false };
const target = { x:0,y:0,baseX:0,baseY:0,angle:0,r:CFG.targetR,hit:false,hitTimer:0 };

let particles      = [];
let bgSparkles     = [];
let embeddedArrows = [];

// ─── AUDIO ────────────────────────────────────────────────────
let _ac;
function getAC() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  if (_ac.state==='suspended') _ac.resume();
  return _ac;
}
function tone(freq,dur,vol=0.1,type='sine') {
  try {
    const a=getAC(),o=a.createOscillator(),g=a.createGain();
    o.connect(g);g.connect(a.destination);
    o.type=type;o.frequency.setValueAtTime(freq,a.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq*.45,a.currentTime+dur);
    g.gain.setValueAtTime(vol,a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+dur);
    o.start();o.stop(a.currentTime+dur);
  }catch(_){}
}
function playHit()   { [523.25,659.25,783.99].forEach((f,i)=>setTimeout(()=>tone(f,.4,.09),i*70)); }
function playMiss()  { tone(220,.65,.07);setTimeout(()=>tone(196,.5,.05),120); }
function playPower() { [880,1046.5,1318.5].forEach((f,i)=>setTimeout(()=>tone(f,.3,.12),i*48)); }
function playBuy()   { [660,880,1046].forEach((f,i)=>setTimeout(()=>tone(f,.22,.09),i*60)); }
function playMaze()  { [440,554,659,880].forEach((f,i)=>setTimeout(()=>tone(f,.3,.08),i*100)); }
function playLoveLetter(){ [523,659,784,1046,784,659,523].forEach((f,i)=>setTimeout(()=>tone(f,.35,.08),i*120)); }
function playShoot() {
  try{
    const a=getAC(),buf=a.createBuffer(1,a.sampleRate*.1,a.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.exp(-i/550);
    const src=a.createBufferSource(),g=a.createGain();
    src.buffer=buf;src.connect(g);g.connect(a.destination);
    g.gain.setValueAtTime(.055,a.currentTime);src.start();
  }catch(_){}
}

// ─── RESIZE ───────────────────────────────────────────────────
function resize() {
  dpr=Math.min(window.devicePixelRatio||1,2);
  W=window.innerWidth; H=window.innerHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  canvas.style.width=W+'px'; canvas.style.height=H+'px';
  ctx.scale(dpr,dpr);
  bow.x=W*CFG.bowX_pct; bow.y=H*CFG.bowY_pct;
  target.baseX=W*CFG.targetX_pct; target.baseY=H*CFG.targetY_pct;
  initBgSparkles();
}

// ─── RESET ARROW ──────────────────────────────────────────────
function resetArrowToRest() {
  powerCharging=false; isPowerShot=false; clearPowerUI();
  bow.pulling=false; bow.pullX=0; bow.pullY=0;
  arrow.x=bow.x+12; arrow.y=bow.y;
  arrow.vx=0; arrow.vy=0; arrow.flying=false; arrow.trail=[]; arrow.isPower=false;
  try{canvas.releasePointerCapture(activePointerId);}catch(_){}
  activePointerId=-1; pointerDown=false;
  hitCooldown=false;
}

// ─── POINTER INPUT ────────────────────────────────────────────
function onPointerDown(e) {
  if (!gameActive||hitCooldown||arrow.flying||pointerDown) return;
  e.preventDefault();
  activePointerId=e.pointerId;
  try{canvas.setPointerCapture(e.pointerId);}catch(_){}
  pointerDown=true; startPX=e.clientX; startPY=e.clientY;
  bow.pulling=true; bow.pullX=0; bow.pullY=0;
  isPowerShot=false; powerCharging=true; powerStartTime=performance.now();
  requestAnimationFrame(tickPowerBar);
}
function onPointerMove(e) {
  if (!pointerDown||e.pointerId!==activePointerId||!bow.pulling||arrow.flying) return;
  e.preventDefault();
  let dx=e.clientX-startPX, dy=e.clientY-startPY;
  const dist=Math.hypot(dx,dy);
  if(dist>CFG.maxPull){dx=dx/dist*CFG.maxPull;dy=dy/dist*CFG.maxPull;}
  bow.pullX=dx; bow.pullY=dy;
  arrow.x=bow.x+bow.pullX*.70; arrow.y=bow.y+bow.pullY*.70;
}
function onPointerUp(e) {
  if (!pointerDown||e.pointerId!==activePointerId) return;
  e.preventDefault();
  powerCharging=false; clearPowerUI();
  if(!bow.pulling||arrow.flying){pointerDown=false;activePointerId=-1;return;}
  const dist=Math.hypot(bow.pullX,bow.pullY);
  pointerDown=false; activePointerId=-1; bow.pulling=false;
  if(dist<CFG.minShootPull){resetArrowToRest();return;}

  // ─ Easter egg: shooting LEFT (pullX > threshold)
  if(bow.pullX > CFG.maxPull*0.55 && Math.abs(bow.pullY)<CFG.maxPull*0.6){
    resetArrowToRest();
    openMaze();
    return;
  }

  const power=dist/CFG.maxPull, mul=isPowerShot?1.5:1;
  arrow.vx=-bow.pullX/CFG.maxPull*CFG.arrowSpeed*(0.72+power*.58)*mul;
  arrow.vy=-bow.pullY/CFG.maxPull*CFG.arrowSpeed*(0.72+power*.58)*mul;
  arrow.x=bow.x; arrow.y=bow.y;
  arrow.flying=true; arrow.trail=[]; arrow.isPower=isPowerShot;
  bow.pullX=0; bow.pullY=0;

  if(isPowerShot){playPower();spawnPowerRing();}else{playShoot();}
  if(navigator.vibrate) navigator.vibrate(isPowerShot?[60,15,80]:22);
}

canvas.addEventListener('pointerdown',  onPointerDown,  {passive:false});
canvas.addEventListener('pointermove',  onPointerMove,  {passive:false});
canvas.addEventListener('pointerup',    onPointerUp,    {passive:false});
canvas.addEventListener('pointercancel',onPointerUp,    {passive:false});
canvas.addEventListener('touchstart',   e=>e.preventDefault(),{passive:false});
canvas.addEventListener('touchmove',    e=>e.preventDefault(),{passive:false});

// ─── POWER BAR ────────────────────────────────────────────────
function tickPowerBar() {
  if(!powerCharging) return;
  const pct=Math.min((performance.now()-powerStartTime)/CFG.powerHoldMs,1);
  powerFillEl.style.width=(pct*100)+'%';
  powerWrap.classList.add('visible');
  if(pct>=1&&!isPowerShot){
    isPowerShot=true; powerWrap.classList.add('charged');
    spawnPowerRing(); tone(660,.15,.07);
    if(navigator.vibrate)navigator.vibrate([15,8,15,8,25]);
  }
  if(pct<1) requestAnimationFrame(tickPowerBar);
}
function clearPowerUI(){
  powerWrap.classList.remove('visible','charged');
  powerFillEl.style.width='0%';
}
function spawnPowerRing(){
  const el=document.createElement('div'), sz=66;
  el.className='powershot-ring';
  el.style.cssText=`left:${bow.x-sz/2}px;top:${bow.y-sz/2}px;width:${sz}px;height:${sz}px;`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),900);
}

// ─── FLOATING HEARTS ──────────────────────────────────────────
function buildBgHearts(){
  heartsBack.innerHTML=''; heartsFront.innerHTML='';
  const items=['♡','❤','🌸','✦','✿','✶','❀','💕','🌷','💫','🌺','✨'];
  for(let i=0;i<CFG.bgHeartCount;i++){
    const el=document.createElement('span');
    el.className='float-heart';
    el.textContent=items[Math.floor(Math.random()*items.length)];
    const dur=8+Math.random()*9;
    el.style.cssText=`--dur:${dur}s;--delay:${-Math.random()*dur}s;--x:${Math.random()*100}%;--rot:${(Math.random()-.5)*22}deg;font-size:${.5+Math.random()*1.3}rem;color:hsl(${330+Math.random()*30},80%,${68+Math.random()*18}%);`;
    (i%3===0?heartsFront:heartsBack).appendChild(el);
  }
}

function initBgSparkles(){
  bgSparkles=[];
  for(let i=0;i<30;i++) bgSparkles.push({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*2.8,phase:Math.random()*Math.PI*2,speed:.007+Math.random()*.017});
}

// ─── CANVAS PARTICLES ─────────────────────────────────────────
function spawnParticles(x,y){
  const cols=['#f7a8b8','#e8607a','#d4b8e0','#ffcba4','#fff0b8','#ff99bb','#ffd6e7','#b8e0ff'];
  const N=CFG.particleCount+(arrow.isPower?18:0);
  for(let i=0;i<N;i++){
    const a=(Math.PI*2/N)*i+Math.random()*.5, spd=2.5+Math.random()*(arrow.isPower?8:5);
    particles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-1.3,r:3+Math.random()*5.5,alpha:1,
      color:cols[Math.floor(Math.random()*cols.length)],
      shape:['circle','heart','star','ring'][Math.floor(Math.random()*4)],
      decay:.017+Math.random()*.017,spin:(Math.random()-.5)*.26,rot:0});
  }
}

// ─── DOM EFFECT BURST ─────────────────────────────────────────
function spawnDomEffect(cx,cy){
  const fx=eqEffect(), N=16+(arrow.isPower?10:0);
  const petalE =['🌸','🌷','✿','❀','🌺','💐'];
  const heartE =['💕','💗','💖','💝','❤','🩷'];
  const starE  =['⭐','🌟','✨','💫','✦'];
  const rainbE =['❤️','🧡','💛','💚','💙','💜','🩷'];
  const confC  =['#f7a8b8','#e8607a','#d4b8e0','#ffcba4','#fff0b8'];

  for(let i=0;i<N;i++){
    const el=document.createElement('div');
    const ang=Math.random()*Math.PI*2, dst=55+Math.random()*130;
    if(fx==='fx_petals'){
      el.className='petal'; el.textContent=petalE[Math.floor(Math.random()*petalE.length)];
      el.style.cssText=`left:${cx+(Math.random()-.5)*60}px;top:${cy-20}px;--ps:${.8+Math.random()*.9}rem;--ptx:${(Math.random()-.5)*180}px;--pty:${80+Math.random()*110}px;--pr:${(Math.random()-.5)*400}deg;--pd:${1+Math.random()*.9}s;`;
    }else if(fx==='fx_stars'){
      el.className='star-burst'; el.textContent=starE[Math.floor(Math.random()*starE.length)];
      el.style.cssText=`left:${cx}px;top:${cy}px;--ss:${1+Math.random()*1.3}rem;--sbx:${Math.cos(ang)*dst}px;--sby:${Math.sin(ang)*dst-42}px;--sbr:${(Math.random()-.5)*720}deg;--sbd:${.8+Math.random()*.7}s;`;
    }else if(fx==='fx_confetti'){
      el.className='confetti-p';
      el.style.cssText=`left:${cx+(Math.random()-.5)*40}px;top:${cy-10}px;--cc:${confC[Math.floor(Math.random()*confC.length)]};--cw:${6+Math.random()*9}px;--ch:${8+Math.random()*11}px;--ctx:${(Math.random()-.5)*200}px;--cty:${100+Math.random()*130}px;--cr:${(Math.random()-.5)*800}deg;--cd:${.9+Math.random()}s;`;
    }else if(fx==='fx_rainbow'){
      el.className='star-burst'; el.textContent=rainbE[Math.floor(Math.random()*rainbE.length)];
      el.style.cssText=`left:${cx}px;top:${cy}px;--ss:${1.1+Math.random()*1.1}rem;--sbx:${Math.cos(ang)*dst}px;--sby:${Math.sin(ang)*dst-50}px;--sbr:${(Math.random()-.5)*720}deg;--sbd:${1+Math.random()*.9}s;`;
    }else{
      el.className='star-burst'; el.textContent=heartE[Math.floor(Math.random()*heartE.length)];
      el.style.cssText=`left:${cx}px;top:${cy}px;--ss:${1.1+Math.random()*1.1}rem;--sbx:${Math.cos(ang)*dst}px;--sby:${Math.sin(ang)*dst-55}px;--sbr:${(Math.random()-.5)*360}deg;--sbd:${.9+Math.random()*.8}s;`;
    }
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),2600);
  }
}

// ─── DRAW HELPERS ─────────────────────────────────────────────
function drawStar4(c,x,y,ir,or,rot){
  c.beginPath();
  for(let i=0;i<8;i++){const a=(i*Math.PI/4)+rot,r=i%2===0?or:ir;i===0?c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}
  c.closePath();
}
function heartPath(c,x,y,size){
  c.save();c.translate(x,y);c.scale(size/10,size/10);
  c.beginPath();c.moveTo(0,-4);
  c.bezierCurveTo(5,-10,12,-6,12,0);c.bezierCurveTo(12,6,0,12,0,12);
  c.bezierCurveTo(0,12,-12,6,-12,0);c.bezierCurveTo(-12,-6,-5,-10,0,-4);
  c.closePath();c.restore();
}

// ─── DRAW BACKGROUND ──────────────────────────────────────────
function drawBackground(t){
  const night=currentTheme==='night', garden=currentTheme==='garden';
  [{x:W*.14,y:H*.17,r:95,h:night?260:garden?130:340},
   {x:W*.82,y:H*.24,r:78,h:night?220:garden?160:280},
   {x:W*.5, y:H*.87,r:105,h:night?280:garden?140:350},
   {x:W*.92,y:H*.7, r:68,h:night?240:garden?120:320}].forEach(b=>{
    const off=Math.sin(t*.0007+b.h)*15;
    const g=ctx.createRadialGradient(b.x,b.y+off,0,b.x,b.y+off,b.r);
    g.addColorStop(0,`hsla(${b.h},70%,${night?48:86}%,${night?.2:.11})`);
    g.addColorStop(1,'hsla(0,0%,100%,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y+off,b.r,0,Math.PI*2);ctx.fill();
  });
  bgSparkles.forEach(s=>{
    s.phase+=s.speed;
    const a=(Math.sin(s.phase)+1)*.5*(night?.8:.55);
    ctx.save();ctx.globalAlpha=a;ctx.fillStyle=night?'#fff8d0':garden?'#90e060':'#ffd6e7';
    if(night){ctx.beginPath();ctx.arc(s.x,s.y,s.r*.5,0,Math.PI*2);ctx.fill();}
    else{drawStar4(ctx,s.x,s.y,s.r*.35,s.r,0);ctx.fill();}
    ctx.restore();
  });
  embeddedArrows.forEach(ea=>{
    ctx.save();ctx.globalAlpha=ea.alpha*.28;ctx.translate(ea.x,ea.y);ctx.rotate(ea.angle);
    ctx.fillStyle='#c87050';ctx.beginPath();ctx.roundRect(-18,-2,28,4,2);ctx.fill();
    ctx.restore(); ea.alpha-=.0007;
  });
  embeddedArrows=embeddedArrows.filter(a=>a.alpha>0);
}

// ─── DRAW BOW ─────────────────────────────────────────────────
function drawBow(t){
  ctx.save();ctx.translate(bow.x,bow.y);
  const pd=Math.hypot(bow.pullX,bow.pullY), pf=Math.min(pd/CFG.maxPull,1);
  const aim=(bow.pulling&&pd>5)?Math.atan2(-bow.pullY,-bow.pullX):0;
  ctx.rotate(aim);
  const bH=55+pf*18, cur=22+pf*14, bid=eqBow();
  const isGold=bid==='bow_gold', isCrystal=bid==='bow_crystal', isFloral=bid==='bow_floral', isMoon=bid==='bow_moon';

  if(isPowerShot){
    ctx.save();ctx.globalAlpha=.4+Math.sin(t*.055)*.3;
    const pg=ctx.createRadialGradient(0,0,0,0,0,54);
    pg.addColorStop(0,'rgba(245,200,66,.7)');pg.addColorStop(1,'transparent');
    ctx.fillStyle=pg;ctx.beginPath();ctx.arc(0,0,54,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  const sx=-pf*30;
  ctx.beginPath();ctx.moveTo(0,-bH);ctx.quadraticCurveTo(sx,0,0,bH);
  ctx.strokeStyle=isPowerShot?`rgba(245,200,66,${.7+pf*.3})`:`rgba(200,120,140,${.5+pf*.3})`;
  ctx.lineWidth=1.8;ctx.stroke();

  ctx.beginPath();ctx.moveTo(0,-bH);ctx.quadraticCurveTo(cur,0,0,bH);
  let bg;
  if(isGold){bg=ctx.createLinearGradient(-10,-bH,cur,bH);bg.addColorStop(0,'#f5c842');bg.addColorStop(.5,'#e0a820');bg.addColorStop(1,'#f0b830');}
  else if(isCrystal){bg=ctx.createLinearGradient(-10,-bH,cur,bH);bg.addColorStop(0,'rgba(200,220,255,.9)');bg.addColorStop(.5,'rgba(160,200,255,.7)');bg.addColorStop(1,'rgba(180,160,255,.9)');}
  else if(isMoon){bg=ctx.createLinearGradient(-10,-bH,cur,bH);bg.addColorStop(0,'#8080e0');bg.addColorStop(.5,'#6060c0');bg.addColorStop(1,'#a0a0f0');}
  else{bg=ctx.createLinearGradient(-10,-bH,cur,bH);bg.addColorStop(0,'#d4735a');bg.addColorStop(.5,'#c8503c');bg.addColorStop(1,'#b84030');}
  ctx.strokeStyle=bg;ctx.lineWidth=7;ctx.lineCap='round';ctx.stroke();

  if(isFloral){
    [-20,0,20].forEach(wy=>{
      const wx=Math.sin((wy/bH)*Math.PI*.5)*cur*.4;
      ctx.font='13px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🌸',wx,wy);
    });
  }else{
    [-18,0,18].forEach(wy=>{
      const wx=Math.sin((wy/bH)*Math.PI*.5)*cur*.4;
      ctx.beginPath();ctx.arc(wx,wy,4.5,0,Math.PI*2);
      ctx.fillStyle=isGold?'#fff0a0':isCrystal?'rgba(200,230,255,.9)':isMoon?'#c0c0ff':'#e8a090';ctx.fill();
      ctx.beginPath();ctx.arc(wx,wy,2.2,0,Math.PI*2);
      ctx.fillStyle=isGold?'#f5c842':isCrystal?'rgba(140,180,255,.9)':isMoon?'#8888ee':'#ff6b80';ctx.fill();
    });
  }

  if(bow.pulling&&pd>CFG.minShootPull){
    ctx.save();ctx.globalAlpha=.24*pf;
    const gl=ctx.createRadialGradient(sx,0,0,sx,0,42);
    gl.addColorStop(0,isPowerShot?'#f5c842':'#f7a8b8');gl.addColorStop(1,'transparent');
    ctx.fillStyle=gl;ctx.beginPath();ctx.arc(sx,0,42,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  ctx.restore();
}

// ─── DRAW ARROW ───────────────────────────────────────────────
function drawArrow(){
  const tid=eqTrail();
  if(arrow.flying&&arrow.trail.length>1){
    ctx.save();
    for(let i=0;i<arrow.trail.length-1;i++){
      const a1=arrow.trail[i],a2=arrow.trail[i+1],p=i/arrow.trail.length;
      if(tid==='trail_rainbow') ctx.strokeStyle=`hsla(${p*300+200},90%,70%,${p*.6})`;
      else if(tid==='trail_fire')   ctx.strokeStyle=`hsla(${10+p*30},90%,${50+p*30}%,${p*.65})`;
      else if(tid==='trail_stars')  ctx.strokeStyle=`rgba(245,200,66,${p*.55})`;
      else if(tid==='trail_petals') ctx.strokeStyle=`rgba(247,168,184,${p*.55})`;
      else ctx.strokeStyle=`hsla(340,80%,${75+p*15}%,${p*.5})`;
      ctx.beginPath();ctx.moveTo(a1.x,a1.y);ctx.lineTo(a2.x,a2.y);ctx.lineWidth=p*5.5;ctx.stroke();
    }
    ctx.restore();
  }
  ctx.save();ctx.translate(arrow.x,arrow.y);
  let angle=arrow.flying?Math.atan2(arrow.vy,arrow.vx):(bow.pulling&&Math.hypot(bow.pullX,bow.pullY)>5?Math.atan2(-bow.pullY,-bow.pullX):0);
  ctx.rotate(angle);
  const L=CFG.arrowW,R=CFG.arrowR;
  if(arrow.isPower){
    ctx.save();ctx.globalAlpha=.45;
    const pg=ctx.createRadialGradient(0,0,0,0,0,22);
    pg.addColorStop(0,'rgba(245,200,66,.6)');pg.addColorStop(1,'transparent');
    ctx.fillStyle=pg;ctx.beginPath();ctx.arc(0,0,22,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  const sg=ctx.createLinearGradient(-L/2,0,L/2,0);
  sg.addColorStop(0,'#a06040');sg.addColorStop(.5,'#c87050');sg.addColorStop(1,'#904030');
  ctx.fillStyle=arrow.isPower?'#f5c842':sg;
  ctx.beginPath();ctx.roundRect(-L/2,-R/2+1,L*.75,R-2,2);ctx.fill();
  ctx.save();ctx.translate(L/2-2,0);heartPath(ctx,0,0,9);ctx.fillStyle=arrow.isPower?'#e0a820':'#e8607a';ctx.fill();ctx.restore();
  ctx.save();ctx.translate(-L/2+6,0);
  [[- 1,.42],[1,.36]].forEach(([s,op])=>{
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-16,s*11);ctx.lineTo(-7,s*3.5);ctx.closePath();
    ctx.globalAlpha=op;ctx.fillStyle=arrow.isPower?(s>0?'#f5c842':'#fff0a0'):(s>0?'#f7a8b8':'#d4b8e0');ctx.fill();
  });
  ctx.restore();ctx.restore();
}

// ─── DRAW TARGET ──────────────────────────────────────────────
function drawTarget(t){
  const R=target.r;
  ctx.save();ctx.translate(target.x,target.y);
  const pulse=target.hit?1+Math.sin(target.hitTimer*.3)*.18:1+Math.sin(t*.003)*.035;
  ctx.scale(pulse,pulse);
  const glow=ctx.createRadialGradient(0,0,R*.6,0,0,R*2.1);
  glow.addColorStop(0,'rgba(247,168,184,.28)');glow.addColorStop(1,'transparent');
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,R*2.1,0,Math.PI*2);ctx.fill();
  const v=eqVariant();
  if(v===0){
    [{r:R,c:'#f7a8b8'},{r:R*.72,c:'#e8607a'},{r:R*.44,c:'#fff'},{r:R*.24,c:'#e8607a'}].forEach(({r,c})=>{
      ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1;ctx.stroke();
    });
  }else if(v===1){
    ctx.scale(R/10,R/10);heartPath(ctx,0,-1,10);
    const hg=ctx.createRadialGradient(0,0,0,0,0,10);
    hg.addColorStop(0,'#fff');hg.addColorStop(.4,'#f7a8b8');hg.addColorStop(1,'#e8607a');
    ctx.fillStyle=hg;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=.5;ctx.stroke();
  }else if(v===2){
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2;ctx.save();ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,-R*.5,R*.28,R*.44,0,0,Math.PI*2);ctx.fillStyle=i%2===0?'#f7a8b8':'#d4b8e0';ctx.fill();ctx.restore();}
    ctx.beginPath();ctx.arc(0,0,R*.32,0,Math.PI*2);ctx.fillStyle='#fff0b8';ctx.fill();
    ctx.beginPath();ctx.arc(0,0,R*.16,0,Math.PI*2);ctx.fillStyle='#f5c842';ctx.fill();
  }else if(v===3){
    drawStar4(ctx,0,0,R*.38,R,t*.001);
    const sg=ctx.createRadialGradient(0,0,0,0,0,R);
    sg.addColorStop(0,'#fff8d0');sg.addColorStop(.5,'#f5c842');sg.addColorStop(1,'#e8a020');
    ctx.fillStyle=sg;ctx.fill();ctx.beginPath();ctx.arc(0,0,R*.22,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  }else{
    ctx.save();ctx.rotate(Math.PI/4);
    [{r:R,c:'#f0b8d0'},{r:R*.68,c:'#e8607a'},{r:R*.4,c:'#fff'},{r:R*.2,c:'#d4b8e0'}].forEach(({r,c})=>{
      ctx.beginPath();ctx.rect(-r,-r,r*2,r*2);ctx.fillStyle=c;ctx.fill();
    });
    ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(0,-R*.65);ctx.lineTo(R*.28,-R*.08);ctx.lineTo(0,-R*.08);ctx.closePath();ctx.fillStyle='rgba(255,255,255,.8)';ctx.fill();
    ctx.restore();
  }
  if(!target.hit){
    for(let i=0;i<3;i++){
      const a=t*.002+(i/3)*Math.PI*2,or=R*1.36;
      ctx.save();ctx.translate(Math.cos(a)*or,Math.sin(a)*or);ctx.scale(.55,.55);
      heartPath(ctx,0,0,5);ctx.fillStyle='rgba(232,96,122,.42)';ctx.fill();ctx.restore();
    }
  }
  ctx.restore();
}

// ─── CANVAS PARTICLES ─────────────────────────────────────────
function drawParticles(){
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=CFG.gravity*.48;p.vx*=.972;p.vy*=.972;
    p.alpha-=p.decay;p.rot+=p.spin;
    if(p.alpha<=0)return;
    ctx.save();ctx.globalAlpha=p.alpha;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;
    if(p.shape==='heart'){heartPath(ctx,0,0,p.r*1.6);ctx.fill();}
    else if(p.shape==='star'){drawStar4(ctx,0,0,p.r*.4,p.r,p.rot);ctx.fill();}
    else if(p.shape==='ring'){ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.strokeStyle=p.color;ctx.lineWidth=1.5;ctx.stroke();}
    else{ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  });
  particles=particles.filter(p=>p.alpha>0);
}

// ─── PULL GUIDE ───────────────────────────────────────────────
function drawPullGuide(){
  if(!bow.pulling)return;
  const dist=Math.hypot(bow.pullX,bow.pullY);
  if(dist<CFG.minShootPull)return;
  // Don't draw guide when aiming left (easter egg direction)
  if(bow.pullX>CFG.maxPull*0.5&&Math.abs(bow.pullY)<CFG.maxPull*0.6){
    ctx.save();ctx.font='1rem serif';ctx.textAlign='center';ctx.fillStyle='rgba(248,120,160,.7)';
    ctx.fillText('🌹 Segredo ←',bow.x-50,bow.y-50);ctx.restore();
    return;
  }
  const ang=Math.atan2(-bow.pullY,-bow.pullX),power=Math.min(dist/CFG.maxPull,1);
  ctx.save();ctx.setLineDash([4,7]);
  ctx.strokeStyle=isPowerShot?`rgba(245,200,66,${.28+power*.22})`:`rgba(232,96,122,${.18+power*.14})`;
  ctx.lineWidth=1.5;ctx.beginPath();
  let px=bow.x,py=bow.y,pvx=Math.cos(ang)*CFG.arrowSpeed*(0.72+power*.58)*(isPowerShot?1.5:1),pvy=Math.sin(ang)*CFG.arrowSpeed*(0.72+power*.58)*(isPowerShot?1.5:1);
  ctx.moveTo(px,py);
  for(let i=0;i<22;i++){px+=pvx;py+=pvy;pvy+=CFG.gravity;if(px<0||px>W||py>H)break;ctx.lineTo(px,py);}
  ctx.stroke();ctx.restore();
}

// ─── CUPIDO ───────────────────────────────────────────────────
function maybeLaunchCupid(t){
  if(t-lastCupidT<20000)return;
  if(Math.random()>.22)return;
  lastCupidT=t;
  cupidEl.classList.remove('fly');void cupidEl.offsetWidth;
  cupidEl.classList.add('fly');
  setTimeout(()=>cupidEl.classList.remove('fly'),3600);
}

// ─── THEME ────────────────────────────────────────────────────
function updateTheme(lv){
  document.body.classList.remove('night-theme','garden-theme');
  if(lv>=7){document.body.classList.add('night-theme');currentTheme='night';}
  else if(lv>=4){document.body.classList.add('garden-theme');currentTheme='garden';}
  else currentTheme='day';
}

// ─── COLLISION ────────────────────────────────────────────────
function checkCollision(){
  if(!arrow.flying)return;
  const dx=arrow.x-target.x,dy=arrow.y-target.y;
  if(Math.hypot(dx,dy)<CFG.hitZoneR){onHit();return;}
  if(arrow.x<-40||arrow.x>W+40||arrow.y<-40||arrow.y>H+80) onMiss();
}

// ─── HIT ──────────────────────────────────────────────────────
function onHit(){
  arrow.flying=false;
  hitCooldown=true;
  score++;streak++;
  coins+=CFG.coinsPerHit+(arrow.isPower?3:0)+(streak>=3?1:0);
  const newLevel=1+Math.floor(score/5);
  if(newLevel>level){
    level=newLevel;levelNumEl.textContent=level;
    showLevelUp(level);updateTheme(level);buildBgHearts();
    CFG.targetMoveSp=0.44+(level-1)*.1;
  }
  scoreEl.textContent=score;streakEl.textContent=streak;coinsEl.textContent=coins;
  bumpVal(scoreEl);bumpVal(streakEl);bumpVal(coins>0?coinsEl:coinsEl);
  if(streak>=CFG.comboThreshold)showCombo(streak);
  if(arrow.isPower)playPower();else playHit();
  if(navigator.vibrate)navigator.vibrate(arrow.isPower?[60,15,80]:[35,12,50]);
  target.hit=true;target.hitTimer=0;
  spawnParticles(target.x,target.y);spawnDomEffect(target.x,target.y);
  embeddedArrows.push({x:target.x+(Math.random()-.5)*20,y:target.y+(Math.random()-.5)*20,angle:Math.atan2(arrow.vy,arrow.vx),alpha:1});
  const entry=HIT_MSGS[Math.floor(Math.random()*HIT_MSGS.length)];
  const icons=["♡","✦","🌸","✿","❀","✨","💕","🌷","💘","🌺","💫","🩷"];
  showMessage(entry.en,entry.pt,icons[Math.floor(Math.random()*icons.length)],false);
  setTimeout(()=>{target.baseX=W*(0.42+Math.random()*.38);target.baseY=H*(0.22+Math.random()*.48);target.hit=false;},820);
  setTimeout(()=>resetArrowToRest(),460);
}

// ─── MISS ─────────────────────────────────────────────────────
function onMiss(){
  arrow.flying=false;
  const had=streak>=5;streak=0;streakEl.textContent=0;
  playMiss();if(navigator.vibrate)navigator.vibrate([15,25,15]);
  if(had){heartbreakEl.classList.remove('show');void heartbreakEl.offsetWidth;heartbreakEl.classList.add('show');setTimeout(()=>heartbreakEl.classList.remove('show'),2500);}
  const m=MISS_MSGS[Math.floor(Math.random()*MISS_MSGS.length)];
  showMessage(m.en,m.pt,'💔',true);
  setTimeout(()=>resetArrowToRest(),300);
}

// ─── MESSAGES ─────────────────────────────────────────────────
function showMessage(en,pt,icon,isMiss){
  if(msgTimer){clearTimeout(msgTimer);msgTimer=null;}
  msgInner.classList.remove('show','hide');void msgInner.offsetWidth;
  msgIcon.textContent=icon;
  msgText.textContent=en;msgText.className=isMiss?'miss':'';
  msgTrans.textContent=`— ${pt}`;msgTrans.className=isMiss?'miss':'';
  msgInner.classList.add('show');
  const dur=isMiss?2300:2000;
  msgTimer=setTimeout(()=>{msgInner.classList.remove('show');msgInner.classList.add('hide');msgTimer=setTimeout(()=>msgInner.classList.remove('hide'),600);},dur);
}
function showCombo(s){
  if(comboTimer){clearTimeout(comboTimer);comboTimer=null;}
  const label=COMBO_LABELS[Math.min(s,COMBO_LABELS.length-1)];if(!label)return;
  comboPop.textContent=label;comboPop.classList.remove('show');void comboPop.offsetWidth;comboPop.classList.add('show');
  comboTimer=setTimeout(()=>comboPop.classList.remove('show'),1700);
}
function showLevelUp(lv){
  levelupNumEl.textContent=lv;levelupEl.classList.remove('show');void levelupEl.offsetWidth;levelupEl.classList.add('show');
  setTimeout(()=>levelupEl.classList.remove('show'),3400);
}
function bumpVal(el){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');setTimeout(()=>el.classList.remove('bump'),380);}

// ─── SHOP (BUG FIXED) ─────────────────────────────────────────
// Root cause: prev code used equipped[tab] where tab='skins' but key was 'skin'.
// Now shopEquipped uses same keys as SHOP: skins, effects, trails, bows.
let activeShopTab='skins';

function openShop(){
  if(bow.pulling)resetArrowToRest();
  shopModal.classList.add('open');
  renderShopTab(activeShopTab);
}
function closeShop(){shopModal.classList.remove('open');}
shopBtn.addEventListener('click',openShop);
shopClose.addEventListener('click',closeShop);
shopModal.addEventListener('click',e=>{if(e.target===shopModal)closeShop();});
tabBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    tabBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');activeShopTab=btn.dataset.tab;renderShopTab(activeShopTab);
  });
});

function renderShopTab(tab){
  shopCoinsEl.textContent=coins;
  shopItemsEl.innerHTML='';
  SHOP[tab].forEach(item=>{
    const isOwned=shopOwned[tab].includes(item.id);
    const isEq   =shopEquipped[tab]===item.id;
    const div=document.createElement('div');
    div.className='shop-item'+(isEq?' equipped':isOwned?' owned':'');

    let btnLabel,btnCls;
    if(isEq)           {btnLabel='✓ Equipado'; btnCls='shop-btn-buy btn-equipped';}
    else if(isOwned)   {btnLabel='Equipar';    btnCls='shop-btn-buy btn-equip';}
    else if(!item.price){btnLabel='Grátis';    btnCls='shop-btn-buy btn-free';}
    else if(coins>=item.price){btnLabel=`✨ ${item.price}`;btnCls='shop-btn-buy';}
    else               {btnLabel=`✨ ${item.price}`;btnCls='shop-btn-buy btn-poor';}

    div.innerHTML=`
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-desc">${item.desc}</div>
      <button class="${btnCls}" data-id="${item.id}">${btnLabel}</button>
    `;
    div.querySelector('button').addEventListener('click',()=>doBuyOrEquip(item,tab));
    shopItemsEl.appendChild(div);
  });
}

function doBuyOrEquip(item,tab){
  const isOwned=shopOwned[tab].includes(item.id);
  const isEq   =shopEquipped[tab]===item.id;
  if(isEq) return; // already equipped, nothing to do

  if(isOwned){
    // Just equip
    shopEquipped[tab]=item.id;
    playBuy();
    renderShopTab(tab);
    return;
  }
  // Try to purchase
  const price=item.price||0;
  if(coins>=price){
    coins-=price;
    coinsEl.textContent=coins;
    shopOwned[tab].push(item.id);
    shopEquipped[tab]=item.id;
    playBuy();
    if(navigator.vibrate)navigator.vibrate([18,8,28]);
    renderShopTab(tab);
  }else{
    // Shake the button
    const btn=shopItemsEl.querySelector(`[data-id="${item.id}"]`);
    if(btn){btn.classList.remove('shake');void btn.offsetWidth;btn.classList.add('shake');setTimeout(()=>btn.classList.remove('shake'),400);}
  }
}

// ─── UPDATE / RENDER ──────────────────────────────────────────
function update(t){
  target.angle+=CFG.targetMoveSp;
  target.x=target.baseX+Math.cos(target.angle*Math.PI/180)*CFG.targetMoveAmp*.55;
  target.y=target.baseY+Math.sin(target.angle*Math.PI/90) *CFG.targetMoveAmp*.38;
  if(target.hit)target.hitTimer++;
  if(arrow.flying){
    arrow.trail.push({x:arrow.x,y:arrow.y});
    if(arrow.trail.length>CFG.trailLen)arrow.trail.shift();
    arrow.x+=arrow.vx;arrow.y+=arrow.vy;arrow.vy+=CFG.gravity;arrow.vx*=.996;
    checkCollision();
  }
  maybeLaunchCupid(t);
}
function render(t){
  ctx.clearRect(0,0,W,H);
  drawBackground(t);drawPullGuide();drawTarget(t);drawParticles();drawBow(t);drawArrow();
}
function loop(t){if(!gameActive)return;update(t);render(t);rafId=requestAnimationFrame(loop);}

// ─── START GAME ───────────────────────────────────────────────
function startGame(){
  score=0;streak=0;coins=0;level=1;
  scoreEl.textContent=0;streakEl.textContent=0;coinsEl.textContent=0;levelNumEl.textContent=1;
  CFG.targetMoveSp=0.44;hitCooldown=false;pointerDown=false;activePointerId=-1;
  resize();buildBgHearts();initBgSparkles();
  target.baseX=W*CFG.targetX_pct;target.baseY=H*CFG.targetY_pct;
  target.angle=0;target.hit=false;updateTheme(1);resetArrowToRest();
  gameActive=true;if(rafId)cancelAnimationFrame(rafId);rafId=requestAnimationFrame(loop);
}

// ─── INTRO ────────────────────────────────────────────────────
startBtn.addEventListener('click',()=>{
  introScreen.classList.add('fade-out');
  setTimeout(()=>{introScreen.style.display='none';startGame();},820);
});
startBtn.addEventListener('touchend',e=>{e.preventDefault();startBtn.click();});
window.addEventListener('resize',()=>{if(gameActive)resize();});
buildBgHearts();

// ═══════════════════════════════════════════════════════════════
//  MAZE EASTER EGG
// ═══════════════════════════════════════════════════════════════

// ── Maze config ──
const MCFG = {
  cols:  11,   // must be odd
  rows:  15,   // must be odd
  cell:  0,    // computed on open
  pSize: 0,    // player size computed
};

let mazeGrid       = [];   // 0=passage,1=wall
let mazePlayerC    = 0;    // player col
let mazePlayerR    = 0;    // player row
let mazeGoalC      = 0;
let mazeGoalR      = 0;
let mazeActive     = false;
let mazeAnimFrame  = null;
let mazeMoveQueue  = [];
let mazeMoveThrottle = 0;
let mazeParticles  = [];
let mazeTrail      = [];   // player trail

// ── Generate maze using recursive backtracker ──
function generateMaze(cols,rows){
  const grid=Array.from({length:rows},()=>Array(cols).fill(1));
  function carve(c,r){
    const dirs=[[0,-2],[0,2],[-2,0],[2,0]].sort(()=>Math.random()-.5);
    for(const [dc,dr] of dirs){
      const nc=c+dc,nr=r+dr;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&grid[nr][nc]===1){
        grid[r+dr/2][c+dc/2]=0;
        grid[nr][nc]=0;
        carve(nc,nr);
      }
    }
  }
  grid[1][1]=0;carve(1,1);
  return grid;
}

function openMaze(){
  gameActive=false;
  playMaze();

  // Size canvas to fit screen
  const maxW=Math.min(window.innerWidth-32,420);
  const maxH=Math.min(window.innerHeight*0.52,380);
  MCFG.cell=Math.floor(Math.min(maxW/MCFG.cols,maxH/MCFG.rows));
  MCFG.pSize=Math.floor(MCFG.cell*0.55);

  mazeCanvas.width =MCFG.cols*MCFG.cell;
  mazeCanvas.height=MCFG.rows*MCFG.cell;
  mazeCanvas.style.width =mazeCanvas.width+'px';
  mazeCanvas.style.height=mazeCanvas.height+'px';

  mazeGrid=generateMaze(MCFG.cols,MCFG.rows);
  mazePlayerC=1;mazePlayerR=1;
  mazeGoalC=MCFG.cols-2;mazeGoalR=MCFG.rows-2;

  mazeParticles=[];mazeTrail=[];mazeMoveQueue=[];
  mazeActive=true;
  mazeOverlay.classList.add('show');
  mazeOverlay.style.display='flex';

  if(mazeAnimFrame)cancelAnimationFrame(mazeAnimFrame);
  mazeLoop();
}

function closeMaze(){
  mazeActive=false;
  mazeOverlay.classList.remove('show');
  mazeOverlay.style.display='none';
  if(mazeAnimFrame)cancelAnimationFrame(mazeAnimFrame);
  gameActive=true;
  rafId=requestAnimationFrame(loop);
}

// ── Maze render ──
function drawMaze(t){
  const {cols,rows,cell}=MCFG;
  mctx.clearRect(0,0,mazeCanvas.width,mazeCanvas.height);

  // Background
  mctx.fillStyle='#100820';
  mctx.fillRect(0,0,mazeCanvas.width,mazeCanvas.height);

  // Walls and passages
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const x=c*cell,y=r*cell;
      if(mazeGrid[r][c]===1){
        // Wall gradient
        const g=mctx.createLinearGradient(x,y,x+cell,y+cell);
        g.addColorStop(0,'#2a0a4a');g.addColorStop(1,'#1a0535');
        mctx.fillStyle=g;mctx.fillRect(x,y,cell,cell);
        // Wall glow edge
        mctx.strokeStyle='rgba(180,100,255,.18)';mctx.lineWidth=.5;mctx.strokeRect(x+.5,y+.5,cell-1,cell-1);
      }else{
        mctx.fillStyle='rgba(255,220,240,.04)';mctx.fillRect(x,y,cell,cell);
      }
    }
  }

  // Trail
  mazeTrail.forEach((t,i)=>{
    const a=i/mazeTrail.length;
    mctx.save();mctx.globalAlpha=a*.5;
    mctx.fillStyle=`hsl(${320+i*2},90%,70%)`;
    const tx=t.c*cell+cell/2,ty=t.r*cell+cell/2;
    mctx.beginPath();mctx.arc(tx,ty,MCFG.pSize*.3,0,Math.PI*2);mctx.fill();
    mctx.restore();
  });

  // Goal — pulsing heart
  const gx=mazeGoalC*cell+cell/2,gy=mazeGoalR*cell+cell/2;
  const gPulse=1+Math.sin(t*.004)*.15;
  mctx.save();mctx.translate(gx,gy);mctx.scale(gPulse,gPulse);
  // Glow
  const gg=mctx.createRadialGradient(0,0,0,0,0,cell*.8);
  gg.addColorStop(0,'rgba(248,120,160,.5)');gg.addColorStop(1,'transparent');
  mctx.fillStyle=gg;mctx.beginPath();mctx.arc(0,0,cell*.8,0,Math.PI*2);mctx.fill();
  mctx.font=`${cell*.8}px serif`;mctx.textAlign='center';mctx.textBaseline='middle';
  mctx.fillText('💕',0,1);
  mctx.restore();

  // Player — glowing circle with heart
  const px=mazePlayerC*cell+cell/2,py=mazePlayerR*cell+cell/2;
  mctx.save();
  // Player glow
  const pg=mctx.createRadialGradient(px,py,0,px,py,MCFG.pSize*1.4);
  pg.addColorStop(0,'rgba(248,180,220,.7)');pg.addColorStop(1,'transparent');
  mctx.fillStyle=pg;mctx.beginPath();mctx.arc(px,py,MCFG.pSize*1.4,0,Math.PI*2);mctx.fill();
  mctx.font=`${MCFG.pSize*1.1}px serif`;mctx.textAlign='center';mctx.textBaseline='middle';
  mctx.fillText('🏹',px,py+1);
  mctx.restore();

  // Maze particles (sparkles)
  mazeParticles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.alpha-=.018;
    if(p.alpha<=0)return;
    mctx.save();mctx.globalAlpha=p.alpha;
    mctx.fillStyle=p.color;mctx.font=`${p.size}px serif`;
    mctx.textAlign='center';mctx.textBaseline='middle';
    mctx.fillText(p.ch,p.x,p.y);mctx.restore();
  });
  mazeParticles=mazeParticles.filter(p=>p.alpha>0);

  // Vignette
  const vg=mctx.createRadialGradient(mazeCanvas.width/2,mazeCanvas.height/2,0,mazeCanvas.width/2,mazeCanvas.height/2,mazeCanvas.width*.7);
  vg.addColorStop(0,'transparent');vg.addColorStop(1,'rgba(10,2,20,.55)');
  mctx.fillStyle=vg;mctx.fillRect(0,0,mazeCanvas.width,mazeCanvas.height);
}

function mazeLoop(t=0){
  if(!mazeActive)return;
  // Process queued moves
  if(mazeMoveQueue.length>0&&t-mazeMoveThrottle>120){
    const {dc,dr}=mazeMoveQueue.shift();
    mazeMove(dc,dr);mazeMoveThrottle=t;
  }
  drawMaze(t);
  mazeAnimFrame=requestAnimationFrame(mazeLoop);
}

function mazeMove(dc,dr){
  const nc=mazePlayerC+dc, nr=mazePlayerR+dr;
  if(nc<0||nc>=MCFG.cols||nr<0||nr>=MCFG.rows)return;
  if(mazeGrid[nr][nc]===1)return;
  // Add trail
  mazeTrail.push({c:mazePlayerC,r:mazePlayerR});
  if(mazeTrail.length>12)mazeTrail.shift();
  mazePlayerC=nc;mazePlayerR=nr;
  // Spawn sparkle
  const px=nc*MCFG.cell+MCFG.cell/2, py=nr*MCFG.cell+MCFG.cell/2;
  mazeParticles.push({x:px,y:py,vx:(Math.random()-.5)*1.5,vy:-1-Math.random(),alpha:.9,color:'#f7a8b8',size:10,ch:'✦'});
  if(navigator.vibrate)navigator.vibrate(8);
  // Check win
  if(nc===mazeGoalC&&nr===mazeGoalR) setTimeout(onMazeWin,200);
}

function onMazeWin(){
  mazeActive=false;if(mazeAnimFrame)cancelAnimationFrame(mazeAnimFrame);
  // Big particle burst on goal
  for(let i=0;i<18;i++){
    const ang=Math.random()*Math.PI*2,spd=1+Math.random()*3;
    const gx=mazeGoalC*MCFG.cell+MCFG.cell/2, gy=mazeGoalR*MCFG.cell+MCFG.cell/2;
    mazeParticles.push({x:gx,y:gy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,alpha:1,color:'#f7a8b8',size:14,ch:['💕','🌸','✨','💫'][Math.floor(Math.random()*4)]});
  }
  // Play victory melody then show letter
  playLoveLetter();
  if(navigator.vibrate)navigator.vibrate([40,20,80,20,120]);
  setTimeout(()=>{
    mazeOverlay.classList.remove('show');mazeOverlay.style.display='none';
    openLoveLetter();
  },900);
}

// ── D-pad controls ──
function queueMove(dc,dr){if(mazeActive)mazeMoveQueue.push({dc,dr});}
document.getElementById('dpad-up').addEventListener('click',()=>queueMove(0,-1));
document.getElementById('dpad-down').addEventListener('click',()=>queueMove(0,1));
document.getElementById('dpad-left').addEventListener('click',()=>queueMove(-1,0));
document.getElementById('dpad-right').addEventListener('click',()=>queueMove(1,0));
document.getElementById('dpad-up').addEventListener('touchstart',e=>{e.preventDefault();queueMove(0,-1);},{passive:false});
document.getElementById('dpad-down').addEventListener('touchstart',e=>{e.preventDefault();queueMove(0,1);},{passive:false});
document.getElementById('dpad-left').addEventListener('touchstart',e=>{e.preventDefault();queueMove(-1,0);},{passive:false});
document.getElementById('dpad-right').addEventListener('touchstart',e=>{e.preventDefault();queueMove(1,0);},{passive:false});

// ── Keyboard controls ──
document.addEventListener('keydown',e=>{
  if(!mazeActive)return;
  const map={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
  const m=map[e.key];if(m){e.preventDefault();queueMove(...m);}
});

// ── Swipe on maze canvas ──
let mSwipeX=0,mSwipeY=0;
mazeCanvas.addEventListener('touchstart',e=>{e.preventDefault();mSwipeX=e.touches[0].clientX;mSwipeY=e.touches[0].clientY;},{passive:false});
mazeCanvas.addEventListener('touchend',e=>{
  e.preventDefault();
  const dx=e.changedTouches[0].clientX-mSwipeX, dy=e.changedTouches[0].clientY-mSwipeY;
  if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
  if(Math.abs(dx)>Math.abs(dy))queueMove(dx>0?1:-1,0);
  else queueMove(0,dy>0?1:-1);
},{passive:false});

// ═══════════════════════════════════════════════════════════════
//  LOVE LETTER
// ═══════════════════════════════════════════════════════════════
function openLoveLetter(){
  const letter=LOVE_LETTERS[Math.floor(Math.random()*LOVE_LETTERS.length)];
  loveLetterTxt.textContent=letter;
  loveLetter.style.display='flex';
  loveLetter.classList.remove('show');void loveLetter.offsetWidth;
  loveLetter.classList.add('show');
  // Rain hearts on body
  for(let i=0;i<12;i++){
    setTimeout(()=>{
      const el=document.createElement('span');
      el.style.cssText=`position:fixed;left:${Math.random()*100}%;top:-30px;font-size:${1+Math.random()*1.5}rem;pointer-events:none;z-index:75;animation:floatUp ${4+Math.random()*4}s linear forwards;--x:${Math.random()*100}%;--dur:${4+Math.random()*4}s;--delay:0s;--rot:${(Math.random()-.5)*30}deg;color:hsl(${330+Math.random()*30},80%,75%)`;
      el.textContent=['💕','🌸','✦','💝','🌷','✿'][Math.floor(Math.random()*6)];
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),9000);
    },i*200);
  }
}

loveLetterBack.addEventListener('click',()=>{
  loveLetter.classList.remove('show');
  setTimeout(()=>{loveLetter.style.display='none';},500);
  gameActive=true;if(rafId)cancelAnimationFrame(rafId);rafId=requestAnimationFrame(loop);
});
loveLetterBack.addEventListener('touchend',e=>{e.preventDefault();loveLetterBack.click();});