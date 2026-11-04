const fs = require('fs');
['puzzle.css', 'challenge.css', 'result.css'].forEach(f => {
    const css = fs.readFileSync('css/' + f, 'utf8');
    console.log(`=== ${f} (${css.split('\n').length} lines) ===`);
    console.log(css.split('\n').slice(0, 20).join('\n'));
});

