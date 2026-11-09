const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (/Berpikir Komputasional pada Stack\/Queue|Queue/i.test(line)) {
    if (i < 1500) { // filter
      console.log(`${i+1}: ${line.trim()}`);
    }
  }
});
