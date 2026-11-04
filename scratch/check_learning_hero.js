const fs = require('fs');
const css = fs.readFileSync('css/learning.css', 'utf8');
const idx = css.indexOf('.gp-hero-card');
console.log(css.substring(idx, idx + 800));

