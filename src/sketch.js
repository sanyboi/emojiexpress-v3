
let path;
let player;
let emojiChain = [];
let emojiTypes = ["😀", "😎", "😡", "😱", "🤖"];
let bullet = null;
let gameState = "MENU";
let tutorialStep = 0;
let highestLevelUnlocked = 1;
let currentLevel = 1;

let pixelSpeed = 1.5;
let pixelSpacing = 38;

let floatingTexts = [];

let score = 0;
let levelHighScores = {};
let comboMultiplier = 1;
let menuBg;
let isMusicOn = true; // Default to ON
let clickSound;
let shootSound;
let particles = [];



const levels = [
  { id: 1, speed: 0.5, count: 20 }, // Level 1: Spiral (Slow intro)
  { id: 2, speed: 0.5, count: 30 }, // Level 2: Z-Shape
  { id: 3, speed: 0.5, count: 40 }, // Level 3: Waves
  { id: 4, speed: 0.5, count: 45 }, // Level 4: Square Box
  { id: 5, speed: 0.5, count: 50 }, // Level 5: Hourglass
  { id: 6, speed: 0.5, count: 55 }, // Level 6: Snake (Faster turns)
  { id: 7, speed: 0.5, count: 60 }, // Level 7: Triangle
  { id: 8, speed: 0.5, count: 65 }, // Level 8: Diamond
  { id: 9, speed: 0.5, count: 70 }, // Level 9: U-Turn (Very long)
  { id: 10, speed: 0.5, count: 80 }  // Level 10: Spiral Square (Boss level!)
];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  // --- STEP 3: THE SAFETY CHECK ---
  // If auth.js failed or loaded slowly, db will be undefined.
  if (typeof db === 'undefined' || !db) {
    console.warn("Firebase 'db' not found. Using local storage only.");
    // We don't crash the game; we just load local data and stop the sync attempt
    let saved = localStorage.getItem("zumaLevelHighScores");
    if (saved) levelHighScores = JSON.parse(saved);

    path = new GamePath();
    player = new Shooter(width / 2, height / 2);
    textAlign(CENTER, CENTER);
    return; // Exit the function early so the cloud code below doesn't run
  }

  // --- RE-INITIALIZE GAME OBJECTS ---
  path = new GamePath();
  player = new Shooter(width / 2, height / 2);
  textAlign(CENTER, CENTER);

  // 1. Local Storage Fallback (Initial check)
 let saved = localStorage.getItem("zumaLevelHighScores");
  if (saved) levelHighScores = JSON.parse(saved);

  try {
    const doc = await db.collection("players").doc(playerId).get();
    if (doc.exists) {
      const data = doc.data();
      highestLevelUnlocked = data.highestLevel || 1;
      // Sync Level-Specific High Scores
      if (data.levelHighScores) {
        levelHighScores = data.levelHighScores;
        localStorage.setItem("zumaLevelHighScores", JSON.stringify(levelHighScores));
      }
    }
  } catch (error) {
    console.error("Firebase Sync Failed:", error);
  }
}

function preload() {
  // Make sure this matches the filename of the NEW image you saved
  menuBg = loadImage('assets/menu_bg3.png');
  bgMusic = loadSound('assets/background_music.mp3');
  clickSound = loadSound('assets/click_sfx.wav');
  shootSound = loadSound('assets/shoot_sfx.wav');
}

