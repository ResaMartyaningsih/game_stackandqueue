const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');

const rootIdx = css.indexOf(':root');
console.log(css.substring(rootIdx, rootIdx + 1200));

