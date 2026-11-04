const fs = require('fs');

['screen-stack-sim', 'screen-queue-sim', 'screen-games', 'screen-puzzle', 'screen-challenge', 'screen-achievements'].forEach(id => {
    let found = false;
    ['style.css', 'game.css', 'puzzle.css', 'challenge.css', 'learning.css'].forEach(f => {
        const c = fs.readFileSync('css/' + f, 'utf8');
        if (c.includes('#' + id)) {
            console.log(`Found #${id} in ${f}`);
            found = true;
        }
    });
    if (!found) console.log(`No specific rule for #${id}`);
});

