(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _board = require('./board');

var _mouse = require('./mouse');

var _mouse2 = _interopRequireDefault(_mouse);

var _ball = require('./ball');

var _ball2 = _interopRequireDefault(_ball);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _particle = require('./particle');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sounds = {
    collideWalls: document.getElementById('collide-walls'),
    collidePlayer: document.getElementById('collide-player')
};

var _window = window;
var windowWidth = _window.innerWidth;
var windowHeight = _window.innerHeight;


var score = 0;
var animation = null;
var collision = false;
var isPlayerCollide = false;

// Init board
_board.board.setSize(windowWidth, windowHeight);
_board.board.render();

_ball2.default.setPosition(100, 100);
_ball2.default.render();

_player2.default.setPosition(_board.board.width / 2 - _player2.default.width / 2, _board.board.height - _player2.default.height);
_player2.default.render();

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

    _ball2.default.setPosition(_ball2.default.posX + _ball2.default.speedX, _ball2.default.posY + _ball2.default.speedY);

    // top
    if (_ball2.default.posY - _ball2.default.size <= 0) {
        collision = true;
        _ball2.default.speedY = -_ball2.default.speedY;

        _particle.particles.posX = _ball2.default.posX;
        _particle.particles.posY = _ball2.default.posY;

        _particle.particles.direction = 'bottom';
    }

    // bottom
    if (_ball2.default.posY + _ball2.default.size >= _board.board.height) {

        _ball2.default.posY = _board.board.height - _ball2.default.size;
        gameOver();
    }

    // right
    if (_ball2.default.posX + _ball2.default.size >= _board.board.width) {
        collision = true;
        _ball2.default.speedX = -_ball2.default.speedX;

        _particle.particles.posX = _ball2.default.posX + _ball2.default.size * 2;
        _particle.particles.posY = _ball2.default.posY;

        _particle.particles.direction = 'left';
    }

    // left
    if (_ball2.default.posX - _ball2.default.size <= 0) {
        collision = true;
        _ball2.default.speedX = -_ball2.default.speedX;

        _particle.particles.posX = _ball2.default.posX - _ball2.default.size;
        _particle.particles.posY = _ball2.default.posY;

        _particle.particles.direction = 'right';
    }

    if (_ball2.default.posX + _ball2.default.size / 2 >= _player2.default.posX && _ball2.default.posX - _ball2.default.size / 2 <= _player2.default.posX + _player2.default.width) {

        if (_ball2.default.posY >= _player2.default.posY - _player2.default.height) {

            collision = true;
            isPlayerCollide = true;
            score++;

            if (_player2.default.direction === -1 && _ball2.default.speedX > 0) {
                _ball2.default.speedX = -_ball2.default.speedX;
            }

            if (_player2.default.direction === 1 && _ball2.default.speedX < 0) {
                _ball2.default.speedX = -_ball2.default.speedX;
            }

            _ball2.default.speedY = -_ball2.default.speedY;

            _particle.particles.posX = _ball2.default.posX;
            _particle.particles.posY = _ball2.default.posY + _ball2.default.size;

            _particle.particles.direction = 'top';

            if (score % 4 === 0) {
                _ball2.default.speedX += _ball2.default.speedX < 0 ? -1 : 1;
                _ball2.default.speedY += _ball2.default.speedY < 0 ? -2 : 2;
            }
        }
    }

    if (collision === true) {
        for (var i = 0; i < _particle.particles.count; i++) {
            _particle.particles.list.push(new _particle.Particle(_particle.particles));
        }

        if (isPlayerCollide === true) {
            sounds.collidePlayer.currentTime = 0;
            sounds.collidePlayer.play();

            isPlayerCollide = false;
        } else {
            sounds.collideWalls.currentTime = 0;
            sounds.collideWalls.play();
        }

        collision = false;
    }

    _ball2.default.move();
    _ball2.default.render();
    _particle.particles.emit();

    _player2.default.posX = _mouse2.default.posX - _player2.default.width / 2;
    _player2.default.direction = _player2.default.posX === _player2.default.lastPosX ? 0 : _player2.default.posX > _player2.default.lastPosX ? 1 : -1;
    _player2.default.lastPosX = _player2.default.posX;
    _player2.default.render();
};

