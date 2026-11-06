const fs = require('fs');
const ui = fs.readFileSync('js/ui.js', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');

const sIdx = app.indexOf('showNamePromptModal');
console.log('showNamePromptModal in app.js:');
console.log(app.substring(sIdx, sIdx + 400));

const rIdx = ui.indexOf('openReviewAnswersModal');
console.log('\nopenReviewAnswersModal in ui.js:');
console.log(ui.substring(rIdx, rIdx + 400));

