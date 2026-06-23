// Get DOM elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const crack = document.getElementById("crack");
const overlay = document.getElementById("overlay");
const inviteContainer = document.getElementById("invite-container");
const points = document.getElementById("score");
const endImage = document.getElementById("end-image");
const bestScoreEl = document.getElementById("best-score");

// Game states
let gameStarted = false;
let gameOver = false;
let gameLoopId = null;

// Logical resolution dimensions for scaling
const LOGICAL_WIDTH = 1600;
const LOGICAL_HEIGHT = 800;
let scaleX = 1;
let scaleY = 1;

// Dino sprite setup
const dino = new Image();
dino.src = "luffy.png";

// Cactus sprite setup
const cactusSprites = [
  { image: new Image(), frames: 24 },
  { image: new Image(), frames: 24 },
  { image: new Image(), frames: 24 },
  { image: new Image(), frames: 24 },
  { image: new Image(), frames: 24 },
];
cactusSprites[0].image.src = "cactus1.png";
cactusSprites[1].image.src = "cactus2.png";
cactusSprites[2].image.src = "cactus3.png";
cactusSprites[3].image.src = "cactus4.png";
cactusSprites[4].image.src = "cactus5.png";

// Background sprites setup
const backgroundSprites = [
  { image: new Image(), x: 0, y: 50, width: 400, height: 300, speed: 1 },
  { image: new Image(), x: 1900, y: 80, width: 350, height: 280, speed: 1.5 },
  { image: new Image(), x: 250, y: 10, width: 400, height: 300, speed: 1 },
  { image: new Image(), x: 900, y: 1, width: 350, height: 280, speed: 1.5 },
  { image: new Image(), x: 1750, y: 150, width: 400, height: 300, speed: 1 },
  { image: new Image(), x: 660, y: 130, width: 400, height: 300, speed: 1 },
  { image: new Image(), x: 1200, y: 20, width: 350, height: 280, speed: 1.5 },
  { image: new Image(), x: 1400, y: 60, width: 400, height: 300, speed: 1 },
  { image: new Image(), x: 400, y: 80, width: 350, height: 280, speed: 1.5 },
  { image: new Image(), x: 750, y: 50, width: 400, height: 300, speed: 1 },
  { image: new Image(), x: 0, y: 290, width: 5000, height: 600, speed: 1 },
  { image: new Image(), x: 4800, y: 440, width: 5000, height: 600, speed: 1 },
];
backgroundSprites[0].image.src = "cloud1.png";
backgroundSprites[1].image.src = "cloud2.png";
backgroundSprites[2].image.src = "cloud3.png";
backgroundSprites[3].image.src = "cloud4.png";
backgroundSprites[4].image.src = "cloud5.png";
backgroundSprites[5].image.src = "cloud1.png";
backgroundSprites[6].image.src = "cloud2.png";
backgroundSprites[7].image.src = "cloud3.png";
backgroundSprites[8].image.src = "cloud4.png";
backgroundSprites[9].image.src = "cloud5.png";
backgroundSprites[10].image.src = "grass.png";
backgroundSprites[11].image.src = "grass.png";

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = "background.jpg";

// Current cactus sprite state
let currentCactus = cactusSprites[0];
const obstacleState = {
  lastFrameChangeTime: { value: 0 },
  currentFrame: { value: 0 },
};

// Dino properties
const dinoState = {
  lastFrameChangeTime: { value: 0 },
  currentFrame: { value: 0 },
};
const dinoWidth = 260;
const dinoHeight = 300;
let dinoX = 80;
let dinoY = LOGICAL_HEIGHT - dinoHeight - 20;

// Obstacle properties
let cactusWidth = 180;
let cactusHeight = 180;
let cactusX = LOGICAL_WIDTH;
let cactusY = LOGICAL_HEIGHT - cactusHeight - 20;

// Game mechanics
let gravity = 2.2;
let isJumping = false;
let jumpSpeed = 48;
let velocity = 40;
let score = 0;
let obstacleSpeed = 0;

// High Score System
let bestScore = parseInt(localStorage.getItem("xact_best_score") || "0", 10);
if (bestScoreEl) {
  bestScoreEl.innerText = bestScore === 0 ? "00" : bestScore;
}

