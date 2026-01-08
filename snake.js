// ---- SNAKE 1V1 GAME ----

// Skins pour les serpents (sera géré par gacha_pages.js)
const SNAKE_SKINS = [
  // --- COMMON ---
  { name: "Classic", id: "classic", rarity: "common" },
  { name: "Green", id: "green", rarity: "common" },
  { name: "Blue", id: "blue", rarity: "common" },
  { name: "Purple", id: "purple", rarity: "common" },
  { name: "Orange", id: "orange", rarity: "common" },

  // --- UNCOMMON ---
  { name: "Neon", id: "neon", rarity: "uncommon" },
  { name: "Glass", id: "glass", rarity: "uncommon" },
  { name: "Metal", id: "metal", rarity: "uncommon" },
  { name: "Fire", id: "fire", rarity: "uncommon" },
  { name: "Ice", id: "ice", rarity: "uncommon" },
  { name: "Marble", id: "marble", rarity: "uncommon" },

  // --- RARE ---
  { name: "Gold", id: "gold", rarity: "rare" },
  { name: "Rainbow", id: "rainbow", rarity: "rare" },
  { name: "Gradient", id: "gradient", rarity: "rare" },
  { name: "Glow", id: "glow", rarity: "rare" },
  { name: "Aurora", id: "aurora", rarity: "rare" },

  // --- EPIC ---
  { name: "Galaxy", id: "galaxy", rarity: "epic" },
  { name: "Cosmic", id: "cosmic", rarity: "epic" },
  { name: "Lightning", id: "lightning", rarity: "epic" },
  { name: "Lava", id: "lava", rarity: "epic" },

  // --- RARE ---
  { name: "Gold", id: "gold", rarity: "rare" },
  { name: "Rainbow", id: "rainbow", rarity: "rare" },
  { name: "Gradient", id: "gradient", rarity: "rare" },
  { name: "Glow", id: "glow", rarity: "rare" },
  { name: "Aurora", id: "aurora", rarity: "rare" },
  { name: "Iridescent", id: "iridescent", rarity: "rare" },
  { name: "Frost", id: "frost", rarity: "rare" },
  { name: "Haze", id: "haze", rarity: "rare" },

  // --- EPIC ---
  { name: "Galaxy", id: "galaxy", rarity: "epic" },
  { name: "Cosmic", id: "cosmic", rarity: "epic" },
  { name: "Lightning", id: "lightning", rarity: "epic" },
  { name: "Lava", id: "lava", rarity: "epic" },
  { name: "Neon Wave", id: "neonwave", rarity: "epic" },
  { name: "Electro", id: "electro", rarity: "epic" },
  { name: "Prism", id: "prism", rarity: "epic" },

  // --- LEGENDARY ---
  { name: "Void", id: "void", rarity: "legendary" },
  { name: "Infinity", id: "infinity", rarity: "legendary" },
  { name: "Phoenix", id: "phoenix", rarity: "legendary" },
  { name: "Chromaflare", id: "chromaflare", rarity: "legendary" },
  { name: "Spectral", id: "spectral", rarity: "legendary" },
  { name: "Nova", id: "nova", rarity: "legendary" }
];