var animationLoop = function animationLoop() {
    animation = requestAnimationFrame(animationLoop);
    draw();
};

animationLoop();

},{"./ball":2,"./board":3,"./mouse":4,"./particle":5,"./player":6}],2:[function(require,module,exports){
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
    speedY: 4,

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

},{"./board":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.particles = undefined;
exports.Particle = Particle;

var _board = require('./board');

var particles = exports.particles = {
    count: 60,

    posX: 0,
    posY: 0,

    direction: 'top',

    color: 'black',
    list: [],

    emit: function emit() {
        var _this = this;

        this.list = this.list.filter(function (e) {
            return e.radius > 0;
        });

        this.list.map(function (particle) {

            _board.ctx.beginPath();
            _board.ctx.fillStyle = _this.color;
            if (particle.radius > 0) {
                _board.ctx.arc(particle.posX, particle.posY, particle.radius, 0, Math.PI * 2, false);
            }
            _board.ctx.fill();

            particle.posX += particle.speedX;
            particle.posY += particle.speedY;

            particle.radius = Math.max(particle.radius - 0.08, 0.0);
        });
    }
};

function Particle(_ref) {
    var x = _ref.posX;
    var y = _ref.posY;
    var dir = _ref.direction;

    this.posX = x;
    this.posY = y;

    this.radius = 2;

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
    }
}

},{"./board":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.player = undefined;

var _board = require('./board');

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
    render: function render() {
        _board.ctx.beginPath();
        _board.ctx.fillStyle = this.color;
        _board.ctx.fillRect(this.posX, this.posY, this.width, this.height);
        _board.ctx.closePath();
        _board.ctx.stroke();
    }
};

