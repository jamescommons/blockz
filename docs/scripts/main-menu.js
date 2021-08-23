/* Main menu scripting. Keeps track of user preferences,
 * high scores, and moves elements on resize.
 */

// Global variables
var highScore = 0;
var musicOn = true;

// Current game variables saved on the game script.
// The game script also manages the current game cookie.

/* Cookies: highScore, musicOn, currentGame (this cookie stores
 * the current score and game configuration, i.e. block layout, heath, 
 * and number of balls. If empty, it means the game has ended)
 */

// Cookie functions (global)
var saveHighScore = () => {
    document.cookie = 
            `highScore=${highScore}; expires=Thu, 01 Jan 9999 00:00:00 UTC; path=/;`
}

var getHighScore = () => {
    let cookieString = decodeURIComponent(document.cookie);
    let cookies = cookieString.split(';');
    for (let cookie of cookies) {
        let key = cookie.substring(0, cookie.indexOf('='));
        if (key === 'highScore') {
            let value = cookie.substring(cookie.indexOf('=') + 1);
            return Number.parseInt(value);
        }
    }
    return 0; // Return 0 if no cookie was saved
}

var toggleMusicPrefs = () => {
    musicOn = !musicOn;
    document.cookie = 
            `musicOn=${musicOn}; expires=Thu, 01 Jan 9999 00:00:00 UTC; path=/;`
}

var getMusicPrefs = () => {
    let cookieString = decodeURIComponent(document.cookie);
    let cookies = cookieString.split(';');
    for (let cookie of cookies) {
        let key = cookie.substring(0, cookie.indexOf('='));
        if (key === 'musicOn') {
            let value = cookie.substring(cookie.indexOf('=') + 1);
            return !(value === 'false');
        }
    }
    return true; // Return true if no cookie was saved
}

// Set global variables according to cookies
highScore = getHighScore();
musicOn = getMusicPrefs();

// Add resize event listeners that update button positions

// Add event listeners to main menu buttons


