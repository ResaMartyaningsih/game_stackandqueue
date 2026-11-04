const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');

const regex = /body\s*\{[\s\S]*?\}/g;
let m;
while ((m = regex.exec(css)) !== null) {
    console.log(m[0]);
    console.log('---');
}

