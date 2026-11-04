const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const screens = [
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

screens.forEach(id => {
    const startIdx = html.indexOf(`id="${id}"`);
    if (startIdx === -1) {
        console.log(`Screen ${id} NOT FOUND!`);
        return;
    }
    const snippet = html.substring(startIdx, startIdx + 400);
    const headerMatch = snippet.match(/<(h[1-4]|div)[^>]*class=["']([^"']+)["'][^>]*>([^<]+)/i);
    console.log(`=== ${id} ===`);
    console.log(snippet.split('\n').slice(0, 5).join('\n'));
});

