
window.onload = function(){
  var canvas;
  var ctx;
  var gameState = {};

  canvas = document.getElementById("c");
  ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;

  const socket = io();
  socket.on("gamestate", (gm)=>{gameState = gm;});

};
