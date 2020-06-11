var moveCount = 0;
var lives = 3;
var playerStepSize = 20;
var keyUp = true;
var levelCount = 1;
var boost = 0;
var boostCount = 3;
var highScores = [0, 0, 0, 0, 0];
var speedIncrease = 0;
var bonusItem = "bonusHeart";
setPosition("rightBtn", -250, -250);
setPosition("leftBtn", -200, -200);
setPosition("upBtn", -250, -250);
setPosition("boostBtn", -250, -250);
if(randomNumber(1, 2) == 2){
  setText("tipLabel", "Tip: Click or tap for on screen buttons.");
}
// Starts the game
onEvent("startButton", "click", function() {
  setScreen("gameScreen");
  moveEnemy("cartEnemy", "truckEnemy", "motorcycleEnemy");
});
// Controls for keyboard play
onEvent("gameScreen", "keydown", function(event) {
  if (keyUp){
  keyUp = false;
  playerMovement(event.key);
  }
});

// Controls for mouse or touch screen play
onEvent("gameScreen", "click", function( ) {
setPosition("upBtn", 198, 378);
setPosition("rightBtn", 260, 415);
setPosition("leftBtn", 198, 415);
setPosition("boostBtn", 0, 415);
});
onEvent("upBtn", "click", function() {
  playerMovement("Up");
  keyUp = true;
});
onEvent("leftBtn", "click", function() {
  playerMovement("Left");
  keyUp = true;
});
onEvent("rightBtn", "click", function() {
  playerMovement("Right");
  keyUp = true;
});
onEvent("boostBtn", "click", function() {
  playerMovement("Shift");
  keyUp = true;
});

// Moves player in the appropriate direction
function playerMovement(key){
  var xPlayer = getXPosition("player");
  var yPlayer = getYPosition("player");
  if (key == "Up") {
    setPosition("player", xPlayer, (yPlayer - playerStepSize) - boost);
    if (obstacleCollision()) {
      setPosition("player", xPlayer, yPlayer + playerStepSize + boost);
      } else {
        setText("scoreNumLabel", moveCount);
        moveCount++;
      }
    if (yPlayer < 0) {
        setProperty("player", "y", 410);
        stopTimedLoop();
        levelCount++;
        boost = 0;
        setText("levelLabel", levelCount);
        moveEnemy("cartEnemy", "truckEnemy", "motorcycleEnemy");
    
    }
  } else if (key == "Right") {
    setPosition("player", xPlayer + 25, yPlayer);
    if (xPlayer > 290) {
      setProperty("player", "x", 0);
    }
  } else if (key == "Left") {
    setPosition("player", xPlayer - 25, yPlayer);
    if (xPlayer < -10) {
      setProperty("player", "x", 280);
    }
  } else if (key == "Down") {
    setText("scoreNumLabel", moveCount);
    setPosition("player", xPlayer, yPlayer + playerStepSize - boost);
    if (obstacleCollision()) {
      setPosition("player", xPlayer, yPlayer - playerStepSize - boost);
      moveCount++;
    }
    moveCount--;
    if (yPlayer > 430) {
      setProperty("player", "y", 410);
    }
  } else if (key == "Shift") {
    boost = 20;
    boostCount--;
    hideElement("boost" + (3 - boostCount));
    setPosition("obstacle1Image", -250, -250);
    setPosition("obstacle2Image", -200, -200);
    setPosition("obstacle3Image", -250, -250);
  }
  checkForBonus();
}

// Confirms player released key, cant hold key to move
onEvent("gameScreen", "keyup", function(event) {
  if (event.key == "Right" || "Up" || "Left" || "Down") {
    keyUp = true;
  }
});

