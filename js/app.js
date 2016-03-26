import {ctx, board} from './board';
import ball from './ball';
import player from './player';
import {particles, particle} from './particle';
import {bricks} from './brick';
import sound from './sound';




let {
    innerWidth: windowWidth,
    innerHeight: windowHeight
} = window;

let score = 0;
let animation = null;


// Init board
board.setSize(windowWidth, windowHeight);
board.render();

ball.setPosition(100, board.height / 3 * 2);
ball.render();

player.setPosition(board.width / 2 - player.width / 2, board.height - player.height);
player.render();

bricks.build();


const gameOver = () => {

    ctx.fillStlye = "black";
    ctx.font = "20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Game Over - You score is ${score} points!`, board.width / 2, board.height / 2);

    cancelAnimationFrame(animation);
};

const draw = () => {

    board.render();
    bricks.render();

    ball.setPosition(ball.posX + ball.speedX, ball.posY + ball.speedY);

    // top
    if (ball.posY - ball.size <= 0) {
        ball.speedY = -ball.speedY;
        sound.play('collide', 'wall');
    }

    // bottom
    if (ball.posY + ball.size >= board.height) {

        ball.posY = board.height - ball.size;
        gameOver();
    }

    // right
    if (ball.posX + ball.size >= board.width) {
        ball.speedX = -ball.speedX;
        sound.play('collide', 'wall');
    }

    // left
    if (ball.posX - ball.size <= 0) {
        ball.speedX = -ball.speedX;
        sound.play('collide', 'wall');
    }

    if (ball.posX + ball.size / 2 >= player.posX && ball.posX - ball.size / 2 <= player.posX + player.width) {

        if (ball.posY  >= player.posY - player.height) {

            score++;

            if (player.direction === -1 && ball.speedX > 0) {
                ball.speedX = -ball.speedX;
            }

            if (player.direction === 1 && ball.speedX < 0) {
                ball.speedX = -ball.speedX;
            }

            ball.speedY = -ball.speedY;
            
            particles.build('top', 'black');
            
            

            // if (score % 4 === 0) {
            //     ball.speedX += (ball.speedX < 0) ? -1 : 1;
            //     ball.speedY += (ball.speedY < 0) ? -2 : 2;
            // }

            sound.play('collide', 'player')
        }
    }



    ball.move();
    ball.render();
    particles.emit();
    
    
    
    player.move();

    
    player.direction = (player.posX === player.lastPosX) ? 0 : (player.posX > player.lastPosX) ? 1 : -1 ;
    player.lastPosX = player.posX;
    player.render();
};

const animationLoop = () => {
    animation = requestAnimationFrame(animationLoop);
    draw();
};

animationLoop();