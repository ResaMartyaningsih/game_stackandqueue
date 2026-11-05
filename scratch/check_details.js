const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

console.log('=== FINDING SCREENS IN INDEX.HTML ===');
const screenRegex = /<section[^>]+id="screen-[^"]+"/g;
let match;
while ((match = screenRegex.exec(html)) !== null) {
  console.log(match[0], 'at index', match.index);
}

console.log('\n=== CHECKING TEXT MATCHES ===');
const terms = [
  'Level 2 (Simulator Stack)',
  'screen-stack-sim',
  'screen-queue-sim',
  'screen-games',
  'screen-puzzle',
  'screen-challenge',
  '4 Level Analisis Berjenjang',
  '90 Menit',
  '15 Menit',
  'salah satu dari 4 studi kasus',
  'satu studi kasus yang tersedia',
  'Tantangan Individu',
  'Tumpukan Piring',
  'Tracing',
  'Underflow',
  'Overflow'
];

terms.forEach(t => {
  let count = 0;
  let pos = 0;
  while ((pos = html.indexOf(t, pos)) !== -1) {
    count++;
    pos += t.length;
  }
  console.log(`"${t}": ${count} occurrences`);
});

