

window.onload = function(){
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const namefield =  document.getElementById("namefield");
  const joinButton =  document.getElementById("join");
  const error =  document.getElementById("error");
  const socket = io();
  var gameState = {
    balls:[],
    paddles:[]
  };
  canvas.width = 600;
  canvas.height = 600;

  socket.on("gamestate", (gm)=>{
    gameState = gm;
  });
  socket.on("accepted", (response)=>{
    console.log("accepted to team: "+response.team);
    overlay.style.display = "none";
    joinButton.removeEventListener(clickToJoin);
    window.addEventListener("keydown", handleKeyInput);
  });
  socket.on("rejected", (response)=>{
    error.innerHTML = response.reason;
  });

  joinButton.addEventListener("mousedown", clickToJoin);

  function clickToJoin(){
    socket.emit("attemptJoin", namefield.value);
  }
  function handleKeyInput(event){
    socket.emit("move", event.key);
  }
  function render(){
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    gameState.balls.forEach((ball)=>{
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.size,0,2*Math.PI);
      ctx.fill();
    });
    gameState.paddles.forEach((paddle)=>{
      ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);
    });
    requestAnimationFrame(render);
  }

  render();
};
