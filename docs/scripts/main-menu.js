
// Get sound cookie
let soundOn = cookies.getCookie('soundOn');
console.log(soundOn);
if (soundOn === 'false') {
    document.querySelector('#sound-on-off-btn')
            .setAttribute('src', 'assets/imgs/sound-off.png');
} else {
    document.querySelector('#sound-on-off-btn')
            .setAttribute('src', 'assets/imgs/sound-on.png');
}

// Add button event listeners
document.querySelector('#sound-on-off-btn').addEventListener('click', () => {
    if (soundOn === 'false') {
        cookies.setSoundPrefs('true');
        document.querySelector('#sound-on-off-btn')
            .setAttribute('src', 'assets/imgs/sound-on.png');
        soundOn = 'true';
    } else {
        cookies.setSoundPrefs('false');
        document.querySelector('#sound-on-off-btn')
            .setAttribute('src', 'assets/imgs/sound-off.png');
        soundOn = 'false';
    }
});
