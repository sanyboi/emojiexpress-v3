// src/sketch.js

let path;
let player;
let emojiChain = [];
let emojiTypes = ["😀", "😎", "😡", "😱", "🤖"];
let bullet = null;
let gameState = "MENU";
let highestLevelUnlocked = 1;
let currentLevel = 1;

let pixelSpeed = 1.5;
let pixelSpacing = 38;

let floatingTexts = [];

let score = 0;
let highScore = 0;
let comboMultiplier = 1;

const levels = [
  { id: 1, speed: 0.5, count: 20 },
  { id: 2, speed: 0.75, count: 35 },
  { id: 3, speed: 2.5, count: 50 }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  path = new GamePath();
  player = new Shooter(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  let saved = localStorage.getItem("zumaHighScore");
  if (saved) highScore = parseInt(saved);
}

function draw() {
  background(10, 10, 25);

  if (gameState === "MENU") {
    drawMainMenu();
  } else if (gameState === "LEVEL_SELECT") {
    drawLevelSelect();
  } else if (gameState === "PLAYING") {
    runGameLogic();
    drawScoreboard();
  } else if (gameState === "GAMEOVER") {
    drawGameOver();
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    let ft = floatingTexts[i];
    ft.y -= 1.5;    // Float upward
    ft.alpha -= 4;  // Slowly fade away

    push();
    textAlign(CENTER);
    textSize(24);
    fill(255, 255, 0, ft.alpha); // Yellow text with fading alpha
    stroke(0, ft.alpha);         // Black outline for readability
    strokeWeight(2);
    text(ft.txt, ft.x, ft.y);
    pop();

    // Remove from array once it's invisible
    if (ft.alpha <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}

// --- CORE GAME ENGINE ---

function runGameLogic() {
  path.display();

  // 1. IMPROVED Multi-Gap Logic
  if (emojiChain.length > 0) {
    let movementStatus = new Array(emojiChain.length).fill(true);

    // STEP A: Scan for gaps
    for (let i = 1; i < emojiChain.length; i++) {
      let gap = emojiChain[i - 1].pixelDist - emojiChain[i].pixelDist;
      if (gap > pixelSpacing + 5) {
        for (let j = 0; j < i; j++) {
          movementStatus[j] = false;
        }
      }
    }

    // STEP B: Apply movement
    for (let i = 0; i < emojiChain.length; i++) {
      if (movementStatus[i]) {
        if (i === 0) {
          emojiChain[i].pixelDist += pixelSpeed;
        } else {
          let gap = emojiChain[i - 1].pixelDist - emojiChain[i].pixelDist;
          if (gap <= pixelSpacing + 1) {
            emojiChain[i].pixelDist = emojiChain[i - 1].pixelDist - pixelSpacing;
          } else {
            emojiChain[i].pixelDist += pixelSpeed;
          }
        }
      }
    }
    // STEP C: Combo Check (The "Magnetic" Pop)
    for (let i = 1; i < emojiChain.length; i++) {
      let current = emojiChain[i];
      let front = emojiChain[i - 1];
      let gap = front.pixelDist - current.pixelDist;

      // Logic: Front section is STOPPED, back section is MOVING
      if (movementStatus[i - 1] === false && movementStatus[i] === true) {

        // If they are within snapping range (pixelSpacing + a small buffer)
        if (gap <= pixelSpacing + 5) {

          // 1. FORCE THE SNAP (Critical for the math to work)
          current.pixelDist = front.pixelDist - pixelSpacing;
          current.updatePosition(); // Refresh X, Y coordinates immediately

          // 2. CHECK TYPE
          if (front.type === current.type) {
            console.log("Magnetic Match Triggered!");
            comboMultiplier++;

            // 3. TRIGGER MATCH on the connection
            checkMatches(i);

            // 4. BREAK immediately so we don't process a dead array
            break;
          }
        }
      }
    }
  } else {
    // WIN CONDITION
    if (currentLevel === highestLevelUnlocked && highestLevelUnlocked < levels.length) {
      highestLevelUnlocked++;
    }
    gameState = "LEVEL_SELECT";
  }

  // 2. Draw Chain
  for (let i = 0; i < emojiChain.length; i++) {
    let e = emojiChain[i];
    if (e.pixelDist > 0) {
      e.updatePosition();
      e.display();
    }
    if (e.pixelDist >= path.totalLength) {
      gameState = "GAMEOVER";
    }

    // Inside runGameLogic or wherever you check for Game Over
    if (e.pixelDist >= path.totalLength) {
      if (score > highScore) {
        highScore = score;
        // Optional: Save to browser memory
        localStorage.setItem("zumaHighScore", highScore);
      }
      gameState = "GAMEOVER";
    }
  }

  // 3. Smooth Insertion & Off-Screen Cleanup
  if (bullet) {
    bullet.update();
    bullet.display();

    for (let i = 0; i < emojiChain.length; i++) {
      let d = dist(bullet.x, bullet.y, emojiChain[i].x, emojiChain[i].y);
      if (d < 30) {
        let insertionIndex = i;
        for (let j = insertionIndex; j < emojiChain.length; j++) {
          emojiChain[j].pixelDist -= pixelSpacing;
        }
        let newEmoji = new Emoji(bullet.type, emojiChain[insertionIndex].pixelDist + pixelSpacing, path);
        emojiChain.splice(insertionIndex, 0, newEmoji);
        bullet = null;
        checkMatches(insertionIndex);
        break;
      }
    }

    if (bullet) {
      if (bullet.x < -50 || bullet.x > width + 50 ||
        bullet.y < -50 || bullet.y > height + 50) {
        bullet = null;
      }
    }
  }

  player.update();
  player.display();
}
// --- INPUT HANDLING ---

function mousePressed() {
  if (gameState === "MENU") {
    // Click Start Button
    if (dist(mouseX, mouseY, width / 2, height / 2) < 100) gameState = "LEVEL_SELECT";
  }
  else if (gameState === "LEVEL_SELECT") {
    for (let i = 0; i < levels.length; i++) {
      let y = 200 + (i * 80);
      if (abs(mouseX - width / 2) < 150 && abs(mouseY - y) < 30) {
        if (levels[i].id <= highestLevelUnlocked) startLevel(levels[i]);
      }
    }
  }
  else if (gameState === "PLAYING") {
    bullet = player.fire();
    comboMultiplier = 1;
  }
  else if (gameState === "GAMEOVER") {
    gameState = "MENU";
  }
}

function startLevel(lvl) {
  currentLevel = lvl.id;
  pixelSpeed = lvl.speed;

  // 1. Re-generate or load the path based on level ID
  path.setupPath(currentLevel);

  // 2. Center the shooter at the end of the new path
 if (typeof levelData !== 'undefined' && levelData[currentLevel]) {
    let pos = levelData[currentLevel].shooterPos;
    player.x = pos.x * width;
    player.y = pos.y * height;
  } else {
    // Fallback: If level data is missing, put phone in center
    console.warn("Level data or shooterPos missing for level: " + currentLevel);
    player.x = width / 2;
    player.y = height / 2;
  }

  // 4. Reset Game State
  score = 0;
  emojiChain = [];
  
  // Create initial emojis for the train
  for (let i = 0; i < lvl.count; i++) {
    let type = random(emojiTypes);
    let dist = -i * pixelSpacing;
    emojiChain.push(new Emoji(type, dist, path));
  }

  gameState = "PLAYING";
}


function checkMatches(index) {
  // 1. Safety Check
  if (index < 0 || index >= emojiChain.length) return;

  let targetType = emojiChain[index].type;
  let matchIndices = [index];

  // 2. Scan Forward (towards the end of the path)
  for (let i = index + 1; i < emojiChain.length; i++) {
    if (emojiChain[i].type === targetType) {
      matchIndices.push(i);
    } else {
      break;
    }
  }
  1
  // 3. Scan Backward (towards the start of the path)
  for (let i = index - 1; i >= 0; i--) {
    if (emojiChain[i].type === targetType) {
      matchIndices.push(i);
    } else {
      break;
    }
  }

  // 4. POP LOGIC: Only if 3 or more are touching
  if (matchIndices.length >= 3) {
    // CALCULATE POINTS: 10 points per emoji * multiplier
    let pointsGained = (matchIndices.length * 10) * comboMultiplier;
    score += pointsGained;

    // Show the points floating in the air
    if (typeof spawnFloatingText === "function") {
      let msg = "+" + pointsGained + (comboMultiplier > 1 ? " (x" + comboMultiplier + "!)" : "");
      spawnFloatingText(msg, emojiChain[index].x, emojiChain[index].y);
    }

    // Sort High to Low and Splice
    matchIndices.sort((a, b) => b - a);
    for (let idx of matchIndices) {
      emojiChain.splice(idx, 1);
    }
  }
}

function spawnFloatingText(msg, x, y) {
  // This creates a simple object and adds it to our list
  floatingTexts.push({
    txt: msg,
    x: x,
    y: y,
    alpha: 255
  });
}