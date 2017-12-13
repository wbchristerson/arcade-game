// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
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
  if (this.x > 505) {
    this.x = -1 * Math.floor(Math.random() * 100) - 100;
    this.y = (83 * (Math.floor(Math.random() * 3))) + 395 - (4 * 83);
    this.speed = (Math.floor(Math.random() * 500)) + 100;
  }
  if (player.gamePage) {
    this.x += dt * this.speed;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 395;
  this.level = 1;
  this.atWater = false;
  this.pauseCounter = 0;
  this.rockIds = [false, false, false, false];
  this.rockCoors = [{xCoor: 0, yCoor: 0}, {xCoor: 0, yCoor: 0},
                    {xCoor: 0, yCoor: 0}, {xCoor: 0, yCoor: 0}];
  this.score = 0;
  this.lives = 3;
  this.levelAlarm = 120; // for announcing level 5, 10, 15, ...
  this.introPage = true; // set introductory page
  this.gamePage = false; // set game page
  this.endPage = false; // set end page
};

Player.prototype.update = function(dt) {
  if (!this.atWater) {
    for (let i = 0; i < allEnemies.length; i++) {
      if ((allEnemies[i].y === this.y) &&
          (Math.abs(allEnemies[i].x - this.x) <= 71)) {
            this.x = 200;
            this.y = 395;
            this.lives -= 1;
            health.pop();
            if (this.lives === 0) {
              this.gamePage = false;
              this.score = 0;
              this.lives = 3;
              health.push(new HealthUnit(100, 550, 0));
              health.push(new HealthUnit(135, 550, 1));
              health.push(new HealthUnit(170, 550, 2));
            }
            break;
          }
    }
    if (this.y <= 50) {
      this.atWater = true;
    }
  }
  else if (this.pauseCounter < 60) {
      if (this.pauseCounter === 0) {
        gem.scoreX = this.x;
        gem.scoreY = this.y + 200;
        gem.score = 1;
        gem.announceScore = 0;
      }
      this.pauseCounter++;
  }
  else {
    this.atWater = false;
    for(let i = 0; i < 3; i++) {
      allEnemies[i].x = 506;
    }
    this.pauseCounter = 0;
    gem.mustSet = true;
    this.x = 200
    this.y = 395;
    this.level += 1;
    for (let i = 0; i < 3; i++) {
      let rockId = 1 + Math.floor(5 * Math.random());
      if (rockId <= this.level) {
        this.rockIds[i] = true;
        let xCoor = 101 * Math.floor(5 * Math.random());
        let yCoor = 83 * (1 + Math.floor(3 * Math.random()));
        this.rockCoors[i].xCoor = xCoor;
        this.rockCoors[i].yCoor = yCoor;
      }
      else {
        this.rockIds[i] = false;
      }
    }
    if (this.level > 5) {
      this.rockIds[3] = true;
      this.rockCoors[3].xCoor = 404;
      this.rockCoors[3].yCoor = 83 * (1 + Math.floor(3 * Math.random()));
    }
    this.score += 1;

    if ((this.level % 5) === 0) {
      this.levelAlarm = 0;
    }
  }
};

