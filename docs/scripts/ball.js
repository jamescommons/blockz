/* A ball stores its position, velocity, and has a 
 * move method that is called every tick. */

class Ball {
    constructor() {
        
        // Set the ball's angle to be 0 by default
        this.angle = 0;
        this.xPos = 0;
        this.yPos = 0;

        // Flag that becomes true when ball comes back
        this.isDone = false;
        this.hasStartedMoving = false;

        this.yDirection = 1;
        this.xDirection = 1;
    }

    setPos(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    setAngle(angle) {
        this.angle = angle;
    }

    move() {
        
        // Move ball based on angle and speed
        let dx = Math.cos(this.angle) * ballSpeed;
        let dy = Math.sin(this.angle) * ballSpeed;
        this.xPos += dx * this.xDirection;
        this.yPos -= dy * this.yDirection;
    }

    // Pen is the graphics context for the canvas
    draw(pen) {
        pen.fillStyle = '#ffffff';
        pen.beginPath();
        pen.arc(this.xPos, this.yPos - 7, 7, 0, 2 * Math.PI);
        pen.fill();
    }
}
