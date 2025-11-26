// logique.js (mise à jour — extrait clé)
const leftRollEl = document.getElementById('left-roll');
const rightRollEl = document.getElementById('right-roll');
const leftScoreEl = document.getElementById('left-score');
const rightScoreEl = document.getElementById('right-score');
const playBtn = document.getElementById('play-btn');
const resultEl = document.getElementById('result');

// ... (tes autres fonctions loadScores/saveScores/animateRoll etc restent)

playBtn.addEventListener('click', ()=>{
  const left = rollOne();
  const right = rollOne();

  animateRoll(leftRollEl, left);
  animateRoll(rightRollEl, right);

  setTimeout(()=>{
    if(left > right){
      resultEl.innerHTML = 'Joueur 1 gagne !';
      leftScoreEl.textContent = String(Number(leftScoreEl.textContent||0)+1);
      // +5 € au gagnant
      if (typeof addMoney === 'function') addMoney(1, 5);
    } else if(right > left){
      resultEl.innerHTML = 'Joueur 2 gagne !';
      rightScoreEl.textContent = String(Number(rightScoreEl.textContent||0)+1);
      if (typeof addMoney === 'function') addMoney(2, 5);
    } else {
      resultEl.innerHTML = "Égalité — aucun point ajouté";
    }
    saveScores();
  }, 520);
});


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
// --- GACHA & INVENTAIRE ---

const fonts = [
  {name:"Serif", css:"serif"},
  {name:"Monospace", css:"monospace"},
  {name:"Fantasy", css:"fantasy"},
  {name:"Cursive", css:"cursive"},
  {name:"Pixel", css:"'Press Start 2P', cursive"},
];

function initPlayerData() {
  if (!localStorage.getItem("money1")) localStorage.setItem("money1", "0");
  if (!localStorage.getItem("money2")) localStorage.setItem("money2", "0");
  if (!localStorage.getItem("inv1")) localStorage.setItem("inv1", "[]");
  if (!localStorage.getItem("inv2")) localStorage.setItem("inv2", "[]");
  if (!localStorage.getItem("font1")) localStorage.setItem("font1", "default");
  if (!localStorage.getItem("font2")) localStorage.setItem("font2", "default");
}

initPlayerData();
updateMoneyDisplay();
applyFonts();

function updateMoneyDisplay() {
  document.getElementById("money-left").textContent = "💰 " + localStorage.getItem("money1");
  document.getElementById("money-right").textContent = "💰 " + localStorage.getItem("money2");
}

function addMoney(player, amount) {
  const key = "money" + player;
  const newVal = Number(localStorage.getItem(key)) + amount;
  localStorage.setItem(key, newVal);
  updateMoneyDisplay();
}
function openGacha(player) {
  const money = Number(localStorage.getItem("money" + player));

  if (money < 20) {
    showPopup("Pas assez d'argent", "<p>Il faut 20 💰</p>");
    return;
  }

  addMoney(player, -20);

  const reward = fonts[Math.floor(Math.random() * fonts.length)];

  let inv = JSON.parse(localStorage.getItem("inv" + player));
  inv.push(reward);
  localStorage.setItem("inv" + player, JSON.stringify(inv));

  showPopup("🎰 Gacha", `<p>Tu as gagné : <b>${reward.name}</b></p>`);
}
function openInventory(player) {
  const inv = JSON.parse(localStorage.getItem("inv" + player));

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
  const inv = JSON.parse(localStorage.getItem("inv" + player));
  const f = inv[index];

  localStorage.setItem("font" + player, f.css);

  applyFonts();
  showPopup("Équipé", `<p>Nouvelle font appliquée !</p>`);
}

