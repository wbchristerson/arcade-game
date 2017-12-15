///////////////////////////// Enemy Class //////////////////////////////////////
// Enemies our player must avoid
var Enemy = function() {
  this.sprite = 'images/enemy-bug.png';
  // Place bugs in random positions just left of the left end of the screen
  this.x = -1 * Math.floor(Math.random() * 100) - 100;
  this.y = (83 * (Math.floor(Math.random() * 3))) + 395 - (4 * 83);
  // give enemy a random speed
  this.speed = (Math.floor(Math.random() * 500)) + 100;
};


/* re-randomize the position of the enemy to the left of the board and randomize
   its speed */
Enemy.prototype.randomizeData = function() {
  this.x = -1 * Math.floor(Math.random() * 100) - 100;
  this.y = (83 * (Math.floor(Math.random() * 3))) + 395 - (4 * 83);
  this.speed = (Math.floor(Math.random() * 500)) + 100;
};


// check for a collision with the player
Enemy.prototype.checkCollision = function() {
  if ((this.y === player.y) && (Math.abs(this.x - player.x) <= 71)) {
    // if there is a collision, reset player position and decrement health
    gameState.resetPosition();
    player.decHealth();
  }
};


Enemy.prototype.update = function(dt) {
  /* if the enemy has moved to the right of the right end of the screen, then
     place it in a new random row to the left of the screen with a random
     speed */
  if (this.x > 505) {
    this.randomizeData();
  }
  // if the player has entered the game page, then have the enemy move
  if (gameState.gamePage) {
    this.x += dt * this.speed;
    this.checkCollision();
  }
};


Enemy.prototype.render = function() {
  if (gameState.gamePage) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};


///////////////////////////// BobTimer Class ///////////////////////////////////
/* For effects, certain screen objects bob up and down; this class achieves
   this by using a counter to locate the vertical positions of the sprites */
let BobTimer = function() {
  this.stepCounter = 0; // 5 stepcounters make one vertical unit alteration
  this.offset = 0; // 10 offsets make one directed cycle (up or down)
  this.offSign = 1; // the direction, 1 or -1, of vertical movement
};


BobTimer.prototype.update = function(dt) {
  this.stepCounter += 1;
  if (this.stepCounter === 5) {
    this.stepCounter = 0;
    this.offset += this.offSign;
    if (this.offset === 11) {
      this.offset = 9;
      this.offSign *= -1;
    }
    if (this.offset === -1) {
      this.offset = 1;
      this.offSign *= -1;
    }
  }

};



///////////////////////////// GameState Class //////////////////////////////////
let GameState = function() {
  // at any time, exactly one of introPage, gamePage, endPage should be true
  this.introPage = true; // signal introductory page
  this.gamePage = false; // signal actual game page
  this.endPage = false; // signal end page
  // at any time, at most one of endLose and endWin should be true
  this.endLose = false; // signal losing state of end page
  this.endWin = false; // signal winning state of end page
  /* when introductory page appears, this signifies how much displayed sprites
     should be offset, giving the effect of bobbing up and down */
  this.spriteOffset = 0;
  this.levelAlarm = 120; // alarm for announcing levels 5, 10, 15
};


// when at the introductory or end page, make the background colorful
GameState.prototype.renderBackground = function() {
  let my_gradient = ctx.createLinearGradient(0,100,505,300);
  my_gradient.addColorStop(0,'#4286f4');
  my_gradient.addColorStop(1,'#3de534');
  ctx.fillStyle=my_gradient;
  ctx.fillRect(0, 0, 505, 606);
  ctx.fillStyle = 'black';
};


// introductory page text
GameState.prototype.renderIntroText = function() {
  ctx.font = '18px arial';
  ctx.fillText('Welcome To Frogger!', 160, 110);
  ctx.fillText('Use the arrow keys to traverse the board and reach', 30, 150);
  ctx.fillText('the water at the opposite side but beware of oncoming', 30, 170);
  ctx.fillText('enemy bugs! You may collect gems for points and stars', 30, 190);
  ctx.fillText('for additional lives. There are 15 levels. Good luck!', 30, 210);
};


