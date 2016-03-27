import {ctx, board} from './board';
import {ball} from "./ball";
import sound from "./sound";
import {particles} from "./particle";
import {game} from "./game";


export const brick  = (x = 0, y = 0) => ({
    posX: x,
    posY: y,

    height: 20,

    color: 'green',

    visible: true,

    get width() {
        return (board.width  - bricks.offset * (bricks.columns - 1)) / bricks.columns;
    },
    
    setPosition(x=0, y=0) { 
        this.posX = x;
        this.posY = y;
    },
    centerX() {
        return this.posX + this.width / 2;
    },
    centerY() {
        return this.posY + this.height / 2;
    },
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

    rows: 6,

    maxBrickWidth: 100,

    list: [],

    get columns() {
        return Math.floor(board.width / this.maxBrickWidth);
    },

    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    build() {

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {

                let b = brick();
                b.setPosition(c * (b.width + this.offset), this.offsetTop + ((this.offset + b.height) * r));
                b.color = this.getRandomColor();
                b.render();

                this.list.push(b);
            }
        }
    },
    
    render() {

        if (this.list.length - game.score === 0) {
            game.win();
        }

        let collision = false;
        this.list = this.list.map(b => {

            if (b.visible === true) {

                if (ball.posX + ball.center >= b.posX && ball.posX - ball.center  <= b.posX + b.width) {
                    if (ball.posY < b.posY + b.height && ball.posY + ball.size > b.posY) {

                        b.visible = false;

                        if (!collision) {
                            ball.speedY = -ball.speedY;
                            collision = true;
                        }

                        game.score++;

                        if (game.score % game.multiplier === 0) {
                            ball.speedX += (ball.speedX < 0) ? -1 : 1;
                            ball.speedY += (ball.speedY < 0) ? -2 : 2;
                            
                            game.levelUp();
                        }

                        particles.build(b.centerX(), b.centerY(), b.color);
                        sound.play('collide', 'brick');
                    }
                }

                b.render();
            }

            return b;
        })
    }
};