function applyFonts() {
  const f1 = localStorage.getItem("font1");
  const f2 = localStorage.getItem("font2");

  if (f1 !== "default")
    document.getElementById("name-left").style.fontFamily = f1;

  if (f2 !== "default")
    document.getElementById("name-right").style.fontFamily = f2;
}
function showPopup(title, body) {
  document.getElementById("popup-title").innerHTML = title;
  document.getElementById("popup-body").innerHTML = body;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function saveScores(){
  localStorage.setItem('score-left', leftScoreEl.textContent);
  localStorage.setItem('score-right', rightScoreEl.textContent);
}

function loadNamesAndColors(){
  const leftName = localStorage.getItem('name-left') || 'Joueur 1';
  const rightName = localStorage.getItem('name-right') || 'Joueur 2';
  const leftColor = localStorage.getItem('color-left') || '#7dd3fc';
  const rightColor = localStorage.getItem('color-right') || '#fca5a5';

  leftNameInput.value = leftName;
  rightNameInput.value = rightName;
  leftColorInput.value = leftColor;
  rightColorInput.value = rightColor;

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
  // Affiche le nom comme input stylé (on garde l'input mais on applique couleur)
  leftNameInput.style.color = leftColorInput.value;
  rightNameInput.style.color = rightColorInput.value;
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

  // réinitialiser classes
  playerLeftSection.classList.remove('leader','tie');
  playerRightSection.classList.remove('leader','tie');
  leftCrown.classList.remove('visible');
  rightCrown.classList.remove('visible');

  if(left > right){
    playerLeftSection.classList.add('leader');
    leftCrown.classList.add('visible');
  } else if(right > left){
    playerRightSection.classList.add('leader');
    rightCrown.classList.add('visible');
  } else if(left === right && left !== 0){
    // Egalité mais scores non nuls — indiquer tie visuellement
    playerLeftSection.classList.add('tie');
    playerRightSection.classList.add('tie');
    // on peut afficher deux petites couronnes
    leftCrown.classList.add('visible');
    rightCrown.classList.add('visible');
  } else {
    // pas de points, aucune couronne
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
      resultEl.innerHTML = `${(localStorage.getItem('name-left')||leftNameInput.value||'Joueur 1')} gagne !`;
      leftScoreEl.textContent = String(Number(leftScoreEl.textContent||0)+1);
    } else if(right > left){
      resultEl.innerHTML = `${(localStorage.getItem('name-right')||rightNameInput.value||'Joueur 2')} gagne !`;
      rightScoreEl.textContent = String(Number(rightScoreEl.textContent||0)+1);
    } else {
      resultEl.innerHTML = "Égalité — aucun point ajouté";
    }
    saveScores();
    updateLeaderCrown();
  }, 520);
});

// événements noms / couleurs
leftNameInput.addEventListener('change', ()=>{
  saveName('left');
});
leftNameInput.addEventListener('input', ()=>{
  // mise à jour immédiate locale (pas obliger d'attendre change)
  saveName('left');
});

rightNameInput.addEventListener('change', ()=>{
  saveName('right');
});
rightNameInput.addEventListener('input', ()=>{
  saveName('right');
});

leftColorInput.addEventListener('input', ()=>{
  saveColor('left');
  applyNameColor();
});
rightColorInput.addEventListener('input', ()=>{
  saveColor('right');
  applyNameColor();
});

// reset scores
resetBtn.addEventListener('click', ()=>{
  if (!confirm('Réinitialiser les scores ?')) return;
  localStorage.setItem('score-left','0');
  localStorage.setItem('score-right','0');
  loadScores();
  updateLeaderCrown();
});

// reset noms & couleurs
resetNamesBtn.addEventListener('click', ()=>{
  if(!confirm('Remettre les noms et couleurs par défaut ?')) return;
  localStorage.removeItem('name-left');
  localStorage.removeItem('name-right');
  localStorage.removeItem('color-left');
  localStorage.removeItem('color-right');
  loadNamesAndColors();
  applyNameColor();
});

// initialisation
loadScores();
loadNamesAndColors();
applyNameColor();
updateLeaderCrown();
