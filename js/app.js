///////////////////////// Start Of Enemy Class /////////////////////////////////
// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // Place bugs in random positions just left of the left end of the screen
  this.x = -1 * Math.floor(Math.random() * 100) - 100;
  this.y = (83 * (Math.floor(Math.random() * 3))) + 395 - (4 * 83);
  this.speed = (Math.floor(Math.random() * 500)) + 1;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  // If the enemy has moved to the right of the right end of the screen, then
  // place it in a new random row to the left of the screen with a random
  // speed
  if (this.x > 505) {
    this.x = -1 * Math.floor(Math.random() * 100) - 100;
    this.y = (83 * (Math.floor(Math.random() * 3))) + 395 - (4 * 83);
    this.speed = (Math.floor(Math.random() * 500)) + 100;
  }
  // If the player has entered the game page, then have the bug move
  if (player.gamePage) {
    this.x += dt * this.speed;
  }
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
///////////////////////// End Of Enemy Class ///////////////////////////////////



///////////////////////// Start Of Rock Class //////////////////////////////////
// let Rock = function() {
//   this.rockId = false;
//   this.rockCoors = {xCoor: 0, yCoor: 0}
// }
///////////////////////// End Of Rock Class ////////////////////////////////////



///////////////////////// Start Of Player Class ////////////////////////////////
let Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 395;
  // game level
  this.level = 1;
  // whether the sprite has reached the water
  this.atWater = false;
  // a counter that goes up to 60 to pause for when the player has finished the
  // level (i.e. reached the water)
  this.pauseCounter = 0;
  // array of booleans telling whether each of the four rock sprites is visible
  // on the screen during the level
  this.rockIds = [false, false, false, false];
  // array of objects listing the coordinates of the rock sprites
  this.rockCoors = [{xCoor: 0, yCoor: 0}, {xCoor: 0, yCoor: 0},
                    {xCoor: 0, yCoor: 0}, {xCoor: 0, yCoor: 0}];
  this.score = 0;
  this.lives = 3;
  // announces level 5, 10, 15, for a pause of 120 iterations
  this.levelAlarm = 120;
  this.introPage = true; // set introductory page
  this.gamePage = false; // set game page
  this.endPage = false; // set end page
  // cases for ending the game as a win or loss
  this.win = false;
  this.lose = false;
};


// reset the round after the player is hit by an enemy
Player.prototype.roundReset = function() {
  this.x = 200;
  this.y = 395;
  this.lives -= 1; // lose a life since hit by an enemy
  health.pop(); // remove a health sprite from display
};


// transition to the end page either after a win or game over
Player.prototype.endGame = function() {
  this.gamePage = false;
  this.endPage = true;
  // place the gem out of view if not already
  gem.x = 0;
  gem.y = 700;
  // place rocks out of view to be reset if the player wishes to play again
  for (let i = 0; i < this.rockIds.length; i++) {
    this.rockIds[i] = false;
  }
};


// set enemies' x-coordinates to beyond the right end of the screen to trigger
// random placement and speed resetting to the left of the screen
Player.prototype.triggerEnemiesReset = function() {
  for(let i = 0; i < 3; i++) {
    allEnemies[i].x = 506;
  }
};


// reset the entire game upon pushing 'space' following either a win or loss
Player.prototype.resetGame = function() {
  this.score = 0;
  this.lives = 3;
  this.level = 1;
  // reset health display with three sprites
  health.push(new HealthUnit(100, 550, 0));
  health.push(new HealthUnit(135, 550, 1));
  health.push(new HealthUnit(170, 550, 2));
  this.endPage = false; // leave the end page
  this.triggerEnemiesReset(); // reset enemies
};


