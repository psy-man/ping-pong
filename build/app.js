(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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


var score = 0;
var animation = null;

// Init board
_board.board.setSize(windowWidth, windowHeight);
_board.board.render();

_ball2.default.setPosition(100, _board.board.height / 3 * 2);
_ball2.default.render();

_player2.default.setPosition(_board.board.width / 2 - _player2.default.width / 2, _board.board.height - _player2.default.height);
_player2.default.render();

_brick.bricks.build();

var gameOver = function gameOver() {

    _board.ctx.fillStlye = "black";
    _board.ctx.font = "20px Arial, sans-serif";
    _board.ctx.textAlign = "center";
    _board.ctx.textBaseline = "middle";
    _board.ctx.fillText('Game Over - You score is ' + score + ' points!', _board.board.width / 2, _board.board.height / 2);

    cancelAnimationFrame(animation);
};

var draw = function draw() {

    _board.board.render();
    _brick.bricks.render();

    _ball2.default.setPosition(_ball2.default.posX + _ball2.default.speedX, _ball2.default.posY + _ball2.default.speedY);

    // top
    if (_ball2.default.posY - _ball2.default.size <= 0) {
        _ball2.default.speedY = -_ball2.default.speedY;
        _sound2.default.play('collide', 'wall');
    }

    // bottom
    if (_ball2.default.posY + _ball2.default.size >= _board.board.height) {

        _ball2.default.posY = _board.board.height - _ball2.default.size;
        gameOver();
    }

    // right
    if (_ball2.default.posX + _ball2.default.size >= _board.board.width) {
        _ball2.default.speedX = -_ball2.default.speedX;
        _sound2.default.play('collide', 'wall');
    }

    // left
    if (_ball2.default.posX - _ball2.default.size <= 0) {
        _ball2.default.speedX = -_ball2.default.speedX;
        _sound2.default.play('collide', 'wall');
    }

    if (_ball2.default.posX + _ball2.default.size / 2 >= _player2.default.posX && _ball2.default.posX - _ball2.default.size / 2 <= _player2.default.posX + _player2.default.width) {

        if (_ball2.default.posY >= _player2.default.posY - _player2.default.height) {

            score++;

            if (_player2.default.direction === -1 && _ball2.default.speedX > 0) {
                _ball2.default.speedX = -_ball2.default.speedX;
            }

            if (_player2.default.direction === 1 && _ball2.default.speedX < 0) {
                _ball2.default.speedX = -_ball2.default.speedX;
            }

            _ball2.default.speedY = -_ball2.default.speedY;

            _particle.particles.build('top', 'black');

            // if (score % 4 === 0) {
            //     ball.speedX += (ball.speedX < 0) ? -1 : 1;
            //     ball.speedY += (ball.speedY < 0) ? -2 : 2;
            // }

            _sound2.default.play('collide', 'player');
        }
    }

    _ball2.default.move();
    _ball2.default.render();
    _particle.particles.emit();

    _player2.default.move();

    _player2.default.direction = _player2.default.posX === _player2.default.lastPosX ? 0 : _player2.default.posX > _player2.default.lastPosX ? 1 : -1;
    _player2.default.lastPosX = _player2.default.posX;
    _player2.default.render();
};

var animationLoop = function animationLoop() {
    animation = requestAnimationFrame(animationLoop);
    draw();
};

animationLoop();

},{"./ball":2,"./board":3,"./brick":4,"./particle":6,"./player":7,"./sound":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ball = undefined;

var _board = require("./board");

var ball = exports.ball = {
    posX: 40,
    posY: 40,

    speedX: 2,
    speedY: -4,

    image: document.getElementById("ball"),

    width: 20,
    height: 20,

    angle: 0,

    get size() {
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
        _board.ctx.translate(this.posX, this.posY);
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var brick = exports.brick = function brick() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    return {
        posX: x,
        posY: y,

        width: 40,
        height: 20,

        color: 'green',

        visible: true,

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

    columns: 0,
    rows: 6,

    maxBrickWidth: 100,
    maxBrickHeight: 20,

    colors: ['red', 'green', 'blue'],

    list: [],

    getRandomColor: function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    build: function build() {

        this.columns = Math.floor(_board.board.width / this.maxBrickWidth);
        var width = (_board.board.width - this.offset * (this.columns - 1)) / this.columns;

        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.columns; c++) {

                var b = brick(c * (width + this.offset), this.offsetTop + (this.offset + this.maxBrickHeight) * r);
                b.width = width;
                b.color = this.getRandomColor();
                b.render();

                this.list.push(b);
            }
        }
    },
    render: function render() {
        this.list = this.list.map(function (b) {

            if (b.visible === true) {

                if (_ball.ball.posX + _ball.ball.size / 2 >= b.posX && _ball.ball.posX - _ball.ball.size / 2 <= b.posX + b.width) {

                    if (_ball.ball.posY - _ball.ball.size < b.posY + b.height && _ball.ball.posY + _ball.ball.size > b.posY) {

                        _ball.ball.speedY = -_ball.ball.speedY;

                        _particle.particles.build('center', b.color);
                        _sound2.default.play('collide', 'brick');

                        b.visible = false;
                    }
                }

                b.render();
            }

            return b;
        });
    }
};

},{"./ball":2,"./board":3,"./particle":6,"./sound":8}],5:[function(require,module,exports){
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
    mouse.setPosition(e.pageX, e.pageY);
}, true);

exports.default = mouse;

},{"./board":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.particles = exports.particle = undefined;

var _board = require('./board');

var _ball = require('./ball');

var particle = exports.particle = function particle(x, y, dir, c) {
    return {

        posX: x,
        posY: y,

        speedX: 0,
        speedY: 0,

        color: c,

        radius: 1.8,

        init: function init() {

            switch (dir) {
                case 'top':
                    this.speedX = -1.5 + Math.random() * 6;
                    this.speedY = -1 * Math.random() * 3;
                    break;
                case 'bottom':
                    this.speedX = -1.9 + Math.random() * 6;
                    this.speedY = Math.random() * 3;
                    break;
                case 'left':
                    this.speedX = -Math.random() * 6;
                    this.speedY = Math.random() * 3;
                    break;
                case 'right':
                    this.speedX = Math.random() * 6;
                    this.speedY = -1 * Math.random() * 3;
                    break;
                case 'center':
                    this.speedX = -1.5 + Math.random() * 2.5;
                    this.speedY = -1 * Math.random() * 1.5;
                    break;
            }

            return this;
        }
    };
};

var particles = exports.particles = {
    count: 20,

    list: [],

    build: function build(dir, color) {
        for (var i = 0; i < this.count; i++) {
            this.list.push(particle(_ball.ball.posX, _ball.ball.posY, dir, color).init());
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

            p.posX += p.speedX;
            p.posY += p.speedY;

            p.radius = Math.max(p.radius - 0.08, 0.0);
        });
    }
};

},{"./ball":2,"./board":3}],7:[function(require,module,exports){
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

},{"./board":3,"./mouse":5}],8:[function(require,module,exports){
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
            this.sounds[action][type].volume = 0.4;
            return this.sounds[action][type].play();
        }

        throw new Error('Sound with action \'' + action + '\' and type \'' + type + '\' is not defined');
    }
};

