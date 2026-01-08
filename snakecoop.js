// ---- SNAKE COOPERATIVE GAME ----

class SnakeCoopGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = 20;
    this.gameRunning = false;
    this.gameOver = false;
    this.timeLeft = 60; // 1 minute
    this.timerInterval = null;
    this.tick = 0;
    this.botSpawnTimer = 0;
    this.botSpawnInterval = 5000; // bots spawn every 5 seconds
    this.botUpdateCounter = 0; // counter to slow down bots

    // Joueurs coopératifs
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

    // Bots (enemy snakes)
    this.bots = [];
    this.botIdCounter = 0;

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
    this.bots = [];
    this.botIdCounter = 0;
    this.botSpawnTimer = 0;

    // Cacher le bouton et afficher le jeu
    document.getElementById('gameOverlay').classList.add('hidden');
    document.getElementById('resultDisplay').style.display = 'none';

    // Désactiver les boutons gacha/inventaire
    this.disableGameButtons();

    // Démarrer le jeu
    this.gameRunning = true;
    this.gameOver = false;
    this.timeLeft = 60;
    this.tick = 0;
    this.updateScoreDisplay();

    // Démarrer le timer
    this.startTimer();

    // Démarrer la boucle de jeu
    this.gameLoop();
  }

  initializeSnakes() {
    // Joueur 1: part de la gauche
    this.players[1].snake = [
      { x: 5, y: this.gridHeight / 2 - 1 },
      { x: 4, y: this.gridHeight / 2 - 1 },
      { x: 3, y: this.gridHeight / 2 - 1 }
    ];
    this.players[1].direction = { x: 1, y: 0 };
    this.players[1].nextDirection = { x: 1, y: 0 };
    this.players[1].score = 0;
    this.players[1].alive = true;

    // Joueur 2: part de la droite
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
      const r = Math.random();
      let type = 'normal';
      if (r < 0.80) type = 'normal';
      else if (r < 0.90) type = 'gold';
      else if (r < 0.95) type = 'blue';
      else type = 'green';
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
      
      // Vérifier collision avec les deux serpents des joueurs
      for (let player of [1, 2]) {
        if (this.players[player].snake.some(seg => seg.x === pos.x && seg.y === pos.y)) {
          collision = true;
          break;
        }
      }
      
      // Vérifier collision avec les bots
      if (!collision) {
        for (let bot of this.bots) {
          if (bot.snake.some(seg => seg.x === pos.x && seg.y === pos.y)) {
            collision = true;
            break;
          }
        }
      }
      
      // Vérifier collision avec les autres pommes
      if (!collision && this.apples.some(apple => apple.x === pos.x && apple.y === pos.y)) {
        collision = true;
      }
    }
    
    return pos;
  }

  spawnBot() {
    const bot = {
      id: this.botIdCounter++,
      snake: [{ x: Math.floor(Math.random() * this.gridWidth), y: Math.floor(Math.random() * this.gridHeight) }],
      direction: { x: [-1, 0, 1][Math.floor(Math.random() * 3)], y: [-1, 0, 1][Math.floor(Math.random() * 3)] },
      color: '#888888',
      aliveTime: 0
    };
    
    // ensure valid initial direction
    if (bot.direction.x === 0 && bot.direction.y === 0) {
      bot.direction.x = 1;
    }
    
    this.bots.push(bot);
  }

  updateBots() {
    for (let i = this.bots.length - 1; i >= 0; i--) {
      const bot = this.bots[i];
      const head = bot.snake[0];
      const newHead = {
        x: head.x + bot.direction.x,
        y: head.y + bot.direction.y
      };

      // wrap-around or random direction change for bots
      if (newHead.x < 0 || newHead.x >= this.gridWidth || 
          newHead.y < 0 || newHead.y >= this.gridHeight) {
        // change direction randomly
        const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        bot.direction = { x: dir[0], y: dir[1] };
        continue;
      }

      // check collision with players or other bots
      let collided = false;
      for (let p of [1, 2]) {
        if (this.players[p].snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          // player collides with bot
          this.players[p].alive = false;
          collided = true;
          break;
        }
      }

      if (!collided) {
        for (let otherBot of this.bots) {
          if (otherBot.id !== bot.id && otherBot.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            collided = true;
            break;
          }
        }
      }

      if (collided) {
        // remove this bot
        this.bots.splice(i, 1);
        continue;
      }

      bot.snake.unshift(newHead);
      
      // check apple collision
      const appleIndex = this.apples.findIndex(a => a.x === newHead.x && a.y === newHead.y);
      if (appleIndex !== -1) {
        // bot ate apple, remove apple and spawn new one
        this.apples.splice(appleIndex, 1);
        const pos = this.getRandomPosition();
        const r = Math.random();
        let type = 'normal';
        if (r < 0.80) type = 'normal';
        else if (r < 0.90) type = 'gold';
        else if (r < 0.95) type = 'blue';
        else type = 'green';
        this.apples.push(Object.assign(pos, { type }));
      } else {
        // no apple, just move
        if (bot.snake.length > 1) {
          bot.snake.pop();
        }
      }

      // random direction change occasionally
      if (Math.random() < 0.05) {
        const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        bot.direction = { x: dir[0], y: dir[1] };
      }
    }
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

    if (this.timeLeft <= 15) {
      timerEl.classList.add('danger');
    }
  }

  gameLoop() {
    if (!this.gameRunning) return;

    // advance tick
    this.tick++;

    // update bot spawn timer
    this.botSpawnTimer += 100; // game loop is every 100ms
    if (this.botSpawnTimer >= this.botSpawnInterval) {
      this.spawnBot();
      this.botSpawnTimer = 0;
    }

    // Mettre à jour les directions
    this.players[1].direction = this.players[1].nextDirection;
    this.players[2].direction = this.players[2].nextDirection;

    // Mettre à jour les serpents des joueurs
    this.updateSnake(1);
    this.updateSnake(2);

    // Vérifier si les deux joueurs sont morts
    if (!this.players[1].alive && !this.players[2].alive) {
      this.endGame();
      return;
    }

    // Mettre à jour les bots (ralentis: seulement tous les 2 ticks)
    this.botUpdateCounter++;
    if (this.botUpdateCounter >= 2) {
      this.updateBots();
      this.botUpdateCounter = 0;
    }

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

    // Vérifier collision avec mur (simple death)
    if (newHead.x < 0 || newHead.x >= this.gridWidth || 
        newHead.y < 0 || newHead.y >= this.gridHeight) {
      player.alive = false;
      return;
    }

    // Vérifier collision avec propre queue
    if (player.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      player.alive = false;
      return;
    }

    // Vérifier collision avec bots
    for (let bot of this.bots) {
      if (bot.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        player.alive = false;
        return;
      }
    }

    // Ajouter la nouvelle tête
    player.snake.unshift(newHead);

    // Vérifier collision avec pomme
    const appleIndex = this.apples.findIndex(a => a.x === newHead.x && a.y === newHead.y);
    if (appleIndex !== -1) {
      const apple = this.apples[appleIndex];
      const type = apple.type || 'normal';
      if (type === 'normal') {
        player.score++;
      } else if (type === 'gold') {
        player.score += 3;
      } else if (type === 'blue') {
        // bonus in coop mode: just count as normal + 1
        player.score += 2;
      } else if (type === 'green') {
        // slow not used in coop, just give normal
        player.score++;
      }

      this.apples.splice(appleIndex, 1);
      const pos = this.getRandomPosition();
      const r = Math.random();
      let newType = 'normal';
      if (r < 0.80) newType = 'normal';
      else if (r < 0.90) newType = 'gold';
      else if (r < 0.95) newType = 'blue';
      else newType = 'green';
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

    // Grille (léger)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
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
    this.apples.forEach(apple => this.drawApple(apple));

    // Dessiner les serpents des joueurs
    this.drawSnake(1);
    this.drawSnake(2);

    // Dessiner les bots
    for (let bot of this.bots) {
      this.drawBotSnake(bot);
    }

    // Mettre à jour l'affichage des scores
    this.updateScoreDisplay();
  }

  drawSnake(playerNum) {
    const player = this.players[playerNum];
    const snake = player.snake;
    
    snake.forEach((segment, index) => {
      const x = segment.x * this.gridSize;
      const y = segment.y * this.gridSize;
      const color = player.alive ? player.color : '#666666';

      if (index === 0) {
        // Tête
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        
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
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
      }

      // Bordure
      this.ctx.strokeStyle = player.alive ? 'rgba(255,255,255,0.2)' : '#444444';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
    });
  }

  drawBotSnake(bot) {
    const snake = bot.snake;
    
    snake.forEach((segment, index) => {
      const x = segment.x * this.gridSize;
      const y = segment.y * this.gridSize;

      if (index === 0) {
        // Tête bot
        this.ctx.fillStyle = '#dd4444';
        this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        
        // Yeux rouges
        this.ctx.fillStyle = '#ffff00';
        const eyeSize = 2;
        this.ctx.fillRect(x + 6, y + 6, eyeSize, eyeSize);
        this.ctx.fillRect(x + 12, y + 6, eyeSize, eyeSize);
      } else {
        // Corps bot
        this.ctx.fillStyle = '#bb2222';
        this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
      }

      // Bordure
      this.ctx.strokeStyle = 'rgba(255,100,100,0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
    });
  }

  drawApple(apple) {
    const x = apple.x * this.gridSize;
    const y = apple.y * this.gridSize;

    const t = apple.type || 'normal';
    if (t === 'gold') this.ctx.fillStyle = '#ffd700';
    else if (t === 'blue') this.ctx.fillStyle = '#4da6ff';
    else if (t === 'green') this.ctx.fillStyle = '#51cf66';
    else this.ctx.fillStyle = '#ff6b6b';

    this.ctx.beginPath();
    this.ctx.arc(x + this.gridSize / 2, y + this.gridSize / 2, this.gridSize / 2 - 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Reflet
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(x + this.gridSize / 3, y + this.gridSize / 3, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Tige
    this.ctx.strokeStyle = t === 'gold' ? '#b8860b' : '#8b4513';
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
    const totalScore = score1 + score2;
    const name1 = this.players[1].name;
    const name2 = this.players[2].name;

    // Reward = totalScore / 2 (split evenly between players)
    const reward = Math.floor(totalScore / 2);

    let resultText = `🎉 Partie terminée!\n`;
    resultText += `${name1}: ${score1}\n${name2}: ${score2}\n`;
    resultText += `Score total: ${totalScore}\n`;
    resultText += `💰 Argent gagné: ${reward} chacun`;

    // Donner l'argent aux deux joueurs
    addMoney(1, reward);
    addMoney(2, reward);
    this.updateMoneyDisplay();

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
    this.ctx.fillText('Surviv 60 secondes en coopération!', this.canvas.width / 2, this.canvas.height / 2 - 20);

    this.ctx.font = '14px Arial';
    this.ctx.fillText('Joueur 1: ZQSD | Joueur 2: Flèches', this.canvas.width / 2, this.canvas.height / 2 + 40);
    this.ctx.fillText('Évitez les bots rouges qui apparaissent toutes les 5s', this.canvas.width / 2, this.canvas.height / 2 + 70);
  }

  resetGame() {
    this.players[1].score = 0;
    this.players[2].score = 0;
    this.players[1].alive = true;
    this.players[2].alive = true;
    this.bots = [];
    this.botIdCounter = 0;
    this.botSpawnTimer = 0;
    this.timeLeft = 60;
    
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
  window.snakeCoopGameInstance = new SnakeCoopGame();
});
