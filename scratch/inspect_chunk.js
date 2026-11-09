const fs = require('fs');
const lines = fs.readFileSync('css/responsive.css', 'utf8').split('\n');

function printChunk(start, end) {
  console.log(`=== LINES ${start} - ${end} ===`);
  console.log(lines.slice(start - 1, end).join('\n'));
}

printChunk(50, 150);
