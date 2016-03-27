(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animation = undefined;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _window = window;
var windowWidth = _window.innerWidth;
var windowHeight = _window.innerHeight;
var animation = exports.animation = null;

// Init board
_board.board.setSize(windowWidth, windowHeight);
_board.board.render();

_ball2.default.setPosition(200, _board.board.height / 3 * 2);
_ball2.default.render();
//
_player2.default.setPosition(_board.board.width / 2 - _player2.default.width / 2, _board.board.height - _player2.default.height);
_player2.default.render();
//
_brick.bricks.build();

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
var animationLoop = function animationLoop() {
    exports.animation = animation = requestAnimationFrame(animationLoop);
    draw();
};

animationLoop();

},{"./ball":2,"./board":3,"./brick":4,"./game":5,"./particle":7,"./player":8,"./sound":9}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ball = undefined;

var _board = require("./board");

/**
 * Ball object
 *
 * @type {{
 *  posX: Number,
 *  posY: Number,
 *  speedX: Number,
 *  speedY: Number,
 *  image: Element,
 *  width: Number,
 *  height: Number,
 *  angle: Number,
 *  size, center,
 *  setPosition: (function(Number=, Number=)),
 *  move: (function()),
 *  render: (function())
 * }}
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
 * 
 * @type {{
 *  width, height, 
 *  setSize: (function(Number=, Number=)),
 *  render: (function())
 * }}
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
 * 
 * @type {{
 *  offset: Number, 
 *  offsetTop: Number, 
 *  rows: Number, 
 *  maxBrickWidth: Number, 
 *  list: Array, 
 *  columns, 
 *  getRandomColor: (function()), 
 *  build: (function()), 
 *  render: (function())
 * }}
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

},{"./ball":2,"./board":3,"./game":5,"./particle":7,"./sound":9}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.game = undefined;

var _board = require("./board");

var _app = require("./app");

/**
 * Game's functions
 *
 * @type {{
 *  score: Number,
 *  level: Number,
 *  multiplier: Number,
 *  textPadding: Number,
 *  levelUp: (function()),
 *  displayScore: (function()),
 *  displayLevel: (function()),
 *  over: (function()),
 *  victory: (function())
 * }}
 */
var game = exports.game = {
    score: 0,
    level: 1,

    multiplier: 4,

    textPadding: 10,

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
        _board.ctx.fillText("Congratulations!", _board.board.width / 2, _board.board.height / 2);
        _board.ctx.fillText("You won", _board.board.width / 2, _board.board.height / 2 + 40);

        cancelAnimationFrame(_app.animation);
    }
};

exports.default = game;

},{"./app":1,"./board":3}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mouse = undefined;

var _board = require("./board");

