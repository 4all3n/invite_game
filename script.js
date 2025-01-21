const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");

      const crack = document.getElementById("crack");
      const overlay = document.getElementById("overlay");
      const videoContainer = document.getElementById("video-container");

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const dino = new Image();
      const cactus = new Image();

      dino.src = "dino.png";
      cactus.src = "obstacle.png";

      const dinoWidth = 140;
      const dinoHeight = 110;
      let dinoX = 80;
      let dinoY = canvas.height - dinoHeight;

      const cactusWidth = 80;
      const cactusHeight = 80;
      let cactusX = canvas.width;
      let cactusY = canvas.height - cactusHeight - 20;

      let gravity = 0.9;
      let isJumping = false;
      let jumpSpeed = 26;
      let velocity = 0;

      let score = 0;
      let gameOver = false;

      function drawBackground() {
        ctx.fillStyle = "#e0f7fa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      function drawDino() {
        ctx.drawImage(dino, dinoX, dinoY, dinoWidth, dinoHeight);
      }

      function drawCactus() {
        ctx.drawImage(cactus, cactusX, cactusY, cactusWidth, cactusHeight);
      }

      function drawScore() {
        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 20, 40);
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

        // Attempt to play the video
        video
          .play()
          .then(() => {
            // Request fullscreen once the video starts playing
            if (video.requestFullscreen) {
              video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
              // Safari support
              video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
              // IE/Edge support
              video.msRequestFullscreen();
            }
          })
          .catch((error) => {
            console.error("Autoplay failed:", error);
          });
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

        cactusX -= 6;

        if (cactusX + cactusWidth < 0) {
          cactusX = canvas.width;
          score++;
        }

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