let width = window.innerWidth;
let height = window.innerHeight;

let resize = () => {
    document.querySelector('#main-menu-content')
            .setAttribute('style', `width: ${width}px; height: ${height}px;`);
    width = window.innerWidth;
    height = window.innerHeight;
}

resize();

window.addEventListener('resize', resize);
