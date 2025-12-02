// ---- Puissance 4 Game ----

class Puissance4 {
  constructor() {
    this.ROWS = 6;
    this.COLS = 7;
    this.board = [];
    this.currentPlayer = 1; // 1 or 2
    this.gameOver = false;
    this.stats = {
      gamesPlayed: 0,
      player1Wins: 0,
      player2Wins: 0,
      draws: 0
    };
    this.playerNames = {
      1: 'Joueur 1',
      2: 'Joueur 2'
    };

    this.initializeBoard();
    this.setupEventListeners();
    this.renderBoard();
    this.loadStats();
    this.updateUI();
  }

  initializeBoard() {
    this.board = Array(this.ROWS).fill(null).map(() => Array(this.COLS).fill(0));
    this.currentPlayer = 1;
    this.gameOver = false;
  }

  setupEventListeners() {
    document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
    document.getElementById('resetScoreBtn').addEventListener('click', () => this.resetScore());
  }

  renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let col = 0; col < this.COLS; col++) {
      const column = document.createElement('div');
      column.className = 'p4-column';
      column.dataset.col = col;
      column.addEventListener('click', () => this.playColumn(col));

      // Afficher de haut en bas (row 0 en haut, row 5 en bas)
      for (let row = 0; row < this.ROWS; row++) {
        const cell = document.createElement('div');
        cell.className = 'p4-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        const value = this.board[row][col];
        if (value === 1) {
          cell.classList.add('player1');
        } else if (value === 2) {
          cell.classList.add('player2');
        } else {
          cell.classList.add('empty');
        }

        column.appendChild(cell);
      }

      boardElement.appendChild(column);
    }
  }

  renderBoardWithDropAnimation(col, row) {
    const boardElement = document.getElementById('board');
    const columns = boardElement.querySelectorAll('.p4-column');
    const column = columns[col];
    
    if (column) {
      const cells = column.querySelectorAll('.p4-cell');
      const cell = cells[row];
      if (cell) {
        // Déterminer la couleur pour l'animation fantôme
        const playerColor = this.currentPlayer === 1 ? '#ff6b6b' : '#ffd93d';
        const playerBorder = this.currentPlayer === 1 ? '#ff5252' : '#ffc107';
        
        // Ajouter la classe player correspondante
        if (this.currentPlayer === 1) {
          cell.classList.remove('empty');
          cell.classList.add('player1', 'dropping');
          cell.style.setProperty('--player-color', playerColor);
          cell.style.setProperty('--player-border', playerBorder);
        } else {
          cell.classList.remove('empty');
          cell.classList.add('player2', 'dropping');
          cell.style.setProperty('--player-color', playerColor);
          cell.style.setProperty('--player-border', playerBorder);
        }
        
        // Retirer la classe dropping après l'animation
        setTimeout(() => {
          cell.classList.remove('dropping');
        }, 700);
      }
    }
  }

  playColumn(col) {
    if (this.gameOver) {
      return;
    }

    // Find the lowest empty row in the column
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row][col] === 0) {
        this.board[row][col] = this.currentPlayer;
        
        // Render only the new token with drop animation
        this.renderBoardWithDropAnimation(col, row);
        
        if (this.checkWin(row, col)) {
          this.gameOver = true;
          
          // Highlight winning cells
          this.highlightWinningCells(row, col);
          
          // Update stats
          this.stats.gamesPlayed++;
          if (this.currentPlayer === 1) {
            this.stats.player1Wins++;
          } else {
            this.stats.player2Wins++;
          }
          this.saveStats();
          
          // Show winner message with delay for dramatic effect
          setTimeout(() => {
            this.updateUI();
            document.getElementById('gameMessage').textContent = 
              `🎉 ${this.playerNames[this.currentPlayer]} a gagné! 🎉`;
            document.getElementById('gameMessage').classList.add('win');
            
            // Trigger confetti-like effect on the board
            this.triggerWinEffect();
          }, 700);
          
          return;
        }

        if (this.isBoardFull()) {
          this.gameOver = true;
          this.stats.gamesPlayed++;
          this.stats.draws++;
          this.saveStats();
          this.updateUI();
          document.getElementById('gameMessage').textContent = "Égalité! Le plateau est plein.";
          document.getElementById('gameMessage').classList.add('draw');
          return;
        }

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateUI();
        return;
      }
    }
  }

  highlightWinningCells(row, col) {
    const player = this.board[row][col];
    const winningCells = [{ row, col }];

    // Check all directions and collect winning cells
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal \
      [1, -1]   // Diagonal /
    ];

    let maxConsecutive = 1; // Au moins le jeton courant
    
    for (let [dRow, dCol] of directions) {
      let consecutiveCount = 1; // Compter le jeton courant
      const directionWinningCells = [{ row, col }];
      
      // Check positive direction
      let r = row + dRow;
      let c = col + dCol;
      while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
        directionWinningCells.push({ row: r, col: c });
        consecutiveCount++;
        r += dRow;
        c += dCol;
      }

      // Check negative direction
      r = row - dRow;
      c = col - dCol;
      while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
        directionWinningCells.push({ row: r, col: c });
        consecutiveCount++;
        r -= dRow;
        c -= dCol;
      }

      // Si on a 4 ou plus dans cette direction, ce sont les gagnants
      if (consecutiveCount >= 4) {
        this.winningCells = directionWinningCells;
        return; // Arrêter dès qu'on trouve une direction gagnante
      }
    }

    // Par défaut, si rien ne correspond (ne devrait pas arriver ici)
    this.winningCells = [{ row, col }];
  }

  triggerWinEffect() {
    const board = document.getElementById('board');
    const columns = board.querySelectorAll('.p4-column');
    
    // Add winning class to winning cells
    if (this.winningCells) {
      this.winningCells.forEach(({ row, col }) => {
        const column = columns[col];
        if (column) {
          const cells = column.querySelectorAll('.p4-cell');
          // Les cellules sont dans l'ordre (row 0 en haut, row 5 en bas)
          const cellElement = cells[row];
          if (cellElement) {
            cellElement.classList.add('winning');
          }
        }
      });
    }

    // Extra effect: pulse the entire board
    board.style.animation = 'none';
    setTimeout(() => {
      board.style.animation = 'boardShakeUltra 1.5s ease-out';
    }, 10);

    // Déclencher confettis et explosions
    this.triggerVictoryEffects();
  }

  checkWin(row, col) {
    const player = this.board[row][col];

    // Horizontal
    if (this.countConsecutive(row, col, 0, 1, player) + 
        this.countConsecutive(row, col, 0, -1, player) >= 3) {
      return true;
    }

    // Vertical
    if (this.countConsecutive(row, col, 1, 0, player) + 
        this.countConsecutive(row, col, -1, 0, player) >= 3) {
      return true;
    }

    // Diagonal /
    if (this.countConsecutive(row, col, 1, 1, player) + 
        this.countConsecutive(row, col, -1, -1, player) >= 3) {
      return true;
    }

    // Diagonal \
    if (this.countConsecutive(row, col, 1, -1, player) + 
        this.countConsecutive(row, col, -1, 1, player) >= 3) {
      return true;
    }

    return false;
  }

  countConsecutive(row, col, dRow, dCol, player) {
    let count = 0;
    let r = row + dRow;
    let c = col + dCol;

    while (r >= 0 && r < this.ROWS && c >= 0 && c < this.COLS && this.board[r][c] === player) {
      count++;
      r += dRow;
      c += dCol;
    }

    return count;
  }

  isBoardFull() {
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  newGame() {
    this.initializeBoard();
    this.renderBoard();
    this.updateUI();
    document.getElementById('gameMessage').textContent = '';
    document.getElementById('gameMessage').classList.remove('win', 'draw');
  }

  resetScore() {
    this.stats = {
      gamesPlayed: 0,
      player1Wins: 0,
      player2Wins: 0,
      draws: 0
    };
    this.saveStats();
    this.updateUI();
    this.newGame();
  }

  updateUI() {
    document.getElementById('currentPlayerName').textContent = this.playerNames[this.currentPlayer];
    document.getElementById('player1Name').textContent = this.playerNames[1];
    document.getElementById('player2Name').textContent = this.playerNames[2];
    document.getElementById('player1Score').textContent = this.stats.player1Wins;
    document.getElementById('player2Score').textContent = this.stats.player2Wins;
    document.getElementById('gamesPlayed').textContent = this.stats.gamesPlayed;
    document.getElementById('draws').textContent = this.stats.draws;
  }

  saveStats() {
    localStorage.setItem('p4Stats', JSON.stringify(this.stats));
  }

  loadStats() {
    const saved = localStorage.getItem('p4Stats');
    if (saved) {
      this.stats = JSON.parse(saved);
    }
  }

  // Créer des confettis qui tombent
  createConfetti() {
    const colors = ['#ff6b6b', '#ffd93d', '#7CFFB2', '#7dd3fc', '#ff5252', '#ffc107'];
    const confettiCount = 80; // Nombre de confettis

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti ' + (Math.random() > 0.5 ? 'rect' : 'circle');
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      const duration = 2 + Math.random() * 1.5; // Entre 2 et 3.5 secondes
      const delay = Math.random() * 0.5; // Délai variable
      const animationName = Math.random() > 0.5 ? 
        (Math.random() > 0.5 ? 'confettiFall' : 'confettiFallLeft') :
        (Math.random() > 0.5 ? 'confettiFallWide' : 'confettiFallWideLeft');
      
      confetti.style.animation = `${animationName} ${duration}s linear ${delay}s forwards`;
      
      document.body.appendChild(confetti);

      // Supprimer après animation
      setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }
  }

  // Créer des explosions et ondes de choc AMPLIFIÉES MASSIVES
  createExplosions() {
    const explosionCount = 150; // 9x plus d'explosions!

    for (let i = 0; i < explosionCount; i++) {
      const explosion = document.createElement('div');
      explosion.className = 'explosion burst';
      
      // Explosions partout sur la page, pas juste le plateau
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      
      explosion.style.left = randomX + 'px';
      explosion.style.top = randomY + 'px';
      explosion.style.width = (20 + Math.random() * 80) + 'px'; // Plus gros
      explosion.style.height = explosion.style.width;
      explosion.style.marginLeft = '-' + (parseInt(explosion.style.width) / 2) + 'px';
      explosion.style.marginTop = '-' + (parseInt(explosion.style.width) / 2) + 'px';
      
      const duration = 0.4 + Math.random() * 0.6;
      const delay = Math.random() * 0.3;
      explosion.style.animation = `explosionBurst ${duration}s ease-out ${delay}s forwards`;
      
      document.body.appendChild(explosion);

      // Supprimer après animation
      setTimeout(() => explosion.remove(), (duration + delay) * 1000);

      // Créer une onde de choc au même endroit
      const shockWaveDelay = delay + 0.08;
      setTimeout(() => {
        const shock = document.createElement('div');
        shock.className = 'explosion shock';
        shock.style.left = randomX + 'px';
        shock.style.top = randomY + 'px';
        shock.style.width = '0px';
        shock.style.height = '0px';
        shock.style.marginLeft = '0px';
        shock.style.marginTop = '0px';
        
        const shockDuration = 0.8;
        shock.style.animation = `shockWave ${shockDuration}s ease-out forwards`;
        
        document.body.appendChild(shock);

        // Supprimer après animation
        setTimeout(() => shock.remove(), shockDuration * 1000);
      }, shockWaveDelay * 1000);
    }

    // Créer des éclairs
    this.createLightning();
    
    // Créer des particules
    this.createParticleBurst();
    
    // Flash blanc intense
    this.createWhiteFlash();
  }

  // Créer des éclairs/lightning
  createLightning() {
    const lightningCount = 8;
    for (let i = 0; i < lightningCount; i++) {
      const lightning = document.createElement('div');
      lightning.className = 'lightning';
      
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      const width = 5 + Math.random() * 15;
      const height = 100 + Math.random() * 300;
      
      lightning.style.left = randomX + 'px';
      lightning.style.top = randomY + 'px';
      lightning.style.width = width + 'px';
      lightning.style.height = height + 'px';
      lightning.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      const delay = Math.random() * 0.4;
      lightning.style.animation = `lightning 0.3s ease-in-out ${delay}s forwards`;
      
      document.body.appendChild(lightning);
      setTimeout(() => lightning.remove(), (0.3 + delay) * 1000);
    }
  }

  // Créer une explosion de particules
  createParticleBurst() {
    const boardRect = document.getElementById('board').getBoundingClientRect();
    const centerX = boardRect.left + boardRect.width / 2;
    const centerY = boardRect.top + boardRect.height / 2;
    const particleCount = 60;
    const colors = ['#ff6b6b', '#ffd93d', '#7CFFB2', '#ff5252', '#ffc107', '#7dd3fc'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = (5 + Math.random() * 15) + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 200 + Math.random() * 300;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      
      const duration = 0.8 + Math.random() * 0.6;
      particle.style.animation = `particleBurst ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
      
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), duration * 1000);
    }
  }

  // Créer des messages moqueurs pour le joueur perdant
  createMockMessages() {
    const mockMessages = [
      "💀 BOOM! 💀",
      "😂 T'AS PERDU! 😂",
      "💥 NOOOOOO! 💥",
      "🤣 GG! 🤣",
      "😆 C'EST FINI! 😆",
      "🔥 DESTROYED! 🔥",
      "☠️ DÉFAITE! ☠️",
      "🎯 ONE-SIDED! 🎯",
      "💀 PWNED! 💀",
      "🎊 LOOOOL! 🎊",
      "⚡ GAME OVER! ⚡",
      "😱 REKT! 😱",
      "🌪️ WIPEOUT! 🌪️",
      "🚀 TOO EASY! 🚀",
      "☠️ ANNIHILATED! ☠️"
    ];

    const animationTypes = ['bounce', 'shake', 'flip', 'pulse'];
    const messageCount = 12; // Nombre de messages

    for (let i = 0; i < messageCount; i++) {
      const message = document.createElement('div');
      message.className = 'mock-message ' + animationTypes[Math.floor(Math.random() * animationTypes.length)];
      message.textContent = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      
      const randomX = Math.random() * (window.innerWidth - 200);
      const randomY = Math.random() * (window.innerHeight - 100);
      
      message.style.left = randomX + 'px';
      message.style.top = randomY + 'px';
      
      document.body.appendChild(message);

      // Supprimer après animation (5s + 2s fadeout = 7s total)
      setTimeout(() => message.remove(), 7000);
    }
  }

  // Déclencher tous les effets de victoire
  triggerVictoryEffects() {
    this.createConfetti();
    this.createExplosions();
    this.createMockMessages(); // Ajouter messages moqueurs
    
    // Aussi déclencher l'animation du plateau - EXPLOSION MASSIVE
    const boardElement = document.getElementById('board');
    boardElement.style.animation = 'none';
    
    // Appliquer plusieurs animations d'explosion du plateau
    setTimeout(() => {
      boardElement.style.animation = 'boardExplode 0.6s ease-out, boardShakeUltra 1.8s ease-in-out, boardPulseExtreme 1s ease-in-out infinite';
    }, 10);
    
    setTimeout(() => {
      boardElement.style.animation = '';
    }, 1800);
  }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Puissance4();
});
