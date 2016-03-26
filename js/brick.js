import {ctx} from './board';
import {board} from "./board";
import {ball} from "./ball";
import sound from "./sound";
import {particles} from "./particle";


export const brick  = (x = 0, y = 0) => ({
    posX: x,
    posY: y,

    width: 40,
    height: 20,

    color: 'green',

    visible: true,

    render() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
        ctx.closePath();
        ctx.stroke();
    }
});


export const bricks = {

    offset: 0,
    offsetTop: 60,
    
    columns: 0,
    rows: 6,

    maxBrickWidth: 100,
    maxBrickHeight: 20,

    colors: ['red', 'green', 'blue'],
    
    list: [],

    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    build() {

        this.columns = Math.floor(board.width / this.maxBrickWidth)
        let width = (board.width  - this.offset * (this.columns - 1)) / this.columns;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {

                let b = brick(c * (width + this.offset), this.offsetTop + ((this.offset + this.maxBrickHeight) * r));
                b.width = width;
                b.color = this.getRandomColor();
                b.render();

                this.list.push(b);
            }
        }
    },
    
    render() {
        this.list = this.list.map(b => {

            if (b.visible === true) {

                if (ball.posX + ball.size / 2 >= b.posX && ball.posX - ball.size / 2 <= b.posX + b.width) {

                    if (ball.posY - ball.size < b.posY + b.height && ball.posY + ball.size > b.posY) {

                        ball.speedY = -ball.speedY;

                        particles.build('center', b.color);
                        sound.play('collide', 'brick');

                        b.visible = false;
                    }
                }

                b.render();
            }

            return b;
        })
    }
};