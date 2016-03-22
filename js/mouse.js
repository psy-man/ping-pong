import {canvas} from './board';

export const mouse = {
    posX: 0,
    posY: 0,

    setPosition(x=0, y=0) {
        this.posX = x;
        this.posY = y;
    }
};

// listeners
canvas.addEventListener("mousemove", (e) => {
    mouse.setPosition(e.pageX, e.pageY);
}, true);

export default mouse;