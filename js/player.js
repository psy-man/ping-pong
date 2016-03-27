import {ctx} from './board';
import {mouse} from "./mouse";
import {board} from "./board";

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
export const player = {
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
    setPosition(x = 0, y = 0) {
        this.posX = x;
        this.posY = y;
    },

    /**
     * Mouse control
     */
    move() {

        const left = mouse.posX - this.width / 2;
        const right = mouse.posX + this.width / 2;

        if (left < 0) {
            this.posX = 0;
        } else if(right > board.width) {
            this.posX = board.width - this.width;
        } else {
            this.posX = left;
        }

        this.detectDirection();
    },

    /**
     * Finding out the direction of movement
     */
    detectDirection() {
        this.direction = (this.posX === this.lastPosX) ? 0 : (this.posX > this.lastPosX) ? 1 : -1 ;
        this.lastPosX = this.posX;
    },

    /**
     * Displaying the player on canvas
     */
    render() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
        ctx.closePath();
        ctx.stroke();
    }
};

export default player;