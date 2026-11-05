const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('renderGroupCaseWorkspace()');
if (idx !== -1) {
    console.log(appJs.substring(idx - 50, idx + 1800));
} else {
    console.log('renderGroupCaseWorkspace() not found');
}

