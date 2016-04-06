(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animationLoop = exports.animation = undefined;

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

var _board = require('./board');

var _ball = require('./ball');

var _ball2 = _interopRequireDefault(_ball);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _particle = require('./particle');

var _brick = require('./brick');

var _sound = require('./sound');

var _sound2 = _interopRequireDefault(_sound);

var _button = require('./button');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var animation = exports.animation = null;

// Init board
_game2.default.init();
_button.startButton.render();

/**
 * Detecting the collision between player and ball
 */
var collision = function collision() {

  // top
  if (_ball2.default.posY <= 0) {
    _ball2.default.speedY = -_ball2.default.speedY;
    _sound2.default.play('collide', 'wall');
  }

  // right
  if (_ball2.default.posX + _ball2.default.size >= _board.board.width) {
    _ball2.default.speedX = -_ball2.default.speedX;
    _sound2.default.play('collide', 'wall');
  }

  // left
  if (_ball2.default.posX <= 0) {
    _ball2.default.speedX = -_ball2.default.speedX;
    _sound2.default.play('collide', 'wall');
  }

  // player or game over :(
  if (_ball2.default.posX + _ball2.default.radius >= _player2.default.posX && _ball2.default.posX <= _player2.default.posX + _player2.default.width && _ball2.default.posY + _ball2.default.size >= _player2.default.posY) {

    if (_player2.default.direction === -1 && _ball2.default.speedX > 0) {
      _ball2.default.speedX = -_ball2.default.speedX;
    }

    if (_player2.default.direction === 1 && _ball2.default.speedX < 0) {
      _ball2.default.speedX = -_ball2.default.speedX;
    }

    _ball2.default.speedY = -_ball2.default.speedY;

    _particle.particles.build(_ball2.default.posX + _ball2.default.radius, _ball2.default.posY + _ball2.default.size, 'black');
    _sound2.default.play('collide', 'player');
  } else if (_ball2.default.posY + _ball2.default.size >= _board.board.height) {
    _ball2.default.posY = _board.board.height - _ball2.default.size;
    _game2.default.over();
  }
};

/**
 * Updating the canvas
 */
var draw = function draw() {

  _board.board.render();
  _brick.bricks.render();

  _game2.default.displayScore();
  _game2.default.displayLevel();

  collision();

  _ball2.default.move();
  _ball2.default.render();

  _particle.particles.emit();

  _player2.default.move();
  _player2.default.render();
};

/**
 * Main game loop
 */
var animationLoop = exports.animationLoop = function animationLoop() {
  exports.animation = animation = requestAnimationFrame(animationLoop);
  draw();
};

},{"./ball":2,"./board":3,"./brick":4,"./button":5,"./game":6,"./particle":8,"./player":9,"./sound":10}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ball = undefined;

var _board = require("./board");

/**
 * Ball object
 */
var ball = exports.ball = {
  posX: 40,
  posY: 40,

  speedX: 4,
  speedY: -8,

  image: document.getElementById("ball"),

  width: 20,
  height: 20,

  angle: 0,

  /**
   * Get the diameter of ball
   *
   * @returns {Number}
   */
  get size() {
    return this.width;
  },

  /**
   * Get the radius of ball
   *
   * @returns {Number}
   */
  get radius() {
    return this.width / 2;
  },

  /**
   * Set ball position
   *
   * @param {Number} x [x=0]
   * @param {Number} y [y=0]
   */
  setPosition: function setPosition() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    this.posX = x;
    this.posY = y;
  },


  /**
   * Move a ball
   */
  move: function move() {
    this.posX += this.speedX;
    this.posY += this.speedY;
  },


  /**
   * Render the ball
   */
  render: function render() {
    _board.ctx.save();
    _board.ctx.translate(this.posX + this.radius, this.posY + this.radius);
    _board.ctx.rotate(this.angle * Math.PI / 180);
    _board.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    _board.ctx.restore();

    this.angle += this.speedX * 2;
  }
};

exports.default = ball;

},{"./board":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Canvas tag
 */
var canvas = exports.canvas = document.getElementById("board");

/**
 * Context
 */
var ctx = exports.ctx = canvas.getContext('2d');

/**
 * Game board
 */
var board = exports.board = {

  /**
   * Returns canvas width
   *
   * @returns {Number}
   */
  get width() {
    return canvas.width;
  },

  /**
   * Returns canvas height
   *
   * @returns {Number}
   */
  get height() {
    return canvas.height;
  },

  /**
   * Set the size of canvas
   *
   * @param {Number} w [w=800]
   * @param {Number} h [h=600]
   */
  setSize: function setSize() {
    var w = arguments.length <= 0 || arguments[0] === undefined ? 800 : arguments[0];
    var h = arguments.length <= 1 || arguments[1] === undefined ? 600 : arguments[1];

    canvas.width = w;
    canvas.height = h;
  },


  /**
   * Clear the canvas
   */
  render: function render() {
    ctx.clearRect(0, 0, this.width, this.height);
  }
};

exports.default = board;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bricks = exports.brick = undefined;

var _board = require("./board");

var _ball = require("./ball");

var _sound = require("./sound");

var _sound2 = _interopRequireDefault(_sound);

var _particle = require("./particle");

var _game = require("./game");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Bricks factory
 *
 * @param {Number} x [x=0]
 * @param {Number} y [y=0]
 */
var brick = exports.brick = function brick() {
  var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  return {
    posX: x,
    posY: y,

    height: 20,

    color: 'green',

    visible: true,

    /**
     * Calculating the brick width
     *
     * @returns {Number}
     */
    get width() {
      return (_board.board.width - bricks.offset * (bricks.columns - 1)) / bricks.columns;
    },

    /**
     * Set brick position
     *
     * @param {Number} x [x=0]
     * @param {Number} y [y=0]
     */
    setPosition: function setPosition() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      this.posX = x;
      this.posY = y;
    },


    /**
     * Returns the center X position of brick
     *
     * @returns {Number}
     */
    centerX: function centerX() {
      return this.posX + this.width / 2;
    },


    /**
     * Returns the center Y position of brick
     *
     * @returns {Number}
     */
    centerY: function centerY() {
      return this.posY + this.height / 2;
    },


    /**
     * Display the brick on canvas
     */
    render: function render() {
      _board.ctx.beginPath();
      _board.ctx.fillStyle = this.color;
      _board.ctx.fillRect(this.posX, this.posY, this.width, this.height);
      _board.ctx.closePath();
      _board.ctx.stroke();
    }
  };
};

/**
 * Bricks manipulation object
 */
