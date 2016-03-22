import {ctx} from './board';

export const player = {
    posX: 0,
    posY: 0,

    width: 120,
    height: 10,
    
    color: 'black',
    
    setPosition(x=0, y=0) {
        this.posX = x;
        this.posY = y;
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