exports.default = player;

},{"./board":3}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYXBwLmpzIiwianNcXGJhbGwuanMiLCJqc1xcYm9hcmQuanMiLCJqc1xcbW91c2UuanMiLCJqc1xccGFydGljbGUuanMiLCJqc1xccGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLElBQU0sU0FBUztBQUNYLGtCQUFjLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFkO0FBQ0EsbUJBQWUsU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQUFmO0NBRkU7O2NBUUY7SUFGWSxzQkFBWjtJQUNhLHVCQUFiOzs7QUFHSixJQUFJLFFBQVEsQ0FBUjtBQUNKLElBQUksWUFBWSxJQUFaO0FBQ0osSUFBSSxZQUFZLEtBQVo7QUFDSixJQUFJLGtCQUFrQixLQUFsQjs7O0FBSUosYUFBTSxPQUFOLENBQWMsV0FBZCxFQUEyQixZQUEzQjtBQUNBLGFBQU0sTUFBTjs7QUFFQSxlQUFLLFdBQUwsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEI7QUFDQSxlQUFLLE1BQUw7O0FBRUEsaUJBQU8sV0FBUCxDQUFtQixhQUFNLEtBQU4sR0FBYyxDQUFkLEdBQWtCLGlCQUFPLEtBQVAsR0FBZSxDQUFmLEVBQWtCLGFBQU0sTUFBTixHQUFlLGlCQUFPLE1BQVAsQ0FBdEU7QUFDQSxpQkFBTyxNQUFQOztBQUdBLElBQU0sV0FBVyxTQUFYLFFBQVcsR0FBTTs7QUFFbkIsZUFBSSxTQUFKLEdBQWdCLE9BQWhCLENBRm1CO0FBR25CLGVBQUksSUFBSixHQUFXLHdCQUFYLENBSG1CO0FBSW5CLGVBQUksU0FBSixHQUFnQixRQUFoQixDQUptQjtBQUtuQixlQUFJLFlBQUosR0FBbUIsUUFBbkIsQ0FMbUI7QUFNbkIsZUFBSSxRQUFKLCtCQUF5QyxrQkFBekMsRUFBMEQsYUFBTSxLQUFOLEdBQWMsQ0FBZCxFQUFpQixhQUFN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QUwsRUFBWSxLQUFLLE1BQUwsQ0FBL0MsQ0FISztBQUlMLG1CQUFJLFNBQUosR0FKSztBQUtMLG1CQUFJLE1BQUosR0FMSztLQWhCUztDQUFUOztrQkF5QkUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtjdHgsIGJvYXJkfSBmcm9tICcuL2JvYXJkJztcclxuaW1wb3J0IG1vdXNlIGZyb20gJy4vbW91c2UnO1xyXG5pbXBvcnQgYmFsbCBmcm9tICcuL2JhbGwnO1xyXG5pbXBvcnQgcGxheWVyIGZyb20gJy4vcGxheWVyJztcclxuaW1wb3J0IHtwYXJ0aWNsZXMsIFBhcnRpY2xlfSBmcm9tICcuL3BhcnRpY2xlJztcclxuXHJcbmNvbnN0IHNvdW5kcyA9IHtcclxuICAgIGNvbGxpZGVXYWxsczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxpZGUtd2FsbHMnKSxcclxuICAgIGNvbGxpZGVQbGF5ZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xsaWRlLXBsYXllcicpXHJcbn07XHJcblxyXG5sZXQge1xyXG4gICAgaW5uZXJXaWR0aDogd2luZG93V2lkdGgsXHJcbiAgICBpbm5lckhlaWdodDogd2luZG93SGVpZ2h0XHJcbn0gPSB3aW5kb3c7XHJcblxyXG5sZXQgc2NvcmUgPSAwO1xyXG5sZXQgYW5pbWF0aW9uID0gbnVsbDtcclxubGV0IGNvbGxpc2lvbiA9IGZhbHNlO1xyXG5sZXQgaXNQbGF5ZXJDb2xsaWRlID0gZmFsc2U7XHJcblxyXG5cclxuLy8gSW5pdCBib2FyZFxyXG5ib2FyZC5zZXRTaXplKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xyXG5ib2FyZC5yZW5kZXIoKTtcclxuXHJcbmJhbGwuc2V0UG9zaXRpb24oMTAwLCAxMDApO1xyXG5iYWxsLnJlbmRlcigpO1xyXG5cclxucGxheWVyLnNldFBvc2l0aW9uKGJvYXJkLndpZHRoIC8gMiAtIHBsYXllci53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAtIHBsYXllci5oZWlnaHQpO1xyXG5wbGF5ZXIucmVuZGVyKCk7XHJcblxyXG5cclxuY29uc3QgZ2FtZU92ZXIgPSAoKSA9PiB7XHJcblxyXG4gICAgY3R4LmZpbGxTdGx5ZSA9IFwiYmxhY2tcIjtcclxuICAgIGN0eC5mb250ID0gXCIyMHB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xyXG4gICAgY3R4LmZpbGxUZXh0KGBHYW1lIE92ZXIgLSBZb3Ugc2NvcmUgaXMgJHtzY29yZX0gcG9pbnRzIWAsIGJvYXJkLndpZHRoIC8gMiwgYm9hcmQuaGVpZ2h0IC8gMik7XHJcblxyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uKTtcclxufTtcclxuXHJcbmNvbnN0IGRyYXcgPSAoKSA9PiB7XHJcblxyXG4gICAgYm9hcmQucmVuZGVyKCk7XHJcblxyXG4gICAgYmFsbC5zZXRQb3NpdGlvbihiYWxsLnBvc1ggKyBiYWxsLnNwZWVkWCwgYmFsbC5wb3NZICsgYmFsbC5zcGVlZFkpO1xyXG5cclxuICAgIC8vIHRvcFxyXG4gICAgaWYgKGJhbGwucG9zWSAtIGJhbGwuc2l6ZSA8PSAwKSB7XHJcbiAgICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgICBiYWxsLnNwZWVkWSA9IC1iYWxsLnNwZWVkWTtcclxuXHJcbiAgICAgICAgcGFydGljbGVzLnBvc1ggPSBiYWxsLnBvc1g7XHJcbiAgICAgICAgcGFydGljbGVzLnBvc1kgPSBiYWxsLnBvc1k7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGFydGljbGVzLmRpcmVjdGlvbiA9ICdib3R0b20nO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGJvdHRvbVxyXG4gICAgaWYgKGJhbGwucG9zWSArIGJhbGwuc2l6ZSA+PSBib2FyZC5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgYmFsbC5wb3NZID0gYm9hcmQuaGVpZ2h0IC0gYmFsbC5zaXplO1xyXG4gICAgICAgIGdhbWVPdmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmlnaHRcclxuICAgIGlmIChiYWxsLnBvc1ggKyBiYWxsLnNpemUgPj0gYm9hcmQud2lkdGgpIHtcclxuICAgICAgICBjb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgIGJhbGwuc3BlZWRYID0gLWJhbGwuc3BlZWRYO1xyXG5cclxuICAgICAgICBwYXJ0aWNsZXMucG9zWCA9IGJhbGwucG9zWCArIGJhbGwuc2l6ZSAqIDI7XHJcbiAgICAgICAgcGFydGljbGVzLnBvc1kgPSBiYWxsLnBvc1k7XHJcblxyXG4gICAgICAgIHBhcnRpY2xlcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbGVmdFxyXG4gICAgaWYgKGJhbGwucG9zWCAtIGJhbGwuc2l6ZSA8PSAwKSB7XHJcbiAgICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICBcclxuICAgICAgICBwYXJ0aWNsZXMucG9zWCA9IGJhbGwucG9zWCAtIGJhbGwuc2l6ZTtcclxuICAgICAgICBwYXJ0aWNsZXMucG9zWSA9IGJhbGwucG9zWTtcclxuXHJcbiAgICAgICAgcGFydGljbGVzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJhbGwucG9zWCArIGJhbGwuc2l6ZSAvIDIgPj0gcGxheWVyLnBvc1ggJiYgYmFsbC5wb3NYIC0gYmFsbC5zaXplIC8gMiA8PSBwbGF5ZXIucG9zWCArIHBsYXllci53aWR0aCkge1xyXG5cclxuICAgICAgICBpZiAoYmFsbC5wb3NZICA+PSBwbGF5ZXIucG9zWSAtIHBsYXllci5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbGxpc2lvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIGlzUGxheWVyQ29sbGlkZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHNjb3JlKys7XHJcblxyXG4gICAgICAgICAgICBpZiAocGxheWVyLmRpcmVjdGlvbiA9PT0gLTEgJiYgYmFsbC5zcGVlZFggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBsYXllci5kaXJlY3Rpb24gPT09IDEgJiYgYmFsbC5zcGVlZFggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmFsbC5zcGVlZFkgPSAtYmFsbC5zcGVlZFk7XHJcblxyXG4gICAgICAgICAgICBwYXJ0aWNsZXMucG9zWCA9IGJhbGwucG9zWDtcclxuICAgICAgICAgICAgcGFydGljbGVzLnBvc1kgPSBiYWxsLnBvc1kgKyBiYWxsLnNpemU7XHJcblxyXG4gICAgICAgICAgICBwYXJ0aWNsZXMuZGlyZWN0aW9uID0gJ3RvcCc7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NvcmUgJSA0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBiYWxsLnNwZWVkWCArPSAoYmFsbC5zcGVlZFggPCAwKSA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgIGJhbGwuc3BlZWRZICs9IChiYWxsLnNwZWVkWSA8IDApID8gLTIgOiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjb2xsaXNpb24gPT09IHRydWUpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRpY2xlcy5jb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlcy5saXN0LnB1c2gobmV3IFBhcnRpY2xlKHBhcnRpY2xlcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzUGxheWVyQ29sbGlkZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBzb3VuZHMuY29sbGlkZVBsYXllci5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHNvdW5kcy5jb2xsaWRlUGxheWVyLnBsYXkoKTtcclxuXHJcbiAgICAgICAgICAgIGlzUGxheWVyQ29sbGlkZSA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNvdW5kcy5jb2xsaWRlV2FsbHMuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgICAgICBzb3VuZHMuY29sbGlkZVdhbGxzLnBsYXkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbGxpc2lvbiA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGJhbGwubW92ZSgpO1xyXG4gICAgYmFsbC5yZW5kZXIoKTtcclxuICAgIHBhcnRpY2xlcy5lbWl0KCk7XHJcblxyXG4gICAgcGxheWVyLnBvc1ggPSBtb3VzZS5wb3NYIC0gcGxheWVyLndpZHRoIC8gMjtcclxuICAgIHBsYXllci5kaXJlY3Rpb24gPSAocGxheWVyLnBvc1ggPT09IHBsYXllci5sYXN0UG9zWCkgPyAwIDogKHBsYXllci5wb3NYID4gcGxheWVyLmxhc3RQb3NYKSA/IDEgOiAtMSA7XHJcbiAgICBwbGF5ZXIubGFzdFBvc1ggPSBwbGF5ZXIucG9zWDtcclxuICAgIHBsYXllci5yZW5kZXIoKTtcclxufTtcclxuXHJcbmNvbnN0IGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XHJcbiAgICBhbmltYXRpb24gPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XHJcbiAgICBkcmF3KCk7XHJcbn07XHJcblxyXG5hbmltYXRpb25Mb29wKCk7IiwiaW1wb3J0IHtjdHh9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJhbGwgPSB7XHJcbiAgICBwb3NYOiA0MCxcclxuICAgIHBvc1k6IDQwLFxyXG5cclxuICAgIHNwZWVkWDogMixcclxuICAgIHNwZWVkWTogNCxcclxuXHJcbiAgICBpbWFnZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWxsXCIpLFxyXG5cclxuICAgIHdpZHRoOiAyMCxcclxuICAgIGhlaWdodDogMjAsXHJcblxyXG4gICAgYW5nbGU6IDAsXHJcbiAgICBcclxuICAgIGdldCBzaXplKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoIC8gMjtcclxuICAgIH0sXHJcbiAgICBzZXRQb3NpdGlvbih4PTAsIHk9MCkge1xyXG4gICAgICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NZID0geTtcclxuICAgIH0sXHJcbiAgICBtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMucG9zWCArPSB0aGlzLnNwZWVkWDtcclxuICAgICAgICB0aGlzLnBvc1kgKz0gdGhpcy5zcGVlZFk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5wb3NYLCB0aGlzLnBvc1kpO1xyXG4gICAgICAgIGN0eC5yb3RhdGUodGhpcy5hbmdsZSAqIE1hdGguUEkgLyAxODApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWFnZSwgLXRoaXMud2lkdGggLyAyLCAtdGhpcy5oZWlnaHQgLyAyLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmdsZSArPSB0aGlzLnNwZWVkWCAqIDI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBiYWxsOyIsImV4cG9ydCBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkXCIpO1xyXG5leHBvcnQgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5leHBvcnQgY29uc3QgYm9hcmQgPSB7XHJcbiAgICBjb2xvcjogJyNmOWY5ZjknLFxyXG5cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gY2FudmFzLndpZHRoO1xyXG4gICAgfSxcclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhbnZhcy5oZWlnaHQ7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFNpemUodz04MDAsIGg9NjAwKSB7XHJcbiAgICAgICAgY2FudmFzLndpZHRoID0gdztcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaDtcclxuICAgIH0sXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBib2FyZDsiLCJpbXBvcnQge2NhbnZhc30gZnJvbSAnLi9ib2FyZCc7XHJcblxyXG5leHBvcnQgY29uc3QgbW91c2UgPSB7XHJcbiAgICBwb3NYOiAwLFxyXG4gICAgcG9zWTogMCxcclxuXHJcbiAgICBzZXRQb3NpdGlvbih4PTAsIHk9MCkge1xyXG4gICAgICAgIHRoaXMucG9zWCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NZID0geTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIGxpc3RlbmVyc1xyXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4ge1xyXG4gICAgbW91c2Uuc2V0UG9zaXRpb24oZS5wYWdlWCwgZS5wYWdlWSk7XHJcbn0sIHRydWUpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW91c2U7IiwiaW1wb3J0IHtjdHh9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHBhcnRpY2xlcyA9IHtcclxuICAgIGNvdW50OiA2MCxcclxuXHJcbiAgICBwb3NYOiAwLFxyXG4gICAgcG9zWTogMCxcclxuXHJcbiAgICBkaXJlY3Rpb246ICd0b3AnLFxyXG5cclxuICAgIGNvbG9yOiAnYmxhY2snLFxyXG4gICAgbGlzdDogW10sXHJcblxyXG4gICAgZW1pdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0ID0gdGhpcy5saXN0LmZpbHRlcihlID0+IGUucmFkaXVzID4gMCApO1xyXG5cclxuICAgICAgICB0aGlzLmxpc3QubWFwKHBhcnRpY2xlID0+IHtcclxuXHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5yYWRpdXMgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjdHguYXJjKHBhcnRpY2xlLnBvc1gsIHBhcnRpY2xlLnBvc1ksIHBhcnRpY2xlLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgcGFydGljbGUucG9zWCArPSBwYXJ0aWNsZS5zcGVlZFg7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc1kgKz0gcGFydGljbGUuc3BlZWRZO1xyXG5cclxuICAgICAgICAgICAgcGFydGljbGUucmFkaXVzID0gTWF0aC5tYXgocGFydGljbGUucmFkaXVzIC0gMC4wOCwgMC4wKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBQYXJ0aWNsZSh7cG9zWDogeCwgcG9zWTogeSwgZGlyZWN0aW9uOiBkaXJ9KSB7XHJcbiAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgdGhpcy5wb3NZID0geTtcclxuXHJcbiAgICB0aGlzLnJhZGl1cyA9IDI7XHJcblxyXG4gICAgc3dpdGNoIChkaXIpIHtcclxuICAgICAgICBjYXNlICd0b3AnOlxyXG4gICAgICAgICAgICB0aGlzLnNwZWVkWCA9IC0xLjUgKyBNYXRoLnJhbmRvbSgpICogNjtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZFkgPSAtMSAqIE1hdGgucmFuZG9tKCkgKiAzO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdib3R0b20nOlxyXG4gICAgICAgICAgICB0aGlzLnNwZWVkWCA9IC0xLjkgKyBNYXRoLnJhbmRvbSgpICogNjtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZFkgPSBNYXRoLnJhbmRvbSgpICogMztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbGVmdCc6XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWRYID0gLU1hdGgucmFuZG9tKCkgKiA2O1xyXG4gICAgICAgICAgICB0aGlzLnNwZWVkWSA9IE1hdGgucmFuZG9tKCkgKiAzO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdyaWdodCc6XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWRYID0gIE1hdGgucmFuZG9tKCkgKiA2O1xyXG4gICAgICAgICAgICB0aGlzLnNwZWVkWSA9IC0xICogTWF0aC5yYW5kb20oKSAqIDM7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtjdHh9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHBsYXllciA9IHtcclxuICAgIHBvc1g6IDAsXHJcbiAgICBwb3NZOiAwLFxyXG4gICAgXHJcbiAgICBsYXN0UG9zWDogMCxcclxuICAgIGRpcmVjdGlvbjogMCxcclxuXHJcbiAgICB3aWR0aDogMTIwLFxyXG4gICAgaGVpZ2h0OiAxMCxcclxuICAgIFxyXG4gICAgY29sb3I6ICdibGFjaycsXHJcbiAgICBcclxuICAgIHNldFBvc2l0aW9uKHg9MCwgeT0wKSB7XHJcbiAgICAgICAgdGhpcy5wb3NYID0geDtcclxuICAgICAgICB0aGlzLnBvc1kgPSB5O1xyXG4gICAgfSxcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHBsYXllcjsiXX0=
