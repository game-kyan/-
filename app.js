const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreText = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

let player, obstacles, frame, score, gameRunning;

function initGame() {
  player = { x: 50, y: 350, width: 30, height: 30, vy: 0, gravity: 0.8, jump: -12 };
  obstacles = [];
  frame = 0;
  score = 0;
  gameRunning = true;
  canvas.style.display = 'block';
  startScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  canvas.style.display = 'none';
  gameOverScreen.style.display = 'block';
  finalScoreText.innerText = `Game Over! Score: ${score}`;
}

document.addEventListener('keydown', (e) => {
  if (gameRunning && e.code === 'Space' && player.y >= canvas.height - 50 - player.height) {
    player.vy = player.jump;
  }
});

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = '#654321';
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  // Player physics
  player.vy += player.gravity;
  player.y += player.vy;
  if (player.y > canvas.height - 50 - player.height) player.y = canvas.height - 50 - player.height;

  // Draw player
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Create obstacles
  if (frame % 100 === 0) {
    let obsHeight = Math.random() * 50 + 20;
    obstacles.push({ x: canvas.width, y: canvas.height - 50 - obsHeight, width: 20, height: obsHeight });
  }

  // Draw and move obstacles
  ctx.fillStyle = 'green';
  obstacles.forEach((obs, i) => {
    obs.x -= 4;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Collision detection
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      endGame();
    }

    // Remove offscreen obstacles
    if (obs.x + obs.width < 0) obstacles.splice(i, 1);
  });

  // Score
  score++;
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);

  frame++;
  requestAnimationFrame(gameLoop);
}

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.log('SW registration failed:', err));
}
