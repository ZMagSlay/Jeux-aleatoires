// logique_multi.js - modes 2..5 (NB défini dans la page HTML)
// ----------------------------------------------------------
const leftScoreEl = document.getElementById('left-score');
const rightScoreEl = document.getElementById('right-score');
const resultEl = document.getElementById('result');
const playBtn = document.getElementById('play-btn');

// noms & couleurs
const leftNameInput = document.getElementById('left-name-input');
const rightNameInput = document.getElementById('right-name-input');
const leftColorInput = document.getElementById('left-color');
const rightColorInput = document.getElementById('right-color');

// couronnes + sections
const leftCrown = document.getElementById('left-crown');
const rightCrown = document.getElementById('right-crown');
const playerLeftSection = document.getElementById('player-left');
const playerRightSection = document.getElementById('player-right');

// boutons reset
const resetBtn = document.getElementById('reset-btn');
const resetNamesBtn = document.getElementById('reset-names-btn');

// ---------------------- FONCTIONS DE BASE ----------------------
function roll() {
  return Math.floor(Math.random()*10000)+1;
}

function animate(el, final){
  let i=0;
  let steps=12;
  const t=setInterval(()=>{
    el.textContent = roll();
    i++;
    if(i>=steps){
      clearInterval(t);
      el.textContent = final;
    }
  },40);
}

// ---------------------- argent (compatible gacha_pages.js) ----------------------
function initPlayerDataMulti() {
  if (!localStorage.getItem("money1")) localStorage.setItem("money1", "0");
  if (!localStorage.getItem("money2")) localStorage.setItem("money2", "0");
  if (!localStorage.getItem("inv1")) localStorage.setItem("inv1", "[]");
  if (!localStorage.getItem("inv2")) localStorage.setItem("inv2", "[]");
  if (!localStorage.getItem("font1")) localStorage.setItem("font1", "default");
  if (!localStorage.getItem("font2")) localStorage.setItem("font2", "default");
}

// ne redéfinit pas si déjà présent
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
    if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
  }
}

// ---------------------- NOMS / COULEURS ----------------------
function loadNamesAndColors(){
  if (leftNameInput) leftNameInput.value = localStorage.getItem('name-left') || "Joueur 1";
  if (rightNameInput) rightNameInput.value = localStorage.getItem('name-right') || "Joueur 2";

  if (leftColorInput) leftColorInput.value = localStorage.getItem('color-left') || "#7dd3fc";
  if (rightColorInput) rightColorInput.value = localStorage.getItem('color-right') || "#fca5a5";

  applyNameColor();
}

function applyNameColor(){
  if (leftNameInput) leftNameInput.style.color = leftColorInput.value;
  if (rightNameInput) rightNameInput.style.color = rightColorInput.value;
}

function saveName(side){
  if(side==="left"){
    localStorage.setItem("name-left", leftNameInput.value.trim());
  } else {
    localStorage.setItem("name-right", rightNameInput.value.trim());
  }
}

function saveColor(side){
  if(side==="left"){
    localStorage.setItem("color-left", leftColorInput.value);
  } else {
    localStorage.setItem("color-right", rightColorInput.value);
  }
}

if (leftNameInput) leftNameInput.addEventListener("input",()=>saveName("left"));
if (rightNameInput) rightNameInput.addEventListener("input",()=>saveName("right"));
if (leftColorInput) leftColorInput.addEventListener("input",()=>{ saveColor("left"); applyNameColor(); });
if (rightColorInput) rightColorInput.addEventListener("input",()=>{ saveColor("right"); applyNameColor(); });

// ---------------------- SCORES ----------------------
function loadScores(){
  leftScoreEl.textContent = localStorage.getItem('score-left') || "0";
  rightScoreEl.textContent = localStorage.getItem('score-right') || "0";
}

function saveScores(){
  localStorage.setItem("score-left", leftScoreEl.textContent);
  localStorage.setItem("score-right", rightScoreEl.textContent);
}

// reset score
if (resetBtn) resetBtn.addEventListener("click",()=>{
  if(!confirm("Reset des scores ?")) return;
  localStorage.setItem("score-left","0");
  localStorage.setItem("score-right","0");
  loadScores();
  updateLeaderCrown();
});

// reset noms & couleurs
if (resetNamesBtn) resetNamesBtn.addEventListener("click",()=>{
  if(!confirm("Reset des noms & couleurs ?")) return;
  localStorage.removeItem("name-left");
  localStorage.removeItem("name-right");
  localStorage.removeItem("color-left");
  localStorage.removeItem("color-right");
  loadNamesAndColors();
});

// ---------------------- COURONNES ----------------------
function updateLeaderCrown(){
  const L = Number(leftScoreEl.textContent);
  const R = Number(rightScoreEl.textContent);

  playerLeftSection.classList.remove("leader","tie");
  playerRightSection.classList.remove("leader","tie");
  if (leftCrown) leftCrown.classList.remove("visible");
  if (rightCrown) rightCrown.classList.remove("visible");

  if(L>R){
    playerLeftSection.classList.add("leader");
    if (leftCrown) leftCrown.classList.add("visible");
  }
  else if(R>L){
    playerRightSection.classList.add("leader");
    if (rightCrown) rightCrown.classList.add("visible");
  }
  else if(L===R && L!==0){
    playerLeftSection.classList.add("tie");
    playerRightSection.classList.add("tie");
    if (leftCrown) leftCrown.classList.add("visible");
    if (rightCrown) rightCrown.classList.add("visible");
  }
}

// ---------------------- LOGIQUE DU MODE MULTI-LIGNES ----------------------
playBtn.addEventListener("click",()=>{

  let leftWins=0;
  let rightWins=0;

  for(let i=1;i<=NB;i++){
    const l = roll();
    const r = roll();

    const leftEl = document.getElementById(`l1-${i}`);
    const rightEl = document.getElementById(`r1-${i}`);

    if (leftEl) animate(leftEl, l);
    if (rightEl) animate(rightEl, r);

    if(l>r) leftWins++;
    else if(r>l) rightWins++;
  }

  setTimeout(()=>{
    if(leftWins>rightWins){
      leftScoreEl.textContent = String(Number(leftScoreEl.textContent||0)+1);
      resultEl.textContent = `${localStorage.getItem("name-left") || "Joueur 1"} gagne la manche`;
      if (typeof addMoney === 'function') addMoney(1,5);
      else {
        const m = Number(localStorage.getItem('money1')||0);
        localStorage.setItem('money1', String(m+5));
        if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
      }
    }
    else if(rightWins>leftWins){
      rightScoreEl.textContent = String(Number(rightScoreEl.textContent||0)+1);
      resultEl.textContent = `${localStorage.getItem("name-right") || "Joueur 2"} gagne la manche`;
      if (typeof addMoney === 'function') addMoney(2,5);
      else {
        const m = Number(localStorage.getItem('money2')||0);
        localStorage.setItem('money2', String(m+5));
        if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
      }
    }
    else{
      resultEl.textContent = "Égalité parfaite";
    }

    saveScores();
    updateLeaderCrown();
  }, 600);

});

// ---------------------- INITIALISATION ----------------------
initPlayerDataMulti();
loadScores();
loadNamesAndColors();
applyNameColor();
if (typeof updateMoneyDisplay === 'function') updateMoneyDisplay();
updateLeaderCrown();