// Checks if player is touching a bonus item
function checkForBonus() {
  if (checkCollision(bonusItem, 55, 35)) {
    setPosition(bonusItem, -400, -400);
    if (bonusItem == 'bonusHeart') {
      showElement('heart' + (3 - lives));
      lives++;
      bonusItem = 'bonusBoost';
    } else {
      boostCount++;
      showElement('boost' + boostCount);
      bonusItem = 'bonusHeart';
    }
  }
}
// Uses timed loop to move enemys forward every 10 miliseconds
function moveEnemy(id1, id2, id3) {
  var id1X = 1;
  var id2X = 230;
  var id3X = 1;
  var id1Y = randomNumber(270, 320);
  var id2Y = randomNumber(170, 220);
  var id3Y = randomNumber(10, 110);
  var colors = getColors();
  setProperty(id1, "icon-color", colors[0]);
  setProperty(id2, "icon-color", colors[1]);
  setProperty(id3, "icon-color", colors[2]);
  getObstacles(colors[3], colors[4], colors[5]);
  getBonusItems();
  setProperty("gameScreen", "background-color", colors[6]);
  speedIncrease = speedIncrease + levelCount * (randomNumber(0, 3) * 0.03);
  timedLoop(10, function() {
    id1X = id1X + 1 + speedIncrease;
    id2X = id2X - (1 + speedIncrease);
    id3X = (id3X + 1.1) + speedIncrease;
    setPosition(id1, id1X, id1Y);
    setPosition(id2, id2X, id2Y);
    setPosition("levelLabel", id2X + 47, id2Y + 15);
    setPosition(id3, id3X, id3Y);
    if (id1X > 330) {
      id1X = -90;
    }
    if (id2X < -180) {
      id2X = 300;
    }
    if (id3X > 330) {
      id3X = -90;
    }
    if (checkCollision(id1, 40, 35) || checkCollision(id2, 40, 40) || checkCollision(id3, 53, 35)) {
      enemyCollision();
    }
  });
}

// Randomizes the appearance of obstacles
function getObstacles(color1, color2, color3) {
  var obstacleNum = randomNumber(1, 3);
  setPosition("obstacle2Image", -250, -250);
  setPosition("obstacle1Image", -200, -200);
  setPosition("obstacle3Image", -250, -250);
  if (obstacleNum == 1) {
    setPosition("obstacle1Image", randomNumber(-10, 220), randomNumber(60, 340));
    setProperty("obstacle1Image", "icon-color", color1);
  } else if (obstacleNum == 2) {
    setProperty("obstacle1Image", "icon-color", color1);
    setProperty("obstacle2Image", "icon-color", color2);
    setPosition("obstacle1Image", randomNumber(-10, 220), randomNumber(60, 340));
    setPosition("obstacle2Image", randomNumber(-10, 220), randomNumber(60, 340));
  } else if (obstacleNum == 3) {
    setProperty("obstacle1Image", "icon-color", color1);
    setProperty("obstacle2Image", "icon-color", color2);
    setProperty("obstacle3Image", "icon-color", color3);
    setPosition("obstacle1Image", randomNumber(-10, 220), randomNumber(60, 340));
    setPosition("obstacle2Image", randomNumber(-10, 220), randomNumber(60, 340));
    setPosition("obstacle3Image", randomNumber(-10, 220), randomNumber(60, 340));
  }
}

// Randomizes the appearance of bonus items
function getBonusItems() {
  setPosition('bonusHeart', -400, -400);
  setPosition('bonusBoost', -400, -400);
  var bonusNum = randomNumber(1, 6);
  if (lives < 3 && bonusNum == 1) {
    setPosition('bonusHeart', randomNumber(20, 210), randomNumber(60, 360));
    bonusItem = "bonusHeart";
  } else if (boostCount < 3 && bonusNum == 4) {
    setPosition('bonusBoost', randomNumber(20, 210), randomNumber(60, 360));
    bonusItem = "bonusBoost";
  }
}

