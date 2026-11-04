const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');

const regex = /\.academic-card\.highlight-[\s\S]*?(?=\.academic-card|\/\*|$)/g;
const matches = css.match(regex) || [];
console.log('Highlight matches found:', matches.length);
matches.forEach(m => console.log(m.substring(0, 150) + '\n---'));

