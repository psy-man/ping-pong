import {ctx} from './board';

/**
 * Particle factory function
 *
 * @param {Number} x [x=0]
 * @param {Number} y [y=0]
 * @param {String} c [c='black']
 */
export const particle = (x = 0, y = 0, c = 'black') => ({
    posX: x,
    posY: y,

    speedX: -5 + Math.random() * 10,
    speedY: -5 + Math.random() * 10,

    color: c, 

    radius: 3.5
});

/**
 * Particles manipulation object
 *
 * @type {{
 *  count: number,
 *  list: Array,
 *  build: (function(Number=, Number=, String=)),
 *  emit: (function())
 * }}
 */
export const particles = {
    count: 20,
    list: [],

    /**
     * Creating particles
     *
     * @param {Number} x [x=0]
     * @param {Number} y [y=0]
     * @param {String} color [c='black']
     */
    build(x = 0, y = 0, color = 'black') {
        for (let i = 0; i < this.count; i++) {
            this.list.push(particle(x, y, color));
        }
    },

    /**
     * Displaying the particles on board
     */
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