// Reset the four rock sprites at the start of each level, some of which may
// not end up on screen during the level
Player.prototype.resetRocks = function() {
  for (let i = 0; i < 3; i++) {
    // randomly decide whether to display each of the rocks on the board
    let rockId = 1 + Math.floor(5 * Math.random());
    if (rockId <= this.level) {
      // if it is decided that the rock appears, choose its coordinates
      // randomly and set its id in the array to 'true'
      this.rockIds[i] = true;
      let xCoor = 101 * Math.floor(5 * Math.random());
      let yCoor = 83 * (1 + Math.floor(3 * Math.random()));
      this.rockCoors[i].xCoor = xCoor;
      this.rockCoors[i].yCoor = yCoor;
    }
    else {
      // if it is decided that the rock will not appear on the screen then
      // set its id in the array to 'false'
      this.rockIds[i] = false;
    }
  }
  // to make the game more difficult as the levels increase: if the level is
  // more than 5, then set the fourth rock to some position in the rightmost
  // column to obstruct easy movement of the player there
  if (this.level > 5) {
    this.rockIds[3] = true;
    this.rockCoors[3].xCoor = 404;
    this.rockCoors[3].yCoor = 83 * (1 + Math.floor(3 * Math.random()));
  }
};


Player.prototype.update = function(dt) {
  // branch for when the player has not completed the level, i.e.
  // not reached water
  if (!this.atWater) {
    // check if the player is in contact with any enemies
    for (let i = 0; i < allEnemies.length; i++) {
      if ((allEnemies[i].y === this.y) &&
          (Math.abs(allEnemies[i].x - this.x) <= 71)) {
            this.roundReset();
        // inner branch for if the player is in contact with an enemy and has
        // now lost all lives
        if (this.lives === 0) {
          this.lose = true;
          this.endGame(); // enter end page
        }
        // reset or transition to end page immediately after the first contact
        // with an enemy is discovered
        break;
      }
    }
    // update the player's status to having reached water when the y-coordinate
    // falls to 50 or lower
    if (this.y <= 50) {
      this.atWater = true;
    }
  }

  // branch for when the player has reached water (i.e. completed the level)
  // thought the timer of 60 iterations has not been completed (this is so that
  // the player does not immediately get reset to the new level)
  else if (this.pauseCounter < 60) {
      // the player receives 1 point for having completed the level, which is
      // displayed as a small '+1' drifting ever higher on the screen for 60
      // iterations
      if (this.pauseCounter === 0) {
        gem.scoreX = this.x;
        gem.scoreY = this.y + 200;
        gem.score = 1;
        gem.announceScore = 0;
      }
      this.pauseCounter++;
  }

  // branch for when the player has reached water and has completed the 60
  // iteration waiting period, so that the new level must be set
  else {
    this.atWater = false; // set status as not at water
    this.triggerEnemiesReset(); // reset enemies
    this.pauseCounter = 0; // reset pauseCounter for later use
    // give signal to randomly place a kind of gem, a star, or neither on the board
    gem.mustSet = true;
    // reset coordinates
    this.x = 200;
    this.y = 395;
    this.level += 1; // increase level
    this.resetRocks();

    this.score += 1; // reward the player for finishing another level

    // if the player has reached level 5, 10, or 15, then congratulate them
    // with a message on the screen that pans down for a set number of
    // iterations, telling them so
    if ((this.level % 5) === 0) {
      this.levelAlarm = 0; // trigger the message
    }

    // if the level counter has reached 16, then the player has won the game
    if (this.level === 16) {
      gem.mustSet = false; // remove the gem from the screen if visible
      // set winning variable to true to transition to the correct ending
      // statement
      this.win = true;
      // prepare health to be reset by removing any extraneous HealthUnit
      // instances
      health = [];
      this.endGame(); // transition to the end game screen
    }
  }
};


// set variables for the active game itself
Player.prototype.prepareGameScreen = function() {
  this.gamePage = true;
  this.lose = false;
  this.win = false;
};


