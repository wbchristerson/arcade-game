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
};

Player.prototype.update = function(dt) {
  for (let i = 0; i < allEnemies.length; i++) {
    if ((allEnemies[i].y === this.y) &&
        (Math.abs(allEnemies[i].x - this.x) <= 71)) {
      this.x = 200;
      this.y = 395;
      break;
    }
  }
  if (this.y <= 50) {
    // console.log('hello');
    this.x = 200;
    this.y = 395;
    this.level += 1;
    // setTimeout(function() {
    //   this.x = 200;
    //   this.y = 395;
    //   this.level += 1;
    // }, 1000);
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

  }
};

Player.prototype.handleInput = function(keyStroke) {
  if ((keyStroke === 'left') && (this.x >= 90)) {
    this.x -= 101;
  }
  else if ((keyStroke === 'right') && (this.x <= 400)) {
    this.x += 101;
  }
  else if ((keyStroke === 'up') && (this.y >= 0)) {
    this.y -= 83;
  }
  else if ((keyStroke === 'down') && (this.y <= 380)) {
    this.y += 83;
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  // ctx.font = '18px serif';
  ctx.font = '18px arial';
  ctx.textAlign = 'left';
  ctx.fillText('Level ' + this.level.toString(), 10, 576);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let allEnemies = [new Enemy(), new Enemy(), new Enemy()];
let player = new Player();
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
