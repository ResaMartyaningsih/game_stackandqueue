const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function inspectSection(id) {
    const idx = html.indexOf(`id="${id}"`);
    if (idx === -1) return `NOT FOUND: ${id}`;
    const nextIdx = html.indexOf('<section', idx + 1);
    const content = html.substring(idx, nextIdx !== -1 ? nextIdx : idx + 3000);
    // Find classes used inside
    const classMatches = content.match(/class=["']([^"']+)["']/g) || [];
    const uniqueClasses = new Set();
    classMatches.forEach(m => {
        const val = m.replace(/class=["']|["']/g, '');
        val.split(/\s+/).forEach(c => uniqueClasses.add(c));
    });
    return {
        id,
        first5Lines: content.split('\n').slice(0, 8).join('\n'),
        uniqueClasses: Array.from(uniqueClasses).slice(0, 15)
    };
}

const list = [
    'screen-individual-tasks',
    'screen-evaluation',
    'screen-enrichment',
    'screen-reflection',
    'screen-guidelines',
    'screen-group-project',
    'screen-learn-intro',
    'screen-learn-stack',
    'screen-learn-queue',
    'screen-stack-sim',
    'screen-queue-sim',
    'screen-games',
    'screen-puzzle',
    'screen-challenge',
    'screen-achievements',
    'screen-result'
];

list.forEach(id => {
    const res = inspectSection(id);
    console.log(`=== ${res.id} ===`);
    console.log(res.first5Lines);
    console.log('Classes:', res.uniqueClasses.join(', '));
    console.log('-----------------------------');
});

