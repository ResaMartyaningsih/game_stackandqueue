const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('buildGroupLKPDHTML');
if (idx !== -1) {
    console.log(appJs.substring(idx, idx + 1800));
} else {
    console.log('buildGroupLKPDHTML not found');
}

