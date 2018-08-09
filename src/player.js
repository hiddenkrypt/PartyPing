module.exports = function(socket,name,teams,gameSettings){
  this.name = name;
  this.socket = socket;
  if(teams.north.players.length === teams.south.players.length){
    this.team = Math.random() < 0.5? "north": "south";
  } else if(teams.north.players.length > teams.south.players.length){
    this.team = "south";
  } else {
    this.team = "north";
  }
  console.log(`new player ${this.name} assigned to team: ${this.team}`);
  this.layer = teams[this.team].startLayer;
  this.w = 0;
  this.h = 15;
  this.x = gameSettings.gamefield.width/2 - this.w/2;
  this.y = teams[this.team].layers[this.layer];
  this.dx = 0;
  this.dy = 0;

  this.tick = function(){
    this.x += this.dx;
    if(this.x+this.w >= gameSettings.gamefield.width || this.x <= 0){
      this.x -= this.dx;
    }
    if(this.dy > 0 && this.y != teams[this.team].layers[0] && this.layer != 0){
      this.layer -= 1;
      this.y = teams[this.team].layers[this.layer];
      this.dy = 0;
    }
    if(this.dy < 0 && this.y != teams[this.team].layers[2] && this.layer != 2){
      this.layer += 1;
      this.y = teams[this.team].layers[this.layer];
      this.dy = 0;
    }
  };
};
