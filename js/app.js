
import {board} from './board';

import mouse from './mouse';

import ball from './ball';
import player from './player';

import {particles, Particle} from './particle'; 


let {
    innerWidth: windowWidth,
    innerHeight: windowHeight
} = window;


// Init board
board.setSize(windowWidth, windowHeight);
board.render();

ball.setPosition(100, 100);
ball.render();

player.setPosition(board.width / 2 - player.width / 2, board.height - player.height);
player.render();



let animation = null;
let collision = false;
let isPlayerCollide = false;

const sounds = {
    collideWalls: document.getElementById('collide-walls'),
    collidePlayer: document.getElementById('collide-player')
};

const draw = () => {

    board.render();

    ball.setPosition(ball.posX + ball.speedX, ball.posY + ball.speedY);


    // top
    if (ball.posY <= 0) {
        collision = true;
        ball.speedY = -ball.speedY;

        particles.posX = ball.posX;
        particles.posY = ball.posY;
        
        particles.direction = 'bottom';
    }

    // bottom
    if (ball.posY + ball.size >= board.height) {
        collision = true;
        ball.speedY = -ball.speedY;

        particles.posX = ball.posX;
        particles.posY = ball.posY + ball.size;

        particles.direction = 'top';
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
    if (ball.posX <= 0) {
        collision = true;
        ball.speedX = -ball.speedX;
        
        particles.posX = ball.posX - ball.size;
        particles.posY = ball.posY;

        particles.direction = 'right';
    }

    if (ball.posX >= player.posX && ball.posX <= player.posX + player.width) {

        if (ball.posY + ball.size >= player.posY - player.height / 2) {

            collision = true;
            isPlayerCollide = true;
            ball.speedY = -ball.speedY;

            particles.posX = ball.posX;
            particles.posY = ball.posY + ball.size;

            particles.direction = 'top';

            // ball.speedX += (ball.speedX < 0) ? -1 : 1;
            // ball.speedY += (ball.speedY < 0) ? -2 : 2;
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
    player.render();
};

const animationLoop = () => {
    animation = requestAnimationFrame(animationLoop);
    draw();
};

animationLoop();