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

        if (this.health < 10) {
            this.red = 229;
            this.green = 164;
            this.blue = 40;
        } else if (this.health < 40) {
            this.red = 150;
            this.green = 150;
            this.blue = 180;
        } else {
            this.red = 229;
            this.green = 70;
            this.blue = 40;
        }
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
        if (this.health === -1) {
            this.outerCircSize = 10;
            this.outerCircIncrementer = 1;
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
                    (this.yPos + (this.width / 2)), 
                    this.outerCircSize, 
                    0, 2 * Math.PI
                );
                pen.stroke();
                if (this.outerCircSize <= 12) {
                    this.outerCircIncrementer = 1;
                } else if (this.outerCircSize >= 15) {
                    this.outerCircIncrementer = -1;
                }
                this.outerCircSize += this.outerCircIncrementer;
            }
            this.outCircTimer = setInterval(drawCirc, 50);

            return;
        }

        // Dynamically set color
        if (this.health < gameController.score / 2) {
            this.green += 3;
        } else if (this.health < gameController.score) {
            this.blue += 5;
            this.green -= 3;
            this.red -= 3;
        } else {
            if (this.red < 240) {
                this.blue -= 3;
                this.green -= 2;
                this.red += 3;
            }
        }

        this.color = `rgb(${this.red}, ${this.green}, ${this.blue})`;
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
