# Xactitude 2025 Invitation Game

An interactive, responsive 2D runner game built to serve as a gamified invitation experience for **Xactitude 2025**, the National Level Intercollegiate IT Fest presented by the Department of Computer Science (UG) at Kristu Jayanti College, Bengaluru.

The player controls Luffy (Gear 5) running along a scrolling grass path, jumping over obstacles (cacti). On collision, a cracked glass animation triggers, presenting a premium glassmorphic invitation card modal with a **Play Again** button in the top-right corner to restart.

---

## Key Features

1. **Mobile Responsive Layout:** 
   - A fully responsive structure utilizing Tailwind CSS.
   - The navigation sidebar dynamically transforms into a top horizontal bar on mobile viewports.
   - Text sizes, borders, and margins adapt seamlessly using fluid layout practices.
2. **Aspect-Ratio Fixed Canvas:**
   - The canvas wrapper utilizes a strict `aspect-[2/1]` ratio. This prevents any vertical or horizontal coordinate squishing on different screens.
3. **Logical coordinate scaling:**
   - The game physics and draw updates are computed in a constant virtual resolution of `1600x800` pixels.
   - A window resize listener automatically updates the physical resolution to match the parent container and scales drawing calls using `ctx.scale(scaleX, scaleY)` on the canvas 2D context.
4. **Refined Bounding Box Collisions:**
   - Bounding boxes are padded (`70px` left/right padding for Luffy, `25%` horizontal padding for cacti) to match the visible artwork instead of the transparent boundaries of the sprites, resulting in precise and rewarding collision detection.
5. **Continuous Gradual Acceleration:**
   - Obstacles accelerate smoothly by `0.0015` speed units per frame, creating an organic scaling challenge over time.
6. **High Score System:**
   - Scores are updated dynamically (`+100` per obstacle) and the personal best is persisted locally using browser `localStorage` under `xact_best_score`.
7. **Premium Glassmorphic Invitation Screen:**
   - Replaced solid overlays with a teal radial gradient glow backdrop (`backdrop-blur-md`), pop-in zoom scaling for the invitation card, and a glassmorphic Play button with a play icon in the top-right corner.

---

## Directory Structure

```text
├── font/                # Custom typography (.ttf)
├── res/                 # Graphics assets (Logos, ambient details)
├── index.html           # Main HTML structure & responsive overlays
├── styles.css           # Custom theme fonts, glassmorphism, and animations
├── script.js           # Logical loop, scale resize, physics, and input unification
├── tailwind.config.js   # Tailwind configurations
└── README.md            # Project description & documentation
```

---

## How to Run & Test

To view and play the game locally, you can serve the directory using a simple HTTP server:

### Python 3
```bash
python3 -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

### Node.js (http-server)
```bash
npx -y http-server -p 8000
```
Open your browser and navigate to `http://localhost:8000`.

---

## Mobile Simulation
Press `F12` to open your browser Developer Tools, toggle the device toolbar, and select various mobile formats (e.g., iPhone, iPad, Pixel) to verify that the canvas scaling and responsive navigation menu behave correctly. Tap the screen to jump!