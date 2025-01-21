const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const crack = document.getElementById("crack");
const overlay = document.getElementById("overlay");
const videoContainer = document.getElementById("video-container");
let points = document.getElementById("score");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dino = new Image();
const cactus = new Image();

dino.src = "dino.png";
cactus.src = "obstacle.png";

const dinoWidth = 140;
const dinoHeight = 130;
let dinoX = 80;
let dinoY = canvas.height - dinoHeight;

let cactusWidth = 80;
let cactusHeight = 80;
let cactusX = canvas.width;
let cactusY = canvas.height - cactusHeight - 20;

let gravity = 0.9;
let isJumping = false;
let jumpSpeed = 26;
let velocity = 0;

let score = 0;
let gameOver = false;
let obstacleSpeed = 10;

function drawBackground() {
  ctx.fillStyle = "#07b6b0be";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDino() {
  ctx.drawImage(dino, dinoX, dinoY, dinoWidth, dinoHeight);
}

function drawCactus() {
  ctx.drawImage(cactus, cactusX, cactusY, cactusWidth, cactusHeight);
}

function drawScore() {

}

function jump() {
  if (!isJumping) {
    isJumping = true;
    velocity = -jumpSpeed;
  }
}

function resetGame() {
  dinoY = canvas.height - dinoHeight - 20;
  cactusX = canvas.width;
  cactusWidth = 80;
  cactusHeight = 80;
  obstacleSpeed = 6;
  score = 0;
  gameOver = false;
}

function showCrackEffect() {
  crack.style.animation = "crack-animation 1s forwards";
  setTimeout(() => {
    showOverlay();
  }, 1000);
}

function showOverlay() {
  overlay.style.opacity = "1";
  setTimeout(() => {
    overlay.style.opacity = "0";
    showVideo();
  }, 3000);
}

function showVideo() {
  videoContainer.style.display = "block";
  const video = document.getElementById("promo-video");

  // Attempt to play the video after game over
  video.play().then(() => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  }).catch((error) => {
    console.error("Autoplay failed:", error);
  });
}

function showCrackEffect() {
  crack.style.animation = "crack-animation 1s forwards";
  setTimeout(() => {
    showOverlay();
  }, 1000);
}

function showOverlay() {
  overlay.style.opacity = "1";
  setTimeout(() => {
    overlay.style.opacity = "0";
    showVideo();  // Call showVideo after the overlay disappears
  }, 3000);
}





function gameLoop() {
  if (gameOver) {
    showCrackEffect();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawDino();
  drawCactus();
  drawScore();

  if (isJumping) {
    velocity += gravity;
    dinoY += velocity;
    if (dinoY >= canvas.height - dinoHeight - 20) {
      dinoY = canvas.height - dinoHeight - 20;
      isJumping = false;
    }
  }

  cactusX -= obstacleSpeed;

  // Reset obstacle and increase difficulty
  if (cactusX + cactusWidth < 0) {
    cactusX = canvas.width;

    // Randomize cactus size and position
    cactusWidth = Math.random() * 50 + 50; // Width between 50 and 100
    cactusHeight = Math.random() * 40 + 60; // Height between 60 and 100
    cactusY = canvas.height - cactusHeight - Math.random() * 20 - 20;

    score=score+100;
    points.innerHTML = score;
    obstacleSpeed += 0.2; // Gradually increase speed
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

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameOver) {
      resetGame();
    } else {
      jump();
    }
  }
});

gameLoop();