// Randomizes the item colors for items, each unique
function getColors() {
  var color1 = randomNumber(0, 255);
  var color2 = randomNumber(0, 255);
  var color3 = randomNumber(0, 255);
  var light = color1 < 60 && color2 < 60 && color3 < 60;
  var similar = Math.abs(color1 - color2) + Math.abs(color1 - color3) < 60;
  var pastel = color1 > 120 && color2 > 120 && color3 > 120;
  if (light || pastel || similar) {
    color1 = randomNumber(150, 255);
    color2 = randomNumber(50, 100);
    color3 = randomNumber(50, 100);
  }
  var colors = [];
  var id1Color = 'rgb(' + color1 + ' , ' + color2 + ',' + color3 + ')';
  var id2Color = 'rgb(' + color2 + ' , ' + color3 + ',' + color1 + ')';
  var id3Color = 'rgb(' + color3 + ' , ' + color1 + ',' + color2 + ')';
  var obstacle1Color = 'rgb(' + color2 + ' , ' + color1 + ',' + color3 + ')';
  var obstacle2Color = 'rgb(' + color1 + ' , ' + color3 + ',' + color2 + ')';
  var obstacle3Color = 'rgb(' + color1 + ' , ' + color3 + ',' + color3 + ')';
  var levelColor = 'rgba(' + color3 + ' , ' + color2 + ',' + color1 + ', 0.20 )';
  appendItem(colors, id1Color);
  appendItem(colors, id2Color);
  appendItem(colors, id3Color);
  appendItem(colors, obstacle1Color);
  appendItem(colors, obstacle2Color);
  appendItem(colors, obstacle3Color);
  appendItem(colors, levelColor);
  return colors;
}

// Checks if items are touching the player
function checkCollision(enemy, xArea, yArea) {
  if (yArea > Math.abs(getImageYCenter("player") - getImageYCenter(enemy))) {
    if (xArea > Math.abs(getImageXCenter("player") - getImageXCenter(enemy))) {
      return true;
    }
  }
  return false;
}

// Used by checkCollision to get x value
function getImageXCenter(image) {
  var x = getXPosition(image);
  var width = getProperty(image, "width");
  var xCenter = x + width / 2;
  return xCenter;
}

// Used by checkCollision to get y value
function getImageYCenter(image) {
  var y = getYPosition(image);
  var height = getProperty(image, "height");
  var yCenter = y + height / 2;
  return yCenter;
}

// Decrease lives, go to game if 0
function enemyCollision() {
  lives--;
  stopTimedLoop();
  if (lives < 1) {
    hideElement("winImage");
    showElement("smileImage");
    setScreen("gameOverScreen");
    if (highScores[0] == 0) {
      highScores = [moveCount, moveCount, moveCount, moveCount, moveCount];
      setText("recentScore1", moveCount);
      setText("recentLevel1", levelCount);
      setText("recentScore2", moveCount);
      setText("recentLevel2", levelCount);
      setText("recentScore3", moveCount);
      setText("recentLevel3", levelCount);
      setText("recentScore4", moveCount);
      setText("recentLevel4", levelCount);
      setText("recentScore5", moveCount);
      setText("recentLevel5", levelCount);
    }
    for (var i = 0; i < highScores.length; i++) {
      if (moveCount > highScores[i]) {
        highScores[i] = moveCount;
        setText("recentScore" + (i + 1), moveCount);
        setText("recentLevel" + (i + 1), levelCount);
        setText("overLabel", "High Score!");
        setProperty("gameOverScreen", "background-color", "orange");
        hideElement("smileImage");
        showElement("winImage");
        i = 10;
      }
    }
    setText("scoreNumOver", moveCount);
    setText("levelNumOver", levelCount);
  } else {
    setPosition("player", 140, 410);
    hideElement("heart" + (3 - lives));
    moveEnemy("cartEnemy", "truckEnemy", "motorcycleEnemy");
  }
}

// Check for obstacle collision, move player
function obstacleCollision(){
  for(var i=1; i < 4; i++){
    if (checkCollision("obstacle"+ i +"Image", 60, 15)){
      return true;
    }
  }
  return false;
}

// Retry button on game over screen
onEvent("retryBtn", "click", function() {
  setScreen("gameScreen");
  moveEnemy("cartEnemy", "truckEnemy", "motorcycleEnemy");
  setPosition('bonusHeart', -400, -400);
  setPosition('bonusBoost', -400, -400);
  moveCount = 0;
  levelCount = 1;
  lives = 3;
  boostCount = 3;
  speedIncrease = 0;
  setText("scoreNumLabel", moveCount);
  setText("levelLabel", levelCount);
  setPosition("player", 140, 410);
  showElement("heart1");
  showElement("heart2");
  showElement("boost1");
  showElement("boost2");
  showElement("boost3");
});

