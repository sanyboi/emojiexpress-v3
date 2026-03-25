function drawMainMenu() {
  push();
  if (menuBg) {
    imageMode(CORNER);
    image(menuBg, 0, 0, width, height);
  } else {
    background(10, 10, 30);
  }

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();

  // --- BUTTON SETTINGS ---
  let btnW = 240;
  let btnH = 55;
  let startY = height * 0.70;
  let newGameY = height * 0.80;
  let tutY = height * 0.90;

  // --- 1. DRAW THE CONTAINER (The "Panel") ---
  // We calculate the size based on the top and bottom button positions
  let containerW = btnW + 60; 
  let containerH = (tutY - startY) + btnH + 40; 
  let containerY = (startY + tutY) / 2; // The midpoint between the buttons

  fill(0, 0, 0, 120); // Transparent black (Alpha 120/255)
  rect(width / 2, containerY, containerW, containerH, 20); // Rounded corners

  // Optional: Add a subtle border to the container
  stroke(255, 30); 
  strokeWeight(2);
  noFill();
  rect(width / 2, containerY, containerW, containerH, 20);
  noStroke();

  // --- 2. START GAME (CONTINUE) ---
  if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - startY) < btnH / 2) {
    fill(0, 150, 255);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 255);
  } else {
    fill(0, 200, 255, 200);
    drawingContext.shadowBlur = 0;
  }
  rect(width / 2, startY, btnW, btnH, 15);
  fill(255);
  textSize(22);
  text("START GAME", width / 2, startY);

  // --- 3. NEW GAME BUTTON ---
  if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - newGameY) < btnH / 2) {
    fill(255, 50, 100);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 0, 100);
  } else {
    fill(200, 50, 80, 200);
    drawingContext.shadowBlur = 0;
  }
  rect(width / 2, newGameY, btnW, btnH, 15);
  fill(255);
  text("NEW GAME", width / 2, newGameY);

  // --- 4. HOW TO PLAY ---
  if (abs(mouseX - width / 2) < btnW / 2 && abs(mouseY - tutY) < btnH / 2) {
    fill(100, 100, 250);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(150, 100, 255);
  } else {
    fill(130, 130, 255, 200);
    drawingContext.shadowBlur = 0;
  }
  rect(width / 2, tutY, btnW, btnH, 15);
  fill(255);
  text("HOW TO PLAY", width / 2, tutY);

  // --- MUSIC BUTTON ---
  let musicBtnX = width - 60;
  let musicBtnY = height - 60;
  let r = 50;

  if (dist(mouseX, mouseY, musicBtnX, musicBtnY) < r/2) {
    fill(255, 255, 0);
    cursor(HAND);
  } else {
    fill(255, 200);
  }
  textSize(30);
  text(isMusicOn ? "🔊" : "🔈", musicBtnX, musicBtnY);
  textSize(12);
  text("MUSIC", musicBtnX, musicBtnY + 25);

  pop();
}


function drawLevelSelect() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  // Title
  fill(255);
  textSize(50);
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = color(255);
  text("SELECT LEVEL", width / 2, height * 0.15);
  drawingContext.shadowBlur = 0;

  let cols = 3;
  let spacingX = 150;
  let spacingY = 170; // Increased spacing slightly to fit stars
  let startX = width / 2 - spacingX;
  let startY = height * 0.35;

  for (let i = 0; i < levels.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);
    let x = startX + col * spacingX;
    let y = startY + row * spacingY;

    let isLocked = levels[i].id > highestLevelUnlocked;
    let btnSize = 100;

    // --- DRAW PURPLE CIRCLE BUTTON ---
    noStroke();
    if (isLocked) {
      fill(80, 40, 120, 200);
    } else {
      if (dist(mouseX, mouseY, x, y) < btnSize / 2) {
        fill(180, 100, 255);
        cursor(HAND);
      } else {
        fill(130, 70, 210);
      }
    }
    ellipse(x, y, btnSize, btnSize);

    // --- GLOSS EFFECT ---
    fill(255, 255, 255, 50);
    arc(x, y - 5, btnSize * 0.8, btnSize * 0.6, PI, TWO_PI);

    // --- LEVEL NUMBER OR LOCK ---
    fill(255);
    if (isLocked) {
      textSize(40);
      text("🔒", x, y);
    } else {
      textSize(44);
      text(levels[i].id, x, y);

      // --- STEP 3: STAR LOGIC ---
      let s = levelHighScores[levels[i].id] || 0;
      let starY = y + 55; // Positioned just below the circle
      let starString = "";
      
      // Define your thresholds here
      if (s >= 1500) starString = "⭐⭐⭐";
      else if (s >= 800) starString = "⭐⭐";
      else if (s >= 100) starString = "⭐";
      else starString = "☆☆☆"; // Empty stars if played but low score

      textSize(18);
      text(starString, x, starY);
      
      // Optional: Small Best Score text
      textSize(12);
      fill(200);
      text(s, x, starY + 20);
    }
  }
  pop();
}

