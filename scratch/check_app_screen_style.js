const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');

const idx = css.indexOf('.app-screen');
console.log(css.substring(idx, idx + 400));