var bricks = exports.bricks = {
  offset: 0,
  offsetTop: 60,

  rows: 6,

  maxBrickWidth: 100,

  list: [],

  /**
   * Calculate the columns count
   *
   * @returns {Number}
   */
  get columns() {
    return Math.floor(_board.board.width / this.maxBrickWidth);
  },

  /**
   * Get random color
   *
   * @returns {String}
   */
  getRandomColor: function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },


  /**
   * Drawing all bricks on canvas
   */
  build: function build() {

    this.list = [];

    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.columns; c++) {

        var b = brick();
        b.setPosition(c * (b.width + this.offset), this.offsetTop + (this.offset + b.height) * r);
        b.color = this.getRandomColor();
        b.render();

        this.list.push(b);
      }
    }
  },


  /**
   * Detecting collisions between ball and bricks
   */
  render: function render() {

    if (this.list.length - _game.game.score === 0) {
      _game.game.victory();
    }

    var collision = false;
    this.list = this.list.map(function (b) {

      if (b.visible === true) {

        if (_ball.ball.posX + _ball.ball.radius >= b.posX && _ball.ball.posX - _ball.ball.radius <= b.posX + b.width) {
          if (_ball.ball.posY < b.posY + b.height && _ball.ball.posY + _ball.ball.size > b.posY) {

            b.visible = false;

            if (!collision) {
              _ball.ball.speedY = -_ball.ball.speedY;
              collision = true;
            }

            _game.game.score++;

            if (_game.game.score % _game.game.multiplier === 0) {
              _ball.ball.speedX += _ball.ball.speedX < 0 ? -1 : 1;
              _ball.ball.speedY += _ball.ball.speedY < 0 ? -2 : 2;

              _game.game.levelUp();
            }

            _particle.particles.build(b.centerX(), b.centerY(), b.color);
            _sound2.default.play('collide', 'brick');
          }
        }

        b.render();
      }

      return b;
    });
  }
};

},{"./ball":2,"./board":3,"./game":6,"./particle":8,"./sound":10}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.restartButton = exports.startButton = undefined;

var _board = require("./board");

var _app = require("./app");

var _game = require("./game");

var startButton = exports.startButton = {
  width: 120,
  height: 40,

  render: function render() {
    this.posX = _board.board.width / 2 - this.width / 2;
    this.posY = _board.board.height / 2 - this.height / 2;

    _board.ctx.strokeStyle = "green";
    _board.ctx.lineWidth = 3;
    _board.ctx.strokeRect(this.posX, this.posY, this.width, this.height);

    _board.ctx.font = "18px Arial, sans-serif";
    _board.ctx.textAlign = "center";
    _board.ctx.textBaseline = "middle";
    _board.ctx.fillStyle = "green";
    _board.ctx.fillText("Start", _board.board.width / 2, _board.board.height / 2);
  }
};

var restartButton = exports.restartButton = {
  width: 120,
  height: 40,

  render: function render() {
    this.posX = _board.board.width / 2 - this.width / 2;
    this.posY = _board.board.height / 2 + 60;

    _board.ctx.strokeStyle = "green";
    _board.ctx.lineWidth = 3;
    _board.ctx.strokeRect(this.posX, this.posY, this.width, this.height);

    _board.ctx.font = "18px Arial, sans-serif";
    _board.ctx.textAlign = "center";
    _board.ctx.textBaseline = "middle";
    _board.ctx.fillStyle = "green";
    _board.ctx.fillText("New Game", _board.board.width / 2, _board.board.height / 2 + 80);
  }
};

// listeners
_board.canvas.addEventListener("mousedown", function (e) {
  var pageX = e.pageX;
  var pageY = e.pageY;


  if (_game.game.finished) {
    if (pageX >= restartButton.posX && pageX <= restartButton.posX + restartButton.width) {
      if (pageY >= restartButton.posY && pageY <= restartButton.posY + restartButton.height) {

        _game.game.init();
        (0, _app.animationLoop)();
      }
    }
  } else {
    if (pageX >= startButton.posX && pageX <= startButton.posX + startButton.width) {
      if (pageY >= startButton.posY && pageY <= startButton.posY + startButton.height) {
        (0, _app.animationLoop)();
      }
    }
  }
}, true);

},{"./app":1,"./board":3,"./game":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.game = undefined;

var _board = require("./board");

var _app = require("./app");

var _button = require("./button");

var _ball = require("./ball");

var _player = require("./player");

var _brick = require("./brick");

/**
 * Game's functions
 */
var game = exports.game = {
  score: 0,
  level: 1,

  multiplier: 10,

  textPadding: 10,

  finished: false,

  /**
   * Draw the first scene
   */
  init: function init() {

    this.score = 0;
    this.level = 1;

    var _window = window;
    var windowWidth = _window.innerWidth;
    var windowHeight = _window.innerHeight;


    _board.board.setSize(windowWidth, windowHeight);
    _board.board.render();

    _ball.ball.setPosition(200, _board.board.height / 3 * 2);
    _ball.ball.speedX = 4;
    _ball.ball.speedY = -8;
    _ball.ball.render();

    _player.player.setPosition(_board.board.width / 2 - _player.player.width / 2, _board.board.height - _player.player.height);
    _player.player.render();

    _brick.bricks.build();
  },


  /**
   * Increase the level
   */
  levelUp: function levelUp() {
    this.level++;
  },


  /**
   * Displaying the score of the game
   */
  displayScore: function displayScore() {
    _board.ctx.fillStyle = "black";
    _board.ctx.font = "18px Arial, sans-serif";
    _board.ctx.textAlign = "start";
    _board.ctx.textBaseline = "top";
    _board.ctx.fillText("Score: " + this.score, this.textPadding, this.textPadding);
  },


  /**
   * Displaying the level
   */
  displayLevel: function displayLevel() {
    _board.ctx.fillStyle = "black";
    _board.ctx.font = "18px Arial, sans-serif";
    _board.ctx.textAlign = "end";
    _board.ctx.textBaseline = "top";
    _board.ctx.fillText("Level: " + this.level, _board.board.width - this.textPadding, this.textPadding);
  },


  /**
   * Game over :(
   * Displaying the message
   * Stop the game loop
   */
  over: function over() {
    _board.ctx.fillStyle = "black";
    _board.ctx.font = "26px Arial, sans-serif";
    _board.ctx.textAlign = "center";
    _board.ctx.textBaseline = "middle";
    _board.ctx.fillText("Game Over", _board.board.width / 2, _board.board.height / 2 - 40);

    _board.ctx.fillStyle = "#212121";
    _board.ctx.font = "22px Arial, sans-serif";
    _board.ctx.fillText("Your score is " + this.score + " points!", _board.board.width / 2, _board.board.height / 2);
    _board.ctx.fillText("You reached level " + this.level, _board.board.width / 2, _board.board.height / 2 + 30);

    cancelAnimationFrame(_app.animation);
    this.finished = true;
    _button.restartButton.render();
  },


  /**
   * Victory!
   * Displaying the message
   * Stop the game loop
   */
  victory: function victory() {
    _board.ctx.fillStyle = "red";
    _board.ctx.font = "26px Arial, sans-serif";
    _board.ctx.textAlign = "center";
    _board.ctx.textBaseline = "middle";
    _board.ctx.fillText("Congratulations!", _board.board.width / 2, _board.board.height / 2 - 10);
    _board.ctx.fillText("You won", _board.board.width / 2, _board.board.height / 2 + 30);

    cancelAnimationFrame(_app.animation);
    this.finished = true;
    _button.restartButton.render();
  }
};

exports.default = game;

},{"./app":1,"./ball":2,"./board":3,"./brick":4,"./button":5,"./player":9}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mouse = undefined;

