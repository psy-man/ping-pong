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
    if (_ball2.default.posX + _ball2.default.center >= _player2.default.posX && _ball2.default.posX <= _player2.default.posX + _player2.default.width && _ball2.default.posY + _ball2.default.size >= _player2.default.posY) {

        if (_player2.default.direction === -1 && _ball2.default.speedX > 0) {
            _ball2.default.speedX = -_ball2.default.speedX;
        }

        if (_player2.default.direction === 1 && _ball2.default.speedX < 0) {
            _ball2.default.speedX = -_ball2.default.speedX;
        }

        _ball2.default.speedY = -_ball2.default.speedY;

        _particle.particles.build(_ball2.default.posX + _ball2.default.center, _ball2.default.posY + _ball2.default.size, 'black');
        _sound2.default.play('collide', 'player');
    } else if (_ball2.default.posY + _ball2.default.size >= _board.board.height) {
        _ball2.default.posY = _board.board.height - _ball2.default.size;
        _game2.default.over();
    }
};

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

var ball = exports.ball = {
    posX: 40,
    posY: 40,

    speedX: 4,
    speedY: -8,

    image: document.getElementById("ball"),

    width: 20,
    height: 20,

    angle: 0,

    get size() {
        return this.width;
    },
    get center() {
        return this.width / 2;
    },

    setPosition: function setPosition() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        this.posX = x;
        this.posY = y;
    },
    move: function move() {
        this.posX += this.speedX;
        this.posY += this.speedY;
    },
    render: function render() {
        _board.ctx.save();
        _board.ctx.translate(this.posX + this.center, this.posY + this.center);
        _board.ctx.rotate(this.angle * Math.PI / 180);
        _board.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        _board.ctx.restore();

        this.angle += this.speedX * 2;
    }
};

