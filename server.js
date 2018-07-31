//node server start

const EXPRESS = require( 'express' );
const APP = EXPRESS();
const HTTP = require ( 'http' ).Server( APP );
const IO = require( 'socket.io' )( HTTP, { origins: '*:*'} );
const SERVER = require('http-shutdown')(HTTP);
const GAME = require( "./partyping.js" )();
APP.use( EXPRESS.static( "pub" ) );


SERVER.listen( 8082, function() {
  console.log( "Server is listening on port 8082." );
});

IO.on ("connect", function( socket ) {
  console.log( "Client connected");
  socket.on("attemptJoin", function(name){
    GAME.attemptJoin(socket, name);
  });
});

setTimeout(()=>{
  SERVER.shutdown(()=>{
    console.log("All cleaned up");
  });
}, 60000);
