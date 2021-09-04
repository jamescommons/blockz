/* The renderer is responsible for drawing the players and objects.
 * It is also responsible for drawing the UI for aiming via a separate
 * method. Remember to draw number of balls. */

class Renderer {

    // Give the renderer access to game objects
    constructor(gameController) {
        this.gameController = gameController;
        this.pen = gameCanvas.getContext('2d');
    }

    render() {

        // Draw squares
        let rows = 9;
        let columns = 7;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                this.gameController.squares[i][j].draw(this.pen);
            }
        }

        // Draw balls
        let numBalls = this.gameController.balls.length;
        for (let i = 0; i < numBalls; i++) {
            this.gameController.balls[i].draw(this.pen);
        }

        // Draw number of balls
        this.pen.fillStyle = '#ffffff';
        this.pen.font = '15px sans-serif';
        this.pen.textAlign = 'center';
        this.pen.fillText(
            `x${numBalls}`, 
            this.gameController.ballPos - 10, 
            this.gameController.gameHeight - 17
        );
    }

    renderAimLines(dx, dy) {
        this.pen.lineWidth = 5;
        this.pen.lineCap = 'round';
        this.pen.moveTo(this.gameController.ballPos, 
                this.gameController.gameHeight - 7);
        this.pen.strokeStyle = '#ffffff';
        this.pen.lineTo(this.gameController.ballPos + dx, 
                this.gameController.gameHeight - 7 + dy);
        this.pen.stroke();
    }
}
