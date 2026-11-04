const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const screenStarts = [];
lines.forEach((l, i) => {
    if (l.includes('<section') && l.includes('id="screen-')) {
        screenStarts.push({ line: i+1, text: l.trim() });
    }
});

screenStarts.forEach((s, idx) => {
    console.log('=== ' + s.text + ' (Line ' + s.line + ') ===');
    const nextLine = screenStarts[idx+1] ? screenStarts[idx+1].line : s.line + 40;
    const preview = lines.slice(s.line - 1, Math.min(s.line + 15, nextLine)).join('\n');
    console.log(preview);
    console.log('\n');
});

