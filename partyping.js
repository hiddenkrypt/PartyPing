
const Ball = require("./src/ball.js");
const Player = require("./src/player.js");
const GAME_SETTINGS = {
  gamefield:{
    width: 600,
    height:600
  },
  playerMax:Number.POSITIVE_INFINITY,
  hz: 3,
  paddleCapacity: 150
};
const TEAMS = {
  north: {
    layers:[20, 80, 120],
    concessions:0,
    players: [],
    startLayer: 0
  },
  south: {
    layers:[GAME_SETTINGS.gamefield.height-120, GAME_SETTINGS.gamefield.height-80,GAME_SETTINGS.gamefield.height-20],
    concessions:0,
    players: [],
    startLayer: 2
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
    else if(players.size >= GAME_SETTINGS.playerMax){
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
  var newPlayer = new Player(socket,name,TEAMS,GAME_SETTINGS);
  socket.on( "disconnect", function() {
    console.log( `Client ${newPlayer.name} disconnected` );
    newPlayer.socket = null;
    TEAMS[newPlayer.team].players = TEAMS[newPlayer.team].players.filter((player)=> player.name !== newPlayer.name);
  });
  TEAMS[newPlayer.team].players.push(newPlayer);
  TEAMS[newPlayer.team].players.forEach(player=>{
    player.w = GAME_SETTINGS.paddleCapacity/TEAMS[newPlayer.team].players.length;
  });
  if(players.count() === 1){
    gameLogic();
  }
}

var players = {
  tick: function(){
    TEAMS.north.players.concat(TEAMS.south.players).forEach((p)=>p.tick());
  },
  update: function(){
    var gameState = {
      balls: balls.ballPile.map(ball=>{
        return {x:ball.x, y:ball.y, size: ball.radius};
      }),
      paddles: TEAMS.north.players.concat(TEAMS.south.players).map(player=>{
      //  console.log(player);
        return {x:player.x, y:player.y,w:player.w, h:player.h, name:player.name};
      })
    };
    TEAMS.north.players.concat(TEAMS.south.players).forEach((p)=>{
      p.socket.emit("gamestate", gameState);
    });
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
    while(this.ballPile.length < players.count() / 2){
      this.ballPile.push(new Ball());
    }
  }
};
function gameLogic(){
  balls.tick();
  players.tick();
  players.update();
  if(players.count() >= 1){
    setTimeout(gameLogic, 1000/GAME_SETTINGS.hz);
  } else {

    balls.ballPile = [];
  }
}
