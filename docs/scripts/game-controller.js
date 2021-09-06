/* The game controller is responsible for the game clock,
 * loading previous games from localStorage, saving 
 * high scores, collision detection, and managing objects. 
 * The game controller is also responsible for getting 
 * user input before clock starts. Finally, game controller 
 * retrieves current score and high scores from blockz game 
 * and local storage respectively and displays these values 
 * on the header. */

// Global variables
var fps = 60;
var physicsIters = 3;
var ballSpeed = 800 / fps / physicsIters;
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

        // Set to true when first ball is done moving
        this.firstBallDone = false;

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
        gameCanvas.setAttribute('height', `${window.innerHeight - 50}`);
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

        // Load balls
        this.balls = [];
        for (let i = 0; i < this.blockzGame.numBalls; i++) {
            this.balls.push(new Ball());
        }

        // Set size and position attributes
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].setPos(this.ballPos, this.gameHeight);
            this.balls[i].yDirection = 1;
            this.balls[i].xDirection = 1;
        }

        // Load squares
        this.squares = [];
        for (let i = 0; i < 9; i++) {
            let squareRow = [];
            for (let j = 0; j < 7; j++) {
                squareRow.push(new Square(this.blockzGame.grid[i][j]));
            }
            this.squares.push(squareRow);
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

        // Move down animation
        this.renderer.moveGridDown();
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
                gameCanvas.removeEventListener('touchstart', touchstartHandler);
                gameCanvas.removeEventListener('touchmove', touchmoveHandler);
                gameCanvas.removeEventListener('touchend', touchendHandler);
                clearInterval(timer);
                this.playRound(angle);
            }
        }

        let touchstartHandler = e => {
            e.preventDefault();
            let touches = e.touches;
            startX = touches[0].clientX;
            startY = touches[0].clientY;
            shouldDraw = true;
            mouseDown = true;
        }

        let touchmoveHandler = e => {
            e.preventDefault();
            let touches = e.touches;
            endX = touches[0].clientX;
            endY = touches[0].clientY;
            dx = startX - endX;
            dy = startY - endY;
            if (dy >= 0) {
                shouldDraw = false;
            } else if (mouseDown) {
                shouldDraw = true;
            }
        }

        let touchendHandler = e => {
            e.preventDefault();
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
                gameCanvas.removeEventListener('touchstart', touchstartHandler);
                gameCanvas.removeEventListener('touchmove', touchmoveHandler);
                gameCanvas.removeEventListener('touchend', touchendHandler);
                clearInterval(timer);
                this.playRound(angle);
            }
        }

        gameCanvas.addEventListener('mousedown', mousedownHandler);
        gameCanvas.addEventListener('mousemove', mousemoveHandler);
        gameCanvas.addEventListener('mouseup', mouseupHandler);
        gameCanvas.addEventListener('touchstart', touchstartHandler);
        gameCanvas.addEventListener('touchmove', touchmoveHandler);
        gameCanvas.addEventListener('touchend', touchendHandler);

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
            localStorage.lastScore = gameController.score;
            gameController.blockzGame.increaseBallCount(gameController.ballsCollected);
            gameController.blockzGame.advanceNextLevel();
            localStorage.currentGame = JSON.stringify(gameController.blockzGame);
            this.blockzGame = new BlockzGame(localStorage.currentGame);
            if (gameController.blockzGame.gameOver) {
                gameController.endGame();
            } else {
                gameController.setupRound();
            }
            return;
        }

        // Draw numBalls
        let numBalls = gameController.balls.length;
        if (gameController.ticks / 10 < numBalls && gameController.ticks % 10 === 0) {
                gameController.renderer.numBallsLeft--;
        }

        for (let i = 0; i < physicsIters; i++) {
            gameController.getCollisions();

            // Move balls if above gutter, update ball position
            // if in gutter and first ball to be in gutter
            numBalls = gameController.balls.length;
            if (gameController.ticks / 10 < numBalls && gameController.ticks % 10 === 0) {
                gameController.balls[gameController.ticks / 10].hasStartedMoving = true;
                gameController.balls[gameController.ticks / 10].isDone = false;
            }

            for (let i = 0; i < numBalls; i++) {
                if (!gameController.balls[i].isDone && 
                        gameController.balls[i].hasStartedMoving) {
                    gameController.balls[i].move();
                } else if (!gameController.firstBallDone && 
                        gameController.balls[i].hasStartedMoving) {
                    gameController.blockzGame.position = (gameController.balls[i].xPos / 
                            Number.parseInt(gameCanvas.getAttribute('width')) * 100);
                    gameController.firstBallDone = true;
                } else if (gameController.balls[i].hasStartedMoving) {
                    gameController.ballPos = (gameController.blockzGame.position / 100) * 
                            gameCanvas.getAttribute('width');
                    gameController.balls[i].setPos(gameController.ballPos, 
                            gameController.gameHeight);
                }
            }
        }

        // Clear screen
        gameController.renderer.pen.clearRect(0, 0, 
                Number.parseInt(gameCanvas.getAttribute('width')), 
                Number.parseInt(gameCanvas.getAttribute('height')));
        gameController.renderer.render();

        // Check to see if all balls are done
        for (let ball of gameController.balls) {
            gameController.currentlyRunning = false;
            if (!ball.isDone) {
                gameController.currentlyRunning = true;
                break;
            }
        }

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
        this.renderer.numBallsLeft = this.balls.length;
        this.renderer.render();
        this.getUserInput();
    }

    playRound(angle) {
        this.currentlyRunning = true;
        this.ticks = 0;
        this.ballsCollected = 0;
        this.firstBallDone = false;
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].setAngle(angle);
        }
        this.timer = setInterval(this.tick, 1000 / fps);
    }

    getCollisions() {

        // Change ball angles, block health, collected balls, etc.
        for (let ball of this.balls) {

            // Check collision with edges of screen
            if (ball.hasStartedMoving) {
                if (ball.yPos <= 7) {
                    ball.yDirection *= -1;
                }
                if (ball.xPos <= 7 || ball.xPos >= 
                        Number.parseInt(gameCanvas.getAttribute('width')) - 7) {
                    ball.xDirection *= -1;
                }
                if (ball.yPos >= gameController.gameHeight + 1) {
                    ball.isDone = true;
                }
            }

            // Check for collision with extra balls and squares
            for (let i = 0; i < this.squares.length; i++) {
                for (let j = 0; j < this.squares[i].length; j++) {
                    let square = this.squares[i][j];

                    // Check for collision with extra ball
                    if (square.isExtraBall) {
                        if (ball.xPos > square.xPos 
                                && ball.xPos < square.xPos + square.width) {
                            if (ball.yPos > square.yPos && 
                                    ball.yPos < square.yPos + square.width) {
                                square.health = 0;
                                this.ballsCollected++;
                                this.blockzGame.grid[i][j] = 0;
                                square.isExtraBall = false;
                            }
                        }
                    }

                    // Check for collision with square
                    if (square.health > 0) {
                        
                        // Top side
                        if (ball.xPos > square.xPos - 7 && 
                                ball.xPos < square.xPos + square.width + 7) {
                            if (ball.yPos > square.yPos - 7 && 
                                    ball.yPos < square.yPos + 5) {
                                square.health--;
                                this.blockzGame.grid[i][j]--;
                                ball.yDirection *= -1;
                                break;
                            }
                        }

                        // Bottom side 
                        if (ball.xPos > square.xPos - 7 && 
                                ball.xPos < square.xPos + square.width + 7) {
                            if (ball.yPos < square.yPos + square.width + 7 && 
                                    ball.yPos > square.yPos + square.width - 5) {
                                square.health--;
                                this.blockzGame.grid[i][j]--;
                                ball.yDirection *= -1;
                                break;
                            }
                        }

                        // Left side
                        if (ball.yPos > square.yPos - 7 && 
                                ball.yPos < square.yPos + square.width + 7) {
                            if (ball.xPos > square.xPos - 7 && 
                                    ball.xPos < square.xPos + 5) {
                                square.health--;
                                this.blockzGame.grid[i][j]--;
                                ball.xDirection *= -1;
                                break;
                            }
                        }

                        // Right side
                        if (ball.yPos > square.yPos - 7 && 
                                ball.yPos < square.yPos + square.width + 7) {
                            if (ball.xPos < square.xPos + square.width + 7 && 
                                    ball.xPos > square.xPos + square.width - 5) {
                                square.health--;
                                this.blockzGame.grid[i][j]--;
                                ball.xDirection *= -1;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    endGame() {

        // Set current game to game over, etc.
        document.location.href = './restart.html';
    }
}

// Needs to be global so tick has access to it
var gameController;

main = () => {
    gameController = new GameController();
    gameController.setupRound();
}
