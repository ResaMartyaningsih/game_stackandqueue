const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const formNew = fs.readFileSync('scratch/eval_form_new.html', 'utf8');

const sIdx = html.indexOf('<form id="evaluation-form"');
const eIdx = html.indexOf('</form>', sIdx) + 7;

if (sIdx === -1 || eIdx === -1) {
    console.error('Could not find form in index.html');
    process.exit(1);
}

const updatedHtml = html.substring(0, sIdx) + formNew + html.substring(eIdx);
fs.writeFileSync('index.html', updatedHtml, 'utf8');
console.log('Successfully replaced evaluation form in index.html');

