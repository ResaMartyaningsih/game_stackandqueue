const fs = require('fs');
const path = require('path');

const cssDir = 'css';
const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

const blueRegex = /#(0284c7|2563eb|3b82f6|4f46e5|0ea5e9|6366f1|1d4ed8|1e40af|38bdf8|0284c7|60a5fa|93c5fd)/gi;

files.forEach(f => {
    const content = fs.readFileSync(path.join(cssDir, f), 'utf8');
    const matches = content.match(blueRegex) || [];
    console.log(`${f}: ${matches.length} legacy blue occurrences`);
});

