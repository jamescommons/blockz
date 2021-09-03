/* A ball stores its position, velocity, and has a 
 * move method that is called every tick. */

class Ball {
    constructor() {
        
        // Set the ball's slope to be 0 by default
        this.slope = 0;
        this.xPos = 0;
        this.yPos = 0;
    }

    setPos(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    setSlope(slope) {
        this.slope = slope;
    }

    move() {
        let dx = Math.sqrt((ballSpeed * ballSpeed) / 
                ((this.slope * this.slope) + 1));
        let dy = this.slope * ballSpeed;
        this.xPos += dx;
        this.yPos += dy;
    }

    // Pen is the graphics context for the canvas
    draw(pen) {
        pen.fillStyle = '#ffffff';
        pen.beginPath();
        pen.arc(this.xPos, this.yPos - 7, 7, 0, 2 * Math.PI);
        pen.fill();
    }
}
