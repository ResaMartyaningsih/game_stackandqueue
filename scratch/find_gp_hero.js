const fs = require('fs');
const path = require('path');
fs.readdirSync('css').filter(f => f.endsWith('.css')).forEach(f => {
    const content = fs.readFileSync(path.join('css', f), 'utf8');
    if (content.includes('.gp-hero-card')) {
        console.log(`Found in ${f}`);
    }
});