/**
 *
 * @type {{
 *  posX: Number, 
 *  posY: Number,
 *  setPosition: (function(Number=, Number=))
 * }}
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

},{"./board":3}],7:[function(require,module,exports){
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
 * Particles manipulation object
 *
 * @type {{
 *  count: number,
 *  list: Array,
 *  build: (function(Number=, Number=, String=)),
 *  emit: (function())
 * }}
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

},{"./board":3}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.player = undefined;

var _board = require("./board");

var _mouse = require("./mouse");

/**
 * Player (Paddle) object
 *
 * @type {{
 *  posX: Number,
 *  posY: Number,
 *  lastPosX: Number,
 *  direction: Number,
 *  width: Number,
 *  height: Number,
 *  color: String,
 *  setPosition: (function(Number=, Number=)),
 *  move: (function()),
 *  detectDirection: (function()),
 *  render: (function())
 * }}
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

},{"./board":3,"./mouse":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Sound class
 * 
 * @type {{
 *  sounds: {
 *      collide: {wall: Element, player: Element, brick: Element}
 *  },
 *  play: (function(String, String))}}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYXBwLmpzIiwianNcXGJhbGwuanMiLCJqc1xcYm9hcmQuanMiLCJqc1xcYnJpY2suanMiLCJqc1xcZ2FtZS5qcyIsImpzXFxtb3VzZS5qcyIsImpzXFxwYXJ0aWNsZS5qcyIsImpzXFxwbGF5ZXIuanMiLCJqc1xcc291bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztjQUtJO0lBRlksc0JBQVo7SUFDYSx1QkFBYjtBQUdHLElBQUksZ0NBQVksSUFBWjs7O0FBR1gsYUFBTSxPQUFOLENBQWMsV0FBZCxFQUEyQixZQUEzQjtBQUNBLGFBQU0sTUFBTjs7QUFFQSxlQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsYUFBTSxNQUFOLEdBQWUsQ0FBZixHQUFtQixDQUFuQixDQUF0QjtBQUNBLGVBQUssTUFBTDs7QUFFQSxpQkFBTyxXQUFQLENBQW1CLGFBQU0sS0FBTixHQUFjLENBQWQsR0FBa0IsaUJBQU8sS0FBUCxHQUFlLENBQWYsRUFBa0IsYUFBTSxNQUFOLEdBQWUsaUJBQU8sTUFBUCxDQUF0RTtBQUNBLGlCQUFPLE1BQVA7O0FBRUEsY0FBTyxLQUFQOzs7OztBQUtBLElBQU0sWUFBWSxTQUFaLFNBQVksR0FBTTs7O0FBR3BCLFFBQUksZUFBSyxJQUFMLElBQWEsQ0FBYixFQUFnQjtBQUNoQix1QkFBSyxNQUFMLEdBQWMsQ0FBQyxlQUFLLE1BQUwsQ0FEQztBQUVoQix3QkFBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixNQUF0QixFQUZnQjtLQUFwQjs7O0FBSG9CLFFBU2hCLGVBQUssSUFBTCxHQUFZLGVBQUssSUFBTCxJQUFhLGFBQU0sS0FBTixFQUFhO0FBQ3RDLHVCQUFLLE1BQUwsR0FBYyxDQUFDLGVBQUssTUFBTCxDQUR1QjtBQUV0Qyx3QkFBTSxJQUFO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QVosRUFBb0IsSUFBcEIsRUFBMEIsTUFBMUIsR0FBbUMsR0FBbkMsQ0FGZ0Y7QUFHaEYsbUJBQU8sS0FBSyxNQUFMLENBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFQLENBSGdGO1NBQXBGOztBQU1BLGNBQU0sSUFBSSxLQUFKLDJCQUFpQyw2QkFBc0IsMEJBQXZELENBQU4sQ0FSZTtLQWZGO0NBQVI7O2tCQTJCRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xyXG5pbXBvcnQge2JvYXJkfSBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IGJhbGwgZnJvbSAnLi9iYWxsJztcclxuaW1wb3J0IHBsYXllciBmcm9tICcuL3BsYXllcic7XHJcbmltcG9ydCB7cGFydGljbGVzfSBmcm9tICcuL3BhcnRpY2xlJztcclxuaW1wb3J0IHticmlja3N9IGZyb20gJy4vYnJpY2snO1xyXG5pbXBvcnQgc291bmQgZnJvbSAnLi9zb3VuZCc7XHJcblxyXG5sZXQge1xyXG4gICAgaW5uZXJXaWR0aDogd2luZG93V2lkdGgsXHJcbiAgICBpbm5lckhlaWdodDogd2luZG93SGVpZ2h0XHJcbn0gPSB3aW5kb3c7XHJcblxyXG5leHBvcnQgbGV0IGFuaW1hdGlvbiA9IG51bGw7XHJcblxyXG4vLyBJbml0IGJvYXJkXHJcbmJvYXJkLnNldFNpemUod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCk7XHJcbmJvYXJkLnJlbmRlcigpO1xyXG5cclxuYmFsbC5zZXRQb3NpdGlvbigyMDAsIGJvYXJkLmhlaWdodCAvIDMgKiAyKTtcclxuYmFsbC5yZW5kZXIoKTtcclxuLy9cclxucGxheWVyLnNldFBvc2l0aW9uKGJvYXJkLndpZHRoIC8gMiAtIHBsYXllci53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAtIHBsYXllci5oZWlnaHQpO1xyXG5wbGF5ZXIucmVuZGVyKCk7XHJcbi8vXHJcbmJyaWNrcy5idWlsZCgpO1xyXG5cclxuLyoqXHJcbiAqIERldGVjdGluZyB0aGUgY29sbGlzaW9uIGJldHdlZW4gcGxheWVyIGFuZCBiYWxsXHJcbiAqL1xyXG5jb25zdCBjb2xsaXNpb24gPSAoKSA9PiB7XHJcblxyXG4gICAgLy8gdG9wXHJcbiAgICBpZiAoYmFsbC5wb3NZIDw9IDApIHtcclxuICAgICAgICBiYWxsLnNwZWVkWSA9IC1iYWxsLnNwZWVkWTtcclxuICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ3dhbGwnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByaWdodFxyXG4gICAgaWYgKGJhbGwucG9zWCArIGJhbGwuc2l6ZSA+PSBib2FyZC53aWR0aCkge1xyXG4gICAgICAgIGJhbGwuc3BlZWRYID0gLWJhbGwuc3BlZWRYO1xyXG4gICAgICAgIHNvdW5kLnBsYXkoJ2NvbGxpZGUnLCAnd2FsbCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGxlZnRcclxuICAgIGlmIChiYWxsLnBvc1ggPD0gMCkge1xyXG4gICAgICAgIGJhbGwuc3BlZWRYID0gLWJhbGwuc3BlZWRYO1xyXG4gICAgICAgIHNvdW5kLnBsYXkoJ2NvbGxpZGUnLCAnd2FsbCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBsYXllciBvciBnYW1lIG92ZXIgOihcclxuICAgIGlmIChiYWxsLnBvc1ggKyBiYWxsLnJhZGl1cyA+PSBwbGF5ZXIucG9zWCAmJiBiYWxsLnBvc1ggPD0gcGxheWVyLnBvc1ggKyBwbGF5ZXIud2lkdGggJiYgYmFsbC5wb3NZICsgYmFsbC5zaXplID49IHBsYXllci5wb3NZKSB7XHJcblxyXG4gICAgICAgIGlmIChwbGF5ZXIuZGlyZWN0aW9uID09PSAtMSAmJiBiYWxsLnNwZWVkWCA+IDApIHtcclxuICAgICAgICAgICAgYmFsbC5zcGVlZFggPSAtYmFsbC5zcGVlZFg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGxheWVyLmRpcmVjdGlvbiA9PT0gMSAmJiBiYWxsLnNwZWVkWCA8IDApIHtcclxuICAgICAgICAgICAgYmFsbC5zcGVlZFggPSAtYmFsbC5zcGVlZFg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBiYWxsLnNwZWVkWSA9IC1iYWxsLnNwZWVkWTsgXHJcblxyXG4gICAgICAgIHBhcnRpY2xlcy5idWlsZChiYWxsLnBvc1ggKyBiYWxsLnJhZGl1cywgYmFsbC5wb3NZICsgYmFsbC5zaXplLCAnYmxhY2snKTtcclxuICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ3BsYXllcicpXHJcbiAgICAgICAgXHJcbiAgICB9IGVsc2UgaWYgKGJhbGwucG9zWSArIGJhbGwuc2l6ZSA+PSBib2FyZC5oZWlnaHQpIHtcclxuICAgICAgICBiYWxsLnBvc1kgPSBib2FyZC5oZWlnaHQgLSBiYWxsLnNpemU7XHJcbiAgICAgICAgZ2FtZS5vdmVyKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIFVwZGF0aW5nIHRoZSBjYW52YXNcclxuICovXHJcbmNvbnN0IGRyYXcgPSAoKSA9PiB7XHJcblxyXG4gICAgYm9hcmQucmVuZGVyKCk7XHJcbiAgICBicmlja3MucmVuZGVyKCk7XHJcblxyXG4gICAgZ2FtZS5kaXNwbGF5U2NvcmUoKTtcclxuICAgIGdhbWUuZGlzcGxheUxldmVsKCk7XHJcblxyXG4gICAgY29sbGlzaW9uKCk7XHJcblxyXG4gICAgYmFsbC5tb3ZlKCk7XHJcbiAgICBiYWxsLnJlbmRlcigpO1xyXG4gICAgXHJcbiAgICBwYXJ0aWNsZXMuZW1pdCgpO1xyXG5cclxuICAgIHBsYXllci5tb3ZlKCk7XHJcbiAgICBwbGF5ZXIucmVuZGVyKCk7XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIE1haW4gZ2FtZSBsb29wXHJcbiAqL1xyXG5jb25zdCBhbmltYXRpb25Mb29wID0gKCkgPT4ge1xyXG4gICAgYW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkxvb3ApO1xyXG4gICAgZHJhdygpO1xyXG59O1xyXG5cclxuYW5pbWF0aW9uTG9vcCgpOyIsImltcG9ydCB7Y3R4fSBmcm9tICcuL2JvYXJkJztcclxuXHJcbi8qKlxyXG4gKiBCYWxsIG9iamVjdFxyXG4gKlxyXG4gKiBAdHlwZSB7e1xyXG4gKiAgcG9zWDogTnVtYmVyLFxyXG4gKiAgcG9zWTogTnVtYmVyLFxyXG4gKiAgc3BlZWRYOiBOdW1iZXIsXHJcbiAqICBzcGVlZFk6IE51bWJlcixcclxuICogIGltYWdlOiBFbGVtZW50LFxyXG4gKiAgd2lkdGg6IE51bWJlcixcclxuICogIGhlaWdodDogTnVtYmVyLFxyXG4gKiAgYW5nbGU6IE51bWJlcixcclxuICogIHNpemUsIGNlbnRlcixcclxuICogIHNldFBvc2l0aW9uOiAoZnVuY3Rpb24oTnVtYmVyPSwgTnVtYmVyPSkpLFxyXG4gKiAgbW92ZTogKGZ1bmN0aW9uKCkpLFxyXG4gKiAgcmVuZGVyOiAoZnVuY3Rpb24oKSlcclxuICogfX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBiYWxsID0ge1xyXG4gICAgcG9zWDogNDAsXHJcbiAgICBwb3NZOiA0MCxcclxuXHJcbiAgICBzcGVlZFg6IDQsXHJcbiAgICBzcGVlZFk6IC04LFxyXG5cclxuICAgIGltYWdlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhbGxcIiksXHJcblxyXG4gICAgd2lkdGg6IDIwLFxyXG4gICAgaGVpZ2h0OiAyMCxcclxuXHJcbiAgICBhbmdsZTogMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgZGlhbWV0ZXIgb2YgYmFsbFxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgc2l6ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHJhZGl1cyBvZiBiYWxsXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCByYWRpdXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggLyAyO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBiYWxsIHBvc2l0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHggW3g9MF1cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IFt5PTBdXHJcbiAgICAgKi9cclxuICAgIHNldFBvc2l0aW9uKHggPSAwLCB5ID0gMCkge1xyXG4gICAgICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NZID0geTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNb3ZlIGEgYmFsbFxyXG4gICAgICovXHJcbiAgICBtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMucG9zWCArPSB0aGlzLnNwZWVkWDtcclxuICAgICAgICB0aGlzLnBvc1kgKz0gdGhpcy5zcGVlZFk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVuZGVyIHRoZSBiYWxsXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5wb3NYICsgdGhpcy5yYWRpdXMsIHRoaXMucG9zWSArIHRoaXMucmFkaXVzKTtcclxuICAgICAgICBjdHgucm90YXRlKHRoaXMuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIC10aGlzLndpZHRoIC8gMiwgLXRoaXMuaGVpZ2h0IC8gMiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYW5nbGUgKz0gdGhpcy5zcGVlZFggKiAyO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYmFsbDsiLCIvKipcclxuICogQ2FudmFzIHRhZ1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9hcmRcIik7XHJcblxyXG4vKipcclxuICogQ29udGV4dFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBHYW1lIGJvYXJkXHJcbiAqIFxyXG4gKiBAdHlwZSB7e1xyXG4gKiAgd2lkdGgsIGhlaWdodCwgXHJcbiAqICBzZXRTaXplOiAoZnVuY3Rpb24oTnVtYmVyPSwgTnVtYmVyPSkpLFxyXG4gKiAgcmVuZGVyOiAoZnVuY3Rpb24oKSlcclxuICogfX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBib2FyZCA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgY2FudmFzIHdpZHRoXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiBjYW52YXMud2lkdGg7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBjYW52YXMgaGVpZ2h0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gY2FudmFzLmhlaWdodDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgdGhlIHNpemUgb2YgY2FudmFzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHcgW3c9ODAwXVxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGggW2g9NjAwXVxyXG4gICAgICovXHJcbiAgICBzZXRTaXplKHcgPSA4MDAsIGggPSA2MDApIHtcclxuICAgICAgICBjYW52YXMud2lkdGggPSB3O1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFyIHRoZSBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGJvYXJkOyIsImltcG9ydCB7Y3R4LCBib2FyZH0gZnJvbSAnLi9ib2FyZCc7XHJcbmltcG9ydCB7YmFsbH0gZnJvbSBcIi4vYmFsbFwiO1xyXG5pbXBvcnQgc291bmQgZnJvbSBcIi4vc291bmRcIjtcclxuaW1wb3J0IHtwYXJ0aWNsZXN9IGZyb20gXCIuL3BhcnRpY2xlXCI7XHJcbmltcG9ydCB7Z2FtZX0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5cclxuLyoqXHJcbiAqIEJyaWNrcyBmYWN0b3J5XHJcbiAqIFxyXG4gKiBAcGFyYW0ge051bWJlcn0geCBbeD0wXVxyXG4gKiBAcGFyYW0ge051bWJlcn0geSBbeT0wXVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGJyaWNrICA9ICh4ID0gMCwgeSA9IDApID0+ICh7XHJcbiAgICBwb3NYOiB4LFxyXG4gICAgcG9zWTogeSxcclxuXHJcbiAgICBoZWlnaHQ6IDIwLFxyXG5cclxuICAgIGNvbG9yOiAnZ3JlZW4nLFxyXG5cclxuICAgIHZpc2libGU6IHRydWUsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGluZyB0aGUgYnJpY2sgd2lkdGhcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiAoYm9hcmQud2lkdGggIC0gYnJpY2tzLm9mZnNldCAqIChicmlja3MuY29sdW1ucyAtIDEpKSAvIGJyaWNrcy5jb2x1bW5zO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBicmljayBwb3NpdGlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IFt4PTBdXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geSBbeT0wXVxyXG4gICAgICovXHJcbiAgICBzZXRQb3NpdGlvbih4ID0gMCwgeSA9IDApIHsgXHJcbiAgICAgICAgdGhpcy5wb3NYID0geDtcclxuICAgICAgICB0aGlzLnBvc1kgPSB5O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNlbnRlciBYIHBvc2l0aW9uIG9mIGJyaWNrXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGNlbnRlclgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zWCArIHRoaXMud2lkdGggLyAyO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNlbnRlciBZIHBvc2l0aW9uIG9mIGJyaWNrXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgY2VudGVyWSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NZICsgdGhpcy5oZWlnaHQgLyAyO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgdGhlIGJyaWNrIG9uIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0aGlzLnBvc1gsIHRoaXMucG9zWSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEJyaWNrcyBtYW5pcHVsYXRpb24gb2JqZWN0XHJcbiAqIFxyXG4gKiBAdHlwZSB7e1xyXG4gKiAgb2Zmc2V0OiBOdW1iZXIsIFxyXG4gKiAgb2Zmc2V0VG9wOiBOdW1iZXIsIFxyXG4gKiAgcm93czogTnVtYmVyLCBcclxuICogIG1heEJyaWNrV2lkdGg6IE51bWJlciwgXHJcbiAqICBsaXN0OiBBcnJheSwgXHJcbiAqICBjb2x1bW5zLCBcclxuICogIGdldFJhbmRvbUNvbG9yOiAoZnVuY3Rpb24oKSksIFxyXG4gKiAgYnVpbGQ6IChmdW5jdGlvbigpKSwgXHJcbiAqICByZW5kZXI6IChmdW5jdGlvbigpKVxyXG4gKiB9fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGJyaWNrcyA9IHtcclxuICAgIG9mZnNldDogMCxcclxuICAgIG9mZnNldFRvcDogNjAsXHJcblxyXG4gICAgcm93czogNixcclxuXHJcbiAgICBtYXhCcmlja1dpZHRoOiAxMDAsXHJcblxyXG4gICAgbGlzdDogW10sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGNvbHVtbnMgY291bnRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgY29sdW1ucygpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihib2FyZC53aWR0aCAvIHRoaXMubWF4QnJpY2tXaWR0aCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHJhbmRvbSBjb2xvclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGdldFJhbmRvbUNvbG9yKCkge1xyXG4gICAgICAgIHZhciBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKTtcclxuICAgICAgICB2YXIgY29sb3IgPSAnIyc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKysgKSB7XHJcbiAgICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERyYXdpbmcgYWxsIGJyaWNrcyBvbiBjYW52YXNcclxuICAgICAqL1xyXG4gICAgYnVpbGQoKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgdGhpcy5yb3dzOyByKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB0aGlzLmNvbHVtbnM7IGMrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBiID0gYnJpY2soKTtcclxuICAgICAgICAgICAgICAgIGIuc2V0UG9zaXRpb24oYyAqIChiLndpZHRoICsgdGhpcy5vZmZzZXQpLCB0aGlzLm9mZnNldFRvcCArICgodGhpcy5vZmZzZXQgKyBiLmhlaWdodCkgKiByKSk7XHJcbiAgICAgICAgICAgICAgICBiLmNvbG9yID0gdGhpcy5nZXRSYW5kb21Db2xvcigpO1xyXG4gICAgICAgICAgICAgICAgYi5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3QucHVzaChiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZWN0aW5nIGNvbGxpc2lvbnMgYmV0d2VlbiBiYWxsIGFuZCBicmlja3NcclxuICAgICAqL1xyXG4gICAgcmVuZGVyKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5saXN0Lmxlbmd0aCAtIGdhbWUuc2NvcmUgPT09IDApIHtcclxuICAgICAgICAgICAgZ2FtZS52aWN0b3J5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0Lm1hcChiID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChiLnZpc2libGUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmFsbC5wb3NYICsgYmFsbC5yYWRpdXMgPj0gYi5wb3NYICYmIGJhbGwucG9zWCAtIGJhbGwucmFkaXVzICA8PSBiLnBvc1ggKyBiLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhbGwucG9zWSA8IGIucG9zWSArIGIuaGVpZ2h0ICYmIGJhbGwucG9zWSArIGJhbGwuc2l6ZSA+IGIucG9zWSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYi52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbGxpc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbC5zcGVlZFkgPSAtYmFsbC5zcGVlZFk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnNjb3JlKys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZS5zY29yZSAlIGdhbWUubXVsdGlwbGllciA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbC5zcGVlZFggKz0gKGJhbGwuc3BlZWRYIDwgMCkgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWSArPSAoYmFsbC5zcGVlZFkgPCAwKSA/IC0yIDogMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5sZXZlbFVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlcy5idWlsZChiLmNlbnRlclgoKSwgYi5jZW50ZXJZKCksIGIuY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ2JyaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGIucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IHtib2FyZCwgY3R4fSBmcm9tIFwiLi9ib2FyZFwiO1xyXG5pbXBvcnQge2FuaW1hdGlvbn0gZnJvbSBcIi4vYXBwXCI7XHJcblxyXG4vKipcclxuICogR2FtZSdzIGZ1bmN0aW9uc1xyXG4gKlxyXG4gKiBAdHlwZSB7e1xyXG4gKiAgc2NvcmU6IE51bWJlcixcclxuICogIGxldmVsOiBOdW1iZXIsXHJcbiAqICBtdWx0aXBsaWVyOiBOdW1iZXIsXHJcbiAqICB0ZXh0UGFkZGluZzogTnVtYmVyLFxyXG4gKiAgbGV2ZWxVcDogKGZ1bmN0aW9uKCkpLFxyXG4gKiAgZGlzcGxheVNjb3JlOiAoZnVuY3Rpb24oKSksXHJcbiAqICBkaXNwbGF5TGV2ZWw6IChmdW5jdGlvbigpKSxcclxuICogIG92ZXI6IChmdW5jdGlvbigpKSxcclxuICogIHZpY3Rvcnk6IChmdW5jdGlvbigpKVxyXG4gKiB9fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdhbWUgPSB7XHJcbiAgICBzY29yZTogMCxcclxuICAgIGxldmVsOiAxLFxyXG5cclxuICAgIG11bHRpcGxpZXI6IDQsXHJcblxyXG4gICAgdGV4dFBhZGRpbmc6IDEwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5jcmVhc2UgdGhlIGxldmVsXHJcbiAgICAgKi9cclxuICAgIGxldmVsVXAoKSB7XHJcbiAgICAgICAgdGhpcy5sZXZlbCsrO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXlpbmcgdGhlIHNjb3JlIG9mIHRoZSBnYW1lXHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlTY29yZSgpIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5mb250ID0gXCIxOHB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwic3RhcnRcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcclxuICAgICAgICBjdHguZmlsbFRleHQoYFNjb3JlOiAke3RoaXMuc2NvcmV9YCwgdGhpcy50ZXh0UGFkZGluZywgdGhpcy50ZXh0UGFkZGluZyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXlpbmcgdGhlIGxldmVsXHJcbiAgICAgKi9cclxuICAgIGRpc3BsYXlMZXZlbCgpIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5mb250ID0gXCIxOHB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiZW5kXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwidG9wXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGBMZXZlbDogJHt0aGlzLmxldmVsfWAsIGJvYXJkLndpZHRoIC0gdGhpcy50ZXh0UGFkZGluZywgdGhpcy50ZXh0UGFkZGluZyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2FtZSBvdmVyIDooXHJcbiAgICAgKiBEaXNwbGF5aW5nIHRoZSBtZXNzYWdlXHJcbiAgICAgKiBTdG9wIHRoZSBnYW1lIGxvb3BcclxuICAgICAqL1xyXG4gICAgb3ZlcigpIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgIGN0eC5mb250ID0gXCIyNnB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGBHYW1lIE92ZXJgLCBib2FyZC53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAvIDIgLSA0MCk7XHJcblxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIiMyMTIxMjFcIjtcclxuICAgICAgICBjdHguZm9udCA9IFwiMjJweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChgWW91ciBzY29yZSBpcyAke3RoaXMuc2NvcmV9IHBvaW50cyFgLCBib2FyZC53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChgWW91IHJlYWNoZWQgbGV2ZWwgJHt0aGlzLmxldmVsfWAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMiArIDMwKTtcclxuXHJcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWaWN0b3J5IVxyXG4gICAgICogRGlzcGxheWluZyB0aGUgbWVzc2FnZVxyXG4gICAgICogU3RvcCB0aGUgZ2FtZSBsb29wXHJcbiAgICAgKi9cclxuICAgIHZpY3RvcnkoKSB7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjI2cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICBjdHguZmlsbFRleHQoYENvbmdyYXR1bGF0aW9ucyFgLCBib2FyZC53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChgWW91IHdvbmAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMiArIDQwKTtcclxuXHJcbiAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdhbWU7XHJcbiIsImltcG9ydCB7Y2FudmFzfSBmcm9tICcuL2JvYXJkJztcclxuXHJcbi8qKlxyXG4gKlxyXG4gKiBAdHlwZSB7e1xyXG4gKiAgcG9zWDogTnVtYmVyLCBcclxuICogIHBvc1k6IE51bWJlcixcclxuICogIHNldFBvc2l0aW9uOiAoZnVuY3Rpb24oTnVtYmVyPSwgTnVtYmVyPSkpXHJcbiAqIH19XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgbW91c2UgPSB7XHJcbiAgICBwb3NYOiAwLFxyXG4gICAgcG9zWTogMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBtb3VzZSBwb3NpdGlvblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IFt4PTBdXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geSBbeT0wXVxyXG4gICAgICovXHJcbiAgICBzZXRQb3NpdGlvbih4ID0gMCwgeSA9IDApIHtcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBsaXN0ZW5lcnNcclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+IG1vdXNlLnNldFBvc2l0aW9uKGUucGFnZVgsIGUucGFnZVkpICwgdHJ1ZSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb3VzZTsiLCJpbXBvcnQge2N0eH0gZnJvbSAnLi9ib2FyZCc7XHJcblxyXG4vKipcclxuICogUGFydGljbGUgZmFjdG9yeSBmdW5jdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge051bWJlcn0geCBbeD0wXVxyXG4gKiBAcGFyYW0ge051bWJlcn0geSBbeT0wXVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gYyBbYz0nYmxhY2snXVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHBhcnRpY2xlID0gKHggPSAwLCB5ID0gMCwgYyA9ICdibGFjaycpID0+ICh7XHJcbiAgICBwb3NYOiB4LFxyXG4gICAgcG9zWTogeSxcclxuXHJcbiAgICBzcGVlZFg6IC01ICsgTWF0aC5yYW5kb20oKSAqIDEwLFxyXG4gICAgc3BlZWRZOiAtNSArIE1hdGgucmFuZG9tKCkgKiAxMCxcclxuXHJcbiAgICBjb2xvcjogYywgXHJcblxyXG4gICAgcmFkaXVzOiAzLjVcclxufSk7XHJcblxyXG4vKipcclxuICogUGFydGljbGVzIG1hbmlwdWxhdGlvbiBvYmplY3RcclxuICpcclxuICogQHR5cGUge3tcclxuICogIGNvdW50OiBudW1iZXIsXHJcbiAqICBsaXN0OiBBcnJheSxcclxuICogIGJ1aWxkOiAoZnVuY3Rpb24oTnVtYmVyPSwgTnVtYmVyPSwgU3RyaW5nPSkpLFxyXG4gKiAgZW1pdDogKGZ1bmN0aW9uKCkpXHJcbiAqIH19XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcGFydGljbGVzID0ge1xyXG4gICAgY291bnQ6IDIwLFxyXG4gICAgbGlzdDogW10sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGluZyBwYXJ0aWNsZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geCBbeD0wXVxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkgW3k9MF1cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBbYz0nYmxhY2snXVxyXG4gICAgICovXHJcbiAgICBidWlsZCh4ID0gMCwgeSA9IDAsIGNvbG9yID0gJ2JsYWNrJykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdC5wdXNoKHBhcnRpY2xlKHgsIHksIGNvbG9yKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXlpbmcgdGhlIHBhcnRpY2xlcyBvbiBib2FyZFxyXG4gICAgICovXHJcbiAgICBlbWl0KCkge1xyXG5cclxuICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmxpc3QuZmlsdGVyKGUgPT4gZS5yYWRpdXMgPiAwKTtcclxuICAgICAgICB0aGlzLmxpc3QubWFwKHAgPT4ge1xyXG5cclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gcC5jb2xvcjtcclxuICAgICAgICAgICAgaWYgKHAucmFkaXVzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyYyhwLnBvc1gsIHAucG9zWSwgcC5yYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG5cclxuICAgICAgICAgICAgcC5wb3NYICs9IHAuc3BlZWRYO1xyXG4gICAgICAgICAgICBwLnBvc1kgKz0gcC5zcGVlZFk7XHJcblxyXG4gICAgICAgICAgICBwLnJhZGl1cyA9IE1hdGgubWF4KHAucmFkaXVzIC0gMC4yLCAwLjApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuIiwiaW1wb3J0IHtjdHh9IGZyb20gJy4vYm9hcmQnO1xyXG5pbXBvcnQge21vdXNlfSBmcm9tIFwiLi9tb3VzZVwiO1xyXG5pbXBvcnQge2JvYXJkfSBmcm9tIFwiLi9ib2FyZFwiO1xyXG5cclxuLyoqXHJcbiAqIFBsYXllciAoUGFkZGxlKSBvYmplY3RcclxuICpcclxuICogQHR5cGUge3tcclxuICogIHBvc1g6IE51bWJlcixcclxuICogIHBvc1k6IE51bWJlcixcclxuICogIGxhc3RQb3NYOiBOdW1iZXIsXHJcbiAqICBkaXJlY3Rpb246IE51bWJlcixcclxuICogIHdpZHRoOiBOdW1iZXIsXHJcbiAqICBoZWlnaHQ6IE51bWJlcixcclxuICogIGNvbG9yOiBTdHJpbmcsXHJcbiAqICBzZXRQb3NpdGlvbjogKGZ1bmN0aW9uKE51bWJlcj0sIE51bWJlcj0pKSxcclxuICogIG1vdmU6IChmdW5jdGlvbigpKSxcclxuICogIGRldGVjdERpcmVjdGlvbjogKGZ1bmN0aW9uKCkpLFxyXG4gKiAgcmVuZGVyOiAoZnVuY3Rpb24oKSlcclxuICogfX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBwbGF5ZXIgPSB7XHJcbiAgICBwb3NYOiAwLFxyXG4gICAgcG9zWTogMCxcclxuXHJcbiAgICBsYXN0UG9zWDogMCxcclxuICAgIGRpcmVjdGlvbjogMCxcclxuXHJcbiAgICB3aWR0aDogMTIwLFxyXG4gICAgaGVpZ2h0OiAxMCxcclxuICAgIFxyXG4gICAgY29sb3I6ICdibGFjaycsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgcGxheWVyIHBvc2l0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHggW3g9MF1cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IFt5PTBdXHJcbiAgICAgKi9cclxuICAgIHNldFBvc2l0aW9uKHggPSAwLCB5ID0gMCkge1xyXG4gICAgICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NZID0geTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNb3VzZSBjb250cm9sXHJcbiAgICAgKi9cclxuICAgIG1vdmUoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxlZnQgPSBtb3VzZS5wb3NYIC0gdGhpcy53aWR0aCAvIDI7XHJcbiAgICAgICAgY29uc3QgcmlnaHQgPSBtb3VzZS5wb3NYICsgdGhpcy53aWR0aCAvIDI7XHJcblxyXG4gICAgICAgIGlmIChsZWZ0IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc1ggPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZihyaWdodCA+IGJvYXJkLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zWCA9IGJvYXJkLndpZHRoIC0gdGhpcy53aWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBvc1ggPSBsZWZ0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZXRlY3REaXJlY3Rpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kaW5nIG91dCB0aGUgZGlyZWN0aW9uIG9mIG1vdmVtZW50XHJcbiAgICAgKi9cclxuICAgIGRldGVjdERpcmVjdGlvbigpIHtcclxuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICh0aGlzLnBvc1ggPT09IHRoaXMubGFzdFBvc1gpID8gMCA6ICh0aGlzLnBvc1ggPiB0aGlzLmxhc3RQb3NYKSA/IDEgOiAtMSA7XHJcbiAgICAgICAgdGhpcy5sYXN0UG9zWCA9IHRoaXMucG9zWDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5aW5nIHRoZSBwbGF5ZXIgb24gY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHBsYXllcjsiLCIvKipcclxuICogU291bmQgY2xhc3NcclxuICogXHJcbiAqIEB0eXBlIHt7XHJcbiAqICBzb3VuZHM6IHtcclxuICogICAgICBjb2xsaWRlOiB7d2FsbDogRWxlbWVudCwgcGxheWVyOiBFbGVtZW50LCBicmljazogRWxlbWVudH1cclxuICogIH0sXHJcbiAqICBwbGF5OiAoZnVuY3Rpb24oU3RyaW5nLCBTdHJpbmcpKX19XHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgc291bmQgPSB7XHJcbiAgICBzb3VuZHM6IHtcclxuICAgICAgICBjb2xsaWRlOiB7XHJcbiAgICAgICAgICAgIHdhbGw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xsaWRlLXdhbGxzJyksXHJcbiAgICAgICAgICAgIHBsYXllcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxpZGUtcGxheWVyJyksXHJcbiAgICAgICAgICAgIGJyaWNrOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sbGlkZS1icmljaycpXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvblxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcclxuICAgICAqIEByZXR1cm5zIHsqfHZvaWR9XHJcbiAgICAgKi9cclxuICAgIHBsYXkoYWN0aW9uLCB0eXBlKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNvdW5kcy5oYXNPd25Qcm9wZXJ0eShhY3Rpb24pICYmIHRoaXMuc291bmRzW2FjdGlvbl0uaGFzT3duUHJvcGVydHkodHlwZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZHNbYWN0aW9uXVt0eXBlXS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW2FjdGlvbl1bdHlwZV0udm9sdW1lID0gMC42O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VuZHNbYWN0aW9uXVt0eXBlXS5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNvdW5kIHdpdGggYWN0aW9uOiAnJHthY3Rpb259JyBhbmQgdHlwZTogJyR7dHlwZX0nIGlzIG5vdCBkZWZpbmVkYCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzb3VuZDsiXX0=
