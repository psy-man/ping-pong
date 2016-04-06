import {board, ctx, canvas} from "./board";
import {animationLoop} from "./app";
import {game} from "./game";

/**
 * Start button
 */
export const startButton = {
  width: 120,
  height: 40,

  /**
   * Display the button
   */
  render() {
    this.posX = board.width / 2 - this.width / 2;
    this.posY =  board.height / 2 - this.height / 2;

    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.posX, this.posY, this.width, this.height);

    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "green";
    ctx.fillText("Start", board.width / 2, board.height / 2 );
  }
};


/**
 * Restart button
 */
export const restartButton = {
  width: 120,
  height: 40,

  /**
   * Display button
   */
  render() {
    this.posX = board.width / 2 - this.width / 2;
    this.posY =  board.height / 2 + 60;

    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.posX, this.posY, this.width, this.height);

    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "green";
    ctx.fillText("New Game", board.width / 2, board.height / 2 + 80 );
  }
};


// listeners
canvas.addEventListener("mousedown", (e) => {
  const {pageX, pageY} = e;

  if (game.finished) {
    if (pageX >= restartButton.posX && pageX <= restartButton.posX + restartButton.width) {
      if (pageY >= restartButton.posY && pageY <= restartButton.posY + restartButton.height) {
        
        game.init();
        animationLoop();
      }
    }
  } else {
    if (pageX >= startButton.posX && pageX <= startButton.posX + startButton.width) {
      if (pageY >= startButton.posY && pageY <= startButton.posY + startButton.height) {
        animationLoop();
      }
    }
  }
}, true);