function updateScore(newScore) {
  score = newScore;
  points.innerText = score === 0 ? "00" : score;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("xact_best_score", bestScore);
    if (bestScoreEl) {
      bestScoreEl.innerText = bestScore === 0 ? "00" : bestScore;
    }
  }
}

// Set canvas dimensions dynamically based on CSS container size
function resizeCanvas() {
  const container = canvas.parentElement;
  if (container) {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Scale coordinate system to match logical resolution
    scaleX = canvas.width / LOGICAL_WIDTH;
    scaleY = canvas.height / LOGICAL_HEIGHT;
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initialize sizing

// Draw background function
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
}

// Draw dino
function drawDino() {
  drawSprite({
    ctx,
    sprite: dino,
    totalFrames: 24, // Dino sprite has 24 frames
    positionX: dinoX,
    positionY: dinoY,
    displayWidth: dinoWidth,
    displayHeight: dinoHeight,
    lastTime: dinoState.lastFrameChangeTime,
    frameInterval: 1000 / 60, // 12 FPS
    currentFrameRef: dinoState.currentFrame,
  });
}

// Draw cactus
function drawCactus() {
  drawSprite({
    ctx,
    sprite: currentCactus.image,
    totalFrames: currentCactus.frames,
    positionX: cactusX,
    positionY: cactusY,
    displayWidth: cactusWidth,
    displayHeight: cactusHeight,
    lastTime: obstacleState.lastFrameChangeTime,
    frameInterval: 1000 / 60,
    currentFrameRef: obstacleState.currentFrame,
  });
}

// Reset cactus position and properties
function resetCactus() {
  cactusX = LOGICAL_WIDTH;

  // Randomize cactus size and position
  cactusWidth = Math.random() * 150 + 50;
  cactusHeight = Math.random() * 140 + 60;
  cactusY = LOGICAL_HEIGHT - cactusHeight - Math.random() * 20 - 20;

  // Randomly select a new cactus sprite
  currentCactus = cactusSprites[Math.floor(Math.random() * cactusSprites.length)];
}

// Draw background sprites (clouds and grass)
function drawBackgroundSprites() {
  backgroundSprites.forEach((sprite, index) => {
    sprite.x -= sprite.speed; // Move left at the sprite's speed
    
    const isGrass = index === 10 || index === 11;
    
    if (sprite.x + sprite.width < 0) {
      if (isGrass) {
        // Seamless reset for scrolling grass floor
        const otherGrass = backgroundSprites[index === 10 ? 11 : 10];
        sprite.x = otherGrass.x + otherGrass.width - 5;
      } else {
        // Reset position when off-screen
        sprite.x = LOGICAL_WIDTH + Math.random() * 100;
      }
    }
    ctx.drawImage(
      sprite.image,
      sprite.x,
      sprite.y,
      sprite.width,
      sprite.height
    );
  });
}

// Handle jump
function jump() {
  if (!isJumping) {
    isJumping = true;
    velocity = -jumpSpeed;
  }
}

// Reset the game after game over
function resetGame() {
  // Hide invitation container with transition fade out
  inviteContainer.classList.remove("active");
  setTimeout(() => {
    inviteContainer.style.display = "none";
  }, 800);

  // Remove animation / active classes
  crack.classList.remove("active");
  overlay.classList.remove("active");

  // Reset coordinates & states
  gameStarted = false;
  gameOver = false;
  updateScore(0);
  obstacleSpeed = 0;

  // Show start text
  const idleText = document.getElementById("idle-text");
  if (idleText) {
    idleText.style.display = "block";
  }

  dinoY = LOGICAL_HEIGHT - dinoHeight - 20;
  cactusX = LOGICAL_WIDTH;
  cactusWidth = 80;
  cactusHeight = 80;

  // Restart loop securely
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
  }
  gameLoop();
}

// Show crack effect
function showCrackEffect() {
  crack.classList.add("active");
  setTimeout(() => {
    showOverlay();
  }, 1000);
}

