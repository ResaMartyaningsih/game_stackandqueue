const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('renderGroupMembersList()');
if (idx !== -1) {
    console.log(appJs.substring(idx - 50, idx + 1500));
} else {
    console.log('renderGroupMembersList() not found');
}

