const fs = require('fs');

['academic-theme.css', 'learning.css'].forEach(f => {
    const c = fs.readFileSync('css/' + f, 'utf8');
    const idx = c.indexOf('.gp-case-card');
    if (idx !== -1) {
        console.log(`=== In ${f} ===`);
        console.log(c.substring(idx, idx + 400));
    }
});

