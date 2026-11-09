const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (/<button[^>]*style="[^"]*width:\s*100%[^"]*"[^>]*>/i.test(l)) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