function drawGameOver() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  // Dark semi-transparent overlay
  fill(0, 0, 0, 200);
  rect(width / 2, height / 2, width, height);

  // Game Over Text
  noStroke();
  fill(255, 50, 50);
  textSize(80);
  text("GAME OVER", width / 2, height / 2);

  fill(255);
  textSize(25);
  text("Click anywhere to return to Menu", width / 2, height / 2 + 80);
  pop();
}

function drawScoreboard() {
  push();
  // Semi-transparent background for the UI
  fill(0, 150);
  noStroke();
  rect(10, 10, 180, 80, 10);

  // 1. Get the Best Score for the current level (default to 0 if not found)
  let best = (levelHighScores && levelHighScores[currentLevel]) ? levelHighScores[currentLevel] : 0;

  // Draw Labels
  textAlign(LEFT);
  textSize(16);
  fill(200);
  text("SCORE:", 25, 35);
  text("BEST:", 25, 65);

  // Draw Numbers
  textAlign(RIGHT);
  textSize(22);
  
  // --- CURRENT SESSION SCORE ---
  fill(255, 255, 0); // Gold color for current score
  text(score, 175, 35);

  // --- BEST SCORE FOR THIS LEVEL ---
  fill(255);
  // Use the 'best' variable we calculated above instead of 'highScore'
  text(best, 175, 65); 
  
  pop();
}

function drawTutorial() {
  push();
  background(10, 10, 30, 240);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  path.display();

  // Title
  fill(0, 255, 255);
  textSize(40);
  text("HOW TO PLAY", width / 2, 80);

  if (tutorialStep === 0) {
    fill(255);
    textSize(22);
    text("1. AIM & SHOOT\nMove mouse to aim the phone.\nClick to send an emoji!", width / 2, 180);

    // Keeping the pulsing line as a subtle guide instead of the finger
    stroke(0, 255, 255, 100);
    drawingContext.setLineDash([10, 10]);
    line(player.x, player.y, mouseX, mouseY);
    drawingContext.setLineDash([]);

    player.display();
  }

  else if (tutorialStep === 1) {
    fill(255);
    textSize(22);
    text("2. MATCH 3\nConnect 3 of the same emoji\nto make them pop!", width / 2, 180);

    textSize(50);
    text("🍎 🍎", width / 2 - 30, height / 2);

    let xMove = map(sin(frameCount * 0.08), -1, 1, width / 2 + 150, width / 2 + 45);
    text("🍎", xMove, height / 2);

    if (xMove < width / 2 + 60) {
      fill(255, 255, 0);
      textSize(30);
      text("MATCH!", width / 2, height / 2 - 70);
    }
  }

  else if (tutorialStep === 2) {
    fill(255);
    textSize(22);
    text("3. CLEAR THE PATH\nDon't let them reach the end!\nClear all emojis to win.", width / 2, 180);

    // Get the center of the spiral (the last point added)
    if (path.points && path.points.length > 0) {
      let endPoint = path.points[path.points.length - 1];

      // Pulsing Red "Danger" Hole at the center of the spiral
      push();
      noFill();
      let pulse = 150 + sin(frameCount * 0.1) * 100;
      stroke(255, 0, 0, pulse);
      strokeWeight(5);

      // Draw at the center of the spiral
      ellipse(endPoint.x, endPoint.y, 60, 60);

      fill(255, 0, 0, pulse);
      noStroke();
      textSize(14);
      text("DANGER", endPoint.x, endPoint.y + 50);
      pop();


    }
  }
  // Next Button
  fill(255);
  textSize(18);
  let footerText = (tutorialStep === 2) ? "Click to EXIT to Menu" : "Click anywhere to continue...";
  text(footerText, width / 2, height - 50);
  pop();
}

