const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('learn-queue-meter indexOf:', html.indexOf('learn-queue-meter'));
console.log('Nilai Materi Belajar Queue indexOf:', html.indexOf('Nilai Materi Belajar Queue'));
console.log('Level 2 (Simulator Stack) indexOf:', html.indexOf('Level 2 (Simulator Stack)'));

