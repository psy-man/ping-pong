import {ctx} from './board';
import {ball} from "./ball";


export const particle = (x, y, dir, c) => ({

    posX: x,
    posY: y,

    speedX: 0,
    speedY: 0,

    color: c,

    radius: 1.8,

    init() {

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
                this.speedX =  Math.random() * 6;
                this.speedY = -1 * Math.random() * 3;
                break;
            case 'center':
                this.speedX = -1.5 + Math.random() * 2.5;
                this.speedY = -1 * Math.random() * 1.5;
                break;
        }

        return this;
    }
});

export const particles = {
    count: 20,

    list: [],

    build(dir, color) {
        for (let i = 0; i < this.count; i++) {
            this.list.push(
                particle(ball.posX, ball.posY, dir, color).init()
            );
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

            p.posX += p.speedX;
            p.posY += p.speedY;

            p.radius = Math.max(p.radius - 0.08, 0.0);
        });
    }
};