// introductory page text about possible avatars
GameState.prototype.renderIntroAvatarText = function() {
  ctx.fillText('Press the following keys at any time to change your', 30, 250);
  ctx.fillText('character to the corresponding avatar.', 30, 270);

  ctx.fillText('q', 45, 310);
  ctx.fillText('w', 146, 310);
  ctx.fillText('e', 247, 310);
  ctx.fillText('r', 348, 310);
  ctx.fillText('t', 449, 310);

  // display bobbing sprite options
  ctx.drawImage(Resources.get('images/char-boy.png'), 0,
                270 + bobTimer.offset);
  ctx.drawImage(Resources.get('images/char-cat-girl.png'), 101,
                270 + bobTimer.offset);
  ctx.drawImage(Resources.get('images/char-horn-girl.png'), 202,
                270 + bobTimer.offset);
  ctx.drawImage(Resources.get('images/char-pink-girl.png'), 303,
                270 + bobTimer.offset);
  ctx.drawImage(Resources.get('images/char-princess-girl.png'), 404,
                270 + bobTimer.offset);

  ctx.fillText('Press "space" to begin.', 160, 480);
};


// render level in lower left corner of screen during game
GameState.prototype.renderLevel = function() {
  ctx.fillText('Level ' + player.level.toString(), 10, 576);
};


// render score in lower right corner of screen during game
GameState.prototype.renderScore = function() {
  ctx.fillText('Score: ' + player.score.toString(), 410, 576);
};


// rendering for introductory page
GameState.prototype.renderIntro = function() {
  this.renderBackground();
  this.renderIntroText();
  this.renderIntroAvatarText();
};


GameState.prototype.levelMessage = function() {
  ctx.font = '36px bold arial';
  ctx.fillStyle = '#ff0000';
  ctx.fillText('You Have Reached Level ' + player.level.toString() + '!', 50,
               200 + this.levelAlarm);
  this.levelAlarm += 1;
  ctx.fillStyle = 'black';
  ctx.font = '18px arial';
};


// rendering for game page; note: HealthUnits are rendered through engine.js
GameState.prototype.renderGame = function() {
  this.renderLevel();
  this.renderScore();
  // if beginning level 5, 10, 15, announcement must be made
  if (this.levelAlarm < 120) {
    this.levelMessage();
  }
};


// rendering for end page
GameState.prototype.renderEnd = function() {
  this.renderBackground();
  ctx.fillStyle = 'black';
  ctx.font = '18px arial';
  ctx.fillText('Press "space" to play again. Press "x" to return to the',
               30, 180);
  ctx.fillText('start menu.', 30, 200);
};


// show end page loss message
GameState.prototype.renderEndLose = function() {
  ctx.fillText('Wow! You got to level ' + player.level + ' with ' +
               player.score + ' points.', 100, 110);
};


// show end page win message
GameState.prototype.renderEndWin = function() {
  ctx.fillText('Congratulations! You won with ' + player.score +
               ' points.', 80, 110);
};


GameState.prototype.render = function() {
  // if neither branch is entered, the game page rendering is executed
  if (this.introPage) {
    this.renderIntro(); // render the introductory page
  }
  else if (this.gamePage) {
    this.renderGame();
  }
  else if (this.endPage) { // render the end page
    this.renderEnd();
    if (this.endLose) { // render losing end page
      this.renderEndLose();
    }
    else if (this.endWin) { // render winning end page
      this.renderEndWin();
    }
  }
};


// transition from the introductory page to the game page
GameState.prototype.introToGame = function() {
  this.introPage = false;
  this.gamePage = true;
};


// transition from end page to game page
GameState.prototype.endToGame = function() {
  this.endPage = false;
  this.gamePage = true;
  this.endLose = false;
  this.endWin = false;
};


// transition from game page to end page
GameState.prototype.gameToEnd = function() {
  this.gamePage = false;
  this.endPage = true;
};


// transition from game page to end page after losing
GameState.prototype.gameToEndLose = function() {
  this.gameToEnd();
  this.endLose = true;
  this.endWin = false;
};


// transition from game page to end page after winning
GameState.prototype.gameToEndWin = function() {
  this.gameToEnd();
  this.endLose = false;
  this.endWin = true;
};


// transition from end page to introductory page
GameState.prototype.endToIntro = function() {
  this.endPage = false;
  this.introPage = true;
  this.endLose = false;
  this.endWin = false;
};


// start the level over, either after enemy collision or new level
GameState.prototype.resetPosition = function() {
  player.x = 200;
  player.y = 395;
};