exports.default = ball;

},{"./board":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var canvas = exports.canvas = document.getElementById("board");
var ctx = exports.ctx = canvas.getContext('2d');

var board = exports.board = {
    color: '#f9f9f9',

    get width() {
        return canvas.width;
    },
    get height() {
        return canvas.height;
    },

    setSize: function setSize() {
        var w = arguments.length <= 0 || arguments[0] === undefined ? 800 : arguments[0];
        var h = arguments.length <= 1 || arguments[1] === undefined ? 600 : arguments[1];

        canvas.width = w;
        canvas.height = h;
    },
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

var brick = exports.brick = function brick() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    return {
        posX: x,
        posY: y,

        height: 20,

        color: 'green',

        visible: true,

        get width() {
            return (_board.board.width - bricks.offset * (bricks.columns - 1)) / bricks.columns;
        },

        setPosition: function setPosition() {
            var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            this.posX = x;
            this.posY = y;
        },
        centerX: function centerX() {
            return this.posX + this.width / 2;
        },
        centerY: function centerY() {
            return this.posY + this.height / 2;
        },
        render: function render() {
            _board.ctx.beginPath();
            _board.ctx.fillStyle = this.color;
            _board.ctx.fillRect(this.posX, this.posY, this.width, this.height);
            _board.ctx.closePath();
            _board.ctx.stroke();
        }
    };
};

var bricks = exports.bricks = {
    offset: 0,
    offsetTop: 60,

    rows: 6,

    maxBrickWidth: 100,

    list: [],

    get columns() {
        return Math.floor(_board.board.width / this.maxBrickWidth);
    },

    getRandomColor: function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
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
    render: function render() {

        if (this.list.length - _game.game.score === 0) {
            _game.game.win();
        }

        var collision = false;
        this.list = this.list.map(function (b) {

            if (b.visible === true) {

                if (_ball.ball.posX + _ball.ball.center >= b.posX && _ball.ball.posX - _ball.ball.center <= b.posX + b.width) {
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

var game = exports.game = {
    score: 0,
    level: 1,

    multiplier: 4,

    textPadding: 10,

    levelUp: function levelUp() {
        this.level++;
    },
    displayScore: function displayScore() {
        _board.ctx.fillStyle = "black";
        _board.ctx.font = "18px Arial, sans-serif";
        _board.ctx.textAlign = "start";
        _board.ctx.textBaseline = "top";
        _board.ctx.fillText("Score: " + this.score, this.textPadding, this.textPadding);
    },
    displayLevel: function displayLevel() {
        _board.ctx.fillStyle = "black";
        _board.ctx.font = "18px Arial, sans-serif";
        _board.ctx.textAlign = "end";
        _board.ctx.textBaseline = "top";
        _board.ctx.fillText("Level: " + this.level, _board.board.width - this.textPadding, this.textPadding);
    },
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
    win: function win() {
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

var mouse = exports.mouse = {
    posX: 0,
    posY: 0,

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

var particle = exports.particle = function particle(x, y, c) {
    return {
        posX: x,
        posY: y,

        speedX: -5 + Math.random() * 10,
        speedY: -5 + Math.random() * 10,

        color: c,

        radius: 3.5
    };
};

var particles = exports.particles = {
    count: 20,
    list: [],

    build: function build(x, y, color) {
        for (var i = 0; i < this.count; i++) {
            this.list.push(particle(x, y, color));
        }
    },
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

var player = exports.player = {
    posX: 0,
    posY: 0,

    lastPosX: 0,
    direction: 0,

    width: 120,
    height: 10,

    color: 'black',

    setPosition: function setPosition() {
        var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        this.posX = x;
        this.posY = y;
    },
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

        this.direction = this.posX === this.lastPosX ? 0 : this.posX > this.lastPosX ? 1 : -1;
        this.lastPosX = this.posX;
    },
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
var sound = exports.sound = {
    sounds: {
        collide: {
            wall: document.getElementById('collide-walls'),
            player: document.getElementById('collide-player'),
            brick: document.getElementById('collide-brick')
        }
    },

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYXBwLmpzIiwianNcXGJhbGwuanMiLCJqc1xcYm9hcmQuanMiLCJqc1xcYnJpY2suanMiLCJqc1xcZ2FtZS5qcyIsImpzXFxtb3VzZS5qcyIsImpzXFxwYXJ0aWNsZS5qcyIsImpzXFxwbGF5ZXIuanMiLCJqc1xcc291bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztjQUtJO0lBRlksc0JBQVo7SUFDYSx1QkFBYjtBQUdHLElBQUksZ0NBQVksSUFBWjs7O0FBR1gsYUFBTSxPQUFOLENBQWMsV0FBZCxFQUEyQixZQUEzQjtBQUNBLGFBQU0sTUFBTjs7QUFFQSxlQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsYUFBTSxNQUFOLEdBQWUsQ0FBZixHQUFtQixDQUFuQixDQUF0QjtBQUNBLGVBQUssTUFBTDs7QUFFQSxpQkFBTyxXQUFQLENBQW1CLGFBQU0sS0FBTixHQUFjLENBQWQsR0FBa0IsaUJBQU8sS0FBUCxHQUFlLENBQWYsRUFBa0IsYUFBTSxNQUFOLEdBQWUsaUJBQU8sTUFBUCxDQUF0RTtBQUNBLGlCQUFPLE1BQVA7O0FBRUEsY0FBTyxLQUFQOztBQUdBLElBQU0sWUFBWSxTQUFaLFNBQVksR0FBTTs7O0FBR3BCLFFBQUksZUFBSyxJQUFMLElBQWEsQ0FBYixFQUFnQjtBQUNoQix1QkFBSyxNQUFMLEdBQWMsQ0FBQyxlQUFLLE1BQUwsQ0FEQztBQUVoQix3QkFBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixNQUF0QixFQUZnQjtLQUFwQjs7O0FBSG9CLFFBU2hCLGVBQUssSUFBTCxHQUFZLGVBQUssSUFBTCxJQUFhLGFBQU0sS0FBTixFQUFhO0FBQ3RDLHVCQUFLLE1BQUwsR0FBYyxDQUFDLGVBQUssTUFBTCxDQUR1QjtBQUV0Qyx3QkFBTSxJQUFOLENB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LEVBQVcsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLEVBQVksS0FBSyxNQUFMLENBQS9DLENBSEs7QUFJTCxtQkFBSSxTQUFKLEdBSks7QUFLTCxtQkFBSSxNQUFKLEdBTEs7S0FoQ1M7Q0FBVDs7a0JBeUNFOzs7Ozs7OztBQzVDUixJQUFNLHdCQUFRO0FBQ2pCLFlBQVE7QUFDSixpQkFBUztBQUNMLGtCQUFNLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFOO0FBQ0Esb0JBQVEsU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQUFSO0FBQ0EsbUJBQU8sU0FBUyxjQUFULENBQXdCLGVBQXhCLENBQVA7U0FISjtLQURKOztBQVFBLHdCQUFLLFFBQVEsTUFBTTs7QUFFZixZQUFJLEtBQUssTUFBTCxDQUFZLGNBQVosQ0FBMkIsTUFBM0IsS0FBc0MsS0FBSyxNQUFMLENBQVksTUFBWixFQUFvQixjQUFwQixDQUFtQyxJQUFuQyxDQUF0QyxFQUFnRjtBQUNoRixpQkFBSyxNQUFMLENBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixXQUExQixHQUF3QyxDQUF4QyxDQURnRjtBQUVoRixpQkFBSyxNQUFMLENBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixNQUExQixHQUFtQyxHQUFuQyxDQUZnRjtBQUdoRixtQkFBTyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQVAsQ0FIZ0Y7U0FBcEY7O0FBTUEsY0FBTSxJQUFJLEtBQUosMkJBQWlDLDZCQUFzQiwwQkFBdkQsQ0FBTixDQVJlO0tBVEY7Q0FBUjs7a0JBcUJFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBnYW1lIGZyb20gJy4vZ2FtZSc7XHJcbmltcG9ydCB7Ym9hcmR9IGZyb20gJy4vYm9hcmQnO1xyXG5pbXBvcnQgYmFsbCBmcm9tICcuL2JhbGwnO1xyXG5pbXBvcnQgcGxheWVyIGZyb20gJy4vcGxheWVyJztcclxuaW1wb3J0IHtwYXJ0aWNsZXN9IGZyb20gJy4vcGFydGljbGUnO1xyXG5pbXBvcnQge2JyaWNrc30gZnJvbSAnLi9icmljayc7XHJcbmltcG9ydCBzb3VuZCBmcm9tICcuL3NvdW5kJztcclxuXHJcbmxldCB7XHJcbiAgICBpbm5lcldpZHRoOiB3aW5kb3dXaWR0aCxcclxuICAgIGlubmVySGVpZ2h0OiB3aW5kb3dIZWlnaHRcclxufSA9IHdpbmRvdztcclxuXHJcbmV4cG9ydCBsZXQgYW5pbWF0aW9uID0gbnVsbDtcclxuXHJcbi8vIEluaXQgYm9hcmRcclxuYm9hcmQuc2V0U2l6ZSh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcclxuYm9hcmQucmVuZGVyKCk7XHJcblxyXG5iYWxsLnNldFBvc2l0aW9uKDIwMCwgYm9hcmQuaGVpZ2h0IC8gMyAqIDIpO1xyXG5iYWxsLnJlbmRlcigpO1xyXG4vL1xyXG5wbGF5ZXIuc2V0UG9zaXRpb24oYm9hcmQud2lkdGggLyAyIC0gcGxheWVyLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC0gcGxheWVyLmhlaWdodCk7XHJcbnBsYXllci5yZW5kZXIoKTtcclxuLy9cclxuYnJpY2tzLmJ1aWxkKCk7XHJcblxyXG5cclxuY29uc3QgY29sbGlzaW9uID0gKCkgPT4ge1xyXG5cclxuICAgIC8vIHRvcFxyXG4gICAgaWYgKGJhbGwucG9zWSA8PSAwKSB7XHJcbiAgICAgICAgYmFsbC5zcGVlZFkgPSAtYmFsbC5zcGVlZFk7XHJcbiAgICAgICAgc291bmQucGxheSgnY29sbGlkZScsICd3YWxsJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmlnaHRcclxuICAgIGlmIChiYWxsLnBvc1ggKyBiYWxsLnNpemUgPj0gYm9hcmQud2lkdGgpIHtcclxuICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ3dhbGwnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBsZWZ0XHJcbiAgICBpZiAoYmFsbC5wb3NYIDw9IDApIHtcclxuICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ3dhbGwnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwbGF5ZXIgb3IgZ2FtZSBvdmVyIDooXHJcbiAgICBpZiAoYmFsbC5wb3NYICsgYmFsbC5jZW50ZXIgPj0gcGxheWVyLnBvc1ggJiYgYmFsbC5wb3NYIDw9IHBsYXllci5wb3NYICsgcGxheWVyLndpZHRoICYmIGJhbGwucG9zWSArIGJhbGwuc2l6ZSA+PSBwbGF5ZXIucG9zWSkge1xyXG5cclxuICAgICAgICBpZiAocGxheWVyLmRpcmVjdGlvbiA9PT0gLTEgJiYgYmFsbC5zcGVlZFggPiAwKSB7XHJcbiAgICAgICAgICAgIGJhbGwuc3BlZWRYID0gLWJhbGwuc3BlZWRYO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsYXllci5kaXJlY3Rpb24gPT09IDEgJiYgYmFsbC5zcGVlZFggPCAwKSB7XHJcbiAgICAgICAgICAgIGJhbGwuc3BlZWRYID0gLWJhbGwuc3BlZWRYO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmFsbC5zcGVlZFkgPSAtYmFsbC5zcGVlZFk7XHJcblxyXG4gICAgICAgIHBhcnRpY2xlcy5idWlsZChiYWxsLnBvc1ggKyBiYWxsLmNlbnRlciwgYmFsbC5wb3NZICsgYmFsbC5zaXplLCAnYmxhY2snKTtcclxuICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ3BsYXllcicpXHJcbiAgICAgICAgXHJcbiAgICB9IGVsc2UgaWYgKGJhbGwucG9zWSArIGJhbGwuc2l6ZSA+PSBib2FyZC5oZWlnaHQpIHtcclxuICAgICAgICBiYWxsLnBvc1kgPSBib2FyZC5oZWlnaHQgLSBiYWxsLnNpemU7XHJcbiAgICAgICAgZ2FtZS5vdmVyKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBkcmF3ID0gKCkgPT4ge1xyXG5cclxuICAgIGJvYXJkLnJlbmRlcigpO1xyXG4gICAgYnJpY2tzLnJlbmRlcigpO1xyXG5cclxuICAgIGdhbWUuZGlzcGxheVNjb3JlKCk7XHJcbiAgICBnYW1lLmRpc3BsYXlMZXZlbCgpO1xyXG5cclxuICAgIGNvbGxpc2lvbigpO1xyXG5cclxuICAgIGJhbGwubW92ZSgpO1xyXG4gICAgYmFsbC5yZW5kZXIoKTtcclxuICAgIFxyXG4gICAgcGFydGljbGVzLmVtaXQoKTtcclxuXHJcbiAgICBwbGF5ZXIubW92ZSgpO1xyXG4gICAgcGxheWVyLnJlbmRlcigpO1xyXG59O1xyXG5cclxuY29uc3QgYW5pbWF0aW9uTG9vcCA9ICgpID0+IHtcclxuICAgIGFuaW1hdGlvbiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRpb25Mb29wKTtcclxuICAgIGRyYXcoKTtcclxufTtcclxuXHJcbmFuaW1hdGlvbkxvb3AoKTsiLCJpbXBvcnQge2N0eH0gZnJvbSAnLi9ib2FyZCc7XHJcblxyXG5leHBvcnQgY29uc3QgYmFsbCA9IHtcclxuICAgIHBvc1g6IDQwLFxyXG4gICAgcG9zWTogNDAsXHJcblxyXG4gICAgc3BlZWRYOiA0LFxyXG4gICAgc3BlZWRZOiAtOCxcclxuXHJcbiAgICBpbWFnZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWxsXCIpLFxyXG5cclxuICAgIHdpZHRoOiAyMCxcclxuICAgIGhlaWdodDogMjAsXHJcblxyXG4gICAgYW5nbGU6IDAsXHJcblxyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbiAgICB9LFxyXG4gICAgZ2V0IGNlbnRlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAvIDI7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZXRQb3NpdGlvbih4PTAsIHk9MCkge1xyXG4gICAgICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NZID0geTtcclxuICAgIH0sXHJcbiAgICBtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMucG9zWCArPSB0aGlzLnNwZWVkWDtcclxuICAgICAgICB0aGlzLnBvc1kgKz0gdGhpcy5zcGVlZFk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGN0eC5zYXZlKCk7XHJcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnBvc1ggKyB0aGlzLmNlbnRlciwgdGhpcy5wb3NZICsgdGhpcy5jZW50ZXIpO1xyXG4gICAgICAgIGN0eC5yb3RhdGUodGhpcy5hbmdsZSAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgLXRoaXMud2lkdGggLyAyLCAtdGhpcy5oZWlnaHQgLyAyLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmdsZSArPSB0aGlzLnNwZWVkWCAqIDI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBiYWxsOyIsImV4cG9ydCBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkXCIpO1xyXG5leHBvcnQgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5leHBvcnQgY29uc3QgYm9hcmQgPSB7XHJcbiAgICBjb2xvcjogJyNmOWY5ZjknLFxyXG5cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gY2FudmFzLndpZHRoO1xyXG4gICAgfSxcclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhbnZhcy5oZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFNpemUodz04MDAsIGg9NjAwKSB7XHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gdztcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaDtcclxuICAgIH0sXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBib2FyZDsiLCJpbXBvcnQge2N0eCwgYm9hcmR9IGZyb20gJy4vYm9hcmQnO1xyXG5pbXBvcnQge2JhbGx9IGZyb20gXCIuL2JhbGxcIjtcclxuaW1wb3J0IHNvdW5kIGZyb20gXCIuL3NvdW5kXCI7XHJcbmltcG9ydCB7cGFydGljbGVzfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5pbXBvcnQge2dhbWV9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcblxyXG5leHBvcnQgY29uc3QgYnJpY2sgID0gKHggPSAwLCB5ID0gMCkgPT4gKHtcclxuICAgIHBvc1g6IHgsXHJcbiAgICBwb3NZOiB5LFxyXG5cclxuICAgIGhlaWdodDogMjAsXHJcblxyXG4gICAgY29sb3I6ICdncmVlbicsXHJcblxyXG4gICAgdmlzaWJsZTogdHJ1ZSxcclxuXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIChib2FyZC53aWR0aCAgLSBicmlja3Mub2Zmc2V0ICogKGJyaWNrcy5jb2x1bW5zIC0gMSkpIC8gYnJpY2tzLmNvbHVtbnM7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZXRQb3NpdGlvbih4PTAsIHk9MCkgeyBcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9LFxyXG4gICAgY2VudGVyWCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NYICsgdGhpcy53aWR0aCAvIDI7XHJcbiAgICB9LFxyXG4gICAgY2VudGVyWSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb3NZICsgdGhpcy5oZWlnaHQgLyAyO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGJyaWNrcyA9IHtcclxuICAgIG9mZnNldDogMCxcclxuICAgIG9mZnNldFRvcDogNjAsXHJcblxyXG4gICAgcm93czogNixcclxuXHJcbiAgICBtYXhCcmlja1dpZHRoOiAxMDAsXHJcblxyXG4gICAgbGlzdDogW10sXHJcblxyXG4gICAgZ2V0IGNvbHVtbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoYm9hcmQud2lkdGggLyB0aGlzLm1heEJyaWNrV2lkdGgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSYW5kb21Db2xvcigpIHtcclxuICAgICAgICB2YXIgbGV0dGVycyA9ICcwMTIzNDU2Nzg5QUJDREVGJy5zcGxpdCgnJyk7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gJyMnO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrICkge1xyXG4gICAgICAgICAgICBjb2xvciArPSBsZXR0ZXJzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2KV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGQoKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgdGhpcy5yb3dzOyByKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB0aGlzLmNvbHVtbnM7IGMrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBiID0gYnJpY2soKTtcclxuICAgICAgICAgICAgICAgIGIuc2V0UG9zaXRpb24oYyAqIChiLndpZHRoICsgdGhpcy5vZmZzZXQpLCB0aGlzLm9mZnNldFRvcCArICgodGhpcy5vZmZzZXQgKyBiLmhlaWdodCkgKiByKSk7XHJcbiAgICAgICAgICAgICAgICBiLmNvbG9yID0gdGhpcy5nZXRSYW5kb21Db2xvcigpO1xyXG4gICAgICAgICAgICAgICAgYi5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3QucHVzaChiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBcclxuICAgIHJlbmRlcigpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGlzdC5sZW5ndGggLSBnYW1lLnNjb3JlID09PSAwKSB7XHJcbiAgICAgICAgICAgIGdhbWUud2luKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0Lm1hcChiID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChiLnZpc2libGUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmFsbC5wb3NYICsgYmFsbC5jZW50ZXIgPj0gYi5wb3NYICYmIGJhbGwucG9zWCAtIGJhbGwuY2VudGVyICA8PSBiLnBvc1ggKyBiLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhbGwucG9zWSA8IGIucG9zWSArIGIuaGVpZ2h0ICYmIGJhbGwucG9zWSArIGJhbGwuc2l6ZSA+IGIucG9zWSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYi52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbGxpc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbC5zcGVlZFkgPSAtYmFsbC5zcGVlZFk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1lLnNjb3JlKys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2FtZS5zY29yZSAlIGdhbWUubXVsdGlwbGllciA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFsbC5zcGVlZFggKz0gKGJhbGwuc3BlZWRYIDwgMCkgPyAtMSA6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWSArPSAoYmFsbC5zcGVlZFkgPCAwKSA/IC0yIDogMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FtZS5sZXZlbFVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlcy5idWlsZChiLmNlbnRlclgoKSwgYi5jZW50ZXJZKCksIGIuY29sb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ2JyaWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGIucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IHtib2FyZCwgY3R4fSBmcm9tIFwiLi9ib2FyZFwiO1xyXG5pbXBvcnQge2FuaW1hdGlvbn0gZnJvbSBcIi4vYXBwXCI7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGdhbWUgPSB7XHJcbiAgICBzY29yZTogMCxcclxuICAgIGxldmVsOiAxLFxyXG5cclxuICAgIG11bHRpcGxpZXI6IDQsXHJcblxyXG4gICAgdGV4dFBhZGRpbmc6IDEwLFxyXG5cclxuICAgIGxldmVsVXAoKSB7XHJcbiAgICAgICAgdGhpcy5sZXZlbCsrO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgZGlzcGxheVNjb3JlKCkge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjE4cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gXCJzdGFydFwiO1xyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcInRvcFwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChgU2NvcmU6ICR7dGhpcy5zY29yZX1gLCB0aGlzLnRleHRQYWRkaW5nLCB0aGlzLnRleHRQYWRkaW5nKTtcclxuXHJcbiAgICB9LFxyXG4gICAgZGlzcGxheUxldmVsKCkge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjE4cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gXCJlbmRcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJ0b3BcIjtcclxuICAgICAgICBjdHguZmlsbFRleHQoYExldmVsOiAke3RoaXMubGV2ZWx9YCwgYm9hcmQud2lkdGggLSB0aGlzLnRleHRQYWRkaW5nLCB0aGlzLnRleHRQYWRkaW5nKTtcclxuICAgIH0sXHJcbiAgICBvdmVyKCkge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjI2cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICBjdHguZmlsbFRleHQoYEdhbWUgT3ZlcmAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMiAtIDQwKTtcclxuXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiIzIxMjEyMVwiO1xyXG4gICAgICAgIGN0eC5mb250ID0gXCIyMnB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGBZb3VyIHNjb3JlIGlzICR7dGhpcy5zY29yZX0gcG9pbnRzIWAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGBZb3UgcmVhY2hlZCBsZXZlbCAke3RoaXMubGV2ZWx9YCwgYm9hcmQud2lkdGggLyAyLCBib2FyZC5oZWlnaHQgLyAyICsgMzApO1xyXG5cclxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xyXG4gICAgfSxcclxuICAgIHdpbigpIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIjtcclxuICAgICAgICBjdHguZm9udCA9IFwiMjZweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dChgQ29uZ3JhdHVsYXRpb25zIWAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KGBZb3Ugd29uYCwgYm9hcmQud2lkdGggLyAyLCBib2FyZC5oZWlnaHQgLyAyICsgNDApO1xyXG5cclxuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcclxuIiwiaW1wb3J0IHtjYW52YXN9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1vdXNlID0ge1xyXG4gICAgcG9zWDogMCxcclxuICAgIHBvc1k6IDAsXHJcblxyXG4gICAgc2V0UG9zaXRpb24oeD0wLCB5PTApIHtcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBsaXN0ZW5lcnNcclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+IG1vdXNlLnNldFBvc2l0aW9uKGUucGFnZVgsIGUucGFnZVkpICwgdHJ1ZSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb3VzZTsiLCJpbXBvcnQge2N0eH0gZnJvbSAnLi9ib2FyZCc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHBhcnRpY2xlID0gKHgsIHksIGMpID0+ICh7XHJcbiAgICBwb3NYOiB4LFxyXG4gICAgcG9zWTogeSxcclxuXHJcbiAgICBzcGVlZFg6IC01ICsgTWF0aC5yYW5kb20oKSAqIDEwLFxyXG4gICAgc3BlZWRZOiAgLTUgKyBNYXRoLnJhbmRvbSgpICogMTAsXHJcblxyXG4gICAgY29sb3I6IGMsIFxyXG5cclxuICAgIHJhZGl1czogMy41XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHBhcnRpY2xlcyA9IHtcclxuICAgIGNvdW50OiAyMCxcclxuICAgIGxpc3Q6IFtdLFxyXG5cclxuICAgIGJ1aWxkKHgsIHksIGNvbG9yKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5saXN0LnB1c2gocGFydGljbGUoeCwgeSwgY29sb3IpKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGVtaXQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdCA9IHRoaXMubGlzdC5maWx0ZXIoZSA9PiBlLnJhZGl1cyA+IDApO1xyXG4gICAgICAgIHRoaXMubGlzdC5tYXAocCA9PiB7XHJcblxyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBwLmNvbG9yO1xyXG4gICAgICAgICAgICBpZiAocC5yYWRpdXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKHAucG9zWCwgcC5wb3NZLCBwLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgICAgICBwLnBvc1ggKz0gcC5zcGVlZFg7XHJcbiAgICAgICAgICAgIHAucG9zWSArPSBwLnNwZWVkWTtcclxuXHJcbiAgICAgICAgICAgIHAucmFkaXVzID0gTWF0aC5tYXgocC5yYWRpdXMgLSAwLjIsIDAuMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4iLCJpbXBvcnQge2N0eH0gZnJvbSAnLi9ib2FyZCc7XHJcbmltcG9ydCB7bW91c2V9IGZyb20gXCIuL21vdXNlXCI7XHJcbmltcG9ydCB7Ym9hcmR9IGZyb20gXCIuL2JvYXJkXCI7XHJcblxyXG5leHBvcnQgY29uc3QgcGxheWVyID0ge1xyXG4gICAgcG9zWDogMCxcclxuICAgIHBvc1k6IDAsXHJcbiAgICBcclxuICAgIGxhc3RQb3NYOiAwLFxyXG4gICAgZGlyZWN0aW9uOiAwLFxyXG5cclxuICAgIHdpZHRoOiAxMjAsXHJcbiAgICBoZWlnaHQ6IDEwLFxyXG4gICAgXHJcbiAgICBjb2xvcjogJ2JsYWNrJyxcclxuICAgIFxyXG4gICAgc2V0UG9zaXRpb24oeD0wLCB5PTApIHtcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9LFxyXG4gICAgbW92ZSgpIHtcclxuXHJcbiAgICAgICAgY29uc3QgbGVmdCA9IG1vdXNlLnBvc1ggLSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICBjb25zdCByaWdodCA9IG1vdXNlLnBvc1ggKyB0aGlzLndpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgaWYgKGxlZnQgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zWCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIGlmKHJpZ2h0ID4gYm9hcmQud2lkdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NYID0gYm9hcmQud2lkdGggLSB0aGlzLndpZHRoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zWCA9IGxlZnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gKHRoaXMucG9zWCA9PT0gdGhpcy5sYXN0UG9zWCkgPyAwIDogKHRoaXMucG9zWCA+IHRoaXMubGFzdFBvc1gpID8gMSA6IC0xIDtcclxuICAgICAgICB0aGlzLmxhc3RQb3NYID0gdGhpcy5wb3NYO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHBsYXllcjsiLCJcclxuZXhwb3J0IGNvbnN0IHNvdW5kID0ge1xyXG4gICAgc291bmRzOiB7XHJcbiAgICAgICAgY29sbGlkZToge1xyXG4gICAgICAgICAgICB3YWxsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sbGlkZS13YWxscycpLFxyXG4gICAgICAgICAgICBwbGF5ZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xsaWRlLXBsYXllcicpLFxyXG4gICAgICAgICAgICBicmljazogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxpZGUtYnJpY2snKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgcGxheShhY3Rpb24sIHR5cGUpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc291bmRzLmhhc093blByb3BlcnR5KGFjdGlvbikgJiYgdGhpcy5zb3VuZHNbYWN0aW9uXS5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1thY3Rpb25dW3R5cGVdLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZHNbYWN0aW9uXVt0eXBlXS52b2x1bWUgPSAwLjY7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdW5kc1thY3Rpb25dW3R5cGVdLnBsYXkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU291bmQgd2l0aCBhY3Rpb246ICcke2FjdGlvbn0nIGFuZCB0eXBlOiAnJHt0eXBlfScgaXMgbm90IGRlZmluZWRgKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNvdW5kOyJdfQ==
