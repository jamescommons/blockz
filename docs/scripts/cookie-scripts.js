cookies =  {
    setHighScore: highScore => {
        document.cookie = 
                `highScore=${highScore}; expires=Thu, 01 Jan 9999 12:00:00 UTC; path=/`;
    },
    // From w3 schools. I was too lazy to write this myself
    getCookie: cname => {
        let name = cname + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        console.log('no cookie');
        return '';
    },
    // soundOn boolean string
    setSoundPrefs: soundOn => {
        document.cookie = 
                `soundOn=${soundOn}; expires=Thu, 01 Jan 9999 12:00:00 UTC; path=/`;
    }
}
