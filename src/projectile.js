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