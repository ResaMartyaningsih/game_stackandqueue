const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const regex = /case[34]/g;
let m;
const matches = [];
while ((m = regex.exec(appJs)) !== null) {
    matches.push({ index: m.index, snippet: appJs.substring(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' ') });
}
console.log('Total case3 / case4 references in app.js:', matches.length);
matches.forEach(m => console.log(m.snippet));

