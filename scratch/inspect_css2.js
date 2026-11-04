const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');

const commentMatches = css.match(/\/\*[\s\S]*?\*\//g) || [];
commentMatches.slice(30).forEach((c, i) => {
    const firstLine = c.split('\n')[0].substring(0, 80);
    console.log(`${i+31}: ${firstLine}`);
});

