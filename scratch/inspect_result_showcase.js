const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const rIdx = html.indexOf('id="result-final-score"');
console.log(html.substring(rIdx - 300, rIdx + 400));

