const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const qIdx = html.indexOf('learn-queue-meter');
console.log('learn-queue-meter context:');
console.log(html.substring(qIdx - 150, qIdx + 350));

