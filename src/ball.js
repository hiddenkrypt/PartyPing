const collisions = require("./collisions.js");
module.exports = function(){
  this.x = 300;
  this.y = 300;
  this.dx = Math.random()*10;
  this.dy = Math.random()*10;
  this.tick = function(){
    this.x += this.dx;
    this.y += this.dy;
    if(this.x-this.radius/2 <= 0 || this.x+this.radius/2 >= 600){
      this.x -= this.dx;
      this.dx = -this.dx;
    }
  };
  this.radius = 5;
  this.collideBox = function(box){
    return collisions.circle_AABB(this, box);
  };

};
