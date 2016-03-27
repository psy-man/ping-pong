import {ctx, board} from './board';
import {ball} from "./ball";
import sound from "./sound";
import {particles} from "./particle";
import {game} from "./game";

/**
 * Bricks factory
 * 
 * @param {Number} x [x=0]
 * @param {Number} y [y=0]
 */
export const brick  = (x = 0, y = 0) => ({
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
        return (board.width  - bricks.offset * (bricks.columns - 1)) / bricks.columns;
    },

    /**
     * Set brick position
     *
     * @param {Number} x [x=0]
     * @param {Number} y [y=0]
     */
    setPosition(x = 0, y = 0) { 
        this.posX = x;
        this.posY = y;
    },

    /**
     * Returns the center X position of brick
     * 
     * @returns {Number}
     */
    centerX() {
        return this.posX + this.width / 2;
    },

    /**
     * Returns the center Y position of brick
     *
     * @returns {Number}
     */
    centerY() {
        return this.posY + this.height / 2;
    },

    /**
     * Display the brick on canvas
     */
    render() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
        ctx.closePath();
        ctx.stroke();
    }
});

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
export const bricks = {
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
        return Math.floor(board.width / this.maxBrickWidth);
    },

    /**
     * Get random color
     *
     * @returns {String}
     */
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    /**
     * Drawing all bricks on canvas
     */
    build() {

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {

                let b = brick();
                b.setPosition(c * (b.width + this.offset), this.offsetTop + ((this.offset + b.height) * r));
                b.color = this.getRandomColor();
                b.render();

                this.list.push(b);
            }
        }
    },


    /**
     * Detecting collisions between ball and bricks
     */
    render() {

        if (this.list.length - game.score === 0) {
            game.victory();
        }

        let collision = false;
        this.list = this.list.map(b => {

            if (b.visible === true) {

                if (ball.posX + ball.radius >= b.posX && ball.posX - ball.radius  <= b.posX + b.width) {
                    if (ball.posY < b.posY + b.height && ball.posY + ball.size > b.posY) {

                        b.visible = false;

                        if (!collision) {
                            ball.speedY = -ball.speedY;
                            collision = true;
                        }

                        game.score++;

                        if (game.score % game.multiplier === 0) {
                            ball.speedX += (ball.speedX < 0) ? -1 : 1;
                            ball.speedY += (ball.speedY < 0) ? -2 : 2;
                            
                            game.levelUp();
                        }

                        particles.build(b.centerX(), b.centerY(), b.color);
                        sound.play('collide', 'brick');
                    }
                }

                b.render();
            }

            return b;
        })
    }
};