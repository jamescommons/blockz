/* The game controller is responsible for the game clock,
 * loading previous games from localStorage, saving 
 * high scores, collision detection, and managing objects. 
 * The game controller is also responsible for getting 
 * user input before clock starts. Finally, game controller 
 * retrieves current score and high scores from blockz game 
 * and local storage respectively and displays these values 
 * on the header. */

// Global variables
var fps = 30;
var ballSpeed = 10 / fps;
var gameCanvas = document.getElementById('game-canvas');

class GameController {
    constructor() {

        // Check to see if user has played before or if game
        // has already ended
        if (localStorage.currentGame === undefined 
                || localStorage.currentGame === 'game over') {
            localStorage.currentGame = JSON.stringify(new BlockzGame());
        }
        this.blockzGame = new BlockzGame(localStorage.currentGame);
        this.score = this.blockzGame.score;
        
        this.squares = [];
        this.blockGap = 5;

        // Load squares
        for (let i = 0; i < 9; i++) {
            let squareRow = [];
            for (let j = 0; j < 7; j++) {
                squareRow.push(new Square(this.blockzGame.grid[i][j]));
            }
            this.squares.push(squareRow);
        }

        this.balls = [];

        // Load balls
        let numBalls = this.blockzGame.numBalls;
        for (let i = 0; i < numBalls; i++) {
            this.balls.push(new Ball());
        }

        this.renderer = new Renderer(this);
    }

    setScreenSize() {
        if (window.innerWidth > 500) {
            gameCanvas.setAttribute('width', '500');
        } else {
            gameCanvas.setAttribute('width', `${window.innerWidth - 20}`);
        }
        gameCanvas.setAttribute('height', `${window.innerHeight - 40}`);
        this.squareWidth = 
                (gameCanvas.getAttribute('width') - 8 * this.blockGap) / 7;
        this.ballPos = (this.blockzGame.position / 100) * 
                gameCanvas.getAttribute('width');
        
        // Set bottom gutter height
        let gameHeight = (this.blockGap * 8) + (this.squareWidth * 9);
        this.gutterHeight = gameCanvas.getAttribute('height') - gameHeight;
        this.gameHeight = gameHeight;
    }

    initPlayers() {

        // Set size and position attributes
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].setPos(this.ballPos, this.gameHeight);
        }

        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                this.squares[i][j].setWidth(this.squareWidth);
                this.squares[i][j].setPos(
                    (j * this.squareWidth) + ((j + 1) * this.blockGap),
                    (i * this.squareWidth) + (i * this.blockGap)
                );
            }
        }
    }

    // Returns the angle
    getUserInput() {
        let angle = 0;
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        let timer;
        let shouldDraw = false;
        let dx = 0;
        let dy = 0;
        let mouseDown = false;

        let mousedownHandler = e => {
            startX = e.offsetX;
            startY = e.offsetY;
            shouldDraw = true;
            mouseDown = true;
        }

        let mousemoveHandler = e => {
            endX = e.offsetX;
            endY = e.offsetY;
            dx = startX - endX;
            dy = startY - endY;
            if (dy >= 0) {
                shouldDraw = false;
            } else if (mouseDown) {
                shouldDraw = true;
            }
        }

        let mouseupHandler = () => {
            shouldDraw = false;
            mouseDown = false;

            // Clear screen
            this.renderer.pen.clearRect(0, 0, 
                    Number.parseInt(gameCanvas.getAttribute('width')), 
                    Number.parseInt(gameCanvas.getAttribute('height')));
            this.renderer.render();

            // Calculate angle
            angle = Math.atan(-dy / dx);
            if (angle < 0) {
                angle += Math.PI;
            }
            console.log(`Angle: ${angle * (180 / Math.PI)}°`);

            if (dy <= 0) {
                gameCanvas.removeEventListener('mousedown', mousedownHandler);
                gameCanvas.removeEventListener('mousemove', mousemoveHandler);
                gameCanvas.removeEventListener('mouseup', mouseupHandler);
                clearInterval(timer);
                this.playRound(angle);
            }
        }

        gameCanvas.addEventListener('mousedown', mousedownHandler);

        gameCanvas.addEventListener('mousemove', mousemoveHandler);

        gameCanvas.addEventListener('mouseup', mouseupHandler);

        timer = setInterval(() => {
            this.renderer.pen.clearRect(0, 0, 
                    Number.parseInt(gameCanvas.getAttribute('width')), 
                    Number.parseInt(gameCanvas.getAttribute('height')));
            this.renderer.render();
            if (shouldDraw) {
                this.renderer.renderAimLines(dx, dy);
            }
        }, 1000 / fps);
    }

    tick() {
        if (!gameController.currentlyRunning) {
            clearInterval(gameController.timer);
            gameController.blockzGame.increaseBallCount(gameController.ballsCollected);
            gameController.blockzGame.advanceNextLevel();
            localStorage.currentGame = JSON.stringify(gameController.blockzGame);
            if (gameController.blockzGame.gameOver) {
                gameController.endGame();
            } else {
                gameController.setupRound();
            }
            return;
        }

        gameController.getCollisions();

        // Move balls if above gutter, update ball position
        // if in gutter and first ball to be in gutter

        // Clear screen
        gameController.renderer.pen.clearRect(0, 0, 
                Number.parseInt(gameCanvas.getAttribute('width')), 
                Number.parseInt(gameCanvas.getAttribute('height')));
        gameController.renderer.render();

        gameController.ticks++;
    }

    setupRound() {

        // Setup score
        this.score = this.blockzGame.score;
        if (localStorage.highScore === undefined) {
            localStorage.highScore = 0;
        }
        if (this.score > localStorage.highScore) {
            localStorage.highScore = this.score;
        }
        document.querySelector('#highscore').innerText = 
                localStorage.highScore;
        document.querySelector('#score').innerText = this.score;

        this.setScreenSize();
        this.initPlayers();
        this.renderer.render();
        this.getUserInput()   
    }

    playRound(angle) {
        this.currentlyRunning = true;
        this.ticks = 0;
        this.ballsCollected = 0;
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].setAngle(angle);
        }
        this.timer = setInterval(this.tick, 1000 / fps);
    }

    getCollisions() {

        // Change ball angless, block health, collected balls, etc.
        
    }

    endGame() {

        // Set current game to game over, etc.

    }
}

// Needs to be global so tick has access to it
var gameController;

main = () => {
    gameController = new GameController();
    gameController.setupRound();
}
