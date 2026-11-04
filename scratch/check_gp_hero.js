const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');

const idx = css.indexOf('.gp-hero-card');
if (idx !== -1) {
    console.log(css.substring(idx, idx + 800));
} else {
    console.log('.gp-hero-card Not found in academic-theme.css');
}

