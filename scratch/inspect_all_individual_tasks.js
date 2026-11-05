const fs = require('fs');
const pblJs = fs.readFileSync('js/pbl-academic.js', 'utf8');

const start = pblJs.indexOf('individualTasks: [');
const end = pblJs.indexOf('currentTaskLevel: 1,', start);
console.log(pblJs.substring(start, end));

