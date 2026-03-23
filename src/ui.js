function drawMainMenu() {
  push();

  // 1. Draw Background Image
  if (menuBg) {
    imageMode(CORNER);
    image(menuBg, 0, 0, width, height);
  } else {
    background(10, 10, 30);
  }

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();

  let btnW = 240;
  let btnH = 60;

  // --- POSITION LOGIC ---
  // height * 0.75 moves the first button 75% of the way down the screen
  let startY = height * 0.75;
  let tutY = height * 0.85;

  // --- START GAME BUTTON ---
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
  textSize(25);
  text("START GAME", width / 2, startY);

  // --- HOW TO PLAY BUTTON ---
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
  let spacingX = 150; // Horizontal gap
  let spacingY = 150; // Vertical gap
  let startX = width / 2 - spacingX; // Centers the 3-column grid
  let startY = height * 0.35;

  for (let i = 0; i < levels.length; i++) {
    // Grid Math
    let col = i % cols;
    let row = floor(i / cols);
    let x = startX + col * spacingX;
    let y = startY + row * spacingY;

    let isLocked = levels[i].id > highestLevelUnlocked;
    let btnSize = 100;

    // --- DRAW PURPLE CIRCLE BUTTON ---
    noStroke();
    if (isLocked) {
      fill(80, 40, 120, 200); // Darker/muted purple
    } else {
      // Check for hover
      if (dist(mouseX, mouseY, x, y) < btnSize / 2) {
        fill(180, 100, 255); // Brighter on hover
        cursor(HAND);
      } else {
        fill(130, 70, 210); // Standard purple
      }
    }

    ellipse(x, y, btnSize, btnSize);

    // --- ADD GLOSS EFFECT (White arc at top) ---
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

  // Draw Labels
  textAlign(LEFT);
  textSize(16);
  fill(200);
  text("SCORE:", 25, 35);
  text("BEST:", 25, 65);

  // Draw Numbers
  textAlign(RIGHT);
  textSize(22);
  fill(255, 255, 0); // Gold color for score
  text(score, 175, 35);
  fill(255);
  text(highScore, 175, 65);
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
