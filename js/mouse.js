import {canvas} from './board';

/**
 *
 * @type {{
 *  posX: Number, 
 *  posY: Number,
 *  setPosition: (function(Number=, Number=))
 * }}
 */
export const mouse = {
    posX: 0,
    posY: 0,

    /**
     * Set mouse position
     *
     * @param {Number} x [x=0]
     * @param {Number} y [y=0]
     */
    setPosition(x = 0, y = 0) {
        this.posX = x;
        this.posY = y;
    }
};

// listeners
canvas.addEventListener("mousemove", (e) => mouse.setPosition(e.pageX, e.pageY) , true);

export default mouse;