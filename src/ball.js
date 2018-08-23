const collisions = require("./collisions.js");

function randomDelta(){
  var roll = (Math.random()-0.5)*10;
  if(Math.abs(roll)<2){
    roll = 2*(roll<0?-1:1);
  }
  return roll;
}

module.exports = Ball;
function Ball(){
  this.x = 300;
  this.y = 300;
  this.dx = randomDelta();
  this.dy = randomDelta();
  this.radius = 5;
}

Ball.prototype.tick = function(){
  this.x += this.dx;
  this.y += this.dy;
  if(this.x-this.radius <= 0 || this.x+this.radius >= 600){
    this.dx = -this.dx;
  }
};

Ball.prototype.checkAgainstPaddle = function(player){
  if(collisions.circle_AABB(this, player)){
    this.dy = -this.dy;
    this.dx = this.dx * 1.01;
    this.dy = this.dy * 1.01;
    this.tick();
  }
};

Ball.prototype.outOfBounds = function(){
  return this.y < 0 || this.y > 600;
};
