const fs = require('fs');
const styleCss = fs.readFileSync('css/style.css', 'utf8');

const regex = /(\.app-screen|\.academic-page-container|body\s*\{)[\s\S]*?\}/g;
let m;
while ((m = regex.exec(styleCss)) !== null) {
    console.log(m[0].substring(0, 180));
    console.log('---');
}