var _board = require("./board");

/**
 * Mouse control
 */
var mouse = exports.mouse = {
  posX: 0,
  posY: 0,

  /**
   * Set mouse position
   *
   * @param {Number} x [x=0]
   * @param {Number} y [y=0]
   */
  setPosition: function setPosition() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    this.posX = x;
    this.posY = y;
  }
};

// listeners
_board.canvas.addEventListener("mousemove", function (e) {
  return mouse.setPosition(e.pageX, e.pageY);
}, true);

exports.default = mouse;

},{"./board":3}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.particles = exports.particle = undefined;

var _board = require('./board');

/**
 * Particle factory function
 *
 * @param {Number} x [x=0]
 * @param {Number} y [y=0]
 * @param {String} c [c='black']
 */
var particle = exports.particle = function particle() {
  var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var c = arguments.length <= 2 || arguments[2] === undefined ? 'black' : arguments[2];
  return {
    posX: x,
    posY: y,

    speedX: -5 + Math.random() * 10,
    speedY: -5 + Math.random() * 10,

    color: c,

    radius: 3.5
  };
};

/**
 * Particles manipulation
 */
var particles = exports.particles = {
  count: 20,
  list: [],

  /**
   * Creating particles
   *
   * @param {Number} x [x=0]
   * @param {Number} y [y=0]
   * @param {String} color [c='black']
   */
  build: function build() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var color = arguments.length <= 2 || arguments[2] === undefined ? 'black' : arguments[2];

    for (var i = 0; i < this.count; i++) {
      this.list.push(particle(x, y, color));
    }
  },


  /**
   * Displaying the particles on board
   */
  emit: function emit() {

    this.list = this.list.filter(function (e) {
      return e.radius > 0;
    });
    this.list.map(function (p) {

      _board.ctx.beginPath();
      _board.ctx.fillStyle = p.color;
      if (p.radius > 0) {
        _board.ctx.arc(p.posX, p.posY, p.radius, 0, Math.PI * 2, false);
      }
      _board.ctx.fill();
      _board.ctx.closePath();

      p.posX += p.speedX;
      p.posY += p.speedY;

      p.radius = Math.max(p.radius - 0.2, 0.0);
    });
  }
};

},{"./board":3}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.player = undefined;

var _board = require("./board");

var _mouse = require("./mouse");

/**
 * Player (Paddle) object
 */
var player = exports.player = {
  posX: 0,
  posY: 0,

  lastPosX: 0,
  direction: 0,

  width: 120,
  height: 10,

  color: 'black',

  /**
   * Set player position
   *
   * @param {Number} x [x=0]
   * @param {Number} y [y=0]
   */
  setPosition: function setPosition() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    this.posX = x;
    this.posY = y;
  },


  /**
   * Mouse control
   */
  move: function move() {

    var left = _mouse.mouse.posX - this.width / 2;
    var right = _mouse.mouse.posX + this.width / 2;

    if (left < 0) {
      this.posX = 0;
    } else if (right > _board.board.width) {
      this.posX = _board.board.width - this.width;
    } else {
      this.posX = left;
    }

    this.detectDirection();
  },


  /**
   * Finding out the direction of movement
   */
  detectDirection: function detectDirection() {
    this.direction = this.posX === this.lastPosX ? 0 : this.posX > this.lastPosX ? 1 : -1;
    this.lastPosX = this.posX;
  },


  /**
   * Displaying the player on canvas
   */
  render: function render() {
    _board.ctx.beginPath();
    _board.ctx.fillStyle = this.color;
    _board.ctx.fillRect(this.posX, this.posY, this.width, this.height);
    _board.ctx.closePath();
    _board.ctx.stroke();
  }
};

exports.default = player;

},{"./board":3,"./mouse":7}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Sounds
 */
var sound = exports.sound = {
  sounds: {
    collide: {
      wall: document.getElementById('collide-walls'),
      player: document.getElementById('collide-player'),
      brick: document.getElementById('collide-brick')
    }
  },

  /**
   *
   * @param {String} action
   * @param {String} type
   * @returns {*|void}
   */
  play: function play(action, type) {

    if (this.sounds.hasOwnProperty(action) && this.sounds[action].hasOwnProperty(type)) {
      this.sounds[action][type].currentTime = 0;
      this.sounds[action][type].volume = 0.6;
      return this.sounds[action][type].play();
    }

    throw new Error('Sound with action: \'' + action + '\' and type: \'' + type + '\' is not defined');
  }
};