// reset the round after reaching water, winning, or losing
GameState.prototype.resetRound = function() {
  // reset player position
  this.resetPosition();
  player.atWater = false; // reset status out of water
  for (let i = 0; i < 3; i++) { // reset rocks
    rocks[i].resetForRound();
  }
  rocks[3].resetOffScreen();
  if (player.level > 5) {
    rocks[3].setDifficultPlace();
  }
  gem.setReset(); // reset gem
  for (let i = 0; i < allEnemies.length; i++) { // reset enemies
    allEnemies[i].randomizeData();
  }
};


// reset the game after winning or losing
GameState.prototype.resetGame = function() {
  player.level = 1;
  this.resetRound();
  // reset health display
  health = [new HealthUnit(100, 550), new HealthUnit(135, 550),
            new HealthUnit(170, 550)];
  player.score = 0;
  player.lives = 3;
};


// initiate alarm sequence of drifting level message
GameState.prototype.announceLevel = function() {
  this.levelAlarm = 0;
};


GameState.prototype.update = function(dt) {
  if (player.level > 15) {
    this.gameToEndWin();
  }
  if (player.lives <= 0) {
    this.gameToEndLose();
  }
};



///////////////////////////// Player Class /////////////////////////////////////
let Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 395;
  this.level = 1; // there are 15 levels
  this.score = 0;
  this.atWater = false; // signals whether player is at water
  // signals whether timer has begun for time in water
  this.waterTimer = 60;
  this.inTimer = false; // signals whether timer is currently in use
  /* coordinates for first place where water is reached, so that the '+1' that
     drifts up does not keep moving over screen with player during end pause */
  this.waterX = 0;
  this.waterY = 0;
  /* when gem is collected, message showing score increase appears with this
     scoreTimer in use */
  this.scoreTimer = 60;
  this.inScoreTimer = false; // whether scoreTimer is in use
};


// begin a new level after reaching water
Player.prototype.startNewLevel = function() {
  this.level += 1;
  this.score += 1;
  gameState.resetRound();
  // if level is 5, 10, or 15, have large drifting statement on screen
  if ((this.level % 5) === 0) {
    gameState.announceLevel();
  }
};


// make manual changes to player once reaching water
Player.prototype.update = function(dt) {
  if (this.waterTimer < 59) {
    this.inTimer = true;
    this.waterTimer += 1;
  }
  else if (this.waterTimer === 59) { // finish timer; start new level
    this.inTimer = false;
    this.waterTimer += 1;
    this.startNewLevel();
  }
  if (this.scoreTimer < 59) {
    this.inScoreTimer = true;
    this.scoreTimer += 1;
  }
  else if (this.scoreTimer === 59) {
    this.inScoreTimer = false;
    this.scoreTimer += 1;
  }
};


Player.prototype.render = function() {
  if (gameState.gamePage) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); // draw sprite
    if (this.inTimer) { // show drifting '+1'
      ctx.fillText('+1', this.waterX + 5, this.waterY - this.waterTimer + 200);
    }
    if (this.inScoreTimer) { // show drifting score increase
      ctx.fillText('+' + gem.gemVal.toString(), gem.scoreX,
                   gem.scoreY - this.scoreTimer);
    }
  }
};


// check if player at certain coordinates would collide with a specific rock
Player.prototype.rockCollision = function(rock, xCoor, yCoor) {
  if ((rock.x === xCoor) && (rock.y === yCoor)) {
    return true;
  }
  return false;
};


// check if player would collide with any rocks at specific coordinates
Player.prototype.allRockCollisions = function(xCoor, yCoor) {
  let ans = false;
  for (let i = 0; i < rocks.length; i++) {
    if (this.rockCollision(rocks[i], xCoor, yCoor)) {
      ans = true;
      break;
    }
  }
  return ans;
}


// actions for if player has reached water
Player.prototype.reachedWater = function() {
  this.atWater = true;
  this.waterTimer = 0; // begin timer for pause at end of level
  // set coordinates so that '+1' message stays in a single position
  this.waterX = this.x;
  this.waterY = this.y;
};


// increase the player's lives count by 1 and display this on screen
Player.prototype.incHealth = function() {
  this.lives += 1;
  health.push(new HealthUnit(65 + 35 * this.lives, 550));
};


// when a gem is obtained, increase the score and show a drifting score increase
Player.prototype.incScore = function(gemInst) {
  this.score += gemInst.gemVal;
  this.inScoreTimer = true;
  this.scoreTimer = 0;
};


