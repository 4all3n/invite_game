// Get DOM elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const crack = document.getElementById("crack");
const overlay = document.getElementById("overlay");
const videoContainer = document.getElementById("video-container");
const points = document.getElementById("score");
const video = document.getElementById("promo-video");
const endImage = document.getElementById("end-image");

let gameStarted = false;

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
  { image: new Image(), x: 0, y: 440, width: 5000, height: 600, speed: 1 },
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
let dinoY = canvas.height - dinoHeight;

// Obstacle properties
let cactusWidth = 180;
let cactusHeight = 180;
let cactusX = canvas.width;
let cactusY = canvas.height - cactusHeight - 20;

// Game mechanics
let gravity = 2.2;
let isJumping = false;
let jumpSpeed = 48;
let velocity = 40;
let score = 0;
let gameOver = false;
let obstacleSpeed = 0;

// Draw background function
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Draw dino
function drawDino() {
  drawSprite({
    ctx,
    sprite: dino,
    totalFrames: 24, // Dino sprite has 10 frames
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
    frameInterval: 1000 / 60, // 8 FPS
    currentFrameRef: obstacleState.currentFrame,
  });
}

// Reset cactus position and properties
function resetCactus() {
  cactusX = canvas.width;

  // Randomize cactus size and position
  cactusWidth = Math.random() * 150 + 50;
  cactusHeight = Math.random() * 140 + 60;
  cactusY = canvas.height - cactusHeight - Math.random() * 20 - 20;

  // Randomly select a new cactus sprite
  currentCactus = cactusSprites[Math.floor(Math.random() * cactusSprites.length)];

  // Gradually increase obstacle speed
  obstacleSpeed += 0.2;
}

function drawBackgroundSprites() {
  backgroundSprites.forEach((sprite) => {
    sprite.x -= sprite.speed; // Move left at the sprite's speed
    if (sprite.x + sprite.width < 0) {
      // Reset position when off-screen
      sprite.x = canvas.width + Math.random() * 100;
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
  dinoY = canvas.height - dinoHeight - 20;
  cactusX = canvas.width;
  cactusWidth = 80;
  cactusHeight = 80;
  obstacleSpeed = 10;
  score = 0;
  gameOver = false;
}

// Show crack effect
function showCrackEffect() {
  crack.style.animation = "crack-animation 1s forwards";
  setTimeout(() => {
    showOverlay();
  }, 1000);
}

// Show overlay
function showOverlay() {
  overlay.style.opacity = "1";
  setTimeout(() => {
    overlay.style.opacity = "0";
    showVideo();
  }, 3000);
}

// Show video
function showVideo() {
  videoContainer.style.display = "block";
  const video = document.getElementById("promo-video");
  video.play().catch((error) => console.error("Autoplay failed:", error));
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
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawBackgroundSprites();
  drawDino();
  drawCactus();

  if (isJumping) {
    velocity += gravity;
    dinoY += velocity;
    if (dinoY >= canvas.height - dinoHeight - 20) {
      dinoY = canvas.height - dinoHeight - 20;
      isJumping = false;
    }
  }

  cactusX -= obstacleSpeed;

  // Reset cactus if it moves off-screen
  if (cactusX + cactusWidth < 0) {
    resetCactus();
    score += 100;
    points.innerHTML = score;
  }

  // Collision detection
  if (
    dinoX < cactusX + cactusWidth &&
    dinoX + dinoWidth > cactusX &&
    dinoY < cactusY + cactusHeight &&
    dinoY + dinoHeight > cactusY
  ) {
    gameOver = true;
  }

  requestAnimationFrame(gameLoop);
}

// Show invitation after the video ends
video.addEventListener("ended", () => {
  video.style.opacity = "0";
  setTimeout(() => {
    endImage.style.opacity = "1";
  }, 500);
});

// Event listener for jump and game reset
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameOver) {
      resetGame();
    } else {
      jump();
    }
  }
});

document.addEventListener("click", () => {
  if (gameOver) {
    resetGame();
  } else {
    jump();
  }
});

document.addEventListener("click", () => {
  if (!gameStarted) {
    document.getElementById("idle-text").style.display = "none";
    gameStarted = true;
    obstacleSpeed = 20;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameStarted) {
      document.getElementById("idle-text").style.display = "none";
      gameStarted = true;
      obstacleSpeed = 10;
    }
  }
});

gameLoop();