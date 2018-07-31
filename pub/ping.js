

window.onload = function(){
  var canvas;
  var ctx;
  var gameState = {
    balls:[],
    paddles:[]
  };
  canvas = document.getElementById("c");
  ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;

  try{
    const socket = io();
    socket.on("gamestate", (gm)=>{
      gameState = gm;
    });
  }
  catch(e){
    console.log("something happened");
    console.log(e);
  }
  render();
  function render(){
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    gameState.balls.forEach((ball)=>{
      ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
    });
    gameState.paddles.forEach((paddle)=>{
      ctx.fillStyle = paddle.style;
      ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
    });
    requestAnimationFrame(render);
  }
};
