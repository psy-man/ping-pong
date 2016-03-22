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

var _window = window;
var windowWidth = _window.innerWidth;
var windowHeight = _window.innerHeight;

// Init board

_board.board.setSize(windowWidth, windowHeight);
_board.board.render();

_ball2.default.setPosition(100, 100);
_ball2.default.render();

_player2.default.setPosition(_board.board.width / 2 - _player2.default.width / 2, _board.board.height - _player2.default.height);
_player2.default.render();

var animation = null;
var collision = false;
var isPlayerCollide = false;

var sounds = {
    collideWalls: document.getElementById('collide-walls'),
    collidePlayer: document.getElementById('collide-player')
};

var draw = function draw() {

    _board.board.render();

    _ball2.default.setPosition(_ball2.default.posX + _ball2.default.speedX, _ball2.default.posY + _ball2.default.speedY);

    // top
    if (_ball2.default.posY <= 0) {
        collision = true;
        _ball2.default.speedY = -_ball2.default.speedY;

        _particle.particles.posX = _ball2.default.posX;
        _particle.particles.posY = _ball2.default.posY;

        _particle.particles.direction = 'bottom';
    }

    // bottom
    if (_ball2.default.posY + _ball2.default.size >= _board.board.height) {
        collision = true;
        _ball2.default.speedY = -_ball2.default.speedY;

        _particle.particles.posX = _ball2.default.posX;
        _particle.particles.posY = _ball2.default.posY + _ball2.default.size;

        _particle.particles.direction = 'top';
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
    if (_ball2.default.posX <= 0) {
        collision = true;
        _ball2.default.speedX = -_ball2.default.speedX;

        _particle.particles.posX = _ball2.default.posX - _ball2.default.size;
        _particle.particles.posY = _ball2.default.posY;

        _particle.particles.direction = 'right';
    }

    if (_ball2.default.posX >= _player2.default.posX && _ball2.default.posX <= _player2.default.posX + _player2.default.width) {

        if (_ball2.default.posY + _ball2.default.size >= _player2.default.posY - _player2.default.height / 2) {

            collision = true;
            isPlayerCollide = true;
            _ball2.default.speedY = -_ball2.default.speedY;

            _particle.particles.posX = _ball2.default.posX;
            _particle.particles.posY = _ball2.default.posY + _ball2.default.size;

            _particle.particles.direction = 'top';

            // ball.speedX += (ball.speedX < 0) ? -1 : 1;
            // ball.speedY += (ball.speedY < 0) ? -2 : 2;
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
    speedY: 3,

    image: document.getElementById("ball"),

    width: 20,
    height: 20,

    angle: 0,

    get size() {
        return this.width;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcYXBwLmpzIiwianNcXGJhbGwuanMiLCJqc1xcYm9hcmQuanMiLCJqc1xcbW91c2UuanMiLCJqc1xccGFydGljbGUuanMiLCJqc1xccGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7QUFFQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7OztjQU1JO0lBRlksc0JBQVo7SUFDYSx1QkFBYjs7OztBQUtKLGFBQU0sT0FBTixDQUFjLFdBQWQsRUFBMkIsWUFBM0I7QUFDQSxhQUFNLE1BQU47O0FBRUEsZUFBSyxXQUFMLENBQWlCLEdBQWpCLEVBQXNCLEdBQXRCO0FBQ0EsZUFBSyxNQUFMOztBQUVBLGlCQUFPLFdBQVAsQ0FBbUIsYUFBTSxLQUFOLEdBQWMsQ0FBZCxHQUFrQixpQkFBTyxLQUFQLEdBQWUsQ0FBZixFQUFrQixhQUFNLE1BQU4sR0FBZSxpQkFBTyxNQUFQLENBQXRFO0FBQ0EsaUJBQU8sTUFBUDs7QUFJQSxJQUFJLFlBQVksSUFBWjtBQUNKLElBQUksWUFBWSxLQUFaO0FBQ0osSUFBSSxrQkFBa0IsS0FBbEI7O0FBRUosSUFBTSxTQUFTO0FBQ1gsa0JBQWMsU0FBUyxjQUFULENBQXdCLGVBQXhCLENBQWQ7QUFDQSxtQkFBZSxTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBQWY7Q0FGRTs7QUFLTixJQUFNLE9BQU8sU0FBUCxJQUFPLEdBQU07O0FBRWYsaUJBQU0sTUFBTixHQUZlOztBQUlmLG1CQUFLLFdBQUwsQ0FBaUIsZUFBSyxJQUFMLEdBQVksZUFBSyxNQUFMLEVBQWEsZUFBSyxJQUFMLEdBQVksZUFBSyxNQUFMLENBQXREOzs7QUFKZSxRQVFYLGVBQUssSUFBTCxJQUFhLENBQWIsRUFBZ0I7QUFDaEIsb0JBQVksSUFBWixDQURnQjtBQUVoQix1QkFBSyxNQUFMLEdBQWMsQ0FBQyxlQUFLLE1BQUwsQ0FGQzs7QUFJaEIsNEJBQVUs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Q0FBL0MsQ0FISztBQUlMLG1CQUFJLFNBQUosR0FKSztBQUtMLG1CQUFJLE1BQUosR0FMSztLQWJTO0NBQVQ7O2tCQXNCRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuaW1wb3J0IHtjYW52YXMsIGN0eCwgYm9hcmR9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuaW1wb3J0IG1vdXNlIGZyb20gJy4vbW91c2UnO1xyXG5cclxuaW1wb3J0IGJhbGwgZnJvbSAnLi9iYWxsJztcclxuaW1wb3J0IHBsYXllciBmcm9tICcuL3BsYXllcic7XHJcblxyXG5pbXBvcnQge3BhcnRpY2xlcywgUGFydGljbGV9IGZyb20gJy4vcGFydGljbGUnOyBcclxuXHJcblxyXG5sZXQge1xyXG4gICAgaW5uZXJXaWR0aDogd2luZG93V2lkdGgsXHJcbiAgICBpbm5lckhlaWdodDogd2luZG93SGVpZ2h0XHJcbn0gPSB3aW5kb3c7XHJcblxyXG5cclxuLy8gSW5pdCBib2FyZFxyXG5ib2FyZC5zZXRTaXplKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xyXG5ib2FyZC5yZW5kZXIoKTtcclxuXHJcbmJhbGwuc2V0UG9zaXRpb24oMTAwLCAxMDApO1xyXG5iYWxsLnJlbmRlcigpO1xyXG5cclxucGxheWVyLnNldFBvc2l0aW9uKGJvYXJkLndpZHRoIC8gMiAtIHBsYXllci53aWR0aCAvIDIsIGJvYXJkLmhlaWdodCAtIHBsYXllci5oZWlnaHQpO1xyXG5wbGF5ZXIucmVuZGVyKCk7XHJcblxyXG5cclxuXHJcbmxldCBhbmltYXRpb24gPSBudWxsO1xyXG5sZXQgY29sbGlzaW9uID0gZmFsc2U7XHJcbmxldCBpc1BsYXllckNvbGxpZGUgPSBmYWxzZTtcclxuXHJcbmNvbnN0IHNvdW5kcyA9IHtcclxuICAgIGNvbGxpZGVXYWxsczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbGxpZGUtd2FsbHMnKSxcclxuICAgIGNvbGxpZGVQbGF5ZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xsaWRlLXBsYXllcicpXHJcbn07XHJcblxyXG5jb25zdCBkcmF3ID0gKCkgPT4ge1xyXG5cclxuICAgIGJvYXJkLnJlbmRlcigpO1xyXG5cclxuICAgIGJhbGwuc2V0UG9zaXRpb24oYmFsbC5wb3NYICsgYmFsbC5zcGVlZFgsIGJhbGwucG9zWSArIGJhbGwuc3BlZWRZKTtcclxuXHJcblxyXG4gICAgLy8gdG9wXHJcbiAgICBpZiAoYmFsbC5wb3NZIDw9IDApIHtcclxuICAgICAgICBjb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgIGJhbGwuc3BlZWRZID0gLWJhbGwuc3BlZWRZO1xyXG5cclxuICAgICAgICBwYXJ0aWNsZXMucG9zWCA9IGJhbGwucG9zWDtcclxuICAgICAgICBwYXJ0aWNsZXMucG9zWSA9IGJhbGwucG9zWTtcclxuICAgICAgICBcclxuICAgICAgICBwYXJ0aWNsZXMuZGlyZWN0aW9uID0gJ2JvdHRvbSc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYm90dG9tXHJcbiAgICBpZiAoYmFsbC5wb3NZICsgYmFsbC5zaXplID49IGJvYXJkLmhlaWdodCkge1xyXG4gICAgICAgIGNvbGxpc2lvbiA9IHRydWU7XHJcbiAgICAgICAgYmFsbC5zcGVlZFkgPSAtYmFsbC5zcGVlZFk7XHJcblxyXG4gICAgICAgIHBhcnRpY2xlcy5wb3NYID0gYmFsbC5wb3NYO1xyXG4gICAgICAgIHBhcnRpY2xlcy5wb3NZID0gYmFsbC5wb3NZICsgYmFsbC5zaXplO1xyXG5cclxuICAgICAgICBwYXJ0aWNsZXMuZGlyZWN0aW9uID0gJ3RvcCc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmlnaHRcclxuICAgIGlmIChiYWxsLnBvc1ggKyBiYWxsLnNpemUgPj0gYm9hcmQud2lkdGgpIHtcclxuICAgICAgICBjb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgIGJhbGwuc3BlZWRYID0gLWJhbGwuc3BlZWRYO1xyXG5cclxuICAgICAgICBwYXJ0aWNsZXMucG9zWCA9IGJhbGwucG9zWCArIGJhbGwuc2l6ZSAqIDI7XHJcbiAgICAgICAgcGFydGljbGVzLnBvc1kgPSBiYWxsLnBvc1k7XHJcblxyXG4gICAgICAgIHBhcnRpY2xlcy5kaXJlY3Rpb24gPSAnbGVmdCc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbGVmdFxyXG4gICAgaWYgKGJhbGwucG9zWCA8PSAwKSB7XHJcbiAgICAgICAgY29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgICBiYWxsLnNwZWVkWCA9IC1iYWxsLnNwZWVkWDtcclxuICAgICAgICBcclxuICAgICAgICBwYXJ0aWNsZXMucG9zWCA9IGJhbGwucG9zWCAtIGJhbGwuc2l6ZTtcclxuICAgICAgICBwYXJ0aWNsZXMucG9zWSA9IGJhbGwucG9zWTtcclxuXHJcbiAgICAgICAgcGFydGljbGVzLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJhbGwucG9zWCA+PSBwbGF5ZXIucG9zWCAmJiBiYWxsLnBvc1ggPD0gcGxheWVyLnBvc1ggKyBwbGF5ZXIud2lkdGgpIHtcclxuXHJcbiAgICAgICAgaWYgKGJhbGwucG9zWSArIGJhbGwuc2l6ZSA+PSBwbGF5ZXIucG9zWSAtIHBsYXllci5oZWlnaHQgLyAyKSB7XHJcblxyXG4gICAgICAgICAgICBjb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICBpc1BsYXllckNvbGxpZGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBiYWxsLnNwZWVkWSA9IC1iYWxsLnNwZWVkWTtcclxuXHJcbiAgICAgICAgICAgIHBhcnRpY2xlcy5wb3NYID0gYmFsbC5wb3NYO1xyXG4gICAgICAgICAgICBwYXJ0aWNsZXMucG9zWSA9IGJhbGwucG9zWSArIGJhbGwuc2l6ZTtcclxuXHJcbiAgICAgICAgICAgIHBhcnRpY2xlcy5kaXJlY3Rpb24gPSAndG9wJztcclxuXHJcbiAgICAgICAgICAgIC8vIGJhbGwuc3BlZWRYICs9IChiYWxsLnNwZWVkWCA8IDApID8gLTEgOiAxO1xyXG4gICAgICAgICAgICAvLyBiYWxsLnNwZWVkWSArPSAoYmFsbC5zcGVlZFkgPCAwKSA/IC0yIDogMjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNvbGxpc2lvbiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydGljbGVzLmNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgcGFydGljbGVzLmxpc3QucHVzaChuZXcgUGFydGljbGUocGFydGljbGVzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNQbGF5ZXJDb2xsaWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHNvdW5kcy5jb2xsaWRlUGxheWVyLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgc291bmRzLmNvbGxpZGVQbGF5ZXIucGxheSgpO1xyXG5cclxuICAgICAgICAgICAgaXNQbGF5ZXJDb2xsaWRlID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc291bmRzLmNvbGxpZGVXYWxscy5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHNvdW5kcy5jb2xsaWRlV2FsbHMucGxheSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29sbGlzaW9uID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgYmFsbC5tb3ZlKCk7XHJcbiAgICBiYWxsLnJlbmRlcigpO1xyXG4gICAgcGFydGljbGVzLmVtaXQoKTtcclxuXHJcbiAgICBwbGF5ZXIucG9zWCA9IG1vdXNlLnBvc1ggLSBwbGF5ZXIud2lkdGggLyAyO1xyXG4gICAgcGxheWVyLnJlbmRlcigpO1xyXG59O1xyXG5cclxuY29uc3QgYW5pbWF0aW9uTG9vcCA9ICgpID0+IHtcclxuICAgIGFuaW1hdGlvbiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRpb25Mb29wKTtcclxuICAgIGRyYXcoKTtcclxufTtcclxuXHJcbmFuaW1hdGlvbkxvb3AoKTsiLCJpbXBvcnQge2N0eH0gZnJvbSAnLi9ib2FyZCc7XHJcbmltcG9ydCB7Ym9hcmR9IGZyb20gXCIuL2JvYXJkXCI7XHJcblxyXG5leHBvcnQgY29uc3QgYmFsbCA9IHtcclxuICAgIHBvc1g6IDQwLFxyXG4gICAgcG9zWTogNDAsXHJcblxyXG4gICAgc3BlZWRYOiAyLFxyXG4gICAgc3BlZWRZOiAzLFxyXG5cclxuICAgIGltYWdlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhbGxcIiksXHJcblxyXG4gICAgd2lkdGg6IDIwLFxyXG4gICAgaGVpZ2h0OiAyMCxcclxuXHJcbiAgICBhbmdsZTogMCxcclxuICAgIFxyXG4gICAgZ2V0IHNpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGg7XHJcbiAgICB9LFxyXG4gICAgc2V0UG9zaXRpb24oeD0wLCB5PTApIHtcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9LFxyXG4gICAgbW92ZSgpIHtcclxuICAgICAgICB0aGlzLnBvc1ggKz0gdGhpcy5zcGVlZFg7XHJcbiAgICAgICAgdGhpcy5wb3NZICs9IHRoaXMuc3BlZWRZO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKHRoaXMucG9zWCwgdGhpcy5wb3NZKTtcclxuICAgICAgICBjdHgucm90YXRlKHRoaXMuYW5nbGUgKiBNYXRoLlBJIC8gMTgwKTtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIC10aGlzLndpZHRoIC8gMiwgLXRoaXMuaGVpZ2h0IC8gMiwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYW5nbGUgKz0gdGhpcy5zcGVlZFggKiAyO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYmFsbDsiLCJleHBvcnQgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKTtcclxuZXhwb3J0IGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJvYXJkID0ge1xyXG4gICAgY29sb3I6ICcjZjlmOWY5JyxcclxuXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIGNhbnZhcy53aWR0aDtcclxuICAgIH0sXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiBjYW52YXMuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRTaXplKHc9ODAwLCBoPTYwMCkge1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHc7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGg7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYm9hcmQ7IiwiaW1wb3J0IHtjYW52YXN9IGZyb20gJy4vYm9hcmQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IG1vdXNlID0ge1xyXG4gICAgcG9zWDogMCxcclxuICAgIHBvc1k6IDAsXHJcblxyXG4gICAgc2V0UG9zaXRpb24oeD0wLCB5PTApIHtcclxuICAgICAgICB0aGlzLnBvc1ggPSB4O1xyXG4gICAgICAgIHRoaXMucG9zWSA9IHk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBsaXN0ZW5lcnNcclxuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgKGUpID0+IHtcclxuICAgIG1vdXNlLnNldFBvc2l0aW9uKGUucGFnZVgsIGUucGFnZVkpO1xyXG59LCB0cnVlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vdXNlOyIsImltcG9ydCB7Y3R4fSBmcm9tICcuL2JvYXJkJztcclxuXHJcbmV4cG9ydCBjb25zdCBwYXJ0aWNsZXMgPSB7XHJcbiAgICBjb3VudDogNjAsXHJcblxyXG4gICAgcG9zWDogMCxcclxuICAgIHBvc1k6IDAsXHJcblxyXG4gICAgZGlyZWN0aW9uOiAndG9wJyxcclxuXHJcbiAgICBjb2xvcjogJ2JsYWNrJyxcclxuICAgIGxpc3Q6IFtdLFxyXG5cclxuICAgIGVtaXQoKSB7XHJcblxyXG4gICAgICAgIHRoaXMubGlzdCA9IHRoaXMubGlzdC5maWx0ZXIoZSA9PiBlLnJhZGl1cyA+IDAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5saXN0Lm1hcChwYXJ0aWNsZSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY3R4LmFyYyhwYXJ0aWNsZS5wb3NYLCBwYXJ0aWNsZS5wb3NZLCBwYXJ0aWNsZS5yYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnBvc1ggKz0gcGFydGljbGUuc3BlZWRYO1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5wb3NZICs9IHBhcnRpY2xlLnNwZWVkWTtcclxuXHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyA9IE1hdGgubWF4KHBhcnRpY2xlLnJhZGl1cyAtIDAuMDgsIDAuMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gUGFydGljbGUoe3Bvc1g6IHgsIHBvc1k6IHksIGRpcmVjdGlvbjogZGlyfSkge1xyXG4gICAgdGhpcy5wb3NYID0geDtcclxuICAgIHRoaXMucG9zWSA9IHk7XHJcblxyXG4gICAgdGhpcy5yYWRpdXMgPSAyO1xyXG5cclxuICAgIHN3aXRjaCAoZGlyKSB7XHJcbiAgICAgICAgY2FzZSAndG9wJzpcclxuICAgICAgICAgICAgdGhpcy5zcGVlZFggPSAtMS41ICsgTWF0aC5yYW5kb20oKSAqIDY7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWRZID0gLTEgKiBNYXRoLnJhbmRvbSgpICogMztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgICAgICAgdGhpcy5zcGVlZFggPSAtMS45ICsgTWF0aC5yYW5kb20oKSAqIDY7XHJcbiAgICAgICAgICAgIHRoaXMuc3BlZWRZID0gTWF0aC5yYW5kb20oKSAqIDM7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2xlZnQnOlxyXG4gICAgICAgICAgICB0aGlzLnNwZWVkWCA9IC1NYXRoLnJhbmRvbSgpICogNjtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZFkgPSBNYXRoLnJhbmRvbSgpICogMztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAncmlnaHQnOlxyXG4gICAgICAgICAgICB0aGlzLnNwZWVkWCA9ICBNYXRoLnJhbmRvbSgpICogNjtcclxuICAgICAgICAgICAgdGhpcy5zcGVlZFkgPSAtMSAqIE1hdGgucmFuZG9tKCkgKiAzO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufSIsImltcG9ydCB7Y3R4fSBmcm9tICcuL2JvYXJkJztcclxuXHJcbmV4cG9ydCBjb25zdCBwbGF5ZXIgPSB7XHJcbiAgICBwb3NYOiAwLFxyXG4gICAgcG9zWTogMCxcclxuXHJcbiAgICB3aWR0aDogMTIwLFxyXG4gICAgaGVpZ2h0OiAxMCxcclxuICAgIFxyXG4gICAgY29sb3I6ICdibGFjaycsXHJcbiAgICBcclxuICAgIHNldFBvc2l0aW9uKHg9MCwgeT0wKSB7XHJcbiAgICAgICAgdGhpcy5wb3NYID0geDtcclxuICAgICAgICB0aGlzLnBvc1kgPSB5O1xyXG4gICAgfSxcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KHRoaXMucG9zWCwgdGhpcy5wb3NZLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHBsYXllcjsiXX0=
