
const Ball = require("./src/ball.js");
const Player = require("./src/player.js");
const GAME_SETTINGS = require("./src/gameSettings.js");
const teams = require("./src/teams.js")(GAME_SETTINGS);

module.exports = function(){
  return {
    attemptJoin: attemptJoin
  };
};

function attemptJoin(socket, name){
  console.log("new player attempting to Join");
  var players = teams.north.players.concat(teams.south.players);
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

function addNewPlayer(socket, name){
  var newPlayer = new Player(socket,name,teams,GAME_SETTINGS);
  socket.on( "disconnect", function() {
    console.log( `Client ${newPlayer.name} disconnected` );
    newPlayer.socket = null;
    teams[newPlayer.team].players = teams[newPlayer.team].players.filter((player)=> player.name !== newPlayer.name);
  });
  teams[newPlayer.team].players.push(newPlayer);
  teams[newPlayer.team].players.forEach(player=>{
    player.w = GAME_SETTINGS.paddleCapacity/teams[newPlayer.team].players.length;
  });
  if(players.count() === 1){
    gameLogic();
  }
  socket.on("sustain", function(key){
    switch(key){
      case "ArrowRight": case "d":
        newPlayer.dx = 4;
        break;
      case "ArrowLeft": case "a":
        newPlayer.dx = -4;
        break;
      case "ArrowUp": case "w":
        newPlayer.dy = 1;
        break;
      case "ArrowDown": case "s":
        newPlayer.dy = -1;
        break;
    }
  });
  socket.on("release", function(key){
    switch(key){
      case "ArrowRight": case "d":
      case "ArrowLeft": case "a":
        newPlayer.dx = 0;
        break;
      case "ArrowUp": case "w":
      case "ArrowDown": case "s":
        newPlayer.dy = 0;
        break;
    }
  });
  socket.emit("accepted", {team: newPlayer.team});
}

var players = {
  tick: function(){
    teams.north.players.concat(teams.south.players).forEach((p)=>p.tick());
  },
  update: function(){
    var gameState = {
      balls: balls.ballPile.map(ball=>{
        return {x:ball.x, y:ball.y, size: ball.radius};
      }),
      paddles: teams.north.players.concat(teams.south.players).map(player=>{
        return {x:player.x, y:player.y, w:player.w, h:player.h, name:player.name};
      }),
      scores: {
        north: teams.south.concessions,
        south: teams.north.concessions
      }
    };
    teams.north.players.concat(teams.south.players).forEach((p)=>{
      p.socket.emit("gamestate", gameState);
    });
  },
  count: function(){
    return teams.north.players.length + teams.south.players.length;
  },
  forEach: function(fn){
    teams.north.players.concat(teams.south.players).forEach(fn);
  }
};

var balls = {
  ballPile: [],
  count: function(){
    return this.ballPile.length;
  },
  tick: function(){
    this.ballPile.forEach((ball,i)=>{
      ball.tick();
      players.forEach((player)=>{
        ball.checkAgainstPaddle(player);
      });
      if(ball.outOfBounds()){
        if(ball.y < 0){
          teams.north.concessions++;
        } else{
          teams.south.concessions++;
        }
        balls.ballPile.splice(i,1);
      }
    });

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
