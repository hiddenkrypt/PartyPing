var canvas;
var ctx;

window.onload = function(){
  canvas = document.getElementById("c");
  ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;
  ctx.fillStyle="#000";
  ctx.fillRect(0,0,canvas.width, canvas.height);
};
