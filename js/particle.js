import {ctx} from './board';


export const particle = (x, y, c) => ({
    posX: x,
    posY: y,

    speedX: -5 + Math.random() * 10,
    speedY:  -5 + Math.random() * 10,

    color: c, 

    radius: 3.5
});

export const particles = {
    count: 20,
    list: [],

    build(x, y, color) {
        for (let i = 0; i < this.count; i++) {
            this.list.push(particle(x, y, color));
        }
    },

    emit() {

        this.list = this.list.filter(e => e.radius > 0);
        this.list.map(p => {

            ctx.beginPath();
            ctx.fillStyle = p.color;
            if (p.radius > 0) {
                ctx.arc(p.posX, p.posY, p.radius, 0, Math.PI * 2, false);
            }
            ctx.fill();
            ctx.closePath();

            p.posX += p.speedX;
            p.posY += p.speedY;

            p.radius = Math.max(p.radius - 0.2, 0.0);
        });
    }
};

