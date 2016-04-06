import {board, ctx} from "./board";
import {animation} from "./app";
import {restartButton} from "./button";
import {ball} from "./ball";
import {player} from "./player";
import {bricks} from "./brick";

/**
 * Game's functions
 */
export const game = {
  score: 0,
  level: 1,

  multiplier: 10,

  textPadding: 10,

  finished: false,

  /**
   * Draw the first scene
   */
  init() {

    this.score = 0;
    this.level = 1;

    let {
      innerWidth: windowWidth,
      innerHeight: windowHeight
    } = window;

    board.setSize(windowWidth, windowHeight);
    board.render();

    ball.setPosition(200, board.height / 3 * 2);
    ball.speedX = 4;
    ball.speedY = -8;
    ball.render();

    player.setPosition(board.width / 2 - player.width / 2, board.height - player.height);
    player.render();

    bricks.build();
  },

  /**
   * Increase the level
   */
  levelUp() {
    this.level++;
  },

  /**
   * Displaying the score of the game
   */
  displayScore() {
    ctx.fillStyle = "black";
    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "start";
    ctx.textBaseline = "top";
    ctx.fillText(`Score: ${this.score}`, this.textPadding, this.textPadding);

  },

  /**
   * Displaying the level
   */
  displayLevel() {
    ctx.fillStyle = "black";
    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "end";
    ctx.textBaseline = "top";
    ctx.fillText(`Level: ${this.level}`, board.width - this.textPadding, this.textPadding);
  },

  /**
   * Game over :(
   * Displaying the message
   * Stop the game loop
   */
  over() {
    ctx.fillStyle = "black";
    ctx.font = "26px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Game Over`, board.width / 2, board.height / 2 - 40);

    ctx.fillStyle = "#212121";
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText(`Your score is ${this.score} points!`, board.width / 2, board.height / 2);
    ctx.fillText(`You reached level ${this.level}`, board.width / 2, board.height / 2 + 30);

    cancelAnimationFrame(animation);
    this.finished = true;
    restartButton.render();
  },

  /**
   * Victory!
   * Displaying the message
   * Stop the game loop
   */
  victory() {
    ctx.fillStyle = "red";
    ctx.font = "26px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Congratulations!`, board.width / 2, board.height / 2 - 10);
    ctx.fillText(`You won`, board.width / 2, board.height / 2 + 30);

    cancelAnimationFrame(animation);
    this.finished = true;
    restartButton.render();
  }
};

export default game;