// when a collision with an enemy occurs, decrease health and show display
Player.prototype.decHealth = function() {
  this.lives -= 1;
  health.pop();
};


Player.prototype.handleInput = function(keyStroke) {
  // if at introductory page and 'space' is pressed, switch to game page
  if (gameState.introPage && (keyStroke === 'space')) {
    gameState.introToGame();
    gameState.resetGame(); // reset the board at the game's start
  }
  // if at end page and 'space' is pressed, switch to game page
  else if (gameState.endPage && (keyStroke === 'space')) {
    gameState.endToGame();
    gameState.resetGame(); // reset the board at the game's start
  }
  // if at end page and 'x' is pressed, switch to introductory page
  else if (gameState.endPage && (keyStroke === 'x')) {
    gameState.endToIntro();
  }
  // following branches for changing character image
  else if (keyStroke === 'q') {
    this.sprite = 'images/char-boy.png';
  }
  else if (keyStroke === 'w') {
    this.sprite = 'images/char-cat-girl.png';
  }
  else if (keyStroke === 'e') {
    this.sprite = 'images/char-horn-girl.png';
  }
  else if (keyStroke === 'r') {
    this.sprite = 'images/char-pink-girl.png';
  }
  else if (keyStroke === 't') {
    this.sprite = 'images/char-princess-girl.png';
  }
  /* movement key strokes; make sure player remains on page and does not go
     through a rock */
  else if ((keyStroke === 'left') && (this.x >= 90) && gameState.gamePage &&
           (!this.allRockCollisions(this.x - 99, this.y + 20))) {
    this.x -= 101;
  }
  else if ((keyStroke === 'right') && (this.x <= 400) && gameState.gamePage &&
           (!this.allRockCollisions(this.x + 103, this.y + 20))) {
    this.x += 101;
  }
  else if ((keyStroke === 'up') && (this.y >= 0) && gameState.gamePage &&
           (!this.allRockCollisions(this.x + 2, this.y - 63))) {
    this.y -= 83;
    if (this.y <= 50) { // detect if player reaches water
      this.reachedWater();
    }
  }
  // prevent player from moving down once reaching water
  else if ((!this.atWater) && (keyStroke === 'down') && (this.y <= 380) &&
            gameState.gamePage &&
            (!this.allRockCollisions(this.x + 2, this.y + 103))) {
    this.y += 83;
  }
};



///////////////////////////// Rock Class ///////////////////////////////////////
let Rock = function() {
  // begin with rock off of screen
  this.x = 0;
  this.y = 700;
  this.sprite = "images/Rock.png";
};


Rock.prototype.render = function() {
  if (gameState.gamePage) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 30);
  }
};


// if rock must appear on screen, choose a random spot
Rock.prototype.placeOnScreen = function() {
  let xCoor = 101 * Math.floor(5 * Math.random());
  let yCoor = 83 * (1 + Math.floor(3 * Math.random()));
  this.x = xCoor;
  this.y = yCoor;
};


// randomization for whether rock should appear on screen for round
Rock.prototype.setRandomPlace = function() {
  let rockRand = 1 + Math.floor(5 * Math.random());
  // if random variable below certain value, have rock appear on screen
  if (rockRand <= player.level) {
    this.placeOnScreen();
  }
};


// reset rock at start of round as being off of screen
Rock.prototype.resetOffScreen = function() {
  this.x = 0;
  this.y = 700;
};


// do full cycle of placing off screen and randomly including
Rock.prototype.resetForRound = function() {
  this.resetOffScreen();
  this.setRandomPlace();
};


// for placement of fourth rock (see below), check if all positions in
// rightmost column were taken by first three rocks
Rock.prototype.checkLastRow = function() {
  colArr = [false, false, false];
  for (let i = 0; i < 3; i++) {
    if (rocks[i].x === 404) {
      colArr[(rocks[i].y / 83) - 1] = true;
    }
  }
  if (colArr[0] && colArr[1] && colArr[2]) {
    return true;
  }
  return false;
};


// beyond level 5, make the game more difficult by always placing the fourth
// rock in rocks[] somehwere in the rightmost column on the page
Rock.prototype.setDifficultPlace = function() {
  this.x = this.checkLastRow() ? 303 : 404;
  let availableSpot = false;
  let yCoor;
  while (!availableSpot) {
    availableSpot = true;
    yCoor = 83 * (1 + Math.floor(3 * Math.random()));
    this.y = yCoor;
    for (let i = 0; i < 3; i++) {
      if ((this.x === rocks[i].x) && (this.y === rocks[i].y)) {
        availableSpot = false;
      }
    }
  }
};



