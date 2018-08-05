//node server start
const PORT = 8082;
const EXPRESS = require( 'express' );
const APP = EXPRESS();
const HTTP = require ( 'http' ).Server( APP );
const IO = require( 'socket.io' )( HTTP, { origins: '*:*'} );
const SERVER = require('http-shutdown')(HTTP);
const GAME = require( "./pingGameServer.js" )();
APP.use( EXPRESS.static( "pub" ) );


SERVER.listen( PORT, function() {
  console.log( `Server is listening on port ${PORT}.` );
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
    process.exit();
  });
}, 2*60*1000);

console.log("server running. Press 'q' then enter to quit.");
var keypress = require('keypress');
keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
  if (key && key.name == 'q') {
    console.log("quit detected!");
      SERVER.shutdown(()=>{
        console.log("All cleaned up");
        process.exit();
      });
  }
});


process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    SERVER.shutdown(()=>{
      console.log("Cleaned up server after SIGINT");
      process.exit();
    });
});
