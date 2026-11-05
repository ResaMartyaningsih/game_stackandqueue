const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="screen-stack-sim"');
console.log('--- screen-stack-sim header & controls ---');
console.log(html.substring(sIdx, sIdx + 1500));

const qIdx = html.indexOf('id="screen-queue-sim"');
console.log('--- screen-queue-sim header & controls ---');
console.log(html.substring(qIdx, qIdx + 1500));

