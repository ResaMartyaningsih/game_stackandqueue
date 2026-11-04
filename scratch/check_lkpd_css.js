const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');

const idx = css.indexOf('/* 7. Comprehensive LKPD');
if (idx !== -1) {
    console.log(css.substring(idx, idx + 1500));
} else {
    console.log('Not found');
}

