// src/level.js
class GamePath {
  constructor() {
    this.points = [];
    this.totalLength = 0;
    this.distances = [0];
  }

  setupPath(levelId) {
    this.points = [];
    this.distances = [0];
    this.totalLength = 0;

    if (levelId === 1) {
      this.generateSpiral();
    } else {
      this.loadCustomPath(levelId);
    }
  }

  generateSpiral() {
    let centerX = width / 2;
    let centerY = height / 2;
    let revs = 3; 
    let maxRadius = min(width, height) * 0.45;
    let segments = 500;

    for (let i = 0; i <= segments; i++) {
      let angle = map(i, 0, segments, 0, TWO_PI * revs);
      let radius = map(i, 0, segments, maxRadius, 50);
      let x = centerX + cos(angle) * radius;
      let y = centerY + sin(angle) * radius;
      this.addPoint(createVector(x, y));
    }
  }

  loadCustomPath(levelId) {
    let data = levelData[levelId] || levelData[2]; // Fallback to level 2
    for (let p of data) {
      // Scale decimal (0-1) to screen size
      this.addPoint(createVector(p.x * width, p.y * height));
    }
  }

  // Helper to keep math clean
  addPoint(p) {
    this.points.push(p);
    if (this.points.length > 1) {
      let prev = this.points[this.points.length - 2];
      let d = dist(prev.x, prev.y, p.x, p.y);
      this.totalLength += d;
      this.distances.push(this.totalLength);
    }
  }

  getPosAtDist(pixelD) {
    pixelD = constrain(pixelD, 0, this.totalLength);
    for (let i = 0; i < this.distances.length - 1; i++) {
      if (pixelD >= this.distances[i] && pixelD <= this.distances[i + 1]) {
        let segmentT = map(pixelD, this.distances[i], this.distances[i + 1], 0, 1);
        return p5.Vector.lerp(this.points[i], this.points[i + 1], segmentT);
      }
    }
    return this.points[this.points.length - 1];
  }

  display() {
    push();
    noFill();
    stroke(50);
    strokeWeight(40);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    beginShape();
    for (let p of this.points) vertex(p.x, p.y);
    endShape();
    pop();
  }
}