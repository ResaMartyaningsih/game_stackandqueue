const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /style=["'][^"']*#(0284c7|2563eb|3b82f6|4f46e5|0ea5e9|6366f1|1d4ed8|1e40af|38bdf8|60a5fa)[^"']*["']/gi;
const matches = html.match(regex) || [];
console.log('Matches with inline blue colors in index.html:', matches.length);
matches.forEach(m => console.log(m));

