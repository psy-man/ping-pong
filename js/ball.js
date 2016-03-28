import {ctx} from './board';

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
export const ball = {
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
    setPosition(x = 0, y = 0) {
        this.posX = x;
        this.posY = y;
    },

    /**
     * Move a ball
     */
    move() {
        this.posX += this.speedX;
        this.posY += this.speedY;
    },

    /**
     * Render the ball
     */
    render() {
        ctx.save();
        ctx.translate(this.posX + this.radius, this.posY + this.radius);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();

        this.angle += this.speedX * 2;
    }
};

export default ball;