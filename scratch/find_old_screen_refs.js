const fs = require('fs');

const files = ['index.html', 'js/ui.js', 'js/app.js', 'js/levels.js', 'js/pbl-academic.js'];
const screenIds = ['screen-stack-sim', 'screen-queue-sim', 'screen-games', 'screen-puzzle', 'screen-challenge', 'stack-sim', 'queue-sim', 'games', 'puzzle', 'challenge'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  screenIds.forEach(id => {
    let count = 0;
    let pos = 0;
    while ((pos = content.indexOf(`'${id}'`, pos)) !== -1) {
      count++;
      pos += id.length + 2;
    }
    while ((pos = content.indexOf(`"${id}"`, pos)) !== -1) {
      count++;
      pos += id.length + 2;
    }
    if (count > 0) {
      console.log(`${file} contains "${id}": ${count} times`);
    }
  });
});

