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
      translate(this.x, this.y);
      textSize(this.size);
      textAlign(CENTER, CENTER);
      text(this.type, 0, 0);
      pop();
    }
  }
}