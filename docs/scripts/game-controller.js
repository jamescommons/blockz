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
        this.blockGap = 3;

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
                (gameCanvas.getAttribute('width') - 6 * this.blockGap) / 7;
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
                    (j * this.squareWidth) + (j * this.blockGap),
                    (i * this.squareWidth) + (i * this.blockGap)
                );
            }
        }
    }

    // Returns the slope
    getUserInput() {

    }

    tick() {
        if (!this.currentlyRunning) {
            this.timer = clearInterval();
            this.blockzGame.increaseBallCount(this.ballsCollected);
            this.blockzGame.advanceNextLevel();
            localStorage.currentGame = JSON.stringify(this.blockzGame);
            if (this.blockzGame.gameOver) {
                this.endGame();
            } else {
                this.setupRound();
            }
            return;
        }

        this.getCollisions();

        // Move balls if above gutter, update ball position
        // in in gutter and first ball to be in gutter

        this.renderer.render();

        this.ticks++;
    }

    setupRound() {

        // Setup score
        this.score = this.blockzGame.score;
        if (this.score > localStorage.highScore) {
            localStorage.highScore = this.score;
        }
        document.querySelector('#highscore').innerText = 
                localStorage.highScore;
        document.querySelector('#score').innerText = this.score;

        this.setScreenSize();
        this.initPlayers();
        this.renderer.render();
        this.playRound(this.getUserInput());
    }

    playRound(slope) {
        this.currentlyRunning = true;
        this.ticks = 0;
        this.ballsCollected = 0;
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].setSlope(slope);
        }
        //this.timer = setInterval(this.tick, 1000 / fps);
    }

    getCollisions() {
        // Change ball slopes, block health, etc.
    }

    endGame() {
        // Set current game to game over, etc.
    }
}

main = () => {
    let gameController = new GameController();
    gameController.setupRound();
}
