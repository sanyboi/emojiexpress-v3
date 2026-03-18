// src/shooter.js
class Shooter {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angle = 0;
    this.currentEmoji = random(emojiTypes);
  }

  update() {
    this.angle = atan2(mouseY - this.y, mouseX - this.x);
  }

  fire() {
    // Create a projectile starting at shooter's pos, moving in shooter's angle
    let bullet = new Projectile(this.x, this.y, this.angle, this.currentEmoji);
    // Reload with a new random emoji
    this.currentEmoji = random(emojiTypes);
    return bullet;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("🏹", 0, 0); 
    text(this.currentEmoji, 50, 0); 
    pop();
  }
}

// New class for the flying emoji
class Projectile {
  constructor(x, y, angle, type) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.type = type;
    this.speed = 10;
    this.radius = 20;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }

  display() {
    textSize(40);
    text(this.type, this.x, this.y);
  }
}