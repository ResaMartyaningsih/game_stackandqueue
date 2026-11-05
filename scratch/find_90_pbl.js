const fs = require('fs');
const code = fs.readFileSync('js/pbl-academic.js', 'utf8');

const regex = /90\s*menit/gi;
let m;
while ((m = regex.exec(code)) !== null) {
    const start = Math.max(0, m.index - 60);
    const end = Math.min(code.length, m.index + 60);
    console.log(`Match at ${m.index}:`);
    console.log(code.substring(start, end).replace(/\s+/g, ' '));
    console.log('---');
}

