const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

const s = app.indexOf('calculateGroupRubricScore(');
console.log(app.substring(s, s + 3500));

