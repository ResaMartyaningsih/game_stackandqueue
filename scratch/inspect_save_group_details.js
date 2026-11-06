const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

console.log(app.substring(111000, 115000));

