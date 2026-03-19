// src/ui.js

function drawMainMenu() {
  push(); // Start isolated style
  
  // Reset styles for UI
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke(); // This removes the thick grey path outline from your text!
  
  // Title
  fill(255);
  textSize(60);
  text("EMOJI EXPRESS", width / 2, height / 3);
  
  // Start Button
  let btnW = 240;
  let btnH = 70;
  
  // Hover effect: Change color if mouse is over button
  if (abs(mouseX - width/2) < btnW/2 && abs(mouseY - height/2) < btnH/2) {
    fill(0, 150, 255);
  } else {
    fill(0, 200, 255);
  }
  
  rect(width / 2, height / 2, btnW, btnH, 15);
  
  fill(255);
  textSize(30);
  text("START GAME", width / 2, height / 2);
  
  pop(); // End isolated style
}

function drawLevelSelect() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();

  fill(255);
  textSize(40);
  text("CHOOSE A LEVEL", width / 2, 100);

  for (let i = 0; i < levels.length; i++) {
    let x = width / 2;
    let y = 200 + (i * 80);
    let isLocked = levels[i].id > highestLevelUnlocked;

    // Button background
    fill(isLocked ? 60 : 50, 50, 150);
    rect(x, y, 300, 60, 5);
    
    // Level Text
    fill(255);
    textSize(25);
    let lockIcon = isLocked ? " 🔒" : "";
    text("Level " + levels[i].id + lockIcon, x, y);
  }
  pop();
}

function drawGameOver() {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  
  // Dark semi-transparent overlay
  fill(0, 0, 0, 200);
  rect(width/2, height/2, width, height);
  
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