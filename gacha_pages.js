// gacha_pages.js
// Script commun pour gacha et inventory pages
// Utilise localStorage ; clé money1, money2 ; inv1, inv2 ; font1,font2

(function(){
  // --- données disponibles (ajoute ou change selon tes fonts réelles) ---
  const FONTS = [
    { name: "Serif", css: "serif", rarity: "common" },
    { name: "Monospace", css: "monospace", rarity: "common" },
    { name: "Cursive", css: "cursive", rarity: "uncommon" },
    { name: "Fantasy", css: "fantasy", rarity: "uncommon" },
    { name: "PressStart", css: "'Press Start 2P', monospace", rarity: "rare" }
  ];

  // price du tirage
  const PULL_COST = 20;

  // --- utilitaires ---
  function qs(name) {
    const params = new URLSearchParams(location.search);
    return params.get(name);
  }

  function getPlayer() {
    const p = Number(qs('player')) || 1;
    return (p === 1) ? 1 : 2;
  }

  function ensureStorage() {
    if (!localStorage.getItem('money1')) localStorage.setItem('money1', '50'); // init 50 par défaut
    if (!localStorage.getItem('money2')) localStorage.setItem('money2', '50');
    if (!localStorage.getItem('inv1')) localStorage.setItem('inv1', '[]');
    if (!localStorage.getItem('inv2')) localStorage.setItem('inv2', '[]');
    if (!localStorage.getItem('font1')) localStorage.setItem('font1', 'default');
    if (!localStorage.getItem('font2')) localStorage.setItem('font2', 'default');
  }

  // expose addMoney pour les scripts de jeu
  window.addMoney = function(player, amount){
    const key = 'money' + player;
    const cur = Number(localStorage.getItem(key) || 0);
    localStorage.setItem(key, String(cur + Number(amount)));
  };

  function getMoney(player){
    return Number(localStorage.getItem('money' + player) || 0);
  }

  function getInv(player){
    try {
      return JSON.parse(localStorage.getItem('inv' + player) || '[]');
    } catch(e){ return []; }
  }

  function saveInv(player, arr){
    localStorage.setItem('inv' + player, JSON.stringify(arr || []));
  }

  function addToInv(player, item){
    const inv = getInv(player);
    inv.push(item);
    saveInv(player, inv);
  }

  function equipFont(player, css){
    localStorage.setItem('font' + player, css);
  }

  function getFont(player){
    return localStorage.getItem('font' + player) || 'default';
  }

  // --- si on est sur gacha.html ---
  function initGachaPage(){
    const player = getPlayer();
    ensureStorage();

    const title = document.getElementById('title');
    const playerInfo = document.getElementById('player-info');
    const moneyEl = document.getElementById('money');
    const pullBtn = document.getElementById('pull-btn');
    const resultContent = document.getElementById('result-content');
    const quickInv = document.getElementById('quick-inv');
    const openInv = document.getElementById('open-inv');
    const backToGame = document.getElementById('back-to-game');

    if (title) title.textContent = `Gacha — Joueur ${player}`;
    if (playerInfo) playerInfo.textContent = `Tu es Joueur ${player}`;

    function refreshMoney(){
      if (moneyEl) moneyEl.textContent = '💰 ' + getMoney(player);
    }

    function refreshQuickInv(){
      if (!quickInv) return;
      quickInv.innerHTML = '';
      const inv = getInv(player);
      inv.slice(-6).reverse().forEach((f, idx)=>{
        const b = document.createElement('button');
        b.className = 'btn small';
        b.style.fontFamily = f.css || 'inherit';
        b.textContent = f.name || 'Font';
        b.onclick = ()=> {
          equipFont(player, f.css);
          alert('Font équipée !');
        };
        quickInv.appendChild(b);
      });
      if(inv.length===0) quickInv.innerHTML = '<em>Inventaire vide</em>';
    }

    if (openInv){
      openInv.href = `inventory.html?player=${player}`;
      openInv.addEventListener('click', (e)=>{
        // natural link - let it work
      });
    }

    if(backToGame){
      backToGame.href = (document.referrer && document.referrer.includes('jeu')) ? document.referrer : 'index.html';
    }

    refreshMoney();
    refreshQuickInv();

    if (pullBtn){
      pullBtn.addEventListener('click', ()=>{
        // check money
        if (getMoney(player) < PULL_COST){
          resultContent.innerHTML = `<div>Pas assez d'argent — il te faut ${PULL_COST} 💰</div>`;
          return;
        }
        // retirer l'argent
        addMoney(player, -PULL_COST);
        refreshMoney();

        // tirer (simple random, possibilité d'introduire rarités)
        const pick = FONTS[Math.floor(Math.random()*FONTS.length)];
        // on ajoute un peu de variation: parfois suffixe '-' + timestamp pour différencier
        const item = { name: pick.name, css: pick.css, rarity: pick.rarity, id: Date.now() };

        addToInv(player, item);
        refreshQuickInv();

        // affichage
        resultContent.innerHTML = `
          <div style="text-align:center">
            <div style="font-size:22px;margin-bottom:8px">🎉 Tu as obtenu :</div>
            <div style="font-family:${item.css};font-weight:700">${item.name}</div>
            <div style="margin-top:8px;color:var(--muted)">Rareté : ${item.rarity}</div>
            <div style="margin-top:10px"><button class="btn small" id="equip-now">Équiper maintenant</button></div>
          </div>
        `;
        const equipNow = document.getElementById('equip-now');
        if(equipNow){
          equipNow.addEventListener('click', ()=>{
            equipFont(player, item.css);
            resultContent.innerHTML += `<div style="margin-top:8px;color:lightgreen">Équipé ✅</div>`;
          });
        }
        refreshMoney();
      });
    }
  }

  // --- si on est sur inventory.html ---
  function initInventoryPage(){
    const player = getPlayer();
    ensureStorage();

    const title = document.getElementById('title');
    const playerInfo = document.getElementById('player-info');
    const invList = document.getElementById('inv-list');
    const equipDefault = document.getElementById('equip-default');
    const backToGame = document.getElementById('back-to-game');

    if (title) title.textContent = `Inventaire — Joueur ${player}`;
    if (playerInfo) playerInfo.textContent = `Joueur ${player}`;

    if(backToGame){
      backToGame.href = (document.referrer && document.referrer.includes('jeu')) ? document.referrer : 'index.html';
    }

    function renderInv(){
      const inv = getInv(player) || [];
      invList.innerHTML = '';
      if(inv.length === 0){
        invList.innerHTML = '<em>Aucun item</em>';
        return;
      }
      inv.forEach((f, idx)=>{
        const card = document.createElement('div');
        card.style.minWidth = '140px';
        card.style.padding = '10px';
        card.style.borderRadius = '10px';
        card.style.background = 'var(--glass)';
        card.style.textAlign = 'center';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '8px';

        const name = document.createElement('div');
        name.textContent = f.name;
        name.style.fontFamily = f.css;
        name.style.fontWeight = '700';

        const equip = document.createElement('button');
        equip.className = 'btn small';
        equip.textContent = 'Équiper';
        equip.addEventListener('click', ()=>{
          equipFont(player, f.css);
          alert('Font équipée !');
          // réafficher pour éventuellement indiquer l'état
          renderInv();
        });

        card.appendChild(name);
        card.appendChild(equip);
        invList.appendChild(card);
      });
    }

    if (equipDefault){
      equipDefault.addEventListener('click', ()=>{
        localStorage.setItem('font' + player, 'default');
        alert('Font remise par défaut');
        renderInv();
      });
    }

    renderInv();
  }

  // --- initialisation en fonction de la page ---
  document.addEventListener('DOMContentLoaded', ()=>{
    const path = location.pathname.split('/').pop().toLowerCase();
    if (path === 'gacha.html') initGachaPage();
    else if (path === 'inventory.html') initInventoryPage();
  });

})();
