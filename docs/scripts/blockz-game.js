/* Class that represents a blockz game, which is a 2d array of numbers
 * representing the health of the blocks and a current position and 
 * number of balls in inventory */

class BlockzGame {
    
    // Constructs a new game
    constructor(json) {

        // Constructs a current game store in local storage
        if (json !== undefined) {
            let game = JSON.parse(json);
            this.grid = game.grid;
            this.numBalls = game.numBalls;
            this.score = game.score;
            this.gameOver = game.gameOver;
            this.position = game.position;
            return;
        }

        // 9 x 7
        this.grid = 
                [[0, 0, 0, 0, 0, 0, 0], // 1
                 [0, 0, 0, 0, 0, 0, 0], // 2
                 [0, 0, 0, 0, 0, 0, 0], // 3
                 [0, 0, 0, 0, 0, 0, 0], // 4
                 [0, 0, 0, 0, 0, 0, 0], // 5
                 [0, 0, 0, 0, 0, 0, 0], // 6
                 [0, 0, 0, 0, 0, 0, 0], // 7
                 [0, 0, 0, 0, 0, 0, 0], // 8 Game ends if not 0 at end of round
                 [0, 0, 0, 0, 0, 0, 0]];// 9 Never should not be 0
        
        // Position goes from 0 to 100 and is meant to be a percent
        this.position = 50;
        
        // Start with 1 ball
        this.numBalls = 1;

        // Score starts at 1
        this.score = 1;

        // Flag that stops the game if true
        this.gameOver = false;

        // Fill first level
        let firstRow = [];
        for (let i = 0; i < 7; i++) {
            let health = Math.floor(Math.random() * 2);
            switch (health) {
                case 0:
                    firstRow.push(0);
                    break;
                case 1:
                    firstRow.push(1);
                    break;
                default:
                    firstRow.push(0);
            }
        }
        this.grid[1] = firstRow;
    }

    advanceNextLevel() {
        this.score++;

        if (this.gameOver) {
            return;
        }

        // Determine next row
        let nextRow = [];
        for (let i = 0; i < 7; i++) {
            let health = Math.floor(Math.random() * 3);
            switch (health) {
                case 0:
                    nextRow.push(0);
                    break;
                case 1:
                    nextRow.push(this.score);
                    break;
                case 2:
                    nextRow.push(this.score * 2);
                    break;
                default:
                    nextRow.push(0);
            }
        }

        // Position ball
        let ballPos = Math.floor(Math.random() * 7);
        nextRow[ballPos] = -1;

        for (let i = 7; i >= 1; i--) {
            this.grid[i + 1] = this.grid[i];
        }
        this.grid[1] = nextRow;

        // Check health of last blocks
        for (let block of this.grid[8]) {
            if (block > 0) {
                this.gameOver = true;
                return;
            }
        }
    }

    // Increase balls in inventory by specified amount
    increaseBallCount(num) {
        if (this.gameOver) {
            return;
        }
        this.numBalls += num;
    }

    // Update relative position
    updatePosition(pos) {
        if (this.gameOver) {
            return;
        }
        this.position = pos;
    }
}

// For testing purposes (duh)
let testGame = () => {
    let game = new BlockzGame();
    for (let i = 0; i < 15; i++) {
        console.log(
            `Score: ${game.score} \
            Number of balls: ${game.numBalls} \
            Position: ${game.position}`
        );
        if (game.gameOver) {
            console.log('GAME OVER');
        }
        for (let i = 0; i < game.grid.length; i++) {
            let string = '';
            for (let j = 0; j < game.grid[i].length; j++) {
                string += game.grid[i][j].toString().padStart(2, '0') + ' ';
            }
            console.log(string + '\n');
        }
        console.log('\n\n\n');
        game.advanceNextLevel();
        game.increaseBallCount(1);
        game.updatePosition(Math.floor(Math.random() * 101));
    }
}

// testGame();
