//node server start

const EXPRESS = require( 'express' );
const APP = EXPRESS();
const HTTP = require ( 'http' ).Server( APP );
const IO = require( 'socket.io' )( HTTP, { origins: '*:*'} );

const GAME = require( "./partyping.js" )();
APP.use( EXPRESS.static( "pub" ) );

HTTP.listen( 8082, function() {
  console.log( "Server is listening on port 80." );
});

IO.on ("connect", function( socket ) {
  console.log( "Client connected");
  socket.on("attemptJoin", function(name){
    GAME.attemptJoin(socket, name);
  });
});
