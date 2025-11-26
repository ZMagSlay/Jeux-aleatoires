// logique.js - mode 1 (1 tirage vs 1 tirage)
// ------------------------------------------------
const leftRollEl = document.getElementById('left-roll');
const rightRollEl = document.getElementById('right-roll');
const leftScoreEl = document.getElementById('left-score');
const rightScoreEl = document.getElementById('right-score');
const playBtn = document.getElementById('play-btn');
const resultEl = document.getElementById('result');

const leftNameInput = document.getElementById('left-name-input');
const rightNameInput = document.getElementById('right-name-input');
const leftColorInput = document.getElementById('left-color');
const rightColorInput = document.getElementById('right-color');

const leftCrown = document.getElementById('left-crown');
const rightCrown = document.getElementById('right-crown');

const playerLeftSection = document.getElementById('player-left');
const playerRightSection = document.getElementById('player-right');

const resetBtn = document.getElementById('reset-btn');
const resetNamesBtn = document.getElementById('reset-names-btn');

function loadScores(){
  leftScoreEl.textContent = localStorage.getItem('score-left') || '0';
  rightScoreEl.textContent = localStorage.getItem('score-right') || '0';
}

// -------------------- argent (compatible gacha_pages.js) --------------------
// on initialise les clés si absent
function initPlayerData() {
  if (!localStorage.getItem("money1")) localStorage.setItem("money1", "0");
  if (!localStorage.getItem("money2")) localStorage.setItem("money2", "0");
  if (!localStorage.getItem("inv1")) localStorage.setItem("inv1", "[]");
  if (!localStorage.getItem("inv2")) localStorage.setItem("inv2", "[]");
  if (!localStorage.getItem("font1")) localStorage.setItem("font1", "default");
  if (!localStorage.getItem("font2")) localStorage.setItem("font2", "default");
}

// updateMoneyDisplay et addMoney : on ne redéfinit que si elles n'existent pas
if (typeof updateMoneyDisplay !== 'function') {
  function updateMoneyDisplay() {
    const m1 = localStorage.getItem('money1') || '0';
    const m2 = localStorage.getItem('money2') || '0';
    const el1 = document.getElementById("money-left");
    const el2 = document.getElementById("money-right");
    if (el1) el1.textContent = "💰 " + m1;
    if (el2) el2.textContent = "💰 " + m2;
  }
}

if (typeof addMoney !== 'function') {
  function addMoney(player, amount) {
    const key = 'money' + (player === 1 ? '1' : '2');
    const cur = Number(localStorage.getItem(key) || 0);
    localStorage.setItem(key, String(cur + Number(amount)));
    // mise à jour visuelle
    if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
  }
}

// -------------------- gacha / fonts (simple) --------------------
const fonts = [
  {name:"Serif", css:"serif"},
  {name:"Monospace", css:"monospace"},
  {name:"Fantasy", css:"fantasy"},
  {name:"Cursive", css:"cursive"},
  {name:"Pixel", css:"'Press Start 2P', cursive"},
];

function openGacha(player) {
  const money = Number(localStorage.getItem("money" + (player===1? '1':'2')));
  if (money < 20) {
    showPopup("Pas assez d'argent", "<p>Il faut 20 💰</p>");
    return;
  }
  addMoney(player, -20);
  const reward = fonts[Math.floor(Math.random() * fonts.length)];
  let inv = JSON.parse(localStorage.getItem('inv' + (player===1? '1':'2')) || '[]');
  inv.push(reward);
  localStorage.setItem('inv' + (player===1? '1':'2'), JSON.stringify(inv));
  showPopup("🎰 Gacha", `<p>Tu as gagné : <b>${reward.name}</b></p>`);
}

function openInventory(player) {
  const inv = JSON.parse(localStorage.getItem('inv' + (player===1? '1':'2')) || '[]');
  if (inv.length === 0) {
    showPopup("Inventaire", "<p>Aucune font obtenue.</p>");
    return;
  }
  let html = "<p>Choisis une font :</p>";
  inv.forEach((f, i) => {
    html += `
      <button class="btn small" onclick="equipFont(${player}, ${i})" 
        style="font-family:${f.css}">
        ${f.name}
      </button><br>`;
  });
  showPopup("Inventaire", html);
}

function equipFont(player, index) {
  const inv = JSON.parse(localStorage.getItem('inv' + (player===1? '1':'2')) || '[]');
  const f = inv[index];
  if(!f) return;
  localStorage.setItem('font' + (player===1? '1':'2'), f.css);
  applyFonts();
  showPopup("Équipé", `<p>Nouvelle font appliquée !</p>`);
}

function applyFonts() {
  const f1 = localStorage.getItem('font1');
  const f2 = localStorage.getItem('font2');
  const el1 = document.getElementById("name-left");
  const el2 = document.getElementById("name-right");
  if (el1) el1.style.fontFamily = (f1 && f1 !== 'default') ? f1 : '';
  if (el2) el2.style.fontFamily = (f2 && f2 !== 'default') ? f2 : '';
}

function showPopup(title, body) {
  const t = document.getElementById("popup-title");
  const b = document.getElementById("popup-body");
  const p = document.getElementById("popup");
  if (t) t.innerHTML = title;
  if (b) b.innerHTML = body;
  if (p) p.classList.remove("hidden");
}
function closePopup() {
  const p = document.getElementById("popup");
  if (p) p.classList.add("hidden");
}

