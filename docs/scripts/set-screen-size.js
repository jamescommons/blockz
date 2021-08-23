let width = window.innerWidth;
let height = window.innerHeight;

let resize = () => {
    document.querySelector('#main-menu-content')
            .setAttribute('style', `width: ${width}px; height: ${height}px;`);
}

resize();

document.addEventListener('resize', resize);
