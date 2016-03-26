import {ctx} from './board';
import {mouse} from "./mouse";
import {board} from "./board";

export const player = {
    posX: 0,
    posY: 0,
    
    lastPosX: 0,
    direction: 0,

    width: 120,
    height: 10,
    
    color: 'black',
    
    setPosition(x=0, y=0) {
        this.posX = x;
        this.posY = y;
    },
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
        
    },
    render() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
        ctx.closePath();
        ctx.stroke();
    }
};

export default player;