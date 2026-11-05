const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('renderGroupCaseCards()');
if (idx !== -1) {
    console.log(appJs.substring(idx - 50, idx + 1200));
} else {
    console.log('renderGroupCaseCards() not found');
}