// text statement for introductory page
Player.prototype.introStatement = function() {
  ctx.fillText('Welcome To Frogger!', 160, 110);
  ctx.fillText('Use the arrow keys to traverse the board and reach', 30, 150);
  ctx.fillText('the water at the opposite side but beware of oncoming', 30, 170);
  ctx.fillText('enemy bugs! You may collect gems for points and stars', 30, 190);
  ctx.fillText('for additional lives. There are 15 levels. Good luck!', 30, 210);

  ctx.fillText('Press the following keys at any time to change your', 30, 250);
  ctx.fillText('character to the corresponding avatar.', 30, 270);

  ctx.fillText('q', 45, 310);
  ctx.fillText('w', 146, 310);
  ctx.fillText('e', 247, 310);
  ctx.fillText('r', 348, 310);
  ctx.fillText('t', 449, 310);

  ctx.drawImage(Resources.get('images/char-boy.png'), 0, 270 + gem.gemOffset);
  ctx.drawImage(Resources.get('images/char-cat-girl.png'), 101,
                270 + gem.gemOffset);
  ctx.drawImage(Resources.get('images/char-horn-girl.png'), 202,
                270 + gem.gemOffset);
  ctx.drawImage(Resources.get('images/char-pink-girl.png'), 303,
                270 + gem.gemOffset);
  ctx.drawImage(Resources.get('images/char-princess-girl.png'), 404,
                270 + gem.gemOffset);

  ctx.fillText('Press "space" to begin.', 160, 480);
};


Player.prototype.handleInput = function(keyStroke) {
  let availableSpot = true;
  // enter this branch if the left arrow key has been pressed, if the player is
  // not on the far left of the screen, and if the game is currently ongoing
  // rather than the introductory or end pages; similarly for up, douwn, and
  // right
  if ((keyStroke === 'left') && (this.x >= 90) && this.gamePage) {
    // if the desired position is filled with a rock, then set availableSpot
    // to false so that the player cannot move there
    for (let k = 0; k < 4; k++) {
      if ((this.rockIds[k]) && ((this.x - 99) === this.rockCoors[k].xCoor) &&
          ((this.y + 20) === this.rockCoors[k].yCoor)) {
        availableSpot = false;
      }
    }
    // if the spot is not occupied by a rock, then move there
    if (availableSpot) {
      this.x -= 101;
    }
  }
  // same as above
  else if ((keyStroke === 'right') && (this.x <= 400) && this.gamePage) {
    for (let k = 0; k < 4; k++) {
      if ((this.rockIds[k]) && ((this.x + 103) === this.rockCoors[k].xCoor) &&
          ((this.y + 20) === this.rockCoors[k].yCoor)) {
        availableSpot = false;
      }
    }
    if (availableSpot) {
      this.x += 101;
    }
  }
  // same as above
  else if ((keyStroke === 'up') && (this.y >= 0) && this.gamePage) {
    for (let k = 0; k < 4; k++) {
      if ((this.rockIds[k]) && ((this.x + 2) === this.rockCoors[k].xCoor) &&
          ((this.y - 63) === this.rockCoors[k].yCoor)) {
            availableSpot = false;
      }
    }
    if (availableSpot) {
      this.y -= 83;
    }
  }
  // same as above but also the player cannot move down if it is currently
  // in the water region during the pause at the end of the level
  else if ((!this.atWater) && (keyStroke === 'down') && (this.y <= 380) &&
            this.gamePage) {
    for (let k = 0; k < 4; k++) {
      if ((this.rockIds[k]) && ((this.x + 2) === this.rockCoors[k].xCoor) &&
          ((this.y + 103) === this.rockCoors[k].yCoor)) {
            availableSpot = false;
      }
    }
    if (availableSpot) {
      this.y += 83;
    }
  }

  // if the player presses "space" from the introductory page, then prepare
  // the game screen
  else if (this.introPage && (keyStroke === 'space')) {
    this.prepareGameScreen();
    this.introPage = false;
  }

  // similar to the last branch
  else if (this.endPage && (keyStroke === 'space')) {
    this.prepareGameScreen();
    this.resetGame();
  }

  // if the player presses "x" from the end page, then reset the game and set
  // variables for the introductory page
  else if (this.endPage && (keyStroke === 'x')) {
    this.introPage = true;
    this.resetGame();
  }

  // the remaining branches are for if the player wants to change sprite images
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
};


