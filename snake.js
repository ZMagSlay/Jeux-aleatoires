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
        skinId: 'classic'
      },
      2: {
        name: 'Joueur 2',
        snake: [],
        direction: { x: -1, y: 0 },
        nextDirection: { x: -1, y: 0 },
        score: 0,
        alive: true,
        color: '#ffd93d',
        skinId: 'classic'
      }
    };

    // Pommes
    this.apples = [];
    this.appleCount = 5;

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
      this.apples.push(this.getRandomPosition());
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

    // Joueur 1: ZQSD
    if (key === 'z' && this.players[1].direction.y === 0) {
      this.players[1].nextDirection = { x: 0, y: -1 };
      handled = true;
    } else if (key === 's' && this.players[1].direction.y === 0) {
      this.players[1].nextDirection = { x: 0, y: 1 };
      handled = true;
    } else if (key === 'q' && this.players[1].direction.x === 0) {
      this.players[1].nextDirection = { x: -1, y: 0 };
      handled = true;
    } else if (key === 'd' && this.players[1].direction.x === 0) {
      this.players[1].nextDirection = { x: 1, y: 0 };
      handled = true;
    }

    // Joueur 2: Flèches
    if (e.key === 'ArrowUp' && this.players[2].direction.y === 0) {
      this.players[2].nextDirection = { x: 0, y: -1 };
      handled = true;
    } else if (e.key === 'ArrowDown' && this.players[2].direction.y === 0) {
      this.players[2].nextDirection = { x: 0, y: 1 };
      handled = true;
    } else if (e.key === 'ArrowLeft' && this.players[2].direction.x === 0) {
      this.players[2].nextDirection = { x: -1, y: 0 };
      handled = true;
    } else if (e.key === 'ArrowRight' && this.players[2].direction.x === 0) {
      this.players[2].nextDirection = { x: 1, y: 0 };
      handled = true;
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

    const head = player.snake[0];
    const newHead = {
      x: head.x + player.direction.x,
      y: head.y + player.direction.y
    };

    // Vérifier collision avec mur
    if (newHead.x < 0 || newHead.x >= this.gridWidth || 
        newHead.y < 0 || newHead.y >= this.gridHeight) {
      player.alive = false;
      this.endGame();
      return;
    }

    // Vérifier collision avec propre queue
    if (player.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      player.alive = false;
      this.endGame();
      return;
    }

    // Vérifier collision avec autre serpent
    const otherPlayer = playerNum === 1 ? 2 : 1;
    if (this.players[otherPlayer].snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      player.alive = false;
      this.endGame();
      return;
    }

    // Ajouter la nouvelle tête
    player.snake.unshift(newHead);

    // Vérifier collision avec pomme
    const appleIndex = this.apples.findIndex(a => a.x === newHead.x && a.y === newHead.y);
    if (appleIndex !== -1) {
      player.score++;
      this.apples.splice(appleIndex, 1);
      this.apples.push(this.getRandomPosition());
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

    // Pomme rouge
    this.ctx.fillStyle = '#ff6b6b';
    this.ctx.beginPath();
    this.ctx.arc(x + this.gridSize / 2, y + this.gridSize / 2, this.gridSize / 2 - 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Reflet
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(x + this.gridSize / 3, y + this.gridSize / 3, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Tige
    this.ctx.strokeStyle = '#8b4513';
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

    document.getElementById('status-left').textContent = this.players[1].alive ? '🟢 En jeu' : '💀 Éliminé';
    document.getElementById('status-left').className = `status-display ${alive1}`;

    document.getElementById('status-right').textContent = this.players[2].alive ? '🟢 En jeu' : '💀 Éliminé';
    document.getElementById('status-right').className = `status-display ${alive2}`;
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
