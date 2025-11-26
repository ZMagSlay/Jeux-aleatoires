// --- Sélecteurs dynamiques (communs à tous les modes) ---
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

// ---------------------- NOMS / COULEURS ----------------------

function loadNamesAndColors(){
  leftNameInput.value = localStorage.getItem('name-left') || "Joueur 1";
  rightNameInput.value = localStorage.getItem('name-right') || "Joueur 2";

  leftColorInput.value = localStorage.getItem('color-left') || "#7dd3fc";
  rightColorInput.value = localStorage.getItem('color-right') || "#fca5a5";

  applyNameColor();
}

function applyNameColor(){
  leftNameInput.style.color = leftColorInput.value;
  rightNameInput.style.color = rightColorInput.value;
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

leftNameInput.addEventListener("input",()=>saveName("left"));
rightNameInput.addEventListener("input",()=>saveName("right"));
leftColorInput.addEventListener("input",()=>{ saveColor("left"); applyNameColor(); });
rightColorInput.addEventListener("input",()=>{ saveColor("right"); applyNameColor(); });

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
resetBtn.addEventListener("click",()=>{
  if(!confirm("Reset des scores ?")) return;
  localStorage.setItem("score-left","0");
  localStorage.setItem("score-right","0");
  loadScores();
  updateLeaderCrown();
});

// reset noms & couleurs
resetNamesBtn.addEventListener("click",()=>{
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
  leftCrown.classList.remove("visible");
  rightCrown.classList.remove("visible");

  if(L>R){
    playerLeftSection.classList.add("leader");
    leftCrown.classList.add("visible");
  }
  else if(R>L){
    playerRightSection.classList.add("leader");
    rightCrown.classList.add("visible");
  }
  else if(L===R && L!==0){
    playerLeftSection.classList.add("tie");
    playerRightSection.classList.add("tie");
    leftCrown.classList.add("visible");
    rightCrown.classList.add("visible");
  }
}

// ---------------------- LOGIQUE DU MODE MULTI-LIGNES ----------------------

playBtn.addEventListener("click",()=>{

  let leftWins=0;
  let rightWins=0;

  for(let i=1;i<=NB;i++){
    const l = roll();
    const r = roll();

    animate(document.getElementById(`l1-${i}`), l);
    animate(document.getElementById(`r1-${i}`), r);

    if(l>r) leftWins++;
    else if(r>l) rightWins++;
  }

  setTimeout(()=>{
    if(leftWins>rightWins){
      leftScoreEl.textContent = Number(leftScoreEl.textContent)+1;
      resultEl.textContent = `${localStorage.getItem("name-left") || "Joueur 1"} gagne la manche`;
    }
    else if(rightWins>leftWins){
      rightScoreEl.textContent = Number(rightScoreEl.textContent)+1;
      resultEl.textContent = `${localStorage.getItem("name-right") || "Joueur 2"} gagne la manche`;
    }
    else{
      resultEl.textContent = "Égalité parfaite";
    }

    saveScores();
    updateLeaderCrown();

  }, 600);
});
// après détermination du gagnant
if(leftWins>rightWins){
  leftScoreEl.textContent = Number(leftScoreEl.textContent)+1;
  resultEl.textContent = `${localStorage.getItem("name-left") || "Joueur 1"} gagne la manche`;
  if (typeof addMoney === 'function') addMoney(1,5);
}
else if(rightWins>leftWins){
  rightScoreEl.textContent = Number(rightScoreEl.textContent)+1;
  resultEl.textContent = `${localStorage.getItem("name-right") || "Joueur 2"} gagne la manche`;
  if (typeof addMoney === 'function') addMoney(2,5);
}


// ---------------------- INITIALISATION ----------------------

loadScores();
loadNamesAndColors();
applyNameColor();
updateLeaderCrown();