function draw() {
  background(10, 10, 25);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  if (bgMusic && bgMusic.isLoaded()) {
    if (gameState === "MENU" || gameState === "CONFIRM_RESET") {
      // If we are in the menu and music is ON but not playing, start it
      if (isMusicOn && !bgMusic.isPlaying()) {
        bgMusic.loop();
        bgMusic.setVolume(0.5, 1); // Fade in over 1 second
      }
    } else {
      // If the player leaves the menu, stop the music
      if (bgMusic.isPlaying()) {
        bgMusic.setVolume(0, 0.5); // Fade out over 0.5 seconds
        bgMusic.stop();
      }
    }
  }
  if (gameState === "MENU") {
    drawMainMenu();
  } else if (gameState === "CONFIRM_RESET") {
    drawMainMenu();   // Draw menu in background
    drawConfirmModal(); // Overlay modal on top

  } else if (gameState === "TUTORIAL") {
    drawTutorial();
    player.update();
  } else if (gameState === "LEVEL_SELECT") {
    drawLevelSelect();
  } else if (gameState === "PLAYING") {
    runGameLogic();
    drawGame();
    drawScoreboard();
    drawPauseButton();
  } else if (gameState === "PAUSED") {
    drawGame();        // Draw the game frozen in the background
    drawPauseMenu();
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

function drawGame() {
  // 1. Draw the track

  drawingContext.shadowBlur = 0;
  path.display();

  // 2. Draw the Emoji Chain
  for (let i = 0; i < emojiChain.length; i++) {
    let e = emojiChain[i];
    if (e.pixelDist > 0) {
      e.display(); // Only display, don't update position
    }
  }


  // 3. Draw the Bullet
  if (bullet) {
    bullet.display();
  }

  // 4. Draw the Player
  player.display();
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

    if (!levelHighScores[currentLevel] || score > levelHighScores[currentLevel]) {
      levelHighScores[currentLevel] = score;
      localStorage.setItem("zumaLevelHighScores", JSON.stringify(levelHighScores));
    } 

    if (currentLevel === highestLevelUnlocked && highestLevelUnlocked < levels.length) {
      highestLevelUnlocked++;

      // Step 4: Save the new progress to Firebase
      if (typeof saveProgressToCloud === "function") {
        saveProgressToCloud(highestLevelUnlocked);
      }
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
      if (!levelHighScores[currentLevel] || score > levelHighScores[currentLevel]) {
        levelHighScores[currentLevel] = score;
        localStorage.setItem("zumaLevelHighScores", JSON.stringify(levelHighScores));
        if (typeof saveProgressToCloud === "function") {
          saveProgressToCloud(highestLevelUnlocked, levelHighScores);
        }
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

  if (clickSound && isMusicOn) {
    let randomPitch = random(0.9, 1.1);
    clickSound.rate(randomPitch);
    clickSound.play();
  }

  if (gameState === "MENU") {
    let btnW = 240;
    let btnH = 55; // Matching the slightly shorter height from drawMainMenu

    // These Y positions MUST match exactly what you have in drawMainMenu()
    let startY = height * 0.70;   // Continue/Start
    let newGameY = height * 0.80; // New Game
    let tutY = height * 0.90;     // How to Play
    let musicBtnX = width - 60;
    let musicBtnY = height - 60;

    if (dist(mouseX, mouseY, musicBtnX, musicBtnY) < 30) {
      isMusicOn = !isMusicOn;

      if (isMusicOn) {
        bgMusic.loop();
      } else {
        bgMusic.stop();
      }
    }

    // 1. CONTINUE / START GAME
    if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - startY) < btnH / 2) {
      if (isMusicOn && !bgMusic.isPlaying()) {
        bgMusic.loop();
      }
      gameState = "LEVEL_SELECT";
    }

    if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - newGameY) < btnH / 2) {
      gameState = "CONFIRM_RESET";
    }
    // 3. HOW TO PLAY
    if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - tutY) < btnH / 2) {
      gameState = "TUTORIAL";
      tutorialStep = 0;
      path.setupPath(1);
    }
  }

  // --- NEW STATE: HANDLE MODAL BUTTONS ---
  // --- HANDLE MODAL BUTTONS ---
  else if (gameState === "CONFIRM_RESET") {
    let modalBtnW = 120;
    let modalBtnH = 45;

    // --- YES (RESET) BUTTON ---
    if (abs(mouseX - (width / 2 - 80)) < modalBtnW / 2 && abs(mouseY - (height / 2 + 60)) < modalBtnH / 2) {

      // 1. Reset ALL progress and scores
      highestLevelUnlocked = 1;
      score = 0;
      levelHighScores = {};

      // 2. Clear Local Storage
      localStorage.setItem("zumaLevelHighScores", JSON.stringify(levelHighScores));

      // 3. Sync the "Zeroed" data to Cloud
      if (typeof saveProgressToCloud === "function") {
        saveProgressToCloud(1, levelHighScores);
      }

      // 4. Clean the styles to prevent "pale" emojis
      drawingContext.shadowBlur = 0;
      drawingContext.shadowColor = 'rgba(0,0,0,0)';

      gameState = "LEVEL_SELECT";
    }

    // --- NO (CANCEL) BUTTON ---
    if (abs(mouseX - (width / 2 + 80)) < modalBtnW / 2 && abs(mouseY - (height / 2 + 60)) < modalBtnH / 2) {
      gameState = "MENU";
    }
  }
  else if (gameState === "TUTORIAL") {
    if (tutorialStep < 2) {
      tutorialStep++;
    } else {
      gameState = "MENU";
    }
  }

  else if (gameState === "LEVEL_SELECT") {
    let cols = 3;
    let spacingX = 150;
    let spacingY = 150;
    let startX = width / 2 - spacingX;
    let startY = height * 0.35;

    for (let i = 0; i < levels.length; i++) {
      let col = i % cols;
      let row = floor(i / cols);
      let x = startX + col * spacingX;
      let y = startY + row * spacingY;

      if (dist(mouseX, mouseY, x, y) < 50) {
        if (levels[i].id <= highestLevelUnlocked) {
          startLevel(levels[i]);
        }
      }
    }
  }

  else if (gameState === "PLAYING") {
    // Pause button check
    if (mouseX > width - 60 && mouseX < width - 20 && mouseY > 20 && mouseY < 60) {
      gameState = "PAUSED";
      return;
    }

    if (isMusicOn && shootSound) shootSound.play();
    bullet = player.fire();
    comboMultiplier = 1;
  }

  else if (gameState === "PAUSED") {
    let btnW = 250;
    let btnH = 60;

    let y1 = height * 0.45;      // CONTINUE
    let y2 = height * 0.45 + 80; // START OVER
    let y3 = height * 0.45 + 160; // MAIN MENU

    if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - y1) < btnH / 2) {
      gameState = "PLAYING";
    }
    if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - y2) < btnH / 2) {
      startLevel(levels[currentLevel - 1]);
    }
    if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - y3) < btnH / 2) {
      gameState = "MENU";
    }
  }

  else if (gameState === "GAMEOVER") {
    gameState = "MENU";
  }
}

