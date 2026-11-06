const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const modalMatches = html.match(/<div[^>]*class="[^"]*modal[^"]*"[^>]*>/g);
console.log('Modals found in index.html:', modalMatches);

// search for name-prompt-modal
const nameModalIdx = html.indexOf('id="name-prompt-modal"');
if (nameModalIdx !== -1) {
  console.log('\n--- Name prompt modal structure ---');
  console.log(html.substring(nameModalIdx - 50, nameModalIdx + 600));
}

