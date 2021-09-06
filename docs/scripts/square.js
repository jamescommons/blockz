/* A square is responsible for knowing what color it should
 * be depending on its health, its size and position based
 * on the users screen, and retrieving its own relative 
 * position and health from the BlockzGame object. A square 
 * can also be an extra ball, so a square will also keep track
 * of this information */

class Square {
    constructor(health) {

        // Some default value, will change before it matters
        this.width = 0;
        this.xPos = 0;
        this.yPos = 0;

        this.health = health;
        this.isExtraBall = this.health === -1;

        this.outerCircSize = 10;
        this.outerCircIncrementer = 1;
        this.shouldIncrement = true;
    }

    setWidth(width) {
        this.width = width;
    }

    setPos(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
    }

    // Pen is the graphics context for the canvas
    draw(pen) {

        // Don't draw anything if health is 0
        if (this.health === 0) {
            return;
        }

        // Draw extra ball instead
        if (this.isExtraBall) {
            let drawCirc = () => {
            
                // Draw animated outer circles
                pen.clearRect(this.xPos, this.yPos, this.width, this.width);

                pen.fillStyle = '#ffffff';
                pen.beginPath();
                pen.arc(
                    this.xPos + (this.width / 2), 
                    (this.yPos + (this.width / 2)), 
                    7, 0, 2 * Math.PI
                );
                pen.fill();

                pen.strokeStyle = '#ffffff';
                pen.lineWidth = 3;
                pen.beginPath();
                pen.arc(
                    this.xPos + (this.width / 2), 
                    this.yPos + (this.width / 2), 
                    this.outerCircSize, 
                    0, 2 * Math.PI
                );
                pen.stroke();
                if (this.outerCircSize <= 12) {
                    this.outerCircIncrementer = 1;
                } else if (this.outerCircSize >= 15) {
                    this.outerCircIncrementer = -1;
                }
                this.shouldIncrement = !this.shouldIncrement;

                if (this.shouldIncrement) {
                    this.outerCircSize += this.outerCircIncrementer;
                }
            }
            drawCirc();

            return;
        }

        // Dynamically set color
        let score = gameController.score;
        this.h = (this.health - score) * 4 + 35;
        this.s = 80;
        this.l = 60;

        this.color = `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
        pen.fillStyle = this.color;
        pen.beginPath();
        pen.fillRect(this.xPos, this.yPos, this.width, this.width);
        pen.fill();

        pen.font = '20px sans-serif';
        pen.fillStyle = '#000000';
        pen.textAlign = 'center';
        pen.fillText(
            this.health.toString(), 
            this.xPos + (this.width / 2),
            this.yPos + (this.width / 2) + 8,
            this.width - 4
        );
    }
}