function startLevel(lvl) {
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = 'rgba(0,0,0,0)';


  currentLevelScore = 0;
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
  if (index < 0 || index >= emojiChain.length) return;

  let targetType = emojiChain[index].type;
  let matchIndices = [index];

  // 2. Scan Forward
  for (let i = index + 1; i < emojiChain.length; i++) {
    if (emojiChain[i].type === targetType) {
      matchIndices.push(i);
    } else {
      break;
    }
  }

  // 3. Scan Backward
  for (let i = index - 1; i >= 0; i--) {
    if (emojiChain[i].type === targetType) {
      matchIndices.push(i);
    } else {
      break;
    }
  }

  // 4. POP LOGIC
  if (matchIndices.length >= 3) {

    // --- STEP 3: SPLASH EFFECT LOGIC ---
    // Pick a color based on emoji type
    let splashCol = color(255, 255, 0); // Default Yellow
    if (targetType === "😡") splashCol = color(255, 50, 50);   // Red
    if (targetType === "😎") splashCol = color(50, 150, 255);  // Blue
    if (targetType === "🤖") splashCol = color(150, 150, 150); // Grey

    // Create particles for each emoji in the match
    for (let idx of matchIndices) {
      let e = emojiChain[idx];
      // Spawn 10 particles per emoji popped
      for (let p = 0; p < 10; p++) {
        // Assuming your particle array is named 'particles'
        if (typeof particles !== 'undefined') {
          particles.push(new Particle(e.x, e.y, splashCol));
        }
      }
    }
    // -----------------------------------

    let pointsGained = (matchIndices.length * 10) * comboMultiplier;
    score += pointsGained;

    if (typeof spawnFloatingText === "function") {
      let msg = "+" + pointsGained + (comboMultiplier > 1 ? " (x" + comboMultiplier + "!)" : "");
      spawnFloatingText(msg, emojiChain[index].x, emojiChain[index].y);
    }

    // Sort and remove emojis
    matchIndices.sort((a, b) => b - a);
    for (let idx of matchIndices) {
      emojiChain.splice(idx, 1);
    }

    // Play a "pop" sound here if you have one!
    // if (isMusicOn && popSound) popSound.play();
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

async function saveProgressToCloud(levelReached, scoresObj) {
  // If scoresObj wasn't passed, use the global levelHighScores object as a fallback
  let finalScores = (scoresObj !== undefined) ? scoresObj : levelHighScores;

  try {
    await db.collection("players").doc(playerId).set({
      highestLevel: levelReached,
      // We rename the field to 'levelHighScores' to match the new system
      levelHighScores: finalScores, 
      lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log("Cloud Sync Successful! Level: " + levelReached);
  } catch (error) {
    console.error("Error saving to Firestore: ", error);
  }
}