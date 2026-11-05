const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="screen-group-project"');
const eIdx = html.indexOf('</section>', sIdx);
const content = html.substring(sIdx, eIdx);

// Look for cases grid and members container
console.log('--- Case Grid Snippet ---');
const caseIdx = content.indexOf('id="gp-cases-grid"');
console.log(content.substring(caseIdx - 100, caseIdx + 1200));

console.log('--- Members Container Snippet ---');
const memIdx = content.indexOf('id="gp-members-container"');
console.log(content.substring(memIdx - 100, memIdx + 1200));

