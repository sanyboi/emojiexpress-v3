class Shooter {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angle = 0;
    
    // FIX: Make sure these names match everywhere!
    this.currentEmojiType = random(emojiTypes); 
    this.nextEmojiType = random(emojiTypes);

    this.w = 60; // Bigger Phone Width
    this.h = 100; // Bigger Phone Height
  }

  update() {
    this.angle = atan2(mouseY - this.y, mouseX - this.x);
  }

  fire() {
    // 1. Point of origin (spawn from the top edge of the phone)
    let spawnX = this.x + cos(this.angle) * 50;
    let spawnY = this.y + sin(this.angle) * 50;

    // 2. Create projectile using the CORRECT variable: currentEmojiType
    let bullet = new Projectile(spawnX, spawnY, this.angle, this.currentEmojiType);
    
    // 3. Cycle: Current becomes Next, Next gets a new random
    this.currentEmojiType = this.nextEmojiType;
    this.nextEmojiType = random(emojiTypes);
    
    return bullet;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle + HALF_PI); 

    // 1. Phone Body
    fill(20); 
    stroke(180);
    strokeWeight(3);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 10); 

    // 2. Screen
    fill(40, 60, 120);
    noStroke();
    rect(0, 0, this.w - 10, this.h - 12, 5);

    // 3. Current Emoji (Ready to Fire)
    // textAlign(CENTER, CENTER) is crucial for alignment!
    textAlign(CENTER, CENTER);
    textSize(35);
    // FIX: Use currentEmojiType here
    text(this.currentEmojiType, 0, -20); 

    // 4. Next Emoji Preview
    fill(255, 200);
    textSize(10);
    text("NEXT:", 0, 15);
    textSize(22);
    text(this.nextEmojiType, 0, 35);

    pop();
  }
}


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