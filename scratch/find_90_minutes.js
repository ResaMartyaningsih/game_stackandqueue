const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /90\s*menit/gi;
let m;
while ((m = regex.exec(html)) !== null) {
    const start = Math.max(0, m.index - 80);
    const end = Math.min(html.length, m.index + 80);
    console.log(`Match at ${m.index}:`);
    console.log(html.substring(start, end).replace(/\s+/g, ' '));
    console.log('---');
}

