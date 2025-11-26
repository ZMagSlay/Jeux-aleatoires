
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