'use strict';
(() => {
  const photos = [
    {file:'63312.jpg',alt:'You in a blue saree, holding roses',caption:'the one with the roses',label:'A LITTLE FLOWER MOMENT',title:'Flowers bhi<br><em>competition</em> mein hain.',line:'Roses cute hain… par meri nazar toh tum par hi ruk gayi. 🌹',position:'center 57%'},
    {file:'63308.jpg',alt:'Your portrait in a blue top',caption:'that little smile',label:'THAT SMILE, THOUGH',title:'Serious rehna?<br><em>Impossible.</em>',line:'Tumhari smile dekhkar meri serious rehne ki acting fail ho jaati hai. 😌',position:'center 55%'},
    {file:'63309.jpg',alt:'You sitting on a sofa in a blue saree',caption:'a little blue, a lot of charm',label:'BLUE LOOKS GOOD ON YOU',title:'Ye blue…<br><em>aur tum.</em>',line:'Kuch combinations bas perfect hote hain. Ye colour aur tum, for example. 💙',position:'center 57%'},
    {file:'63316.jpg',alt:'You on a walkway, wearing a beige top and jeans',caption:'effortlessly you',label:'NO EXTRA EFFORT NEEDED',title:'Simple look.<br><em>Full charm.</em>',line:'Tumhe impress karne ke liye mujhe website banani padi. Tum toh bas photo mein aa gayi. 😉',position:'center 55%'},
    {file:'63313.jpg',alt:'You in a red T-shirt at the cinema',caption:'main-character energy',label:'A LITTLE MAIN-CHARACTER ENERGY',title:'Movie se pehle hi<br><em>attention</em> chura li.',line:'Cinema mein movie dekhne aaye the… par is photo ki main character toh tum ho. 🎬',position:'center 45%'},
    {file:'63315.jpg',alt:'You standing in front of India Gate',caption:'the view got even better',label:'YOU MAKE THE VIEW BETTER',title:'Background iconic.<br><em>Tum bhi.</em>',line:'India Gate apni jagah… par is photo ka favourite part toh tum ho. ✨',position:'center 49%'},
    {file:'63310.jpg',alt:'You beside the red sandstone fort, in sunglasses',caption:'a little sunshine, a little attitude',label:'THAT COOL-GIRL MOMENT',title:'Thoda sunshine.<br><em>Thoda swag.</em>',line:'Sunglasses pehenkar tumne toh cool rehna bhi extra cute bana diya. 😎',position:'25% 50%'},
    {file:'63314.jpg',alt:'You seated in a pink traditional outfit',caption:'a moment worth pausing for',label:'AND THEN, THIS LOOK',title:'Okay…<br><em>ab kya bolu?</em>',line:'Is look ke liye ek compliment kaafi nahi. Bas… bahut khoobsurat lag rahi ho. 🤍',position:'center 62%'},
    {file:'63311.jpg',alt:'You sitting in a blue saree beside a warm lamp',caption:'the softest little moment',label:'SAVING A SOFT MOMENT FOR LAST',title:'Kuch photos<br><em>bas achhi lagti hain.</em>',line:'Ye wali bhi. Shayad isliye, kyunki tum ismein bilkul apni si lag rahi ho. ✨',position:'center 58%'}
  ];
  const byId = id => document.getElementById(id);
  const screens = [byId('intro'),byId('album'),byId('letter')];
  const song = byId('song');
  const musicButton = byId('music-button');
  const dots = byId('slide-dots');
  const thumbnails = byId('thumbnail-strip');
  const photo = byId('main-photo');
  let index = 0;
  let activeScreen = 'intro';
  let statusTimer;
  let confettiFrame = 0;
  song.volume = .7;

  function showScreen(id) {
    activeScreen = id;
    screens.forEach(section => { section.hidden = section.id !== id; });
    window.scrollTo({top:0,behavior:'instant'});
    const heading = byId(id === 'intro' ? 'intro-title' : id === 'album' ? 'album-title' : 'letter-title');
    heading.setAttribute('tabindex','-1');
    heading.focus({preventScroll:true});
  }
  function musicState() {
    const playing = !song.paused && !song.ended;
    musicButton.classList.toggle('is-playing',playing);
    musicButton.setAttribute('aria-pressed',String(playing));
    musicButton.setAttribute('aria-label',playing ? 'Pause Enna Sona' : 'Play Enna Sona');
    byId('music-label').textContent = playing ? 'Enna Sona · pause' : 'Enna Sona · play';
  }
  function status(text) {
    clearTimeout(statusTimer);
    const note = byId('status-note');
    note.textContent = text;
    note.hidden = false;
    statusTimer = window.setTimeout(() => { note.hidden = true; },5000);
  }
  function playMusic() {
    const promise = song.play();
    if (promise) promise.catch(() => { musicState(); status('Music ke liye upar Enna Sona par tap karo. ♫'); });
  }
  song.addEventListener('play',musicState);
  song.addEventListener('pause',musicState);
  song.addEventListener('ended',musicState);
  song.addEventListener('error',() => { musicState(); status('Song load nahi hua. Connection check karke play par tap karo.'); });
  musicButton.addEventListener('click',() => { if(song.paused) playMusic(); else song.pause(); });

  photos.forEach((p,i) => {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.className = 'slide-dot';
    dot.setAttribute('aria-label',`Photo ${i+1}: ${p.caption}`);
    dot.addEventListener('click',() => displayPhoto(i));
    dots.append(dot);
    const thumb = document.createElement('button');
    thumb.type = 'button'; thumb.className = 'thumbnail';
    thumb.setAttribute('aria-label',`Show photo ${i+1}: ${p.caption}`);
    thumb.style.setProperty('--thumb-position',p.position);
    const img = document.createElement('img');
    img.src = `assets/${p.file}`; img.alt = ''; img.loading = 'lazy';
    thumb.append(img); thumb.addEventListener('click',() => displayPhoto(i));
    thumbnails.append(thumb);
  });

  function displayPhoto(newIndex) {
    index = Math.max(0,Math.min(photos.length-1,newIndex));
    const p = photos[index];
    photo.src = `assets/${p.file}`;
    photo.alt = p.alt;
    photo.style.animation = 'none';
    void photo.offsetWidth;
    photo.style.animation = '';
    byId('portrait-haze').src = photo.src;
    byId('photo-caption').textContent = p.caption;
    const count = `${String(index+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
    byId('frame-count').textContent = count;
    byId('chapter-label').textContent = `${String(index+1).padStart(2,'0')} — ${p.label}`;
    byId('album-title').innerHTML = p.title;
    byId('compliment').textContent = p.line;
    byId('previous-button').disabled = index === 0;
    byId('next-button').textContent = index === photos.length-1 ? 'Ek chhoti si baat' : 'Agli photo';
    [...dots.children].forEach((button,i) => button.setAttribute('aria-current',String(i===index)));
    [...thumbnails.children].forEach((button,i) => button.setAttribute('aria-current',String(i===index)));
    if(index < photos.length-1) { const prefetch = new Image(); prefetch.src = `assets/${photos[index+1].file}`; }
  }
  byId('open-button').addEventListener('click',() => { playMusic(); displayPhoto(0); showScreen('album'); });
  byId('home-link').addEventListener('click',event => { event.preventDefault(); showScreen('intro'); });
  byId('previous-button').addEventListener('click',() => displayPhoto(index-1));
  byId('next-button').addEventListener('click',() => { if(index === photos.length-1) showScreen('letter'); else displayPhoto(index+1); });
  byId('note-button').addEventListener('click',() => showScreen('letter'));
  byId('again-button').addEventListener('click',() => { displayPhoto(0); showScreen('album'); });
  document.addEventListener('keydown',event => {
    if(activeScreen !== 'album' || event.altKey || event.ctrlKey || event.metaKey) return;
    if(event.key === 'ArrowRight') { event.preventDefault(); if(index < photos.length-1) displayPhoto(index+1); }
    if(event.key === 'ArrowLeft') { event.preventDefault(); displayPhoto(index-1); }
  });
  let touchStart = null;
  byId('portrait-frame').addEventListener('touchstart',event => { const t=event.changedTouches[0]; touchStart={x:t.clientX,y:t.clientY}; },{passive:true});
  byId('portrait-frame').addEventListener('touchend',event => {
    if(!touchStart) return;
    const t=event.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;
    if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5) {
      if(dx<0 && index<photos.length-1) displayPhoto(index+1);
      if(dx>0 && index>0) displayPhoto(index-1);
    }
    touchStart=null;
  },{passive:true});

  function celebrate() {
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = byId('confetti');
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    cancelAnimationFrame(confettiFrame);
    const w=window.innerWidth,h=window.innerHeight,dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
    const colours=['#efc990','#fff4e5','#a8b9e9','#d88e9b'];
    const particles=Array.from({length:85},() => ({x:w*.5,y:h*.55,vx:(Math.random()-.5)*12,vy:-Math.random()*12-3,size:Math.random()*4+3,angle:Math.random()*Math.PI,spin:(Math.random()-.5)*.18,colour:colours[Math.floor(Math.random()*colours.length)]}));
    let start;
    function draw(time) {
      if(start === undefined) start=time;
      ctx.clearRect(0,0,w,h);
      const alpha=Math.min(1,(3400-(time-start))/800);
      if(alpha<=0) return;
      ctx.globalAlpha=Math.max(0,alpha);
      particles.forEach(p => {p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.angle+=p.spin;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.colour;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.5);ctx.restore();});
      confettiFrame=requestAnimationFrame(draw);
    }
    confettiFrame=requestAnimationFrame(draw);
  }
  function react(little) {
    byId('reaction-buttons').hidden=true;
    byId('smile-question').textContent=little ? 'Thodi si? Mere liye kaafi hai. 😌' : 'Bas, isi smile ka intezaar tha. 😊';
    byId('reaction-result').textContent=little ? 'Baaki smile agli baat-cheet mein le lenge. 🤍' : 'Ab mera din bhi thoda aur achha ho gaya. 🤍';
    byId('reaction-result').hidden=false;
    celebrate();
  }
  byId('yes-button').addEventListener('click',() => react(false));
  byId('little-button').addEventListener('click',() => react(true));
  displayPhoto(0);
  musicState();
})();
