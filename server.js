//node server start

const express = require( 'express' );
const app = express();
const http = require ( 'http' ).Server( app );
const io = require( 'socket.io' )( http, { origins: '*:*'} );

var players = [];
const game = require( "partyping.js" )(players);
app.use( express.static( "pub" ) );

http.listen( 80, function() {
  console.log( "Server is listening on port 80." );
});

io.on ("connect", function( socket ) {
  console.log( "Client connected");
  socket.on("attemptJoin", function(name){
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
  });
});

function addNewPlayer(socket, name){
  var newPlayer = {};
  newPlayer.name = name;
  newPlayer.socket = socket;
  players.push(newPlayer);
  socket.on( "disconnect", function() {
    console.log( "Client disconnected" );
    newPlayer.socket = null;
    players = players.filter((player)=> player.name !== newPlayer.name);
  });
}
