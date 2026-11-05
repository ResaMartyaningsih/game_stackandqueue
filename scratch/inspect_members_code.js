const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

console.log(appJs.substring(58900, 62000));

