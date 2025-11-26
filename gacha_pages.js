// gacha_pages.js - version corrigée
(function()
{ const FONTS = [
    // --- COMMON ---
    { name: "Arial", css: "Arial, sans-serif", rarity: "common" },
    { name: "Verdana", css: "Verdana, sans-serif", rarity: "common" },
    { name: "Tahoma", css: "Tahoma, sans-serif", rarity: "common" },
    { name: "Trebuchet", css: "'Trebuchet MS', sans-serif", rarity: "common" },
    { name: "Comic Sans", css: "'Comic Sans MS', cursive", rarity: "common" },

    // --- UNCOMMON ---
    { name: "Ubuntu", css: "'Ubuntu', sans-serif", rarity: "uncommon" },
    { name: "Quicksand", css: "'Quicksand', sans-serif", rarity: "uncommon" },
    { name: "Comfortaa", css: "'Comfortaa', cursive", rarity: "uncommon" },
    { name: "Cabin", css: "'Cabin', sans-serif", rarity: "uncommon" },
    { name: "Nunito", css: "'Nunito', sans-serif", rarity: "uncommon" },
    { name: "Playfair", css: "'Playfair Display', serif", rarity: "uncommon" },
    { name: "Merriweather", css: "'Merriweather', serif", rarity: "uncommon" },

    // --- RARE ---
    { name: "Orbitron", css: "'Orbitron', sans-serif", rarity: "rare" },
    { name: "Cinzel", css: "'Cinzel', serif", rarity: "rare" },
    { name: "Bebas Neue", css: "'Bebas Neue', sans-serif", rarity: "rare" },
    { name: "Anton", css: "'Anton', sans-serif", rarity: "rare" },
    { name: "Righteous", css: "'Righteous', cursive", rarity: "rare" },
    { name: "Russo One", css: "'Russo One', sans-serif", rarity: "rare" },
    { name: "Audiowide", css: "'Audiowide', cursive", rarity: "rare" },

    // --- EPIC ---
    { name: "Lobster", css: "'Lobster', cursive", rarity: "epic" },
    { name: "Pacifico", css: "'Pacifico', cursive", rarity: "epic" },
    { name: "Fugaz One", css: "'Fugaz One', cursive", rarity: "epic" },
    { name: "Black Ops One", css: "'Black Ops One', cursive", rarity: "epic" },
    { name: "Bangers", css: "'Bangers', cursive", rarity: "epic" },
    { name: "Great Vibes", css: "'Great Vibes', cursive", rarity: "epic" },

    // --- LEGENDARY ---
    { name: "Roboto Slab", css: "'Roboto Slab', serif", rarity: "legendary" },
    { name: "Exo 2", css: "'Exo 2', sans-serif", rarity: "legendary" },
    { name: "Dancing Script", css: "'Dancing Script', cursive", rarity: "legendary" },
    { name: "Satisfy", css: "'Satisfy', cursive", rarity: "legendary" },
    { name: "Metal Mania", css: "'Metal Mania', cursive", rarity: "legendary" },
    { name: "Ultra", css: "'Ultra', serif", rarity: "legendary" }
];

  const PULL_COST = 20;
  const INIT_MONEY = 50;

  function qs(name){
    const params = new URLSearchParams(location.search);
    return params.get(name);
  }
  function getPlayerFromQS(){
    const p = Number(qs('player')) || 1;
    return (p === 1) ? 1 : 2;
  }

  function ensureStorage(){
    if (!localStorage.getItem('money1')) localStorage.setItem('money1', String(INIT_MONEY));
    if (!localStorage.getItem('money2')) localStorage.setItem('money2', String(INIT_MONEY));
    if (!localStorage.getItem('inv1')) localStorage.setItem('inv1', '[]');
    if (!localStorage.getItem('inv2')) localStorage.setItem('inv2', '[]');
    if (!localStorage.getItem('font1')) localStorage.setItem('font1', 'default');
    if (!localStorage.getItem('font2')) localStorage.setItem('font2', 'default');
  }

  /* ---------- money API ---------- */
  window.addMoney = function(player, amount){
    const key = 'money' + (player === 1 ? '1' : '2');
    const cur = Number(localStorage.getItem(key) || 0);
    localStorage.setItem(key, String(cur + Number(amount)));
    // update in-page money badges if present
    const el = document.getElementById(player === 1 ? 'money-left' : 'money-right');
    if (el) el.textContent = '💰 ' + localStorage.getItem(key);
    const moneyBox = document.getElementById('money');
    if (moneyBox){
      const qsPlayer = getPlayerFromQS();
      if (qsPlayer === player) moneyBox.textContent = '💰 ' + localStorage.getItem(key);
    }
  };

  window.getMoney = function(player){
    return Number(localStorage.getItem('money' + (player === 1 ? '1' : '2')) || 0);
  };

  /* ---------- inventory helpers (unique by css) ---------- */
  function getInv(player){
    try { return JSON.parse(localStorage.getItem('inv' + player) || '[]'); }
    catch(e){ return []; }
  }
  function saveInv(player, arr){
    localStorage.setItem('inv' + player, JSON.stringify(arr || []));
  }
  function hasFont(player, css){
    const inv = getInv(player);
    return inv.some(i => i.css === css);
  }
  function addToInv(player, item){
    if (hasFont(player, item.css)) return false; // already have it
    const inv = getInv(player);
    inv.push(item);
    saveInv(player, inv);
    return true;
  }

  /* ---------- equip / apply fonts ---------- */
  function equipFontInternal(player, css){
    localStorage.setItem('font' + player, css);
    // Apply to page inputs immediately
    if (typeof window.applyFonts === 'function') window.applyFonts();
    else {
      // fallback: target inputs directly
      const leftInput = document.getElementById('left-name-input');
      const rightInput = document.getElementById('right-name-input');
      if (player === 1 && leftInput) leftInput.style.fontFamily = css;
      if (player === 2 && rightInput) rightInput.style.fontFamily = css;
    }
    // update quick-inv displays if present
    refreshInPageQuickInv(player);
  }

  window.equipFont = function(player, cssOrIndex){
    if (typeof cssOrIndex === 'number'){
      const inv = getInv(player);
      const f = inv[cssOrIndex];
      if (!f) return;
      equipFontInternal(player, f.css);
      return;
    }
    equipFontInternal(player, cssOrIndex);
  };

  window.applyFonts = function(){
    const f1 = localStorage.getItem('font1');
    const f2 = localStorage.getItem('font2');

    const leftInput = document.getElementById('left-name-input');
    const rightInput = document.getElementById('right-name-input');
    const leftSpan = document.getElementById('name-left');
    const rightSpan = document.getElementById('name-right');

    if (leftInput) leftInput.style.fontFamily = (f1 && f1 !== 'default') ? f1 : '';
    if (rightInput) rightInput.style.fontFamily = (f2 && f2 !== 'default') ? f2 : '';
    if (leftSpan) leftSpan.style.fontFamily = (f1 && f1 !== 'default') ? f1 : '';
    if (rightSpan) rightSpan.style.fontFamily = (f2 && f2 !== 'default') ? f2 : '';

    const c1 = localStorage.getItem('color-left');
    const c2 = localStorage.getItem('color-right');
    if (leftInput && c1) leftInput.style.color = c1;
    if (rightInput && c2) rightInput.style.color = c2;
    if (leftSpan && c1) leftSpan.style.color = c1;
    if (rightSpan && c2) rightSpan.style.color = c2;
  };

  /* ---------- popup helpers ---------- */
  function showPopup(title, bodyHtml){
    const popup = document.getElementById('popup');
    if (!popup) return;
    const t = document.getElementById('popup-title');
    const b = document.getElementById('popup-body');
    if (t) t.innerHTML = title;
    if (b) b.innerHTML = bodyHtml;
    popup.classList.remove('hidden');
    // ensure the global close button exists (provided in jeu.html)
  }
  window.closePopup = function(){
    const popup = document.getElementById('popup');
    if (popup) popup.classList.add('hidden');
  };

  /* ---------- in-page openGacha / openInventory (popup-only) ---------- */
  window.openGacha = function(player){
    ensureStorage();
    const money = getMoney(player);
    if (money < PULL_COST){
      showPopup('Pas assez d\'argent', `<p>Il faut ${PULL_COST} 💰 (tu as ${money})</p>`);
      return;
    }

    // retirer l'argent
    addMoney(player, -PULL_COST);

    const pick = FONTS[Math.floor(Math.random()*FONTS.length)];
    const item = { name: pick.name, css: pick.css, rarity: pick.rarity, id: Date.now() };

    const added = addToInv(player, item);

    if (!added) {
      showPopup('Gacha — résultat', `<div style="text-align:center">
        <div style="font-size:20px;margin-bottom:8px">Tu as obtenu :</div>
        <div style="font-family:${item.css};font-weight:700">${item.name}</div>
        <div style="margin-top:8px;color:var(--muted)">Rareté : ${item.rarity}</div>
        <div style="margin-top:10px;color:orange">Déjà possédée — l'objet n'a pas été dupliqué.</div>
      </div>`);
      refreshInPageQuickInv(player);
      const moneyEl = document.getElementById(player===1? 'money-left' : 'money-right');
      if (moneyEl) moneyEl.textContent = '💰 ' + getMoney(player);
      const moneyBox = document.getElementById('money');
      if (moneyBox) {
        const qsPlayer = getPlayerFromQS();
        if (qsPlayer === player) moneyBox.textContent = '💰 ' + getMoney(player);
      }
      return;
    }

    // affiche le résultat (sans ajouter un deuxième "Fermer" — on laisse le popup global gérer la fermeture)
    const body = `
      <div style="text-align:center">
        <div style="font-size:20px;margin-bottom:8px">🎉 Tu as obtenu :</div>
        <div style="font-family:${item.css};font-weight:700">${item.name}</div>
        <div style="margin-top:8px;color:var(--muted)">Rareté : ${item.rarity}</div>
        <div style="margin-top:10px">
          <button class="btn small" id="equip-now">Équiper maintenant</button>
        </div>
      </div>
    `;
    showPopup('Gacha — résultat', body);

    // attach handler for equip button (popup-body already present)
    const equipNow = document.getElementById('equip-now');
    if (equipNow) {
      equipNow.addEventListener('click', ()=>{
        equipFont(player, item.css);
        // indicate equipped in popup
        const b = document.getElementById('popup-body');
        if (b) b.innerHTML += `<div style="margin-top:8px;color:lightgreen">Équipé ✅</div>`;
      });
    }

    // refresh UI
    refreshInPageQuickInv(player);
    const moneyEl = document.getElementById(player===1? 'money-left' : 'money-right');
    if (moneyEl) moneyEl.textContent = '💰 ' + getMoney(player);
    const moneyBox = document.getElementById('money');
    if (moneyBox) {
      const qsPlayer = getPlayerFromQS();
      if (qsPlayer === player) moneyBox.textContent = '💰 ' + getMoney(player);
    }
  };

  window.openInventory = function(player){
    ensureStorage();
    const inv = getInv(player);
    if (!inv || inv.length === 0){
      showPopup('Inventaire', '<p>Aucun item obtenu.</p>');
      return;
    }

    let html = `<div style="display:flex;flex-direction:column;gap:8px;align-items:center">`;
    inv.forEach((f, idx)=>{
      html += `
        <div style="display:flex;gap:8px;align-items:center;min-width:250px;justify-content:space-between">
          <div style="min-width:120px;font-weight:700;font-family:${f.css}">${f.name}</div>
          <div><button class="btn small" data-idx="${idx}" data-player="${player}">Équiper</button></div>
        </div>`;
    });
    html += `</div>`;

    showPopup(`Inventaire — Joueur ${player}`, html);

    // attach handlers
    const buttons = Array.from(document.querySelectorAll('#popup-body button[data-idx]'));
    buttons.forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const idx = Number(btn.getAttribute('data-idx'));
        const pl = Number(btn.getAttribute('data-player'));
        equipFont(pl, idx);
        // update popup text to show confirmation
        const b = document.getElementById('popup-body');
        if (b) b.innerHTML += `<div style="margin-top:8px;color:lightgreen">Équipé ✅</div>`;
        // refresh quick inv display
        refreshInPageQuickInv(pl);
      });
    });
  };

  /* ---------- quick-inv & helpers ---------- */
  function refreshQuickInvOnPage(player, quickInvEl){
    if(!quickInvEl) return;
    quickInvEl.innerHTML = '';
    const inv = getInv(player);
    if (!inv || inv.length === 0) { quickInvEl.innerHTML = '<em>Inventaire vide</em>'; return; }
    // show unique fonts only (they are already unique in storage)
    inv.slice(-6).reverse().forEach((f, idx)=>{
      const b = document.createElement('button');
      b.className = 'btn small';
      b.style.fontFamily = f.css || 'inherit';
      b.textContent = f.name || 'Font';
      b.addEventListener('click', ()=> { equipFont(player, f.css); alert('Font équipée !'); });
      quickInvEl.appendChild(b);
    });
  }

  function refreshInPageQuickInv(player){
    const quickLeft = document.getElementById('quick-inv-left');
    const quickRight = document.getElementById('quick-inv-right');
    if (quickLeft && player === 1) refreshQuickInvOnPage(player, quickLeft);
    if (quickRight && player === 2) refreshQuickInvOnPage(player, quickRight);
  }

  /* ---------- standalone pages init ---------- */
  function initGachaPage(){
    const player = getPlayerFromQS();
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
    refreshMoneyOnPage(player, moneyEl);
    refreshQuickInvOnPage(player, quickInv);

    if (openInv) openInv.href = `inventory.html?player=${player}`;
    if (backToGame) backToGame.href = document.referrer || 'index.html';

    if (pullBtn){
      pullBtn.addEventListener('click', ()=>{
        if (getMoney(player) < PULL_COST){
          resultContent.innerHTML = `<div>Pas assez d'argent — il te faut ${PULL_COST} 💰</div>`;
          return;
        }
        addMoney(player, -PULL_COST);
        refreshMoneyOnPage(player, moneyEl);

        const pick = FONTS[Math.floor(Math.random()*FONTS.length)];
        const item = { name: pick.name, css: pick.css, rarity: pick.rarity, id: Date.now() };
        const added = addToInv(player, item);

        if (!added) {
          resultContent.innerHTML = `<div style="text-align:center">
            <div style="font-size:18px;margin-bottom:6px">Tu as obtenu :</div>
            <div style="font-family:${item.css};font-weight:700">${item.name}</div>
            <div style="margin-top:6px;color:orange">Déjà possédée — l'objet n'a pas été dupliqué.</div>
          </div>`;
          refreshQuickInvOnPage(player, quickInv);
          return;
        }

        refreshQuickInvOnPage(player, quickInv);

        resultContent.innerHTML = `
          <div style="text-align:center">
            <div style="font-size:22px;margin-bottom:8px">🎉 Tu as obtenu :</div>
            <div style="font-family:${item.css};font-weight:700">${item.name}</div>
            <div style="margin-top:8px;color:var(--muted)">Rareté : ${item.rarity}</div>
            <div style="margin-top:10px"><button class="btn small" id="equip-now-standalone">Équiper maintenant</button></div>
          </div>
        `;
        const eq = document.getElementById('equip-now-standalone');
        if (eq) eq.addEventListener('click', ()=>{
          equipFont(player, item.css);
          resultContent.innerHTML += `<div style="margin-top:8px;color:lightgreen">Équipé ✅</div>`;
        });
      });
    }
  }

  function initInventoryPage(){
    const player = getPlayerFromQS();
    ensureStorage();

    const title = document.getElementById('title');
    const playerInfo = document.getElementById('player-info');
    const invList = document.getElementById('inv-list');
    const equipDefault = document.getElementById('equip-default');
    const backToGame = document.getElementById('back-to-game');

    if (title) title.textContent = `Inventaire — Joueur ${player}`;
    if (playerInfo) playerInfo.textContent = `Joueur ${player}`;
    if (backToGame) backToGame.href = document.referrer || 'index.html';

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
          equipFont(player, idx); // equip by index
          alert('Font équipée !');
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

  /* ---------- small helpers for standalone pages ---------- */
  function refreshMoneyOnPage(player, moneyEl){
    if (!moneyEl) return;
    moneyEl.textContent = '💰 ' + getMoney(player);
  }
  function refreshQuickInvOnPage(player, quickInvEl){
    if(!quickInvEl) return;
    quickInvEl.innerHTML = '';
    const inv = getInv(player);
    if (!inv || inv.length === 0) { quickInvEl.innerHTML = '<em>Inventaire vide</em>'; return; }
    inv.slice(-6).reverse().forEach((f, idx)=>{
      const b = document.createElement('button');
      b.className = 'btn small';
      b.style.fontFamily = f.css || 'inherit';
      b.textContent = f.name || 'Font';
      b.addEventListener('click', ()=> { equipFont(player, f.css); alert('Font équipée !'); });
      quickInvEl.appendChild(b);
    });
  }

  /* ---------- auto-init ---------- */
  document.addEventListener('DOMContentLoaded', ()=>{
    ensureStorage();
    // Apply fonts to inputs if game page loaded
    if (typeof window.applyFonts === 'function') window.applyFonts();

    const pathname = location.pathname.split('/').pop().toLowerCase();
    if (pathname === 'gacha.html') initGachaPage();
    else if (pathname === 'inventory.html') initInventoryPage();
    // else: game page will call openGacha/openInventory as needed
  });

})();
