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
  this.x += dt * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 395;
  this.level = 1;
  this.points = 0;
  this.collisions = 0;
  this.atWater = false;
  this.pauseCounter = 0;
  this.rockIds = [false, false, false];
  this.rockCoors = [{xCoor: 0, yCoor: 0}, {xCoor: 0, yCoor: 0},
                    {xCoor: 0, yCoor: 0}];
};

Player.prototype.update = function(dt) {
  if (!this.atWater) {
    for (let i = 0; i < allEnemies.length; i++) {
      if ((allEnemies[i].y === this.y) &&
          (Math.abs(allEnemies[i].x - this.x) <= 71)) {
            this.x = 200;
            this.y = 395;
            this.collisions += 1;
            break;
          }
    }
    if (this.y <= 50) {
      this.atWater = true;
    }
  }
  else if (this.pauseCounter < 60) {
      this.pauseCounter++;
  }
  else {
    this.atWater = false;
    this.pauseCounter = 0;
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
  }

    ///////////////////////////////////////////////////
    // ctx.save(); // save current state
    // ctx.rotate(0.15 * Math.PI); // rotate
    // ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ctx.restore();
    //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //ctx.restore(); // restore original states (no rotation etc)
    // ctx.rotate(Math.PI);
    // ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    // ctx.rotate(Math.PI);
    // ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height,
    //               -this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.rotate(Math.PI);
    // ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    ///////////////////////////////////////////////////
};

Player.prototype.handleInput = function(keyStroke) {
  let availableSpot = true;
  if ((keyStroke === 'left') && (this.x >= 90)) {
    for (let k = 0; k < 3; k++) {
      if ((this.rockIds[k]) && ((this.x - 99) === this.rockCoors[k].xCoor) &&
          ((this.y + 20) === this.rockCoors[k].yCoor)) {
        availableSpot = false;
      }
    }
    if (availableSpot) {
      this.x -= 101;
    }
  }
  else if ((keyStroke === 'right') && (this.x <= 400)) {
    for (let k = 0; k < 3; k++) {
      if ((this.rockIds[k]) && ((this.x + 103) === this.rockCoors[k].xCoor) &&
          ((this.y + 20) === this.rockCoors[k].yCoor)) {
        availableSpot = false;
      }
    }
    if (availableSpot) {
      this.x += 101;
    }
  }
  else if ((!this.atWater) && (keyStroke === 'up') && (this.y >= 0)) {
    for (let k = 0; k < 3; k++) {
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
    for (let k = 0; k < 3; k++) {
      if ((this.rockIds[k]) && ((this.x + 2) === this.rockCoors[k].xCoor) &&
          ((this.y + 103) === this.rockCoors[k].yCoor)) {
            availableSpot = false;
      }
    }
    if (availableSpot) {
      this.y += 83;
    }
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  // ctx.font = '18px serif';
  ctx.font = '18px arial';
  ctx.textAlign = 'left';
  ctx.fillText('Level ' + this.level.toString(), 10, 576);
  for (let j = 0; j < 3; j++) {
    if (this.rockIds[j]) {
      ctx.drawImage(Resources.get('images/Rock.png'), this.rockCoors[j].xCoor,
                    this.rockCoors[j].yCoor - 30);
    }
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
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

HealthUnit.prototype.update = function(dt) {
  if (player.collisions >= 3-this.rank) {
    this.y += 100;
    this.inView = false;
  }
};
// ctx.drawImage(Resources.get('images/Heart-Small.png'), 100, 550);
// ctx.drawImage(Resources.get('images/Heart-Small.png'), 135, 550);
// ctx.drawImage(Resources.get('images/Heart-Small.png'), 170, 550);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let allEnemies = [new Enemy(), new Enemy(), new Enemy()];
let player = new Player();
let health = [new HealthUnit(100, 550, 0), new HealthUnit(135, 550, 1),
              new HealthUnit(170, 550, 2)];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
