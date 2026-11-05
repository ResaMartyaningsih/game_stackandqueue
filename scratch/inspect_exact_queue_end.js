const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const qIdx = html.indexOf('Nilai Materi Belajar Queue');
const start = html.lastIndexOf('<!-- Bottom Persistence & Next Level Bar -->', qIdx);
const end = html.indexOf('id="screen-achievements"');

console.log('Snippet from Queue Bottom Bar to Achievements:');
console.log(html.substring(start, start + 800));

console.log('\n--- End of Screen Learn Queue ---');
console.log(html.substring(start + 700, start + 1200));

