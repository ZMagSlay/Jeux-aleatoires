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

      // token skins pool (obtenables via gacha)
      const SKINS = [
        // --- COMMON ---
        { name: "Classic", id: "classic", rarity: "common" },
        { name: "Wood", id: "wood", rarity: "common" },
        { name: "Stone", id: "stone", rarity: "common" },
        { name: "Clay", id: "clay", rarity: "common" },
        { name: "Plastic", id: "plastic", rarity: "common" },
        
        // --- UNCOMMON ---
        { name: "Camo", id: "camo", rarity: "uncommon" },
        { name: "Pixel", id: "pixel", rarity: "uncommon" },
        { name: "Marble", id: "marble", rarity: "uncommon" },
        { name: "Retro", id: "retro", rarity: "uncommon" },
        { name: "Glass", id: "glass", rarity: "uncommon" },
        { name: "Rust", id: "rust", rarity: "uncommon" },
        { name: "Ocean", id: "ocean", rarity: "uncommon" },
        { name: "Fire", id: "fire", rarity: "uncommon" },
        
        // --- RARE ---
        { name: "Metal", id: "metal", rarity: "rare" },
        { name: "Gold", id: "gold", rarity: "rare" },
        { name: "Chrome", id: "chrome", rarity: "rare" },
        { name: "Ice", id: "ice", rarity: "rare" },
        { name: "Silver", id: "silver", rarity: "rare" },
        { name: "Copper", id: "copper", rarity: "rare" },
        { name: "Emerald", id: "emerald", rarity: "rare" },
        { name: "Ruby", id: "ruby", rarity: "rare" },
        { name: "Sapphire", id: "sapphire", rarity: "rare" },
        
        // --- EPIC ---
        { name: "Neon", id: "neon", rarity: "epic" },
        { name: "Galaxy", id: "galaxy", rarity: "epic" },
        { name: "Cosmic", id: "cosmic", rarity: "epic" },
        { name: "Aurora", id: "aurora", rarity: "epic" },
        { name: "Thunder", id: "thunder", rarity: "epic" },
        { name: "Diamond", id: "diamond", rarity: "epic" },
        { name: "Twilight", id: "twilight", rarity: "epic" },
        
        // --- LEGENDARY ---
        { name: "Holo", id: "holo", rarity: "legendary" },
        { name: "Lava", id: "lava", rarity: "legendary" },
        { name: "Void", id: "void", rarity: "legendary" },
        { name: "Rainbow", id: "rainbow", rarity: "legendary" },
        { name: "Phoenix", id: "phoenix", rarity: "legendary" },
        { name: "Infinity", id: "infinity", rarity: "legendary" },
        { name: "Starlight", id: "starlight", rarity: "legendary" }
      ];

      // Snake skins pool
      const SNAKE_SKINS = [
        // --- COMMON ---
        { name: "Classic", id: "classic", rarity: "common", type: "snake-skin" },
        { name: "Green", id: "green", rarity: "common", type: "snake-skin" },
        { name: "Blue", id: "blue", rarity: "common", type: "snake-skin" },
        { name: "Purple", id: "purple", rarity: "common", type: "snake-skin" },
        { name: "Orange", id: "orange", rarity: "common", type: "snake-skin" },

        // --- UNCOMMON ---
        { name: "Neon", id: "neon", rarity: "uncommon", type: "snake-skin" },
        { name: "Glass", id: "glass", rarity: "uncommon", type: "snake-skin" },
        { name: "Metal", id: "metal", rarity: "uncommon", type: "snake-skin" },
        { name: "Fire", id: "fire", rarity: "uncommon", type: "snake-skin" },
        { name: "Ice", id: "ice", rarity: "uncommon", type: "snake-skin" },
        { name: "Marble", id: "marble", rarity: "uncommon", type: "snake-skin" },

        // --- RARE ---
        { name: "Gold", id: "gold", rarity: "rare", type: "snake-skin" },
        { name: "Rainbow", id: "rainbow", rarity: "rare", type: "snake-skin" },
        { name: "Gradient", id: "gradient", rarity: "rare", type: "snake-skin" },
        { name: "Glow", id: "glow", rarity: "rare", type: "snake-skin" },
        { name: "Aurora", id: "aurora", rarity: "rare", type: "snake-skin" },

        // --- EPIC ---
        { name: "Galaxy", id: "galaxy", rarity: "epic", type: "snake-skin" },
        { name: "Cosmic", id: "cosmic", rarity: "epic", type: "snake-skin" },
        { name: "Lightning", id: "lightning", rarity: "epic", type: "snake-skin" },
        { name: "Lava", id: "lava", rarity: "epic", type: "snake-skin" },

        // --- LEGENDARY ---
        { name: "Void", id: "void", rarity: "legendary", type: "snake-skin" },
        { name: "Infinity", id: "infinity", rarity: "legendary", type: "snake-skin" },
        { name: "Phoenix", id: "phoenix", rarity: "legendary", type: "snake-skin" }
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

  // Expose ensureStorage to global so other scripts can call it
  window.ensureStorage = ensureStorage;

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
  function hasItem(player, item){
    const inv = getInv(player);
    if (!item || !inv) return false;
    if (item.type === 'font') return inv.some(i => i.type === 'font' && i.css === item.css);
    if (item.type === 'skin') return inv.some(i => i.type === 'skin' && i.id === item.id);
    if (item.type === 'snake-skin') return inv.some(i => i.type === 'snake-skin' && i.id === item.id);
    // fallback: try to match by name
    return inv.some(i => i.name === item.name);
  }
  function addToInv(player, item){
    if (!item) return false;
    // ensure item.type exists
    if (!item.type) item.type = item.css ? 'font' : (item.id ? 'skin' : 'font');
    if (hasItem(player, item)) return false; // already have it
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

  // Equip a token skin for Puissance4
  window.equipSkin = function(player, skinId){
    if (!skinId) return;
    localStorage.setItem('p4-token-skin-' + player, skinId);
    // Apply skin to body if on Puissance4 page
    try { 
      const equippedSkin = localStorage.getItem('p4-token-skin-' + player) || 'classic';
      document.body.setAttribute('data-token-skin-' + player, equippedSkin);
    } catch(e) {}
    // refresh quick-inv displays if present
    refreshInPageQuickInv(player);
  };

  // Équiper un skin de serpent pour Snake
  window.equipSnakeSkin = function(player, skinId){
    if (!skinId) return;
    localStorage.setItem('snake-skin-' + player, skinId);
    // Apply skin to body if on Snake page
    try { 
      const equippedSkin = localStorage.getItem('snake-skin-' + player) || 'classic';
      document.body.setAttribute('data-snake-skin-' + player, equippedSkin);
    } catch(e) {}
    // refresh quick-inv displays if present
    refreshInPageQuickInv(player);
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
    
    // Recharger les skins du Snake s'il y a une instance active
    if (typeof window.snakeGameInstance !== 'undefined' && window.snakeGameInstance) {
      window.snakeGameInstance.reloadEquippedSkins();
    }
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

    // Choix aléatoire: majoritairement fonts, parfois skins P4 ou Snake
    let item;
    const rand = Math.random();
    if (rand < 0.50) {
      // 50% Fonts
      const pick = FONTS[Math.floor(Math.random()*FONTS.length)];
      item = { type: 'font', name: pick.name, css: pick.css, rarity: pick.rarity, id: Date.now() };
    } else if (rand < 0.75) {
      // 25% P4 Skins
      const pick = SKINS[Math.floor(Math.random()*SKINS.length)];
      item = { type: 'skin', name: pick.name, id: pick.id, rarity: pick.rarity };
    } else {
      // 25% Snake Skins
      const pick = SNAKE_SKINS[Math.floor(Math.random()*SNAKE_SKINS.length)];
      item = { type: 'snake-skin', name: pick.name, id: pick.id, rarity: pick.rarity };
    }

    const added = addToInv(player, item);

    if (!added) {
      // Already have this item — show type-aware message
      let itemType = '';
      if (item.type === 'font') itemType = '📝 Ecriture';
      else if (item.type === 'skin') itemType = '🎨 Jeton P4';
      else itemType = '🐍 Serpent';
      
      const preview = item.type === 'font' ?
        `<div style="font-family:${item.css};font-weight:700;font-size:18px">${item.name}</div>` :
        `<div style="font-weight:700;font-size:18px">${item.name}</div>`;
      showPopup('Gacha — résultat', `<div style="text-align:center">
        <div style="font-size:20px;margin-bottom:12px">Tu as obtenu :</div>
        <div style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.05);margin-bottom:8px;">
          ${preview}
          <div style="margin-top:6px;font-size:12px;color:var(--accent);">${itemType}</div>
        </div>
        <div style="margin-top:8px;color:var(--muted)">Rareté : ${item.rarity}</div>
        <div style="margin-top:10px;color:orange">⚠️ Déjà possédée — l'objet n'a pas été dupliqué.</div>
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
    let itemType = '';
    if (item.type === 'font') itemType = '📝 Ecriture';
    else if (item.type === 'skin') itemType = '🎨 Jeton P4';
    else itemType = '🐍 Serpent';
    
    const previewHtml = item.type === 'font' ?
      `<div style="font-family:${item.css};font-weight:700;font-size:18px">${item.name}</div>` :
      `<div style="font-weight:700;font-size:18px">${item.name}</div>`;

    const body = `
      <div style="text-align:center">
        <div style="font-size:20px;margin-bottom:12px">🎉 Tu as obtenu :</div>
        <div style="padding:10px;border-radius:8px;background:rgba(255,255,255,0.05);margin-bottom:8px;">
          ${previewHtml}
          <div style="margin-top:8px;font-size:13px;color:var(--accent);">${itemType}</div>
        </div>
        <div style="margin-top:8px;color:var(--muted)">Rareté : <strong>${item.rarity}</strong></div>
        <div style="margin-top:12px">
          <button class="btn small" id="equip-now" style="background:var(--accent);color:var(--dark);">✓ Équiper maintenant</button>
        </div>
      </div>
    `;
    showPopup('Gacha — résultat', body);

    // attach handler for equip button (popup-body already present)
    const equipNow = document.getElementById('equip-now');
    if (equipNow) {
      equipNow.addEventListener('click', ()=>{
        if (item.type === 'font') {
          equipFont(player, item.css);
        } else if (item.type === 'skin') {
          if (typeof window.equipSkin === 'function') window.equipSkin(player, item.id);
          else {
            localStorage.setItem('p4-token-skin-' + player, item.id);
            try { document.body.setAttribute('data-token-skin-' + player, item.id); } catch(e){}
          }
        } else if (item.type === 'snake-skin') {
          localStorage.setItem('snake-skin-' + player, item.id);
          try { document.body.setAttribute('data-snake-skin-' + player, item.id); } catch(e){}
        }
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

  // remplace l'actuelle openInventory par celle-ci
window.openInventory = function(player){
  ensureStorage();
  const inv = getInv(player);
  if (!inv || inv.length === 0){
    showPopup('Inventaire', '<p>Aucun item obtenu.</p>');
    return;
  }

  // récupère la font et le skin actuellement équipés pour ce joueur
  const equippedCss = localStorage.getItem('font' + player) || 'default';
  const equippedSkin = localStorage.getItem('p4-token-skin-' + player) || 'classic';
  const equippedSnakeSkin = localStorage.getItem('snake-skin-' + player) || 'classic';

  // séparer fonts, skins P4 et skins Snake
  const fonts = inv.filter(f => f.type === 'font');
  const skins = inv.filter(f => f.type === 'skin');
  const snakeSkins = inv.filter(f => f.type === 'snake-skin');

  // construit le html avec tabs : Fonts, P4 Skins et Snake Skins
  let html = `
    <div style="display:flex;gap:8px;margin-bottom:12px;border-bottom:2px solid rgba(255,255,255,0.1);">
      <button class="tab-btn active" data-tab="fonts" style="flex:1;padding:8px;border:none;background:transparent;color:var(--accent);cursor:pointer;border-bottom:2px solid var(--accent);font-weight:700;">
        📝 Ecriture (${fonts.length})
      </button>
      <button class="tab-btn" data-tab="skins" style="flex:1;padding:8px;border:none;background:transparent;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;font-weight:700;">
        🎨 Jeton (${skins.length})
      </button>
      <button class="tab-btn" data-tab="snakeskins" style="flex:1;padding:8px;border:none;background:transparent;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;font-weight:700;">
        🐍 Serpent (${snakeSkins.length})
      </button>
    </div>

    <div id="fonts-container" class="tab-content" style="display:block;flex-direction:column;gap:10px;max-width:420px;">
  `;
  
  // Afficher les fonts
  fonts.forEach((f, idx)=>{
    const itemIdx = inv.indexOf(f);
    const isEquipped = (f.css === equippedCss);
    html += `
      <div class="inv-row" data-idx="${itemIdx}" data-player="${player}" 
           style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);">
        <div style="display:flex;gap:8px;align-items:center;flex:1">
          <div style="min-width:140px;font-weight:700;font-family:${f.css}">${f.name}</div>
          <div style="color:var(--muted);font-size:11px;padding:2px 6px;background:rgba(255,255,255,0.1);border-radius:4px;">${f.rarity || 'unknown'}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="btn small equip-btn" data-idx="${itemIdx}" data-player="${player}" style="padding:6px 10px;font-size:12px;">Équiper</button>
          <div class="equipped-badge" style="font-weight:700;color:lightgreen;font-size:12px;display:${isEquipped ? 'block' : 'none'};">✓</div>
        </div>
      </div>
    `;
  });

  html += `</div>

    <div id="skins-container" class="tab-content" style="display:none;flex-direction:column;gap:10px;max-width:420px;">
  `;

  // Afficher les skins
  skins.forEach((s, idx)=>{
    const itemIdx = inv.indexOf(s);
    const isEquipped = (s.id === equippedSkin);
    html += `
      <div class="inv-row" data-idx="${itemIdx}" data-player="${player}" 
           style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);">
        <div style="display:flex;gap:8px;align-items:center;flex:1">
          <div style="min-width:140px;font-weight:700;">${s.name}</div>
          <div style="color:var(--muted);font-size:11px;padding:2px 6px;background:rgba(255,255,255,0.1);border-radius:4px;">${s.rarity || 'unknown'}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="btn small equip-btn" data-idx="${itemIdx}" data-player="${player}" style="padding:6px 10px;font-size:12px;">Équiper</button>
          <div class="equipped-badge" style="font-weight:700;color:lightgreen;font-size:12px;display:${isEquipped ? 'block' : 'none'};">✓</div>
        </div>
      </div>
    `;
  });

  html += `</div>

    <div id="snakeskins-container" class="tab-content" style="display:none;flex-direction:column;gap:10px;max-width:420px;">
  `;

  // Afficher les skins de serpent
  snakeSkins.forEach((ss, idx)=>{
    const itemIdx = inv.indexOf(ss);
    const isEquipped = (ss.id === equippedSnakeSkin);
    html += `
      <div class="inv-row" data-idx="${itemIdx}" data-player="${player}" 
           style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-radius:8px;background:rgba(255,255,255,0.02);">
        <div style="display:flex;gap:8px;align-items:center;flex:1">
          <div style="min-width:140px;font-weight:700;">${ss.name}</div>
          <div style="color:var(--muted);font-size:11px;padding:2px 6px;background:rgba(255,255,255,0.1);border-radius:4px;">${ss.rarity || 'unknown'}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="btn small equip-btn" data-idx="${itemIdx}" data-player="${player}" style="padding:6px 10px;font-size:12px;">Équiper</button>
          <div class="equipped-badge" style="font-weight:700;color:lightgreen;font-size:12px;display:${isEquipped ? 'block' : 'none'};">✓</div>
        </div>
      </div>
    `;
  });

  html += `</div>`;

  // affiche la popup (ne contient pas de bouton fermer supplémentaire)
  showPopup(`Inventaire — Joueur ${player}`, html);

  // attache handlers : équiper sans fermer, mise à jour du badge et de la page
  const popupBody = document.getElementById('popup-body');
  if (!popupBody) return;

  // Gestion des onglets (tabs)
  const tabBtns = popupBody.querySelectorAll('button.tab-btn');
  const fontsContainer = popupBody.querySelector('#fonts-container');
  const skinsContainer = popupBody.querySelector('#skins-container');
  const snakeSkinsContainer = popupBody.querySelector('#snakeskins-container');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      // mettre à jour l'affichage des onglets
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.style.color = 'var(--muted)';
        b.style.borderBottomColor = 'transparent';
      });
      btn.classList.add('active');
      btn.style.color = 'var(--accent)';
      btn.style.borderBottomColor = 'var(--accent)';

      // afficher/masquer les containers
      if (targetTab === 'fonts') {
        if (fontsContainer) fontsContainer.style.display = 'flex';
        if (skinsContainer) skinsContainer.style.display = 'none';
        if (snakeSkinsContainer) snakeSkinsContainer.style.display = 'none';
      } else if (targetTab === 'skins') {
        if (fontsContainer) fontsContainer.style.display = 'none';
        if (skinsContainer) skinsContainer.style.display = 'flex';
        if (snakeSkinsContainer) snakeSkinsContainer.style.display = 'none';
      } else if (targetTab === 'snakeskins') {
        if (fontsContainer) fontsContainer.style.display = 'none';
        if (skinsContainer) skinsContainer.style.display = 'none';
        if (snakeSkinsContainer) snakeSkinsContainer.style.display = 'flex';
      }
    });
  });

  // fonction utilitaire pour rafraîchir les badges "Équipé" dans la popup
  function refreshPopupBadges(equippedValue, itemType){
    const rows = popupBody.querySelectorAll('.inv-row');
    rows.forEach(row=>{
      const idx = Number(row.getAttribute('data-idx'));
      const item = inv[idx];
      const badge = row.querySelector('.equipped-badge');
      if (!badge) return;
      if (!item) { badge.style.display = 'none'; return; }
      
      if (item.type === 'font' && itemType === 'font') {
        badge.style.display = (item.css === equippedValue) ? 'block' : 'none';
      } else if (item.type === 'skin' && itemType === 'skin') {
        badge.style.display = (item.id === equippedValue) ? 'block' : 'none';
      } else if (item.type === 'snake-skin' && itemType === 'snake-skin') {
        badge.style.display = (item.id === equippedValue) ? 'block' : 'none';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  // attacher tous les boutons equip-btn
  const btns = Array.from(popupBody.querySelectorAll('button.equip-btn'));
  btns.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const idx = Number(btn.getAttribute('data-idx'));
      const pl = Number(btn.getAttribute('data-player'));
      const item = inv[idx];
      if (!item) return;
      
      // équipe selon le type
      if (item.type === 'font') {
        equipFont(pl, idx); // equip by index
        // rafraîchir seulement les badges de fonts
        refreshPopupBadges(item.css, 'font');
      } else if (item.type === 'skin') {
        if (typeof window.equipSkin === 'function') window.equipSkin(pl, item.id);
        else { 
          localStorage.setItem('p4-token-skin', item.id); 
          try{ document.body.setAttribute('data-token-skin', item.id);}catch(e){}
        }
        // rafraîchir seulement les badges de skins
        refreshPopupBadges(item.id, 'skin');
      } else if (item.type === 'snake-skin') {
        if (typeof window.equipSnakeSkin === 'function') window.equipSnakeSkin(pl, item.id);
        else {
          localStorage.setItem('snake-skin-' + pl, item.id);
          try{ document.body.setAttribute('data-snake-skin-' + pl, item.id);}catch(e){}
        }
        // rafraîchir seulement les badges de snake skins
        refreshPopupBadges(item.id, 'snake-skin');
      }

      // affiche confirmation brève dans la popup (sans fermer)
      const confirmMsg = document.createElement('div');
      confirmMsg.style.marginTop = '8px';
      confirmMsg.style.color = 'lightgreen';
      confirmMsg.style.fontSize = '12px';
      confirmMsg.textContent = `✓ ${item.name} équipée`;
      // supprimer d'éventuels vieux messages de confirmation
      const old = popupBody.querySelector('.equip-confirm');
      if (old) old.remove();
      confirmMsg.className = 'equip-confirm';
      popupBody.appendChild(confirmMsg);

      // rafraîchir l'affichage en page (inputs noms, quick-inv, etc.)
      if (typeof window.applyFonts === 'function') window.applyFonts();
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
      if (f.type === 'font') {
        b.style.fontFamily = f.css || 'inherit';
        b.textContent = f.name || 'Font';
        b.addEventListener('click', ()=> { equipFont(player, f.css); alert('Font équipée !'); });
      } else if (f.type === 'skin') {
        b.textContent = f.name || 'Skin';
        b.addEventListener('click', ()=> { equipSkin(player, f.id); alert('Skin équipé !'); });
      } else {
        b.textContent = f.name || 'Item';
      }
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

        let item;
        if (Math.random() < 0.65) {
          const pick = FONTS[Math.floor(Math.random()*FONTS.length)];
          item = { type: 'font', name: pick.name, css: pick.css, rarity: pick.rarity, id: Date.now() };
        } else {
          const pick = SKINS[Math.floor(Math.random()*SKINS.length)];
          item = { type: 'skin', name: pick.name, id: pick.id, rarity: pick.rarity };
        }
        const added = addToInv(player, item);

        if (!added) {
          const itemType = item.type === 'font' ? '📝 Ecriture' : '🎨 Jeton';
          const preview = item.type === 'font' ?
            `<div style="font-family:${item.css};font-weight:700;font-size:16px">${item.name}</div>` :
            `<div style="font-weight:700;font-size:16px">${item.name}</div>`;
          resultContent.innerHTML = `<div style="text-align:center">
            <div style="font-size:18px;margin-bottom:8px">Tu as obtenu :</div>
            <div style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.05);margin-bottom:8px;">
              ${preview}
              <div style="margin-top:6px;font-size:12px;color:var(--accent);">${itemType}</div>
            </div>
            <div style="color:orange">⚠️ Déjà possédée — l'objet n'a pas été dupliqué.</div>
          </div>`;
          refreshQuickInvOnPage(player, quickInv);
          return;
        }

        refreshQuickInvOnPage(player, quickInv);

        const itemTypeLabel = item.type === 'font' ? '📝 Ecriture' : '🎨 Jeton';
        const previewContent = item.type === 'font' ?
          `<div style="font-family:${item.css};font-weight:700;font-size:18px">${item.name}</div>` :
          `<div style="font-weight:700;font-size:18px">${item.name}</div>`;
        resultContent.innerHTML = `
          <div style="text-align:center">
            <div style="font-size:22px;margin-bottom:12px">🎉 Tu as obtenu :</div>
            <div style="padding:10px;border-radius:8px;background:rgba(255,255,255,0.05);margin-bottom:8px;">
              ${previewContent}
              <div style="margin-top:8px;font-size:13px;color:var(--accent);">${itemTypeLabel}</div>
            </div>
            <div style="margin-top:8px;color:var(--muted)">Rareté : <strong>${item.rarity}</strong></div>
            <div style="margin-top:12px"><button class="btn small" id="equip-now-standalone" style="background:var(--accent);color:var(--dark);">✓ Équiper</button></div>
          </div>
        `;
        const eq = document.getElementById('equip-now-standalone');
        if (eq) eq.addEventListener('click', ()=>{
          if (item.type === 'font') equipFont(player, item.css);
          else if (item.type === 'skin') {
            if (typeof window.equipSkin === 'function') window.equipSkin(player, item.id);
            else { localStorage.setItem('p4-token-skin-' + player, item.id); try{ document.body.setAttribute('data-token-skin-' + player, item.id);}catch(e){} }
          }
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
        if (f.type === 'font' && f.css) name.style.fontFamily = f.css;
        name.style.fontWeight = '700';

        const equip = document.createElement('button');
        equip.className = 'btn small';
        equip.textContent = 'Équiper';
        equip.addEventListener('click', ()=>{
          if (f.type === 'font') {
            equipFont(player, idx); // equip by index
            alert('Font équipée !');
          } else if (f.type === 'skin') {
            if (typeof window.equipSkin === 'function') window.equipSkin(player, f.id);
            else { localStorage.setItem('p4-token-skin-' + player, f.id); try{ document.body.setAttribute('data-token-skin-' + player, f.id);}catch(e){} }
            alert('Skin équipé !');
          }
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
      if (f.type === 'font') {
        b.style.fontFamily = f.css || 'inherit';
        b.textContent = f.name || 'Font';
        b.addEventListener('click', ()=> { equipFont(player, f.css); alert('Font équipée !'); });
      } else if (f.type === 'skin') {
        b.textContent = f.name || 'Skin';
        b.addEventListener('click', ()=> { equipSkin(player, f.id); alert('Skin équipé !'); });
      } else {
        b.textContent = f.name || 'Item';
      }
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