// Show overlay
function showOverlay() {
  overlay.classList.add("active");
  setTimeout(() => {
    overlay.classList.remove("active");
    showInvite();
  }, 3000);
}

// Show fullscreen invitation
function showInvite() {
  inviteContainer.style.display = "flex";
  setTimeout(() => {
    inviteContainer.classList.add("active");
  }, 20);
}

// Draw sprite helper function
function drawSprite({
  ctx,
  sprite,
  totalFrames,
  positionX,
  positionY,
  displayWidth,
  displayHeight,
  lastTime,
  frameInterval,
  currentFrameRef,
}) {
  const now = Date.now();

  // Update frame if enough time has passed
  if (now - lastTime.value > frameInterval) {
    currentFrameRef.value = (currentFrameRef.value + 1) % totalFrames;
    lastTime.value = now;
  }

  const frameWidth = sprite.width / totalFrames;
  const sx = currentFrameRef.value * frameWidth;

  ctx.drawImage(
    sprite,
    sx,
    0,
    frameWidth,
    sprite.height,
    positionX,
    positionY,
    displayWidth,
    displayHeight
  );
}

// Main game loop
function gameLoop() {
  if (gameOver) {
    showCrackEffect();
    gameLoopId = null;
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply responsive scaling transformations
  ctx.save();
  ctx.scale(scaleX, scaleY);

  drawBackground();
  drawBackgroundSprites();
  drawDino();
  drawCactus();

  ctx.restore(); // Restore drawing context

  // Game physics and updates in logical coordinate space
  if (isJumping) {
    velocity += gravity;
    dinoY += velocity;
    if (dinoY >= LOGICAL_HEIGHT - dinoHeight - 20) {
      dinoY = LOGICAL_HEIGHT - dinoHeight - 20;
      isJumping = false;
    }
  }

  if (gameStarted) {
    // Gradually increase speed over time (approximately 0.09 speed units per second)
    obstacleSpeed += 0.0015;
    cactusX -= obstacleSpeed;
  }

  // Reset cactus if it moves off-screen
  if (cactusX + cactusWidth < 0) {
    resetCactus();
    updateScore(score + 100);
  }

  // Refined Collision Detection (Using padded hit boxes to match visible sprites)
  const dinoHitX = dinoX + 70;
  const dinoHitWidth = dinoWidth - 140; // Luffy is centered, actual body width is ~120px
  const dinoHitY = dinoY + 40;
  const dinoHitHeight = dinoHeight - 50;

  const cactusHitX = cactusX + cactusWidth * 0.25;
  const cactusHitWidth = cactusWidth * 0.5; // Cactus is vertical, actual width is narrow
  const cactusHitY = cactusY + cactusHeight * 0.1;
  const cactusHitHeight = cactusHeight * 0.9;

  if (
    dinoHitX < cactusHitX + cactusHitWidth &&
    dinoHitX + dinoHitWidth > cactusHitX &&
    dinoHitY < cactusHitY + cactusHitHeight &&
    dinoHitY + dinoHitHeight > cactusHitY
  ) {
    gameOver = true;
  }

  gameLoopId = requestAnimationFrame(gameLoop);
}

// Handle user interaction
function handleInteraction(e) {
  if (gameOver) {
    return;
  }

  if (!gameStarted) {
    const idleText = document.getElementById("idle-text");
    if (idleText) {
      idleText.style.display = "none";
    }
    gameStarted = true;
    obstacleSpeed = 10;
    return;
  }

  jump();
}

// Event listeners for jump and game start (Unified pointerdown for click/touch)
document.addEventListener("pointerdown", (e) => {
  // If clicking on the replay button, let its own click listener handle it
  if (e.target.closest("#replay-btn")) {
    return;
  }

  // Prevent default behavior to avoid double-tap zooming on mobile
  if (e.target === canvas || e.target.closest("#gameCanvas")) {
    e.preventDefault();
  }

  handleInteraction(e);
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // Prevent page scroll
    handleInteraction(e);
  }
});

// Replay button listener
const replayBtn = document.getElementById("replay-btn");
if (replayBtn) {
  replayBtn.addEventListener("click", () => {
    resetGame();
  });
}

// Start the game loop
gameLoop();