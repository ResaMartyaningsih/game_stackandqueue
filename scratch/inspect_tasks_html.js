const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tStart = html.indexOf('id="screen-individual-tasks"');
console.log('--- Screen Individual Tasks Header ---');
console.log(html.substring(tStart, tStart + 2500));

const gpStart = html.indexOf('id="screen-group-project"');
console.log('\n--- Screen Group Project Header ---');
console.log(html.substring(gpStart, gpStart + 2500));

