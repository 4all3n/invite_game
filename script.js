const dino = document.getElementById('dino');
const obstacle = document.getElementById('obstacle');
const gameOver = document.getElementById('gameOver');
const teaser = document.getElementById('teaser');

let isJumping = false;
let gameActive = true;

// Dino jump logic
document.addEventListener('keydown', () => {
  if (!isJumping) jump();
});

function jump() {
  isJumping = true;
  let upInterval = setInterval(() => {
    if (parseInt(getComputedStyle(dino).bottom) >= 150) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (parseInt(getComputedStyle(dino).bottom) <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          dino.style.bottom = parseInt(getComputedStyle(dino).bottom) - 5 + 'px';
        }
      }, 20);
    } else {
      dino.style.bottom = parseInt(getComputedStyle(dino).bottom) + 5 + 'px';
    }
  }, 20);
}

// Obstacle movement
function moveObstacle() {
  obstacle.style.right = parseInt(getComputedStyle(obstacle).right) + 5 + 'px';
  if (parseInt(getComputedStyle(obstacle).right) > 600) {
    obstacle.style.right = '-20px';
  }

  // Collision detection
  if (
    parseInt(getComputedStyle(obstacle).right) > 50 &&
    parseInt(getComputedStyle(obstacle).right) < 100 &&
    parseInt(getComputedStyle(dino).bottom) <= 50
  ) {
    endGame();
  }
}

function endGame() {
  gameActive = false;
  obstacle.style.animation = 'none';
  gameOver.style.display = 'block';

  // Transition to teaser after a delay
  setTimeout(() => {
    gameOver.style.display = 'none';
    teaser.style.display = 'block';
  }, 2000);
}

// Game loop
setInterval(() => {
  if (gameActive) moveObstacle();
}, 20);
