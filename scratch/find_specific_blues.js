const fs = require('fs');
['game.css', 'learning.css', 'puzzle.css'].forEach(file => {
    const lines = fs.readFileSync('css/' + file, 'utf8').split('\n');
    lines.forEach((line, i) => {
        if (/#(0284c7|2563eb|3b82f6|4f46e5|0ea5e9|6366f1|1d4ed8|1e40af|38bdf8|60a5fa)/i.test(line)) {
            console.log(`${file}:${i+1}: ${line.trim()}`);
        }
    });
});