exports.default = sound;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYXBwLmpzIiwianNcXGJhbGwuanMiLCJqc1xcYm9hcmQuanMiLCJqc1xcYnJpY2suanMiLCJqc1xcYnV0dG9uLmpzIiwianNcXGdhbWUuanMiLCJqc1xcbW91c2UuanMiLCJqc1xccGFydGljbGUuanMiLCJqc1xccGxheWVyLmpzIiwianNcXHNvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFTyxJQUFJLGdDQUFZLElBQVo7OztBQUdYLGVBQUssSUFBTDtBQUNBLG9CQUFZLE1BQVo7Ozs7O0FBS0EsSUFBTSxZQUFZLFNBQVosU0FBWSxHQUFNOzs7QUFHdEIsTUFBSSxlQUFLLElBQUwsSUFBYSxDQUFiLEVBQWdCO0FBQ2xCLG1CQUFLLE1BQUwsR0FBYyxDQUFDLGVBQUssTUFBTCxDQURHO0FBRWxCLG9CQUFNLElBQU4sQ0FBVyxTQUFYLEVBQXNCLE1BQXRCLEVBRmtCO0dBQXBCOzs7QUFIc0IsTUFTbEIsZUFBSyxJQUFMLEdBQVksZUFBSyxJQUFMLElBQWEsYUFBTSxLQUFOLEVBQWE7QUFDeEMsbUJBQUssTUFBTCxHQUFjLENBQUMsZUFBSyxNQUFMLENBRHlCO0FBRXhDLG9CQUFNLElBQU4sQ0FBVyxTQUFYLEVBQXNCLE1BQXRCLEVBRndDO0dBQTFDOzs7QUFUc0IsTUFlbEIsZUFBSyxJQUFMLElBQWEsQ0FBYixFQUFnQjtBQUNsQixtQkFBSyxNQUFMLEdBQWMsQ0FBQyxlQUFLLE1BQUwsQ0FERztBQUVsQixvQkFBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixNQUF0QixFQUZrQjtHQUFwQjs7O0FBZnNCLE1BcUJsQixlQUFLLElBQUwsR0FBWSxlQUFLLE1BQUwsSUFBZSxpQkFBTyxJQUFQLElBQWUsZUFBSyxJQUFMLElBQWEsaUJBQU8sSUFB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Ozs7O0FBY0Esc0JBQUssUUFBUSxNQUFNOztBQUVqQixRQUFJLEtBQUssTUFBTCxDQUFZLGNBQVosQ0FBMkIsTUFBM0IsS0FBc0MsS0FBSyxNQUFMLENBQVksTUFBWixFQUFvQixjQUFwQixDQUFtQyxJQUFuQyxDQUF0QyxFQUFnRjtBQUNsRixXQUFLLE1BQUwsQ0FBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCLFdBQTFCLEdBQXdDLENBQXhDLENBRGtGO0FBRWxGLFdBQUssTUFBTCxDQUFZLE1BQVosRUFBb0IsSUFBcEIsRUFBMEIsTUFBMUIsR0FBbUMsR0FBbkMsQ0FGa0Y7QUFHbEYsYUFBTyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQVAsQ0FIa0Y7S0FBcEY7O0FBTUEsVUFBTSxJQUFJLEtBQUosMkJBQWlDLDZCQUFzQiwwQkFBdkQsQ0FBTixDQVJpQjtHQWZBO0NBQVI7O2tCQTJCRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xyXG5pbXBvcnQge2JvYXJkfSBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IGJhbGwgZnJvbSAnLi9iYWxsJztcclxuaW1wb3J0IHBsYXllciBmcm9tICcuL3BsYXllcic7XHJcbmltcG9ydCB7cGFydGljbGVzfSBmcm9tICcuL3BhcnRpY2xlJztcclxuaW1wb3J0IHticmlja3N9IGZyb20gJy4vYnJpY2snO1xyXG5pbXBvcnQgc291bmQgZnJvbSAnLi9zb3VuZCc7XHJcbmltcG9ydCB7c3RhcnRCdXR0b259IGZyb20gXCIuL2J1dHRvblwiO1xyXG5cclxuZXhwb3J0IGxldCBhbmltYXRpb24gPSBudWxsO1xyXG5cclxuLy8gSW5pdCBib2FyZFxyXG5nYW1lLmluaXQoKTtcclxuc3RhcnRCdXR0b24ucmVuZGVyKCk7XHJcblxyXG4vKipcclxuICogRGV0ZWN0aW5nIHRoZSBjb2xsaXNpb24gYmV0d2VlbiBwbGF5ZXIgYW5kIGJhbGxcclxuICovXHJcbmNvbnN0IGNvbGxpc2lvbiA9ICgpID0+IHtcclxuXHJcbiAgLy8gdG9wXHJcbiAgaWYgKGJhbGwucG9zWSA8PSAwKSB7XHJcbiAgICBiYWxsLnNwZWVkWSA9IC1iYWxsLnNwZWVkWTtcclxuICAgIHNvdW5kLnBsYXkoJ2NvbGxpZGUnLCAnd2FsbCcpO1xyXG4gIH1cclxuXHJcbiAgLy8gcmlnaHRcclxuICBpZiAoYmFsbC5wb3NYICsgYmFsbC5zaXplID49IGJvYXJkLndpZHRoKSB7XHJcbiAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgIHNvdW5kLnBsYXkoJ2NvbGxpZGUnLCAnd2FsbCcpO1xyXG4gIH1cclxuXHJcbiAgLy8gbGVmdFxyXG4gIGlmIChiYWxsLnBvc1ggPD0gMCkge1xyXG4gICAgYmFsbC5zcGVlZFggPSAtYmFsbC5zcGVlZFg7XHJcbiAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ3dhbGwnKTtcclxuICB9XHJcblxyXG4gIC8vIHBsYXllciBvciBnYW1lIG92ZXIgOihcclxuICBpZiAoYmFsbC5wb3NYICsgYmFsbC5yYWRpdXMgPj0gcGxheWVyLnBvc1ggJiYgYmFsbC5wb3NYIDw9IHBsYXllci5wb3NYICsgcGxheWVyLndpZHRoICYmIGJhbGwucG9zWSArIGJhbGwuc2l6ZSA+PSBwbGF5ZXIucG9zWSkge1xyXG5cclxuICAgIGlmIChwbGF5ZXIuZGlyZWN0aW9uID09PSAtMSAmJiBiYWxsLnNwZWVkWCA+IDApIHtcclxuICAgICAgYmFsbC5zcGVlZFggPSAtYmFsbC5zcGVlZFg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBsYXllci5kaXJlY3Rpb24gPT09IDEgJiYgYmFsbC5zcGVlZFggPCAwKSB7XHJcbiAgICAgIGJhbGwuc3BlZWRYID0gLWJhbGwuc3BlZWRYO1xyXG4gICAgfVxyXG5cclxuICAgIGJhbGwuc3BlZWRZID0gLWJhbGwuc3BlZWRZO1xyXG5cclxuICAgIHBhcnRpY2xlcy5idWlsZChiYWxsLnBvc1ggKyBiYWxsLnJhZGl1cywgYmFsbC5wb3NZICsgYmFsbC5zaXplLCAnYmxhY2snKTtcclxuICAgIHNvdW5kLnBsYXkoJ2NvbGxpZGUnLCAncGxheWVyJylcclxuXHJcbiAgfSBlbHNlIGlmIChiYWxsLnBvc1kgKyBiYWxsLnNpemUgPj0gYm9hcmQuaGVpZ2h0KSB7XHJcbiAgICBiYWxsLnBvc1kgPSBib2FyZC5oZWlnaHQgLSBiYWxsLnNpemU7XHJcbiAgICBnYW1lLm92ZXIoKTtcclxuICB9XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIFVwZGF0aW5nIHRoZSBjYW52YXNcclxuICovXHJcbmNvbnN0IGRyYXcgPSAoKSA9PiB7XHJcblxyXG4gIGJvYXJkLnJlbmRlcigpO1xyXG4gIGJyaWNrcy5yZW5kZXIoKTtcclxuXHJcbiAgZ2FtZS5kaXNwbGF5U2NvcmUoKTtcclxuICBnYW1lLmRpc3BsYXlMZXZlbCgpO1xyXG5cclxuICBjb2xsaXNpb24oKTtcclxuXHJcbiAgYmFsbC5tb3ZlKCk7XHJcbiAgYmFsbC5yZW5kZXIoKTtcclxuXHJcbiAgcGFydGljbGVzLmVtaXQoKTtcclxuXHJcbiAgcGxheWVyLm1vdmUoKTtcclxuICBwbGF5ZXIucmVuZGVyKCk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIE1haW4gZ2FtZSBsb29wXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYW5pbWF0aW9uTG9vcCA9ICgpID0+IHtcclxuICBhbmltYXRpb24gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XHJcbiAgZHJhdygpO1xyXG59O1xyXG4iLCJpbXBvcnQge2N0eH0gZnJvbSAnLi9ib2FyZCc7XHJcblxyXG4vKipcclxuICogQmFsbCBvYmplY3RcclxuICovXHJcbmV4cG9ydCBjb25zdCBiYWxsID0ge1xyXG4gIHBvc1g6IDQwLFxyXG4gIHBvc1k6IDQwLFxyXG5cclxuICBzcGVlZFg6IDQsXHJcbiAgc3BlZWRZOiAtOCxcclxuXHJcbiAgaW1hZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFsbFwiKSxcclxuXHJcbiAgd2lkdGg6IDIwLFxyXG4gIGhlaWdodDogMjAsXHJcblxyXG4gIGFuZ2xlOiAwLFxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIGRpYW1ldGVyIG9mIGJhbGxcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0IHNpemUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBHZXQgdGhlIHJhZGl1cyBvZiBiYWxsXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldCByYWRpdXMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy53aWR0aCAvIDI7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGJhbGwgcG9zaXRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IFt4PTBdXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgW3k9MF1cclxuICAgKi9cclxuICBzZXRQb3NpdGlvbih4ID0gMCwgeSA9IDApIHtcclxuICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICB0aGlzLnBvc1kgPSB5O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vdmUgYSBiYWxsXHJcbiAgICovXHJcbiAgbW92ZSgpIHtcclxuICAgIHRoaXMucG9zWCArPSB0aGlzLnNwZWVkWDtcclxuICAgIHRoaXMucG9zWSArPSB0aGlzLnNwZWVkWTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBSZW5kZXIgdGhlIGJhbGxcclxuICAgKi9cclxuICByZW5kZXIoKSB7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnBvc1ggKyB0aGlzLnJhZGl1cywgdGhpcy5wb3NZICsgdGhpcy5yYWRpdXMpO1xyXG4gICAgY3R4LnJvdGF0ZSh0aGlzLmFuZ2xlICogTWF0aC5QSSAvIDE4MCk7XHJcbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIC10aGlzLndpZHRoIC8gMiwgLXRoaXMuaGVpZ2h0IC8gMiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICB0aGlzLmFuZ2xlICs9IHRoaXMuc3BlZWRYICogMjtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBiYWxsOyIsIi8qKlxyXG4gKiBDYW52YXMgdGFnXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKTtcclxuXHJcbi8qKlxyXG4gKiBDb250ZXh0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5cclxuLyoqXHJcbiAqIEdhbWUgYm9hcmRcclxuICovXHJcbmV4cG9ydCBjb25zdCBib2FyZCA9IHtcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBjYW52YXMgd2lkdGhcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0IHdpZHRoKCkge1xyXG4gICAgcmV0dXJuIGNhbnZhcy53aWR0aDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGNhbnZhcyBoZWlnaHRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0IGhlaWdodCgpIHtcclxuICAgIHJldHVybiBjYW52YXMuaGVpZ2h0O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgc2l6ZSBvZiBjYW52YXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3IFt3PTgwMF1cclxuICAgKiBAcGFyYW0ge051bWJlcn0gaCBbaD02MDBdXHJcbiAgICovXHJcbiAgc2V0U2l6ZSh3ID0gODAwLCBoID0gNjAwKSB7XHJcbiAgICBjYW52YXMud2lkdGggPSB3O1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGg7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ2xlYXIgdGhlIGNhbnZhc1xyXG4gICAqL1xyXG4gIHJlbmRlcigpIHtcclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBib2FyZDsiLCJpbXBvcnQge2N0eCwgYm9hcmR9IGZyb20gJy4vYm9hcmQnO1xyXG5pbXBvcnQge2JhbGx9IGZyb20gXCIuL2JhbGxcIjtcclxuaW1wb3J0IHNvdW5kIGZyb20gXCIuL3NvdW5kXCI7XHJcbmltcG9ydCB7cGFydGljbGVzfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQge2dhbWV9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbi8qKlxyXG4gKiBCcmlja3MgZmFjdG9yeVxyXG4gKlxyXG4gKiBAcGFyYW0ge051bWJlcn0geCBbeD0wXVxyXG4gKiBAcGFyYW0ge051bWJlcn0geSBbeT0wXVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGJyaWNrID0gKHggPSAwLCB5ID0gMCkgPT4gKHtcclxuICBwb3NYOiB4LFxyXG4gIHBvc1k6IHksXHJcblxyXG4gIGhlaWdodDogMjAsXHJcblxyXG4gIGNvbG9yOiAnZ3JlZW4nLFxyXG5cclxuICB2aXNpYmxlOiB0cnVlLFxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGluZyB0aGUgYnJpY2sgd2lkdGhcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0IHdpZHRoKCkge1xyXG4gICAgcmV0dXJuIChib2FyZC53aWR0aCAtIGJyaWNrcy5vZmZzZXQgKiAoYnJpY2tzLmNvbHVtbnMgLSAxKSkgLyBicmlja3MuY29sdW1ucztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBTZXQgYnJpY2sgcG9zaXRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IFt4PTBdXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgW3k9MF1cclxuICAgKi9cclxuICBzZXRQb3NpdGlvbih4ID0gMCwgeSA9IDApIHtcclxuICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICB0aGlzLnBvc1kgPSB5O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGNlbnRlciBYIHBvc2l0aW9uIG9mIGJyaWNrXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGNlbnRlclgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3NYICsgdGhpcy53aWR0aCAvIDI7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY2VudGVyIFkgcG9zaXRpb24gb2YgYnJpY2tcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgY2VudGVyWSgpIHtcclxuICAgIHJldHVybiB0aGlzLnBvc1kgKyB0aGlzLmhlaWdodCAvIDI7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGxheSB0aGUgYnJpY2sgb24gY2FudmFzXHJcbiAgICovXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NYLCB0aGlzLnBvc1ksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGN0eC5zdHJva2UoKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEJyaWNrcyBtYW5pcHVsYXRpb24gb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYnJpY2tzID0ge1xyXG4gIG9mZnNldDogMCxcclxuICBvZmZzZXRUb3A6IDYwLFxyXG5cclxuICByb3dzOiA2LFxyXG5cclxuICBtYXhCcmlja1dpZHRoOiAxMDAsXHJcblxyXG4gIGxpc3Q6IFtdLFxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGUgdGhlIGNvbHVtbnMgY291bnRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0IGNvbHVtbnMoKSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihib2FyZC53aWR0aCAvIHRoaXMubWF4QnJpY2tXaWR0aCk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHJhbmRvbSBjb2xvclxyXG4gICAqXHJcbiAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgKi9cclxuICBnZXRSYW5kb21Db2xvcigpIHtcclxuICAgIHZhciBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKTtcclxuICAgIHZhciBjb2xvciA9ICcjJztcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrKSB7XHJcbiAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYpXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb2xvcjtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBEcmF3aW5nIGFsbCBicmlja3Mgb24gY2FudmFzXHJcbiAgICovXHJcbiAgYnVpbGQoKSB7XHJcblxyXG4gICAgdGhpcy5saXN0ID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgciA9IDA7IHIgPCB0aGlzLnJvd3M7IHIrKykge1xyXG4gICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHRoaXMuY29sdW1uczsgYysrKSB7XHJcblxyXG4gICAgICAgIGxldCBiID0gYnJpY2soKTtcclxuICAgICAgICBiLnNldFBvc2l0aW9uKGMgKiAoYi53aWR0aCArIHRoaXMub2Zmc2V0KSwgdGhpcy5vZmZzZXRUb3AgKyAoKHRoaXMub2Zmc2V0ICsgYi5oZWlnaHQpICogcikpO1xyXG4gICAgICAgIGIuY29sb3IgPSB0aGlzLmdldFJhbmRvbUNvbG9yKCk7XHJcbiAgICAgICAgYi5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0LnB1c2goYik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBEZXRlY3RpbmcgY29sbGlzaW9ucyBiZXR3ZWVuIGJhbGwgYW5kIGJyaWNrc1xyXG4gICAqL1xyXG4gIHJlbmRlcigpIHtcclxuXHJcbiAgICBpZiAodGhpcy5saXN0Lmxlbmd0aCAtIGdhbWUuc2NvcmUgPT09IDApIHtcclxuICAgICAgZ2FtZS52aWN0b3J5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNvbGxpc2lvbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5saXN0ID0gdGhpcy5saXN0Lm1hcChiID0+IHtcclxuXHJcbiAgICAgIGlmIChiLnZpc2libGUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgaWYgKGJhbGwucG9zWCArIGJhbGwucmFkaXVzID49IGIucG9zWCAmJiBiYWxsLnBvc1ggLSBiYWxsLnJhZGl1cyA8PSBiLnBvc1ggKyBiLndpZHRoKSB7XHJcbiAgICAgICAgICBpZiAoYmFsbC5wb3NZIDwgYi5wb3NZICsgYi5oZWlnaHQgJiYgYmFsbC5wb3NZICsgYmFsbC5zaXplID4gYi5wb3NZKSB7XHJcblxyXG4gICAgICAgICAgICBiLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghY29sbGlzaW9uKSB7XHJcbiAgICAgICAgICAgICAgYmFsbC5zcGVlZFkgPSAtYmFsbC5zcGVlZFk7XHJcbiAgICAgICAgICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZ2FtZS5zY29yZSsrO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdhbWUuc2NvcmUgJSBnYW1lLm11bHRpcGxpZXIgPT09IDApIHtcclxuICAgICAgICAgICAgICBiYWxsLnNwZWVkWCArPSAoYmFsbC5zcGVlZFggPCAwKSA/IC0xIDogMTtcclxuICAgICAgICAgICAgICBiYWxsLnNwZWVkWSArPSAoYmFsbC5zcGVlZFkgPCAwKSA/IC0yIDogMjtcclxuXHJcbiAgICAgICAgICAgICAgZ2FtZS5sZXZlbFVwKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBhcnRpY2xlcy5idWlsZChiLmNlbnRlclgoKSwgYi5jZW50ZXJZKCksIGIuY29sb3IpO1xyXG4gICAgICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ2JyaWNrJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiLnJlbmRlcigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gYjtcclxuICAgIH0pXHJcbiAgfVxyXG59OyIsImltcG9ydCB7Ym9hcmQsIGN0eCwgY2FudmFzfSBmcm9tIFwiLi9ib2FyZFwiO1xyXG5pbXBvcnQge2FuaW1hdGlvbkxvb3B9IGZyb20gXCIuL2FwcFwiO1xyXG5pbXBvcnQge2dhbWV9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBzdGFydEJ1dHRvbiA9IHtcclxuICB3aWR0aDogMTIwLFxyXG4gIGhlaWdodDogNDAsXHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHRoaXMucG9zWCA9IGJvYXJkLndpZHRoIC8gMiAtIHRoaXMud2lkdGggLyAyO1xyXG4gICAgdGhpcy5wb3NZID0gIGJvYXJkLmhlaWdodCAvIDIgLSB0aGlzLmhlaWdodCAvIDI7XHJcblxyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCJncmVlblwiO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IDM7XHJcbiAgICBjdHguc3Ryb2tlUmVjdCh0aGlzLnBvc1gsIHRoaXMucG9zWSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuICAgIGN0eC5mb250ID0gXCIxOHB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JlZW5cIjtcclxuICAgIGN0eC5maWxsVGV4dChcIlN0YXJ0XCIsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMiApO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCByZXN0YXJ0QnV0dG9uID0ge1xyXG4gIHdpZHRoOiAxMjAsXHJcbiAgaGVpZ2h0OiA0MCxcclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdGhpcy5wb3NYID0gYm9hcmQud2lkdGggLyAyIC0gdGhpcy53aWR0aCAvIDI7XHJcbiAgICB0aGlzLnBvc1kgPSAgYm9hcmQuaGVpZ2h0IC8gMiArIDYwO1xyXG5cclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiZ3JlZW5cIjtcclxuICAgIGN0eC5saW5lV2lkdGggPSAzO1xyXG4gICAgY3R4LnN0cm9rZVJlY3QodGhpcy5wb3NYLCB0aGlzLnBvc1ksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICBjdHguZm9udCA9IFwiMThweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgICBjdHguZmlsbFRleHQoXCJOZXcgR2FtZVwiLCBib2FyZC53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAvIDIgKyA4MCApO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG4vLyBsaXN0ZW5lcnNcclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcclxuICBjb25zdCB7cGFnZVgsIHBhZ2VZfSA9IGU7XHJcblxyXG4gIGlmIChnYW1lLmZpbmlzaGVkKSB7XHJcbiAgICBpZiAocGFnZVggPj0gcmVzdGFydEJ1dHRvbi5wb3NYICYmIHBhZ2VYIDw9IHJlc3RhcnRCdXR0b24ucG9zWCArIHJlc3RhcnRCdXR0b24ud2lkdGgpIHtcclxuICAgICAgaWYgKHBhZ2VZID49IHJlc3RhcnRCdXR0b24ucG9zWSAmJiBwYWdlWSA8PSByZXN0YXJ0QnV0dG9uLnBvc1kgKyByZXN0YXJ0QnV0dG9uLmhlaWdodCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGdhbWUuaW5pdCgpO1xyXG4gICAgICAgIGFuaW1hdGlvbkxvb3AoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAocGFnZVggPj0gc3RhcnRCdXR0b24ucG9zWCAmJiBwYWdlWCA8PSBzdGFydEJ1dHRvbi5wb3NYICsgc3RhcnRCdXR0b24ud2lkdGgpIHtcclxuICAgICAgaWYgKHBhZ2VZID49IHN0YXJ0QnV0dG9uLnBvc1kgJiYgcGFnZVkgPD0gc3RhcnRCdXR0b24ucG9zWSArIHN0YXJ0QnV0dG9uLmhlaWdodCkge1xyXG4gICAgICAgIGFuaW1hdGlvbkxvb3AoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSwgdHJ1ZSk7XHJcbiIsImltcG9ydCB7Ym9hcmQsIGN0eH0gZnJvbSBcIi4vYm9hcmRcIjtcclxuaW1wb3J0IHthbmltYXRpb259IGZyb20gXCIuL2FwcFwiO1xyXG5pbXBvcnQge3Jlc3RhcnRCdXR0b259IGZyb20gXCIuL2J1dHRvblwiO1xyXG5pbXBvcnQge2JhbGx9IGZyb20gXCIuL2JhbGxcIjtcclxuaW1wb3J0IHtwbGF5ZXJ9IGZyb20gXCIuL3BsYXllclwiO1xyXG5pbXBvcnQge2JyaWNrc30gZnJvbSBcIi4vYnJpY2tcIjtcclxuXHJcbi8qKlxyXG4gKiBHYW1lJ3MgZnVuY3Rpb25zXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ2FtZSA9IHtcclxuICBzY29yZTogMCxcclxuICBsZXZlbDogMSxcclxuXHJcbiAgbXVsdGlwbGllcjogMTAsXHJcblxyXG4gIHRleHRQYWRkaW5nOiAxMCxcclxuXHJcbiAgZmluaXNoZWQ6IGZhbHNlLFxyXG5cclxuICAvKipcclxuICAgKiBEcmF3IHRoZSBmaXJzdCBzY2VuZVxyXG4gICAqL1xyXG4gIGluaXQoKSB7XHJcblxyXG4gICAgdGhpcy5zY29yZSA9IDA7XHJcbiAgICB0aGlzLmxldmVsID0gMTtcclxuXHJcbiAgICBsZXQge1xyXG4gICAgICBpbm5lcldpZHRoOiB3aW5kb3dXaWR0aCxcclxuICAgICAgaW5uZXJIZWlnaHQ6IHdpbmRvd0hlaWdodFxyXG4gICAgfSA9IHdpbmRvdztcclxuXHJcbiAgICBib2FyZC5zZXRTaXplKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xyXG4gICAgYm9hcmQucmVuZGVyKCk7XHJcblxyXG4gICAgYmFsbC5zZXRQb3NpdGlvbigyMDAsIGJvYXJkLmhlaWdodCAvIDMgKiAyKTtcclxuICAgIGJhbGwuc3BlZWRYID0gNDtcclxuICAgIGJhbGwuc3BlZWRZID0gLTg7XHJcbiAgICBiYWxsLnJlbmRlcigpO1xyXG5cclxuICAgIHBsYXllci5zZXRQb3NpdGlvbihib2FyZC53aWR0aCAvIDIgLSBwbGF5ZXIud2lkdGggLyAyLCBib2FyZC5oZWlnaHQgLSBwbGF5ZXIuaGVpZ2h0KTtcclxuICAgIHBsYXllci5yZW5kZXIoKTtcclxuXHJcbiAgICBicmlja3MuYnVpbGQoKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBJbmNyZWFzZSB0aGUgbGV2ZWxcclxuICAgKi9cclxuICBsZXZlbFVwKCkge1xyXG4gICAgdGhpcy5sZXZlbCsrO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BsYXlpbmcgdGhlIHNjb3JlIG9mIHRoZSBnYW1lXHJcbiAgICovXHJcbiAgZGlzcGxheVNjb3JlKCkge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC5mb250ID0gXCIxOHB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJzdGFydFwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XHJcbiAgICBjdHguZmlsbFRleHQoYFNjb3JlOiAke3RoaXMuc2NvcmV9YCwgdGhpcy50ZXh0UGFkZGluZywgdGhpcy50ZXh0UGFkZGluZyk7XHJcblxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BsYXlpbmcgdGhlIGxldmVsXHJcbiAgICovXHJcbiAgZGlzcGxheUxldmVsKCkge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC5mb250ID0gXCIxOHB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJlbmRcIjtcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KGBMZXZlbDogJHt0aGlzLmxldmVsfWAsIGJvYXJkLndpZHRoIC0gdGhpcy50ZXh0UGFkZGluZywgdGhpcy50ZXh0UGFkZGluZyk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogR2FtZSBvdmVyIDooXHJcbiAgICogRGlzcGxheWluZyB0aGUgbWVzc2FnZVxyXG4gICAqIFN0b3AgdGhlIGdhbWUgbG9vcFxyXG4gICAqL1xyXG4gIG92ZXIoKSB7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LmZvbnQgPSBcIjI2cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICBjdHguZmlsbFRleHQoYEdhbWUgT3ZlcmAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMiAtIDQwKTtcclxuXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjMjEyMTIxXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMjJweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KGBZb3VyIHNjb3JlIGlzICR7dGhpcy5zY29yZX0gcG9pbnRzIWAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMik7XHJcbiAgICBjdHguZmlsbFRleHQoYFlvdSByZWFjaGVkIGxldmVsICR7dGhpcy5sZXZlbH1gLCBib2FyZC53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAvIDIgKyAzMCk7XHJcblxyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcclxuICAgIHRoaXMuZmluaXNoZWQgPSB0cnVlO1xyXG4gICAgcmVzdGFydEJ1dHRvbi5yZW5kZXIoKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBWaWN0b3J5IVxyXG4gICAqIERpc3BsYXlpbmcgdGhlIG1lc3NhZ2VcclxuICAgKiBTdG9wIHRoZSBnYW1lIGxvb3BcclxuICAgKi9cclxuICB2aWN0b3J5KCkge1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICBjdHguZm9udCA9IFwiMjZweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgIGN0eC5maWxsVGV4dChgQ29uZ3JhdHVsYXRpb25zIWAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMiAtIDEwKTtcclxuICAgIGN0eC5maWxsVGV4dChgWW91IHdvbmAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMiArIDMwKTtcclxuXHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xyXG4gICAgdGhpcy5maW5pc2hlZCA9IHRydWU7XHJcbiAgICByZXN0YXJ0QnV0dG9uLnJlbmRlcigpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdhbWU7XHJcbiIsImltcG9ydCB7Y2FudmFzfSBmcm9tICcuL2JvYXJkJztcclxuXHJcbi8qKlxyXG4gKiBNb3VzZSBjb250cm9sXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbW91c2UgPSB7XHJcbiAgcG9zWDogMCxcclxuICBwb3NZOiAwLFxyXG5cclxuICAvKipcclxuICAgKiBTZXQgbW91c2UgcG9zaXRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IFt4PTBdXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgW3k9MF1cclxuICAgKi9cclxuICBzZXRQb3NpdGlvbih4ID0gMCwgeSA9IDApIHtcclxuICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICB0aGlzLnBvc1kgPSB5O1xyXG4gIH1cclxufTtcclxuXHJcbi8vIGxpc3RlbmVyc1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4gbW91c2Uuc2V0UG9zaXRpb24oZS5wYWdlWCwgZS5wYWdlWSksIHRydWUpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW91c2U7IiwiaW1wb3J0IHtjdHh9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuLyoqXHJcbiAqIFBhcnRpY2xlIGZhY3RvcnkgZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIHtOdW1iZXJ9IHggW3g9MF1cclxuICogQHBhcmFtIHtOdW1iZXJ9IHkgW3k9MF1cclxuICogQHBhcmFtIHtTdHJpbmd9IGMgW2M9J2JsYWNrJ11cclxuICovXHJcbmV4cG9ydCBjb25zdCBwYXJ0aWNsZSA9ICh4ID0gMCwgeSA9IDAsIGMgPSAnYmxhY2snKSA9PiAoe1xyXG4gIHBvc1g6IHgsXHJcbiAgcG9zWTogeSxcclxuXHJcbiAgc3BlZWRYOiAtNSArIE1hdGgucmFuZG9tKCkgKiAxMCxcclxuICBzcGVlZFk6IC01ICsgTWF0aC5yYW5kb20oKSAqIDEwLFxyXG5cclxuICBjb2xvcjogYyxcclxuXHJcbiAgcmFkaXVzOiAzLjVcclxufSk7XHJcblxyXG4vKipcclxuICogUGFydGljbGVzIG1hbmlwdWxhdGlvblxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHBhcnRpY2xlcyA9IHtcclxuICBjb3VudDogMjAsXHJcbiAgbGlzdDogW10sXHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0aW5nIHBhcnRpY2xlc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggW3g9MF1cclxuICAgKiBAcGFyYW0ge051bWJlcn0geSBbeT0wXVxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBbYz0nYmxhY2snXVxyXG4gICAqL1xyXG4gIGJ1aWxkKHggPSAwLCB5ID0gMCwgY29sb3IgPSAnYmxhY2snKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY291bnQ7IGkrKykge1xyXG4gICAgICB0aGlzLmxpc3QucHVzaChwYXJ0aWNsZSh4LCB5LCBjb2xvcikpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIERpc3BsYXlpbmcgdGhlIHBhcnRpY2xlcyBvbiBib2FyZFxyXG4gICAqL1xyXG4gIGVtaXQoKSB7XHJcblxyXG4gICAgdGhpcy5saXN0ID0gdGhpcy5saXN0LmZpbHRlcihlID0+IGUucmFkaXVzID4gMCk7XHJcbiAgICB0aGlzLmxpc3QubWFwKHAgPT4ge1xyXG5cclxuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICBjdHguZmlsbFN0eWxlID0gcC5jb2xvcjtcclxuICAgICAgaWYgKHAucmFkaXVzID4gMCkge1xyXG4gICAgICAgIGN0eC5hcmMocC5wb3NYLCBwLnBvc1ksIHAucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgIHAucG9zWCArPSBwLnNwZWVkWDtcclxuICAgICAgcC5wb3NZICs9IHAuc3BlZWRZO1xyXG5cclxuICAgICAgcC5yYWRpdXMgPSBNYXRoLm1heChwLnJhZGl1cyAtIDAuMiwgMC4wKTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbiIsImltcG9ydCB7Y3R4fSBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IHttb3VzZX0gZnJvbSBcIi4vbW91c2VcIjtcclxuaW1wb3J0IHtib2FyZH0gZnJvbSBcIi4vYm9hcmRcIjtcclxuXHJcbi8qKlxyXG4gKiBQbGF5ZXIgKFBhZGRsZSkgb2JqZWN0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcGxheWVyID0ge1xyXG4gIHBvc1g6IDAsXHJcbiAgcG9zWTogMCxcclxuXHJcbiAgbGFzdFBvc1g6IDAsXHJcbiAgZGlyZWN0aW9uOiAwLFxyXG5cclxuICB3aWR0aDogMTIwLFxyXG4gIGhlaWdodDogMTAsXHJcblxyXG4gIGNvbG9yOiAnYmxhY2snLFxyXG5cclxuICAvKipcclxuICAgKiBTZXQgcGxheWVyIHBvc2l0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0geCBbeD0wXVxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5IFt5PTBdXHJcbiAgICovXHJcbiAgc2V0UG9zaXRpb24oeCA9IDAsIHkgPSAwKSB7XHJcbiAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgdGhpcy5wb3NZID0geTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNb3VzZSBjb250cm9sXHJcbiAgICovXHJcbiAgbW92ZSgpIHtcclxuXHJcbiAgICBjb25zdCBsZWZ0ID0gbW91c2UucG9zWCAtIHRoaXMud2lkdGggLyAyO1xyXG4gICAgY29uc3QgcmlnaHQgPSBtb3VzZS5wb3NYICsgdGhpcy53aWR0aCAvIDI7XHJcblxyXG4gICAgaWYgKGxlZnQgPCAwKSB7XHJcbiAgICAgIHRoaXMucG9zWCA9IDA7XHJcbiAgICB9IGVsc2UgaWYgKHJpZ2h0ID4gYm9hcmQud2lkdGgpIHtcclxuICAgICAgdGhpcy5wb3NYID0gYm9hcmQud2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5wb3NYID0gbGVmdDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRldGVjdERpcmVjdGlvbigpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbmRpbmcgb3V0IHRoZSBkaXJlY3Rpb24gb2YgbW92ZW1lbnRcclxuICAgKi9cclxuICBkZXRlY3REaXJlY3Rpb24oKSB7XHJcbiAgICB0aGlzLmRpcmVjdGlvbiA9ICh0aGlzLnBvc1ggPT09IHRoaXMubGFzdFBvc1gpID8gMCA6ICh0aGlzLnBvc1ggPiB0aGlzLmxhc3RQb3NYKSA/IDEgOiAtMTtcclxuICAgIHRoaXMubGFzdFBvc1ggPSB0aGlzLnBvc1g7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRGlzcGxheWluZyB0aGUgcGxheWVyIG9uIGNhbnZhc1xyXG4gICAqL1xyXG4gIHJlbmRlcigpIHtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcGxheWVyOyIsIi8qKlxyXG4gKiBTb3VuZHNcclxuICovXHJcbmV4cG9ydCBjb25zdCBzb3VuZCA9IHtcclxuICBzb3VuZHM6IHtcclxuICAgIGNvbGxpZGU6IHtcclxuICAgICAgd2FsbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxpZGUtd2FsbHMnKSxcclxuICAgICAgcGxheWVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sbGlkZS1wbGF5ZXInKSxcclxuICAgICAgYnJpY2s6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xsaWRlLWJyaWNrJylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxyXG4gICAqIEByZXR1cm5zIHsqfHZvaWR9XHJcbiAgICovXHJcbiAgcGxheShhY3Rpb24sIHR5cGUpIHtcclxuXHJcbiAgICBpZiAodGhpcy5zb3VuZHMuaGFzT3duUHJvcGVydHkoYWN0aW9uKSAmJiB0aGlzLnNvdW5kc1thY3Rpb25dLmhhc093blByb3BlcnR5KHR5cGUpKSB7XHJcbiAgICAgIHRoaXMuc291bmRzW2FjdGlvbl1bdHlwZV0uY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICB0aGlzLnNvdW5kc1thY3Rpb25dW3R5cGVdLnZvbHVtZSA9IDAuNjtcclxuICAgICAgcmV0dXJuIHRoaXMuc291bmRzW2FjdGlvbl1bdHlwZV0ucGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRocm93IG5ldyBFcnJvcihgU291bmQgd2l0aCBhY3Rpb246ICcke2FjdGlvbn0nIGFuZCB0eXBlOiAnJHt0eXBlfScgaXMgbm90IGRlZmluZWRgKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzb3VuZDsiXX0=
