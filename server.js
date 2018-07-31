//node server start

const express = require( 'express' );
const app = express();
const http = require ( 'http' ).Server( app );
const io = require( 'socket.io' )( http, { origins: '*:*'} );

io.on ("connect", function( socket ) {
  console.log( "Client connected");
  socket.on( "disconnect", function() {
    console.log( "Client disconnected" );
  });
});


app.use( express.static( "pub" ) );

http.listen( 80, function() {
  console.log( "Server is listening on port 80." );
});
