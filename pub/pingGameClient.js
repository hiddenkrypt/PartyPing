

window.onload = function(){
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const namefield =  document.getElementById("namefield");
  const joinButton =  document.getElementById("join");
  const error =  document.getElementById("error");
  const north = document.getElementById("north");
  const south = document.getElementById("south");
  const socket = io();
  var gameState = {
    balls:[],
    north:{
      paddles:[], score:0
    },
    south: {
      paddles:[], score:0
    }
  };
  var myName = "";
  var myTeam = "";
  canvas.width = 600;
  canvas.height = 600;

  socket.on("gamestate", (gm)=>{
    gameState = gm;
    while (north.firstChild) {
      north.removeChild(north.firstChild);
    }
    while (south.firstChild) {
      south.removeChild(south.firstChild);
    }
    north.innerHTML = `NORTH: ${gm.north.score}<br>PLAYERS:<hr>`;
    south.innerHTML = `SOUTH: ${gm.south.score}<br>PLAYERS:<hr>`;
    gm.north.paddles.forEach(paddle=>{
      var name = document.createElement("div");
      name.innerHTML = paddle.name;
      north.appendChild(name);
    });
    gm.south.paddles.forEach(paddle=>{
      var name = document.createElement("div");
      name.innerHTML = paddle.name;
      south.appendChild(name);
    });

  });
  socket.on("accepted", (response)=>{
    myTeam = response.team;
    myName = response.name;
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
    ctx.fillStyle = "#666";
    ctx.fillRect(0,25,canvas.width,1);
    ctx.fillRect(0,85,canvas.width,1);
    ctx.fillRect(0,125,canvas.width,1);
    ctx.fillRect(0,canvas.height-15,canvas.width,1);
    ctx.fillRect(0,canvas.height-75,canvas.width,1);
    ctx.fillRect(0,canvas.height-115,canvas.width,1);

    function drawPaddle(paddle){
      if(paddle.team === "north"){
          ctx.fillStyle = "#66ff66";
      }
      else{
        ctx.fillStyle = "#ff66ff";
      }
      ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);
      if(paddle.name === myName){
        ctx.fillStyle = "#fff";
        ctx.fillRect(paddle.x+4,paddle.y+4,paddle.w-8,paddle.h-8);
      }
    }
    gameState.north.paddles.forEach(drawPaddle);
    gameState.south.paddles.forEach(drawPaddle);
    ctx.fillStyle = "#fff";
    gameState.balls.forEach((ball)=>{
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.size,0,2*Math.PI);
      ctx.fill();
    });
    requestAnimationFrame(render);
  }

  render();
};
