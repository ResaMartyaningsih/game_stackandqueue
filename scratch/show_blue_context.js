const fs = require('fs');

function showContext(file, lineNum) {
    const lines = fs.readFileSync('css/' + file, 'utf8').split('\n');
    console.log(`=== ${file} around line ${lineNum} ===`);
    console.log(lines.slice(Math.max(0, lineNum - 5), lineNum + 5).join('\n'));
}

showContext('game.css', 110);
showContext('game.css', 271);
showContext('learning.css', 799);
showContext('learning.css', 1109);
showContext('learning.css', 2103);
showContext('puzzle.css', 300);

