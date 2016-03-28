import game from './game';
import {board} from './board';
import ball from './ball';
import player from './player';
import {particles} from './particle';
import {bricks} from './brick';
import sound from './sound';

let {
    innerWidth: windowWidth,
    innerHeight: windowHeight
} = window;

export let animation = null;

// Init board
board.setSize(windowWidth, windowHeight);
board.render();

ball.setPosition(200, board.height / 3 * 2);
ball.render();

player.setPosition(board.width / 2 - player.width / 2, board.height - player.height);
player.render();

bricks.build();

/**
 * Detecting the collision between player and ball
 */
const collision = () => {

    // top
    if (ball.posY <= 0) {
        ball.speedY = -ball.speedY;
        sound.play('collide', 'wall');
    }

    // right
    if (ball.posX + ball.size >= board.width) {
        ball.speedX = -ball.speedX;
        sound.play('collide', 'wall');
    }

    // left
    if (ball.posX <= 0) {
        ball.speedX = -ball.speedX;
        sound.play('collide', 'wall');
    }

    // player or game over :(
    if (ball.posX + ball.radius >= player.posX && ball.posX <= player.posX + player.width && ball.posY + ball.size >= player.posY) {

        if (player.direction === -1 && ball.speedX > 0) {
            ball.speedX = -ball.speedX;
        }

        if (player.direction === 1 && ball.speedX < 0) {
            ball.speedX = -ball.speedX;
        }

        ball.speedY = -ball.speedY; 

        particles.build(ball.posX + ball.radius, ball.posY + ball.size, 'black');
        sound.play('collide', 'player')
        
    } else if (ball.posY + ball.size >= board.height) {
        ball.posY = board.height - ball.size;
        game.over();
    }
};


/**
 * Updating the canvas
 */
const draw = () => {

    board.render();
    bricks.render();

    game.displayScore();
    game.displayLevel();

    collision();

    ball.move();
    ball.render();
    
    particles.emit();

    player.move();
    player.render();
};


/**
 * Main game loop
 */
const animationLoop = () => {
    animation = requestAnimationFrame(animationLoop);
    draw();
};

animationLoop();