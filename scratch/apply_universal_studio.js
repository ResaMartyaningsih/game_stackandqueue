const fs = require('fs');

const academicCss = fs.readFileSync('css/academic-theme.css', 'utf8');
const studioCss = fs.readFileSync('scratch/universal_studio.css', 'utf8');

// Check if studioCss is already appended
if (academicCss.includes('UNIVERSAL TWO26.STUDIO SCREEN DESIGN SYSTEM FOR ALL SCREENS')) {
    console.log('Already appended!');
} else {
    const updated = academicCss.trimEnd() + '\n\n' + studioCss + '\n';
    fs.writeFileSync('css/academic-theme.css', updated, 'utf8');
    console.log('Successfully appended studio design system to academic-theme.css');
    console.log('New lines count:', updated.split('\n').length);
}

