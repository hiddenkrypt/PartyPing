
const Ball = require("./src/ball.js");
const Player = require("./src/player.js");
const PARAMETERS = {
  gamefield:{
    width: 600,
    height:600,
    paddleCapacity: 150
  },
  playerMax:Number.POSITIVE_INFINITY,
  hz: 60
};
const TEAMS = {
  north: {
    layers:[20, 80, 120],
    concessions:0,
    players: []
  },
  south: {
    layers:[PARAMETERS.height-20, PARAMETERS.height-80, PARAMETERS.height-120],
    concessions:0,
    players: []
  }
};
module.exports = function(){

  function attemptJoin(socket, name){
    console.log("new player attempting to Join");
    var players = TEAMS.north.players.concat(TEAMS.south.players);
    if(players.find((player)=>{
      return player.name === name;
    })){
      console.log("rejecting: name taken");
      socket.emit("rejected", {reason: "Another player is using that name!"});
    }
    else if(players.size >= PARAMETERS.playerMax){
      console.log("rejecting: server full");
      socket.emit("rejected", {reason: "Server is full!"});
    } else{
      console.log("player accepted!");
      addNewPlayer(socket, name);
    }
  }

  return {
    attemptJoin: attemptJoin
  };
};


function addNewPlayer(socket, name){
  var newPlayer = new Player(socket,name,TEAMS,PARAMETERS);
  socket.on( "disconnect", function() {
    console.log( `Client ${newPlayer.name} disconnected` );
    newPlayer.socket = null;
    TEAMS[newPlayer.team].players = TEAMS[newPlayer.team].players.filter((player)=> player.name !== newPlayer.name);
  });
  TEAMS[newPlayer.team].players.push(newPlayer);
}

var players = {
  tick: function(){
    TEAMS.north.players.concat(TEAMS.south.players).sort(Math.random()>0.5).forEach((p)=>p.tick());
  },
  update: function(){
    TEAMS.north.players.concat(TEAMS.south.players).sort(Math.random()>0.5).forEach((p)=>p.update());
  },
  count: function(){
    return TEAMS.north.players.length + TEAMS.south.players.length;
  }
};
var balls = {
  ballPile: [],
  count: function(){
    return this.ballPile.length;
  },
  tick: function(){
    this.ballPile.forEach(ball=>ball.tick());
  }
};
function gameLogic(){
  balls.tick();
  players.tick();
  players.update();

  if(players.length >= 1){
    setTimeout(gameLogic, 1000/PARAMETERS.hz);
  }
}
gameLogic();
