const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('addGroupMember');
console.log('addGroupMember in index.html:', idx);
if (idx !== -1) {
  console.log(html.substring(idx - 100, idx + 200));
} else {
  console.log('Searching gp-identity-form-card in index.html:');
  const cardIdx = html.indexOf('id="gp-identity-form-card"');
  console.log(html.substring(cardIdx, cardIdx + 2000));
}

