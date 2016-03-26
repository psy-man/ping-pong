import {ctx} from './board';

export const ball = {
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
    setPosition(x=0, y=0) {
        this.posX = x;
        this.posY = y;
    },
    move() {
        this.posX += this.speedX;
        this.posY += this.speedY;
    },

    render() {
        ctx.save();
        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();

        this.angle += this.speedX * 2;
    }
};

export default ball;