const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('cases: {');
if (idx !== -1) {
    console.log(appJs.substring(idx, idx + 2000));
} else {
    console.log('cases: { not found');
}

