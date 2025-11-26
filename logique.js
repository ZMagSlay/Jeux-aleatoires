const leftRollEl = document.getElementById('left-roll');
const rightRollEl = document.getElementById('right-roll');
const leftScoreEl = document.getElementById('left-score');
const rightScoreEl = document.getElementById('right-score');
const playBtn = document.getElementById('play-btn');
const resultEl = document.getElementById('result');

function loadScores(){
  leftScoreEl.textContent = localStorage.getItem('score-left') || '0';
  rightScoreEl.textContent = localStorage.getItem('score-right') || '0';
}

function saveScores(){
  localStorage.setItem('score-left', leftScoreEl.textContent);
  localStorage.setItem('score-right', rightScoreEl.textContent);
}

function rollOne(){
  // marche jusqu'à 10000 inclus
  return Math.floor(Math.random()*10000) + 1;
}

function animateRoll(el, final){
  // animation visuelle simple: nombre qui change rapidement puis finit
  const steps = 12;
  let i = 0;
  const t = setInterval(()=>{
    el.textContent = Math.floor(Math.random()*10000)+1;
    i++;
    if(i>=steps){ clearInterval(t); el.textContent = final; }
  }, 40);
}

playBtn.addEventListener('click', ()=>{
  const left = rollOne();
  const right = rollOne();

  // animate
  animateRoll(leftRollEl, left);
  animateRoll(rightRollEl, right);

  // déterminer le gagnant après l'animation (timing approximatif = 12*40 = 480ms)
  setTimeout(()=>{
    if(left > right){
      resultEl.innerHTML = 'Joueur 1 gagne !';
      leftScoreEl.textContent = String(Number(leftScoreEl.textContent||0)+1);
    } else if(right > left){
      resultEl.innerHTML = 'Joueur 2 gagne !';
      rightScoreEl.textContent = String(Number(rightScoreEl.textContent||0)+1);
    } else {
      resultEl.innerHTML = "Égalité — aucun point ajouté";
    }
    saveScores();
  }, 520);
});

    // charges scores depuis localStorage
    const left = document.getElementById('s-left');
    const right = document.getElementById('s-right');
    const reset = document.getElementById('reset-btn');

    function load() {
      left.textContent = localStorage.getItem('score-left') || '0';
      right.textContent = localStorage.getItem('score-right') || '0';
    }
    load();

    reset.addEventListener('click', ()=>{
      if (!confirm('Réinitialiser les scores ?')) return;
      localStorage.setItem('score-left','0');
      localStorage.setItem('score-right','0');
      load();
    });
// initialisation
loadScores();