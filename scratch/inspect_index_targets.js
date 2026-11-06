const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('1. Task level selector in index.html:');
const tlsIdx = html.indexOf('class="task-level-selector"');
console.log(html.substring(tlsIdx, tlsIdx + 1200));

console.log('\n2. Group project hero card in index.html:');
const gpHero = html.indexOf('class="gp-hero-card"');
console.log(html.substring(gpHero + 1000, gpHero + 1800));

console.log('\n3. End of index.html before </body>:');
const bodyEnd = html.lastIndexOf('</body>');
console.log(html.substring(bodyEnd - 800, bodyEnd));

