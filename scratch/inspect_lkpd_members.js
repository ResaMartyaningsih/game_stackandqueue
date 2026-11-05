const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== APP.JS GROUP MEMBERS LOGIC ===');
['addGroupMember', 'removeGroupMember', 'renderGroupMembers', 'groupMembers'].forEach(term => {
  let idx = 0;
  while ((idx = appJs.indexOf(term, idx)) !== -1) {
    console.log(`appJs match "${term}" at ${idx}:`, appJs.substring(idx, idx + 400).replace(/\n/g, ' '));
    idx += term.length;
    if (idx > appJs.length) break;
  }
});

console.log('\n=== LKPD MEMBERS HTML in index.html ===');
const mIdx = html.indexOf('id="group-members-container"');
if (mIdx !== -1) {
  console.log(html.substring(mIdx - 100, mIdx + 800));
} else {
  console.log('group-members-container not found, searching members');
  const m2 = html.indexOf('Anggota');
  console.log(html.substring(m2 - 50, m2 + 400));
}

