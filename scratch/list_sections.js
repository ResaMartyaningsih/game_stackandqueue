const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /<section\s+id=["']([^"']+)["'][^>]*>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    console.log(match[1]);
}