Player.prototype.render = function() {
  // draw the sprite
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  // set the text format
  ctx.font = '18px arial';
  ctx.textAlign = 'left';
  // if the game is ongoing, list the level and score
  if (this.gamePage) {
    ctx.fillText('Level ' + this.level.toString(), 10, 576);
    ctx.fillText('Score: ' + this.score.toString(), 410, 576);
  }
  // for each rock that is set to appear in the level, draw it at its position
  for (let j = 0; j < this.rockIds.length; j++) {
    if (this.rockIds[j]) {
      ctx.drawImage(Resources.get('images/Rock.png'), this.rockCoors[j].xCoor,
                    this.rockCoors[j].yCoor - 30);
    }
  }

  // if the player has reached level 5, 10, or 15, provide a message saying so
  if (this.levelAlarm < 120) {
    ctx.font = '36px bold arial';
    ctx.fillStyle = '#ff0000';
    ctx.fillText('You Have Reached Level ' + this.level.toString() + '!', 50,
                 200 + this.levelAlarm);
    this.levelAlarm += 1;
    ctx.fillStyle = 'black';
    ctx.font = '18px arial';
  }

  // if the screen is at the introductory or end page (i.e. not the game page),
  // then set the background gradient accordingly
  if (this.introPage || this.endPage) {
    var my_gradient=ctx.createLinearGradient(0,100,505,300);
    my_gradient.addColorStop(0,'#4286f4');
    my_gradient.addColorStop(1,'#3de534');
    ctx.fillStyle=my_gradient;
    ctx.fillRect(0, 0, 505, 606);
    ctx.fillStyle = 'black';
  }

  // provide the introductory page statement
  if (this.introPage) {
    this.introStatement();
  }

  // provide the end page statement when losing
  if (this.endPage && this.lose) {
    ctx.fillText('Wow! You got to level ' + this.level + ' with ' +
                 this.score + ' points.', 100, 110);
  }

  // provide the end page statement when winning
  if (this.endPage && this.win) {
    ctx.fillText('Congratulations! You won with ' + this.score +
                 ' points.', 80, 110);
  }

  // provide the options for playing again in either case of the end page
  if (this.endPage) {
    ctx.fillText('Press "space" to play again. Press "x" to return to the', 30, 180);
    ctx.fillText('start menu.', 30, 200);
  }

};
///////////////////////// End Of Player Class //////////////////////////////////



///////////////////////// Start Of HealthUnit Class ////////////////////////////
// HealthUnits correspond to sprites displaying the number of lives that the
// player currently has
let HealthUnit = function(xCoor, yCoor,rank) {
  this.sprite = 'images/Heart-Small.png';
  this.x = xCoor;
  this.y = yCoor;
};


// draw the sprite
HealthUnit.prototype.render = function() {
  if (player.gamePage) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};


HealthUnit.prototype.update = function(dt) {
};
///////////////////////// End Of HealthUnit Class //////////////////////////////



///////////////////////// Start Of Gem Class ///////////////////////////////////
// A class for the gems and stars that appear in some levels; a blue gem is
// worth 3 points, a green gem is worth 6 points, an orange gem is worth 9
// points, and a star yields another life; blue gems appear randomly with
// probability 30%, green gems with probability 20%, orange gems with
// probability 10%, and stars with probability 20%, but never together
let Gem = function() {
  this.gemOffset = 0;
  // gems bob up and down on screen so the gemSign signfies whether it is
  // currently moving up or down on the screen (it is always set to either
  // 1 or -1)
  this.gemSign = 1;
  // a counter for steps until moving the gem up the screen
  this.stepCounter = 0;
  // initialize the gem so that it is off of the visible screen
  this.x = 0;
  this.y = 700;
  // intialize sprite to the blue gem
  this.sprite = 'images/Gem_Blue_Small.png';
  // a signal determining whether the gem must be rendered on the visible screen
  this.mustSet = false;
  // the value of the gem in points, initially set to the value of a blue gem
  this.gemVal = 3;
  // when a gem is collected, its value appears on the screen for a short
  // period, drifting upwards; this gives the coordinates of the drifting text
  this.scoreX = 0;
  this.scoreY = 700;
  this.score = 3;
  // a counter for how long the score appears on the screen (to be set to 0
  // when it is to initially appear)
  this.announceScore = 70;
};


