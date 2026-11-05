const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');

console.log('=== SEARCHING MINI-LAB IN INDEX.HTML ===');
let idx = 0;
while ((idx = html.indexOf('Mini-Lab', idx)) !== -1) {
  console.log(`html Mini-Lab at ${idx}:`, html.substring(Math.max(0, idx - 50), Math.min(html.length, idx + 150)).replace(/\n/g, ' '));
  idx += 8;
}

console.log('\n=== SEARCHING INTERACTIVE DEMO / SIMULASI IN LEARN-STACK / LEARN-QUEUE ===');
['push(', 'pop(', 'enqueue(', 'dequeue(', 'stack-visual', 'queue-visual'].forEach(term => {
  let p = 0;
  while ((p = html.indexOf(term, p)) !== -1) {
    if (p > 130000 && p < 210000) {
      console.log(`html match "${term}" at ${p}:`, html.substring(Math.max(0, p - 30), Math.min(html.length, p + 100)).replace(/\n/g, ' '));
    }
    p += term.length;
    if (p > html.length) break;
  }
});

