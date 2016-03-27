import {board, ctx} from "./board";
import {animation} from "./app";


export const game = {
    score: 0,
    level: 1,

    multiplier: 4,

    textPadding: 10,

    levelUp() {
        this.level++;
    },
    
    displayScore() {
        ctx.fillStyle = "black";
        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "start";
        ctx.textBaseline = "top";
        ctx.fillText(`Score: ${this.score}`, this.textPadding, this.textPadding);

    },
    displayLevel() {
        ctx.fillStyle = "black";
        ctx.font = "18px Arial, sans-serif";
        ctx.textAlign = "end";
        ctx.textBaseline = "top";
        ctx.fillText(`Level: ${this.level}`, board.width - this.textPadding, this.textPadding);
    },
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
    },
    win() {
        ctx.fillStyle = "red";
        ctx.font = "26px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`Congratulations!`, board.width / 2, board.height / 2);
        ctx.fillText(`You won`, board.width / 2, board.height / 2 + 40);

        cancelAnimationFrame(animation);
    }
};

export default game;
