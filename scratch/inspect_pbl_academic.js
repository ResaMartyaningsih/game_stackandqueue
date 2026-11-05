const fs = require('fs');
const code = fs.readFileSync('js/pbl-academic.js', 'utf8');

const lines = code.split('\n');
lines.forEach((l, i) => {
    if (l.includes('const ') || l.includes('function ') || l.includes('PBLAcademic =') || l.includes('Evaluation') || l.includes('evalQuestion')) {
        console.log(`${i+1}: ${l.trim().substring(0, 90)}`);
    }
});

