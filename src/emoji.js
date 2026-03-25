// src/emoji.js
class Emoji {
  constructor(type, pixelDist, path) {
    this.type = type;
    this.pixelDist = pixelDist;
    this.path = path;
    this.x = 0;
    this.y = 0;
    this.size = 40;
  }

  updatePosition() {
    // This calls the fixed pixel-based method in level.js
    let pos = this.path.getPosAtDist(this.pixelDist);
    this.x = pos.x;
    this.y = pos.y;
  }

  display() {
    if (this.pixelDist > 0) {
      push();

      // --- THE COLOR FIXES ---
      drawingContext.globalAlpha = 1.0;  // 1. Forces 100% opacity (Removes transparency)
      drawingContext.shadowBlur = 0;     // 2. Turns off any leftover neon glow
      fill(255);                         // 3. Resets fill to solid white (standard for Emojis)

      translate(this.x, this.y);
      textSize(this.size);
      textAlign(CENTER, CENTER);

      // Draw the emoji
      text(this.type, 0, 0);

      pop();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = random(-5, 5); // Random horizontal burst
    this.vy = random(-5, 5); // Random vertical burst
    this.alpha = 255;
    this.size = random(8, 15);
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 10; // Fades out
    this.size *= 0.95; // Gets smaller
  }

  display() {
    push();
    drawingContext.shadowBlur = 0; // Prevent pale effect
    noStroke();
    // Match the particle color to the emoji color
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.size);
    pop();
  }
}