exports.default = sound;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYXBwLmpzIiwianNcXGJhbGwuanMiLCJqc1xcYm9hcmQuanMiLCJqc1xcYnJpY2suanMiLCJqc1xcbW91c2UuanMiLCJqc1xccGFydGljbGUuanMiLCJqc1xccGxheWVyLmpzIiwianNcXHNvdW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztjQVFJO0lBRlksc0JBQVo7SUFDYSx1QkFBYjs7O0FBR0osSUFBSSxRQUFRLENBQVI7QUFDSixJQUFJLFlBQVksSUFBWjs7O0FBSUosYUFBTSxPQUFOLENBQWMsV0FBZCxFQUEyQixZQUEzQjtBQUNBLGFBQU0sTUFBTjs7QUFFQSxlQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsYUFBTSxNQUFOLEdBQWUsQ0FBZixHQUFtQixDQUFuQixDQUF0QjtBQUNBLGVBQUssTUFBTDs7QUFFQSxpQkFBTyxXQUFQLENBQW1CLGFBQU0sS0FBTixHQUFjLENBQWQsR0FBa0IsaUJBQU8sS0FBUCxHQUFlLENBQWYsRUFBa0IsYUFBTSxNQUFOLEdBQWUsaUJBQU8sTUFBUCxDQUF0RTtBQUNBLGlCQUFPLE1BQVA7O0FBRUEsY0FBTyxLQUFQOztBQUdBLElBQU0sV0FBVyxTQUFYLFFBQVcsR0FBTTs7QUFFbkIsZUFBSSxTQUFKLEdBQWdCLE9BQWhCLENBRm1CO0FBR25CLGVBQUksSUFBSixHQUFXLHdCQUFYLENBSG1CO0FBSW5CLGVBQUksU0FBSixHQUFnQixRQUFoQixDQUptQjtBQUtuQixlQUFJLFlBQUosR0FBbUIsUUFBbkIsQ0FMbUI7QUFNbkIsZUFBSSxRQUFKLCtCQUF5QyxrQkFBekMsRUFBMEQsYUFBTSxLQUFOLEdBQWMsQ0FBZCxFQUFpQixhQUFNLE1BQU4sR0FBZSxDQUFmLENBQTNFLENBTm1COztBQVFuQix5QkFBcUIsU0FBckIsRUFSbUI7Q0FBTjs7QUFXakIsSUFBTSxPQUFPLFNBQVAsSUFBTyxHQUFNOztBQUVmLGlCQUFNLE1BQU4sR0FGZTtBQUdmLGtCQUFPLE1BQVAsR0FIZTs7QUFLZixtQkFBSyxXQUFMLENBQWlCLGVBQUssSUFBTCxHQUFZLGVBQUssTUFBTCxFQUFhLGVBQUssSUFBTCxHQUFZLGVBQUssTUFBTCxDQUF0RDs7O0FBTGUsUUFRWCxlQUFLLElBQUwsR0FBWSxlQUFLLElBQUwsSUFBYSxDQUF6QixFQUE0QjtBQUM1Qix1QkFBSyxNQUFMLEdBQWMsQ0FBQyxlQUFLLE1BQUwsQ0FEYTtBQUU1Qix3QkFBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixNQUF0QixFQUY0QjtLQUFoQzs7O0FBUmUsUUFjWCxlQUFLLElBQUwsR0FBWSxlQUFLLElBQUwsSUFBYSxhQUFNLE1BQU4sRUFBYzs7QUFFdkMsdUJBQUssSUFBTCxHQUFZLGFBQU0sTUFBTixHQUFlLGVBQUssSUFBTCxDQUZZO0FBR3ZDLG1CQUh1QztLQUEzQzs7O0FBZGUsUUFxQlgsZUFBSyxJQUFMLEdBQVksZUFBSyxJQUFMLElBQWEsYUFBTSxLQUFOLEVBQWE7QUFDdEMsdUJBQUssTUFBTCxHQUFjLENBQUMsZUFBSyxNQUFMLENBRHVCO0FBRXRDLHdCQUFNLElBQU4sQ0FBVyxTQUFYLEVBQXNCLE1BQXRCLEVBRnNDO0tBQTFDOzs7QUFyQmUsUUEyQlgsZUFBSyxJQUFMLEdBQVksZUFBSyxJQUFMLElBQWEsQ0FBekIsRUFBNEI7QUFDNUIsdUJBQUssTUFBTCxHQUFjLENBQUMsZUFBSyxNQUFMLENBRGE7QUFFNUIsd0JBQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsTUFBdEIsRUFGNEI7S0FBaEM7O0FBS0EsUUFBSSxlQUFLLElBQUwsR0FBWSxlQUFLLElBQUwsR0FBWSxDQUFaLElBQWlCLGlCQUFPLElBQVAsSUFBZSxlQUFLLElBQUwsR0FBWSxlQUFLLElBQUwsR0FBWSxDQUFaLElBQWlCLGlCQUFPLElBQVAsR0FBYyxpQkFBTyxLQUFQLEVBQWM7O0FBRXJHLFlBQUksZUFBSyxJQUFMLElBQWMsaUJBQU8sSUFBUCxHQUFjLGlCQUFPLE1BQVAsRUFBZTs7QUFFM0Msb0JBRjJDOztBQUkzQyxnQkFBSSxpQkFBTyxTQUFQLEtBQXFCLENBQUMsQ0FBRCxJQUFNLGVBQUssTUFBTCxHQUFjLENBQWQsRUFBaUI7QUFDNUMsK0JBQUssTUFBTCxHQUFjLENBQUMsZUFBSyxNQUFMLENBRDZCO2FBQWhEOztBQUlBLGdCQUFJLGlCQUFPLFNBQVAsS0FBcUIsQ0FBckIsSUFBMEIsZUFBSyxNQUFMLEdBQWMsQ0FBZCxFQUFpQjtBQUMzQywrQkFBSyxNQUFMLEdBQWMsQ0FBQyxlQUFLLE1BQUwsQ0FENEI7YUFBL0M7O0FBSUEsMkJBQUssTUFBTCxHQUFjLENBQUMsZUFBSyxNQUFMLENBWjRCOztBQWMzQyxnQ0FBVSxLQUFWLENBQWdCLEtBQWhCLEVBQXVCLE9BQXZCOzs7Ozs7O0FBZDJDLDJCQXVCM0MsQ0FBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixRQUF0QixFQXZCMkM7U0FBL0M7S0FGSjs7QUErQkEsbUJBQUssSUFBTCxHQS9EZTtBQWdFZixtQkFBSyxNQUFMLEdBaEVlO0FBaUVmLHdCQUFVLElBQVYsR0FqRWU7O0FBcUVmLHFCQUFPLElBQVAsR0FyRWU7O0FBd0VmLHFCQUFPLFNBQVAsR0FBbUIsZ0JBQUMsQ0FBTyxJQUFQLEtBQWdCLGlCQUFPLFFBQVAsR0FBbUIsQ0FBcEMsR0FBd0MsZ0JBQUMsQ0FBTyxJQUFQLEdBQWMsaUJBQU8sUUFBUCxHQUFtQixDQUFsQyxHQUFzQyxDQUFDLENBQUQsQ0F4RWxGO0FBeUVmLHFCQUFPLFFBQVAsR0FBa0IsaUJBQU8sSUFBUCxDQXpFSDtBQTBFZixxQkFBTyxNQUFQLEdBMUVlO0NBQU47O0FBNkViLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCLEdBQU07QUFDeEIsZ0JBQVksc0JBQXNCLGFBQXRCLENBQVosQ0FEd0I7QUFFeEIsV0FGd0I7Q0FBTjs7QUFLdEI7Ozs7Ozs7Ozs7QUM3SEE7O0FBRU8sSUFBTSxzQkFBTztBQUNoQixVQUFNLEVBQU47QUFDQSxVQUFNLEVBQU47O0FBRUEsWUFBUSxDQUFSO0FBQ0EsWUFBUSxDQUFDLENBQUQ7O0FBRVIsV0FBTyxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBUDs7QUFFQSxXQUFPLEVBQVA7QUFDQSxZQUFRLEVBQVI7O0FBRUEsV0FBTyxDQUFQOztBQUVBLFFBQUksSUFBSixHQUFXO0FBQ1AsZUFBTyxLQUFLLEtBQUwsR0FBYSxDQUFiLENBREE7S0FBWDtBQUdBLHdDQUFzQjtZQUFWLDBEQUFFLGlCQUFRO1lBQUwsMERBQUUsaUJBQUc7O0FBQ2xCLGFBQUssSUFBTCxHQUFZLENBQVosQ0FEa0I7QUFFbEIsYUFBSyxJQUFMLEdBQVksQ0FBWixDQUZrQjtLQWpCTjtBQXFCaEIsMEJBQU87QUFDSCxhQUFLLElBQUwsSUFBYSxLQUFLLE1BQUwsQ0FEVjtBQUVILGFBQUssSUFBTCxJQUFhLEtBQUssTUFBTCxDQUZWO0tBckJTO0FBMEJoQiw4QkFBUztBQUNMLG1CQUFJLElBQUosR0FESztBQUVMLG1CQUFJLFNBQUosQ0FBYyxLQUFLLElBQUwsRUFBVyxLQUFLLElBQUwsQ0FBekIsQ0FGSztBQUdMLG1CQUFJLE1BQUosQ0FBVyxLQUFLLEtBQUwsR0FBYSxLQUFLLEVBQUwsR0FBVSxHQUF2QixDQUFYLENBSEs7QUFJTCxtQkFBSSxTQUFKLENBQWMsS0FBSyxLQUFMLEVBQVksQ0FBQyxLQUFLLEtBQUwsR0FBYSxDQUFkLEVBQWlCLENBQUMsS0FBSyxNQUFMLEdBQWMsQ0FBZixFQUFrQixLQUFLLEtBQUwsRUFBWSxLQUFLLE1BQUwsQ0FBekUsQ0FKSztBQUtMLG1CQUFJLE9BQUosR0FMSzs7QUFPTCxhQUFLLEtBQUwsSUFBYyxLQUFLLE1BQUwsR0FBYyxDQUFkLENBUFQ7S0ExQk87Q0FBUDs7a0JBcUNFOzs7Ozs7OztBQ3ZDUixJQUFNLDBCQUFTLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFUO0FBQ04sSUFBTSxvQkFBTSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBTjs7QUFFTixJQUFNLHdCQUFRO0FBQ2pCLFdBQU8sU0FBUDs7QUFFQSxRQUFJLEtBQUosR0FBWTtBQUNSLGVBQU8sT0FBTyxLQUFQLENBREM7S0FBWjtBQUdBLFFBQUksTUFBSixHQUFhO0FBQ1QsZUFBTyxPQUFPLE1BQVAsQ0FERTtLQUFiOztBQUlBLGdDQUFzQjtZQUFkLDBEQUFFLG1CQUFZO1lBQVAsMERBQUUsbUJBQUs7O0FBQ2xCLGVBQU8sS0FBUCxHQUFlLENBQWYsQ0FEa0I7QUFFbEIsZUFBTyxNQUFQLEdBQWdCLENBQWhCLENBRmtCO0tBVkw7QUFjakIsOEJBQVM7QUFDTCxZQUFJLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEtBQUssS0FBTCxFQUFZLEtBQUssTUFBTCxDQUFoQyxDQURLO0tBZFE7Q0FBUjs7a0JBbUJFOzs7Ozs7Ozs7O0FDdEJmOztBQUVBOztBQUNBOzs7O0FBQ0E7Ozs7QUFHTyxJQUFNLHdCQUFTLFNBQVQsS0FBUztRQUFDLDBEQUFJO1FBQUcsMERBQUk7V0FBTztBQUNyQyxjQUFNLENBQU47QUFDQSxjQUFNLENBQU47O0FBRUEsZUFBTyxFQUFQO0FBQ0EsZ0JBQVEsRUFBUjs7QUFFQSxlQUFPLE9BQVA7O0FBRUEsaUJBQVMsSUFBVDs7QUFFQSxrQ0FBUztBQUNMLHVCQUFJLFNBQUosR0FESztBQUVMLHVCQUFJLFNBQUosR0FBZ0IsS0FBSyxLQUFMLENBRlg7QUFHTCx1QkFBSSxRQUFKLENBQWEsS0FBSyxJQUFMLEVBQVcsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLEVBQVksS0FBSyxNQUFMLENBQS9DLENBSEs7QUFJTCx1QkFBSSxTQUFKLEdBSks7QUFLTCx1QkFBSSxNQUFKLEdBTEs7U0FYNEI7O0NBQW5COztBQXFCZixJQUFNLDBCQUFTOztBQUVsQixZQUFRLENBQVI7QUFDQSxlQUFXLEVBQVg7O0FBRUEsYUFBUyxDQUFUO0FBQ0EsVUFBTSxDQUFOOztBQUVBLG1CQUFlLEdBQWY7QUFDQSxvQkFBZ0IsRUFBaEI7O0FBRUEsWUFBUSxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLE1BQWpCLENBQVI7O0FBRUEsVUFBTSxFQUFOOztBQUVBLDhDQUFpQjtBQUNiLFlBQUksVUFBVSxtQkFBbUIsS0FBbkIsQ0FBeUIsRUFBekIsQ0FBVixDQURTO0FBRWIsWUFBSSxRQUFRLEdBQVIsQ0FGUztBQUdiLGFBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLENBQUosRUFBTyxHQUF2QixFQUE2QjtBQUN6QixxQkFBUyxRQUFRLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixFQUFoQixDQUFuQixDQUFULENBRHlCO1NBQTdCO0FBR0EsZUFBTyxLQUFQLENBTmE7S0FmQztBQXdCbEIsNEJBQVE7O0FBRUosYUFBSyxPQUFMLEdBQWUsS0FBSyxLQUFMLENBQVcsYUFBTSxLQUFOLEdBQWMsS0FBSyxhQUFMLENBQXhDLENBRkk7QUFHSixZQUFJLFFBQVEsQ0FBQyxhQUFNLEtBQU4sR0FBZSxLQUFLLE1BQUwsSUFBZSxLQUFLLE9BQUwsR0FBZSxDQUFmLENBQWYsQ0FBaEIsR0FBb0QsS0FBSyxPQUFMLENBSDVEOztBQUtKLGFBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLEtBQUssSUFBTCxFQUFXLEdBQS9CLEVBQW9DO0FBQ2hDLGlCQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLE9BQUwsRUFBYyxHQUFsQyxFQUF1Qzs7QUFFbkMsb0JBQUksSUFBSSxNQUFNLEtBQUssUUFBUSxLQUFLLE1BQUwsQ0FBYixFQUEyQixLQUFLLFNBQUwsR0FBa0IsQ0FBQyxLQUFLLE1BQUwsR0FBYyxLQUFLLGNBQUwsQ0FBZixHQUFzQyxDQUF0QyxDQUF2RCxDQUYrQjtBQUduQyxrQkFBRSxLQUFGLEdBQVUsS0FBVixDQUhtQztBQUluQyxrQkFBRSxLQUFGLEdBQVUsS0FBSyxjQUFMLEVBQVYsQ0FKbUM7QUFLbkMsa0JBQUUsTUFBRixHQUxtQzs7QUFPbkMscUJBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxDQUFmLEVBUG1DO2FBQXZDO1NBREo7S0E3QmM7QUEwQ2xCLDhCQUFTO0FBQ0wsYUFBSyxJQUFMLEdBQVksS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLGFBQUs7O0FBRTNCLGdCQUFJLEVBQUUsT0FBRixLQUFjLElBQWQsRUFBb0I7O0FBRXBCLG9CQUFJLFdBQUssSUFBTCxHQUFZLFdBQUssSUFBTCxHQUFZLENBQVosSUFBaUIsRUFBRSxJQUFGLElBQVUsV0FBSyxJQUFMLEdBQVksV0FBSyxJQUFMLEdBQVksQ0FBWixJQUFpQixFQUFFLElBQUYsR0FBUyxFQUFFLEtBQUYsRUFBUzs7QUFFdEYsd0JBQUksV0FBSyxJQUFMLEdBQVksV0FBSyxJQUFMLEdBQVksRUFBRSxJQUFGLEdBQVMsRUFBRSxNQUFGLElBQVksV0FBSyxJQUFMLEdBQVksV0FBSyxJQUFMLEdBQVksRUFBRSxJQUFGLEVBQVE7O0FBRTdFLG1DQUFLLE1BQUwsR0FBYyxDQUFDLFdBQUssTUFBTCxDQUY4RDs7QUFJN0UsNENBQVUsS0FBVixDQUFnQixRQUFoQixFQUEwQixFQUFFLEtBQUYsQ0FBMUIsQ0FKNkU7QUFLN0Usd0NBQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsT0FBdEIsRUFMNkU7O0FBTzdFLDBCQUFFLE9BQUYsR0FBWSxLQUFaLENBUDZFO3FCQUFqRjtpQkFGSjs7QUFhQSxrQkFBRSxNQUFGLEdBZm9CO2FBQXhCOztBQWtCQSxtQkFBTyxDQUFQLENBcEIyQjtTQUFMLENBQTFCLENBREs7S0ExQ1M7Q0FBVDs7Ozs7Ozs7OztBQzVCYjs7QUFFTyxJQUFNLHdCQUFRO0FBQ2pCLFVBQU0sQ0FBTjtBQUNBLFVBQU0sQ0FBTjs7QUFFQSx3Q0FBc0I7WUFBViwwREFBRSxpQkFBUTtZQUFMLDBEQUFFLGlCQUFHOztBQUNsQixhQUFLLElBQUwsR0FBWSxDQUFaLENBRGtCO0FBRWxCLGFBQUssSUFBTCxHQUFZLENBQVosQ0FGa0I7S0FKTDtDQUFSOzs7QUFXYixjQUFPLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFVBQUMsQ0FBRCxFQUFPO0FBQ3hDLFVBQU0sV0FBTixDQUFrQixFQUFFLEtBQUYsRUFBUyxFQUFFLEtBQUYsQ0FBM0IsQ0FEd0M7Q0FBUCxFQUVsQyxJQUZIOztrQkFJZTs7Ozs7Ozs7OztBQ2pCZjs7QUFDQTs7QUFHTyxJQUFNLDhCQUFXLFNBQVgsUUFBVyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sR0FBUCxFQUFZLENBQVo7V0FBbUI7O0FBRXZDLGNBQU0sQ0FBTjtBQUNBLGNBQU0sQ0FBTjs7QUFFQSxnQkFBUSxDQUFSO0FBQ0EsZ0JBQVEsQ0FBUjs7QUFFQSxlQUFPLENBQVA7O0FBRUEsZ0JBQVEsR0FBUjs7QUFFQSw4QkFBTzs7QUFFSCxvQkFBUSxHQUFSO0FBQ0kscUJBQUssS0FBTDtBQUNJLHlCQUFLLE1BQUwsR0FBYyxDQUFDLEdBQUQsR0FBTyxLQUFLLE1BQUwsS0FBZ0IsQ0FBaEIsQ0FEekI7QUFFSSx5QkFBSyxNQUFMLEdBQWMsQ0FBQyxDQUFELEdBQUssS0FBSyxNQUFMLEVBQUwsR0FBcUIsQ0FBckIsQ0FGbEI7QUFHSSwwQkFISjtBQURKLHFCQUtTLFFBQUw7QUFDSSx5QkFBSyxNQUFMLEdBQWMsQ0FBQyxHQUFELEdBQU8sS0FBSyxNQUFMLEtBQWdCLENBQWhCLENBRHpCO0FBRUkseUJBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxLQUFnQixDQUFoQixDQUZsQjtBQUdJLDBCQUhKO0FBTEoscUJBU1MsTUFBTDtBQUNJLHlCQUFLLE1BQUwsR0FBYyxDQUFDLEtBQUssTUFBTCxFQUFELEdBQWlCLENBQWpCLENBRGxCO0FBRUkseUJBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxLQUFnQixDQUFoQixDQUZsQjtBQUdJLDBCQUhKO0FBVEoscUJBYVMsT0FBTDtBQUNJLHlCQUFLLE1BQUwsR0FBZSxLQUFLLE1BQUwsS0FBZ0IsQ0FBaEIsQ0FEbkI7QUFFSSx5QkFBSyxNQUFMLEdBQWMsQ0FBQyxDQUFELEdBQUssS0FBSyxNQUFMLEVBQUwsR0FBcUIsQ0FBckIsQ0FGbEI7QUFHSSwwQkFISjtBQWJKLHFCQWlCUyxRQUFMO0FBQ0kseUJBQUssTUFBTCxHQUFjLENBQUMsR0FBRCxHQUFPLEtBQUssTUFBTCxLQUFnQixHQUFoQixDQUR6QjtBQUVJLHlCQUFLLE1BQUwsR0FBYyxDQUFDLENBQUQsR0FBSyxLQUFLLE1BQUwsRUFBTCxHQUFxQixHQUFyQixDQUZsQjtBQUdJLDBCQUhKO0FBakJKLGFBRkc7O0FBeUJILG1CQUFPLElBQVAsQ0F6Qkc7U0FaZ0M7O0NBQW5COztBQXlDakIsSUFBTSxnQ0FBWTtBQUNyQixXQUFPLEVBQVA7O0FBRUEsVUFBTSxFQUFOOztBQUVBLDBCQUFNLEtBQUssT0FBTztBQUNkLGFBQUssSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLEtBQUssS0FBTCxFQUFZLEdBQWhDLEVBQXFDO0FBQ2pDLGlCQUFLLElBQUwsQ0FBVSxJQUFWLENBQ0ksU0FBUyxXQUFLLElBQUwsRUFBVyxXQUFLLElBQUwsRUFBVyxHQUEvQixFQUFvQyxLQUFwQyxFQUEyQyxJQUEzQyxFQURKLEVBRGlDO1NBQXJDO0tBTmlCO0FBYXJCLDBCQUFPOztBQUVILGFBQUssSUFBTCxHQUFZLEtBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUI7bUJBQUssRUFBRSxNQUFGLEdBQVcsQ0FBWDtTQUFMLENBQTdCLENBRkc7O0FBSUgsYUFBSyxJQUFMLENBQVUsR0FBVixDQUFjLGFBQUs7O0FBRWYsdUJBQUksU0FBSixHQUZlO0FBR2YsdUJBQUksU0FBSixHQUFnQixFQUFFLEtBQUYsQ0FIRDtBQUlmLGdCQUFJLEVBQUUsTUFBRixHQUFXLENBQVgsRUFBYztBQUNkLDJCQUFJLEdBQUosQ0FBUSxFQUFFLElBQUYsRUFBUSxFQUFFLElBQUYsRUFBUSxFQUFFLE1BQUYsRUFBVSxDQUFsQyxFQUFxQyxLQUFLLEVBQUwsR0FBVSxDQUFWLEVBQWEsS0FBbEQsRUFEYzthQUFsQjtBQUdBLHVCQUFJLElBQUosR0FQZTs7QUFTZixjQUFFLElBQUYsSUFBVSxFQUFFLE1BQUYsQ0FUSztBQVVmLGNBQUUsSUFBRixJQUFVLEVBQUUsTUFBRixDQVZLOztBQVlmLGNBQUUsTUFBRixHQUFXLEtBQUssR0FBTCxDQUFTLEVBQUUsTUFBRixHQUFXLElBQVgsRUFBaUIsR0FBMUIsQ0FBWCxDQVplO1NBQUwsQ0FBZCxDQUpHO0tBYmM7Q0FBWjs7Ozs7Ozs7OztBQzdDYjs7QUFDQTs7QUFHTyxJQUFNLDBCQUFTO0FBQ2xCLFVBQU0sQ0FBTjtBQUNBLFVBQU0sQ0FBTjs7QUFFQSxjQUFVLENBQVY7QUFDQSxlQUFXLENBQVg7O0FBRUEsV0FBTyxHQUFQO0FBQ0EsWUFBUSxFQUFSOztBQUVBLFdBQU8sT0FBUDs7QUFFQSx3Q0FBc0I7WUFBViwwREFBRSxpQkFBUTtZQUFMLDBEQUFFLGlCQUFHOztBQUNsQixhQUFLLElBQUwsR0FBWSxDQUFaLENBRGtCO0FBRWxCLGFBQUssSUFBTCxHQUFZLENBQVosQ0FGa0I7S0FaSjtBQWdCbEIsMEJBQU87O0FBRUgsWUFBTSxPQUFPLGFBQU0sSUFBTixHQUFhLEtBQUssS0FBTCxHQUFhLENBQWIsQ0FGdkI7QUFHSCxZQUFNLFFBQVEsYUFBTSxJQUFOLEdBQWEsS0FBSyxLQUFMLEdBQWEsQ0FBYixDQUh4Qjs7QUFLSCxZQUFJLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsaUJBQUssSUFBTCxHQUFZLENBQVosQ0FEVTtTQUFkLE1BRU8sSUFBRyxRQUFRLGFBQU0sS0FBTixFQUFhO0FBQzNCLGlCQUFLLElBQUwsR0FBWSxhQUFNLEtBQU4sR0FBYyxLQUFLLEtBQUwsQ0FEQztTQUF4QixNQUVBO0FBQ0gsaUJBQUssSUFBTCxHQUFZLElBQVosQ0FERztTQUZBO0tBdkJPO0FBOEJsQiw4QkFBUztBQUNMLG1CQUFJLFNBQUosR0FESztBQUVMLG1CQUFJLFNBQUosR0FBZ0IsS0FBSyxLQUFMLENBRlg7QUFHTCxtQkFBSSxRQUFKLENBQWEsS0FBSyxJQUFMLEVBQVcsS0FBSyxJQUFMLEVBQVcsS0FBSyxLQUFMLEVBQVksS0FBSyxNQUFMLENBQS9DLENBSEs7QUFJTCxtQkFBSSxTQUFKLEdBSks7QUFLTCxtQkFBSSxNQUFKLEdBTEs7S0E5QlM7Q0FBVDs7a0JBdUNFOzs7Ozs7OztBQzFDUixJQUFNLHdCQUFRO0FBQ2pCLFlBQVE7QUFDSixpQkFBUztBQUNMLGtCQUFNLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFOO0FBQ0Esb0JBQVEsU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQUFSO0FBQ0EsbUJBQU8sU0FBUyxjQUFULENBQXdCLGVBQXhCLENBQVA7U0FISjtLQURKOztBQVFBLHdCQUFLLFFBQVEsTUFBTTs7QUFFZixZQUFJLEtBQUssTUFBTCxDQUFZLGNBQVosQ0FBMkIsTUFBM0IsS0FBc0MsS0FBSyxNQUFMLENBQVksTUFBWixFQUFvQixjQUFwQixDQUFtQyxJQUFuQyxDQUF0QyxFQUFnRjtBQUNoRixpQkFBSyxNQUFMLENBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixXQUExQixHQUF3QyxDQUF4QyxDQURnRjtBQUVoRixpQkFBSyxNQUFMLENBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixNQUExQixHQUFtQyxHQUFuQyxDQUZnRjtBQUdoRixtQkFBTyxLQUFLLE1BQUwsQ0FBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQVAsQ0FIZ0Y7U0FBcEY7O0FBTUEsY0FBTSxJQUFJLEtBQUosMEJBQWdDLDRCQUFxQiwwQkFBckQsQ0FBTixDQVJlO0tBVEY7Q0FBUjs7a0JBcUJFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7Y3R4LCBib2FyZH0gZnJvbSAnLi9ib2FyZCc7XHJcbmltcG9ydCBiYWxsIGZyb20gJy4vYmFsbCc7XHJcbmltcG9ydCBwbGF5ZXIgZnJvbSAnLi9wbGF5ZXInO1xyXG5pbXBvcnQge3BhcnRpY2xlcywgcGFydGljbGV9IGZyb20gJy4vcGFydGljbGUnO1xyXG5pbXBvcnQge2JyaWNrc30gZnJvbSAnLi9icmljayc7XHJcbmltcG9ydCBzb3VuZCBmcm9tICcuL3NvdW5kJztcclxuXHJcblxyXG5cclxuXHJcbmxldCB7XHJcbiAgICBpbm5lcldpZHRoOiB3aW5kb3dXaWR0aCxcclxuICAgIGlubmVySGVpZ2h0OiB3aW5kb3dIZWlnaHRcclxufSA9IHdpbmRvdztcclxuXHJcbmxldCBzY29yZSA9IDA7XHJcbmxldCBhbmltYXRpb24gPSBudWxsO1xyXG5cclxuXHJcbi8vIEluaXQgYm9hcmRcclxuYm9hcmQuc2V0U2l6ZSh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcclxuYm9hcmQucmVuZGVyKCk7XHJcblxyXG5iYWxsLnNldFBvc2l0aW9uKDEwMCwgYm9hcmQuaGVpZ2h0IC8gMyAqIDIpO1xyXG5iYWxsLnJlbmRlcigpO1xyXG5cclxucGxheWVyLnNldFBvc2l0aW9uKGJvYXJkLndpZHRoIC8gMiAtIHBsYXllci53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAtIHBsYXllci5oZWlnaHQpO1xyXG5wbGF5ZXIucmVuZGVyKCk7XHJcblxyXG5icmlja3MuYnVpbGQoKTtcclxuXHJcblxyXG5jb25zdCBnYW1lT3ZlciA9ICgpID0+IHtcclxuXHJcbiAgICBjdHguZmlsbFN0bHllID0gXCJibGFja1wiO1xyXG4gICAgY3R4LmZvbnQgPSBcIjIwcHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XHJcbiAgICBjdHguZmlsbFRleHQoYEdhbWUgT3ZlciAtIFlvdSBzY29yZSBpcyAke3Njb3JlfSBwb2ludHMhYCwgYm9hcmQud2lkdGggLyAyLCBib2FyZC5oZWlnaHQgLyAyKTtcclxuXHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xyXG59O1xyXG5cclxuY29uc3QgZHJhdyA9ICgpID0+IHtcclxuXHJcbiAgICBib2FyZC5yZW5kZXIoKTtcclxuICAgIGJyaWNrcy5yZW5kZXIoKTtcclxuXHJcbiAgICBiYWxsLnNldFBvc2l0aW9uKGJhbGwucG9zWCArIGJhbGwuc3BlZWRYLCBiYWxsLnBvc1kgKyBiYWxsLnNwZWVkWSk7XHJcblxyXG4gICAgLy8gdG9wXHJcbiAgICBpZiAoYmFsbC5wb3NZIC0gYmFsbC5zaXplIDw9IDApIHtcclxuICAgICAgICBiYWxsLnNwZWVkWSA9IC1iYWxsLnNwZWVkWTtcclxuICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ3dhbGwnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBib3R0b21cclxuICAgIGlmIChiYWxsLnBvc1kgKyBiYWxsLnNpemUgPj0gYm9hcmQuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgIGJhbGwucG9zWSA9IGJvYXJkLmhlaWdodCAtIGJhbGwuc2l6ZTtcclxuICAgICAgICBnYW1lT3ZlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJpZ2h0XHJcbiAgICBpZiAoYmFsbC5wb3NYICsgYmFsbC5zaXplID49IGJvYXJkLndpZHRoKSB7XHJcbiAgICAgICAgYmFsbC5zcGVlZFggPSAtYmFsbC5zcGVlZFg7XHJcbiAgICAgICAgc291bmQucGxheSgnY29sbGlkZScsICd3YWxsJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbGVmdFxyXG4gICAgaWYgKGJhbGwucG9zWCAtIGJhbGwuc2l6ZSA8PSAwKSB7XHJcbiAgICAgICAgYmFsbC5zcGVlZFggPSAtYmFsbC5zcGVlZFg7XHJcbiAgICAgICAgc291bmQucGxheSgnY29sbGlkZScsICd3YWxsJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJhbGwucG9zWCArIGJhbGwuc2l6ZSAvIDIgPj0gcGxheWVyLnBvc1ggJiYgYmFsbC5wb3NYIC0gYmFsbC5zaXplIC8gMiA8PSBwbGF5ZXIucG9zWCArIHBsYXllci53aWR0aCkge1xyXG5cclxuICAgICAgICBpZiAoYmFsbC5wb3NZICA+PSBwbGF5ZXIucG9zWSAtIHBsYXllci5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgIHNjb3JlKys7XHJcblxyXG4gICAgICAgICAgICBpZiAocGxheWVyLmRpcmVjdGlvbiA9PT0gLTEgJiYgYmFsbC5zcGVlZFggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBsYXllci5kaXJlY3Rpb24gPT09IDEgJiYgYmFsbC5zcGVlZFggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmFsbC5zcGVlZFkgPSAtYmFsbC5zcGVlZFk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwYXJ0aWNsZXMuYnVpbGQoJ3RvcCcsICdibGFjaycpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAvLyBpZiAoc2NvcmUgJSA0ID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBiYWxsLnNwZWVkWCArPSAoYmFsbC5zcGVlZFggPCAwKSA/IC0xIDogMTtcclxuICAgICAgICAgICAgLy8gICAgIGJhbGwuc3BlZWRZICs9IChiYWxsLnNwZWVkWSA8IDApID8gLTIgOiAyO1xyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBzb3VuZC5wbGF5KCdjb2xsaWRlJywgJ3BsYXllcicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYmFsbC5tb3ZlKCk7XHJcbiAgICBiYWxsLnJlbmRlcigpO1xyXG4gICAgcGFydGljbGVzLmVtaXQoKTtcclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIHBsYXllci5tb3ZlKCk7XHJcblxyXG4gICAgXHJcbiAgICBwbGF5ZXIuZGlyZWN0aW9uID0gKHBsYXllci5wb3NYID09PSBwbGF5ZXIubGFzdFBvc1gpID8gMCA6IChwbGF5ZXIucG9zWCA+IHBsYXllci5sYXN0UG9zWCkgPyAxIDogLTEgO1xyXG4gICAgcGxheWVyLmxhc3RQb3NYID0gcGxheWVyLnBvc1g7XHJcbiAgICBwbGF5ZXIucmVuZGVyKCk7XHJcbn07XHJcblxyXG5jb25zdCBhbmltYXRpb25Mb29wID0gKCkgPT4ge1xyXG4gICAgYW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkxvb3ApO1xyXG4gICAgZHJhdygpO1xyXG59O1xyXG5cclxuYW5pbWF0aW9uTG9vcCgpOyIsImltcG9ydCB7Y3R4fSBmcm9tICcuL2JvYXJkJztcclxuXHJcbmV4cG9ydCBjb25zdCBiYWxsID0ge1xyXG4gICAgcG9zWDogNDAsXHJcbiAgICBwb3NZOiA0MCxcclxuXHJcbiAgICBzcGVlZFg6IDIsXHJcbiAgICBzcGVlZFk6IC00LFxyXG5cclxuICAgIGltYWdlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhbGxcIiksXHJcblxyXG4gICAgd2lkdGg6IDIwLFxyXG4gICAgaGVpZ2h0OiAyMCxcclxuXHJcbiAgICBhbmdsZTogMCxcclxuXHJcbiAgICBnZXQgc2l6ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAvIDI7XHJcbiAgICB9LFxyXG4gICAgc2V0UG9zaXRpb24oeD0wLCB5PTApIHtcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9LFxyXG4gICAgbW92ZSgpIHtcclxuICAgICAgICB0aGlzLnBvc1ggKz0gdGhpcy5zcGVlZFg7XHJcbiAgICAgICAgdGhpcy5wb3NZICs9IHRoaXMuc3BlZWRZO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKHRoaXMucG9zWCwgdGhpcy5wb3NZKTtcclxuICAgICAgICBjdHgucm90YXRlKHRoaXMuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIC10aGlzLndpZHRoIC8gMiwgLXRoaXMuaGVpZ2h0IC8gMiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYW5nbGUgKz0gdGhpcy5zcGVlZFggKiAyO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYmFsbDsiLCJleHBvcnQgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKTtcclxuZXhwb3J0IGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJvYXJkID0ge1xyXG4gICAgY29sb3I6ICcjZjlmOWY5JyxcclxuXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhbnZhcy53aWR0aDtcclxuICAgIH0sXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiBjYW52YXMuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRTaXplKHc9ODAwLCBoPTYwMCkge1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHc7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGg7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYm9hcmQ7IiwiaW1wb3J0IHtjdHh9IGZyb20gJy4vYm9hcmQnO1xyXG5pbXBvcnQge2JvYXJkfSBmcm9tIFwiLi9ib2FyZFwiO1xyXG5pbXBvcnQge2JhbGx9IGZyb20gXCIuL2JhbGxcIjtcclxuaW1wb3J0IHNvdW5kIGZyb20gXCIuL3NvdW5kXCI7XHJcbmltcG9ydCB7cGFydGljbGVzfSBmcm9tIFwiLi9wYXJ0aWNsZVwiO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBicmljayAgPSAoeCA9IDAsIHkgPSAwKSA9PiAoe1xyXG4gICAgcG9zWDogeCxcclxuICAgIHBvc1k6IHksXHJcblxyXG4gICAgd2lkdGg6IDQwLFxyXG4gICAgaGVpZ2h0OiAyMCxcclxuXHJcbiAgICBjb2xvcjogJ2dyZWVuJyxcclxuXHJcbiAgICB2aXNpYmxlOiB0cnVlLFxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGJyaWNrcyA9IHtcclxuXHJcbiAgICBvZmZzZXQ6IDAsXHJcbiAgICBvZmZzZXRUb3A6IDYwLFxyXG4gICAgXHJcbiAgICBjb2x1bW5zOiAwLFxyXG4gICAgcm93czogNixcclxuXHJcbiAgICBtYXhCcmlja1dpZHRoOiAxMDAsXHJcbiAgICBtYXhCcmlja0hlaWdodDogMjAsXHJcblxyXG4gICAgY29sb3JzOiBbJ3JlZCcsICdncmVlbicsICdibHVlJ10sXHJcbiAgICBcclxuICAgIGxpc3Q6IFtdLFxyXG5cclxuICAgIGdldFJhbmRvbUNvbG9yKCkge1xyXG4gICAgICAgIHZhciBsZXR0ZXJzID0gJzAxMjM0NTY3ODlBQkNERUYnLnNwbGl0KCcnKTtcclxuICAgICAgICB2YXIgY29sb3IgPSAnIyc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKysgKSB7XHJcbiAgICAgICAgICAgIGNvbG9yICs9IGxldHRlcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gTWF0aC5mbG9vcihib2FyZC53aWR0aCAvIHRoaXMubWF4QnJpY2tXaWR0aClcclxuICAgICAgICBsZXQgd2lkdGggPSAoYm9hcmQud2lkdGggIC0gdGhpcy5vZmZzZXQgKiAodGhpcy5jb2x1bW5zIC0gMSkpIC8gdGhpcy5jb2x1bW5zO1xyXG5cclxuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHRoaXMucm93czsgcisrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5jb2x1bW5zOyBjKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgYiA9IGJyaWNrKGMgKiAod2lkdGggKyB0aGlzLm9mZnNldCksIHRoaXMub2Zmc2V0VG9wICsgKCh0aGlzLm9mZnNldCArIHRoaXMubWF4QnJpY2tIZWlnaHQpICogcikpO1xyXG4gICAgICAgICAgICAgICAgYi53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICAgICAgYi5jb2xvciA9IHRoaXMuZ2V0UmFuZG9tQ29sb3IoKTtcclxuICAgICAgICAgICAgICAgIGIucmVuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5saXN0LnB1c2goYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0Lm1hcChiID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChiLnZpc2libGUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmFsbC5wb3NYICsgYmFsbC5zaXplIC8gMiA+PSBiLnBvc1ggJiYgYmFsbC5wb3NYIC0gYmFsbC5zaXplIC8gMiA8PSBiLnBvc1ggKyBiLndpZHRoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiYWxsLnBvc1kgLSBiYWxsLnNpemUgPCBiLnBvc1kgKyBiLmhlaWdodCAmJiBiYWxsLnBvc1kgKyBiYWxsLnNpemUgPiBiLnBvc1kpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhbGwuc3BlZWRZID0gLWJhbGwuc3BlZWRZO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGVzLmJ1aWxkKCdjZW50ZXInLCBiLmNvbG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc291bmQucGxheSgnY29sbGlkZScsICdicmljaycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYi52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGIucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBiO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IHtjYW52YXN9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1vdXNlID0ge1xyXG4gICAgcG9zWDogMCxcclxuICAgIHBvc1k6IDAsXHJcblxyXG4gICAgc2V0UG9zaXRpb24oeD0wLCB5PTApIHtcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBsaXN0ZW5lcnNcclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+IHtcclxuICAgIG1vdXNlLnNldFBvc2l0aW9uKGUucGFnZVgsIGUucGFnZVkpO1xyXG59LCB0cnVlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vdXNlOyIsImltcG9ydCB7Y3R4fSBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IHtiYWxsfSBmcm9tIFwiLi9iYWxsXCI7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHBhcnRpY2xlID0gKHgsIHksIGRpciwgYykgPT4gKHtcclxuXHJcbiAgICBwb3NYOiB4LFxyXG4gICAgcG9zWTogeSxcclxuXHJcbiAgICBzcGVlZFg6IDAsXHJcbiAgICBzcGVlZFk6IDAsXHJcblxyXG4gICAgY29sb3I6IGMsXHJcblxyXG4gICAgcmFkaXVzOiAxLjgsXHJcblxyXG4gICAgaW5pdCgpIHtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkaXIpIHtcclxuICAgICAgICAgICAgY2FzZSAndG9wJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWRYID0gLTEuNSArIE1hdGgucmFuZG9tKCkgKiA2O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZFkgPSAtMSAqIE1hdGgucmFuZG9tKCkgKiAzO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkWCA9IC0xLjkgKyBNYXRoLnJhbmRvbSgpICogNjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWRZID0gTWF0aC5yYW5kb20oKSAqIDM7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbGVmdCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkWCA9IC1NYXRoLnJhbmRvbSgpICogNjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWRZID0gTWF0aC5yYW5kb20oKSAqIDM7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZFggPSAgTWF0aC5yYW5kb20oKSAqIDY7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkWSA9IC0xICogTWF0aC5yYW5kb20oKSAqIDM7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2VudGVyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWRYID0gLTEuNSArIE1hdGgucmFuZG9tKCkgKiAyLjU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkWSA9IC0xICogTWF0aC5yYW5kb20oKSAqIDEuNTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHBhcnRpY2xlcyA9IHtcclxuICAgIGNvdW50OiAyMCxcclxuXHJcbiAgICBsaXN0OiBbXSxcclxuXHJcbiAgICBidWlsZChkaXIsIGNvbG9yKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5saXN0LnB1c2goXHJcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZShiYWxsLnBvc1gsIGJhbGwucG9zWSwgZGlyLCBjb2xvcikuaW5pdCgpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBlbWl0KCkge1xyXG5cclxuICAgICAgICB0aGlzLmxpc3QgPSB0aGlzLmxpc3QuZmlsdGVyKGUgPT4gZS5yYWRpdXMgPiAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0Lm1hcChwID0+IHtcclxuXHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHAuY29sb3I7XHJcbiAgICAgICAgICAgIGlmIChwLnJhZGl1cyA+IDApIHtcclxuICAgICAgICAgICAgICAgIGN0eC5hcmMocC5wb3NYLCBwLnBvc1ksIHAucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICBwLnBvc1ggKz0gcC5zcGVlZFg7XHJcbiAgICAgICAgICAgIHAucG9zWSArPSBwLnNwZWVkWTtcclxuXHJcbiAgICAgICAgICAgIHAucmFkaXVzID0gTWF0aC5tYXgocC5yYWRpdXMgLSAwLjA4LCAwLjApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuIiwiaW1wb3J0IHtjdHh9IGZyb20gJy4vYm9hcmQnO1xyXG5pbXBvcnQge21vdXNlfSBmcm9tIFwiLi9tb3VzZVwiO1xyXG5pbXBvcnQge2JvYXJkfSBmcm9tIFwiLi9ib2FyZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHBsYXllciA9IHtcclxuICAgIHBvc1g6IDAsXHJcbiAgICBwb3NZOiAwLFxyXG4gICAgXHJcbiAgICBsYXN0UG9zWDogMCxcclxuICAgIGRpcmVjdGlvbjogMCxcclxuXHJcbiAgICB3aWR0aDogMTIwLFxyXG4gICAgaGVpZ2h0OiAxMCxcclxuICAgIFxyXG4gICAgY29sb3I6ICdibGFjaycsXHJcbiAgICBcclxuICAgIHNldFBvc2l0aW9uKHg9MCwgeT0wKSB7XHJcbiAgICAgICAgdGhpcy5wb3NYID0geDtcclxuICAgICAgICB0aGlzLnBvc1kgPSB5O1xyXG4gICAgfSxcclxuICAgIG1vdmUoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGxlZnQgPSBtb3VzZS5wb3NYIC0gdGhpcy53aWR0aCAvIDI7XHJcbiAgICAgICAgY29uc3QgcmlnaHQgPSBtb3VzZS5wb3NYICsgdGhpcy53aWR0aCAvIDI7XHJcblxyXG4gICAgICAgIGlmIChsZWZ0IDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc1ggPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZihyaWdodCA+IGJvYXJkLndpZHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zWCA9IGJvYXJkLndpZHRoIC0gdGhpcy53aWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBvc1ggPSBsZWZ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCh0aGlzLnBvc1gsIHRoaXMucG9zWSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwbGF5ZXI7IiwiXHJcbmV4cG9ydCBjb25zdCBzb3VuZCA9IHtcclxuICAgIHNvdW5kczoge1xyXG4gICAgICAgIGNvbGxpZGU6IHtcclxuICAgICAgICAgICAgd2FsbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxpZGUtd2FsbHMnKSxcclxuICAgICAgICAgICAgcGxheWVyOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29sbGlkZS1wbGF5ZXInKSxcclxuICAgICAgICAgICAgYnJpY2s6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xsaWRlLWJyaWNrJylcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHBsYXkoYWN0aW9uLCB0eXBlKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNvdW5kcy5oYXNPd25Qcm9wZXJ0eShhY3Rpb24pICYmIHRoaXMuc291bmRzW2FjdGlvbl0uaGFzT3duUHJvcGVydHkodHlwZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZHNbYWN0aW9uXVt0eXBlXS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW2FjdGlvbl1bdHlwZV0udm9sdW1lID0gMC40O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VuZHNbYWN0aW9uXVt0eXBlXS5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNvdW5kIHdpdGggYWN0aW9uICcke2FjdGlvbn0nIGFuZCB0eXBlICcke3R5cGV9JyBpcyBub3QgZGVmaW5lZGApO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc291bmQ7Il19
