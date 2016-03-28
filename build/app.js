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

_player2.default.setPosition(_board.board.width / 2 - _player2.default.width / 2, _board.board.height - _player2.default.height);
_player2.default.render();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYXBwLmpzIiwianNcXGJhbGwuanMiLCJqc1xcYm9hcmQuanMiLCJqc1xcYnJpY2suanMiLCJqc1xcZ2FtZS5qcyIsImpzXFxtb3VzZS5qcyIsImpzXFxwYXJ0aWNsZS5qcyIsImpzXFxwbGF5ZXIuanMiLCJqc1xcc291bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztjQUtJO0lBRlksc0JBQVo7SUFDYSx1QkFBYjtBQUdHLElBQUksZ0NBQVksSUFBWjs7O0FBR1gsYUFBTSxPQUFOLENBQWMsV0FBZCxFQUEyQixZQUEzQjtBQUNBLGFBQU0sTUFBTjs7QUFFQSxlQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsYUFBTSxNQUFOLEdBQWUsQ0FBZixHQUFtQixDQUFuQixDQUF0QjtBQUNBLGVBQUssTUFBTDs7QUFFQSxpQkFBTyxXQUFQLENBQW1CLGFBQU0sS0FBTixHQUFjLENBQWQsR0FBa0IsaUJBQU8sS0FBUCxHQUFlLENBQWYsRUFBa0IsYUFBTSxNQUFOLEdBQWUsaUJBQU8sTUFBUCxDQUF0RTtBQUNBLGlCQUFPLE1BQVA7O0FBRUEsY0FBTyxLQUFQOzs7OztBQUtBLElBQU0sWUFBWSxTQUFaLFNBQVksR0FBTTs7O0FBR3BCLFFBQUksZUFBSyxJQUFMLElBQWEsQ0FBYixFQUFnQjtBQUNoQix1QkFBSyxNQUFMLEdBQWMsQ0FBQyxlQUFLLE1BQUwsQ0FEQztBQUVoQix3QkFBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixNQUF0QixFQUZnQjtLQUFwQjs7O0FBSG9CLFFBU2hCLGVBQUssSUFBTCxHQUFZLGVBQUssSUFBTCxJQUFhLGFBQU0sS0FBTixFQUFhO0FBQ3RDLHVCQUFLLE1BQUwsR0FBYyxDQUFDLGVBQUssTUFBTCxDQUR1QjtBQUV0Qyx3QkFBTSxJQUFO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QVosRUFBb0IsSUFBcEIsRUFBMEIsTUFBMUIsR0FBbUMsR0FBbkMsQ0FGZ0Y7QUFHaEYsbUJBQU8sS0FBSyxNQUFMLENBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixJQUExQixFQUFQLENBSGdGO1NBQXBGOztBQU1BLGNBQU0sSUFBSSxLQUFKLDJCQUFpQyw2QkFBc0IsMEJBQXZELENBQU4sQ0FSZTtLQWZGO0NBQVI7O2tCQTJCRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL2dhbWUnO1xyXG5pbXBvcnQge2JvYXJkfSBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IGJhbGwgZnJvbSAnLi9iYWxsJztcclxuaW1wb3J0IHBsYXllciBmcm9tICcuL3BsYXllcic7XHJcbmltcG9ydCB7cGFydGljbGVzfSBmcm9tICcuL3BhcnRpY2xlJztcclxuaW1wb3J0IHticmlja3N9IGZyb20gJy4vYnJpY2snO1xyXG5pbXBvcnQgc291bmQgZnJvbSAnLi9zb3VuZCc7XHJcblxyXG5sZXQge1xyXG4gICAgaW5uZXJXaWR0aDogd2luZG93V2lkdGgsXHJcbiAgICBpbm5lckhlaWdodDogd2luZG93SGVpZ2h0XHJcbn0gPSB3aW5kb3c7XHJcblxyXG5leHBvcnQgbGV0IGFuaW1hdGlvbiA9IG51bGw7XHJcblxyXG4vLyBJbml0IGJvYXJkXHJcbmJvYXJkLnNldFNpemUod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCk7XHJcbmJvYXJkLnJlbmRlcigpO1xyXG5cclxuYmFsbC5zZXRQb3NpdGlvbigyMDAsIGJvYXJkLmhlaWdodCAvIDMgKiAyKTtcclxuYmFsbC5yZW5kZXIoKTtcclxuXHJcbnBsYXllci5zZXRQb3NpdGlvbihib2FyZC53aWR0aCAvIDIgLSBwbGF5ZXIud2lkdGggLyAyLCBib2FyZC5oZWlnaHQgLSBwbGF5ZXIuaGVpZ2h0KTtcclxucGxheWVyLnJlbmRlcigpO1xyXG5cclxuYnJpY2tzLmJ1aWxkKCk7XHJcblxyXG4vKipcclxuICogRGV0ZWN0aW5nIHRoZSBjb2xsaXNpb24gYmV0d2VlbiBwbGF5ZXIgYW5kIGJhbGxcclxuICovXHJcbmNvbnN0IGNvbGxpc2lvbiA9ICgpID0+IHtcclxuXHJcbiAgICAvLyB0b3BcclxuICAgIGlmIChiYWxsLnBvc1kgPD0gMCkge1xyXG4gICAgICAgIGJhbGwuc3BlZWRZID0gLWJhbGwuc3BlZWRZO1xyXG4gICAgICAgIHNvdW5kLnBsYXkoJ2NvbGxpZGUnLCAnd2FsbCcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJpZ2h0XHJcbiAgICBpZiAoYmFsbC5wb3NYICsgYmFsbC5zaXplID49IGJvYXJkLndpZHRoKSB7XHJcbiAgICAgICAgYmFsbC5zcGVlZFggPSAtYmFsbC5zcGVlZFg7XHJcbiAgICAgICAgc291bmQucGxheSgnY29sbGlkZScsICd3YWxsJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbGVmdFxyXG4gICAgaWYgKGJhbGwucG9zWCA8PSAwKSB7XHJcbiAgICAgICAgYmFsbC5zcGVlZFggPSAtYmFsbC5zcGVlZFg7XHJcbiAgICAgICAgc291bmQucGxheSgnY29sbGlkZScsICd3YWxsJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcGxheWVyIG9yIGdhbWUgb3ZlciA6KFxyXG4gICAgaWYgKGJhbGwucG9zWCArIGJhbGwucmFkaXVzID49IHBsYXllci5wb3NYICYmIGJhbGwucG9zWCA8PSBwbGF5ZXIucG9zWCArIHBsYXllci53aWR0aCAmJiBiYWxsLnBvc1kgKyBiYWxsLnNpemUgPj0gcGxheWVyLnBvc1kpIHtcclxuXHJcbiAgICAgICAgaWYgKHBsYXllci5kaXJlY3Rpb24gPT09IC0xICYmIGJhbGwuc3BlZWRYID4gMCkge1xyXG4gICAgICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwbGF5ZXIuZGlyZWN0aW9uID09PSAxICYmIGJhbGwuc3BlZWRYIDwgMCkge1xyXG4gICAgICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhbGwuc3BlZWRZID0gLWJhbGwuc3BlZWRZOyBcclxuXHJcbiAgICAgICAgcGFydGljbGVzLmJ1aWxkKGJhbGwucG9zWCArIGJhbGwucmFkaXVzLCBiYWxsLnBvc1kgKyBiYWxsLnNpemUsICdibGFjaycpO1xyXG4gICAgICAgIHNvdW5kLnBsYXkoJ2NvbGxpZGUnLCAncGxheWVyJylcclxuICAgICAgICBcclxuICAgIH0gZWxzZSBpZiAoYmFsbC5wb3NZICsgYmFsbC5zaXplID49IGJvYXJkLmhlaWdodCkge1xyXG4gICAgICAgIGJhbGwucG9zWSA9IGJvYXJkLmhlaWdodCAtIGJhbGwuc2l6ZTtcclxuICAgICAgICBnYW1lLm92ZXIoKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG4vKipcclxuICogVXBkYXRpbmcgdGhlIGNhbnZhc1xyXG4gKi9cclxuY29uc3QgZHJhdyA9ICgpID0+IHtcclxuXHJcbiAgICBib2FyZC5yZW5kZXIoKTtcclxuICAgIGJyaWNrcy5yZW5kZXIoKTtcclxuXHJcbiAgICBnYW1lLmRpc3BsYXlTY29yZSgpO1xyXG4gICAgZ2FtZS5kaXNwbGF5TGV2ZWwoKTtcclxuXHJcbiAgICBjb2xsaXNpb24oKTtcclxuXHJcbiAgICBiYWxsLm1vdmUoKTtcclxuICAgIGJhbGwucmVuZGVyKCk7XHJcbiAgICBcclxuICAgIHBhcnRpY2xlcy5lbWl0KCk7XHJcblxyXG4gICAgcGxheWVyLm1vdmUoKTtcclxuICAgIHBsYXllci5yZW5kZXIoKTtcclxufTtcclxuXHJcblxyXG4vKipcclxuICogTWFpbiBnYW1lIGxvb3BcclxuICovXHJcbmNvbnN0IGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XHJcbiAgICBhbmltYXRpb24gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XHJcbiAgICBkcmF3KCk7XHJcbn07XHJcblxyXG5hbmltYXRpb25Mb29wKCk7IiwiaW1wb3J0IHtjdHh9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuLyoqXHJcbiAqIEJhbGwgb2JqZWN0XHJcbiAqXHJcbiAqIEB0eXBlIHt7XHJcbiAqICBwb3NYOiBOdW1iZXIsXHJcbiAqICBwb3NZOiBOdW1iZXIsXHJcbiAqICBzcGVlZFg6IE51bWJlcixcclxuICogIHNwZWVkWTogTnVtYmVyLFxyXG4gKiAgaW1hZ2U6IEVsZW1lbnQsXHJcbiAqICB3aWR0aDogTnVtYmVyLFxyXG4gKiAgaGVpZ2h0OiBOdW1iZXIsXHJcbiAqICBhbmdsZTogTnVtYmVyLFxyXG4gKiAgc2l6ZSwgY2VudGVyLFxyXG4gKiAgc2V0UG9zaXRpb246IChmdW5jdGlvbihOdW1iZXI9LCBOdW1iZXI9KSksXHJcbiAqICBtb3ZlOiAoZnVuY3Rpb24oKSksXHJcbiAqICByZW5kZXI6IChmdW5jdGlvbigpKVxyXG4gKiB9fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGJhbGwgPSB7XHJcbiAgICBwb3NYOiA0MCxcclxuICAgIHBvc1k6IDQwLFxyXG5cclxuICAgIHNwZWVkWDogNCxcclxuICAgIHNwZWVkWTogLTgsXHJcblxyXG4gICAgaW1hZ2U6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFsbFwiKSxcclxuXHJcbiAgICB3aWR0aDogMjAsXHJcbiAgICBoZWlnaHQ6IDIwLFxyXG5cclxuICAgIGFuZ2xlOiAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBkaWFtZXRlciBvZiBiYWxsXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBzaXplKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcmFkaXVzIG9mIGJhbGxcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgZ2V0IHJhZGl1cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAvIDI7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGJhbGwgcG9zaXRpb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geCBbeD0wXVxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkgW3k9MF1cclxuICAgICAqL1xyXG4gICAgc2V0UG9zaXRpb24oeCA9IDAsIHkgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5wb3NYID0geDtcclxuICAgICAgICB0aGlzLnBvc1kgPSB5O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdmUgYSBiYWxsXHJcbiAgICAgKi9cclxuICAgIG1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5wb3NYICs9IHRoaXMuc3BlZWRYO1xyXG4gICAgICAgIHRoaXMucG9zWSArPSB0aGlzLnNwZWVkWTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgdGhlIGJhbGxcclxuICAgICAqL1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnBvc1ggKyB0aGlzLnJhZGl1cywgdGhpcy5wb3NZICsgdGhpcy5yYWRpdXMpO1xyXG4gICAgICAgIGN0eC5yb3RhdGUodGhpcy5hbmdsZSAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgLXRoaXMud2lkdGggLyAyLCAtdGhpcy5oZWlnaHQgLyAyLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmdsZSArPSB0aGlzLnNwZWVkWCAqIDI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBiYWxsOyIsIi8qKlxyXG4gKiBDYW52YXMgdGFnXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKTtcclxuXHJcbi8qKlxyXG4gKiBDb250ZXh0XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5cclxuLyoqXHJcbiAqIEdhbWUgYm9hcmRcclxuICogXHJcbiAqIEB0eXBlIHt7XHJcbiAqICB3aWR0aCwgaGVpZ2h0LCBcclxuICogIHNldFNpemU6IChmdW5jdGlvbihOdW1iZXI9LCBOdW1iZXI9KSksXHJcbiAqICByZW5kZXI6IChmdW5jdGlvbigpKVxyXG4gKiB9fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGJvYXJkID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBjYW52YXMgd2lkdGhcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhbnZhcy53aWR0aDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGNhbnZhcyBoZWlnaHRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiBjYW52YXMuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgc2l6ZSBvZiBjYW52YXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdyBbdz04MDBdXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaCBbaD02MDBdXHJcbiAgICAgKi9cclxuICAgIHNldFNpemUodyA9IDgwMCwgaCA9IDYwMCkge1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHc7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGg7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgYm9hcmQ7IiwiaW1wb3J0IHtjdHgsIGJvYXJkfSBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IHtiYWxsfSBmcm9tIFwiLi9iYWxsXCI7XHJcbmltcG9ydCBzb3VuZCBmcm9tIFwiLi9zb3VuZFwiO1xyXG5pbXBvcnQge3BhcnRpY2xlc30gZnJvbSBcIi4vcGFydGljbGVcIjtcclxuaW1wb3J0IHtnYW1lfSBmcm9tIFwiLi9nYW1lXCI7XHJcblxyXG4vKipcclxuICogQnJpY2tzIGZhY3RvcnlcclxuICogXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFt4PTBdXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFt5PTBdXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYnJpY2sgID0gKHggPSAwLCB5ID0gMCkgPT4gKHtcclxuICAgIHBvc1g6IHgsXHJcbiAgICBwb3NZOiB5LFxyXG5cclxuICAgIGhlaWdodDogMjAsXHJcblxyXG4gICAgY29sb3I6ICdncmVlbicsXHJcblxyXG4gICAgdmlzaWJsZTogdHJ1ZSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0aW5nIHRoZSBicmljayB3aWR0aFxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIChib2FyZC53aWR0aCAgLSBicmlja3Mub2Zmc2V0ICogKGJyaWNrcy5jb2x1bW5zIC0gMSkpIC8gYnJpY2tzLmNvbHVtbnM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGJyaWNrIHBvc2l0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHggW3g9MF1cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IFt5PTBdXHJcbiAgICAgKi9cclxuICAgIHNldFBvc2l0aW9uKHggPSAwLCB5ID0gMCkgeyBcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY2VudGVyIFggcG9zaXRpb24gb2YgYnJpY2tcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgY2VudGVyWCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NYICsgdGhpcy53aWR0aCAvIDI7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY2VudGVyIFkgcG9zaXRpb24gb2YgYnJpY2tcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBjZW50ZXJZKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvc1kgKyB0aGlzLmhlaWdodCAvIDI7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSB0aGUgYnJpY2sgb24gY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vKipcclxuICogQnJpY2tzIG1hbmlwdWxhdGlvbiBvYmplY3RcclxuICogXHJcbiAqIEB0eXBlIHt7XHJcbiAqICBvZmZzZXQ6IE51bWJlciwgXHJcbiAqICBvZmZzZXRUb3A6IE51bWJlciwgXHJcbiAqICByb3dzOiBOdW1iZXIsIFxyXG4gKiAgbWF4QnJpY2tXaWR0aDogTnVtYmVyLCBcclxuICogIGxpc3Q6IEFycmF5LCBcclxuICogIGNvbHVtbnMsIFxyXG4gKiAgZ2V0UmFuZG9tQ29sb3I6IChmdW5jdGlvbigpKSwgXHJcbiAqICBidWlsZDogKGZ1bmN0aW9uKCkpLCBcclxuICogIHJlbmRlcjogKGZ1bmN0aW9uKCkpXHJcbiAqIH19XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgYnJpY2tzID0ge1xyXG4gICAgb2Zmc2V0OiAwLFxyXG4gICAgb2Zmc2V0VG9wOiA2MCxcclxuXHJcbiAgICByb3dzOiA2LFxyXG5cclxuICAgIG1heEJyaWNrV2lkdGg6IDEwMCxcclxuXHJcbiAgICBsaXN0OiBbXSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSB0aGUgY29sdW1ucyBjb3VudFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGdldCBjb2x1bW5zKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKGJvYXJkLndpZHRoIC8gdGhpcy5tYXhCcmlja1dpZHRoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcmFuZG9tIGNvbG9yXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZ2V0UmFuZG9tQ29sb3IoKSB7XHJcbiAgICAgICAgdmFyIGxldHRlcnMgPSAnMDEyMzQ1Njc4OUFCQ0RFRicuc3BsaXQoJycpO1xyXG4gICAgICAgIHZhciBjb2xvciA9ICcjJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKyApIHtcclxuICAgICAgICAgICAgY29sb3IgKz0gbGV0dGVyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNildO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29sb3I7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRHJhd2luZyBhbGwgYnJpY2tzIG9uIGNhbnZhc1xyXG4gICAgICovXHJcbiAgICBidWlsZCgpIHtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCB0aGlzLnJvd3M7IHIrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHRoaXMuY29sdW1uczsgYysrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGIgPSBicmljaygpO1xyXG4gICAgICAgICAgICAgICAgYi5zZXRQb3NpdGlvbihjICogKGIud2lkdGggKyB0aGlzLm9mZnNldCksIHRoaXMub2Zmc2V0VG9wICsgKCh0aGlzLm9mZnNldCArIGIuaGVpZ2h0KSAqIHIpKTtcclxuICAgICAgICAgICAgICAgIGIuY29sb3IgPSB0aGlzLmdldFJhbmRvbUNvbG9yKCk7XHJcbiAgICAgICAgICAgICAgICBiLnJlbmRlcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMubGlzdC5wdXNoKGIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlY3RpbmcgY29sbGlzaW9ucyBiZXR3ZWVuIGJhbGwgYW5kIGJyaWNrc1xyXG4gICAgICovXHJcbiAgICByZW5kZXIoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxpc3QubGVuZ3RoIC0gZ2FtZS5zY29yZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBnYW1lLnZpY3RvcnkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjb2xsaXNpb24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmxpc3QubWFwKGIgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGIudmlzaWJsZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiYWxsLnBvc1ggKyBiYWxsLnJhZGl1cyA+PSBiLnBvc1ggJiYgYmFsbC5wb3NYIC0gYmFsbC5yYWRpdXMgIDw9IGIucG9zWCArIGIud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmFsbC5wb3NZIDwgYi5wb3NZICsgYi5oZWlnaHQgJiYgYmFsbC5wb3NZICsgYmFsbC5zaXplID4gYi5wb3NZKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBiLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29sbGlzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWSA9IC1iYWxsLnNwZWVkWTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpc2lvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuc2NvcmUrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnYW1lLnNjb3JlICUgZ2FtZS5tdWx0aXBsaWVyID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWCArPSAoYmFsbC5zcGVlZFggPCAwKSA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbGwuc3BlZWRZICs9IChiYWxsLnNwZWVkWSA8IDApID8gLTIgOiAyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lLmxldmVsVXAoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGVzLmJ1aWxkKGIuY2VudGVyWCgpLCBiLmNlbnRlclkoKSwgYi5jb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kLnBsYXkoJ2NvbGxpZGUnLCAnYnJpY2snKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYi5yZW5kZXIoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGI7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufTsiLCJpbXBvcnQge2JvYXJkLCBjdHh9IGZyb20gXCIuL2JvYXJkXCI7XHJcbmltcG9ydCB7YW5pbWF0aW9ufSBmcm9tIFwiLi9hcHBcIjtcclxuXHJcbi8qKlxyXG4gKiBHYW1lJ3MgZnVuY3Rpb25zXHJcbiAqXHJcbiAqIEB0eXBlIHt7XHJcbiAqICBzY29yZTogTnVtYmVyLFxyXG4gKiAgbGV2ZWw6IE51bWJlcixcclxuICogIG11bHRpcGxpZXI6IE51bWJlcixcclxuICogIHRleHRQYWRkaW5nOiBOdW1iZXIsXHJcbiAqICBsZXZlbFVwOiAoZnVuY3Rpb24oKSksXHJcbiAqICBkaXNwbGF5U2NvcmU6IChmdW5jdGlvbigpKSxcclxuICogIGRpc3BsYXlMZXZlbDogKGZ1bmN0aW9uKCkpLFxyXG4gKiAgb3ZlcjogKGZ1bmN0aW9uKCkpLFxyXG4gKiAgdmljdG9yeTogKGZ1bmN0aW9uKCkpXHJcbiAqIH19XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ2FtZSA9IHtcclxuICAgIHNjb3JlOiAwLFxyXG4gICAgbGV2ZWw6IDEsXHJcblxyXG4gICAgbXVsdGlwbGllcjogNCxcclxuXHJcbiAgICB0ZXh0UGFkZGluZzogMTAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmNyZWFzZSB0aGUgbGV2ZWxcclxuICAgICAqL1xyXG4gICAgbGV2ZWxVcCgpIHtcclxuICAgICAgICB0aGlzLmxldmVsKys7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheWluZyB0aGUgc2NvcmUgb2YgdGhlIGdhbWVcclxuICAgICAqL1xyXG4gICAgZGlzcGxheVNjb3JlKCkge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjE4cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gXCJzdGFydFwiO1xyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChgU2NvcmU6ICR7dGhpcy5zY29yZX1gLCB0aGlzLnRleHRQYWRkaW5nLCB0aGlzLnRleHRQYWRkaW5nKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheWluZyB0aGUgbGV2ZWxcclxuICAgICAqL1xyXG4gICAgZGlzcGxheUxldmVsKCkge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjE4cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gXCJlbmRcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcclxuICAgICAgICBjdHguZmlsbFRleHQoYExldmVsOiAke3RoaXMubGV2ZWx9YCwgYm9hcmQud2lkdGggLSB0aGlzLnRleHRQYWRkaW5nLCB0aGlzLnRleHRQYWRkaW5nKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHYW1lIG92ZXIgOihcclxuICAgICAqIERpc3BsYXlpbmcgdGhlIG1lc3NhZ2VcclxuICAgICAqIFN0b3AgdGhlIGdhbWUgbG9vcFxyXG4gICAgICovXHJcbiAgICBvdmVyKCkge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjI2cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICBjdHguZmlsbFRleHQoYEdhbWUgT3ZlcmAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMiAtIDQwKTtcclxuXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiIzIxMjEyMVwiO1xyXG4gICAgICAgIGN0eC5mb250ID0gXCIyMnB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGBZb3VyIHNjb3JlIGlzICR7dGhpcy5zY29yZX0gcG9pbnRzIWAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGBZb3UgcmVhY2hlZCBsZXZlbCAke3RoaXMubGV2ZWx9YCwgYm9hcmQud2lkdGggLyAyLCBib2FyZC5oZWlnaHQgLyAyICsgMzApO1xyXG5cclxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFZpY3RvcnkhXHJcbiAgICAgKiBEaXNwbGF5aW5nIHRoZSBtZXNzYWdlXHJcbiAgICAgKiBTdG9wIHRoZSBnYW1lIGxvb3BcclxuICAgICAqL1xyXG4gICAgdmljdG9yeSgpIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICBjdHguZm9udCA9IFwiMjZweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChgQ29uZ3JhdHVsYXRpb25zIWAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGBZb3Ugd29uYCwgYm9hcmQud2lkdGggLyAyLCBib2FyZC5oZWlnaHQgLyAyICsgNDApO1xyXG5cclxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcclxuIiwiaW1wb3J0IHtjYW52YXN9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEB0eXBlIHt7XHJcbiAqICBwb3NYOiBOdW1iZXIsIFxyXG4gKiAgcG9zWTogTnVtYmVyLFxyXG4gKiAgc2V0UG9zaXRpb246IChmdW5jdGlvbihOdW1iZXI9LCBOdW1iZXI9KSlcclxuICogfX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBtb3VzZSA9IHtcclxuICAgIHBvc1g6IDAsXHJcbiAgICBwb3NZOiAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IG1vdXNlIHBvc2l0aW9uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHggW3g9MF1cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IFt5PTBdXHJcbiAgICAgKi9cclxuICAgIHNldFBvc2l0aW9uKHggPSAwLCB5ID0gMCkge1xyXG4gICAgICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NZID0geTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIGxpc3RlbmVyc1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4gbW91c2Uuc2V0UG9zaXRpb24oZS5wYWdlWCwgZS5wYWdlWSkgLCB0cnVlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vdXNlOyIsImltcG9ydCB7Y3R4fSBmcm9tICcuL2JvYXJkJztcclxuXHJcbi8qKlxyXG4gKiBQYXJ0aWNsZSBmYWN0b3J5IGZ1bmN0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFt4PTBdXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFt5PTBdXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjIFtjPSdibGFjayddXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcGFydGljbGUgPSAoeCA9IDAsIHkgPSAwLCBjID0gJ2JsYWNrJykgPT4gKHtcclxuICAgIHBvc1g6IHgsXHJcbiAgICBwb3NZOiB5LFxyXG5cclxuICAgIHNwZWVkWDogLTUgKyBNYXRoLnJhbmRvbSgpICogMTAsXHJcbiAgICBzcGVlZFk6IC01ICsgTWF0aC5yYW5kb20oKSAqIDEwLFxyXG5cclxuICAgIGNvbG9yOiBjLCBcclxuXHJcbiAgICByYWRpdXM6IDMuNVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBQYXJ0aWNsZXMgbWFuaXB1bGF0aW9uIG9iamVjdFxyXG4gKlxyXG4gKiBAdHlwZSB7e1xyXG4gKiAgY291bnQ6IG51bWJlcixcclxuICogIGxpc3Q6IEFycmF5LFxyXG4gKiAgYnVpbGQ6IChmdW5jdGlvbihOdW1iZXI9LCBOdW1iZXI9LCBTdHJpbmc9KSksXHJcbiAqICBlbWl0OiAoZnVuY3Rpb24oKSlcclxuICogfX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBwYXJ0aWNsZXMgPSB7XHJcbiAgICBjb3VudDogMjAsXHJcbiAgICBsaXN0OiBbXSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0aW5nIHBhcnRpY2xlc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IFt4PTBdXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geSBbeT0wXVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIFtjPSdibGFjayddXHJcbiAgICAgKi9cclxuICAgIGJ1aWxkKHggPSAwLCB5ID0gMCwgY29sb3IgPSAnYmxhY2snKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5saXN0LnB1c2gocGFydGljbGUoeCwgeSwgY29sb3IpKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheWluZyB0aGUgcGFydGljbGVzIG9uIGJvYXJkXHJcbiAgICAgKi9cclxuICAgIGVtaXQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdCA9IHRoaXMubGlzdC5maWx0ZXIoZSA9PiBlLnJhZGl1cyA+IDApO1xyXG4gICAgICAgIHRoaXMubGlzdC5tYXAocCA9PiB7XHJcblxyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBwLmNvbG9yO1xyXG4gICAgICAgICAgICBpZiAocC5yYWRpdXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKHAucG9zWCwgcC5wb3NZLCBwLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgICAgICBwLnBvc1ggKz0gcC5zcGVlZFg7XHJcbiAgICAgICAgICAgIHAucG9zWSArPSBwLnNwZWVkWTtcclxuXHJcbiAgICAgICAgICAgIHAucmFkaXVzID0gTWF0aC5tYXgocC5yYWRpdXMgLSAwLjIsIDAuMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4iLCJpbXBvcnQge2N0eH0gZnJvbSAnLi9ib2FyZCc7XHJcbmltcG9ydCB7bW91c2V9IGZyb20gXCIuL21vdXNlXCI7XHJcbmltcG9ydCB7Ym9hcmR9IGZyb20gXCIuL2JvYXJkXCI7XHJcblxyXG4vKipcclxuICogUGxheWVyIChQYWRkbGUpIG9iamVjdFxyXG4gKlxyXG4gKiBAdHlwZSB7e1xyXG4gKiAgcG9zWDogTnVtYmVyLFxyXG4gKiAgcG9zWTogTnVtYmVyLFxyXG4gKiAgbGFzdFBvc1g6IE51bWJlcixcclxuICogIGRpcmVjdGlvbjogTnVtYmVyLFxyXG4gKiAgd2lkdGg6IE51bWJlcixcclxuICogIGhlaWdodDogTnVtYmVyLFxyXG4gKiAgY29sb3I6IFN0cmluZyxcclxuICogIHNldFBvc2l0aW9uOiAoZnVuY3Rpb24oTnVtYmVyPSwgTnVtYmVyPSkpLFxyXG4gKiAgbW92ZTogKGZ1bmN0aW9uKCkpLFxyXG4gKiAgZGV0ZWN0RGlyZWN0aW9uOiAoZnVuY3Rpb24oKSksXHJcbiAqICByZW5kZXI6IChmdW5jdGlvbigpKVxyXG4gKiB9fVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHBsYXllciA9IHtcclxuICAgIHBvc1g6IDAsXHJcbiAgICBwb3NZOiAwLFxyXG5cclxuICAgIGxhc3RQb3NYOiAwLFxyXG4gICAgZGlyZWN0aW9uOiAwLFxyXG5cclxuICAgIHdpZHRoOiAxMjAsXHJcbiAgICBoZWlnaHQ6IDEwLFxyXG4gICAgXHJcbiAgICBjb2xvcjogJ2JsYWNrJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBwbGF5ZXIgcG9zaXRpb25cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0geCBbeD0wXVxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHkgW3k9MF1cclxuICAgICAqL1xyXG4gICAgc2V0UG9zaXRpb24oeCA9IDAsIHkgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5wb3NYID0geDtcclxuICAgICAgICB0aGlzLnBvc1kgPSB5O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdXNlIGNvbnRyb2xcclxuICAgICAqL1xyXG4gICAgbW92ZSgpIHtcclxuXHJcbiAgICAgICAgY29uc3QgbGVmdCA9IG1vdXNlLnBvc1ggLSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICBjb25zdCByaWdodCA9IG1vdXNlLnBvc1ggKyB0aGlzLndpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgaWYgKGxlZnQgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zWCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmKHJpZ2h0ID4gYm9hcmQud2lkdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NYID0gYm9hcmQud2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zWCA9IGxlZnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRldGVjdERpcmVjdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmRpbmcgb3V0IHRoZSBkaXJlY3Rpb24gb2YgbW92ZW1lbnRcclxuICAgICAqL1xyXG4gICAgZGV0ZWN0RGlyZWN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gKHRoaXMucG9zWCA9PT0gdGhpcy5sYXN0UG9zWCkgPyAwIDogKHRoaXMucG9zWCA+IHRoaXMubGFzdFBvc1gpID8gMSA6IC0xIDtcclxuICAgICAgICB0aGlzLmxhc3RQb3NYID0gdGhpcy5wb3NYO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXlpbmcgdGhlIHBsYXllciBvbiBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NYLCB0aGlzLnBvc1ksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcGxheWVyOyIsIi8qKlxyXG4gKiBTb3VuZCBjbGFzc1xyXG4gKiBcclxuICogQHR5cGUge3tcclxuICogIHNvdW5kczoge1xyXG4gKiAgICAgIGNvbGxpZGU6IHt3YWxsOiBFbGVtZW50LCBwbGF5ZXI6IEVsZW1lbnQsIGJyaWNrOiBFbGVtZW50fVxyXG4gKiAgfSxcclxuICogIHBsYXk6IChmdW5jdGlvbihTdHJpbmcsIFN0cmluZykpfX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBzb3VuZCA9IHtcclxuICAgIHNvdW5kczoge1xyXG4gICAgICAgIGNvbGxpZGU6IHtcclxuICAgICAgICAgICAgd2FsbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxpZGUtd2FsbHMnKSxcclxuICAgICAgICAgICAgcGxheWVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sbGlkZS1wbGF5ZXInKSxcclxuICAgICAgICAgICAgYnJpY2s6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xsaWRlLWJyaWNrJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxyXG4gICAgICogQHJldHVybnMgeyp8dm9pZH1cclxuICAgICAqL1xyXG4gICAgcGxheShhY3Rpb24sIHR5cGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc291bmRzLmhhc093blByb3BlcnR5KGFjdGlvbikgJiYgdGhpcy5zb3VuZHNbYWN0aW9uXS5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1thY3Rpb25dW3R5cGVdLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZHNbYWN0aW9uXVt0eXBlXS52b2x1bWUgPSAwLjY7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdW5kc1thY3Rpb25dW3R5cGVdLnBsYXkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU291bmQgd2l0aCBhY3Rpb246ICcke2FjdGlvbn0nIGFuZCB0eXBlOiAnJHt0eXBlfScgaXMgbm90IGRlZmluZWRgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNvdW5kOyJdfQ==
