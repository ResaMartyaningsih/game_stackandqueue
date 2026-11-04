const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');

// Strip comments and strings
let inComment = false;
let openBraces = 0;
let closeBraces = 0;

for (let i = 0; i < css.length; i++) {
    if (!inComment && css[i] === '/' && css[i+1] === '*') {
        inComment = true;
        i++;
    } else if (inComment && css[i] === '*' && css[i+1] === '/') {
        inComment = false;
        i++;
    } else if (!inComment) {
        if (css[i] === '{') openBraces++;
        if (css[i] === '}') closeBraces++;
    }
}

console.log(`Open braces: ${openBraces}, Close braces: ${closeBraces}`);
if (openBraces === closeBraces) {
    console.log('CSS braces are 100% BALANCED!');
} else {
    console.error(`CSS BRACE MISMATCH: ${openBraces - closeBraces}`);
}

