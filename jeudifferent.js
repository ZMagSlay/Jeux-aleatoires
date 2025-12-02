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

      for (let row = 0; row < this.ROWS; row++) {
        const cell = document.createElement('div');
        cell.className = 'p4-cell';
        
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

  playColumn(col) {
    if (this.gameOver) {
      return;
    }

    // Find the lowest empty row in the column
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row][col] === 0) {
        this.board[row][col] = this.currentPlayer;
        
        if (this.checkWin(row, col)) {
          this.gameOver = true;
          this.stats.gamesPlayed++;
          if (this.currentPlayer === 1) {
            this.stats.player1Wins++;
          } else {
            this.stats.player2Wins++;
          }
          this.saveStats();
          this.updateUI();
          document.getElementById('gameMessage').textContent = 
            `🎉 ${this.playerNames[this.currentPlayer]} a gagné!`;
          document.getElementById('gameMessage').classList.add('win');
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
        this.renderBoard();
        this.updateUI();
        return;
      }
    }
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
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Puissance4();
});
