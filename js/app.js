import {ctx, board} from './board';
import mouse from './mouse';
import ball from './ball';
import player from './player';
import {particles, Particle} from './particle';

const sounds = {
    collideWalls: document.getElementById('collide-walls'),
    collidePlayer: document.getElementById('collide-player')
};

let {
    innerWidth: windowWidth,
    innerHeight: windowHeight
} = window;

let score = 0;
let animation = null;
let collision = false;
let isPlayerCollide = false;


// Init board
board.setSize(windowWidth, windowHeight);
board.render();

ball.setPosition(100, 100);
ball.render();

player.setPosition(board.width / 2 - player.width / 2, board.height - player.height);
player.render();


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

    ball.setPosition(ball.posX + ball.speedX, ball.posY + ball.speedY);

    // top
    if (ball.posY - ball.size <= 0) {
        collision = true;
        ball.speedY = -ball.speedY;

        particles.posX = ball.posX;
        particles.posY = ball.posY;
        
        particles.direction = 'bottom';
    }

    // bottom
    if (ball.posY + ball.size >= board.height) {

        ball.posY = board.height - ball.size;
        gameOver();
    }

    // right
    if (ball.posX + ball.size >= board.width) {
        collision = true;
        ball.speedX = -ball.speedX;

        particles.posX = ball.posX + ball.size * 2;
        particles.posY = ball.posY;

        particles.direction = 'left';
    }

    // left
    if (ball.posX - ball.size <= 0) {
        collision = true;
        ball.speedX = -ball.speedX;
        
        particles.posX = ball.posX - ball.size;
        particles.posY = ball.posY;

        particles.direction = 'right';
    }

    if (ball.posX + ball.size / 2 >= player.posX && ball.posX - ball.size / 2 <= player.posX + player.width) {

        if (ball.posY  >= player.posY - player.height) {

            collision = true;
            isPlayerCollide = true;
            score++;

            if (player.direction === -1 && ball.speedX > 0) {
                ball.speedX = -ball.speedX;
            }

            if (player.direction === 1 && ball.speedX < 0) {
                ball.speedX = -ball.speedX;
            }

            ball.speedY = -ball.speedY;

            particles.posX = ball.posX;
            particles.posY = ball.posY + ball.size;

            particles.direction = 'top';

            if (score % 4 === 0) {
                ball.speedX += (ball.speedX < 0) ? -1 : 1;
                ball.speedY += (ball.speedY < 0) ? -2 : 2;
            }
        }
    }

    if (collision === true) {
        for (let i = 0; i < particles.count; i++) {
            particles.list.push(new Particle(particles));
        }

        if (isPlayerCollide === true) {
            sounds.collidePlayer.currentTime = 0;
            sounds.collidePlayer.play();

            isPlayerCollide = false;
        } else {
            sounds.collideWalls.currentTime = 0;
            sounds.collideWalls.play();
        }

        collision = false;
    }

    ball.move();
    ball.render();
    particles.emit();

    player.posX = mouse.posX - player.width / 2;
    player.direction = (player.posX === player.lastPosX) ? 0 : (player.posX > player.lastPosX) ? 1 : -1 ;
    player.lastPosX = player.posX;
    player.render();
};

const animationLoop = () => {
    animation = requestAnimationFrame(animationLoop);
    draw();
};

animationLoop();