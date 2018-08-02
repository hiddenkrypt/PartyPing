module.exports = function(socket,name,TEAMS,PARAMETERS){
  this.name = name;
  this.socket = socket;
  if(TEAMS.north.players.size === TEAMS.south.players.size){
    this.team = Math.random() < 0.5? "north": "south";
  } else if(TEAMS.north.players.size > TEAMS.south.players.size){
    this.team = "south";
  } else {
    this.team = "north";
  }

  console.log(`player ${this.name} assigned to team: ${this.team}`);
  this.move = null;

  this.w = 0;
  this.h = 15;
  this.x = PARAMETERS.width/2 - this.w/2;
  this.y = TEAMS[this.team].layer[0];

  this.tick = function(){};
};