class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = 20;
    this.gameRunning = false;
    this.gameOver = false;
    this.timeLeft = 60; // 5 minutes en secondes
    this.timerInterval = null;
    this.tick = 0; // global tick counter (increments each game loop)

    // Joueurs
    this.players = {
      1: {
        name: 'Joueur 1',
        snake: [],
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
        score: 0,
        alive: true,
        color: '#ff6b6b',
        skinId: 'classic',
        invincible: false,
        invincibleExpires: 0,
        slowFactor: 1,
        slowExpires: 0,
        inverted: false,
        invertedExpires: 0,
        penaltyNotification: false,
        penaltyNotificationExpires: 0,
        stealNotification: false,
        stealNotificationExpires: 0
      },
      2: {
        name: 'Joueur 2',
        snake: [],
        direction: { x: -1, y: 0 },
        nextDirection: { x: -1, y: 0 },
        score: 0,
        alive: true,
        color: '#ffd93d',
        skinId: 'classic',
        invincible: false,
        invincibleExpires: 0,
        slowFactor: 1,
        slowExpires: 0,
        inverted: false,
        invertedExpires: 0,
        penaltyNotification: false,
        penaltyNotificationExpires: 0,
        stealNotification: false,
        stealNotificationExpires: 0
      }
    };

    // Pommes
    this.apples = [];
    this.appleCount = 5;

    // Event log for match tracking
    this.matchLog = [];

    // Configuration du jeu
    this.gridWidth = Math.floor(this.canvas.width / this.gridSize);
    this.gridHeight = Math.floor(this.canvas.height / this.gridSize);

    // Event listeners
    document.getElementById('playBtn').addEventListener('click', () => this.startGame());
    document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // Charger les noms et skins depuis localStorage
    this.loadPlayerData();
    this.applyFonts();
    
    // Afficher l'argent partagé
    this.updateMoneyDisplay();

    // Affichage initial
    this.drawInitialBoard();
  }

  loadPlayerData() {
    const name1 = localStorage.getItem('name-left') || 'Joueur 1';
    const name2 = localStorage.getItem('name-right') || 'Joueur 2';
    
    this.players[1].name = name1;
    this.players[2].name = name2;

    document.getElementById('left-name-input').value = name1;
    document.getElementById('right-name-input').value = name2;

    // Charger les couleurs
    const color1 = localStorage.getItem('color-left') || '#7dd3fc';
    const color2 = localStorage.getItem('color-right') || '#fca5a5';
    
    const leftColorInput = document.getElementById('left-color');
    const rightColorInput = document.getElementById('right-color');
    
    if (leftColorInput) leftColorInput.value = color1;
    if (rightColorInput) rightColorInput.value = color2;

    // Charger les skins équipés
    const skin1 = localStorage.getItem('snake-skin-1') || 'classic';
    const skin2 = localStorage.getItem('snake-skin-2') || 'classic';
    
    this.players[1].skinId = skin1;
    this.players[2].skinId = skin2;

    // Mettre à jour les noms à chaque changement
    document.getElementById('left-name-input').addEventListener('change', (e) => {
      this.players[1].name = e.target.value;
      localStorage.setItem('name-left', e.target.value.trim() || 'Joueur 1');
      this.updateScoreDisplay();
    });

    document.getElementById('left-name-input').addEventListener('input', (e) => {
      this.players[1].name = e.target.value;
      localStorage.setItem('name-left', e.target.value.trim() || 'Joueur 1');
      this.updateScoreDisplay();
    });

    document.getElementById('right-name-input').addEventListener('change', (e) => {
      this.players[2].name = e.target.value;
      localStorage.setItem('name-right', e.target.value.trim() || 'Joueur 2');
      this.updateScoreDisplay();
    });

    document.getElementById('right-name-input').addEventListener('input', (e) => {
      this.players[2].name = e.target.value;
      localStorage.setItem('name-right', e.target.value.trim() || 'Joueur 2');
      this.updateScoreDisplay();
    });

    // Mettre à jour les couleurs à chaque changement
    if (leftColorInput) {
      leftColorInput.addEventListener('input', (e) => {
        localStorage.setItem('color-left', e.target.value);
        this.applyFonts();
      });
    }

    if (rightColorInput) {
      rightColorInput.addEventListener('input', (e) => {
        localStorage.setItem('color-right', e.target.value);
        this.applyFonts();
      });
    }
  }

  applyFonts() {
    const f1 = localStorage.getItem('font1');
    const f2 = localStorage.getItem('font2');
    
    const leftInput = document.getElementById('left-name-input');
    const rightInput = document.getElementById('right-name-input');
    
    if (f1 && leftInput) leftInput.style.fontFamily = f1;
    if (f2 && rightInput) rightInput.style.fontFamily = f2;

    // Appliquer les couleurs
    const c1 = localStorage.getItem('color-left') || '#7dd3fc';
    const c2 = localStorage.getItem('color-right') || '#fca5a5';
    
    if (leftInput) leftInput.style.color = c1;
    if (rightInput) rightInput.style.color = c2;
  }

  updateMoneyDisplay() {
    const money1 = getMoney(1);
    const money2 = getMoney(2);
    
    const leftMoneyEl = document.getElementById('money-left');
    const rightMoneyEl = document.getElementById('money-right');
    
    if (leftMoneyEl) leftMoneyEl.textContent = `💰 ${money1}`;
    if (rightMoneyEl) rightMoneyEl.textContent = `💰 ${money2}`;
  }

  reloadEquippedSkins() {
    const skin1 = localStorage.getItem('snake-skin-1') || 'classic';
    const skin2 = localStorage.getItem('snake-skin-2') || 'classic';
    
    this.players[1].skinId = skin1;
    this.players[2].skinId = skin2;
  }

  addMatchLog(message) {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const time = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    this.matchLog.push({ time, message });
  }

  startGame() {
    // Recharger les skins équipés
    this.reloadEquippedSkins();
    
    // Initialiser les serpents
    this.initializeSnakes();
    this.generateApples();

    // Cacher le bouton et afficher le jeu
    document.getElementById('gameOverlay').classList.add('hidden');
    document.getElementById('resultDisplay').style.display = 'none';

    // Désactiver les boutons gacha/inventaire
    this.disableGameButtons();

    // Reset match log
    this.matchLog = [];

    // Démarrer le jeu
    this.gameRunning = true;
    this.gameOver = false;
    this.timeLeft = 60;
    this.updateScoreDisplay();

    // Démarrer le timer
    this.startTimer();

    // Démarrer la boucle de jeu
    this.gameLoop();
  }

  initializeSnakes() {
    // Joueur 1: part de la gauche, se dirige vers la droite
    this.players[1].snake = [
      { x: 5, y: this.gridHeight / 2 - 1 },
      { x: 4, y: this.gridHeight / 2 - 1 },
      { x: 3, y: this.gridHeight / 2 - 1 }
    ];
    this.players[1].direction = { x: 1, y: 0 };
    this.players[1].nextDirection = { x: 1, y: 0 };
    this.players[1].score = 0;
    this.players[1].alive = true;

    // Joueur 2: part de la droite, se dirige vers la gauche
    this.players[2].snake = [
      { x: this.gridWidth - 6, y: this.gridHeight / 2 + 1 },
      { x: this.gridWidth - 5, y: this.gridHeight / 2 + 1 },
      { x: this.gridWidth - 4, y: this.gridHeight / 2 + 1 }
    ];
    this.players[2].direction = { x: -1, y: 0 };
    this.players[2].nextDirection = { x: -1, y: 0 };
    this.players[2].score = 0;
    this.players[2].alive = true;
  }

  generateApples() {
    this.apples = [];
    for (let i = 0; i < this.appleCount; i++) {
      const pos = this.getRandomPosition();
      // Weighted chances: 65% normal, 10% gold, 5% blue (invincible), 5% green (slow), 5% invert (purple), 5% penalty (gray), 5% steal (pink)
      const r = Math.random();
      let type = 'normal';
      if (r < 0.65) type = 'normal';
      else if (r < 0.75) type = 'gold';
      else if (r < 0.80) type = 'blue';
      else if (r < 0.85) type = 'green';
      else if (r < 0.90) type = 'invert';
      else if (r < 0.95) type = 'penalty';
      else type = 'steal';
      this.apples.push(Object.assign(pos, { type }));
    }
  }

  getRandomPosition() {
    let pos;
    let collision = true;
    
    while (collision) {
      pos = {
        x: Math.floor(Math.random() * this.gridWidth),
        y: Math.floor(Math.random() * this.gridHeight)
      };
      
      collision = false;
      
      // Vérifier collision avec les deux serpents
      for (let player of [1, 2]) {
        if (this.players[player].snake.some(seg => seg.x === pos.x && seg.y === pos.y)) {
          collision = true;
          break;
        }
      }
      
      // Vérifier collision avec les autres pommes
      if (this.apples.some(apple => apple.x === pos.x && apple.y === pos.y)) {
        collision = true;
      }
    }
    
    return pos;
  }

  handleKeyPress(e) {
    if (!this.gameRunning) return;

    const key = e.key.toLowerCase();
    let handled = false;

    // Joueur 1: ZQSD (respecte inversion si active)
    const p1 = this.players[1];
    if (!p1.inverted) {
      if (key === 'z' && p1.direction.y === 0) { p1.nextDirection = { x: 0, y: -1 }; handled = true; }
      else if (key === 's' && p1.direction.y === 0) { p1.nextDirection = { x: 0, y: 1 }; handled = true; }
      else if (key === 'q' && p1.direction.x === 0) { p1.nextDirection = { x: -1, y: 0 }; handled = true; }
      else if (key === 'd' && p1.direction.x === 0) { p1.nextDirection = { x: 1, y: 0 }; handled = true; }
    } else {
      // inverted controls for player 1
      if (key === 'z' && p1.direction.y === 0) { p1.nextDirection = { x: 0, y: 1 }; handled = true; }
      else if (key === 's' && p1.direction.y === 0) { p1.nextDirection = { x: 0, y: -1 }; handled = true; }
      else if (key === 'q' && p1.direction.x === 0) { p1.nextDirection = { x: 1, y: 0 }; handled = true; }
      else if (key === 'd' && p1.direction.x === 0) { p1.nextDirection = { x: -1, y: 0 }; handled = true; }
    }

    // Joueur 2: Flèches (respecte inversion si active)
    const p2 = this.players[2];
    if (!p2.inverted) {
      if (e.key === 'ArrowUp' && p2.direction.y === 0) { p2.nextDirection = { x: 0, y: -1 }; handled = true; }
      else if (e.key === 'ArrowDown' && p2.direction.y === 0) { p2.nextDirection = { x: 0, y: 1 }; handled = true; }
      else if (e.key === 'ArrowLeft' && p2.direction.x === 0) { p2.nextDirection = { x: -1, y: 0 }; handled = true; }
      else if (e.key === 'ArrowRight' && p2.direction.x === 0) { p2.nextDirection = { x: 1, y: 0 }; handled = true; }
    } else {
      // inverted controls for player 2 (arrows reversed)
      if (e.key === 'ArrowUp' && p2.direction.y === 0) { p2.nextDirection = { x: 0, y: 1 }; handled = true; }
      else if (e.key === 'ArrowDown' && p2.direction.y === 0) { p2.nextDirection = { x: 0, y: -1 }; handled = true; }
      else if (e.key === 'ArrowLeft' && p2.direction.x === 0) { p2.nextDirection = { x: 1, y: 0 }; handled = true; }
      else if (e.key === 'ArrowRight' && p2.direction.x === 0) { p2.nextDirection = { x: -1, y: 0 }; handled = true; }
    }

    if (handled) {
      e.preventDefault();
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const timerEl = document.getElementById('timerDisplay');
    timerEl.textContent = timeStr;

    if (this.timeLeft <= 30) {
      timerEl.classList.add('danger');
    }
  }

  gameLoop() {
    if (!this.gameRunning) return;

    // advance global tick and clear expired effects
    this.tick++;
    for (let p of [1,2]) {
      const pl = this.players[p];
      if (pl.invincible && pl.invincibleExpires && Date.now() > pl.invincibleExpires) {
        pl.invincible = false;
        pl.invincibleExpires = 0;
      }
      if (pl.slowFactor && pl.slowFactor > 1 && pl.slowExpires && Date.now() > pl.slowExpires) {
        pl.slowFactor = 1;
        pl.slowExpires = 0;
      }
      if (pl.inverted && pl.invertedExpires && Date.now() > pl.invertedExpires) {
        pl.inverted = false;
        pl.invertedExpires = 0;
      }
      if (pl.penaltyNotification && pl.penaltyNotificationExpires && Date.now() > pl.penaltyNotificationExpires) {
        pl.penaltyNotification = false;
        pl.penaltyNotificationExpires = 0;
      }
      if (pl.stealNotification && pl.stealNotificationExpires && Date.now() > pl.stealNotificationExpires) {
        pl.stealNotification = false;
        pl.stealNotificationExpires = 0;
      }
    }

    // Mettre à jour les directions
    this.players[1].direction = this.players[1].nextDirection;
    this.players[2].direction = this.players[2].nextDirection;

    // Mettre à jour les serpents
    this.updateSnake(1);
    this.updateSnake(2);

    // Dessiner
    this.draw();

    // Continuer la boucle
    setTimeout(() => this.gameLoop(), 100); // Vitesse du jeu
  }

  updateSnake(playerNum) {
    const player = this.players[playerNum];
    
    if (!player.alive) return;

    // slow effect: move only every `slowFactor` ticks when slowed
    if (player.slowFactor && player.slowFactor > 1) {
      if (this.tick % player.slowFactor !== 0) {
        return; // skip movement this tick
      }
    }

    const head = player.snake[0];
    const newHead = {
      x: head.x + player.direction.x,
      y: head.y + player.direction.y
    };

    // Vérifier collision avec mur
    if (newHead.x < 0 || newHead.x >= this.gridWidth || 
        newHead.y < 0 || newHead.y >= this.gridHeight) {
      if (player.invincible) {
        // wrap-around while invincible to avoid interrupting gameplay
        newHead.x = (newHead.x + this.gridWidth) % this.gridWidth;
        newHead.y = (newHead.y + this.gridHeight) % this.gridHeight;
      } else {
        player.alive = false;
        this.endGame();
        return;
      }
    }

    // Vérifier collision avec propre queue
    if (player.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      if (!player.invincible) {
        player.alive = false;
        this.endGame();
        return;
      }
      // if invincible, ignore self-collision
    }

    // Vérifier collision avec autre serpent
    const otherPlayer = playerNum === 1 ? 2 : 1;
    if (this.players[otherPlayer].snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      if (!player.invincible) {
        player.alive = false;
        this.endGame();
        return;
      }
      // if invincible, ignore collision with other snake
    }

    // Ajouter la nouvelle tête
    player.snake.unshift(newHead);

    // Vérifier collision avec pomme
    const appleIndex = this.apples.findIndex(a => a.x === newHead.x && a.y === newHead.y);
    if (appleIndex !== -1) {
      const apple = this.apples[appleIndex];
      const type = apple.type || 'normal';

      // determine how much the snake should grow from this apple (score-based growth)
      let growAmount = 0;
      if (type === 'normal') {
        player.score += 1;
        growAmount = 1;
        this.addMatchLog(`${player.name} a mangé une pomme 🍎`);
      } else if (type === 'gold') {
        player.score += 3;
        growAmount = 3;
        this.addMatchLog(`${player.name} a mangé une pomme d'or 🏆`);
      } else if (type === 'blue') {
        // invincible
        player.invincible = true;
        player.invincibleExpires = Date.now() + 3500; // 3.5 seconds
        this.addMatchLog(`${player.name} a pris l'invincibilité 🛡️`);
      } else if (type === 'green') {
        // slow the opponent
        const opp = this.players[otherPlayer];
        opp.slowFactor = 2; // move every 2 ticks ~ half speed
        opp.slowExpires = Date.now() + 2500; // 2.5 seconds
        this.addMatchLog(`${opp.name} a été ralenti 🐢`);
      } else if (type === 'invert') {
        // invert opponent controls for 2 seconds
        const opp = this.players[otherPlayer];
        opp.inverted = true;
        opp.invertedExpires = Date.now() + 2000; // 2 seconds
        this.addMatchLog(`${opp.name} a les contrôles inversés 🔀`);
      } else if (type === 'penalty') {
        // penalty: remove one point from opponent, but don't allow negative scores
        const opp = this.players[otherPlayer];
        opp.score = Math.max(0, (opp.score || 0) - 1);
        // trigger opponent's penalty notification
        opp.penaltyNotification = true;
        opp.penaltyNotificationExpires = Date.now() + 1500; // 1.5 seconds
        // penalty grants no growth to eater
        growAmount = 0;
        this.addMatchLog(`${opp.name} a perdu 1 point 📍`);
      } else if (type === 'steal') {
        // steal: transfer 1 point from opponent to eater
        const opp = this.players[otherPlayer];
        if (opp.score > 0) {
          opp.score -= 1;
          player.score += 1;
          growAmount = 1;
          // trigger both notifications
          opp.stealNotification = true;
          opp.stealNotificationExpires = Date.now() + 1500;
          player.stealNotification = true;
          player.stealNotificationExpires = Date.now() + 1500;
          this.addMatchLog(`${player.name} a volé un point à ${opp.name} 💔`);
        }
      }

      // After handling effects, adjust snake length according to growAmount.
      // We already added the new head. If growAmount > 0, we should avoid shrinking this tick
      // and immediately add extra segments equal to (growAmount - 1) so score increase matches length.
      if (growAmount > 0) {
        // do not pop tail this tick (that keeps +1), add extra segments if needed
        for (let i = 0; i < growAmount - 1; i++) {
          const lastSeg = player.snake[player.snake.length - 1];
          player.snake.push({ x: lastSeg.x, y: lastSeg.y });
        }
      } else {
        // For apples that don't grant growth (special apples or penalty), keep length unchanged
        // by popping the tail once now.
        player.snake.pop();
      }

      // remove and replace with a new apple that can also be special
      this.apples.splice(appleIndex, 1);
      const pos = this.getRandomPosition();
      const r = Math.random();
      let newType = 'normal';
      // Weighted: 65% normal, 10% gold, 5% blue, 5% green, 5% invert, 5% penalty, 5% steal
      if (r < 0.65) newType = 'normal';
      else if (r < 0.75) newType = 'gold';
      else if (r < 0.80) newType = 'blue';
      else if (r < 0.85) newType = 'green';
      else if (r < 0.90) newType = 'invert';
      else if (r < 0.95) newType = 'penalty';
      else newType = 'steal';
      this.apples.push(Object.assign(pos, { type: newType }));
    } else {
      // Enlever la queue si pas de pomme
      player.snake.pop();
    }
  }

  draw() {
    // Effacer le canvas
    this.ctx.fillStyle = '#0f1319';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grille (optionnel)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= this.gridWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.gridSize, 0);
      this.ctx.lineTo(x * this.gridSize, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.gridHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.gridSize);
      this.ctx.lineTo(this.canvas.width, y * this.gridSize);
      this.ctx.stroke();
    }

    // Dessiner les pommes
    this.apples.forEach(apple => {
      this.drawApple(apple);
    });

    // Dessiner les serpents
    this.drawSnake(1);
    this.drawSnake(2);

    // Mettre à jour l'affichage des scores
    this.updateScoreDisplay();
  }

  drawSnake(playerNum) {
    const player = this.players[playerNum];
    const snake = player.snake;
    const skinId = player.skinId;

    // Couleur de base selon le skin
    const colors = this.getSnakeColors(skinId);
    const frameCount = Math.floor(Date.now() / 100) % 10; // Animation 0-9

    snake.forEach((segment, index) => {
      const x = segment.x * this.gridSize;
      const y = segment.y * this.gridSize;

      if (index === 0) {
        // Tête
        this.drawSegment(x, y, colors, skinId, true, frameCount);
        
        // Yeux
        this.ctx.fillStyle = '#fff';
        const eyeSize = 3;
        if (player.direction.x > 0) {
          this.ctx.fillRect(x + 12, y + 5, eyeSize, eyeSize);
          this.ctx.fillRect(x + 12, y + 12, eyeSize, eyeSize);
        } else if (player.direction.x < 0) {
          this.ctx.fillRect(x + 5, y + 5, eyeSize, eyeSize);
          this.ctx.fillRect(x + 5, y + 12, eyeSize, eyeSize);
        } else if (player.direction.y > 0) {
          this.ctx.fillRect(x + 5, y + 12, eyeSize, eyeSize);
          this.ctx.fillRect(x + 12, y + 12, eyeSize, eyeSize);
        } else {
          this.ctx.fillRect(x + 5, y + 5, eyeSize, eyeSize);
          this.ctx.fillRect(x + 12, y + 5, eyeSize, eyeSize);
        }
      } else {
        // Corps
        this.drawSegment(x, y, colors, skinId, false, frameCount);
      }
    });
  }

  drawSegment(x, y, colors, skinId, isHead, frameCount) {
    const effect = colors.effect || 'none';
    const size = this.gridSize - 2;

    switch (effect) {
      case 'glow':
        // Effet de glow pulsant
        const glowIntensity = 0.5 + Math.sin(frameCount * Math.PI / 5) * 0.5;
        this.ctx.shadowColor = colors.head;
        this.ctx.shadowBlur = 8 * glowIntensity;
        this.ctx.fillStyle = isHead ? colors.head : colors.body;
        this.ctx.fillRect(x + 1, y + 1, size, size);
        this.ctx.shadowBlur = 0;
        break;

      case 'gradient':
        // Gradient métallique ou doré
        const gradient = this.ctx.createLinearGradient(x + 1, y + 1, x + 1, y + 1 + size);
        if (isHead) {
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.5, colors.head);
          gradient.addColorStop(1, colors.border);
        } else {
          gradient.addColorStop(0, colors.head);
          gradient.addColorStop(0.5, colors.body);
          gradient.addColorStop(1, colors.border);
        }
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x + 1, y + 1, size, size);
        break;

      case 'glass':
        // Effet de verre avec reflet
        this.ctx.fillStyle = colors.head;
        this.ctx.fillRect(x + 1, y + 1, size, size);
        // Reflet blanc
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x + 1, y + 1, size / 2, size / 3);
        break;

      case 'pattern':
        // Motif damier/marbre
        this.ctx.fillStyle = isHead ? colors.head : colors.body;
        this.ctx.fillRect(x + 1, y + 1, size, size);
        // Ajouter des carrés alternés pour texture
        this.ctx.fillStyle = colors.border;
        for (let i = 0; i < size; i += 4) {
          for (let j = 0; j < size; j += 4) {
            if ((i + j) % 8 === 0) {
              this.ctx.fillRect(x + 1 + i, y + 1 + j, 2, 2);
            }
          }
        }
        break;

      case 'rainbow':
        // Arc-en-ciel qui change
        const hue = (frameCount * 36 + (isHead ? 0 : 60)) % 360;
        this.ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        this.ctx.fillRect(x + 1, y + 1, size, size);
        break;

      case 'aurora':
        // Aurore boréale avec changement de couleur
        const auroraHue = (frameCount * 20) % 360;
        this.ctx.fillStyle = `hsl(${auroraHue}, 100%, 40%)`;
        this.ctx.fillRect(x + 1, y + 1, size, size);
        // Couche supplémentaire
        this.ctx.fillStyle = `hsl(${(auroraHue + 120) % 360}, 100%, 45%)`;
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillRect(x + 1, y + 1, size, size);
        this.ctx.globalAlpha = 1.0;
        break;

      default:
        // Couleur solide classique
        this.ctx.fillStyle = isHead ? colors.head : colors.body;
        this.ctx.fillRect(x + 1, y + 1, size, size);
    }

    // Bordure
    this.ctx.strokeStyle = colors.border;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x + 1, y + 1, size, size);
  }

  getSnakeColors(skinId) {
    const colorMap = {
      classic: { head: '#ff6b6b', body: '#ff5252', border: '#ff4444', effect: 'none' },
      green: { head: '#51cf66', body: '#40c057', border: '#2b8a3e', effect: 'none' },
      blue: { head: '#74c0fc', body: '#4c6ef5', border: '#2e4bbb', effect: 'none' },
      purple: { head: '#b197fc', body: '#9775fa', border: '#7950f2', effect: 'none' },
      orange: { head: '#ffa94d', body: '#ff922b', border: '#fd7e14', effect: 'none' },
      neon: { head: '#00ffdd', body: '#00ccaa', border: '#0099aa', effect: 'glow' },
      glass: { head: 'rgba(74, 192, 252, 0.9)', body: 'rgba(74, 192, 252, 0.7)', border: 'rgba(74, 192, 252, 0.5)', effect: 'glass' },
      metal: { head: '#e8e8e8', body: '#c0c0c0', border: '#888888', effect: 'gradient' },
      fire: { head: '#ff4500', body: '#ff6347', border: '#ff8c00', effect: 'glow' },
      ice: { head: '#87ceeb', body: '#add8e6', border: '#00bfff', effect: 'glow' },
      marble: { head: '#f5f5f5', body: '#dcdcdc', border: '#a9a9a9', effect: 'pattern' },
      gold: { head: '#ffd700', body: '#ffed4e', border: '#daa520', effect: 'gradient' },
      rainbow: { head: '#ff0000', body: '#00ff00', border: '#0000ff', effect: 'rainbow' },
      gradient: { head: '#7dd3fc', body: '#06b6d4', border: '#0891b2', effect: 'gradient' },
      glow: { head: '#ffff00', body: '#ffff99', border: '#ffff66', effect: 'glow' },
      aurora: { head: '#00ff88', body: '#88ff00', border: '#ff00ff', effect: 'aurora' },
      galaxy: { head: '#663399', body: '#4b0082', border: '#9400d3', effect: 'pattern' },
      cosmic: { head: '#1a1a2e', body: '#16213e', border: '#0f3460', effect: 'none' },
      lightning: { head: '#ffff00', body: '#ffff33', border: '#ffff66', effect: 'glow' },
      lava: { head: '#ff4500', body: '#dc143c', border: '#8b0000', effect: 'glow' },
      void: { head: '#000033', body: '#000011', border: '#330066', effect: 'none' },
      infinity: { head: '#00ffff', body: '#00ccff', border: '#0099ff', effect: 'glow' },
      phoenix: { head: '#ff6347', body: '#ff8c00', border: '#ffa500', effect: 'glow' }
    };

    // Additions for new skins (balanced effects by rarity)
    colorMap.iridescent = { head: '#caa6ff', body: '#b3f5ff', border: '#a28bff', effect: 'glow' };
    colorMap.frost = { head: '#e6f7ff', body: '#cfeeff', border: '#89d8ff', effect: 'glass' };
    colorMap.haze = { head: '#dcd6ff', body: '#c7d2ff', border: '#9aa2ff', effect: 'pattern' };

    colorMap.neonwave = { head: '#00ffd5', body: '#00a3ff', border: '#0044ff', effect: 'gradient' };
    colorMap.electro = { head: '#fff200', body: '#ffe066', border: '#ffd600', effect: 'glow' };
    colorMap.prism = { head: '#ff3cac', body: '#00d4ff', border: '#ffd700', effect: 'rainbow' };

    colorMap.chromaflare = { head: '#ff9de2', body: '#9dfffb', border: '#ffd27a', effect: 'holo' };
    colorMap.spectral = { head: '#d8b4fe', body: '#a5b4fc', border: '#7c3aed', effect: 'spectral' };
    colorMap.nova = { head: '#ffd6a5', body: '#ff9e9e', border: '#ff6b6b', effect: 'aurora' };

    return colorMap[skinId] || colorMap.classic;
  }

  drawApple(apple) {
    const x = apple.x * this.gridSize;
    const y = apple.y * this.gridSize;
    // choose appearance by type
    const t = apple.type || 'normal';
    if (t === 'gold') this.ctx.fillStyle = '#ffd700';
    else if (t === 'blue') this.ctx.fillStyle = '#4da6ff';
    else if (t === 'green') this.ctx.fillStyle = '#51cf66';
    else if (t === 'invert') this.ctx.fillStyle = '#9b59b6'; // purple invert apple
    else if (t === 'penalty') this.ctx.fillStyle = '#9aa0a6'; // gray penalty apple
    else if (t === 'steal') this.ctx.fillStyle = '#ff69b4'; // rose/pink steal apple
    else this.ctx.fillStyle = '#ff6b6b';

    this.ctx.beginPath();
    this.ctx.arc(x + this.gridSize / 2, y + this.gridSize / 2, this.gridSize / 2 - 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Reflet
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(x + this.gridSize / 3, y + this.gridSize / 3, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Tige (darker for special apples)
    this.ctx.strokeStyle = t === 'gold' ? '#b8860b' : (t === 'invert' ? '#6d2e6b' : (t === 'penalty' ? '#55585b' : (t === 'steal' ? '#c9216b' : '#8b4513')));
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.gridSize / 2, y + 2);
    this.ctx.lineTo(x + this.gridSize / 2 + 2, y - 2);
    this.ctx.stroke();
  }

  updateScoreDisplay() {
    const name1 = this.players[1].name;
    const name2 = this.players[2].name;
    const score1 = this.players[1].score;
    const score2 = this.players[2].score;
    const alive1 = this.players[1].alive ? 'alive' : 'dead';
    const alive2 = this.players[2].alive ? 'alive' : 'dead';

    document.getElementById('score-left').textContent = `${name1}: ${score1}`;
    document.getElementById('score-right').textContent = `${name2}: ${score2}`;

    // show alive/dead (keep status blocks compact so they don't resize)
    const p1 = this.players[1];
    const p2 = this.players[2];

    const statusLeft = p1.alive ? '🟢 En jeu' : '💀 Éliminé';
    document.getElementById('status-left').textContent = statusLeft;
    document.getElementById('status-left').className = `status-display ${alive1}`;

    const statusRight = p2.alive ? '🟢 En jeu' : '💀 Éliminé';
    document.getElementById('status-right').textContent = statusRight;
    document.getElementById('status-right').className = `status-display ${alive2}`;

    // Update the fixed overlay with active temporary effects (doesn't affect layout)
    const overlayLeft = document.getElementById('effectOverlayLeft');
    const overlayRight = document.getElementById('effectOverlayRight');
    
    if (overlayLeft && overlayRight) {
      const leftBadges = [];
      const rightBadges = [];

      if (p1.invincible) {
        const sec = Math.ceil(Math.max(0, (p1.invincibleExpires - Date.now()) / 1000));
        leftBadges.push(`<span class="effect-badge invincible">🛡️ <span class="time">${sec}s</span></span>`);
      }
      if (p1.slowFactor && p1.slowFactor > 1) {
        const sec = Math.ceil(Math.max(0, (p1.slowExpires - Date.now()) / 1000));
        leftBadges.push(`<span class="effect-badge slow">🐢 <span class="time">${sec}s</span></span>`);
      }
      if (p1.inverted) {
        const sec = Math.ceil(Math.max(0, (p1.invertedExpires - Date.now()) / 1000));
        leftBadges.push(`<span class="effect-badge invert">🔀 <span class="time">${sec}s</span></span>`);
      }

      if (p1.penaltyNotification) {
        leftBadges.push(`<span class="effect-badge penalty-flash">-1 📍</span>`);
      }
      if (p1.stealNotification) {
        leftBadges.push(`<span class="effect-badge steal-flash">💔 Point!</span>`);
      }

      if (p2.invincible) {
        const sec = Math.ceil(Math.max(0, (p2.invincibleExpires - Date.now()) / 1000));
        rightBadges.push(`<span class="effect-badge invincible">🛡️ <span class="time">${sec}s</span></span>`);
      }
      if (p2.slowFactor && p2.slowFactor > 1) {
        const sec = Math.ceil(Math.max(0, (p2.slowExpires - Date.now()) / 1000));
        rightBadges.push(`<span class="effect-badge slow">🐢 <span class="time">${sec}s</span></span>`);
      }
      if (p2.inverted) {
        const sec = Math.ceil(Math.max(0, (p2.invertedExpires - Date.now()) / 1000));
        rightBadges.push(`<span class="effect-badge invert">🔀 <span class="time">${sec}s</span></span>`);
      }

      if (p2.penaltyNotification) {
        rightBadges.push(`<span class="effect-badge penalty-flash">-1 📍</span>`);
      }
      if (p2.stealNotification) {
        rightBadges.push(`<span class="effect-badge steal-flash">💔 Point!</span>`);
      }

      overlayLeft.innerHTML = leftBadges.join('');
      overlayRight.innerHTML = rightBadges.join('');
    }
  }

  endGame() {
    this.gameRunning = false;
    clearInterval(this.timerInterval);

    // Réactiver les boutons gacha/inventaire
    this.enableGameButtons();

    const score1 = this.players[1].score;
    const score2 = this.players[2].score;
    const name1 = this.players[1].name;
    const name2 = this.players[2].name;
    const alive1 = this.players[1].alive;
    const alive2 = this.players[2].alive;

    let resultText = '';
    let winner = null;

    // Si un joueur est mort et l'autre vivant, le vivant gagne
    if (!alive1 && alive2) {
      resultText = `🏆 ${name2} gagne!\n${score2} vs ${score1}`;
      winner = 2;
    } else if (alive1 && !alive2) {
      resultText = `🏆 ${name1} gagne!\n${score1} vs ${score2}`;
      winner = 1;
    } else {
      // Sinon, c'est le score qui décide
      if (score1 > score2) {
        resultText = `🏆 ${name1} gagne!\n${score1} vs ${score2}`;
        winner = 1;
      } else if (score2 > score1) {
        resultText = `🏆 ${name2} gagne!\n${score2} vs ${score1}`;
        winner = 2;
      } else {
        resultText = `⚔️ Égalité!\n${score1} vs ${score2}`;
      }
    }

    // Donner 20 d'argent au gagnant
    if (winner) {
      addMoney(winner, 20);
      this.updateMoneyDisplay();
    }

    document.getElementById('resultText').innerHTML = resultText;
    
    // Display match log
    const matchLogDiv = document.getElementById('matchLog');
    if (matchLogDiv && this.matchLog.length > 0) {
      const logHtml = this.matchLog.map(entry => 
        `<div class="match-log-entry"><span class="log-time">${entry.time}</span> <span class="log-message">${entry.message}</span></div>`
      ).join('');
      matchLogDiv.innerHTML = logHtml;
    } else if (matchLogDiv) {
      matchLogDiv.innerHTML = '<div class="match-log-entry"><span class="log-message">Aucun événement enregistré</span></div>';
    }
    
    document.getElementById('resultDisplay').style.display = 'flex';
    
    // Forcer la réactivation des boutons au cas où
    setTimeout(() => this.enableGameButtons(), 100);
  }

  drawInitialBoard() {
    this.ctx.fillStyle = '#0f1319';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Appuyez sur Jouer', this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.font = '14px Arial';
    this.ctx.fillText('Joueur 1: ZQSD | Joueur 2: Flèches', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }

  resetGame() {
    this.players[1].score = 0;
    this.players[2].score = 0;
    this.players[1].alive = true;
    this.players[2].alive = true;
    this.timeLeft = 300;
    
    // Réactiver les boutons gacha/inventaire
    this.enableGameButtons();
    
    document.getElementById('gameOverlay').classList.remove('hidden');
    document.getElementById('resultDisplay').style.display = 'none';
    document.getElementById('timerDisplay').classList.remove('danger');
    
    this.drawInitialBoard();
    this.updateScoreDisplay();
  }

  disableGameButtons() {
    document.querySelectorAll('.gacha-btn, .inventory-btn').forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    });
  }

  enableGameButtons() {
    document.querySelectorAll('.gacha-btn, .inventory-btn').forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
    });
  }
}

// Initialiser le jeu au chargement
document.addEventListener('DOMContentLoaded', () => {
  ensureStorage(); // Initialiser le stockage (de gacha_pages.js)
  window.snakeGameInstance = new SnakeGame();
});
