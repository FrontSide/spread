var spread_canvas = document.getElementById("spread_canvas");
spread_canvas.width = window.innerWidth;
spread_canvas.height = window.innerHeight;

var spread_canvas_ctx = spread_canvas.getContext("2d");

function randomX() {
  return Math.floor(Math.random() * spread_canvas.width);
}

function randomY() {
  return Math.floor(Math.random() * spread_canvas.height);
}

function randomDirection() {
  return Math.random() * 2*Math.PI;
}

humans = []

totalInfectedHistory = []
totalUnaffectedHistory = []

for (var i=0; i<100; i++) {

  human = {
    positionX: randomX(),
    positionY: randomY(),
    direction: randomDirection(),
    infectionCountDown: -1,
  }

  humans.push(human)

}

humans[0].infectionCountDown = 1000;

function drawHumans() {

  for (var i=0; i<humans.length; i++) {
    //console.log(humans[i])
    spread_canvas_ctx.beginPath();
    spread_canvas_ctx.arc(humans[i].positionX, humans[i].positionY, 10, 0, 2*Math.PI);

    if (humans[i].infectionCountDown > 0) {
      spread_canvas_ctx.fillStyle = "#FF5555";
    } else if (humans[i].infectionCountDown < 0) {
      spread_canvas_ctx.fillStyle = "#222222";
    } else { // if not and never infected
      spread_canvas_ctx.fillStyle = "#5555FF";
    }
    spread_canvas_ctx.fill();
  }

}

function drawStats() {

  spread_canvas_ctx.fillStyle = "#000000";
  spread_canvas_ctx.fillRect(20, 20, 1000, 120);

  for (var i=0; i<totalInfectedHistory.length; i++) {

    spread_canvas_ctx.beginPath();
    spread_canvas_ctx.arc(300+i*0.2, 130-totalInfectedHistory[i], 0.8, 0, 2*Math.PI);
    spread_canvas_ctx.fillStyle = "#FF5555"
    spread_canvas_ctx.fill();

    spread_canvas_ctx.beginPath();
    spread_canvas_ctx.arc(300+i*0.2, 130 - (humans.length - totalUnaffectedHistory[i] - totalInfectedHistory[i]), 0.8, 0, 2*Math.PI);
    spread_canvas_ctx.fillStyle = "#5555FF"
    spread_canvas_ctx.fill();

  }

  currentlyInfected =  totalInfectedHistory[totalInfectedHistory.length - 1]
  currentlyUnaffected =  totalUnaffectedHistory[totalUnaffectedHistory.length - 1]

  spread_canvas_ctx.font = "30px Arial";
  spread_canvas_ctx.fillStyle = "#FFFFFF";
  spread_canvas_ctx.fillText("Infected: " + currentlyInfected, 30, 60);
  spread_canvas_ctx.fillText("Unaffected: " + currentlyUnaffected , 30, 90);
  spread_canvas_ctx.fillText("Recovered: " + (humans.length - currentlyInfected - currentlyUnaffected), 30, 120);

}

function getInfection(humanIdx) {

  for (var i=0; i<humans.length; i++) {

    if (i == humanIdx) {
      continue;
    }

    //Pythagorean theorem: distance = sqrt( deltaX^2 + delataY^2 )
    distance = Math.sqrt(Math.pow(humans[i].positionX - humans[humanIdx].positionX, 2) +  Math.pow(humans[i].positionY - humans[humanIdx].positionY, 2))

    //console.log(distance)

    //An infection occurs if humans are closer than 50
    if (distance < 50) {
      if (humans[i].infectionCountDown > 0) {
        humans[humanIdx].infectionCountDown = 1000
        break
      }
    }

  }

}

function moveHumans() {

  totalInfected = 0;
  totalUnaffected = 0;

  for (var i=0; i<humans.length; i++) {

    //This is just to not allow the dots to leave the js canvas
    if (humans[i].positionX >= spread_canvas.width) {
      humans[i].direction = Math.random() * Math.PI + 90;
    }

    if (humans[i].positionX <= 0) {
      humans[i].direction = Math.random() * Math.PI + 270;
    }

    if (humans[i].positionY >= spread_canvas.height) {
      humans[i].direction = Math.random() * Math.PI;
    }

    if (humans[i].positionY <= 0) {
      humans[i].direction = Math.random() * Math.PI + 180;
    }

    //Convert direction into X and Y position changes
    humans[i].positionX += Math.sin(humans[i].direction)
    humans[i].positionY += Math.cos(humans[i].direction)

    if (humans[i].infectionCountDown > 0) {
      totalInfected += 1
      humans[i].infectionCountDown -= 1;
      //console.log(humans[i].infectionCountDown)
    } else if (humans[i].infectionCountDown < 0) {
      totalUnaffected += 1
      getInfection(i);
    }

  }

  if (totalInfectedHistory.length == 10000) {
    totalInfectedHistory.shift()
    totalUnaffectedHistory.shift()
  }

  totalInfectedHistory.push(totalInfected)
  totalUnaffectedHistory.push(totalUnaffected)
  drawStats()

}

function run() {

  if (totalInfectedHistory[totalInfectedHistory.length - 1] == 0) {
    return
  }

  spread_canvas_ctx.clearRect(0, 0, spread_canvas.width, spread_canvas.height);
  drawHumans()
  moveHumans()
  setTimeout(run, 20);
}

run()
