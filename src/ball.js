const collisions = require("collisions.js");
module.exports = function(){
  this.x = 300;
  this.y = 300;
  this.dx = Math.random()*10;
  this.dy = Math.random()*10;
  this.tick = function(){
    this.x += this.dx;
    this.y += this.dy;
  };
  this.radius = 5;
  this.collideBox = function(box){
    return collisions.circle_AABB(this, box);
  };

};
