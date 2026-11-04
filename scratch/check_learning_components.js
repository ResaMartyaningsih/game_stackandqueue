const fs = require('fs');
const css = fs.readFileSync('css/learning.css', 'utf8');

const regex = /(\.concept-overview-card|\.learn-tabs-bar|\.learn-tab-btn|\.theory-card)[\s\S]*?(?=\.[a-z]|\/\*|$)/g;
let m;
while ((m = regex.exec(css)) !== null) {
    console.log(m[0].substring(0, 180));
    console.log('---');
}

