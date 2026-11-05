const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const regex = /(saveGroupIdentity|saveGroupProject|downloadGroupWord|downloadGroupPDF)[\s\S]*?(?=\n\s*(?:[a-zA-Z0-9_]+\s*\(|window\.))/g;
let m;
while ((m = regex.exec(appJs)) !== null) {
    console.log(m[0].substring(0, 400));
    console.log('------------------------------------');
}