///////////////////////////// Gem Class ////////////////////////////////////////
let Gem = function() {
  this.x = 0;
  this.y = 800;
  this.gemVal = 3;
  this.sprite = 'images/Gem_Blue_Small.png';
  // signals whether gem position and type should be reset (for a new level)
  this.mustReset = false;
  // gives coordinates of where increased score announcement should be
  this.scoreX = 0;
  this.scoreY = 800;
};


// at the start of a new round, clear the gem from the page
Gem.prototype.clearFromPage = function() {
  this.x = 0;
  this.y = 800;
};


// set sprite image and value based on gem random variable
Gem.prototype.setGemInfo = function(gemRandVar) {
  if ((gemRandVar >= 3) && (gemRandVar <= 4)) {
    this.sprite = 'images/Star.png';
    this.gemVal = 0;
  }
  else if ((gemRandVar >= 5) && (gemRandVar <= 7)) {
    this.sprite = 'images/Gem_Blue_Small.png';
    this.gemVal = 3;
  }
  else if ((gemRandVar >= 8) && (gemRandVar <= 9)) {
    this.sprite = 'images/Gem_Green_Small.png';
    this.gemVal = 6;
  }
  else if (gemRandVar === 10) {
    this.sprite = 'images/Gem_Orange_Small.png';
    this.gemVal = 9;
  }
};

// given that gem is to appear on screen, randomly set coordinates, but not on
// a spot containing a rock already
Gem.prototype.setCoordinates = function() {
  let spaceOccupied = false;
  while(!spaceOccupied) {
    spaceOccupied = true;
    this.x = 101 * Math.floor(5 * Math.random());
    this.y = 83 * (1 + Math.floor(3 * Math.random()));
    for (let i = 0; i < 4; i++) {
      if ((rocks[i].x === this.x) && (rocks[i].y === this.y)) {
        spaceOccupied = false;
        break;
      }
    }
  }
};


// through randomization, possibly place gem on page, otherwise leave off screen
Gem.prototype.tryPlaceOnPage = function() {
  let gemRand = 1 + Math.floor(10 * Math.random());
  if (gemRand >= 3) {
    this.setGemInfo(gemRand);
    this.setCoordinates();
  }
};


// give signal that position of gem must be reset at start of level
Gem.prototype.setReset = function() {
  this.mustReset = true;
};


Gem.prototype.update = function(dt) {
  if (this.mustReset) {
    this.mustReset = false;
    this.clearFromPage();
    this.tryPlaceOnPage();
  }
  if (((player.x + 2) === this.x) && ((player.y + 20) === this.y)) {
    this.scoreX = this.x;
    this.scoreY = this.y;
    this.gemVal ? player.incScore(this) : player.incHealth();
    this.clearFromPage();
  }
};


// if gem is genuine gem (not star)
Gem.prototype.renderRealGem = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x + 20,
                this.y + 60 - bobTimer.offset);
};


// if gem is actually star
Gem.prototype.renderStar = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x,
                this.y - 8 - bobTimer.offset);
};


Gem.prototype.render = function() {
  if (gameState.gamePage && (this.gemVal !== 0)) { // if genuine gem
    this.renderRealGem();
  }
  else if (gameState.gamePage && (this.gemVal === 0)) { // if star
    this.renderStar();
  }
};



///////////////////////////// HealthUnit Class /////////////////////////////////
let HealthUnit = function(xCoor, yCoor) {
  this.sprite = 'images/Heart-Small.png';
  this.x = xCoor;
  this.y = yCoor;
};


HealthUnit.prototype.render = function() {
  if (gameState.gamePage) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};



// Instantiated objects below
// All enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Begin with three lives, represented by three HealthUnits
// Include one gem
let gameState = new GameState();
let allEnemies = [new Enemy(), new Enemy(), new Enemy()];
let player = new Player();
let health = [new HealthUnit(100, 550), new HealthUnit(135, 550),
              new HealthUnit(170, 550)];
let rocks = [new Rock(), new Rock(), new Rock(), new Rock()];
let gem = new Gem();
let bobTimer = new BobTimer();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      81: 'q',
      87: 'w',
      69: 'e',
      82: 'r',
      84: 't',
      88: 'x'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
