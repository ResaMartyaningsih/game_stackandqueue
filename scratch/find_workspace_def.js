const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const regex = /renderGroupCaseWorkspace\s*\([^)]*\)\s*\{/g;
let m;
while ((m = regex.exec(appJs)) !== null) {
    console.log('Found definition at index:', m.index);
    console.log(appJs.substring(m.index, m.index + 1500));
}