Gem.prototype.render = function() {
  // if the object is genuinely one of the gems
  if (this.gemVal !== 0) {
    ctx.drawImage(Resources.get(this.sprite), this.x + 20,
                  this.y + 60 - this.gemOffset);
  }
  // if the object is in fact a star
  else {
    ctx.drawImage(Resources.get(this.sprite), this.x,
                  this.y - 8 - this.gemOffset);
  }
  // render the point value of the gem when the counter is triggered
  if (this.announceScore < 70) {
    this.announceScore += 1;
    ctx.fillText('+' + this.score.toString(), this.scoreX,
                 this.scoreY - this.announceScore);
  }
};


Gem.prototype.animateGem = function() {
  this.stepCounter += 1;
  if (this.stepCounter === 5) {
    this.stepCounter = 0;
    this.gemOffset += this.gemSign;
    if (this.gemOffset === 11) {
      this.gemOffset = 9;
      this.gemSign *= -1;
    }
    if (this.gemOffset === -1) {
      this.gemOffset = 1;
      this.gemSign *= -1;
    }
  }
};


Gem.prototype.update = function(dt) {
  if (this.mustSet) { // if the gem is signalled to be potentially rendered
    let gemRand, spaceOccupied;
    // a random variable to choose the choice of gem, if any
    gemRand = 1 + Math.floor(10 * Math.random());
    if (gemRand >= 3) { // if a gem (or star) is to appear
      spaceOccupied = true;
      // seek out an empy spot (not occupied by a rock) to place the gem at
      while (spaceOccupied) {
        this.x = 101 * Math.floor(5 * Math.random());
        this.y = 83 * (1 + Math.floor(3 * Math.random()));
        spaceOccupied = false;
        for (let i = 0; i < 4; i++) {
          if ((player.rockIds[i]) &&
            (player.rockCoors[i].xCoor === this.x) &&
            (player.rockCoors[i].yCoor === this.y)) {
            spaceOccupied = true;
          }
        }
      }
    }
    // if no gem is to appear, place the gem object off of the visible screen
    else {
      this.y = 700;
    }

    // set the appropriate sprite for the gem
    if ((gemRand === 3) || (gemRand === 4)) {
      this.sprite = 'images/Star.png';
      this.gemVal = 0;
    }

    else if ((5 <= gemRand) && (gemRand <= 7)) {
      this.sprite = 'images/Gem_Blue_Small.png';
      this.gemVal = 3;
    }

    else if ((8 <= gemRand) && (gemRand <= 9)) {
      this.sprite = 'images/Gem_Green_Small.png';
      this.gemVal = 6;
    }

    else if (gemRand === 10) {
      this.sprite = 'images/Gem_Orange_Small.png';
      this.gemVal = 9;
    }

    this.mustSet = false;
  }

  // this branch is for if the player comes in contact with the gem
  if (((player.x + 2) === this.x) && ((player.y + 20) === this.y)) {
    if (this.gemVal !== 0) { // if it is a genuine gem and not a star
      // execute the variable settings for the drifting point text
      this.scoreX = this.x;
      this.scoreY = this.y;
      this.score = this.gemVal;
      this.announceScore = 0;
      // gem.scoreX = this.x;
      // gem.scoreY = this.y;
      // gem.score = this.gemVal;
      // gem.announceScore = 0;
      player.score += this.gemVal;
    }
    else { // if the gem is actually a star
      player.lives += 1;
      health.push(new HealthUnit(65 + 35 * player.lives, 550, player.lives - 1));
    }
    // since the gem has been successfully collected, moved it off of the
    // visible screen
    this.x = 0;
    this.y = 700;
  }

  // set the y-coordinate of the gem so that it appears to bob up and down
  // throughout iterations
  this.animateGem();
};
///////////////////////// End Of Gem Class /////////////////////////////////



// Instantiated objects below
// All enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Begin with three lives, represented by three HealthUnits
// Include one gem
let allEnemies = [new Enemy(), new Enemy(), new Enemy()];
let player = new Player();
let health = [new HealthUnit(100, 550, 0), new HealthUnit(135, 550, 1),
              new HealthUnit(170, 550, 2)];
let gem = new Gem();


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
