const fs = require('fs');
if (fs.existsSync('backup-awal/index.html')) {
  const content = fs.readFileSync('backup-awal/index.html', 'utf8');
  const regex = /id="(screen-[^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    console.log(match[1]);
  }
}
