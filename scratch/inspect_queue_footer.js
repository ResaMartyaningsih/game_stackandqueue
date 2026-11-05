const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const bannerIdx = html.indexOf('Level 2 (Simulator Stack)');
console.log('--- Context around Level 2 (Simulator Stack) ---');
console.log(html.substring(bannerIdx - 500, bannerIdx + 500));

const simStart = html.indexOf('id="screen-stack-sim"');
const simEnd = html.indexOf('id="screen-achievements"');
console.log('\n--- simStart to simEnd indexes ---');
console.log('simStart:', simStart, 'simEnd:', simEnd, 'Length:', simEnd - simStart);

console.log('\n--- First 300 chars of simStart ---');
console.log(html.substring(simStart - 100, simStart + 300));

console.log('\n--- 300 chars before simEnd ---');
console.log(html.substring(simEnd - 300, simEnd + 100));