// Small pause button in the top right corner
function drawPauseButton() {
  push();
  rectMode(CORNER);
  let x = width - 60;
  let y = 20;

  // Hover effect
  if (mouseX > x && mouseX < x + 40 && mouseY > y && mouseY < y + 40) {
    fill(200, 200, 255);
  } else {
    fill(255, 150);
  }

  rect(x, y, 40, 40, 10);
  fill(50);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("||", x + 20, y + 20);
  pop();
}

function drawPauseMenu() {
  push(); // Start a new drawing state
  
  // 1. Reset rectMode to CORNER for the full-screen overlay
  rectMode(CORNER); 
  fill(0, 0, 0, 150);
  // This now correctly draws from (0,0) to the full width/height
  rect(0, 0, width, height); 
  
  // 2. Now switch to CENTER for the menu and buttons
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  
  fill(255);
  textSize(50);
  text("PAUSED", width / 2, height * 0.3);

  let btnW = 250;
  let btnH = 60;
  let buttons = ["CONTINUE", "START OVER", "MAIN MENU"];
  
  for (let i = 0; i < buttons.length; i++) {
    let y = height * 0.45 + (i * 80);
    
    // Hover logic
    if (abs(mouseX - width/2) < btnW/2 && abs(mouseY - y) < btnH/2) {
      fill(150, 100, 255); // Brighter purple
    } else {
      fill(130, 70, 210); // Matches your level select purple
    }
    
    rect(width / 2, y, btnW, btnH, 15);
    fill(255);
    textSize(22);
    text(buttons[i], width / 2, y);
  }
  
  pop(); // Restore original drawing state
}

function drawConfirmModal() {
  // 1. Dim the background
  fill(0, 0, 0, 180);
  rectMode(CORNER);
  rect(0, 0, width, height);

  // 2. The Modal Box
  push();
  rectMode(CENTER);
  translate(width / 2, height / 2);
  
  // Reset shadows before drawing the box so the box itself isn't "pale"
  drawingContext.shadowBlur = 0;

  // Glass effect
  fill(40, 20, 80, 230); 
  stroke(180, 100, 255);
  strokeWeight(3);
  rect(0, 0, 400, 250, 20);

  // Text
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("START NEW GAME?", 0, -60);
  
  textSize(16);
  fill(200);
  text("This will reset all progress.\nThis action cannot be undone!", 0, -10);

  // Buttons Logic
  let modalBtnW = 120;
  let modalBtnH = 45;

  // --- YES Button (Red/Danger) ---
  let yesHover = (abs(mouseX - (width/2 - 80)) < modalBtnW/2 && abs(mouseY - (height/2 + 60)) < modalBtnH/2);
  if (yesHover) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 0, 0);
    fill(255, 50, 50);
  } else {
    drawingContext.shadowBlur = 0;
    fill(180, 40, 40);
  }
  rect(-80, 60, modalBtnW, modalBtnH, 10);
  
  // --- NO Button (Purple/Safe) ---
  let noHover = (abs(mouseX - (width/2 + 80)) < modalBtnW/2 && abs(mouseY - (height / 2 + 60)) < modalBtnH/2);
  if (noHover) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(180, 100, 255);
    fill(150, 80, 255);
  } else {
    drawingContext.shadowBlur = 0;
    fill(100, 50, 200);
  }
  rect(80, 60, modalBtnW, modalBtnH, 10);

  // --- CRITICAL RESET ---
  // Turn off shadow before drawing text so the text is sharp
  drawingContext.shadowBlur = 0;
  fill(255);
  textSize(18);
  text("YES", -80, 60);
  text("CANCEL", 80, 60);
  
  pop();
}