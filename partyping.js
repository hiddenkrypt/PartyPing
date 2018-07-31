const PLAYER_MAX = Number.POSITIVE_INFINITY;
const TEAMS = {
  north: {
    concessions:0,
    players: []
  },
  south: {
    concessions:0,
    players: []
  }
};
const PARAMETERS = {
  gamefield:{
    width: 600,
    height:600
  }
};
module.exports = function(players){

  function attemptJoin(socket, name){
    var players = TEAMS.north.players.concat(TEAMS.south.players);
    if(!players.filter((player)=>{
      return player.name === name;
    })){
      socket.emit("rejected", {reason: "Another player is using that name!"});
    }
    else if(players.size === PLAYER_MAX){
      socket.emit("rejected", {reason: "Server is full!"});
    } else{
      addNewPlayer(socket, name);
    }
  }

  function addNewPlayer(socket, name){
    var newPlayer = {};
    newPlayer.name = name;
    newPlayer.socket = socket;
    if(TEAMS.north.players.size === TEAMS.south.players.size){
      newPlayer.team = Math.random() < 0.5? "north": "south";
    } else if(TEAMS.north.players.size > TEAMS.south.players.size){
      newPlayer.team = "south";
    } else {
      newPlayer.team = "north";
    }
    newPlayer.move = null;
    newPlayer.width = 0;

    newPlayer.x = PARAMETERS.width/2 - player.width/2;
    socket.on( "disconnect", function() {
      console.log( `Client ${newPlayer.name} disconnected` );
      newPlayer.socket = null;
      TEAMS[newPlayer.team].players = TEAMS[newPlayer.team].filter((player)=> player.name !== newPlayer.name);
    });
    TEAMS[newPlayer.team].players.push(newPlayer);
  }


  return {
    attemptJoin: attemptJoin
  };
};