Player.prototype.handleInput = function(keyStroke) {
  let availableSpot = true;
  if ((keyStroke === 'left') && (this.x >= 90) && this.gamePage) {
    for (let k = 0; k < 4; k++) {
      if ((this.rockIds[k]) && ((this.x - 99) === this.rockCoors[k].xCoor) &&
          ((this.y + 20) === this.rockCoors[k].yCoor)) {
        availableSpot = false;
      }
    }
    if (availableSpot) {
      this.x -= 101;
    }
  }
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
  else if ((!this.atWater) && (keyStroke === 'up') && (this.y >= 0) &&
            this.gamePage) {
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
  else if ((!this.atWater) && (keyStroke === 'down') && (this.y <= 380)) {
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

  else if (this.introPage && (keyStroke === 'space')) {
    this.introPage = false;
    this.gamePage = true;
  }

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
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  // ctx.font = '18px serif';
  ctx.font = '18px arial';
  ctx.textAlign = 'left';
  if (this.gamePage) {
    ctx.fillText('Level ' + this.level.toString(), 10, 576);
    ctx.fillText('Score: ' + this.score.toString(), 410, 576);
  }
  for (let j = 0; j < this.rockIds.length; j++) {
    if (this.rockIds[j]) {
      ctx.drawImage(Resources.get('images/Rock.png'), this.rockCoors[j].xCoor,
                    this.rockCoors[j].yCoor - 30);
    }
  }
  if (this.levelAlarm < 120) {
    ctx.font = '36px bold arial';
    ctx.fillStyle = '#ff0000';  //<======= here
    ctx.fillText('You Have Reached Level ' + this.level.toString() + '!', 50,
                 200 + this.levelAlarm);
    this.levelAlarm += 1;
    ctx.fillStyle = 'black';
  }

  if (this.introPage) {
    // ctx.fillStyle = 'blue';
    var my_gradient=ctx.createLinearGradient(0,100,505,300);
    my_gradient.addColorStop(0,'#4286f4');
    // my_gradient.addColorStop(0.5,"red");
    my_gradient.addColorStop(1,'#3de534');
    // my_gradient.addColorStop(1,'#29dee8');

    ctx.fillStyle=my_gradient;
    // ctx.fillStyle = linear-gradient(160deg, #02ccba 0%, #aa7ecd 100%);
    // ctx.fillRect(0, 100, 505, 300);
    ctx.fillRect(0, 0, 505, 606);
    ctx.fillStyle = 'black';
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
    ctx.drawImage(Resources.get('images/char-cat-girl.png'), 101, 270 + gem.gemOffset);
    ctx.drawImage(Resources.get('images/char-horn-girl.png'), 202, 270 + gem.gemOffset);
    ctx.drawImage(Resources.get('images/char-pink-girl.png'), 303, 270 + gem.gemOffset);
    ctx.drawImage(Resources.get('images/char-princess-girl.png'), 404, 270 + gem.gemOffset);

    ctx.fillText('Press "space" to begin.', 160, 480);

  }
};


let HealthUnit = function(xCoor, yCoor,rank) {
  this.sprite = 'images/Heart-Small.png';
  this.x = xCoor;
  this.y = yCoor;
  this.rank = rank;
  this.inView = true;
};

HealthUnit.prototype.render = function() {
  if (player.gamePage) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};

HealthUnit.prototype.update = function(dt) {
  /*
  if (player.lives <= this.rank) {
    this.y  = 650;
    this.inView = false;
  }
  else if (player.lives > this.rank) {
    this.inView = true;
    this.y = 550;
  }
  */
};


let Gem = function() {
  this.present = false;
  this.gemOffset = 0;
  this.gemSign = 1;
  this.stepCounter = 0;
  this.x = 0;
  this.y = 700;
  this.sprite = 'images/Gem_Blue_Small.png';
  this.mustSet = false;
  this.gemVal = 3;
  // scoring stuff
  this.scoreX = 0;
  this.scoreY = 700;
  this.score = 3;
  this.announceScore = 70;

};

Gem.prototype.render = function() {
  if (this.gemVal !== 0) {
    ctx.drawImage(Resources.get(this.sprite), this.x + 20,
                  this.y + 60 - this.gemOffset);
  }
  else {
    ctx.drawImage(Resources.get(this.sprite), this.x,
                  this.y - 8 - this.gemOffset);
  }
  if (this.announceScore < 70) {
    this.announceScore += 1;
    ctx.fillText('+' + this.score.toString(), this.scoreX,
                 this.scoreY - this.announceScore);
  }
};


// Gem.prototype.listScore = function() {
//   if (this.announceScore < 1000) {
//     console.log(this.scoreX);
//     this.announceScore += 1;
//     ctx.fillText(this.score.toString(), this.scoreX,
//                   this.scoreY - this.announceScore);
//   }
// }


Gem.prototype.update = function(dt) {
  if (this.mustSet) {
    let gemRand, spaceOccupied;
    gemRand = 1 + Math.floor(10 * Math.random());
    // gemRand = 4;
    if (gemRand >= 3) {
    // if ((5 <= gemRand) && (gemRand <= 7)) {
    // if (gemRand <= 10) {
      this.present = true;
      spaceOccupied = true;
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

    else {
      this.y = 700;
    }


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

  if (((player.x + 2) === this.x) && ((player.y + 20) === this.y)) {
    if (this.gemVal !== 0) {
      gem.scoreX = this.x;
      gem.scoreY = this.y;
      gem.score = this.gemVal;
      gem.announceScore = 0;
      player.score += this.gemVal;
    }
    else {
      player.lives += 1;
      health.push(new HealthUnit(65 + 35 * player.lives, 550, player.lives - 1));
    }
    this.x = 0;
    this.y = 700;
  }

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

  // this.listScore();
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

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
      84: 't'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
