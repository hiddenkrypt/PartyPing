

window.onload = function(){
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  const namefield =  document.getElementById("namefield");
  const joinButton =  document.getElementById("join");
  const error =  document.getElementById("error");
  var gameState = {
    balls:[],
    paddles:[]
  };
  canvas.width = 600;
  canvas.height = 600;

  try{
    const socket = io();
    socket.on("gamestate", (gm)=>{
      gameState = gm;
    });
    joinButton.addEventListener("mousedown", ()=>{
      console.log("joining with name: "+namefield.value);
      socket.emit("attemptJoin", namefield.value);
      socket.on("rejected", (response)=>{
        console.log("REJECTED");
        console.log(response);
        error.innerHTML = response.reason;
      });
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
