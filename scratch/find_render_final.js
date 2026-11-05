const fs = require('fs');
const uiJs = fs.readFileSync('js/ui.js', 'utf8');

const rfIdx = uiJs.indexOf('renderFinalResult(');
console.log('renderFinalResult found at:', rfIdx);
if (rfIdx !== -1) {
  console.log(uiJs.substring(rfIdx, rfIdx + 3000));
}

