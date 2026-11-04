const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');

const commentMatches = css.match(/\/\*[\s\S]*?\*\//g) || [];
console.log('Total comments found:', commentMatches.length);
commentMatches.slice(0, 30).forEach((c, i) => {
    const firstLine = c.split('\n')[0].substring(0, 80);
    console.log(`${i+1}: ${firstLine}`);
});

