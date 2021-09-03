/* A ball stores its position, velocity, and has a 
 * move method that is called every tick. */

class Ball {
    constructor() {
        
        // Set the ball's angle to be 0 by default
        this.angle = 0;
        this.xPos = 0;
        this.yPos = 0;
    }

    setPos(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    setangle(angle) {
        this.angle = angle;
    }

    move() {
        
        // Move ball based on angle and speed
        
    }

    // Pen is the graphics context for the canvas
    draw(pen) {
        pen.fillStyle = '#ffffff';
        pen.beginPath();
        pen.arc(this.xPos, this.yPos - 7, 7, 0, 2 * Math.PI);
        pen.fill();
    }
}
