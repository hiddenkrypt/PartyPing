

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
    joinButton.removeEventListener("mousedown", clickToJoin);
    window.addEventListener("keydown", handleKeyInput);
    window.addEventListener("keyup", handleKeyInputRelease);
  });
  socket.on("rejected", (response)=>{
    error.innerHTML = response.reason;
  });

  joinButton.addEventListener("mousedown", clickToJoin);

  function clickToJoin(){
    socket.emit("attemptJoin", namefield.value);
  }
  function handleKeyInput(event){
    if(event.key === "ArrowRight" || event.key === "ArrowLeft" ||
      event.key === "ArrowUp" || event.key === "ArrowDown" ||
      event.key === "d" || event.key === "a" ||
      event.key === "w" || event.key === "s" ){
      socket.emit("sustain", event.key);
    }
  }
  function handleKeyInputRelease(event){
    if(event.key === "ArrowRight" || event.key === "ArrowLeft" ||
      event.key === "ArrowUp" || event.key === "ArrowDown" ||
      event.key === "d" || event.key === "a" ||
      event.key === "w" || event.key === "s" ){
      socket.emit("release", event.key);
    }
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
