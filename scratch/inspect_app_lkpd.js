const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

const sIdx = app.indexOf('initGroupProject()');
console.log('--- initGroupProject snippet ---');
console.log(app.substring(sIdx, sIdx + 1500));

