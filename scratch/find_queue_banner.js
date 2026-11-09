const fs = require('fs');

const files = ['index.html', 'js/app.js', 'js/ui.js', 'js/learning.js', 'js/levels.js'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (/Nilai Materi Belajar|Simulator Stack|membuka level|Simpan Nilai Materi/i.test(line)) {
        console.log(f + ':' + (i + 1) + ': ' + line.trim());
      }
    });
  }
});
