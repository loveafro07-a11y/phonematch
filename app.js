'use strict';
const PHONES = [
  {id:'iphone16',brand:'Apple',model:'iPhone 16 Pro',color:'#ccb7a6',dark:'#8c786b',type:'pro',tag:'Le goût des belles choses.',vibe:'Très grande classe ✦'},
  {id:'samsung24',brand:'Samsung',model:'Galaxy S24 Ultra',color:'#bdb1d3',dark:'#736580',type:'ultra',tag:'Pour les grandes ambitions.',vibe:'Toujours plus grand ↗'},
  {id:'pixel9',brand:'Google',model:'Pixel 9 Pro',color:'#d9afbb',dark:'#a47087',type:'pixel',tag:'Un regard un peu différent.',vibe:'Une belle connexion ✦'},
  {id:'nothing2',brand:'Nothing',model:'Phone (2)',color:'#e0e0df',dark:'#999da5',type:'nothing',tag:'Impossible de passer inaperçu.',vibe:'Esprit original ✧'},
  {id:'iphone15',brand:'Apple',model:'iPhone 15',color:'#b1cfbf',dark:'#669c88',type:'dual',tag:'Simplement dans ton élément.',vibe:'Ça te va si bien ↗'},
  {id:'xiaomi14',brand:'Xiaomi',model:'Xiaomi 14',color:'#98c5ba',dark:'#4d8d80',type:'square',tag:'Petit format, grande personnalité.',vibe:'Un match parfait ✦'},
  {id:'oneplus12',brand:'OnePlus',model:'OnePlus 12',color:'#88aca0',dark:'#406e62',type:'circle',tag:'Toujours une longueur d’avance.',vibe:'L’énergie est là ↗'},
  {id:'razr50',brand:'Motorola',model:'razr 50',color:'#dd9a73',dark:'#a55b43',type:'flip',tag:'Un petit twist dans ta vie.',vibe:'Surprise, surprise ✧'},
  {id:'infinix40',brand:'Infinix',model:'Note 40 Pro',color:'#b7b993',dark:'#777c55',type:'square',tag:'La créativité au bout des doigts.',vibe:'Un style bien à toi ✦'},
  {id:'camon30',brand:'Tecno',model:'Camon 30',color:'#c2b09a',dark:'#867563',type:'circle',tag:'Ta prochaine idée commence ici.',vibe:'L’inspiration appelle ↗'},
  {id:'zflip6',brand:'Samsung',model:'Galaxy Z Flip6',color:'#abc0e3',dark:'#6e84b5',type:'flip',tag:'Petit téléphone, grand effet.',vibe:'Le charme opère ✦'},
  {id:'sony1',brand:'Sony',model:'Xperia 1 VI',color:'#b35357',dark:'#752a35',type:'vertical',tag:'Pour voir les choses en grand.',vibe:'Une âme d’artiste ✧'}
];
const $ = id => document.getElementById(id);
const STORE='phone-match-session-v1';
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let entries=[], busy=false, sound=false, audioContext, toastTimer;
let artId=0;
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function normalizeName(value){return value.normalize('NFKC').trim().replace(/\s+/g,' ');}
function nameKey(value){return normalizeName(value).toLocaleLowerCase('fr');}
function phoneById(id){return PHONES.find(p=>p.id===id)||PHONES[0];}
function randomIndex(length){const a=new Uint32Array(1);const cutoff=Math.floor(4294967296/length)*length;do{crypto.getRandomValues(a);}while(a[0]>=cutoff);return a[0]%length;}
function phoneSVG(phone,mini=false){
  const n='phone'+(++artId); const lens=(x,y,r=12)=>`<circle cx="${x}" cy="${y}" r="${r+2}" fill="${phone.dark}" stroke="#ffffff60" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r}" fill="#161723"/><circle cx="${x-2}" cy="${y-2}" r="${r*.45}" fill="#29354a"/><circle cx="${x-3}" cy="${y-4}" r="${r*.16}" fill="#8197b0" opacity=".65"/>`;
  let camera='';
  switch(phone.type){
    case 'pro': camera=`<rect x="21" y="19" width="68" height="70" rx="18" fill="${phone.color}" stroke="${phone.dark}"/>${lens(41,39)}${lens(41,69)}${lens(69,55)}<circle cx="70" cy="28" r="5" fill="#f6edd9"/><circle cx="70" cy="79" r="4" fill="#46433e"/>`;break;
    case 'dual':camera=`<rect x="23" y="21" width="60" height="63" rx="18" fill="${phone.color}" stroke="${phone.dark}"/>${lens(42,39)}${lens(64,64)}<circle cx="66" cy="34" r="4" fill="#fff4dd"/>`;break;
    case 'ultra':camera=`${lens(32,36,11)}${lens(32,69,11)}${lens(32,102,11)}${lens(62,46,7)}${lens(62,81,7)}<circle cx="62" cy="64" r="3" fill="#fff3dd"/>`;break;
    case 'pixel':camera=`<rect x="18" y="34" width="125" height="42" rx="20" fill="#bdabb5" stroke="#eee5ea"/><rect x="24" y="41" width="89" height="27" rx="13" fill="#1c202a"/>${lens(39,54,9)}${lens(68,54,9)}${lens(97,54,9)}<circle cx="126" cy="48" r="5" fill="#ffefd8"/><circle cx="126" cy="62" r="4" fill="#77717c"/>`;break;
    case 'nothing':camera=`<path d="M35 95V32h22M107 55h17v48M47 141a35 35 0 1 1 10 45M80 202v49" fill="none" stroke="#f9f9f4" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="156" r="43" fill="none" stroke="#9c9da5" stroke-width="2"/><path d="M28 214h22v43H28zM104 212h26v41h-26z" fill="none" stroke="#777880" opacity=".5"/>${lens(36,35,10)}${lens(36,64,10)}`;break;
    case 'square':camera=`<rect x="22" y="20" width="82" height="70" rx="15" fill="#292e33" stroke="#7c8b8e"/>${lens(43,42)}${lens(43,70,10)}${lens(77,43,11)}<circle cx="78" cy="70" r="4" fill="#ece4d3"/>`;break;
    case 'circle':camera=`<circle cx="62" cy="60" r="41" fill="#33393c" stroke="#b5bdbb" stroke-width="2"/>${lens(47,43,11)}${lens(77,43,11)}${lens(47,73,11)}<circle cx="77" cy="73" r="5" fill="#e7e1d6"/>`;break;
    case 'flip':camera=`<rect x="17" y="17" width="126" height="119" rx="16" fill="#1b1c26"/><path d="M17 143h126" stroke="${phone.dark}" stroke-width="3"/>${lens(35,34,9)}${lens(64,34,9)}<circle cx="89" cy="33" r="3" fill="#eee3cd"/><text x="79" y="97" fill="#dfd0ff" font-family="sans-serif" font-size="28" font-weight="200" text-anchor="middle">12:30</text>`;break;
    default:camera=`<rect x="24" y="21" width="32" height="99" rx="16" fill="#24252b"/>${lens(40,39,9)}${lens(40,70,9)}${lens(40,101,9)}<circle cx="67" cy="36" r="4" fill="#eee7d6"/>`;
  }
  const brandMark=phone.brand==='Apple'?'<path d="M78 148c-5-6-16-4-17 8-1 9 6 21 11 21 4 0 6-3 10-2 5 1 7 4 11-3 3-4 5-9 5-9-7-3-8-12-2-16-5-7-11-2-18 1Zm2-6c0-7 5-11 10-12 1 6-3 11-10 12Z" fill="#ffffff70"/>':`<text x="80" y="${phone.type==='nothing'?235:178}" text-anchor="middle" fill="#ffffff75" font-family="sans-serif" font-size="${phone.brand==='Nothing'?9:11}" letter-spacing="1">${phone.brand.toUpperCase()}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 290" fill="none"><defs><linearGradient id="${n}" x1="15" y1="0" x2="155" y2="290" gradientUnits="userSpaceOnUse"><stop stop-color="${phone.color}"/><stop offset=".5" stop-color="${phone.color}"/><stop offset="1" stop-color="${phone.dark}"/></linearGradient><linearGradient id="${n}s"><stop stop-color="#fff" stop-opacity=".28"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect x="11" y="8" width="139" height="275" rx="23" fill="${phone.dark}" stroke="#ffffff55" stroke-width="1.4"/><rect x="14" y="10" width="132" height="270" rx="21" fill="url(#${n})"/><rect x="15" y="11" width="130" height="269" rx="20" stroke="#ffffff60" stroke-width=".8"/><rect x="8" y="63" width="3" height="32" rx="1.5" fill="${phone.dark}"/><rect x="149" y="84" width="3" height="42" rx="1.5" fill="${phone.dark}"/>${camera}${mini?'':brandMark}<rect x="15" y="11" width="130" height="269" rx="20" fill="url(#${n}s)"/><path d="M32 14h93" stroke="#ffffff65" stroke-linecap="round"/></svg>`;
}
function save(){try{localStorage.setItem(STORE,JSON.stringify(entries));}catch{showToast('Stockage indisponible : garde cet onglet ouvert pour conserver la session.');}}
function loadSession(){try{const loaded=JSON.parse(localStorage.getItem(STORE)||'[]');if(Array.isArray(loaded)){const seen=new Set();entries=loaded.filter(e=>{if(!e||typeof e.name!=='string'||!e.name.trim()||e.name.length>40||!PHONES.some(p=>p.id===e.phoneId)||seen.has(nameKey(e.name)))return false;seen.add(nameKey(e.name));return true;}).slice(-500);}}catch{entries=[];}}
function renderList(){
  const q=nameKey($('search-input').value);
  const filtered=entries.map((e,i)=>({...e,index:i})).reverse().filter(e=>nameKey(e.name).includes(q));
  $('match-count').textContent=String(entries.length);
  $('empty-state').hidden=entries.length>0;
  $('no-results').hidden=entries.length===0||filtered.length>0;
  $('reset-open').disabled=entries.length===0||busy;
  $('participant-list').innerHTML=filtered.map(e=>{
    const p=phoneById(e.phoneId),latest=e.index===entries.length-1;
    return `<button type="button" class="participant-row${latest?' latest':''}" data-index="${e.index}" aria-label="${escapeHTML('Revoir le match de '+e.name+' : '+p.brand+' '+p.model)}" ${busy?'disabled':''}><span class="person-cell"><span class="person-index">${String(e.index+1).padStart(2,'0')}</span><span class="person-avatar" aria-hidden="true">${escapeHTML(Array.from(e.name)[0].toLocaleUpperCase('fr'))}</span><span class="person-text"><span class="person-name" title="${escapeHTML(e.name)}">${escapeHTML(e.name)}</span>${latest?'<span class="new-label">DERNIER MATCH</span>':''}</span></span><span class="match-cell"><span class="mini-phone" aria-hidden="true">${phoneSVG(p,true)}</span><span class="match-info"><span class="match-brand">${escapeHTML(p.brand)}</span><span class="match-model">${escapeHTML(p.model)}</span></span></span></button>`;
  }).join('');
}
function renderResult(entry,animate=false){
  const p=phoneById(entry.phoneId);
  $('next-player').hidden=false;
  $('result-eyebrow').textContent='TON MATCH';$('result-name').textContent=entry.name+', voici ton match.';
  $('result-title').textContent=p.tag;
  $('phone-art').innerHTML=phoneSVG(p);
  $('phone-brand').textContent=p.brand.toUpperCase();$('phone-model').textContent=p.model;
  $('phone-trait').textContent='Le hasard vous a bien trouvés.';$('float-tag').textContent=p.vibe;
  $('result-footnote').innerHTML='Illustration du téléphone.<br>Un tirage pour le plaisir, sans lot à gagner.';
  if(animate){$('result-card').classList.add('is-revealed');setTimeout(()=>$('result-card').classList.remove('is-revealed'),750);}
}
function resetResult(){
  $('next-player').hidden=true;
  $('result-eyebrow').textContent='LE PROCHAIN MATCH';$('result-name').textContent='Ça pourrait être toi.';
  $('result-title').innerHTML='Une belle surprise<br>t’attend.';$('phone-art').innerHTML=phoneSVG({...PHONES[0],color:'#c7badc',dark:'#8b779f'});
  $('phone-brand').textContent='À TOI DE JOUER';$('phone-model').textContent='Quel sera ton match ?';$('phone-trait').textContent='Un prénom suffit pour le découvrir.';
  $('float-tag').textContent='Le destin appelle ↗';$('result-footnote').innerHTML='Un match unique par prénom,<br>le temps d’une session.';
}
function showToast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
function tone(freq,duration=.08,gain=.025){if(!sound)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(gain,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration);}catch{}}
function celebrate(){if(reduceMotion)return;const box=$('confetti');for(let i=0;i<32;i++){const el=document.createElement('i');el.className='confetti-piece';el.style.background=['#b5a0ff','#d4f4db','#e5b88c','#f6f2ff'][i%4];el.style.setProperty('--x',((Math.random()-.5)*600)+'px');el.style.setProperty('--y',((Math.random()-.35)*580)+'px');el.style.setProperty('--r',(Math.random()*720-360)+'deg');box.append(el);}setTimeout(()=>box.replaceChildren(),1700);}
function setBusy(value){
  busy=value;
  $('name-input').disabled=value;
  $('reveal-button').disabled=value;
  $('reset-open').disabled=value||entries.length===0;
  $('demo-button').disabled=value;
  $('next-player').disabled=value;
  $('result-card').setAttribute('aria-busy',String(value));
  $('participant-list').querySelectorAll('button').forEach(button=>button.disabled=value);
  $('reveal-button').innerHTML=value?'Le destin choisit…':'Révéler <span aria-hidden="true">↗</span>';
}
function showResultOnMobile(){
  if(window.innerWidth<=740){
    $('name-input').blur();
    $('search-input').blur();
    $('result-card').scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
  }
}
function nextPlayer(){
  if(busy)return;
  $('name-input').value='';
  $('name-input').setCustomValidity('');
  $('name-input').focus({preventScroll:true});
  $('match-form').scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
}
async function shareGame(){
  if(!/^https?:$/.test(location.protocol)){
    showToast('Mets d’abord le jeu en ligne pour obtenir un lien à partager. La procédure est dans le fichier LIRE-MOI.');
    return;
  }
  const url=location.origin+location.pathname;
  if(navigator.share){
    try{
      await navigator.share({title:'Phone Match',text:'Quel téléphone va avec ton prénom ? À toi de jouer !',url});
      return;
    }catch(error){if(error.name==='AbortError')return;}
  }
  try{
    if(!navigator.clipboard)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url);
    showToast('Lien copié ! Colle-le dans ton message pour partager le jeu.');
  }catch{
    $('share-url').value=url;
    $('share-dialog').showModal();
    $('share-url').focus();
    $('share-url').select();
  }
}
async function reveal(name){
  if(busy)return;
  name=normalizeName(name);if(!name){$('name-input').setCustomValidity('Entre au moins un caractère visible.');$('name-input').reportValidity();return;}
  const existing=entries.find(e=>nameKey(e.name)===nameKey(name));
  if(existing){renderResult(existing);$('search-input').value='';renderList();showToast(name+' a déjà son match dans cette session.');$('announcement').textContent=name+' : '+phoneById(existing.phoneId).model;if(window.innerWidth>740)$('name-input').select();showResultOnMobile();return;}
  if(entries.length>=500){showToast('La session contient 500 prénoms. Lance une nouvelle session pour continuer.');return;}
  setBusy(true);$('search-input').value='';$('result-card').classList.add('is-spinning');$('result-eyebrow').textContent='LE DESTIN HÉSITE…';$('result-name').textContent=name+', on cherche ton match.';$('result-title').textContent='Un peu de suspense…';$('float-tag').textContent='Ça arrive… ✦';
  $('announcement').textContent='Tirage en cours pour '+name+'.';tone(330);
  const count=reduceMotion?1:12;
  for(let i=0;i<count;i++){const p=PHONES[randomIndex(PHONES.length)];$('phone-art').innerHTML=phoneSVG(p);$('phone-brand').textContent=p.brand.toUpperCase();$('phone-model').textContent=p.model;tone(200+i*32,.04,.01);await new Promise(resolve=>setTimeout(resolve,reduceMotion?200:85+i*8));}
  const entry={name,phoneId:PHONES[randomIndex(PHONES.length)].id};entries.push(entry);save();
  $('result-card').classList.remove('is-spinning');setBusy(false);renderResult(entry,true);renderList();$('participant-list').scrollTop=0;
  $('announcement').textContent=name+' reçoit le '+phoneById(entry.phoneId).brand+' '+phoneById(entry.phoneId).model+'.';
  $('name-input').value='';if(window.innerWidth>740)$('name-input').focus({preventScroll:true});celebrate();tone(523,.22);setTimeout(()=>tone(659,.22),120);setTimeout(()=>tone(784,.4),230);
  showResultOnMobile();
}
$('match-form').addEventListener('submit',event=>{event.preventDefault();reveal($('name-input').value);});
$('name-input').addEventListener('input',()=>{ $('name-input').setCustomValidity(''); });
$('search-input').addEventListener('input',renderList);
$('next-player').addEventListener('click',nextPlayer);
$('share-game').addEventListener('click',shareGame);
$('participant-list').addEventListener('click',event=>{
  const row=event.target.closest('button[data-index]');
  if(!row||busy)return;
  const entry=entries[Number(row.dataset.index)];
  if(!entry)return;
  renderResult(entry,true);
  $('announcement').textContent=entry.name+' : '+phoneById(entry.phoneId).model;
  showResultOnMobile();
});
$('demo-button').addEventListener('click',()=>{if(busy||entries.length)return;entries=[{name:'Brayann',phoneId:'samsung24'},{name:'Sarah',phoneId:'pixel9'},{name:'Kevin',phoneId:'nothing2'},{name:'Amina',phoneId:'iphone16'}];save();renderList();renderResult(entries.at(-1),true);showToast('4 exemples ajoutés. À toi de saisir le prochain prénom.');$('name-input').focus();});
$('sound-toggle').addEventListener('click',()=>{sound=!sound;$('sound-toggle').setAttribute('aria-pressed',String(sound));const label=sound?'Couper le son':'Activer le son';$('sound-toggle').title=label;$('sound-toggle').setAttribute('aria-label',label);$('sound-mark').setAttribute('d',sound?'M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14':'m16 9 5 6m0-6-5 6');if(sound)tone(660,.15);});
$('stage-toggle').addEventListener('click',()=>{const enabled=document.body.classList.toggle('stage-mode');$('stage-toggle').setAttribute('aria-pressed',String(enabled));$('stage-toggle').setAttribute('aria-label',enabled?'Quitter la diffusion':'Mode diffusion');$('stage-toggle').querySelector('span').textContent=enabled?'Quitter la diffusion':'Mode diffusion';showToast(enabled?'Vue diffusion activée. Tu peux partager cette fenêtre.':'Vue classique activée.');});
$('help-open').addEventListener('click',()=>$('help-dialog').showModal());
$('reset-open').addEventListener('click',()=>{if(!busy)$('reset-dialog').showModal();});
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>$(button.dataset.close).close()));
$('reset-confirm').addEventListener('click',()=>{if(busy)return;entries=[];save();$('search-input').value='';$('name-input').value='';$('name-input').setCustomValidity('');renderList();resetResult();$('reset-dialog').close();$('announcement').textContent='Nouvelle session. Ajoute un prénom pour commencer.';$('name-input').focus();showToast('Nouvelle session. Tout peut changer.');});
loadSession();renderList();if(entries.length)renderResult(entries.at(-1));else resetResult();