// -------------------- noms / couleurs / sauvegardes --------------------
function saveScores(){
  localStorage.setItem('score-left', leftScoreEl.textContent);
  localStorage.setItem('score-right', rightScoreEl.textContent);
}

function loadNamesAndColors(){
  const leftName = localStorage.getItem('name-left') || 'Joueur 1';
  const rightName = localStorage.getItem('name-right') || 'Joueur 2';
  const leftColor = localStorage.getItem('color-left') || '#7dd3fc';
  const rightColor = localStorage.getItem('color-right') || '#fca5a5';

  if (leftNameInput) leftNameInput.value = leftName;
  if (rightNameInput) rightNameInput.value = rightName;
  if (leftColorInput) leftColorInput.value = leftColor;
  if (rightColorInput) rightColorInput.value = rightColor;

  applyNameColor();
}

function saveName(side){
  if(side === 'left'){
    localStorage.setItem('name-left', leftNameInput.value.trim() || 'Joueur 1');
  } else {
    localStorage.setItem('name-right', rightNameInput.value.trim() || 'Joueur 2');
  }
}

function saveColor(side){
  if(side === 'left'){
    localStorage.setItem('color-left', leftColorInput.value);
  } else {
    localStorage.setItem('color-right', rightColorInput.value);
  }
}

function applyNameColor(){
  if (leftNameInput) leftNameInput.style.color = leftColorInput.value;
  if (rightNameInput) rightNameInput.style.color = rightColorInput.value;
}

// roll jusqu'à 10000 inclus
function rollOne(){
  return Math.floor(Math.random()*10000) + 1;
}

function animateRoll(el, final){
  const steps = 12;
  let i = 0;
  const t = setInterval(()=>{
    el.textContent = String(Math.floor(Math.random()*10000)+1);
    i++;
    if(i>=steps){ clearInterval(t); el.textContent = String(final); }
  }, 40);
}

function updateLeaderCrown(){
  const left = Number(leftScoreEl.textContent || 0);
  const right = Number(rightScoreEl.textContent || 0);

  playerLeftSection.classList.remove('leader','tie');
  playerRightSection.classList.remove('leader','tie');
  if (leftCrown) leftCrown.classList.remove('visible');
  if (rightCrown) rightCrown.classList.remove('visible');

  if(left > right){
    playerLeftSection.classList.add('leader');
    if (leftCrown) leftCrown.classList.add('visible');
  } else if(right > left){
    playerRightSection.classList.add('leader');
    if (rightCrown) rightCrown.classList.add('visible');
  } else if(left === right && left !== 0){
    playerLeftSection.classList.add('tie');
    playerRightSection.classList.add('tie');
    if (leftCrown) leftCrown.classList.add('visible');
    if (rightCrown) rightCrown.classList.add('visible');
  }
}

// interactions principales
playBtn.addEventListener('click', ()=>{
  const left = rollOne();
  const right = rollOne();

  animateRoll(leftRollEl, left);
  animateRoll(rightRollEl, right);

  setTimeout(()=>{
    if(left > right){
      resultEl.innerHTML = 'Joueur 1 gagne !';
      leftScoreEl.textContent = String(Number(leftScoreEl.textContent||0)+1);
      // +5 via addMoney (compatible gacha_pages.js)
      if (typeof addMoney === 'function') addMoney(1, 5);
      else {
        // fallback : clé money1
        const m = Number(localStorage.getItem('money1') || 0);
        localStorage.setItem('money1', String(m + 5));
        if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
      }
    } else if(right > left){
      resultEl.innerHTML = 'Joueur 2 gagne !';
      rightScoreEl.textContent = String(Number(rightScoreEl.textContent||0)+1);
      if (typeof addMoney === 'function') addMoney(2, 5);
      else {
        const m = Number(localStorage.getItem('money2') || 0);
        localStorage.setItem('money2', String(m + 5));
        if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
      }
    } else {
      resultEl.innerHTML = "Égalité — aucun point ajouté";
    }
    saveScores();
    updateLeaderCrown();
  }, 520);
});

// événements noms / couleurs
if (leftNameInput) {
  leftNameInput.addEventListener('change', ()=> saveName('left'));
  leftNameInput.addEventListener('input', ()=> saveName('left'));
}
if (rightNameInput) {
  rightNameInput.addEventListener('change', ()=> saveName('right'));
  rightNameInput.addEventListener('input', ()=> saveName('right'));
}
if (leftColorInput) leftColorInput.addEventListener('input', ()=>{ saveColor('left'); applyNameColor(); });
if (rightColorInput) rightColorInput.addEventListener('input', ()=>{ saveColor('right'); applyNameColor(); });

// reset scores
if (resetBtn) resetBtn.addEventListener('click', ()=>{
  if (!confirm('Réinitialiser les scores ?')) return;
  localStorage.setItem('score-left','0');
  localStorage.setItem('score-right','0');
  loadScores();
  updateLeaderCrown();
});

// reset noms & couleurs
if (resetNamesBtn) resetNamesBtn.addEventListener('click', ()=>{
  if(!confirm('Remettre les noms et couleurs par défaut ?')) return;
  localStorage.removeItem('name-left');
  localStorage.removeItem('name-right');
  localStorage.removeItem('color-left');
  localStorage.removeItem('color-right');
  loadNamesAndColors();
  applyNameColor();
});

// initialisation
initPlayerData();
loadScores();
loadNamesAndColors();
applyNameColor();
if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
updateLeaderCrown();
