const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const jsFiles = fs.readdirSync('js').filter(f => f.endsWith('.js'));
console.log(`Verifying ${jsFiles.length} JavaScript files in js/...`);

let allGood = true;
jsFiles.forEach(file => {
    const fullPath = path.join('js', file);
    try {
        execSync(`node -c "${fullPath}"`);
        console.log(`✓ ${file} is valid.`);
    } catch (err) {
        console.error(`✗ Syntax error in ${file}:`, err.message);
        allGood = false;
    }
});

if (allGood) {
    console.log('ALL JAVASCRIPT FILES VALID AND CLEAN!');
}

