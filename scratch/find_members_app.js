const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('renderGroupMembers');
if (idx !== -1) {
    console.log(appJs.substring(idx - 100, idx + 1500));
} else {
    console.log('renderGroupMembers not found');
}

