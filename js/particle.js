import {ctx} from './board';

export const particles = {
    count: 60,

    posX: 0,
    posY: 0,

    direction: 'top',

    color: 'black',
    list: [],

    emit() {

        this.list = this.list.filter(e => e.radius > 0 );

        this.list.map(particle => {

            ctx.beginPath();
            ctx.fillStyle = this.color;
            if (particle.radius > 0) {
                ctx.arc(particle.posX, particle.posY, particle.radius, 0, Math.PI * 2, false);
            }
            ctx.fill();

            particle.posX += particle.speedX;
            particle.posY += particle.speedY;

            particle.radius = Math.max(particle.radius - 0.08, 0.0);
        });
    }
};

export function Particle({posX: x, posY: y, direction: dir}) {
    this.posX = x;
    this.posY = y;

    this.radius = 2;

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
    }
}